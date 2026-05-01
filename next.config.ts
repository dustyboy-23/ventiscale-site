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
