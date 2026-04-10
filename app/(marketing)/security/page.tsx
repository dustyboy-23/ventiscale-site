import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = {
  title: "Trust | Venti Scale",
  description:
    "How Venti Scale protects your data. Encrypted, isolated, never sold, and yours to delete at any time.",
};

export default function SecurityPage() {
  return (
    <article className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <Eyebrow>SECURITY & TRUST</Eyebrow>
      <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-3">
        How we protect your data
      </h1>
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/45 mb-12">
        Last updated: 2026-04-10
      </p>

      <div className="prose-legal">
        <p>
          We take security seriously. Venti Scale is built for brands that care
          about how their data is handled, stored, and accessed. This page
          explains the concrete steps we take to keep your data safe, who can
          see it, where it lives, and how you can get it out of our system at
          any time.
        </p>

        <h2>1. Data encryption</h2>
        <p>
          Every connection to the Venti Scale website and client portal uses
          TLS 1.3. No client data is ever transmitted in plain text. At rest,
          your data is encrypted using AES-256 inside our database and storage
          layers. Database backups are encrypted with the same standard.
        </p>

        <h2>2. Access control</h2>
        <p>
          Each client workspace is fully isolated. Row-level security at the
          database layer guarantees that one client cannot access another
          client&apos;s data, even if a misconfiguration happened at the
          application layer. Inside your organization, you control who gets
          invited and what they can see.
        </p>
        <p>
          On our side, only Dustin Gilmour (founder) and authorized engineers
          have administrative database access. All admin access is logged and
          reviewed. We do not access client data unless required for support,
          and only with the client&apos;s permission.
        </p>

        <h2>3. Infrastructure</h2>
        <p>
          The Venti Scale portal runs on infrastructure used by Fortune 500
          companies:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong> hosts the website and application. Vercel
            is SOC 2 Type II and ISO 27001 certified.
          </li>
          <li>
            <strong>Supabase</strong> provides our Postgres database,
            authentication, and file storage. Supabase is SOC 2 Type II and
            HIPAA-ready.
          </li>
          <li>
            Network traffic is protected with DDoS filtering and bot
            mitigation at the edge.
          </li>
        </ul>

        <h2>4. Data ownership</h2>
        <p>
          Your data is your data. At any time you can request a full export of
          everything inside your workspace in standard formats (CSV, JSON,
          PDF). You can also request deletion of your account and all
          associated data, which we process within 30 days. There is no
          lock-in, and we never hold your data hostage.
        </p>
        <p>
          We do not sell your data. We do not share it with advertisers, data
          brokers, or third parties beyond the service providers we need to
          run the platform (Vercel, Supabase, Google Workspace). We do not use
          client data to train AI models, ours or anyone else&apos;s.
        </p>

        <h2>5. Incident response</h2>
        <p>
          If we ever detect a security incident that affects your data, we
          follow a documented response plan:
        </p>
        <ul>
          <li>Contain the incident and stop ongoing access</li>
          <li>Investigate the scope and the affected data</li>
          <li>
            Notify affected clients directly by email within 72 hours of
            confirming an incident
          </li>
          <li>Provide a plain-English writeup of what happened and what we are doing about it</li>
          <li>Patch the underlying cause and document the fix</li>
        </ul>
        <p>
          Security researchers are welcome. If you discover a vulnerability,
          email <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>{" "}
          with details. We respond within 48 hours and work in good faith with
          reporters who follow responsible disclosure practices.
        </p>

        <h2>6. Contact</h2>
        <p>
          Questions about security, our data handling, or to request our Data
          Processing Addendum (DPA): email{" "}
          <a href="mailto:hello@ventiscale.com">hello@ventiscale.com</a>. We
          answer within 48 hours.
        </p>
      </div>
    </article>
  );
}
