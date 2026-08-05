import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

const SLUG = "eu-ai-act-ecommerce-chatbot-2026";
const TITLE =
  "EU AI Act went live Aug 2. Your Klaviyo chatbot is now regulated.";
const DESCRIPTION =
  "Article 50 of the EU AI Act requires AI chatbots to disclose they're AI before talking. US DTC brands with EU customers are in scope. Fines reach €15M.";
const DATE = "2026-08-05";
const IMAGE = "/blog/eu-ai-act-ecommerce-chatbot.jpg";
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
        alt: "EU AI Act compliance gavel - AI chatbot disclosure requirements for ecommerce brands",
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
    q: "Does the EU AI Act apply to US ecommerce brands?",
    a: "Yes. Article 50 applies wherever AI system output reaches EU users, regardless of where the provider is based. A US DTC brand running a chatbot on its Shopify store that EU customers can access is in scope. Geography is not an exemption.",
  },
  {
    q: "What AI tools count as a chatbot under Article 50?",
    a: "Any AI system designed to interact directly with a person in real time counts — live chat widgets, AI customer service agents, virtual assistants. Passive outbound automation like email sequences and SMS flows is not considered direct interaction and falls outside Article 50's scope.",
  },
  {
    q: "What does a compliant AI disclosure need to say?",
    a: "No mandated exact wording exists, but the disclosure must appear before or at the very start of the interaction and clearly communicate the user is talking to an AI. A message like 'I'm your AI shopping assistant' in the chatbot's first response qualifies. A footer disclaimer alone does not.",
  },
  {
    q: "What are the fines for an AI chatbot that doesn't disclose it's AI to EU users?",
    a: "Article 50 transparency violations carry fines up to €15 million or 3% of total worldwide annual turnover, whichever is higher. Proportionality applies for smaller businesses, but the baseline is not trivial for any brand with meaningful EU revenue.",
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
          <Eyebrow>ECOMMERCE / AI COMPLIANCE</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            EU AI Act went live Aug 2. Your Klaviyo chatbot is now regulated.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              August 5, 2026
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
            alt="EU AI Act compliance gavel representing AI chatbot disclosure requirements for ecommerce brands"
          />
        </div>

        <div className="prose-blog">
          <p>
            Three days ago, Article 50 of the EU AI Act became enforceable. Your
            agency hasn&apos;t mentioned it. Most software vendors haven&apos;t
            either. If you run an AI chatbot on your ecommerce store and any of
            your customers are in the EU, you&apos;re now operating under a law
            with fines that reach &euro;15 million.
          </p>
          <p>
            This isn&apos;t a &quot;coming soon&quot; regulation. It&apos;s live.
            And the US-based DTC brand exemption people are hoping for doesn&apos;t
            exist.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                EU AI Act Article 50 went into effect August 2, 2026. AI chatbots
                must disclose they&apos;re AI before the conversation starts or face
                fines up to &euro;15M or 3% of global revenue.
              </li>
              <li>
                US DTC brands are not exempt. If your chatbot reaches EU users,
                you&apos;re in scope.
              </li>
              <li>
                Live chat widgets and AI customer service agents are covered. Email
                flows and SMS sequences are not &mdash; they&apos;re outbound, not
                direct interaction.
              </li>
              <li>
                Existing systems get until December 2, 2026. New deployments must
                comply now.
              </li>
            </ul>
          </div>

          <p>
            Article 50 applies to any AI system that interacts directly with a person
            in real time. If your chatbot doesn&apos;t disclose it&apos;s AI at
            the start of a conversation, you&apos;re non-compliant starting August
            2, 2026. The fix is straightforward. The enforcement is real.
          </p>

          <h2>What Article 50 actually requires</h2>
          <p>
            The rule is simple: before a conversation starts, the person on the
            other end needs to know they&apos;re talking to an AI. Not buried in
            your privacy policy. Not in a footer nobody reads. At the first point
            of contact, in the chatbot&apos;s opening interaction.
          </p>
          <p>
            The only exception is when it&apos;s obvious to &quot;an average person
            who is reasonably well-informed and observant&quot; that they&apos;re
            dealing with AI. The European Commission interprets this restrictively.
            A chatbot named &quot;Emma&quot; with a human avatar doesn&apos;t
            qualify for the exception just because AI chatbots are common. A
            customer service bot in a sci-fi store named &quot;RoboHelper
            3000&quot; probably does.
          </p>
          <p>
            If you run a chatbot that looks and sounds human, that&apos;s exactly
            the scenario this rule was written for. You need to add the disclosure.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">&euro;15M</div>
              <div className="stat-label">Maximum fine for Article 50 violations</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">3%</div>
              <div className="stat-label">
                Of global revenue (alternative penalty, whichever is higher)
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">Dec 2</div>
              <div className="stat-label">
                Extended deadline for pre-existing systems
              </div>
            </div>
          </div>

          <p>
            Source:{" "}
            <a
              href="https://pctechmag.com/2026/08/from-today-a-chatbot-in-the-eu-has-to-say-its-a-chatbot/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PC Tech Magazine &mdash; EU AI Act Article 50 enforcement overview
            </a>
            .
          </p>

          <hr className="blog-divider" />

          <h2>Which tools are covered (and which aren&apos;t)</h2>
          <p>
            Article 50 is specifically scoped to AI systems that &quot;interact
            directly with natural persons.&quot; That phrase matters.
          </p>
          <p>
            <strong>Covered:</strong> Live chat widgets powered by AI, AI customer
            service agents in chat mode, website chatbots, voice assistants. These
            are direct, real-time, person-facing interactions. They fall squarely
            inside Article 50.
          </p>
          <p>
            <strong>Not covered:</strong> Email flows, SMS automation, and Klaviyo
            sequences. These are outbound, asynchronous communications that a human
            business owner approves before they go out. They&apos;re not
            &quot;direct interaction&quot; under the regulation. If you&apos;re
            running{" "}
            <Link href="/blog/dtc-email-flows-vs-campaigns-revenue-2026">
              automated email flows for DTC retention
            </Link>
            , those don&apos;t trigger Article 50.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key distinction</div>
            <p>
              The Klaviyo Customer Agent has two modes: email and SMS automation
              (outbound, async, outside Article 50) and live web chat (direct,
              real-time, inside Article 50). If you&apos;ve turned on the web chat
              feature, that component needs the disclosure. The email side
              doesn&apos;t.
            </p>
          </div>

          <p>
            The practical question for your store: does your site have a chat widget
            that opens in real time when a customer clicks it? If that widget is
            powered by AI and presents as a human agent, you need a disclosure before
            the first message. That&apos;s the whole rule in practice.
          </p>
          <p>
            AI-powered{" "}
            <Link href="/blog/klaviyo-autonomous-agent-cx-ecommerce-2026">
              Klaviyo customer agents
            </Link>{" "}
            handling multi-channel support are one of the most common setups we see
            for DTC brands right now. If the web chat interface is live, the
            disclosure needs to be live too.
          </p>

          <hr className="blog-divider" />

          <h2>US brands aren&apos;t exempt</h2>
          <p>
            This is the part most US founders are assuming away. The EU AI Act was
            written with extraterritorial reach. It covers &quot;providers established
            outside the EU&quot; where the output of their system reaches EU users.
            Geography is not an exemption.
          </p>
          <p>
            If you ship to Germany, France, Spain, or any EU country and your chatbot
            is live on your store, your chatbot falls under Article 50. Enforcement
            runs through national market surveillance authorities in each EU member
            state, plus the EU AI Office for larger cases. The US address on your LLC
            doesn&apos;t factor into their jurisdiction.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Familiar pattern</div>
            <p>
              &quot;We&apos;re a US company so EU regulations don&apos;t apply to
              us.&quot; This is the same assumption brands made about GDPR before
              2018 enforcement. The EU AI Act has the same extraterritorial structure.
              If EU residents use your chatbot, you&apos;re in scope.
            </p>
          </div>

          <p>
            You don&apos;t need to block EU visitors or rebuild your store. You need
            to add a disclosure line to your chatbot. It&apos;s a short fix with a
            real consequence if you skip it.
          </p>

          <h2>What the disclosure needs to say</h2>
          <p>
            No mandated exact language exists in the regulation. The requirement is
            functional: the user must know they&apos;re talking to an AI before the
            conversation begins. A few examples that work:
          </p>
          <p>
            &quot;Hi, I&apos;m your AI shopping assistant. How can I help you
            today?&quot; That&apos;s compliant. The AI identification is in the
            opening line, it&apos;s clear, and it&apos;s visible before the
            conversation goes anywhere.
          </p>
          <p>
            &quot;You&apos;re chatting with an AI assistant&quot; as a label in the
            chat widget header, plus an AI introduction in the first message. Even
            better &mdash; double coverage.
          </p>
          <p>
            A human name with no AI disclosure anywhere in the opening interaction is
            non-compliant. A footer note buried under your cookie policy doesn&apos;t
            count. The disclosure needs to be where the interaction starts, not where
            people never look.
          </p>
          <p>
            For most chatbot platforms, this is a configuration change in the welcome
            message template. It takes about fifteen minutes.
          </p>

          <hr className="blog-divider" />

          <h2>The two deadlines you need to know</h2>
          <p>
            Article 50 went live August 2, 2026. For new AI systems deployed after
            that date, compliance is required immediately. No grace period for a
            chatbot you launch next week.
          </p>
          <p>
            For existing systems already running before August 2, the extended
            deadline is December 2, 2026. That&apos;s your window to update the
            chatbot configuration, add the disclosure language, and verify it appears
            before the first message exchange.
          </p>
          <p>
            Four months sounds comfortable. It isn&apos;t, if you&apos;re managing
            through an agency that hasn&apos;t flagged this yet. The review, the
            change request, the back-and-forth, the re-test. Agency time compresses
            that window fast.
          </p>

          <h2>What this means for your marketing stack</h2>
          <p>
            If you&apos;re running an AI chatbot, this is a fifteen-minute fix. Open
            your chatbot settings, update the initial greeting to identify as AI,
            confirm it shows before the first message, done. The technology isn&apos;t
            complicated. The compliance is just a disclosure.
          </p>
          <p>
            The larger shift is that AI-powered ecommerce tools are now regulated
            infrastructure. &quot;Does this chatbot comply with Article 50?&quot; is
            now a question on your vendor evaluation checklist, the same way GDPR data
            processing agreements became standard practice after 2018. The{" "}
            <Link href="/ai-marketing-for-ecommerce">AI marketing for ecommerce</Link>{" "}
            stack is getting more capable and more scrutinized at the same time.
          </p>
          <p>
            After reading the full Article 50 text in August, I audited every live
            chat touchpoint we manage for clients against the disclosure requirements.
            Most were already compliant. For the ones that weren&apos;t, the fix was
            under fifteen minutes per store. If you&apos;re running{" "}
            <Link href="/blog/ai-customer-service-ecommerce-2026">
              AI customer service on your ecommerce store
            </Link>
            , run the same check today.
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
            bioOverride="Founder of Venti Scale. After August 2 enforcement went live, I reviewed every AI chatbot touchpoint we manage for clients against the Article 50 disclosure requirements. It's a fifteen-minute fix once you know what to look for."
            lastUpdated={DATE}
          />

          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/klaviyo-autonomous-agent-cx-ecommerce-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Klaviyo just became your CX team. Your agency didn&apos;t see
                  this coming.
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/ai-customer-service-ecommerce-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Your store makes the sale. Your customer service loses the repeat
                  order.
                </div>
                <div className="related-meta">8 min read</div>
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
