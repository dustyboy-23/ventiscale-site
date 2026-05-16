import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { getTeamSession, getManagedClients } from "@/lib/team-queries";
import { getSocialAccountsForTeam, type SocialAccountRow } from "@/lib/social-queries";
import { ComposerForm } from "./composer";

export const dynamic = "force-dynamic";

export default async function ComposerPage({
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

  const activeAccounts = accounts.filter((a) => a.status === "active");

  // Group active accounts by brand for the composer's brand→channels selector
  const brandsWithChannels = brands
    .map((b) => ({
      ...b,
      channels: activeAccounts.filter((a) => a.clientId === b.id),
    }))
    .filter((b) => b.channels.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="New scheduled post"
        description="Pick the brand, the channels to post to, write the caption, attach media, set the time. Worker fires it within ~1 min of the scheduled time."
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

      {brandsWithChannels.length === 0 ? (
        <Card>
          <CardHeader
            title="No active channels yet"
            description="Connect at least one channel before composing posts."
            action={
              <Link
                href={`/${slug}/social/accounts`}
                className="rounded-lg bg-[var(--color-ink)] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-black transition"
              >
                Connect a channel →
              </Link>
            }
          />
        </Card>
      ) : (
        <ComposerForm
          teamSlug={slug}
          brandsWithChannels={brandsWithChannels as Array<{
            id: string;
            slug: string;
            name: string;
            channels: SocialAccountRow[];
          }>}
        />
      )}
    </>
  );
}
