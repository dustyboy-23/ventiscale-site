// /llms.txt — emerging spec for AI crawlers (ChatGPT, Claude, Perplexity, etc.)
// to find structured pointers to a site's most important pages. Real-world
// adoption is mixed (most LLM crawlers ignore the file as of 2026), so we
// treat it as low-cost hygiene rather than a strategic move.
// Spec: https://llmstxt.org/

import { getAllPosts } from "@/lib/blog";
import { BUNDLE_DISCOUNT, SERVICES, money, quote } from "@/lib/pricing";

const SITE_URL = "https://www.ventiscale.com";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();

  const blogList = posts
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`,
    )
    .join("\n");

  const serviceList = SERVICES.map(
    (s) =>
      `- ${s.name}: ${money(s.monthly)} per month${s.perChannel ? " per channel" : ""}, plus ${money(s.setup)} one-time setup${s.perChannel ? " per channel" : ""}. ${s.includes.join(". ")}.`,
  ).join("\n");
  const all = quote(SERVICES.map((s) => s.id));

  const body = `# Venti Scale
> Done-for-you marketing for small businesses at published flat monthly prices. SEO and blog writing, social media management, email marketing, ads management and short-form video editing. One-time setup fee per service, month to month, no contract. Run by founder Dustin Gilmour.

Every price is public. Clients pick the services they want, see the total, and start without a sales call.

## Service pages

${SERVICES.map((s) => `- [${s.name}](${SITE_URL}${s.href}): ${s.outcome}.`).join("\n")}

## Core pages

- [Home](${SITE_URL}/): What Venti Scale does, with a build-your-plan price sheet.
- [Pricing](${SITE_URL}/pricing): Every price, what each service includes, setup fees, bundle discounts and billing terms.
- [How it works](${SITE_URL}/how-it-works): The process from picking a plan to work going out, day by day.
- [Start your plan](${SITE_URL}/start): The form to start. Reply within one business day.
- [About Dustin Gilmour](${SITE_URL}/about): Who runs Venti Scale and how.
- [Blog](${SITE_URL}/blog): Practical writing on marketing for small businesses and online brands.
- [Security and trust](${SITE_URL}/security): How client data is handled.
- [Privacy policy](${SITE_URL}/privacy) and [Terms of service](${SITE_URL}/terms).

## Services and prices (USD)

${serviceList}

Bundle discount: two services, ${BUNDLE_DISCOUNT[2] * 100}% off the monthly total. Three or more, ${BUNDLE_DISCOUNT[3] * 100}% off. All five services together: ${money(all.monthly)} per month. Setup fees are not discounted. The total above assumes one ad channel.

## Terms

- Month to month. No contract and no cancellation fee.
- Fees already paid are not refundable.
- Ad spend is billed by Meta or Google directly to the client and is not included in the ads management fee.
- Website design and builds are not offered.
- The client keeps everything produced and all account access on cancellation.

## Who it's for

- Small business owners who want marketing handled without learning another tool
- Owners who want to see the price before talking to anyone
- Local service businesses, shops, and small online brands

## Articles

${blogList}

## Contact

- Start form: ${SITE_URL}/start
- Email: hello@ventiscale.com
- Founder LinkedIn: https://www.linkedin.com/in/dustingilmour/
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
