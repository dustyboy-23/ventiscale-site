import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Done-for-you marketing: what's actually in the box (and 4 red flags most agencies hide) | Venti Scale",
  description:
    "Most done-for-you agencies sell PDF reports and call it a service. Here's what the deliverables actually look like when an agency does the work right.",
  openGraph: {
    title: "Done-for-you marketing: what's actually in the box (and 4 red flags most agencies hide)",
    description:
      "Most done-for-you agencies sell PDF reports and call it a service. Here's what the deliverables actually look like when an agency does the work right.",
    url: "https://www.ventiscale.com/blog/what-done-for-you-marketing-includes",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/done-for-you-marketing.jpg",
        width: 1200,
        height: 630,
        alt: "Done for you marketing services for small business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Done-for-you marketing: what's actually in the box (and 4 red flags most agencies hide)",
    description:
      "Most done-for-you agencies sell PDF reports and call it a service. Here's what the deliverables actually look like when an agency does the work right.",
    images: ["https://www.ventiscale.com/blog/done-for-you-marketing.jpg"],
  },
};

const SLUG = "what-done-for-you-marketing-includes";
const TITLE =
  "Done-for-you marketing: what's actually in the box (and 4 red flags most agencies hide)";
const DESCRIPTION =
  "Most done-for-you agencies sell PDF reports and call it a service. Here's what the deliverables actually look like when an agency does the work right.";
const DATE = "2026-04-13";
const IMAGE = "/blog/done-for-you-marketing.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "How much does done for you marketing cost for a small business?",
    a: "Most done for you marketing packages for small businesses cost between $500 and $2,500 per month. Entry-level packages covering social media and basic content start around $500. Full-service packages with content, email, ads, and reporting typically run $1,000 to $2,500. Anything under $300 per month is a red flag that corners are being cut.",
  },
  {
    q: "What's the difference between done for you marketing and a traditional agency?",
    a: "Done for you marketing handles execution end to end. Traditional agencies often focus on strategy and consulting, leaving you to implement their recommendations. A true DFY provider creates your content, posts it, manages your accounts, runs your ads, and sends you performance reports without you lifting a finger.",
  },
  {
    q: "How long does done for you marketing take to show results?",
    a: "Expect measurable results within 60 to 90 days. Early indicators include increased profile visits, follower growth, and website traffic from social channels. A good provider sends weekly reports with real numbers. If you're 3 months in and the only metric they share is impressions, something's wrong.",
  },
  {
    q: "Can I keep control of my brand voice with done for you marketing?",
    a: "Yes. Any reputable DFY provider starts with a brand voice and strategy session before publishing anything. You should have approval rights during the first month and a clear feedback loop after that. If a provider won't let you review content before it goes live, walk away.",
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
          <Eyebrow>MARKETING / SERVICES</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Done-for-you marketing: what&apos;s actually in the box (and 4 red flags most agencies hide)
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 13, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              8 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src="/blog/done-for-you-marketing.jpg"
            alt="Small business owner reviewing marketing analytics on a laptop"
          />
        </div>

        <div className="prose-blog">
          <p>
            &quot;We&apos;ll handle everything.&quot; That&apos;s what the last
            agency told you. Three months and $4,500 later, you had a handful of
            Instagram posts that looked like they came from a template and an
            invoice that didn&apos;t explain where the money went.
          </p>
          <p>
            Here&apos;s the problem with done for you marketing for small
            business owners. Nobody explains what &quot;everything&quot; actually
            means before you sign.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Done for you marketing should include content creation, social
                scheduling, ad management, reporting, and strategy. If a
                provider can&apos;t list specifics, that&apos;s a red flag.
              </li>
              <li>
                Small businesses typically pay $500 to $2,500 per month. Under
                $300 means corners are being cut.
              </li>
              <li>
                52% of US small businesses outsource some marketing in 2026. The
                ones winning know exactly what they&apos;re paying for.
              </li>
              <li>
                Demand weekly reports, real metrics, and a clear deliverable list
                before you sign anything.
              </li>
            </ul>
          </div>

          <p>
            Done for you marketing means a team runs your entire marketing
            operation. Content creation, social media posting, email campaigns,
            ad management, and performance reporting. You run your business. They
            make sure people find it. When it works, it&apos;s one of the
            smartest investments a small business owner can make. For the full
            category overview on{" "}
            <Link href="/done-for-you-marketing-services">
              done-for-you marketing services
            </Link>
            , here&apos;s the deeper breakdown.
          </p>

          <h2>
            Why &quot;done for you&quot; means something different everywhere
          </h2>
          <p>
            The term has no standard definition. One agency uses it to mean
            they&apos;ll post on your Instagram three times a week. Another
            means a full content team, ad management, email campaigns, and
            monthly strategy calls.
          </p>
          <p>
            This is why most small business owners get frustrated. You sign up
            thinking you&apos;re getting a marketing department. You end up with
            a freelancer using Canva templates on your account.
          </p>
          <p>
            The gap between what&apos;s promised and what&apos;s delivered is
            massive. And it&apos;s why so many owners give up on outsourced
            marketing entirely. They didn&apos;t get burned by marketing. They
            got burned by vague promises and zero accountability.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Watch out</div>
            <p>
              If a provider can&apos;t give you a written list of exactly what
              you&apos;ll receive each month before you pay, walk away.
              &quot;We&apos;ll handle everything&quot; is not a deliverable.
            </p>
          </div>

          <p>
            Before you sign anything, get the deliverable list in writing. How
            many posts per week. On which platforms. Who writes the copy. Who
            makes the graphics. How often you get reports. What metrics they
            track. This is the same discipline that{" "}
            <Link href="/blog/contractors-getting-clients-online">
              contractors need when building an online presence
            </Link>
            . Know what you&apos;re buying before you buy it.
          </p>

          <hr className="blog-divider" />

          <h2>What done for you marketing actually includes</h2>
          <p>
            A legitimate done for you marketing service for a small business
            covers six core areas. If any of these are missing, you&apos;re not
            getting the full picture.
          </p>
          <p>
            <strong>Content creation.</strong> Blog posts, social media content,
            email copy, and ad creative. This is the bulk of the work. A good
            provider creates original content tailored to your brand voice. Not
            recycled templates. Not stock photos with your logo slapped on top.
            That means captions that sound like you, blog articles that rank for
            keywords your customers actually search, and graphics designed for
            each platform individually.
          </p>
          <p>
            <strong>Social media management.</strong> Posting, scheduling,
            community engagement, and platform optimization. They should be in
            your accounts daily. Not once a week. Consistency is what makes
            social work. That&apos;s true whether you&apos;re{" "}
            <Link href="/blog/social-media-for-ecommerce-brands">
              an ecommerce brand building a following
            </Link>{" "}
            or a local service company trying to stay visible.
          </p>
          <p>
            <strong>Email marketing.</strong> Welcome sequences, promotional
            campaigns, newsletters. Email still has the highest ROI of any
            digital marketing channel at roughly $36 returned for every $1
            spent. A DFY provider should be handling it.
          </p>
          <p>
            <strong>Paid advertising.</strong> Campaign setup, audience
            targeting, budget management, and optimization. This is where most
            small businesses waste the most money trying to figure it out alone.
            A good provider tests creative, adjusts targeting weekly, and makes
            sure your ad spend turns into actual leads.
          </p>
          <p>
            <strong>Reporting and analytics.</strong> Weekly or monthly reports
            showing what&apos;s working, what&apos;s not, and what&apos;s
            changing. Real numbers. Not vanity metrics like impressions and reach
            that don&apos;t tie back to revenue.
          </p>
          <p>
            <strong>Strategy.</strong> Someone who actually thinks about your
            marketing plan. Where to focus. What to test. What to stop doing.
            This is what separates a real marketing partner from a content
            factory.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">52%</div>
              <div className="stat-label">
                Of US small businesses outsource marketing
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$500-$2.5K</div>
              <div className="stat-label">Typical monthly DFY cost</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">72%</div>
              <div className="stat-label">
                Of marketing budgets go to digital
              </div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>What it costs in 2026 (real numbers)</h2>
          <p>
            Let&apos;s cut through the vague pricing pages. Here&apos;s what
            done for you marketing actually costs for a small business right
            now.
          </p>
          <p>
            <strong>$500 to $1,000 per month</strong> gets you a basic package.
            Social media content and posting on 2 to 3 platforms. Maybe some
            light email work. This is a solid starting point if you just need a
            consistent online presence.
          </p>
          <p>
            <strong>$1,000 to $2,500 per month</strong> is the sweet spot for
            most small businesses. Full content creation, social management
            across all your platforms, email campaigns, basic ad management, and
            weekly reporting. This is where real results start showing up.
          </p>
          <p>
            <strong>$2,500 to $5,000 per month</strong> adds dedicated strategy,
            advanced ad spend management, video content, and more aggressive
            growth tactics. This makes sense once you&apos;re actively scaling.
          </p>
          <p>
            For context, hiring one full-time marketing person costs $50,000 to
            $70,000 a year in salary alone. Add benefits, software
            subscriptions, and management time and you&apos;re looking at
            $75,000 to $100,000 per year. A DFY marketing service gives you an
            entire team for a fraction of that.
          </p>
          <p>
            Here&apos;s the math. At $1,500 per month, a DFY service costs
            $18,000 a year. One marketing coordinator at $52,000 salary plus
            benefits runs about $70,000 total. And that one person still
            can&apos;t do everything a team does. They can&apos;t write copy,
            design graphics, manage ads, build email sequences, and report on
            analytics all at a high level. The DFY model works because
            you&apos;re splitting the cost of a full team across multiple
            clients.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$62K</div>
              <div className="stat-label">
                Average marketing manager salary
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">68%</div>
              <div className="stat-label">
                Of owners increasing marketing spend in 2026
              </div>
            </div>
          </div>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              68% of small business owners plan to increase their marketing
              budget in 2026, according to{" "}
              <a
                href="https://localiq.com/blog/small-business-marketing-trends-report-2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LocaliQ&apos;s Small Business Marketing Trends Report
              </a>
              . The shift isn&apos;t toward doing more yourself. It&apos;s
              toward paying someone who already knows what works.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>Red flags that mean you&apos;re getting burned</h2>
          <p>
            Not all done for you providers are worth the money. Watch for these
            warning signs before you hand over your credit card.
          </p>
          <p>
            <strong>No clear deliverables.</strong> If the contract says
            &quot;social media management&quot; without specifying how many
            posts, which platforms, or what type of content, you&apos;ll be
            disappointed. Every time.
          </p>
          <p>
            <strong>No reporting.</strong> If you can&apos;t see what&apos;s
            happening with your marketing, you have no idea if it&apos;s
            working. Any provider worth paying sends real metrics every week. Not
            just &quot;impressions went up.&quot;
          </p>
          <p>
            <strong>Long lock-in contracts.</strong> Month-to-month or 3-month
            agreements are standard. If someone wants a 12-month commitment
            upfront with no performance clauses, they don&apos;t trust their own
            results.
          </p>
          <p>
            <strong>They won&apos;t show examples.</strong> Ask to see work
            they&apos;ve done for other clients. Real content, real results, real
            case studies. If they don&apos;t have them, that tells you
            everything.
          </p>
          <p>
            <strong>Everything is 100% automated.</strong> Automation is a tool.
            It&apos;s not a strategy. If your provider runs pure AI content with
            zero human oversight, your brand ends up sounding like everyone
            else&apos;s. And your audience can tell.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Choosing the cheapest option. A $200 per month provider posting
              AI-generated templates with no strategy will cost you more in
              wasted time and missed opportunities than a $1,500 per month
              partner who actually moves the needle.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>What to look for in a done for you marketing partner</h2>
          <p>
            The best DFY marketing providers share a few things in common.
          </p>
          <p>
            <strong>Transparent pricing with clear deliverables.</strong> You
            know exactly what you&apos;re getting before you pay. No surprises.
            No hidden fees. No vague scope that changes after you sign. A good
            partner tells you what you&apos;re getting in month one, month
            three, and month six.
          </p>
          <p>
            <strong>Real reporting on a schedule.</strong> Weekly reports with
            actual metrics. Follower growth, website traffic, conversions, ad
            performance. Numbers you can tie to revenue. The same way{" "}
            <Link href="/blog/why-coaches-need-social-media">
              coaches need visible proof their marketing works
            </Link>
            , you need data showing your investment is paying off.
          </p>
          <p>
            <strong>They understand your industry.</strong> A provider who works
            with ecommerce brands should know ecommerce. One who works with
            contractors should understand local SEO and seasonal demand. Generic
            marketing doesn&apos;t cut it.
          </p>
          <p>
            <strong>AI-powered efficiency with human strategy.</strong> The
            smartest providers in 2026 use AI to produce content at scale while
            humans drive the strategy. This combination delivers
            enterprise-level output at small business prices. It&apos;s the only
            way to offer a full marketing team without charging full marketing
            team rates.
          </p>
          <p>
            At Venti Scale, that&apos;s exactly how we work. AI handles daily
            content creation and scheduling across every platform. Humans build
            the strategy, monitor performance, and make the decisions that
            algorithms can&apos;t. You get a{" "}
            <Link href="/#how">client portal</Link> showing exactly what&apos;s
            happening. Weekly reports with real numbers. And you don&apos;t
            touch any of it unless you want to.
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
                href="/blog/social-media-for-ecommerce-brands"
                className="blog-related-card"
              >
                <div className="related-title">
                  Most ecommerce brands post on social media wrong. Here&apos;s
                  what actually works.
                </div>
                <div className="related-meta">6 min read</div>
              </Link>
              <Link
                href="/blog/contractors-getting-clients-online"
                className="blog-related-card"
              >
                <div className="related-title">
                  You&apos;re a great contractor. Nobody knows it. Let&apos;s
                  fix that.
                </div>
                <div className="related-meta">6 min read</div>
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
