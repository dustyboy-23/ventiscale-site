/**
 * Portal demo data — Stoneline Apparel (fictional).
 *
 * Filename is historical ("sg-data" from when this file read from
 * ~/sprinkler-guard). It now serves a demo brand instead — nothing here
 * touches the filesystem, so it works identically in local dev and on
 * Vercel's read-only serverless runtime.
 *
 * When a real client portal is wired up, each getter should be swapped
 * for an authenticated read against the real data source (Supabase,
 * a client-specific JSON in Drive, a Shopify + GA4 pull, etc.). The
 * shapes are stable — pages import the types directly.
 */

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────
export interface ClientKpis {
  revenue: number;
  orders: number;
  aov: number;
  customers: number;
  repeatRate: number;
  periodLabel: string;

  traffic: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    conversionRate: number;
  };

  productBreakdown: Array<{
    name: string;
    orders: number;
    units: number;
    revenue: number;
  }>;

  topStates: string[];

  channels: Array<{
    name: string;
    sessions: number;
    purchases: number;
    revenue: number;
    convRate: number;
  }>;

  devices: Array<{
    name: string;
    sessions: number;
    purchases: number;
    revenue: number;
    convRate: number;
  }>;

  topPages: Array<{
    page: string;
    sessions: number;
    purchases: number;
  }>;

  seo: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };

  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;

  insights: {
    working: string[];
    leaking: string[];
    actions: string[];
  };

  // Ad performance (Meta + Google direct from the ad platforms, NOT GA4).
  // GA4 under-attributes paid traffic because of iOS 14+ ATT and link-shimming;
  // these numbers come from the platforms themselves and reflect actual ROAS.
  // Optional because not every period is guaranteed to have ad data.
  ads?: {
    meta: {
      spend: number;
      revenue: number;
      purchases: number;
      roas: number;
      costPerPurchase: number;
    };
    google: {
      spend: number;
      revenue: number;
      purchases: number;
      roas: number;
    };
    total: {
      spend: number;
      revenue: number;
      roas: number;
    };
  };
}

export interface ReportSummary {
  id: string;
  title: string;
  date: string;
  type: "client" | "seo" | "baseline" | "internal" | "ads";
  path: string;
}

export interface ContentDraft {
  id: string;
  date: string;
  slot: string;
  platform: string;
  topic: string;
  caption: string;
  imagePrompt: string;
  comments: string[];
  cta: string;
  isProductPost: boolean;
  status: "draft" | "scheduled" | "approved" | "rejected" | "published";
  reviewedAt: string | null;
  reviewerNotes: string | null;
  scheduledAt: string | null;
  driveFileId: string | null;
  mediaType: "image" | "video" | "text" | null;
  /** Demo-only: direct thumbnail URL the content card renders when there's
   *  no Drive file ID. Real clients always have a driveFileId. */
  mockThumbnailUrl?: string;
}

export interface CampaignSequenceStep {
  step: number;
  delay: string;
  subject: string;
  preview: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "automation" | "newsletter" | "broadcast";
  status: "ready_for_approval" | "draft" | "live" | "scheduled" | "sent";
  audience: string;
  audienceSize: number;
  rationale: string;
  projectedImpact: { revenue: number; label: string };
  sequence: CampaignSequenceStep[];
  createdBy: string;
  createdAt: string;
}

export interface CampaignsData {
  proposed: Campaign[];
  live: Campaign[];
  history: Campaign[];
  stats: {
    totalSubscribers: number;
    monthlyGrowth: number;
    avgOpenRate: number;
    avgClickRate: number;
    lastSendDate: string | null;
  };
}

export interface ActivityItem {
  id: string;
  type:
    | "post"
    | "report"
    | "campaign"
    | "draft"
    | "system"
    | "content_approved"
    | "content_rejected";
  title: string;
  description?: string;
  timestamp: string;
}

// ──────────────────────────────────────────────────────────
// Client meta
// ──────────────────────────────────────────────────────────
export const CLIENT = {
  slug: "stoneline",
  name: "Stoneline Apparel",
  tagline: "Premium menswear · Built to last",
  primaryDomain: "stonelineapparel.com",
  ecomDomain: "stonelineapparel.com",
  driveFolderId: "", // demo: no real Drive folder — Files page shows a placeholder
  ownerName: "Marcus",
  accent: "#1F3D2B",
  isDemo: true,
};

// ──────────────────────────────────────────────────────────
// KPIs
// ──────────────────────────────────────────────────────────
export type PeriodKey = "7d" | "28d" | "month" | "90d";

export const PERIOD_META: Record<PeriodKey, { label: string; scale: number }> = {
  "7d": { label: "Last 7 days", scale: 0.28 },
  "28d": { label: "Last 28 days", scale: 1.0 },
  month: { label: "This month", scale: 0.55 },
  "90d": { label: "Last 90 days", scale: 3.15 },
};

export function resolvePeriod(raw: string | undefined): PeriodKey {
  return raw && raw in PERIOD_META ? (raw as PeriodKey) : "28d";
}

export async function getClientKpis(period: PeriodKey = "28d"): Promise<ClientKpis> {
  const { label, scale } = PERIOD_META[period];
  const i = (n: number) => Math.round(n * scale);

  return {
    revenue: i(48290),
    orders: i(312),
    aov: 154.78,
    customers: i(247),
    repeatRate: 26.4,
    periodLabel: label,

    traffic: {
      activeUsers: i(6840),
      sessions: i(8214),
      pageViews: i(23890),
      conversionRate: 3.8,
    },

    productBreakdown: [
      { name: "Heritage tee bundle", orders: i(118), units: i(354), revenue: i(18420) },
      { name: "Selvedge denim", orders: i(76), units: i(76), revenue: i(12800) },
      { name: "Field jacket", orders: i(42), units: i(42), revenue: i(9650) },
      { name: "Daily oxford shirt", orders: i(58), units: i(58), revenue: i(7420) },
    ],

    topStates: ["CA", "TX", "NY", "FL", "WA", "IL"],

    channels: [
      { name: "Organic search", sessions: i(3120), purchases: i(118), revenue: i(18240), convRate: 3.78 },
      { name: "Email", sessions: i(1840), purchases: i(94), revenue: i(14560), convRate: 5.11 },
      { name: "Paid social", sessions: i(1680), purchases: i(52), revenue: i(8120), convRate: 3.10 },
      { name: "Direct", sessions: i(980), purchases: i(34), revenue: i(5220), convRate: 3.47 },
      { name: "Referral", sessions: i(594), purchases: i(14), revenue: i(2150), convRate: 2.36 },
    ],

    devices: [
      { name: "Mobile", sessions: i(5340), purchases: i(186), revenue: i(28620), convRate: 3.48 },
      { name: "Desktop", sessions: i(2420), purchases: i(108), revenue: i(17240), convRate: 4.46 },
      { name: "Tablet", sessions: i(454), purchases: i(18), revenue: i(2430), convRate: 3.96 },
    ],

    topPages: [
      { page: "/", sessions: i(3840), purchases: i(92) },
      { page: "/products/heritage-tee-bundle", sessions: i(1620), purchases: i(118) },
      { page: "/collections/denim", sessions: i(1140), purchases: i(48) },
      { page: "/products/field-jacket", sessions: i(820), purchases: i(42) },
      { page: "/pages/the-mill", sessions: i(410), purchases: i(12) },
    ],

    seo: {
      clicks: i(1284),
      impressions: i(42180),
      ctr: 3.1,
      position: 14.2,
    },

    topQueries: [
      { query: "selvedge denim brands", clicks: i(184), impressions: i(4120), ctr: 4.46, position: 8.2 },
      { query: "heritage mens tee", clicks: i(162), impressions: i(3880), ctr: 4.18, position: 9.1 },
      { query: "best field jacket", clicks: i(128), impressions: i(5210), ctr: 2.46, position: 15.4 },
      { query: "made in usa menswear", clicks: i(94), impressions: i(2840), ctr: 3.31, position: 11.8 },
      { query: "oxford shirt for work", clicks: i(72), impressions: i(3120), ctr: 2.31, position: 17.2 },
    ],

    insights: {
      working: [
        "Email is punching above its weight at 5.11% conversion — nearly 2x site average. The welcome series is doing the heavy lifting.",
        "Heritage tee bundle is pulling 38% of total revenue from a single SKU. Bundle economics are working.",
        "Organic search traffic is up 28% MoM — the SEO plan is starting to compound.",
      ],
      leaking: [
        "Mobile converts at 3.48% vs 4.46% on desktop. A full point gap at this volume is roughly $6k/month on the table.",
        "Paid social ROAS is 1.9x — under the 2.5x floor we set. Creative refresh needed this week.",
      ],
      actions: [
        "Ship the abandoned-cart flow drafted in Email this week — projected +$4,200/mo recovered revenue.",
        "Refresh 3 paid social creatives. Test the founder-voice angle against the product-shot control.",
        "Fix mobile checkout: measure time-to-purchase and identify the drop-off step.",
      ],
    },
  };
}

// ──────────────────────────────────────────────────────────
// Reports
// ──────────────────────────────────────────────────────────
const DEMO_REPORTS: ReportSummary[] = [
  {
    id: "client-monthly-2026-04",
    title: "Monthly Performance Report \u00b7 Apr 1-28, 2026",
    date: "2026-04-28",
    type: "client",
    path: "client-monthly-2026-04.html",
  },
  {
    id: "seo-monthly-2026-04",
    title: "Monthly SEO Report \u00b7 Apr 1-28, 2026",
    date: "2026-04-28",
    type: "seo",
    path: "seo-monthly-2026-04.html",
  },
];

export async function getReports(): Promise<ReportSummary[]> {
  return DEMO_REPORTS;
}

// Demo report HTML — rendered from the SG production templates with mocked
// Stoneline Apparel data. Same structure, same look, same standard prospects
// will see when they become real clients.
const REPORT_HTML: Record<string, string> = {
  "client-monthly-2026-04": '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Sprinkler Guard — Weekly Performance Report</title>\n<style>\n  @import url(\'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap\');\n\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body { font-family: \'DM Sans\', sans-serif; background: #f0f2f5; color: #1a1a2e; line-height: 1.6; }\n\n  .report { max-width: 1000px; margin: 0 auto; padding: 24px; }\n\n  /* Header */\n  .report-header { background: linear-gradient(135deg, #1a5e1f 0%, #0d3b11 100%); border-radius: 16px; padding: 40px; margin-bottom: 24px; color: white; display: flex; justify-content: space-between; align-items: center; }\n  .report-header h1 { font-size: 28px; font-weight: 700; }\n  .report-header .subtitle { opacity: 0.85; font-size: 14px; margin-top: 4px; }\n  .report-header .period { text-align: right; }\n  .report-header .period .dates { font-size: 15px; opacity: 0.9; }\n  .report-header .period .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }\n  .logo-area { display: flex; align-items: center; gap: 16px; }\n  .logo-badge { background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 12px; letter-spacing: 0.5px; }\n\n  /* Section Headers */\n  .section { margin-bottom: 32px; }\n  .section-title { font-size: 20px; font-weight: 700; color: #1a3c12; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid #1a5e1f; display: inline-block; }\n  .section-number { color: #1a5e1f; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 4px; }\n\n  /* KPI Cards */\n  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }\n  .kpi-card { background: white; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }\n  .kpi-card .value { font-size: 32px; font-weight: 700; color: #1a5e1f; }\n  .kpi-card .label { font-size: 13px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }\n  .kpi-card.highlight { background: linear-gradient(135deg, #1a5e1f, #2d7a32); color: white; }\n  .kpi-card.highlight .value { color: white; }\n  .kpi-card.highlight .label { color: rgba(255,255,255,0.8); }\n  .kpi-card.warning { border-left: 4px solid #e8621a; }\n  .kpi-card .change { font-size: 12px; margin-top: 6px; color: #999; }\n\n  /* Tables */\n  .data-card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }\n  .data-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #333; }\n  table { width: 100%; border-collapse: collapse; }\n  th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; padding: 8px 12px; border-bottom: 2px solid #f0f0f0; }\n  th.right { text-align: right; }\n  td { padding: 10px 12px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }\n  td.right { text-align: right; font-variant-numeric: tabular-nums; }\n  td.bold { font-weight: 600; }\n  tr:last-child td { border-bottom: none; }\n  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }\n  .badge-green { background: #E8F5E9; color: #2d7a32; }\n  .badge-orange { background: #FFF3E0; color: #e8621a; }\n  .badge-red { background: #FFEBEE; color: #C62828; }\n  .badge-blue { background: #E3F2FD; color: #1565C0; }\n\n  /* Two Column Layout */\n  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }\n  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }\n\n  /* Funnel */\n  .funnel { text-align: center; padding: 20px 0; }\n  .funnel-step { display: inline-block; text-align: center; position: relative; }\n  .funnel-bar { height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; margin-bottom: 6px; }\n  .funnel-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }\n  .funnel-arrow { display: inline-block; color: #ccc; font-size: 24px; margin: 0 4px; vertical-align: middle; padding-top: 10px; }\n  .funnel-rate { font-size: 11px; color: #e8621a; font-weight: 600; position: absolute; top: -18px; left: 50%; transform: translateX(-50%); white-space: nowrap; }\n\n  /* Progress bars */\n  .progress-row { margin-bottom: 12px; }\n  .progress-label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }\n  .progress-bar { height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }\n  .progress-fill { height: 100%; border-radius: 4px; }\n\n  /* P&L Section */\n  .pl-table td { padding: 12px 16px; }\n  .pl-table .total-row { background: #f8f9fa; font-weight: 700; }\n  .pl-table .total-row td { border-top: 2px solid #1a5e1f; }\n  .pl-table .subtotal td { font-weight: 600; border-top: 1px solid #ddd; }\n  .green { color: #2d7a32; }\n  .red { color: #C62828; }\n  .orange { color: #e8621a; }\n\n  /* Callout */\n  .callout { background: #FFF8E1; border-left: 4px solid #e8621a; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 16px 0; }\n  .callout-green { background: #E8F5E9; border-left-color: #2d7a32; }\n  .callout h4 { font-size: 14px; margin-bottom: 6px; }\n  .callout p { font-size: 13px; color: #555; }\n\n  /* Footer */\n  .report-footer { text-align: center; padding: 32px; color: #999; font-size: 12px; }\n  .report-footer a { color: #1a5e1f; }\n\n  /* Print styles */\n  @media print {\n    body { background: white; }\n    .report { padding: 0; }\n    .section { page-break-inside: avoid; }\n  }\n\n  @media (max-width: 768px) {\n    .kpi-grid { grid-template-columns: repeat(2, 1fr); }\n    .two-col, .three-col { grid-template-columns: 1fr; }\n    .report-header { flex-direction: column; text-align: center; gap: 16px; }\n    .report-header .period { text-align: center; }\n  }\n</style>\n</head>\n<body>\n<div class="report">\n\n  <!-- HEADER -->\n  <div class="report-header">\n    <div>\n      <div class="logo-area">\n        <h1>Stoneline Apparel</h1>\n      </div>\n      <div class="subtitle">Weekly Performance Report</div>\n      <div style="margin-top: 12px;">\n        <span class="logo-badge">Heritage Menswear · Made in USA</span>\n        <span class="logo-badge">Prepared by Venti Scale</span>\n      </div>\n    </div>\n    <div class="period">\n      <div class="label">Reporting Period</div>\n      <div class="dates">Apr 1 - Apr 28, 2026</div>\n      <div class="dates" style="font-size:13px; opacity:0.7;">28 Days</div>\n    </div>\n  </div>\n\n  <!-- EXECUTIVE KPIs -->\n  <div class="section">\n    <div class="section-number">Overview</div>\n    <div class="section-title">Key Performance Indicators</div>\n\n    <div class="kpi-grid">\n      <div class="kpi-card highlight">\n        <div class="value">$48,920</div>\n        <div class="label">Total Revenue</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">318</div>\n        <div class="label">Orders</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">$153.84</div>\n        <div class="label">Avg Order Value</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">1.44%</div>\n        <div class="label">Conversion Rate</div>\n      </div>\n    </div>\n\n    <div class="kpi-grid">\n      <div class="kpi-card">\n        <div class="value">18,360</div>\n        <div class="label">Website Visitors</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">22,140</div>\n        <div class="label">Sessions</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">1,840</div>\n        <div class="label">Google Search Clicks</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">82.4K</div>\n        <div class="label">Search Impressions</div>\n      </div>\n    </div>\n  </div>\n\n  <!-- P&L SNAPSHOT -->\n  <div class="section">\n    <div class="section-number">Section 1</div>\n    <div class="section-title">Profit & Loss Statement</div>\n\n    <div class="data-card">\n      <h3>Full P&L - 28 Day Period</h3>\n      <table class="pl-table">\n        <tr style="background:#f0faf0;"><td colspan="2" class="bold" style="font-size:15px; color:#1a5e1f; padding:14px 16px;">REVENUE</td></tr>\n        <tr><td>Gross Sales (318 orders)</td><td class="right bold">$48,920.00</td></tr>\n        <tr><td>Shipping Collected</td><td class="right">$1,860.00</td></tr>\n        <tr><td>Tax Collected</td><td class="right">$0.00</td></tr>\n        <tr><td>Discounts Given</td><td class="right red">-$2,140.00</td></tr>\n        <tr><td>Refunds (8 orders)</td><td class="right red">-$1,260.00</td></tr>\n        <tr class="subtotal"><td class="bold">Net Revenue</td><td class="right bold green" style="font-size:18px;">$47,380.00</td></tr>\n\n        <tr style="background:#fef9f0;"><td colspan="2" class="bold" style="font-size:15px; color:#e8621a; padding:14px 16px;">COST OF GOODS SOLD</td></tr>\n        <tr><td>Manufacturing (489 units x $1.05)</td><td class="right">$10,260.00</td></tr>\n        <tr><td>Admin/Overhead (489 units x $0.35)</td><td class="right">$3,420.00</td></tr>\n        <tr><td>Shipping Cost (318 orders x $14)</td><td class="right">$1,880.00</td></tr>\n        <tr class="subtotal"><td class="bold">Total COGS</td><td class="right bold red">-$15,560.00</td></tr>\n\n        <tr style="background:#e8f5e9;"><td class="bold" style="font-size:16px;">GROSS PROFIT</td><td class="right bold green" style="font-size:22px;">$31,820.00</td></tr>\n        <tr><td></td><td class="right" style="color:#2d7a32; font-size:13px;">67.2% gross margin</td></tr>\n\n        <tr style="background:#fff3e0;"><td colspan="2" class="bold" style="font-size:15px; color:#e8621a; padding:14px 16px;">ADVERTISING</td></tr>\n        <tr><td>Meta/Facebook Ads</td><td class="right">$6,520.00</td></tr>\n        <tr><td>Google Ads (PMax)</td><td class="right">$2,120.00</td></tr>\n        <tr class="subtotal"><td class="bold">Total Ad Spend</td><td class="right bold red">-$8,640.00</td></tr>\n\n        <tr style="background:#e8f5e9; border-top:3px solid #1a5e1f;"><td class="bold" style="font-size:18px; padding:16px;">NET PROFIT (Before Other Expenses)</td><td class="right bold" style="font-size:28px; padding:16px; color:#1a5e1f;">$20,290.00</td></tr>\n        <tr><td></td><td class="right" style="color:#2d7a32; font-size:13px;">42.8% net margin</td></tr>\n      </table>\n    </div>\n\n    <div class="kpi-grid" style="grid-template-columns: repeat(5, 1fr);">\n      <div class="kpi-card highlight">\n        <div class="value">$47,380</div>\n        <div class="label">Net Revenue</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value" style="color:#C62828;">$15,560</div>\n        <div class="label">COGS</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">$31,820</div>\n        <div class="label">Gross Profit</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value" style="color:#C62828;">$8,640</div>\n        <div class="label">Ad Spend</div>\n      </div>\n      <div class="kpi-card" style="border: 2px solid #1a5e1f;">\n        <div class="value">$20,290</div>\n        <div class="label">Net Profit</div>\n      </div>\n    </div>\n\n    <div class="callout callout-green">\n      <h4>Bottom Line</h4>\n      <p>For every $1 Ken spends on the business (COGS + ads), he gets <strong>$1.83 back</strong>. The 67.2% gross margin is excellent - the product economics are strong. The key lever is improving conversion rate so existing ad spend generates more revenue.</p>\n    </div>\n  </div>\n\n  <!-- ADVERTISING BREAKDOWN -->\n  <div class="section">\n    <div class="section-number">Section 2</div>\n    <div class="section-title">Advertising Performance</div>\n\n    <div class="two-col">\n      <div class="data-card">\n        <h3>Meta / Facebook Ads</h3>\n        <table class="pl-table">\n          <tr><td>Total Spend</td><td class="right bold">$6,520.00</td></tr>\n          <tr><td>Revenue Generated</td><td class="right bold green">$15,900.00</td></tr>\n          <tr><td>ROAS</td><td class="right bold green">2.44x</td></tr>\n          <tr><td>Purchases</td><td class="right">84</td></tr>\n          <tr><td>Cost per Purchase</td><td class="right">$77.62</td></tr>\n          <tr><td>Link Clicks</td><td class="right">12,840</td></tr>\n          <tr><td>Landing Page Views</td><td class="right">9,180</td></tr>\n          <tr><td>Add to Carts</td><td class="right">612</td></tr>\n          <tr><td>Checkouts Initiated</td><td class="right">381</td></tr>\n          <tr><td>Impressions</td><td class="right">486K</td></tr>\n          <tr><td>CPC</td><td class="right">$0.51</td></tr>\n          <tr><td>CTR</td><td class="right">2.64%</td></tr>\n        </table>\n      </div>\n\n      <div class="data-card">\n        <h3>Google Ads (PMax)</h3>\n        <table class="pl-table">\n          <tr><td>Total Spend</td><td class="right bold">$2,120.00</td></tr>\n          <tr><td>Revenue Generated</td><td class="right bold green">$3,390.00</td></tr>\n          <tr><td>ROAS</td><td class="right bold green">1.60x</td></tr>\n          <tr><td>Purchases</td><td class="right">22</td></tr>\n          <tr><td>Cost per Purchase</td><td class="right">$96.36</td></tr>\n          <tr><td>Clicks</td><td class="right">3,210</td></tr>\n          <tr><td>Impressions</td><td class="right">92K</td></tr>\n        </table>\n        <div style="height:24px;"></div>\n        <div style="background:#f8f9fa; border-radius:8px; padding:16px; text-align:center;">\n          <div style="font-size:13px; color:#666; text-transform:uppercase; letter-spacing:1px;">Combined Totals</div>\n          <div style="display:flex; justify-content:space-around; margin-top:12px;">\n            <div><div style="font-size:24px; font-weight:700; color:#C62828;">$8,640</div><div style="font-size:11px; color:#666;">Total Spend</div></div>\n            <div><div style="font-size:24px; font-weight:700; color:#2d7a32;">$19,290</div><div style="font-size:11px; color:#666;">Total Revenue</div></div>\n            <div><div style="font-size:24px; font-weight:700; color:#1a5e1f;">2.23x</div><div style="font-size:11px; color:#666;">Blended ROAS</div></div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class="data-card">\n      <h3>Meta Campaign Breakdown</h3>\n      <table>\n        <thead>\n          <tr><th>Campaign</th><th class="right">Spend</th><th class="right">Purchases</th><th class="right">Revenue</th><th class="right">ROAS</th><th class="right">CPA</th><th></th></tr>\n        </thead>\n        <tbody>\n                    <tr>\n            <td class="bold">BOF | Heritage Field Jacket Launch</td>\n            <td class="right">$3,420.00</td>\n            <td class="right">42</td>\n            <td class="right">$9,180.00</td>\n            <td class="right bold green">2.68x</td>\n            <td class="right">$81.43</td>\n            <td><span class="badge badge-green">Strong</span></td>\n          </tr>\n          <tr>\n            <td class="bold">BOF | Selvedge Denim Retargeting</td>\n            <td class="right">$1,810.00</td>\n            <td class="right">28</td>\n            <td class="right">$4,580.00</td>\n            <td class="right bold green">2.53x</td>\n            <td class="right">$64.64</td>\n            <td><span class="badge badge-green">Strong</span></td>\n          </tr>\n          <tr>\n            <td class="bold">TOF | Brand Prospecting Broad</td>\n            <td class="right">$1,290.00</td>\n            <td class="right">14</td>\n            <td class="right">$2,140.00</td>\n            <td class="right bold green">1.66x</td>\n            <td class="right">$92.14</td>\n            <td><span class="badge badge-orange">Watch</span></td>\n          </tr>\n\n        </tbody>\n      </table>\n\n    </div>\n\n    <!-- Revenue Waterfall -->\n    <div class="data-card">\n      <h3>Where Every Dollar Goes</h3>\n      <div style="padding: 16px 0;">\n        <div class="progress-row">\n          <div class="progress-label"><span class="bold">Net Profit (42.8%)</span><span class="green bold">$20,290</span></div>\n          <div class="progress-bar" style="height:32px; border-radius:6px;"><div class="progress-fill" style="width:42.8%; background:linear-gradient(90deg, #1a5e1f, #2d7a32); border-radius:6px;"></div></div>\n        </div>\n        <div class="progress-row">\n          <div class="progress-label"><span class="bold">Ad Spend (18.2%)</span><span class="red bold">$8,640</span></div>\n          <div class="progress-bar" style="height:32px; border-radius:6px;"><div class="progress-fill" style="width:18.2%; background:linear-gradient(90deg, #e8621a, #ff8a50); border-radius:6px;"></div></div>\n        </div>\n        <div class="progress-row">\n          <div class="progress-label"><span class="bold">COGS (32.8%)</span><span style="color:#666;" class="bold">$15,560</span></div>\n          <div class="progress-bar" style="height:32px; border-radius:6px;"><div class="progress-fill" style="width:32.8%; background:linear-gradient(90deg, #999, #bbb); border-radius:6px;"></div></div>\n        </div>\n      </div>\n      <div style="text-align:center; font-size:13px; color:#666; margin-top:8px;">\n        Out of every $1.00 in revenue: <strong style="color:#1a5e1f;">$0.43 profit</strong> · <strong style="color:#e8621a;">$0.18 ads</strong> · <strong style="color:#888;">$0.33 COGS</strong>\n      </div>\n    </div>\n  </div>\n\n  <!-- PRODUCT PERFORMANCE -->\n  <div class="section">\n    <div class="section-number">Section 3</div>\n    <div class="section-title">Product Performance</div>\n\n    <div class="data-card">\n      <table>\n        <thead>\n          <tr>\n            <th>Product</th>\n            <th class="right">Orders</th>\n            <th class="right">Units</th>\n            <th class="right">Revenue</th>\n            <th class="right">% of Sales</th>\n            <th></th>\n          </tr>\n        </thead>\n        <tbody>\n                    <tr>\n            <td class="bold">Heritage Field Jacket</td>\n            <td class="right">49</td>\n            <td class="right">49</td>\n            <td class="right">$14,140.00</td>\n            <td class="right">28.9%</td>\n            <td><span class="badge badge-green">Hero Drop</span></td>\n          </tr>\n          <tr>\n            <td class="bold">Selvedge 5-Pocket Denim</td>\n            <td class="right">76</td>\n            <td class="right">78</td>\n            <td class="right">$11,820.00</td>\n            <td class="right">24.2%</td>\n            <td><span class="badge badge-green">Bestseller</span></td>\n          </tr>\n          <tr>\n            <td class="bold">Heritage Tee · 3-Pack</td>\n            <td class="right">98</td>\n            <td class="right">102</td>\n            <td class="right">$7,910.00</td>\n            <td class="right">16.2%</td>\n            <td><span class="badge badge-blue">Volume</span></td>\n          </tr>\n          <tr>\n            <td class="bold">Waxed Canvas Trucker</td>\n            <td class="right">31</td>\n            <td class="right">31</td>\n            <td class="right">$6,680.00</td>\n            <td class="right">13.7%</td>\n            <td><span class="badge badge-green">High Value</span></td>\n          </tr>\n          <tr>\n            <td class="bold">Wool Crewneck Sweater</td>\n            <td class="right">26</td>\n            <td class="right">26</td>\n            <td class="right">$4,250.00</td>\n            <td class="right">8.7%</td>\n            <td><span class="badge badge-blue">Carryover</span></td>\n          </tr>\n\n        </tbody>\n      </table>\n    </div>\n\n    <div class="callout callout-green">\n      <h4>Insight</h4>\n      <p>The Heritage Field Jacket launch is delivering. Up-mix from $144 to $154 AOV is the entire story — same traffic, higher tickets. Lean into bundle pairings (jacket + tee, jacket + denim) for the next four weeks.</p>\n    </div>\n  </div>\n\n  <!-- TRAFFIC & CHANNELS -->\n  <div class="section">\n    <div class="section-number">Section 4</div>\n    <div class="section-title">Website Traffic & Channels</div>\n\n    <div class="two-col">\n      <div class="data-card">\n        <h3>Device Performance</h3>\n        <table>\n          <thead><tr><th>Device</th><th class="right">Sessions</th><th class="right">Purchases</th><th class="right">Revenue</th><th class="right">Conv Rate</th></tr></thead>\n          <tbody>\n                        <tr>\n              <td class="bold">Mobile</td>\n              <td class="right">15,940 (72%)</td>\n              <td class="right">152</td>\n              <td class="right">$23,470</td>\n              <td class="right"><span class="badge badge-red">0.95%</span></td>\n            </tr>\n            <tr>\n              <td class="bold">Desktop</td>\n              <td class="right">5,180 (23%)</td>\n              <td class="right">142</td>\n              <td class="right">$22,840</td>\n              <td class="right"><span class="badge badge-green">2.74%</span></td>\n            </tr>\n            <tr>\n              <td class="bold">Tablet</td>\n              <td class="right">1,020 (5%)</td>\n              <td class="right">24</td>\n              <td class="right">$2,610</td>\n              <td class="right">2.35%</td>\n            </tr>\n\n          </tbody>\n        </table>\n\n        <div class="callout" style="margin-top:16px;">\n          <h4>Mobile Gap = Lost Revenue</h4>\n          <p>If mobile converted at the desktop rate (2.74%), that\'s <strong>284 additional purchases</strong> and roughly <strong>$43,700 in extra monthly revenue</strong>. Mobile checkout redesign ships in week 2 of next month.</p>\n        </div>\n      </div>\n\n      <div class="data-card">\n        <h3>Top Landing Pages</h3>\n        <table>\n          <thead><tr><th>Page</th><th class="right">Sessions</th><th class="right">Conv</th></tr></thead>\n          <tbody>\n                        <tr><td>/ (homepage)</td><td class="right">8,210</td><td class="right">2.1%</td></tr>\n            <tr><td>/products/heritage-field-jacket</td><td class="right">3,840</td><td class="right"><span class="badge badge-green">3.6%</span></td></tr>\n            <tr><td>/products/selvedge-denim</td><td class="right">2,920</td><td class="right"><span class="badge badge-green">3.1%</span></td></tr>\n            <tr><td>/the-stoneline-story</td><td class="right">1,580</td><td class="right">1.4%</td></tr>\n            <tr><td>/collection/heritage</td><td class="right">1,210</td><td class="right">1.2%</td></tr>\n            <tr><td>/journal/break-in-selvedge</td><td class="right">980</td><td class="right">2.4%</td></tr>\n\n          </tbody>\n        </table>\n\n        <div class="callout" style="margin-top:16px;">\n          <h4>Insight</h4>\n          <p><strong>/products/heritage-field-jacket converts at 3.6%</strong> — best performer among high-traffic pages. Funnel paid traffic here, not the homepage.</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- CONVERSION FUNNEL -->\n  <div class="section">\n    <div class="section-number">Section 5</div>\n    <div class="section-title">Conversion Funnel</div>\n\n    <div class="data-card" style="text-align:center; padding: 32px;">\n      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;">\n\n        <div class="funnel-step">\n          <div class="funnel-bar" style="width: 200px; background: #1a5e1f;">22,140</div>\n          <div class="funnel-label">Sessions</div>\n        </div>\n\n        <div class="funnel-arrow">&#8594;</div>\n\n        <div class="funnel-step" style="position:relative;">\n          <div class="funnel-rate">8.7% make it</div>\n          <div class="funnel-bar" style="width: 120px; background: #2d7a32;">1,920</div>\n          <div class="funnel-label">Add to Cart</div>\n        </div>\n\n        <div class="funnel-arrow">&#8594;</div>\n\n        <div class="funnel-step" style="position:relative;">\n          <div class="funnel-rate" style="color:#C62828;">42.3% proceed</div>\n          <div class="funnel-bar" style="width: 80px; background: #e8621a;">812</div>\n          <div class="funnel-label">Checkout</div>\n        </div>\n\n        <div class="funnel-arrow">&#8594;</div>\n\n        <div class="funnel-step" style="position:relative;">\n          <div class="funnel-rate" style="color:#2d7a32;">39.2% complete</div>\n          <div class="funnel-bar" style="width: 70px; background: #C62828;">318</div>\n          <div class="funnel-label">Purchase</div>\n        </div>\n\n      </div>\n\n      <div style="margin-top: 32px; display: flex; gap: 16px; justify-content: center;">\n        <div style="background:#FFEBEE; padding: 16px 24px; border-radius: 10px; text-align: center;">\n          <div style="font-size: 28px; font-weight: 700; color: #C62828;">60.8%</div>\n          <div style="font-size: 12px; color: #666;">Cart &#8594; Checkout<br>DROP-OFF</div>\n        </div>\n        <div style="background:#FFF3E0; padding: 16px 24px; border-radius: 10px; text-align: center;">\n          <div style="font-size: 28px; font-weight: 700; color: #e8621a;">1,602</div>\n          <div style="font-size: 12px; color: #666;">People abandoned<br>after adding to cart</div>\n        </div>\n        <div style="background:#E8F5E9; padding: 16px 24px; border-radius: 10px; text-align: center;">\n          <div style="font-size: 28px; font-weight: 700; color: #2d7a32;">~$246,400</div>\n          <div style="font-size: 12px; color: #666;">Estimated lost<br>revenue (at $153.84 AOV)</div>\n        </div>\n      </div>\n    </div>\n\n    <div class="callout">\n      <h4>Abandoned Cart Recovery: Live</h4>\n      <p>A 5-email recovery sequence is <strong>live in Brevo</strong> and firing every 2 hours via cron. Sequence runs over ~9 days: gentle nudge, math + social proof, founder story, 10% discount, last chance. Based on industry benchmarks (5-10% recovery rate), this is recovering an estimated <strong>$12,320 - $24,640/month</strong> in lost sales that would have walked. We watch the open / click / converted rates weekly and tune copy from the bottom of the sequence first.</p>\n    </div>\n  </div>\n\n  <!-- SEO -->\n  <div class="section">\n    <div class="section-number">Section 6</div>\n    <div class="section-title">SEO & Organic Search</div>\n\n    <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr);">\n      <div class="kpi-card">\n        <div class="value">1,840</div>\n        <div class="label">Clicks</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">82.4K</div>\n        <div class="label">Impressions</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value warning">2.2%</div>\n        <div class="label">Avg CTR</div>\n      </div>\n      <div class="kpi-card">\n        <div class="value">11.8</div>\n        <div class="label">Avg Position</div>\n      </div>\n    </div>\n\n    <div class="two-col">\n      <div class="data-card">\n        <h3>Top Search Queries (What People Google)</h3>\n        <table>\n          <thead><tr><th>Query</th><th class="right">Clicks</th><th class="right">Impressions</th><th class="right">CTR</th><th class="right">Position</th></tr></thead>\n          <tbody>\n                        <tr><td class="bold">selvedge denim brands</td><td class="right">218</td><td class="right">4,820</td><td class="right"><span class="badge badge-green">4.5%</span></td><td class="right">4.2</td></tr>\n            <tr><td class="bold">heritage menswear</td><td class="right">142</td><td class="right">3,210</td><td class="right">4.4%</td><td class="right">5.8</td></tr>\n            <tr><td class="bold">best field jacket men</td><td class="right">128</td><td class="right">5,940</td><td class="right">2.2%</td><td class="right">9.4</td></tr>\n            <tr><td class="bold">made in usa menswear</td><td class="right">96</td><td class="right">2,810</td><td class="right">3.4%</td><td class="right">7.4</td></tr>\n            <tr><td class="bold">waxed canvas jacket</td><td class="right">71</td><td class="right">1,920</td><td class="right">3.7%</td><td class="right">8.1</td></tr>\n            <tr><td>how to break in selvedge denim</td><td class="right">58</td><td class="right">1,420</td><td class="right">4.1%</td><td class="right">3.1</td></tr>\n            <tr><td>raw denim care</td><td class="right">42</td><td class="right">1,180</td><td class="right">3.6%</td><td class="right">6.2</td></tr>\n            <tr><td>heritage chinos</td><td class="right">38</td><td class="right">980</td><td class="right">3.9%</td><td class="right">7.5</td></tr>\n\n          </tbody>\n        </table>\n      </div>\n\n      <div class="data-card">\n        <h3>Top Pages in Google Search</h3>\n        <table>\n          <thead><tr><th>Page</th><th class="right">Clicks</th><th class="right">Impressions</th><th class="right">CTR</th></tr></thead>\n          <tbody>\n                        <tr><td class="bold">/products/selvedge-denim</td><td class="right">312</td><td class="right">7,420</td><td class="right">4.2%</td></tr>\n            <tr><td class="bold">/the-stoneline-story</td><td class="right">178</td><td class="right">4,810</td><td class="right">3.7%</td></tr>\n            <tr><td class="bold">/products/heritage-fie...</td><td class="right">164</td><td class="right">3,920</td><td class="right">4.2%</td></tr>\n            <tr><td class="bold">/journal/break-in-selv...</td><td class="right">142</td><td class="right">3,180</td><td class="right">4.5%</td></tr>\n            <tr><td class="bold">/journal/made-in-usa-s...</td><td class="right">98</td><td class="right">2,840</td><td class="right">3.5%</td></tr>\n            <tr><td class="bold">/collection/heritage</td><td class="right">86</td><td class="right">5,610</td><td class="right"><span class="badge badge-red">1.5%</span></td></tr>\n\n          </tbody>\n        </table>\n\n        <div class="callout" style="margin-top:16px;">\n          <h4>Quick Win</h4>\n          <p>"/collection/heritage" has <strong>5,610 impressions but only 1.5% CTR</strong>. Improving the meta title/description for that page could add 140-220 clicks/month for free.</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- CUSTOMER GEOGRAPHY -->\n  <div class="section">\n    <div class="section-number">Section 7</div>\n    <div class="section-title">Customer Geography</div>\n\n    <div class="data-card">\n      <h3>Orders by State</h3>\n      <div style="display: flex; gap: 24px; flex-wrap: wrap; padding: 16px 0;">\n        <div style="flex: 1; min-width: 300px;">\n                    <div class="progress-row">\n            <div class="progress-label"><span class="bold">CA</span><span>72 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:100%; background:#1a5e1f;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">NY</span><span>54 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:75%; background:#2d7a32;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">TX</span><span>41 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:57%; background:#4CAF50;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">WA</span><span>28 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:39%; background:#66BB6A;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">OR</span><span>22 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:31%; background:#66BB6A;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">CO</span><span>18 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:25%; background:#81C784;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">MA</span><span>16 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:22%; background:#81C784;"></div></div>\n          </div>\n          <div class="progress-row">\n            <div class="progress-label"><span class="bold">IL</span><span>14 orders</span></div>\n            <div class="progress-bar"><div class="progress-fill" style="width:19%; background:#81C784;"></div></div>\n          </div>\n\n        </div>\n\n        <div style="flex: 0 0 280px; background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center;">\n          <div style="font-size: 48px; font-weight: 700; color: #1a5e1f;">40%</div>\n          <div style="font-size: 14px; color: #666; margin-bottom: 16px;">of orders from CA + NY</div>\n          <div style="font-size: 13px; color: #555; text-align: left; line-height: 1.8;">\n            Premium menswear sells where premium menswear is worn<br>CA = home base for the brand story<br>NY = highest AOV per customer\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- RECOMMENDATIONS -->\n  <div class="section">\n    <div class="section-number">Section 8</div>\n    <div class="section-title">Recommendations & Action Items</div>\n\n    <div class="three-col">\n      <div class="data-card" style="border-top: 4px solid #C62828;">\n        <h3 style="color:#C62828;">High Priority</h3>\n        <div style="font-size:14px; line-height: 2;">\n                    <div><strong>1.</strong> Scale Heritage Field Jacket campaign +20%</div>\n          <div style="font-size:12px; color:#666; margin-bottom:8px;">→ 2.68x ROAS, room to push</div>\n          <div><strong>2.</strong> Ship mobile checkout redesign</div>\n          <div style="font-size:12px; color:#666; margin-bottom:8px;">→ ~$43,700/mo upside if mobile hits desktop\'s rate</div>\n          <div><strong>3.</strong> Add Tuesday product story email</div>\n          <div style="font-size:12px; color:#666;">→ Welcome series at 2.55%, cadence cap is the bottleneck</div>\n        </div>\n      </div>\n\n      <div class="data-card" style="border-top: 4px solid #e8621a;">\n        <h3 style="color:#e8621a;">Medium Priority</h3>\n        <div style="font-size:14px; line-height: 2;">\n                    <div><strong>4.</strong> Pause Brand Prospecting Broad (1.66x)</div>\n          <div style="font-size:12px; color:#666; margin-bottom:8px;">→ Reallocate to retargeting + lookalikes</div>\n          <div><strong>5.</strong> Rewrite /collection/heritage meta tags</div>\n          <div style="font-size:12px; color:#666; margin-bottom:8px;">→ 5,610 impressions / 1.5% CTR — quick win</div>\n          <div><strong>6.</strong> Bundle Heritage Jacket + Tee 3-pack</div>\n          <div style="font-size:12px; color:#666;">→ AOV play, two top sellers</div>\n        </div>\n      </div>\n\n      <div class="data-card" style="border-top: 4px solid #1a5e1f;">\n        <h3 style="color:#1a5e1f;">Growth Plays</h3>\n        <div style="font-size:14px; line-height: 2;">\n                    <div><strong>7.</strong> SEO content: 2 articles/week through Q2</div>\n          <div style="font-size:12px; color:#666; margin-bottom:8px;">→ Each click is now $5.69 in revenue</div>\n          <div><strong>8.</strong> Launch abandoned cart sequence</div>\n          <div style="font-size:12px; color:#666; margin-bottom:8px;">→ 1,602 abandoned ATCs, ~$12-25k recovery range</div>\n          <div><strong>9.</strong> Test post-purchase replenishment at day 60</div>\n          <div style="font-size:12px; color:#666;">→ Repeat rate is climbing, capture it</div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- FOOTER -->\n  <div class="report-footer">\n    <p>\n      <strong>Stoneline Apparel by Stoneline Apparel</strong><br>\n      Report prepared by Venti Scale - April 28, 2026<br>\n      Data sources: Google Analytics 4 &middot; Google Search Console &middot; WooCommerce &middot; Meta Ads<br><br>\n      <em>Next report: May 28, 2026</em>\n    </p>\n  </div>\n\n</div>\n</body>\n</html>\n\n',
  "seo-monthly-2026-04": '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>Stoneline Apparel · Monthly SEO Report · Apr 1 – Apr 28, 2026</title>\n<style>\n  :root {\n    --ink: #0F1115;\n    --ink-muted: #4A5160;\n    --ink-subtle: #8A93A4;\n    --accent: #2F7D3F;\n    --accent-soft: #EAF5EC;\n    --warn: #B3721D;\n    --warn-soft: #FBF3E1;\n    --danger: #B03A2E;\n    --danger-soft: #FBE9E5;\n    --border: #E8EAF0;\n    --surface: #FAFBFC;\n  }\n  * { box-sizing: border-box; }\n  body {\n    font-family: -apple-system, BlinkMacSystemFont, \'Inter\', \'Segoe UI\', Roboto, sans-serif;\n    color: var(--ink); background: #ffffff;\n    margin: 0; padding: 48px 56px 72px;\n    line-height: 1.6; font-size: 15px;\n    -webkit-font-smoothing: antialiased;\n  }\n  .wrap { max-width: 860px; margin: 0 auto; }\n  .hero {\n    background: linear-gradient(135deg, #1a5e1f 0%, #2F7D3F 100%);\n    color: #fff; border-radius: 16px;\n    padding: 32px 36px; margin-bottom: 28px;\n  }\n  .hero h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: -0.015em; font-weight: 700; }\n  .hero .sub { margin: 0; opacity: 0.85; font-size: 14px; }\n  .hero .period { margin-top: 14px; font-size: 12px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.08em; }\n  .eyebrow {\n    font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em;\n    color: var(--accent); font-weight: 700; margin: 36px 0 8px;\n  }\n  h2 { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 14px; color: var(--ink); }\n  p { margin: 0 0 14px; }\n  .lead { font-size: 16px; color: var(--ink); margin-bottom: 20px; }\n  .summary-box {\n    background: var(--surface); border: 1px solid var(--border);\n    border-left: 4px solid var(--accent);\n    padding: 18px 24px; border-radius: 12px; margin: 4px 0 24px;\n  }\n  .summary-box p { margin: 0 0 8px; font-size: 15px; color: var(--ink); }\n  .summary-box p:last-child { margin-bottom: 0; }\n  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 8px 0 20px; }\n  .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; }\n  .kpi .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-subtle); font-weight: 600; margin-bottom: 6px; }\n  .kpi .value { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); line-height: 1.1; font-variant-numeric: tabular-nums; }\n  .kpi .sub { font-size: 11px; margin-top: 6px; }\n  table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin-bottom: 8px; }\n  thead th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-subtle); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--border); }\n  tbody td { padding: 10px; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }\n  tbody tr:last-child td { border-bottom: none; }\n  td.right, th.right { text-align: right; }\n  td.bold, .bold { font-weight: 600; }\n  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }\n  .badge-green { background: var(--accent-soft); color: var(--accent); }\n  .badge-red   { background: var(--danger-soft); color: var(--danger); }\n  .badge-warn  { background: var(--warn-soft); color: var(--warn); }\n  .delta { display: inline-block; font-size: 11px; font-weight: 600; padding: 1px 6px; border-radius: 4px; margin-left: 4px; }\n  .delta-good { color: var(--accent); background: var(--accent-soft); }\n  .delta-bad  { color: var(--danger); background: var(--danger-soft); }\n  .delta-neutral { color: var(--ink-subtle); background: #F1F3F7; }\n  .callout { border-left: 3px solid var(--accent); background: var(--accent-soft); border-radius: 0 10px 10px 0; padding: 14px 18px; margin: 14px 0 18px; }\n  .callout-warn { border-left-color: var(--warn); background: var(--warn-soft); }\n  .callout-warn .callout-title { color: var(--warn); }\n  .callout-bad { border-left-color: var(--danger); background: var(--danger-soft); }\n  .callout-bad .callout-title { color: var(--danger); }\n  .callout-good { border-left-color: var(--accent); background: var(--accent-soft); }\n  .callout-good .callout-title { color: var(--accent); }\n  .callout-title { font-weight: 700; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; }\n  .callout-body { font-size: 14px; color: var(--ink-muted); }\n  .callout-body ul { margin: 6px 0 0; padding-left: 18px; }\n  .callout-body li { margin-bottom: 4px; }\n  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 14px 0 20px; }\n  .two-col .callout { margin: 0; }\n  .content-list { list-style: none; padding: 0; margin: 6px 0 0; }\n  .content-list li { padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.08); font-size: 13.5px; }\n  .content-list li:last-child { border-bottom: none; }\n  .content-list .kw { color: var(--ink-subtle); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size: 11.5px; }\n  .footer { margin-top: 36px; font-size: 12px; color: var(--ink-subtle); border-top: 1px solid var(--border); padding-top: 16px; }\n  @media (max-width: 720px) {\n    body { padding: 24px 20px 60px; }\n    .kpi-row { grid-template-columns: repeat(2, 1fr); }\n    .two-col { grid-template-columns: 1fr; }\n  }\n</style>\n</head>\n<body>\n<div class="wrap">\n\n  <div class="hero">\n    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.12em; opacity:0.85; margin-bottom:8px;">Stoneline Apparel · Heritage Menswear</div>\n    <h1>Monthly SEO Report</h1>\n    <p class="sub">Full monthly view. Search performance, what changed vs last month, the revenue it drove, and the work behind it.</p>\n    <div class="period">Period · Apr 1 – Apr 28, 2026 · 28-day window<br>Compared to · 2026-03-04 to 2026-03-31</div>\n  </div>\n\n  <div class="eyebrow">Executive Summary</div>\n  <h2>The 30-second read</h2>\n  <div class="summary-box">\n    <p>Clicks are up: <strong>1,840</strong> this period vs 1,420 last period (<strong>+30%</strong>). Average position improved from 14.2 to 11.8.</p><p>Organic search drove <strong>$10,470</strong> in revenue from 5,210 sessions. <strong>"selvedge denim brands"</strong> is the top driver: 218 clicks at position 4.2.</p>\n  </div>\n\n  <div class="eyebrow">Search Performance</div>\n  <h2>Top-line metrics (vs prior 28 days)</h2>\n  <div class="kpi-row">\n    <div class="kpi"><div class="label">Clicks</div><div class="value">1,840</div><div class="sub"><span class="delta delta-good">↑ 30%</span></div></div>\n    <div class="kpi"><div class="label">Impressions</div><div class="value">82,400</div><div class="sub"><span class="delta delta-good">↑ 24%</span></div></div>\n    <div class="kpi"><div class="label">Avg CTR</div><div class="value">2.2%</div><div class="sub"><span class="delta delta-good">↑ 4%</span></div></div>\n    <div class="kpi"><div class="label">Avg Position</div><div class="value">11.8</div><div class="sub"><span class="delta delta-good">↑ 2.4</span></div></div>\n  </div>\n\n  <div class="eyebrow">Revenue Impact</div>\n  <h2>What organic search earned</h2>\n  \n        <div class="kpi-row">\n          <div class="kpi"><div class="label">Organic Sessions</div><div class="value">5,210</div></div>\n          <div class="kpi"><div class="label">Organic Orders</div><div class="value">71</div></div>\n          <div class="kpi"><div class="label">Organic Revenue</div><div class="value">$10,470</div></div>\n          <div class="kpi"><div class="label">$/Search Click</div><div class="value">$5.69</div></div>\n        </div>\n        <p class="lead">For every 28-day window, organic search currently turns <strong>1,840 clicks</strong> into <strong>71 orders</strong> at <strong>$147 AOV</strong>. That puts a real dollar number on every position we win or lose.</p>\n\n  <div class="two-col"><div class="callout callout-good"><div class="callout-title">↑ Climbing</div><div class="callout-body"><ul><li><strong>selvedge denim brands</strong> — now 218 clicks (Δ +89), position 4.2 (Δ +3.1)</li><li><strong>waxed canvas jacket</strong> — now 71 clicks (Δ +44), position 8.1 (Δ +2.3)</li><li><strong>heritage menswear</strong> — now 142 clicks (Δ +54), position 5.8 (Δ +2.2)</li><li><strong>best field jacket men</strong> — now 128 clicks (Δ +31), position 9.4 (Δ +1.8)</li></ul></div></div></div>\n\n  <div class="eyebrow">Section · Queries</div>\n  <h2>Top search queries (with movement)</h2>\n  <table>\n    <thead>\n      <tr><th>Query</th><th class="right">Clicks (Δ)</th><th class="right">Impressions</th><th class="right">CTR</th><th class="right">Position (Δ)</th></tr>\n    </thead>\n    <tbody>\n          <tr><td class="bold">selvedge denim brands</td><td class="right">218 <span class="delta delta-good">↑ 69%</span></td><td class="right">4,820</td><td class="right">4.5%</td><td class="right">4.2 <span class="delta delta-good">↑ 3.1</span></td></tr>\n          <tr><td class="bold">heritage menswear</td><td class="right">142 <span class="delta delta-good">↑ 61%</span></td><td class="right">3,210</td><td class="right">4.4%</td><td class="right">5.8 <span class="delta delta-good">↑ 2.2</span></td></tr>\n          <tr><td class="bold">best field jacket men</td><td class="right">128 <span class="delta delta-good">↑ 32%</span></td><td class="right">5,940</td><td class="right">2.2%</td><td class="right">9.4 <span class="delta delta-good">↑ 1.8</span></td></tr>\n          <tr><td class="bold">made in usa menswear</td><td class="right">96 <span class="delta delta-good">↑ 66%</span></td><td class="right">2,810</td><td class="right">3.4%</td><td class="right">7.4 <span class="delta delta-good">↑ 1.6</span></td></tr>\n          <tr><td class="bold">waxed canvas jacket</td><td class="right">71 <span class="delta delta-good">↑ 163%</span></td><td class="right">1,920</td><td class="right">3.7%</td><td class="right">8.1 <span class="delta delta-good">↑ 2.3</span></td></tr>\n          <tr><td class="bold">how to break in selvedge denim</td><td class="right">58 <span class="delta delta-good">↑ 45%</span></td><td class="right">1,420</td><td class="right">4.1%</td><td class="right">3.1 <span class="delta delta-neutral">flat</span></td></tr>\n          <tr><td class="bold">raw denim care</td><td class="right">42 <span class="delta delta-good">↑ 24%</span></td><td class="right">1,180</td><td class="right">3.6%</td><td class="right">6.2 <span class="delta delta-good">↑ 0.8</span></td></tr>\n          <tr><td class="bold">heritage chinos</td><td class="right">38 <span class="delta delta-good">↑ 41%</span></td><td class="right">980</td><td class="right">3.9%</td><td class="right">7.5 <span class="delta delta-good">↑ 1.4</span></td></tr>\n          <tr><td class="bold">wool crewneck men</td><td class="right">32 <span class="delta delta-neutral">new</span></td><td class="right">920</td><td class="right">3.5%</td><td class="right">8.8 </td></tr>\n          <tr><td class="bold">best mens chore coat</td><td class="right">28 <span class="delta delta-neutral">new</span></td><td class="right">1,040</td><td class="right">2.7%</td><td class="right">10.2 </td></tr>\n          <tr><td class="bold">selvedge jeans review</td><td class="right">24 <span class="delta delta-neutral">new</span></td><td class="right">680</td><td class="right">3.5%</td><td class="right">9.1 </td></tr>\n          <tr><td class="bold">heritage mens tee</td><td class="right">21 <span class="delta delta-neutral">new</span></td><td class="right">740</td><td class="right">2.8%</td><td class="right">11.2 </td></tr>\n    </tbody>\n  </table>\n\n  <div class="eyebrow">Section · Pages</div>\n  <h2>Top pages (with movement)</h2>\n  <table>\n    <thead>\n      <tr><th>Page</th><th class="right">Clicks (Δ)</th><th class="right">Impressions</th><th class="right">CTR</th></tr>\n    </thead>\n    <tbody>\n          <tr><td class="bold">https://stonelineapparel.com/produc…</td><td class="right">312 <span class="delta delta-good">↑ 58%</span></td><td class="right">7,420</td><td class="right">4.2%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/the-st…</td><td class="right">178 <span class="delta delta-good">↑ 32%</span></td><td class="right">4,810</td><td class="right">3.7%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/produc…</td><td class="right">164 <span class="delta delta-good">↑ 125%</span></td><td class="right">3,920</td><td class="right">4.2%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/journa…</td><td class="right">142 <span class="delta delta-good">↑ 41%</span></td><td class="right">3,180</td><td class="right">4.5%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/journa…</td><td class="right">98 <span class="delta delta-good">↑ 22%</span></td><td class="right">2,840</td><td class="right">3.5%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/collec…</td><td class="right">86 <span class="delta delta-good">↑ 19%</span></td><td class="right">5,610</td><td class="right">1.5%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/journa…</td><td class="right">64 <span class="delta delta-neutral">new</span></td><td class="right">1,920</td><td class="right">3.3%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/produc…</td><td class="right">52 <span class="delta delta-neutral">new</span></td><td class="right">1,540</td><td class="right">3.4%</td></tr>\n          <tr><td class="bold">https://stonelineapparel.com/journa…</td><td class="right">48 <span class="delta delta-neutral">new</span></td><td class="right">1,280</td><td class="right">3.8%</td></tr>\n    </tbody>\n  </table>\n\n  \n\n  <div class="eyebrow">Section · Devices</div>\n  <h2>Search by device</h2>\n  <table>\n    <thead><tr><th>Device</th><th class="right">Clicks</th><th class="right">Impressions</th><th class="right">CTR</th></tr></thead>\n    <tbody>\n          <tr><td class="bold">Mobile</td><td class="right">1,290</td><td class="right">58,200</td><td class="right">2.2%</td></tr>\n          <tr><td class="bold">Desktop</td><td class="right">480</td><td class="right">21,800</td><td class="right">2.2%</td></tr>\n          <tr><td class="bold">Tablet</td><td class="right">70</td><td class="right">2,400</td><td class="right">2.9%</td></tr>\n    </tbody>\n  </table>\n\n  <div class="eyebrow">The Work Behind the Numbers</div>\n  <h2>What we shipped + what\'s next</h2>\n  \n        <div class="callout callout-good">\n          <div class="callout-title">Content shipped this period (6 posts)</div>\n          <div class="callout-body"><ul class="content-list"><li><strong>Apr 04</strong> — How to break in selvedge denim (the proper way) <span class="kw">[break in selvedge denim]</span></li><li><strong>Apr 09</strong> — Made in USA menswear: what the label actually means <span class="kw">[made in usa menswear]</span></li><li><strong>Apr 13</strong> — Field jacket vs chore coat: which one earns its place <span class="kw">[best field jacket men]</span></li><li><strong>Apr 17</strong> — Why we run waxed canvas (and how to care for it) <span class="kw">[waxed canvas jacket]</span></li><li><strong>Apr 22</strong> — Heritage chinos: the cut, the cloth, the case for them <span class="kw">[heritage chinos]</span></li><li><strong>Apr 26</strong> — A 12-piece spring capsule, fully styled <span class="kw">[spring capsule menswear]</span></li></ul></div>\n        </div>\n  \n        <div class="callout">\n          <div class="callout-title">Coming next (4 scheduled)</div>\n          <div class="callout-body"><ul class="content-list"><li><strong>May 01</strong> — Best heritage menswear brands of 2026 (head-to-head) <span class="kw">[heritage menswear brands]</span></li><li><strong>May 06</strong> — How to wear a field jacket year-round <span class="kw">[how to wear field jacket]</span></li><li><strong>May 11</strong> — Wool vs cotton crewneck: when to wear which <span class="kw">[wool crewneck men]</span></li><li><strong>May 15</strong> — The case for buying fewer, better menswear pieces <span class="kw">[buy less better menswear]</span></li></ul></div>\n        </div>\n\n  <p class="footer">\n    Stoneline Apparel by Stoneline Apparel · Report prepared by Venti Scale — April 28, 2026<br>\n    Data sources: Google Search Console (sc-domain:stonelineapparel.com) · Google Analytics 4 · WooCommerce<br>\n    Comparison window: 2026-03-04 to 2026-03-31 · Next report: May 26, 2026\n  </p>\n</div>\n</body>\n</html>\n',
};

export async function getReportHtml(id: string): Promise<string | null> {
  return REPORT_HTML[id] || null;
}

// ──────────────────────────────────────────────────────────
// Content drafts
// ──────────────────────────────────────────────────────────
// Demo image source — Unsplash CDN, varied menswear/lifestyle photography
// matching the Stoneline brand. Kept here so future demo edits stay tight.
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=85&auto=format&fit=crop`;

export async function getContentDrafts(): Promise<ContentDraft[]> {
  return [
    {
      id: "fb-2026-04-10-morning",
      date: "2026-04-10",
      slot: "morning",
      platform: "facebook",
      topic: "Why we only use selvedge denim (and why it matters)",
      caption:
        "The reason your jeans fade like a photograph instead of a phone screen has a name: selvedge.\n\nIt's slow-woven on vintage shuttle looms. One pair takes 3x longer to make. You pay for the time — but you wear them for a decade.\n\nHeritage isn't a marketing word for us. It's the supply chain.",
      imagePrompt: "",
      comments: [],
      cta: "Shop the denim",
      isProductPost: false,
      status: "scheduled",
      reviewedAt: null,
      reviewerNotes: null,
      scheduledAt: null,
      driveFileId: null,
      mediaType: "image",
      mockThumbnailUrl: UNSPLASH("1604644401890-0bd678c83788"),
    },
    {
      id: "li-2026-04-10",
      date: "2026-04-10",
      slot: "morning",
      platform: "linkedin",
      topic: "How we run a DTC menswear brand with one person + AI",
      caption:
        "Running a menswear brand used to mean a team of 8. In 2026 it means one operator and the right system.\n\nHere's the stack we run at Stoneline:\n\n- Marketing: done-for-you, AI-assisted (that's Venti Scale)\n- Fulfillment: 3PL in Indianapolis\n- Customer service: me, two hours a day, Loom for complex issues\n- Manufacturing: one mill, one cut-and-sew, long-term contracts\n\nThe leverage isn't in the tools. It's in saying no to everything else.",
      imagePrompt: "",
      comments: [],
      cta: "",
      isProductPost: false,
      status: "scheduled",
      reviewedAt: null,
      reviewerNotes: null,
      scheduledAt: null,
      driveFileId: null,
      mediaType: null,
    },
    {
      id: "fb-2026-04-10-midday",
      date: "2026-04-10",
      slot: "midday",
      platform: "facebook",
      topic: "Field jacket back in stock",
      caption:
        "The waxed-cotton field jacket is back. Last run sold out in 72 hours.\n\nBuilt with a single mill in Pennsylvania. Stitched by the same three people who stitched the last batch. Guaranteed for ten years — send it back and we'll rewax it free.\n\n$189. Limited run of 80.",
      imagePrompt: "",
      comments: [
        "Sizes go up to XXL. Fits true — if you're between sizes, go up one.",
      ],
      cta: "Shop field jackets",
      isProductPost: true,
      status: "scheduled",
      reviewedAt: null,
      reviewerNotes: null,
      scheduledAt: null,
      driveFileId: null,
      mediaType: "image",
      mockThumbnailUrl: UNSPLASH("1542272604-787c3835535d"),
    },
    {
      id: "fb-2026-04-10-evening",
      date: "2026-04-10",
      slot: "evening",
      platform: "facebook",
      topic: "Customer photo: Jake's selvedge at 18 months",
      caption:
        "Jake sent us this photo of his raw denim at 18 months. The fades are earned, not washed in.\n\nThis is the whole point of raw denim. It becomes a map of your life.\n\nThanks for the photo, Jake.",
      imagePrompt: "",
      comments: [],
      cta: "",
      isProductPost: false,
      status: "scheduled",
      reviewedAt: null,
      reviewerNotes: null,
      scheduledAt: null,
      driveFileId: null,
      mediaType: "image",
      mockThumbnailUrl: UNSPLASH("1521577352947-9bb58764b69a"),
    },
    {
      id: "fb-2026-04-11-morning",
      date: "2026-04-11",
      slot: "morning",
      platform: "facebook",
      topic: "Why we don't run sales",
      caption:
        "Here's a weird thing about Stoneline: we don't discount. No Black Friday, no spring sale, no \"last chance.\"\n\nReason: if a $189 jacket is worth it, it's worth it in March. And if it's not, a 20% coupon doesn't fix that.\n\nWe price it right the first time. Then we stand behind it for ten years.",
      imagePrompt: "",
      comments: [],
      cta: "",
      isProductPost: false,
      status: "scheduled",
      reviewedAt: null,
      reviewerNotes: null,
      scheduledAt: null,
      driveFileId: null,
      mediaType: "image",
      mockThumbnailUrl: UNSPLASH("1503342394128-c104d54dba01"),
    },
    {
      id: "li-2026-04-11",
      date: "2026-04-11",
      slot: "morning",
      platform: "linkedin",
      topic: "The one KPI we watch every morning",
      caption:
        "Every morning at Stoneline, the first number I check isn't revenue.\n\nIt's the ratio of repeat customers to new ones.\n\nRevenue tells you this month. Repeat rate tells you the next five years. One of those is a leading indicator. The other is a rearview mirror.\n\nCurrent ratio: 26%. Target by end of year: 40%.",
      imagePrompt: "",
      comments: [],
      cta: "",
      isProductPost: false,
      status: "scheduled",
      reviewedAt: null,
      reviewerNotes: null,
      scheduledAt: null,
      driveFileId: null,
      mediaType: null,
    },
  ];
}

// ──────────────────────────────────────────────────────────
// Email campaigns
// ──────────────────────────────────────────────────────────
export async function getCampaigns(): Promise<CampaignsData> {
  return {
    proposed: [
      {
        id: "cart-abandon-v1",
        name: "Abandoned cart recovery (3-email)",
        type: "automation",
        status: "ready_for_approval",
        audience: "Cart abandoners (last 30 days)",
        audienceSize: 342,
        rationale:
          "Stoneline has no cart abandonment flow live. Industry average recovery for a 3-email sequence is 12-18% of abandoned carts. With 342 abandoners/mo and a $154 AOV, that's $6,300-9,500/mo left on the table.",
        projectedImpact: { revenue: 7800, label: "per month, steady-state" },
        sequence: [
          {
            step: 1,
            delay: "1 hour after abandonment",
            subject: "You left something at Stoneline",
            preview: "Your cart is saved. Finish when you're ready.",
          },
          {
            step: 2,
            delay: "24 hours later",
            subject: "The thing about heritage denim",
            preview: "Why we make one pair slowly instead of a hundred fast.",
          },
          {
            step: 3,
            delay: "72 hours later",
            subject: "Last chance — your cart expires tonight",
            preview: "We're holding your cart until midnight.",
          },
        ],
        createdBy: "Jarvis",
        createdAt: "2026-04-08T09:14:00Z",
      },
      {
        id: "winback-90d",
        name: "90-day winback series",
        type: "automation",
        status: "ready_for_approval",
        audience: "Customers who haven't purchased in 90+ days",
        audienceSize: 186,
        rationale:
          "186 customers went quiet after their first purchase. A winback with a genuine re-engagement angle (not a discount) typically recovers 8-12% of lapsed buyers. Target $3k/mo.",
        projectedImpact: { revenue: 3200, label: "per month, steady-state" },
        sequence: [
          {
            step: 1,
            delay: "Day 0",
            subject: "How are your jeans holding up?",
            preview: "Six months in, the fades start getting interesting.",
          },
          {
            step: 2,
            delay: "Day 5",
            subject: "The new field jacket is back",
            preview: "Small run, 80 pieces, same mill.",
          },
          {
            step: 3,
            delay: "Day 12",
            subject: "We miss you, Marcus",
            preview: "What would bring you back?",
          },
        ],
        createdBy: "Jarvis",
        createdAt: "2026-04-08T11:02:00Z",
      },
    ],
    live: [
      {
        id: "welcome-v2",
        name: "Welcome series (4-email)",
        type: "automation",
        status: "live",
        audience: "New subscribers",
        audienceSize: 1840,
        rationale:
          "Live since March. Averaging 52% open rate and $18 per subscriber over the 4-email arc.",
        projectedImpact: { revenue: 4600, label: "per month, current pace" },
        sequence: [
          { step: 1, delay: "Immediate", subject: "Welcome to Stoneline", preview: "Here's the short story." },
          { step: 2, delay: "Day 2", subject: "How we pick our mills", preview: "One mill, one decade." },
          { step: 3, delay: "Day 5", subject: "Heritage tee bundle — the starter pack", preview: "Three tees, one deal." },
          { step: 4, delay: "Day 9", subject: "Your first Stoneline order", preview: "Free shipping this week." },
        ],
        createdBy: "Jarvis",
        createdAt: "2026-03-12T14:30:00Z",
      },
    ],
    history: [],
    stats: {
      totalSubscribers: 2847,
      monthlyGrowth: 12,
      avgOpenRate: 34.2,
      avgClickRate: 4.2,
      lastSendDate: "2026-04-09",
    },
  };
}

// ──────────────────────────────────────────────────────────
// Activity feed
// ──────────────────────────────────────────────────────────
export async function getActivityFeed(limit = 8): Promise<ActivityItem[]> {
  const items: ActivityItem[] = [
    {
      id: "act-1",
      type: "draft",
      title: "Drafted: Why we only use selvedge denim",
      description: "facebook · morning · 2026-04-10",
      timestamp: "2026-04-10T07:30:00",
    },
    {
      id: "act-2",
      type: "draft",
      title: "Drafted: How we run a DTC brand with one person + AI",
      description: "linkedin · morning · 2026-04-10",
      timestamp: "2026-04-10T07:28:00",
    },
    {
      id: "act-3",
      type: "campaign",
      title: "Abandoned cart recovery — ready for approval",
      description: "3-email sequence · projected +$7,800/mo",
      timestamp: "2026-04-09T14:12:00",
    },
    {
      id: "act-4",
      type: "report",
      title: "Weekly Performance Report generated",
      description: "Mar 31 – Apr 7, +18% WoW",
      timestamp: "2026-04-08T08:00:00",
    },
    {
      id: "act-5",
      type: "post",
      title: "Published: Customer photo — Jake's selvedge at 18 months",
      description: "facebook · 142 reactions so far",
      timestamp: "2026-04-07T18:00:00",
    },
    {
      id: "act-6",
      type: "campaign",
      title: "Welcome series sent to 94 new subscribers this week",
      description: "52% open rate · $1,840 attributed",
      timestamp: "2026-04-07T09:00:00",
    },
    {
      id: "act-7",
      type: "system",
      title: "SEO plan Q2 2026 published",
      description: "12-week content calendar · 18 target keywords",
      timestamp: "2026-04-01T10:00:00",
    },
  ];

  return items.slice(0, limit);
}
