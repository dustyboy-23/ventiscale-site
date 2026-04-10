import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getContentDrafts } from "@/lib/sg-data";
import { formatDate } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const PLATFORM_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  facebook: { label: "Facebook", bg: "bg-blue-50", text: "text-blue-700" },
  linkedin: { label: "LinkedIn", bg: "bg-sky-50", text: "text-sky-700" },
  other: { label: "Social", bg: "bg-slate-100", text: "text-slate-700" },
};

const SLOT_LABEL: Record<string, string> = {
  morning: "Morning",
  midday: "Midday",
  evening: "Evening",
  "": "Scheduled",
};

export default async function ContentPage() {
  const drafts = await getContentDrafts();

  // Group by date
  const grouped = drafts.reduce<Record<string, typeof drafts>>((acc, d) => {
    (acc[d.date] = acc[d.date] || []).push(d);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Content Calendar"
        description="Every post planned and going out across your channels."
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
              {grouped[date].map((d) => {
                const platform = PLATFORM_STYLES[d.platform] || PLATFORM_STYLES.other;
                return (
                  <Card key={d.id} padding="md">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${platform.bg} ${platform.text} px-2 py-1 rounded`}
                      >
                        {platform.label}
                      </span>
                      <span className="text-[11px] text-[var(--color-ink-subtle)] font-medium uppercase tracking-wider">
                        {SLOT_LABEL[d.slot] || d.slot}
                      </span>
                      {d.isProductPost && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-1 rounded">
                          Product
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight mb-2 leading-snug">
                      {d.topic}
                    </h3>

                    <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed line-clamp-4 whitespace-pre-line">
                      {d.caption}
                    </p>

                    {d.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                        <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider mb-2">
                          {d.comments.length} comment{d.comments.length === 1 ? "" : "s"} queued
                        </div>
                        <p className="text-[12px] text-[var(--color-ink-muted)] leading-relaxed line-clamp-2">
                          {d.comments[0]}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
