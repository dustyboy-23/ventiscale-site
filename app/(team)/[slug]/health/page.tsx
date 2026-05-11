import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getTeamSession, getManagedClients } from "@/lib/team-queries";

// Phase 2 stub — system health: cron success rate per brand, ad spend deltas,
// alert threshold breaches. Reads from cron-failure-tally output + GA4/Meta
// snapshots in client_metrics. Wired in Phase 2.5.
export default async function TeamHealthPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getTeamSession(slug);
  if (!session) notFound();

  const clients = await getManagedClients(session.team.id);

  return (
    <>
      <PageHeader
        title="Health"
        description="Cron status, ad spend deltas, and threshold alerts per brand."
      />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((c) => (
          <Card key={c.id}>
            <div id={c.slug} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 flex-shrink-0 rounded-md"
                  style={{ backgroundColor: c.brandColor || "#94a3b8" }}
                />
                <div className="font-medium text-[var(--color-text)]">{c.name}</div>
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                Crons: <span className="text-[var(--color-text)]">— pending wire-up</span>
                <br />
                Ad spend (7d): <span className="text-[var(--color-text)]">— pending wire-up</span>
                <br />
                Alerts: <span className="text-emerald-600">none</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
