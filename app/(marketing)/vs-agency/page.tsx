import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "vs-agency";
const TITLE =
  "Venti Scale vs a traditional marketing agency: side-by-side comparison";
const DESCRIPTION =
  "What you actually get with Venti Scale vs a typical marketing agency: cost, contract terms, who reviews work, transparency, output volume. Honest side-by-side, no gotchas.";

export const metadata = {
  title: `${TITLE} | Venti Scale`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/${SLUG}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const COMPARISONS = [
  {
    aspect: "Monthly cost",
    agency: "$3,000-$5,000",
    venti: "$1,500-$2,500 (mid-tier) or $2,500-$5,000 (full-service)",
    advantage: "venti",
    note: "AI replaces junior account-manager labor. 40-60% cost savings at comparable output.",
  },
  {
    aspect: "Contract length",
    agency: "6-12 month minimum",
    venti: "Month-to-month, cancel any time",
    advantage: "venti",
    note: "Long contracts exist because the service is afraid you'll leave. We're not.",
  },
  {
    aspect: "Onboarding time",
    agency: "3-4 weeks (discovery phase)",
    venti: "5 days from audit to live operations",
    advantage: "venti",
    note: "We start shipping day 4. Discovery happens in the audit form, not a 3-week workshop.",
  },
  {
    aspect: "Who reviews your work",
    agency: "Junior account manager + production team",
    venti: "Founder personally, every output, every time",
    advantage: "venti",
    note: "Always me, never a junior. The senior expertise is what you're paying for.",
  },
  {
    aspect: "Reporting cadence",
    agency: "Monthly PDF report (sometimes a slide deck)",
    venti: "Real-time portal showing every output as generated",
    advantage: "venti",
    note: "Monthly PDFs are dead. The portal updates the second something publishes.",
  },
  {
    aspect: "Communication",
    agency: "Email through account manager, 24-48 hour replies",
    venti: "Direct Slack with founder, same-day responses on weekdays",
    advantage: "venti",
    note: "No layer between you and decision-making.",
  },
  {
    aspect: "Strategy involvement",
    agency: "Quarterly strategy decks, junior staff handles daily decisions",
    venti: "Senior strategist (founder) makes daily calls, weekly async updates",
    advantage: "venti",
    note: "Your money goes to senior expertise, not project management overhead.",
  },
  {
    aspect: "Output volume per month",
    agency: "8-15 pieces (limited by junior staff capacity)",
    venti: "30-50 pieces (AI handles production, founder reviews quality)",
    advantage: "venti",
    note: "Same quality bar, 3-5x the volume.",
  },
  {
    aspect: "Cancellation process",
    agency: "Often requires 60-90 day notice + ETF for early termination",
    venti: "30-day notice, full data handover, no fees",
    advantage: "venti",
    note: "You leave with everything we built. Prompt library, customer data, integrations.",
  },
  {
    aspect: "Setup fees",
    agency: "$1,000-$3,000 one-time",
    venti: "Zero. Onboarding included in monthly rate.",
    advantage: "venti",
    note: "Hidden setup fees are a margin grab. We bundle them in.",
  },
  {
    aspect: "Best for revenue tier",
    agency: "Enterprise ($1M+/year) with complex multi-team campaigns",
    venti: "Founders $5K-$200K/month who want hands-off execution",
    advantage: "neutral",
    note: "Different stages need different services. Above $500K/month revenue, evaluate against enterprise agencies. Below that, we win.",
  },
  {
    aspect: "When agency wins",
    agency: "Large multi-channel campaigns ($100K+/month ad spend), heavy in-person production, complex stakeholder management",
    venti: "Small to mid-size brands wanting senior expertise without agency overhead",
    advantage: "agency",
    note: "Honest answer: agencies are still right at scale. We're not pretending otherwise.",
  },
];

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Vs Agency", item: `${SITE_URL}/${SLUG}` },
  ],
};

export default async function VsAgencyPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Link
          href="/"
          className="text-[13px] font-mono text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Back to home
        </Link>

        <div className="mt-8 mb-10">
          <Eyebrow>VENTI SCALE VS AGENCY</Eyebrow>
          <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
            Side-by-side: Venti Scale vs a traditional marketing agency
          </h1>
          <p className="text-[17px] text-white/65 leading-[1.55] max-w-[640px]">
            Honest comparison. We win on most dimensions. <em>We&apos;re not
            pretending agencies are obsolete</em> — they&apos;re still right
            at enterprise scale.
          </p>
        </div>

        <div className="prose-blog">
          <p>
            12 dimensions. Real answers. The dimensions where agencies still
            win, we name them.
          </p>

          <div className="mt-10 space-y-6">
            {COMPARISONS.map((c, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-md p-6"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-3">
                  {c.aspect}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">
                      Traditional agency
                    </div>
                    <div className="text-[15px] text-white/80 leading-[1.5]">
                      {c.agency}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 mb-1">
                      Venti Scale
                    </div>
                    <div
                      className={`text-[15px] leading-[1.5] ${
                        c.advantage === "venti"
                          ? "text-white font-medium"
                          : c.advantage === "agency"
                          ? "text-white/60"
                          : "text-white/80"
                      }`}
                    >
                      {c.venti}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06] text-[14px] text-white/55 italic leading-[1.5]">
                  {c.note}
                </div>
              </div>
            ))}
          </div>

          <h2>The TL;DR</h2>
          <p>
            We&apos;re cheaper, faster to onboard, more transparent, and
            easier to leave. We ship 3-5x more output at the same quality
            bar. The reason isn&apos;t magic. It&apos;s that AI replaces
            the junior account-management layer that agencies historically
            charged you for.
          </p>
          <p>
            <em>The senior strategist time is the same. The production
            layer changed.</em>
          </p>
          <p>
            We&apos;re NOT cheaper if you need: enterprise-scale ad spend
            management ($100K+/month), complex multi-stakeholder workflows,
            in-person production (commercial photo/video shoots), or
            compliance-heavy industries (healthcare, finance) where every
            piece of content needs legal review.
          </p>

          <h2>How to evaluate any alternative (including us)</h2>
          <p>
            5 questions filter out 90% of bad services:
          </p>
          <p>
            1. Can I see real-time output before signing?
          </p>
          <p>
            2. Is the contract month-to-month?
          </p>
          <p>
            3. Who reviews work before it ships and who do I talk to day-to-day?
          </p>
          <p>
            4. What&apos;s the cancellation process?
          </p>
          <p>
            5. Show me a case study with revenue numbers, not vanity metrics.
          </p>
          <p>
            We pass all 5 by design. Full framework + how to apply it:{" "}
            <Link href="/done-for-you-marketing-services">
              done-for-you marketing services
            </Link>
            .
          </p>

          <h2>Read the full comparison</h2>
          <p>
            <Link href="/marketing-agency-alternatives">
              5 marketing agency alternatives
            </Link>
            {" "}— including in-house, freelancers, AI tools alone, DFY services
            (us), and fractional CMO.{" "}
            <Link href="/blog/marketing-agency-vs-in-house">
              Marketing agency vs in-house: the math nobody shows you
            </Link>
            {" "}— full cost breakdown.{" "}
            <Link href="/ai-marketing-cost">
              AI marketing cost in 2026
            </Link>
            {" "}— pricing across 5 tiers.
          </p>

          <div className="blog-cta">
            <h3>Audit before you decide</h3>
            <p>
              60-90 seconds. I review every submission and email back a
              custom plan within 2 business days. The plan is yours to keep
              regardless of whether we work together.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
