import Link from "next/link";
import { headers } from "next/headers";
import { ClosingCta } from "@/components/marketing/sections";
import { SERVICES, money, quote } from "@/lib/pricing";

const SITE_URL = "https://www.ventiscale.com";
const SLUG = "vs-agency";

export const metadata = {
  title: "Venti Scale vs a marketing agency",
  description:
    "An honest side-by-side: price, contract, setup fees, who does the work, reporting and cancelling. Including where an agency is the better choice.",
  alternates: { canonical: `${SITE_URL}/${SLUG}` },
  openGraph: {
    title: "Venti Scale vs a marketing agency",
    description:
      "An honest side-by-side: price, contract, setup fees, who does the work, reporting and cancelling.",
    url: `${SITE_URL}/${SLUG}`,
    type: "website",
  },
};

const from = Math.min(...SERVICES.map((s) => s.monthly));
const all = quote(SERVICES.map((s) => s.id));
const setups = SERVICES.map((s) => s.setup);

// The agency column is deliberately hedged ("often", "usually"): agencies
// differ. The one hard number is cited on /pricing.
const ROWS: { aspect: string; agency: string; venti: string }[] = [
  {
    aspect: "Monthly price",
    agency: "Most agencies say their average retainer is $1,000 to $10,000 a month. You usually get the number after a call.",
    venti: `${money(from)} to ${money(all.monthly)} a month depending on what you pick. Published.`,
  },
  {
    aspect: "Setup fee",
    agency: "Varies. Often not on the website.",
    venti: `${money(Math.min(...setups))} to ${money(Math.max(...setups))} per service, once. Published next to the monthly price.`,
  },
  {
    aspect: "Contract",
    agency: "Often a 3 to 12 month minimum.",
    venti: "None. Month to month.",
  },
  {
    aspect: "Getting started",
    agency: "Sales call, proposal, kickoff meetings.",
    venti: "A two-minute form. Work goes out about a week after onboarding.",
  },
  {
    aspect: "Who does the work",
    agency: "Usually an account manager plus a team you don't meet.",
    venti: "One person. Software drafts, I plan, check and answer.",
  },
  {
    aspect: "What you get",
    agency: "Often described in hours or as \"a retainer\".",
    venti: "A counted list. For example 4 articles, 12 posts and 2 email campaigns a month.",
  },
  {
    aspect: "Reporting",
    agency: "Usually a monthly report or slide deck.",
    venti: "One plain monthly report, plus a dashboard you can open any time.",
  },
  {
    aspect: "Talking to someone",
    agency: "Through your account manager.",
    venti: "Email the person doing the work. Reply within one business day.",
  },
  {
    aspect: "Cancelling",
    agency: "Often a notice period, sometimes a fee.",
    venti: "Send one email. Work stops at the end of the month you paid for. You keep everything.",
  },
];

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Vs agency", item: `${SITE_URL}/${SLUG}` },
  ],
};

export default async function VsAgencyPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <section>
        <div className="vs-container pt-10 pb-4 lg:pt-20 lg:pb-8">
          <div className="max-w-[46em]">
            <h1 className="vs-h1">Venti Scale next to a traditional agency.</h1>
            <p className="vs-lede mt-6">
              Nine things that matter when you hire someone to do your marketing. Agencies differ,
              so their column says &quot;often&quot; and &quot;usually&quot;. Mine doesn&apos;t
              need to.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="vs-container vs-section">
          <div className="vs-table-wrap">
            <table className="vs-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "18%" }}> </th>
                  <th scope="col" style={{ width: "38%" }}>A traditional agency</th>
                  <th scope="col">Venti Scale</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.aspect}>
                    <th scope="row" className="font-semibold">{r.aspect}</th>
                    <td className="text-moss">{r.agency}</td>
                    <td>{r.venti}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="vs-small mt-4">
            The retainer range is from SparkToro&apos;s State of Digital Agencies 2025 survey,
            linked on the{" "}
            <Link href="/pricing" className="vs-link">
              pricing page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <h2 className="vs-h2">When an agency is the better choice.</h2>
            <div className="grid gap-4 vs-body text-[17.5px]">
              <p>
                If you spend more than about $10,000 a month on ads, need video shoots or
                photographers on site, want a team in weekly meetings, or work in an industry
                where every line needs legal sign-off, hire an agency. That is what they are
                built for.
              </p>
              <p>
                If you want the regular work done well every week at a price you can see first,
                that is what I am built for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
