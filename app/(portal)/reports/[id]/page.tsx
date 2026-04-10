import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { getReports, getReportHtml } from "@/lib/sg-data";
import { formatDate } from "@/lib/utils";

export default async function ReportViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const html = await getReportHtml(id);
  if (!html) notFound();

  const reports = await getReports();
  const meta = reports.find((r) => r.id === id);

  // Strip wrapping <html>/<head>/<body> tags so the report's CSS lives inside an iframe-like container
  // Use srcDoc on iframe for full isolation of the report's styling
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          All reports
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-[13px] text-[var(--color-ink-muted)]">
            {meta?.date && formatDate(meta.date)}
          </div>
          <button
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink)] bg-white border border-[var(--color-border-strong)] hover:border-[var(--color-ink)] px-3 py-1.5 rounded-lg transition-colors"
            type="button"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_1px_2px_rgba(10,14,31,0.04)] overflow-hidden">
        <iframe
          srcDoc={html}
          title={meta?.title || "Report"}
          className="w-full block border-0"
          style={{ height: "calc(100vh - 180px)", minHeight: "800px" }}
        />
      </div>
    </>
  );
}
