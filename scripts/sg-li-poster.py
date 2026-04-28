#!/usr/bin/env python3
"""
Approval-gated LinkedIn poster for Sprinkler Guard.

Reads content_items where:
    client_id = SG, platform = 'linkedin', status = 'approved',
    scheduled_at <= now()

For each, writes a temp JSON in the format that post-sg-linkedin.py
expects, calls it as a subprocess, then marks the portal row published
with the returned LI post URN.

Idempotent: rows are only fetched while status='approved'; once
'published' they don't show up.

Usage:
    python scripts/sg-li-poster.py
    python scripts/sg-li-poster.py --dry-run

Cron suggestion (PT, weekdays at 8 AM matching LI defaults):
    0 8 * * 1-5 /usr/bin/python3 scripts/sg-li-poster.py
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

SG_CLIENT_SLUG = "sprinkler-guard"
LI_POST_SCRIPT = Path("/home/dustin/sprinkler-guard/.claude/skills/sprinkler-guard-linkedin/scripts/post-sg-linkedin.py")
LI_QUEUE_PATH = Path("/home/dustin/sprinkler-guard/content/linkedin/li-queue.json")
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def supabase_request(method, path, *, base_url, service_key, headers=None, body=None):
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


def find_client_by_slug(slug, *, base_url, service_key):
    path = f"/rest/v1/clients?slug=eq.{urllib.parse.quote(slug)}&select=id,slug,name"
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data[0] if isinstance(data, list) and data else None


def list_due_approved(client_id, *, base_url, service_key):
    now_iso = datetime.now(timezone.utc).isoformat()
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&platform=eq.linkedin&status=eq.approved"
        f"&scheduled_at=lte.{urllib.parse.quote(now_iso)}"
        "&select=id,title,body,external_id,scheduled_at"
        "&order=scheduled_at.asc"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data if isinstance(data, list) else []


def post_via_existing_script(body_text: str, title: str) -> Optional[str]:
    """Call the existing post-sg-linkedin.py with a temp JSON. Returns the
    LI post URN on success, None on failure."""
    if not LI_POST_SCRIPT.exists():
        print(f"ERROR: LI post script missing at {LI_POST_SCRIPT}", file=sys.stderr)
        return None
    payload = {"title": title, "body": body_text}
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(payload, f)
        temp_path = f.name
    try:
        result = subprocess.run(
            ["/usr/bin/python3", str(LI_POST_SCRIPT), "--post-file", temp_path, "--json-output"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode != 0:
            print(f"  LI post failed: {result.stderr.strip()[:300]}", file=sys.stderr)
            # fallback: stdout might have useful info
            print(f"  stdout: {result.stdout.strip()[:200]}", file=sys.stderr)
            return None
        # Try to extract the post URN from stdout
        for line in result.stdout.splitlines():
            line = line.strip()
            if line.startswith("urn:li:"):
                return line
            try:
                obj = json.loads(line)
                if isinstance(obj, dict):
                    urn = obj.get("post_id") or obj.get("urn") or obj.get("id")
                    if isinstance(urn, str) and urn.startswith("urn:li:"):
                        return urn
            except json.JSONDecodeError:
                continue
        # If we can't extract a URN but exit was 0, log "posted" without URN
        return "urn:li:share:unknown"
    finally:
        try:
            Path(temp_path).unlink()
        except OSError:
            pass


def mark_published(row_id, urn, *, base_url, service_key):
    supabase_request(
        "PATCH",
        f"/rest/v1/content_items?id=eq.{row_id}",
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=minimal"},
        body={
            "status": "published",
            "published_at": datetime.now(timezone.utc).isoformat(),
            "external_id": urn,
        },
    )


def update_queue_posted(queue_id_int: int, urn: str) -> None:
    """Best-effort: mark the queue entry as posted to keep the queue truth aligned."""
    if not LI_QUEUE_PATH.exists():
        return
    try:
        queue = json.loads(LI_QUEUE_PATH.read_text())
    except Exception:
        return
    changed = False
    for entry in queue:
        if entry.get("id") == queue_id_int and not entry.get("posted"):
            entry["posted"] = True
            entry["posted_date"] = datetime.now().date().isoformat()
            entry["post_id"] = urn
            changed = True
    if changed:
        LI_QUEUE_PATH.write_text(json.dumps(queue, indent=2))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--max", type=int, default=2)
    args = parser.parse_args()

    load_env_file(PORTAL_ENV_PATH)
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (base_url and service_key):
        print("ERROR: portal env not loaded")
        return 1

    client = find_client_by_slug(SG_CLIENT_SLUG, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{SG_CLIENT_SLUG}'")
        return 1

    due = list_due_approved(client["id"], base_url=base_url, service_key=service_key)
    if not due:
        print("No approved+due LinkedIn posts. Nothing to publish.")
        return 0

    print(f"Found {len(due)} approved+due LI post(s).")
    posted = 0
    failed = 0

    for row in due:
        if posted >= args.max:
            print(f"Hit --max={args.max}, stopping.")
            break
        title = (row.get("title") or "")[:60]
        body = row.get("body") or ""
        ext_id = row.get("external_id") or ""

        print(f"  -> {title:60s}  scheduled={row['scheduled_at']}")
        if args.dry_run:
            posted += 1
            continue

        urn = post_via_existing_script(body, title)
        if not urn:
            failed += 1
            continue

        mark_published(row["id"], urn, base_url=base_url, service_key=service_key)
        # Sync back to queue.json if the external_id was a li-queue ref
        if ext_id.startswith("li-queue-"):
            try:
                queue_id_int = int(ext_id.split("li-queue-", 1)[1])
                update_queue_posted(queue_id_int, urn)
            except ValueError:
                pass
        print(f"     posted: {urn}")
        posted += 1

    print()
    print(f"Summary: posted={posted}  failed={failed}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
