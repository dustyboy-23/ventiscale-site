import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { getPortalSession, getMemberships } from "@/lib/current-client";
import { OrphanEmptyState } from "@/components/portal-empty-states";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPortalSession();
  const memberships = session?.mode === "real" ? await getMemberships() : [];

  if (!session) {
    redirect("/login");
  }

  const sidebarClient =
    session.mode === "orphan"
      ? { name: "No workspace", slug: "none" }
      : { name: session.client.name, slug: session.client.slug };

  const sidebarOwner =
    session.mode === "demo" ? "Marcus" : session.userEmail || "you";

  const sidebarRole =
    session.mode === "demo"
      ? "Owner"
      : session.mode === "orphan"
        ? "No access"
        : session.role
          ? session.role.charAt(0).toUpperCase() + session.role.slice(1)
          : "Member";

  // Orphan mode: authed user with no client_users rows. Short-circuit here
  // because pages can't render without a client. Demo + real modes both
  // pass through to children — portal-data branches on session at the page
  // level and renders empty states for real mode.
  const content =
    session.mode === "orphan" ? (
      <OrphanEmptyState email={session.userEmail} />
    ) : (
      children
    );

  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)]">
      <Sidebar
        clientName={sidebarClient.name}
        ownerName={sidebarOwner}
        role={sidebarRole}
        memberships={memberships.map((m) => ({
          id: m.id,
          name: m.name,
          slug: m.slug,
          isAgency: m.isAgency,
        }))}
        activeClientId={session.mode === "real" ? session.client.id : undefined}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          isDemo={session.mode === "demo"}
          clientName={sidebarClient.name}
          ownerName={sidebarOwner}
        />
        <main className="flex-1 min-w-0">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-10">{content}</div>
        </main>
      </div>
    </div>
  );
}
