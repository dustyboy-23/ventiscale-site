#!/usr/bin/env python3
"""
Bridge the SG LinkedIn queue into the Venti Scale portal as drafts.

Reads /home/dustin/sprinkler-guard/content/linkedin/li-queue.json and
inserts a content_items row for each entry not yet ingested. Status
starts as 'draft'; Ken approves via portal; sg-li-poster.py picks up
approved entries on its cron and posts to LinkedIn.

Match key: queue entry's `id` (integer) is stored in
content_items.external_id (column already exists for this purpose).
That makes ingest idempotent across re-runs without modifying the
queue file.

Usage:
    python scripts/sg-li-ingest.py
    python scripts/sg-li-ingest.py --dry-run

Cron suggestion (PT, daily at 4:30 AM after the morning content gen):
    30 4 * * * /usr/bin/python3 scripts/sg-li-ingest.py
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

SG_CLIENT_SLUG = "sprinkler-guard"
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


def list_existing_li_external_ids(client_id, *, base_url, service_key):
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        "&platform=eq.linkedin&external_id=not.is.null&select=external_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    if not isinstance(data, list):
        return set()
    return {r["external_id"] for r in data if r.get("external_id")}


def next_li_slot_at() -> str:
    """LinkedIn slot defaults: 8 AM PT, on the next business day."""
    now = datetime.now(timezone.utc)
    target = now + timedelta(days=1)
    # Snap to next Mon/Wed/Fri to match existing LI cadence
    while target.weekday() not in (0, 2, 4):
        target += timedelta(days=1)
    return f"{target.date().isoformat()}T08:00:00-07:00"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
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

    if not LI_QUEUE_PATH.exists():
        print(f"ERROR: queue file missing: {LI_QUEUE_PATH}")
        return 1
    queue = json.loads(LI_QUEUE_PATH.read_text())
    if not isinstance(queue, list):
        print("ERROR: queue is not a list")
        return 1

    existing_ext_ids = list_existing_li_external_ids(
        client["id"], base_url=base_url, service_key=service_key
    )

    new_entries = []
    for entry in queue:
        if entry.get("posted"):
            # Already posted historically; skip
            continue
        ext_id = f"li-queue-{entry.get('id')}"
        if ext_id in existing_ext_ids:
            continue
        new_entries.append((entry, ext_id))

    if not new_entries:
        print("No new LinkedIn entries to ingest.")
        return 0

    print(f"Will ingest {len(new_entries)} LinkedIn draft(s):")
    for entry, ext_id in new_entries:
        title = entry.get("title", "")[:60]
        print(f"  · {title:60s}  external_id={ext_id}")

    if args.dry_run:
        print("\nDry run.")
        return 0

    inserted = 0
    for entry, ext_id in new_entries:
        title = entry.get("title", f"LinkedIn post #{entry.get('id')}")
        body = entry.get("body", "")
        try:
            supabase_request(
                "POST",
                "/rest/v1/content_items",
                base_url=base_url,
                service_key=service_key,
                headers={"Prefer": "return=minimal"},
                body={
                    "client_id": client["id"],
                    "title": title[:200],
                    "body": body,
                    "platform": "linkedin",
                    "status": "draft",
                    "external_id": ext_id,
                    "scheduled_at": next_li_slot_at(),
                    "media_type": "text",
                },
            )
            inserted += 1
        except SystemExit as exc:
            print(f"  ! failed for {title}: {exc}", file=sys.stderr)

    print(f"\nInserted {inserted}/{len(new_entries)} LinkedIn drafts.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
