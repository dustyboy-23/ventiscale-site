import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
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
const TITLE = "Done-for-you marketing for small businesses | Venti Scale";
const HEADLINE = "Your competitor isn't better than you. They're just easier to find.";
const DESCRIPTION =
  "Done-for-you marketing for small businesses: SEO, social media, email, ads and video editing. Flat monthly prices published on the site, one-time setup, no contract.";

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
    "small business marketing",
    "marketing agency pricing",
    "SEO and blog writing service",
    "social media management",
    "email marketing service",
    "ads management",
    "short-form video editing",
    "flat-fee marketing",
    "month-to-month marketing",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: HEADLINE,
    description:
      "Done-for-you marketing for small businesses. Every price published. One-time setup, flat monthly, no contract.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HEADLINE,
    description:
      "Done-for-you marketing for small businesses. Every price published. One-time setup, flat monthly, no contract.",
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
  serviceType: "Small business marketing management",
  areaServed: "Worldwide",
  description: DESCRIPTION,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Per-request nonce set by middleware.ts. Forwarded via x-nonce request
  // header. Inline scripts on this and every nested page must include
  // `nonce={nonce}` to satisfy the CSP set in middleware.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {GSC_VERIFICATION && (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        )}
        {GA_ID && (
          <>
            <script
              async
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
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
