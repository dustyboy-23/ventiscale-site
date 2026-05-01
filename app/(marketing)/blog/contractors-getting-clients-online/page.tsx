import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SLUG = "contractors-getting-clients-online";
const TITLE =
  "You're a great contractor. Nobody knows it. Let's fix that.";
const DESCRIPTION =
  "Most contractors get work from referrals. That's fine until it's not. Here's how to stop relying on word of mouth alone.";
const DATE = "2026-04-12";

export const metadata = {
  title: `${TITLE} | Venti Scale`,
  description: DESCRIPTION,
  openGraph: {
    title: "You\u2019re a great contractor. Nobody knows it.",
    description:
      "Most contractors get work from referrals. That\u2019s fine until it\u2019s not. Here\u2019s how to stop relying on word of mouth alone.",
    url: "https://www.ventiscale.com/blog/contractors-getting-clients-online",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/contractors-online.jpg",
        width: 1200,
        height: 630,
        alt: "Contractor getting clients online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "You\u2019re a great contractor. Nobody knows it.",
    description:
      "Most contractors get work from referrals. That\u2019s fine until it\u2019s not. Here\u2019s how to stop relying on word of mouth alone.",
    images: ["https://www.ventiscale.com/blog/contractors-online.jpg"],
  },
};

const FAQ_DATA = [
  {
    q: "How do contractors get more clients online without spending thousands on ads?",
    a: "Start with Google Business Profile. It's free and it's where 46% of all Google searches go when they're looking for a local service. Fill it out completely, add photos of recent work, and ask happy customers to leave reviews. Most contractors skip this and it's the single highest-ROI thing you can do in an afternoon.",
  },
  {
    q: "What social media platform is best for contractors?",
    a: "Facebook is the best starting point for most contractors. 70% of adults in the US use it, and local community groups are where homeowners ask for recommendations daily. If your work is visual (landscaping, fencing, decking, auto detailing), add Instagram. Nextdoor is underrated for hyperlocal reach.",
  },
  {
    q: "How often should a contractor post on social media?",
    a: "3 to 5 times per week. Consistency matters more than polish. A quick before-and-after photo from a job site posted every other day will outperform one professionally designed post per month. The algorithm rewards accounts that show up regularly, and so do customers checking whether you're still active.",
  },
  {
    q: "Is hiring a marketing agency worth it for a small contracting business?",
    a: "If you're doing $15,000 or more per month in revenue and spending zero time on marketing, yes. One new client per month from better online visibility easily pays for the cost. The math changes fast when you factor in the jobs you're losing because people Google you and find nothing.",
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
            image: "https://www.ventiscale.com/blog/contractors-online.jpg",
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
          <Eyebrow>CONTRACTORS / LOCAL BUSINESS</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            You&apos;re a great contractor. Nobody knows it. Let&apos;s fix
            that.
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
          <img
            src="/blog/contractors-online.jpg"
            alt="Contractor building online presence"
          />
        </div>

        <div className="prose-blog">
          <p>
            You do great work. Your customers love you. You get steady
            referrals. Life is good. Until a slow month hits, a big client
            cancels, or a competitor opens up down the road and starts running
            ads. Suddenly &quot;word of mouth&quot; isn&apos;t enough and
            you&apos;re scrambling to find work.
          </p>
          <p>
            This happens to every contractor at some point. HVAC, plumbing,
            landscaping, roofing, fencing, auto detailing. Doesn&apos;t matter
            the trade. The ones who survive slow seasons are the ones who built
            an online presence before they needed it. Whether you&apos;re a{" "}
            <Link href="/blog/why-coaches-need-social-media">coach</Link> or a
            contractor, the problem is the same: if people can&apos;t find you
            online, you don&apos;t exist.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                97% of people search online before hiring a local service
                provider. If you&apos;re invisible, you&apos;re losing jobs to
                contractors who aren&apos;t better than you.
              </li>
              <li>
                Google Business Profile is the single highest-ROI thing you can
                set up in an afternoon. It&apos;s free.
              </li>
              <li>
                Before-and-after photos, seasonal tips, and customer reviews are
                the only content you need. No TikTok dances required.
              </li>
              <li>
                If you&apos;re doing $15K+/month and spending zero time on
                marketing, outsourcing your online presence pays for itself with
                one extra job per month.
              </li>
            </ul>
          </div>

          <p>
            Here&apos;s what most contractors get wrong. They think online
            marketing means becoming an influencer or spending $3,000 a month on
            Google Ads. It doesn&apos;t. It means being findable when someone in
            your area pulls out their phone and searches &quot;plumber near
            me&quot; or asks their Facebook group for a recommendation.
          </p>

          <h2>Your online presence is your first impression now</h2>
          <p>
            When someone needs an HVAC tech or a landscaper, the first thing
            they do is Google it. They look at reviews. They check your website.
            They glance at your Facebook page. This takes about 30 seconds.
          </p>
          <p>
            If your Facebook has 43 likes and your last post was a shared meme
            from 2024, that tells them something. It says you either don&apos;t
            care or you&apos;re not busy enough to have a real presence. Neither
            one makes them want to call you.
          </p>
          <p>
            Now compare that to the competitor down the road who posts photos of
            recent jobs every few days, shares seasonal tips, and has 87 Google
            reviews with a 4.8 rating. Same quality of work. Completely different
            first impression. It&apos;s the same story for{" "}
            <Link href="/blog/social-media-for-ecommerce-brands">
              ecommerce brands
            </Link>{" "}
            that ignore their online presence and wonder why nobody buys.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">97%</div>
              <div className="stat-label">Search online before hiring local</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">46%</div>
              <div className="stat-label">Of Google searches are local</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">5x</div>
              <div className="stat-label">
                More calls with a complete Google profile
              </div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>Google Business Profile is your foundation</h2>
          <p>
            If you do one thing after reading this, go fill out your Google
            Business Profile completely. Every field. Service area. Hours.
            Photos of your work. A description that says what you do and where.
          </p>
          <p>
            Businesses with complete Google profiles get 5x more calls than ones
            with partial listings. That&apos;s not a small bump. That&apos;s the
            difference between your phone ringing and wondering where the next
            job is coming from.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Google Business Profile is free, and it&apos;s the #1 factor in
              local search rankings. A contractor with 50+ reviews and a
              complete profile will show up above a competitor with a $2,000/month
              website but 3 reviews. Reviews beat budget every time.
            </p>
          </div>

          <p>
            After that, ask every happy customer to leave a Google review. Make
            it easy. Text them the link right after you finish the job. Most
            people are happy to do it, they just forget. A simple &quot;Hey, if
            you&apos;ve got 30 seconds, a Google review would mean a lot&quot;
            works fine.
          </p>

          <h2>You don&apos;t need to go viral. You need to exist.</h2>
          <p>
            Nobody expects their plumber to be doing TikTok dances. This
            isn&apos;t about becoming a social media influencer. It&apos;s about
            showing up consistently so that when someone searches for what you
            do in your area, they find a professional who clearly knows their
            stuff.
          </p>
          <p>
            That means having a Facebook page that&apos;s actually active. A
            Google Business Profile that&apos;s filled out with photos and
            recent reviews. Maybe an Instagram if your work is visual
            (landscaping, fencing, decking, auto detailing, roofing). Nextdoor
            if you want hyperlocal reach in specific neighborhoods.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Setting up profiles on 6 platforms and then posting on none of
              them. An inactive page is worse than no page at all. Pick 1 or 2
              platforms and show up consistently. Facebook and Google Business
              Profile are enough for most contractors to start.
            </p>
          </div>

          <h2>What kind of content works for contractors</h2>
          <p>
            You don&apos;t need to be creative. The content that works for
            contractors is simple and repeatable.
          </p>
          <p>
            <strong>Before-and-after photos.</strong> If you do any kind of
            visible work, this is gold. A deck that went from rotting to
            beautiful. A yard that went from weeds to clean lines. A bathroom
            remodel. People love seeing transformations. Snap a photo before you
            start and after you finish. That&apos;s a post.
          </p>
          <p>
            <strong>Seasonal tips.</strong> &quot;3 things to check on your
            furnace before winter.&quot; &quot;How to prep your lawn for
            spring.&quot; &quot;Signs your roof didn&apos;t survive that last
            storm.&quot; This is content your customers actually care about. It
            positions you as the expert and keeps you top of mind when they need
            the service.
          </p>
          <p>
            <strong>Common problems and solutions.</strong> &quot;Why is my
            water heater making that noise?&quot; &quot;What those cracks in your
            driveway actually mean.&quot; &quot;The #1 mistake homeowners make
            with their sprinkler system.&quot; You answer these questions on job
            sites every day. Put them on the internet and they bring you
            customers.
          </p>
          <p>
            <strong>Customer reviews.</strong> Screenshot a great Google review.
            Share it. Thank the customer. That&apos;s social proof working for
            you without any effort.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">3-5x</div>
              <div className="stat-label">
                Per week is all you need to post
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">88%</div>
              <div className="stat-label">
                Trust online reviews as much as personal
              </div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>The time problem (and the real math)</h2>
          <p>
            You&apos;re out on job sites all day. You get home at 6, eat
            dinner, and the last thing you want to do is figure out what to
            post on Facebook. You&apos;re not a marketer. You&apos;re a
            contractor.
          </p>
          <p>
            That&apos;s the gap. You know it matters. You just don&apos;t have
            the time or the interest to do it yourself. And hiring a traditional
            marketing agency that charges $3,000 to $5,000 a month for fancy
            reports and buzzwords doesn&apos;t make sense when you&apos;re
            running a lean operation.
          </p>
          <p>
            But think about it this way. If your average job is worth $500 to
            $2,000, you only need one or two extra clients a month from better
            online visibility to cover the cost of outsourcing your marketing
            completely. Every client after that is pure profit you wouldn&apos;t
            have had.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              The average contractor spends 0 hours per week on online marketing
              and wonders why the phone doesn&apos;t ring during slow months.
              The ones spending even 2 to 3 hours (or outsourcing it entirely)
              report 30-50% more inbound leads within 90 days.
            </p>
          </div>

          <h2>What we do for contractors and home service businesses</h2>
          <p>
            We take over your online presence. Daily posts across your
            platforms, seasonal content that positions you as the local expert,
            before-and-after showcases, and tip posts that actually get shared
            in local Facebook groups.
          </p>
          <p>
            You get a{" "}
            <Link href="/#how">client portal</Link> where you can see
            what&apos;s going out and how your numbers look. Weekly report so
            you know what&apos;s working. No contracts. No buzzwords. No $5,000
            monthly invoices.
          </p>
          <p>
            You keep doing what you&apos;re good at. We make sure people know
            about it. For the broader picture on{" "}
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
                href="/blog/social-media-for-ecommerce-brands"
                className="blog-related-card"
              >
                <div className="related-title">
                  Most ecommerce brands post on social media wrong.
                </div>
                <div className="related-meta">6 min read</div>
              </Link>
              <Link
                href="/blog/why-coaches-need-social-media"
                className="blog-related-card"
              >
                <div className="related-title">
                  If you&apos;re a coach with no social media, you&apos;re
                  invisible.
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
