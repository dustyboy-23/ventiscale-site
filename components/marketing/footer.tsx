import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { SERVICES } from "@/lib/pricing";

const GUIDES = [
  { href: "/done-for-you-marketing-services", label: "Done-for-you marketing" },
  { href: "/marketing-agency-alternatives", label: "Marketing agency alternatives" },
  { href: "/ai-marketing-cost", label: "What AI marketing costs" },
  { href: "/ai-marketing-for-ecommerce", label: "AI marketing for ecommerce" },
  { href: "/shopify-marketing-strategy", label: "Shopify marketing strategy" },
];

const COMPANY = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/security", label: "Security" },
  { href: "/login", label: "Client login" },
];

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[15px] font-semibold text-evergreen mb-3.5">{title}</p>
      <ul className="grid gap-2.5">{children}</ul>
    </div>
  );
}

const linkCls = "text-[15.5px] text-moss hover:text-evergreen transition-colors";

export function MarketingFooter() {
  return (
    <footer className="vs-rule bg-paper">
      <div className="vs-container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Venti Scale home">
              <Logo />
            </Link>
            <p className="vs-small mt-4 max-w-[26em]">
              Done-for-you marketing for small businesses. Flat monthly prices,
              no contract, run by one person who answers his own email.
            </p>
            <a href="mailto:hello@ventiscale.com" className="vs-link inline-block mt-4 text-[15.5px]">
              hello@ventiscale.com
            </a>
          </div>

          <Col title="Services">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link href={s.href} className={linkCls}>
                  {s.name}
                </Link>
              </li>
            ))}
          </Col>

          <Col title="Venti Scale">
            {COMPANY.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Col>

          <Col title="Guides">
            {GUIDES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Col>
        </div>

        <div className="vs-rule mt-12 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="vs-small">
            © 2026 Venti Scale LLC, Sheridan, WY 82801, USA
          </p>
          <p className="vs-small flex gap-5">
            <Link href="/privacy" className="hover:text-evergreen">Privacy</Link>
            <Link href="/terms" className="hover:text-evergreen">Terms</Link>
            <Link href="/data-deletion" className="hover:text-evergreen">Data deletion</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
