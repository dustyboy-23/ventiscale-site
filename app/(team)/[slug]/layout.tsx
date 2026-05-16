import { notFound, redirect } from "next/navigation";
import { getTeamSession } from "@/lib/team-queries";
import { getPortalSession } from "@/lib/current-client";

// Team layout — wraps all /team/[slug]/* routes.
// Phase 2 (2026-05-09): minimal shell. Will integrate with Sidebar/TopBar in Phase 2.5
// once we decide on agency-vs-client navigation pattern.
export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Auth gate — must be signed in
  const portal = await getPortalSession();
  if (!portal || portal.mode !== "real") {
    redirect("/login");
  }

  // Team membership gate
  const session = await getTeamSession(slug);
  if (!session) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-canvas)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-md"
              style={{ backgroundColor: session.team.brandColor || "#10b981" }}
            />
            <div>
              <h1 className="text-base font-semibold text-[var(--color-text)]">
                {session.team.name}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                Agency dashboard · {session.role}
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href={`/${slug}/dashboard`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Dashboard
            </a>
            <a
              href={`/${slug}/brands`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Brands
            </a>
            <a
              href={`/${slug}/velocity`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Velocity
            </a>
            <a
              href={`/${slug}/health`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Health
            </a>
            <a
              href={`/${slug}/queue`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Queue
            </a>
            <a
              href={`/${slug}/social`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Social
            </a>
            <a
              href={`/${slug}/activity`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Activity
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-[1240px] px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
