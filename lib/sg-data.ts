import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const SG_ROOT = path.join(os.homedir(), "sprinkler-guard");
const REPORTS_DIR = path.join(SG_ROOT, "ops", "reports");
const DRAFTS_DIR = path.join(SG_ROOT, "content", "drafts", "sg");

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

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function parseMoney(s: string): number {
  return Number(s.replace(/[^0-9.-]/g, "")) || 0;
}

function parseInt0(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

function parsePct(s: string): number {
  return Number(s.replace(/[^0-9.-]/g, "")) || 0;
}

async function safeRead(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, "utf-8");
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────────────────
// Public — KPIs
// ──────────────────────────────────────────────────────────
export async function getClientKpis(): Promise<ClientKpis> {
  // Find the most recent baseline report
  let baseline = "";
  try {
    const entries = await fs.readdir(REPORTS_DIR);
    const baselines = entries
      .filter((f) => f.startsWith("baseline-") && f.endsWith(".md"))
      .sort()
      .reverse();
    if (baselines[0]) {
      baseline = (await safeRead(path.join(REPORTS_DIR, baselines[0]))) || "";
    }
  } catch {
    // empty
  }

  // Defaults if no data found
  const kpis: ClientKpis = {
    revenue: 0,
    orders: 0,
    aov: 0,
    customers: 0,
    repeatRate: 0,
    periodLabel: "Last 28 Days",
    traffic: { activeUsers: 0, sessions: 0, pageViews: 0, conversionRate: 0 },
    productBreakdown: [],
    topStates: [],
    channels: [],
    devices: [],
    topPages: [],
    seo: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries: [],
    insights: { working: [], leaking: [], actions: [] },
  };

  if (!baseline) return kpis;

  // Parse period label
  const periodMatch = baseline.match(/Last \d+ Days: ([^)]+)\)/);
  if (periodMatch) kpis.periodLabel = periodMatch[1].trim();

  // Parse top-level metrics
  const grab = (label: string): string | null => {
    const re = new RegExp(`\\*\\*${label}\\*\\*\\s*\\|\\s*([^|\\n]+)`);
    const m = baseline.match(re);
    return m ? m[1].trim() : null;
  };

  kpis.revenue = parseMoney(grab("Total Revenue") || "0");
  kpis.orders = parseInt0(grab("Total Orders") || "0");
  kpis.aov = parseMoney(grab("Avg Order Value") || "0");
  kpis.customers = parseInt0(grab("Unique Customers") || "0");
  const repeat = grab("Repeat Orders");
  if (repeat) {
    const m = repeat.match(/\(([0-9.]+)%\)/);
    if (m) kpis.repeatRate = parseFloat(m[1]);
  }

  kpis.traffic.activeUsers = parseInt0(grab("Active Users") || "0");
  kpis.traffic.sessions = parseInt0(grab("Sessions") || "0");
  kpis.traffic.pageViews = parseInt0(grab("Page Views") || "0");
  kpis.traffic.conversionRate = parsePct(grab("Conversion Rate") || "0");

  kpis.seo.clicks = parseInt0(grab("Total Clicks") || "0");
  kpis.seo.impressions = parseInt0(grab("Total Impressions") || "0");
  kpis.seo.ctr = parsePct(grab("Average CTR") || "0");
  kpis.seo.position = parseFloat((grab("Average Position") || "0").replace(/[^0-9.]/g, "")) || 0;

  // Parse product breakdown table
  const productSection = baseline.match(/### Product Breakdown[\s\S]*?(?=\n###|\n---)/);
  if (productSection) {
    const rows = productSection[0].matchAll(/^\| ([^|]+) \| (\d+) \| (\d+) \| \$([0-9,.]+) \|/gm);
    for (const r of rows) {
      kpis.productBreakdown.push({
        name: r[1].trim(),
        orders: parseInt(r[2], 10),
        units: parseInt(r[3], 10),
        revenue: parseMoney(r[4]),
      });
    }
  }

  // Top states
  const statesMatch = baseline.match(/### Top States\s*\n([^\n]+)/);
  if (statesMatch) {
    kpis.topStates = statesMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
  }

  // Channels
  const channelSection = baseline.match(/### Traffic Sources[\s\S]*?(?=\n###|\n---)/);
  if (channelSection) {
    const rows = channelSection[0].matchAll(
      /^\| ([^|]+) \| ([\d,]+) \| ([\d,]+) \| \$([0-9,.]+) \| ([0-9.]+)% \|/gm,
    );
    for (const r of rows) {
      kpis.channels.push({
        name: r[1].trim(),
        sessions: parseInt0(r[2]),
        purchases: parseInt0(r[3]),
        revenue: parseMoney(r[4]),
        convRate: parseFloat(r[5]),
      });
    }
  }

  // Devices
  const deviceSection = baseline.match(/### Device Breakdown[\s\S]*?(?=\n###|\n---)/);
  if (deviceSection) {
    const rows = deviceSection[0].matchAll(
      /^\| ([^|]+) \| ([\d,]+) \| ([\d,]+) \| \$([0-9,.]+) \| ([0-9.]+)% \|/gm,
    );
    for (const r of rows) {
      kpis.devices.push({
        name: r[1].trim(),
        sessions: parseInt0(r[2]),
        purchases: parseInt0(r[3]),
        revenue: parseMoney(r[4]),
        convRate: parseFloat(r[5]),
      });
    }
  }

  // Top landing pages
  const pagesSection = baseline.match(/### Top Landing Pages[\s\S]*?(?=\n###|\n---)/);
  if (pagesSection) {
    const rows = pagesSection[0].matchAll(/^\| ([^|]+) \| ([\d,]+) \| ([\d,]+) \|/gm);
    for (const r of rows) {
      kpis.topPages.push({
        page: r[1].trim(),
        sessions: parseInt0(r[2]),
        purchases: parseInt0(r[3]),
      });
    }
  }

  // Top queries
  const queriesSection = baseline.match(/### Top Search Queries[\s\S]*?(?=\n###|\n---)/);
  if (queriesSection) {
    const rows = queriesSection[0].matchAll(
      /^\| ([^|]+) \| ([\d,]+) \| ([\d,]+) \| ([0-9.]+)% \| ([0-9.]+) \|/gm,
    );
    for (const r of rows) {
      kpis.topQueries.push({
        query: r[1].trim(),
        clicks: parseInt0(r[2]),
        impressions: parseInt0(r[3]),
        ctr: parseFloat(r[4]),
        position: parseFloat(r[5]),
      });
    }
  }

  // Insights — pull bullet lists
  const workingSection = baseline.match(/### What's Working\s*\n([\s\S]*?)(?=\n###|\n---)/);
  const leakingSection = baseline.match(/### Where Money Is Leaking\s*\n([\s\S]*?)(?=\n###|\n---)/);
  const actionsSection = baseline.match(/### Priority Actions\s*\n([\s\S]*?)(?=\n###|\n---|$)/);

  const extractBullets = (s: string | null): string[] => {
    if (!s) return [];
    return s
      .split(/\n/)
      .map((line) => line.replace(/^\d+\.\s*\*?\*?/, "").replace(/\*\*/g, "").trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
  };

  kpis.insights.working = extractBullets(workingSection ? workingSection[1] : null);
  kpis.insights.leaking = extractBullets(leakingSection ? leakingSection[1] : null);
  kpis.insights.actions = extractBullets(actionsSection ? actionsSection[1] : null);

  return kpis;
}

// ──────────────────────────────────────────────────────────
// Public — Reports
// ──────────────────────────────────────────────────────────
export async function getReports(): Promise<ReportSummary[]> {
  try {
    const entries = await fs.readdir(REPORTS_DIR);
    const reports: ReportSummary[] = [];
    for (const f of entries) {
      const full = path.join(REPORTS_DIR, f);
      const stat = await fs.stat(full);
      if (!stat.isFile()) continue;

      const dateMatch = f.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : "";
      let type: ReportSummary["type"] = "internal";
      let title = f;

      if (f.includes("client")) {
        type = "client";
        title = "Weekly Performance Report";
      } else if (f.includes("seo")) {
        type = "seo";
        title = "SEO Content Plan";
      } else if (f.includes("baseline")) {
        type = "baseline";
        title = "Baseline Report";
      } else if (f.endsWith(".md")) {
        title = "Internal Notes";
      }

      reports.push({
        id: f.replace(/\.(html|md)$/, ""),
        title,
        date,
        type,
        path: full,
      });
    }
    return reports.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export async function getReportHtml(id: string): Promise<string | null> {
  try {
    const entries = await fs.readdir(REPORTS_DIR);
    const match = entries.find((f) => f.startsWith(id) && f.endsWith(".html"));
    if (!match) return null;
    return await safeRead(path.join(REPORTS_DIR, match));
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────────────────
// Public — Content drafts
// ──────────────────────────────────────────────────────────
export async function getContentDrafts(): Promise<ContentDraft[]> {
  try {
    const entries = await fs.readdir(DRAFTS_DIR);
    const drafts: ContentDraft[] = [];
    for (const f of entries) {
      if (!f.endsWith(".json")) continue;
      const raw = await safeRead(path.join(DRAFTS_DIR, f));
      if (!raw) continue;
      try {
        const data = JSON.parse(raw);
        const platform = f.startsWith("sg-") ? "facebook" : f.startsWith("li-") ? "linkedin" : "other";
        drafts.push({
          id: f.replace(/\.json$/, ""),
          date: data.date || "",
          slot: data.slot || "",
          platform,
          topic: data.topic || "",
          caption: data.caption || "",
          imagePrompt: data.image_prompt || "",
          comments: Array.isArray(data.comments) ? data.comments : [],
          cta: data.cta || "",
          isProductPost: !!data.is_product_post,
        });
      } catch {
        // skip malformed
      }
    }
    return drafts.sort((a, b) => b.date.localeCompare(a.date) || a.slot.localeCompare(b.slot));
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────────────────
// Public — Email campaigns
// ──────────────────────────────────────────────────────────
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

export async function getCampaigns(): Promise<CampaignsData> {
  try {
    const raw = await safeRead(
      path.join(process.cwd(), "data", "campaigns.json"),
    );
    if (!raw) throw new Error("no campaigns file");
    const parsed = JSON.parse(raw);
    return {
      proposed: parsed.proposed || [],
      live: parsed.live || [],
      history: parsed.history || [],
      stats: parsed.stats || {
        totalSubscribers: 0,
        monthlyGrowth: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        lastSendDate: null,
      },
    };
  } catch {
    return {
      proposed: [],
      live: [],
      history: [],
      stats: {
        totalSubscribers: 0,
        monthlyGrowth: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        lastSendDate: null,
      },
    };
  }
}

// ──────────────────────────────────────────────────────────
// Public — Activity feed
// ──────────────────────────────────────────────────────────
export interface ActivityItem {
  id: string;
  type: "post" | "report" | "campaign" | "draft" | "system";
  title: string;
  description?: string;
  timestamp: string;
}

export async function getActivityFeed(limit = 8): Promise<ActivityItem[]> {
  const items: ActivityItem[] = [];

  // Pull recent reports
  const reports = await getReports();
  for (const r of reports.slice(0, 3)) {
    items.push({
      id: `report-${r.id}`,
      type: "report",
      title: `${r.title} generated`,
      description: r.type === "client" ? "Weekly performance snapshot ready" : undefined,
      timestamp: r.date ? `${r.date}T08:00:00` : new Date().toISOString(),
    });
  }

  // Pull recent drafts
  const drafts = await getContentDrafts();
  for (const d of drafts.slice(0, 4)) {
    items.push({
      id: `draft-${d.id}`,
      type: "draft",
      title: `Drafted: ${d.topic}`,
      description: `${d.platform} · ${d.slot}`,
      timestamp: d.date ? `${d.date}T07:30:00` : new Date().toISOString(),
    });
  }

  // System events
  items.push({
    id: "system-baseline",
    type: "system",
    title: "Baseline performance benchmark captured",
    description: "Used as the comparison point for future reports",
    timestamp: "2026-04-09T06:00:00",
  });

  return items
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
}

// ──────────────────────────────────────────────────────────
// Public — Client meta
// ──────────────────────────────────────────────────────────
export const CLIENT = {
  slug: "sprinkler-guard",
  name: "Sprinkler Guard",
  tagline: "Veteran-owned. Made in USA.",
  primaryDomain: "sprinkler-guard.com",
  ecomDomain: "grassholesystem.com",
  driveFolderId: "1CUiot0p7xmKjeUnRzJ0509-cHrao3jVg",
  ownerName: "Ken",
  accent: "#1a5e1f",
};
