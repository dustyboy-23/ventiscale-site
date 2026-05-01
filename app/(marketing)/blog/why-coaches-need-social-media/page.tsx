import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title:
    "If you're a coach with no social media, you're invisible | Venti Scale",
  description:
    "Your next client is scrolling right now. If they can't find you, they'll find someone else.",
  openGraph: {
    title: "If you're a coach with no social media, you're invisible",
    description:
      "Your next client is scrolling right now. If they can't find you, they'll find someone else.",
    url: "https://www.ventiscale.com/blog/why-coaches-need-social-media",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/coaches-social.jpg",
        width: 1200,
        height: 630,
        alt: "Social media for coaches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "If you're a coach with no social media, you're invisible",
    description:
      "Your next client is scrolling right now. If they can't find you, they'll find someone else.",
    images: ["https://www.ventiscale.com/blog/coaches-social.jpg"],
  },
};

const SLUG = "why-coaches-need-social-media";
const TITLE =
  "If you're a coach with no social media presence, you're invisible.";
const DESCRIPTION =
  "Your next client is scrolling right now. If they can't find you, they'll find someone else.";
const DATE = "2026-04-12";

const FAQ_DATA = [
  {
    q: "How often should a coach post on social media?",
    a: "5 times per week minimum on your primary platform. Coaches who post 5x/week get 3x more inbound DMs than coaches who post 1-2x. Consistency matters more than perfection. A decent post that goes out beats a perfect post sitting in your drafts.",
  },
  {
    q: "What social media platform is best for coaches?",
    a: "Instagram and LinkedIn are the two highest-converting platforms for coaches in 2026. Instagram works best for life coaches, health coaches, and relationship coaches. LinkedIn dominates for business coaches, executive coaches, and career coaches. Pick the one where your ideal client already hangs out and go all in before spreading to a second platform.",
  },
  {
    q: "What should a coach post on social media to get clients?",
    a: "Frameworks, client results, and common mistakes your audience is making. A post like '3 signs you're undercharging and don't realize it' will outperform a motivational quote every time. Teach something useful, show proof it works, and make it obvious you can help. That's the formula.",
  },
  {
    q: "Is it worth hiring someone to manage social media for a coaching business?",
    a: "If you're spending more than 6 hours a week on content and still not posting consistently, yes. Most coaches lose 2-3 potential clients per month just from having a dead or inconsistent profile. A good social media partner costs less than one lost client and frees up 25+ hours a month you can spend coaching.",
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
            image: "https://www.ventiscale.com/blog/coaches-social.jpg",
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
          <Eyebrow>COACHES / SOCIAL MEDIA</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            If you&apos;re a coach with no social media presence, you&apos;re
            invisible.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 12, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              6 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img src="/blog/coaches-social.jpg" alt="Coach building social media presence" />
        </div>

        <div className="prose-blog">
          <p>
            You&apos;re good at what you do. Your clients get results. You&apos;ve
            got testimonials, maybe a website, maybe a landing page for your program.
            But your Instagram has 12 posts from last year. Your LinkedIn is a ghost
            town.
          </p>
          <p>
            Meanwhile, a coach who started six months after you has 10x your
            following and a full client roster. They&apos;re not better than you.
            They just show up online every day and you don&apos;t.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Your next client is already on Instagram or LinkedIn right now.
                If they can&apos;t find you, they&apos;ll find someone else.
              </li>
              <li>
                Frameworks and client results beat motivational quotes every
                time. Teach something useful and people will trust you enough to
                pay you.
              </li>
              <li>
                Posting 5x/week with decent content gets 3x more inbound DMs
                than posting when you feel like it.
              </li>
              <li>
                Most coaches spend 6-10 hours a week on content and still
                can&apos;t stay consistent. That time is better spent coaching.
              </li>
            </ul>
          </div>

          <p>
            Coaching is a trust business. Nobody hires a coach from one post. They
            follow you for weeks. They read your tips. They watch how you think.
            Then one day they&apos;re ready to invest in themselves, and
            you&apos;re already the person they trust.
          </p>
          <p>
            That process only works if you&apos;re consistently putting content out
            there for people to find. If your last post was three weeks ago,
            you&apos;re not building trust. You&apos;re losing it.
          </p>

          <h2>Your content is your sales team</h2>
          <p>
            Every post you publish works for you 24/7. Someone discovers your
            profile at 2am, reads through your last 20 posts, and DMs you asking
            about your program. That&apos;s not luck. That&apos;s a content library
            doing its job.
          </p>
          <p>
            One great Instagram carousel about overcoming imposter syndrome as a
            new business owner gets shared into a Facebook group of 5,000
            entrepreneurs. Ten of them check your profile. Three follow you. One
            books a discovery call next month. You wrote one post and it brought
            you a client weeks later.
          </p>
          <p>
            Now multiply that by posting 5 times a week. That&apos;s 260 posts a
            year, each one working for you forever.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">82%</div>
              <div className="stat-label">
                Of buyers check social before purchasing
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3x</div>
              <div className="stat-label">
                More inbound DMs at 5 posts/week
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">260</div>
              <div className="stat-label">
                Posts per year at 5x/week
              </div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>What coaches should actually post</h2>
          <p>
            Forget motivational quotes on sunset backgrounds. That&apos;s noise.
            Your audience scrolls past 300 posts a day. You need to stop them with
            something useful.
          </p>

          <p>
            <strong>Frameworks and quick wins.</strong> Give people a tool they can
            use today. &quot;The 3-step process I use with every client who feels
            stuck.&quot; This shows you have a method, not opinions.
          </p>
          <p>
            <strong>Common mistakes.</strong> Call out what your audience is doing
            wrong. &quot;Stop raising your prices and hoping for the best.
            Here&apos;s what to do instead.&quot; This positions you as someone who
            sees what others miss.
          </p>
          <p>
            <strong>Client results.</strong> Not just &quot;congratulations to my
            client!&quot; Tell the story. Where they were, what they struggled with,
            what shifted, where they are now. People see themselves in those stories
            and think &quot;I want that.&quot;
          </p>
          <p>
            <strong>Your own journey.</strong> What you learned the hard way. The
            mistakes you made building your business. Vulnerability builds
            connection faster than expertise alone.
          </p>
          <p>
            The content types that work for coaches are the same ones that work
            across industries. Just like{" "}
            <Link href="/blog/social-media-for-ecommerce-brands">
              ecommerce brands posting product photos and customer stories
            </Link>
            , coaches need to show proof that what they do actually works.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              LinkedIn posts from coaches that include a specific framework or
              numbered process get 2.5x more saves than posts that just share
              advice. People want something they can screenshot and use
              immediately.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>Pick one platform and go all in</h2>
          <p>
            You don&apos;t need to be on every platform. You need to be great on
            one.
          </p>
          <p>
            If you&apos;re a life coach, health coach, or relationship coach,
            Instagram is your best bet. Carousels and Reels perform well for
            teaching content. Your audience is already there scrolling for
            inspiration and advice.
          </p>
          <p>
            If you&apos;re a business coach, executive coach, or career coach,
            LinkedIn is where your buyers live. Text posts and short articles work.
            The organic reach on LinkedIn is still massive compared to other
            platforms.
          </p>
          <p>
            TikTok works for coaches targeting younger audiences (25-35). Short
            video tips and &quot;day in my life as a coach&quot; content builds
            following fast. Facebook groups still work for community-based coaching
            programs.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Spreading yourself across 5 platforms and posting the same content
              everywhere. Each platform has its own format and audience
              expectations. A LinkedIn text post copy-pasted to Instagram with a
              stock photo doesn&apos;t work. Pick one, nail it, then expand.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>The consistency problem</h2>
          <p>
            Whether you&apos;re a{" "}
            <Link href="/blog/contractors-getting-clients-online">
              contractor trying to get clients online
            </Link>{" "}
            or a coach building a personal brand, the same rule applies: if
            you&apos;re not showing up consistently, someone else will.
          </p>
          <p>
            You already know you should be posting. The problem is you&apos;re busy
            coaching clients, building programs, running discovery calls, updating
            your website, and managing your email list. Social media keeps falling
            to the bottom of the list.
          </p>
          <p>
            So you batch-create 10 posts on a Sunday, schedule them, and by
            Wednesday you&apos;re out of content and back to silence. Or you post
            when you feel inspired, which means twice in a good week and zero in a
            bad one.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">6-10hrs</div>
              <div className="stat-label">Per week on DIY social media</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">2-3</div>
              <div className="stat-label">
                Clients lost monthly from dead profiles
              </div>
            </div>
          </div>

          <p>
            The coaches who grow consistently aren&apos;t the most disciplined
            about posting. They&apos;re the ones who took content off their plate
            entirely and gave it to someone else. They spend those 6-10 hours a
            week coaching more clients instead.
          </p>

          <hr className="blog-divider" />

          <h2>What we do for coaches</h2>
          <p>
            We take over your social media completely. Daily posts across every
            platform that sound like you, teach your audience something, and build
            the kind of trust that turns followers into clients. You get a{" "}
            <Link href="/#how">client portal</Link> where you can see exactly
            what&apos;s going out and how it&apos;s performing. Weekly reports. No
            contracts.
          </p>
          <p>
            You focus on coaching. We make sure people can find you. If you want
            the broader picture on{" "}
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
              <Link href="/blog/social-media-for-ecommerce-brands" className="blog-related-card">
                <div className="related-title">Most ecommerce brands post on social media wrong.</div>
                <div className="related-meta">6 min read</div>
              </Link>
              <Link href="/blog/contractors-getting-clients-online" className="blog-related-card">
                <div className="related-title">You&apos;re a great contractor. Nobody knows it.</div>
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
