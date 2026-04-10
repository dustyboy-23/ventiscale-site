import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getReports } from "@/lib/portal-data";
import { formatDate } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  client: "Performance",
  seo: "SEO Plan",
  baseline: "Baseline",
  internal: "Notes",
};

const TYPE_COLOR: Record<string, string> = {
  client: "bg-emerald-50 text-emerald-700",
  seo: "bg-blue-50 text-blue-700",
  baseline: "bg-purple-50 text-purple-700",
  internal: "bg-slate-100 text-slate-600",
};

export default async function ReportsPage() {
  const reports = await getReports();
  const viewable = reports.filter((r) => r.path.endsWith(".html"));

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Performance Reports"
        description="Weekly snapshots of revenue, traffic, SEO, and growth opportunities."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {viewable.length === 0 && (
          <Card>
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              No reports yet. Your first weekly report will appear here.
            </p>
          </Card>
        )}
        {viewable.map((r) => (
          <Link
            key={r.id}
            href={`/reports/${r.id}`}
            className="group block bg-white rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-ink)] shadow-[0_1px_2px_rgba(10,14,31,0.04)] hover:shadow-[0_4px_16px_rgba(10,14,31,0.08)] p-6 transition-all"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-muted)] group-hover:bg-[var(--color-ink)] flex items-center justify-center transition-colors">
                <FileText className="w-5 h-5 text-[var(--color-ink-muted)] group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${TYPE_COLOR[r.type]}`}
              >
                {TYPE_LABEL[r.type]}
              </span>
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)] tracking-tight mb-1">
              {r.title}
            </h3>
            <p className="text-[13px] text-[var(--color-ink-muted)]">
              {r.date ? formatDate(r.date) : "No date"}
            </p>
            <div className="mt-5 pt-5 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[12px] text-[var(--color-ink-subtle)]">Click to open</span>
              <ArrowUpRight
                className="w-4 h-4 text-[var(--color-ink-subtle)] group-hover:text-[var(--color-ink)] transition-colors"
                strokeWidth={2.5}
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
