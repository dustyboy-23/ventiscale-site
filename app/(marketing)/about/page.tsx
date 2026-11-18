import Link from "next/link";
import { headers } from "next/headers";
import { ClosingCta } from "@/components/marketing/sections";

const SITE_URL = "https://www.ventiscale.com";
const TITLE = "About Dustin Gilmour, founder of Venti Scale";
const DESCRIPTION =
  "Venti Scale is one person and a lot of good software. Who I am, how I work, and who this is and isn't for.";

export const metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
    type: "profile",
    images: [{ url: `${SITE_URL}/dusty.webp`, width: 600, height: 600, alt: "Dustin Gilmour, founder of Venti Scale" }],
  },
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dustin Gilmour",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/dusty.webp`,
  jobTitle: "Founder, Venti Scale",
  worksFor: { "@type": "Organization", name: "Venti Scale", url: SITE_URL },
  description:
    "Founder of Venti Scale. Runs done-for-you marketing for small businesses at published flat monthly prices.",
  knowsAbout: [
    "Small business marketing",
    "Search engine optimization",
    "Social media management",
    "Email marketing",
    "Paid advertising",
    "Short-form video",
  ],
  sameAs: ["https://www.linkedin.com/in/dustingilmour/", "https://x.com/ai_dustingilmour"],
};

const ABOUT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  name: TITLE,
  mainEntity: { "@type": "Person", name: "Dustin Gilmour" },
};

export default async function AboutPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }} />
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSONLD) }} />

      <section>
        <div className="vs-container pt-10 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16 lg:items-center">
            <div>
              <h1 className="vs-h1">Venti Scale is one person and a lot of good software.</h1>
              <p className="vs-lede mt-6">
                I&apos;m Dustin Gilmour. I run every account myself, from British Columbia, Canada
                and wherever my laptop is that month.
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder/dustin.webp"
              alt="Dustin Gilmour, founder of Venti Scale"
              width={600}
              height={600}
              className="w-full max-w-[300px] aspect-square rounded-[26px] object-cover lg:justify-self-end"
            />
          </div>
        </div>
      </section>

      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <h2 className="vs-h2">Why it exists.</h2>
            <div className="grid gap-4 vs-body text-[17.5px]">
              <p>
                Most small businesses know they should be posting, emailing and showing up on
                Google. They don&apos;t have the hours. So they hire an agency, sign a long
                contract, and a few months later they&apos;re paying a big bill for a report they
                don&apos;t read.
              </p>
              <p>
                I built Venti Scale to be the opposite of that. The price is on the page. There is
                no contract. You can see the work. When you email, the person who answers is the
                person doing it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <h2 className="vs-h2">How I work.</h2>
            <div className="grid gap-4 vs-body text-[17.5px]">
              <p>
                Software does the heavy lifting: drafting, scheduling, pulling the numbers. That is
                the reason the prices are what they are.
              </p>
              <p>
                I do the parts software is bad at. Understanding what your business actually sells
                and who buys it. Deciding what to say. Checking the work before it goes out.
                Telling you plainly when something isn&apos;t working.
              </p>
              <p>
                I keep the client list small on purpose, so every account gets real attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="vs-h3">This is for you if</h2>
              <ul className="mt-4 grid gap-2.5 vs-body list-disc pl-5">
                <li>You run a small business and marketing keeps falling to the bottom of the list.</li>
                <li>You want to know the price before you talk to anyone.</li>
                <li>You&apos;d rather hand it off than learn another tool.</li>
              </ul>
            </div>
            <div>
              <h2 className="vs-h3">It isn&apos;t if</h2>
              <ul className="mt-4 grid gap-2.5 vs-body list-disc pl-5">
                <li>You need a new website built. I don&apos;t do that.</li>
                <li>You want a big team, weekly meetings and a slide deck.</li>
                <li>You need results by next Friday. Good marketing takes months.</li>
              </ul>
            </div>
          </div>
          <p className="vs-body mt-10">
            Reach me at{" "}
            <a href="mailto:hello@ventiscale.com" className="vs-link">
              hello@ventiscale.com
            </a>
            , on{" "}
            <a href="https://www.linkedin.com/in/dustingilmour/" target="_blank" rel="noopener noreferrer" className="vs-link">
              LinkedIn
            </a>
            , or just{" "}
            <Link href="/start" className="vs-link">
              start a plan
            </Link>
            .
          </p>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
