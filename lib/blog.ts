export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  author: string;
  readTime: string;
  tags: string[];
  image: string; // path relative to /public, e.g. "/blog/hero.jpg"
}

export const posts: BlogPost[] = [
  {
    slug: "social-media-for-ecommerce-brands",
    title: "Most ecommerce brands post on social media wrong. Here's what actually works.",
    description:
      "You're posting product photos and wondering why nobody cares. The fix isn't more posts. It's better ones.",
    date: "2026-04-12",
    author: "Dustin Gilmour",
    readTime: "6 min",
    tags: ["ecommerce", "social media"],
    image: "/blog/ecommerce-social.jpg",
  },
  {
    slug: "why-coaches-need-social-media",
    title: "If you're a coach with no social media presence, you're invisible.",
    description:
      "Your next client is scrolling right now. If they can't find you, they'll find someone else.",
    date: "2026-04-12",
    author: "Dustin Gilmour",
    readTime: "6 min",
    tags: ["coaches", "social media"],
    image: "/blog/coaches-social.jpg",
  },
  {
    slug: "contractors-getting-clients-online",
    title: "You're a great contractor. Nobody knows it. Let's fix that.",
    description:
      "Most contractors get work from referrals. That's fine until it's not. Here's how to stop relying on word of mouth alone.",
    date: "2026-04-12",
    author: "Dustin Gilmour",
    readTime: "6 min",
    tags: ["contractors", "home services", "local business"],
    image: "/blog/contractors-online.jpg",
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
    slug: "ai-cutting-marketing-costs",
    title: "How AI is cutting marketing costs by 60% for small businesses in 2026",
    description:
      "AI marketing tools cut small business costs by 40-60%. Real numbers on where the savings come from and how to capture them.",
    date: "2026-04-13",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["AI marketing", "small business", "cost savings"],
    image: "/blog/ai-marketing-costs.jpg",
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
    slug: "best-marketing-strategy-for-coaches",
    title: "The best marketing strategy for online coaches in 2026",
    description:
      "The exact marketing playbook online coaches use to get consistent clients in 2026. Content, email, social, and when to outsource.",
    date: "2026-04-15",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["coaches", "marketing strategy", "online coaching"],
    image: "/blog/coaches-marketing-strategy.jpg",
  },
  {
    slug: "ecommerce-marketing-compete-with-amazon",
    title: "Ecommerce marketing in 2026: what small brands need to compete",
    description:
      "Small ecommerce brands don't need Amazon's budget. They need smarter systems. Here's the lean playbook that actually works in 2026.",
    date: "2026-04-15",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "marketing strategy", "AI marketing", "small business"],
    image: "/blog/ecommerce-compete.jpg",
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
    slug: "abandoned-cart-email-sequence",
    title:
      "Your abandoned cart emails leave money on the table. Here's the 3-email sequence that recovers 18%.",
    description:
      "70% of ecommerce carts get abandoned. Most brands send one weak email and quit. Here's the 3-email arc with timing, subject lines, and exact copy that recovers 10-30% of lost revenue.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "abandoned cart", "Klaviyo", "Shopify"],
    image: "/blog/abandoned-cart-sequence.jpg",
  },
  {
    slug: "venti-scale-vs-traditional-agency",
    title:
      "Venti Scale vs a traditional marketing agency: which one fits your stage in 2026?",
    description:
      "12-dimension comparison between an AI-powered done-for-you service (Venti Scale) and a traditional marketing agency. Honest breakdown including where agencies still win.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "9 min",
    tags: ["agency comparison", "DFY marketing", "marketing services"],
    image: "/blog/venti-scale-vs-agency.jpg",
  },
  {
    slug: "ai-marketing-service-vs-marketing-manager",
    title:
      "AI marketing service vs hiring a marketing manager: the real math for 2026",
    description:
      "$95,000 marketing manager salary vs $1,800/month AI marketing service. Output comparison, time-to-productivity, hidden costs, and which one wins at each revenue tier.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["hiring", "marketing manager", "AI marketing service"],
    image: "/blog/ai-service-vs-manager.jpg",
  },
  {
    slug: "custom-ai-vs-chatgpt-for-marketing",
    title:
      "Custom AI vs ChatGPT for marketing: why the same model produces wildly different output",
    description:
      "ChatGPT and a brand-trained Custom AI use the same underlying model. The output quality difference is enormous. Here's exactly why, with examples.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["AI marketing", "Custom AI", "ChatGPT", "brand voice"],
    image: "/blog/custom-ai-vs-chatgpt.jpg",
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
    slug: "month-to-month-vs-retainer-marketing",
    title:
      "Month-to-month vs retainer marketing services: why contract structure tells you everything",
    description:
      "Long marketing contracts exist because services are afraid you'll leave. Here's why month-to-month is the standard for 2026 and what contract length actually predicts about service quality.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["contracts", "marketing services", "agency comparison"],
    image: "/blog/month-to-month-vs-retainer.jpg",
  },
  {
    slug: "shopify-marketing-strategy-2026",
    title: "The Shopify marketing strategy that actually works in 2026",
    description:
      "Most Shopify marketing strategies stop at one channel. Here's the 4-layer stack top ecommerce brands use to actually compound revenue.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["shopify", "ecommerce", "marketing strategy", "email marketing"],
    image: "/blog/shopify-marketing-strategy.jpg",
  },
  {
    slug: "ecommerce-email-marketing-flows",
    title:
      "Ecommerce email marketing: the 5 flows that print money on autopilot",
    description:
      "Most ecommerce stores send campaigns. Smart ones run flows. The 5 automated sequences responsible for 31% of ecommerce email revenue.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "email marketing", "Klaviyo", "automation", "Shopify"],
    image: "/blog/ecommerce-email-flows.jpg",
  },
  {
    slug: "shopify-seo-checklist",
    title:
      "Shopify SEO checklist: 14 things to fix before you spend a dollar on ads",
    description:
      "78% of Shopify stores have missing or duplicate title tags. Here are the 14 SEO fixes that unlock free organic traffic before you touch your ad budget.",
    date: "2026-04-29",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["shopify", "ecommerce", "SEO", "technical SEO", "organic traffic"],
    image: "/blog/shopify-seo-checklist.jpg",
  },
  {
    slug: "get-more-shopify-reviews",
    title: "How to get more Shopify reviews without sounding desperate",
    description:
      "93% of shoppers read reviews before buying. Here's how to get more Shopify reviews with the right timing, subject lines, and incentive frameworks.",
    date: "2026-04-30",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["shopify", "ecommerce", "reviews", "social proof", "conversion"],
    image: "/blog/shopify-reviews.jpg",
  },
  {
    slug: "ecommerce-content-marketing",
    title:
      "Ecommerce content marketing: what to publish when you sell physical products",
    description:
      "Content marketing generates 3x more leads than paid ads at 62% lower cost. Here's exactly what to publish when you sell physical products.",
    date: "2026-04-30",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "content marketing",
      "social media",
      "SEO",
      "content strategy",
    ],
    image: "/blog/ecommerce-content-marketing.jpg",
  },
  {
    slug: "retention-vs-acquisition-ecommerce",
    title:
      "Retention vs acquisition: where ecommerce founders waste the most money",
    description:
      "CAC is up 40-60% since 2023. Acquiring a new customer costs 5x more than keeping one. Here's the LTV/CAC math that changes how you budget.",
    date: "2026-04-30",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "ecommerce",
      "retention",
      "customer acquisition",
      "LTV",
      "growth strategy",
    ],
    image: "/blog/retention-vs-acquisition.jpg",
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
    slug: "ecommerce-welcome-email-series",
    title:
      "The ecommerce welcome email series that turns subscribers into buyers",
    description:
      "Welcome emails average 83% open rates. Here's the ecommerce welcome email series: 5 emails with subject lines, timing, and benchmarks that turn subscribers into buyers.",
    date: "2026-05-01",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "email marketing",
      "welcome series",
      "Klaviyo",
      "automation",
    ],
    image: "/blog/ecommerce-welcome-email.jpg",
  },
  {
    slug: "shopify-analytics-what-to-track",
    title:
      "Shopify analytics: the 7 numbers that actually matter (ignore the rest)",
    description:
      "Your Shopify dashboard has dozens of metrics. Here are the 7 Shopify analytics numbers small stores actually track to make money decisions.",
    date: "2026-05-01",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "shopify",
      "ecommerce",
      "analytics",
      "conversion rate",
      "growth strategy",
    ],
    image: "/blog/shopify-analytics-numbers.jpg",
  },
  {
    slug: "ecommerce-homepage-conversion",
    title:
      "Why your ecommerce homepage isn't converting (and what to fix first)",
    description:
      "Average ecommerce conversion rate is 1.8–3%. Top Shopify stores hit 4.4%+. Here are the 5 homepage problems killing your conversions and how to fix them.",
    date: "2026-05-02",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "ecommerce",
      "conversion rate",
      "CRO",
      "shopify",
      "homepage optimization",
    ],
    image: "/blog/ecommerce-homepage-conversion.jpg",
  },
  {
    slug: "tiktok-for-ecommerce-brands",
    title:
      "TikTok for ecommerce brands: what works in 2026 (and what's already dead)",
    description:
      "TikTok moves $112B in commerce this year. Here's what content formats work for ecommerce brands in 2026, what's dead, and why your attribution is wrong.",
    date: "2026-05-02",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "TikTok",
      "social media",
      "content strategy",
      "TikTok Shop",
    ],
    image: "/blog/tiktok-ecommerce-brands.jpg",
  },
  {
    slug: "instagram-reels-for-shopify",
    title: "Instagram Reels for Shopify: the only 4 formats worth shooting",
    description:
      "Most Shopify brands waste time on Reels that never convert. The 4 formats that actually drive sales: product demo, founder story, UGC, and before/after.",
    date: "2026-05-03",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "ecommerce",
      "Instagram",
      "Shopify",
      "social media",
      "content strategy",
    ],
    image: "/blog/instagram-reels-shopify.jpg",
  },
  {
    slug: "youtube-ecommerce-small-brand",
    title:
      "Should small ecommerce brands be on YouTube? Here's the honest math.",
    description:
      "YouTube delivers $4.80 per $1 spent. For ecommerce small brands, the ROI depends on your AOV, product type, and whether you can sustain it for 12 months.",
    date: "2026-05-03",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "ecommerce",
      "YouTube",
      "video marketing",
      "content strategy",
      "channel strategy",
    ],
    image: "/blog/youtube-ecommerce-small-brand.jpg",
  },
  {
    slug: "first-1000-shopify-customers",
    title:
      "How to get your first 1,000 Shopify customers (without burning $10k on ads)",
    description:
      "Paid ads cost $68-84 per customer. Your first 1,000 would run $80k that way. Here's the 4-channel mix that works on a real budget.",
    date: "2026-05-03",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "shopify",
      "ecommerce",
      "customer acquisition",
      "growth strategy",
      "email marketing",
    ],
    image: "/blog/first-1000-shopify-customers.jpg",
  },
  {
    slug: "ecommerce-product-page-mistakes",
    title:
      "9 product page mistakes killing your ecommerce conversion rate",
    description:
      "The average Shopify store converts 1.4% of visitors. Top stores hit 4.7%. That gap lives almost entirely on your product page. Here are the 9 fixable mistakes.",
    date: "2026-05-04",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "conversion rate",
      "CRO",
      "shopify",
      "product page",
    ],
    image: "/blog/ecommerce-product-page-mistakes.jpg",
  },
  {
    slug: "how-ai-marketing-actually-works",
    title: "How AI marketing actually works (without the hype)",
    description:
      "84% of ecommerce brands call AI their top priority. Most can't explain what it does. Here's the real stack: training, generation, review — no buzzwords.",
    date: "2026-05-04",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["AI marketing", "how AI works", "ecommerce", "marketing technology"],
    image: "/blog/how-ai-marketing-works.jpg",
  },
  {
    slug: "chatgpt-vs-custom-ai-marketing",
    title: "ChatGPT vs a custom AI: which one actually does your marketing?",
    description:
      "71% of marketers use ChatGPT. Most hate how generic the output sounds. Honest comparison: ChatGPT vs a brand-trained custom AI for ecommerce marketing.",
    date: "2026-05-04",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["AI marketing", "ChatGPT", "custom AI", "ecommerce", "marketing tools"],
    image: "/blog/chatgpt-vs-custom-ai.jpg",
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
    slug: "ai-content-vs-human-written",
    title:
      "AI content vs human-written content: where the line actually is in 2026",
    description:
      "Human content is 8x more likely to rank #1. AI social posts outperform humans in engagement. Here's where each one actually wins.",
    date: "2026-05-05",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["AI marketing", "content strategy", "SEO", "ecommerce", "content marketing"],
    image: "/blog/ai-content-vs-human.jpg",
  },
  {
    slug: "ai-product-descriptions-shopify",
    title:
      "AI product descriptions for Shopify: how to do it without sounding like everyone else",
    description:
      "47% of Shopify brands use AI for product descriptions. Most get the same generic copy. Here's how to train AI on your actual brand voice so yours don't blend in.",
    date: "2026-05-05",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["shopify", "ecommerce", "AI marketing", "product descriptions", "brand voice"],
    image: "/blog/ai-product-descriptions.jpg",
  },
  {
    slug: "ai-customer-segmentation-small-business",
    title:
      "AI customer segmentation for small ecommerce brands (you don't need 100k customers)",
    description:
      "AI customer segmentation works at 500 customers, not 500,000. Here's what to segment, which flows move money, and tools that don't need a data team.",
    date: "2026-05-06",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "AI marketing", "customer segmentation", "email marketing", "Klaviyo"],
    image: "/blog/ai-customer-segmentation.jpg",
  },
  {
    slug: "ai-seo-2026",
    title:
      "AI and SEO in 2026: what to actually do now that ChatGPT is the new search bar",
    description:
      "AI Overviews appear in 25% of Google searches. AI-referred visitors convert 23x higher than organic traffic. The GEO playbook for ecommerce brands.",
    date: "2026-05-06",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["SEO", "AI marketing", "GEO", "ecommerce", "AI search"],
    image: "/blog/ai-seo-2026.jpg",
  },
  {
    slug: "what-does-ai-marketing-cost",
    title:
      "What does AI marketing actually cost? (And why most pricing is dishonest)",
    description:
      "AI marketing costs $150/mo for a DIY tool stack to $10,000+/mo for a full-service agency. The honest breakdown by tier, no discovery call required.",
    date: "2026-05-06",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["AI marketing", "pricing", "marketing agency", "ecommerce", "small business"],
    image: "/blog/ai-marketing-cost.jpg",
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
  {
    slug: "signs-marketing-agency-gaslighting",
    title:
      "5 signs your marketing agency is gaslighting you (and the metrics that prove it)",
    description:
      "Your agency's report says everything is up. Your revenue says otherwise. Here are the 5 signs they're hiding behind vanity metrics.",
    date: "2026-05-08",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "marketing agency",
      "agency red flags",
      "done for you",
      "small business",
      "ecommerce",
    ],
    image: "/blog/agency-gaslighting.jpg",
  },
  {
    slug: "how-to-evaluate-marketing-roi-ecommerce",
    title: "How to actually evaluate marketing ROI for an ecommerce brand",
    description:
      "ROAS lies. Here are the 4 numbers ecommerce founders need: MER, contribution margin, LTV:CAC, and payback period. Plus why most agencies hide them.",
    date: "2026-05-08",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "marketing ROI", "analytics", "MER", "ROAS"],
    image: "/blog/marketing-roi-ecommerce.jpg",
  },
  {
    slug: "ecommerce-founder-marketing-burnout",
    title:
      "The marketing burnout that hits every ecommerce founder around month 9",
    description:
      "73% of ecommerce founders aren't sure their marketing is working. Most hit the wall at month 9. Here's why it happens and the three ways out.",
    date: "2026-05-09",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "founder burnout", "marketing", "done for you", "small business"],
    image: "/blog/ecommerce-founder-burnout.jpg",
  },
  {
    slug: "meta-advantage-plus-creative-volume",
    title:
      "Meta Advantage+ wants 1,000 creative variations. Your agency sends 10.",
    description:
      "Meta Advantage+ needs 300-1,000 ad creatives to optimize. Most agencies send 10 and charge $8K/month. Here's what the volume gap costs your ROAS.",
    date: "2026-05-09",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "Meta ads", "Advantage+", "paid ads", "AI marketing"],
    image: "/blog/meta-advantage-plus-creative.jpg",
  },
  {
    slug: "klaviyo-ai-autonomous-marketing-2026",
    title:
      "Klaviyo just launched autonomous email. Here's what ecommerce brands need to do now.",
    description:
      "Klaviyo's Spring 2026 drop ships 9 new AI features including Customer Agent and Smart Send Time per subscriber. Here's what changed and what to do about it.",
    date: "2026-05-10",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "Klaviyo", "AI marketing", "automation"],
    image: "/blog/klaviyo-ai-autonomous-marketing.jpg",
  },
  {
    slug: "ecommerce-cac-benchmarks-by-vertical",
    title:
      "Is your ecommerce CAC too high? The 2026 benchmarks by vertical.",
    description:
      "Fashion brands target $90-120 CAC. Beauty $90-130. Pet $68-90. If you don't know your vertical's benchmark, your agency can make any number look fine.",
    date: "2026-05-10",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "customer acquisition cost", "DTC", "paid media", "AI marketing"],
    image: "/blog/ecommerce-cac-benchmarks.jpg",
  },
  {
    slug: "ai-ad-creative-testing-ecommerce",
    title:
      "You're paying to test ad creatives. AI can predict the winners first.",
    description:
      "Most ecommerce brands burn $500-$2,000 per failed ad creative. AI pre-spend scoring tools now predict which ads win before you launch. Here's how.",
    date: "2026-05-11",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "paid ads", "AI marketing", "ad creative", "Meta ads"],
    image: "/blog/ai-ad-creative-testing.jpg",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
