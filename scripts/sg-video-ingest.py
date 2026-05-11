#!/usr/bin/env python3
"""
Pull video files from the SG video pending folder and insert them as
draft content_items in the Venti Scale portal.

Editors drop video files (mp4, mov, webm, etc.) directly into the
parent video folder. This script lists files at the top level of that
folder (NOT inside Approved/Rejected/Already posted subfolders, those
are already-handled state buckets) and creates portal drafts for each.

Caption strategy:
  1. Read the file's Drive description field (editor sets via right-click
     -> File information -> Add description).
  2. If empty, body stays "" and Ken sees the video preview only.

Idempotent: skips files already ingested (matched by drive_file_id).

Usage:
    python scripts/sg-video-ingest.py
    python scripts/sg-video-ingest.py --dry-run

Cron suggestion (PT, every few hours since editors deliver async):
    0 */4 * * * /usr/bin/python3 scripts/sg-video-ingest.py
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, timedelta, datetime, timezone
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"
SG_CLIENT_SLUG = "sprinkler-guard"
VIDEO_PARENT_FOLDER = "17ioVejtNOdnXl40MXuHwkWFaPT7a1Tix"
VIDEO_APPROVED_FOLDER = "1ifTmB9zkh6tMFDPNlE3a0ZszO3Upe2Va"
VIDEO_REJECTED_FOLDER = "1Niu67a2yBFlkwUl04aM6STqo6ifIW3sf"
VIDEO_POSTED_FOLDER = "11BpV3GhVp2T12vVYlj9yZp9fOnjV7LQQ"
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"
SG_ENV_PATH = Path("/home/dustin/sprinkler-guard/.env")  # holds GOG_ACCOUNT + GOG_KEYRING_PASSWORD

VIDEO_MIMES = (
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-m4v",
    "video/x-matroska",
)

# Which subfolders are state buckets (skip when listing pending). Files
# IN these are already past the editor-deliver stage.
STATE_FOLDER_IDS = {
    VIDEO_APPROVED_FOLDER,
    VIDEO_REJECTED_FOLDER,
    VIDEO_POSTED_FOLDER,
}

DATE_PREFIX = re.compile(r"^(\d{4}-\d{2}-\d{2})\b")


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


def list_existing_drive_ids(client_id: str, *, base_url: str, service_key: str) -> set:
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        "&drive_file_id=not.is.null&select=drive_file_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    if not isinstance(data, list):
        return set()
    return {r["drive_file_id"] for r in data if r.get("drive_file_id")}


def list_pending_videos(folder_id: str, gog_path: str) -> list:
    """List top-level files in the video parent folder, video MIME types only."""
    query = f"'{folder_id}' in parents and trashed = false"
    cmd = [gog_path, "drive", "search", query, "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(f"gog drive search failed: {result.stderr.strip()}")
    payload = json.loads(result.stdout) if result.stdout.strip() else {}
    files = payload.get("files", []) if isinstance(payload, dict) else payload
    return [
        f
        for f in files
        if f.get("id") not in STATE_FOLDER_IDS
        and f.get("mimeType", "").startswith("video/")
    ]


def get_drive_description(file_id: str, gog_path: str) -> str:
    """Try to fetch the Drive description field. gog doesn't return it by
    default; we re-call get and look for it. Returns "" if missing."""
    cmd = [gog_path, "drive", "get", file_id, "--select", "description,name", "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        return ""
    try:
        payload = json.loads(result.stdout) if result.stdout.strip() else {}
        f = payload.get("file") if isinstance(payload, dict) else payload
        if isinstance(f, dict):
            return f.get("description", "") or ""
    except json.JSONDecodeError:
        return ""
    return ""


def filename_to_title(name: str) -> str:
    base = name.rsplit(".", 1)[0] if "." in name else name
    return base.strip()


def filename_to_scheduled_at(name: str) -> Optional[str]:
    """Use the date prefix from the filename if present, default time
    11:00 PT. Editors aren't held to the photo Day-N convention so we
    just use the date prefix; reviewer can adjust during approval."""
    m = DATE_PREFIX.match(name)
    if not m:
        # Default: schedule for 24h from now
        target = (datetime.now(timezone.utc) + timedelta(days=1)).date()
        return f"{target.isoformat()}T11:00:00-07:00"
    return f"{m.group(1)}T11:00:00-07:00"


def insert_content_item(
    *,
    client_id: str,
    drive_file_id: str,
    title: str,
    body: str,
    platform: str,
    scheduled_at: str,
    base_url: str,
    service_key: str,
) -> object:
    payload = {
        "client_id": client_id,
        "drive_file_id": drive_file_id,
        "title": title[:200],
        "body": body,
        "platform": platform,
        "status": "draft",
        "scheduled_at": scheduled_at,
        "media_type": "video",
    }
    return supabase_request(
        "POST",
        "/rest/v1/content_items",
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=representation"},
        body=payload,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--gog", default=GOG_DEFAULT)
    args = parser.parse_args()

    gog_path = args.gog if Path(args.gog).exists() else (shutil.which("gog") or args.gog)

    load_env_file(PORTAL_ENV_PATH)
    load_env_file(SG_ENV_PATH)  # gog auth env: GOG_ACCOUNT, GOG_KEYRING_PASSWORD
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (base_url and service_key):
        print("ERROR: portal env not loaded")
        return 1

    client = find_client_by_slug(SG_CLIENT_SLUG, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{SG_CLIENT_SLUG}'")
        return 1

    print(f"Listing pending videos in {VIDEO_PARENT_FOLDER}...")
    files = list_pending_videos(VIDEO_PARENT_FOLDER, gog_path)
    if not files:
        print("No videos found in pending. Nothing to ingest.")
        return 0

    existing = list_existing_drive_ids(client["id"], base_url=base_url, service_key=service_key)
    new_files = [f for f in files if f["id"] not in existing]
    print(f"  Found {len(files)} video(s) in pending; {len(new_files)} new.")

    if not new_files:
        print("All videos already ingested. Nothing to do.")
        return 0

    inserted = 0
    for f in new_files:
        title = filename_to_title(f["name"])
        scheduled = filename_to_scheduled_at(f["name"])
        description = get_drive_description(f["id"], gog_path)
        if args.dry_run:
            print(f"  WOULD INSERT  {title:50s}  desc=<{len(description)} chars>")
            continue
        print(f"  -> {title:50s}  desc=<{len(description)} chars>")
        try:
            insert_content_item(
                client_id=client["id"],
                drive_file_id=f["id"],
                title=title,
                body=description,
                platform="facebook",
                scheduled_at=scheduled,
                base_url=base_url,
                service_key=service_key,
            )
            inserted += 1
        except SystemExit as exc:
            print(f"     failed: {exc}", file=sys.stderr)

    if args.dry_run:
        print("\nDry run. Re-run without --dry-run to insert.")
        return 0
    print(f"\nInserted {inserted}/{len(new_files)} video drafts. Status='draft', platform='facebook'.")
    print("(Poster auto-detects video vs image via Drive MIME and uses the right Graph endpoint.)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
