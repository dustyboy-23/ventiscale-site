#!/usr/bin/env python3
"""
Weekly retention cleanup for audit_leads.

Deletes audit_leads rows older than 180 days. The audit_leads table holds
PII captured at the public audit form (name, email, IP, user-agent, notes);
180 days is the retention window agreed in the privacy review.

Service role bypasses the RLS deny policies so this operates regardless of
the table's user-facing policies.

Cron: 0 3 * * 0 (Sundays 3 AM PT, weekly).

Usage:
  python3 scripts/prune-audit-leads.py
  python3 scripts/prune-audit-leads.py --dry-run
"""

import argparse
import json
import sys
import urllib.request
from pathlib import Path

PORTAL_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PORTAL_ROOT / ".env.local"

RETENTION_DAYS = 180


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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    env = load_env(ENV_PATH)
    url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    key = env.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("ERROR: missing Supabase keys in .env.local", file=sys.stderr)
        sys.exit(1)

    H = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    # PostgREST filter: received_at < (now - 180 days). Use 'lt' with an
    # ISO interval expression isn't supported; compute the cutoff client-side.
    from datetime import datetime, timedelta, timezone
    from urllib.parse import quote
    cutoff = (datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)).isoformat()
    cutoff = quote(cutoff, safe="")

    # Count first
    count_req = urllib.request.Request(
        f"{url}/rest/v1/audit_leads?select=id&received_at=lt.{cutoff}",
        headers={**H, "Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"},
    )
    try:
        with urllib.request.urlopen(count_req) as r:
            content_range = r.headers.get("Content-Range", "*/0")
            total = int(content_range.rsplit("/", 1)[-1]) if "/" in content_range else 0
    except urllib.error.HTTPError as e:
        print(f"count failed: {e.code} {e.read().decode()[:200]}", file=sys.stderr)
        sys.exit(1)

    print(f"audit_leads older than {RETENTION_DAYS}d: {total}")
    if args.dry_run or total == 0:
        return

    del_req = urllib.request.Request(
        f"{url}/rest/v1/audit_leads?received_at=lt.{cutoff}",
        headers={**H, "Prefer": "return=minimal"},
        method="DELETE",
    )
    try:
        urllib.request.urlopen(del_req).read()
        print(f"  ✓ deleted {total} rows")
    except urllib.error.HTTPError as e:
        print(f"delete failed: {e.code} {e.read().decode()[:200]}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
