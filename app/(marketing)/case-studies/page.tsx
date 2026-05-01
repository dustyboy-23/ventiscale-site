import Link from "next/link";
import { Eyebrow } from "@/components/marketing/eyebrow";

const SITE_URL = "https://www.ventiscale.com";

export const metadata = {
  title: "Case studies | Venti Scale",
  description:
    "Real results from Venti Scale clients. Specific revenue numbers, what we shipped, what changed.",
  alternates: { canonical: `${SITE_URL}/case-studies` },
  openGraph: {
    title: "Case studies | Venti Scale",
    description:
      "Real results from Venti Scale clients. Specific revenue numbers, what we shipped, what changed.",
    url: `${SITE_URL}/case-studies`,
    type: "website",
  },
};

const CASE_STUDIES = [
  {
    slug: "home-services-client-1",
    title: "Home services client: from dead Facebook page to 4-post-a-day automated operation",
    subtitle: "B2C home services, $2K MRR baseline → live multi-channel pipeline in 14 days",
    metrics: ["13 LinkedIn posts queued", "14-day FB photo campaign live", "Real-time portal"],
    industry: "Home services",
  },
];

export default function CaseStudiesIndex() {
  return (
    <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <Link
        href="/"
        className="text-[13px] font-mono text-white/40 hover:text-white/60 transition-colors"
      >
        &larr; Back to home
      </Link>

      <div className="mt-8 mb-10">
        <Eyebrow>CASE STUDIES</Eyebrow>
        <h1 className="font-display text-[36px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
          Real results, real numbers, no vanity metrics
        </h1>
        <p className="text-[17px] text-white/65 leading-[1.55] max-w-[640px]">
          Every case study includes specific revenue, retention, or operational
          metrics. <em>Not impressions and follower counts.</em>
        </p>
      </div>

      <div className="space-y-6 mt-10">
        {CASE_STUDIES.map((cs) => (
          <Link
            key={cs.slug}
            href={`/case-studies/${cs.slug}`}
            className="block border border-white/10 rounded-md p-6 hover:border-white/20 transition-colors"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-3">
              {cs.industry}
            </div>
            <h2 className="font-display text-[22px] lg:text-[26px] leading-[1.15] text-white mb-2">
              {cs.title}
            </h2>
            <p className="text-[15px] text-white/60 mb-4">{cs.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              {cs.metrics.map((m) => (
                <span
                  key={m}
                  className="text-[12px] font-mono text-white/55 bg-white/[0.04] px-3 py-1 rounded"
                >
                  {m}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 prose-blog">
        <h2>More case studies coming</h2>
        <p>
          We&apos;re publishing case studies as clients give the green light
          to share specifics. The first one above is anonymized at the
          client&apos;s request.
        </p>
        <p>
          If you want to know whether a similar setup could work for your
          business, the audit is the fastest path. I&apos;ll tell you
          honestly whether your situation is a fit.
        </p>

        <div className="blog-cta">
          <h3>Audit your specific business</h3>
          <p>
            60-90 seconds. I review every submission personally and email
            back a custom plan within 2 business days.
          </p>
          <a href="/#audit">Get my free audit</a>
        </div>
      </div>
    </article>
  );
}
