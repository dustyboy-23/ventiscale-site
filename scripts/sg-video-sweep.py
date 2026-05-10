#!/usr/bin/env python3
"""
Drive state sweep for Sprinkler Guard VIDEOS. Aligns Drive parent
folder to portal status, AND appends any new reviewer notes (from
either approve+note or reject+note flows) to the Revisions Google Doc.

  approved   -> move file to Approved subfolder
  rejected   -> move file to Rejected subfolder
  published  -> move file to Already posted subfolder
  draft      -> stays in parent (top-level pending bucket)

  any status with reviewer_notes set -> append section to Revisions doc
  with the note + status + date. Idempotent via a watermark file:
  /home/dustin/venti-scale/portal/ops/state/sg-video-sweep-notes.watermark

Idempotent on moves: skips files already in the correct subfolder.
Idempotent on notes: only appends rows with reviewed_at > watermark,
then advances the watermark. Safe to re-run on cron.

Usage:
    python scripts/sg-video-sweep.py
    python scripts/sg-video-sweep.py --dry-run

Cron suggestion (PT, twice daily):
    35 8 * * * /usr/bin/python3 scripts/sg-video-sweep.py
    35 14 * * * /usr/bin/python3 scripts/sg-video-sweep.py
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
VIDEO_PARENT_FOLDER = "17ioVejtNOdnXl40MXuHwkWFaPT7a1Tix"
VIDEO_APPROVED_FOLDER = "1ifTmB9zkh6tMFDPNlE3a0ZszO3Upe2Va"
VIDEO_REJECTED_FOLDER = "1Niu67a2yBFlkwUl04aM6STqo6ifIW3sf"
VIDEO_POSTED_FOLDER = "11BpV3GhVp2T12vVYlj9yZp9fOnjV7LQQ"
VIDEO_REVISIONS_DOC = "1mM7sUaKWWBxFkrckwwRZ0f8w4QPSQ9gzQkHu27_XnEs"
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"
# SG repo .env carries GOG_KEYRING_PASSWORD + GOG_ACCOUNT; gog calls fail under cron without them
SG_ENV_PATH = Path("/home/dustin/sprinkler-guard/.env")
NOTES_WATERMARK_PATH = Path(__file__).resolve().parent.parent / "ops" / "state" / "sg-video-sweep-notes.watermark"

TARGET_PARENT_BY_STATUS = {
    "approved": VIDEO_APPROVED_FOLDER,
    "rejected": VIDEO_REJECTED_FOLDER,
    "published": VIDEO_POSTED_FOLDER,
}


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


def list_video_rows(client_id: str, *, base_url: str, service_key: str) -> list:
    """Pull rows for files that LIVE in the video Drive tree.
    We can't filter by parent folder in the SQL (drive_file_id is just
    an opaque pointer), so we fetch all SG drafts with drive_file_id
    and filter by parent locally via gog drive get."""
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&drive_file_id=not.is.null"
        f"&status=in.(draft,approved,rejected,published)"
        "&select=id,title,status,reviewer_notes,reviewed_at,drive_file_id"
        "&order=created_at.desc&limit=200"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data if isinstance(data, list) else []


def read_notes_watermark() -> str:
    """Return the ISO timestamp watermark, or epoch if no marker yet."""
    if NOTES_WATERMARK_PATH.exists():
        try:
            text = NOTES_WATERMARK_PATH.read_text().strip()
            if text:
                return text
        except OSError:
            pass
    return "1970-01-01T00:00:00+00:00"


def write_notes_watermark(iso: str) -> None:
    NOTES_WATERMARK_PATH.parent.mkdir(parents=True, exist_ok=True)
    NOTES_WATERMARK_PATH.write_text(iso + "\n")


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


def is_in_video_tree(parents: list) -> bool:
    if not parents:
        return False
    p = parents[0]
    return p in {
        VIDEO_PARENT_FOLDER,
        VIDEO_APPROVED_FOLDER,
        VIDEO_REJECTED_FOLDER,
        VIDEO_POSTED_FOLDER,
    }


def revisions_section(row: dict) -> str:
    when = row.get("reviewed_at") or datetime.now(timezone.utc).isoformat()
    when_short = when[:10]
    title = row.get("title") or "(untitled)"
    notes = (row.get("reviewer_notes") or "").strip() or "(no note provided)"
    status_label = (row.get("status") or "noted").capitalize()
    return (
        f"\n## {title} ({status_label} {when_short})\n"
        f"{notes}\n\n"
        "----------------------------------------\n"
    )


def append_to_revisions_doc(text: str, gog_path: str) -> bool:
    """Append a section to the video Revisions doc via stdin.
    Was using sed-style replacement; that silently no-ops when the
    marker is absent. --append writes at the end of the doc body."""
    cmd = [gog_path, "docs", "write", "--append", "--file=-", VIDEO_REVISIONS_DOC]
    result = subprocess.run(cmd, input=text, capture_output=True, text=True)
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
    load_env_file(SG_ENV_PATH)
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (base_url and service_key):
        print("ERROR: portal env not loaded")
        return 1

    client = find_client_by_slug(SG_CLIENT_SLUG, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{SG_CLIENT_SLUG}'")
        return 1

    rows = list_video_rows(client["id"], base_url=base_url, service_key=service_key)
    if not rows:
        print("No SG drafts to sweep.")
        return 0

    moved = 0
    skipped_aligned = 0
    skipped_not_video = 0
    failed = 0
    revision_appends = 0

    # Cache per-file metadata so we don't double-fetch when both the
    # move pass and the notes pass need parents/MIME.
    meta_cache: dict[str, dict] = {}
    video_row_ids: set[str] = set()

    for row in rows:
        meta = gog_get_file(row["drive_file_id"], gog_path)
        if not meta:
            failed += 1
            continue
        meta_cache[row["id"]] = meta
        parents = meta.get("parents", [])
        if not is_in_video_tree(parents):
            # Not a video file (probably a photo). Skip silently.
            skipped_not_video += 1
            continue
        video_row_ids.add(row["id"])

        title = (row.get("title") or "")[:60]
        status = row["status"]
        target_parent = TARGET_PARENT_BY_STATUS.get(status, VIDEO_PARENT_FOLDER)
        current_parent = parents[0]

        if current_parent == target_parent:
            skipped_aligned += 1
            continue

        action = "WOULD MOVE" if args.dry_run else "moving"
        print(f"  {action}  {title}  ->  {target_parent[:8]}... ({status})")

        if args.dry_run:
            moved += 1
            continue

        if not gog_move(row["drive_file_id"], target_parent, gog_path):
            failed += 1
            continue
        moved += 1

    # Notes pass: append to the Revisions Google Doc any reviewer_notes
    # that landed since the last watermark. Covers approve+note,
    # reject+note, and any future standalone-note flow.
    watermark = read_notes_watermark()
    new_max = watermark
    pending_notes = []
    for row in rows:
        if row["id"] not in video_row_ids:
            continue
        notes = (row.get("reviewer_notes") or "").strip()
        if not notes:
            continue
        reviewed_at = row.get("reviewed_at") or ""
        if not reviewed_at or reviewed_at <= watermark:
            continue
        pending_notes.append(row)
        if reviewed_at > new_max:
            new_max = reviewed_at

    if pending_notes:
        # Append oldest first so the doc reads chronologically.
        pending_notes.sort(key=lambda r: r.get("reviewed_at") or "")
        for row in pending_notes:
            title = (row.get("title") or "")[:60]
            print(f"  {'WOULD APPEND' if args.dry_run else 'appending'} note for {title} ({row['status']})")
            if args.dry_run:
                revision_appends += 1
                continue
            if append_to_revisions_doc(revisions_section(row), gog_path):
                revision_appends += 1
            else:
                failed += 1
        if not args.dry_run and new_max != watermark:
            write_notes_watermark(new_max)

    print()
    print(
        f"Summary: moved={moved}  aligned={skipped_aligned}  "
        f"not-video={skipped_not_video}  failed={failed}  revisions={revision_appends}"
    )
    if args.dry_run:
        print("Dry run. Re-run without --dry-run to apply.")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
