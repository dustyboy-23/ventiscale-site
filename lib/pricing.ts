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
  /** One short line shown on the rate sheet under the name. */
  short: string;
  /** One or two plain sentences for the detail ledger. */
  blurb: string;
  monthly: number;
  setup: number;
  /** True when `monthly` and `setup` are per channel (ads). */
  perChannel?: boolean;
  /** What the monthly covers. */
  includes: string[];
  /** What the one-time setup fee covers. */
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
  /** Optional link to real work of this kind. */
  sample?: { label: string; href: string };
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
    short: "4 articles a month, plus fixes to your pages",
    blurb:
      "Articles your customers are searching for, published on your site every week, plus the behind-the-scenes fixes that help Google and AI search show them.",
    monthly: 450,
    setup: 300,
    includes: [
      "4 blog articles a month, written for the searches your customers make",
      "Keyword plan built around what you sell and where you sell it",
      "Fixes to the pages you already have, so Google understands them",
      "Pages set up so ChatGPT and Google's AI answers can quote you",
      "Google Business Profile tuned once at setup, so you show up in Maps",
      "Monthly report: what search brought in, what moved, what's next",
    ],
    setupCovers:
      "A full check of your site, research into what your customers search for, Google's free tracking tools connected, your Google Business Profile checked and tuned, and the first three months of topics planned.",
    notIncluded: "Building or redesigning your website.",
    needs: "A login to your website so articles can be published.",
    weeks: every(1, "1 article"),
    sample: { label: "Read real articles on the blog", href: "/blog" },
  },
  {
    id: "social",
    name: "Social media",
    short: "12 posts a month, plus your videos posted",
    blurb:
      "Your pages stay active without you thinking about it. Posts written, designed and scheduled. Send videos and they go out too.",
    monthly: 350,
    setup: 200,
    includes: [
      "12 posts a month (3 a week), written and designed in your brand",
      "Up to 3 platforms: Facebook, Instagram, LinkedIn",
      "Up to 8 of your own videos a month posted to Reels, TikTok and Shorts",
      "Captions, hashtags and scheduling handled",
      "Monthly report: what went out and how it did",
    ],
    setupCovers:
      "Brand voice and look captured, accounts connected, post templates designed, first month planned.",
    notIncluded:
      "Replying to comments and DMs, and Google Business Profile posts. Those stay with you.",
    needs: "Access to your pages, and a few photos of your real work.",
    weeks: every(3, "3 posts"),
  },
  {
    id: "email",
    name: "Email marketing",
    short: "Automatic emails, plus 2 campaigns a month",
    blurb:
      "The emails that should already be going out, built and running: a welcome series, follow-ups, win-backs. Plus two fresh campaigns every month.",
    monthly: 350,
    setup: 400,
    includes: [
      "4 automatic email series built at setup: a welcome, a follow-up after an enquiry or unfinished checkout, a review request, and a come-back email for quiet customers",
      "2 campaigns a month: written, designed, sent",
      "List cleanup so your emails keep landing in inboxes",
      "Works with the email tool you already have (Mailchimp, Klaviyo and the rest)",
      "Monthly report: sales or bookings first, then opens and clicks",
    ],
    setupCovers:
      "The four automatic email series written, designed and switched on, your signup form connected, and a check that your emails reach inboxes.",
    notIncluded:
      "Your email tool's own subscription. You pay that to them directly.",
    needs: "Access to your email tool. No tool or list yet? I set one up with you.",
    weeks: [
      { units: 0, label: "Automatic emails" },
      { units: 1, label: "1 campaign" },
      { units: 0, label: "Automatic emails" },
      { units: 1, label: "1 campaign" },
    ],
  },
  {
    id: "ads",
    name: "Ads management",
    short: "Meta or Google ads, priced per channel",
    blurb:
      "Paid ads run by someone who checks them every week. One flat fee per channel, and your ad budget goes straight to Meta or Google.",
    monthly: 500,
    setup: 400,
    perChannel: true,
    includes: [
      "Priced per channel: Meta (Facebook + Instagram) or Google (Search, Maps + YouTube)",
      "Each channel covers up to $3,000 a month in ad spend",
      "Ad copy and creative made for you, refreshed monthly",
      "Checked every week: what to spend more on, what to switch off",
      "Monthly report in plain numbers: what you spent, the calls, enquiries or sales it brought, and the cost of each",
    ],
    setupCovers:
      "For each channel: the ad account set up properly, the first campaigns built, and tracking tested so you can see which ads bring calls, enquiries or sales.",
    notIncluded:
      "The ad spend itself. That is billed by the platform to your card, never through me.",
    needs: "Admin access to your ad account, or I create one in your name.",
    weeks: [
      { units: 1, label: "Fresh ads" },
      { units: 1, label: "Tune-up" },
      { units: 1, label: "Tune-up" },
      { units: 1, label: "Tune-up" },
    ],
  },
  {
    id: "video",
    name: "Video editing",
    short: "12 short videos a month, edited and posted",
    blurb:
      "Send raw clips from your phone. Get back finished short videos with captions and pacing that holds attention, posted to every platform.",
    monthly: 750,
    setup: 200,
    includes: [
      "12 short-form videos a month, edited from your raw footage",
      "Captions, cuts, music and a hook in the first seconds",
      "Posted to TikTok, Reels, Shorts and Facebook for you",
      "One round of changes on every video",
      "A shot list each month so you know what to film",
    ],
    setupCovers:
      "Your editing style set (captions, fonts, pacing), a shared upload folder, accounts connected.",
    notIncluded: "Filming. You shoot it on your phone, I take it from there.",
    needs: "Raw clips dropped in a shared folder. Phone footage is fine.",
    weeks: every(3, "3 videos"),
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
