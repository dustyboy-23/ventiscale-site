import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getContentDrafts } from "@/lib/portal-data";
import { getPortalSession } from "@/lib/current-client";
import { formatDate } from "@/lib/utils";
import { Sparkles, Film } from "lucide-react";
import { ContentCard } from "./content-card";

export default async function ContentPage() {
  const [drafts, session] = await Promise.all([
    getContentDrafts(),
    getPortalSession(),
  ]);
  const role: "owner" | "admin" | "viewer" =
    session?.mode === "real" ? session.role : "owner";

  // Videos awaiting review: pull video drafts OUT of the daily calendar
  // and surface them at the top so Ken can watch them quickly and
  // approve/reject. Once approved, they re-join the calendar at their
  // scheduled_at slot. Rejected videos stay here for the editor to fix.
  const videoReview = drafts.filter(
    (d) => d.mediaType === "video" && (d.status === "draft" || d.status === "rejected"),
  );
  const videoReviewIds = new Set(videoReview.map((d) => d.id));
  const calendarDrafts = drafts.filter((d) => !videoReviewIds.has(d.id));

  // Sort video review queue by scheduled_at (nearest first).
  videoReview.sort((a, b) =>
    (a.scheduledAt || "9999").localeCompare(b.scheduledAt || "9999"),
  );

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

  // Count pending reviews (any platform/media)
  const pendingCount = drafts.filter(
    (d) => d.status === "draft" || d.status === "scheduled",
  ).length;

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

      {/* Videos awaiting review — at the top so Ken sees them first. */}
      {videoReview.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <Film className="w-3.5 h-3.5" strokeWidth={2.25} />
              <h2 className="text-[13px] font-bold tracking-tight">
                Videos awaiting your review
              </h2>
            </div>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-[12px] text-[var(--color-ink-subtle)] font-medium">
              {videoReview.length} {videoReview.length === 1 ? "video" : "videos"}
            </span>
          </div>
          <p className="text-[12.5px] text-[var(--color-ink-muted)] mb-4 leading-relaxed">
            Watch each one, then approve to schedule it or flag for changes.
            Approved videos drop into the calendar below at their scheduled
            slot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {videoReview.map((d) => (
              <ContentCard key={d.id} draft={d} role={role} />
            ))}
          </div>
        </section>
      )}

      {dates.length === 0 && videoReview.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-[var(--color-ink-subtle)] mx-auto mb-3" />
            <p className="text-[14px] text-[var(--color-ink-muted)]">No drafts queued yet.</p>
          </div>
        </Card>
      )}

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
    </>
  );
}
