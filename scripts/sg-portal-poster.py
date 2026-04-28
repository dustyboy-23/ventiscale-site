#!/usr/bin/env python3
"""
Approval-gated Facebook poster for Sprinkler Guard.

Reads content_items from the Venti Scale portal. For each row that is:
  status='approved' AND platform='facebook' AND scheduled_at <= now()
download its Drive image, post to the SG Facebook page (caption + each
first-comment), then update the row to status='published' with
external_id=<fb_post_id>.

Idempotent: never re-posts a row that's already 'published'. Skips
stale posts (more than 24h past scheduled_at) and prints a warning.

Usage:
    python scripts/sg-portal-poster.py
    python scripts/sg-portal-poster.py --dry-run
    python scripts/sg-portal-poster.py --max 1   # cap how many post per run

Designed to run on cron a few times a day around the AM/PM slots:
    0 9,15 * * * /usr/bin/python3 scripts/sg-portal-poster.py

Requires:
    SG_PAGE_ID + SG_PAGE_TOKEN in /home/dustin/sprinkler-guard/.env
    NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in portal .env.local
    /home/dustin/.local/bin/gog authed for Drive
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"
SG_CLIENT_SLUG = "sprinkler-guard"
SG_ENV_PATH = Path("/home/dustin/sprinkler-guard/.env")
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"

GRAPH_VERSION = "v21.0"
STALE_AFTER_HOURS = 24
MAX_RETRIES = 3


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def supabase_request(
    method: str,
    path: str,
    *,
    base_url: str,
    service_key: str,
    headers: Optional[dict] = None,
    body: Optional[dict] = None,
) -> object:
    url = f"{base_url}{path}"
    h = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            raw = response.read()
            if not raw:
                return {}
            return json.loads(raw)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode()[:500] if exc.fp else ""
        raise SystemExit(f"HTTP {exc.code} on {method} {path}: {detail}")


def find_client_by_slug(slug: str, *, base_url: str, service_key: str) -> Optional[dict]:
    path = f"/rest/v1/clients?slug=eq.{urllib.parse.quote(slug)}&select=id,slug,name"
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data[0] if isinstance(data, list) and data else None


def list_due_approved(client_id: str, *, base_url: str, service_key: str) -> list:
    """Approved Facebook posts whose scheduled_at is now or earlier."""
    now_iso = datetime.now(timezone.utc).isoformat()
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&status=eq.approved&platform=eq.facebook"
        f"&scheduled_at=lte.{urllib.parse.quote(now_iso)}"
        "&select=id,title,body,comments,drive_file_id,scheduled_at"
        "&order=scheduled_at.asc"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data if isinstance(data, list) else []


def is_stale(scheduled_at_iso: str) -> bool:
    try:
        sched = datetime.fromisoformat(scheduled_at_iso.replace("Z", "+00:00"))
    except ValueError:
        return False
    return datetime.now(timezone.utc) - sched > timedelta(hours=STALE_AFTER_HOURS)


def download_drive_file(drive_file_id: str, dest: Path, gog_path: str) -> bool:
    cmd = [gog_path, "drive", "download", drive_file_id, "--out", str(dest)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        # Some gog builds use --output, try that on failure
        cmd2 = [gog_path, "drive", "download", drive_file_id, "--output", str(dest)]
        result = subprocess.run(cmd2, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ERROR: gog drive download failed: {result.stderr.strip()[:200]}", file=sys.stderr)
        return False
    return dest.exists() and dest.stat().st_size > 0


def fb_upload_photo(
    img_path: Path, caption: str, *, page_id: str, page_token: str
) -> Optional[str]:
    """Posts a photo + caption to the FB page. Returns the post_id."""
    img_data = img_path.read_bytes()
    boundary = uuid.uuid4().hex
    body = b""
    body += f"--{boundary}\r\n".encode()
    body += b'Content-Disposition: form-data; name="message"\r\n\r\n'
    body += caption.encode() + b"\r\n"
    body += f"--{boundary}\r\n".encode()
    body += b'Content-Disposition: form-data; name="access_token"\r\n\r\n'
    body += page_token.encode() + b"\r\n"
    body += f"--{boundary}\r\n".encode()
    body += b'Content-Disposition: form-data; name="source"; filename="post.png"\r\n'
    body += b"Content-Type: image/png\r\n\r\n"
    body += img_data + b"\r\n"
    body += f"--{boundary}--\r\n".encode()

    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{page_id}/photos"
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Content-Length": str(len(body)),
        },
        method="POST",
    )

    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                payload = json.loads(resp.read())
                pid = payload.get("post_id") or payload.get("id")
                if pid:
                    return pid
                print(f"  [attempt {attempt + 1}] no post_id in response: {payload}", file=sys.stderr)
        except urllib.error.HTTPError as exc:
            print(f"  [attempt {attempt + 1}] FB upload {exc.code}: {exc.read().decode()[:300]}", file=sys.stderr)
        except Exception as exc:
            print(f"  [attempt {attempt + 1}] FB upload error: {exc}", file=sys.stderr)
        if attempt < MAX_RETRIES - 1:
            time.sleep(5)
    return None


def fb_post_comment(post_id: str, message: str, page_token: str) -> Optional[str]:
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{post_id}/comments"
    data = urllib.parse.urlencode({"message": message, "access_token": page_token}).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read())
            return payload.get("id")
    except urllib.error.HTTPError as exc:
        print(f"  comment failed {exc.code}: {exc.read().decode()[:200]}", file=sys.stderr)
    except Exception as exc:
        print(f"  comment error: {exc}", file=sys.stderr)
    return None


def mark_published(
    row_id: str,
    fb_post_id: str,
    *,
    base_url: str,
    service_key: str,
) -> None:
    supabase_request(
        "PATCH",
        f"/rest/v1/content_items?id=eq.{row_id}",
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=minimal"},
        body={
            "status": "published",
            "published_at": datetime.now(timezone.utc).isoformat(),
            "external_id": fb_post_id,
        },
    )


def log_activity(
    *,
    client_id: str,
    title: str,
    detail: dict,
    base_url: str,
    service_key: str,
) -> None:
    try:
        supabase_request(
            "POST",
            "/rest/v1/activity_log",
            base_url=base_url,
            service_key=service_key,
            headers={"Prefer": "return=minimal"},
            body={
                "client_id": client_id,
                "type": "post",
                "title": title[:200],
                "detail": json.dumps(detail),
            },
        )
    except SystemExit:
        # activity_log is best-effort. Never block the main flow.
        pass


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--dry-run", action="store_true", help="Plan only, don't post")
    parser.add_argument("--max", type=int, default=4, help="Max posts per run (default: 4)")
    parser.add_argument("--gog", default=GOG_DEFAULT)
    args = parser.parse_args()

    gog_path = args.gog if Path(args.gog).exists() else (shutil.which("gog") or args.gog)

    load_env_file(SG_ENV_PATH)
    load_env_file(PORTAL_ENV_PATH)
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    page_token = os.environ.get("SG_PAGE_TOKEN")
    page_id = os.environ.get("SG_PAGE_ID")
    if not (base_url and service_key and page_token and page_id):
        print("ERROR: missing env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SG_PAGE_ID, SG_PAGE_TOKEN)")
        return 1

    client = find_client_by_slug(SG_CLIENT_SLUG, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{SG_CLIENT_SLUG}'")
        return 1

    due = list_due_approved(client["id"], base_url=base_url, service_key=service_key)
    if not due:
        print("No approved+due Facebook posts. Nothing to publish.")
        return 0

    print(f"Found {len(due)} approved+due post(s).")
    posted = 0
    skipped_stale = 0
    failed = 0

    for row in due:
        if posted >= args.max:
            print(f"Hit --max={args.max}, stopping.")
            break
        title = (row.get("title") or "")[:60]
        if is_stale(row["scheduled_at"]):
            print(f"  [stale] {title}  scheduled_at={row['scheduled_at']}, skipping (>{STALE_AFTER_HOURS}h old).")
            skipped_stale += 1
            continue
        if not row.get("drive_file_id"):
            print(f"  [skip] {title}  no drive_file_id.")
            failed += 1
            continue

        print(f"  -> {title}  scheduled_at={row['scheduled_at']}")

        if args.dry_run:
            print("     (dry run, would download + post)")
            posted += 1
            continue

        with tempfile.TemporaryDirectory() as td:
            img_path = Path(td) / "post.png"
            ok = download_drive_file(row["drive_file_id"], img_path, gog_path)
            if not ok:
                print(f"     download failed.")
                failed += 1
                continue

            caption = row.get("body") or ""
            fb_post_id = fb_upload_photo(
                img_path, caption, page_id=page_id, page_token=page_token
            )
            if not fb_post_id:
                print(f"     FB upload failed.")
                failed += 1
                continue

            print(f"     posted: {fb_post_id}")

            # Best-effort comments
            comments = row.get("comments") or []
            for c in comments:
                cid = fb_post_comment(fb_post_id, c, page_token)
                if cid:
                    print(f"     + comment {cid}")

            mark_published(row["id"], fb_post_id, base_url=base_url, service_key=service_key)
            log_activity(
                client_id=client["id"],
                title=f"Posted to Facebook: {title}",
                detail={"content_id": row["id"], "fb_post_id": fb_post_id, "comments": len(comments)},
                base_url=base_url,
                service_key=service_key,
            )
            posted += 1
            time.sleep(2)  # be polite to Graph API

    print()
    print(f"Summary: posted={posted}  skipped-stale={skipped_stale}  failed={failed}")
    if args.dry_run:
        print("Dry run, no actual posts.")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
