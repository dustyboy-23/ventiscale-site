import Link from "next/link";
import { ClosingCta, DashboardProof, MonthView, Steps } from "@/components/marketing/sections";
import { SERVICES } from "@/lib/pricing";

const SITE_URL = "https://www.ventiscale.com";

export const metadata = {
  title: "How it works",
  description:
    "From picking a plan to work going out in about a week. What happens each day of setup, what I need from you, and what a normal month looks like.",
  alternates: { canonical: `${SITE_URL}/how-it-works` },
};

const TIMELINE = [
  {
    when: "Day 0",
    title: "You send the start form",
    body: "Pick your services, add your details, send. You see the full price before you type anything.",
  },
  {
    when: "Day 1",
    title: "I reply with next steps",
    body: "A personal email from me with your setup invoice and a short onboarding form. You only pay if you want to go ahead. If I think a different mix of services would serve you better, this is where I say it.",
  },
  {
    when: "Days 2 to 7",
    title: "Setup week",
    body: "You fill in the form (about 20 minutes) and share access. I learn how your business talks, connect the accounts, build templates and tracking, and plan the first months.",
  },
  {
    when: "Week 2",
    title: "First work goes out",
    body: "The first articles, posts, emails, ads or videos are live. You can look at everything before it publishes, or tell me to just run it.",
  },
  {
    when: "Every week",
    title: "The work keeps shipping",
    body: "On schedule, without you chasing anyone. If something in your business changes, a new offer or a busy season, email me and the plan changes with it.",
  },
  {
    when: "Every month",
    title: "One plain report",
    body: "What went out, what it did, and what I'm changing next month. No 30-page PDF. If the numbers say something isn't working, I'll say it first.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section>
        <div className="vs-container pt-10 pb-4 lg:pt-20 lg:pb-8">
          <div className="max-w-[46em]">
            <h1 className="vs-h1">Pick a plan today. Work goes out next week.</h1>
            <p className="vs-lede mt-6">
              No discovery phase, no kickoff workshop, no sales call. Here is the whole process,
              start to finish.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="vs-container vs-section">
          <Steps />
        </div>
      </section>

      <section className="vs-band">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">The same thing, day by day.</h2>
            </div>
            <ol className="vs-ledger list-none p-0 m-0">
              {TIMELINE.map((t) => (
                <li
                  key={t.title}
                  className="grid gap-1.5 sm:grid-cols-[8.5em_1fr] sm:gap-6 py-6 border-b border-line"
                >
                  <p className="vs-num text-[17px] pt-0.5">{t.when}</p>
                  <div>
                    <h3 className="text-[19px] font-semibold leading-snug">{t.title}</h3>
                    <p className="vs-body mt-1.5">{t.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section>
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">What a month looks like.</h2>
              <p className="vs-body mt-4">
                Each green mark is one piece of work going out. You can count what you paid for.
              </p>
            </div>
            <MonthView />
          </div>
        </div>
      </section>

      <DashboardProof />

      <section>
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">What I need from you.</h2>
              <p className="vs-body mt-4">
                About 30 minutes in total at the start. After that, only what you feel like giving.
              </p>
            </div>
            <div className="vs-table-wrap">
              <table className="vs-table vs-table-stack">
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    <th scope="col">What I need</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="font-semibold">Every plan</th>
                    <td className="text-moss">The 20-minute onboarding form.</td>
                  </tr>
                  {SERVICES.map((s) => (
                    <tr key={s.id}>
                      <th scope="row" className="font-semibold whitespace-nowrap">{s.name}</th>
                      <td className="text-moss">{s.needs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="vs-rule">
        <div className="vs-container vs-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 className="vs-h2">Changing or cancelling.</h2>
            </div>
            <div className="grid gap-4 vs-body text-[17.5px]">
              <p>
                Add a service, drop one or pause, any month. Send one email. Adding a service has
                its own one-time setup fee. Dropping one costs nothing.
              </p>
              <p>
                If you cancel, work stops at the end of the month you&apos;ve paid for. Everything
                made for you stays yours, and you get back access to every account. There&apos;s no
                fee and no contract to get out of.
              </p>
              <p>
                <Link href="/pricing" className="vs-link">
                  See every price
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
