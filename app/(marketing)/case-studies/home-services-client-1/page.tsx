import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "case-studies/home-services-client-1";

export const metadata = {
  title:
    "Case study: home services client → 4-post-a-day automated operation in 14 days | Venti Scale",
  description:
    "How a home services client went from a dead Facebook page to a fully-automated multi-channel marketing operation in two weeks, with real-time portal access and zero retainer lock-in.",
  alternates: { canonical: `${SITE_URL}/${SLUG}` },
  openGraph: {
    title:
      "Case study: home services client → 4-post-a-day automated operation in 14 days",
    description:
      "How a home services client went from a dead Facebook page to a fully-automated multi-channel marketing operation in two weeks.",
    url: `${SITE_URL}/${SLUG}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image" as const,
    title:
      "Case study: home services client → 4-post-a-day automated operation in 14 days",
    description:
      "How a home services client went from a dead Facebook page to a fully-automated multi-channel marketing operation in two weeks.",
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
      name: "Case studies",
      item: `${SITE_URL}/case-studies`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Home services client",
      item: `${SITE_URL}/${SLUG}`,
    },
  ],
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Case study: home services client → 4-post-a-day automated operation in 14 days",
  description:
    "How a home services client went from a dead Facebook page to a fully-automated multi-channel marketing operation in two weeks.",
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
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/${SLUG}`,
  },
};

export default async function CaseStudyPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />

      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Link
          href="/case-studies"
          className="text-[13px] font-mono text-white/40 hover:text-white/60 transition-colors"
        >
          &larr; All case studies
        </Link>

        <div className="mt-8 mb-10">
          <Eyebrow>CASE STUDY · HOME SERVICES</Eyebrow>
          <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
            From a dead Facebook page to 4 posts a day, automated, in 14 days
          </h1>
          <p className="text-[17px] text-white/65 leading-[1.55] max-w-[640px]">
            Anonymized at the client&apos;s request. The deliverables and
            timeline below are real. The names and product specifics are
            generalized.
          </p>
        </div>

        <div className="prose-blog">
          <h2>The starting point</h2>
          <p>
            A regional home services business. ~$2K monthly recurring revenue
            from existing customers. Facebook page hadn&apos;t been updated in
            6 months. LinkedIn account dormant. Website with stale 2023 copy.
            All organic acquisition came from word of mouth and a single
            Google Business Profile listing.
          </p>
          <p>
            The owner had tried two marketing agencies in the previous 18
            months. Both produced templated content that looked identical
            to every competitor in the category. Neither stayed past month 4
            because the owner couldn&apos;t justify $2,500/month for what
            felt like generic placeholder posts.
          </p>

          <h2>What we shipped, by day</h2>
          <p>
            <strong>Day 1:</strong> Brand voice intake. 90-minute async
            session capturing voice samples, customer language patterns,
            product specifics, and visual references.
          </p>
          <p>
            <strong>Day 2-3:</strong> Custom AI trained on brand context.
            Klaviyo flows configured. Content calendar built for the next
            14 days across Facebook, LinkedIn, and email.
          </p>
          <p>
            <strong>Day 4:</strong> First batch of content shipped to client
            portal for review. Client approved 80%, requested edits on 20%.
            All edits incorporated within 24 hours.
          </p>
          <p>
            <strong>Day 5:</strong> Live operations. 4 posts per day
            scheduled across Facebook (2 photo posts), LinkedIn (1 post), and
            video content (1 per day pulled from approved Drive folder).
          </p>
          <p>
            <strong>Day 6-14:</strong> Daily content shipping. Weekly
            performance report auto-generated. Real-time portal showing every
            output as it published.
          </p>

          <h2>What was running by day 14</h2>
          <p>
            <strong>13 LinkedIn posts queued</strong> across the next two
            weeks, all in client&apos;s voice with industry-specific
            language.
          </p>
          <p>
            <strong>14-day Facebook photo campaign</strong> live with twice-daily
            posting.
          </p>
          <p>
            <strong>Pre-approved video pipeline</strong> with 11 videos
            queued for noon-PT daily release.
          </p>
          <p>
            <strong>Auto-approve flow</strong> at T-2h before scheduled posts
            (only on photo content, never on video — videos always require
            manual review).
          </p>
          <p>
            <strong>Real-time client portal</strong> showing approval queue,
            published feed, performance metrics, and full activity log.
          </p>
          <p>
            <strong>Reports tab locked at 2 rolling 28-day reports</strong>{" "}
            (Performance + SEO), refreshing automatically every Monday.
          </p>

          <h2>The structural changes that mattered</h2>
          <p>
            <strong>Auto-approval at T-2h.</strong> Photos auto-approve 2
            hours before scheduled publish. Client retains the right to
            reject up until the actual cron fire. This catches the &quot;I&apos;m
            offline&quot; problem agencies usually solve with daily approval
            calls.
          </p>
          <p>
            <strong>Drive-to-portal sweep cadence dropped from every 30
            minutes to twice daily.</strong> Saves token cost without losing
            responsiveness because posting reads database status, not Drive
            folder location.
          </p>
          <p>
            <strong>Notes append on every status change.</strong> Whether the
            client approves with note OR rejects with note, both write back
            to the client&apos;s revisions doc. Closes the feedback loop.
          </p>

          <h2>What this didn&apos;t solve</h2>
          <p>
            <em>It didn&apos;t replace the strategic question of which
            services to lead with.</em> The owner still has to make calls
            about pricing, packaging, and seasonal positioning. We handle
            execution. Strategy stays with the owner (with our input).
          </p>
          <p>
            <em>It didn&apos;t solve attribution.</em> Most home services
            leads come via phone or in-person, which is hard to attribute to
            specific posts. Vanity metrics (impressions, follower count)
            don&apos;t tell the real story. We track what we can (call volume,
            booking inquiries, website form fills) and report honestly.
          </p>
          <p>
            <em>It didn&apos;t happen overnight.</em> 14 days is fast for
            full multi-channel automation. Real revenue impact takes 30-90
            days to show up because brand recognition compounds and search
            engines need time to index new content.
          </p>

          <h2>What this would cost you</h2>
          <p>
            This client is on the mid-tier setup ($1,500-2,500/month).
            Includes email + content + organic social + the full client
            portal.
          </p>
          <p>
            Pricing transparency:{" "}
            <Link href="/ai-marketing-cost">AI marketing cost in 2026</Link>.
            Compare against alternatives:{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>
            .
          </p>

          <h2>Want this for your business?</h2>
          <p>
            Submit an audit. I review every submission personally and email
            back a custom plan covering exactly what we&apos;d ship in your
            first 14 days based on your specific channels and starting point.
          </p>

          <div className="blog-cta">
            <h3>14-day timeline for your business</h3>
            <p>
              The audit takes 60-90 seconds. The plan you get back covers
              specific deliverables for your first 2 weeks. No call required.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
