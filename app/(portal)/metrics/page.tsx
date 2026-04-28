import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getPublishedPosts } from "@/lib/portal-data";
import { formatDate, formatNumber, relativeTime } from "@/lib/utils";
import {
  BarChart3,
  ThumbsUp,
  MessageSquare,
  Share2,
  Eye,
  Play,
  ExternalLink,
  TrendingUp,
  Trophy,
  Calendar,
} from "lucide-react";

const PLATFORM_STYLES: Record<string, { label: string; bg: string; text: string; bar: string }> = {
  facebook: { label: "Facebook", bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" },
  linkedin: { label: "LinkedIn", bg: "bg-sky-50", text: "text-sky-700", bar: "bg-sky-500" },
  blog: { label: "Blog", bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
  instagram: { label: "Instagram", bg: "bg-pink-50", text: "text-pink-700", bar: "bg-pink-500" },
  other: { label: "Social", bg: "bg-slate-100", text: "text-slate-700", bar: "bg-slate-500" },
};

const METRIC_META: Array<{ key: string; label: string; icon: typeof ThumbsUp }> = [
  { key: "reactions", label: "Reactions", icon: ThumbsUp },
  { key: "likes", label: "Likes", icon: ThumbsUp },
  { key: "comments", label: "Comments", icon: MessageSquare },
  { key: "shares", label: "Shares", icon: Share2 },
  { key: "video_views", label: "Views", icon: Play },
  { key: "impressions", label: "Impressions", icon: Eye },
];

const ENGAGEMENT_KEYS = ["reactions", "likes", "comments", "shares"] as const;

function postLink(platform: string, externalId: string | null): string | null {
  if (!externalId) return null;
  if (platform === "facebook") {
    if (externalId.includes("_")) {
      return `https://www.facebook.com/${externalId.replace("_", "/posts/")}`;
    }
    return `https://www.facebook.com/${externalId}`;
  }
  if (platform === "linkedin" && externalId.startsWith("urn:li:share:")) {
    const id = externalId.split(":").pop();
    return `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`;
  }
  return null;
}

function engagementOf(metrics: Record<string, unknown>): number {
  let total = 0;
  for (const k of ENGAGEMENT_KEYS) {
    total += Number(metrics[k]) || 0;
  }
  return total;
}

function ymdPT(iso: string): string {
  // Render the calendar day in PT for the trend chart bucketing.
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default async function MetricsPage() {
  const posts = await getPublishedPosts(120);

  // ---- Aggregations ----------------------------------------------------

  // Totals across all metrics keys we know about
  const totals = posts.reduce<Record<string, number>>((acc, p) => {
    for (const k of Object.keys(p.metrics || {})) {
      acc[k] = (acc[k] || 0) + (Number(p.metrics[k]) || 0);
    }
    return acc;
  }, {});

  const totalEngagement = posts.reduce((s, p) => s + engagementOf(p.metrics || {}), 0);
  const avgEngagement = posts.length ? Math.round(totalEngagement / posts.length) : 0;
  const bestPost = posts.length
    ? posts.reduce((best, p) => {
        const e = engagementOf(p.metrics || {});
        return e > engagementOf(best.metrics || {}) ? p : best;
      })
    : null;
  const bestEngagement = bestPost ? engagementOf(bestPost.metrics || {}) : 0;

  // Trend: last 30 days, daily totals
  const today = new Date();
  const days: { date: string; label: string; engagement: number }[] = [];
  for (let i = 29; i >= 0; i--) {
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

  // Platform split
  const platformAgg: Record<string, { posts: number; engagement: number }> = {};
  for (const p of posts) {
    const k = p.platform || "other";
    if (!platformAgg[k]) platformAgg[k] = { posts: 0, engagement: 0 };
    platformAgg[k].posts++;
    platformAgg[k].engagement += engagementOf(p.metrics || {});
  }
  const platformList = Object.entries(platformAgg)
    .sort((a, b) => b[1].engagement - a[1].engagement);

  // Top performers
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
          title="Social Performance"
          description="Engagement on every post across Facebook + LinkedIn. Refreshes every 6 hours."
        />
        <EmptyMetrics />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Metrics"
        title="Social Performance"
        description="Engagement on every post across Facebook + LinkedIn. Refreshes every 6 hours."
      />

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Posts published" value={formatNumber(posts.length)} icon={Calendar} />
        <StatCard label="Total engagement" value={formatNumber(totalEngagement)} icon={TrendingUp} />
        <StatCard label="Avg per post" value={formatNumber(avgEngagement)} icon={BarChart3} />
        <StatCard label="Best post" value={formatNumber(bestEngagement)} icon={Trophy} />
      </div>

      {/* Trend */}
      <section className="mb-8">
        <SectionHead title="Last 30 days" subtitle="Daily engagement total across all platforms" />
        <Card padding="md">
          <div className="flex items-end gap-1 h-[140px]">
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

      {/* Platform split */}
      <section className="mb-8">
        <SectionHead title="By platform" subtitle="Engagement and post volume per channel" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {platformList.map(([key, agg]) => {
            const meta = PLATFORM_STYLES[key] || PLATFORM_STYLES.other;
            const pct = totalEngagement > 0 ? (agg.engagement / totalEngagement) * 100 : 0;
            return (
              <Card key={key} padding="md">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${meta.bg} ${meta.text} px-2 py-1 rounded`}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[12px] text-[var(--color-ink-muted)]">
                    {agg.posts} {agg.posts === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div className="text-[28px] font-bold text-[var(--color-ink)] tracking-tight tabular-nums">
                  {formatNumber(agg.engagement)}
                </div>
                <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1">
                  total engagement · {pct.toFixed(0)}% of all
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[var(--color-border)]/40 overflow-hidden">
                  <div className={`h-full ${meta.bar}`} style={{ width: `${pct}%` }} />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Top 5 */}
      {top5.length > 0 && (
        <section className="mb-8">
          <SectionHead title="Top performers" subtitle="Your 5 highest-engagement posts" />
          <div className="space-y-2">
            {top5.map((p, i) => {
              const meta = PLATFORM_STYLES[p.platform] || PLATFORM_STYLES.other;
              const link = postLink(p.platform, p.externalId);
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
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider ${meta.bg} ${meta.text} px-1.5 py-0.5 rounded`}
                        >
                          {meta.label}
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

      {/* All posts */}
      <section>
        <SectionHead title="All posts" subtitle="Every post that's gone live, newest first" />
        <div className="space-y-3">
          {posts.map((p) => {
            const meta = PLATFORM_STYLES[p.platform] || PLATFORM_STYLES.other;
            const link = postLink(p.platform, p.externalId);
            const visibleMetrics = METRIC_META.filter(
              (m) => p.metrics && p.metrics[m.key] !== undefined,
            );
            return (
              <Card key={p.id} padding="md">
                <div className="flex items-start gap-4">
                  {p.driveFileId && (
                    <a
                      href={`https://drive.google.com/file/d/${p.driveFileId}/view`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                    >
                      <img
                        src={`https://lh3.googleusercontent.com/d/${p.driveFileId}=w160`}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover bg-[var(--color-surface-muted)]"
                        loading="lazy"
                      />
                    </a>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${meta.bg} ${meta.text} px-2 py-0.5 rounded`}
                      >
                        {meta.label}
                      </span>
                      {p.publishedAt && (
                        <span className="text-[11px] text-[var(--color-ink-subtle)]">
                          {formatDate(p.publishedAt, { month: "short", day: "numeric", year: "numeric" })} · {relativeTime(p.publishedAt)}
                        </span>
                      )}
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors"
                          aria-label="Open post"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-ink)] tracking-tight leading-snug mb-2">
                      {p.title}
                    </h3>

                    {visibleMetrics.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        {visibleMetrics.map((m) => {
                          const Icon = m.icon;
                          const val = Number(p.metrics[m.key]) || 0;
                          return (
                            <div key={m.key} className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-ink-muted)]">
                              <Icon className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                              <span className="font-medium text-[var(--color-ink)] tabular-nums">{formatNumber(val)}</span>
                              <span className="text-[11px]">{m.label.toLowerCase()}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[12px] text-[var(--color-ink-subtle)]">
                        {p.metricsSyncedAt
                          ? "No engagement yet."
                          : "Metrics pending. Check back after the next 6h refresh."}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <p className="text-[11px] text-[var(--color-ink-subtle)] mt-6 text-center">
        Engagement refreshes every 6 hours from FB and LinkedIn directly.
      </p>
    </>
  );
}

// ---- Subcomponents -----------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BarChart3;
}) {
  return (
    <Card padding="md">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-[24px] font-bold text-[var(--color-ink)] mt-1 tracking-tight tabular-nums">
        {value}
      </div>
    </Card>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div>
        <h2 className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight">
          {title}
        </h2>
        <p className="text-[12px] text-[var(--color-ink-muted)]">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-[var(--color-border)] ml-3" />
    </div>
  );
}

function EmptyMetrics() {
  // Helpful empty state showing the user what's coming once posts go out.
  return (
    <>
      <Card padding="lg">
        <div className="text-center py-8">
          <BarChart3 className="w-10 h-10 text-[var(--color-ink-subtle)] mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
            Metrics start landing here once your first post goes out
          </h3>
          <p className="text-[13.5px] text-[var(--color-ink-muted)] mt-1.5 max-w-md mx-auto leading-relaxed">
            We pull engagement directly from Facebook and LinkedIn every 6 hours.
            You'll see daily totals, platform splits, top performers, and per-post
            breakdowns — all updated automatically.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {["Posts published", "Total engagement", "Avg per post", "Best post"].map((label) => (
          <Card key={label} padding="md">
            <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
              {label}
            </div>
            <div className="text-[24px] font-bold text-[var(--color-ink-subtle)]/40 mt-1 tracking-tight">
              —
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        <Card padding="md">
          <div className="text-[12px] font-semibold text-[var(--color-ink-muted)] mb-3">
            Last 30 days · daily engagement
          </div>
          <div className="flex items-end gap-1 h-[100px] opacity-30">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-[var(--color-border)] rounded-t"
                style={{ height: `${15 + Math.sin(i / 3) * 25 + Math.random() * 20}%` }}
              />
            ))}
          </div>
        </Card>
        <Card padding="md">
          <div className="text-[12px] font-semibold text-[var(--color-ink-muted)] mb-3">
            By platform
          </div>
          <div className="space-y-3 opacity-30">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Facebook</span>
                <span className="tabular-nums">—</span>
              </div>
              <div className="h-1.5 rounded-full bg-blue-500/30" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>LinkedIn</span>
                <span className="tabular-nums">—</span>
              </div>
              <div className="h-1.5 rounded-full bg-sky-500/30" />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
