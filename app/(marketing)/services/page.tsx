import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "services";
const TITLE =
  "Venti Scale services: AI-powered marketing operations across email, content, social, ads, and SMS";
const DESCRIPTION =
  "What we run for ecommerce brands. Each service handled end-to-end by a Custom AI trained on your brand, reviewed by the founder before every output ships.";

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

const SERVICES = [
  {
    name: "AI-powered email marketing",
    serviceType: "Email marketing automation",
    description:
      "Behavioral flows (welcome, abandoned cart, post-purchase, browse abandonment, winback) plus weekly broadcast campaigns. Klaviyo as the platform. All copy in your brand voice, reviewed before send.",
  },
  {
    name: "AI-powered content and SEO",
    serviceType: "Content marketing and SEO",
    description:
      "30-50 pieces of monthly content (blog posts, landing pages, comparison content). Optimized for both Google and AI search citations. Keyword research, internal linking, schema markup all handled.",
  },
  {
    name: "AI-powered organic social",
    serviceType: "Social media management",
    description:
      "Daily content across Instagram, TikTok, LinkedIn, or whichever platforms fit your audience. 4-7 posts per week per platform. Caption variations tested. Scheduling and engagement reporting included.",
  },
  {
    name: "AI-powered paid social",
    serviceType: "Paid social advertising",
    description:
      "Meta and TikTok ad creative generation at scale (20+ variations tested per campaign). Account management, audience testing, daily budget rebalancing, creative refresh cadence. Full-service tier only.",
  },
  {
    name: "AI-powered SMS",
    serviceType: "SMS marketing",
    description:
      "Permission-respecting SMS campaigns plus order confirmations, shipping updates, restock alerts, and final-push abandoned cart reminders. Klaviyo or Postscript integration. Full-service tier only.",
  },
];

const SERVICE_JSONLD = SERVICES.map((s, i) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/${SLUG}#service-${i + 1}`,
  name: s.name,
  serviceType: s.serviceType,
  provider: {
    "@type": "Organization",
    name: "Venti Scale",
    url: SITE_URL,
  },
  areaServed: { "@type": "Place", name: "Worldwide" },
  description: s.description,
  url: `${SITE_URL}/${SLUG}`,
}));

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/${SLUG}` },
  ],
};

export default async function ServicesPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      {SERVICE_JSONLD.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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
          <Eyebrow>SERVICES</Eyebrow>
          <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
            5 services. One Custom AI per client. <em>Always me, never a junior.</em>
          </h1>
          <p className="text-[17px] text-white/65 leading-[1.55] max-w-[640px]">
            Pick 1, 2, or all 5. Month-to-month. Cancel any time. The founder
            (me) reviews every output before it ships.
          </p>
        </div>

        <div className="prose-blog">
          <h2>1. AI-powered email marketing</h2>
          <p>
            Email is the highest-ROI channel in ecommerce. Klaviyo&apos;s 2024
            benchmark shows the average store earns $36 for every $1 spent on
            email. We build out the full flow stack:
          </p>
          <p>
            <strong>Welcome series</strong> (3 emails over 7 days, 40-50% open
            rate, 4-8% conversion). <strong>Abandoned cart sequence</strong>{" "}
            (3 emails at 1h/24h/72h, recovers 18%+ of lost revenue).{" "}
            <strong>Post-purchase flow</strong> (cross-sell, education, review
            request). <strong>Browse abandonment</strong> (single targeted
            email at 24h). <strong>Winback campaign</strong> (60-90 day
            inactive customers).
          </p>
          <p>
            All copy written in your brand voice by the Custom AI, reviewed
            by me before any send. Klaviyo as the platform (Shopify Email
            limited tier doesn&apos;t cut it for stores past 200 customers).
          </p>
          <p>
            Deeper context: see{" "}
            <Link href="/blog/abandoned-cart-email-sequence">
              the abandoned cart sequence that recovers 18%
            </Link>
            .
          </p>

          <h2>2. AI-powered content and SEO</h2>
          <p>
            30-50 pieces of monthly content production. Blog posts, landing
            pages, product copy, comparison articles. Optimized for both
            Google and AI search citations (32.5% of AI citations go to
            comparison content specifically).
          </p>
          <p>
            Includes keyword research, internal linking architecture (cluster
            + pillar structure), schema markup (Article, FAQPage,
            BreadcrumbList minimum), and AI search optimization for
            ChatGPT/Perplexity/Google AI Overviews citation rates.
          </p>
          <p>
            Deeper context: see{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce: the 2026 playbook
            </Link>
            .
          </p>

          <h2>3. AI-powered organic social</h2>
          <p>
            4-7 posts per week per platform across Instagram, TikTok, LinkedIn,
            or whichever platforms fit your audience. Caption variations
            tested. Scheduling automated. Engagement reporting included.
          </p>
          <p>
            Content mix per platform: 40% product showcase (lifestyle,
            customer photos), 30% education, 20% community/UGC, 10% direct
            promotion. Stores running 80%+ promotional content underperform
            their mixed-content peers by 60-70% on engagement.
          </p>
          <p>
            Deeper context: see{" "}
            <Link href="/blog/social-media-for-ecommerce-brands">
              most ecommerce brands post on social media wrong
            </Link>
            .
          </p>

          <h2>4. AI-powered paid social (full-service tier only)</h2>
          <p>
            Meta and TikTok ad creative generation at scale: 20+ headline
            variations, 20+ body copy variations, 5-10 image variations per
            campaign. Account management, audience testing, daily budget
            rebalancing, creative refresh cadence.
          </p>
          <p>
            Average ROAS for ecommerce dropped from 4-5x in 2021 to 2-2.5x
            in 2026 due to iOS attribution loss. The brands beating these
            averages run brand-trained creative variation at scale and have
            strong post-click flows (service 1 above).
          </p>

          <h2>5. AI-powered SMS (full-service tier only)</h2>
          <p>
            SMS click rates run 12-30% vs email&apos;s 3-5%. Build it after
            email flows are mature. We handle: order confirmations, shipping
            updates, restock alerts, abandoned cart final push, 1-2
            promotional broadcasts per month.
          </p>
          <p>
            Klaviyo or Postscript integration. Permission management, opt-in
            forms, compliance with TCPA and equivalent regulations all
            included.
          </p>

          <h2>Pricing</h2>
          <p>
            <strong>Single service:</strong> $500-1,000/month for one channel
            done well.
          </p>
          <p>
            <strong>Mid-tier (3-4 services):</strong> $1,500-2,500/month.
            Email + content + 1-2 social platforms is the most common combo.
          </p>
          <p>
            <strong>Full-service (all 5):</strong> $2,500-5,000/month. Email +
            content + organic social + paid social + SMS, all running together.
          </p>
          <p>
            All tiers month-to-month. No setup fees. No per-channel add-ons
            we didn&apos;t disclose upfront. No platform fee markups. Cancel
            any time, full data handover included.
          </p>
          <p>
            Pricing transparency context:{" "}
            <Link href="/ai-marketing-cost">
              AI marketing cost in 2026
            </Link>
            .
          </p>

          <h2>What every service includes</h2>
          <p>
            <strong>Custom AI training.</strong> Brand voice, products,
            customer language, visual style — all baked into a model fine-tuned
            for your business specifically.
          </p>
          <p>
            <strong>Founder review before publish.</strong> Nothing ships
            without my eyes on it first.
          </p>
          <p>
            <strong>Real-time portal access.</strong> Every output visible
            as it&apos;s generated. No monthly PDF reports.
          </p>
          <p>
            <strong>Direct Slack channel with founder.</strong> Same-day
            responses on weekdays. No account manager.
          </p>
          <p>
            <strong>5-day onboarding.</strong> Audit submission to live
            operations in a week. See{" "}
            <Link href="/how-it-works">how it works</Link>.
          </p>
          <p>
            <strong>Month-to-month.</strong> Cancel any time, 30-day notice,
            full data handover.
          </p>

          <div className="blog-cta">
            <h3>Want a custom plan for your specific service mix?</h3>
            <p>
              Submit a 60-90 second audit. I review every submission personally
              and email back which 2-3 services to start with based on your
              stage, plus exact pricing.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
