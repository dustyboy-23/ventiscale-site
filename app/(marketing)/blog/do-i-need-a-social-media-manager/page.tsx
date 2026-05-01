import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Do I need a social media manager? 7 questions to ask first | Venti Scale",
  description:
    "Do I need a social media manager? These 7 questions will tell you. If 3+ answers are yes, it's time.",
  openGraph: {
    title: "Do I need a social media manager? 7 questions to ask yourself first",
    description:
      "Do I need a social media manager? These 7 questions will tell you. If 3+ answers are yes, it's time.",
    url: "https://www.ventiscale.com/blog/do-i-need-a-social-media-manager",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/social-media-manager.jpg",
        width: 1200,
        height: 630,
        alt: "Small business owner deciding whether to hire a social media manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Do I need a social media manager? 7 questions to ask yourself first",
    description:
      "Do I need a social media manager? These 7 questions will tell you. If 3+ answers are yes, it's time.",
    images: ["https://www.ventiscale.com/blog/social-media-manager.jpg"],
  },
};

const SLUG = "do-i-need-a-social-media-manager";
const TITLE =
  "Do I need a social media manager? 7 questions to ask yourself first";
const DESCRIPTION =
  "Do I need a social media manager? These 7 questions will tell you. If 3+ answers are yes, it's time.";
const DATE = "2026-04-18";
const IMAGE = "/blog/social-media-manager.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "How much does a social media manager cost for a small business?",
    a: "A freelance social media manager costs $800 to $2,500 per month for most small businesses. An in-house hire runs $60,000 to $75,000 per year before benefits and tools. An AI-powered agency like Venti Scale falls in the $500 to $1,500 range with broader coverage than a solo freelancer.",
  },
  {
    q: "What does a social media manager actually do?",
    a: "A social media manager handles strategy, content creation, scheduling, community engagement, analytics, and monthly reporting. They don&apos;t just post for you. They plan what to post, when to post it, track what works, and adjust the strategy based on data every month.",
  },
  {
    q: "Should I hire a freelancer or an agency for social media management?",
    a: "Freelancers work well for 1-2 platforms with simple needs. Agencies are better for multi-platform strategies, consistent coverage, and reporting. The deciding factor is scope. If you need content across 3+ platforms plus analytics, an agency provides more structure at a comparable price point.",
  },
  {
    q: "When is the right time to hire a social media manager?",
    a: "The right time is when you answer yes to 3 or more of these: you post fewer than 5 times a week, you spend more than 6 hours weekly on social, you can&apos;t connect social to revenue, and your brand looks inconsistent across platforms. Most businesses wait too long. The cost of invisibility compounds every month.",
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
          <Eyebrow>SOCIAL MEDIA / HIRING</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Do I need a social media manager? 7 questions to ask yourself first
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 18, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              8 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src={IMAGE}
            alt="Small business owner reviewing social media analytics on laptop"
          />
        </div>

        <div className="prose-blog">
          <p>
            Monday morning. You remember you haven&apos;t posted in a week. You open
            Instagram, stare at the blank caption box for 20 minutes, slap up a photo
            of your desk with &quot;Happy Monday!&quot; and close the app. Nobody likes
            it. You don&apos;t check back until Thursday.
          </p>
          <p>
            This cycle repeats every week. You know social media matters. You just
            can&apos;t keep up with it while also running your actual business. And
            you&apos;re starting to wonder: do I need a social media manager, or
            should I just push through and figure it out myself?
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                If you&apos;re spending 6+ hours a week on social media and it&apos;s
                not generating leads, you&apos;re paying for help you&apos;re not getting
              </li>
              <li>
                An in-house social media manager costs $60K-$75K per year. Outsourced
                management runs $800-$2,500 per month.
              </li>
              <li>
                76% of consumers check your social media before buying. An inconsistent
                feed is a closed sign.
              </li>
              <li>
                Answer these 7 questions honestly. If 3 or more are yes, stop
                doing it yourself.
              </li>
            </ul>
          </div>

          <p>
            If you&apos;re asking &quot;do I need a social media manager,&quot; the answer
            is almost always yes. The real question is whether you hire someone in-house,
            outsource to an agency, or keep burning your own hours on something that
            isn&apos;t moving the needle. These 7 questions will give you a clear answer.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">76%</div>
              <div className="stat-label">of buyers check social before purchasing</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">6 hrs</div>
              <div className="stat-label">avg weekly time owners spend on social</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$65K</div>
              <div className="stat-label">avg in-house social media manager salary</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="posting-consistently">1. Are you posting at least 5 times a week?</h2>
          <p>
            Not 5 times when you feel inspired. Five times every single week. The
            algorithm rewards consistency above everything else. Brands posting 5+
            times per week see 2.5x higher conversion from social traffic compared to
            those posting once or twice.
          </p>
          <p>
            Most small business owners know this. They also know they haven&apos;t
            posted since last Tuesday. If your posting schedule looks like a heart
            monitor, that&apos;s your first yes.
          </p>

          <h2 id="content-strategy">2. Do you have a content strategy or are you just winging it?</h2>
          <p>
            Opening Instagram and thinking &quot;what should I post today?&quot; is
            not a strategy. A strategy means you know your content pillars, your
            posting schedule, which platforms matter for your audience, and what each
            post is trying to accomplish.
          </p>
          <p>
            Random posting produces random results. If you don&apos;t have a content
            calendar planned at least two weeks out, you&apos;re winging it. That&apos;s
            a yes.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Posting the same content across every platform with no adjustments.
              LinkedIn audiences want different things than Instagram audiences. A{" "}
              <Link href="/blog/automate-social-media-without-losing-voice">
                good social media strategy adapts content for each platform
              </Link>{" "}
              while keeping your brand voice consistent.
            </p>
          </div>

          <h2 id="revenue-connection">3. Can you connect your social media to actual revenue?</h2>
          <p>
            Likes are not revenue. Followers are not revenue. If someone asks you
            &quot;how many customers did social media bring you last month?&quot;
            and you can&apos;t answer, that&apos;s a problem.
          </p>
          <p>
            A social media manager tracks conversion paths. They know which posts
            drive website visits, which drive DMs, and which drive actual purchases.
            Without that data, you&apos;re flying blind. You might be doing great.
            You might be wasting every hour. You literally don&apos;t know.
          </p>

          <hr className="blog-divider" />

          <h2 id="time-spent">4. Are you spending more than 6 hours a week on it?</h2>
          <p>
            43% of small business owners spend about 6 hours per week on social
            media. That&apos;s 312 hours a year. If your time is worth $50 an hour,
            that&apos;s $15,600 in opportunity cost annually.
          </p>
          <p>
            For context, outsourced social media management starts around{" "}
            <Link href="/blog/done-for-you-social-media-management">$800 to
            $2,500 per month</Link>. Even at the high end, that&apos;s $30,000 a
            year. But you get those 312 hours back. Hours you could spend on sales,
            product development, or literally anything that generates revenue directly.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              According to{" "}
              <a
                href="https://www.glassdoor.com/Salaries/social-media-manager-salary-SRCH_KO0,20.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Glassdoor&apos;s 2026 salary data
              </a>
              , the average in-house social media manager earns $71,720 per year.
              Add benefits, software subscriptions, and management overhead, and
              you&apos;re looking at $90,000+ total cost. Outsourcing gives you the
              same output for a fraction of that.
            </p>
          </div>

          <h2 id="platform-changes">5. Do you know what changed on Instagram last month?</h2>
          <p>
            Instagram tweaked its algorithm. LinkedIn changed its reach formula.
            TikTok updated its creator tools. Facebook adjusted its ad targeting
            options. This happens every month. Sometimes every week.
          </p>
          <p>
            Keeping up with platform changes is a job in itself. If you didn&apos;t
            know about any of those changes, your content is probably getting less
            reach than it should. A social media manager lives in these platforms
            daily and adjusts strategy in real time.
          </p>

          <h2 id="brand-consistency">6. Does your brand look professional across every platform?</h2>
          <p>
            Pull up your Facebook page, your Instagram, and your LinkedIn right now.
            Do they look like the same business? Same tone, same visual quality, same
            level of professionalism?
          </p>
          <p>
            76% of consumers check a business&apos;s social media before making a
            purchase. If your Instagram is polished but your Facebook looks abandoned,
            you just lost that customer. Consistency across platforms builds trust.
            Inconsistency builds doubt. This is the same reason{" "}
            <Link href="/blog/marketing-agency-vs-in-house">
              many businesses choose an agency over a single hire
            </Link>. Agencies cover all platforms. One employee usually doesn&apos;t.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">5x/week</div>
              <div className="stat-label">minimum posts for algorithm visibility</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">312 hrs</div>
              <div className="stat-label">per year spent on DIY social media</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$90K+</div>
              <div className="stat-label">total cost of in-house social hire</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="opportunity-cost">7. Is social media stealing time from running your business?</h2>
          <p>
            This is the big one. Every hour you spend creating a Reel or designing
            a carousel is an hour you didn&apos;t spend on the thing that actually
            makes you money. For contractors, that&apos;s quoting jobs. For coaches,
            that&apos;s running sessions. For ecommerce brands, that&apos;s sourcing
            products and fulfilling orders.
          </p>
          <p>
            Social media is important. But it&apos;s not your job. Your job is
            running the business. The question isn&apos;t whether social media matters.
            It&apos;s whether you&apos;re the right person to be doing it.
          </p>

          <h2 id="what-to-do-next">You need a social media manager. Now what?</h2>
          <p>
            If you answered yes to 3 or more of those questions, you&apos;ve already
            made the decision. You just haven&apos;t acted on it yet.
          </p>
          <p>
            You have three options. Hire someone in-house at $65K+ per year. Hire a
            freelancer at $25 to $100 per hour. Or bring on an agency that handles
            everything for a flat monthly fee.
          </p>
          <p>
            At Venti Scale, we run your entire social media operation. Strategy,
            content creation, scheduling, engagement, reporting. You get a{" "}
            <Link href="/#how">client portal</Link> showing exactly what&apos;s
            happening and a weekly report proving it&apos;s working. No learning
            curve. No hiring process. Your social media goes from inconsistent to
            professional in a week. If you&apos;re weighing this against the
            broader category, here&apos;s the full picture on{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>
            .
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
                href="/blog/signs-you-should-stop-diy-marketing"
                className="blog-related-card"
              >
                <div className="related-title">
                  5 signs you should stop DIY-ing your marketing (and what to do instead)
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
              <Link
                href="/blog/done-for-you-social-media-management"
                className="blog-related-card"
              >
                <div className="related-title">
                  Done-for-you social media management: what you get when you stop
                  doing it yourself
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
