import {
  getClientKpis as demoKpis,
  getReports as demoReports,
  getReportHtml as demoReportHtml,
  getContentDrafts as demoDrafts,
  getCampaigns as demoCampaigns,
  getActivityFeed as demoActivity,
  PERIOD_META,
  type PeriodKey,
  type ClientKpis,
  type ReportSummary,
  type ContentDraft,
  type CampaignsData,
  type ActivityItem,
} from "@/lib/sg-data";
import { getPortalSession } from "@/lib/current-client";
import { getClientMetrics } from "@/lib/metrics";

// Session-aware data layer for the portal. Each getter checks the current
// portal session:
//   - demo mode → pass through to sg-data (Stoneline fixtures)
//   - real mode → return empty/zero data shaped to the existing types, so
//                 every page renders its built-in empty states instead of
//                 leaking demo data to a real client
//   - orphan    → empty too (layout short-circuits before pages render,
//                 but we still guard defensively)

export interface ClientMeta {
  name: string;
  tagline: string;
  ownerName: string;
  accent: string;
  driveFolderId: string;
  isDemo: boolean;
  logoUrl: string | null;
}

const EMPTY_KPIS: ClientKpis = {
  revenue: 0,
  orders: 0,
  aov: 0,
  customers: 0,
  repeatRate: 0,
  periodLabel: "Last 7 days",
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

const EMPTY_CAMPAIGNS: CampaignsData = {
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

export async function getClientMeta(): Promise<ClientMeta> {
  const session = await getPortalSession();

  if (!session || session.mode === "orphan") {
    return {
      name: "Workspace",
      tagline: "",
      ownerName: "you",
      accent: "#0F1115",
      driveFolderId: "",
      isDemo: false,
      logoUrl: null,
    };
  }

  if (session.mode === "demo") {
    return {
      name: "Stoneline Apparel",
      tagline: "Premium menswear · Built to last",
      ownerName: "Marcus",
      accent: "#1F3D2B",
      driveFolderId: "",
      isDemo: true,
      logoUrl: null,
    };
  }

  const firstName = (session.userEmail || "").split("@")[0] || "there";
  return {
    name: session.client.name,
    tagline: session.client.tagline || "Your Venti Scale workspace",
    ownerName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    accent: session.client.brandColor || "#0F1115",
    driveFolderId: "",
    isDemo: false,
    logoUrl: session.client.logoUrl,
  };
}

export async function getClientKpis(period: PeriodKey = "7d"): Promise<ClientKpis> {
  const session = await getPortalSession();
  if (session?.mode === "demo") return demoKpis(period);
  if (session?.mode === "real") {
    const metrics = await getClientMetrics(session.client.id, period);
    if (metrics) return metrics;
  }
  return { ...EMPTY_KPIS, periodLabel: PERIOD_META[period].label };
}

export async function getReports(): Promise<ReportSummary[]> {
  const session = await getPortalSession();
  if (session?.mode === "demo") return demoReports();
  return [];
}

export async function getReportHtml(id: string): Promise<string | null> {
  const session = await getPortalSession();
  if (session?.mode === "demo") return demoReportHtml(id);
  return null;
}

export async function getContentDrafts(): Promise<ContentDraft[]> {
  const session = await getPortalSession();
  if (session?.mode === "demo") return demoDrafts();
  return [];
}

export async function getCampaigns(): Promise<CampaignsData> {
  const session = await getPortalSession();
  if (session?.mode === "demo") return demoCampaigns();
  return EMPTY_CAMPAIGNS;
}

export async function getActivityFeed(limit = 8): Promise<ActivityItem[]> {
  const session = await getPortalSession();
  if (session?.mode === "demo") return demoActivity(limit);
  return [];
}

export type { ClientKpis, ReportSummary, ContentDraft, CampaignsData, ActivityItem, PeriodKey };
export type { Campaign } from "@/lib/sg-data";
