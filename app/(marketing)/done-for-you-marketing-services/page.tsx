import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "done-for-you-marketing-services";
const TITLE =
  "Done-for-you marketing services: what's actually included, what to pay, and the 5 questions that filter out the bad ones";
const DESCRIPTION =
  "Done-for-you marketing services range from $500 to $10,000/month. Most are agency-with-extra-steps. Here's what real DFY includes, what it should cost, and the exact questions to ask before signing.";
const DATE = "2026-04-29";
const IMAGE = "/blog/done-for-you-marketing-services.jpg";
const IMAGE_URL = `${SITE_URL}${IMAGE}`;

const FAQ_DATA = [
  {
    q: "What does done-for-you marketing actually include?",
    a: "Real done-for-you marketing handles execution end-to-end across at least 3 channels (typically email, content, and social). Standard deliverables: weekly content production (8-15 pieces), email flow setup and ongoing campaigns, social posting at 4-7 per week per platform, monthly performance reporting, and ongoing strategy adjustment. Bad DFY stops at 'we'll write some posts.' Real DFY ships work daily and reports on it weekly.",
  },
  {
    q: "How much does a done-for-you marketing service cost in 2026?",
    a: "Entry-level DFY services start at $500-1,000/month for single-channel coverage (typically just social or just email). Mid-tier services covering 3-4 channels run $1,500-2,500/month. Full-service DFY with 5+ channels and senior strategist involvement runs $2,500-5,000/month. Anything under $500/month is automation tooling, not a service. Anything over $5,000/month is a traditional agency calling itself DFY.",
  },
  {
    q: "Is done-for-you marketing better than hiring a marketing agency?",
    a: "For businesses doing $5K-500K/month in revenue, yes. DFY services typically cost 40-60% less than a traditional agency at comparable output because AI replaces the junior account-management layer. The remaining differences are structural: DFY is usually month-to-month, agency is usually 6-12 month contracts. DFY usually has a portal showing real-time work, agency usually sends monthly PDFs. The trade-off: agencies handle larger budgets and complex multi-team campaigns better.",
  },
  {
    q: "What's the difference between done-for-you marketing and a virtual assistant?",
    a: "A virtual assistant executes tasks you specify. A done-for-you service runs marketing operations independently. The VA waits for your direction. The DFY service decides what to ship, writes it, gets your approval, and ships it. Cost difference: a VA runs $500-2,000/month for 10-40 hours of generalist task work. A DFY service runs $1,000-3,000/month for fully-managed marketing output across multiple channels.",
  },
  {
    q: "How do I evaluate done-for-you marketing services before signing up?",
    a: "Five questions filter out 90% of bad services: 1) Can I see real-time output before signing? 2) Is the contract month-to-month? 3) Who reviews work before it ships and who do I communicate with day-to-day? 4) What's the cancellation process and what data do I get back? 5) Show me a case study with specific revenue numbers, not vanity metrics. Any service that can't answer all five clearly is selling on charm rather than work.",
  },
];

export const metadata = {
  title: `${TITLE} | Venti Scale`,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/${SLUG}`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/${SLUG}`,
    type: "article",
    images: [
      {
        url: IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Done-for-you marketing service deliverables and process",
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

export default async function PillarPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Done-for-you marketing services",
            provider: {
              "@type": "Organization",
              name: "Venti Scale",
              url: SITE_URL,
            },
            areaServed: { "@type": "Place", name: "Worldwide" },
            description: DESCRIPTION,
            url: `${SITE_URL}/${SLUG}`,
          }),
        }}
      />

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
              url: `${SITE_URL}/about`,
            },
            publisher: {
              "@type": "Organization",
              name: "Venti Scale",
              url: SITE_URL,
            },
            datePublished: DATE,
            dateModified: DATE,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/${SLUG}`,
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
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: TITLE,
                item: `${SITE_URL}/${SLUG}`,
              },
            ],
          }),
        }}
      />

      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Link
          href="/"
          className="text-[13px] font-mono text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Back to home
        </Link>

        <div className="mt-8 mb-10">
          <Eyebrow>PILLAR / DFY MARKETING</Eyebrow>
          <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
            Done-for-you marketing services: what&apos;s actually included, what to pay, and the 5 questions that filter out the bad ones
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              Updated April 29, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              13 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img src={IMAGE} alt="Done-for-you marketing service deliverables and process" />
        </div>

        <div className="prose-blog">
          <p>
            &quot;Done-for-you marketing&quot; is one of the most abused phrases
            in the small business space. It means everything from a $79/month
            social scheduler with stock captions to a $4,500/month full-service
            agency that branded itself differently. Most founders shopping for
            DFY services have no real way to compare what they&apos;re looking at.
          </p>
          <p>
            That ambiguity is on purpose. Vague service definitions let bad
            services hide. Founders sign up expecting end-to-end execution
            and get a Trello board with content calendars. <em>The deliverables
            were always vapor.</em>
          </p>
          <p>
            This page is the working 2026 definition of done-for-you marketing
            services. What real DFY actually includes, the price tiers and what
            each one buys, the 5 questions that separate working services from
            theater, and how to evaluate any DFY service before you put down
            your card.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Real done-for-you marketing handles execution end-to-end across
                3+ channels with weekly output and monthly reporting. Anything
                less is content scheduling, not DFY.
              </li>
              <li>
                Price tiers in 2026: $500-1,000/month entry-level (single
                channel), $1,500-2,500/month mid-tier (3-4 channels),
                $2,500-5,000/month full-service (5+ channels).
              </li>
              <li>
                DFY services typically cost 40-60% less than traditional agencies
                at comparable output because AI replaces the junior
                account-management layer.
              </li>
              <li>
                The 5 questions that filter out 90% of bad services: real-time
                output access, month-to-month structure, who reviews work,
                cancellation/data handover, and case studies with revenue numbers
                (not vanity metrics).
              </li>
              <li>
                Most founders confuse DFY with VAs (task execution) or agency
                consulting (strategy without execution). DFY combines both:
                strategy decisions plus daily execution under one service.
              </li>
            </ul>
          </div>

          <h2>What done-for-you marketing actually means</h2>
          <p>
            A real done-for-you marketing service handles three things together:
            strategic decisions about what to ship, daily production of the
            content/emails/ads, and ongoing measurement and adjustment. All
            three. If a service handles only one or two, it&apos;s not DFY.
            It&apos;s tooling, freelancing, or consulting.
          </p>
          <p>
            We covered the deliverable-level breakdown at{" "}
            <Link href="/blog/what-done-for-you-marketing-includes">
              done-for-you marketing: what&apos;s actually in the box
            </Link>
            . The short version is that real DFY ships specific work weekly:
            blog posts, email campaigns, social content, ad creative, performance
            reports. The exact mix depends on your channel priorities, but the
            volume is predictable and visible.
          </p>
          <p>
            What separates DFY from a traditional marketing agency in 2026 is
            structural, not output. Both ship work. The differences are:
          </p>
          <p>
            <strong>Contract length.</strong> DFY is month-to-month. Agencies
            typically lock in for 6-12 months.
          </p>
          <p>
            <strong>Communication.</strong> DFY puts the founder or senior
            strategist in direct contact with the client. Agencies route through
            an account manager.
          </p>
          <p>
            <strong>Transparency.</strong> DFY usually has a real-time portal
            showing every output. Agencies usually send monthly PDF reports.
          </p>
          <p>
            <strong>Cost structure.</strong> DFY services use AI for production,
            making them 40-60% cheaper at comparable output. Agencies still bill
            hours through a junior team.
          </p>
          <p>
            For the deeper agency comparison, see{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives: 5 options that beat the retainer trap
            </Link>
            . DFY is alternative number 4 in that framework.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$500-5K</div>
              <div className="stat-label">monthly DFY price range 2026</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">40-60%</div>
              <div className="stat-label">cost savings vs traditional agency</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3+</div>
              <div className="stat-label">channels minimum for &quot;real&quot; DFY</div>
            </div>
          </div>

          <h2>The 3 price tiers and what each one actually buys</h2>

          <h2>Tier 1: Entry-level DFY ($500-1,000/month)</h2>
          <p>
            <strong>What you get:</strong> Single-channel coverage. Usually
            social media posting only OR email campaigns only. 12-20 pieces of
            content per month. Basic monthly reporting. Limited strategy
            involvement (mostly templated).
          </p>
          <p>
            <strong>Best for:</strong> Solo founders under $10K/month revenue
            who need help on one specific channel and have time to handle the
            others themselves.
          </p>
          <p>
            <strong>Watch out for:</strong> Tier 1 is where most &quot;DFY social
            media&quot; services live, and most of them ship templated content
            that looks identical to what every other client of theirs gets. The
            ones worth using have real brand-voice training (1-2 hour intake,
            ongoing voice samples). The cheap ones don&apos;t bother.
          </p>
          <p>
            We covered this category in detail at{" "}
            <Link href="/blog/done-for-you-social-media-management">
              done-for-you social media management
            </Link>
            . The honest take: $500-700/month tier 1 services are usually a
            template farm. $800-1,000/month tier 1 services with real voice
            training can be excellent if you only need one channel.
          </p>

          <h2>Tier 2: Mid-tier DFY ($1,500-2,500/month)</h2>
          <p>
            <strong>What you get:</strong> 3-4 channels typically including
            email, content/blog, and 1-2 social platforms. 30-50 pieces of
            content per month. Behavioral email flow setup. Weekly reporting.
            Active strategy involvement from the senior strategist or founder.
          </p>
          <p>
            <strong>Best for:</strong> Businesses doing $30K-$200K/month in
            revenue. This is the sweet spot where AI-powered DFY genuinely
            replaces what a $4,000-5,000/month agency was doing in 2023.
          </p>
          <p>
            <strong>What to expect:</strong> A 5-day onboarding process where
            the service trains its AI on your brand voice, products, customers,
            and visuals. Then weekly content shipping with founder or senior
            strategist review before publish. A real-time portal showing every
            output. Direct Slack or Discord access to whoever runs your account.
          </p>

          <h2>Tier 3: Full-service DFY ($2,500-5,000/month)</h2>
          <p>
            <strong>What you get:</strong> 5+ channels. Email, content, paid
            social, organic social, SMS. 50+ pieces of content per month.
            Behavioral flows for every customer journey stage. Ad account
            management with creative testing. Weekly strategy meetings or
            async updates. Monthly deep-dive reports.
          </p>
          <p>
            <strong>Best for:</strong> Businesses doing $200K-$500K/month or
            growing fast and needing more than mid-tier handles. Above $500K/month,
            most businesses move to a fractional CMO + DFY hybrid setup or build
            in-house.
          </p>
          <p>
            <strong>The pricing rationale:</strong> The cost increase from tier
            2 to tier 3 isn&apos;t just more content. It&apos;s adding paid
            account management (which requires a senior media buyer who costs
            real money) and adding SMS (which requires careful permission
            management and infrastructure costs).
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              The price-to-output ratio is roughly identical across tiers. You
              don&apos;t pay more per piece of content at tier 3. You pay more
              because there are more channels to coordinate and the senior time
              spent overseeing each campaign is greater. If a tier 1 service
              charges $1,500/month for the same single-channel deliverable a
              competitor charges $700/month for, the extra $800 is usually
              margin, not output.
            </p>
          </div>

          <h2>The 5 questions that filter out 90% of bad services</h2>

          <h2>Question 1: Can I see real-time output before signing?</h2>
          <p>
            Real DFY services run client portals where you can see every output
            in real time. They also publish public case studies, sample content,
            and process documentation. The bad services hide behind &quot;you
            have to sign up to see what we do&quot; or require a 45-minute
            discovery call before showing any work.
          </p>
          <p>
            <strong>Red flag answer:</strong> &quot;Let&apos;s schedule a call
            and I&apos;ll walk you through it.&quot;
          </p>
          <p>
            <strong>Green flag answer:</strong> &quot;Here&apos;s our portal
            from a current client (with permission). Here are 5 case studies
            with real numbers. Here&apos;s a sample week of content we shipped
            last month.&quot;
          </p>

          <h2>Question 2: Is the contract month-to-month?</h2>
          <p>
            Month-to-month is the standard for DFY services under $10K/month
            in 2026. Long contracts exist because the service is afraid you&apos;ll
            leave. <em>If they&apos;re afraid you&apos;ll leave, ask why.</em>{" "}
            A confident service trusts the work to retain the client.
          </p>
          <p>
            <strong>Red flag answer:</strong> &quot;We require a 6-month minimum
            for proper onboarding.&quot; (Translation: we lose money if you
            cancel before then because we under-priced the onboarding.)
          </p>
          <p>
            <strong>Green flag answer:</strong> &quot;Cancel any time. 30-day
            notice. We hand back your data, prompt library, and integrations.&quot;
          </p>

          <h2>Question 3: Who reviews work before it ships?</h2>
          <p>
            This is the most diagnostic question. The answer reveals whether
            you&apos;re paying for senior expertise or for a junior staff
            production line.
          </p>
          <p>
            <strong>Red flag answer:</strong> &quot;Our quality team handles
            review.&quot; (Translation: more junior staff.)
          </p>
          <p>
            <strong>Green flag answer:</strong> &quot;The founder personally
            reviews every output before it ships. You&apos;ll communicate with
            the founder directly through a Slack channel.&quot;
          </p>
          <p>
            We covered the deeper diagnostic at{" "}
            <Link href="/blog/signs-you-should-stop-diy-marketing">
              signs you should stop DIY marketing (and when DIY actually wins)
            </Link>
            . The same red flags that signal &quot;you should outsource&quot;
            also signal which DFY services to avoid.
          </p>

          <h2>Question 4: What&apos;s the cancellation process?</h2>
          <p>
            What you get back when you leave matters as much as what you get
            during the engagement. Your brand voice training, prompt library,
            customer data, and integration configurations are your IP.
          </p>
          <p>
            <strong>Red flag answer:</strong> &quot;The proprietary AI stays
            with us.&quot; (Translation: they&apos;re renting your own brand
            back to you.)
          </p>
          <p>
            <strong>Green flag answer:</strong> &quot;We hand over the prompt
            library, training data, integration access, and a 30-day
            transition support window.&quot;
          </p>

          <h2>Question 5: Show me a case study with revenue numbers</h2>
          <p>
            Vanity metrics (impressions, follower count, engagement rate) tell
            you nothing about whether a service moves money. Real case studies
            include CAC, LTV, MER, repeat purchase rate, or specific revenue
            attribution.
          </p>
          <p>
            <strong>Red flag answer:</strong> &quot;We grew their Instagram
            from 2K to 12K followers.&quot; (Translation: we don&apos;t know if
            we made them any money.)
          </p>
          <p>
            <strong>Green flag answer:</strong> &quot;Client X went from $18K
            to $42K monthly revenue in 90 days. Email contributed $12K of that.
            Paid social ROAS lifted from 2.1x to 3.4x. Here&apos;s the dashboard.&quot;
          </p>

          <h2>How DFY differs from VAs and agencies</h2>
          <p>
            Three categories get confused regularly. Here&apos;s the working
            distinction:
          </p>
          <p>
            <strong>Virtual assistant (VA):</strong> Executes tasks you specify.
            You direct, they do. Cost: $500-2,000/month for 10-40 hours of
            generalist work. Best for repetitive tasks (data entry, scheduling,
            invoicing) where the strategy is yours.
          </p>
          <p>
            <strong>Marketing agency:</strong> Hybrid of strategy and execution
            with a hierarchy (account manager + production team + occasional
            senior strategist). Cost: $3,000-15,000/month with 6-12 month
            contracts. Best for businesses needing complex multi-team campaigns
            or large ad budgets.
          </p>
          <p>
            <strong>Done-for-you (DFY) marketing service:</strong> Combines
            strategy and execution under one service, usually with senior-only
            staff and AI-powered production. Cost: $500-5,000/month month-to-month.
            Best for businesses $5K-$500K/month who want hands-off execution
            with senior taste.
          </p>
          <p>
            Founders frequently hire a VA expecting DFY (and get task execution
            but no strategy). Or hire an agency expecting DFY (and get layers
            of staff between them and the work). The right category depends on
            whether you need direction-following (VA), large-budget complex
            campaigns (agency), or hands-off execution with senior taste (DFY).
          </p>

          <h2>The DIY vs DFY decision framework</h2>
          <p>
            Most founders should run DIY for 60-90 days before considering DFY.
            The reason isn&apos;t cost. It&apos;s pattern recognition. You
            need to feel which channels matter for your specific business
            before you can evaluate whether a DFY service is doing them well.
          </p>
          <p>
            We covered the full DIY-vs-DFY framework at{" "}
            <Link href="/blog/done-for-you-marketing-vs-diy">
              done-for-you marketing vs DIY: which one fits your stage
            </Link>
            . The summary: DIY first, DFY when you hit the time wall.
          </p>
          <p>
            Time wall signs:
          </p>
          <p>
            You&apos;re posting 1-2 times per week instead of 4-7 because
            you don&apos;t have time. Your email flows are still set to
            Klaviyo defaults because you haven&apos;t customized them. Your
            blog hasn&apos;t had a new post in 6 weeks. You&apos;re running
            ads but haven&apos;t tested new creative in a month. Your founder
            voice is showing up everywhere except your marketing.
          </p>
          <p>
            Any 2 of these is a signal. Any 3 means you should already be on
            DFY.
          </p>

          <h2>What we built at Venti Scale</h2>
          <p>
            Venti Scale is a tier 2 done-for-you marketing service for ecommerce
            founders running $5,000 to $200,000 per month. Each client gets a
            Custom AI trained on their brand voice, products, customers, and
            visuals. The AI handles daily output across email, content, paid
            social creative, and organic social. I personally review every
            output before it ships.
          </p>
          <p>
            Pricing is transparent and month-to-month. Cancel any time. 5-day
            onboarding from intake form to live operations. The founder (me)
            communicates with every client directly through a Slack channel.
            Real-time portal showing every output as it&apos;s generated. No
            junior account manager, no 12-month contract, no PDF reports.
          </p>
          <p>
            We score 5/5 on the questions framework above by design. Every red
            flag in this page is a thing I personally hated as an agency client,
            so the service was built to fail none of them.
          </p>
          <p>
            If you want to see what this looks like for your specific business,
            the audit form below takes 60-90 seconds. I review every submission
            personally and email back a custom plan within 2 business days. No
            forced call. If you&apos;re evaluating other DFY services or
            alternatives first, see the comparison framework at{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>
            {" "}or the AI-marketing breakdown at{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce
            </Link>
            .
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

          <BlogAuthorBio
            bioOverride="Founder of Venti Scale, a done-for-you marketing service for ecommerce. I built Venti Scale specifically to fail zero of the red flags listed on this page, because every red flag here was a thing I hated as an agency client myself."
            lastUpdated="2026-04-29"
          />

          <div className="blog-related">
            <h3>Read the cluster — every question in depth</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/what-done-for-you-marketing-includes"
                className="blog-related-card"
              >
                <div className="related-title">
                  Done-for-you marketing: what&apos;s actually in the box (and
                  4 red flags most agencies hide)
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
              <Link
                href="/blog/done-for-you-marketing-vs-diy"
                className="blog-related-card"
              >
                <div className="related-title">
                  Done-for-you marketing vs DIY: which one fits your stage
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
              <Link
                href="/blog/done-for-you-social-media-management"
                className="blog-related-card"
              >
                <div className="related-title">
                  Done-for-you social media management: what to look for and
                  what to skip
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/marketing-agency-vs-in-house"
                className="blog-related-card"
              >
                <div className="related-title">
                  Marketing agency vs in-house: the math nobody shows you
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/signs-you-should-stop-diy-marketing"
                className="blog-related-card"
              >
                <div className="related-title">
                  Signs you should stop DIY marketing (and when DIY wins)
                </div>
                <div className="related-meta">6 min read</div>
              </Link>
              <Link
                href="/blog/when-to-hire-a-marketing-agency"
                className="blog-related-card"
              >
                <div className="related-title">
                  When to hire a marketing agency (and when to skip it)
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
            </div>
          </div>

          <div className="blog-cta">
            <h3>Want a transparent done-for-you plan for your business?</h3>
            <p>
              Submit a 60-90 second audit. I review every submission personally,
              answer the 5 questions framework upfront, and email back a custom
              plan within 2 business days. Month-to-month, no forced calls.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
