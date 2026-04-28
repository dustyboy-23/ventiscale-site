import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getPublishedPosts } from "@/lib/portal-data";
import { formatNumber, relativeTime } from "@/lib/utils";
import {
  BarChart3,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Share2,
  TrendingUp,
  Trophy,
  FileImage,
  Film,
  Calendar,
} from "lucide-react";

const ENGAGEMENT_KEYS = ["reactions", "likes", "comments", "shares"] as const;

function postLink(externalId: string | null): string | null {
  if (!externalId) return null;
  if (externalId.includes("_")) {
    return `https://www.facebook.com/${externalId.replace("_", "/posts/")}`;
  }
  return `https://www.facebook.com/${externalId}`;
}

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

export default async function MetricsPage() {
  // FB-only: filter to facebook posts here so the page is purely the
  // Sprinkler-Guard FB Page performance, mirroring FB Professional
  // Dashboard. LinkedIn (when it lands) will get its own page.
  const all = await getPublishedPosts(200);
  const posts = all.filter((p) => p.platform === "facebook");

  // ---- Aggregations ----------------------------------------------------

  const totals = posts.reduce<Record<string, number>>((acc, p) => {
    for (const k of Object.keys(p.metrics || {})) {
      acc[k] = (acc[k] || 0) + (Number(p.metrics[k]) || 0);
    }
    return acc;
  }, {});

  const totalEngagement = posts.reduce((s, p) => s + engagementOf(p.metrics || {}), 0);
  const totalReactions = totals.reactions || 0;
  const totalComments = totals.comments || 0;
  const totalShares = totals.shares || 0;
  const bestPost = posts.length
    ? posts.reduce((best, p) => {
        const e = engagementOf(p.metrics || {});
        return e > engagementOf(best.metrics || {}) ? p : best;
      })
    : null;
  const bestEngagement = bestPost ? engagementOf(bestPost.metrics || {}) : 0;

  // 28-day daily trend
  const today = new Date();
  const days: { date: string; label: string; engagement: number }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
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

  // Content type breakdown (FB Pro Dashboard pattern: Photo vs Video)
  type TypeAgg = { posts: number; engagement: number; reactions: number; comments: number; shares: number };
  const blank = (): TypeAgg => ({ posts: 0, engagement: 0, reactions: 0, comments: 0, shares: 0 });
  const byType: Record<string, TypeAgg> = { image: blank(), video: blank(), text: blank() };
  for (const p of posts) {
    const t = p.mediaType || "text";
    const bucket = byType[t] || byType.text;
    bucket.posts++;
    bucket.engagement += engagementOf(p.metrics || {});
    bucket.reactions += Number(p.metrics?.reactions) || 0;
    bucket.comments += Number(p.metrics?.comments) || 0;
    bucket.shares += Number(p.metrics?.shares) || 0;
  }

  // Top 5
  const top5 = [...posts]
    .map((p) => ({ ...p, _eng: engagementOf(p.metrics || {}) }))
    .filter((p) => p._eng > 0)
    .sort((a, b) => b._eng - a._eng)
    .slice(0, 5);

  // ---- Render ----------------------------------------------------------

  if (posts.length === 0) {
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
      />

      {/* Hero stat tiles — Facebook Pro Dashboard style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Posts" value={formatNumber(posts.length)} icon={Calendar} />
        <StatCard label="Engagement" value={formatNumber(totalEngagement)} icon={TrendingUp} accent />
        <StatCard label="Reactions" value={formatNumber(totalReactions)} icon={ThumbsUp} />
        <StatCard label="Comments" value={formatNumber(totalComments)} icon={MessageSquare} />
        <StatCard label="Shares" value={formatNumber(totalShares)} icon={Share2} />
        <StatCard label="Best post" value={formatNumber(bestEngagement)} icon={Trophy} />
      </div>

      {/* 28-day trend */}
      <section className="mb-8">
        <SectionHead title="Last 28 days" subtitle="Daily post engagement" />
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
        </Card>
      </section>

      {/* Content type — Photo vs Video performance */}
      <section className="mb-8">
        <SectionHead title="By content type" subtitle="What's working — photos vs videos" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ContentTypeCard
            label="Photos"
            icon={FileImage}
            agg={byType.image}
            totalPosts={posts.length}
            totalEngagement={totalEngagement}
            barColor="bg-emerald-500"
          />
          <ContentTypeCard
            label="Videos"
            icon={Film}
            agg={byType.video}
            totalPosts={posts.length}
            totalEngagement={totalEngagement}
            barColor="bg-violet-500"
          />
        </div>
      </section>

      {/* Top 5 */}
      {top5.length > 0 && (
        <section className="mb-8">
          <SectionHead title="Top performers" subtitle="Your 5 highest-engagement posts" />
          <div className="space-y-2">
            {top5.map((p, i) => {
              const link = postLink(p.externalId);
              return (
                <Card key={p.id} padding="md">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-surface-muted)] text-[12px] font-bold text-[var(--color-ink-muted)] shrink-0 tabular-nums">
                      {i + 1}
                    </div>
                    {p.driveFileId && (
                      <a
                        href={`https://drive.google.com/file/d/${p.driveFileId}/view`}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0"
                      >
                        <img
                          src={`https://lh3.googleusercontent.com/d/${p.driveFileId}=w120`}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover bg-[var(--color-surface-muted)]"
                          loading="lazy"
                        />
                      </a>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          Facebook
                        </span>
                        {p.publishedAt && (
                          <span className="text-[11px] text-[var(--color-ink-subtle)]">
                            {relativeTime(p.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)] truncate">
                        {p.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[20px] font-bold text-[var(--color-ink)] tabular-nums leading-none">
                        {formatNumber(p._eng)}
                      </div>
                      <div className="text-[10px] text-[var(--color-ink-subtle)] uppercase tracking-wider mt-1">
                        engagement
                      </div>
                    </div>
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors shrink-0"
                        aria-label="Open post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <p className="text-[11px] text-[var(--color-ink-subtle)] mt-2 text-center">
        Updates every Monday — pulled directly from Facebook.
      </p>
    </>
  );
}

// ---- Subcomponents -----------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof BarChart3;
  accent?: boolean;
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
        {value}
      </div>
    </Card>
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
  totalPosts,
  totalEngagement,
  barColor,
}: {
  label: string;
  icon: typeof BarChart3;
  agg: { posts: number; engagement: number; reactions: number; comments: number; shares: number };
  totalPosts: number;
  totalEngagement: number;
  barColor: string;
}) {
  const sharePct = totalEngagement > 0 ? (agg.engagement / totalEngagement) * 100 : 0;
  const avgPerPost = agg.posts ? Math.round(agg.engagement / agg.posts) : 0;
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" />
          <span className="text-[13px] font-semibold text-[var(--color-ink)]">{label}</span>
        </div>
        <span className="text-[12px] text-[var(--color-ink-muted)] tabular-nums">
          {agg.posts} of {totalPosts}
        </span>
      </div>
      <div className="text-[28px] font-bold text-[var(--color-ink)] tracking-tight tabular-nums">
        {formatNumber(agg.engagement)}
      </div>
      <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1">
        total engagement · {sharePct.toFixed(0)}% of all
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-[var(--color-border)]/40 overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${sharePct}%` }} />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
        <Stat label="Avg/post" value={formatNumber(avgPerPost)} />
        <Stat label="Reactions" value={formatNumber(agg.reactions)} />
        <Stat label="Comments" value={formatNumber(agg.comments)} />
        <Stat label="Shares" value={formatNumber(agg.shares)} />
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
    <>
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
    </>
  );
}
