import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          background: #07080C !important;
          color: #F5F6FA;
          color-scheme: dark;
        }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08) !important; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18) !important; }
        ::selection { background: rgba(200, 54, 43, 0.35); color: #fff; }
      `}</style>
      <div className="min-h-screen flex flex-col bg-[#07080C] text-[#F5F6FA]">
        <MarketingNav />
        <main className="flex-1 relative">{children}</main>
        <MarketingFooter />
      </div>
    </>
  );
}
