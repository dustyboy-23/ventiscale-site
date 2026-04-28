#!/usr/bin/env python3
"""
Move approved Drive files out of the pending folder into a target folder.

Usage:
    python scripts/sweep-drive-approved.py \\
        --client-slug sprinkler-guard \\
        --approved-folder-id <drive-folder-id>

What it does:
    1. Selects all content_items rows where status='approved' AND
       drive_file_id IS NOT NULL for the given client.
    2. For each, looks up the file in Drive via gog. If its parent is
       the client's pending folder (clients.drive_folder_id), moves it
       to the approved folder. If already in the approved folder, skip.
       If somewhere else, log and skip (Dusty manually moved it).
    3. Idempotent. Safe to run on cron every 15 minutes.

Why a separate sweep instead of moving inside the portal action:
    The portal runs on Vercel (no gog binary, no Drive auth). Moving
    Drive files requires Drive write scope. Dusty's gog CLI is locally
    authed for that. The sweep runs on Dusty's machine on cron and
    keeps Drive in sync with what the portal already decided.

Requires:
    - gog CLI at /home/dustin/.local/bin/gog (auth: dustin@ventiscale.com)
    - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
"""

import argparse
import json
import os
import shutil
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"


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


def list_approved_for_client(client_id: str, *, base_url: str, service_key: str) -> list[dict]:
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        "&status=eq.approved&drive_file_id=not.is.null"
        "&select=id,title,drive_file_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data if isinstance(data, list) else []


def drive_get(file_id: str, gog_path: str) -> Optional[dict]:
    cmd = [gog_path, "drive", "get", file_id, "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ! gog drive get failed for {file_id}: {result.stderr.strip()}")
        return None
    payload = json.loads(result.stdout) if result.stdout.strip() else {}
    return payload.get("file") if isinstance(payload, dict) else None


def drive_move(file_id: str, new_parent: str, gog_path: str) -> bool:
    cmd = [gog_path, "drive", "move", file_id, "--parent", new_parent, "--force"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ! gog drive move failed for {file_id}: {result.stderr.strip()}")
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--client-slug", required=True, help="clients.slug to sweep")
    parser.add_argument(
        "--approved-folder-id",
        required=True,
        help="Drive folder ID to move approved files into",
    )
    parser.add_argument("--dry-run", action="store_true", help="Show what would move, don't move")
    parser.add_argument("--gog", default=GOG_DEFAULT, help=f"Path to gog (default: {GOG_DEFAULT})")
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

    client = find_client_by_slug(args.client_slug, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{args.client_slug}'")
        return 1
    pending_folder = client.get("drive_folder_id")
    if not pending_folder:
        print(f"ERROR: client {client['slug']} has no drive_folder_id (pending) set.")
        return 1

    approved = list_approved_for_client(client["id"], base_url=base_url, service_key=service_key)
    if not approved:
        print(f"No approved drafts for {client['slug']}. Nothing to sweep.")
        return 0

    print(f"Client {client['slug']}: {len(approved)} approved row(s) with Drive files")
    print(f"  pending  folder: {pending_folder}")
    print(f"  approved folder: {args.approved_folder_id}")
    print()

    moved, already, missing, elsewhere = 0, 0, 0, 0
    for row in approved:
        meta = drive_get(row["drive_file_id"], gog_path)
        if not meta:
            print(f"  ? {row['title'][:50]}  (file gone from Drive, drive_file_id stale)")
            missing += 1
            continue
        parents = meta.get("parents") or []
        title = (row["title"] or "")[:50]

        if args.approved_folder_id in parents:
            print(f"  ✓ {title}  already in approved folder")
            already += 1
            continue

        if pending_folder not in parents:
            print(f"  ? {title}  not in pending folder either (parents={parents}). Skipping.")
            elsewhere += 1
            continue

        if args.dry_run:
            print(f"  → {title}  WOULD MOVE  {row['drive_file_id']}")
            continue

        ok = drive_move(row["drive_file_id"], args.approved_folder_id, gog_path)
        if ok:
            print(f"  → {title}  moved")
            moved += 1

    print()
    print(f"Summary: moved={moved}  already-approved={already}  missing={missing}  elsewhere={elsewhere}")
    if args.dry_run:
        print("Dry run. Re-run without --dry-run to perform moves.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
