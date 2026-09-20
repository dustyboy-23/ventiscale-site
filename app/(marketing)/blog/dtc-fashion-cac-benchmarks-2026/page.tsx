import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Athleisure CAC is $88. Swimwear is $240. Your agency shows you one number. | Venti Scale",
  description:
    "DTC fashion CAC ranges $53–$240 depending on category. Most agencies show you a blended number. Here's the 2026 sub-category breakdown every fashion founder needs.",
  openGraph: {
    title: "Athleisure CAC is $88. Swimwear is $240. Your agency shows you one number.",
    description:
      "DTC fashion CAC ranges $53–$240 depending on category. Most agencies show you a blended number. Here's the 2026 sub-category breakdown every fashion founder needs.",
    url: "https://www.ventiscale.com/blog/dtc-fashion-cac-benchmarks-2026",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/dtc-fashion-cac-benchmarks.jpg",
        width: 1200,
        height: 630,
        alt: "DTC fashion CAC benchmarks by category 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Athleisure CAC is $88. Swimwear is $240. Your agency shows you one number.",
    description:
      "DTC fashion CAC ranges $53–$240 depending on category. Most agencies show you a blended number. Here's the 2026 sub-category breakdown every fashion founder needs.",
    images: ["https://www.ventiscale.com/blog/dtc-fashion-cac-benchmarks.jpg"],
  },
};

const SLUG = "dtc-fashion-cac-benchmarks-2026";
const TITLE =
  "Athleisure CAC is $88. Swimwear is $240. Your agency shows you one number.";
const DESCRIPTION =
  "DTC fashion CAC ranges $53–$240 depending on category. Most agencies show you a blended number. Here's the 2026 sub-category breakdown every fashion founder needs.";
const DATE = "2026-09-20";
const IMAGE = "/blog/dtc-fashion-cac-benchmarks.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "What is the average CAC for DTC fashion brands in 2026?",
    a: "DTC fashion CAC benchmarks vary by sub-category: athleisure runs $53–$88, general apparel $59–$101, footwear $53–$94, denim $64–$171, and swimwear/lingerie $64–$240. The blended average masks a 4–5x spread across categories. Using the wrong benchmark means you can't tell if your acquisition cost is actually a problem.",
  },
  {
    q: "Why is swimwear CAC so much higher than athleisure?",
    a: "Swimwear requires longer purchase consideration windows, faces higher return risk, and has concentrated seasonality. A swimwear customer needs more touchpoints before converting than a hoodie buyer. That additional ad spend shows up directly in CAC. The economics are structural, not fixable with better creative alone.",
  },
  {
    q: "How should DTC fashion brands calculate CAC by category?",
    a: "Run your total paid acquisition spend by product line divided by orders in that category over the prior 90 days. Lifetime numbers mask seasonal shifts. Compare to 2026 benchmarks: athleisure $53–$88, general apparel $59–$101, swimwear $64–$240. If you're consistently above the top of the range, you have a structural cost problem, not a targeting problem.",
  },
  {
    q: "What is the most effective way to reduce DTC fashion CAC in 2026?",
    a: "Build the retention layer first. DTC fashion repeat rates sit at 15–17%, meaning most customers never come back after the first order. Adding post-purchase and win-back email flows converts existing customers instead of paying acquisition cost twice. Email returns $42–$45 per $1 spent. That math compounds faster than any paid channel improvement.",
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
          <Eyebrow>ECOMMERCE / DTC BENCHMARKS</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Athleisure CAC is $88. Swimwear is $240. Your agency shows you one
            number.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              September 20, 2026
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
            alt="DTC fashion CAC benchmarks by category 2026, apparel racks showing the spread from athleisure to swimwear"
          />
        </div>

        <div className="prose-blog">
          <p>
            Your DTC fashion agency sends you a weekly report. CAC looks fine.
            The problem: &ldquo;fine&rdquo; means something completely different
            in athleisure than it does in swimwear. Your agency is averaging
            across categories that have fundamentally different economics.
          </p>
          <p>
            The number they show you is technically accurate. It&apos;s also
            usefully misleading.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                DTC fashion CAC ranges from $53 (athleisure, footwear) to $240+
                (swimwear, lingerie). Five distinct categories, five different
                benchmarks
              </li>
              <li>
                CAC rose 24.7% in 2025 alone and 222% over eight years. The
                number your agency uses as a baseline is already stale
              </li>
              <li>
                Most agencies show a blended CAC that hides which lines are
                working and which aren&apos;t
              </li>
              <li>
                Email returns $42–$45 per $1 spent, still the fastest lever
                to offset rising acquisition cost in fashion
              </li>
            </ul>
          </div>

          <p>
            DTC fashion CAC is not a single category. It&apos;s five different
            businesses with five different unit economics, and the benchmark
            your agency uses is almost never the one that applies to what you
            actually sell.
          </p>

          <h2 id="five-categories">
            The five CAC categories in DTC fashion
          </h2>

          <p>
            The &ldquo;average&rdquo; DTC apparel CAC doesn&apos;t exist in any
            useful sense. What exists is a spread that runs from $53 at the low
            end to $240+ at the high end, driven entirely by what you sell and
            who buys it.
          </p>
          <p>
            According to{" "}
            <a
              href="https://foundrycro.com/blog/dtc-fashion-marketing-benchmarks-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              Foundry CRO&apos;s 2026 DTC fashion benchmarks
            </a>
            , the sub-category breakdown looks like this:
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$53–$88</div>
              <div className="stat-label">Athleisure CAC</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$59–$101</div>
              <div className="stat-label">General apparel CAC</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$64–$240</div>
              <div className="stat-label">Swimwear / lingerie CAC</div>
            </div>
          </div>

          <p>
            Footwear runs $53–$94. Denim runs $64–$171. The spread between
            categories is 4–5x. Two brands can run identical creative at
            identical media cost and land at completely different acquisition
            numbers because of what they sell. The category drives the
            economics, not the campaign.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              If you sell multiple product lines, run your CAC by line, not by
              campaign. A swimwear line and a basics line running the same Meta
              creative will produce acquisition numbers that are $80–$150 apart.
              Blending them hides both the problem and the opportunity.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="structural-gap">
            Why the gap is structural, not fixable with better ads
          </h2>

          <p>
            Swimwear and lingerie have inherently longer purchase consideration
            windows. A customer buying a bikini needs more reassurance, more
            time, and more touchpoints than someone buying a hoodie. That extra
            friction compounds across every funnel stage: more ad impressions,
            higher landing page bounce, longer time-to-purchase.
          </p>
          <p>
            DTC fashion repeat rates sit at 15–17% across the category. That
            means most DTC fashion brands lose 83–85% of customers after the
            first order. At those churn rates, you&apos;re paying acquisition
            cost on almost every order, every cycle. The brand that moves its
            repeat rate from 16% to 22% doesn&apos;t just improve retention.
            It fundamentally changes the unit economics on every paid
            acquisition dollar it was already spending.
          </p>
          <p>
            Better creative doesn&apos;t fix this. A swimwear brand spending
            $180 per customer with brilliant ads is still running swimwear
            economics. The category sets the floor.
          </p>

          <figure className="blog-image">
            <img
              src="/blog/dtc-fashion-cac-benchmarks.jpg"
              alt="DTC fashion apparel racks showing the diversity of categories from athleisure to swimwear"
            />
            <figcaption>
              Athleisure and swimwear share a &ldquo;fashion&rdquo; label. The
              acquisition economics are almost unrelated.
            </figcaption>
          </figure>

          <hr className="blog-divider" />

          <h2 id="agency-number">What agencies are actually showing you</h2>

          <p>
            A blended number that&apos;s technically true and strategically
            useless. If you run athleisure and swimwear lines, your blended CAC
            might read $130. Your athleisure line is at $75 (on target). Your
            swimwear line is at $195 (a problem worth addressing). The blend
            says you&apos;re okay. The category breakdown says you have a line
            that&apos;s structurally underwater.
          </p>
          <p>
            DTC fashion CAC rose 24.7% in 2025 alone, and 222% over the past
            eight years. Agencies know these trends. They don&apos;t surface
            them in weekly reports because a 24.7% YoY CAC inflation number
            doesn&apos;t fit neatly into a &ldquo;wins&rdquo; column. The
            blended number is what gets reported because it&apos;s the number
            most likely to look stable.
          </p>

          <div className="blog-warning">
            <div className="callout-label">What to watch for</div>
            <p>
              If your agency reports a single &ldquo;average CAC&rdquo; across
              your entire catalog without sub-category breakdowns, you&apos;re
              looking at a number built for reporting, not decision-making. Ask
              for it broken out by product line. If they can&apos;t produce it,
              that&apos;s the answer.
            </p>
          </div>

          <p>
            This is where{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>{" "}
            look different: a system benchmarked to your actual category, not
            against last month&apos;s blended average.
          </p>

          <p>
            For context on how much the platform CPA your agency reports
            diverges from your actual fully-loaded CAC, the math is worth
            running. As we&apos;ve covered,{" "}
            <Link href="/blog/dtc-fully-loaded-cac-channel-2026">
              the gap between a $58 Meta CPA and a $212 real CAC
            </Link>{" "}
            is where most DTC brands discover the agency&apos;s reporting was
            optimistic.
          </p>

          <hr className="blog-divider" />

          <h2 id="email-math">The email math that changes the picture</h2>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">+222%</div>
              <div className="stat-label">DTC fashion CAC increase over 8 years</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$42–$45</div>
              <div className="stat-label">Email ROI per $1 spent (2026)</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">15–17%</div>
              <div className="stat-label">DTC fashion repeat purchase rate</div>
            </div>
          </div>

          <p>
            DTC fashion CAC went up 222% over eight years. Email ROI held at
            $42–$45 per $1 spent. Those two lines moving in opposite directions
            is the most important chart in DTC fashion right now. Almost
            no agency is showing it to you.
          </p>
          <p>
            I&apos;ve reviewed the email programs of fashion brands with
            $90–$120 acquisition costs. Almost all of them run 2–3 abandoned
            cart emails and a welcome sequence. The post-purchase window is
            wide open. No win-back flow. No browse abandonment. No loyalty
            sequence.
          </p>
          <p>
            At a 15–17% repeat rate, every percentage point of improvement is
            worth more to your unit economics than a $10 reduction in
            acquisition cost. The{" "}
            <Link href="/blog/email-marketing-roi-ecommerce-2026">
              email ROI math
            </Link>{" "}
            compounds faster than any paid channel improvement because
            it&apos;s operating on customers you already paid to acquire.
          </p>

          <hr className="blog-divider" />

          <h2 id="what-to-do">What to do with the benchmark</h2>

          <p>
            Three moves that change the picture without changing your ad
            budget.
          </p>
          <p>
            <strong>Know which category you&apos;re in.</strong> If you sell
            multiple lines, run CAC by product category, not by campaign. The
            fashion sub-category benchmarks above are your reference. Swimwear
            at $200 might be normal for a high-AOV brand. Swimwear at $200
            with an $85 AOV is a structural problem.
          </p>
          <p>
            <strong>Set the right target.</strong> Athleisure at $90 is above
            benchmark but not alarming. Athleisure at $150 is a signal
            something is broken in your funnel or your creative. Denim at $130
            is mid-range normal. Denim at $200 needs investigation. The
            benchmark gives you a real signal instead of a relative one.
          </p>
          <p>
            <strong>Fix the repeat rate before fixing the acquisition
            rate.</strong> At 15–17% repeat, most DTC fashion brands are
            acquiring to stand still. Moving that number by 4–5 points through
            post-purchase email and win-back flows does more for unit economics
            than shaving $20 off your Meta CAC. The apparel return rate also
            matters here. At 24–26% industry average, every{" "}
            <Link href="/blog/dtc-true-cac-returns-apparel-ecommerce-2026">
              return is costing you acquisition dollars twice
            </Link>
            .
          </p>

          <div className="blog-callout">
            <div className="callout-label">The real benchmark question</div>
            <p>
              The benchmark isn&apos;t whether your CAC is up or down from last
              month. It&apos;s whether it&apos;s above or below the range for
              your specific sub-category. A swimwear brand at $180 CAC is
              performing. An athleisure brand at $180 CAC has a problem. Same
              number, opposite conclusions.
            </p>
          </div>

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
            bioOverride="Founder of Venti Scale. I&apos;ve reviewed CAC data across DTC brands in fashion, home goods, and beauty. The sub-category gap in fashion is the most dramatic I&apos;ve seen, and the most consistently hidden by agency reporting."
            lastUpdated={DATE}
          />

          {/* Related posts */}
          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/dtc-fully-loaded-cac-channel-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Your agency shows you a $58 Meta CPA. Your real CAC is $212.
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/dtc-true-cac-returns-apparel-ecommerce-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Your DTC CAC number is wrong. Returns are making it worse.
                </div>
                <div className="related-meta">7 min read</div>
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
