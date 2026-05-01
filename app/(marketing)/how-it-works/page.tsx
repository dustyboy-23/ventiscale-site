import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "how-it-works";
const TITLE =
  "How Venti Scale works: 5 days from audit to live marketing operations";
const DESCRIPTION =
  "Submit an audit. We train a Custom AI on your brand. You see every output in a real-time portal. The full process, no hidden steps, no forced calls, transparent timeline.";

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

const HOWTO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Venti Scale onboards a new client",
  description: "Five-day process from audit submission to live marketing operations on a Custom AI.",
  totalTime: "P5D",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Day 0: Audit submission",
      text: "Submit a 60-90 second audit with your store URL and what's not working. Dusty reviews and emails back a custom growth plan within 2 business days.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Day 1: Intake + brand voice training",
      text: "Send brand voice samples (past copy, customer reviews, product descriptions). The Custom AI is trained on your specific voice, products, and customer language.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Day 2-3: Channel setup",
      text: "Klaviyo flows configured, social schedules built, ad accounts connected, content calendar populated. All output flows into the client portal in real time.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Day 4: First content shipped",
      text: "First batch of content (emails, social posts, blog drafts) generated and reviewed. You approve everything before publish. Direct Slack with the founder.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Day 5: Live operations",
      text: "Daily output running across all channels. Weekly reports auto-generated. Cancel any time. No retainer lock-in.",
    },
  ],
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "How it works", item: `${SITE_URL}/${SLUG}` },
  ],
};

export default async function HowItWorksPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_JSONLD) }}
      />
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
          <Eyebrow>HOW IT WORKS</Eyebrow>
          <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
            5 days from audit submission to live marketing operations
          </h1>
          <p className="text-[17px] text-white/65 leading-[1.55] max-w-[640px]">
            No discovery phase. No forced sales call. No 30-page strategy deck.
            <em> Just the steps that get your marketing running.</em>
          </p>
        </div>

        <div className="prose-blog">
          <h2>Day 0: You submit an audit</h2>
          <p>
            The audit form takes 60-90 seconds. Your store URL, what&apos;s
            not working, what you&apos;re trying to grow toward. That&apos;s it.
          </p>
          <p>
            I personally read every audit submission. Within 2 business days,
            you get a custom growth plan emailed back covering: which 2-3
            channels to focus on first based on your stage, what the realistic
            timeline looks like, what we&apos;d ship in your first 30 days,
            and what it costs all-in. No call required.
          </p>
          <p>
            If the plan resonates, you reply to the email and we move to day 1.
            If it doesn&apos;t, you keep the plan and use it however you want.
          </p>

          <h2>Day 1: Intake and brand voice training</h2>
          <p>
            We send a single intake form (10 questions, ~15 minutes). It
            covers brand voice samples, product details, customer language,
            and visual references. You also send past content that
            represents your voice (5-10 examples).
          </p>
          <p>
            The Custom AI is trained on your specific brand context. Not
            generic ChatGPT prompts. Not templates. A model fine-tuned on
            your past copy, customer reviews, product specifics, and visual
            patterns.
          </p>
          <p>
            <em>This is the step most services skip.</em> Generic AI marketing
            services use the same templates for every client. The brand-voice
            training is what produces output that sounds like a brand-aware
            copywriter wrote it instead of a template generator.
          </p>

          <h2>Day 2-3: Channel setup</h2>
          <p>
            We configure the channels you picked in the audit plan. Standard
            mid-tier stack:
          </p>
          <p>
            <strong>Email:</strong> Klaviyo flows configured (welcome series,
            abandoned cart, post-purchase, browse abandonment, winback). All
            written in your brand voice. Triggers and segmentation tested
            before any send.
          </p>
          <p>
            <strong>Content:</strong> Blog calendar built for the next 30
            days, keyword targets set, internal linking architecture
            established (cluster + pillar structure).
          </p>
          <p>
            <strong>Social:</strong> Posting cadence set (4-7 per week per
            platform), content templates established, scheduling tools
            connected (Buffer or Postiz).
          </p>
          <p>
            <strong>Ads (if in tier):</strong> Account access connected via
            partner permissions, audience structure built, creative testing
            framework established.
          </p>

          <h2>Day 4: First content shipped to portal</h2>
          <p>
            The first batch of output lands in your client portal. You see
            every email, every social post, every blog draft, every ad
            creative. You approve everything before it ships to your audience.
          </p>
          <p>
            Direct Slack channel with me opens. Same-day responses on weekdays.
            No account manager between us. <em>Always me, never a junior.</em>
          </p>

          <h2>Day 5: Live operations</h2>
          <p>
            Daily marketing output running across all your channels. Weekly
            reports auto-generated and pushed to your portal. Monthly
            strategy review (async, in the portal — no required call).
          </p>
          <p>
            Cancel any time. No retainer lock-in. 30-day notice and we hand
            back your prompt library, customer data, and integration access.
          </p>

          <h2>What you see in the portal</h2>
          <p>
            The client portal is a live dashboard, not a monthly PDF. You see:
          </p>
          <p>
            <strong>Approval queue.</strong> Every piece of content waiting
            for your review with timing and channel context.
          </p>
          <p>
            <strong>Published feed.</strong> Everything that&apos;s gone live,
            with performance metrics as they come in.
          </p>
          <p>
            <strong>Reports.</strong> Auto-updated KPIs across email, content,
            paid, and organic. No manual report generation.
          </p>
          <p>
            <strong>Activity log.</strong> Every action taken in the system
            (content generated, edits made, ads launched, emails sent) with
            timestamps and reasoning.
          </p>
          <p>
            <strong>Files.</strong> Every asset (graphics, photos, copy
            drafts, brand assets) accessible without asking us for it.
          </p>

          <h2>What this is not</h2>
          <p>
            <em>Not a 30-day discovery phase.</em> We start shipping work
            day 4.
          </p>
          <p>
            <em>Not a 12-month contract.</em> Month-to-month, cancel any time.
          </p>
          <p>
            <em>Not an account manager forwarding emails.</em> Direct founder
            communication.
          </p>
          <p>
            <em>Not generic AI templates.</em> Brand-trained Custom AI for
            each client.
          </p>
          <p>
            <em>Not a monthly PDF report.</em> Real-time portal access.
          </p>

          <h2>Read the deeper context</h2>
          <p>
            For the full architecture of how AI-powered marketing services
            work in 2026, see{" "}
            <Link href="/ai-marketing-for-ecommerce">
              AI marketing for ecommerce: the 2026 playbook
            </Link>
            . For the comparison framework against agencies and other options,
            see{" "}
            <Link href="/marketing-agency-alternatives">
              marketing agency alternatives
            </Link>
            . For pricing transparency, see{" "}
            <Link href="/ai-marketing-cost">AI marketing cost in 2026</Link>.
          </p>

          <div className="blog-cta">
            <h3>Ready to start day 0?</h3>
            <p>
              Submit a 60-90 second audit. I review every one personally and
              email back a custom plan within 2 business days. No call required.
            </p>
            <a href="/#audit">Get my free audit</a>
          </div>
        </div>
      </article>
    </>
  );
}
