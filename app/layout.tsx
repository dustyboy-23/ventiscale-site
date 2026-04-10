import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://ventiscale.com";
const SITE_NAME = "Venti Scale";
const TITLE = "Venti Scale. Fire your marketing agency. Keep the growth.";
const DESCRIPTION =
  "Done-for-you marketing for ecommerce brands, run on AI. Content, email, ads, SEO and reports, built around your business. Watch it work in your live portal.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Venti Scale",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Dustin Gilmour", url: SITE_URL }],
  creator: "Dustin Gilmour",
  publisher: SITE_NAME,
  keywords: [
    "done-for-you marketing",
    "ecommerce marketing agency",
    "AI marketing",
    "marketing automation",
    "ecommerce growth",
    "Shopify marketing",
    "email marketing",
    "content marketing",
    "SEO audit",
    "flat-fee marketing",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: TITLE,
    description:
      "Done-for-you marketing for ecommerce brands. Custom plan built for your business. Real portal, no contracts.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Done-for-you marketing for ecommerce brands. Custom plan built for your business. Real portal, no contracts.",
    creator: "@ai_dustingilmour",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Marketing",
};

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  description: DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Dustin Gilmour",
  },
  sameAs: ["https://x.com/ai_dustingilmour"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@ventiscale.com",
    contactType: "customer service",
  },
};

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Venti Scale: Done-for-you marketing",
  provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  serviceType: "Ecommerce marketing management",
  areaServed: "Worldwide",
  description: DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSONLD) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
