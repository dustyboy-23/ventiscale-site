import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ReportSummary } from "@/lib/sg-data";

// Reader for the client_reports table. Service role inserts via the
// publish-report script; members read via RLS scoped to client_users.
//
// Cached per request so the reports page and any future sidebar preview
// share one query.

type ReportRow = {
  id: string;
  type: "client" | "seo" | "baseline" | "internal";
  title: string;
  published_at: string;
  period_end: string | null;
};

export const getClientReports = cache(
  async (clientId: string): Promise<ReportSummary[]> => {
    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return [];
    }

    const { data, error } = await supabase
      .from("client_reports")
      .select("id, type, title, published_at, period_end")
      .eq("client_id", clientId)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[reports] list query failed", error.message);
      return [];
    }

    const rows = (data ?? []) as ReportRow[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      date: (r.period_end || r.published_at.slice(0, 10)),
      type: r.type,
      // path has to end in .html for the viewer filter. Value itself is
      // unused when we read from DB instead of disk.
      path: `${r.id}.html`,
    }));
  },
);

export const getClientReportHtml = cache(
  async (reportId: string, clientId: string): Promise<string | null> => {
    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return null;
    }

    const { data, error } = await supabase
      .from("client_reports")
      .select("html_body")
      .eq("id", reportId)
      .eq("client_id", clientId)
      .maybeSingle();

    if (error) {
      console.error("[reports] html query failed", error.message);
      return null;
    }
    return data?.html_body ?? null;
  },
);
