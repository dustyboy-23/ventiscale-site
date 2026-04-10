import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Mail,
  Calendar,
  Megaphone,
  Search,
  BarChart3,
  Compass,
  Check,
} from "lucide-react";
import { BrowserFrame } from "@/components/marketing/browser-frame";
import { DashboardMock } from "@/components/marketing/dashboard-mock";
import { AuditForm } from "@/components/marketing/audit-form";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const SERVICES = [
  {
    icon: Mail,
    title: "Email",
    outcome: "Welcome flows, abandoned-cart, monthly broadcasts.",
    metric: "30–45% of revenue, on average.",
  },
  {
    icon: Calendar,
    title: "Content",
    outcome: "On-brand posts going out daily across the channels that matter.",
    metric: "Written, designed, scheduled, monitored.",
  },
  {
    icon: Megaphone,
    title: "Ads",
    outcome: "Meta, Google, TikTok. Creative made in-house.",
    metric: "Tested weekly. Optimized until every dollar pulls.",
  },
  {
    icon: Search,
    title: "SEO",
    outcome: "Keyword strategy, technical fixes, optimized articles.",
    metric: "Free traffic that compounds.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    outcome: "Plain-English monthly recap. Real numbers, no slide deck theater.",
    metric: "Always one click away in the portal.",
  },
  {
    icon: Compass,
    title: "Strategy",
    outcome: "Direct line to me. The brain behind the system.",
    metric: "I run a few brands. Yours could be next.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Run your free audit.",
    body: "Drop your URL, get a real audit in your inbox in under a minute. If I can help your brand, I'll reach out. If I can't, I'll tell you and point you somewhere better.",
  },
  {
    n: "02",
    title: "I onboard your brand into the portal.",
    body: "One week. Brand voice, audience, goals, channels, history. The system learns your shop.",
  },
  {
    n: "03",
    title: "You watch the work happen.",
    body: "Every email, every post, every report appears in your portal the moment it's done. Cancel any time.",
  },
];

const FAQ = [
  {
    q: "Is this AI slop?",
    a: "No. The system writes drafts, I edit and approve everything. The AI is the lever; the taste is mine. If the work isn't on-brand, it doesn't ship.",
  },
  {
    q: "What if I don't like the work?",
    a: "Tell me. I rebuild it, re-train the system on the feedback, or refund the month. There's no contract holding you. Cancel any time.",
  },
  {
    q: "How is this only $1,500?",
    a: "Because the AI is doing the labor a junior team used to do. I'm not paying six salaries, so I'm not charging you for six salaries. The price reflects the math, not the legacy markup.",
  },
  {
    q: "Who actually runs my account — you or a model?",
    a: "Both. I architect it, set the strategy, approve the work. The model executes inside the system I built. You get my judgment with a junior team's throughput.",
  },
  {
    q: "What if I want to bring marketing back in-house?",
    a: "Easy. Export every asset, every email, every post, every brief. No lock-in. Your data is yours.",
  },
  {
    q: "How is this different from Designjoy or Penji-style services?",
    a: "Those are unlimited-design subscriptions. This is unlimited-marketing-execution. They make graphics; I run the channel. Different category, similar honesty about pricing.",
  },
];

export default function MarketingHome() {
  return (
    <>
      {/* ─────────────────────────────────────────────
          1. HERO
         ───────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24">
          <div className="hero-fade">
            <div className="eyebrow mb-7">Done-for-you marketing · for ecommerce brands</div>

            <h1 className="h-display text-[#1B1B1B] text-[44px] sm:text-[68px] lg:text-[88px] max-w-[14ch]">
              Fire your marketing agency.
              <br />
              <span className="italic">Keep the growth.</span>
            </h1>

            <p className="body-lede mt-8 max-w-[640px]">
              I run done-for-you marketing for ecommerce brands using AI. Content, email, ads,
              SEO, reports — handled. <span className="text-[#1B1B1B]">$1,500 a month, flat.</span>{" "}
              Watch it work in your portal.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <a href="#audit" className="btn-arterial">
                Run my audit
                <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
              </a>
              <a href="#work" className="btn-ghost">
                See the portal
              </a>
            </div>

            <p className="mt-6 text-[13px] text-[#1B1B1B]/55 font-medium">
              Currently running marketing for a small portfolio of DTC brands. Cancel any time. No
              contracts.
            </p>
          </div>

          {/* Hero product image */}
          <div id="work" className="mt-20 sm:mt-28">
            <ScrollReveal>
              <BrowserFrame url="ventiscale.com/portal/stoneline" shadow="xl" variant="cream">
                <DashboardMock />
              </BrowserFrame>
            </ScrollReveal>
            <p className="mt-5 text-center text-[11px] font-mono uppercase tracking-[0.16em] text-[#1B1B1B]/45">
              The actual portal. Real data. Yours after week one.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. THE AGENCY MATH (problem)
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)] bg-[#EFE8DC]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <div className="eyebrow mb-6">The agency math</div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h2 className="h-section text-[#1B1B1B] text-[40px] sm:text-[56px] lg:text-[68px]">
                  $5,000 a month <span className="italic">×</span> twelve months
                  <br />
                  <span className="italic">= sixty thousand dollars</span>
                  <br />
                  for what?
                </h2>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-5">
              <ScrollReveal delay={200}>
                <ul className="space-y-5 text-[16px] text-[#1B1B1B]/75 leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-[#1F3D2B] font-mono text-[12px] mt-1.5 shrink-0">×</span>
                    A junior strategist who learned your brand from a Notion doc.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1F3D2B] font-mono text-[12px] mt-1.5 shrink-0">×</span>
                    Three Slack channels, two stand-ups, one slow inbox.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1F3D2B] font-mono text-[12px] mt-1.5 shrink-0">×</span>
                    A monthly PDF that nobody on your team actually reads.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1F3D2B] font-mono text-[12px] mt-1.5 shrink-0">×</span>
                    Quarterly &ldquo;strategy reviews&rdquo; that produce a new slide deck.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1F3D2B] font-mono text-[12px] mt-1.5 shrink-0">×</span>
                    Three deliverables, late, every month, like clockwork.
                  </li>
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. THE SHIFT
         ───────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-[980px] mx-auto px-6 lg:px-10 py-32 sm:py-44 text-center">
          <ScrollReveal>
            <p className="h-section text-[#1B1B1B] text-[34px] sm:text-[48px] lg:text-[60px]">
              AI did to marketing
              <br />
              what calculators did to <span className="italic">bookkeeping.</span>
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-10 text-[16px] text-[#1B1B1B]/55 max-w-[520px] mx-auto leading-relaxed">
              The work that used to take a six-person team can now be run by one operator with the
              right system. I built the system. I&apos;d like to run it for your brand.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. WHAT YOU GET (services)
         ───────────────────────────────────────────── */}
      <section id="services" className="relative border-t border-[rgba(27,27,27,0.08)]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[680px] mb-16">
            <ScrollReveal>
              <div className="eyebrow mb-5">What you get</div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="h-section text-[#1B1B1B] text-[36px] sm:text-[52px]">
                Every channel <span className="italic">that moves the number,</span> handled.
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(27,27,27,0.08)] border border-[rgba(27,27,27,0.08)] rounded-lg overflow-hidden">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.title} delay={i * 60}>
                  <div className="bg-[#F6F1EA] p-8 h-full">
                    <Icon className="w-5 h-5 text-[#1B1B1B]" strokeWidth={1.75} />
                    <h3
                      className="text-[24px] text-[#1B1B1B] mt-5 tracking-tight"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[14px] text-[#1B1B1B]/70 mt-2 leading-relaxed">
                      {s.outcome}
                    </p>
                    <p className="text-[12px] text-[#1B1B1B]/45 mt-3 font-mono">{s.metric}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <a href="#audit" className="btn-arterial">
              Run my audit
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. THE PORTAL (proof of work)
         ───────────────────────────────────────────── */}
      <section className="relative bg-[#1B1B1B] text-[#F6F1EA]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[680px] mb-14">
            <ScrollReveal>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#F6F1EA]/55 mb-5">
                The portal
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2
                className="text-[36px] sm:text-[52px] tracking-[-0.025em] leading-[1.05]"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 360 }}
              >
                Everything I do for your brand{" "}
                <span className="italic">lives here.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="mt-6 text-[17px] text-[#F6F1EA]/65 leading-relaxed max-w-[580px]">
                You see the work the moment it&apos;s done. No status meeting. No screenshot
                roundup. No PDF. The portal is the deliverable.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={120}>
            <BrowserFrame url="ventiscale.com/portal/stoneline" shadow="xl" variant="cream">
              <DashboardMock />
            </BrowserFrame>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-[920px]">
            {[
              {
                k: "Live work, not weekly digests.",
                v: "Every email, post, ad, and report appears in your portal the second it ships.",
              },
              {
                k: "Real numbers, plain English.",
                v: "Revenue, orders, conversion. No vanity charts. No agency theater.",
              },
              {
                k: "Direct line to me.",
                v: "Comment on anything in the portal. I respond same day, every day.",
              },
            ].map((it) => (
              <div key={it.k}>
                <p
                  className="text-[18px] tracking-tight"
                  style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                >
                  {it.k}
                </p>
                <p className="text-[14px] text-[#F6F1EA]/60 mt-2 leading-relaxed">{it.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          6. HOW IT WORKS
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[680px] mb-16">
            <ScrollReveal>
              <div className="eyebrow mb-5">How it works</div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="h-section text-[#1B1B1B] text-[36px] sm:text-[52px]">
                Three steps. <span className="italic">No discovery phase,</span> no statement of work.
              </h2>
            </ScrollReveal>
          </div>

          <div className="space-y-px bg-[rgba(27,27,27,0.08)] border border-[rgba(27,27,27,0.08)] rounded-lg overflow-hidden">
            {STEPS.map((s) => (
              <ScrollReveal key={s.n}>
                <div className="bg-[#F6F1EA] p-8 sm:p-10 grid grid-cols-12 gap-6 items-baseline">
                  <div className="col-span-12 sm:col-span-2">
                    <div
                      className="text-[36px] text-[#1B1B1B]/30 tabular"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 300 }}
                    >
                      {s.n}
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-10">
                    <h3
                      className="text-[24px] sm:text-[28px] text-[#1B1B1B] tracking-tight"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[15px] text-[#1B1B1B]/65 mt-2 leading-relaxed max-w-[640px]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          7. FOUNDER
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)] bg-[#EFE8DC]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div className="aspect-[4/5] bg-[#1B1B1B] rounded-lg overflow-hidden relative">
                  <Image
                    src="/founder/dustin.png"
                    alt="Dustin Gilmour, founder of Venti Scale"
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-7">
              <ScrollReveal delay={100}>
                <div className="eyebrow mb-5">Who runs your account</div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <h2 className="h-section text-[#1B1B1B] text-[34px] sm:text-[44px]">
                  Hi. I&apos;m Dustin. <span className="italic">I run the system.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="mt-7 space-y-5 text-[16px] text-[#1B1B1B]/75 leading-relaxed max-w-[580px]">
                  <p>
                    I built Venti Scale because I was tired of watching ecommerce founders pay
                    agency rates for junior work, then get a slide deck instead of growth.
                  </p>
                  <p>
                    I run marketing for a small portfolio of brands using a system I tuned over the
                    last eighteen months. I&apos;d like to run yours too.
                  </p>
                  <p>
                    Here&apos;s how I think about it: marketing should be a flywheel that turns
                    on, then turns by itself. Your job is to build a brand worth marketing.
                    That&apos;s the work nobody can do for you. The rest, I can.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <div className="mt-9">
                  <a href="#audit" className="btn-arterial">
                    Run my audit
                    <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          8. PRICING
         ───────────────────────────────────────────── */}
      <section id="pricing" className="relative border-t border-[rgba(27,27,27,0.08)]">
        <div className="max-w-[820px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="text-center mb-14">
            <ScrollReveal>
              <div className="eyebrow mb-5">Pricing</div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="h-section text-[#1B1B1B] text-[36px] sm:text-[52px]">
                One price. <span className="italic">No surprises.</span>
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <div className="bg-[#FAF6EF] border border-[rgba(27,27,27,0.10)] rounded-lg p-10 sm:p-14">
              <div className="text-center">
                <div className="text-[14px] text-[#1B1B1B]/45 line-through">
                  Typical agency: $4,500–$8,000/mo + $5,000 setup
                </div>
                <div className="mt-5 flex items-baseline justify-center gap-2">
                  <span
                    className="text-[72px] sm:text-[96px] text-[#1B1B1B] leading-none tabular"
                    style={{ fontFamily: "Fraunces, serif", fontWeight: 360, letterSpacing: "-0.03em" }}
                  >
                    $1,500
                  </span>
                  <span className="text-[20px] text-[#1B1B1B]/55 font-medium">/month</span>
                </div>
                <div className="mt-3 text-[14px] text-[#1B1B1B]/65">
                  Flat. No setup. No retainer escalation.
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-[rgba(27,27,27,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
                {[
                  "Email marketing (flows + broadcasts)",
                  "Daily content across all channels",
                  "Paid ads (Meta, Google, TikTok)",
                  "SEO strategy + on-page + content",
                  "Monthly reports in plain English",
                  "Direct strategy line to me",
                  "Live portal access for your team",
                  "Cancel any time, export everything",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 text-[#1F3D2B] mt-1 shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-[14px] text-[#1B1B1B]/80">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <a href="#audit" className="btn-arterial">
                  Run my audit
                  <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                </a>
                <p className="mt-5 text-[12px] font-mono uppercase tracking-[0.14em] text-[#1B1B1B]/45">
                  Cancel any time · Your data is yours · No contracts
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          9. FAQ
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)] bg-[#EFE8DC]">
        <div className="max-w-[860px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="text-center mb-14">
            <ScrollReveal>
              <div className="eyebrow mb-5">Common questions</div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="h-section text-[#1B1B1B] text-[36px] sm:text-[52px]">
                The questions <span className="italic">every founder asks me.</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 50}>
                <details className="group bg-[#FAF6EF] border border-[rgba(27,27,27,0.10)] rounded-lg overflow-hidden">
                  <summary className="cursor-pointer list-none px-7 py-6 flex items-center justify-between gap-4">
                    <h3
                      className="text-[17px] text-[#1B1B1B] tracking-tight"
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
                    <p className="text-[15px] text-[#1B1B1B]/70 leading-relaxed max-w-[640px]">
                      {item.a}
                    </p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          10. SELF-SERVE AUDIT
         ───────────────────────────────────────────── */}
      <section id="audit" className="relative border-t border-[rgba(27,27,27,0.08)]">
        <div className="max-w-[820px] mx-auto px-6 lg:px-10 py-24 sm:py-32 text-center">
          <ScrollReveal>
            <div className="eyebrow mb-5">Or, see for yourself</div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="h-section text-[#1B1B1B] text-[34px] sm:text-[44px]">
              Drop your URL. Get a real audit{" "}
              <span className="italic">in under a minute.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="body-lede mt-7 max-w-[560px] mx-auto">
              Real data from your store. Run by the same system that runs my clients&apos; brands.
              No call, no follow-up, no spam.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10 max-w-[600px] mx-auto">
              <AuditForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          11. FINAL CTA
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-[rgba(27,27,27,0.08)] bg-[#1B1B1B] text-[#F6F1EA]">
        <div className="max-w-[980px] mx-auto px-6 lg:px-10 py-32 sm:py-44 text-center">
          <ScrollReveal>
            <h2
              className="text-[44px] sm:text-[68px] lg:text-[88px] tracking-[-0.03em] leading-[1.0]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 360 }}
            >
              Stop paying for slide decks.
              <br />
              <span className="italic">Start paying for marketing that runs.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-12">
              <a href="#audit" className="btn-arterial">
                Run my audit
                <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="mt-7 text-[12px] font-mono uppercase tracking-[0.14em] text-[#F6F1EA]/45">
              $1,500/mo · Cancel any time · No contracts
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
