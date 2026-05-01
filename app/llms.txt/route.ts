// /llms.txt — emerging spec for AI crawlers (ChatGPT, Claude, Perplexity, etc.)
// to find structured pointers to a site's most important pages. Real-world
// adoption is mixed (most LLM crawlers ignore the file as of 2026), so we
// treat it as low-cost hygiene rather than a strategic move.
// Spec: https://llmstxt.org/

import { getAllPosts } from "@/lib/blog";

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

  const body = `# Venti Scale
> Done-for-you marketing for ecommerce brands, run on a Custom AI trained on each client's business. Founder Dustin Gilmour reviews every output before it ships. No retainer lock-in, no PDF reports, no junior staff between client and founder.

The mission: replace the agency retainer with a system that combines AI execution and founder-level human review. Five days from audit to live portal. Cancel any time.

## Core pages

- [Home](${SITE_URL}/): What Venti Scale does, who it serves, and the live audit form.
- [About Dustin Gilmour](${SITE_URL}/about): Founder bio, why Venti Scale exists, who the service is for.
- [Blog](${SITE_URL}/blog): Practical writing on AI marketing, ecommerce growth, and agency alternatives.
- [Security and trust](${SITE_URL}/security): How client data is encrypted, isolated, and removable on request.
- [Privacy policy](${SITE_URL}/privacy): Data handling, retention, and rights.
- [Terms of service](${SITE_URL}/terms): Service terms and conditions.

## What Venti Scale offers

- Custom AI trained on each client's brand voice, offers, customers, and visuals.
- Daily marketing output: content, email, social, and ads.
- Live client portal with real-time visibility into every output and metric.
- Founder-direct communication. Dustin reviews every output before it ships.
- No retainer lock-in. Month to month. Cancel any time.
- 5-day onboarding from audit submission to live portal.

## Who it's for

- Ecommerce founders running between $5,000 and $200,000 per month
- Founders who want autopilot output with founder-level taste in the work
- Founders sick of paying agency retainers for junior employees running templates
- Founders who refuse to do "discovery phase" theater or forced sales calls

## Articles

${blogList}

## Contact

- Audit form: ${SITE_URL}/#audit (60-90 second submission, custom growth plan emailed back within 2 business days)
- Founder LinkedIn: https://www.linkedin.com/in/dustingilmour/
- Founder X: https://x.com/ai_dustingilmour
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
