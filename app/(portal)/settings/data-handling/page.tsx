import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import {
  Shield,
  Lock,
  KeyRound,
  Eye,
  LogOut,
  Mail,
  Database,
} from "lucide-react";
import { getPortalSession } from "@/lib/current-client";

const MAILTO_EXPORT =
  "mailto:dustin@ventiscale.com?subject=Export%20my%20data" +
  "&body=Hey%20Dusty%20%E2%80%94%20can%20you%20export%20my%20data%20and%20wipe%20my%20account%3F";

export default async function DataHandlingPage() {
  const session = await getPortalSession();
  const email = session?.mode === "real" ? session.userEmail : null;
  const clientName =
    session?.mode === "real"
      ? session.client.name
      : session?.mode === "demo"
        ? session.client.name
        : "your workspace";

  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="How your data is handled"
        description={`The plain-English version of how I keep ${clientName}'s data safe. No legal copy. No theatre.`}
      />

      <div className="space-y-4">
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                Your data lives in its own locked box
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Every table that holds your numbers (reports, content, metrics, activity log)
                has a rule baked in at the database layer that says &ldquo;this user only sees
                rows tied to this client.&rdquo; Nobody else who uses Venti Scale can see it.
                Even if I shipped buggy code tomorrow, the database itself would still block it.
                That&apos;s the actual safety net.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                No password to steal
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Sign-in is a one-time link to your inbox. Nothing to remember, nothing to leak.
                If somebody tried to break in, you&apos;d see a sign-in email you didn&apos;t request.
                Don&apos;t click it. That&apos;s the whole defense and it&apos;s a good one.
              </p>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                If your session ever expires and you&apos;re locked out, send me a quick note
                and I&apos;ll mint you a fresh link inside the hour.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                What you can see
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Your reports, your content drafts, your campaign history, your activity log,
                your brand assets in Drive. All of it scoped to your workspace and yours alone.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                What I can see
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                I have admin access to fix bugs and set things up. I don&apos;t sit reading
                your numbers for fun. My own dashboard shows me the same numbers yours does.
                No worker, no VA, no third party gets in. One human, one set of admin keys,
                and they live in one place.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                Where it lives
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Your data sits on Supabase (Postgres, the same database banks use) and the
                portal runs on Vercel. Both providers are SOC 2 compliant. Every connection
                is encrypted end-to-end. No data ever moves over plain HTTP.
              </p>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                I keep what I need and nothing more. No credit cards, no SSNs, no third-party
                ad trackers feeding your numbers somewhere else.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                If you want to leave
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                You take your data with you, I wipe the rest. Usually inside a day. No retention
                games, no &ldquo;you still owe us for three months,&rdquo; no support tickets.
                You decide you&apos;re out, you&apos;re out clean.
              </p>
              <Link
                href={MAILTO_EXPORT}
                className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Dusty to export and close
              </Link>
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-[var(--color-surface-muted)]">
          <p className="text-[12px] text-[var(--color-ink-subtle)] leading-relaxed">
            Want the technical version? Ask. I&apos;ll send the full security audit covering
            row-level security, SSRF protection, header policies, rate limiting, and the
            audit log of who reviewed what. Most clients don&apos;t need it. It&apos;s there
            if you do.
          </p>
          {email && (
            <p className="text-[11px] text-[var(--color-ink-subtle)] mt-2">
              Signed in as <span className="font-medium text-[var(--color-ink-muted)]">{email}</span>
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
