import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getTeamSession, getManagedClients } from "@/lib/team-queries";

export default async function TeamBrandsPage({
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
        title="Brands"
        description={`${clients.length} under management. Click to switch into a client view.`}
      />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((c) => (
          <Card key={c.id}>
            <div id={c.slug} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 flex-shrink-0 rounded-md"
                  style={{ backgroundColor: c.brandColor || "#94a3b8" }}
                />
                <div>
                  <div className="font-medium text-[var(--color-text)]">{c.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {c.isAgency ? "Agency · self" : "Client"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <Link
                  href={`/dashboard?client=${c.slug}`}
                  className="rounded border border-[var(--color-border)] px-2 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Open client view
                </Link>
                <Link
                  href={`/${slug}/health#${c.slug}`}
                  className="rounded border border-[var(--color-border)] px-2 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Health
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
