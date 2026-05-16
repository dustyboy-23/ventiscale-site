import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, AlertTriangle, Plus, Inbox } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/social/status-badge";
import { PlatformIconList } from "@/components/social/platform-icons";
import { getTeamSession } from "@/lib/team-queries";
import {
  getScheduledPostsForTeam,
  getSocialKpis,
  type ScheduledPostRow,
} from "@/lib/social-queries";

export const dynamic = "force-dynamic";

export default async function SocialQueuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getTeamSession(slug);
  if (!session) notFound();

  const [kpis, posts] = await Promise.all([
    getSocialKpis(session.team.id),
    getScheduledPostsForTeam(session.team.id),
  ]);

  return (
    <>
      <PageHeader
        title="Social"
        description="Scheduled posts across managed brands. Composer drafts, queue states, and per-platform delivery history."
        actions={
          <Link
            href={`/team/${slug}/social/new`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-ink)]/90 transition"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New post
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-10">
        <KpiCard
          icon={CalendarClock}
          label="Scheduled this week"
          value={kpis.scheduledThisWeek}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Published last 7d"
          value={kpis.publishedLast7d}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Failed last 7d"
          value={kpis.failedLast7d}
          highlight={kpis.failedLast7d > 0}
        />
      </section>

      <Card padding="none">
        <div className="px-6 pt-6">
          <CardHeader
            title="Queue"
            description={
              posts.length === 0
                ? "No posts yet. Create your first one with the composer."
                : `${posts.length} post${posts.length === 1 ? "" : "s"} in view.`
            }
            action={
              <Link
                href={`/team/${slug}/social/accounts`}
                className="text-[12px] font-medium text-[var(--color-accent)] hover:underline"
              >
                Manage accounts →
              </Link>
            }
          />
        </div>

        {posts.length === 0 ? (
          <EmptyState slug={slug} />
        ) : (
          <PostsTable posts={posts} slug={slug} />
        )}
      </Card>
    </>
  );
}

function EmptyState({ slug }: { slug: string }) {
  return (
    <div className="px-6 pb-12 pt-2">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-canvas)] py-16">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-muted)] flex items-center justify-center mb-4">
          <Inbox className="w-5 h-5 text-[var(--color-ink-muted)]" strokeWidth={2} />
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
          No scheduled posts yet
        </h3>
        <p className="mt-1 text-[13px] text-[var(--color-ink-muted)] max-w-sm text-center">
          The composer creates posts that fire automatically at the scheduled time.
          Worker checks the queue once per minute.
        </p>
        <Link
          href={`/team/${slug}/social/new`}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-ink)]/90 transition"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Schedule first post
        </Link>
      </div>
    </div>
  );
}

function PostsTable({ posts, slug }: { posts: ScheduledPostRow[]; slug: string }) {
  return (
    <div className="overflow-x-auto border-t border-[var(--color-border)]">
      <table className="w-full text-[13px]">
        <thead className="bg-[var(--color-canvas)]">
          <tr className="text-left">
            <Th>When</Th>
            <Th>Caption</Th>
            <Th>Brand</Th>
            <Th>Platforms</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-t border-[var(--color-border)] hover:bg-[var(--color-canvas)]/50 transition"
            >
              <Td>
                <Link
                  href={`/team/${slug}/social/${post.id}`}
                  className="block py-4"
                >
                  <div className="font-medium text-[var(--color-ink)] whitespace-nowrap">
                    {formatScheduledFor(post.scheduledFor)}
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-subtle)] mt-0.5">
                    {formatRelative(post.scheduledFor)}
                  </div>
                </Link>
              </Td>
              <Td>
                <Link
                  href={`/team/${slug}/social/${post.id}`}
                  className="block py-4 max-w-md text-[var(--color-ink)] truncate"
                >
                  {post.caption || <span className="text-[var(--color-ink-subtle)]">(no caption)</span>}
                </Link>
              </Td>
              <Td>
                <Link href={`/team/${slug}/social/${post.id}`} className="block py-4 text-[var(--color-ink-muted)] whitespace-nowrap">
                  {post.clientName}
                </Link>
              </Td>
              <Td>
                <Link href={`/team/${slug}/social/${post.id}`} className="block py-4">
                  <PlatformIconList platforms={post.platforms} />
                </Link>
              </Td>
              <Td>
                <Link href={`/team/${slug}/social/${post.id}`} className="block py-4">
                  <StatusBadge status={post.status} />
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 align-top">{children}</td>;
}

// 2026-05-15 14:30 PT
function formatScheduledFor(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  });
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diffMs = t - now;
  const absMs = Math.abs(diffMs);
  const mins = Math.round(absMs / 60_000);
  const hours = Math.round(absMs / 3_600_000);
  const days = Math.round(absMs / 86_400_000);

  if (absMs < 60_000) return diffMs > 0 ? "in <1 min" : "<1 min ago";
  if (absMs < 3_600_000) return diffMs > 0 ? `in ${mins} min` : `${mins} min ago`;
  if (absMs < 86_400_000) return diffMs > 0 ? `in ${hours}h` : `${hours}h ago`;
  return diffMs > 0 ? `in ${days}d` : `${days}d ago`;
}
