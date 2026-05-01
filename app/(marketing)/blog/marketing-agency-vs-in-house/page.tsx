import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SLUG = "marketing-agency-vs-in-house";
const TITLE =
  "Marketing agency vs in-house: the math nobody shows you";
const DESCRIPTION =
  "Both options leak money. One kills your runway in 90 days. Here's the honest cost breakdown most agencies hide.";
const DATE = "2026-04-15";
const IMAGE = "/blog/agency-vs-inhouse.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "How much does it cost to hire a full-time marketing person?",
    a: "A full-time marketing manager costs $95,000 to $160,000 per year when you include salary, benefits, payroll taxes, and overhead. The base salary averages $76,000 to $122,000 depending on the source, but total cost of employment adds 25-40% on top of that. And that's one person covering one or two channels.",
  },
  {
    q: "How much does a marketing agency cost per month for a small business?",
    a: "Most small businesses pay between $1,500 and $5,000 per month for a marketing agency retainer in 2026. Social media management specifically runs $500 to $2,000 per month. That's $18,000 to $60,000 per year for a full team versus $95,000+ for one employee.",
  },
  {
    q: "When should a small business hire in-house marketing instead of an agency?",
    a: "Hire in-house when you're spending over $10,000 per month on agency fees and need someone embedded in your business full-time. For most businesses under $2M in annual revenue, an agency gives you more expertise per dollar. The breakeven point is typically around $150,000 in annual marketing spend.",
  },
  {
    q: "Can a marketing agency replace an entire in-house marketing team?",
    a: "Yes. A single agency replaces 2-4 in-house roles for most small businesses. You get strategists, content creators, designers, and analysts for the price of one mid-level employee. 78% of agencies operate on monthly retainers in 2026, meaning you get consistent, full-service execution without the HR overhead.",
  },
];

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
        alt: "Marketing agency vs in-house cost comparison for small businesses",
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
          <Eyebrow>SMALL BUSINESS / MARKETING COSTS</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Marketing agency vs in-house: the math nobody shows you
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 15, 2026
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
            alt="Cost comparison spreadsheet showing marketing agency vs in-house hiring expenses"
          />
        </div>

        <div className="prose-blog">
          <p>
            You&apos;re spending 12 hours a week on marketing. It&apos;s not
            working. So you start thinking about getting help. And that&apos;s
            where the real question hits: do you hire someone, or do you hire an
            agency?
          </p>
          <p>
            Most business owners get this wrong because they compare the wrong
            numbers. They look at a salary and compare it to a retainer. But
            salary is maybe 60% of what an employee actually costs. The rest is
            hidden. And it adds up fast.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                A full-time marketing hire costs $95,000 to $160,000 per year
                after salary, benefits, taxes, tools, and overhead.
              </li>
              <li>
                A marketing agency costs $1,500 to $5,000 per month for most
                small businesses. That&apos;s $18K-$60K per year.
              </li>
              <li>
                One employee covers 1-2 channels. An agency gives you a full
                team across every platform for less money.
              </li>
              <li>
                In-house makes sense above $2M revenue. Below that, the
                marketing agency vs in-house cost math favors agencies every
                time.
              </li>
            </ul>
          </div>

          <p>
            The real cost of marketing agency vs in-house comes down to one
            thing: what you get per dollar spent. An in-house hire gives you one
            person. An agency gives you a team. For most small businesses under
            $2M in revenue, the agency wins on pure math before you even talk
            about quality.
          </p>

          <h2>What a marketing hire actually costs (it&apos;s not just salary)</h2>
          <p>
            Open up a job posting for &quot;marketing manager&quot; and
            you&apos;ll see salaries ranging from $76,000 to $122,000 depending
            on the market. ZipRecruiter puts the 2026 average at $83,488.
            Salary.com says $121,657. Glassdoor lands at $106,045.
          </p>
          <p>
            Pick any of those numbers. Now add 25-40% for the stuff that
            doesn&apos;t show up in the job posting.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$95K+</div>
              <div className="stat-label">
                True cost of one marketing hire per year
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">29.8%</div>
              <div className="stat-label">
                Of compensation goes to benefits (BLS)
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$4,700</div>
              <div className="stat-label">
                Average cost just to recruit one hire (SHRM)
              </div>
            </div>
          </div>

          <p>
            According to the{" "}
            <a
              href="https://www.bls.gov/news.release/pdf/ecec.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bureau of Labor Statistics
            </a>
            , benefits cost employers an average of $23,696 per worker per year.
            That&apos;s health insurance, retirement contributions, paid leave,
            and legally required taxes. Then add the tools. Marketing software
            alone runs $3,000 to $12,000 per year. Think scheduling platforms,
            design tools, analytics subscriptions, SEO software, email
            platforms. Your employee needs all of them.
          </p>
          <p>
            Then there&apos;s the hiring cost itself. SHRM puts the average
            cost-per-hire at $4,700. For specialized marketing roles, it can hit
            $20,000 when you factor in job boards, recruiter fees, and the weeks
            of interviews.
          </p>

          <div className="blog-warning">
            <div className="callout-label">The hidden cost nobody mentions</div>
            <p>
              Training and ramp-up time. A new marketing hire takes 3-6 months
              to learn your brand, your audience, and your voice. During that
              ramp, you&apos;re paying full salary for half-speed output. If
              they leave after a year, you start over.
            </p>
          </div>

          <p>
            Here&apos;s what the full picture looks like for a marketing manager
            earning $90,000 base:
          </p>
          <ul>
            <li>Base salary: $90,000</li>
            <li>Benefits (29.8%): $26,820</li>
            <li>Marketing tools and software: $6,000</li>
            <li>Recruiting cost (amortized): $4,700</li>
            <li>Office/equipment overhead: $5,000</li>
            <li>
              <strong>Total year one: $132,520</strong>
            </li>
          </ul>
          <p>
            And that&apos;s one person. One person who probably specializes in
            one or two channels. Need social media AND email AND content AND
            ads? That&apos;s not one hire. That&apos;s three or four. This is
            the same math that makes{" "}
            <Link href="/blog/done-for-you-marketing-vs-diy">
              DIY marketing so expensive
            </Link>{" "}
            once you count your own time.
          </p>

          <hr className="blog-divider" />

          <h2>
            What a marketing agency actually costs
          </h2>
          <p>
            Agency pricing varies, but the ranges are well documented. For a
            small business, here&apos;s what 2026 looks like:
          </p>
          <ul>
            <li>Social media management: $500 to $2,000/month</li>
            <li>Content marketing: $1,000 to $3,000/month</li>
            <li>Full-service retainer: $1,500 to $5,000/month</li>
            <li>Multi-channel execution: $3,000 to $7,000/month</li>
          </ul>
          <p>
            Take the middle of that range. A solid full-service agency retainer
            for a small business runs around $3,000 per month. That&apos;s
            $36,000 per year. Compare that to $132,520 for one employee.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$36K</div>
              <div className="stat-label">
                Agency retainer per year (mid-range)
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$132K</div>
              <div className="stat-label">
                One in-house marketing hire per year
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3.7x</div>
              <div className="stat-label">
                More expensive to hire in-house
              </div>
            </div>
          </div>

          <p>
            For that agency retainer, you typically get a strategist, content
            creators, a designer, and an analytics person. That&apos;s a team
            of 3-5 people working on your business for less than the cost of one
            junior marketer. If you&apos;re weighing this against the broader
            category, here&apos;s the full picture on{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>
            .
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              78% of marketing agencies operate on monthly retainers in 2026, up
              from 64% in 2023. This means predictable costs, no surprise
              invoices, and the ability to cancel if it&apos;s not working. Try
              that with a W-2 employee.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>What you actually get: one person vs. a full team</h2>
          <p>
            This is where the comparison gets brutal. A single marketing hire is
            one brain. They know what they know. If they&apos;re great at social
            media, they&apos;re probably average at email. If they&apos;re a
            content wizard, they probably can&apos;t run paid ads.
          </p>
          <p>
            An agency brings specialists for each channel. The person writing
            your Instagram captions isn&apos;t the same person building your
            email sequences. And neither of them is the strategist deciding where
            to spend your budget.
          </p>
          <p>
            Here&apos;s a rough comparison of what each option covers:
          </p>
          <ul>
            <li>
              <strong>One marketing hire:</strong> 1-2 channels, limited design
              skills, no backup when sick or on vacation, single perspective on
              strategy
            </li>
            <li>
              <strong>Marketing agency:</strong> 4-6 channels, dedicated
              designers, coverage 365 days a year, multiple strategists who&apos;ve
              seen what works across dozens of businesses
            </li>
          </ul>
          <p>
            That cross-business experience matters more than people think. An
            agency that runs marketing for 20 small businesses knows which
            strategies work right now. Not last year. Not in theory. Right now.
            Your in-house hire is learning as they go. This is exactly why{" "}
            <Link href="/blog/what-ai-marketing-agency-does">
              AI marketing agencies
            </Link>{" "}
            can move so fast. They combine that experience with AI tools that
            handle execution at scale.
          </p>

          <hr className="blog-divider" />

          <h2>When in-house actually makes sense</h2>
          <p>
            Agencies aren&apos;t the right call for everyone. In-house hiring
            makes sense in specific situations:
          </p>
          <ul>
            <li>
              <strong>You&apos;re above $2M in annual revenue</strong> and
              marketing is a core function, not a side project
            </li>
            <li>
              <strong>You&apos;re spending $10,000+/month</strong> on agency
              fees and need tighter integration with your team
            </li>
            <li>
              <strong>Your product requires deep technical knowledge</strong>{" "}
              that takes months to learn and changes constantly
            </li>
            <li>
              <strong>You need someone on-site</strong> for events, photo
              shoots, or real-time content
            </li>
          </ul>
          <p>
            Even then, the smartest play is usually hybrid. Keep a marketing
            manager in-house for strategy and brand voice, then use an agency
            for execution. You get the best of both worlds without building a
            five-person department.
          </p>

          <div className="blog-callout">
            <div className="callout-label">The hybrid trend</div>
            <p>
              Most companies in 2026 are moving toward hybrid marketing
              ecosystems. Internal teams handle strategy while agencies handle
              execution. It&apos;s the most sustainable model for businesses
              between $1M and $10M in revenue.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>The question nobody asks (but should)</h2>
          <p>
            When business owners compare agency vs in-house, they focus on cost.
            That makes sense. But the real question is: what happens to your
            time?
          </p>
          <p>
            Hiring in-house means you&apos;re now a manager. You&apos;re
            reviewing work, giving feedback, approving content, running 1-on-1s,
            handling performance reviews. That&apos;s 5-10 hours a week of your
            time that didn&apos;t exist before. For a business owner, those
            hours have a dollar value. If you&apos;re billing $150/hour for
            your actual work, managing a marketing employee costs you $39,000 to
            $78,000 per year in lost productivity. Add that to the $132K
            employee cost and the real number is north of $170K.
          </p>
          <p>
            An agency handles itself. You get a weekly report, you review the
            results, you give direction when you want to. That&apos;s 1-2 hours
            a week, not 10. It&apos;s the same reason{" "}
            <Link href="/blog/what-done-for-you-marketing-includes">
              done-for-you marketing
            </Link>{" "}
            exists. The value isn&apos;t just the work. It&apos;s the time you
            get back.
          </p>

          <hr className="blog-divider" />

          <h2>How to decide (without overthinking it)</h2>
          <p>
            Forget the 47-point comparison chart. Here&apos;s the shortcut:
          </p>
          <ul>
            <li>
              <strong>Revenue under $500K?</strong> Agency or{" "}
              <Link href="/blog/done-for-you-social-media-management">
                done-for-you social media
              </Link>
              . No question.
            </li>
            <li>
              <strong>Revenue $500K to $2M?</strong> Agency for everything.
              Reinvest the savings into growth.
            </li>
            <li>
              <strong>Revenue $2M to $5M?</strong> Hybrid. One in-house
              strategist plus an agency for execution.
            </li>
            <li>
              <strong>Revenue above $5M?</strong> Build a small in-house team
              with agency support for specialized work.
            </li>
          </ul>
          <p>
            At Venti Scale, we built our service specifically for that first
            group. Businesses doing under $2M that need professional marketing
            without the $132K price tag. AI handles the execution. Human
            strategists handle the thinking. You get a full marketing
            department for less than the cost of one part-time hire. No
            contracts. No 6-month commitments. Just results you can measure
            in your{" "}
            <Link href="/#how">client portal</Link> every week.
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
                href="/blog/done-for-you-marketing-vs-diy"
                className="blog-related-card"
              >
                <div className="related-title">
                  Done-for-you marketing vs. DIY: the real cost comparison for
                  small businesses
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/ai-cutting-marketing-costs"
                className="blog-related-card"
              >
                <div className="related-title">
                  How AI is cutting marketing costs by 60% for small businesses
                  in 2026
                </div>
                <div className="related-meta">8 min read</div>
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
