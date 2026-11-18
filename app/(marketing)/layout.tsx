import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

// Marketing-only faces. The portal keeps its own (root layout).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html, body { background: #FFFFFF !important; color: #0F2E20; color-scheme: light; }
        html { scroll-behavior: smooth; scroll-padding-top: 84px; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      `}</style>
      <div className={`vs-site min-h-screen flex flex-col ${bricolage.variable} ${figtree.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] vs-btn vs-btn-sm"
        >
          Skip to content
        </a>
        <MarketingNav />
        <main id="main" className="flex-1 relative">
          {children}
        </main>
        <MarketingFooter />
      </div>
    </>
  );
}
