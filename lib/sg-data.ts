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
    title: "Monthly Performance Report · Apr 1-28, 2026",
    date: "2026-04-28",
    type: "client",
    path: "client-monthly-2026-04.html",
  },
  {
    id: "seo-monthly-2026-04",
    title: "Monthly SEO Report · Apr 1-28, 2026",
    date: "2026-04-28",
    type: "seo",
    path: "seo-monthly-2026-04.html",
  },
  {
    id: "strategy-q2-2026",
    title: "Q2 Strategy Brief — 90-day plan",
    date: "2026-04-15",
    type: "internal",
    path: "strategy-q2-2026.html",
  },
];

export async function getReports(): Promise<ReportSummary[]> {
  return DEMO_REPORTS;
}

// Shared style block for all demo reports — mirrors the SG production
// report aesthetic so prospects see the same standard of work.
const DEMO_REPORT_STYLES = `
  :root {
    --ink: #0F1115;
    --ink-muted: #4A5160;
    --ink-subtle: #8A93A4;
    --accent: #1F3D2B;
    --accent-soft: #E6EFE8;
    --gold: #C9A654;
    --warn: #B3721D;
    --warn-soft: #FBF3E1;
    --danger: #B03A2E;
    --danger-soft: #FBE9E5;
    --border: #E8EAF0;
    --border-soft: #F1F3F7;
    --surface: #FAFBFC;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    color: var(--ink); background: #ffffff;
    margin: 0; padding: 48px 56px 72px;
    line-height: 1.6; font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 860px; margin: 0 auto; }
  .hero {
    background: linear-gradient(135deg, #0F1115 0%, #1F3D2B 100%);
    color: #fff; border-radius: 16px;
    padding: 32px 36px; margin-bottom: 28px;
  }
  .hero .brand-mark {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em;
    opacity: 0.85; margin-bottom: 10px;
  }
  .hero h1 { margin: 0 0 6px; font-size: 30px; letter-spacing: -0.018em; font-weight: 700; line-height: 1.15; }
  .hero .sub { margin: 0; opacity: 0.85; font-size: 15px; }
  .hero .period { margin-top: 16px; font-size: 11.5px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.08em; }
  .eyebrow {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--accent); font-weight: 700; margin: 36px 0 8px;
  }
  h2 { font-size: 19px; font-weight: 700; letter-spacing: -0.012em; margin: 0 0 14px; color: var(--ink); }
  h3 { font-size: 15px; font-weight: 700; margin: 20px 0 8px; }
  p { margin: 0 0 14px; color: var(--ink-muted); }
  .lead { font-size: 16px; color: var(--ink); margin-bottom: 20px; }
  em, .italic { font-style: italic; color: var(--ink-muted); }
  strong { color: var(--ink); font-weight: 600; }
  .summary-box {
    background: var(--surface); border: 1px solid var(--border);
    border-left: 4px solid var(--accent);
    padding: 18px 24px; border-radius: 12px; margin: 4px 0 24px;
  }
  .summary-box p { margin: 0 0 10px; font-size: 15px; color: var(--ink); }
  .summary-box p:last-child { margin: 0; }
  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 8px 0 24px; }
  .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; }
  .kpi .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-subtle); font-weight: 600; margin-bottom: 6px; }
  .kpi .value { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); line-height: 1.1; font-variant-numeric: tabular-nums; }
  .kpi .delta { display: inline-block; font-size: 11px; font-weight: 600; padding: 1px 6px; border-radius: 4px; margin-top: 6px; }
  .delta-good { color: var(--accent); background: var(--accent-soft); }
  .delta-bad  { color: var(--danger); background: var(--danger-soft); }
  .delta-neutral { color: var(--ink-subtle); background: var(--border-soft); }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin-bottom: 8px; }
  thead th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-subtle); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--border); }
  tbody td { padding: 10px; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
  tbody tr:last-child td { border-bottom: none; }
  td.right, th.right { text-align: right; }
  td.bold, .bold { font-weight: 600; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
  .badge-green { background: var(--accent-soft); color: var(--accent); }
  .badge-gold { background: #FBF3E1; color: var(--warn); }
  .badge-red { background: var(--danger-soft); color: var(--danger); }
  .callout { border-left: 3px solid var(--accent); background: var(--accent-soft); border-radius: 0 10px 10px 0; padding: 16px 20px; margin: 14px 0 22px; }
  .callout-warn { border-left-color: var(--warn); background: var(--warn-soft); }
  .callout-warn .callout-title { color: var(--warn); }
  .callout-bad { border-left-color: var(--danger); background: var(--danger-soft); }
  .callout-bad .callout-title { color: var(--danger); }
  .callout-title { font-weight: 700; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); }
  .callout-body { font-size: 14px; color: var(--ink-muted); }
  .row { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; margin-bottom: 6px; }
  .row .name { color: var(--ink); font-weight: 500; }
  .row .val { color: var(--ink-muted); font-variant-numeric: tabular-nums; }
  .bar { height: 6px; background: var(--border-soft); border-radius: 999px; overflow: hidden; margin-top: 4px; }
  .bar-fill { height: 100%; background: var(--accent); }
  ul { padding-left: 20px; margin: 12px 0; color: var(--ink-muted); }
  ul li { margin-bottom: 6px; font-size: 14px; }
  .signoff { margin-top: 36px; padding-top: 18px; border-top: 1px solid var(--border); font-size: 14px; color: var(--ink-muted); }
  .signoff .name { font-weight: 600; color: var(--ink); }
  .footer-meta { margin-top: 24px; font-size: 11.5px; color: var(--ink-subtle); }
  @media (max-width: 720px) {
    body { padding: 24px 20px 60px; }
    .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
`;

function demoReportShell(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} · Stoneline Apparel</title>
<style>${DEMO_REPORT_STYLES}</style>
</head>
<body>
<div class="wrap">
${body}
</div>
</body>
</html>`;
}

const REPORT_HTML: Record<string, string> = {
  // ───────────────────────────────────────────────────────────
  // Monthly Performance Report — Stoneline Apparel
  // Mirrors the SG production weekly-report-refresh template.
  // ───────────────────────────────────────────────────────────
  "client-monthly-2026-04": demoReportShell(
    "Monthly Performance Report",
    `
    <div class="hero">
      <div class="brand-mark">Stoneline Apparel · Heritage Menswear</div>
      <h1>Monthly Performance Report</h1>
      <p class="sub">Where the business stands, what changed, what to lean into next.</p>
      <div class="period">Period · April 1-28, 2026 · 28 days &nbsp;·&nbsp; Compared to · March 4-31, 2026</div>
    </div>

    <div class="eyebrow">Executive Summary</div>
    <h2>The 30-second read</h2>
    <div class="summary-box">
      <p>Best month on record. Net revenue hit <strong>$48,920</strong> on 318 orders, up <strong>+24%</strong> versus the prior 28-day window. Average order value climbed from $144 to $154 as the Heritage Field Jacket launch shifted the mix toward higher-ticket pieces.</p>
      <p>Paid spend stayed disciplined: <strong>$8,640 in / $19,290 out</strong> across Meta and Google, blended <strong>2.23x ROAS</strong>. Email did the quiet work — the welcome series alone returned <strong>$5,140</strong> from 142 new subscribers. Mobile conversion is still the gap to close (1.8% mobile vs 4.4% desktop).</p>
    </div>

    <div class="eyebrow">Section 1 · Profit &amp; Loss</div>
    <h2>Where every dollar landed</h2>
    <table>
      <thead><tr><th>Line</th><th class="right">Amount</th></tr></thead>
      <tbody>
        <tr><td>Gross sales (318 orders)</td><td class="right bold">$48,920</td></tr>
        <tr><td>Shipping collected</td><td class="right">$1,860</td></tr>
        <tr><td>Discounts applied</td><td class="right">-$2,140</td></tr>
        <tr><td>Refunds (8 orders)</td><td class="right">-$1,260</td></tr>
        <tr><td class="bold">Net revenue</td><td class="right bold">$47,380</td></tr>
        <tr><td>Cost of goods sold</td><td class="right">-$15,560</td></tr>
        <tr><td>Total ad spend</td><td class="right">-$8,640</td></tr>
        <tr><td>Tools &amp; fulfillment</td><td class="right">-$2,890</td></tr>
        <tr><td class="bold">Net profit</td><td class="right bold" style="color:var(--accent);">$20,290</td></tr>
      </tbody>
    </table>
    <div class="callout">
      <div class="callout-title">Margin holding strong</div>
      <div class="callout-body">Gross margin <strong>67.2%</strong>. Net margin <strong>42.8%</strong>. For every dollar Stoneline puts into product + ads, it's getting <strong>$1.83 back</strong>. Industry benchmark for menswear DTC sits at $1.25–$1.45.</div>
    </div>

    <div class="eyebrow">Section 2 · Ad Performance</div>
    <h2>What ads are actually returning (real platform data)</h2>
    <div class="kpi-row">
      <div class="kpi"><div class="label">Total Ad Spend</div><div class="value">$8,640</div></div>
      <div class="kpi"><div class="label">Revenue Generated</div><div class="value">$19,290</div></div>
      <div class="kpi"><div class="label">Blended ROAS</div><div class="value">2.23x</div><div class="delta delta-good">↑ 0.31x</div></div>
      <div class="kpi"><div class="label">Cost Per Purchase</div><div class="value">$48</div></div>
    </div>
    <table>
      <thead><tr><th>Platform</th><th class="right">Spend</th><th class="right">Revenue</th><th class="right">Purchases</th><th class="right">ROAS</th><th></th></tr></thead>
      <tbody>
        <tr><td class="bold">Meta · Heritage Field Jacket launch</td><td class="right">$3,420</td><td class="right">$9,180</td><td class="right">42</td><td class="right bold" style="color:var(--accent);">2.68x</td><td><span class="badge badge-green">Winner</span></td></tr>
        <tr><td class="bold">Meta · Selvedge Denim retargeting</td><td class="right">$1,810</td><td class="right">$4,580</td><td class="right">28</td><td class="right bold" style="color:var(--accent);">2.53x</td><td><span class="badge badge-green">Strong</span></td></tr>
        <tr><td class="bold">Meta · Brand prospecting (broad)</td><td class="right">$1,290</td><td class="right">$2,140</td><td class="right">14</td><td class="right" style="color:var(--accent);">1.66x</td><td><span class="badge badge-gold">Watch</span></td></tr>
        <tr><td class="bold">Google · PMax shopping</td><td class="right">$2,120</td><td class="right">$3,390</td><td class="right">22</td><td class="right" style="color:var(--accent);">1.60x</td><td><span class="badge badge-gold">Watch</span></td></tr>
      </tbody>
    </table>

    <div class="eyebrow">Section 3 · Conversion Funnel</div>
    <h2>Sessions to purchase, step by step</h2>
    <table>
      <thead><tr><th>Stage</th><th class="right">Count</th><th class="right">Drop-off</th></tr></thead>
      <tbody>
        <tr><td>Total sessions</td><td class="right bold">22,140</td><td class="right">—</td></tr>
        <tr><td>Product page views</td><td class="right">14,580</td><td class="right">34%</td></tr>
        <tr><td>Add-to-cart</td><td class="right">1,920</td><td class="right">87%</td></tr>
        <tr><td>Checkout initiated</td><td class="right">812</td><td class="right">58%</td></tr>
        <tr><td class="bold">Completed purchase</td><td class="right bold">318</td><td class="right">61%</td></tr>
      </tbody>
    </table>
    <div class="callout callout-warn">
      <div class="callout-title">Where it's leaking — Mobile checkout</div>
      <div class="callout-body">Mobile is <strong>72%</strong> of sessions but only <strong>48%</strong> of revenue. If mobile converted at the desktop rate, that's roughly <strong>$11,400 more</strong> per month. Mobile checkout redesign ships in week 2 of next month.</div>
    </div>

    <div class="eyebrow">Section 4 · Top Products</div>
    <h2>What's carrying the store</h2>
    <div class="row"><span class="name">Heritage Field Jacket</span><span class="val">$14,140 · 49 units</span></div>
    <div class="bar"><div class="bar-fill" style="width:100%;"></div></div>
    <div class="row" style="margin-top:14px;"><span class="name">Selvedge 5-pocket Denim</span><span class="val">$11,820 · 78 units</span></div>
    <div class="bar"><div class="bar-fill" style="width:84%;"></div></div>
    <div class="row" style="margin-top:14px;"><span class="name">Heritage Tee · 3-pack</span><span class="val">$7,910 · 102 units</span></div>
    <div class="bar"><div class="bar-fill" style="width:56%;"></div></div>
    <div class="row" style="margin-top:14px;"><span class="name">Waxed Canvas Trucker</span><span class="val">$6,680 · 31 units</span></div>
    <div class="bar"><div class="bar-fill" style="width:47%;"></div></div>
    <div class="row" style="margin-top:14px;"><span class="name">Wool Crewneck Sweater</span><span class="val">$4,250 · 26 units</span></div>
    <div class="bar"><div class="bar-fill" style="width:30%;"></div></div>

    <div class="eyebrow">Section 5 · Channel Mix</div>
    <h2>Where buyers came from</h2>
    <table>
      <thead><tr><th>Channel</th><th class="right">Sessions</th><th class="right">Orders</th><th class="right">Revenue</th><th class="right">Conv</th></tr></thead>
      <tbody>
        <tr><td class="bold">Email (welcome + broadcasts)</td><td class="right">3,840</td><td class="right">98</td><td class="right">$15,920</td><td class="right"><span class="badge badge-green">2.55%</span></td></tr>
        <tr><td class="bold">Organic Search</td><td class="right">5,210</td><td class="right">71</td><td class="right">$10,470</td><td class="right">1.36%</td></tr>
        <tr><td class="bold">Direct</td><td class="right">3,480</td><td class="right">62</td><td class="right">$9,180</td><td class="right">1.78%</td></tr>
        <tr><td class="bold">Organic Social</td><td class="right">4,920</td><td class="right">48</td><td class="right">$5,840</td><td class="right">0.98%</td></tr>
        <tr><td class="bold">Referral</td><td class="right">1,620</td><td class="right">21</td><td class="right">$3,210</td><td class="right">1.30%</td></tr>
      </tbody>
    </table>
    <p style="font-size:11.5px;color:var(--ink-subtle);margin-top:8px;">Paid channels excluded — those are reported in Section 2 directly from the ad platforms (GA4 under-attributes paid traffic).</p>

    <div class="eyebrow">Section 6 · Recommendations</div>
    <h2>Where to lean next month</h2>
    <ul>
      <li><strong>Scale the winner.</strong> Heritage Field Jacket campaign is doing 2.68x at $3,420 spend. Take it to $5,000 in 20% increments.</li>
      <li><strong>Ship the mobile checkout fix.</strong> Single largest revenue lever in the funnel right now (~$11k/mo upside).</li>
      <li><strong>Email cadence to 2x/week.</strong> Welcome series is doing 2.55% conversion. Add a Tuesday product drop email + Friday founder note.</li>
      <li><strong>Pause the broad prospecting set.</strong> 1.66x ROAS for 30 days; reallocate budget to retargeting + lookalikes from purchasers.</li>
      <li><strong>Q2 lookbook drops May 6.</strong> Coordinate with the Spring Sale email to avoid creative collision.</li>
    </ul>

    <div class="signoff">
      <p style="margin:0;">Reviewed and signed off by</p>
      <p style="margin:4px 0 0;" class="name">Dusty · Venti Scale</p>
      <p class="footer-meta">Data: Shopify · Meta Ads · Google Ads · GA4 · Klaviyo. Generated April 28, 2026. Next monthly: May 28, 2026.</p>
    </div>
    `,
  ),

  // ───────────────────────────────────────────────────────────
  // Monthly SEO Report — Stoneline Apparel
  // ───────────────────────────────────────────────────────────
  "seo-monthly-2026-04": demoReportShell(
    "Monthly SEO Report",
    `
    <div class="hero">
      <div class="brand-mark">Stoneline Apparel · Heritage Menswear</div>
      <h1>Monthly SEO Report</h1>
      <p class="sub">Search performance, the revenue it drove, and the work behind it.</p>
      <div class="period">Period · April 1-28, 2026 · 28-day window &nbsp;·&nbsp; Compared to · March 4-31, 2026</div>
    </div>

    <div class="eyebrow">Executive Summary</div>
    <h2>The 30-second read</h2>
    <div class="summary-box">
      <p>Clicks are up: <strong>1,840</strong> this period vs 1,420 last period (<strong>+30%</strong>). Average position improved from 14.2 to 11.8.</p>
      <p>Organic search drove <strong>$10,470</strong> in revenue from 5,210 sessions. That's <strong>+38%</strong> vs prior period and now the second-largest non-paid channel after email. <strong>"selvedge denim brands"</strong> is the top driver: 218 clicks at position 4.2.</p>
    </div>

    <div class="eyebrow">Search Performance</div>
    <h2>Top-line metrics (vs prior 28 days)</h2>
    <div class="kpi-row">
      <div class="kpi"><div class="label">Clicks</div><div class="value">1,840</div><div class="delta delta-good">↑ 30%</div></div>
      <div class="kpi"><div class="label">Impressions</div><div class="value">82,400</div><div class="delta delta-good">↑ 24%</div></div>
      <div class="kpi"><div class="label">Avg CTR</div><div class="value">2.2%</div><div class="delta delta-good">↑ 0.3pp</div></div>
      <div class="kpi"><div class="label">Avg Position</div><div class="value">11.8</div><div class="delta delta-good">↑ 2.4</div></div>
    </div>

    <div class="eyebrow">Revenue Impact</div>
    <h2>What organic search earned</h2>
    <div class="kpi-row">
      <div class="kpi"><div class="label">Organic Sessions</div><div class="value">5,210</div></div>
      <div class="kpi"><div class="label">Organic Orders</div><div class="value">71</div></div>
      <div class="kpi"><div class="label">Organic Revenue</div><div class="value">$10,470</div></div>
      <div class="kpi"><div class="label">$/Search Click</div><div class="value">$5.69</div></div>
    </div>
    <p class="lead">Every organic search click is currently worth <strong>$5.69</strong> in revenue. That puts a real dollar number on every position we win or lose.</p>

    <div class="callout">
      <div class="callout-title">↑ Climbing this period</div>
      <div class="callout-body">
        <ul style="margin:0;">
          <li><strong>"selvedge denim brands"</strong> — 218 clicks (Δ +89), position 4.2 (Δ +3.1)</li>
          <li><strong>"heritage menswear"</strong> — 142 clicks (Δ +54), position 5.8 (Δ +2.2)</li>
          <li><strong>"made in usa menswear"</strong> — 96 clicks (Δ +38), position 7.4 (Δ +1.6)</li>
          <li><strong>"waxed canvas jacket"</strong> — 71 clicks (Δ +44), position 8.1 (Δ +2.3)</li>
        </ul>
      </div>
    </div>

    <div class="eyebrow">Section · Queries</div>
    <h2>Top search queries (with movement)</h2>
    <table>
      <thead><tr><th>Query</th><th class="right">Clicks (Δ)</th><th class="right">Impressions</th><th class="right">CTR</th><th class="right">Position (Δ)</th></tr></thead>
      <tbody>
        <tr><td class="bold">selvedge denim brands</td><td class="right">218 <span class="delta delta-good">↑ 69%</span></td><td class="right">4,820</td><td class="right"><span class="badge badge-green">4.5%</span></td><td class="right">4.2 <span class="delta delta-good">↑ 3.1</span></td></tr>
        <tr><td class="bold">heritage menswear</td><td class="right">142 <span class="delta delta-good">↑ 61%</span></td><td class="right">3,210</td><td class="right">4.4%</td><td class="right">5.8 <span class="delta delta-good">↑ 2.2</span></td></tr>
        <tr><td class="bold">best field jacket men</td><td class="right">128 <span class="delta delta-good">↑ 32%</span></td><td class="right">5,940</td><td class="right">2.2%</td><td class="right">9.4 <span class="delta delta-good">↑ 1.8</span></td></tr>
        <tr><td class="bold">made in usa menswear</td><td class="right">96 <span class="delta delta-good">↑ 65%</span></td><td class="right">2,810</td><td class="right">3.4%</td><td class="right">7.4 <span class="delta delta-good">↑ 1.6</span></td></tr>
        <tr><td class="bold">waxed canvas jacket</td><td class="right">71 <span class="delta delta-good">↑ 163%</span></td><td class="right">1,920</td><td class="right">3.7%</td><td class="right">8.1 <span class="delta delta-good">↑ 2.3</span></td></tr>
        <tr><td class="bold">how to break in selvedge denim</td><td class="right">58 <span class="delta delta-good">↑ 45%</span></td><td class="right">1,420</td><td class="right">4.1%</td><td class="right">3.1 <span class="delta delta-neutral">flat</span></td></tr>
        <tr><td>raw denim care</td><td class="right">42 <span class="delta delta-good">↑ 24%</span></td><td class="right">1,180</td><td class="right">3.6%</td><td class="right">6.2 <span class="delta delta-good">↑ 0.8</span></td></tr>
        <tr><td>heritage chinos</td><td class="right">38 <span class="delta delta-good">↑ 41%</span></td><td class="right">980</td><td class="right">3.9%</td><td class="right">7.5 <span class="delta delta-good">↑ 1.4</span></td></tr>
      </tbody>
    </table>

    <div class="eyebrow">Section · Pages</div>
    <h2>Top pages (with movement)</h2>
    <table>
      <thead><tr><th>Page</th><th class="right">Clicks (Δ)</th><th class="right">Impressions</th><th class="right">CTR</th></tr></thead>
      <tbody>
        <tr><td class="bold">/products/selvedge-denim</td><td class="right">312 <span class="delta delta-good">↑ 58%</span></td><td class="right">7,420</td><td class="right">4.2%</td></tr>
        <tr><td class="bold">/the-stoneline-story</td><td class="right">178 <span class="delta delta-good">↑ 32%</span></td><td class="right">4,810</td><td class="right">3.7%</td></tr>
        <tr><td class="bold">/products/heritage-field-jacket</td><td class="right">164 <span class="delta delta-good">↑ 124%</span></td><td class="right">3,920</td><td class="right">4.2%</td></tr>
        <tr><td class="bold">/journal/break-in-selvedge</td><td class="right">142 <span class="delta delta-good">↑ 41%</span></td><td class="right">3,180</td><td class="right">4.5%</td></tr>
        <tr><td class="bold">/journal/made-in-usa-supply-chain</td><td class="right">98 <span class="delta delta-good">↑ 22%</span></td><td class="right">2,840</td><td class="right">3.5%</td></tr>
        <tr><td class="bold">/collection/heritage</td><td class="right">86 <span class="delta delta-good">↑ 19%</span></td><td class="right">5,610</td><td class="right"><span class="badge badge-red">1.5%</span></td></tr>
      </tbody>
    </table>

    <div class="callout callout-warn">
      <div class="callout-title">Quick Win This Period</div>
      <div class="callout-body">
        <strong>/collection/heritage</strong> pulled <strong>5,610 impressions</strong> at only <strong>1.5% CTR</strong>. People are seeing it but not clicking. Rewriting the meta title and description could lift this to roughly <strong>140-220 additional clicks</strong> per month for free. Owner of fix: SEO. Ship by May 8.
      </div>
    </div>

    <div class="eyebrow">The Work Behind the Numbers</div>
    <h2>What we shipped + what's next</h2>
    <div class="callout">
      <div class="callout-title">Content shipped this period (6 articles)</div>
      <div class="callout-body">
        <ul style="margin:0;">
          <li><strong>Apr 4</strong> — How to break in selvedge denim (the proper way) <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[break in selvedge denim]</span></li>
          <li><strong>Apr 9</strong> — Made in USA menswear: what the label actually means <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[made in usa menswear]</span></li>
          <li><strong>Apr 13</strong> — Field jacket vs chore coat: which one earns its place <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[best field jacket men]</span></li>
          <li><strong>Apr 17</strong> — Why we run waxed canvas (and how to care for it) <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[waxed canvas jacket]</span></li>
          <li><strong>Apr 22</strong> — Heritage chinos: the cut, the cloth, the case for them <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[heritage chinos]</span></li>
          <li><strong>Apr 26</strong> — A 12-piece spring capsule, fully styled <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[spring capsule menswear]</span></li>
        </ul>
      </div>
    </div>

    <div class="callout">
      <div class="callout-title">Coming next (4 scheduled)</div>
      <div class="callout-body">
        <ul style="margin:0;">
          <li><strong>May 1</strong> — Best heritage menswear brands of 2026 (head-to-head) <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[heritage menswear brands]</span></li>
          <li><strong>May 6</strong> — How to wear a field jacket year-round <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[how to wear field jacket]</span></li>
          <li><strong>May 11</strong> — Wool vs cotton crewneck: when to wear which <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[wool crewneck men]</span></li>
          <li><strong>May 15</strong> — The case for buying fewer, better menswear pieces <span style="color:var(--ink-subtle);font-family:monospace;font-size:11.5px;">[buy less better menswear]</span></li>
        </ul>
      </div>
    </div>

    <p class="footer-meta">Data: Google Search Console · Google Analytics 4 · Stoneline content calendar. Generated April 28, 2026. Next monthly: May 28, 2026.</p>
    `,
  ),

  // ───────────────────────────────────────────────────────────
  // Q2 Strategy Brief — long-form narrative
  // ───────────────────────────────────────────────────────────
  "strategy-q2-2026": demoReportShell(
    "Q2 Strategy Brief",
    `
    <div class="hero">
      <div class="brand-mark">Stoneline Apparel · Strategy Brief</div>
      <h1>Q2 2026 Strategy Brief</h1>
      <p class="sub">A 90-day plan to grow net revenue 35% without buying more traffic.</p>
      <div class="period">Drafted · April 15, 2026 &nbsp;·&nbsp; Quarter window · Apr 1 – Jun 30, 2026</div>
    </div>

    <div class="eyebrow">Where the business stands</div>
    <h2>The starting line for Q2</h2>
    <p class="lead">Q1 closed at <strong>$132,400</strong> in revenue, <strong>+22%</strong> vs Q4 2025. Two channels carried the quarter: email (28% of revenue) and direct (24%). Paid social held a 2.1x blended ROAS, healthy for a heritage menswear brand at this scale. Mobile conversion is the single largest leak in the funnel — 1.8% mobile vs 4.4% desktop, on a traffic mix that's 72% mobile.</p>
    <p>The Heritage Field Jacket launch in late March validated the higher-ticket capsule strategy. AOV moved from $138 (Q1 average) to $154 in April. The product mix is shifting toward fewer, better pieces — exactly the story the brand has been telling.</p>

    <div class="eyebrow">The quarter goal</div>
    <h2>Three numbers to hit by June 30</h2>
    <div class="kpi-row">
      <div class="kpi"><div class="label">Quarter revenue</div><div class="value">$179,000</div></div>
      <div class="kpi"><div class="label">Net margin</div><div class="value">≥ 40%</div></div>
      <div class="kpi"><div class="label">Email list</div><div class="value">14,000 active</div></div>
      <div class="kpi"><div class="label">Mobile conv</div><div class="value">3.0%+</div></div>
    </div>
    <p>Hitting $179k at 40% net margin requires zero new ad budget — every dollar is in the existing channels and creative. The bet is on conversion improvement and email cadence, not paid scaling.</p>

    <div class="eyebrow">The 90-day plan</div>
    <h2>Three workstreams, owned end-to-end by Venti Scale</h2>

    <h3>1. Mobile checkout rebuild (weeks 1-3)</h3>
    <p>The biggest revenue lever in the business. Mobile sessions outnumber desktop 3:1, but mobile conversion is 41% of desktop. If we close half the gap, that's <strong>roughly $14,000/month</strong> in incremental revenue — with the same traffic, same ad spend.</p>
    <ul>
      <li><strong>Week 1:</strong> session recordings + heatmaps. Identify the top 3 friction points.</li>
      <li><strong>Week 2:</strong> redesign + ship the mobile cart drawer + Apple Pay / Shop Pay above the fold.</li>
      <li><strong>Week 3:</strong> A/B test new mobile PDP layout vs control. Cut at 95% confidence.</li>
    </ul>

    <h3>2. Email cadence + automation (weeks 2-8)</h3>
    <p>Welcome series is doing 2.55% conversion — strong. List size is the cap. Two moves to grow it: (a) a smarter exit-intent on mobile, (b) a content-led lead magnet (the "Heritage Care Guide" PDF). Cadence moves from 1 broadcast/week to 2: a Tuesday product story and a Friday founder note. Both run on autopilot from the editorial calendar.</p>
    <ul>
      <li><strong>Week 2:</strong> ship the Heritage Care Guide opt-in. Target: +800 subscribers in 30 days.</li>
      <li><strong>Week 4:</strong> launch abandoned cart sequence (5 emails over 9 days).</li>
      <li><strong>Week 6:</strong> add a post-purchase replenishment flow at day 60.</li>
      <li><strong>Week 8:</strong> review WoW open + click rates; tune subject lines from the bottom of the funnel up.</li>
    </ul>

    <h3>3. SEO content engine + product pages (weeks 1-12)</h3>
    <p>Organic search is now $5.69 per click. Every position we earn compounds. The plan: 2 articles per week (24 over the quarter) targeting commercial-intent and long-tail menswear queries. In parallel, rewrite meta titles + descriptions on the 18 product pages with high impressions / low CTR.</p>
    <ul>
      <li><strong>Weeks 1-4:</strong> ship 8 articles around "selvedge denim", "heritage menswear", "made in USA" cluster.</li>
      <li><strong>Weeks 5-8:</strong> 8 articles on field jackets, chore coats, waxed canvas (top buyer-intent terms).</li>
      <li><strong>Weeks 9-12:</strong> 8 articles around the spring/summer capsule + internal linking pass.</li>
      <li><strong>Continuous:</strong> meta title/description rewrites on the 18 quick-win pages identified in the SEO report.</li>
    </ul>

    <div class="eyebrow">What we're not doing</div>
    <h2>The anti-list</h2>
    <ul>
      <li><strong>No new ad platforms.</strong> Meta + Google PMax are working. Adding TikTok or Pinterest spreads the budget without proving anything new this quarter.</li>
      <li><strong>No new product launches.</strong> The Heritage Field Jacket, Selvedge Denim, and Heritage Tee are already carrying the store. Doubling down beats adding.</li>
      <li><strong>No influencer campaigns.</strong> Cost-per-acquisition through influencers in Q1 was $94 vs $48 on email — not worth chasing again until conversion gaps are closed.</li>
      <li><strong>No retargeting list expansion past 90 days.</strong> Sub-90 retargeting is doing 2.53x ROAS; longer windows dilute the signal.</li>
    </ul>

    <div class="eyebrow">Risks + watchpoints</div>
    <h2>What could break the plan</h2>
    <ul>
      <li><strong>Meta CPM inflation.</strong> Q2 typically runs 10-15% higher CPMs than Q1. We've baked +12% into the ROAS targets. If CPM spikes &gt;20%, we throttle prospecting and lean harder into retargeting.</li>
      <li><strong>iOS 18 attribution further degrading.</strong> Already a known gap. We trust Meta's ROAS reporting + Shopify GMV math, not GA4 paid attribution.</li>
      <li><strong>Mobile rebuild slipping past week 3.</strong> If it slips, we ship a smaller version (cart drawer only) and follow up with the PDP redesign in Q3.</li>
    </ul>

    <div class="signoff">
      <p style="margin:0;">Drafted by</p>
      <p style="margin:4px 0 0;" class="name">Dusty · Venti Scale</p>
      <p class="footer-meta">For: Stoneline Apparel · Marcus, Founder. Strategic review monthly. End-of-quarter retrospective: July 5, 2026.</p>
    </div>
    `,
  ),

};

export async function getReportHtml(id: string): Promise<string | null> {
  return REPORT_HTML[id] || null;
}

// ──────────────────────────────────────────────────────────
// Content drafts
// ──────────────────────────────────────────────────────────
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
      mediaType: null,
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
      mediaType: null,
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
      mediaType: null,
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
      mediaType: null,
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
