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
} from "lucide-react";

const PLATFORM_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  facebook: { label: "Facebook", bg: "bg-blue-50", text: "text-blue-700" },
  linkedin: { label: "LinkedIn", bg: "bg-sky-50", text: "text-sky-700" },
  blog: { label: "Blog", bg: "bg-amber-50", text: "text-amber-700" },
  instagram: { label: "Instagram", bg: "bg-pink-50", text: "text-pink-700" },
  other: { label: "Social", bg: "bg-slate-100", text: "text-slate-700" },
};

const METRIC_META: Array<{
  key: string;
  label: string;
  icon: typeof ThumbsUp;
}> = [
  { key: "reactions", label: "Reactions", icon: ThumbsUp },
  { key: "likes", label: "Likes", icon: ThumbsUp },
  { key: "comments", label: "Comments", icon: MessageSquare },
  { key: "shares", label: "Shares", icon: Share2 },
  { key: "video_views", label: "Views", icon: Play },
  { key: "impressions", label: "Impressions", icon: Eye },
];

function postLink(platform: string, externalId: string | null): string | null {
  if (!externalId) return null;
  if (platform === "facebook") {
    if (externalId.includes("_")) {
      return `https://www.facebook.com/${externalId.replace("_", "/posts/")}`;
    }
    return `https://www.facebook.com/${externalId}`;
  }
  if (platform === "linkedin") {
    if (externalId.startsWith("urn:li:share:")) {
      const id = externalId.split(":").pop();
      return `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`;
    }
    return null;
  }
  return null;
}

export default async function MetricsPage() {
  const posts = await getPublishedPosts(60);

  // Totals across all posts
  const totals = posts.reduce<Record<string, number>>((acc, p) => {
    for (const k of Object.keys(p.metrics || {})) {
      acc[k] = (acc[k] || 0) + (Number(p.metrics[k]) || 0);
    }
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Metrics"
        title="Social Performance"
        description="Engagement on every post that's gone out. Pulled from FB and LinkedIn."
      />

      {posts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <BarChart3 className="w-10 h-10 text-[var(--color-ink-subtle)] mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
              No posts published yet
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-1.5 max-w-md mx-auto leading-relaxed">
              Once you approve drafts in Content and they go out, engagement
              numbers will land here. Refreshes every 6 hours.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Totals strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card padding="md">
              <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
                Posts published
              </div>
              <div className="text-[24px] font-bold text-[var(--color-ink)] mt-1 tracking-tight">
                {formatNumber(posts.length)}
              </div>
            </Card>
            {METRIC_META.filter((m) => totals[m.key]).slice(0, 3).map((m) => {
              const Icon = m.icon;
              return (
                <Card key={m.key} padding="md">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
                    <Icon className="w-3 h-3" />
                    {m.label}
                  </div>
                  <div className="text-[24px] font-bold text-[var(--color-ink)] mt-1 tracking-tight">
                    {formatNumber(totals[m.key] || 0)}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Per-post list */}
          <div className="space-y-3">
            {posts.map((p) => {
              const platform = PLATFORM_STYLES[p.platform] || PLATFORM_STYLES.other;
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
                          className={`text-[10px] font-semibold uppercase tracking-wider ${platform.bg} ${platform.text} px-2 py-0.5 rounded`}
                        >
                          {platform.label}
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
                              <div
                                key={m.key}
                                className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-ink-muted)]"
                              >
                                <Icon className="w-3.5 h-3.5 text-[var(--color-ink-subtle)]" />
                                <span className="font-medium text-[var(--color-ink)]">
                                  {formatNumber(val)}
                                </span>
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

          <p className="text-[11px] text-[var(--color-ink-subtle)] mt-6 text-center">
            Engagement refreshes every 6 hours from FB and LinkedIn directly.
          </p>
        </>
      )}
    </>
  );
}
