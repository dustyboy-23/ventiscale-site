import type { MetadataRoute } from "next";

const SITE_URL = "https://www.ventiscale.com";

const PORTAL_ROUTES = ["/api/", "/dashboard/", "/login", "/campaigns", "/content", "/files", "/reports"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PORTAL_ROUTES,
      },
      // Explicitly allow AI crawlers (we want to be cited)
      { userAgent: "GPTBot", allow: "/", disallow: PORTAL_ROUTES },
      { userAgent: "ChatGPT-User", allow: "/", disallow: PORTAL_ROUTES },
      { userAgent: "anthropic-ai", allow: "/", disallow: PORTAL_ROUTES },
      { userAgent: "Google-Extended", allow: "/", disallow: PORTAL_ROUTES },
      { userAgent: "PerplexityBot", allow: "/", disallow: PORTAL_ROUTES },
      // Block low-value scrapers
      { userAgent: "Bytespider", disallow: ["/"] },
      { userAgent: "CCBot", disallow: ["/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
