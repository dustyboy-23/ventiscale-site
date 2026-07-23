import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title:
    "ChatGPT runs ads now. Here's what DTC brands should do about it. | Venti Scale",
  description:
    "OpenAI launched self-serve ChatGPT ads on July 22, 2026. 900 million weekly users. Early advertisers call it expensive with unclear returns. Here's the smarter play.",
  openGraph: {
    title: "ChatGPT runs ads now. Here's what DTC brands should do about it.",
    description:
      "OpenAI launched self-serve ChatGPT ads on July 22, 2026. 900 million weekly users. Early advertisers call it expensive with unclear returns. Here's the smarter play.",
    url: "https://www.ventiscale.com/blog/chatgpt-ads-ecommerce-2026",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/chatgpt-ads-ecommerce-2026.jpg",
        width: 1200,
        height: 630,
        alt: "AI chat interface showing product recommendations and sponsored content",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "ChatGPT runs ads now. Here's what DTC brands should do about it.",
    description:
      "OpenAI launched self-serve ChatGPT ads on July 22, 2026. 900 million weekly users. Early advertisers call it expensive with unclear returns. Here's the smarter play.",
    images: [
      "https://www.ventiscale.com/blog/chatgpt-ads-ecommerce-2026.jpg",
    ],
  },
};

const SLUG = "chatgpt-ads-ecommerce-2026";
const TITLE =
  "ChatGPT runs ads now. Here's what DTC brands should do about it.";
const DESCRIPTION =
  "OpenAI launched self-serve ChatGPT ads on July 22, 2026. 900 million weekly users. Early advertisers call it expensive with unclear returns. Here's the smarter play.";
const DATE = "2026-07-23";
const IMAGE = "/blog/chatgpt-ads-ecommerce-2026.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "What are ChatGPT ads and how do they work for ecommerce brands?",
    a: "ChatGPT ads are sponsored responses inside ChatGPT conversations, launched by OpenAI on July 22, 2026. A shopper asks a product question and a brand&apos;s ad appears alongside the AI response, clearly labeled as sponsored. They reach free-tier ChatGPT users in 7 markets including the US, UK, and Canada. Early advertisers from the launch include Best Buy, Lowe&apos;s, and VistaPrint.",
  },
  {
    q: "Should my DTC brand buy ChatGPT ads right now?",
    a: "Not as your first move. Early advertisers in the July 2026 launch describe the channel as expensive with unclear returns after two weeks. Before buying paid placement, lock in organic ChatGPT citations first. Brands already appearing organically in ChatGPT responses get those mentions for free. Add paid placement on top of organic visibility, not instead of it.",
  },
  {
    q: "How do I get my Shopify store to show up in ChatGPT responses for free?",
    a: "ChatGPT pulls from publicly crawlable content. Three things move the needle: product Schema.org markup so AI can parse exactly what you sell, FAQ pages that mirror how shoppers phrase questions to AI, and specific authoritative product descriptions with concrete claims rather than vague benefit language. Thin pages with no structured data are invisible to ChatGPT regardless of product quality.",
  },
  {
    q: "Who sees ChatGPT ads and who doesn&apos;t?",
    a: "Only free-tier ChatGPT users in the 7 launch markets see ads. Plus, Pro, Business, and Education subscribers are excluded, as are users under 18. If your DTC target buyer skews toward paid ChatGPT subscribers, a significant portion of your potential audience on this channel won&apos;t see your paid placement at all. Organic citations reach all tiers equally.",
  },
  {
    q: "How much do ChatGPT ads cost for DTC brands?",
    a: "OpenAI hasn&apos;t published CPM or CPC benchmarks. Early advertisers in the July 2026 launch describe the channel as expensive relative to returns in its first weeks. This tracks with every major ad platform at launch. Budget conservatively until OpenAI publishes performance data, and test organic AI citation optimization before committing paid budget.",
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
          <Eyebrow>ECOMMERCE / AI MARKETING</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            ChatGPT runs ads now. Here&apos;s what DTC brands should do about
            it.
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              July 23, 2026
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
            alt="AI chat interface showing product recommendations alongside sponsored brand content"
          />
        </div>

        <div className="prose-blog">
          <p>
            Someone types &quot;what&apos;s the best protein powder for
            beginners&quot; into ChatGPT. They get a response. Alongside the
            recommendation: a sponsored ad. It&apos;s not the brand with the best
            product. It&apos;s the brand that bought the spot.
          </p>
          <p>
            That&apos;s not hypothetical.{" "}
            <a
              href="https://explainx.ai/blog/openai-advertise-in-chatgpt-ads-launch-july-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI launched its self-serve Ads Manager on July 22, 2026
            </a>
            . ChatGPT is now a paid advertising channel. Most DTC brands are
            still figuring out what to do about it.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                OpenAI launched self-serve ChatGPT ads on July 22 across 7
                markets including the US, UK, and Canada.
              </li>
              <li>
                ChatGPT has 900 million weekly active users. Many ask product
                questions with real buying intent before they visit a store.
              </li>
              <li>
                Early advertisers describe the channel as expensive with unclear
                returns after two weeks. The organic play is still cheaper.
              </li>
              <li>
                Lock in organic AI citations before you spend on paid. Paying for
                a spot you could earn for free is backward.
              </li>
            </ul>
          </div>

          <p>
            Brands that show up organically in ChatGPT product responses get
            cited for free. Brands that skip the organic foundation will pay to
            appear in the same spot and pay more as the channel matures and
            competition drives costs up.
          </p>

          <h2 id="what-launched">What OpenAI actually launched</h2>
          <p>
            This isn&apos;t a test. OpenAI built a self-serve Ads Manager that
            lets brands buy sponsored placement inside ChatGPT responses. It went
            live July 22 in 7 markets simultaneously: the US, UK, Canada,
            Australia, Japan, Korea, and New Zealand. Those 7 markets cover a
            small share of the global population but a large share of world
            economic output.
          </p>
          <p>
            The format puts brand ads alongside AI-generated answers when users
            ask relevant questions. Named early advertisers include Best Buy,
            Lowe&apos;s, and VistaPrint. Bigger brands, not DTC startups. They
            were first because they had existing relationships with OpenAI, not
            because the self-serve platform was available to them earlier.
          </p>
          <p>
            Worth noting: Sam Altman said in 2024 that &quot;ads plus AI is sort
            of uniquely unsettling to me. I kind of think of ads as a last
            resort.&quot; He launched the Ads Manager anyway. The revenue pressure
            at OpenAI is real, and that means this channel is permanent.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">900M+</div>
              <div className="stat-label">ChatGPT weekly active users</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">Top 5</div>
              <div className="stat-label">
                chatgpt.com&apos;s rank among most-visited sites globally
              </div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">7</div>
              <div className="stat-label">Markets where ChatGPT ads are live</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2 id="who-sees-ads">Who actually sees ChatGPT ads</h2>
          <p>
            Not all 900 million users. Ads only show to free-tier ChatGPT users.
            Plus, Pro, Business, and Education subscribers don&apos;t see them.
            Users under 18 are excluded as well.
          </p>
          <p>
            This matters for your targeting strategy. If your DTC buyer skews
            toward frequent AI users who pay for a subscription, a meaningful
            share of your potential ChatGPT audience won&apos;t see your paid
            placement at all. Organic citations reach every tier equally,
            including the paid subscribers your paid ads can&apos;t touch.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              ChatGPT paid ads reach free-tier users only. Organic citations reach
              every tier. If your buyer is a heavy AI user paying for ChatGPT
              Plus or Pro, organic optimization is the only way to reach them on
              this platform.
            </p>
          </div>

          <h2 id="high-intent">
            Why 900 million weekly users changes the acquisition math
          </h2>
          <p>
            chatgpt.com is one of the top 5 most-visited websites on the
            internet. That traffic isn&apos;t casual browsing. People arrive with
            specific questions. Product questions arrive with context already
            loaded: budget constraints, use cases, comparisons they&apos;ve
            already thought through.
          </p>
          <p>
            Someone who asks ChatGPT &quot;what&apos;s the best joint supplement
            for a 10-year-old lab with hip dysplasia&quot; isn&apos;t early in a
            purchase decision. They know exactly what they need. They&apos;re
            picking between options. That&apos;s the buyer your paid search
            campaigns spend heavily to reach, showing up in the exact moment
            they&apos;re asking the question.
          </p>
          <p>
            The channel is real. The question is whether paying to appear in it
            now beats the organic play, and the early data says no.
          </p>

          <hr className="blog-divider" />

          <h2 id="early-performance">
            What early advertisers are actually seeing
          </h2>
          <p>
            Early advertisers from the July 2026 launch describe ChatGPT ads as
            &quot;quite expensive with not much return&quot; after two weeks. That
            feedback tracks with every major ad platform in its first weeks.
            Facebook ads were expensive and unpredictable in 2012. Google Shopping
            took years to normalize. New inventory always prices high before the
            market finds equilibrium.
          </p>
          <p>
            The problem for DTC brands is jumping in before the platform has
            optimization levers. OpenAI hasn&apos;t published CPM or CPC
            benchmarks. Attribution is still being figured out. There&apos;s no
            established creative playbook yet.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Allocating paid budget to ChatGPT ads before locking in organic
              citations. Paying to appear in a channel where you could appear for
              free is the wrong sequence. Get the organic layer right first, then
              layer paid on top when the platform matures.
            </p>
          </div>

          <h2 id="organic-citations">
            What earns organic ChatGPT mentions before you spend anything
          </h2>
          <p>
            I&apos;ve been building AI discoverability into client content stacks
            for the past year. The brands showing up in ChatGPT product responses
            aren&apos;t buying their way in. They built the content foundation
            that makes organic citation possible.
          </p>
          <p>
            ChatGPT pulls from publicly crawlable web content. Three things move
            the needle for ecommerce:
          </p>
          <p>
            <strong>Product schema markup.</strong> Schema.org structured data
            tells AI systems exactly what you sell, the price, the specs, the
            use case. Stores without it are opaque to ChatGPT. It can&apos;t
            cite what it can&apos;t parse. This is table stakes, not optional
            SEO cleanup.
          </p>
          <p>
            <strong>FAQ content that matches how shoppers ask AI.</strong>{" "}
            ChatGPT favors content that directly answers the question being asked.
            A product page with &quot;best collagen for women over 40&quot; that
            actually answers that question in plain language gets cited. A product
            page that says &quot;premium hydrolyzed collagen peptides&quot; gets
            skipped. Your buyers are phrasing questions to ChatGPT the same way
            they&apos;d phrase them to a friend. Your content needs to answer
            those questions, not describe your product in marketing language.
          </p>
          <p>
            <strong>Specific, authoritative product claims.</strong> &quot;For
            dogs with hip dysplasia&quot; is citable. &quot;Supports joint
            health&quot; is not. AI systems cite specificity because specificity
            is what makes a recommendation defensible. Vague benefit language
            doesn&apos;t earn citations. Concrete claims do.
          </p>
          <p>
            We covered exactly{" "}
            <Link href="/blog/ai-product-search-ecommerce-2026">
              how ChatGPT decides which DTC products to recommend
            </Link>{" "}
            and what the traffic looks like when it starts sending buyers your
            way. The short version: buyers who arrive from ChatGPT citations have
            already done the comparison research. They arrive pre-qualified.
          </p>

          <hr className="blog-divider" />

          <h2 id="dtc-play">The move for DTC brands right now</h2>
          <p>
            The sequence matters. Organic citations first. Paid placement when the
            platform matures and benchmarks exist.
          </p>
          <p>
            Brands building the organic layer now are stacking a structural
            advantage. When ChatGPT ads normalize and CPCs drop,{" "}
            <Link href="/blog/llm-traffic-ecommerce-conversion-2026">
              those brands will add paid placement on top of organic presence
            </Link>{" "}
            that&apos;s already working. They&apos;ll be harder to displace than
            brands starting from scratch with no organic foundation.
          </p>
          <p>
            The brands doing nothing will find themselves in a competitive channel
            with premium early-mover pricing, no organic presence underneath, and
            a platform they&apos;re learning from zero while others are
            optimizing.
          </p>
          <p>
            At Venti Scale, AI discoverability is wired into every content
            strategy from the start. Schema markup, FAQ architecture, product
            description structure built for AI citation. Not as a separate SEO
            project. As part of the marketing stack itself. That&apos;s what the
            shift to{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce
            </Link>{" "}
            actually requires at this stage: content built for both human readers
            and AI systems that recommend products to those readers.
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
            bioOverride="Founder of Venti Scale. I build AI-powered marketing systems for ecommerce brands and have been tracking AI discoverability for client content stacks since early 2025. Every recommendation here comes from running this work myself."
            lastUpdated={DATE}
          />

          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/ai-product-search-ecommerce-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Shoppers are asking ChatGPT what to buy. Most DTC brands
                  don&apos;t show up.
                </div>
                <div className="related-meta">7 min read</div>
              </Link>
              <Link
                href="/blog/llm-traffic-ecommerce-conversion-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  Your ChatGPT traffic already wants to buy. Most stores never
                  notice.
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
