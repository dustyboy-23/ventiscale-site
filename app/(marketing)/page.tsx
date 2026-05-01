import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  PenLine,
  Megaphone,
  Search,
  BarChart3,
  Share2,
  Mail,
  Sparkles,
  Shield,
  Eye,
  UserCheck,
  Clock,
  Fingerprint,
  Cpu,
  Zap,
  HelpCircle,
  Plus,
} from "lucide-react";
import { AiWorkers } from "@/components/marketing/ai-workers";
import { AuditForm } from "@/components/marketing/audit-form";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { enterDemo } from "@/app/actions/demo";

export const metadata: Metadata = {
  title: "Fire your marketing agency. Keep the growth.",
  description:
    "Done-for-you marketing for ecommerce brands, run on AI. Content, email, ads, SEO and reports, built around your business. Watch it work in your live portal.",
  alternates: { canonical: "https://www.ventiscale.com" },
};

const PROCESS = [
  {
    n: "01",
    icon: Fingerprint,
    title: "You send your brand DNA",
    body: "Your voice, your tone, your audience, your goals. One onboarding form. Takes 15 minutes.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "We train your Custom AI",
    body: "We build you a custom AI trained on your brand, your products, and your competitors. One week to go live.",
  },
  {
    n: "03",
    icon: Zap,
    title: "It runs on autopilot",
    body: "Every day, your AI writes, posts, optimizes, reports. I personally review everything before it ships. You watch it happen in your portal.",
  },
];

const SERVICES = [
  {
    icon: PenLine,
    title: "Creative Writing",
    cadence: "1 / day",
    body: "One SEO-tuned blog post every day, written in your brand voice and auto-published to your website.",
  },
  {
    icon: Share2,
    title: "Social Media",
    cadence: "3 / day",
    body: "Three fresh posts across Instagram, Facebook, TikTok, and LinkedIn. Captions, hashtags, scheduled, replied-to.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    cadence: "2 / week",
    body: "Welcome flows, weekly broadcasts, cart abandonment. All written, designed, and sent to your list automatically.",
  },
  {
    icon: Megaphone,
    title: "Advertising",
    cadence: "Weekly refresh",
    body: "New ad creative and copy every week. A/B tested and optimized across Meta, Google, and TikTok.",
  },
  {
    icon: Search,
    title: "Research",
    cadence: "Daily scan",
    body: "Your competitors, keywords, and local rivals scanned every morning. Fresh insights posted to your portal.",
  },
  {
    icon: BarChart3,
    title: "Analyst",
    cadence: "Weekly report",
    body: "Every Monday you get a plain-English report of what shipped, what worked, and what is next. No PDF theater.",
  },
];

const TIMELINE = [
  {
    when: "Today",
    tag: "00:00",
    title: "Free audit + custom growth plan",
    body: "Drop your details in the form above. Our AI pulls your site, socials, ads, SEO, and competitors. I read the results personally and we send you a real growth plan built for your business. In your inbox the same day.",
  },
  {
    when: "Day 1-2",
    tag: "+24H",
    title: "You review. We talk only if you want.",
    body: "Read it, sit with it, reply with questions. If you want a quick call, we are around. If you want to just say yes and go, that works too. No sales calls forced on you.",
  },
  {
    when: "Day 5",
    tag: "GO LIVE",
    title: "Your portal goes live",
    body: "Your Custom AI is trained, your portal is built, and work starts shipping the same week. You log in and see every asset, every report, every dollar tracked in real time.",
  },
  {
    when: "Week 1+",
    tag: "ONGOING",
    title: "Daily work. Weekly reports. Direct Slack.",
    body: "Your AI writes, posts, optimizes, and monitors every day. I personally review and approve everything before it ships. You get a Slack channel with me directly. Same-day replies. Always me, never a junior. Month-to-month. Cancel any time.",
  },
];

const FAQ = [
  {
    q: "How is this different from a marketing agency?",
    a: "Agencies charge you retainer money to pay junior employees to run templates. We charge less, ship more, and everything is driven by a Custom AI trained specifically on your brand. You get a direct Slack channel with the founder, not an account manager. No meetings, no PDFs, no project managers, no upsells.",
  },
  {
    q: "Is this just ChatGPT with a logo on it?",
    a: "No. We train a Custom AI on your brand DNA, your products, your audience, your competitors, and your voice. It runs inside a full pipeline we have built that researches, writes, designs, schedules, posts, and reports. ChatGPT is a chat box. This is a running marketing team.",
  },
  {
    q: "What if the AI writes something off-brand or wrong?",
    a: "Nothing hits your channels until I personally review and approve it. Every blog post, every ad, every email, every caption. The AI does the volume, I do the taste and quality control. If something is off, it never ships.",
  },
  {
    q: "Why is there no pricing on the site?",
    a: "Because every business is different. A local plumber does not need what a SaaS startup needs. We audit your business first, then send you a plan built for exactly what you need and exactly what it costs. No tiers, no packages, no upsells.",
  },
  {
    q: "How fast will I see results?",
    a: "Your portal is live in 5 business days. Content, posts, and ads start shipping the same week. Real numbers (traffic, leads, revenue) usually show up in the first 30 to 60 days depending on your starting point. We tell you up front in the audit what to expect for your business.",
  },
  {
    q: "Can I cancel? Do I own my content?",
    a: "Month to month. Cancel any time, no contract, no termination fee. Everything produced for your business is yours. You keep every asset, every post, every piece of copy, forever.",
  },
  {
    q: "Do I need to learn any new tools?",
    a: "No. You already know how to check email and log into a website. That is the whole workflow. Your portal shows you everything in one place. If you want a Slack channel with the founder, we will set it up.",
  },
  {
    q: "Will I actually talk to a real person, or get handed off?",
    a: "You talk directly to the founder. One Slack channel, same-day replies during business hours. Never outsourced to juniors, never handed off to an account manager. Every message goes straight to me.",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const ASSURANCES = [
  {
    icon: UserCheck,
    title: "Every piece, human-approved",
    body: "The AI writes drafts. I personally read them, edit them, and approve them. Nothing hits your channels until I sign off.",
  },
  {
    icon: Eye,
    title: "You see everything, live",
    body: "No monthly PDFs. No quarterly reviews. Your portal shows every asset, every report, every dollar, the second it ships.",
  },
  {
    icon: Shield,
    title: "Custom per business, not templated",
    body: "We do not run the same playbook on every client. Your plan, your voice, your strategy, built for your business.",
  },
  {
    icon: Clock,
    title: "Same-day response, direct from the founder",
    body: "One Slack channel. One human. I answer every message myself, same day, during business hours.",
  },
];

export default async function MarketingHome() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      {/* ─────────────────────────────────────────────
          1. HERO
         ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Aurora glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="aurora aurora-1" style={{ top: "-10%", left: "10%" }} />
          <div className="aurora aurora-2" style={{ top: "20%", right: "-5%" }} />
          <div className="aurora aurora-3" style={{ top: "40%", left: "30%" }} />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none" />

        <div className="relative max-w-[1240px] mx-auto px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#10E39A] opacity-60 dot-pulse" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10E39A]" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                  Jarvis (AI) · Online
                </span>
              </div>

              <h1 className="font-display text-[46px] sm:text-[64px] lg:text-[82px] leading-[0.98] tracking-[-0.035em] text-white max-w-[14ch]">
                The AI marketing team that{" "}
                <span className="italic bg-gradient-to-r from-[#10E39A] via-[#5280FF] to-[#C8362B] bg-clip-text text-transparent">
                  never sleeps.
                </span>
              </h1>

              <p className="mt-8 text-[17px] lg:text-[19px] leading-[1.55] text-white/65 max-w-[560px]">
                Content, social, SEO, ads, and reports. Shipped daily by AI,
                reviewed by a human, visible in your live portal. Every business
                gets a custom plan.{" "}
                <span className="text-white">
                  Start with a free AI audit of your business.
                </span>
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <a href="#audit" className="btn-red">
                  <Sparkles className="w-[17px] h-[17px]" strokeWidth={2.25} />
                  Get my free AI audit
                  <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.25} />
                </a>
                <Link href="/login" className="btn-outline-dark">
                  Client login
                  <ArrowUpRight className="w-[17px] h-[17px]" strokeWidth={2.25} />
                </Link>
              </div>

              <p className="mt-6 text-[12px] font-mono uppercase tracking-[0.14em] text-white/55">
                Takes 60 seconds to submit · Plan in your inbox today · One quick call, no hard sell
              </p>
            </div>

            {/* Live AI workers grid */}
            <div className="relative">
              <AiWorkers />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. YOUR CUSTOM AI (teach the value prop)
         ───────────────────────────────────────────── */}
      <section
        id="services"
        className="relative border-t border-white/[0.06] bg-[#0A0B11]"
      >
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[780px] mb-16">
            <Eyebrow variant="accent">YOUR CUSTOM AI</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[56px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              One Custom AI.{" "}
              <span className="italic text-white/60">
                Trained on your brand. Running every day.
              </span>
            </h2>
            <p className="mt-6 text-[16px] lg:text-[18px] leading-[1.65] text-white/65 max-w-[680px]">
              This is not a template and it is not a tool you have to learn.
              You send us your brand DNA. Your voice, your audience, your
              goals. Then we build you a Custom AI trained specifically for
              your business. Then it runs on autopilot.{" "}
              <span className="text-white">
                Writing, posting, optimizing, reporting. Every single day.
              </span>
            </p>
          </div>

          {/* 3-step process strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.n}
                  className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent p-7"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#10E39A]/[0.08] border border-[#10E39A]/25 flex items-center justify-center">
                      <Icon
                        className="w-5 h-5 text-[#10E39A]"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="font-display text-[34px] leading-none text-white/12 tabular">
                      {step.n}
                    </div>
                  </div>
                  <h3 className="font-display text-[20px] text-white tracking-tight mb-2 leading-[1.25]">
                    {step.title}
                  </h3>
                  <p className="text-[13.5px] text-white/60 leading-[1.6]">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Sub-header for what the AI actually does */}
          <div className="max-w-[720px] mb-10">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/45 mb-3">
              WHAT YOUR AI SHIPS, EVERY DAY
            </div>
            <h3 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.02em] text-white">
              Six channels.{" "}
              <span className="italic text-white/60">Always-on.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="group relative bg-[#0A0B11] p-8 hover:bg-[#11131B] transition-colors"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#10E39A]/40 group-hover:bg-[#10E39A]/[0.05] transition-colors">
                      <Icon
                        className="w-5 h-5 text-white group-hover:text-[#10E39A] transition-colors"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="text-right">
                      <div className="font-display text-[22px] text-[#10E39A] leading-none tabular">
                        {s.cadence}
                      </div>
                      <div className="mt-1.5 flex items-center justify-end gap-1">
                        <Zap
                          className="w-[10px] h-[10px] text-white/40"
                          strokeWidth={2.5}
                        />
                        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/40">
                          on autopilot
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display text-[24px] text-white tracking-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[14px] text-white/60 leading-[1.65]">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. FREE AUDIT (primary capture)
         ───────────────────────────────────────────── */}
      <section
        id="audit"
        className="relative border-t border-white/[0.06] overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="aurora aurora-1" style={{ top: "10%", left: "-5%" }} />
          <div className="aurora aurora-2" style={{ top: "30%", right: "10%" }} />
        </div>
        <div className="relative max-w-[860px] mx-auto px-6 lg:px-10 py-28 sm:py-36">
          <div className="text-center mb-12">
            <Eyebrow variant="accent">FREE AI AUDIT</Eyebrow>
            <h2 className="font-display text-[40px] sm:text-[56px] lg:text-[68px] leading-[1.02] tracking-[-0.03em] text-white mt-5 mb-6">
              Tell us about your business.
              <br />
              <span className="italic">Get a custom plan today.</span>
            </h2>
            <p className="text-[16px] lg:text-[18px] text-white/65 leading-[1.6] max-w-[580px] mx-auto">
              Drop your details below. We run your business through the AI
              audit, write you a real growth plan, and send it to your inbox
              today. What we would do, how we would do it, and what it could
              look like for your business.
            </p>
          </div>

          <AuditForm variant="block" />

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[720px] mx-auto">
            {[
              { label: "60 seconds", body: "to submit" },
              { label: "Same day", body: "growth plan in your inbox" },
              { label: "Zero pressure", body: "one quick call, no contract, no hard sell" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center"
              >
                <div className="font-display text-[22px] text-white tracking-tight">
                  {item.label}
                </div>
                <div className="text-[12px] text-white/55 mt-1.5">
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. HOW IT WORKS (timeline)
         ───────────────────────────────────────────── */}
      <section
        id="how"
        className="relative border-t border-white/[0.06] bg-[#0A0B11]"
      >
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[780px] mb-16">
            <Eyebrow variant="accent">FROM TODAY TO LIVE</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[56px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              Your portal is live in five days.{" "}
              <span className="italic text-white/60">
                No discovery phase. No sales deck.
              </span>
            </h2>
            <p className="mt-6 text-[16px] lg:text-[18px] leading-[1.65] text-white/65 max-w-[680px]">
              Most agencies take three weeks just to onboard you. We have the
              whole pipeline automated, which means we go from cold audit to
              your portal running live in under a week.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-[980px]">
            {/* Vertical line */}
            <div className="absolute left-[18px] sm:left-[140px] top-2 bottom-2 w-px bg-gradient-to-b from-[#10E39A]/50 via-white/[0.08] to-white/[0.04]" />

            <div className="space-y-8 sm:space-y-10">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.when}
                  className="relative grid grid-cols-[48px_1fr] sm:grid-cols-[170px_1fr] gap-4 sm:gap-8 items-start"
                >
                  {/* Left: day label */}
                  <div className="pt-1">
                    <div className="hidden sm:block font-display text-[22px] text-white tracking-tight leading-none">
                      {item.when}
                    </div>
                    <div className="hidden sm:block font-mono text-[10px] tracking-[0.18em] uppercase text-[#10E39A] mt-2">
                      {item.tag}
                    </div>
                  </div>

                  {/* Node + card */}
                  <div className="relative">
                    {/* Node dot */}
                    <div className="absolute -left-[30px] sm:-left-[38px] top-6 w-4 h-4 rounded-full bg-[#0A0B11] border-2 border-[#10E39A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10E39A] dot-pulse" />
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent p-6 sm:p-8 hover:border-white/[0.14] transition-colors">
                      {/* Mobile day label (hidden on sm+) */}
                      <div className="sm:hidden mb-3 flex items-baseline gap-3">
                        <div className="font-display text-[18px] text-white tracking-tight leading-none">
                          {item.when}
                        </div>
                        <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#10E39A]">
                          {item.tag}
                        </div>
                      </div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display text-[22px] sm:text-[26px] text-white tracking-tight leading-[1.2]">
                          {item.title}
                        </h3>
                        <div
                          aria-hidden="true"
                          className="font-mono text-[11px] text-white/30 tabular shrink-0 pt-2"
                        >
                          0{i + 1}
                        </div>
                      </div>
                      <p className="text-[14.5px] text-white/65 leading-[1.65]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. PORTAL PREVIEW (dark CTA card)
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06]">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#11131B] via-[#0D0F16] to-[#07080C] relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="aurora aurora-1" style={{ top: "-20%", right: "-5%" }} />
            </div>
            <div className="relative p-10 lg:p-16">
              <div className="max-w-[620px]">
                <Eyebrow variant="accent">THE PORTAL</Eyebrow>
                <h2 className="font-display text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.025em] text-white mt-5 mb-5">
                  Every client gets a live portal.
                  <br />
                  <span className="italic text-white/60">
                    Analytics, reports and plans.
                  </span>
                </h2>
                <p className="text-[16px] text-white/65 leading-[1.65] mb-10">
                  Log in as a demo client and click around. See what the weekly
                  reports look like, how the file library feels, how the
                  dashboard numbers show up. No signup, no form. Go check it
                  out.
                </p>
                <form action={enterDemo}>
                  <button type="submit" className="btn-red">
                    Open the client portal
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          6. QUALITY / ASSURANCE STRIP
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] bg-[#0A0B11]">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[720px] mb-16">
            <Eyebrow variant="accent">THE PROMISE</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[56px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              AI handles the volume.{" "}
              <span className="italic text-white/60">
                A human handles the taste.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ASSURANCES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-7 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C8362B]/10 border border-[#C8362B]/25 flex items-center justify-center mb-5">
                    <Icon
                      className="w-4.5 h-4.5 text-[#E04A3E]"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="font-display text-[18px] text-white tracking-tight mb-2 leading-[1.3]">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/60 leading-[1.6]">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          7. FAQ
         ───────────────────────────────────────────── */}
      <section
        id="faq"
        className="relative border-t border-white/[0.06]"
      >
        <div className="max-w-[920px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[720px] mb-14">
            <Eyebrow variant="accent">QUESTIONS</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[56px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              The things{" "}
              <span className="italic text-white/60">
                everyone asks before signing up.
              </span>
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent divide-y divide-white/[0.06] overflow-hidden">
            {FAQ.map((item, i) => (
              <details
                key={item.q}
                className="group"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="list-none cursor-pointer px-6 sm:px-8 py-6 flex items-start justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <HelpCircle
                      className="w-[18px] h-[18px] text-[#10E39A] mt-[3px] shrink-0"
                      strokeWidth={2}
                    />
                    <h3 className="font-display text-[18px] sm:text-[20px] text-white tracking-tight leading-[1.35]">
                      {item.q}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/[0.12] flex items-center justify-center shrink-0 mt-[2px] group-open:bg-[#10E39A]/10 group-open:border-[#10E39A]/40 transition-colors">
                    <Plus
                      className="w-4 h-4 text-white/60 group-open:text-[#10E39A] transition-all group-open:rotate-45"
                      strokeWidth={2.25}
                    />
                  </div>
                </summary>
                <div className="px-6 sm:px-8 pb-7 pl-[58px] sm:pl-[66px] -mt-1">
                  <p className="text-[14.5px] text-white/65 leading-[1.7]">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-[13.5px] text-white/50">
              Still have a question?{" "}
              <a
                href="#audit"
                className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-[#10E39A] hover:text-[#10E39A] transition-colors"
              >
                Drop it in the audit form above
              </a>{" "}
              and we&apos;ll answer it personally when we send your plan.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          8. FINAL CTA
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="aurora aurora-1" style={{ top: "0%", left: "20%" }} />
          <div className="aurora aurora-2" style={{ top: "30%", right: "20%" }} />
        </div>
        <div className="relative max-w-[820px] mx-auto px-6 lg:px-10 py-32 sm:py-40 text-center">
          <Eyebrow variant="accent">READY?</Eyebrow>
          <h2 className="font-display text-[46px] sm:text-[72px] lg:text-[88px] leading-[0.98] tracking-[-0.035em] text-white mt-5 mb-6">
            See what AI can do{" "}
            <span className="italic bg-gradient-to-r from-[#10E39A] via-[#5280FF] to-[#C8362B] bg-clip-text text-transparent">
              for your business.
            </span>
          </h2>
          <p className="text-[16px] lg:text-[18px] text-white/65 leading-[1.65] max-w-[560px] mx-auto mb-12">
            Free AI audit. Custom growth plan built for your business. All in
            your inbox today. If it is not a fit, we will tell you, and you
            still keep the audit.
          </p>
          <div className="text-left">
            <AuditForm variant="block" />
          </div>
        </div>
      </section>
    </>
  );
}
