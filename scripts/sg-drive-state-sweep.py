#!/usr/bin/env python3
"""
Drive state sweep for Sprinkler Guard PHOTOS. Aligns Drive parent
folder to portal status using real subfolder moves now that the
parent folder has Approved / Rejected / Posted siblings.

  approved   -> move file to Approved subfolder
  rejected   -> move file to Rejected subfolder + append note to Revisions doc
  published  -> move file to Posted subfolder
  draft      -> stays in parent (top-level pending bucket)

Idempotent. Skips files already in the correct subfolder.

Also strips legacy [APPROVED]/[REJECTED]/[POSTED] filename prefixes
that the previous filename-based sweep may have applied, so the
visible filename ends up clean once Drive moves take over.

Usage:
    python scripts/sg-drive-state-sweep.py
    python scripts/sg-drive-state-sweep.py --dry-run

Cron suggestion (PT, twice daily before posting slots):
    30 8 * * * /usr/bin/python3 scripts/sg-drive-state-sweep.py
    30 14 * * * /usr/bin/python3 scripts/sg-drive-state-sweep.py
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
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"
SG_CLIENT_SLUG = "sprinkler-guard"
PHOTO_PARENT_FOLDER = "1L5tD47hvCy20UIXAY4gml4D3aMOun7Vc"
PHOTO_APPROVED_FOLDER = "1pqfAT4G96T1PkKygVZnWgzkojjdQIBfY"
PHOTO_REJECTED_FOLDER = "1IhmGHU90LH_i6xuXFPfivpHWaK9XJa_n"
PHOTO_POSTED_FOLDER = "1Uiu8pGjzfTEnELi-k81xHHaS0qh04_qf"
PHOTO_REVISIONS_DOC = "1Y-URu9aQLPfbX4T7ap6yqR1qBPXLHMaFvH0zno2ZvRQ"
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"

TARGET_PARENT_BY_STATUS = {
    "approved": PHOTO_APPROVED_FOLDER,
    "rejected": PHOTO_REJECTED_FOLDER,
    "published": PHOTO_POSTED_FOLDER,
}

PHOTO_TREE = {
    PHOTO_PARENT_FOLDER,
    PHOTO_APPROVED_FOLDER,
    PHOTO_REJECTED_FOLDER,
    PHOTO_POSTED_FOLDER,
}

LEGACY_PREFIX_RE = re.compile(r"^\[(APPROVED|REJECTED|POSTED)\]\s+")


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


def list_photo_rows(client_id: str, *, base_url: str, service_key: str) -> list:
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&drive_file_id=not.is.null"
        f"&status=in.(draft,approved,rejected,published)"
        "&select=id,title,status,reviewer_notes,reviewed_at,drive_file_id"
        "&order=created_at.desc&limit=200"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data if isinstance(data, list) else []


def gog_get_file(file_id: str, gog_path: str) -> Optional[dict]:
    cmd = [gog_path, "drive", "get", file_id, "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        return None
    try:
        payload = json.loads(result.stdout) if result.stdout.strip() else {}
    except json.JSONDecodeError:
        return None
    return payload.get("file") if isinstance(payload, dict) else None


def gog_move(file_id: str, new_parent: str, gog_path: str) -> bool:
    cmd = [gog_path, "drive", "move", file_id, "--parent", new_parent, "--force"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ! gog drive move failed: {result.stderr.strip()[:200]}", file=sys.stderr)
        return False
    return True


def gog_rename(file_id: str, new_name: str, gog_path: str) -> bool:
    cmd = [gog_path, "drive", "rename", file_id, new_name]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0


def in_photo_tree(parents: list) -> bool:
    return bool(parents) and parents[0] in PHOTO_TREE


def revisions_section(row: dict) -> str:
    when = row.get("reviewed_at") or datetime.now(timezone.utc).isoformat()
    title = row.get("title") or "(untitled)"
    notes = (row.get("reviewer_notes") or "").strip() or "(no note provided)"
    return (
        f"\n## {title} (Rejected {when[:10]})\n"
        f"{notes}\n\n"
        "----------------------------------------\n"
    )


def append_to_revisions_doc(text: str, gog_path: str) -> bool:
    end_marker = "<!-- PHOTO_REVISIONS_END -->"
    needle = re.escape(end_marker)
    repl = (text + end_marker).replace("/", r"\/")
    expr = f"s/{needle}/{repl}/"
    cmd = [gog_path, "docs", "sed", PHOTO_REVISIONS_DOC, expr]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        seed = [gog_path, "docs", "insert", PHOTO_REVISIONS_DOC, end_marker]
        subprocess.run(seed, capture_output=True, text=True)
        result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ! revisions doc append failed: {result.stderr.strip()[:200]}", file=sys.stderr)
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--gog", default=GOG_DEFAULT)
    args = parser.parse_args()

    gog_path = args.gog if Path(args.gog).exists() else (shutil.which("gog") or args.gog)

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

    rows = list_photo_rows(client["id"], base_url=base_url, service_key=service_key)
    if not rows:
        print("No SG drafts to sweep.")
        return 0

    moved = 0
    skipped_aligned = 0
    skipped_not_photo = 0
    failed = 0
    revisions = 0
    legacy_renames = 0

    for row in rows:
        meta = gog_get_file(row["drive_file_id"], gog_path)
        if not meta:
            failed += 1
            continue
        parents = meta.get("parents", [])
        if not in_photo_tree(parents):
            skipped_not_photo += 1
            continue

        title = (row.get("title") or "")[:60]
        status = row["status"]
        target_parent = TARGET_PARENT_BY_STATUS.get(status, PHOTO_PARENT_FOLDER)
        current_parent = parents[0]
        current_name = meta.get("name", "")

        # Strip legacy filename prefix if present (one-time cleanup)
        clean_name = LEGACY_PREFIX_RE.sub("", current_name)
        if clean_name != current_name:
            print(f"  cleanup  {current_name[:60]}  ->  {clean_name[:60]}")
            if not args.dry_run:
                if gog_rename(row["drive_file_id"], clean_name, gog_path):
                    legacy_renames += 1

        if current_parent == target_parent:
            skipped_aligned += 1
            continue

        action = "WOULD MOVE" if args.dry_run else "moving"
        target_label = {
            PHOTO_APPROVED_FOLDER: "Approved",
            PHOTO_REJECTED_FOLDER: "Rejected",
            PHOTO_POSTED_FOLDER: "Posted",
            PHOTO_PARENT_FOLDER: "(pending)",
        }.get(target_parent, target_parent[:8] + "...")
        print(f"  {action}  {clean_name[:60]:60s}  ->  {target_label} ({status})")

        if args.dry_run:
            moved += 1
            continue

        if not gog_move(row["drive_file_id"], target_parent, gog_path):
            failed += 1
            continue
        moved += 1

        if status == "rejected":
            if append_to_revisions_doc(revisions_section(row), gog_path):
                revisions += 1

    print()
    print(
        f"Summary: moved={moved}  aligned={skipped_aligned}  "
        f"not-photo={skipped_not_photo}  failed={failed}  "
        f"revisions={revisions}  legacy-cleaned={legacy_renames}"
    )
    if args.dry_run:
        print("Dry run. Re-run without --dry-run to apply.")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
