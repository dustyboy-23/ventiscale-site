#!/usr/bin/env python3
"""
Pulls marketing metrics for a Venti Scale portal client and upserts a KPI
snapshot into the client_metrics table.

Usage:
  python3 scripts/pull-client-metrics.py --client sprinkler-guard
  python3 scripts/pull-client-metrics.py --client sprinkler-guard --period 28d
  python3 scripts/pull-client-metrics.py --client sprinkler-guard --dry-run

Phase 3 scope: Sprinkler Guard only. The client -> integration-config map
lives at the top of this file. When we onboard client #3 this should move
to a client_integrations table in Supabase.
"""

import os
import sys
import json
import argparse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path


# ─────────────────────────────────────────────────────────────
# Client integration config (Phase 3: SG only, hardcoded)
# ─────────────────────────────────────────────────────────────
CLIENT_CONFIG = {
    "sprinkler-guard": {
        "client_id": "12baae15-9b58-464e-9b21-a15f375ff979",
        "workspace_root": Path("/home/dustin/sprinkler-guard"),
        "ga4_property_id": "395712117",
        "gsc_site": "sc-domain:grassholesystem.com",
        "meta_ad_account": "act_3047045345618996",
        "wc_store_url": "https://grassholesystem.com",
    },
}

PERIOD_DAYS = {"7d": 7, "28d": 28, "90d": 90}
PERIOD_LABELS = {"7d": "Last 7 days", "28d": "Last 28 days", "90d": "Last 90 days"}


# ─────────────────────────────────────────────────────────────
# Env loaders
# ─────────────────────────────────────────────────────────────
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


# ─────────────────────────────────────────────────────────────
# GA4
# ─────────────────────────────────────────────────────────────
def pull_ga4(cfg: dict, days: int) -> dict:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(
        cfg["workspace_root"] / "ga-service-account.json"
    )
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        RunReportRequest,
        DateRange,
        Metric,
        Dimension,
        OrderBy,
    )

    client = BetaAnalyticsDataClient()
    pid = f"properties/{cfg['ga4_property_id']}"
    date_range = DateRange(start_date=f"{days}daysAgo", end_date="today")

    def run(metrics, dims=None, limit=10):
        req = RunReportRequest(
            property=pid,
            date_ranges=[date_range],
            metrics=[Metric(name=m) for m in metrics],
        )
        if dims:
            req.dimensions = [Dimension(name=d) for d in dims]
            req.order_bys = [
                OrderBy(metric=OrderBy.MetricOrderBy(metric_name=metrics[0]), desc=True)
            ]
            req.limit = limit
        return client.run_report(req)

    overall = run(
        [
            "activeUsers",
            "sessions",
            "screenPageViews",
            "ecommercePurchases",
            "totalRevenue",
        ]
    )
    row = overall.rows[0].metric_values if overall.rows else None
    if not row:
        return {
            "activeUsers": 0,
            "sessions": 0,
            "pageViews": 0,
            "purchases": 0,
            "revenue": 0.0,
            "devices": [],
            "channels": [],
            "topPages": [],
            "topStates": [],
        }

    base = {
        "activeUsers": int(row[0].value),
        "sessions": int(row[1].value),
        "pageViews": int(row[2].value),
        "purchases": int(row[3].value),
        "revenue": float(row[4].value),
    }

    # Devices
    try:
        devices_raw = run(
            ["sessions", "ecommercePurchases", "totalRevenue"], ["deviceCategory"]
        )
        base["devices"] = [
            {
                "name": r.dimension_values[0].value.capitalize(),
                "sessions": int(r.metric_values[0].value),
                "purchases": int(r.metric_values[1].value),
                "revenue": float(r.metric_values[2].value),
                "convRate": (
                    (int(r.metric_values[1].value) / int(r.metric_values[0].value) * 100)
                    if int(r.metric_values[0].value) > 0
                    else 0
                ),
            }
            for r in devices_raw.rows
        ]
    except Exception as e:
        print(f"  [ga4] devices failed: {e}", file=sys.stderr)
        base["devices"] = []

    # Channels
    try:
        channels_raw = run(
            ["sessions", "ecommercePurchases", "totalRevenue"],
            ["sessionDefaultChannelGroup"],
        )
        base["channels"] = [
            {
                "name": r.dimension_values[0].value,
                "sessions": int(r.metric_values[0].value),
                "purchases": int(r.metric_values[1].value),
                "revenue": float(r.metric_values[2].value),
                "convRate": (
                    (int(r.metric_values[1].value) / int(r.metric_values[0].value) * 100)
                    if int(r.metric_values[0].value) > 0
                    else 0
                ),
            }
            for r in channels_raw.rows
        ]
    except Exception as e:
        print(f"  [ga4] channels failed: {e}", file=sys.stderr)
        base["channels"] = []

    # Top pages
    try:
        pages_raw = run(
            ["sessions", "ecommercePurchases"], ["landingPage"], limit=8
        )
        base["topPages"] = [
            {
                "page": r.dimension_values[0].value,
                "sessions": int(r.metric_values[0].value),
                "purchases": int(r.metric_values[1].value),
            }
            for r in pages_raw.rows
        ]
    except Exception as e:
        print(f"  [ga4] topPages failed: {e}", file=sys.stderr)
        base["topPages"] = []

    # Top states
    try:
        geo_raw = run(
            ["sessions", "ecommercePurchases"], ["region"], limit=8
        )
        base["topStates"] = [
            r.dimension_values[0].value
            for r in geo_raw.rows
            if r.dimension_values[0].value
        ]
    except Exception as e:
        print(f"  [ga4] topStates failed: {e}", file=sys.stderr)
        base["topStates"] = []

    return base


# ─────────────────────────────────────────────────────────────
# Google Search Console
# ─────────────────────────────────────────────────────────────
def pull_gsc(cfg: dict, days: int) -> dict:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds = service_account.Credentials.from_service_account_file(
        str(cfg["workspace_root"] / "ga-service-account.json"),
        scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
    )
    service = build("searchconsole", "v1", credentials=creds)

    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    overall = (
        service.searchanalytics()
        .query(siteUrl=cfg["gsc_site"], body={"startDate": start, "endDate": end})
        .execute()
    )
    seo = {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": 0.0}
    if overall.get("rows"):
        r = overall["rows"][0]
        seo = {
            "clicks": int(r["clicks"]),
            "impressions": int(r["impressions"]),
            "ctr": float(r["ctr"]) * 100,
            "position": float(r["position"]),
        }

    queries_raw = (
        service.searchanalytics()
        .query(
            siteUrl=cfg["gsc_site"],
            body={
                "startDate": start,
                "endDate": end,
                "dimensions": ["query"],
                "rowLimit": 10,
                "orderBy": [{"fieldName": "clicks", "sortOrder": "DESCENDING"}],
            },
        )
        .execute()
    )
    top_queries = [
        {
            "query": r["keys"][0],
            "clicks": int(r["clicks"]),
            "impressions": int(r["impressions"]),
            "ctr": float(r["ctr"]) * 100,
            "position": float(r["position"]),
        }
        for r in queries_raw.get("rows", [])
    ]

    return {"seo": seo, "topQueries": top_queries}


# ─────────────────────────────────────────────────────────────
# WooCommerce (revenue source of truth)
# ─────────────────────────────────────────────────────────────
def pull_wc(cfg: dict, days: int, env: dict) -> dict:
    wc_key = env.get("WC_CONSUMER_KEY")
    wc_secret = env.get("WC_CONSUMER_SECRET")
    if not wc_key or not wc_secret:
        return {}
    base = f"{cfg['wc_store_url']}/wp-json/wc/v3"
    start_str = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%dT00:00:00")

    all_orders = []
    pg = 1
    while pg <= 20:
        url = f"{base}/orders?per_page=100&page={pg}&after={start_str}&consumer_key={wc_key}&consumer_secret={wc_secret}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Jarvis/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                orders = json.loads(resp.read())
            if not orders:
                break
            all_orders.extend(orders)
            pg += 1
        except Exception as e:
            print(f"  [wc] page {pg} failed: {e}", file=sys.stderr)
            break

    completed = [o for o in all_orders if o["status"] in ("completed", "processing")]
    total_revenue = sum(float(o.get("total", 0)) for o in completed)
    orders_count = len(completed)
    aov = total_revenue / orders_count if orders_count else 0

    emails = [o["billing"].get("email", "") for o in completed]
    unique_customers = len(set(e for e in emails if e))
    repeat_rate = (
        ((orders_count - unique_customers) / orders_count * 100) if orders_count else 0
    )

    # Product breakdown. `orders` = distinct orders containing the product,
    # `units` = total quantity sold (matches ClientKpis type in sg-data.ts).
    products: dict = {}
    for o in completed:
        seen_in_order: set[str] = set()
        for item in o.get("line_items", []):
            name = item["name"]
            if name not in products:
                products[name] = {"orders": 0, "units": 0, "revenue": 0.0}
            products[name]["units"] += int(item.get("quantity", 1))
            products[name]["revenue"] += float(item.get("total", 0))
            if name not in seen_in_order:
                products[name]["orders"] += 1
                seen_in_order.add(name)

    product_breakdown = [
        {"name": name, "orders": p["orders"], "units": p["units"], "revenue": p["revenue"]}
        for name, p in sorted(products.items(), key=lambda kv: -kv[1]["revenue"])[:6]
    ]

    return {
        "revenue": total_revenue,
        "orders": orders_count,
        "aov": aov,
        "customers": unique_customers,
        "repeatRate": repeat_rate,
        "productBreakdown": product_breakdown,
    }


# ─────────────────────────────────────────────────────────────
# Insights (simple rules — not ML)
# ─────────────────────────────────────────────────────────────
def derive_insights(kpis: dict) -> dict:
    working = []
    leaking = []
    actions = []

    # Working
    if kpis["revenue"] > 0 and kpis["productBreakdown"]:
        top = kpis["productBreakdown"][0]
        pct = (top["revenue"] / kpis["revenue"] * 100) if kpis["revenue"] else 0
        working.append(
            f"{top['name']} is carrying the store — {pct:.0f}% of revenue over {kpis['periodLabel'].lower()}."
        )
    if kpis["seo"]["clicks"] > 50:
        working.append(
            f"Organic search is pulling {kpis['seo']['clicks']} clicks at position {kpis['seo']['position']:.1f}."
        )
    if kpis["repeatRate"] > 15:
        working.append(
            f"Repeat customers are {kpis['repeatRate']:.0f}% of orders — your base is sticky."
        )

    # Leaking
    if kpis["traffic"]["conversionRate"] < 2 and kpis["traffic"]["sessions"] > 500:
        working_sessions = kpis["traffic"]["sessions"]
        leaking.append(
            f"Conversion rate is {kpis['traffic']['conversionRate']:.1f}% on {working_sessions} sessions — the funnel's leaking somewhere."
        )
    if kpis["seo"]["position"] > 15 and kpis["seo"]["impressions"] > 1000:
        leaking.append(
            f"Search position {kpis['seo']['position']:.1f} on {kpis['seo']['impressions']} impressions — you're showing up but buried."
        )
    mobile_rev = next(
        (d["revenue"] for d in kpis["devices"] if d["name"].lower() == "mobile"), 0
    )
    desktop_rev = next(
        (d["revenue"] for d in kpis["devices"] if d["name"].lower() == "desktop"), 0
    )
    if desktop_rev > 0 and mobile_rev < desktop_rev * 0.3:
        leaking.append(
            "Mobile is converting way below desktop — check mobile checkout flow."
        )

    # Actions
    if kpis["topQueries"]:
        top_q = kpis["topQueries"][0]
        actions.append(
            f"Write content targeting \"{top_q['query']}\" — ranks #{top_q['position']:.0f} with {top_q['clicks']} clicks already."
        )
    if kpis["productBreakdown"] and len(kpis["productBreakdown"]) > 1:
        second = kpis["productBreakdown"][1]
        actions.append(
            f"{second['name']} is #2 — bundle it with the top seller to lift AOV."
        )
    actions.append("Email past purchasers with a reorder nudge — cheapest revenue you'll ever get.")

    return {"working": working[:3], "leaking": leaking[:3], "actions": actions[:3]}


# ─────────────────────────────────────────────────────────────
# Build the KPI snapshot for one period
# ─────────────────────────────────────────────────────────────
def build_snapshot(cfg: dict, period: str, env: dict) -> dict:
    days = PERIOD_DAYS[period]
    print(f"  pulling {period} ({days} days)...")

    ga4 = pull_ga4(cfg, days)
    gsc = pull_gsc(cfg, days)
    wc = pull_wc(cfg, days, env)

    # WooCommerce is source of truth for revenue/orders; GA4 is traffic
    revenue = wc.get("revenue", ga4["revenue"])
    orders = wc.get("orders", ga4["purchases"])
    sessions = ga4["sessions"]
    conv_rate = (orders / sessions * 100) if sessions else 0

    kpis = {
        "revenue": round(revenue, 2),
        "orders": orders,
        "aov": round(wc.get("aov", (revenue / orders) if orders else 0), 2),
        "customers": wc.get("customers", 0),
        "repeatRate": round(wc.get("repeatRate", 0), 1),
        "periodLabel": PERIOD_LABELS[period],
        "traffic": {
            "activeUsers": ga4["activeUsers"],
            "sessions": sessions,
            "pageViews": ga4["pageViews"],
            "conversionRate": round(conv_rate, 2),
        },
        "productBreakdown": wc.get("productBreakdown", []),
        "topStates": ga4.get("topStates", []),
        "channels": ga4.get("channels", []),
        "devices": ga4.get("devices", []),
        "topPages": ga4.get("topPages", []),
        "seo": gsc["seo"],
        "topQueries": gsc["topQueries"],
        "insights": {"working": [], "leaking": [], "actions": []},
    }
    kpis["insights"] = derive_insights(kpis)
    return kpis


# ─────────────────────────────────────────────────────────────
# Supabase upsert
# ─────────────────────────────────────────────────────────────
def upsert_snapshot(client_id: str, period: str, kpis: dict) -> None:
    url = VENTI_ENV.get("NEXT_PUBLIC_SUPABASE_URL")
    key = VENTI_ENV.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ventiscale/.env.local"
        )

    payload = {
        "client_id": client_id,
        "period": period,
        "kpis": kpis,
        "snapshot_at": datetime.now(timezone.utc).isoformat(),
    }
    endpoint = f"{url}/rest/v1/client_metrics?on_conflict=client_id,period"
    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode(),
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        if r.status >= 300:
            raise RuntimeError(f"Supabase upsert failed: {r.status} {r.read()}")


# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--client", required=True, help="Client slug (e.g. sprinkler-guard)")
    parser.add_argument(
        "--period",
        default="all",
        choices=["7d", "28d", "90d", "all"],
        help="Which period to pull (default: all)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print KPIs, skip upsert")
    args = parser.parse_args()

    cfg = CLIENT_CONFIG.get(args.client)
    if not cfg:
        print(f"Unknown client: {args.client}", file=sys.stderr)
        print(f"Known: {', '.join(CLIENT_CONFIG.keys())}", file=sys.stderr)
        sys.exit(1)

    client_env = load_env(cfg["workspace_root"] / ".env")
    periods = ["7d", "28d", "90d"] if args.period == "all" else [args.period]

    print(f"[pull-metrics] client={args.client} periods={periods}")
    for period in periods:
        snap = build_snapshot(cfg, period, client_env)
        print(
            f"  → revenue=${snap['revenue']:.0f} orders={snap['orders']} "
            f"sessions={snap['traffic']['sessions']} seo_clicks={snap['seo']['clicks']}"
        )
        if args.dry_run:
            print(json.dumps(snap, indent=2))
        else:
            upsert_snapshot(cfg["client_id"], period, snap)
            print(f"  ✓ upserted client_metrics[{period}]")

    print("[pull-metrics] done")


if __name__ == "__main__":
    main()
