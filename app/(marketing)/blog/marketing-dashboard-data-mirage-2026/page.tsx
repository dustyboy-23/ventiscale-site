import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SLUG = "marketing-dashboard-data-mirage-2026";
const TITLE = "Your agency's dashboard shows green. Your revenue doesn't.";
const DESCRIPTION =
  "26% of marketing budgets are wasted in 2026. Your marketing dashboard says green. Your revenue says otherwise. Here's what to actually track.";
const DATE = "2026-06-05";
const IMAGE = "/blog/marketing-dashboard-data-mirage.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

export const metadata = {
  title: `${TITLE} | Venti Scale`,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `https://www.ventiscale.com/blog/${SLUG}`,
    type: "article",
    images: [
      {
        url: IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Marketing dashboard with green metrics while ecommerce revenue stays flat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE_URL],
  },
};

const FAQ_DATA = [
  {
    q: "Why does my marketing dashboard show positive results when revenue is flat?",
    a: "Agencies report metrics they control — impressions, reach, follower count — because these numbers always trend upward with consistent spending. Revenue attribution is harder to measure and can reveal that campaigns aren't converting, so most agencies avoid reporting it unless asked directly.",
  },
  {
    q: "What percentage of marketing budgets are wasted in 2026?",
    a: "26% of marketing budgets are wasted in 2026, according to Deep Marketing research. The study identified the Data Mirage — dashboards showing metric success that never translates to revenue — as the primary driver of this waste.",
  },
  {
    q: "What metrics should ecommerce founders track instead of impressions and reach?",
    a: "Three metrics predict revenue: Customer Acquisition Cost by channel (DTC average is $68-$84), email revenue attribution (email returns $36-$79 per $1 spent), and 30-day retention rate (DTC average is 31%, top performers hit 45-55%). These numbers show whether marketing is actually working.",
  },
  {
    q: "How do I know if my marketing agency is showing me accurate data?",
    a: "Ask for CAC broken out by channel, email revenue attribution for the last 30 days, 30-day retention rate, and LTV at 90 days. A real marketing operation can pull all four numbers within 24 hours. If you get vague answers or a redirect to impressions, they're not tracking the right thing.",
  },
  {
    q: "What is the Data Mirage in marketing?",
    a: "The Data Mirage is a term from Deep Marketing's 2026 research describing the gap between dashboard metrics and actual revenue. A brand's reach doubles, impressions triple, reports show green — while revenue stays flat. It happens when agencies optimize for metrics they control rather than outcomes founders care about.",
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
          <Eyebrow>ECOMMERCE / MARKETING</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Your agency&apos;s dashboard shows green. Your revenue doesn&apos;t.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              June 5, 2026
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
            alt="Marketing dashboard with green metrics while ecommerce revenue stays flat"
          />
        </div>

        <div className="prose-blog">
          <p>
            Seventy percent of marketing leaders feel confident about their
            results. Forty-two percent of those same leaders admit their
            marketing dashboard doesn&apos;t reflect what&apos;s actually
            happening in revenue. That gap has a name. Deep Marketing calls it
            the Data Mirage.
          </p>
          <p>
            Your agency&apos;s weekly report shows impressions up, reach up,
            follower count up. Green arrows everywhere. You close the tab and
            open Shopify and nothing moved.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                26% of marketing budgets go to waste in 2026 — most founders
                never find out because the dashboard hides it.
              </li>
              <li>
                Agencies report impressions, reach, and engagement because
                these numbers always trend up with enough spend.
              </li>
              <li>
                The three numbers that actually predict revenue: CAC by
                channel, email attribution, and 30-day retention rate.
              </li>
              <li>
                If your agency can&apos;t pull these numbers in 24 hours,
                they&apos;re not tracking the right thing.
              </li>
            </ul>
          </div>

          <p>
            The Data Mirage happens when your marketing dashboard is optimized
            to look good, not to show whether customers are actually buying.
            It&apos;s the most expensive marketing problem most ecommerce
            brands never diagnose.
          </p>

          <h2>What the Data Mirage actually is</h2>
          <p>
            Last month I reviewed a Shopify brand&apos;s analytics setup end
            to end. Their Instagram reach was up 300% year over year. Their
            email list had grown by 2,400 subscribers. Google Analytics showed
            healthy traffic growth across every channel. The agency had sent a
            glossy monthly report with a 94% client satisfaction score at the
            top.
          </p>
          <p>
            They had made $200 less that month than the same month the year
            before.
          </p>
          <p>
            This is the Data Mirage. The dashboard tells a story of success.
            The bank account tells a different one. The disconnect
            isn&apos;t accidental — it&apos;s structural.
          </p>
          <p>
            According to{" "}
            <a
              href="https://ppc.land/70-of-leaders-are-confident-yet-nearly-half-admit-wasted-marketing-spend/"
              target="_blank"
              rel="noopener noreferrer"
            >
              research published by PPC Land
            </a>
            , 70% of marketing leaders feel confident about their results. But
            41.6% of those same leaders privately admit their dashboards
            don&apos;t reflect actual revenue performance. You can&apos;t have
            70% confidence and 41.6% admitted inaccuracy without a lot of
            people lying to themselves.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">26%</div>
              <div className="stat-label">of marketing budgets wasted in 2026</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">70%</div>
              <div className="stat-label">of leaders feel confident in results</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">41.6%</div>
              <div className="stat-label">admit dashboards don&apos;t match revenue</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>The 3 metrics agencies always report (and why they&apos;re safe bets)</h2>
          <p>
            Agencies don&apos;t report bad numbers on purpose. They report
            numbers that are structurally impossible to lose.
          </p>
          <p>
            <strong>Impressions</strong> always go up when you&apos;re running
            ads. Every dollar you spend generates impressions. The number is
            technically accurate and completely disconnected from whether
            anyone bought anything.
          </p>
          <p>
            <strong>Reach and follower count</strong> grow if you post
            consistently and run any awareness spend. A follower who never
            buys still counts as growth on the chart.
          </p>
          <p>
            <strong>Engagement rate</strong> is the sneaky one. It&apos;s
            calculated as interactions divided by reach, which means you can
            push it up by targeting broad audiences who like everything. High
            engagement on the wrong audience doesn&apos;t bring in customers.
          </p>

          <div className="blog-warning">
            <div className="callout-label">What to watch for</div>
            <p>
              If your monthly report leads with impressions, reach, and
              follower growth without a single revenue-linked metric, your
              agency is giving you the numbers they control, not the ones that
              matter. That&apos;s the tell.
            </p>
          </div>

          <p>
            The incentive is clear. Revenue attribution can show that 60% of
            your ad spend is going to an audience that never converts.
            Impressions can&apos;t do that. Agencies report what can&apos;t
            be used against them.
          </p>

          <hr className="blog-divider" />

          <h2>The 3 numbers that actually predict ecommerce revenue</h2>
          <p>
            These are the metrics worth demanding. Any competent marketing
            operation should pull all three within 24 hours.
          </p>
          <p>
            <strong>Customer Acquisition Cost by channel</strong> — not
            blended total, split by channel. The average DTC CAC in 2026 is
            $68-$84 depending on vertical. Beauty runs $90-$130. Electronics
            hits $100-$377. If your CAC is trending up and LTV
            isn&apos;t keeping pace, you&apos;re going backward regardless of
            what your reach numbers say. A blended ROAS number hides which
            channel is dragging the average down.
          </p>
          <p>
            <strong>Email revenue attribution</strong> — email delivers $36-$79
            back for every $1 spent, the highest ROI of any digital channel.
            Klaviyo and most serious ESPs track exactly which flows and
            campaigns generated revenue. If your agency can&apos;t tell you
            your email-attributed revenue for the last 30 days, they&apos;re
            not using the platform. This is exactly why{" "}
            <Link href="/blog/ecommerce-email-marketing-flows">
              ecommerce email flows
            </Link>{" "}
            are the first thing we build for every client — the attribution
            line is immediate and undeniable.
          </p>
          <p>
            <strong>30-day retention rate</strong> — the DTC industry average
            is 31%. Top performers hit 45-55%. A customer who doesn&apos;t
            come back in 30 days is one you paid full acquisition cost for and
            only monetized once. No amount of green impressions fixes the math
            of a 20% retention rate at an $80 CAC.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Channel ROAS reality check</div>
            <p>
              Blended ROAS looks fine until you break it out by channel. Google
              Shopping averages 5.17:1. Pinterest runs 6.2:1. Meta blended:
              1.86-2.19:1 and declining 4-10% year over year. If your agency
              shows you blended ROAS without the channel split, you
              don&apos;t actually know which dollar is working.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>Why 85% of marketing executives are reviewing agencies right now</h2>
          <p>
            Forrester data shows 85% of US B2C marketing executives are
            planning an agency review in 2026. That&apos;s not a blip.
            That&apos;s mass disillusionment.
          </p>
          <p>
            These aren&apos;t founders whose dashboards look bad. Their
            dashboards look great. They&apos;re reviewing agencies because the
            reports look great and the business isn&apos;t growing. The Data
            Mirage holds up until someone sits down and runs the actual CAC
            math.
          </p>
          <p>
            DTC customer acquisition costs have climbed 40-60% since 2023.
            Brands paying the same agency retainer they signed in 2023 are
            running the same playbook into a much more expensive audience. The
            agency&apos;s marketing dashboard still shows impressions going
            up. The unit economics are quietly underwater.
          </p>
          <p>
            If revenue feels harder to move than it did two years ago,
            you&apos;re not imagining it. The{" "}
            <Link href="/blog/how-to-evaluate-marketing-roi-ecommerce">
              real math on ecommerce marketing ROI
            </Link>{" "}
            is rarely what the agency report says.
          </p>

          <hr className="blog-divider" />

          <h2>5 questions that cut through the dashboard noise</h2>
          <p>
            Ask these at your next agency check-in. The answers — and the
            reaction to the questions — will tell you everything.
          </p>
          <p>
            <strong>1. What&apos;s our CAC broken out by channel?</strong>{" "}
            Not blended total. By channel. If they can&apos;t do this in 24
            hours, they&apos;re not tracking it.
          </p>
          <p>
            <strong>
              2. What revenue did email generate last month specifically?
            </strong>{" "}
            Klaviyo shows this in the dashboard overview. It takes 30 seconds
            to pull. Vague answers mean they&apos;re not looking at it.
          </p>
          <p>
            <strong>3. What&apos;s our 30-day customer retention rate?</strong>{" "}
            Shopify analytics has this. Any agency managing your store should
            know this number without looking it up.
          </p>
          <p>
            <strong>
              4. What&apos;s our LTV at 90 days versus 30 days?
            </strong>{" "}
            A healthy LTV:CAC ratio is 3:1 or better. Below 1:1 means the
            acquisition math is broken. If they can&apos;t answer this,
            they&apos;re not running a retention strategy.
          </p>
          <p>
            <strong>
              5. Which channel has the highest actual CAC this month?
            </strong>{" "}
            Not what&apos;s performing well. Which channel is costing the most
            per acquired customer. That&apos;s where the budget conversation
            needs to start.
          </p>
          <p>
            If these get vague answers, a request to &quot;wait for the
            monthly report,&quot; or a pivot back to impressions and reach —
            that is the answer.
          </p>

          <hr className="blog-divider" />

          <h2>What transparent reporting actually looks like</h2>
          <p>
            Every Venti Scale client has a live portal showing CAC, email
            attribution, retention rate, and LTV updated every 48 hours. I
            review these numbers before anything goes out. If a campaign stops
            working, it shows up in the portal before I call you about it.
          </p>
          <p>
            The goal isn&apos;t a dashboard that looks good. It&apos;s
            numbers real enough that you could switch partners tomorrow and
            keep running the system — because you understand exactly what
            works and why.
          </p>
          <p>
            That&apos;s the difference between a real marketing partner and a
            reporting machine. For the full breakdown on what actual{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>{" "}
            look like in 2026 — including what questions to ask before signing
            anything — that page covers it all.
          </p>
          <p>
            The Data Mirage is optional. Most brands just haven&apos;t found
            out they&apos;re inside one yet.
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
            bioOverride="Founder of Venti Scale. I've audited dozens of ecommerce marketing setups where the dashboard showed green and the revenue told a different story. Every Venti Scale client gets attribution reporting I can explain line by line."
            lastUpdated={DATE}
          />

          {/* Related posts */}
          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/how-to-evaluate-marketing-roi-ecommerce"
                className="blog-related-card"
              >
                <div className="related-title">
                  How to actually evaluate marketing ROI for an ecommerce brand
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/marketing-agency-red-flags"
                className="blog-related-card"
              >
                <div className="related-title">
                  Marketing agency red flags you should never ignore
                </div>
                <div className="related-meta">6 min read</div>
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
