import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getReports, getReportHtml } from "@/lib/portal-data";
import { TrendingUp, Search } from "lucide-react";

export default async function SeoPage() {
  const reports = await getReports();
  const seoReport = reports.find((r) => r.type === "seo" && r.path.endsWith(".html"));

  if (!seoReport) {
    return (
      <>
        <PageHeader
          eyebrow="SEO"
          title="SEO Content Plan"
          description="Long-term organic growth strategy."
        />
        <Card>
          <div className="text-center py-12">
            <Search className="w-10 h-10 text-[var(--color-ink-subtle)] mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
              No SEO plan published yet
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-1">
              Your first SEO content plan will appear here.
            </p>
          </div>
        </Card>
      </>
    );
  }

  const html = await getReportHtml(seoReport.id);

  return (
    <>
      <PageHeader
        eyebrow="SEO"
        title="SEO Content Plan"
        description="Your long-term plan to grow organic search traffic and rank for the keywords that drive sales."
        actions={
          <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            Active plan
          </div>
        }
      />

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_1px_2px_rgba(10,14,31,0.04)] overflow-hidden">
        <iframe
          srcDoc={html || ""}
          title="SEO Content Plan"
          className="w-full block border-0"
          style={{ height: "calc(100vh - 220px)", minHeight: "800px" }}
        />
      </div>
    </>
  );
}
