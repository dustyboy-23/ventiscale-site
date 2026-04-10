import Link from "next/link";
import {
  Shield,
  Lock,
  KeyRound,
  Database,
  Eye,
  Trash2,
  Server,
  FileCheck,
  Mail,
} from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const PILLARS = [
  {
    icon: KeyRound,
    title: "Passwordless sign-in",
    body: "Magic-link authentication. Clients sign in with their work email and a one-time link sent to their inbox. No passwords to leak, reuse, or steal. Each link expires after one hour and can only be used once.",
  },
  {
    icon: Lock,
    title: "Encrypted in transit and at rest",
    body: "TLS 1.3 for every connection. Client data stored encrypted at rest using AES-256. Backups encrypted with the same standard. No client data is ever transmitted in plain text.",
  },
  {
    icon: Database,
    title: "Strict data isolation per client",
    body: "Each client workspace is fully isolated. Row-level security at the database layer guarantees one client cannot access another client's data, even if a misconfiguration occurred at the application layer.",
  },
  {
    icon: Eye,
    title: "We never sell or share data",
    body: "We do not sell your data. We do not share it with advertisers, data brokers, or third parties. No third-party trackers, no fingerprinting, no ad pixels.",
  },
  {
    icon: Server,
    title: "Trusted infrastructure",
    body: "The portal runs on Vercel (SOC 2 Type II, ISO 27001) with a Supabase Postgres database (SOC 2 Type II, HIPAA-ready). Both providers operate enterprise-grade infrastructure used by Fortune 500 companies.",
  },
  {
    icon: FileCheck,
    title: "Audit logs on every action",
    body: "Every login, every data view, every export is logged. If you ever need to know who saw what and when, the answer is in the logs. Logs are retained for 12 months.",
  },
  {
    icon: Trash2,
    title: "You own your data and you can delete it",
    body: "Your data is your data. At any time you can request a full export, or delete your account and all associated data within 30 days. We never hold your data hostage.",
  },
  {
    icon: Shield,
    title: "Responsible disclosure",
    body: "We welcome security researchers. If you discover a vulnerability, email security@ventiscale.com. We respond within 48 hours and work in good faith with reporters who follow responsible disclosure practices.",
  },
];

const FAQ = [
  {
    q: "Where is my data physically stored?",
    a: "Database: U.S. East (AWS us-east-1, via Supabase). Application: global edge network (Vercel). Backups: U.S.-only, encrypted. EU-region hosting available for clients with GDPR data-residency requirements on request.",
  },
  {
    q: "Who at Venti Scale can see my data?",
    a: "Only Dustin Gilmour (founder) and authorized engineers have administrative database access. All admin access is logged and reviewed. We do not access client data unless required for support and only with the client's permission.",
  },
  {
    q: "What happens if Venti Scale shuts down?",
    a: "You can export every byte of your data at any time in standard formats (CSV, JSON, PDF). If we ever shut down the service, we provide 90 days notice and full export tooling. There is no lock-in.",
  },
  {
    q: "Are you GDPR / CCPA compliant?",
    a: "Yes. We honor data subject requests including access, portability, correction, and deletion. We have a Data Processing Addendum (DPA) available for enterprise clients on request.",
  },
  {
    q: "Do you train AI models on my data?",
    a: "No. We never use client data to train AI models, ours or anyone else's. AI features inside the portal that do exist run on your data only at your request and only for your benefit.",
  },
  {
    q: "What if my email account is compromised?",
    a: "Magic links are tied to your email, so if your email is compromised, an attacker could potentially sign in. We strongly recommend two-factor authentication on your email account. Optional TOTP-based 2FA on the portal itself is on our roadmap.",
  },
];

export const metadata = {
  title: "Trust — Venti Scale",
  description:
    "How Venti Scale protects your data. Encrypted, isolated, never sold, and yours to delete at any time.",
};

export default function SecurityPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="max-w-[980px] mx-auto px-6 lg:px-10 pt-32 sm:pt-40 pb-20 text-center">
          <ScrollReveal>
            <div className="eyebrow mb-7">Security & Trust</div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h1 className="h-display text-[#1B1B1B] text-[44px] sm:text-[72px] lg:text-[88px]">
              Your data is <span className="italic">safe</span> here.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <p className="body-lede mt-8 max-w-[640px] mx-auto">
              Venti Scale is built for brands who care about how their data is handled. Encrypted,
              isolated, never sold, and yours to delete at any time.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative border-y border-[rgba(27,27,27,0.08)] bg-[#EFE8DC]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-24 sm:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(27,27,27,0.08)] border border-[rgba(27,27,27,0.08)] rounded-lg overflow-hidden">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <ScrollReveal key={p.title} delay={i * 50}>
                  <div className="bg-[#F6F1EA] p-8 h-full">
                    <Icon className="w-5 h-5 text-[#1B1B1B]" strokeWidth={1.75} />
                    <h3
                      className="text-[20px] text-[#1B1B1B] mt-5 tracking-tight"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-[14px] text-[#1B1B1B]/65 mt-2.5 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="relative">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="text-center mb-14">
            <ScrollReveal>
              <div className="eyebrow mb-5">The stack</div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <h2 className="h-section text-[#1B1B1B] text-[36px] sm:text-[52px]">
                Built on infrastructure <span className="italic">brands trust.</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[rgba(27,27,27,0.08)] border border-[rgba(27,27,27,0.08)] rounded-lg overflow-hidden">
            {[
              {
                name: "Vercel",
                role: "Hosting",
                detail: "SOC 2 Type II · ISO 27001 · Used by Stripe, OpenAI, Notion",
              },
              {
                name: "Supabase",
                role: "Database & Auth",
                detail: "SOC 2 Type II · HIPAA-ready · Postgres encrypted at rest",
              },
              {
                name: "Cloudflare",
                role: "Network edge",
                detail: "DDoS protection · TLS 1.3 · Bot filtering",
              },
            ].map((s, i) => (
              <ScrollReveal key={s.name} delay={i * 100}>
                <div className="bg-[#F6F1EA] p-8 h-full">
                  <div
                    className="text-[22px] text-[#1B1B1B]"
                    style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                  >
                    {s.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#1B1B1B]/55 uppercase tracking-[0.16em] mt-1.5">
                    {s.role}
                  </div>
                  <div className="text-[13px] text-[#1B1B1B]/60 mt-5 leading-relaxed">
                    {s.detail}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)] bg-[#EFE8DC]">
        <div className="max-w-[860px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="text-center mb-14">
            <ScrollReveal>
              <div className="eyebrow mb-5">Common questions</div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <h2 className="h-section text-[#1B1B1B] text-[36px] sm:text-[52px]">
                The questions <span className="italic">every brand asks us.</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 50}>
                <details className="group bg-[#FAF6EF] border border-[rgba(27,27,27,0.10)] rounded-lg overflow-hidden">
                  <summary className="cursor-pointer list-none px-7 py-6 flex items-center justify-between gap-4">
                    <h3
                      className="text-[16px] text-[#1B1B1B] tracking-tight"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                    >
                      {item.q}
                    </h3>
                    <div className="shrink-0 w-7 h-7 rounded-full border border-[rgba(27,27,27,0.20)] flex items-center justify-center transition-transform group-open:rotate-45">
                      <span className="text-[18px] text-[#1B1B1B] leading-none font-medium">
                        +
                      </span>
                    </div>
                  </summary>
                  <div className="px-7 pb-7 -mt-1">
                    <p className="text-[14px] text-[#1B1B1B]/70 leading-relaxed">{item.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)] bg-[#1B1B1B] text-[#F6F1EA]">
        <div className="max-w-[820px] mx-auto px-6 lg:px-10 py-28 sm:py-36 text-center">
          <ScrollReveal>
            <div className="w-12 h-12 rounded-full bg-[#F6F1EA]/10 flex items-center justify-center mx-auto mb-7">
              <Mail className="w-5 h-5 text-[#F6F1EA]" strokeWidth={1.75} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h2
              className="text-[34px] sm:text-[48px] tracking-[-0.025em] leading-[1.05]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 360 }}
            >
              Questions? Talk to us <span className="italic">directly.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <p className="text-[16px] text-[#F6F1EA]/65 mt-6 max-w-[520px] mx-auto leading-relaxed">
              For security questions, vulnerability reports, or to request our DPA, write to us. We
              answer within 48 hours.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={360}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:security@ventiscale.com" className="btn-arterial">
                security@ventiscale.com
              </a>
              <a
                href="mailto:hello@ventiscale.com"
                className="inline-flex items-center justify-center gap-2 border border-[#F6F1EA]/25 text-[#F6F1EA] text-[14px] font-semibold px-5 h-[52px] rounded-md hover:bg-[#F6F1EA]/5 transition-colors"
              >
                General inquiries
              </a>
            </div>
          </ScrollReveal>
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#F6F1EA]/35 mt-12">
            Last updated April 2026 ·{" "}
            <Link href="/" className="hover:text-[#F6F1EA]/65 transition-colors">
              ← Back home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
