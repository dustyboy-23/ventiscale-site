#!/usr/bin/env python3
"""
Apply M1 RLS deny migration via Supabase Management API.

Cloudflare WAF blocks default Python urllib UA on api.supabase.com,
so use a Mozilla UA. Reads SUPABASE_ACCESS_TOKEN + project ref from
.env.local.

Usage:
  python3 scripts/apply-m1-rls-deny.py
  python3 scripts/apply-m1-rls-deny.py --dry-run
"""

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

PORTAL_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PORTAL_ROOT / ".env.local"
MIGRATION_PATH = PORTAL_ROOT / "supabase" / "migrations" / "20260428_04_rls_deny_writes_audit_log.sql"


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
    token = env.get("SUPABASE_ACCESS_TOKEN")
    project_url = env.get("NEXT_PUBLIC_SUPABASE_URL", "")
    if not token or not project_url:
        print("ERROR: SUPABASE_ACCESS_TOKEN or NEXT_PUBLIC_SUPABASE_URL missing in .env.local", file=sys.stderr)
        sys.exit(1)

    project_ref = project_url.replace("https://", "").split(".")[0]
    sql = MIGRATION_PATH.read_text()

    print(f"Target: project ref={project_ref}")
    print(f"Migration: {MIGRATION_PATH.name} ({len(sql)} chars)")

    if args.dry_run:
        print("--- SQL to apply ---")
        print(sql)
        print("--- end SQL ---")
        return

    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{project_ref}/database/query",
        method="POST",
        data=json.dumps({"query": sql}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
        },
    )
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read().decode("utf-8")
            print(f"OK ({r.status})")
            if body.strip():
                print(body)
    except urllib.error.HTTPError as e:
        print(f"FAILED ({e.code}): {e.read().decode()[:500]}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
