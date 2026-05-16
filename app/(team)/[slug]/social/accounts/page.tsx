import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { StatusBadge as AccountStatusBadge } from "@/components/social/account-status";
import { PlatformIcon, getPlatformLabel } from "@/components/social/platform-icons";
import { getTeamSession, getManagedClients } from "@/lib/team-queries";
import { getSocialAccountsForTeam } from "@/lib/social-queries";
import { AddBrandForm, AddChannelForm } from "./forms";

export const dynamic = "force-dynamic";

export default async function SocialAccountsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getTeamSession(slug);
  if (!session) notFound();

  const [brands, accounts] = await Promise.all([
    getManagedClients(session.team.id),
    getSocialAccountsForTeam(session.team.id),
  ]);

  // Group accounts by brand for rendering
  const byBrand = new Map<string, typeof accounts>();
  for (const brand of brands) byBrand.set(brand.id, []);
  for (const acc of accounts) {
    if (!byBrand.has(acc.clientId)) byBrand.set(acc.clientId, []);
    byBrand.get(acc.clientId)!.push(acc);
  }

  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="Connected accounts"
        description="Per-brand social channels the scheduler can post to. Add a brand, then add the platforms (TikTok, Instagram, Facebook, LinkedIn) and credentials path."
        actions={
          <Link
            href={`/${slug}/social`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
            Back to queue
          </Link>
        }
      />

      {brands.length === 0 ? (
        <Card>
          <CardHeader title="No brands yet" description="Add your first brand to start connecting channels." />
          <AddBrandForm teamSlug={slug} />
        </Card>
      ) : (
        <div className="space-y-6">
          {brands.map((brand) => {
            const list = byBrand.get(brand.id) ?? [];
            return (
              <Card key={brand.id} padding="none">
                <div className="px-6 pt-6">
                  <CardHeader
                    title={brand.name}
                    description={
                      list.length === 0
                        ? "No channels connected yet."
                        : `${list.length} channel${list.length === 1 ? "" : "s"} connected.`
                    }
                  />
                </div>
                {list.length > 0 && (
                  <div className="border-t border-[var(--color-border)]">
                    <table className="w-full text-[13px]">
                      <thead className="bg-[var(--color-canvas)]">
                        <tr className="text-left">
                          <Th>Platform</Th>
                          <Th>Handle</Th>
                          <Th>Account ID</Th>
                          <Th>Status</Th>
                          <Th>Last used</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((acc) => (
                          <tr
                            key={acc.id}
                            className="border-t border-[var(--color-border)]"
                          >
                            <Td>
                              <div className="flex items-center gap-2 py-3">
                                <PlatformIcon platform={acc.platform} />
                                <span>{getPlatformLabel(acc.platform)}</span>
                              </div>
                            </Td>
                            <Td>
                              <span className="font-mono text-[12px]">{acc.accountHandle}</span>
                            </Td>
                            <Td>
                              <span className="font-mono text-[11px] text-[var(--color-ink-subtle)]">
                                {acc.accountId.length > 24
                                  ? `${acc.accountId.slice(0, 21)}…`
                                  : acc.accountId}
                              </span>
                            </Td>
                            <Td>
                              <AccountStatusBadge status={acc.status} />
                            </Td>
                            <Td>
                              <span className="text-[12px] text-[var(--color-ink-subtle)]">
                                {acc.lastUsedAt
                                  ? new Date(acc.lastUsedAt).toLocaleDateString()
                                  : "—"}
                              </span>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <details className="border-t border-[var(--color-border)]">
                  <summary className="cursor-pointer px-6 py-3 text-[13px] font-medium text-[var(--color-accent)] hover:bg-[var(--color-canvas)]/50 select-none">
                    <span className="inline-flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Add channel to {brand.name}
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2 border-t border-[var(--color-border)]/50">
                    <AddChannelForm
                      teamSlug={slug}
                      clientId={brand.id}
                      clientSlug={brand.slug}
                    />
                  </div>
                </details>
              </Card>
            );
          })}

          <Card>
            <details>
              <summary className="cursor-pointer text-[13px] font-medium text-[var(--color-accent)] select-none">
                <span className="inline-flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Add another brand
                </span>
              </summary>
              <div className="mt-4">
                <AddBrandForm teamSlug={slug} />
              </div>
            </details>
          </Card>
        </div>
      )}
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 align-middle">{children}</td>;
}
