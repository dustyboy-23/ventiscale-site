import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getTeamSession } from "@/lib/team-queries";

// Phase 2 stub — content velocity per person + per brand over last 30d.
// Reads from activity_log + content_items (RLS allows team members via the
// team_member_read_managed_* policies added in 20260509_01_agency_layer migration).
// Real data fetch wired in Phase 2.5.
export default async function TeamVelocityPage({
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
        title="Velocity"
        subtitle="Content output per person and per brand over the last 30 days."
      />
      <Card>
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          <p>Velocity tracking starts firing once team members are onboarded and the daily aggregator runs.</p>
          <p className="mt-2">
            Wired to <code>activity_log</code> + <code>content_items</code> via the team
            membership RLS policies (added 2026-05-09).
          </p>
        </div>
      </Card>
    </>
  );
}
