#!/usr/bin/env python3
"""
Pull files from a client's Drive folder and create content_items draft rows
in Supabase. Idempotent; re-running picks up only new files.

Usage:
    python scripts/ingest-drive-drafts.py --client-slug sprinkler-guard
    python scripts/ingest-drive-drafts.py --client-slug sprinkler-guard --platform facebook
    python scripts/ingest-drive-drafts.py --client-slug sprinkler-guard --dry-run

What it does:
    1. Looks up the client by slug. Reads the client's drive_folder_id.
    2. Lists files in that Drive folder via the gog CLI (auth: dustin@ventiscale.com).
    3. For each file not already in content_items (by drive_file_id), inserts a
       new draft row. Skips folders. Skips re-imports.
    4. Prints a summary of what was created vs skipped.

Why gog:
    The portal already has a Supabase service role key in .env.local, but no
    Drive credentials. gog is locally authed for Drive scope under
    dustin@ventiscale.com. Using it keeps Drive auth in one place and avoids
    a second service account.

Title and platform:
    The Drive filename becomes the content_items.title (with the .ext stripped).
    Platform defaults to 'other' but can be overridden via --platform. The
    enum is: facebook | linkedin | blog | instagram | other.

Requires:
    - gog CLI at /home/dustin/.local/bin/gog (already authed for Drive)
    - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in portal .env.local
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"
PLATFORMS = ("facebook", "linkedin", "blog", "instagram", "other")

# Parse Dusty's filename convention. The date prefix is the CAMPAIGN
# START DATE (Day 1), not the post date. "Day N AM/PM" means N days
# into the campaign in the morning or afternoon slot.
#
# Examples:
#   "2026-04-28 - Day 5 PM - hose-attachment.png"
#       campaign starts 2026-04-28, Day 5 = start + 4 days = 2026-05-02
#       PM = 15:00 PT
#       -> scheduled_at = 2026-05-02T15:00:00-07:00
#
#   "2026-04-27 - V3 Post 10-Yard-vs-Truck.png"
#       no Day N, just date prefix. Even-numbered V3 Posts go AM,
#       odd go PM, so two posts on the same date split across slots.
DAY_N_PATTERN = re.compile(
    r"^(\d{4}-\d{2}-\d{2})\s+-\s+Day\s+(\d+)\s+(AM|PM)\b", re.IGNORECASE
)
V3_POST_PATTERN = re.compile(
    r"^(\d{4}-\d{2}-\d{2})\s+-\s+V\d+\s+Post\s+(\d+)", re.IGNORECASE
)
DATE_PREFIX = re.compile(r"^(\d{4}-\d{2}-\d{2})\b")
AM_PM_TAG = re.compile(r"\b(AM|PM)\b", re.IGNORECASE)


def load_env_local() -> None:
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
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
) -> dict:
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
    path = (
        f"/rest/v1/clients?slug=eq.{urllib.parse.quote(slug)}"
        "&select=id,slug,name,drive_folder_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data[0] if isinstance(data, list) and data else None


def list_existing_drive_ids(client_id: str, *, base_url: str, service_key: str) -> set[str]:
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        "&drive_file_id=not.is.null&select=drive_file_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    if not isinstance(data, list):
        return set()
    return {r["drive_file_id"] for r in data if r.get("drive_file_id")}


def list_drive_files(folder_id: str, gog_path: str) -> list[dict]:
    query = f"'{folder_id}' in parents and trashed = false"
    cmd = [gog_path, "drive", "search", query, "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(f"gog drive search failed (exit {result.returncode}):\n{result.stderr}")
    payload = json.loads(result.stdout) if result.stdout.strip() else {}
    files = payload.get("files") if isinstance(payload, dict) else payload
    return files or []


def insert_content_item(
    *,
    client_id: str,
    drive_file_id: str,
    title: str,
    platform: str,
    scheduled_at: Optional[str],
    base_url: str,
    service_key: str,
) -> dict:
    body: dict = {
        "client_id": client_id,
        "drive_file_id": drive_file_id,
        "title": title[:200],
        "platform": platform,
        "status": "draft",
    }
    if scheduled_at:
        body["scheduled_at"] = scheduled_at
    return supabase_request(
        "POST",
        "/rest/v1/content_items",
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=representation"},
        body=body,
    )


def filename_to_title(name: str) -> str:
    # Strip the extension. Keep dashes/spaces as-is so Dusty's naming
    # convention ("2026-04-28 - Day 5 PM - hose-attachment") stays
    # readable in the portal.
    base = name.rsplit(".", 1)[0] if "." in name else name
    return base.strip()


def filename_to_scheduled_at(name: str) -> Optional[str]:
    """
    Pull a default scheduled_at out of Dusty's filename convention.
    Returns an ISO-8601 timestamptz string in PT (America/Los_Angeles) or
    None if the filename doesn't fit any known pattern.

    Naming conventions handled:

      "<startDate> - Day <N> <AM|PM> - <topic>.<ext>"
        Day 1 == startDate. Day N == startDate + (N-1) days. AM=09:00 PT,
        PM=15:00 PT. So a 14-day campaign starting 2026-04-28 spreads
        across 2026-04-28 through 2026-05-11, two posts per day.

      "<date> - V<v> Post <NN> - <topic>.<ext>"
        One-off batch posts on a single date. Even NN go to AM (09:00 PT),
        odd NN go to PM (15:00 PT) so two posts on the same date split
        cleanly across slots.

      "<date> ... AM|PM ..." (catch-all with AM/PM tag)
        Posted on <date> at the matching slot.

      "<date> ..." (catch-all date prefix only)
        Posted on <date> at 11:00 PT.

    Postgres parses the explicit -07:00 offset cleanly. PDT runs through
    early November so this is correct for now. The reviewer can adjust
    the exact time during approval if needed.
    """
    from datetime import date, timedelta

    m = DAY_N_PATTERN.match(name)
    if m:
        start = date.fromisoformat(m.group(1))
        day_n = int(m.group(2))
        ampm = m.group(3).upper()
        target = start + timedelta(days=day_n - 1)
        time_str = "09:00:00" if ampm == "AM" else "15:00:00"
        return f"{target.isoformat()}T{time_str}-07:00"

    m = V3_POST_PATTERN.match(name)
    if m:
        d = m.group(1)
        post_n = int(m.group(2))
        # Alternate every 2 posts: 04 AM, 06 PM, 08 AM, 10 PM, 12 AM, 14 PM.
        # Spreads sequential post numbers across slots even when they're
        # all even (Dusty's V3 Posts step by 2: 08, 10, 12, ...).
        time_str = "09:00:00" if (post_n // 2) % 2 == 0 else "15:00:00"
        return f"{d}T{time_str}-07:00"

    m = DATE_PREFIX.match(name)
    if not m:
        return None
    date_str = m.group(1)
    period = AM_PM_TAG.search(name)
    if period and period.group(1).upper() == "AM":
        time_str = "09:00:00"
    elif period and period.group(1).upper() == "PM":
        time_str = "15:00:00"
    else:
        time_str = "11:00:00"
    return f"{date_str}T{time_str}-07:00"


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--client-slug", required=True, help="clients.slug to ingest into")
    parser.add_argument(
        "--platform",
        choices=PLATFORMS,
        default="other",
        help="Default platform tag for new drafts (default: other)",
    )
    parser.add_argument("--dry-run", action="store_true", help="List what would be inserted, don't write")
    parser.add_argument("--gog", default=GOG_DEFAULT, help=f"Path to gog CLI (default: {GOG_DEFAULT})")
    args = parser.parse_args()

    gog_path = args.gog
    if not Path(gog_path).exists():
        which = shutil.which("gog")
        if not which:
            print(f"ERROR: gog CLI not found at {gog_path} or in PATH")
            return 1
        gog_path = which

    load_env_local()
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not base_url or not service_key:
        print("ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env.local")
        return 1

    print(f"Looking up client by slug: {args.client_slug}")
    client = find_client_by_slug(args.client_slug, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{args.client_slug}'")
        return 1
    folder_id = client.get("drive_folder_id")
    if not folder_id:
        print(f"ERROR: client {client['slug']} has no drive_folder_id set.")
        print("  Set it in Supabase Studio:")
        print(f"    update public.clients set drive_folder_id = '<folder-id>' where slug = '{args.client_slug}';")
        return 1
    print(f"  ✓ client_id={client['id']}  drive_folder_id={folder_id}")

    print(f"Listing Drive files in folder via gog ({gog_path})")
    files = list_drive_files(folder_id, gog_path)
    if not files:
        print("  No files in folder. Nothing to ingest.")
        return 0

    existing = list_existing_drive_ids(client["id"], base_url=base_url, service_key=service_key)
    print(f"  Found {len(files)} entries in Drive · {len(existing)} already ingested for this client")

    new_files = []
    for f in files:
        if f.get("mimeType") == "application/vnd.google-apps.folder":
            continue
        if f["id"] in existing:
            continue
        new_files.append(f)

    if not new_files:
        print("  Nothing new to ingest. All non-folder files already in content_items.")
        return 0

    print(f"\nWill insert {len(new_files)} new draft row(s):")
    for f in new_files:
        sched = filename_to_scheduled_at(f["name"]) or "(no date in name)"
        print(f"  · {filename_to_title(f['name']):60s}  scheduled={sched}")

    if args.dry_run:
        print("\nDry run. Re-run without --dry-run to write.")
        return 0

    print()
    inserted = 0
    for f in new_files:
        try:
            insert_content_item(
                client_id=client["id"],
                drive_file_id=f["id"],
                title=filename_to_title(f["name"]),
                platform=args.platform,
                scheduled_at=filename_to_scheduled_at(f["name"]),
                base_url=base_url,
                service_key=service_key,
            )
            inserted += 1
        except SystemExit as exc:
            print(f"  ! failed for {f['name']}: {exc}")
    print(f"\nInserted {inserted}/{len(new_files)} draft rows. Status='draft', platform={args.platform!r}.")
    print("They will appear at https://www.ventiscale.com/content the next time the page is loaded.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
