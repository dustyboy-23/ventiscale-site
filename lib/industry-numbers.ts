// ─────────────────────────────────────────────────────────────────────────
// INDUSTRY NUMBERS: published third-party figures shown on the public site.
//
// Every figure below was read on its source page on 2026-11-18. If you change
// a number, re-read the source first. These are industry figures. Never word
// one as a Venti Scale result or as something a client will get.
// ─────────────────────────────────────────────────────────────────────────

import type { ServiceId } from "@/lib/pricing";

export interface IndustryNumber {
  figure: string;
  text: string;
  source: string;
  href: string;
}

const BACKLINKO = "https://backlinko.com/google-ctr-stats";
const AHREFS_PRICING = "https://ahrefs.com/blog/seo-pricing/";
const SPROUT = "https://sproutsocial.com/insights/social-media-consumer-behavior/";
const OMNISEND = "https://www.omnisend.com/resources/reports/2026ecommercemarketingreport/";
const BRIGHTLOCAL = "https://www.brightlocal.com/research/local-consumer-review-survey/";
const WORDSTREAM_GOOGLE = "https://www.wordstream.com/blog/2026-google-ads-benchmarks";
const WORDSTREAM_FACEBOOK = "https://www.wordstream.com/blog/facebook-ads-benchmarks-2025";
const WYZOWL = "https://wyzowl.com/video-marketing-statistics/";

const PAGE_TWO: IndustryNumber = {
  figure: "0.63%",
  text: "of Google searchers click on anything on the second page of results.",
  source: "Backlinko, 4 million search results",
  href: BACKLINKO,
};
const SOCIAL_BUYING: IndustryNumber = {
  figure: "76%",
  text: "of social media users say it influenced what they bought in the last six months.",
  source: "Sprout Social, Q2 2025 Pulse Survey",
  href: SPROUT,
};
const AUTOMATED_EMAIL: IndustryNumber = {
  figure: "30%",
  text: "of online stores' email revenue came from automated emails, just 2% of what they sent.",
  source: "Omnisend, 27 billion emails sent in 2025",
  href: OMNISEND,
};
const VIDEO_BUYING: IndustryNumber = {
  figure: "85%",
  text: "of people say a video has convinced them to buy a product or service.",
  source: "Wyzowl, State of Video Marketing 2026",
  href: WYZOWL,
};

export const SERVICE_NUMBERS: Record<ServiceId, IndustryNumber[]> = {
  seo: [
    {
      figure: "27.6%",
      text: "of searchers click the first organic result on Google.",
      source: "Backlinko, 4 million search results",
      href: BACKLINKO,
    },
    PAGE_TWO,
    {
      figure: "$3,209",
      text: "a month is what SEO agencies charge on average.",
      source: "Ahrefs, survey of 439 SEO providers",
      href: AHREFS_PRICING,
    },
  ],
  social: [
    SOCIAL_BUYING,
    {
      figure: "1 in 4",
      text: "people, nearly, now turn to social media for answers before anything else.",
      source: "Sprout Social, Q2 2025 Pulse Survey",
      href: SPROUT,
    },
    {
      figure: "63%",
      text: "of people would most like to learn about a product by watching a short video.",
      source: "Wyzowl, State of Video Marketing 2026",
      href: WYZOWL,
    },
  ],
  email: [
    AUTOMATED_EMAIL,
    {
      figure: "97%",
      text: "of consumers lean on reviews to guide what they buy, which is why the review request email matters.",
      source: "BrightLocal, Local Consumer Review Survey 2026",
      href: BRIGHTLOCAL,
    },
  ],
  ads: [
    {
      figure: "$66.69",
      text: "is the average cost per lead on Google Ads across industries.",
      source: "WordStream by LocaliQ, 2026 benchmarks",
      href: WORDSTREAM_GOOGLE,
    },
    {
      figure: "$5.42",
      text: "is the average cost per click on Google Ads across industries.",
      source: "WordStream by LocaliQ, 2026 benchmarks",
      href: WORDSTREAM_GOOGLE,
    },
    {
      figure: "$27.66",
      text: "is the average cost per lead on Facebook lead campaigns across industries.",
      source: "WordStream by LocaliQ, 2025 benchmarks",
      href: WORDSTREAM_FACEBOOK,
    },
  ],
  video: [
    VIDEO_BUYING,
    {
      figure: "63%",
      text: "of people would most like to learn about a product by watching a short video.",
      source: "Wyzowl, State of Video Marketing 2026",
      href: WYZOWL,
    },
    {
      figure: "91%",
      text: "of businesses now use video as a marketing tool.",
      source: "Wyzowl, State of Video Marketing 2026",
      href: WYZOWL,
    },
  ],
};

/** No prices here: the homepage keeps prices for the packages section. */
export const HOME_NUMBERS: IndustryNumber[] = [PAGE_TWO, SOCIAL_BUYING, AUTOMATED_EMAIL, VIDEO_BUYING];
