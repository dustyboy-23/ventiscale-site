import type { NextConfig } from "next";

// Baseline security headers applied to every response.
//
// CSP ships in REPORT-ONLY mode for this round. Wrong CSP silently
// breaks pages, so we observe violations in production logs first, then
// flip to enforce in a follow-up commit once 2-3 days of clean traffic
// confirms nothing legit is being blocked. The report-only header still
// shows a B+ on securityheaders.com.
//
// What the policy allows:
//   - inline scripts/styles: required by JSON-LD blocks (FAQ, Org, Service)
//     and a small inline gtag bootstrap in app/layout.tsx
//   - googletagmanager.com: GA4 loader script
//   - va.vercel-scripts.com + *.vercel-insights.com: @vercel/analytics
//   - *.supabase.co: auth + database fetches
//   - *.googleusercontent.com + drive.google.com: Drive previews + thumbs
//   - frame-src *.google.com: portal embeds Drive file iframes
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.googleusercontent.com https://drive.google.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "frame-src https://*.google.com https://drive.google.com",
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

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
  {
    key: "Content-Security-Policy-Report-Only",
    value: csp,
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
