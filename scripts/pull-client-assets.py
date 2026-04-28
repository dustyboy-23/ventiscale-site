#!/usr/bin/env python3
"""
Pull client-facing assets from Drive + Supabase (LinkedIn) + WordPress (blog)
and cache the merged snapshot on clients.assets_cache (jsonb).

Cron: every 6 hours via crontab.
Read by: app/(portal)/files/page.tsx — server-rendered, no Drive sign-in needed.

Phase 1: Sprinkler Guard only. When client #2 lands, generalize via clients table.

Usage:
  python3 scripts/pull-client-assets.py
  python3 scripts/pull-client-assets.py --client sprinkler-guard
  python3 scripts/pull-client-assets.py --dry-run
"""

import argparse
import json
import os
import subprocess
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path


PORTAL_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PORTAL_ROOT / ".env.local"
GOG_PATH = "/home/dustin/.local/bin/gog"

CLIENT_CONFIG = {
    "sprinkler-guard": {
        "client_id": "12baae15-9b58-464e-9b21-a15f375ff979",
        "drive_folders": [
            ("photos",          "1L5tD47hvCy20UIXAY4gml4D3aMOun7Vc"),
            ("videos_approved", "1ifTmB9zkh6tMFDPNlE3a0ZszO3Upe2Va"),
            ("videos_posted",   "11BpV3GhVp2T12vVYlj9yZp9fOnjV7LQQ"),
        ],
        "blog_url":     "https://grassholesystem.com",
        "linkedin_org": None,  # we read from content_items (posted rows) so no org id needed
    },
}


def load_env(path: Path) -> dict:
    env = {}
    if not path.exists():
        return env
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


# ─────────────────────────────────────────────
# Drive: list files in a folder via gog (already authed to dustin@ventiscale.com)
# ─────────────────────────────────────────────
def drive_ls(folder_id: str) -> list[dict]:
    """List files in a Drive folder. Returns [{id,name,mimeType,modifiedTime,size,webViewLink}]."""
    try:
        result = subprocess.run(
            [GOG_PATH, "drive", "ls",
             "--parent", folder_id, "--max", "100",
             "--json", "--results-only"],
            capture_output=True, text=True, timeout=60,
        )
        if result.returncode != 0:
            print(f"  gog ls failed for {folder_id}: {result.stderr[:200]}", file=sys.stderr)
            return []
        rows = json.loads(result.stdout) if result.stdout.strip() else []
        return rows if isinstance(rows, list) else []
    except Exception as e:
        print(f"  gog ls error for {folder_id}: {e}", file=sys.stderr)
        return []


def normalize_drive_file(f: dict, source: str) -> dict:
    """Reduce gog Drive listing to the fields the portal renders."""
    fid = f.get("id", "")
    mime = f.get("mimeType", "")
    is_video = "video" in mime
    is_image = "image" in mime
    return {
        "source": source,
        "id": fid,
        "name": f.get("name", "untitled"),
        "mime": mime,
        "kind": "video" if is_video else ("image" if is_image else "file"),
        "size": int(f["size"]) if f.get("size") else None,
        "updated_at": f.get("modifiedTime"),
        "url": f.get("webViewLink") or (f"https://drive.google.com/file/d/{fid}/view" if fid else None),
        "thumbnail_url": f.get("thumbnailLink"),
    }


# ─────────────────────────────────────────────
# LinkedIn posts (from Supabase content_items, status=posted)
# ─────────────────────────────────────────────
def fetch_linkedin_posts(client_id: str, env: dict) -> list[dict]:
    url = env["NEXT_PUBLIC_SUPABASE_URL"]
    key = env["SUPABASE_SERVICE_ROLE_KEY"]
    req = urllib.request.Request(
        f"{url}/rest/v1/content_items?client_id=eq.{client_id}"
        f"&platform=eq.linkedin&status=eq.published"
        f"&select=id,title,body,scheduled_at,published_at,external_id"
        f"&order=published_at.desc.nullslast,scheduled_at.desc&limit=30",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
    )
    try:
        rows = json.loads(urllib.request.urlopen(req, timeout=30).read())
    except Exception as e:
        print(f"  LI fetch error: {e}", file=sys.stderr)
        return []
    out = []
    for r in rows:
        body = (r.get("body") or "").strip()
        snippet = " ".join(body.split())[:200]
        ext_id = r.get("external_id")
        # LI activity ID → public post URL (urn:li:activity:NNN)
        post_url = (
            f"https://www.linkedin.com/feed/update/urn:li:activity:{ext_id}/"
            if ext_id else None
        )
        out.append({
            "source": "linkedin",
            "id": r["id"],
            "name": r.get("title") or snippet[:80] or "LinkedIn post",
            "snippet": snippet,
            "kind": "linkedin_post",
            "updated_at": r.get("published_at") or r.get("scheduled_at"),
            "url": post_url,
        })
    return out


# ─────────────────────────────────────────────
# Blog posts (from WP REST — public, no auth)
# ─────────────────────────────────────────────
def fetch_blog_posts(blog_url: str) -> list[dict]:
    if not blog_url:
        return []
    api = (
        f"{blog_url}/wp-json/wp/v2/posts"
        f"?per_page=20&orderby=date&order=desc"
        f"&_fields=id,date,modified,slug,link,title,excerpt,featured_media"
    )
    try:
        req = urllib.request.Request(api, headers={"User-Agent": "Jarvis/1.0"})
        rows = json.loads(urllib.request.urlopen(req, timeout=30).read())
    except Exception as e:
        print(f"  WP REST fetch error: {e}", file=sys.stderr)
        return []
    out = []
    for r in rows:
        title = (r.get("title") or {}).get("rendered", "Untitled")
        # Strip HTML entities from title
        title = (title.replace("&#8217;", "'").replace("&#8211;", "-")
                 .replace("&amp;", "&").replace("&#038;", "&"))
        excerpt = (r.get("excerpt") or {}).get("rendered", "")
        # Crude HTML strip for snippet
        import re
        snippet = re.sub(r"<[^>]+>", "", excerpt).strip()
        snippet = " ".join(snippet.split())[:200]
        out.append({
            "source": "blog",
            "id": r.get("id"),
            "name": title,
            "snippet": snippet,
            "kind": "blog_post",
            "updated_at": r.get("modified") or r.get("date"),
            "url": r.get("link"),
            "slug": r.get("slug"),
        })
    return out


# ─────────────────────────────────────────────
# Persist to clients.assets_cache
# ─────────────────────────────────────────────
def persist(client_id: str, payload: dict, env: dict):
    """Upload JSON snapshot to Supabase Storage bucket 'client-assets'."""
    url = env["NEXT_PUBLIC_SUPABASE_URL"]
    key = env["SUPABASE_SERVICE_ROLE_KEY"]
    body = json.dumps(payload).encode()
    obj_path = f"{client_id}.json"
    req = urllib.request.Request(
        f"{url}/storage/v1/object/client-assets/{obj_path}",
        data=body,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "x-upsert": "true",
        },
        method="POST",
    )
    urllib.request.urlopen(req, timeout=30).read()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--client", default=None, help="client slug (default: all configured)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    env = load_env(ENV_PATH)
    if not env.get("NEXT_PUBLIC_SUPABASE_URL") or not env.get("SUPABASE_SERVICE_ROLE_KEY"):
        print("ERROR: portal .env.local missing Supabase keys", file=sys.stderr)
        sys.exit(1)

    targets = [args.client] if args.client else list(CLIENT_CONFIG.keys())
    for slug in targets:
        cfg = CLIENT_CONFIG.get(slug)
        if not cfg:
            print(f"ERROR: unknown client slug: {slug}", file=sys.stderr)
            continue

        print(f"=== {slug} ({cfg['client_id'][:8]}…) ===")

        items_by_source = {}

        for source_name, folder_id in cfg["drive_folders"]:
            print(f"  Drive · {source_name}")
            files = drive_ls(folder_id)
            normalized = [normalize_drive_file(f, source_name) for f in files]
            items_by_source[source_name] = normalized
            print(f"    → {len(normalized)} items")

        print("  LinkedIn posts (posted)")
        li = fetch_linkedin_posts(cfg["client_id"], env)
        items_by_source["linkedin"] = li
        print(f"    → {len(li)} items")

        print("  Blog posts (WP REST)")
        blog = fetch_blog_posts(cfg.get("blog_url"))
        items_by_source["blog"] = blog
        print(f"    → {len(blog)} items")

        payload = {
            "version": 1,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "sources": items_by_source,
            "totals": {k: len(v) for k, v in items_by_source.items()},
        }

        if args.dry_run:
            print("--- DRY RUN ---")
            print(json.dumps(payload["totals"], indent=2))
            continue

        persist(cfg["client_id"], payload, env)
        print(f"  ✓ wrote clients.assets_cache for {slug}")


if __name__ == "__main__":
    main()
