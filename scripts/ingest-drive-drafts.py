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
import shutil
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"
PLATFORMS = ("facebook", "linkedin", "blog", "instagram", "other")


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
    base_url: str,
    service_key: str,
) -> dict:
    body = {
        "client_id": client_id,
        "drive_file_id": drive_file_id,
        "title": title[:200],
        "platform": platform,
        "status": "draft",
    }
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
        print(f"  · {filename_to_title(f['name']):60s}  {f['id']}")

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
