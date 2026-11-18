import { BUNDLE_DISCOUNT } from "@/lib/pricing";

export interface Faq {
  q: string;
  a: string;
}

// Plain strings so the same text feeds the page and the FAQ structured data.
export const HOME_FAQ: Faq[] = [
  {
    q: "Is there a contract?",
    a: "No. It's month to month. Cancel any month by sending me an email, and you keep everything I made for you: the articles, the posts, the email flows, the ad accounts. There is no cancellation fee.",
  },
  {
    q: "What is the setup fee for?",
    a: "The one-time work before anything can go out: learning your business and how you talk, connecting your accounts, building templates and tracking, and planning the first months. You pay it once per service. It never comes back.",
  },
  {
    q: "Who actually does the work?",
    a: "I do, with a lot of help from software. AI handles the drafting, scheduling and reporting. I set the plan, check the work and answer your email. You never get handed to an account manager, because there isn't one.",
  },
  {
    q: "How fast will I see results?",
    a: "Posts and emails start going out in the first two weeks. Ads give you real numbers inside the first month. SEO is the slow one: expect three to six months before articles bring steady traffic. Anyone promising faster is guessing.",
  },
  {
    q: "What do you need from me?",
    a: "About 30 minutes at the start: a short form, access to your accounts, and a few photos of your real work. After that, as little or as much as you like. You can approve things before they go out or let them run.",
  },
  {
    q: "Do you build websites?",
    a: "No. I work with the site you already have. If your site needs fixing before marketing will work, I'll tell you that before you pay for anything.",
  },
];

export const PRICING_FAQ: Faq[] = [
  {
    q: "How does billing work?",
    a: "The setup fee is invoiced when you start. The monthly price is invoiced at the start of each month. Pay by card or bank transfer. Prices are in US dollars.",
  },
  {
    q: "How does the bundle discount work?",
    a: `Pick two services and the monthly total drops ${BUNDLE_DISCOUNT[2] * 100}%. Pick three or more and it drops ${BUNDLE_DISCOUNT[3] * 100}%. Setup fees are not discounted. If you remove a service later, the discount adjusts the following month.`,
  },
  {
    q: "Is ad spend included in ads management?",
    a: "No. The monthly fee pays for running the ads. The ad budget itself is charged by Meta or Google straight to your card, so you always see exactly what was spent. I never mark it up.",
  },
  {
    q: "Can I change my plan?",
    a: "Yes, any month. Add a service, drop one, or pause. Adding a new service has its own one-time setup fee. Dropping one costs nothing.",
  },
  {
    q: "What if I need more than the plan covers?",
    a: "Tell me what you need and I'll give you a price for it in writing before any work starts. More articles, more posts, a second ad platform and extra videos are the usual ones.",
  },
  {
    q: "What happens if I cancel?",
    a: "Work stops at the end of the month you've paid for. Everything made for you stays yours, and I hand back access to every account. No fee, no notice period beyond the current month.",
  },
];

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="vs-faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <div>
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
