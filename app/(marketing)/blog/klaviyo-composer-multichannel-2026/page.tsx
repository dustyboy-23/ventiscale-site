import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SLUG = "klaviyo-composer-multichannel-2026";
const TITLE =
  "One prompt. Klaviyo just sent your email, SMS, push, and WhatsApp.";
const DESCRIPTION =
  "Klaviyo Composer generates full multichannel campaigns from one text prompt. Customer Agent handles order edits, returns, and subscriptions automatically.";
const DATE = "2026-08-17";
const IMAGE = "/blog/klaviyo-composer-multichannel.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

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
        alt: "Klaviyo Composer multichannel campaign automation for ecommerce brands",
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

const FAQ_DATA = [
  {
    q: "What is Klaviyo Composer?",
    a: "Klaviyo Composer is an AI campaign builder that generates complete multichannel marketing campaigns from a single plain-language prompt. It covers email, SMS, push notifications, and WhatsApp simultaneously. It draws on data from 193,000+ brands and 14+ years of marketing performance intelligence to calibrate what it generates.",
  },
  {
    q: "Can Klaviyo Customer Agent handle returns automatically?",
    a: "Yes. Returns and exchanges processing is one of Customer Agent&apos;s five built-in retail skills. The others are order tracking, order editing, subscription management, and loyalty account lookup. Customers initiate the process on any supported channel and the agent resolves it without escalating to a human rep.",
  },
  {
    q: "Does Klaviyo work with WhatsApp for ecommerce brands?",
    a: "Yes. Klaviyo Customer Agent operates across chat, SMS, email, and WhatsApp. Customers can track orders, edit subscriptions, and request returns directly in WhatsApp without contacting support through a separate channel or opening a ticket.",
  },
  {
    q: "How much does Klaviyo AI improve email marketing performance?",
    a: "Personalized send time in Klaviyo drives a 35% lift in click rate among top-performing campaigns, per Klaviyo&apos;s own benchmark data across 193,000+ brands. This is send-time optimization alone. Composer and Customer Agent add separate layers of automation on top.",
  },
  {
    q: "Should I still pay an agency to manage my Klaviyo account?",
    a: "It depends on what they&apos;re actually doing. If they&apos;re building custom flows, running cohort analysis, testing segments, and calibrating brand voice, that&apos;s still human work worth paying for. If they&apos;re scheduling one broadcast per week and calling it retention management, Composer now does that autonomously. Know the difference before you renew.",
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
          <Eyebrow>ECOMMERCE / RETENTION</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            One prompt. Klaviyo just sent your email, SMS, push, and WhatsApp.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              August 17, 2026
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
            alt="Klaviyo Composer multichannel campaign automation for ecommerce"
          />
        </div>

        <div className="prose-blog">
          <p>
            You write one paragraph. Your summer sale, your best-selling SKU,
            the angle you want. Klaviyo reads it and does the rest. Email built.
            SMS queued. Push notification set. WhatsApp message scheduled. Four
            channels. One input. You touched zero templates.
          </p>
          <p>
            That&apos;s what Klaviyo Composer does now. And if your retention
            agency hasn&apos;t told you this, you need to ask why.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Klaviyo Composer is now in private beta, generating complete
                multichannel campaigns across email, SMS, push, and WhatsApp
                from a single text prompt.
              </li>
              <li>
                Customer Agent handles five retail workflows without a human:
                order tracking, order editing, subscription management, returns
                and exchanges, and loyalty account lookup.
              </li>
              <li>
                Personalized send time drives a 35% lift in click rate across
                top-performing Klaviyo campaigns, per their own benchmark data
                across 193,000+ brands.
              </li>
              <li>
                If you&apos;re paying $1,500/mo for Klaviyo management, you need
                to know exactly what that agency is doing that this
                doesn&apos;t.
              </li>
            </ul>
          </div>

          <p>
            Klaviyo&apos;s August 2026 product announcement ships two things
            that directly replace what most retention agencies bill for:
            autonomous multichannel campaign generation and self-resolving
            customer service automation. That&apos;s not a feature update.
            That&apos;s a category shift.
          </p>

          <h2>What Klaviyo Composer actually does</h2>
          <p>
            Composer is in private beta as of this writing. It takes a
            plain-language prompt and generates a complete campaign. Not just an
            email. The full set: email, SMS, push notification, and WhatsApp
            message, coordinated across channels from one input.
          </p>
          <p>
            The model behind it isn&apos;t generic. According to{" "}
            <a
              href="https://www.klaviyo.com/blog/klaviyo-ai-for-autonomous-marketing-and-customer-service"
              target="_blank"
              rel="noopener noreferrer"
            >
              Klaviyo&apos;s August 2026 announcement
            </a>
            , it draws on 14+ years of marketing performance intelligence and
            data from billions of consumer interactions across 193,000+ brands.
            That&apos;s a different calibration than asking a generic AI to
            write your campaign brief.
          </p>
          <p>
            I went through the release notes line by line. The actual capability
            here is campaign generation from a plain brief. You describe the
            goal, the product, the offer. Composer builds the campaign
            structure, suggests the send cadence, and generates the copy for
            each channel simultaneously. The multichannel coordination is the
            new part. Most retention teams run email and SMS on separate
            workflows with separate briefs. Composer treats them as one campaign
            with four outputs.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key change</div>
            <p>
              Campaign generation across four channels from a single brief is
              the workflow that previously required a brief to a junior
              coordinator, drafts back for review, and two rounds of revisions.
              That workflow is now a prompt.
            </p>
          </div>

          <p>
            Private beta means not every account has it yet. It&apos;s
            shipping. If your account doesn&apos;t have it, it will. And when it
            does, the question of what your retention agency is billing you for
            gets very specific very fast.
          </p>

          <h2>Five things Customer Agent handles without a human</h2>
          <p>
            Customer Agent is live. It operates across four channels: chat, SMS,
            email, and WhatsApp. And it resolves five specific retail workflows
            autonomously.
          </p>
          <p>
            <strong>Order tracking.</strong> Customer asks where their package
            is. Customer Agent tells them, in the channel they used to ask.
          </p>
          <p>
            <strong>Order editing.</strong> Customer needs to change something
            before it ships. Address, quantity, variant. Customer Agent handles
            it without opening a ticket.
          </p>
          <p>
            <strong>Subscription editing.</strong> Customer wants to skip a
            month, change their frequency, or pause. Customer Agent does it.
            Without them emailing your support inbox and waiting two days for a
            response.
          </p>
          <p>
            <strong>Returns and exchanges.</strong> Customer initiates a return.
            Customer Agent processes it. This is the one that changes the math
            on your support team&apos;s ticket volume the most.
          </p>
          <p>
            <strong>Loyalty account lookup.</strong> Customer checks their
            points balance. Done.
          </p>
          <p>
            These aren&apos;t &quot;escalate to a human when it gets
            complicated&quot; half-answers. These are resolved in the channel
            the customer used to ask. No ticket opened. No wait for a human
            response. The customer asks in WhatsApp, gets the answer in
            WhatsApp. If you want to understand how Klaviyo handles the WhatsApp
            channel specifically,{" "}
            <Link href="/blog/klaviyo-whatsapp-ecommerce-2026">
              we covered that integration in depth here
            </Link>
            .
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">35%</div>
              <div className="stat-label">
                Click rate lift from personalized send time
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">5</div>
              <div className="stat-label">
                Automated retail skills in Customer Agent
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">193K+</div>
              <div className="stat-label">Brands powering the AI model</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>The send-time number your agency should be tracking</h2>
          <p>
            Klaviyo&apos;s personalized send time feature drives a 35% lift in
            click rate among top-performing campaigns. That&apos;s from
            Klaviyo&apos;s own benchmark data across their 193,000+ brand
            platform. Not a case study from one brand. A pattern across their
            full dataset.
          </p>
          <p>
            This feature isn&apos;t new. What&apos;s new is that Klaviyo is
            publishing the lift number explicitly, which means you can now ask
            your retention agency a direct question: are you using personalized
            send time, and what&apos;s our click rate compared to brands that
            do?
          </p>

          <div className="blog-warning">
            <div className="callout-label">Ask this before your next renewal</div>
            <p>
              If your retention agency manages your Klaviyo and can&apos;t tell
              you whether personalized send time is active on your campaigns,
              that&apos;s a gap. It&apos;s one toggle. It&apos;s free inside
              your existing Klaviyo plan. It drives a measurable click rate
              improvement. If it&apos;s not on, someone isn&apos;t paying
              attention.
            </p>
          </div>

          <p>
            This is the kind of table-stakes optimization that the platform now
            does automatically. The agencies that are still billing for
            &quot;ongoing Klaviyo management&quot; without this active are
            either not tracking it or hoping you won&apos;t ask.
          </p>

          <hr className="blog-divider" />

          <h2>What this means for your retention stack in 2026</h2>
          <p>
            Here&apos;s the real question: you&apos;re paying for someone to
            manage your Klaviyo account. Composer now generates the campaigns.
            Customer Agent handles the CX tickets. What exactly is the agency
            doing?
          </p>
          <p>
            A few things that are still human jobs:
          </p>
          <ul>
            <li>
              <strong>Cohort analysis.</strong> Why did your 90-day buyers not
              come back? What&apos;s the lifecycle pattern in your data? Composer
              doesn&apos;t think in cohorts.
            </li>
            <li>
              <strong>Segment strategy.</strong> Who do you suppress, who do you
              reactivate, who gets the loyalty play? That decision requires
              someone who knows your brand and your customer base.
            </li>
            <li>
              <strong>Brand voice calibration.</strong> Composer builds from
              performance data, not your specific voice. Someone still needs to
              make sure the output sounds like you.
            </li>
            <li>
              <strong>Test design and interpretation.</strong> The AI runs tests.
              Someone still needs to decide what to learn from them and what to
              do next.
            </li>
          </ul>
          <p>
            An agency doing those things earns the retainer. An agency that
            schedules one broadcast per week and writes &quot;Klaviyo
            management&quot; on the invoice is not doing those things.
          </p>
          <p>
            This is what shifts when a platform ships real automation. The
            execution work goes to the platform. The strategy layer stays human.
            If you&apos;ve been paying for execution, the math just changed.
          </p>
          <p>
            The{" "}
            <Link href="/blog/agency-retainer-true-cost-ecommerce-2026">
              real cost breakdown of what a Klaviyo retainer actually buys you
            </Link>{" "}
            breaks down what agencies charge vs. what they deliver in hours.
            It&apos;s worth reading before your next renewal conversation.
          </p>
          <p>
            If you&apos;re also looking at how{" "}
            <Link href="/blog/email-sms-roi-vs-meta-ads-dtc-2026">
              email and SMS stack up against paid channel ROI
            </Link>
            , the comparison matters more now that the retention side is getting
            more autonomous. Lower cost to run, higher ROI, and now more of it
            happens without a full agency team behind it.
          </p>
          <p>
            The brands winning on retention in 2026 aren&apos;t the ones with
            the biggest Klaviyo retainers. They&apos;re the ones using the
            platform&apos;s automation for execution and keeping a focused
            strategy layer human. That&apos;s exactly what good{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce
            </Link>{" "}
            looks like when it&apos;s actually working.
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
          <BlogAuthorBio
            bioOverride="I build retention systems for DTC brands and track what platforms like Klaviyo ship closely. When a tool ships something that changes the agency math, I write about it."
            lastUpdated={DATE}
          />

          {/* Related posts */}
          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/email-sms-roi-vs-meta-ads-dtc-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Email returns $36 for every dollar. Meta returns $2. Your
                  agency knows.
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/agency-retainer-true-cost-ecommerce-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Your agency quoted 15%. You&apos;re paying 28%.
                </div>
                <div className="related-meta">7 min read</div>
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
