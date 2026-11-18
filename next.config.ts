import type { NextConfig } from "next";

// Baseline security headers applied to every response.
//
// CSP is set per-request in middleware.ts (NOT here) because it includes
// a per-request nonce. See middleware.ts for the policy + rollout posture.
// All other security headers are static and live here.

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async redirects() {
    return [
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
      { source: "/data-deletion.html", destination: "/data-deletion", permanent: true },
      // 2026-11 redesign: services and prices live on one page.
      { source: "/services", destination: "/pricing", permanent: true },
      { source: "/for-shopify", destination: "/pricing", permanent: true },
      // Old comparison quoted retired prices and "zero setup". /vs-agency is the current one.
      { source: "/blog/venti-scale-vs-traditional-agency", destination: "/vs-agency", permanent: true },
      // 2026-11 SEO pass: posts covering the same ground merged into the strongest page.
      { source: "/blog/ai-marketing-agency", destination: "/blog/what-ai-marketing-agency-does", permanent: true },
      { source: "/blog/how-ai-marketing-actually-works", destination: "/blog/what-ai-marketing-agency-does", permanent: true },
      { source: "/blog/chatgpt-vs-custom-ai-marketing", destination: "/blog/what-ai-marketing-agency-does", permanent: true },
      { source: "/blog/custom-ai-vs-chatgpt-for-marketing", destination: "/blog/what-ai-marketing-agency-does", permanent: true },
      { source: "/blog/what-does-ai-marketing-cost", destination: "/ai-marketing-cost", permanent: true },
      { source: "/blog/ai-marketing-roi-vs-agency-retainer-2026", destination: "/ai-marketing-cost", permanent: true },
      { source: "/blog/ai-marketing-tool-price-war-2026", destination: "/ai-marketing-cost", permanent: true },
      { source: "/blog/dtc-ai-marketing-stack-full-cost-2026", destination: "/ai-marketing-cost", permanent: true },
      { source: "/blog/agency-retainer-true-cost-ecommerce-2026", destination: "/vs-agency", permanent: true },
      { source: "/blog/marketing-agency-ai-staff-retainer-2026", destination: "/vs-agency", permanent: true },
      { source: "/blog/ecommerce-cac-benchmarks-by-vertical", destination: "/blog/ecommerce-cac-by-vertical-2026", permanent: true },
      { source: "/blog/dtc-fashion-cac-benchmarks-2026", destination: "/blog/ecommerce-cac-by-vertical-2026", permanent: true },
      { source: "/blog/dtc-ad-spend-percentage-stage-2026", destination: "/blog/dtc-ad-spend-percentage-small-brands", permanent: true },
      { source: "/blog/month-to-month-vs-retainer-marketing", destination: "/blog/month-to-month-marketing-services", permanent: true },
      { source: "/blog/contractors-getting-clients-online", destination: "/blog/contractors-getting-more-leads", permanent: true },
      { source: "/blog/best-marketing-strategy-for-coaches", destination: "/blog/how-coaches-get-more-clients", permanent: true },
      { source: "/blog/why-coaches-need-social-media", destination: "/blog/how-coaches-get-more-clients", permanent: true },
      { source: "/blog/shopify-marketing-strategy-2026", destination: "/shopify-marketing-strategy", permanent: true },
      { source: "/blog/signs-marketing-agency-gaslighting", destination: "/blog/marketing-agency-red-flags", permanent: true },
      { source: "/blog/ai-marketing-service-vs-marketing-manager", destination: "/blog/marketing-agency-vs-in-house", permanent: true },
      { source: "/blog/dtc-marketing-in-house-ai-2026", destination: "/blog/marketing-agency-vs-in-house", permanent: true },
      { source: "/blog/seven-agency-services-ai-replaced-2026", destination: "/blog/ai-replace-marketing-team", permanent: true },
      { source: "/blog/dtc-fired-marketing-team-ai-agents-2026", destination: "/blog/ai-replace-marketing-team", permanent: true },
      { source: "/blog/dtc-replace-agency-ai-stack-2026", destination: "/blog/ai-replace-marketing-team", permanent: true },
      { source: "/blog/social-media-for-ecommerce-brands", destination: "/blog/only-social-media-strategy-you-need", permanent: true },
      { source: "/blog/ai-cutting-marketing-costs", destination: "/ai-marketing-cost", permanent: true },
      // Anonymous, activity-only, and it described the April offer. Temporary so
      // a real client result can take the URL back.
      { source: "/case-studies", destination: "/pricing", permanent: false },
      { source: "/case-studies/:path*", destination: "/pricing", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
