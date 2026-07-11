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
    slug: "dtc-blended-roas-ads-2026",
    title:
      "Your Meta ROAS looks great. Your blended ROAS is the problem.",
    description:
      "68% of DTC brands underestimate their real CAC by 20-40%. The reason: per-channel ROAS hides what you actually spend. Here's what blended ROAS shows instead.",
    date: "2026-07-11",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "DTC", "paid ads", "ROAS", "Meta ads", "Google ads", "AI marketing"],
    image: "/blog/dtc-blended-roas-ads.jpg",
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
    slug: "dtc-creative-volume-cac-2026",
    title:
      "Your DTC ads aren't failing because of targeting. They're failing because of volume.",
    description:
      "DTC brands ship 2-4 ad creatives per month when platforms need 30-50. CAC is up 40-60% and it's not a targeting problem. Here's the math.",
    date: "2026-07-09",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "paid ads", "ad creative", "CAC", "creative volume", "AI marketing"],
    image: "/blog/dtc-creative-volume-cac.jpg",
  },
  {
    slug: "klaviyo-channel-affinity-2026",
    title:
      "Klaviyo knows which channel your customer checks. Your agency is still guessing.",
    description:
      "Klaviyo's biggest AI release routes each subscriber's messages to their most responsive channel automatically. Here's what changed and what to do now.",
    date: "2026-07-08",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "Klaviyo", "AI marketing", "DTC", "retention", "SMS marketing"],
    image: "/blog/klaviyo-channel-affinity.jpg",
  },
  {
    slug: "ai-workflow-automation-roi-ecommerce-2026",
    title:
      "Ecommerce marketing automation pays 280% ROI. You're not running it.",
    description:
      "AI workflow automation returns 280-520% ROI in year 1 for ecommerce brands. 240 hours saved. Here's what to automate first and the math behind it.",
    date: "2026-07-07",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "marketing automation", "AI marketing", "email marketing", "ROI"],
    image: "/blog/ai-automation-roi-ecommerce.jpg",
  },
  {
    slug: "ai-marketing-agency",
    title:
      "What Is an AI Marketing Agency? A 2026 Buyer's Guide",
    description:
      "What an AI marketing agency actually does, what it costs, and how to spot a real one from a tool wearing the label. An honest, founder-written guide.",
    date: "2026-07-06",
    author: "Dustin Gilmour",
    readTime: "16 min",
    tags: ["AI Marketing", "Agencies"],
    image: "/blog/ai-marketing-agency.jpg",
  },
  {
    slug: "dtc-fired-marketing-team-ai-agents-2026",
    title:
      "He paid $15K/month for marketing. He fired his team. Profits tripled.",
    description:
      "One DTC founder paid $15K/month for a marketing team where emails took 3 days to write. He fired everyone. Replaced them with AI. Profits tripled in 3 months.",
    date: "2026-07-06",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "AI marketing", "marketing team", "done for you", "AI agents"],
    image: "/blog/dtc-fired-team-ai-2026.jpg",
  },
  {
    slug: "llm-traffic-ecommerce-conversion-2026",
    title:
      "Your ChatGPT traffic already wants to buy. Most stores never notice.",
    description:
      "ChatGPT, Perplexity, and Gemini are sending pre-qualified buyers straight to ecommerce stores. Here's why that traffic converts differently, and what gets a store cited.",
    date: "2026-07-05",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "AI marketing", "AI search", "LLM traffic", "ChatGPT", "ecommerce conversion"],
    image: "/blog/llm-traffic-ecommerce.jpg",
  },
  {
    slug: "dtc-positioning-creative-mismatch-cac-2026",
    title:
      "You keep testing new creative. Your positioning hasn't changed since 2022.",
    description:
      "Positioning-creative mismatch is the #1 driver of DTC CAC increases in 2026. Here's why swapping creatives doesn't fix a broken strategy, and what to do instead.",
    date: "2026-07-04",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "DTC", "positioning", "creative strategy", "CAC", "AI marketing"],
    image: "/blog/dtc-positioning-creative-mismatch.jpg",
  },
  {
    slug: "dtc-retention-revenue-2026",
    title:
      "You paid to acquire these customers. Your retention system is ignoring them.",
    description:
      "DTC brands leave 30-40% of retention revenue on the table. The tools aren't the problem. The system is. Here's how DTC retention marketing actually runs.",
    date: "2026-07-03",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "retention marketing", "email marketing", "Klaviyo", "AI marketing"],
    image: "/blog/dtc-retention-revenue.jpg",
  },
  {
    slug: "dtc-ai-creative-speed-2026",
    title:
      "48-hour creative is now the baseline. Agencies still take 8 days.",
    description:
      "AI-hybrid tools now deliver DTC creative in 48 hours at 20% of retainer cost. Traditional agencies average 8-10 days. That gap is your CAC problem.",
    date: "2026-07-02",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "AI marketing", "creative agency", "CAC", "marketing speed", "done for you"],
    image: "/blog/dtc-ai-creative-speed.jpg",
  },
  {
    slug: "dtc-replace-agency-ai-stack-2026",
    title:
      "Your agency charges $14,200/month for what AI does for $869.",
    description:
      "A $12M DTC brand switched from a $14,200/month agency to an $869/month AI stack. 8-10 day turnarounds dropped to 24 hours. Here's exactly what changed.",
    date: "2026-07-01",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "marketing agency", "AI marketing", "agency costs", "done for you"],
    image: "/blog/dtc-agency-ai-switch.jpg",
  },
  {
    slug: "meta-advantage-plus-roas-ecommerce-2026",
    title:
      "Meta Advantage+ is hitting 4.52x ROAS. Most ecommerce brands aren't using it.",
    description:
      "Meta Advantage+ hits 4.52:1 ROAS vs 1.86-2.19:1 for manually managed campaigns. DTC brands paying retainers are getting outperformed by Meta's own AI.",
    date: "2026-06-30",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "Meta ads", "Advantage+", "ROAS", "paid social", "AI marketing"],
    image: "/blog/meta-advantage-plus-roas.jpg",
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
    slug: "dtc-audience-saturation-creative-velocity-2026",
    title:
      "Your DTC ad audience burns out every 2 weeks. Here's how to stay ahead.",
    description:
      "Audience saturation kills DTC campaigns in 2-3 weeks. Average ecommerce CAC is $274, per Shopify. Creative velocity is the only fix that scales.",
    date: "2026-06-27",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "paid ads", "audience saturation", "creative velocity", "AI marketing", "Meta ads"],
    image: "/blog/dtc-audience-saturation.jpg",
  },
  {
    slug: "klaviyo-whatsapp-ecommerce-2026",
    title:
      "Klaviyo added WhatsApp. Most DTC brands haven't turned it on yet.",
    description:
      "Klaviyo's Customer Hub now runs automated brand-voice support on WhatsApp with 98% open rates. Here's what DTC brands need to set up before it gets crowded.",
    date: "2026-06-25",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "WhatsApp", "Klaviyo", "AI marketing", "DTC", "retention"],
    image: "/blog/klaviyo-whatsapp-ecommerce.jpg",
  },
  {
    slug: "ai-creative-beats-human-ads-ecommerce-2026",
    title:
      "AI-generated ads now outperform human creative. Here's the $100 AOV threshold.",
    description:
      "AI ad creative now matches or beats human work for ecommerce products under $100 AOV. Here's the Creatify, Predis.ai, AdCreative.ai benchmark.",
    date: "2026-06-22",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "paid ads", "AI marketing", "ad creative", "DTC", "Meta Advantage+"],
    image: "/blog/ai-creative-ecommerce-ads.jpg",
  },
  {
    slug: "meta-facebook-ai-mode-ecommerce-2026",
    title:
      "Facebook AI Mode launched. Most ecommerce brands have nothing worth reading.",
    description:
      "Meta AI Mode on Facebook pulls from public posts, Groups, and Reels. 34% of US purchases involve AI agents now. Here's what ecommerce brands need to fix.",
    date: "2026-06-21",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "AI marketing", "Facebook", "Meta AI", "content strategy", "DTC"],
    image: "/blog/facebook-ai-mode-ecommerce.jpg",
  },
  {
    slug: "meta-ai-ad-label-ecommerce-2026",
    title: "Meta flags AI ads now. Here's what ecommerce brands need to change.",
    description:
      "Meta auto-labels photorealistic AI imagery in ads as 'Made with AI.' Google followed March 5, 2026. Here's what DTC brands need to do about it.",
    date: "2026-06-19",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "Meta ads", "AI marketing", "paid ads", "DTC"],
    image: "/blog/meta-ai-ad-label-ecommerce.jpg",
  },
  {
    slug: "email-sms-roi-vs-meta-ads-dtc-2026",
    title: "Email returns $36 for every dollar. Meta returns $2. Your agency knows.",
    description:
      "Email marketing ROI hits $36-79 per dollar spent. Meta ROAS averages 2.18x. Most DTC brand budgets are built backwards.",
    date: "2026-06-17",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "DTC", "Meta ads", "marketing ROI", "SMS marketing"],
    image: "/blog/email-sms-roi-vs-meta-ads.jpg",
  },
  {
    slug: "ai-marketing-tool-price-war-2026",
    title: "AI marketing tools just got cheaper. Your agency didn't.",
    description:
      "Google cut its AI suite from $7.99 to $4.99/month. Marketing automation ROI hits $5.44 per $1 spent. Your agency retainer hasn't moved. Here's the math.",
    date: "2026-06-16",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "AI marketing", "marketing agency", "DTC", "marketing tools"],
    image: "/blog/ai-marketing-price-war.jpg",
  },
  {
    slug: "dtc-email-cac-vs-paid-acquisition-2026",
    title:
      "Shopify merchants spent $318 to get a customer. Email costs $12.",
    description:
      "Shopify merchant CAC hit $318 in 2026. Email acquires the same customer for $8-$15. Here's the acquisition math DTC brands need to run.",
    date: "2026-06-15",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "DTC", "customer acquisition cost", "email marketing", "paid ads"],
    image: "/blog/dtc-email-cac-paid.jpg",
  },
  {
    slug: "klaviyo-ai-composer-spring-2026",
    title:
      "Klaviyo just automated what your email agency charges $3K a month for",
    description:
      "Klaviyo Spring 2026 shipped AI Composer and Personalized Send Time (35% CTR lift). Here's what it means for ecommerce brands on email retainers.",
    date: "2026-06-14",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "Klaviyo", "AI marketing", "DTC", "agency"],
    image: "/blog/klaviyo-ai-composer-spring-2026.jpg",
  },
  {
    slug: "dtc-ai-pilot-failure-rate-2026",
    title:
      "85% of DTC AI pilots never ship. Here's why yours stalled.",
    description:
      "Only 15% of DTC AI marketing pilots reach production. Here are the 4 failure modes killing your AI investment before it ships.",
    date: "2026-06-13",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "AI marketing", "DTC", "marketing strategy", "AI tools"],
    image: "/blog/dtc-ai-pilot-failure.jpg",
  },
  {
    slug: "ugc-creative-dtc-lower-cac-2026",
    title:
      "UGC creative cuts CAC by 44%. Most DTC brands still can't make it work.",
    description:
      "DTC brands using UGC creative see 44% lower CAC and 2.3x higher CTR than polished brand shoots. Here's why most can't systemize it.",
    date: "2026-06-12",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "paid ads", "UGC", "Meta Advantage+", "DTC", "creative"],
    image: "/blog/ugc-creative-dtc.jpg",
  },
  {
    slug: "dtc-retention-tool-sprawl-2026",
    title:
      "You have the retention tools. You don't have the retention results.",
    description:
      "DTC brands spend 30-40% of their retention budget on software. Average repeat purchase rate sits at 25-30%. The tools aren't moving the number. Here's why.",
    date: "2026-06-09",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "retention marketing", "DTC", "Klaviyo", "email marketing"],
    image: "/blog/dtc-retention-tool-sprawl.jpg",
  },
  {
    slug: "shopify-ai-agent-store-management-2026",
    title:
      "One Shopify brand handed customer service to an AI agent. Sales jumped 111%.",
    description:
      "Klaviyo's Customer Agent drove 111% sales growth for a DTC brand. Manus launched a Shopify connector with 248 PH votes. Here's what Shopify AI agents actually do.",
    date: "2026-06-08",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "Shopify",
      "AI agents",
      "customer service",
      "Klaviyo",
    ],
    image: "/blog/shopify-ai-agent-store.jpg",
  },
  {
    slug: "ai-agents-ecommerce-buyability-2026",
    title:
      "AI agents are shopping your store. Most Shopify brands aren't ready.",
    description:
      "AI agents can now complete purchases on your Shopify store. Selltonomy AI Buyability scores your readiness. Here's what to fix before you miss the wave.",
    date: "2026-06-07",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "AI marketing", "AI agents", "Shopify", "DTC"],
    image: "/blog/ai-agents-ecommerce-shopping.jpg",
  },
  {
    slug: "marketing-dashboard-data-mirage-2026",
    title:
      "Your agency's dashboard shows green. Your revenue doesn't.",
    description:
      "26% of marketing budgets are wasted in 2026. Your marketing dashboard says green. Your revenue says otherwise. Here's what to actually track.",
    date: "2026-06-05",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "marketing ROI", "agency", "analytics", "DTC"],
    image: "/blog/marketing-dashboard-data-mirage.jpg",
  },
  {
    slug: "meta-advantage-plus-ai-video-ads-2026",
    title:
      "Your agency charges $3K per video. Meta AI makes them from photos.",
    description:
      "Meta Advantage+ generates video ads from product photos. Brands see 40% lower creative costs and 22% ROAS lift. Here's how to turn it on in 20 minutes.",
    date: "2026-06-04",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "Meta ads", "Advantage+", "AI marketing", "paid ads"],
    image: "/blog/meta-ai-video-ads-2026.jpg",
  },
  {
    slug: "tiktok-shop-dtc-agency-gap-2026",
    title:
      "TikTok Shop is DTC's fastest-growing channel. Your agency has never touched it.",
    description:
      "TikTok Shop moves $112 billion in US commerce in 2026. Most agencies still run Meta-first playbooks with zero TikTok Shop capability. Here's the cost.",
    date: "2026-06-03",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "TikTok Shop", "DTC", "TikTok", "AI marketing"],
    image: "/blog/tiktok-shop-ecommerce-2026.jpg",
  },
  {
    slug: "klaviyo-ai-product-recommendations-2026",
    title:
      "Klaviyo AI recs hit 3.75% CTR. Most brands have never turned them on.",
    description:
      "Klaviyo AI product recommendations average 3.75% CTR. Top performers hit 8.79%. Most Shopify brands have never activated them. Here's how to fix that.",
    date: "2026-06-02",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "Klaviyo", "AI marketing", "automation"],
    image: "/blog/klaviyo-ai-product-recs.jpg",
  },
  {
    slug: "ai-marketing-roi-vs-agency-retainer-2026",
    title:
      "AI marketing averages 171% ROI. Your agency retainer doesn't.",
    description:
      "74% of brands see positive AI marketing ROI within 12 months. Average return: 171%. Here's the math DTC founders aren't running on their agency retainers.",
    date: "2026-06-01",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "AI marketing", "marketing ROI", "agency retainer", "DTC"],
    image: "/blog/ai-marketing-roi-analytics.jpg",
  },
  {
    slug: "meta-attribution-broken-ios-shopify-2026",
    title:
      "Meta inflates your ROAS by 40%. Here's what's actually happening.",
    description:
      "Meta's attribution gaps now run 40-70% for most Shopify brands. Here's why your dashboards never agree, what changed in January 2026, and how to find your real numbers.",
    date: "2026-05-31",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "Meta ads", "attribution", "ROAS", "paid ads"],
    image: "/blog/meta-attribution-roas-breakdown.jpg",
  },
  {
    slug: "dtc-marketing-execution-volume-2026",
    title:
      "Your DTC agency runs a 2022 playbook. Here's what 2026 needs.",
    description:
      "Agency playbooks built before LLMs can't produce the execution volume DTC brands need today. Here's the math and what actually replaces it.",
    date: "2026-05-30",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "DTC",
      "marketing agency",
      "AI marketing",
      "execution volume",
    ],
    image: "/blog/dtc-execution-gap-2026.jpg",
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
    slug: "google-shopping-vs-meta-ads-ecommerce-2026",
    title: "Your agency runs Meta. Google Shopping pays 3x more.",
    description:
      "Google Shopping delivers 5.17:1 ROAS in 2026. Meta delivers 1.86. Most agencies ignore this gap. Here's the real channel math and how to fix it.",
    date: "2026-05-28",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "paid ads", "Google Shopping", "Meta ads", "DTC"],
    image: "/blog/google-shopping-meta-roas.jpg",
  },
  {
    slug: "shopify-ai-discovery-chatgpt-2026",
    title:
      "Shopify's new channel is ChatGPT. Most stores aren't set up for it.",
    description:
      "AI-attributed orders on Shopify grew 15x since January 2025. Your products can now appear in ChatGPT and Google AI Mode. Most brands haven't set this up.",
    date: "2026-05-26",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["shopify", "ecommerce", "AI marketing", "ChatGPT", "AI discovery"],
    image: "/blog/shopify-ai-discovery.jpg",
  },
  {
    slug: "ecommerce-ai-adoption-gap-2026",
    title:
      "89% of ecommerce brands run AI marketing. Your agency doesn't.",
    description:
      "89% of retailers now run AI in their marketing operations. If your agency hasn't rebuilt around AI infrastructure, you're paying 2024 prices for 2024 outputs.",
    date: "2026-05-25",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: [
      "ecommerce",
      "AI marketing",
      "marketing agency",
      "DTC",
      "ecommerce marketing",
    ],
    image: "/blog/ecommerce-ai-adoption.jpg",
  },
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
      "Paid ads alone can run well into six figures to reach your first 1,000 customers. Here's the 4-channel mix that works on a real budget.",
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
  {
    slug: "ai-video-ads-without-creators",
    title:
      "You're spending $3,000 per video ad. These ecommerce brands aren't.",
    description:
      "AI video tools convert product pages into UGC-style ads in minutes. Brands save $3K per video and produce 50x more creative variations. Here's how.",
    date: "2026-05-11",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "paid ads", "AI marketing", "video ads", "TikTok"],
    image: "/blog/ai-video-ads-ecommerce.jpg",
  },
  {
    slug: "tiktok-ads-vs-facebook-ads-ecommerce-2026",
    title: "Your agency runs Facebook ads. TikTok is half the price.",
    description:
      "TikTok CPC: $0.50. Facebook CPC: $1.09. The gap costs ecommerce brands 4,500 clicks per $5K in ad spend. Here's why agencies still pick Facebook.",
    date: "2026-05-11",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "paid ads", "TikTok", "Facebook ads", "AI marketing"],
    image: "/blog/tiktok-vs-facebook-ads.jpg",
  },
  {
    slug: "chatgpt-ads-ecommerce-2026",
    title:
      "OpenAI opened ChatGPT ads to every brand. Here's what ecommerce founders need to know.",
    description:
      "ChatGPT self-serve ads launched in May 2026 with no minimum spend. Here's what ecommerce brands need to know before it gets crowded.",
    date: "2026-05-12",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "paid ads", "ChatGPT", "AI marketing", "advertising"],
    image: "/blog/chatgpt-ads-ecommerce.jpg",
  },
  {
    slug: "ai-agents-running-ad-campaigns-2026",
    title:
      "Every major ad platform just went AI-native. Your agency didn't.",
    description:
      "TikTok, Meta, and Google now let AI agents run your campaigns without a human touching Ads Manager. Here's what that means for your retainer.",
    date: "2026-05-14",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "paid ads", "AI marketing", "TikTok", "Meta Advantage+"],
    image: "/blog/ai-ad-agents-2026.jpg",
  },
  {
    slug: "email-paid-coordination-gap-ecommerce",
    title:
      "Your email and your Meta ads aren't talking. You're paying for it.",
    description:
      "Brands waste ad spend retargeting subscribers their next email would have converted. Connecting email and Meta data instead drives 25-35% higher ROAS. Here's how to fix the Klaviyo-Meta sync.",
    date: "2026-05-15",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "Meta ads", "Klaviyo", "paid ads"],
    image: "/blog/email-paid-coordination.jpg",
  },
  {
    slug: "dtc-marketing-agency-efficiency-gap",
    title:
      "Your DTC marketing budget has a 15% leak. Most agencies won't show you where.",
    description:
      "A 15% efficiency gap on $200K/month in DTC marketing spend costs $360K/year. Here's exactly where the money goes and how to close it.",
    date: "2026-05-16",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "DTC", "marketing agency", "marketing ROI", "AI marketing"],
    image: "/blog/dtc-efficiency-gap.jpg",
  },
  {
    slug: "dtc-roas-declining-channel-mix-2026",
    title:
      "ROAS is falling 10% a year. The DTC brands winning anyway run this stack.",
    description:
      "Blended ROAS is down 4-10% YoY on every paid channel. Here's the email-first, paid-second channel mix that top DTC brands use to grow anyway.",
    date: "2026-05-17",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "DTC", "paid ads", "email marketing", "marketing strategy"],
    image: "/blog/dtc-roas-channel-mix.jpg",
  },
  {
    slug: "ai-customer-service-ecommerce-2026",
    title:
      "Your store makes the sale. Your customer service loses the repeat order.",
    description:
      "65% of ecommerce revenue comes from repeat buyers. AI customer service prevents 85% of churn and pays back $3.50 per dollar invested. Here's the setup.",
    date: "2026-05-18",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "customer service", "AI marketing", "retention", "Klaviyo"],
    image: "/blog/ai-customer-service-ecommerce.jpg",
  },
  {
    slug: "shopify-sidekick-winter-2026",
    title:
      "Shopify just built the AI your agency charges $3,000 a month for.",
    description:
      "Shopify Winter '26 shipped Sidekick, Brand Voice Cloning, and native ChatGPT discoverability. Here's what that means for your agency relationship.",
    date: "2026-05-19",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["shopify", "ecommerce", "AI marketing", "Shopify Magic", "marketing agency"],
    image: "/blog/shopify-sidekick-winter-2026.jpg",
  },
  {
    slug: "klaviyo-meta-advantage-plus-seed-audience",
    title:
      "Meta Advantage+ gets 4.52x ROAS when you sync Klaviyo. Most brands aren't.",
    description:
      "Meta Advantage+ delivers 4.52x ROAS with Klaviyo seed audiences vs 1.86x cold. Here's the exact setup most agencies skip.",
    date: "2026-05-20",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: ["ecommerce", "Meta ads", "Klaviyo", "Advantage+", "AI marketing"],
    image: "/blog/klaviyo-meta-advantage.jpg",
  },
  {
    slug: "ecommerce-multi-agency-vendor-trap",
    title: "4 agencies, 4 attribution models. Nobody owns your growth.",
    description:
      "Most $100K-$200K/month DTC brands run 4 separate agencies with conflicting attribution models. The problem isn't the vendors. It's the architecture.",
    date: "2026-05-21",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "DTC",
      "marketing agency",
      "attribution",
      "agency stack",
    ],
    image: "/blog/ecommerce-multi-agency-trap.jpg",
  },
  {
    slug: "ai-ad-platform-product-url-to-campaign",
    title:
      "These AI platforms turn your product URL into a live ad campaign. No agency needed.",
    description:
      "Full-stack AI ad platforms turn a product URL into live Meta campaigns in under an hour. No designers. No agency retainer. Here's how they work.",
    date: "2026-05-22",
    author: "Dustin Gilmour",
    readTime: "8 min",
    tags: [
      "ecommerce",
      "paid ads",
      "AI marketing",
      "Meta ads",
      "ad creative",
    ],
    image: "/blog/ai-ad-platform-ecommerce.jpg",
  },
  {
    slug: "sms-marketing-roi-ecommerce-2026",
    title:
      "SMS pays back $71 for every dollar. Most ecommerce brands are still ignoring it.",
    description:
      "SMS marketing delivers $71-79 ROI per $1 spent in 2026 — higher than email. Most DTC brands skip it or misuse it. Here's the flow setup that actually moves revenue.",
    date: "2026-05-23",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "SMS marketing", "email marketing", "Klaviyo", "DTC"],
    image: "/blog/sms-ecommerce-roi.jpg",
  },
  {
    slug: "klaviyo-composer-ecommerce-email-2026",
    title:
      "Your agency writes your email campaigns. Klaviyo now does it in one sentence.",
    description:
      "Klaviyo Composer generates complete email campaigns from a single prompt. Here's what that means for the $3K/month email retainer you're paying.",
    date: "2026-05-24",
    author: "Dustin Gilmour",
    readTime: "7 min",
    tags: ["ecommerce", "email marketing", "Klaviyo", "AI marketing", "DTC"],
    image: "/blog/klaviyo-composer-email.jpg",
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
