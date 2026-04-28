#!/usr/bin/env python3
"""
Drive state sweep for Sprinkler Guard photos. Aligns Drive filenames
to portal status by prefixing the filename with the current state:

  approved    -> "[APPROVED] <name>"
  rejected    -> "[REJECTED] <name>"  + revision note appended to SG Revisions doc
  published   -> "[POSTED] <name>"
  draft       -> no prefix (original filename)

Idempotent: skips files whose name already matches the desired state.
On reject, also appends a section to the SG Revisions doc with the
reviewer's note so editors have one place to read all pending fixes.

Why filenames instead of subfolders:
  Drive folder creation requires OAuth bearer auth that gog doesn't
  expose and we can't extract per hard-rule #7. Filename prefixes get
  the same visual organization (sorted by name in Drive UI groups all
  [APPROVED] / [REJECTED] / [POSTED] together) without needing folder
  creation rights we don't have.

Usage:
    python scripts/sg-drive-state-sweep.py
    python scripts/sg-drive-state-sweep.py --dry-run

Cron suggestion (PT, twice daily):
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
SG_REVISIONS_DOC_ID = "1Y-URu9aQLPfbX4T7ap6yqR1qBPXLHMaFvH0zno2ZvRQ"
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"

PREFIX_BY_STATUS = {
    "approved": "[APPROVED] ",
    "rejected": "[REJECTED] ",
    "published": "[POSTED] ",
}
ALL_PREFIXES = list(PREFIX_BY_STATUS.values())

PREFIX_RE = re.compile(r"^\[(APPROVED|REJECTED|POSTED)\]\s+")


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


def list_state_relevant_rows(client_id: str, *, base_url: str, service_key: str) -> list:
    """Pull all rows that could need renaming."""
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
        print(f"  ! gog drive get {file_id} failed: {result.stderr.strip()[:200]}", file=sys.stderr)
        return None
    payload = json.loads(result.stdout) if result.stdout.strip() else {}
    return payload.get("file") if isinstance(payload, dict) else None


def gog_rename(file_id: str, new_name: str, gog_path: str) -> bool:
    cmd = [gog_path, "drive", "rename", file_id, new_name]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ! gog drive rename failed: {result.stderr.strip()[:200]}", file=sys.stderr)
        return False
    return True


def strip_state_prefix(name: str) -> str:
    return PREFIX_RE.sub("", name)


def desired_name_for_state(current_name: str, status: str) -> Optional[str]:
    base = strip_state_prefix(current_name)
    prefix = PREFIX_BY_STATUS.get(status, "")
    target = f"{prefix}{base}"
    return target if target != current_name else None


def revisions_section_for_row(row: dict, base_name: str) -> str:
    when = row.get("reviewed_at", "") or datetime.now(timezone.utc).isoformat()
    when_short = when[:10]
    notes = (row.get("reviewer_notes") or "").strip() or "(no note provided)"
    return (
        f"\n## {base_name} (Rejected {when_short})\n"
        f"{notes}\n\n"
        "----------------------------------------\n"
    )


def append_to_revisions_doc(text: str, gog_path: str) -> bool:
    """Append text to the end of the SG Revisions Google Doc.
    Uses gog docs sed to find the end-marker (we maintain a stable end
    marker so appends are idempotent against re-runs)."""
    # Strategy: insert before the trailing end-marker. If the doc has
    # no end-marker yet, drop one in first via clear+insert.
    end_marker = "<!-- SG_REVISIONS_END -->"
    # Append by rewriting the end-marker line: delete the marker, append
    # text + new marker. gog docs sed s/<marker>/<text-then-marker>/g.
    needle = re.escape(end_marker)
    repl = (text + end_marker).replace("/", r"\/")
    expr = f"s/{needle}/{repl}/"
    cmd = [gog_path, "docs", "sed", SG_REVISIONS_DOC_ID, expr]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        # If end-marker missing, try seeding the doc first.
        seed_cmd = [gog_path, "docs", "insert", SG_REVISIONS_DOC_ID, end_marker]
        subprocess.run(seed_cmd, capture_output=True, text=True)
        result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ! revisions doc append failed: {result.stderr.strip()[:200]}", file=sys.stderr)
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
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

    rows = list_state_relevant_rows(client["id"], base_url=base_url, service_key=service_key)
    if not rows:
        print("No SG drafts with drive files. Nothing to sweep.")
        return 0

    print(f"Sweeping {len(rows)} row(s)...")

    renamed = 0
    skipped_aligned = 0
    failed = 0
    revision_appends = 0

    for row in rows:
        status = row["status"]
        meta = gog_get_file(row["drive_file_id"], gog_path)
        if not meta:
            failed += 1
            continue
        current_name = meta.get("name", "")
        target = desired_name_for_state(current_name, status)
        if target is None:
            skipped_aligned += 1
            continue

        action = "WOULD RENAME" if args.dry_run else "renaming"
        print(f"  {action}  {current_name[:60]}  ->  {target[:60]}")
        if args.dry_run:
            renamed += 1
            continue

        if not gog_rename(row["drive_file_id"], target, gog_path):
            failed += 1
            continue
        renamed += 1

        # On reject, also append revision note to the SG Revisions doc
        if status == "rejected":
            base_name = strip_state_prefix(current_name)
            section = revisions_section_for_row(row, base_name)
            if append_to_revisions_doc(section, gog_path):
                revision_appends += 1

    print()
    print(
        f"Summary: renamed={renamed}  aligned={skipped_aligned}  "
        f"failed={failed}  revision-appends={revision_appends}"
    )
    if args.dry_run:
        print("Dry run. Re-run without --dry-run to apply.")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
