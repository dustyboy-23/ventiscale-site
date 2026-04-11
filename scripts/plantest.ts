import { buildMarketingPlan } from "../lib/audit";

const makeResult = (overrides: Record<string, "pass" | "warn" | "fail" | "info">) => ({
  reachable: true as const,
  finalUrl: "https://acmewidgets.com",
  grade: "D",
  score: 52,
  checks: [
    { id: "pixels", status: overrides.pixels || "fail", label: "Tracking pixels", detail: "No Meta Pixel, GA4, or Tag Manager detected." },
    { id: "email_capture", status: overrides.email_capture || "fail", label: "Email capture", detail: "No signup form or popup detected." },
    { id: "content_hub", status: overrides.content_hub || "fail", label: "Content hub", detail: "No blog or content section found." },
    { id: "content_fresh", status: overrides.content_fresh || "info", label: "Content freshness", detail: "No blog to check freshness on." },
    { id: "social", status: overrides.social || "warn", label: "Social links", detail: "Only 1 social link in footer." },
    { id: "conversion", status: overrides.conversion || "fail", label: "Conversion tools", detail: "No live chat or popup tool detected." },
    // basics
    { id: "https", status: "pass", label: "HTTPS", detail: "OK" },
    { id: "title", status: "pass", label: "Title tag", detail: "OK" },
  ],
});

const scenarios = [
  { biz: "handmade jewelry brand on Shopify", overrides: {} },
  { biz: "business coach selling a $2000 course", overrides: {} },
  { biz: "SaaS project management tool", overrides: { pixels: "pass", email_capture: "pass" } },
];

for (const s of scenarios) {
  console.log("═".repeat(70));
  console.log("BIZ:", s.biz);
  console.log("═".repeat(70));
  console.log(buildMarketingPlan(makeResult(s.overrides as any) as any, s.biz));
  console.log();
}
