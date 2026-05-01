import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Which social media platform should your small business focus on? | Venti Scale",
  description:
    "Stop trying to be on every platform. Here's how to pick the best social media platform for your small business based on who you serve.",
  openGraph: {
    title: "Which social media platform should your small business actually focus on?",
    description:
      "Stop trying to be on every platform. Here's how to pick the best social media platform for your small business based on who you serve.",
    url: "https://www.ventiscale.com/blog/which-social-media-platform-for-business",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/which-platform-business.jpg",
        width: 1200,
        height: 630,
        alt: "Best social media platform for small business decision framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Which social media platform should your small business actually focus on?",
    description:
      "Stop trying to be on every platform. Here's how to pick the best social media platform for your small business based on who you serve.",
    images: ["https://www.ventiscale.com/blog/which-platform-business.jpg"],
  },
};

const SLUG = "which-social-media-platform-for-business";
const TITLE =
  "Which social media platform should your small business actually focus on?";
const DESCRIPTION =
  "Stop trying to be on every platform. Here's how to pick the best social media platform for your small business based on who you serve.";
const DATE = "2026-04-19";

const FAQ_DATA = [
  {
    q: "What is the best social media platform for a small business?",
    a: "Facebook is the best single platform for 70% of small businesses because it has 3.07 billion monthly users and the strongest reach for local, service, and ecommerce brands. B2B companies should start with LinkedIn instead, since 85% of B2B marketers name it their top-performing channel.",
  },
  {
    q: "How many social media platforms should a small business be on?",
    a: "Two platforms. Pick one primary platform where your audience actually lives, and one secondary to repurpose content to. Businesses trying to run 4 or more platforms post inconsistently on all of them and grow on none. Focused beats spread every time.",
  },
  {
    q: "Is TikTok worth it for small businesses in 2026?",
    a: "Yes, if your audience is under 40 and you can commit to 3-5 short videos per week. 71% of brands are now active on TikTok. Skip it if your customers are over 50, if you sell to other businesses, or if you can&apos;t realistically produce video content every week.",
  },
  {
    q: "Should small businesses be on LinkedIn?",
    a: "Only if you sell to other businesses, other professionals, or high-ticket services over $5,000. LinkedIn users have 2x the buying power of the average social audience, but engagement drops hard for consumer brands. Retail, restaurants, and local services should skip it.",
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
            image: "https://www.ventiscale.com/blog/which-platform-business.jpg",
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
          <Eyebrow>STRATEGY / SOCIAL MEDIA</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Which social media platform should your small business actually focus on?
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 19, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src="/blog/which-platform-business.jpg"
            alt="Small business owner deciding between social media platforms on a laptop"
          />
        </div>

        <div className="prose-blog">
          <p>
            Everyone says you need to be on 6 platforms. That&apos;s the fastest way
            to burn out and end up posting on none of them.
          </p>
          <p>
            The best social media platform for small business isn&apos;t the one
            with the most users. It&apos;s the one where your actual customers are
            paying attention, and the one you can realistically show up on every
            single week without wanting to quit.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Pick 2 platforms max. One primary where your audience lives, one
                secondary for repurposing.
              </li>
              <li>
                Facebook still wins for local, retail, and service businesses.
                3.07 billion monthly users and 70% of marketers say it has the
                biggest impact.
              </li>
              <li>
                LinkedIn is for B2B only. 85% of B2B marketers call it their top
                channel. Skip it if you sell to consumers.
              </li>
              <li>
                Instagram and TikTok win for visual, lifestyle, and anything
                targeting under 40. YouTube wins for anything you can explain on
                camera.
              </li>
            </ul>
          </div>

          <p>
            For most small businesses, the right answer is Facebook as your
            primary, plus one other platform that matches how your customers
            actually consume content. That&apos;s it. Stop trying to do six.
          </p>

          <h2>Why being on every platform is killing your results</h2>
          <p>
            The math on running six platforms doesn&apos;t work. Each one needs 3-5
            posts a week, native content that fits the format, and engagement
            on comments and DMs. That&apos;s 20-30 hours a week if you do it
            right. Most owners running this playbook end up posting once a week
            on each, which is worse than posting 5x a week on one.
          </p>
          <p>
            The algorithm on every platform penalizes inconsistency. A Facebook
            page that posts daily for two weeks then goes dark for a month gets
            buried. The same goes for Instagram, LinkedIn, and TikTok. Five
            half-dead accounts look less credible than one active one.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Cross-posting the same content to every platform with no changes.
              A LinkedIn post with hashtags at the bottom doesn&apos;t work on
              Instagram. A TikTok video posted as a square on Facebook tanks.
              Native content per platform or don&apos;t bother.
            </p>
          </div>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">96%</div>
              <div className="stat-label">Of small businesses use social media</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3x</div>
              <div className="stat-label">Faster growth for active brands</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">2-4</div>
              <div className="stat-label">Platforms most pros recommend</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>The decision framework: pick your primary in 30 seconds</h2>
          <p>
            Before you read the platform breakdowns, answer two questions. Who
            buys from you, and how do they shop? The answer points you at one
            platform. Everything else is noise.
          </p>

          <p>
            <strong>If you sell to consumers in a local area</strong> (plumbers,
            roofers, restaurants, gyms, dentists), Facebook is your primary.
            It&apos;s where local search, reviews, community groups, and
            neighborhood word of mouth all collide. Instagram is your secondary
            if you have anything visual to show.
          </p>

          <p>
            <strong>If you sell physical products online</strong> (ecommerce,
            DTC brands, makers), Instagram is your primary and TikTok is your
            secondary. Facebook still works for ads. Focus the organic effort
            on the places where people discover products through visuals. This
            is exactly the playbook we break down in our post on{" "}
            <Link href="/blog/social-media-for-ecommerce-brands">
              what actually works on social for ecommerce brands
            </Link>
            .
          </p>

          <p>
            <strong>If you sell to other businesses or sell high-ticket
            services</strong> ($5K+ engagements, B2B SaaS, consulting,
            agencies), LinkedIn is your primary. Nothing else comes close for
            B2B decision makers. Your secondary is YouTube if you can do long
            form, or X if your audience is technical.
          </p>

          <p>
            <strong>If you&apos;re a coach or creator building a personal
            brand</strong>, Instagram plus one video platform (TikTok or
            YouTube Shorts). Your face sells your program. Same logic
            we cover in{" "}
            <Link href="/blog/why-coaches-need-social-media">
              why coaches need social media to stay visible
            </Link>
            .
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              According to{" "}
              <a
                href="https://sproutsocial.com/insights/new-social-media-demographics/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sprout Social&apos;s 2026 demographics research
              </a>
              , small businesses that match platform to customer demographic
              see 3x higher engagement than those who pick based on personal
              preference or platform size alone.
            </p>
          </div>

          <h2>Facebook: still the safe default for most local businesses</h2>
          <p>
            Facebook has 3.07 billion monthly active users. It&apos;s the
            biggest single audience on earth and the #1 platform for product
            discovery. 70% of marketing leaders say Facebook has the strongest
            impact on their business compared to any other platform.
          </p>
          <p>
            Where it wins: local service businesses, retail, restaurants,
            nonprofits, community-driven brands, anyone selling to customers
            over 35. Facebook Groups and Marketplace drive real sales that
            Instagram doesn&apos;t. Reviews show up in Google results. Events
            actually get attended.
          </p>
          <p>
            Where it loses: Gen Z under 25 are barely on Facebook anymore. If
            your customer is a 22-year-old college student, you&apos;re wasting
            your time here.
          </p>

          <h2>Instagram: visual brands and anyone under 40</h2>
          <p>
            3 billion monthly users. 79% of marketers use it. Instagram is the
            go-to for brands where what the product looks like actually
            matters: fashion, beauty, food, fitness, home goods, travel,
            lifestyle anything.
          </p>
          <p>
            Reels are the cheat code right now. The algorithm pushes Reels to
            non-followers hard, which means a new account can reach thousands
            of people in a week without ads. Carousels still work for educational
            content. Static posts are mostly dead.
          </p>
          <p>
            Where it loses: service businesses with nothing visual to show,
            B2B, and anyone selling to customers over 55.
          </p>

          <h2>LinkedIn: the B2B kingmaker, useless for consumer brands</h2>
          <p>
            LinkedIn is where professional decisions get made. 85% of B2B
            marketers name it their highest-performing channel. Its users have
            2x the buying power of the average social audience. Four out of
            five LinkedIn members drive business decisions at their company.
          </p>
          <p>
            Where it wins: B2B SaaS, consulting, agencies, recruiters, coaches
            targeting professionals, anyone selling anything over $5K.
            Thought leadership, case studies, and founder content all convert
            hard here.
          </p>
          <p>
            Where it loses: retail, restaurants, local services, consumer
            products under $100. If your customer isn&apos;t making a business
            decision, LinkedIn is dead weight.
          </p>

          <h2>TikTok and YouTube: where video buys attention</h2>
          <p>
            71% of brands are active on TikTok. It&apos;s not just for dancing
            teens anymore. Local businesses are going viral teaching homeowners
            what plumbers don&apos;t want them to know. Ecommerce brands are
            doing seven figures off organic TikTok alone.
          </p>
          <p>
            TikTok wins for anyone under 40 as the target audience and anyone
            willing to post 3-5 short videos a week. It loses for customers
            over 55 and for brands that refuse to show a human face.
          </p>
          <p>
            YouTube has 2.5 billion users and the longest content shelf life of
            any platform. A YouTube video you publish today can still drive
            leads three years from now. It wins for anything you can explain in
            8-15 minutes: tutorials, reviews, how-tos, demos, explainer content.
            66% of Gen Z engage with brands on YouTube.
          </p>

          <figure className="blog-image">
            <img
              src="/blog/automate-social-media.jpg"
              alt="Multi-platform content workflow for small business"
            />
            <figcaption>
              Running multiple platforms only works if you have a content system that repurposes automatically.
            </figcaption>
          </figure>

          <hr className="blog-divider" />

          <h2>What picking one platform actually looks like</h2>
          <p>
            Say you run a local landscaping company. Customer is a 45-year-old
            homeowner with disposable income. Primary is Facebook. You post 5x a
            week: before-and-after photos, quick tips (&quot;3 signs your
            sprinkler system is leaking&quot;), a weekly video walk-around of a
            finished yard, customer reviews you screenshot and reshare,
            seasonal reminders. Secondary is Instagram for the exact same
            content repurposed into Reels.
          </p>
          <p>
            Say you run a B2B SaaS targeting mid-market CFOs. Primary is
            LinkedIn. You post 4x a week: founder commentary on industry news,
            customer win stories, ROI breakdowns, hiring posts, behind-the-
            scenes product updates. Secondary is X for the technical crowd
            that still reads there. That&apos;s it. No TikTok. No Instagram.
            Nothing.
          </p>
          <p>
            Both of those businesses will grow faster than the competitor
            trying to run 5 platforms at 30% effort each. That&apos;s the whole
            point.
          </p>

          <h2>The part nobody wants to hear</h2>
          <p>
            Picking a platform is the easy part. Actually showing up on it
            every week for 6-12 months is where 95% of small businesses fail.
            Content ideas run out. Owners get busy. Posting falls off a cliff
            in month two.
          </p>
          <p>
            The businesses that win on social media are the ones that either
            have an in-house content person or outsource to someone who makes
            sure it gets done. The &quot;I&apos;ll do it myself on weekends&quot;
            plan almost never survives 90 days. Same math we run in our post
            on{" "}
            <Link href="/blog/do-i-need-a-social-media-manager">
              whether you need a social media manager
            </Link>
            .
          </p>
          <p>
            That&apos;s the gap Venti Scale fills. You tell us who your customer
            is, we pick the platforms, and we run them. Daily content, native to
            each platform, a weekly report showing what&apos;s working. You get
            back the 15 hours a week you were losing to social. For the broader
            picture on{" "}
            <Link href="/done-for-you-marketing-services">
              done-for-you marketing services
            </Link>
            , here&apos;s the full breakdown.
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
          <BlogAuthorBio />

          {/* Related posts */}
          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/automate-social-media-without-losing-voice"
                className="blog-related-card"
              >
                <div className="related-title">
                  How to automate your social media without losing your brand voice
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
              <Link
                href="/blog/social-media-marketing-cost"
                className="blog-related-card"
              >
                <div className="related-title">
                  How much does social media marketing really cost in 2026?
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
