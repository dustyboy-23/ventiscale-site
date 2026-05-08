import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title:
    "How to actually evaluate marketing ROI for an ecommerce brand | Venti Scale",
  description:
    "ROAS lies. Here are the 4 numbers ecommerce founders need: MER, contribution margin, LTV:CAC, and payback period. Plus why most agencies hide them.",
  openGraph: {
    title: "How to actually evaluate marketing ROI for an ecommerce brand",
    description:
      "ROAS lies. Here are the 4 numbers ecommerce founders need: MER, contribution margin, LTV:CAC, and payback period. Plus why most agencies hide them.",
    url: "https://www.ventiscale.com/blog/how-to-evaluate-marketing-roi-ecommerce",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/marketing-roi-ecommerce.jpg",
        width: 1200,
        height: 630,
        alt: "Ecommerce marketing ROI analytics dashboard showing key performance metrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "How to actually evaluate marketing ROI for an ecommerce brand",
    description:
      "ROAS lies. Here are the 4 numbers ecommerce founders need: MER, contribution margin, LTV:CAC, and payback period. Plus why most agencies hide them.",
    images: ["https://www.ventiscale.com/blog/marketing-roi-ecommerce.jpg"],
  },
};

const SLUG = "how-to-evaluate-marketing-roi-ecommerce";
const TITLE = "How to actually evaluate marketing ROI for an ecommerce brand";
const DESCRIPTION =
  "ROAS lies. Here are the 4 numbers ecommerce founders need: MER, contribution margin, LTV:CAC, and payback period. Plus why most agencies hide them.";
const DATE = "2026-05-08";
const IMAGE = "/blog/marketing-roi-ecommerce.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "What is MER in ecommerce marketing?",
    a: "MER (Marketing Efficiency Ratio) is total revenue divided by total marketing spend across all channels. A healthy MER for ecommerce is 3:1 to 5:1, meaning every $1 you spend on marketing produces $3 to $5 in revenue. Unlike ROAS, MER captures all spend including your agency fee, tools, and every channel, so it cannot be inflated by optimizing one channel in isolation.",
  },
  {
    q: "What is a good ROAS for an ecommerce brand?",
    a: "A good ROAS for ecommerce paid social is 4:1 to 5:1. Google Shopping averages 5.17:1 for top performers. Meta Advantage+ campaigns seeded with Klaviyo segments reach 4.52:1 versus 1.86 to 2.19:1 for standard Meta campaigns. But ROAS alone does not tell you if you are profitable. You need MER and contribution margin to see the full picture.",
  },
  {
    q: "How do I calculate contribution margin for my ecommerce store?",
    a: "Contribution margin equals revenue minus COGS minus variable costs, divided by revenue. For most ecommerce brands, target 40 to 60% gross contribution margin. After all marketing spend, staying above 20 to 30% contribution margin is the floor for sustainable growth. Below that and you are subsidizing revenue with cash.",
  },
  {
    q: "What should the payback period be for an ecommerce brand?",
    a: "Payback period should be under 12 months for a sustainable DTC brand. Under 6 months is healthy and gives you flexibility to reinvest in growth. Over 18 months means you are betting on long-term retention that may not materialize, especially with blended DTC CAC now running $68 to $84 on average and up 40 to 60% since 2023.",
  },
  {
    q: "Why do agencies report ROAS instead of MER?",
    a: "Agencies report ROAS because it is easy to inflate by optimizing a single paid channel in isolation. A campaign showing 8x ROAS can still destroy your margin if the agency fee, retargeting budget, and email costs are not in the denominator. MER includes all spend including the agency's own fee, which is why most agencies do not volunteer it.",
  },
];

export default async function Post() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
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
          <Eyebrow>ECOMMERCE / ANALYTICS</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            How to actually evaluate marketing ROI for an ecommerce brand
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              May 8, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src={IMAGE}
            alt="Ecommerce marketing ROI analytics dashboard showing key performance metrics"
          />
        </div>

        <div className="prose-blog">
          <p>
            Your agency sends you a report. ROAS is 4.2x. Impressions are up 18%.
            Click-through rate is steady. The report looks clean. But your bank
            account doesn&apos;t reflect any of it.
          </p>
          <p>
            This is the most common trap in ecommerce marketing. The numbers
            agencies report and the numbers that determine whether your business is
            actually healthy are two completely different sets of numbers.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                ROAS is a channel metric, not a business metric. It tells you
                nothing about whether you&apos;re profitable.
              </li>
              <li>
                The four numbers that matter: MER (total revenue divided by total
                marketing spend), contribution margin, LTV:CAC ratio, and payback
                period.
              </li>
              <li>
                A healthy ecommerce MER is 3:1 to 5:1. Below 2.5:1 and you&apos;re
                likely subsidizing growth with cash.
              </li>
              <li>
                Agencies report ROAS because it&apos;s easy to inflate without moving
                your margin. MER includes their own fee in the denominator, which is
                why most don&apos;t offer it.
              </li>
            </ul>
          </div>

          <p>
            Evaluating marketing ROI for an ecommerce brand means tracking four
            numbers: MER (total revenue divided by total marketing spend),
            contribution margin after all variable costs, LTV:CAC ratio, and payback
            period. Any report that skips these and leads with ROAS is showing you a
            metric that can look great while your business quietly loses money.
          </p>

          <h2 id="roas">What ROAS actually measures (and where it breaks)</h2>
          <p>
            ROAS stands for Return on Ad Spend. It measures how much revenue was
            attributed to a specific paid channel. If you spent $5,000 on Meta ads
            and the platform attributed $20,000 in sales, your ROAS is 4x.
          </p>
          <p>
            The problem is attribution. Before that customer bought from your Meta
            ad, they probably clicked a Google Shopping result, opened three emails,
            and got retargeted on Instagram. Most attribution models give credit to
            the last click. Your email sequence that warmed them up for two weeks gets
            nothing. Your retargeting budget that pulled them back gets nothing. Meta
            gets the 4x ROAS.
          </p>
          <p>
            The real cost to acquire that customer included $30 in ads plus $10 in
            email platform costs plus $8 in retargeting. Your actual blended CAC
            might be $50 on a customer where Meta reports a $12.50 CAC. The channel
            ROAS looks right. The business math doesn&apos;t.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">12.88%</div>
              <div className="stat-label">Google CPC increase year-over-year</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">20%</div>
              <div className="stat-label">Meta CPM increase in 2025</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$68–84</div>
              <div className="stat-label">
                Average blended ecommerce CAC in 2026
              </div>
            </div>
          </div>

          <p>
            According to{" "}
            <a
              href="https://foundrycro.com/blog/ecommerce-marketing-benchmarks-2026/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Foundry CRO&apos;s 2026 ecommerce marketing benchmarks
            </a>
            , blended DTC CAC has risen 40 to 60% since 2023 across every major
            product category. Paid acquisition costs more every quarter. If you want
            to evaluate marketing ROI for ecommerce accurately, channel ROAS is the
            last place to start.
          </p>

          <hr className="blog-divider" />

          <h2 id="mer">
            Marketing Efficiency Ratio — the number agencies don&apos;t report
          </h2>
          <p>
            MER is the only metric that tells you if your marketing program is
            working as a whole.
          </p>
          <p>
            <strong>Formula: Total Revenue divided by Total Marketing Spend</strong>
          </p>
          <p>
            If you did $100,000 in revenue last month and spent $25,000 across all
            channels including ads, email platform, SMS platform, and agency fee,
            your MER is 4x. A healthy MER for most ecommerce brands sits between
            3:1 and 5:1. Below 2.5:1 means you&apos;re likely subsidizing growth
            with cash. Above 6:1 usually means you&apos;re underinvesting and
            leaving revenue on the table.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              MER strips attribution games entirely. You spent $25K and made $100K,
              so your MER is 4x. No model, no last-click bias, no
              platform-reported numbers. Just the actual math. Email ROI averages
              $36 to $79 per $1 spent. SMS averages $71 to $79 per $1. MER is the
              only metric that shows you if those channels are actually moving your
              business, not just the ones your agency manages.
            </p>
          </div>

          <p>
            Agencies don&apos;t volunteer MER because it puts their own fee in the
            denominator. A $5,000/month agency managing $20,000 in ad spend
            isn&apos;t reporting that your total marketing spend is $25,000.
            They&apos;re reporting on the $20,000 in ads. The ROAS looks better
            that way.
          </p>

          <hr className="blog-divider" />

          <h2 id="contribution-margin">
            Contribution margin — the metric that silences excuses
          </h2>
          <p>
            MER tells you marketing efficiency. Contribution margin tells you if
            you&apos;re actually making money.
          </p>
          <p>
            <strong>
              Contribution margin = (Revenue - COGS - Variable Costs) / Revenue
            </strong>
          </p>
          <p>
            For most ecommerce brands, target 40 to 60% gross contribution margin.
            After all marketing spend, staying above 20 to 30% is the floor for
            sustainable growth. Below that and you&apos;re subsidizing revenue with
            cash.
          </p>
          <p>
            Here&apos;s where founders get tricked. A 4x ROAS sounds like a win.
            But if your product margin is 50% and you&apos;re paying an agency plus
            running paid ads, your actual contribution margin after all marketing
            costs might be 12%. That&apos;s not growth. That&apos;s a cash flow
            trap that looks like traction in the monthly report.
          </p>
          <p>
            I&apos;ve reviewed reports where a founder was proud of a 5x ROAS and
            had no idea their net contribution margin after all costs was under 15%.
            They were buying revenue, not building a business.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Red flag</div>
            <p>
              If your agency reports ROAS and impressions but has never asked about
              your product margin, they don&apos;t know if you&apos;re profitable.
              Real marketing partners build campaigns around your margin. Vendors
              optimize for the metrics that make their work look good.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="payback">
            Payback period — the test that reveals if you&apos;re growing or just
            spending
          </h2>
          <p>
            <strong>Payback period = CAC divided by Monthly Margin Per Customer</strong>
          </p>
          <p>
            If it costs $84 to acquire a customer and they generate $14 per month in
            margin, your payback period is 6 months. Healthy. If your blended CAC is
            $120 and monthly margin per customer is $8, your payback is 15 months.
            That&apos;s a bet on retention you may never cash in.
          </p>
          <p>
            The benchmark: payback period under 12 months for a sustainable DTC
            brand. Under 6 months gives you real flexibility to scale. Over 18 months
            means you&apos;re growing on borrowed time. A 3:1 LTV:CAC ratio is the
            minimum floor for healthy unit economics.
          </p>
          <p>
            This is exactly why retention deserves its own budget line. I walked
            through the full LTV:CAC math in the{" "}
            <Link href="/blog/retention-vs-acquisition-ecommerce">
              retention vs acquisition breakdown for ecommerce founders
            </Link>
            . The short version: repeat customers spend 67% more per order and cost
            5x less to convert. Your payback period improves dramatically when
            you have a real retention engine running alongside acquisition.
          </p>

          <figure className="blog-image">
            <img
              src="/blog/ecommerce-analytics-dashboard.jpg"
              alt="Analytics dashboard showing MER, CAC, and contribution margin metrics for an ecommerce brand"
            />
            <figcaption>
              MER, contribution margin, and payback period tell a different story than
              ROAS alone — and the story is the one that actually matters.
            </figcaption>
          </figure>

          <hr className="blog-divider" />

          <h2 id="agency-reports">Why agency reports bury the real numbers</h2>
          <p>
            A typical agency report includes: ROAS, impressions, CPM, CPC, CTR,
            and attributed revenue. Sometimes conversion rate. Never MER. Never
            contribution margin. Never payback period.
          </p>
          <p>
            Some agencies genuinely don&apos;t know your product margin. That&apos;s
            its own problem. But some know exactly what they&apos;re doing. A Meta
            campaign can hit 6x ROAS by targeting high-intent audiences on low
            volume, cutting retargeting out of the denominator, and leaving the
            agency fee off the books. The number looks great. Your business might
            be losing money.
          </p>
          <p>
            What to demand from any marketing partner each month:
          </p>
          <ul>
            <li>
              Total marketing spend across all channels, including their fee
            </li>
            <li>
              MER for the month (you can calculate this yourself in two minutes from
              their numbers)
            </li>
            <li>New customer revenue versus repeat customer revenue, split out</li>
            <li>CAC by channel, not just blended ROAS</li>
            <li>Contribution margin after all marketing costs</li>
          </ul>
          <p>
            If an agency resists sharing these numbers or says they
            &quot;don&apos;t have access&quot; to your margin data, that&apos;s a
            red flag. It&apos;s the same pattern covered in the post on{" "}
            <Link href="/blog/marketing-agency-red-flags">
              marketing agency red flags every founder should recognize
            </Link>
            . Transparent partners ask for your margin on day one. Opaque ones
            optimize around it.
          </p>

          <hr className="blog-divider" />

          <h2 id="scorecard">Build your founder-tier marketing scorecard in 15 minutes</h2>
          <p>
            Run this snapshot every month before you read a single agency report:
          </p>
          <ol>
            <li>
              Pull total marketing spend for the month: ads plus email platform plus
              SMS plus agency fee
            </li>
            <li>Pull total revenue</li>
            <li>Calculate MER: total revenue divided by total marketing spend</li>
            <li>
              Pull new customer count and calculate CAC: total acquisition spend
              divided by new customers acquired
            </li>
            <li>
              Calculate contribution margin after all marketing costs
            </li>
            <li>
              Calculate payback period: CAC divided by monthly margin per customer
            </li>
          </ol>
          <p>
            Fifteen minutes. It tells you more than any agency dashboard. Once
            you have it, you can make real decisions. MER below 3x? Find where
            spend is leaking before adding budget. Payback over 12 months? Fix
            retention before scaling acquisition. Contribution margin under 20%?
            Renegotiate costs before you grow into a cash crisis.
          </p>
          <p>
            This is the kind of reporting that comes standard when your marketing
            runs on a system built around your business rather than around an
            agency&apos;s preferred metrics. If you&apos;re evaluating your
            options,{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>{" "}
            covers what founder-first reporting actually looks like in practice. The
            difference between an agency that shows you ROAS and one that shows you
            MER, contribution margin, and payback is the difference between a vendor
            and a real partner.
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
            bioOverride="Founder of Venti Scale. I've reviewed marketing reports for ecommerce brands at every revenue tier. Most of them report the same numbers that hide whether you're actually profitable."
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
                  Retention vs acquisition: where ecommerce founders waste the most
                  money
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/marketing-agency-red-flags"
                className="blog-related-card"
              >
                <div className="related-title">
                  11 marketing agency red flags every founder should know before
                  signing
                </div>
                <div className="related-meta">9 min read</div>
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
