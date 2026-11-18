import Link from "next/link";
import { SERVICES, money } from "@/lib/pricing";

// The call to action at the foot of every blog post. One component so the
// offer changes in one place (it used to be pasted into 179 files).
export function BlogCta() {
  const from = Math.min(...SERVICES.map((s) => s.monthly));
  return (
    <div className="blog-cta">
      <h3>Want this handled for you?</h3>
      <p>
        I run marketing for small businesses at flat monthly prices, from {money(from)} a month. No
        contract. Every price is on the page.
      </p>
      <Link href="/pricing">See pricing</Link>
    </div>
  );
}
