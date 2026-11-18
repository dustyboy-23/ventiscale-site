import Link from "next/link";
import { BUNDLE_DISCOUNT, SERVICES, money } from "@/lib/pricing";

// The "what Venti Scale is" block at the foot of the long guide pages.
// One component so the guides can never again describe an old offer:
// it reads the live prices from lib/pricing.ts.
export function VentiToday() {
  const from = Math.min(...SERVICES.map((s) => s.monthly));
  const setups = SERVICES.map((s) => s.setup);
  return (
    <>
      <h2>What Venti Scale does</h2>
      <p>
        I run marketing for small businesses and online stores as five done-for-you services:{" "}
        {SERVICES.map((s) => s.name.toLowerCase().replace("seo", "SEO")).join(", ")}. Take one or
        take several.
      </p>
      <p>
        Every price is published. Services start at {money(from)} a month, plus a one-time setup
        fee of {money(Math.min(...setups))} to {money(Math.max(...setups))} per service that you
        can see before you talk to anyone. Two services is {BUNDLE_DISCOUNT[2] * 100}% off the
        monthly, three or more is {BUNDLE_DISCOUNT[3] * 100}% off.
      </p>
      <p>
        It&apos;s month to month with no contract. Software does the drafting and scheduling. I
        plan the work, check it and answer your email myself. There is no account manager in
        between.
      </p>
      <p>
        <Link href="/pricing">See every price</Link> or read{" "}
        <Link href="/how-it-works">how it works</Link>.
      </p>
    </>
  );
}
