import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getTeamSession } from "@/lib/team-queries";

// Phase 2 stub — cross-client activity timeline. Reads from activity_log via
// team_member_read_managed_activity RLS policy (added 2026-05-09 migration).
// Wired with real data in Phase 2.5.
export default async function TeamActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getTeamSession(slug);
  if (!session) notFound();

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle="Cross-brand timeline. Who shipped what, where, and when."
      />
      <Card>
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          <p>Activity feed is empty. Will populate as team members + brand crons log events.</p>
          <p className="mt-2">
            Wired to <code>activity_log</code> via team RLS policy.
          </p>
        </div>
      </Card>
    </>
  );
}
