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
  Server,
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
              <Lock className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                AES-256 encryption, the same lock the government uses
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Every piece of data sitting in the database is encrypted with <strong>AES-256</strong>.
                That is the exact encryption standard the US government certifies for top-secret
                files. It is what protects your Apple iCloud backups, your Signal messages, your
                1Password vault, and every credit card transaction Stripe processes. If somebody
                stole the physical hard drive your data lives on, it would be unreadable noise.
              </p>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                Translation: the lock on your data is the same one banks, hospitals, and the
                Pentagon use. Not a scaled-down version. The actual one.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                TLS 1.3 in transit, no plain HTTP, anywhere
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Every connection between your browser and the portal is wrapped in <strong>TLS 1.3</strong>,
                the latest internet encryption standard. Same as your bank&apos;s website. Same as
                Apple, Google, your accountant&apos;s tax software. There is no path through this
                portal that is not encrypted end-to-end. If you saw the URL bar drop the lock icon,
                I&apos;d be paying attention. It does not.
              </p>
            </div>
          </div>
        </Card>

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
                Every table that holds your numbers (reports, content, metrics, activity log) has
                a rule baked into the database itself, called <strong>Row-Level Security</strong>.
                The rule says: this user only sees rows tied to this client. Nobody else who uses
                Venti Scale can see yours. Even if I wrote a bug tomorrow, the database itself
                would still block the request. The app layer is one fence, the database layer is
                a second fence. Both have to fail at the same time for anything to leak.
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
                Sign-in is a one-time link sent to your inbox. You click, you are in. There is
                no password stored anywhere because there is no password to store. Same pattern
                as Slack, Notion, and Substack use. If somebody tried to break in, you would
                see a sign-in email you did not request. Do not click it. That is the whole
                defense and it is a good one.
              </p>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                If your session ever expires and you are locked out, send me a quick note and
                I will mint you a fresh link inside the hour.
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
                Where it actually lives
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Two providers run this thing. Both audited every year, both publish their security
                reports.
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-ink-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
                  <span>
                    <strong className="text-[var(--color-ink)]">Database — Supabase (Postgres):</strong>{" "}
                    SOC 2 Type II audited. Postgres is the same database Reddit, Instagram, Spotify,
                    and Apple run on. Daily encrypted backups, 7-day point-in-time recovery.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
                  <span>
                    <strong className="text-[var(--color-ink)]">Hosting — Vercel:</strong> SOC 2
                    Type II audited. The same platform that runs Stripe&apos;s docs, Notion&apos;s
                    site, Loom, and Hashicorp. DDoS protection at the edge.
                  </span>
                </li>
              </ul>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                I keep what I need and nothing more. No credit cards stored, no SSNs, no
                third-party ad trackers feeding your numbers somewhere else.
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
                Who sees what
              </h3>
              <ul className="mt-1 space-y-2 text-[13px] text-[var(--color-ink-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">You:</span>
                  <span>Your reports, your content drafts, your campaign history, your activity log, your brand assets in Drive. Nothing else.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">Me:</span>
                  <span>I have admin access to fix bugs and ship work. I do not sit reading your numbers for fun. My own dashboard shows the same numbers yours does.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">Nobody else:</span>
                  <span>No worker, no VA, no third-party dashboard, no marketing analytics tool calls home with your data. One human, one set of admin keys, one place they live.</span>
                </li>
              </ul>
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
                You decide you are out, you are out clean. Your reports export as PDF, your
                content drafts as JSON, your assets stay in your Drive (they were always yours).
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
            Want the technical version? Ask. I will send the full security audit covering Postgres
            RLS policies, SSRF protections, security headers, rate limiting, and the audit log of
            who reviewed what. Most clients do not need it. It is there if you do.
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
