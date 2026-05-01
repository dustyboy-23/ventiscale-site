#!/bin/bash
# supabase-keepalive.sh — prevents Supabase free-tier 7-day inactivity auto-pause.
# Runs every 2 days, hits one REST query to reset the inactivity timer.

set -euo pipefail

VS_DIR="/home/dustin/venti-scale/portal"
WS_DIR="/home/dustin/venti-scale"
JOB_ID="supabase-keepalive"

# Load env
set -a
# shellcheck disable=SC1091
source "$VS_DIR/.env.local"
set +a

# Probe: select one row from clients. Real DB query, minimal payload.
HTTP_CODE=$(curl -s -o /tmp/supabase-keepalive-body.txt -w "%{http_code}" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/clients?select=id&limit=1" || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "[$(date -Iseconds)] supabase-keepalive OK (HTTP 200)"
  bash "$WS_DIR/ops/scripts/cron-notify.sh" success "$JOB_ID" 2>/dev/null || true
  exit 0
else
  echo "[$(date -Iseconds)] supabase-keepalive FAILED (HTTP $HTTP_CODE)"
  cat /tmp/supabase-keepalive-body.txt || true
  bash "$WS_DIR/ops/scripts/cron-notify.sh" failure "$JOB_ID" "HTTP $HTTP_CODE" 2>/dev/null || true
  exit 1
fi
