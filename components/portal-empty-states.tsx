import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import type { ClientRecord } from "@/lib/current-client";

export function RealClientEmptyState({ client }: { client: ClientRecord }) {
  return (
    <div className="max-w-[640px] mx-auto py-16">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-tight"
            style={{ backgroundColor: client.brandColor || "#0F1115" }}
          >
            {client.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-[0.08em]">
              {client.isAgency ? "Agency Workspace" : "Client Workspace"}
            </div>
            <div className="text-[18px] font-bold text-[var(--color-ink)] tracking-tight">
              {client.name}
            </div>
          </div>
        </div>

        <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)] leading-tight">
          You&apos;re in. Data sources are wiring up.
        </h1>
        <p className="text-[14px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
          Your workspace is live but the live data feeds (Meta Ads, Google Ads,
          Search Console, Shopify) haven&apos;t been connected yet. Once they
          are, KPIs, reports, campaigns and content drafts will populate
          automatically — no action needed on your end.
        </p>

        <div className="mt-6 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] px-4 py-3.5 flex items-start gap-3">
          <Sparkles
            className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5"
            strokeWidth={2.25}
          />
          <div className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
            Want to see what the dashboard looks like with real data flowing?
            Sign out and tour the live demo from the login page.
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/auth/signout"
            className="text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Sign out
          </Link>
          <span className="text-[var(--color-ink-subtle)]">·</span>
          <a
            href="mailto:hello@ventiscale.com"
            className="text-[13px] font-medium text-[var(--color-accent)] hover:underline"
          >
            Contact your Venti Scale operator
          </a>
        </div>
      </div>
    </div>
  );
}

export function OrphanEmptyState({ email }: { email: string }) {
  return (
    <div className="max-w-[540px] mx-auto py-16">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10 text-center">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
          <Mail className="w-5 h-5 text-[var(--color-ink-muted)]" strokeWidth={2} />
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          You&apos;re signed in, but no workspace yet
        </h1>
        <p className="text-[14px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
          <span className="text-[var(--color-ink)] font-medium">{email}</span>{" "}
          isn&apos;t linked to a client workspace. Reach out to your Venti
          Scale operator and we&apos;ll get you set up.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="mailto:hello@ventiscale.com"
            className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-black transition-colors"
          >
            Email hello@ventiscale.com
          </a>
          <Link
            href="/auth/signout"
            className="text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
