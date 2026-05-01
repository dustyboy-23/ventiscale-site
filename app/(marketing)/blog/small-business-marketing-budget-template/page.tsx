import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "What should a small business marketing budget look like? | Venti Scale",
  description:
    "A real small business marketing budget template for 2026. How much to spend, where to put it, and what to cut first when money is tight.",
  openGraph: {
    title: "What should a small business marketing budget look like?",
    description:
      "A real small business marketing budget template for 2026. How much to spend, where to put it, and what to cut first when money is tight.",
    url: "https://www.ventiscale.com/blog/small-business-marketing-budget-template",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/marketing-budget-template.jpg",
        width: 1200,
        height: 630,
        alt: "Small business marketing budget template with calculator and spreadsheet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "What should a small business marketing budget look like?",
    description:
      "A real small business marketing budget template for 2026. How much to spend, where to put it, and what to cut first when money is tight.",
    images: ["https://www.ventiscale.com/blog/marketing-budget-template.jpg"],
  },
};

const SLUG = "small-business-marketing-budget-template";
const TITLE =
  "What should a small business marketing budget look like?";
const DESCRIPTION =
  "A real small business marketing budget template for 2026. How much to spend, where to put it, and what to cut first when money is tight.";
const DATE = "2026-04-19";

const FAQ_DATA = [
  {
    q: "How much should a small business spend on marketing in 2026?",
    a: "Most small businesses should spend 7-12% of gross revenue on marketing in 2026. The SBA recommends 7-8% for businesses under $5M in revenue. Early-stage businesses trying to grow fast push that to 10-20%, while stable businesses can sit at 4-7%. A $500K business typically spends $2,500 to $5,000 per month.",
  },
  {
    q: "How should a small business marketing budget be broken down by channel?",
    a: "A healthy allocation is roughly 60% organic channels (SEO, content, email, social) and 40% paid channels (ads, influencer, sponsorships). Inside that, aim for 25-30% on content and SEO, 15-20% on email, 30-40% on paid ads, and 10-15% on tools and creative. Email returns $36 per $1 spent, so underfunding it is a mistake.",
  },
  {
    q: "What is the first thing to cut from a marketing budget when money is tight?",
    a: "Cut paid ads before you cut content, email, or SEO. Ads stop producing the day you stop paying. Organic channels keep working for months after you create them. A blog post from 6 months ago can still drive leads today. A paused Facebook ad brings in zero.",
  },
  {
    q: "How much of the marketing budget should go to tools vs. people vs. ad spend?",
    a: "For most small businesses, a good split is 50-60% on labor or agency, 30-40% on ad spend, and 5-10% on tools. Software should never eat more than 10% of the total budget. If you are paying $500/month for 8 tools and $0 for ads, the ratio is upside down and needs fixing.",
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
            image: "https://www.ventiscale.com/blog/marketing-budget-template.jpg",
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
          <Eyebrow>SMALL BUSINESS / BUDGET</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            What should a small business marketing budget look like?
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 19, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              8 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src="/blog/marketing-budget-template.jpg"
            alt="Small business marketing budget template with calculator and spreadsheet"
          />
        </div>

        <div className="prose-blog">
          <p>
            73% of small business owners have no real marketing budget. They
            have a vague sense that they should spend &quot;some money&quot; on
            marketing, so they pay for a few tools, boost a post when they
            remember, and call it a strategy. Then they wonder why nothing grows.
          </p>
          <p>
            A marketing budget isn&apos;t about how much you can afford to spend.
            It&apos;s about what you expect to get back. Without one, every dollar
            is a coin flip.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Most small businesses should spend 7-12% of gross revenue on
                marketing in 2026. Early-stage push to 15-20%, mature sit at 4-7%.
              </li>
              <li>
                Split the budget 60% organic (SEO, content, email, social) and
                40% paid. Owned channels compound, paid stops the day you pause.
              </li>
              <li>
                Email returns $36 per $1 spent. SEO returns $22 per $1. If those
                two are underfunded, your allocation is wrong.
              </li>
              <li>
                A $500K business at 8% spends about $3,300/month. Knowing where
                that money goes is the difference between growth and waste.
              </li>
            </ul>
          </div>

          <p>
            A small business marketing budget should land between 7% and 12% of
            gross revenue in 2026, weighted 60% toward organic channels and 40%
            toward paid. Anything below 5% is underspending. Anything above 20%
            needs to be tied to an aggressive growth goal, not just optimism.
          </p>

          <h2>The right number: 7-12% of gross revenue</h2>
          <p>
            The U.S. Small Business Administration recommends{" "}
            <a
              href="https://www.sba.gov/blog/how-get-most-your-marketing-budget"
              target="_blank"
              rel="noopener noreferrer"
            >
              7-8% of gross revenue
            </a>{" "}
            for businesses under $5M in annual revenue. That&apos;s the floor.
            The ceiling depends on how fast you want to grow.
          </p>
          <p>
            Here&apos;s what that actually looks like in dollars.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$250K</div>
              <div className="stat-label">$1,700-2,500/month at 8-12%</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$500K</div>
              <div className="stat-label">$3,300-5,000/month at 8-12%</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$1M</div>
              <div className="stat-label">$6,700-10,000/month at 8-12%</div>
            </div>
          </div>

          <p>
            Those numbers include everything. Tools, labor, ad spend, agency
            fees, creative, the whole operation. Most small business owners only
            count the ad spend and get surprised when growth stalls because the
            rest is underfunded.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              In 2025, marketing budgets hit 9.4% of company revenue on average,
              up from 7.7% in 2024. 83% of B2B marketing leaders plan to spend
              more in 2026. If you&apos;re sitting at 3%, you&apos;re not just
              behind, you&apos;re getting quietly outspent every week.
            </p>
          </div>

          <h2>The budget template: where every dollar goes</h2>
          <p>
            A working small business marketing budget has four buckets. Get the
            ratios right and the rest is execution.
          </p>

          <p>
            <strong>1. Content and SEO (25-30%).</strong> Blog posts, landing
            page copy, on-page SEO, technical SEO. Content costs 62% less than
            outbound marketing and produces 3x more leads. It&apos;s the
            highest-ROI thing you can do if you&apos;re playing a long game.
            Underfund this and you&apos;re renting all your traffic.
          </p>
          <p>
            <strong>2. Email marketing (15-20%).</strong> List building, welcome
            sequences, newsletters, automated flows. Email returns $36 for every
            $1 spent. That&apos;s not a typo. If your email is &quot;we send a
            newsletter when we remember,&quot; you&apos;re leaving the
            highest-ROI channel on the table.
          </p>
          <p>
            <strong>3. Paid ads (30-40%).</strong> Google, Meta, LinkedIn,
            YouTube. Paid is the faucet you turn on when you need customers this
            month. It&apos;s also the first thing people overspend on. Paid
            without a solid organic foundation is a treadmill.
          </p>
          <p>
            <strong>4. Tools, creative, and overhead (10-15%).</strong>{" "}
            Software, design, video production, analytics. This is where budgets
            quietly leak. Eight tools at $50/month is $4,800 a year you might
            not need.
          </p>

          <figure className="blog-image">
            <img
              src="/blog/marketing-budget-template.jpg"
              alt="Marketing budget breakdown with calculator showing channel allocation"
            />
            <figcaption>
              The 60/40 rule: 60% of the budget goes to owned channels that
              compound, 40% to paid channels that scale.
            </figcaption>
          </figure>

          <h2>The 60/40 rule: owned vs. paid</h2>
          <p>
            The single most important ratio in your budget is the split between
            owned channels and paid channels. Aim for 60% owned, 40% paid.
          </p>
          <p>
            Owned channels are the stuff you control: your website, your email
            list, your content, your SEO. They take time to build and they keep
            working after you stop paying. A blog post you wrote in January can
            still be bringing in leads in November.
          </p>
          <p>
            Paid channels are rented: Meta ads, Google ads, LinkedIn
            sponsorships. They work instantly. They stop instantly. The day you
            pause a campaign, the traffic dies.
          </p>
          <p>
            Most struggling small businesses have the split inverted. They
            put 80% into paid because paid feels like action, and 20% into
            content and email because those feel slow. Then they wonder why
            they&apos;re running on a treadmill. This is the same mistake we
            covered in{" "}
            <Link href="/blog/done-for-you-marketing-vs-diy">
              done-for-you vs. DIY marketing
            </Link>
            : people confuse effort with progress.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Pouring 70%+ of a tiny budget into paid ads while email is an
              afterthought and the blog hasn&apos;t been touched in 6 months.
              You&apos;ll get a trickle of customers as long as the credit card
              keeps working. Stop paying, traffic goes to zero the same day.
            </p>
          </div>

          <h2>What the budget should look like by business stage</h2>

          <p>
            One percentage doesn&apos;t fit every business. Your stage changes
            the allocation more than your industry does.
          </p>

          <p>
            <strong>Early-stage (pre-revenue or under $100K):</strong> Spend
            10-20% of projected revenue. You&apos;re buying learning, not
            customers. You don&apos;t know which channels work yet, so the goal
            is to test enough to find out. Heavier on paid ads (faster data) and
            light on tools.
          </p>
          <p>
            <strong>Growth stage ($100K-$1M):</strong> Spend 7-12% of revenue.
            You know what works. Now you&apos;re optimizing and scaling. Heavier
            weight on organic (SEO, email, content) because you&apos;re playing
            the long game.
          </p>
          <p>
            <strong>Mature ($1M+):</strong> Spend 4-7% of revenue. Brand is
            established, existing customers drive a lot of growth. Budget shifts
            toward retention, referral programs, and premium content that
            reinforces position.
          </p>

          <hr className="blog-divider" />

          <h2>The 5 budget red flags</h2>
          <p>
            You don&apos;t need a CFO to spot a broken marketing budget. Watch
            for these.
          </p>
          <p>
            <strong>1. You can&apos;t say what any line item returned last
            quarter.</strong> If nobody knows what the $400/month tool actually
            did for the business, cut it. The data should exist. If it
            doesn&apos;t, you don&apos;t have a marketing budget, you have a
            marketing habit.
          </p>
          <p>
            <strong>2. Paid ads are more than 50% of the total.</strong>{" "}
            Anything above 50% means you&apos;re renting your entire customer
            acquisition. The day you pause ads, you have no pipeline.
          </p>
          <p>
            <strong>3. You&apos;re paying for 6+ tools.</strong> Most small
            businesses can run on 3-4 tools max. An email platform, a social
            scheduler, an analytics tool, maybe a CRM. If you have 8 SaaS
            subscriptions and one of them has a 500-lead list sitting idle,
            you&apos;re leaking money.
          </p>
          <p>
            <strong>4. Zero line item for content.</strong> No blog, no SEO, no
            long-form content. You&apos;re fully dependent on paid traffic and
            whatever social algorithm is feeling generous this week.
          </p>
          <p>
            <strong>5. The budget is set once a year and never reviewed.</strong>{" "}
            If your 2026 budget looks exactly like your 2025 budget, nothing was
            learned. Budgets should shift quarterly based on what channels
            actually produced.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$36</div>
              <div className="stat-label">Return per $1 on email marketing</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$22</div>
              <div className="stat-label">Return per $1 on SEO</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">62%</div>
              <div className="stat-label">Cheaper than outbound, 3x leads</div>
            </div>
          </div>

          <h2>What to cut first when money gets tight</h2>
          <p>
            Every small business hits a month where revenue drops. The instinct
            is to cut marketing because it feels optional. That instinct is
            wrong. Cut the wrong thing and you make the next quarter worse.
          </p>
          <p>
            Cut in this order.
          </p>
          <p>
            <strong>Cut first:</strong> paid ads. They stop producing the
            second you stop paying. Pausing ads is reversible. You can turn them
            back on next month.
          </p>
          <p>
            <strong>Cut second:</strong> tool bloat. Audit every SaaS
            subscription. Keep what you actually use, cancel the rest. Most
            small businesses can save $200-500/month doing this in one
            afternoon.
          </p>
          <p>
            <strong>Cut last:</strong> content, SEO, and email. These are your
            compounding assets. A blog post you wrote in January keeps driving
            leads in November. Kill them and you kill the engine that keeps
            working when everything else is off. This is why we told people in{" "}
            <Link href="/blog/marketing-agency-vs-in-house">
              the agency vs. in-house breakdown
            </Link>{" "}
            that the first hire should almost always be the person who builds
            content, not the person who runs ads.
          </p>

          <h2>The honest answer if you don&apos;t want to think about this</h2>
          <p>
            Most small business owners aren&apos;t going to build a detailed
            marketing budget. They&apos;re running the business, serving
            customers, managing inventory, doing payroll. Sitting down to
            allocate 15-20% of revenue across 4 channels and then track it
            monthly is not going to happen.
          </p>
          <p>
            That&apos;s fine. You have two honest options.
          </p>
          <p>
            <strong>Option one:</strong> spend 10% of revenue on a single
            channel you can actually run. Pick email if you already have a list,
            paid ads if you have a good offer, or SEO if you&apos;re patient.
            Doing one thing well beats doing five things badly.
          </p>
          <p>
            <strong>Option two:</strong> hand the whole thing to someone who
            does this for a living. At Venti Scale, we run the entire budget for
            you. Content, email, social, ads, tools, reporting. You set the
            monthly number, we allocate it across channels, track returns, and
            shift the mix when something isn&apos;t working. You get a{" "}
            <Link href="/#how">weekly report</Link> showing what each dollar
            did. No spreadsheets. No guessing.
          </p>
          <p>
            Either way, stop running marketing without a number attached to it.
            That&apos;s the actual mistake. For the full breakdown on{" "}
            <Link href="/ai-marketing-cost">what AI marketing actually costs</Link>{" "}
            in 2026, here are the line-item numbers.
          </p>

          <div className="blog-faq">
            <h2>Frequently asked questions</h2>
            {FAQ_DATA.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>

          <BlogAuthorBio />

          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/social-media-marketing-cost"
                className="blog-related-card"
              >
                <div className="related-title">
                  How much does social media marketing really cost in 2026?
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
              <Link
                href="/blog/marketing-agency-vs-in-house"
                className="blog-related-card"
              >
                <div className="related-title">
                  Marketing agency vs. in-house: the real math for a small
                  business
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
            </div>
          </div>

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
