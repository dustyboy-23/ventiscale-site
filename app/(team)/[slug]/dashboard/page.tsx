import Link from "next/link";
import { Building2, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { KpiCard } from "@/components/kpi-card";
import {
  getTeamSession,
  getManagedClients,
  getLatestSnapshot,
} from "@/lib/team-queries";
import { notFound } from "next/navigation";

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getTeamSession(slug);
  if (!session) notFound();

  const [clients, snapshot] = await Promise.all([
    getManagedClients(session.team.id),
    getLatestSnapshot(session.team.id),
  ]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <>
      <PageHeader
        title={`${greeting}.`}
        description={`${clients.length} brand${clients.length === 1 ? "" : "s"} under management.`}
      />

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Building2}
          label="Brands managed"
          value={clients.length}
        />
        <KpiCard
          icon={Activity}
          label="Posts published (last snapshot)"
          value={snapshot?.totalPublished ?? 0}
        />
        <KpiCard
          icon={TrendingUp}
          label="Avg ROAS"
          value={snapshot?.avgRoas ?? 0}
          hint="x multiplier"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Cron failures today"
          value={snapshot?.cronFailuresToday ?? 0}
          highlight={
            !!(snapshot?.cronFailuresToday && snapshot.cronFailuresToday > 0)
          }
        />
      </section>

      <section className="mt-10">
        <CardHeader title="Brands" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id}>
              <Link
                href={`/${slug}/brands#${c.slug}`}
                className="flex items-center gap-3"
              >
                <div
                  className="h-10 w-10 flex-shrink-0 rounded-md"
                  style={{ backgroundColor: c.brandColor || "#94a3b8" }}
                />
                <div>
                  <div className="font-medium text-[var(--color-text)]">{c.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {c.isAgency ? "Agency · self" : "Client"}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {snapshot ? (
        <p className="mt-8 text-xs text-[var(--color-text-muted)]">
          Last metrics snapshot: {new Date(snapshot.snapshotDate).toLocaleDateString()}.
          Generated daily by{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-[var(--color-text)]">
            aggregate-team-metrics.py
          </code>
          .
        </p>
      ) : (
        <p className="mt-8 text-xs text-[var(--color-text-muted)]">
          No metrics snapshot yet. Daily aggregator will populate on first cron fire.
        </p>
      )}
    </>
  );
}
