import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { BlogAuthorBio } from "@/components/marketing/blog-author-bio";

export const metadata = {
  title: "Shopify SEO checklist: 14 things to fix before you spend a dollar on ads | Venti Scale",
  description:
    "78% of Shopify stores have missing or duplicate title tags. Here are the 14 SEO fixes that unlock free organic traffic before you touch your ad budget.",
  openGraph: {
    title:
      "Shopify SEO checklist: 14 things to fix before you spend a dollar on ads",
    description:
      "78% of Shopify stores have missing or duplicate title tags. Here are the 14 SEO fixes that unlock free organic traffic before you touch your ad budget.",
    url: "https://www.ventiscale.com/blog/shopify-seo-checklist",
    type: "article",
    images: [
      {
        url: "https://www.ventiscale.com/blog/shopify-seo-checklist.jpg",
        width: 1200,
        height: 630,
        alt: "Shopify SEO checklist: analytics dashboard showing organic traffic for an ecommerce store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title:
      "Shopify SEO checklist: 14 things to fix before you spend a dollar on ads",
    description:
      "78% of Shopify stores have missing or duplicate title tags. Here are the 14 SEO fixes that unlock free organic traffic before you touch your ad budget.",
    images: ["https://www.ventiscale.com/blog/shopify-seo-checklist.jpg"],
  },
};

const SLUG = "shopify-seo-checklist";
const TITLE =
  "Shopify SEO checklist: 14 things to fix before you spend a dollar on ads";
const DESCRIPTION =
  "78% of Shopify stores have missing or duplicate title tags. Here are the 14 SEO fixes that unlock free organic traffic before you touch your ad budget.";
const DATE = "2026-04-29";
const IMAGE = "/blog/shopify-seo-checklist.jpg";
const IMAGE_URL = `https://www.ventiscale.com${IMAGE}`;

const FAQ_DATA = [
  {
    q: "How long does Shopify SEO take to show results?",
    a: "Most Shopify stores see measurable organic traffic gains within 60-90 days of fixing technical SEO issues. Full momentum builds over 6-9 months. SEO delivers 317% ROI with a 9-month break-even, faster than most paid channels on a cost-adjusted basis.",
  },
  {
    q: "What are the biggest SEO mistakes Shopify store owners make?",
    a: "The three biggest Shopify SEO mistakes are: using duplicate or auto-generated title tags across product pages (found in 78% of stores), copying manufacturer product descriptions verbatim (triggering duplicate content issues), and never submitting an XML sitemap to Google Search Console.",
  },
  {
    q: "Does Shopify have good SEO built in?",
    a: "Shopify has decent SEO defaults: it auto-generates sitemaps, handles canonical tags on variants, and includes HTTPS. But it sets title tags from product names, which rarely match what buyers search. The defaults need manual optimization to actually perform.",
  },
  {
    q: "How do I fix duplicate content on Shopify?",
    a: "Shopify creates duplicate content from product variants and collection filters. Fix it by verifying canonical tags on variant URLs point to the main product page, setting noindex on filtered URLs (sort_by, page=2, etc.), and writing unique descriptions for your top 20 products.",
  },
  {
    q: "Should I use Shopify's built-in blog for SEO?",
    a: "Yes. Shopify's blog is your highest-leverage free SEO tool. Stores publishing 2+ SEO-targeted posts per month see 3-4x more organic traffic than stores relying on product and collection pages alone. Target 'best [product type] for [use case]' keywords to capture buyers in research mode.",
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
          <Eyebrow>ECOMMERCE / SEO</Eyebrow>
          <h1 className="font-display text-[32px] lg:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mt-4 mb-4">
            Shopify SEO checklist: 14 things to fix before you spend a dollar on
            ads
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              April 29, 2026
            </span>
            <span className="text-white/15">&middot;</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
              8 min read
            </span>
          </div>
        </div>

        <div className="blog-hero">
          <img
            src={IMAGE}
            alt="Analytics dashboard showing organic traffic growth for a Shopify ecommerce store"
          />
        </div>

        <div className="prose-blog">
          <p>
            You&apos;re about to launch Google Ads. Stop for five minutes first.
            78% of Shopify stores have missing or duplicate title tags on their
            own product pages. You&apos;re about to pay $3&ndash;8 per click to
            send traffic to a store that Google hasn&apos;t decided to trust
            yet.
          </p>
          <p>
            Organic search drives 43% of all ecommerce traffic. It converts at
            2.93%, the highest rate of any traffic source including paid. And
            it&apos;s free. Most of that opportunity is sitting on your store
            right now, locked behind fixes that cost nothing. Run this list
            first. Then spend on ads if you still want to.
          </p>

          <div className="blog-tldr">
            <div className="callout-label">TL;DR</div>
            <ul>
              <li>
                Organic search converts at 2.93% on Shopify, higher than paid,
                email, or social. Most stores haven&apos;t earned it yet.
              </li>
              <li>
                78% of Shopify stores have missing or duplicate title tags. Fix
                those first, before anything else.
              </li>
              <li>
                Product schema with star ratings improves click-through rate by
                15&ndash;30% in search results.
              </li>
              <li>
                One SEO blog post per week, targeting buyer-intent keywords, is
                the compound play after you fix the technical foundation.
              </li>
            </ul>
          </div>

          <p>
            Fix your Shopify SEO in this order: technical foundation first, then
            on-page optimization, then content. Stores that follow this sequence
            see measurable organic traffic gains within 60&ndash;90 days. Stores
            that jump to content first see nothing until the technical issues are
            resolved.
          </p>

          <h2>The technical foundation (fixes 1&ndash;3)</h2>

          <p>
            <strong>Fix #1: Connect Google Search Console.</strong> Search
            Console shows you exactly how Google sees your store: crawl errors,
            index coverage gaps, Core Web Vitals failures, and which queries are
            already driving impressions. Without it, you&apos;re flying blind.
            Go to search.google.com/search-console, add your domain as a
            property, verify ownership via your Shopify DNS settings, and link
            it to your GA4 account. Takes about 20 minutes. Every Shopify store
            should have done this on day one.
          </p>

          <p>
            <strong>Fix #2: Submit your XML sitemap.</strong> Shopify
            auto-generates a sitemap at [yourstore.com]/sitemap.xml. Most owners
            never submit it. Without this step, Google has to discover your pages
            through crawling links, which means new products can take weeks to
            get indexed. In Search Console, go to Sitemaps, paste your sitemap
            URL, and hit submit. Two-minute fix with real impact on how fast
            Google finds new inventory.
          </p>

          <p>
            <strong>Fix #3: Verify canonical tags on product variants.</strong>{" "}
            Shopify creates duplicate URLs naturally. Any product living in
            multiple collections gets a different URL (/collections/bags/products/tote
            vs /products/tote). The canonical tag tells Google which URL is
            official. Shopify handles this automatically, but check that
            it&apos;s working. Use a free crawl from Ahrefs Webmaster Tools on
            your top 20 pages and confirm canonical tags point to the right URLs.
            Also set noindex on filtered collection URLs (sort_by=, page=2) to
            keep duplicate content out of the index.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">43%</div>
              <div className="stat-label">of ecommerce traffic from organic</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">2.93%</div>
              <div className="stat-label">avg organic conversion rate</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">317%</div>
              <div className="stat-label">SEO ROI, 9-month break-even</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>Title tags and meta descriptions (fixes 4&ndash;5)</h2>

          <p>
            <strong>Fix #4: Rewrite your product title tags.</strong> By
            default, Shopify sets your title tag to &quot;Product Name | Store
            Name.&quot; That&apos;s fine for branded searches. It&apos;s useless
            for anyone who doesn&apos;t already know you. Rewrite your top 20
            product title tags to lead with the keyword a buyer actually types
            into Google. &quot;Women&apos;s Leather Crossbody Bag | Your Store
            Name&quot; beats &quot;Amara Bag | Your Store Name&quot; for
            everyone searching who doesn&apos;t know the Amara name. Find title
            tag fields in Shopify under each product&apos;s &quot;Search engine
            listing&quot; section.
          </p>

          <p>
            <strong>Fix #5: Write meta descriptions for your top pages.</strong>{" "}
            Meta descriptions don&apos;t directly affect rankings. They affect
            click-through rate, which does. A well-written meta description
            improves CTR by 5&ndash;10%, which signals relevance to Google and
            can move you up the page over time. Write one for your top 10
            product and collection pages. Lead with the benefit. Include the
            keyword naturally. Stay under 160 characters. Roughly 61% of
            auto-generated Shopify meta descriptions get rewritten by Google
            anyway. Take control of yours.
          </p>

          <div className="blog-warning">
            <div className="callout-label">Common mistake</div>
            <p>
              Using your store name as the primary keyword in every title tag.
              &quot;Your Store | Leather Bags | Women&apos;s Collection&quot;
              tells Google nothing useful. Flip it: lead with the keyword buyers
              search, then your brand name. Nobody searches your brand name until
              after they know you exist.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>Product and collection page content (fixes 6&ndash;8)</h2>

          <p>
            <strong>Fix #6: Replace manufacturer product descriptions.</strong>{" "}
            If you&apos;re selling products you didn&apos;t make, there&apos;s a
            good chance your descriptions match every other retailer carrying the
            same SKU. Google won&apos;t penalize you for it, but it will give
            ranking preference to whoever has unique content. Rewrite your top 20
            products. Lead with the benefit and the use case, not the spec sheet.
            That&apos;s also the version that converts better. It speaks to why
            someone buys, not what the box says.
          </p>

          <p>
            <strong>Fix #7: Add an H1 to every collection page.</strong> Every
            collection page should have an H1 that includes the category keyword.
            &quot;Women&apos;s Leather Bags&quot; as an H1 on your bags
            collection tells Google exactly what that page is about. Many Shopify
            themes use the collection title as the H1 automatically. Some
            don&apos;t. Check yours. If the H1 is missing or set to generic
            theme text, it&apos;s an easy fix in your theme editor.
          </p>

          <p>
            <strong>
              Fix #8: Write a 100-word intro for your top 5 collection pages.
            </strong>{" "}
            Collection pages that rank well consistently have a short paragraph
            of keyword-relevant copy above the product grid. This isn&apos;t
            keyword stuffing. It&apos;s context. &quot;Our handcrafted leather
            crossbody bags are made in Italy and built to outlast fast-fashion
            alternatives. Free shipping over $75.&quot; Google uses that text to
            understand what the page is for and who it serves. Most Shopify
            stores have collection pages with zero body text. That&apos;s a
            missed opportunity on your highest-value pages.
          </p>

          <hr className="blog-divider" />

          <h2>Structured data (fixes 9&ndash;10)</h2>

          <p>
            <strong>
              Fix #9: Add Product schema with price and availability.
            </strong>{" "}
            Product schema is the JSON-LD markup that tells Google your product
            has a specific price, availability status, and SKU. It unlocks rich
            results in search, the kind that show price and in-stock status
            directly under your listing before anyone clicks. Most Shopify themes
            include basic Product schema, but check yours at schema.org/validator.
            If price and availability aren&apos;t validating, fix the theme
            schema or install a schema app.
          </p>

          <p>
            <strong>
              Fix #10: Add AggregateRating schema and earn star ratings in
              SERPs.
            </strong>{" "}
            Star ratings in search results improve click-through rate by
            15&ndash;30%. They require AggregateRating schema tied to your actual
            review data. If you&apos;re using a reviews app (Judge.me, Okendo,
            Yotpo), go to Google&apos;s Rich Results Test and enter a product
            URL. Check whether AggregateRating is validating. Most apps generate
            this automatically, but the schema output breaks more often than
            you&apos;d expect. Verify it&apos;s passing before you assume it is.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Star ratings are one of the few SERP features that visibly
              differentiate your listing from competitors at the same rank
              position. A result with stars at position #3 will often out-click
              a result without stars at position #1. According to{" "}
              <a
                href="https://ringly.io/blog/ecommerce-seo-statistics-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ringly.io&apos;s 2026 ecommerce SEO research
              </a>
              , stores with fully validated Product and AggregateRating schema
              see 20&ndash;28% higher CTR on targeted product pages.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>Page speed and images (fixes 11&ndash;12)</h2>

          <p>
            <strong>
              Fix #11: Get your Largest Contentful Paint under 2.5 seconds.
            </strong>{" "}
            Core Web Vitals are a confirmed Google ranking factor. The one that
            moves the needle most for Shopify stores is LCP, the time it takes
            to render the largest visible element, usually your hero image. The
            threshold is under 2.5 seconds. Check yours at pagespeed.web.dev.
            The most common fixes: compress your hero image, switch to WebP
            format, and lazy-load images below the fold. If you&apos;re running
            more than 8&ndash;10 Shopify apps, each one loading scripts on the
            frontend, that&apos;s worth auditing next.
          </p>

          <p>
            <strong>
              Fix #12: Compress images and add alt text to every product photo.
            </strong>{" "}
            Two separate problems, one fix session. Uncompressed images slow your
            store. Missing alt text means Google can&apos;t read what your photos
            show. Use Shopify&apos;s built-in image optimizer or an app like
            TinyIMG to compress images in bulk. Then go through your top 20
            products and add descriptive alt text to every photo. &quot;Blue
            Italian leather crossbody bag with gold clasp, front view&quot; beats
            a blank alt attribute for both SEO and accessibility. Long-tail image
            searches can drive meaningful traffic, especially for visually
            distinctive products.
          </p>

          <div className="blog-stat-row">
            <div className="blog-stat">
              <div className="stat-number">78%</div>
              <div className="stat-label">of Shopify stores have broken title tags</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">15–30%</div>
              <div className="stat-label">CTR lift from star ratings in SERPs</div>
            </div>
            <div className="blog-stat">
              <div className="stat-number">91%</div>
              <div className="stat-label">of searches are long-tail keywords</div>
            </div>
          </div>

          <hr className="blog-divider" />

          <h2>Content and internal linking (fixes 13&ndash;14)</h2>

          <p>
            <strong>
              Fix #13: Write one blog post targeting a buyer-intent keyword.
            </strong>{" "}
            This is the highest-leverage thing you can do after fixing the
            technical foundation. Long-tail keywords make up 91% of all web
            searches and convert 2.5x higher than head terms. &quot;Best
            crossbody bag for travel under $200&quot; is easier to rank for than
            &quot;leather bag&quot; and it captures someone who&apos;s actively
            deciding. Write one post per week targeting a &quot;best [product
            type] for [use case]&quot; keyword. Make it genuinely useful. Answer
            what a buyer actually wants to know before they commit. That&apos;s
            the same content logic that{" "}
            <Link href="/blog/ecommerce-customers-without-ad-budget">
              small ecommerce brands use to get customers without ad spend
            </Link>
            .
          </p>

          <p>
            <strong>
              Fix #14: Build internal links from your blog to your collection
              pages.
            </strong>{" "}
            Every blog post you publish is a chance to pass link authority to
            your collection pages. If you write &quot;Best crossbody bags for
            travel,&quot; link to your crossbody collection page with the anchor
            text &quot;women&apos;s crossbody bags.&quot; This is the part most
            stores skip. It&apos;s also how a solid{" "}
            <Link href="/shopify-marketing-strategy">
              Shopify marketing strategy
            </Link>{" "}
            moves authority from content to money pages, and it compounds every
            time you publish.
          </p>

          <div className="blog-callout">
            <div className="callout-label">Key insight</div>
            <p>
              Internal links from blog posts to collection pages are worth more
              than most Shopify owners realize. Every time you publish a
              keyword-targeted post and link it to a collection, you&apos;re
              building a relevance signal that compounds. Ten posts linking to
              your main collection page will outperform a single backlink from a
              low-authority external site.
            </p>
          </div>

          <hr className="blog-divider" />

          <h2>Run the list, then consider ads</h2>

          <p>
            I&apos;ve audited Shopify stores doing $5K to $200K a month in
            revenue. Every single one had at least 4 of these 14 problems the
            day we started working together. Missing title tags. No sitemap
            submitted. Collection pages with zero body copy. Schema not
            validating. These aren&apos;t edge cases. They&apos;re the default
            state for most stores.
          </p>

          <p>
            Running through this list once fixes the easy wins. The harder part
            is keeping up with it: new products needing unique descriptions, new
            collection pages needing schema checks, blog posts that need to ship
            consistently. That&apos;s the ongoing SEO layer, and it pairs
            directly with the email work that{" "}
            <Link href="/blog/ecommerce-email-marketing-flows">
              ecommerce email marketing flows
            </Link>{" "}
            handle on the retention side. Fix the organic foundation first, then
            run both together.
          </p>

          <p>
            If you want to know where your store stands on all 14 of these
            before touching your ad budget, the audit is free and takes 30
            seconds.
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
            bioOverride="Founder of Venti Scale. I've audited Shopify stores from $5K to $200K/month in revenue. Every one had at least 4 of these 14 problems on day one. I run the ongoing SEO and content layer for ecommerce clients as part of their AI marketing system."
            lastUpdated={DATE}
          />

          {/* Related posts */}
          <div className="blog-related">
            <h3>Keep reading</h3>
            <div className="blog-related-grid">
              <Link
                href="/blog/shopify-marketing-strategy-2026"
                className="blog-related-card"
              >
                <div className="related-title">
                  The Shopify marketing strategy that actually works in 2026
                </div>
                <div className="related-meta">8 min read</div>
              </Link>
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
