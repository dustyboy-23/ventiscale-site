import Link from "next/link";
import { headers } from "next/headers";
import { Check } from "lucide-react";
import { PlanBuilder } from "@/components/marketing/plan-builder";
import { BundleTable, ClosingCta, ServiceLedger, Steps } from "@/components/marketing/sections";
import { FaqList, HOME_FAQ, faqJsonLd } from "@/components/marketing/faq";
import { BUNDLE_DISCOUNT, CURRENCY, SERVICES } from "@/lib/pricing";

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
    description: s.blurb,
    price: s.monthly,
    priceCurrency: CURRENCY,
    url: `${SITE_URL}/pricing#${s.id}`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: s.monthly,
      priceCurrency: CURRENCY,
      unitText: "month",
    },
  })),
};

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

      {/* ─── Hero: the price sheet is the picture ─── */}
      <section>
        <div className="vs-container pt-10 pb-16 lg:pt-20 lg:pb-28">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8">
            <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
              <h1 className="vs-h1">
                <span className="block">Your marketing, handled.</span>
                <span className="block">The prices are right here.</span>
              </h1>
              <p className="vs-lede mt-6">
                SEO, social media, email, ads and video for small businesses. One setup fee, one
                flat monthly price, no contract. Tick what you want off your plate and see your
                total.
              </p>
            </div>

            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
              <PlanBuilder animate />
            </div>

            <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
              <ul className="grid gap-2.5 text-[16.5px] font-medium">
                {[
                  "Month to month. Cancel any time.",
                  "Every price published. No call to find out.",
                  "Run by one person, not passed to a junior.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 mt-[3px] text-leaf shrink-0" strokeWidth={2.6} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-7">
                <Link href="#services" className="vs-link">
                  See what&apos;s in each service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="services" className="vs-rule">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">Five things you can stop doing yourself.</h2>
            <p className="vs-lede mt-4">
              Take one or take all five. Each has a flat monthly price and a one-time setup fee.
              Here is exactly what you get for it.
            </p>
          </div>
          <div className="mt-10 lg:mt-14">
            <ServiceLedger />
          </div>
          <p className="vs-small mt-6">
            Want the fine print? Setup details and what I need from you are on the{" "}
            <Link href="/pricing" className="vs-link">
              pricing page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ─── Bundles ─── */}
      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="max-w-[44em]">
            <h2 className="vs-h2">Take more than one and the price drops.</h2>
            <p className="vs-lede mt-4">
              Two services is {BUNDLE_DISCOUNT[2] * 100}% off the monthly. Three or more is{" "}
              {BUNDLE_DISCOUNT[3] * 100}% off. These three bundles are the ones that make sense for
              most small businesses.
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
          <p className="mt-8">
            <Link href="/how-it-works" className="vs-link">
              The full walkthrough, day by day
            </Link>
          </p>
        </div>
      </section>

      {/* ─── Why the price is what it is + who runs it ─── */}
      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 className="vs-h2">Why it costs less than an agency.</h2>
              <div className="mt-6 grid gap-4 vs-body text-[17.5px]">
                <p>
                  An agency retainer pays for an office, a sales team, an account manager and the
                  person doing your work. You&apos;re covering four salaries to get one person&apos;s
                  output.
                </p>
                <p>
                  Here, software does the drafting, the scheduling and the reporting. I do the
                  thinking, the checking and the talking to you. That&apos;s the whole cost
                  structure, so that&apos;s the whole price.
                </p>
                <p>
                  It also means I only take on as many businesses as I can do properly.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/founder/dustin.webp"
                alt="Dustin Gilmour, founder of Venti Scale"
                width={600}
                height={600}
                loading="lazy"
                className="w-[168px] h-[168px] lg:w-[200px] lg:h-[200px] rounded-[22px] object-cover shrink-0"
              />
              <div>
                <h2 className="vs-h3">Hi, I&apos;m Dustin. I run every account.</h2>
                <div className="mt-3 grid gap-3 vs-body">
                  <p>
                    I started Venti Scale because small business owners kept telling me the same
                    story: a big monthly bill, a report nobody read, and no idea what was actually
                    done.
                  </p>
                  <p>
                    So the deal here is simple. You see the price before you talk to me. You see
                    the work as it goes out. When you email, I&apos;m the one who answers.
                  </p>
                </div>
                <p className="mt-4">
                  <Link href="/about" className="vs-link">
                    More about me
                  </Link>
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
              <h2 className="vs-h2">Questions people ask before they start.</h2>
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
