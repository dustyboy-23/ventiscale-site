import type { ReactNode } from "react";

export const metadata = {
  title: "OAuth callback | Venti Scale",
  robots: { index: false, follow: false },
};

export default function OAuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
