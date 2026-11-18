# Retired blog posts

Moved out of `app/(marketing)/blog/` on 2026-11-18 during the SEO pass. Nothing was deleted.

Why they came off the site: they were written for ecommerce ad specialists rather than the small
business owners Venti Scale sells to, six months of Search Console data showed almost no demand for
them, and many carried first-person client stories and numbers that could not be verified.

To bring one back: `git mv archive/retired-posts/<slug> "app/(marketing)/blog/<slug>"`, restore its
entry in `lib/blog.ts` from git history, remove any redirect for it in `next.config.ts`, and take the
unverifiable claims out before it goes live.
