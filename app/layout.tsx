import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://www.ventiscale.com";
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
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
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
