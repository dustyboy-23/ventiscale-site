import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import {
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
  "&body=Please%20export%20my%20data%20and%20close%20my%20account.";

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
        description={`How Venti Scale protects ${clientName}'s data. Written in plain English, not legalese.`}
      />

      <div className="space-y-4">

        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-tight">
                AES-256 encryption at rest
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                All client data stored in Venti Scale&apos;s database is encrypted with{" "}
                <strong>AES-256</strong>, the encryption standard certified by the US
                government for top-secret information. The same standard protects Apple
                iCloud backups, Signal communications, 1Password vaults, and Stripe&apos;s
                credit card transactions. If the underlying storage media were physically
                removed, the contents would be unreadable without the encryption keys.
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
                TLS 1.3 in transit
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Every connection between the client browser and the Venti Scale portal is
                secured with <strong>TLS 1.3</strong>, the current internet encryption
                standard used by major banks, Apple, Google, and government services. No
                portal traffic is permitted over plain HTTP. All session cookies are
                marked HttpOnly and Secure.
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
                Passwordless authentication
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Sign-in is performed via a one-time link sent to the user&apos;s registered
                email address. No passwords are stored, transmitted, or recoverable, because
                no password exists. This is the same authentication pattern used by Slack,
                Notion, and Substack. An unauthorized sign-in attempt would generate a
                sign-in email the user did not request; that email should be ignored and
                reported.
              </p>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                If a session expires and access is locked out, contact Venti Scale support
                and a new sign-in link will be issued promptly.
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
                Infrastructure providers
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Venti Scale operates on two providers, both audited annually and both
                publishing their security reports.
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-[var(--color-ink-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
                  <span>
                    <strong className="text-[var(--color-ink)]">Database — Supabase (PostgreSQL):</strong>{" "}
                    SOC 2 Type II compliant. PostgreSQL is the database used by Reddit,
                    Instagram, Spotify, and Apple. Daily encrypted backups with 7-day
                    point-in-time recovery.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">•</span>
                  <span>
                    <strong className="text-[var(--color-ink)]">Hosting — Vercel:</strong> SOC 2
                    Type II compliant. Vercel hosts Stripe&apos;s documentation, Notion&apos;s
                    site, Loom, and Hashicorp. Edge-network DDoS protection is enabled by
                    default.
                  </span>
                </li>
              </ul>
              <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 leading-relaxed">
                Venti Scale stores only what is required to operate the portal. No payment
                card data, no Social Security numbers, and no third-party advertising
                trackers are present in the client portal.
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
                Access controls
              </h3>
              <ul className="mt-1 space-y-2 text-[13px] text-[var(--color-ink-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0 min-w-[100px]">Client:</span>
                  <span>Reports, content drafts, campaign history, activity log, and brand assets are scoped to the client&apos;s workspace. No cross-client visibility is possible.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0 min-w-[100px]">Venti Scale:</span>
                  <span>A single authorized administrator holds production access for support, maintenance, and bug fixes. Administrative access is logged.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold shrink-0 min-w-[100px]">Third parties:</span>
                  <span>None. No contractors, virtual assistants, marketing analytics services, or external dashboards have access to client data.</span>
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
                Account closure and data export
              </h3>
              <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                Clients may request a complete data export and account closure at any time.
                Reports are delivered as PDF, content drafts as JSON, and brand assets
                remain in the client&apos;s Google Drive (where they have always resided).
                Following export, all Venti Scale-side data is permanently removed within
                24 hours. There are no retention requirements, cancellation fees, or
                support-ticket processes for closure.
              </p>
              <Link
                href={MAILTO_EXPORT}
                className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                Request data export and account closure
              </Link>
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-[var(--color-surface-muted)]">
          <p className="text-[12px] text-[var(--color-ink-subtle)] leading-relaxed">
            A full technical security audit is available on request, covering Postgres
            row-level security policies, SSRF protections, security headers, rate limiting,
            and the administrative review log.
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
