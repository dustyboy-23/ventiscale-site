import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Shopify analytics: the 7 numbers that actually matter (ignore the rest) | Venti Scale",
  description:
    "Your Shopify dashboard has dozens of metrics. Here are the 7 Shopify analytics numbers small stores actually track to make money decisions.",
  openGraph: {
    title:
      "Shopify analytics: the 7 numbers that actually matter (ignore the rest)",
    description:
      "Your Shopify dashboard has dozens of metrics. Here are the 7 Shopify analytics numbers small stores actually track to make money decisions.",
    url: "https://www.ventiscale.com/blog/shopify-analytics-what-to-track",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/shopify-analytics-numbers.jpg",
        width: 1200,
        height: 630,
        alt: "Shopify analytics dashboard on a laptop screen showing ecommerce data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title:
      "Shopify analytics: the 7 numbers that actually matter (ignore the rest)",
    description:
      "Your Shopify dashboard has dozens of metrics. Here are the 7 Shopify analytics numbers small stores actually track to make money decisions.",
    images: [
      "https://www.ventiscale.com/blog/shopify-analytics-numbers.jpg",
    ],
  },
};

const SLUG = "shopify-analytics-what-to-track";
const TITLE =
  "Shopify analytics: the 7 numbers that actually matter (ignore the rest)";
const DESCRIPTION =
  "Your Shopify dashboard has dozens of metrics. Here are the 7 Shopify analytics numbers small stores actually track to make money decisions.";
const DATE = "2026-05-01";
const IMAGE = "/blog/shopify-analytics-numbers.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "What's a good conversion rate for a Shopify store?",
    a: "The average Shopify store converts at 1.4–1.8%. The top 20% of stores hit 3.1–3.5%, and the top 10% reach 4.7–5.2%. If your overall rate is under 1%, fix your product page and checkout flow before spending more on traffic.",
  },
  {
    q: "What repeat purchase rate should a Shopify store aim for?",
    a: "The industry average is 27–30%. Below 20% means your retention is broken and fixing it will grow revenue faster than acquiring new customers. Consumable brands (supplements, skincare, pet food) should target 35–45% because of natural replenishment cycles.",
  },
  {
    q: "How do I calculate contribution margin for my Shopify store?",
    a: "Contribution margin equals revenue minus COGS minus all variable costs: shipping, payment processing (typically 2.5–3%), return costs, and customer acquisition costs. A healthy Shopify store runs 20–25% contribution margin after all those deductions. Below 15% means your unit economics are broken.",
  },
  {
    q: "What is MER and why does it matter more than ROAS?",
    a: "MER (Marketing Efficiency Ratio) is total revenue divided by total ad spend across all channels. Unlike platform ROAS, which double-counts attribution and inflates performance, MER uses your actual revenue. A blended MER of 3:1 or higher is the target for most Shopify stores. The 2026 benchmark is 2.87:1.",
  },
  {
    q: "Which Shopify analytics numbers matter most for a store under $10K/month?",
    a: "At under $10K/month, focus on three: conversion rate by source (which traffic actually buys), AOV (what to bundle or upsell), and revenue by channel (which channels are actually producing). The other four metrics matter more once you scale past $30K/month and have enough volume for the signals to be reliable.",
  },
];

export default async function Post() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      {/* Article schema */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: TITLE,
            description: DESCRIPTION,
            image: IMAGE_URL,
            author: {
              "@type": "Person",
              name: "Dustin Gilmour",
              url: "https://ventiscale.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Venti Scale",
              url: "https://ventiscale.com",
            },
            datePublished: DATE,
            dateModified: DATE,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://ventiscale.com/blog/${SLUG}`,
            },
          }),
        }}
      />

      {/* FAQ schema */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      {/* Breadcrumb schema */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://ventiscale.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://ventiscale.com/blog",
              },
              { "@type": "ListItem", position: 3, name: TITLE },
            ],
          }),
        }}
      />

      <article className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Link
          href="/blog"
          className="text-[13px] font-mono text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Back to blog
        </Link>

        <div className="mt-8 mb-10">
          <Eyebrow>ECOMMERCE / SHOPIFY ANALYTICS</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Shopify analytics: the 7 numbers that actually matter (ignore the
            rest)
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              May 1, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="blog-hero">
          <img
            src={IMAGE}
            alt="Shopify analytics dashboard on a laptop screen showing ecommerce metrics"
          />
        </div>

        <div className="prose-blog">
          <p>
            Your Shopify dashboard tracks dozens of metrics by default. Sessions,
            bounce rate, pages per session, top landing pages, returning customer
            rate, traffic by source, abandoned checkout rate. Most of them
            don&apos;t tell you whether your business is growing or dying.
          </p>
          <p>
            I&apos;ve reviewed analytics for a lot of Shopify stores. The ones
            that struggle aren&apos;t missing data. They&apos;re drowning in it.
            They track everything and act on nothing because there&apos;s no
            signal in the noise.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                The average Shopify store converts at 1.4&ndash;1.8%. Top 20%
                hit 3.1&ndash;3.5%. Know which sources are above and below your
                average.
              </li>
              <li>
                Repeat purchase rate under 20% means your retention is broken.
                Fix it before you spend more on ads.
              </li>
              <li>
                Contribution margin below 15% means no amount of traffic saves
                you. Fix unit economics first.
              </li>
              <li>
                Most small Shopify stores need 3 metrics, not 47. Scale up your
                dashboard as revenue grows.
              </li>
            </ul>
          </div>

          <p>
            For Shopify analytics for small stores, 7 numbers do 90% of the
            work: conversion rate by source, repeat purchase rate, AOV,
            contribution margin, CAC, revenue by channel, and MER. Everything
            else is context, not signal. Here&apos;s each one and what
            it&apos;s actually telling you.
          </p>

          <hr className="blog-divider" />

          <h2 id="conversion-rate">1. Conversion rate by source</h2>
          <p>
            Most founders look at overall conversion rate. That&apos;s the wrong
            number. The average Shopify store sits at 1.4&ndash;1.8%. Knowing
            you&apos;re at 1.6% tells you almost nothing about where to focus.
          </p>
          <p>
            Conversion rate <em>by source</em> tells you everything. Email
            traffic converts at 4.2% on average. SMS campaigns hit 5.1% during
            time-sensitive sends. Organic search runs 2&ndash;3%. Paid social
            varies from 0.5% to 3% depending on creative and audience match. If
            your email list converts at 4% and your Facebook ads convert at 0.8%,
            you should be investing in your email list, not your ad creative.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Top 10% of Shopify stores convert at 4.7&ndash;5.2%. They get
              there by doubling down on channels that already convert, not by
              spreading spend evenly. Find your best source and build there
              first. Then fix the others.
            </p>
          </div>

          <p>
            Where to find it: Shopify Analytics &rarr; Acquisition &rarr;
            Sessions by referrer, cross-referenced with orders. Or use a tool
            like{" "}
            <a
              href="https://www.triplewhale.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Triple Whale
            </a>{" "}
            for proper multi-touch attribution if you&apos;re running multiple
            paid channels.
          </p>

          <hr className="blog-divider" />

          <h2 id="repeat-purchase-rate">2. Repeat purchase rate</h2>
          <p>
            This is the number most small stores ignore until it&apos;s too late.
            Your repeat purchase rate tells you whether customers actually liked
            what they bought enough to come back. The industry average is
            27&ndash;30%. Under 20% and you have a retention problem, not a
            traffic problem.
          </p>
          <p>
            Consumable brands (supplements, skincare, pet food) should target
            35&ndash;45%. That&apos;s natural replenishment. If your supplement
            brand is sitting at 22%, your post-purchase experience is failing.
            Home goods and electronics can run 20&ndash;25% because purchase
            cycles are longer. Know your category benchmark before you judge the
            number.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Pouring ad spend into new customer acquisition when repeat rate is
              under 20%. A new customer costs 5&ndash;7x more to acquire than
              retaining an existing one. Fix your email flows and post-purchase
              experience first, then scale acquisition. The math behind{" "}
              <Link href="/blog/retention-vs-acquisition-ecommerce">
                retention vs acquisition for ecommerce
              </Link>{" "}
              makes this even clearer.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="average-order-value">3. Average order value (AOV)</h2>
          <p>
            The average Shopify AOV is $85&ndash;92. Top 20% of stores hit
            $120+. Desktop orders average $155 vs $112 on mobile. If
            you&apos;re sending paid traffic to mobile landing pages and revenue
            feels thin, that $43 gap per order is part of the answer.
          </p>
          <p>
            AOV is the simplest lever most stores underuse. A $10 increase in
            AOV on 500 orders a month is $5,000. You don&apos;t need more
            customers. You need smarter order structures. Bundles, free shipping
            thresholds, post-purchase upsells, complementary product
            recommendations at checkout.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$85&ndash;92</div>
              <div className="stat-label">Average Shopify AOV</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$120+</div>
              <div className="stat-label">Top 20% of Shopify stores</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$43</div>
              <div className="stat-label">Desktop vs mobile AOV gap</div>
            </div>
          </div>

          <p>
            The best AOV move for most small stores: set your free shipping
            threshold at 120&ndash;130% of your current AOV. If you average $70
            orders, put free shipping at $85. People add one more item to
            qualify. It works almost every time and costs you nothing to test.
          </p>

          <hr className="blog-divider" />

          <h2 id="contribution-margin">4. Contribution margin</h2>
          <p>
            This is the number most Shopify dashboards don&apos;t show you. And
            it&apos;s the most important one. Contribution margin equals revenue
            minus COGS minus all variable costs: shipping, payment processing
            (usually 2.5&ndash;3%), return costs, and customer acquisition
            costs.
          </p>
          <p>
            A healthy contribution margin is 20&ndash;25% after all of that.
            Below 15% and your unit economics are broken. You can&apos;t grow
            your way out of broken unit economics. Every new sale loses money
            faster. Below 10% means stopping paid acquisition entirely and
            fixing the cost structure before anything else.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Health and wellness brands average 47.66% gross margin, but often
              see contribution margin drop to 15&ndash;20% after CAC is
              factored in. The gap between gross margin and contribution margin
              is where your profit disappears. Most stores don&apos;t track
              both, which is why they think they&apos;re fine until they
              aren&apos;t.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="customer-acquisition-cost">
            5. Customer acquisition cost (CAC)
          </h2>
          <p>
            CAC is up 40&ndash;60% across DTC verticals since 2021. Fashion
            brands now average $90&ndash;120 per new customer. Beauty and
            skincare runs $90&ndash;130. Electronics can hit $100&ndash;377.
            These aren&apos;t bad numbers unless your AOV and margin
            don&apos;t support them.
          </p>
          <p>
            The formula: total acquisition spend (ads, influencers, referral
            programs) divided by new customers acquired that month. Track this
            monthly. If CAC is rising faster than AOV, your margins are
            compressing. If CAC is flat while repeat rate is rising, your LTV
            is improving. Those are the two outcomes you&apos;re managing.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">40&ndash;60%</div>
              <div className="stat-label">DTC CAC increase since 2021</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">5&ndash;7x</div>
              <div className="stat-label">
                Cost of new vs retained customer
              </div>
            </div>
          </div>

          <p>
            If CAC is rising month over month, paid ads aren&apos;t the problem.
            Your creative is. Or your landing page. Or your offer. Throwing more
            budget at rising CAC makes it worse. This is also why{" "}
            <Link href="/blog/ecommerce-email-marketing-flows">
              email automation flows
            </Link>{" "}
            matter so much: email drives repeat purchases with near-zero
            marginal CAC. Every repeat customer you get from email is CAC you
            didn&apos;t have to pay.
          </p>

          <hr className="blog-divider" />

          <h2 id="revenue-by-channel">6. Revenue by channel</h2>
          <p>
            You need to know what percentage of revenue comes from each channel:
            paid social, email, SMS, organic, direct, referral. Not sessions.
            Revenue. Sessions lie. A channel with 40% of your traffic that
            drives 8% of your revenue is a cost center, not an asset.
          </p>
          <p>
            Email delivers $36&ndash;79 ROI per dollar spent in 2026. SMS hits
            $71&ndash;79 per dollar. Meta paid social averages 1.86&ndash;2.19x
            ROAS platform-wide, down 4&ndash;10% year over year even with
            Advantage+ enabled. If email is under 15% of your revenue, you
            have untapped owned channel potential that&apos;s worth more than
            your next ad test.
          </p>
          <p>
            The healthy channel mix for a $30K+/month Shopify store: email at
            25&ndash;35% of revenue, paid social at 20&ndash;35%, organic at
            10&ndash;20%, SMS and direct rounding out the rest. Below $10K/month,
            focus on getting email above 20% before scaling paid. See{" "}
            <Link href="/blog/how-much-ecommerce-marketing-budget">
              how much to spend on ecommerce marketing by revenue tier
            </Link>{" "}
            for the allocation breakdown.
          </p>

          <hr className="blog-divider" />

          <h2 id="marketing-efficiency-ratio">
            7. Marketing efficiency ratio (MER)
          </h2>
          <p>
            ROAS tells you how one campaign performs in one platform&apos;s
            reporting. MER tells you whether your whole marketing operation is
            profitable. MER equals total revenue divided by total ad spend
            across all channels. A MER of 3:1 means every $1 you spend on
            marketing brings in $3 in revenue.
          </p>
          <p>
            The blended ROAS benchmark for 2026 is 2.87:1 across platforms,
            down from 3.2:1 in 2023. If your MER is below 2.5:1 and your
            margins are tight, paid acquisition isn&apos;t your growth path
            right now. Focus on conversion rate, AOV, and email revenue first.
            Get MER above 3:1 before scaling spend.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Trusting platform-reported ROAS as your profitability signal. Meta
              reports 3.4x. Google reports 4.1x. Add them together and
              it&apos;s more than your total revenue. Platforms take credit for
              every sale they touched, including ones that would have happened
              anyway. MER uses your actual revenue against your actual spend.
              That&apos;s the only number that doesn&apos;t lie.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>What founder-tier Shopify reporting actually looks like</h2>
          <p>
            These 7 numbers fit on one page. You don&apos;t need a 40-slide
            agency deck to understand your business. You need a weekly dashboard
            with: conversion rate by source, repeat purchase rate, AOV,
            contribution margin, CAC, revenue by channel, and MER. Review trends
            monthly. Act on the ones that are moving in the wrong direction.
          </p>
          <p>
            A solid{" "}
            <Link href="/shopify-marketing-strategy">
              Shopify marketing strategy
            </Link>{" "}
            starts with knowing these numbers cold. Once you do, the right
            moves are obvious. Conversion rate is the problem? Work on product
            pages and creative. Repeat rate is low? Build the email flows. CAC
            is rising while MER drops? Pause paid and fix the creative. The data
            tells you what to do if you&apos;re looking at the right data.
          </p>
          <p>
            I personally review these 7 numbers for every brand I work with
            before touching any marketing. It takes 20 minutes. It prevents
            months of wasted spend. Most stores that come to me have been running
            ads for 6 months without knowing their contribution margin. That
            number alone changes everything.
          </p>

          {/* FAQ */}
          <div className="blog-faq">
            <h2>Frequently asked questions</h2>
            {FAQ_DATA.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>

          {/* Author bio */}
          <BlogAuthorBio
            bioOverride="Founder of Venti Scale. I personally review Shopify analytics for every brand before building a marketing plan. These 7 numbers are the ones I check first, every time."
            lastUpdated={DATE}
          />

          {/* Related posts */}
          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/retention-vs-acquisition-ecommerce"
                className="blog-related-card"
              >
                <div className="related-title">
                  Retention vs acquisition: where ecommerce founders waste the
                  most money
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/ecommerce-email-marketing-flows"
                className="blog-related-card"
              >
                <div className="related-title">
                  Ecommerce email marketing: the 5 flows that print money on
                  autopilot
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="blog-cta">
            <h3>Want to see where your marketing stands?</h3>
            <p>
              Get a free AI-powered audit of your online presence. Takes 30
              seconds.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
