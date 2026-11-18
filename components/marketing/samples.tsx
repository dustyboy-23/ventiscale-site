// Sample work for a made-up business. Everything here is labelled as a
// sample: it shows the format and the standard, not a client result.
// The lawn care company does not exist. The report numbers are placeholders
// and say so on the card.

const BIZ = "Maple Street Lawn Care";

function Head({ kind }: { kind: string }) {
  return (
    <div className="vs-sample-head">
      <span className="font-semibold text-[15.5px]">{kind}</span>
      <span className="vs-sample-tag">Sample</span>
    </div>
  );
}

function PostSample() {
  return (
    <article className="vs-sample">
      <Head kind="Facebook post" />
      <div className="vs-sample-body">
        <div className="flex items-center gap-3">
          <span className="vs-sample-avatar" aria-hidden="true">MS</span>
          <div className="leading-tight">
            <p className="font-semibold text-[15.5px]">{BIZ}</p>
            <p className="vs-small text-[13.5px]">Tuesday, 7:30 am</p>
          </div>
        </div>
        <p className="mt-3.5 text-[16px] leading-[1.5]">
          First frost is about three weeks out. If you only do one thing for your lawn this fall,
          aerate it. It does more than another round of fertilizer, and here&apos;s why.
        </p>
        <div className="vs-sample-graphic mt-4">
          <p className="vs-sample-graphic-title">Aerate before the first frost.</p>
          <ul>
            <li>Roots get air and water</li>
            <li>New seed actually takes</li>
            <li>Greener lawn in spring</li>
          </ul>
          <p className="vs-sample-graphic-foot">{BIZ}</p>
        </div>
      </div>
    </article>
  );
}

function EmailSample() {
  return (
    <article className="vs-sample">
      <Head kind="Email campaign" />
      <div className="vs-sample-body">
        <dl className="vs-sample-meta">
          <div>
            <dt>From</dt>
            <dd>{BIZ}</dd>
          </div>
          <div>
            <dt>Subject</dt>
            <dd className="font-semibold text-evergreen">Your lawn&apos;s last job before winter</dd>
          </div>
        </dl>
        <div className="mt-4 grid gap-3 text-[16px] leading-[1.55]">
          <p>Hi Sam,</p>
          <p>
            The ground is still soft and the grass is still growing. That makes the next three
            weeks the best time all year to aerate.
          </p>
          <p>
            We&apos;re in your neighbourhood on the 14th and 15th. It takes about 40 minutes and
            you don&apos;t need to be home.
          </p>
        </div>
        <span className="vs-sample-button mt-5">Book my aeration</span>
      </div>
    </article>
  );
}

function ArticleSample() {
  return (
    <article className="vs-sample">
      <Head kind="Blog article" />
      <div className="vs-sample-body">
        <p className="vs-small text-[13.5px]">Written for the search: &quot;when to aerate lawn&quot;</p>
        <h3 className="vs-h3 mt-2.5">When should you aerate your lawn? A month-by-month answer</h3>
        <p className="mt-3 text-[16px] leading-[1.55]">
          Short answer: early fall for cool-season grass, late spring for warm-season grass.
          Aerate when the grass is growing fastest, so it fills the holes back in within a few
          weeks.
        </p>
        <p className="vs-small mt-4 font-semibold text-evergreen">In this article</p>
        <ul className="vs-small mt-1.5 grid gap-1 list-disc pl-5">
          <li>How to tell which grass you have</li>
          <li>The two-week window that matters most</li>
          <li>What to do in the first week after</li>
        </ul>
      </div>
    </article>
  );
}

function ReportSample() {
  const rows: [string, string][] = [
    ["Calls from Google", "14"],
    ["Quote requests from the website", "6"],
    ["People who saw your posts", "3,200"],
    ["Emails opened", "41%"],
  ];
  return (
    <article className="vs-sample">
      <Head kind="Monthly report" />
      <div className="vs-sample-body">
        <p className="font-semibold text-[15.5px]">October, in plain numbers</p>
        <dl className="mt-3 grid gap-2.5">
          {rows.map(([k, v]) => (
            <div key={k} className="vs-leader-row text-[16px]">
              <dt>{k}</dt>
              <span className="vs-leader" aria-hidden="true" />
              <dd className="vs-num">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[16px] leading-[1.5]">
          <span className="font-semibold">Changing next month:</span> two articles on snow
          clearing, and the spring booking email goes out early.
        </p>
        <p className="vs-small mt-4 text-[13.5px]">
          Layout only. These numbers are placeholders, not anyone&apos;s results.
        </p>
      </div>
    </article>
  );
}

export function SampleWork() {
  return (
    <>
      <div className="vs-samples" role="list" aria-label="Sample work">
        <div role="listitem"><PostSample /></div>
        <div role="listitem"><EmailSample /></div>
        <div role="listitem"><ArticleSample /></div>
        <div role="listitem"><ReportSample /></div>
      </div>
      <p className="vs-small mt-3 md:hidden">Swipe to see all four.</p>
    </>
  );
}
