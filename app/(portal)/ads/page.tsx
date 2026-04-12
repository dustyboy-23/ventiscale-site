import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getReports, getReportHtml } from "@/lib/portal-data";
import { TrendingUp, Megaphone } from "lucide-react";

export default async function AdsPage() {
  const reports = await getReports();
  const adsReport = reports.find((r) => r.type === "ads" && r.path.endsWith(".html"));

  if (!adsReport) {
    return (
      <>
        <PageHeader
          eyebrow="Ads"
          title="Paid Media Performance"
          description="Campaign spend, ROAS, and what's converting."
        />
        <Card>
          <div className="text-center py-12">
            <Megaphone className="w-10 h-10 text-[var(--color-ink-subtle)] mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
              No ads report published yet
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-1">
              Your paid media performance report will appear here.
            </p>
          </div>
        </Card>
      </>
    );
  }

  const html = await getReportHtml(adsReport.id);

  return (
    <>
      <PageHeader
        eyebrow="Ads"
        title="Paid Media Performance"
        description="Campaign spend, ROAS, and what's converting."
        actions={
          <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            Active report
          </div>
        }
      />

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_1px_2px_rgba(10,14,31,0.04)] overflow-hidden">
        <iframe
          srcDoc={html || ""}
          title="Paid Media Performance"
          className="w-full block border-0"
          style={{ height: "calc(100vh - 220px)", minHeight: "800px" }}
        />
      </div>
    </>
  );
}
