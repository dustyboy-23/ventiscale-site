#!/usr/bin/env python3
"""
Attach a Google Drive file to a content_items row by id.

Usage:
    python scripts/set-content-drive-file.py \\
        --content-id 4d7e9a2b-... \\
        --drive-file-id 1Abc...xyz

Why this exists:
    The content review UI renders a Drive preview iframe when a
    content_items row has drive_file_id set. Inserts and updates on
    content_items go through the service role (Phase 3 RLS deny).
    This is the safe wrapper for that update. It confirms the row
    exists, prints the current value, and writes the new one.

    The Drive file MUST be shared with the reviewer's Google account
    before the iframe will render content (Drive enforces access; this
    column is just an opaque pointer). Sharing is done in the Drive UI.

Requires:
    NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
"""

import argparse
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional


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


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--content-id", required=True, help="content_items.id (UUID)")
    parser.add_argument(
        "--drive-file-id",
        required=True,
        help="Google Drive file ID (the bit after /file/d/ in a Drive URL)",
    )
    args = parser.parse_args()

    load_env_local()
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not base_url or not service_key:
        print("ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env.local")
        return 1

    content_id = args.content_id.strip()
    drive_file_id = args.drive_file_id.strip()

    # Read current state.
    path = (
        f"/rest/v1/content_items?id=eq.{urllib.parse.quote(content_id)}"
        "&select=id,client_id,platform,title,status,drive_file_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    if not isinstance(data, list) or not data:
        print(f"ERROR: no content_items row with id={content_id}")
        return 1
    row = data[0]
    print("Current row:")
    print(f"  client_id={row['client_id']}")
    print(f"  platform={row['platform']}")
    print(f"  title={row['title']!r}")
    print(f"  status={row['status']}")
    print(f"  drive_file_id={row.get('drive_file_id')!r}")
    print()

    # Patch.
    patch_path = f"/rest/v1/content_items?id=eq.{urllib.parse.quote(content_id)}"
    updated = supabase_request(
        "PATCH",
        patch_path,
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=representation"},
        body={"drive_file_id": drive_file_id},
    )
    if isinstance(updated, list) and updated:
        print(f"Updated. drive_file_id is now: {updated[0].get('drive_file_id')!r}")
    else:
        print("Update returned no representation (Supabase quirk). Re-query to confirm.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
