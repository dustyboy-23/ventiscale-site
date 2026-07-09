import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Data fetchers for the analytics.* schema (the Madgicx-busting layer).
// All reads via service-role through PostgREST. RLS is on but service-role bypasses.
// Routes calling these MUST already gate on portal auth (the (portal) layout
// enforces this) so we don't need additional access checks here.

export interface AnalyticsWeeklyMetric {
  weekStart: string;
  periodDays: number;
  revenueNet: number | null;
  revenueGross: number | null;
  orders: number | null;
  uniqueCustomers: number | null;
  repeatOrders: number | null;
  aov: number | null;
  grossProfit: number | null;
  grossMargin: number | null;
  adSpendTotal: number | null;
  adSpendMeta: number | null;
  adSpendGoogle: number | null;
  metaRoas: number | null;
  googleRoas: number | null;
  blendedRoas: number | null;
  ga4Sessions: number | null;
  ga4ConvRate: number | null;
}

export interface AnalyticsAnomaly {
  pattern: string;
  metric: string;
  scope: string | null;
  severity: "info" | "warn" | "critical";
  expected: number | null;
  actual: number | null;
  zScore: number | null;
  message: string;
  detectedAt: string;
  windowStart: string | null;
  windowEnd: string | null;
}

export interface AnalyticsCampaignRow {
  campaignName: string;
  platform: string;
  spend: number;
  revenue: number;
  purchases: number;
  roas: number | null;
}

export interface AnalyticsAttributionRow {
  channel: string;
  firstTouchRev: number;
  lastTouchRev: number;
  deltaPct: number;
  insight: string;
}

export interface AnalyticsCohortRow {
  cohortMonth: string;
  customers: number;
  avgFirstValue: number;
  observedClv: number;
  predicted12mClv: number;
  totalPredictedValue: number;
  avgPAlive: number;
}

const SG_CLIENT_ID = "12baae15-9b58-464e-9b21-a15f375ff979";

async function getSupabase() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export const getWeeklyMetrics = cache(
  async (clientId: string, limit = 8): Promise<AnalyticsWeeklyMetric[]> => {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .schema("analytics")
      .from("weekly_metrics")
      .select(
        "week_start,period_days,revenue_net,revenue_gross,orders,unique_customers," +
          "repeat_orders,aov,gross_profit,gross_margin,ad_spend_total,ad_spend_meta," +
          "ad_spend_google,meta_roas,google_roas,blended_roas,ga4_sessions,ga4_conv_rate"
      )
      .eq("client_id", clientId)
      .eq("period_days", 28)
      .order("week_start", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return (data as unknown as Record<string, unknown>[])
      .map((r) => ({
        weekStart: String(r.week_start),
        periodDays: Number(r.period_days),
        revenueNet: r.revenue_net !== null ? Number(r.revenue_net) : null,
        revenueGross: r.revenue_gross !== null ? Number(r.revenue_gross) : null,
        orders: r.orders !== null ? Number(r.orders) : null,
        uniqueCustomers:
          r.unique_customers !== null ? Number(r.unique_customers) : null,
        repeatOrders: r.repeat_orders !== null ? Number(r.repeat_orders) : null,
        aov: r.aov !== null ? Number(r.aov) : null,
        grossProfit: r.gross_profit !== null ? Number(r.gross_profit) : null,
        grossMargin: r.gross_margin !== null ? Number(r.gross_margin) : null,
        adSpendTotal:
          r.ad_spend_total !== null ? Number(r.ad_spend_total) : null,
        adSpendMeta: r.ad_spend_meta !== null ? Number(r.ad_spend_meta) : null,
        adSpendGoogle:
          r.ad_spend_google !== null ? Number(r.ad_spend_google) : null,
        metaRoas: r.meta_roas !== null ? Number(r.meta_roas) : null,
        googleRoas: r.google_roas !== null ? Number(r.google_roas) : null,
        blendedRoas: r.blended_roas !== null ? Number(r.blended_roas) : null,
        ga4Sessions: r.ga4_sessions !== null ? Number(r.ga4_sessions) : null,
        ga4ConvRate: r.ga4_conv_rate !== null ? Number(r.ga4_conv_rate) : null,
      }))
      .reverse();
  }
);

export const getRecentAnomalies = cache(
  async (clientId: string, days = 30, limit = 25): Promise<AnalyticsAnomaly[]> => {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
    const { data, error } = await supabase
      .schema("analytics")
      .from("anomalies")
      .select("*")
      .eq("client_id", clientId)
      .gte("detected_at", since)
      .order("detected_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return (data as unknown as Record<string, unknown>[]).map((r) => ({
      pattern: String(r.pattern),
      metric: String(r.metric),
      scope: r.scope ? String(r.scope) : null,
      severity: (r.severity as "info" | "warn" | "critical") ?? "info",
      expected: r.expected !== null ? Number(r.expected) : null,
      actual: r.actual !== null ? Number(r.actual) : null,
      zScore: r.z_score !== null ? Number(r.z_score) : null,
      message: String(r.message),
      detectedAt: String(r.detected_at),
      windowStart: r.window_start ? String(r.window_start) : null,
      windowEnd: r.window_end ? String(r.window_end) : null,
    }));
  }
);

export const getTopCampaignsThisMonth = cache(
  async (clientId: string, limit = 5): Promise<AnalyticsCampaignRow[]> => {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const { data, error } = await supabase
      .schema("analytics")
      .from("daily_ad_performance")
      .select("campaign_name,platform,spend,revenue,purchases")
      .eq("client_id", clientId)
      .gte("day", monthStart);

    if (error || !data) return [];

    type Row = { campaign_name?: string; platform?: string; spend?: number; revenue?: number; purchases?: number };
    const agg = new Map<string, AnalyticsCampaignRow>();
    for (const raw of data as unknown as Row[]) {
      const key = `${raw.platform ?? "?"}::${raw.campaign_name ?? "?"}`;
      const current = agg.get(key) ?? {
        campaignName: raw.campaign_name ?? "Unknown",
        platform: raw.platform ?? "?",
        spend: 0,
        revenue: 0,
        purchases: 0,
        roas: null,
      };
      current.spend += Number(raw.spend ?? 0);
      current.revenue += Number(raw.revenue ?? 0);
      current.purchases += Number(raw.purchases ?? 0);
      agg.set(key, current);
    }
    return Array.from(agg.values())
      .map((c) => ({ ...c, roas: c.spend > 0 ? c.revenue / c.spend : null }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, limit);
  }
);

export const getLatestCohortSnapshot = cache(
  async (clientId: string): Promise<AnalyticsCohortRow[]> => {
    const supabase = await getSupabase();
    if (!supabase) return [];

    // Latest fit_run_at for this client
    const { data: latest, error: e1 } = await supabase
      .schema("analytics")
      .from("cohort_snapshots")
      .select("fit_run_at")
      .eq("client_id", clientId)
      .order("fit_run_at", { ascending: false })
      .limit(1);
    if (e1 || !latest || latest.length === 0) return [];

    const latestRunAt = (latest as unknown as Array<{ fit_run_at: string }>)[0].fit_run_at;

    const { data, error } = await supabase
      .schema("analytics")
      .from("cohort_snapshots")
      .select(
        "cohort_month,customers,avg_first_value,observed_clv,predicted_12m_clv,total_predicted_value,avg_p_alive"
      )
      .eq("client_id", clientId)
      .eq("fit_run_at", latestRunAt)
      .order("cohort_month", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as Record<string, unknown>[]).map((r) => ({
      cohortMonth: String(r.cohort_month).slice(0, 7), // YYYY-MM
      customers: Number(r.customers),
      avgFirstValue: Number(r.avg_first_value ?? 0),
      observedClv: Number(r.observed_clv ?? 0),
      predicted12mClv: Number(r.predicted_12m_clv ?? 0),
      totalPredictedValue: Number(r.total_predicted_value ?? 0),
      avgPAlive: Number(r.avg_p_alive ?? 0),
    }));
  }
);

export const getLatestAttributionSnapshot = cache(
  async (clientId: string): Promise<AnalyticsAttributionRow[]> => {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const { data: latest, error: e1 } = await supabase
      .schema("analytics")
      .from("attribution_snapshots")
      .select("computed_at")
      .eq("client_id", clientId)
      .order("computed_at", { ascending: false })
      .limit(1);
    if (e1 || !latest || latest.length === 0) return [];

    const latestComputedAt = (latest as unknown as Array<{ computed_at: string }>)[0]
      .computed_at;

    const { data, error } = await supabase
      .schema("analytics")
      .from("attribution_snapshots")
      .select("channel,first_touch_revenue,last_touch_revenue,delta_pct")
      .eq("client_id", clientId)
      .eq("computed_at", latestComputedAt)
      .order("last_touch_revenue", { ascending: false });

    if (error || !data) return [];

    return (data as unknown as Record<string, unknown>[]).map((r) => {
      const dPct = Number(r.delta_pct ?? 0);
      let insight = "—";
      if (dPct > 5) insight = "Last-click over-credits";
      else if (dPct > 1) insight = "Slight last-click bias";
      else if (dPct < -5) insight = "Under-credited (real upstream value)";
      else if (dPct < -1) insight = "Slight first-touch bias";
      return {
        channel: String(r.channel),
        firstTouchRev: Number(r.first_touch_revenue ?? 0),
        lastTouchRev: Number(r.last_touch_revenue ?? 0),
        deltaPct: dPct,
        insight,
      };
    });
  }
);

// SG-specific shortcuts. Future: route by `clientId` for multi-client portal.
export const getSgWeeklyMetrics = (limit = 8) =>
  getWeeklyMetrics(SG_CLIENT_ID, limit);
export const getSgRecentAnomalies = (days = 30, limit = 25) =>
  getRecentAnomalies(SG_CLIENT_ID, days, limit);
export const getSgTopCampaigns = (limit = 5) =>
  getTopCampaignsThisMonth(SG_CLIENT_ID, limit);
export const getSgLatestCohort = () => getLatestCohortSnapshot(SG_CLIENT_ID);
export const getSgLatestAttribution = () =>
  getLatestAttributionSnapshot(SG_CLIENT_ID);
