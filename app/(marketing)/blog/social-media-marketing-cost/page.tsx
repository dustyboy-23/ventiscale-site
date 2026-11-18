import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";
import { BlogCta } from "@/components/marketing/blog-cta";
import { SERVICES, money } from "@/lib/pricing";

export const metadata = {
  title: "How Much Does Social Media Management Cost in 2026?",
  description:
    "Social media management pricing for 2026: what agencies, freelancers and full-time hires cost, and what cheap packages leave out.",
  openGraph: {
    title: "Social media management pricing: what you'll pay in 2026",
    description:
      "Social media management pricing for 2026: what agencies, freelancers and full-time hires cost, and what cheap packages leave out.",
    url: "https://www.ventiscale.com/blog/social-media-marketing-cost",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Venti Scale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Social media management pricing: what you'll pay in 2026",
    description:
      "Social media management pricing for 2026: what agencies, freelancers and full-time hires cost, and what cheap packages leave out.",
    images: ["https://www.ventiscale.com/opengraph-image"],
  },
};

const SLUG = "social-media-marketing-cost";
const TITLE = "Social media management pricing: what you'll pay in 2026";
const DESCRIPTION =
  "Social media management pricing for 2026: what agencies, freelancers and full-time hires cost, and what cheap packages leave out.";
const PUBLISHED = "2026-04-18";
const DATE = "2026-11-18";
const IMAGE_URL = "https://www.ventiscale.com/opengraph-image";

// Every Venti Scale number on this page comes from lib/pricing.ts.
const social = SERVICES.find((s) => s.id === "social")!;
const postsPerMonth = social.weeks.reduce((total, week) => total + week.units, 0);
const costPerPost = Math.round(social.monthly / postsPerMonth);

const FAQ_DATA = [
  {
    q: "How much does social media management cost per month?",
    a: "Most agencies charge under $2,500 a month, with $1,000 to $2,499 the most common range. A freelancer's monthly cost depends on how many hours your account takes.",
  },
  {
    q: "How much does a freelance social media manager charge?",
    a: "Published estimates run from $20 to $150 an hour, depending on experience. Multiply the hourly rate by the hours your account needs each month to get your real cost.",
  },
  {
    q: "Is hiring a full-time social media manager cheaper than an agency?",
    a: "No. Median pay in a close federal job category is $78,760 a year before benefits, which is far more than most agency packages cost.",
  },
  {
    q: "What should a social media management package include?",
    a: "Content creation, scheduling and strategy should be in every package. Reporting and community management are common but not universal, so ask about both before you sign.",
  },
  {
    q: "Why are some social media plans so cheap?",
    a: "Cheap plans usually do less beyond the post itself. Customer replies, strategy and ads are often left out, so compare what's included and not just the price.",
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
              url: "https://www.ventiscale.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Venti Scale",
              url: "https://www.ventiscale.com",
            },
            datePublished: PUBLISHED,
            dateModified: DATE,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.ventiscale.com/blog/${SLUG}`,
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
                item: "https://www.ventiscale.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.ventiscale.com/blog",
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
          <Eyebrow>PRICING / SOCIAL MEDIA</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Social media management pricing: what you&apos;ll pay in 2026
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              Updated November 18, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        <div className="prose-blog">
          <p>
            Most agencies charge under $2,500 a month for social media
            management, and the most common price is $1,000 to $2,499. That
            comes from{" "}
            <a
              href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              HeyOrca&apos;s 2026 survey of almost 100 agencies
            </a>
            , where 49% landed in that range and another 31% charged under
            $1,000. But social media management pricing only means something
            once you know what the money buys.
          </p>
          <p>
            Below you&apos;ll see what each type of provider charges, what gets
            left out of cheap packages and how to compare two prices properly.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                <a
                  href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  80% of the agencies HeyOrca surveyed
                </a>{" "}
                charge under $2,500 a month.
              </li>
              <li>
                Freelancers tend to charge hourly.{" "}
                <a
                  href="https://sproutsocial.com/insights/social-media-management-cost/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sprout Social
                </a>{" "}
                estimates $20 to $150 an hour.
              </li>
              <li>
                Hiring in-house costs far more. A close federal wage category
                pays a median of{" "}
                <a
                  href="https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  $78,760 a year
                </a>{" "}
                before benefits.
              </li>
              <li>
                The gap comes down to the work involved, so ask who answers
                your customers before you compare prices.
              </li>
            </ul>
          </div>

          <h2 id="pricing-by-provider">
            Social media management pricing by who does the work
          </h2>
          <p>
            <strong>Agencies</strong>{" "}are the easiest group to pin down, because{" "}
            <a
              href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              HeyOrca asked them directly
            </a>
            . Most of the ranges you&apos;ll find online are estimates from
            companies selling social media services or software. That&apos;s
            why they&apos;re so wide. Agency prices break down like this.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">31%</div>
              <div className="stat-label">
                <a
                  href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  under $1,000 a month
                </a>
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">49%</div>
              <div className="stat-label">
                <a
                  href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  $1,000 to $2,499
                </a>
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">9%</div>
              <div className="stat-label">
                <a
                  href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  $2,500 to $4,999
                </a>
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3%</div>
              <div className="stat-label">
                <a
                  href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  more than $5,000
                </a>
              </div>
            </div>
          </div>

          <p>
            <strong>Freelancers</strong>{" "}often bill by the hour.{" "}
            <a
              href="https://sproutsocial.com/insights/social-media-management-cost/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sprout Social
            </a>{" "}
            puts freelance social media managers at $20 to $150 an hour, based
            on experience. That&apos;s an estimate, so treat it as a rough
            guide. Say a freelancer charges $50 an hour and spends 20 hours a
            month on your account. That comes to $1,000 a month.
          </p>
          <p>
            <strong>Done-for-you plans</strong>{" "}are flat monthly packages with
            a set number of posts. They&apos;re easy to compare, because you
            can divide the price by the posts. Say one plan costs $600 a month
            for 12 posts. That works out to $50 a post. Say another charges
            $900 for 20 posts. That&apos;s $45 a post. Those numbers are made
            up to show the math, but it works on any plan you&apos;re looking
            at. So the bigger monthly bill can be the better deal, as long as
            the work behind the posts is the same.
          </p>
          <p>
            <strong>A full-time hire</strong>{" "}costs the most. A close match in
            federal wage data is market research analysts and marketing
            specialists, with{" "}
            <a
              href="https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              median pay of $78,760 a year
            </a>{" "}
            in May 2025. Benefits come on top. Across private industry,{" "}
            <a
              href="https://www.bls.gov/news.release/ecec.nr0.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              benefits made up 30% of what employers spent on workers
            </a>{" "}
            in June 2026. If your hire&apos;s benefits match that average,
            $78,760 in pay turns into about $112,500 a year, or roughly $9,400
            a month. It&apos;s a broad category and a junior hire can cost
            less. But the gap is still big. Before you post a job, read{" "}
            <Link href="/blog/do-i-need-a-social-media-manager">
              whether you need a social media manager at all
            </Link>{" "}
            and the{" "}
            <Link href="/blog/marketing-agency-vs-in-house">
              agency vs in-house math
            </Link>
            .
          </p>
          <p>
            <strong>Doing it yourself</strong>{" "}looks cheapest because the tools
            are cheap.{" "}
            <a
              href="https://buffer.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buffer&apos;s Essentials plan
            </a>{" "}
            is $5 a month per channel, billed yearly.{" "}
            <a
              href="https://later.com/pricing/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Later&apos;s Starter plan
            </a>{" "}
            is $18.75 a month, billed yearly.{" "}
            <a
              href="https://www.hootsuite.com/plans"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hootsuite&apos;s Standard plan
            </a>{" "}
            is $99 per user a month on annual billing. But your time is the
            real bill. Say you spend 15 hours a month on it and your time&apos;s
            worth $40 an hour. That&apos;s $600 a month of work you aren&apos;t
            doing for customers.
          </p>

          <hr className="blog-divider" />

          <h2 id="what-drives-the-price">What actually drives the price</h2>
          <p>
            <a
              href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              HeyOrca&apos;s pricing guide
            </a>{" "}
            breaks a price down into the work behind it: how much content you
            need, how many channels you&apos;re on, whether someone builds your
            strategy and who replies to your customers. A package with eight
            simple posts is a very different job from one with 30 posts,
            short-form video and custom graphics.
          </p>
          <p>
            So a lower price usually means less work around each post. That
            isn&apos;t automatically bad. If you&apos;re happy answering your
            own comments, there&apos;s no reason to pay someone else to do it.
            You just want to know what you&apos;re giving up before you sign.
          </p>

          <hr className="blog-divider" />

          <h2 id="what-cheap-packages-leave-out">
            What cheap packages leave out
          </h2>
          <p>
            <a
              href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              HeyOrca&apos;s survey
            </a>{" "}
            also shows what agencies put in a package. Content creation (97%),
            scheduling (96%) and strategy (93%) are in almost all of them.
            After that the list gets shorter. And a low-priced plan has the
            most reason to trim it. Check these six things first.
          </p>
          <ul>
            <li>
              <strong>Replies to comments and DMs.</strong>{" "}
              <a
                href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                75% of agencies
              </a>{" "}
              include community management, so about one in four don&apos;t.
              It takes real time, which makes it an easy thing to cut from a
              cheap plan.
            </li>
            <li>
              <strong>Reporting.</strong>{" "}
              <a
                href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                81% of agencies
              </a>{" "}
              build it in, which leaves about one in five that don&apos;t.
            </li>
            <li>
              <strong>Strategy.</strong>{" "}
              <a
                href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                93% of agencies
              </a>{" "}
              cover it. If your plan doesn&apos;t, you&apos;re the one
              deciding what gets posted and why.
            </li>
            <li>
              <strong>Ads.</strong>{" "}Only{" "}
              <a
                href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                18% of agencies
              </a>{" "}
              put paid social in the package. And the ad spend is a separate
              bill on top of that.
            </li>
            <li>
              <strong>Video and extra channels.</strong>{" "}
              <a
                href="https://www.heyorca.com/blog/how-to-price-social-media-services-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                HeyOrca&apos;s respondents
              </a>{" "}
              named video and creative production, plus additional content or
              profiles, as common extras. Ask what each one adds to your bill.
            </li>
            <li>
              <strong>Setup fees.</strong>{" "}Many providers charge a one-time fee
              to get your account started. Ask for the number up front so it
              doesn&apos;t surprise you.
            </li>
          </ul>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Comparing two plans on the monthly price alone. A plan that looks
              cheaper can cost more once you add setup, extra channels and the
              hours you&apos;ll spend answering customers yourself.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="how-to-compare">How to compare two prices</h2>
          <p>
            Run every plan you&apos;re looking at through the same five checks.
            It takes a few minutes and it&apos;ll show you which price is
            really lower.
          </p>
          <ol>
            <li>
              <strong>Get the cost per post.</strong>{" "}Divide what you&apos;d pay
              each month by the number of posts.
            </li>
            <li>
              <strong>Work out the first year.</strong>{" "}Say a plan costs $500 a
              month with a $300 setup fee. Your first year costs $6,300.
            </li>
            <li>
              <strong>Count your channels.</strong>{" "}Add the fee for any channel
              the plan doesn&apos;t cover.
            </li>
            <li>
              <strong>Find out who talks to your customers.</strong>{" "}If
              that&apos;s still you, budget the hours.
            </li>
            <li>
              <strong>Ask what you keep if you leave.</strong>{" "}Your accounts,
              logins and content should stay yours.
            </li>
          </ol>

          <hr className="blog-divider" />

          <h2 id="which-option-fits">Which option fits your business</h2>
          <p>
            The best pick depends on how much of the work you want off your
            plate.
          </p>
          <ul>
            <li>
              <strong>A flat posting plan</strong>{" "}works when you just need
              your pages active and you&apos;re fine answering customers
              yourself.
            </li>
            <li>
              <strong>A freelancer</strong>{" "}suits you if having one person
              learn your business matters and you&apos;ve got time to manage
              them.
            </li>
            <li>
              <strong>An agency</strong>{" "}makes sense when strategy, content,
              reporting and replies all need to sit in one place.
            </li>
            <li>
              <strong>A full-time hire</strong>{" "}only pays off if social media
              is a main way you sell and there&apos;s a full week of work every
              week.
            </li>
            <li>
              <strong>Doing it yourself</strong>{" "}is the right call when
              you&apos;ve got more time than money and you&apos;ll actually
              keep it up.
            </li>
          </ul>
          <p>
            Still working out what you can afford? Start with a{" "}
            <Link href="/blog/small-business-marketing-budget-template">
              small business marketing budget
            </Link>{" "}
            and fit social media into it.
          </p>

          <hr className="blog-divider" />

          <h2 id="what-my-plan-costs">What my plan costs</h2>
          <p>
            My{" "}
            <Link href="/social-media-management">
              social media management pricing
            </Link>{" "}
            is one flat plan: {money(social.monthly)}{" "}a month, plus a one-time{" "}
            {money(social.setup)}{" "}setup fee. At {postsPerMonth}{" "}posts a month,
            that&apos;s about {money(costPerPost)}{" "}a post.
          </p>
          <p>You get:</p>
          <ul>
            {social.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>What setup covers: {social.setupCovers}</p>
          <p>
            Not included: {social.notIncluded}{" "}If you want someone answering
            your DMs every day, you&apos;ll want a plan that does it.
          </p>

          <hr className="blog-divider" />

          <div className="blog-faq">
            <h2>Frequently asked questions</h2>
            {FAQ_DATA.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>

          <BlogAuthorBio lastUpdated={DATE} />
          <BlogCta />
        </div>
      </article>
    </>
  );
}
