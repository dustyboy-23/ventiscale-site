import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getPublishedPosts } from "@/lib/portal-data";
import { getPageMetrics } from "@/lib/page-metrics";
import { formatNumber } from "@/lib/utils";
import {
  BarChart3,
  ThumbsUp,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  FileImage,
  Film,
  Calendar,
  Users,
  Eye,
  Play,
} from "lucide-react";
import Link from "next/link";

const ENGAGEMENT_KEYS = ["reactions", "likes", "comments", "shares"] as const;

const PERIODS = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "28d", label: "28 days", days: 28 },
  { key: "90d", label: "90 days", days: 90 },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

function engagementOf(metrics: Record<string, unknown>): number {
  let total = 0;
  for (const k of ENGAGEMENT_KEYS) {
    total += Number(metrics[k]) || 0;
  }
  return total;
}

function ymdPT(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function pctDelta(curr: number, prev: number): number | null {
  if (prev === 0) return curr > 0 ? null : 0; // can't divide by zero, show as new
  return ((curr - prev) / prev) * 100;
}

export default async function MetricsPage({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string }>;
}) {
  const params = (await searchParams) || {};
  const periodKey: PeriodKey =
    PERIODS.find((p) => p.key === params.period)?.key || "28d";
  const periodDays = PERIODS.find((p) => p.key === periodKey)!.days;

  const [all, pageMetrics] = await Promise.all([
    getPublishedPosts(500),
    getPageMetrics(),
  ]);
  const fbAll = all.filter((p) => p.platform === "facebook");

  // Follower deltas computed from daily_follows[] (net new per day).
  // Sum the days that fall in current vs previous window for WoW math.
  const followsInWindow = (from: number, to: number) => {
    return pageMetrics.dailyFollows.reduce((s, d) => {
      const t = new Date(d.date).getTime();
      return t >= from && t < to ? s + d.value : s;
    }, 0);
  };

  // Bucket into current window vs previous window for WoW deltas.
  const now = Date.now();
  const winMs = periodDays * 24 * 60 * 60 * 1000;
  const cutCurrent = now - winMs;
  const cutPrev = now - 2 * winMs;

  const inWindow = (p: (typeof fbAll)[number], from: number, to: number) => {
    if (!p.publishedAt) return false;
    const t = new Date(p.publishedAt).getTime();
    return t >= from && t < to;
  };

  const posts = fbAll.filter((p) => inWindow(p, cutCurrent, now));
  const prevPosts = fbAll.filter((p) => inWindow(p, cutPrev, cutCurrent));

  const sumK = (xs: typeof posts, k: string) =>
    xs.reduce((s, p) => s + (Number(p.metrics?.[k]) || 0), 0);
  const sumEng = (xs: typeof posts) =>
    xs.reduce((s, p) => s + engagementOf(p.metrics || {}), 0);

  const cur = {
    posts: posts.length,
    eng: sumEng(posts),
    reactions: sumK(posts, "reactions"),
    shares: sumK(posts, "shares"),
    videoViews: sumK(posts, "video_views"),
  };
  const prev = {
    posts: prevPosts.length,
    eng: sumEng(prevPosts),
    reactions: sumK(prevPosts, "reactions"),
    shares: sumK(prevPosts, "shares"),
    videoViews: sumK(prevPosts, "video_views"),
  };

  // Daily trend bars (across the current window only)
  const days: { date: string; label: string; engagement: number }[] = [];
  for (let i = periodDays - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const ymd = ymdPT(d.toISOString());
    const label = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    }).format(d);
    days.push({ date: ymd, label, engagement: 0 });
  }
  const dayIdx = new Map(days.map((d, i) => [d.date, i]));
  for (const p of posts) {
    if (!p.publishedAt) continue;
    const idx = dayIdx.get(ymdPT(p.publishedAt));
    if (idx !== undefined) {
      days[idx].engagement += engagementOf(p.metrics || {});
    }
  }
  const peakDay = days.reduce((m, d) => (d.engagement > m ? d.engagement : m), 0) || 1;

  // Content type breakdown — AVG per post (not total) per the analytics convention.
  type TypeAgg = { posts: number; engagement: number; reactions: number; shares: number; videoViews: number };
  const blank = (): TypeAgg => ({ posts: 0, engagement: 0, reactions: 0, shares: 0, videoViews: 0 });
  const byType: Record<string, TypeAgg> = { image: blank(), video: blank(), text: blank() };
  for (const p of posts) {
    const t = p.mediaType || "text";
    const bucket = byType[t] || byType.text;
    bucket.posts++;
    bucket.engagement += engagementOf(p.metrics || {});
    bucket.reactions += Number(p.metrics?.reactions) || 0;
    bucket.shares += Number(p.metrics?.shares) || 0;
    bucket.videoViews += Number(p.metrics?.video_views) || 0;
  }

  if (fbAll.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Metrics"
          title="Facebook Performance"
          description="Engagement on every post going out to your page. Updates every Monday."
        />
        <EmptyMetrics />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Metrics"
        title="Facebook Performance"
        description="Engagement on every post going out to your page. Updates every Monday."
        actions={<PeriodSelector active={periodKey} />}
      />

      {/* KPI tiles with WoW deltas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {pageMetrics.followers !== null && (
          <KpiTile
            label="Followers"
            icon={Users}
            value={pageMetrics.followers}
            prev={pageMetrics.followers - followsInWindow(cutCurrent, now)}
            displayDelta={followsInWindow(cutCurrent, now) - followsInWindow(cutPrev, cutCurrent)}
            absoluteMode
          />
        )}
        <KpiTile label="Posts" icon={Calendar} value={cur.posts} prev={prev.posts} />
        <KpiTile label="Engagement" icon={TrendingUp} value={cur.eng} prev={prev.eng} accent />
        <KpiTile label="Video views" icon={Play} value={cur.videoViews} prev={prev.videoViews} />
        <KpiTile label="Reactions" icon={ThumbsUp} value={cur.reactions} prev={prev.reactions} />
        <KpiTile label="Shares" icon={Share2} value={cur.shares} prev={prev.shares} />
      </div>

      {/* Daily engagement trend */}
      <section className="mb-8">
        <SectionHead
          title={`Last ${periodDays} days`}
          subtitle="Daily post engagement (reactions + comments + shares)"
        />
        <Card padding="md">
          <div className="flex items-end gap-1 h-[160px]">
            {days.map((d) => {
              const pct = (d.engagement / peakDay) * 100;
              return (
                <div
                  key={d.date}
                  className="flex-1 group relative"
                  title={`${d.label} · ${d.engagement} engagement`}
                >
                  <div
                    className={
                      "w-full rounded-t transition-colors " +
                      (d.engagement > 0
                        ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80"
                        : "bg-[var(--color-border)]/40")
                    }
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[var(--color-ink-subtle)] tabular-nums">
            <span>{days[0].label}</span>
            <span>{days[Math.floor(days.length / 2)].label}</span>
            <span>{days[days.length - 1].label}</span>
          </div>
          {(pageMetrics.pageViews28d !== null || pageMetrics.postEngagements28d !== null) && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
              {pageMetrics.pageViews28d !== null && (
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                  <span className="text-[12px] text-[var(--color-ink-muted)]">
                    <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                      {formatNumber(pageMetrics.pageViews28d)}
                    </span>{" "}
                    page views (28d)
                  </span>
                </div>
              )}
              {pageMetrics.postEngagements28d !== null && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                  <span className="text-[12px] text-[var(--color-ink-muted)]">
                    <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                      {formatNumber(pageMetrics.postEngagements28d)}
                    </span>{" "}
                    total post engagements (28d)
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* Content type — Photos vs Videos AVG per post */}
      <section>
        <SectionHead
          title="By content type"
          subtitle="Avg engagement per post — what's pulling its weight"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ContentTypeCard
            label="Photos"
            icon={FileImage}
            agg={byType.image}
            barColor="bg-emerald-500"
          />
          <ContentTypeCard
            label="Videos"
            icon={Film}
            agg={byType.video}
            barColor="bg-violet-500"
            showVideoViews
          />
        </div>
      </section>

      <p className="text-[11px] text-[var(--color-ink-subtle)] mt-6 text-center">
        Updates every Monday — pulled directly from Facebook.
      </p>
    </>
  );
}

// ---- Subcomponents -----------------------------------------------------

function PeriodSelector({ active }: { active: PeriodKey }) {
  return (
    <div className="inline-flex items-center gap-1 bg-[var(--color-surface-muted)] rounded-lg p-0.5">
      {PERIODS.map((p) => {
        const isActive = active === p.key;
        return (
          <Link
            key={p.key}
            href={p.key === "28d" ? "/metrics" : `/metrics?period=${p.key}`}
            className={
              "text-[12px] font-medium px-3 py-1 rounded-md transition-colors " +
              (isActive
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]")
            }
          >
            {p.label}
          </Link>
        );
      })}
    </div>
  );
}

function KpiTile({
  label,
  icon: Icon,
  value,
  prev,
  accent,
  displayDelta,
  absoluteMode,
}: {
  label: string;
  icon: typeof BarChart3;
  value: number;
  prev: number;
  accent?: boolean;
  displayDelta?: number; // for absoluteMode: net change to display
  absoluteMode?: boolean; // show "+12" instead of "+12%"
}) {
  return (
    <Card padding="md" className={accent ? "ring-1 ring-[var(--color-accent)]/30" : undefined}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div
        className={
          "text-[24px] font-bold mt-1 tracking-tight tabular-nums " +
          (accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]")
        }
      >
        {formatNumber(value)}
      </div>
      {absoluteMode ? (
        <AbsoluteDeltaBadge delta={displayDelta ?? 0} />
      ) : (
        <DeltaBadge delta={pctDelta(value, prev)} />
      )}
    </Card>
  );
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1 inline-flex items-center gap-1">
        <span className="text-emerald-600 font-medium">New</span>
        <span>vs previous period</span>
      </div>
    );
  }
  if (delta === 0) {
    return (
      <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1 inline-flex items-center gap-1">
        <Minus className="w-3 h-3" />
        <span>No change</span>
      </div>
    );
  }
  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const color = up ? "text-emerald-600" : "text-red-600";
  return (
    <div className={`text-[11px] mt-1 inline-flex items-center gap-1 ${color}`}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      <span className="font-medium tabular-nums">
        {up ? "+" : ""}
        {delta.toFixed(0)}%
      </span>
      <span className="text-[var(--color-ink-subtle)]">vs prev</span>
    </div>
  );
}

function AbsoluteDeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1 inline-flex items-center gap-1">
        <Minus className="w-3 h-3" />
        <span>No change</span>
      </div>
    );
  }
  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const color = up ? "text-emerald-600" : "text-red-600";
  return (
    <div className={`text-[11px] mt-1 inline-flex items-center gap-1 ${color}`}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      <span className="font-medium tabular-nums">
        {up ? "+" : ""}
        {delta}
      </span>
      <span className="text-[var(--color-ink-subtle)]">vs prev</span>
    </div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div>
        <h2 className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight">{title}</h2>
        <p className="text-[12px] text-[var(--color-ink-muted)]">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-[var(--color-border)] ml-3" />
    </div>
  );
}

function ContentTypeCard({
  label,
  icon: Icon,
  agg,
  barColor,
  showVideoViews,
}: {
  label: string;
  icon: typeof BarChart3;
  agg: { posts: number; engagement: number; reactions: number; shares: number; videoViews: number };
  barColor: string;
  showVideoViews?: boolean;
}) {
  const avgPerPost = agg.posts ? Math.round(agg.engagement / agg.posts) : 0;
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" />
          <span className="text-[13px] font-semibold text-[var(--color-ink)]">{label}</span>
        </div>
        <span className="text-[12px] text-[var(--color-ink-muted)] tabular-nums">
          {agg.posts} {agg.posts === 1 ? "post" : "posts"}
        </span>
      </div>
      <div className="text-[28px] font-bold text-[var(--color-ink)] tracking-tight tabular-nums">
        {formatNumber(avgPerPost)}
      </div>
      <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1">
        avg engagement per post
      </div>
      <div className={`mt-3 h-1 rounded-full ${barColor}`} />
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
        <Stat label="Reactions" value={formatNumber(agg.reactions)} />
        <Stat label="Shares" value={formatNumber(agg.shares)} />
        {showVideoViews ? (
          <Stat label="Video views" value={formatNumber(agg.videoViews)} />
        ) : (
          <Stat label="Posts" value={formatNumber(agg.posts)} />
        )}
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
        {label}
      </div>
      <div className="text-[14px] font-semibold text-[var(--color-ink)] mt-0.5 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function EmptyMetrics() {
  return (
    <Card padding="lg">
      <div className="text-center py-8">
        <BarChart3 className="w-10 h-10 text-[var(--color-ink-subtle)] mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
          No Facebook posts yet
        </h3>
        <p className="text-[13.5px] text-[var(--color-ink-muted)] mt-1.5 max-w-md mx-auto leading-relaxed">
          Once your first post goes out, engagement numbers populate here.
          Updates every Monday — pulled directly from your Facebook page.
        </p>
      </div>
    </Card>
  );
}
