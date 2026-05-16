import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ExternalLink, FileVideo, User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/card";
import { StatusBadge } from "@/components/social/status-badge";
import { PlatformIcon, getPlatformLabel } from "@/components/social/platform-icons";
import { getTeamSession } from "@/lib/team-queries";
import { getScheduledPostById, getPostAttempts } from "@/lib/social-queries";
import { CancelButton } from "./actions-bar";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const session = await getTeamSession(slug);
  if (!session) notFound();

  const post = await getScheduledPostById(id);
  if (!post) notFound();

  const attempts = await getPostAttempts(id);

  return (
    <>
      <PageHeader
        eyebrow="Social post"
        title={truncate(post.caption, 80) || "(no caption)"}
        description={`${post.clientName} · scheduled for ${formatLocal(post.scheduledFor)}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {/* Post summary */}
          <Card>
            <CardHeader title="Post" />
            <dl className="space-y-3 text-[13px]">
              <Row icon={Calendar} label="Scheduled for">
                {formatLocal(post.scheduledFor)}
              </Row>
              <Row icon={Clock} label="Created">
                {formatLocal(post.createdAt)}
              </Row>
              <Row icon={User} label="Status">
                <StatusBadge status={post.status} />
              </Row>
              <Row icon={FileVideo} label="Platforms">
                <div className="flex flex-wrap items-center gap-2">
                  {post.platforms.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-canvas)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink-muted)]"
                    >
                      <PlatformIcon platform={p} />
                      {getPlatformLabel(p)}
                    </span>
                  ))}
                </div>
              </Row>
            </dl>
          </Card>

          {/* Caption */}
          <Card>
            <CardHeader title="Caption" description={`${post.caption.length} characters`} />
            <pre className="whitespace-pre-wrap break-words font-sans text-[14px] text-[var(--color-ink)] leading-relaxed">
              {post.caption || <span className="text-[var(--color-ink-subtle)] italic">No caption</span>}
            </pre>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader title="Media" description={`${post.mediaR2Keys.length} item${post.mediaR2Keys.length === 1 ? "" : "s"}`} />
            <ul className="space-y-1.5">
              {post.mediaR2Keys.map((key, i) => (
                <li key={i} className="flex items-center gap-2 font-mono text-[12px] text-[var(--color-ink-muted)]">
                  <FileVideo className="w-3.5 h-3.5 shrink-0 text-[var(--color-ink-subtle)]" strokeWidth={2.25} />
                  <span className="truncate">{key}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Attempts */}
          <Card padding="none">
            <div className="px-6 pt-6">
              <CardHeader
                title="Delivery attempts"
                description={
                  attempts.length === 0
                    ? "No attempts yet. Worker fires at scheduled time."
                    : `${attempts.length} attempt${attempts.length === 1 ? "" : "s"} recorded.`
                }
              />
            </div>
            {attempts.length === 0 ? (
              <div className="px-6 pb-6 text-[13px] text-[var(--color-ink-subtle)]">
                The worker checks the queue once per minute. If the post is still
                queued past the scheduled time, check{" "}
                <code className="bg-[var(--color-canvas)] border border-[var(--color-border)] rounded px-1">
                  ~/cron-logs/social-scheduler.log
                </code>{" "}
                on Dustin-PC.
              </div>
            ) : (
              <div className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                {attempts.map((a) => (
                  <AttemptRow key={a.id} attempt={a} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar — actions */}
        <div>
          <Card padding="md" className="sticky top-6 space-y-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
              Actions
            </div>
            {post.status === "queued" ? (
              <CancelButton teamSlug={slug} postId={post.id} />
            ) : (
              <p className="text-[12px] text-[var(--color-ink-subtle)]">
                {post.status === "processing"
                  ? "Worker is currently processing this post."
                  : post.status === "canceled"
                    ? "Already canceled."
                    : "Post is past its scheduled time — see attempts log below for outcomes."}
              </p>
            )}
            <div className="pt-3 border-t border-[var(--color-border)]">
              <Link
                href={`/${slug}/social/new`}
                className="block text-[12px] font-medium text-[var(--color-accent)] hover:underline"
              >
                + New post for {post.clientName}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3">
      <dt className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-muted)]">
        <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

function AttemptRow({
  attempt,
}: {
  attempt: {
    id: string;
    platform: string;
    attemptedAt: string;
    status: "success" | "failed";
    platformPostId: string | null;
    platformPostUrl: string | null;
    errorMessage: string | null;
  };
}) {
  const successColor = attempt.status === "success" ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-rose-700 bg-rose-50 border-rose-100";
  return (
    <div className="px-6 py-4 flex items-start gap-4">
      <div className="shrink-0 mt-0.5">
        <PlatformIcon platform={attempt.platform as never} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-medium text-[var(--color-ink)]">
            {getPlatformLabel(attempt.platform as never)}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium ${successColor}`}
          >
            {attempt.status}
          </span>
          <span className="text-[11px] text-[var(--color-ink-subtle)] font-mono">
            {formatLocal(attempt.attemptedAt)}
          </span>
        </div>
        {attempt.status === "success" && attempt.platformPostUrl && (
          <a
            href={attempt.platformPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[12px] text-[var(--color-accent)] hover:underline"
          >
            View on platform
            <ExternalLink className="w-3 h-3" strokeWidth={2.25} />
          </a>
        )}
        {attempt.status === "success" && attempt.platformPostId && !attempt.platformPostUrl && (
          <div className="mt-1 text-[11px] font-mono text-[var(--color-ink-subtle)]">
            id: {attempt.platformPostId}
          </div>
        )}
        {attempt.status === "failed" && attempt.errorMessage && (
          <pre className="mt-2 rounded-md bg-rose-50/50 border border-rose-100 px-3 py-2 text-[12px] text-rose-700 whitespace-pre-wrap break-words">
            {attempt.errorMessage}
          </pre>
        )}
      </div>
    </div>
  );
}

function truncate(s: string, n: number): string {
  if (!s) return "";
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function formatLocal(iso: string): string {
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
