import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getContentDrafts } from "@/lib/portal-data";
import { getPortalSession } from "@/lib/current-client";
import { formatDate } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { ContentCard } from "./content-card";

export default async function ContentPage() {
  const [drafts, session] = await Promise.all([
    getContentDrafts(),
    getPortalSession(),
  ]);
  const role: "owner" | "admin" | "viewer" =
    session?.mode === "real" ? session.role : "owner";

  // Group by date
  const grouped = drafts.reduce<Record<string, typeof drafts>>((acc, d) => {
    (acc[d.date] = acc[d.date] || []).push(d);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Count pending reviews
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

      {dates.length === 0 && (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
