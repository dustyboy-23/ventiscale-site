import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { CLIENT } from "@/lib/sg-data";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Supabase is configured and the visitor is signed in, show their real
  // email in the sidebar user block. Otherwise fall back to the demo owner
  // name so the "Tour the live demo portal" path still feels personalized.
  let displayName = CLIENT.ownerName;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user?.email) {
      displayName = data.user.email;
    }
  } catch {
    // Supabase not configured yet — stay on demo fallback.
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)]">
      <Sidebar clientName={CLIENT.name} ownerName={displayName} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
