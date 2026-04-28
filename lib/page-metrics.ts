// Reads the FB page-level metrics snapshot written by
// scripts/sg-pull-post-metrics.py. Per-post reach/impressions are
// deprecated by FB so we run a separate page-level pull instead.

import { promises as fs } from "fs";
import { join } from "path";

export interface DailyFollow {
  date: string; // YYYY-MM-DD
  value: number; // net new follows that day
}

export interface PageMetricsSnapshot {
  capturedAt: string | null;
  followers: number | null;
  pageName: string | null;
  dailyFollows: DailyFollow[];
  pageViews28d: number | null; // page_views_total over the last 28 days
  postEngagements28d: number | null; // page_post_engagements over last 28d
}

const EMPTY: PageMetricsSnapshot = {
  capturedAt: null,
  followers: null,
  pageName: null,
  dailyFollows: [],
  pageViews28d: null,
  postEngagements28d: null,
};

export async function getPageMetrics(): Promise<PageMetricsSnapshot> {
  // Snapshot is written to ops/state/sg-page-metrics.json relative to
  // the portal root (where this lib lives one level deep).
  const path = join(process.cwd(), "ops", "state", "sg-page-metrics.json");
  try {
    const raw = await fs.readFile(path, "utf-8");
    const j = JSON.parse(raw);
    return {
      capturedAt: j.captured_at || null,
      followers: typeof j.followers === "number" ? j.followers : null,
      pageName: j.page_name || null,
      dailyFollows: Array.isArray(j.daily_follows)
        ? j.daily_follows.map((d: { date: string; value: number }) => ({
            date: String(d.date),
            value: Number(d.value) || 0,
          }))
        : [],
      pageViews28d: typeof j.page_views_total === "number" ? j.page_views_total : null,
      postEngagements28d:
        typeof j.page_post_engagements === "number" ? j.page_post_engagements : null,
    };
  } catch {
    return EMPTY;
  }
}
