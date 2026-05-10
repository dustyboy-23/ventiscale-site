#!/usr/bin/env python3
"""
aggregate-team-metrics.py — daily rollup of client_metrics into team_performance_snapshots.

Runs as cron at 00:30 PT daily. For each team, aggregates managed clients'
metrics for "yesterday" into one row in team_performance_snapshots. Idempotent
via UNIQUE(team_id, snapshot_date) — re-runs upsert.

Schema dependency: 20260509_01_agency_layer.sql (teams/team_clients/team_performance_snapshots)
Plan: ~/.claude/plans/so-i-want-you-synchronous-emerson.md (Phase 2.3)

Sources for cron_failures_today: parses today's run-logs across all repos for
"=== exit=N ===" markers, mirroring the cron-failure-tally.sh logic.
"""
import os
import sys
import json
import subprocess
from datetime import date, datetime, timedelta
from pathlib import Path

# Load env from .env.local in portal repo (Supabase service-role key + URL)
ENV_PATH = Path("/home/dustin/venti-scale/portal/.env.local")
if not ENV_PATH.exists():
    print(f"ERR: {ENV_PATH} not found", file=sys.stderr)
    sys.exit(1)

env = {}
for line in ENV_PATH.read_text().splitlines():
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    if "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip("'\"")

SUPABASE_URL = env.get("NEXT_PUBLIC_SUPABASE_URL") or env.get("SUPABASE_URL")
SERVICE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SERVICE_KEY:
    print("ERR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local", file=sys.stderr)
    sys.exit(1)


def supabase_request(method: str, path: str, body=None) -> dict:
    """Minimal HTTP client for Supabase REST API. Uses service-role to bypass RLS."""
    import urllib.request
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    url = f"{SUPABASE_URL}/rest/v1{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode() or "[]")
    except Exception as e:
        print(f"ERR: Supabase {method} {path} → {e}", file=sys.stderr)
        return None


def count_cron_failures_today() -> int:
    """Walk cron.log files modified in last 24h, count non-zero exit markers."""
    repos = [
        "/home/dustin/jarvis",
        "/home/dustin/personal-brand",
        "/home/dustin/iron-paws",
        "/home/dustin/sprinkler-guard",
        "/home/dustin/venti-scale",
        "/home/dustin/aaf",
        "/home/dustin/skool",
        "/home/dustin/money-engine",
    ]
    total = 0
    for repo in repos:
        if not os.path.isdir(repo):
            continue
        try:
            result = subprocess.run(
                ["find", repo, "-name", "cron*.log", "-mtime", "-1", "-type", "f"],
                capture_output=True, text=True, timeout=10,
            )
            for logfile in result.stdout.strip().split("\n"):
                if not logfile:
                    continue
                try:
                    with open(logfile, "r", errors="ignore") as f:
                        # Last 500 lines only
                        lines = f.readlines()[-500:]
                    for line in lines:
                        if line.startswith("=== exit=") and "exit=0 ===" not in line:
                            total += 1
                except Exception:
                    pass
        except Exception:
            pass
    return total


def aggregate_for_team(team_id: str, snapshot_date: date) -> dict:
    """Aggregate metrics for one team across its managed clients for the given date."""
    # Fetch team_clients
    tc = supabase_request("GET", f"/team_clients?select=client_id&team_id=eq.{team_id}")
    if tc is None:
        return None
    client_ids = [row["client_id"] for row in tc]
    if not client_ids:
        return {
            "team_id": team_id,
            "snapshot_date": snapshot_date.isoformat(),
            "total_reach": 0,
            "total_engagement": 0,
            "total_published": 0,
            "avg_roas": None,
            "cron_failures_today": count_cron_failures_today(),
            "metadata": {"note": "no managed clients"},
        }

    client_filter = ",".join(client_ids)
    period = snapshot_date.isoformat()

    # Sum reach + engagement across all managed clients for the period
    metrics = supabase_request(
        "GET",
        f"/client_metrics?select=metric_name,metric_value,client_id"
        f"&client_id=in.({client_filter})&period=eq.{period}",
    )
    metrics = metrics or []

    total_reach = sum(m["metric_value"] for m in metrics if m.get("metric_name") == "reach" and m.get("metric_value"))
    total_engagement = sum(m["metric_value"] for m in metrics if m.get("metric_name") == "engagement" and m.get("metric_value"))
    roas_values = [m["metric_value"] for m in metrics if m.get("metric_name") == "roas" and m.get("metric_value")]
    avg_roas = sum(roas_values) / len(roas_values) if roas_values else None

    # Posts published yesterday
    start_iso = f"{period}T00:00:00Z"
    end_iso = f"{period}T23:59:59Z"
    content = supabase_request(
        "GET",
        f"/content_items?select=id&client_id=in.({client_filter})"
        f"&status=eq.published&published_at=gte.{start_iso}&published_at=lte.{end_iso}",
    )
    total_published = len(content or [])

    return {
        "team_id": team_id,
        "snapshot_date": snapshot_date.isoformat(),
        "total_reach": int(total_reach) if total_reach else 0,
        "total_engagement": int(total_engagement) if total_engagement else 0,
        "total_published": total_published,
        "avg_roas": round(avg_roas, 2) if avg_roas is not None else None,
        "cron_failures_today": count_cron_failures_today(),
        "metadata": {"client_count": len(client_ids)},
    }


def main():
    snapshot_date = date.today() - timedelta(days=1)  # rollup is for "yesterday"

    teams = supabase_request("GET", "/teams?select=id,name,slug")
    if teams is None:
        print("ERR: failed to fetch teams", file=sys.stderr)
        sys.exit(2)

    print(f"[aggregate-team-metrics] {len(teams)} team(s), snapshot date {snapshot_date}")

    written = 0
    for team in teams:
        snapshot = aggregate_for_team(team["id"], snapshot_date)
        if snapshot is None:
            print(f"  ✗ {team['slug']}: aggregation failed", file=sys.stderr)
            continue

        # Upsert via Prefer: resolution=merge-duplicates would need it; use a manual delete+insert keyed on UNIQUE
        # Simpler: POST with Prefer: resolution=merge-duplicates
        url = f"/team_performance_snapshots?on_conflict=team_id,snapshot_date"
        import urllib.request
        headers = {
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        }
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1{url}",
            data=json.dumps(snapshot).encode(),
            headers=headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status in (200, 201):
                    written += 1
                    print(f"  ✓ {team['slug']}: published={snapshot['total_published']} cron_fails={snapshot['cron_failures_today']}")
        except Exception as e:
            print(f"  ✗ {team['slug']}: upsert failed → {e}", file=sys.stderr)

    print(f"[aggregate-team-metrics] {written}/{len(teams)} snapshots written")


if __name__ == "__main__":
    main()
