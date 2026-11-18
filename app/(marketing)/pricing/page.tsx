import Link from "next/link";
import { headers } from "next/headers";
import { PlanBuilder } from "@/components/marketing/plan-builder";
import { BundleTable, ClosingCta, ServiceRows } from "@/components/marketing/sections";
import { FaqList, PRICING_FAQ, faqJsonLd } from "@/components/marketing/faq";
import { BUNDLE_DISCOUNT, SERVICES, money, quote } from "@/lib/pricing";

const SITE_URL = "https://www.ventiscale.com";
const from = Math.min(...SERVICES.map((s) => s.monthly));
const all = quote(SERVICES.map((s) => s.id));

export const metadata = {
  title: "Pricing",
  description: `Every Venti Scale price on one page. Done-for-you SEO, social media, email, ads and video editing from ${money(from)} a month. One-time setup, no contract.`,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Venti Scale pricing",
    description: `Done-for-you marketing from ${money(from)} a month. Flat prices, one-time setup, no contract.`,
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
};

// Third-party survey figures. Each was read at its source on 2026-11-17.
// If you change a number here, re-read the source first.
const MARKET = [
  {
    finding:
      "49% of agencies say their average monthly retainer is $1,000 to $5,000. Another 31% say $5,000 to $10,000.",
    source: "SparkToro, State of Digital Agencies 2025",
    href: "https://sparktoro.com/blog/where-agency-revenue-is-heading-fewer-big-retainers-more-mid-market-retainers-and-longer-engagements/",
  },
  {
    finding: "For SEO alone, agencies charge $3,209 a month on average. Freelancers charge $1,348.",
    source: "Ahrefs, survey of 439 SEO providers (updated August 2024)",
    href: "https://ahrefs.com/blog/seo-pricing/",
  },
  {
    finding:
      "The most common SEO retainer is $500 to $1,000 a month, and 64% of agencies offer one under $1,000.",
    source: "SE Ranking with Duda, 260 agencies (December 2024)",
    href: "https://seranking.com/blog/seo-pricing/",
  },
];

export default async function PricingPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PRICING_FAQ)) }}
      />

      <section>
        <div className="vs-container pt-10 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-16 lg:items-start">
            <div className="lg:pt-6">
              <h1 className="vs-h1">Every price, on one page.</h1>
              <p className="vs-lede mt-6">
                No &quot;contact us for pricing.&quot; Each service has a flat monthly price and a
                one-time setup fee. Build your plan and the total is the total.
              </p>

              <dl className="mt-9 grid gap-0 max-w-[30em]">
                {[
                  ["One service", "List price"],
                  ["Two services", `${BUNDLE_DISCOUNT[2] * 100}% off the monthly`],
                  ["Three or more", `${BUNDLE_DISCOUNT[3] * 100}% off the monthly`],
                  ["Ads", `${money(SERVICES.find((s) => s.id === "ads")!.monthly)} per channel`],
                  ["Setup fee", "Once per service"],
                  ["Contract", "None. Month to month"],
                ].map(([k, v]) => (
                  <div key={k} className="vs-leader-row py-2.5">
                    <dt className="font-semibold">{k}</dt>
                    <span className="vs-leader" aria-hidden="true" />
                    <dd className="text-moss">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <PlanBuilder title="Build your plan" />
          </div>
        </div>
      </section>

      <section id="services" className="vs-rule">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">What&apos;s in each service.</h2>
            <p className="vs-lede mt-4">Tap any of them to see the details.</p>
          </div>
          <div className="mt-8 lg:mt-12">
            <ServiceRows withPrice />
          </div>
        </div>
      </section>

      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">Ready-made bundles.</h2>
            <p className="vs-lede mt-4">
              The same services at the same prices, with the bundle discount already taken off.
              All five together, with one ad channel, come to {money(all.monthly)} a month.
            </p>
          </div>
          <div className="mt-10 lg:mt-14">
            <BundleTable />
          </div>
        </div>
      </section>

      <section>
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">How this compares.</h2>
              <p className="vs-body mt-4">
                These are published surveys of what agencies say they charge. Scope is different
                from one agency to the next, so read them as a ballpark, not a like-for-like price.
              </p>
            </div>
            <div>
              <ul className="vs-ledger list-none p-0 m-0">
                {MARKET.map((m) => (
                  <li key={m.href} className="py-6 border-b border-line">
                    <p className="text-[18.5px] leading-[1.45] font-medium">{m.finding}</p>
                    <p className="vs-small mt-2">
                      Source:{" "}
                      <a href={m.href} target="_blank" rel="noopener noreferrer" className="vs-link font-medium">
                        {m.source}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              <p className="vs-body mt-6">
                Here, SEO with four articles a month is{" "}
                <strong className="text-evergreen">{money(SERVICES[0].monthly)}</strong>, and all
                five services together, with one ad channel, are{" "}
                <strong className="text-evergreen">{money(all.monthly)}</strong> a month.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">Billing questions.</h2>
              <p className="vs-body mt-4">
                How the work itself runs is on the{" "}
                <Link href="/how-it-works" className="vs-link">
                  how it works
                </Link>{" "}
                page.
              </p>
            </div>
            <FaqList items={PRICING_FAQ} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
