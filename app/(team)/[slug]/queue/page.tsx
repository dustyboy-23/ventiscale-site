import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getTeamSession } from "@/lib/team-queries";

// Phase 2 stub — cross-client content queue: drafts → review → published across
// all team-managed brands. Filterable by status / brand / assignee. Reads from
// content_items via team RLS policy. Wired in Phase 2.5.
export default async function TeamQueuePage({
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
        title="Queue"
        description="All content drafts across managed brands. Filter by status, brand, or assignee."
      />
      <Card>
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          <p>Queue is empty until brand crons + team members start producing content drafts.</p>
          <p className="mt-2">
            Wired to <code>content_items</code> via the team RLS policy added 2026-05-09.
          </p>
        </div>
      </Card>
    </>
  );
}
