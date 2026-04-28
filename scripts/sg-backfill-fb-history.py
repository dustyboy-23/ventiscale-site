#!/usr/bin/env python3
"""
One-shot: pull last 28 days of Sprinkler Guard FB Page posts + engagement
and import as content_items rows at status='published' so the portal
metrics page has historical data.

Idempotent on external_id: skips any FB post id we already have.

Usage:
    python scripts/sg-backfill-fb-history.py
    python scripts/sg-backfill-fb-history.py --days 28
    python scripts/sg-backfill-fb-history.py --dry-run
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

SG_CLIENT_SLUG = "sprinkler-guard"
SG_ENV_PATH = Path("/home/dustin/sprinkler-guard/.env")
PORTAL_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"
GRAPH_VERSION = "v21.0"


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def sb(method, path, *, base_url, key, body=None, headers=None):
    h = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{base_url}{path}", data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:300]
        raise SystemExit(f"Supabase {method} {path}: {e.code} {detail}")


def fb_get(url):
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:500]
        print(f"  FB error {e.code}: {detail}", file=sys.stderr)
        return None


def fb_list_posts(page_id: str, page_token: str, since_ts: int):
    """Page through /{page_id}/posts?since=<unix>. Each page brings up to 25.
    We pull message, created_time, attachments, reactions+comments+shares
    summaries so we can map directly to our metrics jsonb."""
    fields = (
        "id,message,created_time,permalink_url,"
        "attachments{media_type,type,subattachments},"
        "reactions.summary(true).limit(0),"
        "comments.summary(true).limit(0),"
        "shares"
    )
    url = (
        f"https://graph.facebook.com/{GRAPH_VERSION}/{page_id}/posts"
        f"?fields={urllib.parse.quote(fields)}"
        f"&since={since_ts}"
        f"&limit=50"
        f"&access_token={page_token}"
    )
    posts = []
    while url:
        data = fb_get(url)
        if not data:
            break
        posts.extend(data.get("data", []))
        url = data.get("paging", {}).get("next")
    return posts


def detect_media(attachments) -> str:
    """Return 'image' / 'video' / 'text' for our media_type field."""
    if not attachments:
        return "text"
    items = attachments.get("data", [])
    if not items:
        return "text"
    a = items[0]
    mt = (a.get("media_type") or a.get("type") or "").lower()
    if "video" in mt:
        return "video"
    if "photo" in mt or "image" in mt or mt == "album":
        return "image"
    return "text"


def title_from_message(msg: str) -> str:
    if not msg:
        return "(no caption)"
    first_line = msg.strip().split("\n", 1)[0]
    return first_line[:200]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    load_env_file(SG_ENV_PATH)
    load_env_file(PORTAL_ENV_PATH)
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    page_id = os.environ.get("SG_PAGE_ID")
    page_token = os.environ.get("SG_PAGE_TOKEN")
    if not (base_url and key and page_id and page_token):
        print("ERROR: missing env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SG_PAGE_ID, SG_PAGE_TOKEN)")
        return 1

    clients = sb("GET", f"/rest/v1/clients?slug=eq.{SG_CLIENT_SLUG}&select=id", base_url=base_url, key=key)
    if not clients:
        print("ERROR: no SG client row")
        return 1
    cid = clients[0]["id"]

    # Existing FB external_ids to skip
    existing = sb(
        "GET",
        f"/rest/v1/content_items?client_id=eq.{cid}&platform=eq.facebook&external_id=not.is.null&select=external_id",
        base_url=base_url, key=key,
    )
    existing_ids = {r["external_id"] for r in existing}
    print(f"existing FB rows in portal: {len(existing_ids)}")

    since = int((datetime.now(timezone.utc) - timedelta(days=args.days)).timestamp())
    print(f"pulling SG FB posts since {datetime.fromtimestamp(since, timezone.utc).isoformat()} (last {args.days}d)")
    posts = fb_list_posts(page_id, page_token, since)
    print(f"FB returned {len(posts)} posts")

    inserted = 0
    skipped = 0
    for p in posts:
        post_id = p.get("id")
        if not post_id:
            continue
        if post_id in existing_ids:
            skipped += 1
            continue
        message = p.get("message", "") or ""
        created = p.get("created_time")
        media_type = detect_media(p.get("attachments"))
        title = title_from_message(message)

        reactions = (((p.get("reactions") or {}).get("summary") or {}).get("total_count")) or 0
        comments = (((p.get("comments") or {}).get("summary") or {}).get("total_count")) or 0
        shares = ((p.get("shares") or {}).get("count")) or 0

        metrics = {
            "reactions": reactions,
            "comments": comments,
            "shares": shares,
        }

        row = {
            "client_id": cid,
            "platform": "facebook",
            "title": title,
            "body": message[:5000],
            "status": "published",
            "external_id": post_id,
            "published_at": created,
            "scheduled_at": created,  # backfill: scheduled = posted same time
            "media_type": media_type,
            "metrics": metrics,
            "metrics_synced_at": datetime.now(timezone.utc).isoformat(),
        }
        print(f"  [{media_type:5s}]  {created[:10]}  rx={reactions:>4d} c={comments:>3d} s={shares:>3d}  {title[:60]}")
        if args.dry_run:
            inserted += 1
            continue
        try:
            sb("POST", "/rest/v1/content_items", base_url=base_url, key=key, body=row,
               headers={"Prefer": "return=minimal"})
            inserted += 1
        except SystemExit as e:
            print(f"  ! insert failed: {e}", file=sys.stderr)

    print(f"\nSummary: inserted={inserted}  skipped(existing)={skipped}  total_seen={len(posts)}")
    if args.dry_run:
        print("Dry run. Re-run without --dry-run to import.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
