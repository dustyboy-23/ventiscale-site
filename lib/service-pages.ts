// ─────────────────────────────────────────────────────────────────────────
// SERVICE PAGES: the words on /done-for-you-seo and its four siblings.
//
// Prices, counts and what's included come from lib/pricing.ts. Everything
// here has to stay true to that file. No results, stats or client stories
// unless they are real and on record.
// ─────────────────────────────────────────────────────────────────────────

import type { Faq } from "@/components/marketing/faq";
import type { ServiceId } from "@/lib/pricing";

export interface ServicePageCopy {
  id: ServiceId;
  /** <title>. Under 60 characters. */
  title: string;
  h1: string;
  lede: string;
  why: { heading: string; paras: string[] };
  work: { heading: string; items: { title: string; body: string }[] };
  fit: { good: string[]; bad: string[] };
  faq: Faq[];
  reading: { href: string; label: string }[];
}

export const SERVICE_PAGES: Record<ServiceId, ServicePageCopy> = {
  seo: {
    id: "seo",
    title: "Done-For-You SEO for Small Businesses | Venti Scale",
    h1: "Done-for-you SEO that gets your business found on Google.",
    lede: "I write the articles, fix your pages and plan the keywords. You keep running your business while your site starts showing up for what you sell.",
    why: {
      heading: "If they can't find you, they call someone else.",
      paras: [
        "When someone needs what you sell, they search for it. If your business isn't near the top, they go with whoever is. That competitor might not be any better than you. They're just easier to find.",
        "SEO is the slow, steady fix. Every article is one more page that can show up in search, and it keeps working long after it's published. An ad stops the day you stop paying for it. A good article doesn't.",
      ],
    },
    work: {
      heading: "What I do every month.",
      items: [
        { title: "4 articles a month", body: "One a week, each answering something your customers are really searching for, and each pointing them back to you." },
        { title: "Your current pages fixed", body: "Page titles, descriptions, headings and structure, so Google understands what each page is about and who it's for." },
        { title: "Set up for AI search", body: "More people now ask ChatGPT and Google's AI answers what to buy. I structure your pages so those tools can read them and quote you." },
        { title: "A keyword plan built around what you sell", body: "Done during setup, with 3 months of topics planned, so every article has a reason to exist." },
      ],
    },
    fit: {
      good: [
        "People already search for what you sell",
        "You can give it a few months to build",
        "You have a website I can log into",
      ],
      bad: [
        "You need customers this week. Ads are faster",
        "You need a new website. I don't build those",
      ],
    },
    faq: [
      { q: "How long does SEO take to work?", a: "Expect three to six months before articles bring steady traffic. Anyone promising faster is guessing. It's the slowest thing I sell and the one that keeps paying you back the longest." },
      { q: "Do you guarantee rankings?", a: "No. Nobody controls where Google puts you, and anyone who promises a spot is making it up. What you can count on is the work: 4 articles a month, your pages fixed, and one plain report on what moved." },
      { q: "Who writes the articles?", a: "Software writes the first drafts. I pick the topics, rewrite what's off and check every article before it goes live." },
      { q: "Do I need a new website first?", a: "I don't build or redesign websites. I need a login to the site you have so I can publish articles and fix your pages." },
      { q: "What does \"set up for AI search\" mean?", a: "Tools like ChatGPT and Google's AI answers pull from websites they can read easily. I structure your pages and articles so they can understand what you do and mention you when someone asks." },
    ],
    reading: [
      { href: "/blog/local-seo-for-contractors", label: "Local SEO for contractors" },
      { href: "/blog/ai-product-search-ecommerce-2026", label: "How to get your products recommended by ChatGPT" },
      { href: "/done-for-you-marketing-services", label: "What done-for-you marketing includes" },
    ],
  },

  social: {
    id: "social",
    title: "Done-For-You Social Media Management | Venti Scale",
    h1: "Done-for-you social media, so your pages never go quiet.",
    lede: "I write, design and schedule your posts every month, and post the videos you already have. You never have to think about what to post again.",
    why: {
      heading: "A dead page makes people wonder if you're still open.",
      paras: [
        "Before someone buys from you, there's a good chance they check your Facebook or Instagram. If the last post is from eight months ago, they start to wonder. It costs you customers you never hear about.",
        "Most owners know they should post more. They just don't have the time, and it's always the first thing to slip when the week gets busy. So I take it off your plate completely.",
      ],
    },
    work: {
      heading: "What I do every month.",
      items: [
        { title: "12 posts a month", body: "Written and designed for you. That's about three a week, planned around what you're selling that month." },
        { title: "Facebook, Instagram and LinkedIn", body: "Your posts go out across all three, sized and written for each one." },
        { title: "Up to 8 of your videos posted", body: "Send me your clips and I post them to Reels, TikTok and Shorts." },
        { title: "Captions, hashtags and scheduling", body: "All handled. Nothing lands on your to-do list." },
      ],
    },
    fit: {
      good: [
        "Your pages have gone quiet",
        "You want to look open and active when people check you out",
        "You can send a few photos of your work",
      ],
      bad: [
        "You need someone to answer comments and DMs",
        "You expect posts alone to fill your calendar",
      ],
    },
    faq: [
      { q: "Which platforms do you post to?", a: "The 12 monthly posts go to Facebook, Instagram and LinkedIn. Your videos go to Reels, TikTok and Shorts." },
      { q: "Will the posts sound like my business?", a: "That's what setup is for. I learn your brand look and how you talk before anything goes out. You can look at everything before it publishes, or tell me to just run it." },
      { q: "Do you reply to comments and DMs?", a: "No. Those are conversations with your customers, so they stay with you. Google Business Profile posts aren't included either." },
      { q: "Do I have to make videos?", a: "No. The 12 posts don't need any video from you. If you have clips, I'll post up to 8 a month. If you want them edited too, that's my video editing plan." },
      { q: "What do you need from me?", a: "Access to your pages and a few photos of your work. After that, only what you feel like sending." },
    ],
    reading: [
      { href: "/blog/done-for-you-social-media-management", label: "Done-for-you social media: what you actually get" },
      { href: "/blog/social-media-marketing-cost", label: "How much social media marketing really costs" },
      { href: "/blog/do-i-need-a-social-media-manager", label: "Do I need a social media manager?" },
    ],
  },

  email: {
    id: "email",
    title: "Done-For-You Email Marketing Service | Venti Scale",
    h1: "Done-for-you email marketing that brings past customers back.",
    lede: "I write your automatic emails, switch them on and send 2 campaigns a month. The people who already know you keep coming back.",
    why: {
      heading: "Your easiest sale is to someone who already bought.",
      paras: [
        "You paid to win every customer you've ever had. Most businesses never speak to them again. Their email addresses sit in a list doing nothing while the owner goes looking for new people.",
        "Email fixes that. Once your automatic emails are running, every new signup gets a welcome, every customer gets a follow-up and a review request, and people who've gone quiet get a reason to come back.",
      ],
    },
    work: {
      heading: "What I do every month.",
      items: [
        { title: "4 automatic email series", body: "Welcome, follow-up, review request and come-back. Written and switched on during setup, then running on their own." },
        { title: "2 campaigns a month", body: "Written, designed and sent for you, around what you want to sell that month." },
        { title: "Your list kept clean", body: "So your emails land in inboxes and you aren't paying to email people who left years ago." },
        { title: "Works with the tool you have", body: "If you don't have an email tool yet, I set one up with you." },
      ],
    },
    fit: {
      good: [
        "You have past customers or a list you aren't using",
        "People buy from you more than once",
        "You want more reviews without chasing them",
      ],
      bad: [
        "You have no customers or signups yet. Start with SEO or social",
      ],
    },
    faq: [
      { q: "What are the 4 automatic email series?", a: "A welcome series for new signups, a follow-up after someone buys, a review request, and a come-back series for customers who've gone quiet. Once they're on, they run by themselves." },
      { q: "Which email tool do you use?", a: "Whatever you already have. If you don't have one, I set one up with you. The tool's own subscription is yours to pay." },
      { q: "How many emails will my customers get?", a: "2 campaigns a month, plus any automatic emails their actions trigger." },
      { q: "My list is small. Is it still worth it?", a: "The automatic emails work from your very first signup, so a small list is fine. If you have no list and no customers yet, spend your money on getting found first." },
      { q: "What do you need from me?", a: "Access to your email tool. If you have an offer or a sale coming up, tell me and I'll build the month's campaigns around it." },
    ],
    reading: [
      { href: "/blog/email-marketing-vs-social-media", label: "Email marketing vs social media" },
      { href: "/blog/marketing-automation-small-business-guide", label: "Marketing automation for small business" },
      { href: "/blog/small-business-marketing-budget-template", label: "What a small business marketing budget looks like" },
    ],
  },

  ads: {
    id: "ads",
    title: "Done-For-You Ads Management: Meta + Google | Venti Scale",
    h1: "Done-for-you ads management on Meta and Google.",
    lede: "I build your campaigns, write and design the ads and check them every week. You pay one flat fee per channel, and your ad money goes straight to Meta or Google.",
    why: {
      heading: "Ads don't run themselves.",
      paras: [
        "Ads are the fastest way to get in front of people who are ready to buy. They're also the fastest way to burn money. Leave a campaign alone for a month and you can spend a lot on ads nobody cares about.",
        "So someone has to keep looking. What's working gets pushed, what isn't gets switched off, and the ads get refreshed before people stop noticing them. That's the job.",
      ],
    },
    work: {
      heading: "What I do every month.",
      items: [
        { title: "Campaigns on Meta or Google", body: "Facebook and Instagram on Meta. Search, Maps and YouTube on Google. Priced per channel, so you only pay for what you run." },
        { title: "Ads written and designed for you", body: "Fresh ads every month, so your audience isn't staring at the same one until they tune it out." },
        { title: "Checked every week", body: "What to push, what to switch off, and where the money should go next." },
        { title: "One plain monthly report", body: "What you spent, what it brought in and what I'm changing next month." },
      ],
    },
    fit: {
      good: [
        "You have something that already sells",
        "You can keep a steady ad budget going for a few months",
        "Your website can take orders or enquiries",
      ],
      bad: [
        "You can't afford to test for a few months",
        "You're hoping ads will fix an offer nobody wants",
      ],
    },
    faq: [
      { q: "Is the ad spend included?", a: "No. Meta or Google bills your card directly, so your ad money never passes through me. My fee covers the work." },
      { q: "Why is it priced per channel?", a: "Meta and Google are two separate jobs, each with their own ads, tracking and weekly checks. Each channel has its own monthly fee and its own setup fee." },
      { q: "How much ad spend does the fee cover?", a: "Each channel's fee covers up to $3,000 a month in ad spend on that channel." },
      { q: "Should I start with Meta or Google?", a: "Google if people already search for what you sell. Meta if you need to put it in front of people who aren't looking for it yet. Plenty of businesses end up on both." },
      { q: "How fast will I see results?", a: "Ads give you real numbers inside the first month. That doesn't mean a profit in month one, but you'll know what's working and what isn't." },
    ],
    reading: [
      { href: "/blog/dtc-ad-spend-percentage-small-brands", label: "How much of your revenue should go to ads" },
      { href: "/blog/facebook-marketing-small-business-2026", label: "Is Facebook marketing still worth it?" },
      { href: "/blog/how-much-ecommerce-marketing-budget", label: "How much online stores should spend on marketing" },
    ],
  },

  video: {
    id: "video",
    title: "Done-For-You Video Editing Service | Venti Scale",
    h1: "Done-for-you video editing for your phone clips.",
    lede: "You film on your phone and drop the clips in a folder. I edit them into short videos and post them to TikTok, Reels, Shorts and Facebook.",
    why: {
      heading: "You've got the footage. You just don't have the hours.",
      paras: [
        "Short video is where people are paying attention, and your phone already shoots better than you need. The part that kills it is the editing. Cutting, captions, music and posting can eat a whole evening for one video.",
        "So most clips never get used. They sit on your phone while the business down the road keeps showing up in everyone's feed. Send them to me and they turn into videos people actually watch.",
      ],
    },
    work: {
      heading: "What I do every month.",
      items: [
        { title: "12 short videos a month", body: "Cut from your raw clips. That's about three a week." },
        { title: "Captions, cuts, music and a strong opening", body: "The first few seconds decide whether someone keeps watching, so that's where I spend the most care." },
        { title: "Posted for you", body: "Every video goes out to TikTok, Reels, Shorts and Facebook." },
        { title: "One round of changes on every video", body: "If something's off, tell me and I'll fix it." },
      ],
    },
    fit: {
      good: [
        "You can film on your phone",
        "You have something worth showing: your work, your team, your customers",
        "You want to show up on TikTok, Reels and Shorts",
      ],
      bad: [
        "You need a film crew or a big brand video",
        "You won't get around to sending clips",
      ],
    },
    faq: [
      { q: "Do you film the videos?", a: "No. You shoot on your phone and put the raw clips in a shared folder. Phone footage is fine." },
      { q: "Where do the videos get posted?", a: "TikTok, Instagram Reels, YouTube Shorts and Facebook. I connect your accounts during setup." },
      { q: "How many changes can I ask for?", a: "One round of changes on every video." },
      { q: "What should I film?", a: "Your work, your team, your customers, questions people ask you all the time. During setup we settle on your editing style and what's worth filming." },
      { q: "How is this different from your social media plan?", a: "The social media plan is written and designed posts, and it posts videos you've already finished. This plan turns your raw clips into finished videos. Plenty of people run both." },
    ],
    reading: [
      { href: "/blog/grow-business-instagram-2026", label: "How to grow your business on Instagram" },
      { href: "/blog/which-social-media-platform-for-business", label: "Which platform your business should focus on" },
      { href: "/blog/automate-social-media-without-losing-voice", label: "How to automate social media without losing your voice" },
    ],
  },
};
