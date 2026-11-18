export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD, set when a post is rewritten
  author: string;
  readTime: string;
  tags: string[];
  image: string; // path relative to /public, e.g. "/blog/hero.jpg"
}

export const posts: BlogPost[] = [
  {
    slug: "dtc-graveyard-50-brands-platform-dependency-2026",
    title:
      "50 DTC brands failed in 4 years. The pattern is what your agency is still running.",
    description:
      "76% of 50 failed DTC brands relied on one channel. 94% built no loyalty program. CAC rose 68%. The pattern is consistent. Your agency is still running it.",
    date: "2026-07-17",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "ecommerce",
      "DTC",
      "marketing agency",
      "platform dependency",
      "retention marketing",
      "paid social",
    ],
    image: "/blog/dtc-graveyard-platform-dependency.jpg",
  },
  {
    slug: "ai-product-search-ecommerce-2026",
    title:
      "Shoppers are asking ChatGPT what to buy. Most DTC brands don't show up.",
    description:
      "LLM-referred traffic converts at 2.47% — above Google Ads. ChatGPT, Perplexity, and Google AI Overviews are now product discovery engines. Most DTC brands are invisible in them.",
    date: "2026-07-10",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "AI marketing", "AI search", "ChatGPT", "product discovery", "GEO"],
    image: "/blog/ai-product-search-ecommerce.jpg",
  },
  {
    slug: "ecommerce-cac-by-vertical-2026",
    title:
      "Ecommerce CAC by vertical, 2026. Here's what you're actually paying.",
    description:
      "Ecommerce customer acquisition cost hit $68-$110 in 2026 depending on vertical. Beauty $110. Apparel $90. Pet $68-$90. Here's the full breakdown and what it means for your LTV math.",
    date: "2026-06-29",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "customer acquisition cost", "CAC", "LTV", "paid ads", "retention"],
    image: "/blog/ecommerce-cac-benchmarks.jpg",
  },
  {
    slug: "dtc-ad-spend-percentage-small-brands",
    title: "Small DTC brands spend 30% of revenue on ads. Here's why that math never works.",
    description:
      "Sub-$1M DTC brands burn 25-35% of revenue on performance ads that reset every month. Here's the math that keeps them stuck, and what winning brands do instead.",
    date: "2026-05-29",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "DTC", "paid ads", "ad spend", "owned channels"],
    image: "/blog/dtc-ad-spend-trap.jpg",
  },
  {
    slug: "what-done-for-you-marketing-includes",
    title: "What does done-for-you marketing actually include? (And what to watch out for)",
    description:
      "Done for you marketing for small business: real deliverables, real costs, and the red flags most owners miss.",
    date: "2026-04-13",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["done for you", "marketing services", "small business"],
    image: "/blog/done-for-you-marketing.jpg",
  },
  {
    slug: "what-ai-marketing-agency-does",
    title: "What an AI marketing agency actually does (it's not what you think)",
    description:
      "AI marketing agencies don't replace marketers. They combine AI execution with human strategy to run your whole marketing operation.",
    date: "2026-04-13",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["AI marketing", "marketing agency", "small business"],
    image: "/blog/ai-marketing-agency.jpg",
  },
  {
    slug: "done-for-you-marketing-vs-diy",
    title: "Done-for-you marketing vs. DIY: the real cost comparison for small businesses",
    description:
      "DIY marketing costs more than you think. Side-by-side breakdown of done for you marketing vs DIY for small businesses.",
    date: "2026-04-14",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["done for you", "DIY marketing", "small business", "cost comparison"],
    image: "/blog/dfy-vs-diy-marketing.jpg",
  },
  {
    slug: "done-for-you-social-media-management",
    title: "Done-for-you social media management: what you get when you stop doing it yourself",
    description:
      "What a month of done-for-you social media management looks like. Real deliverables, real costs, no fluff.",
    date: "2026-04-14",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["done for you", "social media management", "small business"],
    image: "/blog/dfy-social-media.jpg",
  },
  {
    slug: "marketing-agency-vs-in-house",
    title: "Marketing agency vs. hiring in-house: the real math for a small business",
    description:
      "A marketing hire costs $95K+ after benefits. An agency costs a fraction. Here's the real cost breakdown.",
    date: "2026-04-15",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["marketing agency", "in-house marketing", "small business", "cost comparison"],
    image: "/blog/agency-vs-inhouse.jpg",
  },
  {
    slug: "marketing-automation-small-business-guide",
    title: "Marketing automation for small business: the 2026 starter guide",
    description:
      "45% of small businesses have marketing automation. Most aren't using it right. Here's what to automate, in what order, and what it really costs.",
    date: "2026-04-16",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["marketing automation", "small business", "email marketing", "tools"],
    image: "/blog/marketing-automation-guide.jpg",
  },
  {
    slug: "how-coaches-get-more-clients",
    title: "How to get more clients as a coach (without cold DMs or paid ads)",
    description:
      "How to get more clients as a coach in 2026. The organic playbook that fills your calendar without ads or cold outreach.",
    date: "2026-04-16",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["coaches", "client acquisition", "organic marketing"],
    image: "/blog/coaches-get-clients.jpg",
  },
  {
    slug: "contractors-getting-more-leads",
    title: "5 ways contractors are getting more leads in 2026 (that most miss)",
    description:
      "5 proven ways contractors get more leads in 2026. Google Business, reviews, local SEO, social proof. Real tactics, not generic advice.",
    date: "2026-04-16",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["contractors", "lead generation", "local SEO", "home services"],
    image: "/blog/contractors-getting-more-leads.jpg",
  },
  {
    slug: "ecommerce-customers-without-ad-budget",
    title: "How small ecommerce brands are getting customers without blowing their ad budget",
    description:
      "Ad costs up 40% since 2023. Here's how small ecommerce brands get more customers without burning cash on paid ads.",
    date: "2026-04-17",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "customer acquisition", "organic marketing", "small business"],
    image: "/blog/ecommerce-no-ads.jpg",
  },
  {
    slug: "signs-you-should-stop-diy-marketing",
    title: "5 signs you should stop DIY-ing your marketing (and what to do instead)",
    description:
      "Should you outsource your marketing? These 5 signs mean it's time to stop doing it yourself and let someone else drive results.",
    date: "2026-04-17",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["outsourcing", "DIY marketing", "small business", "marketing strategy"],
    image: "/blog/stop-diy-marketing.jpg",
  },
  {
    slug: "automate-social-media-without-losing-voice",
    title: "How to automate your social media without losing your brand voice",
    description:
      "83% of teams automate social posting. Most sound like robots. Here's how to automate social media for small business and still sound human.",
    date: "2026-04-17",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["social media", "automation", "brand voice", "small business"],
    image: "/blog/automate-social-media.jpg",
  },
  {
    slug: "do-i-need-a-social-media-manager",
    title: "Do I need a social media manager? 7 questions to ask yourself first",
    description:
      "Do I need a social media manager? These 7 questions will tell you. If 3+ answers are yes, it's time.",
    date: "2026-04-18",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["social media", "hiring", "small business", "outsourcing"],
    image: "/blog/social-media-manager.jpg",
  },
  {
    slug: "when-to-hire-a-marketing-agency",
    title: "When is the right time to hire a marketing agency? (A brutally honest guide)",
    description:
      "When to hire a marketing agency: concrete revenue and time benchmarks that tell you it's time. No vague advice.",
    date: "2026-04-18",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["marketing agency", "outsourcing", "small business", "strategy"],
    image: "/blog/when-to-hire-agency.jpg",
  },
  {
    slug: "social-media-marketing-cost",
    title: "How much does social media marketing really cost in 2026? (Honest numbers)",
    description:
      "Honest numbers on social media marketing cost for small business in 2026. Freelancers, agencies, in-house, and what you actually get at each tier.",
    date: "2026-04-18",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["social media", "pricing", "small business", "marketing budget"],
    image: "/blog/social-media-marketing-cost.jpg",
  },
  {
    slug: "small-business-marketing-budget-template",
    title: "What should a small business marketing budget look like?",
    description:
      "A real small business marketing budget template for 2026. How much to spend, where to put it, and what to cut first when money is tight.",
    date: "2026-04-19",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["marketing budget", "small business", "planning", "strategy"],
    image: "/blog/marketing-budget-template.jpg",
  },
  {
    slug: "which-social-media-platform-for-business",
    title: "Which social media platform should your small business actually focus on?",
    description:
      "Stop trying to be on every platform. Here's how to pick the best social media platform for your small business based on who you serve.",
    date: "2026-04-19",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["social media", "platform strategy", "small business", "decision framework"],
    image: "/blog/which-platform-business.jpg",
  },
  {
    slug: "facebook-marketing-small-business-2026",
    title: "Facebook marketing for small business in 2026: is it still worth it?",
    description:
      "3 billion people still use Facebook. Here's what actually works for small business marketing in 2026, and what quietly stopped working.",
    date: "2026-04-19",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["Facebook", "social media", "small business", "paid ads"],
    image: "/blog/facebook-marketing.jpg",
  },
  {
    slug: "grow-business-instagram-2026",
    title: "How to grow your business on Instagram in 2026 (without spending 4 hours a day)",
    description:
      "3 billion people use Instagram monthly. Here's how to grow your business on Instagram in 2026 without it eating your entire week.",
    date: "2026-04-20",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["Instagram", "social media", "small business", "content strategy"],
    image: "/blog/grow-instagram-2026.jpg",
  },
  {
    slug: "only-social-media-strategy-you-need",
    title: "The only social media strategy a small business needs in 2026",
    description:
      "Stop chasing 47-step frameworks. Here's the only social media strategy for small business that actually works in 2026.",
    date: "2026-04-20",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["social media", "strategy", "small business", "framework"],
    image: "/blog/only-social-media-strategy.jpg",
  },
  {
    slug: "small-business-marketing-mistakes",
    title: "7 marketing mistakes small businesses make (that keep them invisible online)",
    description:
      "7 common small business marketing mistakes keeping you invisible online in 2026, and what to do instead.",
    date: "2026-04-20",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["small business", "marketing mistakes", "social media", "strategy"],
    image: "/blog/small-business-marketing-mistakes.jpg",
  },
  {
    slug: "ai-replace-marketing-team",
    title: "Can AI replace your marketing team? Here's what actually happens",
    description:
      "AI handles 65% of marketing execution tasks already. Here's what it replaces, what it can't, and what it means for small businesses in 2026.",
    date: "2026-04-21",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["AI marketing", "marketing team", "small business", "strategy"],
    image: "/blog/ai-replace-marketing-team.jpg",
  },
  {
    slug: "content-calendar-that-drives-sales",
    title: "How to create a content calendar that actually drives sales (not just likes)",
    description:
      "A content calendar for small business isn't a to-do list. Here's the 4-part system that connects your posts to real sales goals.",
    date: "2026-04-21",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["content calendar", "content strategy", "small business", "planning"],
    image: "/blog/content-calendar-small-business.jpg",
  },
  {
    slug: "email-marketing-vs-social-media",
    title: "Email marketing vs. social media: where should a small business spend its time?",
    description:
      "Email delivers $42 for every $1 spent. Social organic reach is 2-5%. Here's the honest breakdown of where your time actually pays off.",
    date: "2026-04-21",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["email marketing", "social media", "small business", "marketing strategy"],
    image: "/blog/email-vs-social.jpg",
  },
  {
    slug: "local-seo-for-contractors",
    title: "Local SEO for contractors: how to show up when homeowners search",
    description:
      "46% of Google searches have local intent. If you're not in the top 3 results, homeowners never find you. Step-by-step local SEO guide for contractors.",
    date: "2026-04-22",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["contractors", "local SEO", "Google Business Profile", "home services"],
    image: "/blog/local-seo-contractors.jpg",
  },
  {
    slug: "dfy-marketing-vs-upwork-freelancers",
    title:
      "Done-for-you marketing vs Upwork freelancers: which one actually saves you time?",
    description:
      "Hiring Upwork or Fiverr freelancers seems cheaper than DFY services. Then you spend 10 hours a week coordinating them. Here's the honest math on which option saves real time, not just dollars.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["freelancers", "DFY marketing", "Upwork", "marketing services"],
    image: "/blog/dfy-vs-freelancers.jpg",
  },
  {
    slug: "how-much-ecommerce-marketing-budget",
    title: "How much should ecommerce brands actually spend on marketing?",
    description:
      "Revenue-tier breakdown: what $5K, $50K, and $200K/month ecommerce brands should spend on marketing, and where the money should go.",
    date: "2026-05-01",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "marketing budget",
      "paid ads",
      "email marketing",
      "growth strategy",
    ],
    image: "/blog/ecommerce-marketing-budget.jpg",
  },
  {
    slug: "ai-tools-ecommerce-marketing",
    title: "The AI marketing tools ecommerce brands are actually using in 2026",
    description:
      "Honest breakdown of Klaviyo AI, Shopify Magic, Postscript, and Triple Whale by revenue tier. What to use at $50k, $200k, and beyond.",
    date: "2026-05-05",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["AI marketing", "ecommerce", "Klaviyo", "Shopify", "marketing tools"],
    image: "/blog/ai-ecommerce-tools.jpg",
  },
  {
    slug: "marketing-agency-red-flags",
    title:
      "11 marketing agency red flags every founder should know before signing",
    description:
      "Most agency contracts protect the agency, not you. Here are the 11 red flags to check before you sign anything.",
    date: "2026-05-07",
    author: "Dustin Gilmour",
    readTime: "9 min",
    tags: ["marketing agency", "agency red flags", "done for you", "small business", "ecommerce"],
    image: "/blog/marketing-agency-red-flags.jpg",
  },
  {
    slug: "how-to-switch-marketing-agencies",
    title: "How to switch marketing agencies without breaking your business",
    description:
      "Asset retrieval, contract review, knowledge transfer, transition timeline. The tactical playbook for switching marketing agencies without losing momentum.",
    date: "2026-05-07",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["marketing agency", "agency transition", "done for you", "small business", "contracts"],
    image: "/blog/switch-marketing-agencies.jpg",
  },
  {
    slug: "month-to-month-marketing-services",
    title:
      "Month-to-month marketing services: who actually offers them and why most don't",
    description:
      "The average agency retainer costs $3,500/month on a 12-month lock-in. Here's why most agencies won't go month-to-month, and who does.",
    date: "2026-05-07",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "marketing agency",
      "month to month",
      "done for you",
      "small business",
      "contracts",
    ],
    image: "/blog/month-to-month-marketing.jpg",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.updated ?? b.date).getTime() - new Date(a.updated ?? a.date).getTime(),
  );
}

export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
