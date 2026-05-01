import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Local SEO for Contractors: How to Show Up When Homeowners Search | Venti Scale",
  description:
    "46% of Google searches have local intent. If you're not in the top 3 results, homeowners never find you. Step-by-step local SEO guide for contractors.",
  openGraph: {
    title: "Local SEO for Contractors: How to Show Up When Homeowners Search",
    description:
      "46% of Google searches have local intent. If you're not in the top 3 results, homeowners never find you. Step-by-step local SEO guide for contractors.",
    url: "https://www.ventiscale.com/blog/local-seo-for-contractors",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/local-seo-contractors.jpg",
        width: 1200,
        height: 630,
        alt: "Contractor reviewing job details on smartphone at a residential work site",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Local SEO for Contractors: How to Show Up When Homeowners Search",
    description:
      "46% of Google searches have local intent. If you're not in the top 3 results, homeowners never find you. Step-by-step local SEO guide for contractors.",
    images: ["https://www.ventiscale.com/blog/local-seo-contractors.jpg"],
  },
};

const SLUG = "local-seo-for-contractors";
const TITLE = "Local SEO for contractors: how to show up when homeowners search";
const DESCRIPTION =
  "46% of Google searches have local intent. If you're not in the top 3 results, homeowners never find you. Step-by-step local SEO guide for contractors.";
const DATE = "2026-04-22";
const IMAGE = "/blog/local-seo-contractors.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "How long does local SEO take to work for a contractor?",
    a: "Most contractors start seeing measurable results in 3-6 months. Google Business Profile optimizations and new reviews show the fastest gains, often within 4-6 weeks. Full local pack rankings for competitive keywords typically take 4-6 months of consistent effort.",
  },
  {
    q: "What is the most important local SEO factor for a contractor?",
    a: "Google Business Profile signals account for 32% of local pack rankings, making it the single most important factor. A complete, verified, and actively maintained profile is the highest-leverage thing a contractor can do for local search visibility.",
  },
  {
    q: "How many Google reviews does a contractor need to rank locally?",
    a: "There's no magic number, but contractors need a minimum 4-star average to be considered by most homeowners, with 68% refusing to hire businesses below that threshold. Every 10 new reviews increases your conversion rate by 2.8%, so building reviews consistently matters more than hitting a specific count.",
  },
  {
    q: "Does a contractor need a website to rank in local SEO?",
    a: "You can rank in the Google 3-pack without a website, but having one significantly boosts your rankings since on-page website signals account for 19% of local pack rankings. A simple, fast-loading site with your services, service area, and contact info is enough to make a real difference.",
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
          <Eyebrow>CONTRACTORS / LOCAL SEO</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Local SEO for contractors: how to show up when homeowners search
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 22, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src="/blog/local-seo-contractors.jpg"
            alt="Contractor reviewing job details on smartphone at a residential work site"
          />
        </div>

        <div className="prose-blog">
          <p>
            A homeowner&apos;s pipe bursts at 7pm. They grab their phone, search
            &quot;plumber near me,&quot; and three names show up in Google Maps. They
            call the first one. That contractor gets the job, the review, and probably
            a repeat customer next time something breaks.
          </p>
          <p>
            If you&apos;re not one of those three names, you never had a chance.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Contractors with a complete Google Business Profile get 7x more
                clicks than those without one.
              </li>
              <li>
                The top 3 local results get 95% of all clicks. Outside that list,
                homeowners don&apos;t see you.
              </li>
              <li>
                91% of homeowners check online reviews before hiring. Your star
                rating matters more than your price.
              </li>
              <li>
                Local SEO for contractors comes down to 4 things: Google Business
                Profile, reviews, citations, and your website.
              </li>
            </ul>
          </div>

          <p>
            Contractors with a complete, optimized Google Business Profile get 7x
            more clicks than those without one, and Google Maps drives 50-80% of all
            inbound contractor calls. Local SEO isn&apos;t a nice-to-have. It&apos;s
            where your next customer is looking right now.
          </p>

          <hr className="blog-divider" />

          <h2 id="step-1-google-business-profile">
            Step 1: Claim and fully optimize your Google Business Profile
          </h2>
          <p>
            This is the most important thing you can do for local SEO. Not your
            website. Not your social media. Your Google Business Profile.
          </p>
          <p>
            If you haven&apos;t claimed yours yet, go to business.google.com today.
            Find or create your listing and verify it. Google mails a postcard with a
            verification code to your business address. Takes about 5 days.
          </p>
          <p>Once you&apos;re in, fill out everything:</p>
          <ul>
            <li>Business name (exact legal name, no keyword stuffing)</li>
            <li>Phone number and website URL</li>
            <li>Physical address or service area cities</li>
            <li>Business hours including holidays</li>
            <li>
              Services with specific line items (&quot;roof installation&quot; and
              &quot;roof repair&quot; are different services, list them separately)
            </li>
            <li>
              At least 10 photos of real projects, updated monthly
            </li>
            <li>
              A business description written for a human, not an algorithm
            </li>
          </ul>
          <p>
            Google rewards active profiles. Log in at least once a month, post a
            project photo, and respond to new reviews. A profile you set up once and
            forgot is almost as bad as no profile at all. The algorithm treats
            inactivity as a signal that you might be closed or checked out.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Don&apos;t stuff keywords into your business name on Google Business
              Profile. &quot;ABC Roofing | Best Roofer in Phoenix&quot; violates
              Google&apos;s guidelines and can get your entire listing suspended. Use
              your real legal business name.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="step-2-local-pack">
            Step 2: Understand what it takes to rank in the Google 3-pack
          </h2>
          <p>
            The local pack is those three businesses that show up in Google Maps when
            someone searches &quot;contractor near me.&quot; The top 3 results get
            95% of all clicks. Outside that list, most homeowners never scroll.
          </p>
          <p>Here&apos;s how Google decides who makes it in:</p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">32%</div>
              <div className="stat-label">Google Business Profile signals</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">19%</div>
              <div className="stat-label">On-page website signals</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">16%</div>
              <div className="stat-label">Review signals</div>
            </div>
          </div>

          <p>
            Google Business Profile is by far the biggest lever you have. Keeping
            your profile complete, posting regular updates, and adding fresh project
            photos all feed that signal. The algorithm treats an active profile as
            evidence that your business is open, engaged, and worth showing.
          </p>
          <p>
            Most contractors get this wrong. They claim the profile, fill out the
            basics, and never touch it again. Meanwhile a competitor who posts a
            project photo every week and responds to every review quietly climbs past
            them in the rankings.
          </p>

          <hr className="blog-divider" />

          <h2 id="step-3-reviews">
            Step 3: Build your reviews like your business depends on it
          </h2>
          <p>
            It does.
          </p>
          <p>
            91% of homeowners say online reviews matter when choosing a contractor.
            68% won&apos;t consider hiring anyone with less than a 4-star rating. And{" "}
            <a
              href="https://www.brightlocal.com/resources/local-seo-statistics/"
              target="_blank"
              rel="noopener noreferrer"
            >
              according to BrightLocal&apos;s 2026 local SEO research
            </a>
            , every 10 new reviews you earn increases your conversion rate by 2.8%.
          </p>
          <p>
            Reviews are the hardest signal to fake and the most trusted signal
            homeowners use to make their hiring decision. Your star rating is the
            first thing they see when your name shows up in Google Maps, before they
            click anything else.
          </p>
          <p>
            The fix is simple but most contractors never do it consistently: ask every
            satisfied customer for a review. Not in a text three days later when
            they&apos;ve moved on. Ask while you&apos;re still on-site, right when
            they&apos;re happy with the finished work.
          </p>
          <p>
            A script that works: &quot;If everything looks good, would you mind
            leaving us a quick Google review? Takes about a minute and it really helps
            a small business like ours.&quot; Then text them the direct link to your
            Google review page before you pull out of the driveway. That link is in
            your Google Business Profile dashboard under the &quot;Get more
            reviews&quot; section.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Responding to reviews matters more than most contractors realize.
              Responding to just 25% of your reviews improves conversion by 4.1%.
              Reply to every review, including the negative ones. Keep responses brief
              and professional. It shows future customers you&apos;re paying attention.
            </p>
          </div>

          <p>
            56% of homeowners check Google first when looking for contractor reviews.
            This is also one of the top gaps we see in the{" "}
            <Link href="/blog/contractors-getting-more-leads">
              5 ways contractors get more leads in 2026
            </Link>
            . Most contractors have the work. They just don&apos;t have the proof of
            it online.
          </p>

          <hr className="blog-divider" />

          <h2 id="step-4-citations">
            Step 4: Fix your citations before they cost you rankings
          </h2>
          <p>
            A citation is any mention of your business name, address, and phone
            number online. Yelp. Angi. Houzz. The Better Business Bureau. Facebook.
            Your local chamber of commerce. Any directory that lists your info.
          </p>
          <p>
            Citation consistency is the part of local SEO most contractors skip.
            The issue is mismatches. If your Yelp profile says &quot;123 Main
            St&quot; and your Google profile says &quot;123 Main Street,&quot;
            that&apos;s a citation conflict. Google reads inconsistency as a trust
            problem. Not a typo. A reason to rank someone else above you.
          </p>
          <p>
            Audit the major directories: Google, Yelp, Angi, BBB, Facebook,
            HomeAdvisor, Houzz, and your local chamber. Make sure your business name,
            address, and phone number are identical across all of them. Same
            abbreviations. Same spelling. Same suite numbers.
          </p>
          <p>
            Also look for duplicate listings. If you moved locations or changed your
            phone number at some point, old listings might still be live. Google
            seeing two different addresses for the same business creates confusion and
            hurts your rankings. Find and merge or delete any duplicates.
          </p>

          <hr className="blog-divider" />

          <h2 id="step-5-website">
            Step 5: Make your website work for your local SEO
          </h2>
          <p>
            Your website reinforces or undermines everything else you&apos;re doing.
            On-page signals account for 19% of your local pack ranking. These are the
            things that matter most.
          </p>
          <p>
            <strong>NAP in the footer.</strong> Your business name, address, and
            phone number should appear in the footer on every page. Match them exactly
            to your Google Business Profile. Word for word.
          </p>
          <p>
            <strong>Location pages for each area you serve.</strong> One page for
            &quot;roofing contractor in Phoenix&quot; and a separate page for
            &quot;roofing contractor in Scottsdale.&quot; Don&apos;t try to rank one
            page for every city you work in. Google needs dedicated pages to connect
            you to specific locations.
          </p>
          <p>
            <strong>Mobile speed.</strong> Most homeowners search on their phones. If
            your site takes more than 3 seconds to load, a big chunk of visitors are
            already gone. Run your site through Google&apos;s PageSpeed Insights tool
            (it&apos;s free) and fix the top issues it flags.
          </p>
          <p>
            <strong>LocalBusiness schema.</strong> This is a small piece of code in
            your site&apos;s header that tells Google exactly who you are, what you
            do, and where you operate. Your web developer can add it in 20 minutes.
            It directly signals your local relevance and it&apos;s free.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">46%</div>
              <div className="stat-label">of Google searches have local intent</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">76%</div>
              <div className="stat-label">of local searchers act within 24 hours</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="putting-it-together">
            What happens when you put it all together
          </h2>
          <p>
            This stuff works. It&apos;s not instant and it&apos;s not magic. But
            contractors who get their GBP right, build reviews consistently, fix their
            citations, and have a solid website start showing up in the local 3-pack
            within 3-6 months.
          </p>
          <p>
            After that, the phone starts ringing without you doing anything different.
            That&apos;s the compounding effect of local SEO. You put in the work once,
            maintain it over time, and it keeps paying out long after you&apos;ve
            moved on to the next job.
          </p>
          <p>
            The catch is maintenance. New reviews need to keep coming in. Profile
            photos get updated. Citations need monitoring. GBP posts go out
            consistently. This is why a lot of contractors who understand all this
            still don&apos;t do it. They&apos;re busy actually doing the work.
          </p>
          <p>
            The contractors who win online are the ones who treat their digital
            presence like a job site. It needs regular attention. We cover more of
            this in our breakdown of{" "}
            <Link href="/blog/contractors-getting-clients-online">
              how contractors get found and win more business online
            </Link>
            , including what the ones doing it right have in common.
          </p>
          <p>
            If you&apos;re great at your trade but don&apos;t want to think about any
            of this, that&apos;s what we do at{" "}
            <a href="/#how">Venti Scale</a>. We handle the consistent content and
            online presence that keeps you visible while you&apos;re out on jobs. The
            audit is free and takes 30 seconds to see exactly where you stand. For
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
                href="/blog/contractors-getting-clients-online"
                className="blog-related-card"
              >
                <div className="related-title">
                  You&apos;re a great contractor. Nobody knows it. Let&apos;s fix
                  that.
                </div>
                <div className="related-meta">6 min read</div>
              </Link>
              <Link
                href="/blog/contractors-getting-more-leads"
                className="blog-related-card"
              >
                <div className="related-title">
                  5 ways contractors are getting more leads in 2026 (that most miss)
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
            </div>
          </div>

          <div className="blog-cta">
            <h3>Want to see where your marketing stands?</h3>
            <p>
              Get a free AI-powered audit of your online presence. Takes 30 seconds.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
