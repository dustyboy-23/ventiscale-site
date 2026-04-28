#!/usr/bin/env python3
"""
Bridge a generated Sprinkler Guard draft JSON into the Venti Scale portal:

  1. Read draft JSON (output of sg-content-gen.md cron)
  2. Generate image via Gemini Image Gen (same as post-sg-fb.py)
  3. Upload image to the SG Drive folder via gog
  4. Insert content_items row in Supabase (status=draft, awaiting Ken's approval)

Idempotent: skips if a content_items row already exists for this JSON
(matched by drive_file_id once uploaded; or by title before upload, we
key on the file basename so re-running doesn't double-insert).

Usage:
    python scripts/sg-portal-publish.py --json-path <path-to-draft.json>
    python scripts/sg-portal-publish.py --json-path <path> --slot evening
    python scripts/sg-portal-publish.py --json-path <path> --dry-run

Buffer guard:
    --skip-if-buffer-full    Exits 0 without doing anything if the portal
                             already has 14+ pending drafts in the next
                             7 days (the "always 7 days ahead" rule).

Requires:
    GEMINI_API_KEY (in /home/dustin/sprinkler-guard/.env)
    NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (portal .env.local)
    /home/dustin/.local/bin/gog authed for Drive scope
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

GOG_DEFAULT = "/home/dustin/.local/bin/gog"
SG_CLIENT_SLUG = "sprinkler-guard"
SG_DRIVE_FOLDER_ID = "1L5tD47hvCy20UIXAY4gml4D3aMOun7Vc"
BUFFER_TARGET_DAYS = 7
BUFFER_TARGET_POSTS = BUFFER_TARGET_DAYS * 4  # 4 per day target = 28
# Per-day mix Dusty wants: 2 FB photos + 1 video + 1 LinkedIn.
# This script generates FB photos only, but the buffer counts ALL
# pending content for the next 7 days so we don't overgenerate when
# videos/LI also have drafts in the queue.
SG_ENV_PATH = Path("/home/dustin/sprinkler-guard/.env")
PORTAL_ENV_PATH = (
    Path(__file__).resolve().parent.parent / ".env.local"
)


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
    path = (
        f"/rest/v1/clients?slug=eq.{urllib.parse.quote(slug)}"
        "&select=id,slug,name,drive_folder_id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data[0] if isinstance(data, list) and data else None


def count_buffer(client_id: str, *, base_url: str, service_key: str) -> int:
    """Count draft+approved posts scheduled in the next 7 days."""
    now_iso = datetime.now(timezone.utc).isoformat()
    later_iso = (datetime.now(timezone.utc) + timedelta(days=BUFFER_TARGET_DAYS)).isoformat()
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&status=in.(draft,approved)"
        f"&scheduled_at=gte.{urllib.parse.quote(now_iso)}"
        f"&scheduled_at=lt.{urllib.parse.quote(later_iso)}"
        "&select=id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return len(data) if isinstance(data, list) else 0


def file_already_ingested(
    base_name: str, *, client_id: str, base_url: str, service_key: str
) -> bool:
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&title=eq.{urllib.parse.quote(base_name)}&select=id"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return isinstance(data, list) and len(data) > 0


def slugify_topic(topic: str) -> str:
    s = topic.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-")[:60] or "post"


def derive_filename(json_data: dict, slot: str, file_date: Optional[str] = None) -> str:
    """Build the Drive filename per Dusty's convention: '<date> - AM|PM - <topic>'."""
    d = file_date or json_data.get("date") or datetime.now(timezone.utc).date().isoformat()
    label = "AM" if slot.lower() == "morning" else "PM"
    topic_slug = slugify_topic(json_data.get("topic", "post"))
    return f"{d} - {label} - {topic_slug}"


def derive_scheduled_at(slot: str, scheduled_date: str) -> str:
    """ISO timestamptz in PT for the slot. AM=09:00, PM=15:00."""
    time_str = "09:00:00" if slot.lower() == "morning" else "15:00:00"
    return f"{scheduled_date}T{time_str}-07:00"


def generate_image(prompt: str, output_path: Path, api_key: str, retries: int = 3) -> bool:
    """Generate a 4:5 aspect, ~1K resolution image via Gemini and write to output_path."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model="gemini-3.1-flash-image-preview",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"],
                    image_config=types.ImageConfig(aspect_ratio="4:5", image_size="1K"),
                ),
            )
            for part in response.parts:
                if part.inline_data is not None:
                    image = part.as_image()
                    image.save(str(output_path))
                    print(f"  Image generated: {output_path} ({output_path.stat().st_size} bytes)")
                    return True
            print(f"  [attempt {attempt + 1}] no image in response parts", file=sys.stderr)
        except Exception as e:
            print(f"  [attempt {attempt + 1}] image gen failed: {e}", file=sys.stderr)
        if attempt < retries - 1:
            time.sleep(5)
    return False


def gog_upload(
    local_path: Path, drive_folder_id: str, drive_name: str, gog_path: str
) -> Optional[str]:
    """Upload via gog drive upload. Returns the new Drive file ID on success."""
    cmd = [
        gog_path,
        "drive",
        "upload",
        str(local_path),
        "--parent",
        drive_folder_id,
        "--name",
        drive_name,
        "--json",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  gog drive upload failed: {result.stderr.strip()}", file=sys.stderr)
        return None
    try:
        payload = json.loads(result.stdout) if result.stdout.strip() else {}
        f = payload.get("file") if isinstance(payload, dict) else payload
        if isinstance(f, dict) and "id" in f:
            return f["id"]
    except json.JSONDecodeError:
        pass
    return None


def insert_content_item(
    *,
    client_id: str,
    drive_file_id: str,
    title: str,
    body: str,
    comments: list,
    platform: str,
    scheduled_at: str,
    base_url: str,
    service_key: str,
) -> dict:
    body_payload = {
        "client_id": client_id,
        "drive_file_id": drive_file_id,
        "title": title[:200],
        "body": body,
        "comments": comments,
        "platform": platform,
        "status": "draft",
        "scheduled_at": scheduled_at,
        "media_type": "image",
    }
    return supabase_request(
        "POST",
        "/rest/v1/content_items",
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=representation"},
        body=body_payload,
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--json-path", required=True, help="Path to draft JSON from sg-content-gen")
    parser.add_argument(
        "--slot",
        choices=["morning", "evening"],
        default=None,
        help="Slot override (default: read from JSON 'slot' field, or 'morning')",
    )
    parser.add_argument(
        "--scheduled-date",
        help="YYYY-MM-DD override for the post date (default: JSON 'date' or today)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Plan only, no writes")
    parser.add_argument(
        "--skip-if-buffer-full",
        action="store_true",
        help="Exit 0 silently if buffer already has 14+ pending in next 7 days",
    )
    parser.add_argument("--gog", default=GOG_DEFAULT)
    args = parser.parse_args()

    gog_path = args.gog if Path(args.gog).exists() else (shutil.which("gog") or args.gog)

    load_env_file(SG_ENV_PATH)
    load_env_file(PORTAL_ENV_PATH)
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not (base_url and service_key and gemini_key):
        print("ERROR: missing env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY)")
        return 1

    json_path = Path(args.json_path)
    if not json_path.exists():
        print(f"ERROR: draft JSON not found at {json_path}")
        return 1
    data = json.loads(json_path.read_text())

    slot = args.slot or data.get("slot") or "morning"
    scheduled_date = args.scheduled_date or data.get("date") or date.today().isoformat()
    base_name = derive_filename(data, slot, scheduled_date)
    drive_filename = f"{base_name}.png"
    scheduled_at = derive_scheduled_at(slot, scheduled_date)

    client = find_client_by_slug(SG_CLIENT_SLUG, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{SG_CLIENT_SLUG}'")
        return 1

    if args.skip_if_buffer_full:
        buffer = count_buffer(client["id"], base_url=base_url, service_key=service_key)
        print(f"Buffer: {buffer}/{BUFFER_TARGET_POSTS} drafts in next {BUFFER_TARGET_DAYS} days.")
        if buffer >= BUFFER_TARGET_POSTS:
            print("Buffer full. Skipping generation.")
            return 0

    if file_already_ingested(
        base_name, client_id=client["id"], base_url=base_url, service_key=service_key
    ):
        print(f"Already in portal: {base_name}. Skipping.")
        return 0

    print(f"Plan: {drive_filename}")
    print(f"  scheduled_at: {scheduled_at}")
    print(f"  caption length: {len(data.get('caption', ''))} chars")
    print(f"  comments: {len(data.get('comments', []))}")
    if args.dry_run:
        print("Dry run. Re-run without --dry-run to publish.")
        return 0

    print("Generating image via Gemini...")
    with tempfile.TemporaryDirectory() as td:
        img_path = Path(td) / drive_filename
        ok = generate_image(data["image_prompt"], img_path, gemini_key)
        if not ok:
            print("ERROR: image generation failed")
            return 1

        print(f"Uploading to Drive folder {SG_DRIVE_FOLDER_ID}...")
        drive_id = gog_upload(img_path, SG_DRIVE_FOLDER_ID, drive_filename, gog_path)
        if not drive_id:
            print("ERROR: Drive upload failed")
            return 1
        print(f"  drive_file_id: {drive_id}")

    print("Inserting content_items row...")
    inserted = insert_content_item(
        client_id=client["id"],
        drive_file_id=drive_id,
        title=base_name,
        body=data.get("caption", ""),
        comments=data.get("comments", []),
        platform="facebook",
        scheduled_at=scheduled_at,
        base_url=base_url,
        service_key=service_key,
    )
    if isinstance(inserted, list) and inserted:
        print(f"  content_items.id = {inserted[0].get('id')}")
    print("Done. Awaiting Ken's review.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
