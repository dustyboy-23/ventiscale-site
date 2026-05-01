import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "The only social media strategy a small business needs in 2026 | Venti Scale",
  description:
    "Stop chasing 47-step frameworks. Here's the only social media strategy a small business actually needs in 2026.",
  openGraph: {
    title: "The only social media strategy a small business needs in 2026",
    description:
      "Stop chasing 47-step frameworks. Here's the only social media strategy a small business actually needs in 2026.",
    url: "https://www.ventiscale.com/blog/only-social-media-strategy-you-need",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/only-social-media-strategy.jpg",
        width: 1200,
        height: 630,
        alt: "Social media strategy for small business 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "The only social media strategy a small business needs in 2026",
    description:
      "Stop chasing 47-step frameworks. Here's the only social media strategy a small business actually needs in 2026.",
    images: ["https://www.ventiscale.com/blog/only-social-media-strategy.jpg"],
  },
};

const SLUG = "only-social-media-strategy-you-need";
const TITLE = "The only social media strategy a small business needs in 2026";
const DESCRIPTION =
  "Stop chasing 47-step frameworks. Here's the only social media strategy a small business actually needs in 2026.";
const DATE = "2026-04-20";

const FAQ_DATA = [
  {
    q: "How often should a small business post on social media?",
    a: "5 times per week on your primary platform. Consistency beats volume every time. Posting 5 solid times a week outperforms 1 brilliant post followed by two weeks of silence. Algorithms reward accounts that show up consistently. So does your audience.",
  },
  {
    q: "What's the best social media strategy for a small business with limited time?",
    a: "Pick one platform, post 3 types of content (educational, social proof, personality), and show up every weekday. If you can't maintain that consistently, automate it or outsource it. A strategy you can't execute isn't a strategy.",
  },
  {
    q: "How do you measure if your social media strategy is working?",
    a: "Track reach, engagement rate, and profile visits weekly. Monthly, look at website clicks from social and any direct revenue you can trace back. Don't chase vanity metrics like follower count. Growing 50 followers who actually care beats 500 who don't.",
  },
  {
    q: "Can a small business handle social media without a dedicated marketing team?",
    a: "Yes, for a while. Most owners handle it themselves for 6-12 months before quality drops. The signal to hand it off is when posting feels like a chore, content gets inconsistent, or you've gone silent for more than a week because the business got busy.",
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
            image:
              "https://www.ventiscale.com/blog/only-social-media-strategy.jpg",
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
            The only social media strategy a small business needs in 2026
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 20, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src="/blog/only-social-media-strategy.jpg"
            alt="Social media strategy for small business 2026"
          />
        </div>

        <div className="prose-blog">
          <p>
            Search &quot;social media strategy for small business&quot; and you&apos;ll
            find a 6,000-word guide telling you to be on 7 platforms, post 3 times a day,
            go live weekly, run ads, reply to every comment, and audit your analytics every
            Friday. Three weeks later, you&apos;ve posted twice and given up.
          </p>
          <p>
            The strategy wasn&apos;t wrong. It was just impossible to execute on top of
            everything else you&apos;re running. Here&apos;s one that isn&apos;t.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Pick 1 platform. Add a second only when the first is running on
                autopilot.
              </li>
              <li>
                Post 3 types of content: educational, social proof, and personality.
                Rotate them.
              </li>
              <li>
                Show up 5 times a week. Consistency is the only real algorithm hack.
              </li>
              <li>
                If you can&apos;t sustain it yourself, automate it or hand it off
                before you go dark.
              </li>
            </ul>
          </div>

          <p>
            68% of small business owners say social media is their #1 growth channel
            in 2026. Most of them are still doing it in a way that doesn&apos;t
            compound. That gap is where this framework lives.
          </p>

          <h2>Step 1: Pick one platform</h2>
          <p>
            This is the rule most small business owners break immediately. They sign up
            for Instagram, Facebook, LinkedIn, TikTok, and X on the same day. They post
            sporadically across all of them for two months. Then nothing.
          </p>
          <p>
            One platform with daily content beats five platforms with occasional posts.
            The algorithm on every major platform rewards consistency. Your audience builds
            a habit of seeing you. You get better at the format fast. Posts that used to
            take 2 hours take 20 minutes after 60 days.
          </p>
          <p>
            How do you pick? Match the platform to your audience. B2B service? LinkedIn.
            Local service or retail? Facebook. Visual product or younger demographic?
            Instagram. If you need a deeper breakdown,{" "}
            <Link href="/blog/which-social-media-platform-for-business">
              this guide covers exactly how to choose based on your business type
            </Link>
            .
          </p>
          <p>
            Add a second platform only when the first is genuinely running on its own.
            That means consistent posting, decent engagement, and content creation that
            doesn&apos;t feel like a grind. Most businesses try to expand before they
            get there, and expanding kills both.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Spreading effort across 4-5 platforms because &quot;you should be
              everywhere.&quot; You end up with 5 dead accounts instead of 1 thriving
              one. Depth beats breadth every time.
            </p>
          </div>

          <h2>Step 2: Post 3 types of content and rotate them</h2>
          <p>
            You don&apos;t need a 12-content-type framework. You need three. Every post
            you create should be one of these:
          </p>
          <p>
            <strong>Educational content</strong> teaches your audience something they
            actually care about. Sell pest control? Teach them the 3 signs of a termite
            infestation. Run a gym? Show them why most people plateau at the 3-month mark.
            The post has standalone value even if they never buy from you. That&apos;s
            what gets saved and shared.
          </p>
          <p>
            <strong>Social proof</strong> is screenshots of reviews, client results,
            before-and-afters, testimonials, and case studies. You don&apos;t say your
            service is great. Your customers do. This is the content type most businesses
            underuse. If you&apos;ve got five-star reviews sitting on Google, turn them
            into posts. Don&apos;t let that credibility rot on a platform your audience
            never checks.
          </p>
          <p>
            <strong>Personality content</strong> is behind-the-scenes. The story of why
            you started. The rough week you had and what you learned from it. The opinion
            you hold that most people in your industry disagree with. This is what builds
            the connection that turns followers into buyers. People buy from people they
            trust, and they trust people they feel like they know.
          </p>
          <p>
            Rotate them. If you&apos;re posting 5x a week, a simple rotation looks like:
            educational, proof, educational, personality, proof. You don&apos;t need to
            be rigid. Just don&apos;t post the same type five times in a row.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">68%</div>
              <div className="stat-label">
                Of SMBs say social is their #1 growth channel in 2026
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$5.20</div>
              <div className="stat-label">ROI per $1 spent on managed social media</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">41%</div>
              <div className="stat-label">ROI from short-form video content</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>Step 3: Show up 5 times a week</h2>
          <p>
            Not 5 great posts. 5 good-enough posts. That distinction matters.
          </p>
          <p>
            Businesses that wait until they have something perfect to post end up posting
            twice a month. Businesses that post consistently, even when the content is just
            solid and unremarkable, build audience and algorithm momentum that compounds.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              According to{" "}
              <a
                href="https://sproutsocial.com/insights/social-media-statistics/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sprout Social&apos;s 2026 research
              </a>
              , brands posting consistently 5+ times per week see 2.5x higher profile
              visits and significantly stronger engagement rates than brands posting 1-2
              times per week. The gap between consistent and inconsistent compounds fast.
            </p>
          </div>

          <p>
            You don&apos;t need a viral post. You need 20 good posts. Then 20 more. The
            10th-best post from a consistent creator outperforms the single best post from
            someone who disappears for three weeks between uploads.
          </p>
          <p>
            This is also why{" "}
            <Link href="/blog/automate-social-media-without-losing-voice">
              automation becomes so valuable once you have the system dialed in
            </Link>
            . When you remove the friction of deciding what to post and when, the
            consistency problem mostly solves itself.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">3.70%</div>
              <div className="stat-label">
                TikTok engagement rate vs. 0.15% on Facebook
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">2.5x</div>
              <div className="stat-label">
                More profile visits from consistent posting
              </div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>The real test: can you execute this for 90 days straight?</h2>
          <p>
            That&apos;s the only metric that matters in the first quarter. Not follower
            growth. Not viral moments. Did you show up for 90 days without going dark?
          </p>
          <p>
            Most small business owners can&apos;t. Not because they&apos;re bad at
            marketing, but because they&apos;re running a business. Something always gets
            deprioritized when things get busy, and social media is usually first because
            it doesn&apos;t feel urgent.
          </p>
          <p>
            If you can handle it yourself, do it. The firsthand knowledge you have about
            your business creates content nobody else can replicate. Use it. But set a
            clear threshold: if you&apos;ve gone more than 7 days without posting and it
            feels like a pattern rather than a one-off, that&apos;s the signal.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Signs it&apos;s time to hand it off</div>
            <p>
              You&apos;ve missed more than two weeks this quarter. Content quality has
              dropped because you&apos;re rushing. You&apos;re thinking about social
              media every Sunday night and still not posting. Any one of these is enough.{" "}
              <Link href="/blog/signs-you-should-stop-diy-marketing">
                Here are 5 more signs worth knowing about
              </Link>
              .
            </p>
          </div>

          <h2>What this looks like when it&apos;s actually running</h2>
          <p>
            A roofing company. One platform: Facebook, because that&apos;s where
            homeowners 40+ are making purchase decisions. Three content types: educational
            (common roof issues to watch for before they become expensive), social proof
            (before-and-after job photos with short client quotes), personality (the owner
            filming a 60-second video from a job site explaining something they see every
            week). Five posts a week.
          </p>
          <p>
            After 90 days, they&apos;ve got 180+ pieces of content indexed on their page.
            Every person who checks them out before calling sees an active, credible
            business. The local algorithm has learned what they do. Local homeowners are
            seeing them consistently. That compounds into inquiries.
          </p>
          <p>
            It&apos;s not complicated. The complication comes from trying to run a full
            business and build a content machine at the same time. That&apos;s the real
            problem the strategy is trying to solve, and sometimes the honest answer is
            that you can&apos;t do both alone indefinitely.
          </p>
          <p>
            At Venti Scale, we run this exact system for small businesses. Daily content
            across your platform, consistent voice, real metrics, and a weekly report
            showing what&apos;s working. You don&apos;t have to become a content creator
            to grow online. You just need someone making sure it happens every week. For
            the broader picture on{" "}
            <Link href="/done-for-you-marketing-services">
              done-for-you marketing services
            </Link>
            , here&apos;s the full breakdown.
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
                href="/blog/which-social-media-platform-for-business"
                className="blog-related-card"
              >
                <div className="related-title">
                  Which social media platform should your small business actually
                  focus on?
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/automate-social-media-without-losing-voice"
                className="blog-related-card"
              >
                <div className="related-title">
                  How to automate your social media without losing your brand voice
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
            </div>
          </div>

          <div className="blog-cta">
            <h3>Want to see where your marketing stands?</h3>
            <p>Get a free AI-powered audit of your online presence. Takes 30 seconds.</p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
