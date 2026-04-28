#!/usr/bin/env python3
"""
Pull per-post engagement metrics for published Sprinkler Guard content
and write them onto the content_items.metrics jsonb column.

For Facebook posts (platform='facebook' AND mime image OR video):
    GET /<post_id> with fields = likes.summary(true), comments.summary(true),
    shares, reactions.summary(true)
    For videos: also GET /<video_id>/video_insights for views

For LinkedIn posts (platform='linkedin'):
    LI Marketing API socialActions endpoint for likes/comments counts.
    Skip if no LI access (some scopes need org-level read).

Skips rows synced in the last 30 minutes (--min-stale-minutes default).
Skips rows without an external_id (can't query without the post ID).

Usage:
    python scripts/sg-pull-post-metrics.py
    python scripts/sg-pull-post-metrics.py --dry-run
    python scripts/sg-pull-post-metrics.py --min-stale-minutes 60

Cron suggestion (every 6h, low API cost):
    7 */6 * * * /usr/bin/python3 scripts/sg-pull-post-metrics.py
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


def list_published_due(client_id, min_stale_minutes, *, base_url, service_key):
    cutoff = (datetime.now(timezone.utc) - timedelta(minutes=min_stale_minutes)).isoformat()
    # Want published rows with external_id where metrics_synced_at is null OR older than cutoff
    path = (
        f"/rest/v1/content_items?client_id=eq.{client_id}"
        f"&status=eq.published&external_id=not.is.null"
        f"&or=(metrics_synced_at.is.null,metrics_synced_at.lt.{urllib.parse.quote(cutoff)})"
        "&select=id,platform,external_id,published_at,title"
        "&order=published_at.desc&limit=100"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    return data if isinstance(data, list) else []


def graph_get(path: str, params: dict, token: str) -> Optional[dict]:
    qs = urllib.parse.urlencode({**params, "access_token": token})
    url = f"https://graph.facebook.com/{GRAPH_VERSION}/{path}?{qs}"
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        print(f"  ! Graph {path} {exc.code}: {exc.read().decode()[:200]}", file=sys.stderr)
        return None
    except Exception as exc:
        print(f"  ! Graph {path} error: {exc}", file=sys.stderr)
        return None


def fb_post_metrics(post_id: str, token: str) -> dict:
    """Fetch likes/comments/shares/reactions for a FB post or video.
    Post IDs from /photos look like '<page>_<post>'; from /videos
    they're just the video id. We try the post fields first; if the
    fb_post_id looks like a video (no underscore), we also pull
    video_insights for views."""
    out: dict = {}
    fields = "reactions.summary(true),comments.summary(true),shares"
    data = graph_get(post_id, {"fields": fields}, token)
    if data:
        reactions = data.get("reactions", {}).get("summary", {})
        if reactions:
            out["reactions"] = reactions.get("total_count", 0)
        comments = data.get("comments", {}).get("summary", {})
        if comments:
            out["comments"] = comments.get("total_count", 0)
        shares = data.get("shares")
        if shares:
            out["shares"] = shares.get("count", 0)

    # If this looks like a bare video id (no underscore), pull views
    if "_" not in post_id:
        insights = graph_get(post_id, {"metric": "total_video_views"}, token)
        if insights and isinstance(insights.get("data"), list):
            for m in insights["data"]:
                if m.get("name") == "total_video_views":
                    values = m.get("values", [])
                    if values:
                        out["video_views"] = values[0].get("value", 0)
    return out


def li_post_metrics(urn: str, li_token: str) -> dict:
    """LinkedIn's social actions endpoint returns like + comment counts
    for a given share URN. Reposts and impressions need the analytics
    API which has a higher scope bar; we skip them for now and just
    pull what's in reach."""
    if not urn or not urn.startswith("urn:li:"):
        return {}
    encoded = urllib.parse.quote(urn, safe="")
    url = f"https://api.linkedin.com/rest/socialActions/{encoded}"
    headers = {
        "Authorization": f"Bearer {li_token}",
        "LinkedIn-Version": "202405",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    req = urllib.request.Request(url, method="GET", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            return {
                "likes": data.get("likesSummary", {}).get("totalLikes", 0),
                "comments": data.get("commentsSummary", {}).get("totalFirstLevelComments", 0),
            }
    except urllib.error.HTTPError as exc:
        # 401/403 likely missing scope, skip silently
        if exc.code in (401, 403):
            return {}
        print(f"  ! LI socialActions {exc.code}: {exc.read().decode()[:200]}", file=sys.stderr)
        return {}
    except Exception as exc:
        print(f"  ! LI metrics error: {exc}", file=sys.stderr)
        return {}


def update_metrics(row_id, metrics, *, base_url, service_key) -> None:
    supabase_request(
        "PATCH",
        f"/rest/v1/content_items?id=eq.{row_id}",
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=minimal"},
        body={
            "metrics": metrics,
            "metrics_synced_at": datetime.now(timezone.utc).isoformat(),
        },
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--min-stale-minutes", type=int, default=30)
    parser.add_argument("--max", type=int, default=50)
    args = parser.parse_args()

    load_env_file(SG_ENV_PATH)
    load_env_file(PORTAL_ENV_PATH)
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    fb_token = os.environ.get("SG_PAGE_TOKEN", "")
    li_token = os.environ.get("LI_ACCESS_TOKEN", "")
    if not (base_url and service_key):
        print("ERROR: portal env not loaded")
        return 1

    client = find_client_by_slug(SG_CLIENT_SLUG, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{SG_CLIENT_SLUG}'")
        return 1

    rows = list_published_due(
        client["id"], args.min_stale_minutes, base_url=base_url, service_key=service_key
    )
    if not rows:
        print(f"No published posts due for metrics refresh (stale > {args.min_stale_minutes} min).")
        return 0

    print(f"Refreshing metrics for {len(rows)} post(s)...")
    refreshed = 0
    skipped = 0

    for row in rows[: args.max]:
        title = (row.get("title") or "")[:60]
        platform = row["platform"]
        ext_id = row["external_id"]
        if not ext_id:
            skipped += 1
            continue

        metrics: dict = {}
        if platform == "facebook":
            if not fb_token:
                print(f"  [skip] {title}  no SG_PAGE_TOKEN")
                skipped += 1
                continue
            metrics = fb_post_metrics(ext_id, fb_token)
        elif platform == "linkedin":
            if not li_token:
                print(f"  [skip] {title}  no LI_ACCESS_TOKEN")
                skipped += 1
                continue
            metrics = li_post_metrics(ext_id, li_token)
        else:
            skipped += 1
            continue

        if not metrics:
            print(f"  [empty] {title}  ({platform})")
        else:
            print(f"  -> {title}  ({platform})  {metrics}")

        if args.dry_run:
            continue
        update_metrics(row["id"], metrics, base_url=base_url, service_key=service_key)
        refreshed += 1

    print(f"\nRefreshed {refreshed}  skipped {skipped}.")
    if args.dry_run:
        print("Dry run.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
