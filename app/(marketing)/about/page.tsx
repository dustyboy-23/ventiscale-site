import Link from "next/link";
import { headers } from "next/headers";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";

export const metadata = {
  title: "About Dustin Gilmour, founder of Venti Scale",
  description:
    "I burned out paying agencies for junior employees running templates. So I built the thing I wished existed. Here's who I am, why I built Venti Scale, and how I actually work.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Dustin Gilmour, founder of Venti Scale",
    description:
      "I burned out paying agencies for junior employees running templates. So I built the thing I wished existed. Here's who I am, why I built Venti Scale, and how I actually work.",
    url: `${SITE_URL}/about`,
    type: "profile",
    images: [
      {
        url: `${SITE_URL}/dusty.webp`,
        width: 800,
        height: 800,
        alt: "Dustin Gilmour, founder of Venti Scale",
      },
    ],
  },
  twitter: {
    card: "summary" as const,
    title: "About Dustin Gilmour, founder of Venti Scale",
    description:
      "I burned out paying agencies for junior employees running templates. So I built the thing I wished existed.",
    images: [`${SITE_URL}/dusty.webp`],
  },
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dustin Gilmour",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/dusty.webp`,
  jobTitle: "Founder, Venti Scale",
  worksFor: {
    "@type": "Organization",
    name: "Venti Scale",
    url: SITE_URL,
  },
  description:
    "Founder of Venti Scale. Builds AI-powered marketing systems for ecommerce brands and runs them daily on a Custom AI trained on each client's business.",
  knowsAbout: [
    "AI marketing",
    "Ecommerce marketing",
    "Done-for-you marketing",
    "Marketing automation",
    "Content marketing",
    "Email marketing",
    "Paid social",
    "Search engine optimization",
  ],
  sameAs: [
    "https://www.linkedin.com/in/dustingilmour/",
    "https://x.com/ai_dustingilmour",
  ],
};

const ABOUT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  name: "About Dustin Gilmour, founder of Venti Scale",
  mainEntity: {
    "@type": "Person",
    name: "Dustin Gilmour",
  },
};

export default async function AboutPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSONLD) }}
      />

      <article className="max-w-[720px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Eyebrow>ABOUT</Eyebrow>
        <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-3">
          About Dustin Gilmour
        </h1>
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/45 mb-12">
          Founder, Venti Scale
        </p>

        <div className="flex items-center gap-5 mb-12">
          <img
            src="/dusty.webp"
            alt="Dustin Gilmour, founder of Venti Scale"
            className="w-20 h-20 rounded-full object-cover border border-white/10"
          />
          <div>
            <div className="font-display text-[18px] text-white">
              Dustin Gilmour
            </div>
            <div className="font-mono text-[12px] text-white/40 mt-1">
              Founder, Venti Scale &middot; British Columbia, Canada
            </div>
          </div>
        </div>

        <div className="prose-legal">
          <p>
            I run Venti Scale. I personally review every piece of content before
            it ships to a client. I personally read every audit submission. I
            personally write the growth plan you get back. <em>No junior employees
            between you and me.</em>
          </p>

          <h2>Why I built Venti Scale</h2>
          <p>
            I spent years paying marketing agencies $5,000 to $8,000 a month for
            an account manager running templates. PDF reports nobody read.
            &quot;Discovery phase&quot; meetings that delayed the work by three
            weeks. Forced sales calls before they would ship anything.
          </p>
          <p>
            <em>I was doing half the work myself.</em> Writing the briefs.
            Reviewing the drafts. Filling in the strategy gaps. The agency was
            charging full price to be a layer between me and a junior employee
            running templated work.
          </p>
          <p>
            I built Venti Scale to be the thing I wished existed. Done-for-you
            marketing run on a Custom AI trained on each client&apos;s brand. No
            retainer lock-in. No PDF theater. No discovery phase. The founder
            reviewing every output, the AI handling the volume.
          </p>

          <h2>What I actually do</h2>
          <p>
            Every Venti Scale client gets a Custom AI built specifically for
            their brand. Trained on their voice, their offers, their customers,
            their visuals. That AI runs daily marketing output across content,
            email, social, and ads.
          </p>
          <p>
            I review everything before it ships. I write every growth plan. I
            answer every Slack message myself. The portal shows clients
            everything in real time. No retainer. Cancel any time.
          </p>
          <p>
            5 days from audit submission to live portal. <em>Three weeks faster
            than the average agency onboarding.</em>
          </p>

          <h2>Who I work with</h2>
          <p>
            Ecommerce founders running between $5,000 and $200,000 a month who
            are tired of paying agency retainers for junior staff. Founders who
            want autopilot output with founder-level taste in the work. Founders
            who can spot good marketing from bad and refuse to settle for
            templated agency junior output.
          </p>
          <p>
            Not for: $500,000+ per month brands with internal marketing teams.
            Not for: founders under $5,000 a month who can&apos;t justify the
            spend. Not for: anyone who wants &quot;vision sessions.&quot;
          </p>

          <h2>How to reach me</h2>
          <p>
            <Link href="/#audit" className="text-white hover:opacity-80">
              Submit a free 60-90 second audit
            </Link>
            . I read every submission and email back a custom growth plan within
            2 business days. No call required.
          </p>
          <p>
            You can also find me on{" "}
            <a
              href="https://www.linkedin.com/in/dustingilmour/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              LinkedIn
            </a>{" "}
            and{" "}
            <a
              href="https://x.com/ai_dustingilmour"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              X
            </a>
            .
          </p>
        </div>
      </article>
    </>
  );
}
