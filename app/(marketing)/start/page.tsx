import { StartForm } from "@/components/marketing/start-form";

const SITE_URL = "https://www.ventiscale.com";

export const metadata = {
  title: "Start your plan",
  description:
    "Pick your services, see your price and send your details. I reply personally within one business day. Nothing is charged until you say go.",
  alternates: { canonical: `${SITE_URL}/start` },
};

const NEXT = [
  {
    title: "I email you back",
    body: "Within one business day, from my own inbox. If your plan doesn't fit what you need, I'll say so before you pay anything.",
  },
  {
    title: "You get a setup invoice and a short form",
    body: "You only pay if you want to go ahead. The form takes about 20 minutes: what you sell, who buys it, how you talk, and access to the accounts I'll work in.",
  },
  {
    title: "Setup week, then work goes out",
    body: "About a week after you send the form back, the first articles, posts, emails or ads are live.",
  },
];

export default function StartPage() {
  return (
    <section>
      <div className="vs-container pt-10 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:items-start">
          <div className="lg:sticky lg:top-28">
            <h1 className="vs-h1" style={{ fontSize: "clamp(38px, 5.2vw, 62px)" }}>
              Start your plan.
            </h1>
            <p className="vs-lede mt-5">
              Two minutes. No call. Nothing is charged today.
            </p>

            <h2 className="vs-h3 mt-10">What happens after you send this</h2>
            <ol className="vs-steps list-none p-0 mt-5" style={{ gridTemplateColumns: "1fr", borderTop: "1.5px solid var(--color-evergreen)" }}>
              {NEXT.map((n) => (
                <li key={n.title} className="vs-step vs-step-stack">
                  <h3 className="text-[17.5px] font-semibold leading-snug">{n.title}</h3>
                  <p className="vs-small mt-1.5 text-[15.5px]">{n.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <StartForm />
        </div>
      </div>
    </section>
  );
}
