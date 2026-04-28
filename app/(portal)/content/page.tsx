import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getContentDrafts } from "@/lib/portal-data";
import { getPortalSession } from "@/lib/current-client";
import { formatDate } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { ContentCard } from "./content-card";

type StatusFilter = "awaiting" | "approved" | "rejected" | "published" | "all";

const FILTERS: { key: StatusFilter; label: string; matches: (s: string) => boolean }[] = [
  { key: "awaiting",  label: "Awaiting",      matches: (s) => s === "draft" || s === "scheduled" },
  { key: "approved",  label: "Approved",      matches: (s) => s === "approved" },
  { key: "rejected",  label: "Needs changes", matches: (s) => s === "rejected" },
  { key: "published", label: "Published",     matches: (s) => s === "published" },
  { key: "all",       label: "All",           matches: () => true },
];

export default async function ContentPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const params = (await searchParams) || {};
  const requested = (params.status as StatusFilter | undefined) || "awaiting";
  const active = (FILTERS.find((f) => f.key === requested) || FILTERS[0]).key;

  const [drafts, session] = await Promise.all([
    getContentDrafts(),
    getPortalSession(),
  ]);
  const role: "owner" | "admin" | "viewer" =
    session?.mode === "real" ? session.role : "owner";

  // Per-status counts for the tab bar (computed before filtering).
  const counts: Record<StatusFilter, number> = {
    awaiting: 0, approved: 0, rejected: 0, published: 0, all: drafts.length,
  };
  for (const d of drafts) {
    for (const f of FILTERS) {
      if (f.key !== "all" && f.matches(d.status)) counts[f.key]++;
    }
  }

  const filterFn = FILTERS.find((f) => f.key === active)!.matches;
  const visible = drafts.filter((d) => filterFn(d.status));

  // Group by date and apply a natural sort within each group.
  // Without natural sort, "Day 10" would land before "Day 5"
  // alphabetically. Intl.Collator with numeric:true gets that right
  // and also keeps "AM" before "PM" since A precedes P.
  const naturalSort = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
  });
  const sortKey = (d: (typeof visible)[number]) =>
    `${d.scheduledAt || "9999"}|${d.topic}`;

  const grouped = visible.reduce<Record<string, typeof visible>>((acc, d) => {
    (acc[d.date] = acc[d.date] || []).push(d);
    return acc;
  }, {});

  for (const date of Object.keys(grouped)) {
    grouped[date].sort((a, b) => naturalSort.compare(sortKey(a), sortKey(b)));
  }

  // Ascending: nearest day first, future days below.
  const dates = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Content Calendar"
        description="Every post planned and going out across your channels."
        actions={
          counts.awaiting > 0 ? (
            <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
              {counts.awaiting} awaiting review
            </div>
          ) : undefined
        }
      />

      {/* Status filter tabs. Default lands on Awaiting so Ken sees what
          needs his eyes first. "Needs changes" is the editor view —
          rejected items live there until someone fixes them and flips
          back to draft. */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6 -mt-2">
        {FILTERS.map((f) => {
          const n = counts[f.key];
          const isActive = active === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === "awaiting" ? "/content" : `/content?status=${f.key}`}
              className={
                "inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors " +
                (isActive
                  ? "bg-[var(--color-ink)] text-[var(--color-canvas)]"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]/60")
              }
            >
              {f.label}
              <span
                className={
                  "text-[11px] tabular-nums " +
                  (isActive ? "opacity-80" : "text-[var(--color-ink-subtle)]")
                }
              >
                {n}
              </span>
            </Link>
          );
        })}
      </div>

      {dates.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-[var(--color-ink-subtle)] mx-auto mb-3" />
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              {active === "awaiting"
                ? "Nothing waiting on you. Inbox zero."
                : active === "rejected"
                  ? "No drafts need changes right now."
                  : active === "approved"
                    ? "No approved posts queued."
                    : active === "published"
                      ? "No posts published yet."
                      : "No drafts queued yet."}
            </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
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
