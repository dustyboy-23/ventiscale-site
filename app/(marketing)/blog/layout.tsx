import type { Metadata } from "next";

// Article titles are long enough already. Leaving the brand off keeps the
// words people searched for inside what Google shows.
export const metadata: Metadata = {
  title: { default: "Blog", template: "%s" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
