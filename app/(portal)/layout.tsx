import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { CLIENT } from "@/lib/sg-data";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)]">
      <Sidebar clientName={CLIENT.name} ownerName={CLIENT.ownerName} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
