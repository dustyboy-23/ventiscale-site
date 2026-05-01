# Venti Scale Blog SEO Strategy

**Created:** 2026-04-12
**Status:** Phase 1 active

## The Plan

30 blog posts covering done-for-you marketing, AI marketing, coaches, contractors, ecommerce, and social media. Fully automated. No human review. Published via cron using the vs-blog-writer skill.

## Phase 1: Burst (Days 1-9)

**Cadence:** 3 posts/day at 7:15 AM, 1:15 PM, 6:45 PM PDT
**Duration:** ~9 days (27 pending posts / 3 per day)
**Goal:** Get to 30 indexed blog posts ASAP for topical authority

**Publishing order (already set in blog-queue.json):**
- Days 1-3: All 7 Tier 1 pillar posts (highest conversion intent)
- Days 3-7: 12 Tier 2 supporting posts (interleaved by topic cluster)
- Days 7-9: 8 Tier 3 long-tail/general posts

**Topic clusters (pillars published first so supporting content can link back):**
- Done-for-you marketing: 6 posts (pillar + 5 supporting)
- AI marketing: 5 posts (pillar + 4 supporting)
- Coaches: 3 posts (pillar already live + 2 supporting)
- Contractors: 3 posts (pillar already live + 2 supporting)
- Ecommerce: 3 posts (pillar already live + 2 supporting)
- Social media general: 7 posts (platform guides, strategy, costs)
- Content/planning: 3 posts (budget, calendar, email vs social)

## Phase 2: Ongoing (Day 10+)

**Cadence:** 1 post/day (7:15 AM slot only, comment out 1:15 PM and 6:45 PM crons)
**Content source:** New topics generated from:
- Keyword research (what people are actually searching)
- "People also ask" data from Google
- Competitor content gaps
- Client questions from audit submissions
- Seasonal trends and industry news

**Topic generation process:**
1. Weekly keyword research session (can be automated via cron)
2. Add new posts to blog-queue.json with slug, title, keyword, tier, angle
3. Cron picks next pending post and publishes

## Phase 3: Maturity (Month 2+)

**Cadence:** 3 posts/week (MWF) for new content + monthly refresh of existing posts
**Refresh strategy:**
- Update dateModified in Article schema (signals freshness to Google)
- Add new stats/data when available
- Improve internal linking as new posts create more link targets
- Update pricing/costs if market changes

## Automation Stack

- **Skill:** `.claude/skills/vs-blog-writer/SKILL.md` (100% eval pass rate)
- **Cron prompt:** `.claude/prompts/vs-blog-post.md` (12-step auto-publish)
- **Queue:** `ventiscale/ops/blog-queue.json` (cron picks first pending)
- **Deploy:** Auto-deploys to Vercel after each post

## Metrics to Watch

- Google Search Console: indexed pages, impressions, clicks, average position
- Per-post: which keywords are ranking, which posts get organic traffic
- Conversion: audit submissions from blog visitors (track via UTM or referrer)

## Transition Checklist

When queue empties (around day 9-10):
1. Comment out the 1:15 PM and 6:45 PM cron lines
2. Keep 7:15 AM as the 1/day ongoing slot
3. Stock the queue with 20+ new topics from keyword research
4. Consider bumping back to 2-3/day once new queue is loaded
