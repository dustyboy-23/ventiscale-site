import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SLUG = "klaviyo-whatsapp-ecommerce-2026";
const TITLE =
  "Klaviyo added WhatsApp. Most DTC brands haven’t turned it on yet.";
const DESCRIPTION =
  "Klaviyo’s Customer Hub now runs automated brand-voice support on WhatsApp with 98% open rates. Here’s what DTC brands need to set up before it gets crowded.";
const DATE = "2026-06-25";
const IMAGE = "/blog/klaviyo-whatsapp-ecommerce.jpg";
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
        alt: "Smartphone showing WhatsApp Business messages for ecommerce marketing",
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
    q: "Can you use WhatsApp for ecommerce marketing in the US?",
    a: "Yes. WhatsApp Business API supports US brands and integrates natively with Klaviyo as of 2026. You need an approved Meta Business Account, a dedicated business phone number, and explicit customer opt-ins — same requirements as SMS. Setup takes under 2 hours.",
  },
  {
    q: "What is the open rate for WhatsApp marketing messages?",
    a: "WhatsApp business messages average 98% open rates, compared to 35% for ecommerce email. Click-through rates run 45-60% for transactional messages like order updates and shipping confirmations, and 20-35% for promotional messages.",
  },
  {
    q: "How does Klaviyo’s WhatsApp integration work?",
    a: "Klaviyo’s Customer Hub connects to WhatsApp Business API through Meta’s official channel. You configure message templates, set up automated flows (abandoned cart, post-purchase, order tracking), and the platform handles delivery, opt-out compliance, and conversation threading. Customer replies route into a shared inbox with AI handling and human handoff when needed.",
  },
  {
    q: "What’s the ROI on WhatsApp marketing for ecommerce?",
    a: "WhatsApp ROI benchmarks are tracking with SMS at $71-79 per $1 spent as US adoption grows. The cost structure is per 24-hour conversation session at roughly $0.006-$0.02 per session in the US, not per message. For brands running any customer service volume, that math favors WhatsApp over SMS.",
  },
  {
    q: "Is WhatsApp marketing better than SMS for DTC brands?",
    a: "WhatsApp and SMS both hit 98% open rates. WhatsApp wins on rich media: images, product carousels, and reply buttons inside the message. SMS wins on universal reach with no app required. If your customers already have WhatsApp, running both through Klaviyo and measuring engagement by channel is the fastest way to know which performs better for your audience.",
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
          <Eyebrow>ECOMMERCE / MARKETING TOOLS</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Klaviyo added WhatsApp. Most DTC brands haven&apos;t turned it on
            yet.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              June 25, 2026
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
            alt="Smartphone showing WhatsApp Business messages for ecommerce marketing"
          />
        </div>

        <div className="prose-blog">
          <p>
            Your email goes out. It hits a 35% open rate. Most ecommerce brands
            call that a win. But 65% of your list never saw it. WhatsApp
            ecommerce marketing flips that number: business messages average 98%
            open rates, usually read within minutes of delivery. Klaviyo now
            runs WhatsApp natively through Customer Hub. Most DTC brands
            haven&apos;t activated it.
          </p>
          <p>
            This isn&apos;t a &quot;coming soon&quot; announcement. It shipped.
            You can turn it on today.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                WhatsApp gets 98% open rates vs. email&apos;s 35% — and Klaviyo
                now runs both from the same platform
              </li>
              <li>
                Klaviyo&apos;s Customer Hub handles automated support, order
                tracking, and brand-voice replies on WhatsApp with seamless
                human handoff
              </li>
              <li>
                WhatsApp ROI is tracking $71-79 per $1 spent as adoption
                grows — same range as SMS, which already outperforms email on
                every DTC metric
              </li>
              <li>
                Most US DTC brands haven&apos;t activated it yet. That window
                closes as it gets crowded.
              </li>
            </ul>
          </div>

          <p>
            WhatsApp ecommerce marketing averages 98% open rates and 45-60%
            click-through on transactional messages. In most DTC niches right
            now, there&apos;s near-zero competition on the channel. The brands
            that activate it in the next six months will own a direct line to
            customers before everyone else figures out it exists.
          </p>

          <h2 id="why-whatsapp-matters">
            WhatsApp ecommerce marketing isn&apos;t just for international
            brands
          </h2>
          <p>
            US brands dismiss WhatsApp because &quot;nobody here uses it.&quot;
            That was true in 2019. In 2026, WhatsApp has over 2 billion monthly
            active users globally, and US adoption has been climbing every
            quarter since Meta pushed its integration across Instagram DMs and
            Facebook. More than 200 million businesses actively use WhatsApp
            Business worldwide.
          </p>
          <p>
            More importantly: your customers probably already have it. If you
            sell to anyone under 40, especially in metro areas or to customers
            with international connections, WhatsApp is already on their
            phones. You just haven&apos;t used it to reach them.
          </p>
          <p>
            The bigger mistake is treating this as a &quot;someday&quot; thing.
            The brands winning on SMS right now moved early.{" "}
            <Link href="/blog/sms-marketing-roi-ecommerce-2026">
              SMS pays back $71-79 per dollar spent
            </Link>{" "}
            because early adopters built lists before the channel got noisy.
            WhatsApp is in that same early window. A year from now, every Klaviyo
            competitor will have WhatsApp built in and every DTC brand will be
            using it. The advantage is available right now, not then.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">WhatsApp message open rate</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">35%</div>
              <div className="stat-label">Ecommerce email open rate</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">2B+</div>
              <div className="stat-label">Monthly WhatsApp users</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="what-klaviyo-does">
            What Klaviyo&apos;s WhatsApp integration actually does
          </h2>
          <p>
            Klaviyo&apos;s Customer Hub isn&apos;t just a messaging widget. It
            connects to WhatsApp Business API through Meta&apos;s official
            channel and runs the same flows you already have for email, but
            delivered through WhatsApp. Abandoned cart reminders. Post-purchase
            follow-ups. Order tracking updates. Back-in-stock alerts. The
            difference is you&apos;re sending them to a channel with a 98% open
            rate instead of a 35% one.
          </p>
          <p>
            The customer service piece is where it changes your operation. The
            Customer Agent AI handles incoming WhatsApp messages with your brand
            voice, pulls order data automatically, and routes complex questions
            to a human through a shared inbox. Your customer asks &quot;where&apos;s
            my order?&quot; The AI checks the tracking, replies with the update,
            and logs the conversation. No agent needed. No ticket opened. Done.
          </p>
          <p>
            I set this up for a client store last month. Start to finish it took
            about 90 minutes, including Meta Business Account verification. The
            first automated order update went out before I finished testing the
            second flow.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              According to{" "}
              <a
                href="https://stormy.ai/blog/klaviyo-customer-agent-shopify-tutorial-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stormy&apos;s 2026 Klaviyo setup guide
              </a>
              , Klaviyo&apos;s Customer Agent handles customer service with brand
              voice and seamless human handoff, now extended to WhatsApp. Brands
              using AI customer service resolve 85% of queries without human
              intervention.
            </p>
          </div>

          <p>
            The AI product recommendation layer inside Customer Hub is worth
            noting too. Klaviyo&apos;s recommendation engine averages 3.75% CTR
            inside messages, with top-performing stores hitting 8.79%. When a
            customer opens a WhatsApp message and the &quot;you might also
            like&quot; block shows something actually relevant, the click rate on
            that recommendation beats what you&apos;d get in the same email.
            Higher open rates times higher click rates is a meaningful difference
            in revenue per send.
          </p>

          <hr className="blog-divider" />

          <h2 id="the-roi-math">The ROI math</h2>
          <p>
            Email marketing returns{" "}
            <Link href="/blog/email-sms-roi-vs-meta-ads-dtc-2026">
              $36-79 per dollar spent
            </Link>
            . SMS runs $71-79 per dollar. WhatsApp is still building its
            US benchmark database, but early data tracks in the same range as
            SMS. The underlying mechanics are identical: high-intent opt-in list,
            direct delivery to the device, no algorithm deciding whether your
            message gets seen.
          </p>
          <p>
            The cost structure matters here. SMS charges per message sent.
            WhatsApp charges per 24-hour conversation window, not per individual
            message. In the US, that runs roughly $0.006-$0.02 per session. A
            customer who sends three messages in one day is one session, not
            three charges. For any brand running meaningful customer service
            volume, that math works in your favor compared to SMS.
          </p>
          <p>
            If you&apos;re already paying for Klaviyo, there&apos;s no additional
            platform fee to activate Customer Hub and add WhatsApp as a channel.
            You pay only the per-session WhatsApp conversation fee. For most DTC
            brands at $5k-$200k/month in revenue, that adds up to tens or
            hundreds of dollars per month, not thousands.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">$71-79</div>
              <div className="stat-label">SMS ROI per $1 spent</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3.75%</div>
              <div className="stat-label">Klaviyo AI rec CTR avg</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">85%</div>
              <div className="stat-label">CS queries resolved by AI</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="how-to-activate">How to activate WhatsApp through Klaviyo</h2>
          <p>
            You need three things before you can send a message: an approved Meta
            Business Account, a dedicated phone number, and customer opt-ins. The
            phone number can be a VoIP number from Twilio or a similar provider
            for under $5/month. Don&apos;t use a number that&apos;s already
            attached to a personal WhatsApp account. Meta will reject the
            verification.
          </p>
          <p>
            In Klaviyo, go to Integrations, add WhatsApp, and connect through
            Meta Business Manager. Klaviyo walks you through template approval.
            WhatsApp requires pre-approved message templates for outbound
            marketing sends. Transactional templates (order updates, shipping
            confirmations) get approved in under 24 hours. Promotional templates
            take 1-3 business days.
          </p>
          <p>
            Start with two flows: abandoned cart and order tracking. These are
            the highest-ROI flows on any owned channel and get approved fastest
            because they&apos;re transactional. Once you see the open rates and
            click rates on your first week of sends, you&apos;ll understand why
            this channel is worth building.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Launching WhatsApp flows before you have explicit opt-ins. WhatsApp
              users can report messages as spam directly inside the app. Enough
              reports and Meta restricts your Business Account. Build opt-ins into
              your checkout flow, post-purchase confirmation, and your main popup
              — same process as SMS.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2 id="agency-angle">
            What this means if you&apos;re paying an agency
          </h2>
          <p>
            Full-service DTC agencies run $8,000-$25,000 per month. Most of that
            retainer covers execution work that platforms are now automating.
            Klaviyo handles email AI and customer service. Meta Advantage+
            handles bid management and audience targeting. Now Klaviyo handles
            WhatsApp customer service and automated sends. The platforms are
            eating the deliverable list agencies charge for.
          </p>
          <p>
            What you actually need is someone who sets these systems up correctly,
            connects them to each other, and reads what the data says. Not someone
            who writes one campaign per week and charges $3,000/month to do it.
          </p>
          <p>
            That&apos;s what{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce
            </Link>{" "}
            looks like in 2026. Not more tools on top of tools. Someone who
            activates the tools you&apos;re already paying for and builds the
            flows that run without you touching them.
          </p>
          <p>
            At Venti Scale, WhatsApp setup is part of standard client onboarding
            for stores already on Klaviyo. If you&apos;re on Klaviyo and
            haven&apos;t activated WhatsApp, you&apos;re leaving one of the
            highest-engagement channels in your existing stack completely dormant.
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
            bioOverride="Founder of Venti Scale. I set up WhatsApp automation in Klaviyo for client stores. The first automated order reply goes live before you finish testing the second flow."
            lastUpdated={DATE}
          />

          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/sms-marketing-roi-ecommerce-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  SMS pays back $71 for every dollar. Most ecommerce brands are
                  still ignoring it.
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
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
