import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileSearch,
  Gauge,
  HelpCircle,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AuditForm } from "@/components/marketing/audit-form";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "seo";
const TITLE = "AI-Era SEO: rank on Google, get cited by ChatGPT | Venti Scale";
const DESCRIPTION =
  "AI Overviews cut clicks to the #1 Google result by 58%. We build search visibility for both worlds: Google rankings and AI citations. Start with a $95 AI Visibility Audit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/${SLUG}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const CTA_LABEL = "Get your $95 AI Visibility Audit";

const HOW_IT_WORKS = [
  {
    icon: FileSearch,
    title: "Built on evidence.",
    body: "Every article runs on a research library built for your business. Every number traces to a source or it doesn't ship. The structure that earns AI citations (direct answers, real statistics, named sources) is measured, not vibes.",
  },
  {
    icon: ShieldCheck,
    title: "Gated by a person.",
    body: "Nothing publishes without passing five mechanical quality gates and a named human editor. This is the exact step the deindexed content mills skip.",
  },
  {
    icon: Gauge,
    title: "Measured where you can't see.",
    body: "Monthly, we run your market's buying questions through ChatGPT, Perplexity and Google's AI surfaces and report whether you're in the answers. Most agencies can't show you this. We lead with it.",
  },
];

const PRICING = [
  {
    name: "Audit",
    price: "$95",
    cadence: "one-time",
    includes: [
      "Scored site audit out of 100",
      "The AI recommendation test",
      "Top 5 fixes ranked by impact",
    ],
    turnaround: "48 hours",
    featured: false,
  },
  {
    name: "Core",
    price: "$1,495",
    cadence: "/mo",
    includes: [
      "4 gated articles per month",
      "Full on-page + schema hygiene",
      "AI-citation tracking",
      "Monthly plain-English report",
    ],
    turnaround: "Month-to-month",
    featured: true,
  },
  {
    name: "Growth",
    price: "$2,495",
    cadence: "/mo",
    includes: [
      "8 articles per month",
      "Everything in Core",
      "Off-site citation building",
      "Content refresh program",
    ],
    turnaround: "Month-to-month",
    featured: false,
  },
];

const FAQ = [
  {
    q: "Does Google penalize AI content?",
    a: "No. Google's own policy is about quality, not authorship: content made primarily to manipulate rankings gets penalized, regardless of whether a human or an AI wrote it. Well-researched, reviewed, useful content is fine either way. The sites that get hit are the ones publishing unreviewed volume, not the ones using AI as a tool.",
  },
  {
    q: "What do I own?",
    a: "Everything. Your domain, your content, your analytics, your Search Console. All of it stays in accounts you control from day one. If you leave, you leave with everything. Nothing is held hostage in a platform you don't have access to.",
  },
  {
    q: "Why is this cheaper than agencies quoting $3-5k?",
    a: "AI-native production means the strategy and editorial layer (the part that actually matters) is done by a person, and the drafting and research volume is done by AI. You're not paying for a junior account manager, a PDF deck, or a quarterly business review. Same strategy, none of the vanity theater.",
  },
  {
    q: "Can you guarantee I'll be cited by ChatGPT?",
    a: "No, and anyone who guarantees that is lying to you. Nobody controls Google or the AI assistants. What we control: whether your content has the structure, evidence, and sourcing that these systems actually cite. We measure that every month and show you the number.",
  },
  {
    q: "What happens on the kickoff call?",
    a: "We walk through your $95 audit results together: your score, the AI recommendation test findings, and the top 5 fixes ranked by impact. If Core or Growth makes sense for where you're at, we scope it. If it doesn't, you keep the audit and we tell you straight.",
  },
  {
    q: "What if I already have a content person?",
    a: "The gate and the measurement work with them, not against them. We can run the AI-citation tracking and quality gate on content your existing writer produces, or run the full production pipeline alongside them. Either way, you get the visibility into what's actually landing in AI answers.",
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

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "AI-Era SEO", item: `${SITE_URL}/${SLUG}` },
  ],
};

export default async function SeoServicePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      {/* ─────────────────────────────────────────────
          1. HERO
         ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="aurora aurora-1" style={{ top: "-10%", left: "10%" }} />
          <div className="aurora aurora-2" style={{ top: "20%", right: "-5%" }} />
        </div>
        <div className="absolute inset-0 grid-overlay pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 text-center">
          <Eyebrow variant="accent">SEO FOR HOW PEOPLE ACTUALLY SEARCH NOW</Eyebrow>
          <h1 className="font-display text-[42px] sm:text-[62px] lg:text-[76px] leading-[1.0] tracking-[-0.035em] text-white mt-5 max-w-[16ch] mx-auto">
            Your customers stopped clicking.{" "}
            <span className="italic text-white/60">They started asking.</span>
          </h1>

          <p className="mt-8 text-[16px] lg:text-[18px] leading-[1.6] text-white/65 max-w-[680px] mx-auto">
            AI Overviews cut clicks to the #1 Google result by 58 percent
            last year. ChatGPT and Perplexity answer buying questions with
            recommendations, and if you&apos;re not in the answer, your
            competitor is. We build search visibility for both worlds:
            rankings on Google, citations in AI answers.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a href="#audit" className="btn-red">
              <Sparkles className="w-[17px] h-[17px]" strokeWidth={2.25} />
              {CTA_LABEL}
              <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.25} />
            </a>
            <p className="text-[12px] font-mono uppercase tracking-[0.14em] text-white/55">
              48-hour turnaround · Credited toward month one if you continue
            </p>
          </div>

          <p className="mt-6 text-[12px] text-white/40">
            Stat:{" "}
            <a
              href="https://ahrefs.com/blog/ai-overviews-study/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/25 underline-offset-4 hover:text-white/60 hover:decoration-white/50 transition-colors"
            >
              Ahrefs 300k-keyword AI Overviews study, Feb 2026
            </a>
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. PROOF PANEL (signature element)
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] bg-[#0A0B11]">
        <div className="max-w-[980px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent">
            {/*
              TODO(dusty): replace with the real, dated screenshot of an AI
              assistant answering a buying question in your market (per
              seo-engine/sales/service-page.md Section 2 signature element).
              Demo state should show OUR market: who ChatGPT recommends for
              "best AI marketing agency" today. Post-audit, each prospect
              sees theirs.
            */}
            <img
              src="/blog/seo-proof-panel.png"
              alt="A buying question typed into ChatGPT, with a competitor's name in the answer"
              className="w-full h-auto block border-b border-white/[0.08]"
            />
            <div className="p-7 sm:p-9">
              <p className="text-[15px] sm:text-[16px] leading-[1.6] text-white/70 max-w-[640px]">
                We ran your market&apos;s buying questions through the AI
                assistants your customers use.{" "}
                <span className="text-white">
                  This is what came back.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. WHAT BROKE
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06]">
        <div className="max-w-[820px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <Eyebrow variant="accent">WHAT BROKE</Eyebrow>
          <h2 className="font-display text-[34px] sm:text-[48px] leading-[1.08] tracking-[-0.025em] text-white mt-5 mb-10">
            Cheap AI content gets sites removed from Google.{" "}
            <span className="italic text-white/60">
              Doing nothing gets you removed from the conversation.
            </span>
          </h2>

          <div className="space-y-7 text-[15.5px] lg:text-[17px] leading-[1.7] text-white/70">
            <p>
              A startup published 1,800 unedited AI articles, hit 486,000
              monthly visits, then Google&apos;s manual action dropped them
              from 586k to 56k.{" "}
              <span className="text-white">
                Google doesn&apos;t penalize AI content. It penalizes
                unreviewed volume,
              </span>{" "}
              and the sites selling you $99/month &ldquo;AI SEO&rdquo; are
              building exactly that.
            </p>
            <p>
              Meanwhile, your buyers ask ChatGPT who to hire and it answers
              with someone. 94 percent of marketing leaders are increasing
              AI-search budgets this year. Only about 22 percent can even
              measure whether AI systems mention them.
            </p>
            <p>
              There&apos;s a third path, and it&apos;s not complicated.{" "}
              <span className="text-white">It&apos;s just disciplined.</span>
            </p>
          </div>

          <p className="mt-8 text-[12px] text-white/40">
            <a
              href="https://www.hubspot.com/state-of-marketing"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/25 underline-offset-4 hover:text-white/60 hover:decoration-white/50 transition-colors"
            >
              HubSpot / Decoder SEO-heist coverage
            </a>{" "}
            &middot;{" "}
            <a
              href="https://www.emarketer.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/25 underline-offset-4 hover:text-white/60 hover:decoration-white/50 transition-colors"
            >
              Conductor via eMarketer
            </a>
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. HOW IT WORKS
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] bg-[#0A0B11]">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[780px] mb-16">
            <Eyebrow variant="accent">HOW IT WORKS</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[54px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              AI speed.{" "}
              <span className="italic text-white/60">
                Human gate. Receipts.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent p-7"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#10E39A]/[0.08] border border-[#10E39A]/25 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-[#10E39A]" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-[20px] text-white tracking-tight mb-2 leading-[1.25]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-white/60 leading-[1.65]">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-14">
            <a href="#audit" className="btn-red">
              <Sparkles className="w-[17px] h-[17px]" strokeWidth={2.25} />
              {CTA_LABEL}
              <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. PRICING
         ───────────────────────────────────────────── */}
      <section id="pricing" className="relative border-t border-white/[0.06]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[720px] mb-14">
            <Eyebrow variant="accent">PRICING</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[54px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              Pricing.{" "}
              <span className="italic text-white/60">
                Public, monthly, no lock-in.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  tier.featured
                    ? "border-[#10E39A]/40 bg-gradient-to-b from-[#10E39A]/[0.08] to-transparent"
                    : "border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#10E39A] text-[#07080C] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold">
                    Most common
                  </div>
                )}
                <h3 className="font-display text-[22px] text-white tracking-tight mb-1">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="font-display text-[38px] text-white tracking-tight tabular">
                    {tier.price}
                  </span>
                  <span className="text-[13px] text-white/50">{tier.cadence}</span>
                </div>
                <ul className="space-y-3 mb-7 flex-1">
                  {tier.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <BadgeCheck
                        className="w-[16px] h-[16px] text-[#10E39A] mt-[2px] shrink-0"
                        strokeWidth={2}
                      />
                      <span className="text-[13.5px] text-white/70 leading-[1.5]">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 pt-5 border-t border-white/[0.06]">
                  {tier.turnaround}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-[720px] space-y-2.5 text-[13.5px] text-white/55 leading-[1.6]">
            <p>The $95 credits toward your first month.</p>
            <p>
              You own everything. Domain, content, analytics, Search
              Console. Always. Leaving takes an email.
            </p>
            <p>
              No guaranteed rankings, because nobody controls Google or
              ChatGPT. Anyone who guarantees rankings is lying to you. We
              guarantee the process, the gate, and the report.
            </p>
          </div>

          <div className="mt-10">
            <a href="#audit" className="btn-red">
              <Sparkles className="w-[17px] h-[17px]" strokeWidth={2.25} />
              {CTA_LABEL}
              <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          6. REPORT PREVIEW
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] bg-[#0A0B11]">
        <div className="max-w-[980px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[720px] mb-12">
            <Eyebrow variant="accent">THE REPORT</Eyebrow>
            <h2 className="font-display text-[34px] sm:text-[48px] leading-[1.08] tracking-[-0.025em] text-white mt-5">
              What the report{" "}
              <span className="italic text-white/60">looks like.</span>
            </h2>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent">
            {/*
              TODO(dusty): replace with a real, sanitized spread of a client
              audit + a monthly report page, per
              seo-engine/sales/service-page.md Section 6.
            */}
            <img
              src="/blog/seo-proof-panel.png"
              alt="A sanitized sample audit and monthly report page"
              className="w-full h-auto block border-b border-white/[0.08]"
            />
            <div className="p-7 sm:p-9">
              <p className="text-[15px] sm:text-[16px] leading-[1.6] text-white/70 max-w-[640px]">
                Clicks from Google. Leads. Whether AI assistants recommend
                you. What we shipped and what we changed.{" "}
                <span className="text-white">That&apos;s the whole report.</span>{" "}
                No ranking screenshots for keywords nobody searches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          7. HONEST EXPECTATIONS
         ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06]">
        <div className="max-w-[820px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <Eyebrow variant="accent">HOW LONG THIS TAKES, STRAIGHT</Eyebrow>
          <h2 className="font-display text-[34px] sm:text-[48px] leading-[1.08] tracking-[-0.025em] text-white mt-5 mb-8">
            No 30-day promises.{" "}
            <span className="italic text-white/60">Just the real timeline.</span>
          </h2>
          <div className="space-y-6 text-[15.5px] lg:text-[17px] leading-[1.7] text-white/70">
            <p>
              Google&apos;s own guidance says SEO shows benefit in 4 to 12
              months. Established sites often move in 1 to 4. We report
              leading indicators every month so you&apos;re never guessing,
              and if a piece isn&apos;t working we say so and change it.
            </p>
            <p>
              If you need results in 30 days, this isn&apos;t the service,
              and anyone who says otherwise is selling you the villain
              story above.
            </p>
          </div>
          <p className="mt-8 text-[12px] text-white/40">
            Stat:{" "}
            <a
              href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/25 underline-offset-4 hover:text-white/60 hover:decoration-white/50 transition-colors"
            >
              Google Search Central SEO starter guide
            </a>
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          8. FAQ
         ───────────────────────────────────────────── */}
      <section id="faq" className="relative border-t border-white/[0.06] bg-[#0A0B11]">
        <div className="max-w-[920px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
          <div className="max-w-[720px] mb-14">
            <Eyebrow variant="accent">QUESTIONS</Eyebrow>
            <h2 className="font-display text-[38px] sm:text-[54px] leading-[1.02] tracking-[-0.03em] text-white mt-5">
              The things{" "}
              <span className="italic text-white/60">
                everyone asks before starting.
              </span>
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent divide-y divide-white/[0.06] overflow-hidden">
            {FAQ.map((item, i) => (
              <details key={item.q} className="group" {...(i === 0 ? { open: true } : {})}>
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
                  <p className="text-[14.5px] text-white/65 leading-[1.7]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          9. CLOSE
         ───────────────────────────────────────────── */}
      <section id="audit" className="relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="aurora aurora-1" style={{ top: "0%", left: "20%" }} />
          <div className="aurora aurora-2" style={{ top: "30%", right: "20%" }} />
        </div>
        <div className="relative max-w-[860px] mx-auto px-6 lg:px-10 py-28 sm:py-36 text-center">
          <Eyebrow variant="accent">FIND OUT</Eyebrow>
          <h2 className="font-display text-[38px] sm:text-[56px] lg:text-[64px] leading-[1.02] tracking-[-0.03em] text-white mt-5 mb-6">
            Find out what the AI assistants say{" "}
            <span className="italic text-white/60">about your market.</span>
          </h2>
          <p className="text-[16px] lg:text-[18px] text-white/65 leading-[1.6] max-w-[520px] mx-auto mb-12">
            It costs $95 and takes two days.
          </p>

          <div className="text-left">
            <AuditForm variant="block" ctaLabel={CTA_LABEL} />
          </div>

          <p className="mt-8 text-[12px] font-mono uppercase tracking-[0.14em] text-white/45">
            Want the full-service breakdown first?{" "}
            <Link
              href="/services"
              className="text-white/70 underline decoration-white/25 underline-offset-4 hover:text-[#10E39A] hover:decoration-[#10E39A] transition-colors normal-case tracking-normal font-sans"
            >
              See all services
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
