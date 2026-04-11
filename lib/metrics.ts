import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ClientKpis } from "@/lib/sg-data";
import type { PeriodKey } from "@/lib/sg-data";

export interface ClientMetricsRow {
  kpis: ClientKpis;
  snapshotAt: string;
}

// Reader for the client_metrics table. The nightly puller
// (scripts/pull-client-metrics.py) writes one row per (client_id, period)
// with the full KPI snapshot as JSONB, shaped to match ClientKpis.
//
// Cached per request so getClientKpis() for multiple periods on one page
// doesn't re-query Supabase.
export const getClientMetrics = cache(
  async (clientId: string, period: PeriodKey): Promise<ClientMetricsRow | null> => {
    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return null;
    }

    const { data, error } = await supabase
      .from("client_metrics")
      .select("kpis, snapshot_at")
      .eq("client_id", clientId)
      .eq("period", period)
      .maybeSingle();

    if (error) {
      console.error("[metrics] query failed", { clientId, period, error: error.message });
      return null;
    }
    if (!data) return null;
    return {
      kpis: data.kpis as ClientKpis,
      snapshotAt: data.snapshot_at as string,
    };
  },
);
