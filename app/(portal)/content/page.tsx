import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getContentDrafts } from "@/lib/portal-data";
import { getPortalSession } from "@/lib/current-client";
import { formatDate } from "@/lib/utils";
import { Sparkles, Calendar as CalendarIcon, Film } from "lucide-react";
import Link from "next/link";
import { ContentCard } from "./content-card";

type Tab = "calendar" | "videos";

export default async function ContentPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const params = (await searchParams) || {};
  const requestedTab = params.tab === "videos" ? "videos" : "calendar";
  const activeTab: Tab = requestedTab;

  const [drafts, session] = await Promise.all([
    getContentDrafts(),
    getPortalSession(),
  ]);
  const role: "owner" | "admin" | "viewer" =
    session?.mode === "real" ? session.role : "owner";

  // Videos tab: only the videos Ken still needs to review (draft or
  // sent-back). Approved videos live in the calendar at their scheduled
  // slot, not here. Rejected ones stay in this queue until the editor
  // re-uploads / flips them back to draft.
  const videoQueue = drafts.filter(
    (d) => d.mediaType === "video" && (d.status === "draft" || d.status === "rejected"),
  );
  videoQueue.sort((a, b) =>
    (a.scheduledAt || "9999").localeCompare(b.scheduledAt || "9999"),
  );

  // Calendar tab: everything that's NOT a video awaiting Ken's review.
  // Approved/published videos still show in the calendar so Ken sees the
  // full week's posting flow.
  const videoQueueIds = new Set(videoQueue.map((d) => d.id));
  const calendarDrafts = drafts.filter((d) => !videoQueueIds.has(d.id));

  // Group by date and apply a natural sort within each group.
  // Without natural sort, "Day 10" would land before "Day 5"
  // alphabetically. Intl.Collator with numeric:true gets that right
  // and also keeps "AM" before "PM" since A precedes P.
  const naturalSort = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
  });
  const sortKey = (d: (typeof calendarDrafts)[number]) =>
    `${d.scheduledAt || "9999"}|${d.topic}`;

  const grouped = calendarDrafts.reduce<Record<string, typeof calendarDrafts>>(
    (acc, d) => {
      (acc[d.date] = acc[d.date] || []).push(d);
      return acc;
    },
    {},
  );

  for (const date of Object.keys(grouped)) {
    grouped[date].sort((a, b) => naturalSort.compare(sortKey(a), sortKey(b)));
  }

  // Ascending: nearest day first, future days below.
  const dates = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  // Counts for the tab labels
  const pendingCount = drafts.filter(
    (d) => d.status === "draft" || d.status === "scheduled",
  ).length;

  const TABS: { key: Tab; label: string; count: number; icon: React.ComponentType<{className?: string; strokeWidth?: number}> }[] = [
    { key: "calendar", label: "Calendar", count: calendarDrafts.length, icon: CalendarIcon },
    { key: "videos",   label: "Videos",   count: videoQueue.length,     icon: Film },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Content Calendar"
        description="Every post planned and going out across your channels."
        actions={
          pendingCount > 0 ? (
            <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
              {pendingCount} awaiting review
            </div>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-6 -mt-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <Link
              key={t.key}
              href={t.key === "calendar" ? "/content" : `/content?tab=${t.key}`}
              className={
                "inline-flex items-center gap-2 text-[13px] font-medium px-3.5 py-2 rounded-lg transition-colors " +
                (isActive
                  ? "bg-[var(--color-ink)] text-[var(--color-canvas)]"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]/60")
              }
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
              {t.label}
              <span
                className={
                  "text-[11px] tabular-nums " +
                  (isActive ? "opacity-80" : "text-[var(--color-ink-subtle)]")
                }
              >
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Videos tab */}
      {activeTab === "videos" && (
        <>
          {videoQueue.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Film className="w-8 h-8 text-[var(--color-ink-subtle)] mx-auto mb-3" />
                <p className="text-[14px] text-[var(--color-ink-muted)]">
                  No videos waiting on your review.
                </p>
              </div>
            </Card>
          ) : (
            <>
              <p className="text-[12.5px] text-[var(--color-ink-muted)] mb-5 leading-relaxed">
                Watch each one, then approve to schedule it or flag it for changes.
                Approved videos move to the calendar at their scheduled slot.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {videoQueue.map((d) => (
                  <ContentCard key={d.id} draft={d} role={role} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Calendar tab */}
      {activeTab === "calendar" && (
        <>
          {dates.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-[var(--color-ink-subtle)] mx-auto mb-3" />
                <p className="text-[14px] text-[var(--color-ink-muted)]">No drafts queued yet.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {dates.map((date) => (
                <section key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight">
                      {formatDate(date, { weekday: "long", month: "long", day: "numeric" })}
                    </h2>
                    <div className="flex-1 h-px bg-[var(--color-border)]" />
                    <span className="text-[12px] text-[var(--color-ink-subtle)] font-medium">
                      {grouped[date].length} {grouped[date].length === 1 ? "post" : "posts"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {grouped[date].map((d) => (
                      <ContentCard key={d.id} draft={d} role={role} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
