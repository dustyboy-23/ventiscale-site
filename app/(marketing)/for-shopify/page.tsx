import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "for-shopify";
const TITLE =
  "Marketing for Shopify stores doing $5K-$200K/month: AI-powered, Shopify-native, founder-reviewed";
const DESCRIPTION =
  "Built specifically for Shopify ecommerce. Klaviyo flows, Shop Pay optimization, App Store integrations. 5-day onboarding. Month-to-month. The founder reviews every output.";

export const metadata = {
  title: `${TITLE} | Venti Scale`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/${SLUG}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "For Shopify",
      item: `${SITE_URL}/${SLUG}`,
    },
  ],
};

export default async function ForShopifyPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Link
          href="/"
          className="text-[13px] font-mono text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; Back to home
        </Link>

        <div className="mt-8 mb-10">
          <Eyebrow>FOR SHOPIFY</Eyebrow>
          <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
            Marketing built for Shopify, not retrofitted to it
          </h1>
          <p className="text-[17px] text-white/65 leading-[1.55] max-w-[640px]">
            Most marketing services treat Shopify like every other platform.
            They miss what Shopify does specifically well. We don&apos;t.
          </p>
        </div>

        <div className="prose-blog">
          <h2>Who this is for</h2>
          <p>
            Shopify founders running $5,000 to $200,000 per month who are
            tired of paying agency retainers for templated work. You sell
            physical product. You ship from your own warehouse or a 3PL.
            You have between 200 and 50,000 customers and you can&apos;t
            seem to crack the next revenue tier without setting your hair on fire.
          </p>
          <p>
            <em>You don&apos;t need more strategy decks. You need execution.</em>
          </p>

          <h2>Shopify-native, not generic ecom</h2>
          <p>
            Generic ecommerce marketing services apply the same playbook to
            Shopify, BigCommerce, WooCommerce, and Magento. They miss every
            Shopify-specific advantage:
          </p>
          <p>
            <strong>Klaviyo&apos;s deep Shopify integration.</strong> Built
            for Shopify first. Customer data, product catalog, order history,
            and behavioral events flow without manual sync. Setting this up
            correctly takes 30 minutes and unlocks segmentation that takes
            Mailchimp weeks to replicate badly.
          </p>
          <p>
            <strong>Shop Pay checkout.</strong> Converts 1.7x better than
            third-party checkouts per Shopify&apos;s data. Most themes hide
            it by default. We turn it on.
          </p>
          <p>
            <strong>Shopify Audiences.</strong> The platform&apos;s aggregated
            buyer behavior data. Lifts paid social performance 15-30% on
            average by helping ad platforms find higher-intent lookalikes.
          </p>
          <p>
            <strong>Shop App.</strong> 10M+ monthly active users browsing
            products on Shopify&apos;s consumer app. Free traffic from a
            captive audience of buyers actively shopping. Most stores never
            configure this.
          </p>
          <p>
            <strong>App Store ecosystem.</strong> 8,000+ apps. The right 4-6
            (review platform, upsell tool, currency converter, page builder,
            search optimizer) lift conversion rate and AOV by 20-40% combined.
          </p>
          <p>
            For the deeper Shopify-specific strategy:{" "}
            <Link href="/shopify-marketing-strategy">
              the Shopify marketing strategy that actually works in 2026
            </Link>
            .
          </p>

          <h2>What we run for Shopify stores</h2>
          <p>
            Standard mid-tier setup ($1,500-2,500/month):
          </p>
          <p>
            <strong>Email + Klaviyo flows.</strong> Welcome series, abandoned
            cart, post-purchase, browse abandonment, winback. All copy in your
            brand voice. Shopify product feed integration on day 1.
          </p>
          <p>
            <strong>Content + SEO.</strong> 8-15 pieces per month. Product
            page SEO audit + fixes (most Shopify themes ship with 60% of
            this configured wrong). Blog cluster building. AI search
            optimization for ChatGPT/Perplexity citations.
          </p>
          <p>
            <strong>Organic social.</strong> 4-7 posts per week on the
            platforms your audience actually uses. Mixed format (product
            showcase / education / community / promotion).
          </p>
          <p>
            Optional full-service add-ons ($2,500-5,000/month total):
          </p>
          <p>
            <strong>Paid social.</strong> Meta + TikTok ads. Creative
            variations at scale (20+ per campaign). Shopify Audiences
            integration. Daily budget rebalancing.
          </p>
          <p>
            <strong>SMS.</strong> Klaviyo or Postscript. Permission-respecting.
            Order confirmations, shipping updates, restock alerts, final-push
            cart reminders.
          </p>

          <h2>The 5-day onboarding</h2>
          <p>
            <strong>Day 0:</strong> You submit an audit (60-90 seconds). I
            email back a custom plan within 2 business days.
          </p>
          <p>
            <strong>Day 1:</strong> Brand voice training. Custom AI fine-tuned
            on your past copy, customer reviews, product specifics.
          </p>
          <p>
            <strong>Day 2-3:</strong> Klaviyo flows set up, Shop Pay verified,
            content calendar built, social schedules configured.
          </p>
          <p>
            <strong>Day 4:</strong> First content lands in your client portal
            for review.
          </p>
          <p>
            <strong>Day 5:</strong> Live operations.
          </p>
          <p>
            Full process detail: <Link href="/how-it-works">how it works</Link>.
          </p>

          <h2>What you don&apos;t get with us</h2>
          <p>
            <em>No 6-month contract.</em> Month-to-month. Cancel any time.
          </p>
          <p>
            <em>No discovery phase.</em> First content ships day 4.
          </p>
          <p>
            <em>No junior account manager.</em> Direct Slack with the founder.
          </p>
          <p>
            <em>No PDF reports.</em> Real-time portal showing every output.
          </p>
          <p>
            <em>No forced sales call.</em> Audit + email is the funnel.
          </p>

          <h2>Compare against alternatives</h2>
          <p>
            <Link href="/marketing-agency-alternatives">
              5 alternatives to a traditional marketing agency
            </Link>
            {" "}— full framework for evaluating where DFY fits.{" "}
            <Link href="/done-for-you-marketing-services">
              Done-for-you marketing services
            </Link>
            {" "}— what real DFY includes and how to filter out the bad ones.{" "}
            <Link href="/ai-marketing-cost">
              AI marketing cost in 2026
            </Link>
            {" "}— transparent pricing across 5 tiers.
          </p>

          <div className="blog-cta">
            <h3>Submit a Shopify-specific audit</h3>
            <p>
              I review every Shopify store personally and email back a
              custom 5-channel plan within 2 business days. Specific to your
              revenue tier and product category. No call required.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
