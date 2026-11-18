import Link from "next/link";
import { headers } from "next/headers";
import { Check, Minus } from "lucide-react";
import { ClosingCta } from "@/components/marketing/sections";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { IndustryNumbers } from "@/components/marketing/industry-numbers";
import { SERVICE_NUMBERS } from "@/lib/industry-numbers";
import { SERVICE_PAGES } from "@/lib/service-pages";
import {
  BUNDLE_DISCOUNT,
  CURRENCY,
  SERVICES,
  money,
  planQuery,
  type Service,
  type ServiceId,
} from "@/lib/pricing";

const SITE_URL = "https://www.ventiscale.com";

export function serviceById(id: ServiceId): Service {
  return SERVICES.find((s) => s.id === id)!;
}

/** Price stays in the sentence so the search result answers "what does it cost". */
export function serviceDescription(id: ServiceId): string {
  const s = serviceById(id);
  const per = s.perChannel ? " per channel" : "";
  const what = s.short.startsWith("Meta") ? s.short : s.short.charAt(0).toLowerCase() + s.short.slice(1);
  return `${SERVICE_PAGES[id].lead}: ${what}. ${money(s.monthly)} a month${per}, no contract, every price on the page.`;
}

export function serviceMetadata(id: ServiceId) {
  const s = serviceById(id);
  const copy = SERVICE_PAGES[id];
  const url = `${SITE_URL}${s.href}`;
  const description = serviceDescription(id);
  return {
    title: { absolute: copy.title },
    description,
    alternates: { canonical: url },
    openGraph: { title: copy.h1, description, url, type: "website" as const },
  };
}

function perChannel(s: Service) {
  return s.perChannel ? " per channel" : "";
}

export async function ServicePage({ id }: { id: ServiceId }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const s = serviceById(id);
  const copy = SERVICE_PAGES[id];
  const startHref = `/start${planQuery([s.id])}`;
  const url = `${SITE_URL}${s.href}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name,
      serviceType: s.name,
      description: serviceDescription(id),
      url,
      areaServed: "Worldwide",
      provider: { "@type": "Organization", name: "Venti Scale", url: SITE_URL },
      offers: {
        "@type": "Offer",
        url,
        price: s.monthly,
        priceCurrency: CURRENCY,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: s.monthly,
          priceCurrency: CURRENCY,
          unitText: s.perChannel ? "month per channel" : "month",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
        { "@type": "ListItem", position: 3, name: s.name, item: url },
      ],
    },
    faqJsonLd(copy.faq),
  ];

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <section>
        <div className="vs-container pt-10 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-[46em]">
            <h1 className="vs-h1">{copy.h1}</h1>
            <p className="vs-lede mt-6">{copy.lede}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href={startHref} className="vs-btn">
                Start my plan
              </Link>
              <a href="#price" className="vs-btn-quiet">
                What it costs
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <h2 className="vs-h2">{copy.why.heading}</h2>
            <div className="grid gap-4 vs-body text-[17.5px]">
              {copy.why.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <IndustryNumbers items={SERVICE_NUMBERS[id]} />

      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <h2 className="vs-h2">{copy.work.heading}</h2>
            <ul className="vs-ledger list-none p-0 m-0">
              {copy.work.items.map((w) => (
                <li key={w.title} className="py-6 border-b border-line">
                  <h3 className="text-[19px] font-semibold leading-snug">{w.title}</h3>
                  <p className="vs-body mt-1.5">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">What a month looks like.</h2>
              <p className="vs-body mt-4">Each green mark is one piece of work going out.</p>
            </div>
            <figure className="vs-month">
              <div className="vs-month-head" aria-hidden="true">
                <span />
                {[1, 2, 3, 4].map((w) => (
                  <span key={w}>Week {w}</span>
                ))}
              </div>
              <div className="vs-month-row">
                <p className="vs-month-name">
                  {s.name}
                  <span className="vs-month-total">{s.monthTotal}</span>
                </p>
                {s.weeks.map((w, i) => (
                  <div key={i}>
                    <span className="vs-month-marks" aria-hidden="true">
                      {w.units === 0 ? (
                        <i className="vs-month-run" />
                      ) : (
                        Array.from({ length: w.units }).map((_, k) => <i key={k} />)
                      )}
                    </span>
                    <span className="sr-only">
                      Week {i + 1}: {w.label}
                    </span>
                  </div>
                ))}
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <h2 className="vs-h2">Is this right for you?</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-[19px] font-semibold mb-4">A good fit if</h3>
                <ul className="vs-checks">
                  {copy.fit.good.map((line) => (
                    <li key={line}>
                      <Check className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[19px] font-semibold mb-4">Not a fit if</h3>
                <ul className="vs-checks">
                  {copy.fit.bad.map((line) => (
                    <li key={line} data-off="true">
                      <Minus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="price">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">What it costs.</h2>
              <p className="vs-body mt-4">One flat price. No contract.</p>
            </div>
            <div>
              <p className="vs-num text-[44px] leading-none">
                <span className="vs-mark">{money(s.monthly)}</span>
                <span className="text-[17px] font-medium text-moss" style={{ fontFamily: "var(--font-vs-body)" }}>
                  {" "}
                  a month{perChannel(s)}
                </span>
              </p>
              <p className="vs-body mt-3">
                Plus {money(s.setup)} one-time setup{perChannel(s)}. {s.setupCovers}
              </p>
              <dl className="vs-row-facts" style={{ marginTop: 24 }}>
                <div>
                  <dt>I need from you</dt>
                  <dd>{s.needs}</dd>
                </div>
                <div>
                  <dt>Not included</dt>
                  <dd>{s.notIncluded}</dd>
                </div>
                <div>
                  <dt>Adding more</dt>
                  <dd>
                    Add a second service and your monthly total drops {BUNDLE_DISCOUNT[2] * 100}%. Three or
                    more, {BUNDLE_DISCOUNT[3] * 100}%.
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href={startHref} className="vs-btn">
                  Start my plan
                </Link>
                <Link href="/pricing" className="vs-btn-quiet">
                  See all pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">Questions people ask.</h2>
              <div className="mt-8">
                <h3 className="text-[17px] font-semibold mb-3">Worth reading</h3>
                <ul className="grid gap-2.5 list-none p-0 m-0">
                  {copy.reading.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="vs-link text-[16px]">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <FaqList items={copy.faq} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
