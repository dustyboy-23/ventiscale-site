import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venti Scale — Fire your marketing agency. Keep the growth.",
  description:
    "Done-for-you marketing for ecommerce brands, run on AI. Content, email, ads, SEO, reports. $1,500 a month, flat. Watch it work in your portal.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Venti Scale — Fire your marketing agency. Keep the growth.",
    description:
      "Done-for-you marketing for ecommerce brands. $1,500/mo flat. Real portal. No contracts.",
    type: "website",
    url: "https://ventiscale.com",
  },
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
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
