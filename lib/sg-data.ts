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
}

export interface ReportSummary {
  id: string;
  title: string;
  date: string;
  type: "client" | "seo" | "baseline" | "internal";
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
  type: "post" | "report" | "campaign" | "draft" | "system";
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
  return raw && raw in PERIOD_META ? (raw as PeriodKey) : "7d";
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
    id: "client-2026-04-07",
    title: "Weekly Performance Report",
    date: "2026-04-07",
    type: "client",
    path: "client-2026-04-07.html",
  },
  {
    id: "client-2026-03-31",
    title: "Weekly Performance Report",
    date: "2026-03-31",
    type: "client",
    path: "client-2026-03-31.html",
  },
  {
    id: "seo-2026-04-01",
    title: "SEO Content Plan",
    date: "2026-04-01",
    type: "seo",
    path: "seo-2026-04-01.html",
  },
  {
    id: "baseline-2026-03-15",
    title: "Baseline Report",
    date: "2026-03-15",
    type: "baseline",
    path: "baseline-2026-03-15.html",
  },
];

export async function getReports(): Promise<ReportSummary[]> {
  return DEMO_REPORTS;
}

function demoReportHtml(title: string, subtitle: string, body: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  :root {
    --ink: #0F1115;
    --ink-muted: #4A5160;
    --ink-subtle: #8A93A4;
    --accent: #1F3D2B;
    --border: #E8EAF0;
    --surface: #FAFAFB;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    color: var(--ink);
    background: white;
    margin: 0;
    padding: 48px 56px;
    line-height: 1.55;
    max-width: 820px;
  }
  .eyebrow {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin-bottom: 12px;
  }
  h1 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .subtitle {
    font-size: 15px;
    color: var(--ink-muted);
    margin-bottom: 40px;
  }
  h2 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.015em;
    margin: 36px 0 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
  p, li { font-size: 14px; color: var(--ink-muted); }
  strong { color: var(--ink); font-weight: 600; }
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 24px 0;
  }
  .kpi {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
  }
  .kpi-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-subtle);
  }
  .kpi-value {
    font-size: 24px;
    font-weight: 700;
    margin-top: 6px;
    font-variant-numeric: tabular-nums;
  }
  .kpi-hint {
    font-size: 12px;
    color: var(--accent);
    margin-top: 4px;
    font-weight: 500;
  }
  ul { padding-left: 20px; margin: 12px 0; }
  li { margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td {
    text-align: left;
    font-size: 13px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
  }
  th {
    font-weight: 600;
    color: var(--ink-subtle);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.06em;
  }
  td { color: var(--ink); font-variant-numeric: tabular-nums; }
</style>
</head>
<body>
  <div class="eyebrow">Stoneline Apparel · Demo report</div>
  <h1>${title}</h1>
  <div class="subtitle">${subtitle}</div>
  ${body}
</body>
</html>`;
}

const REPORT_HTML: Record<string, string> = {
  "client-2026-04-07": demoReportHtml(
    "Weekly Performance Report",
    "Mar 31 – Apr 7, 2026 · Stoneline Apparel",
    `
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Revenue</div><div class="kpi-value">$12,480</div><div class="kpi-hint">+18% WoW</div></div>
      <div class="kpi"><div class="kpi-label">Orders</div><div class="kpi-value">81</div><div class="kpi-hint">$154 AOV</div></div>
      <div class="kpi"><div class="kpi-label">New customers</div><div class="kpi-value">62</div><div class="kpi-hint">19 repeat</div></div>
      <div class="kpi"><div class="kpi-label">Conversion</div><div class="kpi-value">3.9%</div><div class="kpi-hint">+0.3pt</div></div>
    </div>

    <h2>What moved</h2>
    <ul>
      <li><strong>Heritage tee bundle</strong> drove 41% of the week's revenue. Bundle economics continue to carry the store.</li>
      <li><strong>Email welcome series</strong> generated $3,120 from new subscribers — highest weekly email revenue since launch.</li>
      <li><strong>Organic search</strong> sessions up 9% WoW. Two articles from the SEO plan started ranking on page 1.</li>
    </ul>

    <h2>Where we're leaking</h2>
    <ul>
      <li>Mobile checkout still sits at 3.48% vs 4.46% desktop. Shipping the mobile fix this week.</li>
      <li>Paid social ROAS came in at 1.8x — below the 2.5x floor. Three new creatives queued for Tuesday.</li>
    </ul>

    <h2>This week's focus</h2>
    <ul>
      <li>Ship abandoned-cart automation (drafted, awaiting approval in Email tab)</li>
      <li>Refresh paid social creative — founder-voice test vs product-shot control</li>
      <li>Publish next SEO article: "how to care for selvedge denim"</li>
    </ul>
  `,
  ),
  "client-2026-03-31": demoReportHtml(
    "Weekly Performance Report",
    "Mar 24 – Mar 31, 2026 · Stoneline Apparel",
    `
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Revenue</div><div class="kpi-value">$10,580</div><div class="kpi-hint">+12% WoW</div></div>
      <div class="kpi"><div class="kpi-label">Orders</div><div class="kpi-value">69</div><div class="kpi-hint">$153 AOV</div></div>
      <div class="kpi"><div class="kpi-label">New customers</div><div class="kpi-value">54</div><div class="kpi-hint">15 repeat</div></div>
      <div class="kpi"><div class="kpi-label">Conversion</div><div class="kpi-value">3.6%</div><div class="kpi-hint">+0.1pt</div></div>
    </div>
    <h2>Highlights</h2>
    <ul>
      <li>Welcome series launched mid-week — first 5 days pulled $1,840.</li>
      <li>Field jacket restock sold through in 72 hours.</li>
    </ul>
  `,
  ),
  "seo-2026-04-01": demoReportHtml(
    "SEO Content Plan — Q2 2026",
    "12-week content runway · 18 target keywords",
    `
    <h2>Target keywords (priority tier)</h2>
    <table>
      <thead><tr><th>Keyword</th><th>Volume</th><th>Difficulty</th><th>Current</th></tr></thead>
      <tbody>
        <tr><td>selvedge denim brands</td><td>2,900</td><td>28</td><td>Pos 8</td></tr>
        <tr><td>heritage mens tee</td><td>1,800</td><td>22</td><td>Pos 9</td></tr>
        <tr><td>best field jacket men</td><td>3,600</td><td>34</td><td>Pos 15</td></tr>
        <tr><td>made in usa menswear</td><td>2,100</td><td>31</td><td>Pos 12</td></tr>
      </tbody>
    </table>

    <h2>12-week content calendar</h2>
    <ul>
      <li><strong>Weeks 1–2:</strong> "How to care for selvedge denim" + "Why raw denim fades the way it does"</li>
      <li><strong>Weeks 3–4:</strong> "Field jacket vs chore coat — which to wear when" + buyer guide</li>
      <li><strong>Weeks 5–6:</strong> "Made in USA menswear: the real supply chain" + founder interview</li>
      <li><strong>Weeks 7–8:</strong> Heritage tee comparison article + care guide</li>
      <li><strong>Weeks 9–12:</strong> Long-tail product pages + internal linking pass</li>
    </ul>

    <h2>Technical fixes</h2>
    <ul>
      <li>Core Web Vitals: LCP is 3.1s on product pages — target under 2.5s.</li>
      <li>Missing schema on 18 product pages — ship next week.</li>
      <li>Internal linking: 6 orphan pages identified.</li>
    </ul>
  `,
  ),
  "baseline-2026-03-15": demoReportHtml(
    "Baseline Performance Report",
    "Dec 15, 2025 – Mar 15, 2026 · 90-day benchmark",
    `
    <p>This is the benchmark every future report compares against. Numbers below are the
    starting state on the day we started running your marketing.</p>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Revenue (90d)</div><div class="kpi-value">$108,420</div></div>
      <div class="kpi"><div class="kpi-label">Orders</div><div class="kpi-value">702</div></div>
      <div class="kpi"><div class="kpi-label">Customers</div><div class="kpi-value">584</div></div>
      <div class="kpi"><div class="kpi-label">Conversion</div><div class="kpi-value">3.1%</div></div>
    </div>
    <h2>Starting state assessment</h2>
    <ul>
      <li>Email list: 1,840 subscribers, zero automations running, last broadcast 4 months ago.</li>
      <li>SEO: 6 articles total, avg position 22, no keyword strategy.</li>
      <li>Paid: Meta running, ROAS 1.4x, no creative tests in 6 weeks.</li>
      <li>Organic social: sporadic, no schedule, no plan.</li>
    </ul>
    <p><strong>Opportunity:</strong> every channel has clear headroom. 90-day goal is +35% revenue.</p>
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
