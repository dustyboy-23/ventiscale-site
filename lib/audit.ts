/**
 * Ventiscale audit runner.
 *
 * Fetches a URL, runs a set of surface checks (SEO, performance hints,
 * meta, structured data, accessibility), and returns a scored report
 * plus an HTML email body ready to send via Brevo.
 *
 * Zero external deps, regex parsing on the raw HTML. Good enough for a
 * surface audit; a deeper audit (Lighthouse, real performance metrics,
 * full DOM) belongs in a dedicated job, not a request handler.
 */

export type CheckStatus = "pass" | "warn" | "fail" | "info";

export interface AuditCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string;
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  durationMs: number;
  httpStatus: number;
  pageSize: number;
  checks: AuditCheck[];
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  reachable: boolean;
  error?: string;
  bodyText?: string;
}

const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 2 * 1024 * 1024; // 2 MB cap
const USER_AGENT =
  "Mozilla/5.0 (compatible; VentiScaleAuditBot/1.0; +https://www.ventiscale.com/)";

// ──────────────────────────────────────────────────────────
// URL + fetch
// ──────────────────────────────────────────────────────────
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

async function fetchHtml(url: string): Promise<{
  status: number;
  html: string;
  finalUrl: string;
  size: number;
  error?: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    const buf = await res.arrayBuffer();
    const size = buf.byteLength;
    const sliced = size > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
    const html = new TextDecoder("utf-8", { fatal: false }).decode(sliced);
    return { status: res.status, html, finalUrl: res.url, size };
  } catch (err) {
    return {
      status: 0,
      html: "",
      finalUrl: url,
      size: 0,
      error: (err as Error).message || "Network error",
    };
  } finally {
    clearTimeout(timer);
  }
}

// ──────────────────────────────────────────────────────────
// HTML parsers (regex, surface-level only)
// ──────────────────────────────────────────────────────────
function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractMeta(html: string, name: string): string | null {
  // Escape the meta name for regex
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // name="..." content="..." OR property="..." content="..."
  const re1 = new RegExp(
    `<meta[^>]*(?:name|property)=["']${esc}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const m1 = html.match(re1);
  if (m1) return decodeEntities(m1[1].trim());
  // content first, then name, less common but valid
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${esc}["']`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? decodeEntities(m2[1].trim()) : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function countTag(html: string, tag: string): number {
  const re = new RegExp(`<${tag}\\b`, "gi");
  return (html.match(re) || []).length;
}

async function probeFreshness(siteUrl: string): Promise<{ date: Date | null; source: string }> {
  // Best-effort probe of sitemap.xml, then common feed paths. 5s timeout each,
  // 500KB cap. Swallow all errors, never let this break the audit.
  let origin: string;
  try {
    origin = new URL(siteUrl).origin;
  } catch {
    return { date: null, source: "" };
  }

  const tryPaths: { path: string; label: string }[] = [
    { path: "/sitemap.xml", label: "sitemap.xml" },
    { path: "/feed", label: "feed" },
    { path: "/rss", label: "rss" },
    { path: "/blog/feed", label: "blog feed" },
    { path: "/atom.xml", label: "atom feed" },
  ];

  const FRESH_TIMEOUT_MS = 5000;
  const MAX_BYTES = 500 * 1024;

  for (const { path, label } of tryPaths) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FRESH_TIMEOUT_MS);
    try {
      const res = await fetch(origin + path, {
        headers: { "user-agent": USER_AGENT },
        signal: controller.signal,
        redirect: "follow",
      });
      if (!res.ok) {
        clearTimeout(timer);
        continue;
      }
      const buf = await res.arrayBuffer();
      const sliced = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
      const body = new TextDecoder("utf-8", { fatal: false }).decode(sliced);
      clearTimeout(timer);

      // Collect all plausible date strings: <lastmod>, <pubDate>, <updated>
      const dateStrings: string[] = [];
      const lastmodMatches = body.match(/<lastmod>([^<]+)<\/lastmod>/gi) || [];
      for (const m of lastmodMatches) {
        const inner = m.replace(/<\/?lastmod>/gi, "").trim();
        if (inner) dateStrings.push(inner);
      }
      const pubDateMatches = body.match(/<pubDate>([^<]+)<\/pubDate>/gi) || [];
      for (const m of pubDateMatches) {
        const inner = m.replace(/<\/?pubDate>/gi, "").trim();
        if (inner) dateStrings.push(inner);
      }
      const updatedMatches = body.match(/<updated>([^<]+)<\/updated>/gi) || [];
      for (const m of updatedMatches) {
        const inner = m.replace(/<\/?updated>/gi, "").trim();
        if (inner) dateStrings.push(inner);
      }

      let newest: Date | null = null;
      for (const ds of dateStrings) {
        const d = new Date(ds);
        if (!isNaN(d.getTime()) && (!newest || d > newest)) newest = d;
      }
      if (newest) return { date: newest, source: label };
    } catch {
      clearTimeout(timer);
      // fall through and try next path
    }
  }
  return { date: null, source: "" };
}

function stripToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ──────────────────────────────────────────────────────────
// Audit runner
// ──────────────────────────────────────────────────────────
export async function runAudit(rawUrl: string): Promise<AuditResult> {
  const url = normalizeUrl(rawUrl);
  const startedAt = Date.now();
  const fetched = await fetchHtml(url);
  const duration = Date.now() - startedAt;

  const base: AuditResult = {
    url,
    finalUrl: fetched.finalUrl,
    fetchedAt: new Date().toISOString(),
    durationMs: duration,
    httpStatus: fetched.status,
    pageSize: fetched.size,
    checks: [],
    score: 0,
    grade: "F",
    reachable: false,
  };

  if (fetched.error || fetched.status === 0) {
    base.error =
      fetched.error === "This operation was aborted"
        ? "Your site took longer than 10 seconds to respond"
        : fetched.error || "Could not reach your site";
    return base;
  }

  base.reachable = true;
  const html = fetched.html;
  const checks: AuditCheck[] = [];

  // 1. HTTPS
  const isHttps = url.startsWith("https://");
  checks.push({
    id: "https",
    label: "HTTPS",
    status: isHttps ? "pass" : "fail",
    detail: isHttps
      ? "Your site is served over HTTPS. Good. Google penalizes plain HTTP and browsers mark it insecure."
      : "Your site is served over plain HTTP.",
    fix: isHttps
      ? undefined
      : "Enable SSL on your host. Let's Encrypt is free and every serious host supports it.",
  });

  // 2. HTTP status
  const okStatus = fetched.status >= 200 && fetched.status < 300;
  checks.push({
    id: "status",
    label: "Server responds cleanly",
    status: okStatus ? "pass" : "warn",
    detail: `HTTP ${fetched.status} after ${Math.round(duration)}ms.`,
    fix: okStatus
      ? undefined
      : "Non-2xx status on the homepage usually means a bad redirect or a firewall rule. Fix it.",
  });

  // 3. Title tag
  const title = extractTitle(html);
  if (!title) {
    checks.push({
      id: "title",
      label: "Title tag",
      status: "fail",
      detail: "Your homepage has no <title> tag.",
      fix: "Add a descriptive title. This is the single most important on-page SEO element.",
    });
  } else if (title.length < 20) {
    checks.push({
      id: "title",
      label: "Title tag",
      status: "warn",
      detail: `Only ${title.length} characters: "${title}"`,
      fix: "Target 50-60 characters with your brand name and your primary keyword.",
    });
  } else if (title.length > 70) {
    checks.push({
      id: "title",
      label: "Title tag",
      status: "warn",
      detail: `${title.length} chars. Google will truncate this in search. "${title}"`,
      fix: "Trim to 50-60 characters.",
    });
  } else {
    checks.push({
      id: "title",
      label: "Title tag",
      status: "pass",
      detail: `"${title}" (${title.length} chars)`,
    });
  }

  // 4. Meta description
  const desc = extractMeta(html, "description");
  if (!desc) {
    checks.push({
      id: "description",
      label: "Meta description",
      status: "fail",
      detail: "No meta description set.",
      fix: "Write a 150-160 character description with your value prop. This becomes your Google search snippet.",
    });
  } else if (desc.length < 70) {
    checks.push({
      id: "description",
      label: "Meta description",
      status: "warn",
      detail: `Only ${desc.length} characters. Too thin to rank or sell.`,
      fix: "Target 150-160 characters.",
    });
  } else if (desc.length > 170) {
    checks.push({
      id: "description",
      label: "Meta description",
      status: "warn",
      detail: `${desc.length} characters. Will be truncated in search.`,
      fix: "Trim to 150-160 characters.",
    });
  } else {
    checks.push({
      id: "description",
      label: "Meta description",
      status: "pass",
      detail: `${desc.length} characters. Good.`,
    });
  }

  // 5. H1
  const h1Count = countTag(html, "h1");
  if (h1Count === 0) {
    checks.push({
      id: "h1",
      label: "H1 heading",
      status: "fail",
      detail: "No <h1> on the page.",
      fix: "Every page should have exactly one H1 that matches the searcher's intent.",
    });
  } else if (h1Count > 1) {
    checks.push({
      id: "h1",
      label: "H1 heading",
      status: "warn",
      detail: `${h1Count} H1s on the page.`,
      fix: "Use exactly one H1 per page. Everything else should be H2/H3.",
    });
  } else {
    checks.push({
      id: "h1",
      label: "H1 heading",
      status: "pass",
      detail: "Exactly one H1. Clean.",
    });
  }

  // 6. Viewport (mobile)
  const hasViewport = !!extractMeta(html, "viewport");
  checks.push({
    id: "viewport",
    label: "Mobile viewport",
    status: hasViewport ? "pass" : "fail",
    detail: hasViewport
      ? "Viewport meta tag present."
      : "No viewport meta. Your site renders zoomed out on phones.",
    fix: hasViewport
      ? undefined
      : 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside your <head>.',
  });

  // 7. Open Graph image
  const ogImage = extractMeta(html, "og:image");
  checks.push({
    id: "og_image",
    label: "Open Graph image",
    status: ogImage ? "pass" : "warn",
    detail: ogImage
      ? "og:image is set. Social shares will look intentional."
      : "No og:image. Your site shares as a blank card on LinkedIn, Slack, iMessage.",
    fix: ogImage
      ? undefined
      : "Add a 1200×630 PNG and reference it with <meta property=\"og:image\" content=\"...\">",
  });

  // 8. Twitter card
  const twCard = extractMeta(html, "twitter:card");
  checks.push({
    id: "twitter",
    label: "Twitter card",
    status: twCard ? "pass" : "warn",
    detail: twCard ? `Type: ${twCard}` : "No twitter:card meta.",
    fix: twCard
      ? undefined
      : 'Add <meta name="twitter:card" content="summary_large_image">',
  });

  // 9. Canonical
  const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
  checks.push({
    id: "canonical",
    label: "Canonical URL",
    status: hasCanonical ? "pass" : "warn",
    detail: hasCanonical
      ? "Canonical link present."
      : "No canonical link. Risks duplicate content penalties.",
    fix: hasCanonical
      ? undefined
      : 'Add <link rel="canonical" href="..."> pointing to the definitive version of this page.',
  });

  // 10. Structured data
  const hasSchema = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
  checks.push({
    id: "schema",
    label: "Structured data (JSON-LD)",
    status: hasSchema ? "pass" : "warn",
    detail: hasSchema
      ? "JSON-LD structured data found."
      : "No structured data.",
    fix: hasSchema
      ? undefined
      : "Add Organization and Product schema. Google uses this for rich search results.",
  });

  // 11. Favicon
  const hasFavicon = /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i.test(
    html,
  );
  checks.push({
    id: "favicon",
    label: "Favicon",
    status: hasFavicon ? "pass" : "warn",
    detail: hasFavicon ? "Favicon linked." : "No favicon. Looks unfinished in browser tabs.",
  });

  // 12. HTML lang
  const langMatch = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  checks.push({
    id: "lang",
    label: "HTML lang attribute",
    status: langMatch ? "pass" : "warn",
    detail: langMatch ? `lang="${langMatch[1]}"` : "No <html lang> attribute.",
    fix: langMatch
      ? undefined
      : 'Add lang="en" (or your language code) to the <html> tag. Accessibility + SEO.',
  });

  // 13. Images without alt
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const imgCount = imgTags.length;
  const imgsNoAlt = imgTags.filter((t) => !/\balt\s*=/i.test(t)).length;
  if (imgCount === 0) {
    checks.push({
      id: "img_alt",
      label: "Image alt text",
      status: "info",
      detail: "No <img> tags found on the page.",
    });
  } else if (imgsNoAlt === 0) {
    checks.push({
      id: "img_alt",
      label: "Image alt text",
      status: "pass",
      detail: `All ${imgCount} images have alt text.`,
    });
  } else {
    checks.push({
      id: "img_alt",
      label: "Image alt text",
      status: "warn",
      detail: `${imgsNoAlt} of ${imgCount} images are missing alt text.`,
      fix: "Add descriptive alt text to every image. SEO plus accessibility, both critical.",
    });
  }

  // 14. Page weight
  const sizeMB = fetched.size / 1024 / 1024;
  if (sizeMB < 1) {
    checks.push({
      id: "weight",
      label: "Page weight",
      status: "pass",
      detail: `${sizeMB.toFixed(2)} MB HTML. Lean, loads fast.`,
    });
  } else if (sizeMB < 2.5) {
    checks.push({
      id: "weight",
      label: "Page weight",
      status: "warn",
      detail: `${sizeMB.toFixed(2)} MB HTML. Heavier than ideal.`,
      fix: "Target under 1 MB for the raw HTML document.",
    });
  } else {
    checks.push({
      id: "weight",
      label: "Page weight",
      status: "fail",
      detail: `${sizeMB.toFixed(2)} MB HTML. This is a speed killer on mobile.`,
      fix: "Remove unused scripts, lazy-load images, split large bundles.",
    });
  }

  // 15. Content depth
  const text = stripToText(html);
  base.bodyText = text.slice(0, 3000);
  const wordCount = text.split(" ").filter(Boolean).length;
  if (wordCount < 100) {
    checks.push({
      id: "content",
      label: "Content depth",
      status: "fail",
      detail: `Only ~${wordCount} words on the page.`,
      fix: "Thin content doesn't rank and doesn't sell. Target 300+ words on landing pages.",
    });
  } else if (wordCount < 300) {
    checks.push({
      id: "content",
      label: "Content depth",
      status: "warn",
      detail: `~${wordCount} words. A little light.`,
      fix: "Target 300-500 words with context, benefits, and social proof.",
    });
  } else {
    checks.push({
      id: "content",
      label: "Content depth",
      status: "pass",
      detail: `~${wordCount} words. Enough for Google to understand the page.`,
    });
  }

  // ──────────────────────────────────────────────────────────
  // Marketing-specific detectors (the stuff Venti Scale actually sells)
  // ──────────────────────────────────────────────────────────

  // 16. Tracking pixels
  const pixels: string[] = [];
  if (/fbq\s*\(|connect\.facebook\.net\/en_US\/fbevents\.js/i.test(html)) pixels.push("Meta Pixel");
  if (/googletagmanager\.com\/gtm\.js/i.test(html)) pixels.push("Google Tag Manager");
  if (/gtag\s*\(|googletagmanager\.com\/gtag\/js/i.test(html)) pixels.push("Google Analytics (GA4)");
  if (/analytics\.tiktok\.com/i.test(html)) pixels.push("TikTok Pixel");
  if (/snap\.licdn\.com/i.test(html)) pixels.push("LinkedIn Insight Tag");
  if (pixels.length >= 2) {
    checks.push({
      id: "pixels",
      label: "Tracking pixels",
      status: "pass",
      detail: `Found: ${pixels.join(", ")}. You can actually measure what's working.`,
    });
  } else if (pixels.length === 1) {
    checks.push({
      id: "pixels",
      label: "Tracking pixels",
      status: "warn",
      detail: `Only one pixel detected: ${pixels[0]}. You're flying half-blind.`,
      fix: "Add GA4 and Meta Pixel at minimum. Without measurement, you can't optimize anything.",
    });
  } else {
    checks.push({
      id: "pixels",
      label: "Tracking pixels",
      status: "fail",
      detail: "No tracking pixels detected. You have zero visibility into what your visitors do.",
      fix: "Install Google Analytics 4 and a Meta Pixel before you run any paid ads. This is the baseline.",
    });
  }

  // 17. Email capture
  const emailCaptureSignals: string[] = [];
  // Look for email inputs outside of login/signin context
  const emailInputs = html.match(/<input\b[^>]*type=["']email["'][^>]*>/gi) || [];
  const nonLoginEmailInputs = emailInputs.filter((tag) => {
    return !/(login|sign[- ]?in|log[- ]?in)/i.test(tag);
  });
  if (nonLoginEmailInputs.length > 0) emailCaptureSignals.push("email signup form");
  if (/static\.klaviyo\.com|klaviyo\.js/i.test(html)) emailCaptureSignals.push("Klaviyo");
  if (/mc\.us\d|chimpstatic\.com|mailchimp/i.test(html)) emailCaptureSignals.push("Mailchimp");
  if (/ck\.page|convertkit/i.test(html)) emailCaptureSignals.push("ConvertKit");
  if (/privy\.com|privy-widget/i.test(html)) emailCaptureSignals.push("Privy");
  if (/justuno/i.test(html)) emailCaptureSignals.push("Justuno");
  if (/sumo\.com|sumome/i.test(html)) emailCaptureSignals.push("Sumo");
  if (emailCaptureSignals.length > 0) {
    checks.push({
      id: "email_capture",
      label: "Email capture",
      status: "pass",
      detail: `Detected: ${emailCaptureSignals.join(", ")}. You're building a list.`,
    });
  } else {
    checks.push({
      id: "email_capture",
      label: "Email capture",
      status: "fail",
      detail: "No email capture anywhere on the homepage.",
      fix: "Add a newsletter signup or a lead magnet opt-in. Email is the highest ROI channel you have, and you're leaving it on the table.",
    });
  }

  // 18. Blog / content hub
  const contentLinkPatterns = [
    /href=["'][^"']*\/blog\b/i,
    /href=["'][^"']*\/articles?\b/i,
    /href=["'][^"']*\/posts?\b/i,
    /href=["'][^"']*\/resources?\b/i,
    /href=["'][^"']*\/insights?\b/i,
    /href=["'][^"']*\/guides?\b/i,
  ];
  const hasContentLink = contentLinkPatterns.some((re) => re.test(html));
  const hasRss = /<link[^>]*type=["']application\/rss\+xml["']|<link[^>]*type=["']application\/atom\+xml["']/i.test(html);
  if (hasContentLink || hasRss) {
    checks.push({
      id: "content_hub",
      label: "Content engine",
      status: "pass",
      detail: hasRss
        ? "Content hub detected with RSS/Atom feed. You have somewhere to publish."
        : "Blog or resources section linked from the homepage.",
    });
  } else {
    checks.push({
      id: "content_hub",
      label: "Content engine",
      status: "warn",
      detail: "No blog, articles, or resources section found on the homepage.",
      fix: "Content is how you get free traffic and build authority. Even one article a week compounds.",
    });
  }

  // 19. Content freshness (sitemap / feed probe)
  const freshCheck = await probeFreshness(fetched.finalUrl || url);
  if (freshCheck.date) {
    const daysOld = (Date.now() - freshCheck.date.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 30) {
      checks.push({
        id: "content_fresh",
        label: "Content freshness",
        status: "pass",
        detail: `Most recent update: ${Math.round(daysOld)} days ago (from ${freshCheck.source}). Actively maintained.`,
      });
    } else if (daysOld < 90) {
      checks.push({
        id: "content_fresh",
        label: "Content freshness",
        status: "warn",
        detail: `Last update: ~${Math.round(daysOld)} days ago (from ${freshCheck.source}).`,
        fix: "Publish something fresh this month. Search engines reward recency and so do humans.",
      });
    } else {
      checks.push({
        id: "content_fresh",
        label: "Content freshness",
        status: "fail",
        detail: `Last update: ${Math.round(daysOld)} days ago (from ${freshCheck.source}). The site looks abandoned.`,
        fix: "Fresh content signals a living brand. Get on a weekly or biweekly cadence.",
      });
    }
  } else {
    checks.push({
      id: "content_fresh",
      label: "Content freshness",
      status: "info",
      detail: "No sitemap or feed detected.",
    });
  }

  // 20. Social presence
  const socialPlatforms = new Set<string>();
  const hrefMatches = html.match(/href=["']([^"']+)["']/gi) || [];
  for (const h of hrefMatches) {
    const lower = h.toLowerCase();
    if (lower.includes("instagram.com")) socialPlatforms.add("Instagram");
    else if (lower.includes("facebook.com")) socialPlatforms.add("Facebook");
    else if (lower.includes("tiktok.com")) socialPlatforms.add("TikTok");
    else if (lower.includes("x.com") || lower.includes("twitter.com")) socialPlatforms.add("X");
    else if (lower.includes("linkedin.com")) socialPlatforms.add("LinkedIn");
    else if (lower.includes("youtube.com")) socialPlatforms.add("YouTube");
    else if (lower.includes("pinterest.com")) socialPlatforms.add("Pinterest");
    else if (lower.includes("threads.net")) socialPlatforms.add("Threads");
  }
  if (socialPlatforms.size >= 3) {
    checks.push({
      id: "social",
      label: "Social presence",
      status: "pass",
      detail: `Linked from the site: ${Array.from(socialPlatforms).join(", ")}.`,
    });
  } else if (socialPlatforms.size >= 1) {
    checks.push({
      id: "social",
      label: "Social presence",
      status: "warn",
      detail: `Only ${socialPlatforms.size} platform(s) linked: ${Array.from(socialPlatforms).join(", ")}.`,
      fix: "Pick 2 more channels where your customers actually spend time and show up there consistently.",
    });
  } else {
    checks.push({
      id: "social",
      label: "Social presence",
      status: "fail",
      detail: "No social platforms linked from the homepage.",
      fix: "Link your social channels in the footer at minimum. Customers want to see you're real.",
    });
  }

  // 21. Conversion tools (live chat, lead capture widgets)
  const convTools: string[] = [];
  if (/intercom\.io|widget\.intercom\.io/i.test(html)) convTools.push("Intercom");
  if (/driftt\.com|js\.driftt\.com/i.test(html)) convTools.push("Drift");
  if (/tawk\.to|embed\.tawk\.to/i.test(html)) convTools.push("Tawk");
  if (/crisp\.chat|client\.crisp\.chat/i.test(html)) convTools.push("Crisp");
  if (/hs-scripts\.com|js\.hs-scripts\.com/i.test(html)) convTools.push("HubSpot");
  if (/static\.zdassets\.com/i.test(html)) convTools.push("Zendesk");
  if (convTools.length > 0) {
    checks.push({
      id: "conversion",
      label: "Conversion tools",
      status: "pass",
      detail: `Live chat / lead capture widget detected: ${convTools.join(", ")}.`,
    });
  } else {
    checks.push({
      id: "conversion",
      label: "Conversion tools",
      status: "info",
      detail: "No live chat or conversion widget detected. Optional, but a chat widget often lifts conversion on higher consideration purchases.",
    });
  }

  // Score
  const weights: Record<CheckStatus, number> = { pass: 1, info: 1, warn: 0.5, fail: 0 };
  const scored = checks.filter((c) => c.status !== "info");
  const total = scored.length;
  const sum = scored.reduce((acc, c) => acc + weights[c.status], 0);
  const pct = total > 0 ? Math.round((sum / total) * 100) : 0;

  base.checks = checks;
  base.score = pct;
  base.grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";

  return base;
}

// ──────────────────────────────────────────────────────────
// Email rendering
// ──────────────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Dark theme palette matching the ventiscale.com site
const EMAIL_COLORS = {
  bg: "#07080C",
  card: "#11131B",
  cardAlt: "#14161F",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#FFFFFF",
  textMid: "rgba(255,255,255,0.70)",
  textDim: "rgba(255,255,255,0.55)",
  red: "#C8362B",
  green: "#10E39A",
  blue: "#5280FF",
};

function darkStatusBadge(status: CheckStatus): string {
  const palette: Record<CheckStatus, { bg: string; fg: string; label: string }> = {
    pass: { bg: "rgba(16,227,154,0.12)", fg: "#10E39A", label: "PASS" },
    warn: { bg: "rgba(255,200,80,0.12)", fg: "#FFC850", label: "WARN" },
    fail: { bg: "rgba(200,54,43,0.14)", fg: "#FF6A5E", label: "FAIL" },
    info: { bg: "rgba(255,255,255,0.06)", fg: "rgba(255,255,255,0.65)", label: "INFO" },
  };
  const p = palette[status];
  return `<span style="display:inline-block;background:${p.bg};color:${p.fg};font-size:10px;font-weight:700;letter-spacing:0.08em;padding:3px 7px;border-radius:3px;text-transform:uppercase;">${p.label}</span>`;
}

// ──────────────────────────────────────────────────────────
// Sales email content builder (Hormozi CLOSER framework)
//
// The audit findings feed a persuasive sales email, not an audit report.
// Flow: opener → label the #1 pain → cost of inaction → why it happens →
// 3 outcome-framed moves → proof → offer → CTA. Underlying signal still
// comes from assessPillars + rankPriorities, but the copy is tuned to
// sell a marketing service, not deliver a report card.
// ──────────────────────────────────────────────────────────

type PillarStrength = "strong" | "weak" | "missing" | "unknown";

interface Pillar {
  id: string;
  name: string;
  check: AuditCheck | undefined;
  strength: PillarStrength;
  detail: string;
}

function assessPillars(result: AuditResult): Record<string, Pillar> {
  const get = (id: string) => result.checks.find((c) => c.id === id);
  const toStrength = (c: AuditCheck | undefined): PillarStrength => {
    if (!c) return "unknown";
    if (c.status === "pass") return "strong";
    if (c.status === "warn") return "weak";
    if (c.status === "info") return "unknown";
    return "missing";
  };
  const mk = (id: string, name: string): Pillar => {
    const check = get(id);
    return {
      id,
      name,
      check,
      strength: toStrength(check),
      detail: check?.detail || "",
    };
  };
  return {
    measurement: mk("pixels", "Measurement"),
    capture: mk("email_capture", "Email capture"),
    content: mk("content_hub", "Content engine"),
    freshness: mk("content_fresh", "Content freshness"),
    distribution: mk("social", "Social distribution"),
    conversion: mk("conversion", "Conversion tooling"),
  };
}

// Classify the business from the free-text "business" field so we can tailor
// the roadmap. This is lossy on purpose — we just need enough signal to pick
// which pillar matters most for them.
type BusinessKind =
  | "ecommerce"
  | "saas"
  | "service"
  | "agency"
  | "coach"
  | "local"
  | "creator"
  | "restaurant"
  | "generic";

function classifyBusiness(biz: string): BusinessKind {
  const s = biz.toLowerCase();
  if (/shop|store|ecom|e-com|brand|apparel|clothing|jewel|beauty|skin|supplement|cpg|product|retail|merch/.test(s)) return "ecommerce";
  if (/\bsaas\b|\bsoftware\b|\bapp\b|\bplatform\b|\btool\b|\bapi\b|\bdev\b|\bstartup\b/.test(s)) return "saas";
  if (/agency|\bstudio\b|marketing|design|creative|\bseo\b|\bads\b/.test(s)) return "agency";
  if (/coach|course|consult|mentor|teacher|info|education|training|academy/.test(s)) return "coach";
  if (/restaurant|cafe|bar\b|diner|bakery|food truck|eatery/.test(s)) return "restaurant";
  if (/clean|plumb|hvac|electric|roof|landscap|contract|handyman|install|repair|salon|\bspa\b|med spa|dentist|chiro|clinic|\bgym\b|\bstudio\b|\blocal\b|\bservice\b/.test(s)) return s.includes("studio") ? "agency" : /clean|plumb|hvac|electric|roof|landscap|contract|handyman|repair/.test(s) ? "local" : "service";
  if (/creator|youtuber|influencer|podcast|newsletter|writer|artist/.test(s)) return "creator";
  return "generic";
}

// Human-readable phrase for the business so copy reads naturally.
function bizPhrase(biz: string, kind: BusinessKind): string {
  const lower = biz.toLowerCase().trim();
  if (lower) return lower;
  const fallback: Record<BusinessKind, string> = {
    ecommerce: "your ecommerce brand",
    saas: "your software product",
    service: "your service business",
    agency: "your agency",
    coach: "your coaching business",
    local: "your local service business",
    creator: "your creator business",
    restaurant: "your restaurant",
    generic: "your business",
  };
  return fallback[kind];
}

interface RankedPriority {
  pillar: Pillar;
  rank: number;
  score: number;
}

// Rank the pillars that need work, weighted by business context. This is the
// core of the roadmap: the user gets a specific ordered plan with "why this
// is #1 for you" reasoning tied to their actual business kind.
function rankPriorities(
  pillars: Record<string, Pillar>,
  kind: BusinessKind,
): RankedPriority[] {
  // Keyed by check ID, not pillar label, because that's what p.id actually is.
  const weights: Record<string, Partial<Record<BusinessKind, number>>> = {
    pixels:        { ecommerce: 25, saas: 20, service: 15, agency: 20, coach: 15, local: 10, creator: 10, restaurant: 10, generic: 18 },
    email_capture: { ecommerce: 22, saas: 18, service: 18, agency: 15, coach: 25, local: 12, creator: 22, restaurant: 10, generic: 18 },
    content_hub:   { ecommerce: 10, saas: 18, service: 20, agency: 20, coach: 22, local: 15, creator: 18, restaurant: 8,  generic: 14 },
    content_fresh: { ecommerce: 4,  saas: 8,  service: 10, agency: 10, coach: 10, local: 6,  creator: 10, restaurant: 4,  generic: 7 },
    social:        { ecommerce: 12, saas: 6,  service: 8,  agency: 6,  coach: 12, local: 10, creator: 20, restaurant: 15, generic: 10 },
    conversion:    { ecommerce: 14, saas: 12, service: 12, agency: 8,  coach: 10, local: 18, creator: 6,  restaurant: 12, generic: 10 },
  };

  const pool = Object.values(pillars).filter(
    (p) => p.strength === "missing" || p.strength === "weak",
  );
  const scored = pool.map((p) => {
    const base = p.strength === "missing" ? 100 : 45;
    const bonus = weights[p.id]?.[kind] ?? 10;
    return { pillar: p, score: base + bonus, rank: 0 };
  });
  scored.sort((a, b) => b.score - a.score);
  scored.forEach((s, i) => (s.rank = i + 1));
  return scored.slice(0, 3);
}

// The #1 pain, labelled in one plain sentence. This is the centerpiece
// of the email, what the reader stares at and says "yeah, that's me."
function painLabelFor(pillarId: string): string {
  switch (pillarId) {
    case "pixels":
      return "You can't see what's actually working in your marketing.";
    case "email_capture":
      return "Almost every visitor to your site leaves and never comes back.";
    case "content_hub":
      return "You're invisible on Google for the stuff your customers are searching for.";
    case "content_fresh":
      return "Your site's gone quiet and Google's pulling the plug.";
    case "social":
      return "You don't look legit at first glance.";
    case "conversion":
      return "Visitors with questions are bouncing to the next guy.";
    default:
      return "There's a gap costing you customers every week.";
  }
}

// One tight paragraph per pillar. Combines the pain, the cost, and the
// "you're not behind" reassurance into 3-4 sentences. Used to be three
// separate cards saying the same thing. Now it's one.
function problemBodyFor(pillarId: string, kind: BusinessKind, phrase: string): string {
  if (pillarId === "pixels") {
    const map: Partial<Record<BusinessKind, string>> = {
      ecommerce: `Right now you can't see which traffic actually turns into sales. Could be ads, could be social, could be word of mouth, you've got no way to tell which one to pour fuel on. Most shops we look at are right here, the data layer is just the missing piece.`,
      saas: `You can't see where signups come from, which visitors turn into trials, or which trials turn into paying customers. Every call about marketing is a hunch. Most founders we audit are stuck in the same spot, the playbook for this stuff hasn't caught up yet.`,
      service: `You've got no idea which traffic actually picks up the phone. Someone calls you, you can't tell where they came from, so you can't double down on what's working. Most service businesses we look at are in this exact spot.`,
      local: `You've got no way to tell what's bringing customers in. Could be social, could be word of mouth, could be the website, you can't double down on what's working because you can't see it. Most local businesses we audit are right here, the playbook just hasn't caught up.`,
      coach: `Your whole business is moving strangers from cold to warm to buyer, and you can't see any of it. You're coaching in the dark. Most coaches we look at are in the same spot, the tools to fix this used to cost a fortune and now they don't.`,
      agency: `You sell marketing and your own site isn't measuring any of it. Brutal when a prospect pokes around. Most agencies we audit are here too, the cobbler-with-no-shoes thing is real.`,
      creator: `You can't see which posts or videos are actually pulling people to your stuff. You're guessing at the algorithm instead of reading the numbers. Most creators we look at are right here, no excuse to fly blind anymore now that the tools are cheap.`,
      restaurant: `You can't tell who booked a table and who just looked at the menu and left. You can't see which marketing is filling seats and which is flat. Most restaurants we audit are in the same spot.`,
    };
    return map[kind] || `Right now you're making marketing decisions blind. Could be working, could be flat, you have no way to tell. Most owners we look at are in this exact spot, you're not behind, the playbook for this stuff just hasn't caught up.`;
  }
  if (pillarId === "email_capture") {
    return `About 97 out of every 100 visitors leave your site and never come back. Right now you've got nothing to pull em back with. No email, no follow-up, nothing. That's customers you already paid to get, walking out the door.`;
  }
  if (pillarId === "content_hub") {
    const map: Partial<Record<BusinessKind, string>> = {
      ecommerce: `People Google "best [your product]" and "how to pick [your product]" thousands of times a month. You're not showing up for any of it. Your competitors are eating that traffic for free.`,
      local: `People in your area are Googling for exactly what you do right now. They're not finding you, they're finding the other guy down the road. That's free traffic going to whoever bothers to publish for it.`,
      saas: `The companies that win long-term publish stuff their customers actually search for. Right now you're invisible. Your competitors are eating the free traffic and compounding.`,
      restaurant: `When locals search "best [your food] near me," you want to be the first name they see. Right now you're not even on the page.`,
    };
    return map[kind] || `People are searching for what ${phrase} does every day. You're not showing up for any of it. Free traffic that should be yours is going to your competitors instead.`;
  }
  if (pillarId === "content_fresh") {
    return `Your blog's there but it's been quiet for months. Google starts pulling the plug on sites that stop publishing, you lose about 20% of your search traffic every 90 days of silence. Visitors notice too, a stale blog makes people wonder if you're still open.`;
  }
  if (pillarId === "social") {
    return `No social links on your site. The first thing a new customer does is peek at Instagram or TikTok to check if you're real. If they can't find you there, they assume you're not. They're gone before you even knew they were there.`;
  }
  if (pillarId === "conversion") {
    return `Visitors with a quick question can't get one answered. Most won't pick up the phone or send an email, they just leave and find someone easier to talk to. That's real money walking off your site every day.`;
  }
  return `There's a hole in the way ${phrase} turns visitors into customers, and it's costing you every week.`;
}

// One-line summary that sits next to the score badge. Frames the number
// for the reader. Tied to how many things are actually broken, not the
// raw score.
function scoreLineFor(failingCount: number, phrase: string): string {
  if (failingCount === 0) return `Foundation's solid. From here it's about scaling what's working.`;
  if (failingCount === 1) return `Foundation's mostly there, one real gap to plug.`;
  if (failingCount <= 3) return `Foundation's there, the marketing layer is what's missing.`;
  return `A few real gaps to plug before ${phrase} can pull for you the way it should.`;
}

// Outcome-framed "moves" for the Sell the Vacation block. Each move leads
// with what the reader gets, then how we do it. Kept short on purpose.
function moveFor(pillarId: string, _kind: BusinessKind): { outcome: string; how: string } {
  switch (pillarId) {
    case "pixels":
      return {
        outcome: "You start seeing exactly which marketing is bringing customers in.",
        how: "We hook up the tracking in week 1. From then on, every post, every email, every campaign, you see what it brought in.",
      };
    case "email_capture":
      return {
        outcome: "You stop losing visitors forever.",
        how: "We put a real offer on your site, something your customers actually want, and hook it to a short email sequence that does the selling while you sleep.",
      };
    case "content_hub":
      return {
        outcome: "You start showing up on Google for the stuff your customers are searching for.",
        how: "We write 4 articles a month that answer the exact questions your customers type in. Free traffic that compounds for years.",
      };
    case "content_fresh":
      return {
        outcome: "You get Google sending you free traffic again.",
        how: "We restart the posting rhythm with one short piece a week. Google notices inside a month and starts sending people back.",
      };
    case "social":
      return {
        outcome: "You look legit the second somebody checks you out.",
        how: "We get your social wired up everywhere customers look and start posting the kind of stuff that builds trust fast.",
      };
    case "conversion":
      return {
        outcome: "You catch the visitors who were almost ready to buy.",
        how: "We add a simple chat that handles the quick questions that turn hesitation into a sale.",
      };
    default:
      return {
        outcome: "You fix a leak that's been costing you customers every week.",
        how: `We handle it end to end so it actually gets done instead of sitting on a to-do list.`,
      };
  }
}

// Fallback move used when the site only needs 1 or 2 things but we want
// 3 moves in the email for rhythm.
function padMove(idx: number): { outcome: string; how: string } {
  if (idx === 1) {
    return {
      outcome: "You double down on what's already working.",
      how: "We read the numbers every week and pour more fuel on the stuff that's paying for itself. No guessing, no precious attachment to bad ideas.",
    };
  }
  return {
    outcome: "You stop playing catch-up on marketing and start compounding.",
    how: "We set up the habits and systems that keep working whether you're paying attention to them or not.",
  };
}

// Combined proof + offer in one block. Results-in-Advance framing (the
// audit itself is the proof) plus DFY pitch and risk reversal.
const HELP_BODY = `This audit is the same one agencies charge $500 to $2,000 for. I give it away because once you see how sharp the read is, working together is the obvious move. We'd run your marketing for you, tracking, emails, content, social, ads, all of it, while you keep running the business. Weekly reports on what moved. No contract, cancel anytime.`;

interface SalesEmailContent {
  opener: string;
  scoreLine: string;
  painLabel: string;
  problemBody: string;
  moves: Array<{ outcome: string; how: string }>;
  helpBody: string;
  ctaHeadline: string;
  ctaSub: string;
  ctaButton: string;
  softClose: string;
}

// Happy-path content for sites with no real gaps. We still need to sell,
// but the frame shifts from "fix" to "scale what's working."
function buildHappyPathContent(opener: string, phrase: string): SalesEmailContent {
  return {
    opener,
    scoreLine: `Foundation's solid. From here it's about scaling what's working.`,
    painLabel: `You're in rare air. Most sites we look at have 3 or 4 big holes.`,
    problemBody: `Almost everything I check for is already working for ${phrase}. The risk now isn't a broken site, it's a plateau, and the work shifts from fixing leaks to pouring fuel on what's already paying.`,
    moves: [
      {
        outcome: "You pour fuel on whatever channel is already paying.",
        how: "We read the numbers, find the channel that's beating everything else, and we double the budget on it. Simple.",
      },
      {
        outcome: "You turn on the next growth channel on your list.",
        how: "There's always one you've been meaning to try. We pick the right one for your business and launch it with real tracking from day one.",
      },
      {
        outcome: "You stop babysitting the marketing yourself.",
        how: "We run it week to week so you get your time back and the numbers keep going up.",
      },
    ],
    helpBody: HELP_BODY,
    ctaHeadline: "Want us to run this for you?",
    ctaSub: "Book a 15-min call. I'll walk you through the plan for your site and we'll see if we're a fit. No pitch, no contract.",
    ctaButton: "Book a 15-min call",
    softClose: "Or just reply to this. I read em all.",
  };
}

function buildSalesEmailContent(
  result: AuditResult,
  businessType: string,
  visitorName: string,
): SalesEmailContent {
  const pillars = assessPillars(result);
  const biz = (businessType || "").trim();
  const kind = classifyBusiness(biz);
  const phrase = bizPhrase(biz, kind);
  const domain = cleanHostname(result.finalUrl);
  const priorities = rankPriorities(pillars, kind);
  const first = firstName(visitorName);
  const opener = first
    ? `Hey ${first}, took a look at ${domain}. Here's the read.`
    : `Alright, took a look at ${domain}. Here's the read.`;

  if (priorities.length === 0) {
    return buildHappyPathContent(opener, phrase);
  }

  const top = priorities[0];
  const moves = priorities.map((pri) => moveFor(pri.pillar.id, kind));
  while (moves.length < 3) moves.push(padMove(moves.length));

  return {
    opener,
    scoreLine: scoreLineFor(priorities.length, phrase),
    painLabel: painLabelFor(top.pillar.id),
    problemBody: problemBodyFor(top.pillar.id, kind, phrase),
    moves,
    helpBody: HELP_BODY,
    ctaHeadline: "Want us to run this for you?",
    ctaSub: "Book a 15-min call. I'll walk you through the plan for your site and we'll see if we're a fit. No pitch, no contract.",
    ctaButton: "Book a 15-min call",
    softClose: "Or just reply to this. I read em all.",
  };
}

// Legacy export. Builds a plain-markdown version of the sales email for
// storage in Supabase (plan_markdown column) and for plantest.ts.
export function buildMarketingPlan(
  result: AuditResult,
  businessType: string,
): string {
  const c = buildSalesEmailContent(result, businessType, "");
  const lines: string[] = [];
  lines.push(c.opener);
  lines.push("");
  lines.push(`_${c.scoreLine}_`);
  lines.push("");
  lines.push(`## The biggest gap`);
  lines.push(`**${c.painLabel}**`);
  lines.push("");
  lines.push(c.problemBody);
  lines.push("");
  lines.push(`## Here's what I'd do`);
  lines.push("");
  c.moves.forEach((m, i) => {
    lines.push(`**${i + 1}. ${m.outcome}**`);
    lines.push(m.how);
    lines.push("");
  });
  lines.push(`## How I can help`);
  lines.push("");
  lines.push(c.helpBody);
  lines.push("");
  lines.push(`## ${c.ctaHeadline}`);
  lines.push("");
  lines.push(c.ctaSub);
  lines.push("");
  lines.push(c.softClose);
  return lines.join("\n");
}

// Pull the hostname out of a URL, stripping query strings, fragments, and
// the leading www. So "https://fastwaterheater.com/?utm_source=google&..."
// becomes "fastwaterheater.com". Used in the email subject and header so
// the display URL doesn't explode into a mile-long tracking blob.
function cleanHostname(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, "");
  } catch {
    return url
      .replace(/^https?:\/\//i, "")
      .replace(/[/?#].*$/, "")
      .replace(/^www\./i, "");
  }
}

// Pull a first name out of "Jane Doe" or "jane". Used for the email opener.
function firstName(name: string): string {
  const clean = (name || "").trim().split(/\s+/)[0] || "";
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function renderAuditEmail(
  result: AuditResult,
  recipientEmail: string,
  businessType: string = "",
  visitorName: string = "",
): { subject: string; html: string; text: string } {
  const displayUrl = cleanHostname(result.finalUrl);
  const subject = result.reachable
    ? `Your custom growth plan`
    : `We couldn't reach ${displayUrl}`;
  const preheader = result.reachable
    ? `This is what you need to be doing.`
    : `Reply with the right URL and I'll run it again.`;
  const fontImport = `<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&display=swap" rel="stylesheet">`;
  const bodyBase = `margin:0;padding:0;background:${EMAIL_COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${EMAIL_COLORS.text};`;

  if (!result.reachable) {
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
${fontImport}
</head>
<body style="${bodyBase}">
  <div style="max-width:600px;margin:0 auto;padding:48px 28px;">
    <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;">Venti Scale</div>
    <h1 style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:32px;font-weight:500;letter-spacing:-0.02em;margin:14px 0 10px;line-height:1.15;color:${EMAIL_COLORS.text};">We couldn't reach your site.</h1>
    <p style="font-size:16px;line-height:1.6;color:${EMAIL_COLORS.textMid};">
      I tried to audit <strong style="color:${EMAIL_COLORS.text};">${escapeHtml(displayUrl)}</strong> but got this error:
    </p>
    <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:8px;padding:16px;font-family:'SF Mono',Consolas,monospace;font-size:13px;color:${EMAIL_COLORS.textMid};margin:16px 0 24px;">
      ${escapeHtml(result.error || "Network error")}
    </div>
    <p style="font-size:15px;line-height:1.6;color:${EMAIL_COLORS.textMid};">Possible causes:</p>
    <ul style="font-size:15px;line-height:1.7;color:${EMAIL_COLORS.textMid};padding-left:20px;">
      <li>The URL is wrong or the site is temporarily down.</li>
      <li>Your host blocks automated requests (some CDNs do this).</li>
      <li>DNS isn't resolving from our server.</li>
    </ul>
    <p style="font-size:15px;line-height:1.6;color:${EMAIL_COLORS.textMid};margin-top:24px;">
      Reply to this email with the correct URL and I'll run it manually.
    </p>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid ${EMAIL_COLORS.border};">
      <p style="font-size:13px;color:${EMAIL_COLORS.textDim};margin:0;">
        Dustin Gilmour<br/>
        <a href="https://www.ventiscale.com" style="color:${EMAIL_COLORS.blue};text-decoration:none;">ventiscale.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
    return {
      subject,
      html,
      text: `I couldn't reach ${displayUrl}: ${result.error}\n\nReply with the correct URL and I'll run it manually.\n\nDustin Gilmour, Venti Scale`,
    };
  }

  const content = buildSalesEmailContent(result, businessType, visitorName);
  const pillars = assessPillars(result);

  // HTML style shorthands for the body sections.
  const sectionLabel = `font-size:10px;font-weight:700;letter-spacing:0.18em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;`;
  const sectionHead = `font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;letter-spacing:-0.015em;color:${EMAIL_COLORS.text};margin:6px 0 14px;line-height:1.25;`;
  const bodyPara = `font-size:15px;line-height:1.65;color:${EMAIL_COLORS.textMid};margin:0 0 14px;`;
  const cardWrap = `background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:14px;padding:26px 26px 22px;margin-top:22px;`;

  // Score → grade letter + accent color.
  const scoreNum = typeof result.score === "number" ? result.score : 0;
  const grade = result.grade || (scoreNum >= 90 ? "A" : scoreNum >= 80 ? "B" : scoreNum >= 70 ? "C" : scoreNum >= 60 ? "D" : "F");
  const scoreColor = scoreNum >= 80 ? EMAIL_COLORS.green : scoreNum >= 60 ? "#FFC850" : "#FF6A5E";

  // Pillar grid: 6 dots in a 2-col layout (table-based for email client compat).
  const pillarOrder: Array<{ key: keyof typeof pillars; label: string }> = [
    { key: "measurement", label: "Measurement" },
    { key: "capture", label: "Email capture" },
    { key: "content", label: "Content engine" },
    { key: "freshness", label: "Content freshness" },
    { key: "distribution", label: "Social presence" },
    { key: "conversion", label: "Conversion tools" },
  ];
  const dotColor = (s: PillarStrength) =>
    s === "strong" ? EMAIL_COLORS.green : s === "weak" ? "#FFC850" : s === "missing" ? "#FF6A5E" : "rgba(255,255,255,0.35)";
  const dotLabel = (s: PillarStrength) =>
    s === "strong" ? "Pass" : s === "weak" ? "Warn" : s === "missing" ? "Fail" : "Skip";
  const pillarRows: string[] = [];
  for (let i = 0; i < pillarOrder.length; i += 2) {
    const left = pillarOrder[i];
    const right = pillarOrder[i + 1];
    const cell = (item: typeof pillarOrder[number] | undefined) => {
      if (!item) return `<td style="width:50%;padding:8px 0;"></td>`;
      const p = pillars[item.key];
      const color = dotColor(p.strength);
      const status = dotLabel(p.strength);
      return `
        <td style="width:50%;padding:9px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td style="padding-right:10px;vertical-align:middle;">
                <div style="width:9px;height:9px;border-radius:50%;background:${color};"></div>
              </td>
              <td style="vertical-align:middle;">
                <div style="font-size:13.5px;color:${EMAIL_COLORS.text};font-weight:500;letter-spacing:-0.005em;">${escapeHtml(item.label)}</div>
                <div style="font-size:11px;color:${EMAIL_COLORS.textDim};letter-spacing:0.04em;text-transform:uppercase;margin-top:1px;">${status}</div>
              </td>
            </tr>
          </table>
        </td>`;
    };
    pillarRows.push(`<tr>${cell(left)}${cell(right)}</tr>`);
  }
  const pillarGridHtml = `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:8px;">
      ${pillarRows.join("")}
    </table>`;

  const movesHtml = content.moves
    .map(
      (m, i) => `
      <div style="margin-bottom:20px;">
        <div style="display:inline-block;width:24px;height:24px;background:${EMAIL_COLORS.cardAlt};border:1px solid ${EMAIL_COLORS.borderStrong};border-radius:6px;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:${EMAIL_COLORS.text};margin-right:10px;vertical-align:top;">${i + 1}</div>
        <div style="display:inline-block;width:calc(100% - 40px);vertical-align:top;">
          <div style="font-size:14.5px;font-weight:700;color:${EMAIL_COLORS.text};letter-spacing:-0.005em;line-height:1.4;">
            ${escapeHtml(m.outcome)}
          </div>
          <div style="font-size:14px;color:${EMAIL_COLORS.textMid};line-height:1.6;margin-top:4px;">
            ${escapeHtml(m.how)}
          </div>
        </div>
      </div>`,
    )
    .join("");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
${fontImport}
</head>
<body style="${bodyBase}">
  <!-- Preheader (hidden, shows in inbox preview next to subject) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">
    ${escapeHtml(preheader)}
  </div>
  <div style="max-width:640px;margin:0 auto;padding:44px 24px 56px;">

    <!-- Header -->
    <div style="${sectionLabel}">Venti Scale</div>
    <h1 style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:36px;font-weight:500;letter-spacing:-0.025em;margin:12px 0 6px;line-height:1.1;color:${EMAIL_COLORS.text};">
      Your custom growth plan
    </h1>
    <div style="font-size:14px;font-weight:500;color:${EMAIL_COLORS.textMid};letter-spacing:-0.005em;">
      ${escapeHtml(displayUrl)}
    </div>

    <!-- Opener -->
    <p style="font-size:15.5px;line-height:1.65;color:${EMAIL_COLORS.textMid};margin:24px 0 0;">
      ${escapeHtml(content.opener)}
    </p>

    <!-- Score Hero + Findings Grid -->
    <div style="${cardWrap}">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;width:140px;padding-right:18px;">
            <div style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:64px;font-weight:500;line-height:1;color:${scoreColor};letter-spacing:-0.03em;">
              ${scoreNum}
            </div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-top:6px;">
              out of 100 · grade ${escapeHtml(grade)}
            </div>
          </td>
          <td style="vertical-align:middle;border-left:1px solid ${EMAIL_COLORS.border};padding-left:22px;">
            <div style="${sectionLabel}">The read</div>
            <div style="font-size:16px;line-height:1.5;color:${EMAIL_COLORS.text};margin-top:6px;font-weight:500;letter-spacing:-0.005em;">
              ${escapeHtml(content.scoreLine)}
            </div>
          </td>
        </tr>
      </table>
      <div style="border-top:1px solid ${EMAIL_COLORS.border};margin-top:22px;padding-top:18px;">
        <div style="${sectionLabel}">What we found</div>
        ${pillarGridHtml}
      </div>
    </div>

    <!-- The Biggest Gap -->
    <div style="${cardWrap}">
      <div style="${sectionLabel}">The biggest gap</div>
      <div style="${sectionHead}">
        ${escapeHtml(content.painLabel)}
      </div>
      <p style="${bodyPara}">${escapeHtml(content.problemBody)}</p>
    </div>

    <!-- The 3 Moves -->
    <div style="${cardWrap}">
      <div style="${sectionLabel}">Here's what I'd do</div>
      <div style="${sectionHead}">
        3 moves, in order
      </div>
      ${movesHtml}
    </div>

    <!-- How I Can Help -->
    <div style="${cardWrap}">
      <div style="${sectionLabel}">How I can help</div>
      <p style="${bodyPara}margin-top:12px;">${escapeHtml(content.helpBody)}</p>
    </div>

    <!-- CTA -->
    <div style="margin-top:32px;padding:34px 28px;background:${EMAIL_COLORS.cardAlt};border:1px solid ${EMAIL_COLORS.borderStrong};border-radius:14px;text-align:center;">
      <div style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;line-height:1.25;color:${EMAIL_COLORS.text};letter-spacing:-0.015em;">
        ${escapeHtml(content.ctaHeadline)}
      </div>
      <p style="font-size:14.5px;line-height:1.65;color:${EMAIL_COLORS.textMid};margin:14px 0 24px;max-width:480px;margin-left:auto;margin-right:auto;">
        ${escapeHtml(content.ctaSub)}
      </p>
      <a href="https://www.ventiscale.com" style="display:inline-block;background:${EMAIL_COLORS.red};color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:10px;letter-spacing:0.01em;">
        ${escapeHtml(content.ctaButton)}
      </a>
      <div style="margin-top:16px;font-size:12px;color:${EMAIL_COLORS.textDim};">
        ${escapeHtml(content.softClose)}
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:22px;border-top:1px solid ${EMAIL_COLORS.border};font-size:12px;color:${EMAIL_COLORS.textDim};line-height:1.7;">
      Dustin Gilmour · Venti Scale<br/>
      Sent to ${escapeHtml(recipientEmail)} because you asked for a free audit at <a href="https://www.ventiscale.com" style="color:${EMAIL_COLORS.blue};text-decoration:none;">ventiscale.com</a>.
    </div>

  </div>
</body>
</html>`;

  // Plain-text fallback.
  const movesText = content.moves
    .map((m, i) => `${i + 1}. ${m.outcome}\n   ${m.how}`)
    .join("\n\n");

  const textLines = [
    `Your custom growth plan for ${displayUrl}`,
    preheader,
    ``,
    content.opener,
    ``,
    `${scoreNum}/100 · GRADE ${grade}`,
    content.scoreLine,
    ``,
    `THE BIGGEST GAP`,
    content.painLabel,
    ``,
    content.problemBody,
    ``,
    `HERE'S WHAT I'D DO`,
    ``,
    movesText,
    ``,
    `HOW I CAN HELP`,
    ``,
    content.helpBody,
    ``,
    content.ctaHeadline.toUpperCase(),
    content.ctaSub,
    ``,
    `${content.ctaButton}: https://www.ventiscale.com`,
    content.softClose,
    ``,
    `Dustin Gilmour, Venti Scale`,
  ];

  return { subject, html, text: textLines.join("\n") };
}
