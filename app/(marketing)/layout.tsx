import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Server-rendered style override: forces the html/body to the cream
        editorial canvas for every marketing route, with no flash on first
        paint. This wins over the default light tokens defined in globals.css.
      */}
      <style>{`
        html, body {
          background: #F6F1EA !important;
          color: #1B1B1B;
          color-scheme: light;
        }
        ::-webkit-scrollbar-thumb { background: rgba(27,27,27,0.14) !important; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(27,27,27,0.24) !important; }
      `}</style>
      <div className="min-h-screen flex flex-col bg-[#F6F1EA] text-[#1B1B1B] selection:bg-[rgba(200,54,43,0.18)]">
        <MarketingNav />
        <main className="flex-1 relative">{children}</main>
        <MarketingFooter />
      </div>
    </>
  );
}
