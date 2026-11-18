// ─────────────────────────────────────────────────────────────────────────
// PRICING — the single source of truth for every price on the public site.
//
// Change a number here and it changes on the homepage rate sheet, the
// pricing page, the bundles, the start form, the Telegram lead ping and
// the structured data. Nothing else needs editing.
//
// Rules the site applies:
//   - Each service has a flat monthly price and a one-time setup fee.
//   - Ads management is priced PER CHANNEL (Dusty, 2026-11-18): the monthly
//     price and the setup fee both multiply by the channels picked.
//   - 2 services  = BUNDLE_DISCOUNT[2] off the monthly total.
//   - 3+ services = BUNDLE_DISCOUNT[3] off the monthly total.
//     (Ad channels do not count as extra services for the discount.)
//   - Setup fees add up, but with 3+ services the total is capped at SETUP_CAP.
//   - Discounted monthly totals round to the nearest $5.
// ─────────────────────────────────────────────────────────────────────────

export type ServiceId = "seo" | "social" | "email" | "ads" | "video";

export type AdChannelId = "meta" | "google";

export const AD_CHANNELS: { id: AdChannelId; name: string; detail: string }[] = [
  { id: "meta", name: "Meta", detail: "Facebook + Instagram" },
  { id: "google", name: "Google", detail: "Search, Maps + YouTube" },
];

export const DEFAULT_CHANNELS: AdChannelId[] = ["meta"];

/** Each ad channel's fee covers ad spend up to this much a month on that channel. */
export const AD_SPEND_CAP = 3000;

/** Total one-time setup never exceeds this once three or more services are picked. */
export const SETUP_CAP = 750;

export interface Service {
  id: ServiceId;
  name: string;
  /** What the owner gets out of it, in their words. Headline of the service row. */
  outcome: string;
  /** The one fact that says what ships, e.g. "4 articles a month". */
  count: string;
  /** One short line shown on the rate sheet under the name. */
  short: string;
  monthly: number;
  setup: number;
  /** True when `monthly` and `setup` are per channel (ads). */
  perChannel?: boolean;
  /** What the monthly covers. Four short lines, no more. */
  includes: string[];
  /** What the one-time setup fee covers. One short sentence. */
  setupCovers: string;
  /** The thing people assume is included but is not. Said plainly. */
  notIncluded: string;
  /** What we need from the client for this to work. */
  needs: string;
  /**
   * What ships in each of the four weeks of a normal month. `units` draws
   * that many marks on the month view (0 = running in the background).
   * KEEP IN STEP with `includes`: if 12 posts becomes 8, change this too.
   */
  weeks: [WeekSlot, WeekSlot, WeekSlot, WeekSlot];
  /** The month's total in words, shown beside the marks. */
  monthTotal: string;
}

export interface WeekSlot {
  units: number;
  label: string;
}

const every = (units: number, label: string): [WeekSlot, WeekSlot, WeekSlot, WeekSlot] => [
  { units, label },
  { units, label },
  { units, label },
  { units, label },
];

export const CURRENCY = "USD";

export const SERVICES: Service[] = [
  {
    id: "seo",
    name: "SEO + blog",
    outcome: "Show up when people search for what you sell",
    count: "4 articles a month",
    short: "4 articles a month, plus fixes to your pages",
    monthly: 450,
    setup: 300,
    includes: [
      "4 articles a month on what your customers search for",
      "Your current pages fixed so Google understands them",
      "Set up so AI search can find and quote you",
      "Google Business Profile tuned once at setup",
    ],
    setupCovers: "A full site check, keyword research, your Google profile tuned and 3 months of topics planned.",
    notIncluded: "Building or redesigning your website.",
    needs: "A login to your website.",
    weeks: every(1, "1 article"),
    monthTotal: "4 articles",
  },
  {
    id: "social",
    name: "Social media",
    outcome: "Keep your pages busy without touching them",
    count: "12 posts a month",
    short: "12 posts a month, plus your videos posted",
    monthly: 350,
    setup: 200,
    includes: [
      "12 posts a month, written and designed for you",
      "Facebook, Instagram and LinkedIn",
      "Up to 8 of your videos posted to Reels, TikTok and Shorts",
      "Captions, hashtags and scheduling handled",
    ],
    setupCovers: "Your brand look and voice, accounts connected and the first month planned.",
    notIncluded: "Replying to comments and DMs, and Google Business Profile posts.",
    needs: "Access to your pages and a few photos of your work.",
    weeks: every(3, "3 posts"),
    monthTotal: "12 posts",
  },
  {
    id: "email",
    name: "Email marketing",
    outcome: "Get past customers to come back",
    count: "2 campaigns a month",
    short: "Automatic emails, plus 2 campaigns a month",
    monthly: 350,
    setup: 400,
    includes: [
      "4 automatic email series: welcome, follow-up, review request, come-back",
      "2 campaigns a month, written, designed and sent",
      "Your list kept clean so emails land in inboxes",
      "Works with the email tool you already have",
    ],
    setupCovers: "All 4 email series written and switched on, and your signup form connected.",
    notIncluded: "Your email tool's own subscription.",
    needs: "Access to your email tool. No tool yet? I set one up with you.",
    weeks: [
      { units: 0, label: "Automatic emails running" },
      { units: 1, label: "1 campaign" },
      { units: 0, label: "Automatic emails running" },
      { units: 1, label: "1 campaign" },
    ],
    monthTotal: "2 campaigns",
  },
  {
    id: "ads",
    name: "Ads management",
    outcome: "Reach people who are ready to buy",
    count: "Checked every week",
    short: "Meta or Google ads, priced per channel",
    monthly: 500,
    setup: 400,
    perChannel: true,
    includes: [
      "Meta or Google, priced per channel",
      `Covers up to ${money(AD_SPEND_CAP)} a month in ad spend per channel`,
      "Ads written and designed for you, refreshed monthly",
      "Checked every week: what to push, what to switch off",
    ],
    setupCovers: "Your ad account set up, first campaigns built and tracking tested.",
    notIncluded: "The ad spend. Meta or Google bills your card directly.",
    needs: "Admin access to your ad account, or I create one for you.",
    weeks: [
      { units: 1, label: "Fresh ads" },
      { units: 1, label: "Tune-up" },
      { units: 1, label: "Tune-up" },
      { units: 1, label: "Tune-up" },
    ],
    monthTotal: "4 check-ins",
  },
  {
    id: "video",
    name: "Video editing",
    outcome: "Turn phone clips into videos people watch",
    count: "12 short videos a month",
    short: "12 short videos a month, edited and posted",
    monthly: 750,
    setup: 200,
    includes: [
      "12 short videos a month from your raw clips",
      "Captions, cuts, music and a strong opening",
      "Posted to TikTok, Reels, Shorts and Facebook",
      "One round of changes on every video",
    ],
    setupCovers: "Your editing style set, a shared upload folder and accounts connected.",
    notIncluded: "Filming. You shoot it on your phone.",
    needs: "Raw clips in a shared folder. Phone footage is fine.",
    weeks: every(3, "3 videos"),
    monthTotal: "12 videos",
  },
];

/** Fraction off the monthly total, keyed by number of services picked. */
export const BUNDLE_DISCOUNT: Record<number, number> = { 2: 0.1, 3: 0.15 };

export function discountFor(count: number): number {
  if (count >= 3) return BUNDLE_DISCOUNT[3];
  if (count === 2) return BUNDLE_DISCOUNT[2];
  return 0;
}

export interface Quote {
  ids: ServiceId[];
  services: Service[];
  /** Ad channels in the plan. Empty when ads is not picked. */
  channels: AdChannelId[];
  /** Sum of list prices before any bundle discount. */
  listMonthly: number;
  /** Fraction, e.g. 0.15 */
  discount: number;
  /** What the client pays each month. */
  monthly: number;
  /** listMonthly - monthly */
  saved: number;
  /** One-time setup before the cap. */
  setupList: number;
  /** One-time setup the client pays. */
  setup: number;
}

function roundTo5(n: number): number {
  return Math.round(n / 5) * 5;
}

function cleanChannels(channels: readonly AdChannelId[] | undefined): AdChannelId[] {
  const picked = AD_CHANNELS.map((c) => c.id).filter((id) => (channels ?? []).includes(id));
  return picked.length ? picked : [...DEFAULT_CHANNELS];
}

/** How many times a service's price applies: channels for ads, otherwise 1. */
export function unitsFor(s: Service, channels: readonly AdChannelId[]): number {
  return s.perChannel ? Math.max(1, channels.length) : 1;
}

export function quote(ids: readonly ServiceId[], channels?: readonly AdChannelId[]): Quote {
  const picked = SERVICES.filter((s) => ids.includes(s.id));
  const ch = picked.some((s) => s.perChannel) ? cleanChannels(channels) : [];
  const listMonthly = picked.reduce((t, s) => t + s.monthly * unitsFor(s, ch), 0);
  const discount = discountFor(picked.length);
  const monthly = discount ? roundTo5(listMonthly * (1 - discount)) : listMonthly;
  const setupList = picked.reduce((t, s) => t + s.setup * unitsFor(s, ch), 0);
  return {
    ids: picked.map((s) => s.id),
    services: picked,
    channels: ch,
    listMonthly,
    discount,
    monthly,
    saved: listMonthly - monthly,
    setupList,
    setup: picked.length >= 3 ? Math.min(setupList, SETUP_CAP) : setupList,
  };
}

/** "SEO + blog, Ads management (Meta + Google)" for emails, alerts and summaries. */
export function planLabel(q: Quote): string {
  return q.services
    .map((s) =>
      s.perChannel
        ? `${s.name} (${q.channels.map((c) => AD_CHANNELS.find((a) => a.id === c)!.name).join(" + ")})`
        : s.name,
    )
    .join(", ");
}

export interface Bundle {
  id: string;
  name: string;
  /** Who it is for, one line. */
  forWho: string;
  ids: ServiceId[];
  /** Marks the one most small businesses should start with. */
  recommended?: boolean;
}

export const BUNDLES: Bundle[] = [
  {
    id: "found",
    name: "Get found",
    forWho: "You have a good business that not enough people can find.",
    ids: ["seo", "social"],
  },
  {
    id: "front",
    name: "Stay in front",
    forWho: "You want new customers finding you and old ones coming back.",
    ids: ["seo", "social", "email"],
    recommended: true,
  },
  {
    id: "everything",
    name: "Everything",
    forWho: "You want the whole marketing department off your plate.",
    ids: ["seo", "social", "email", "ads", "video"],
  },
];

export const DEFAULT_PLAN: ServiceId[] = ["seo", "social"];

export function money(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export interface Plan {
  ids: ServiceId[];
  channels: AdChannelId[];
}

/**
 * Reads "seo,social,ads-meta,ads-google". A bare "ads" means the default
 * channel. Unknown tokens are ignored.
 */
export function parsePlan(raw: string | null | undefined): Plan {
  const ids: ServiceId[] = [];
  const channels: AdChannelId[] = [];
  if (!raw) return { ids, channels };
  const valid = new Set(SERVICES.map((s) => s.id));
  const validCh = new Set(AD_CHANNELS.map((c) => c.id));
  for (const part of raw.split(",")) {
    const token = part.trim().toLowerCase();
    if (token.startsWith("ads-")) {
      const ch = token.slice(4) as AdChannelId;
      if (validCh.has(ch)) {
        if (!ids.includes("ads")) ids.push("ads");
        if (!channels.includes(ch)) channels.push(ch);
      }
      continue;
    }
    if (valid.has(token as ServiceId) && !ids.includes(token as ServiceId)) ids.push(token as ServiceId);
  }
  return { ids, channels: ids.includes("ads") ? cleanChannels(channels) : [] };
}

export function planQuery(ids: readonly ServiceId[], channels?: readonly AdChannelId[]): string {
  if (!ids.length) return "";
  const tokens = ids.flatMap((id) =>
    id === "ads" ? cleanChannels(channels).map((c) => `ads-${c}`) : [id],
  );
  return `?plan=${tokens.join(",")}`;
}
