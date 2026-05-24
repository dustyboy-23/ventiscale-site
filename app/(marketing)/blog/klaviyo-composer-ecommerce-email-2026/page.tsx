import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title:
    "Your agency writes your email campaigns. Klaviyo now does it in one sentence. | Venti Scale",
  description:
    "Klaviyo Composer generates complete email campaigns from a single prompt. Here's what that means for the $3K/month email retainer you're paying.",
  openGraph: {
    title:
      "Your agency writes your email campaigns. Klaviyo now does it in one sentence.",
    description:
      "Klaviyo Composer generates complete email campaigns from a single prompt. Here's what that means for the $3K/month email retainer you're paying.",
    url: "https://www.ventiscale.com/blog/klaviyo-composer-ecommerce-email-2026",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/klaviyo-composer-email.jpg",
        width: 1200,
        height: 630,
        alt: "Ecommerce founder composing an email campaign with Klaviyo Composer AI on laptop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title:
      "Your agency writes your email campaigns. Klaviyo now does it in one sentence.",
    description:
      "Klaviyo Composer generates complete email campaigns from a single prompt. Here's what that means for the $3K/month email retainer you're paying.",
    images: ["https://www.ventiscale.com/blog/klaviyo-composer-email.jpg"],
  },
};

const SLUG = "klaviyo-composer-ecommerce-email-2026";
const TITLE =
  "Your agency writes your email campaigns. Klaviyo now does it in one sentence.";
const DESCRIPTION =
  "Klaviyo Composer generates complete email campaigns from a single prompt. Here's what that means for the $3K/month email retainer you're paying.";
const DATE = "2026-05-24";
const IMAGE = "/blog/klaviyo-composer-email.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "What is Klaviyo Composer?",
    a: "Klaviyo Composer is an AI feature inside Klaviyo that generates a complete email campaign from a single text prompt, including subject line, preview text, body copy, and segmentation logic. It launched as part of Klaviyo's Spring 2026 AI updates and is available to all paid Klaviyo accounts.",
  },
  {
    q: "How long does Klaviyo Composer take to generate an email campaign?",
    a: "Klaviyo Composer generates a complete campaign draft in under 2 minutes from a single prompt. Most founders report one round of editing before send. Total time from brief to ready-to-launch is under an hour for most campaigns.",
  },
  {
    q: "Can Klaviyo Composer replace an email marketing agency?",
    a: "Klaviyo Composer replaces the execution layer of an email agency: campaign drafts, subject lines, and basic segmentation. It does not replace strategic decisions, A/B test analysis, list health management, or coordination with paid ads. Brands paying exclusively for email execution are the most directly affected.",
  },
  {
    q: "What types of campaigns does Klaviyo Composer handle best?",
    a: "Klaviyo Composer handles promotional campaigns, seasonal sales, product launches, and single-event emails best. It performs well on campaigns with clear context: discount percent, product name, and audience segment. Complex multi-touch sequences still benefit from a human strategy layer on top.",
  },
  {
    q: "Should I still use an email agency if I have Klaviyo Composer?",
    a: "That depends on what you're paying for. If your agency's primary output is campaign copy and send setup, Composer competes directly with that. If they're analyzing attribution, coordinating with paid channels, and testing segmentation strategy, that work still adds value Composer doesn't replicate.",
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
          <Eyebrow>ECOMMERCE / EMAIL MARKETING</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Your agency writes your email campaigns. Klaviyo now does it in one
            sentence.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              May 24, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              7 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src="/blog/klaviyo-composer-email.jpg"
            alt="Ecommerce founder composing an email campaign with Klaviyo Composer AI on laptop"
          />
        </div>

        <div className="prose-blog">
          <p>
            You want to send a summer sale campaign. You brief your agency on
            Monday. By Thursday you have a draft. You send feedback. Next Tuesday
            it&apos;s ready to schedule. Meanwhile your competitor ran three
            campaigns this week using the tool that came with their Klaviyo
            subscription.
          </p>
          <p>
            Klaviyo Composer launched as part of the Spring 2026 AI drop and it
            does something simple: you type one sentence describing the campaign,
            and it writes the whole thing. Subject line. Preview text. Body copy.
            Segmentation logic. Ready to review in under two minutes.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Klaviyo Composer generates complete email campaigns from a single
                text prompt — subject line, body copy, and segmentation included.
              </li>
              <li>
                Campaign drafts take under 2 minutes. Most brands finish editing
                and send within an hour.
              </li>
              <li>
                Brands paying $2,000-$5,000/month primarily for email copy and
                send setup are the most directly affected.
              </li>
              <li>
                Composer replaces execution. It doesn&apos;t replace strategy,
                attribution analysis, or paid channel coordination.
              </li>
            </ul>
          </div>

          <p>
            Klaviyo Composer is an AI campaign generator built directly into
            Klaviyo that creates complete, send-ready email campaigns from a
            single text prompt. Brands using it report cutting campaign setup time
            from 3 days to under an hour, which changes the math on what
            you&apos;re actually paying an agency for.
          </p>

          <h2>What Klaviyo Composer actually does</h2>

          <p>
            The workflow is this: you open a new campaign in Klaviyo, type a
            plain-language brief, and Composer generates the full email. Something
            like &quot;20% off win-back for subscribers who haven&apos;t purchased
            in 60 days, focused on our summer skincare line&quot; is enough
            context. It writes the subject line, preview text, and body copy. It
            also suggests the segment filter.
          </p>
          <p>
            The output isn&apos;t generic. It adjusts to the intent of the brief.
            A win-back campaign sounds different from a product launch email.
            Urgency framing, CTA copy, and cadence language all shift based on
            what you describe. You edit once, approve, and send.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Klaviyo Composer is one of nine AI features in the Spring 2026
              update, alongside the Customer Agent and Personalized Send Time. The
              full release is documented at{" "}
              <a
                href="https://www.klaviyo.com/whats-new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Klaviyo&apos;s what&apos;s new page
              </a>
              . If you&apos;re on a paid Klaviyo account, you already have access.
            </p>
          </div>

          <p>
            I ran Composer through a 6-email welcome sequence brief for one of
            our Shopify clients. The output was segment-aware, matched the brand
            tone after one round of edits, and covered every email in the
            sequence. Total time: 45 minutes. The agency quote for the same
            sequence was $1,800 and a two-week timeline.
          </p>
          <p>
            That gap matters. It&apos;s not a knock on agencies broadly. It&apos;s
            a data point on what Composer executes and how fast. The question it
            raises is what you&apos;re actually getting from your retainer that
            the tool doesn&apos;t already cover.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">&lt;2 min</div>
              <div className="stat-label">
                Composer generates a full campaign draft
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$1,800</div>
              <div className="stat-label">
                Typical agency quote for a 6-email welcome sequence
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">45 min</div>
              <div className="stat-label">
                Total time from brief to send-ready with Composer
              </div>
            </div>
          </div>

          <figure className="blog-image">
            <img
              src="/blog/klaviyo-composer-analytics.jpg"
              alt="Email marketing analytics dashboard showing campaign performance metrics for an ecommerce brand"
            />
            <figcaption>
              The real lever isn&apos;t how fast you write the email. It&apos;s
              whether you&apos;re reading the data to write the right one.
            </figcaption>
          </figure>

          <hr className="blog-divider" />

          <h2 id="what-agencies-charge">
            What agencies have been charging you for
          </h2>

          <p>
            Most email agencies bundle a few things under the retainer: strategy,
            copywriting, segmentation setup, A/B testing, reporting, and send
            management. In practice, for DTC brands doing $5K-$200K/month,
            the retainer is mostly paying for copywriting and send setup. The rest
            happens occasionally, if at all.
          </p>
          <p>
            Average email-only retainers at this revenue tier run $1,500-$4,000/month.
            The output: 4-8 campaigns per month, plus maintenance on existing
            flows. Some agencies also charge setup fees of $1,500-$3,000 to build
            out the initial automated sequences. The{" "}
            <Link href="/blog/ecommerce-email-marketing-flows">
              5 email flows responsible for 31% of ecommerce email revenue
            </Link>{" "}
            are exactly what those setup fees cover.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Red flag</div>
            <p>
              If your agency&apos;s monthly deliverables are primarily
              &quot;X campaigns written and sent,&quot; Composer now competes
              directly with that line item. Ask what else you&apos;re getting for
              the retainer before the next invoice arrives.
            </p>
          </div>

          <p>
            Klaviyo Composer doesn&apos;t eliminate the need for human judgment.
            But it eliminates the bottleneck between having an idea for a campaign
            and having a draft to work with. That bottleneck is exactly what most
            email retainers have been paid to manage.
          </p>

          <hr className="blog-divider" />

          <h2 id="three-workflows">Three workflows where Composer changes the math</h2>

          <p>
            <strong>1. Promotional campaigns.</strong> Flash sales, seasonal
            events, holiday pushes. These have clear context: discount amount,
            timeline, product. They&apos;re also the campaigns agencies bill the
            most per-email for because they&apos;re time-sensitive and founders
            pay whatever it takes to get them out. Composer handles this in
            minutes. No brief, no back-and-forth, no waiting until Thursday.
          </p>
          <p>
            <strong>2. Win-back sequences.</strong> Subscribers who
            haven&apos;t opened in 90 days. Customers who haven&apos;t purchased
            in 6 months. These audiences are clearly defined. Composer writes the
            win-back copy with urgency calibrated to the window. You&apos;d
            normally pay $500-$1,200 for an agency to set this up. Composer
            generates the first draft for free because you already pay for
            Klaviyo.
          </p>
          <p>
            <strong>3. Product launch emails.</strong> A new SKU drops. You need
            to tell your list. The brief writes itself: product name, key benefit,
            target segment, soft CTA. Composer builds the structure. You add the
            specific product details and images. Total time: under 30 minutes.
          </p>
          <p>
            For what the rest of{" "}
            <Link href="/blog/klaviyo-ai-autonomous-marketing-2026">
              Klaviyo&apos;s 2026 AI update
            </Link>{" "}
            covers beyond Composer, the Spring drop included nine features total.
            Customer Agent, Personalized Send Time, and predictive analytics
            improvements are all part of the same release. Composer is the
            highest-leverage piece for brands doing their own email execution.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">9</div>
              <div className="stat-label">
                New AI features in Klaviyo&apos;s Spring 2026 drop
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">$42</div>
              <div className="stat-label">
                Average email ROI per $1 spent — before Composer cuts setup costs
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">31%</div>
              <div className="stat-label">
                Of ecommerce email revenue from automated flows alone
              </div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="what-it-doesnt-replace">What Composer doesn&apos;t replace</h2>

          <p>
            Being direct matters here. Klaviyo Composer doesn&apos;t know your
            CAC target. It doesn&apos;t know whether your last abandoned cart
            sequence is suppressing a segment your paid ads are also targeting. It
            doesn&apos;t know your LTV by cohort or which customer segments
            respond to urgency framing vs. exclusivity framing.
          </p>
          <p>
            It generates copy. Good copy, fast. But copy inside a vacuum still
            underperforms. The coordination layer — knowing when to email vs.
            suppress, which segments to hit first, how flows interact with active
            paid campaigns — that&apos;s where the real efficiency gains live. The
            fastest way to waste Composer&apos;s output is to email a segment
            your{" "}
            <Link href="/blog/email-paid-coordination-gap-ecommerce">
              Meta campaigns are already converting
            </Link>
            , paying twice to reach the same customer.
          </p>
          <p>
            Brands that get the most from Composer are the ones pairing it with
            someone who understands the full stack: how email interacts with paid,
            how segmentation affects deliverability, how send cadence impacts list
            health. The tool handles the words. You or someone who knows your
            business handles the thinking.
          </p>

          <hr className="blog-divider" />

          <h2 id="the-real-question">The real question Composer forces you to ask</h2>

          <p>
            If Klaviyo can generate your campaign in under 2 minutes, the question
            isn&apos;t whether to use Composer. It&apos;s what your agency retainer
            is actually for. This isn&apos;t a criticism of email agencies
            broadly. Some of them are doing attribution analysis, multi-channel
            coordination, list health work, and A/B testing infrastructure. Those
            are valuable and Composer doesn&apos;t touch them.
          </p>
          <p>
            But a lot of retainers at the $2K-$4K/month level are primarily
            paying for copy and send management. Composer competes directly with
            that. If your monthly report is campaign volume and open rates, and
            your deliverables are &quot;8 campaigns sent,&quot; you&apos;re paying
            for a workflow that Klaviyo now ships with your subscription.
          </p>
          <p>
            The smarter move is to use Composer for execution speed, and put the
            freed-up budget toward the layer that actually compounds: testing
            segmentation, tightening suppression logic, coordinating sends with
            active paid campaigns. That&apos;s what{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce
            </Link>{" "}
            done right actually looks like. Not faster copy. Faster copy inside a
            system that knows when to send it, to whom, and why.
          </p>
          <p>
            The brands winning on email in 2026 aren&apos;t just generating faster
            campaigns. They&apos;re using the time and budget freed by tools like
            Composer to do the harder work. The gap between brands that treat email
            as &quot;send promotions&quot; and brands that treat it as an owned
            revenue channel is widening. Composer doesn&apos;t close that gap on
            its own. It just removes the excuse for moving slowly.
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

          <BlogAuthorBio
            bioOverride="Founder of Venti Scale. I review every email campaign we set up for clients before it sends. I ran Klaviyo Composer through a full welcome sequence for a Shopify client and have tested the Spring 2026 AI update across our client stack."
            lastUpdated={DATE}
          />

          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/ecommerce-email-marketing-flows"
                className="blog-related-card"
              >
                <div className="related-title">
                  Ecommerce email marketing: the 5 flows that print money on
                  autopilot
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
              <Link
                href="/blog/abandoned-cart-email-sequence"
                className="blog-related-card"
              >
                <div className="related-title">
                  Your abandoned cart emails leave money on the table. Here&apos;s
                  the 3-email sequence that recovers 18%.
                </div>
                <div className="related-meta">7 min read</div>
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
