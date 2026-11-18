import Link from "next/link";
import { headers } from "next/headers";
import { Check, Minus } from "lucide-react";
import { PlanBuilder } from "@/components/marketing/plan-builder";
import {
  BundleTable,
  ClosingCta,
  DashboardProof,
  MonthView,
  ServiceRows,
  Steps,
} from "@/components/marketing/sections";
import { FaqList, HOME_FAQ, faqJsonLd } from "@/components/marketing/faq";
import { BUNDLE_DISCOUNT, CURRENCY, SERVICES, SETUP_CAP, money } from "@/lib/pricing";

const SITE_URL = "https://www.ventiscale.com";

export const metadata = {
  alternates: { canonical: SITE_URL },
};

const OFFERS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Venti Scale marketing services",
  url: `${SITE_URL}/pricing`,
  itemListElement: SERVICES.map((s) => ({
    "@type": "Offer",
    name: s.name,
    description: s.outcome,
    price: s.monthly,
    priceCurrency: CURRENCY,
    url: `${SITE_URL}/pricing#${s.id}`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: s.monthly,
      priceCurrency: CURRENCY,
      unitText: s.perChannel ? "month per channel" : "month",
    },
  })),
};

const AGENCY_BILL = ["An office", "A sales team", "An account manager"];

export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFERS_JSONLD) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQ)) }}
      />

      {/* ─── Hero: their problem on the left, the price sheet on the right ─── */}
      <section>
        <div className="vs-container vs-hero pt-10 pb-16 lg:pt-20 lg:pb-28">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8">
            <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
              <h1 className="vs-h1">
                <span className="block">Your competitor isn&apos;t better than you.</span>
                <span className="block">They&apos;re just easier to find.</span>
              </h1>
              <p className="vs-lede mt-6">
                You&apos;re busy doing the actual work, so the marketing never gets done. I do it
                for you. SEO, social, email, ads and video for local businesses, shops and small
                online stores.
              </p>
            </div>

            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
              <PlanBuilder animate />
            </div>

            <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
              <ul className="grid gap-2.5 text-[16.5px] font-medium">
                {[
                  "No contract. Cancel any month.",
                  "First month refunded if you're not happy.",
                  "Run by one person, not passed to a junior.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 mt-[3px] text-leaf shrink-0" strokeWidth={2.6} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="services" className="vs-rule">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">Five things you can stop doing yourself.</h2>
            <p className="vs-lede mt-4">Take one or take all five. Tap any of them to see what&apos;s in it.</p>
          </div>
          <div className="mt-8 lg:mt-12">
            <ServiceRows />
          </div>
        </div>
      </section>

      {/* ─── Bundles ─── */}
      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">Take more than one and the price drops.</h2>
            <p className="vs-lede mt-4">
              Two services is {BUNDLE_DISCOUNT[2] * 100}% off the monthly. Three or more is{" "}
              {BUNDLE_DISCOUNT[3] * 100}% off, and setup is capped at {money(SETUP_CAP)}.
            </p>
          </div>
          <div className="mt-10 lg:mt-14">
            <BundleTable />
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">From this page to work going out, in about a week.</h2>
          </div>
          <div className="mt-10 lg:mt-14">
            <Steps />
          </div>

          <div className="mt-16 lg:mt-24 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h3 className="vs-h2" style={{ fontSize: "clamp(26px, 3vw, 36px)" }}>
                What a month looks like.
              </h3>
              <p className="vs-body mt-4">Each green mark is one piece of work going out.</p>
              <p className="mt-6">
                <Link href="/how-it-works" className="vs-link">
                  The full walkthrough, day by day
                </Link>
              </p>
            </div>
            <MonthView />
          </div>
        </div>
      </section>

      <DashboardProof />

      {/* ─── Why the price is what it is ─── */}
      <section>
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 lg:items-center">
            <div>
              <h2 className="vs-h2">Why it costs less than an agency.</h2>
              <p className="vs-body mt-4 text-[17.5px]">
                Software handles the drafting, scheduling and reporting, so there&apos;s no team to
                pay for.
              </p>
              <p className="mt-5">
                <Link href="/about" className="vs-link">
                  More about how I work
                </Link>
              </p>
            </div>

            <div className="vs-bill">
              <div>
                <h3 className="vs-h3">An agency bill pays for</h3>
                <ul className="vs-checks mt-4">
                  {AGENCY_BILL.map((line) => (
                    <li key={line} data-off="true">
                      <Minus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                  <li>
                    <Check className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                    <span>The person doing your work</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="vs-h3">Your bill here pays for</h3>
                <ul className="vs-checks mt-4">
                  <li>
                    <Check className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                    <span>The person doing your work</span>
                  </li>
                </ul>
                <p className="vs-small mt-4 text-[16px]">
                  That&apos;s me, Dustin Gilmour. When you email, I&apos;m the one who answers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">Questions before you start.</h2>
              <p className="vs-body mt-4">
                Something else on your mind? Email{" "}
                <a href="mailto:hello@ventiscale.com" className="vs-link">
                  hello@ventiscale.com
                </a>{" "}
                and I&apos;ll answer it myself.
              </p>
            </div>
            <FaqList items={HOME_FAQ} />
          </div>
        </div>
      </section>

      {/* id="audit" keeps the old in-article links landing somewhere useful */}
      <ClosingCta id="audit" />
    </>
  );
}
