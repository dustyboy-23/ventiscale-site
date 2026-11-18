import { AD_SPEND_CAP, BUNDLE_DISCOUNT, SERVICES, money } from "@/lib/pricing";

const ADS = SERVICES.find((s) => s.id === "ads")!;

export interface Faq {
  q: string;
  a: string;
}

// Plain strings so the same text feeds the page and the FAQ structured data.
export const HOME_FAQ: Faq[] = [
  {
    q: "Is there a contract?",
    a: "No. It's month to month. Cancel any month by sending me an email, and you keep everything I made for you: the articles, the posts, the emails, the ad accounts. There is no cancellation fee.",
  },
  {
    q: "What is the setup fee for?",
    a: "The one-time work before anything can go out: learning your business and how you talk, connecting your accounts, building templates and tracking, and planning the first months. You pay it once per service.",
  },
  {
    q: "Who actually does the work? Is it just AI?",
    a: "Software writes first drafts and handles the scheduling and reporting. I decide what gets made, rewrite what's off and check the work before it goes out. You never get handed to an account manager, because there isn't one.",
  },
  {
    q: "How will I know it's working?",
    a: "Once a month you get one plain report. It starts with what you care about: calls, enquiries, bookings or sales, wherever they can be tracked. Rankings, clicks and opens come after that.",
  },
  {
    q: "What if you're away or busy?",
    a: "The work is planned and scheduled ahead, so articles, posts and emails keep going out. I work from wherever I am and answer email within one business day. I keep the client list small so one person can do this properly.",
  },
  {
    q: "How fast will I see results?",
    a: "Posts and emails start going out in the first two weeks. Ads give you real numbers inside the first month. SEO is the slow one: expect three to six months before articles bring steady traffic. Anyone promising faster is guessing.",
  },
  {
    q: "What do you need from me?",
    a: "About 30 minutes in total at the start: a 20-minute form, then sharing access to your accounts and a few photos of your real work. After that, as little or as much as you like. You can approve things before they go out or let them run.",
  },
  {
    q: "Do you work with businesses in my area?",
    a: "Yes. Everything is done remotely, so it doesn't matter where you are. Prices are in US dollars.",
  },
  {
    q: "Do you build websites?",
    a: "No. I don't build or redesign websites.",
  },
];

export const PRICING_FAQ: Faq[] = [
  {
    q: "How does billing work?",
    a: "The setup fee is invoiced when you start. The monthly price is invoiced at the start of each month. Pay by card or bank transfer. Prices are in US dollars.",
  },
  {
    q: "How does the bundle discount work?",
    a: `Pick two services and the monthly total drops ${BUNDLE_DISCOUNT[2] * 100}%. Pick three or more and it drops ${BUNDLE_DISCOUNT[3] * 100}%. Setup fees aren't discounted. If you remove a service later, the discount adjusts the following month.`,
  },
  {
    q: "How is ads management priced?",
    a: `Per channel. Meta (Facebook and Instagram) is one channel and Google (Search, Maps and YouTube) is another. Each is ${money(ADS.monthly)} a month plus ${money(ADS.setup)} setup, and each covers up to ${money(AD_SPEND_CAP)} a month in ad spend.`,
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
    a: "Tell me what you need and I'll give you a price for it in writing before any work starts. More articles, more posts, ad spend above $3,000 a month on a channel and extra videos are the usual ones.",
  },
  {
    q: "I already run ads or email. Do you start over?",
    a: "No. I work inside the accounts you already have. The setup fee is the same.",
  },
  {
    q: "What happens if I cancel?",
    a: "Work stops at the end of the month you've paid for. Everything made for you stays yours, and I hand back access to every account. Fees already paid aren't refunded.",
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
