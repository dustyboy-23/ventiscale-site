#!/usr/bin/env python3
"""
Publishes a client report to the Venti Scale portal (client_reports table).

Takes a standalone HTML file — the file should be a complete <!doctype html>
document with its own <style>, because the portal viewer renders it as an
iframe srcDoc for full CSS isolation.

Usage:
  python3 scripts/publish-report.py \
    --client sprinkler-guard \
    --type client \
    --title "Weekly Performance Report" \
    --period-start 2026-04-05 \
    --period-end 2026-04-11 \
    --html-file docs/reports/sg-2026-04-11.html \
    --summary "Revenue +12% WoW, conversion still the bottleneck"

Types: client | seo | baseline | internal
"""

import os
import sys
import json
import argparse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


# ──────────────────────────────────────────────────────────────
# Client slug -> client_id map. Same source of truth as pull-client-metrics.
# Move to a DB lookup when client #3 lands.
# ──────────────────────────────────────────────────────────────
CLIENT_IDS = {
    "sprinkler-guard": "12baae15-9b58-464e-9b21-a15f375ff979",
}

VALID_TYPES = {"client", "seo", "baseline", "internal"}


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


VENTI_ROOT = Path(__file__).resolve().parents[1]
VENTI_ENV = load_env(VENTI_ROOT / ".env.local")


def insert_report(payload: dict) -> dict:
    url = VENTI_ENV.get("NEXT_PUBLIC_SUPABASE_URL")
    key = VENTI_ENV.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ventiscale/.env.local"
        )

    endpoint = f"{url}/rest/v1/client_reports"
    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode(),
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        body = r.read().decode()
        if r.status >= 300:
            raise RuntimeError(f"Supabase insert failed: {r.status} {body}")
        rows = json.loads(body)
        return rows[0] if rows else {}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--client", required=True, help="Client slug")
    parser.add_argument("--type", required=True, choices=sorted(VALID_TYPES))
    parser.add_argument("--title", required=True)
    parser.add_argument("--period-start", help="YYYY-MM-DD")
    parser.add_argument("--period-end", help="YYYY-MM-DD")
    parser.add_argument("--summary", default=None)
    parser.add_argument("--html-file", required=True, help="Path to standalone HTML file")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    client_id = CLIENT_IDS.get(args.client)
    if not client_id:
        print(f"Unknown client: {args.client}", file=sys.stderr)
        print(f"Known: {', '.join(CLIENT_IDS.keys())}", file=sys.stderr)
        sys.exit(1)

    html_path = Path(args.html_file)
    if not html_path.exists():
        print(f"HTML file not found: {html_path}", file=sys.stderr)
        sys.exit(1)
    html_body = html_path.read_text()

    payload = {
        "client_id": client_id,
        "type": args.type,
        "title": args.title,
        "period_start": args.period_start,
        "period_end": args.period_end,
        "summary": args.summary,
        "html_body": html_body,
        "published_at": datetime.now(timezone.utc).isoformat(),
    }

    print(f"[publish-report] client={args.client} type={args.type} title={args.title!r}")
    print(f"  html: {html_path} ({len(html_body)} bytes)")
    if args.period_start or args.period_end:
        print(f"  period: {args.period_start} → {args.period_end}")

    if args.dry_run:
        print("[publish-report] dry-run, not inserting")
        return

    row = insert_report(payload)
    report_id = row.get("id")
    print(f"[publish-report] ✓ published id={report_id}")
    if report_id:
        print(f"  url: https://www.ventiscale.com/reports/{report_id}")


if __name__ == "__main__":
    main()
