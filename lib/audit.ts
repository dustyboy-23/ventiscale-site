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
      fix: "Install Google Analytics 4 and a Meta Pixel before you run any paid ads. This is table stakes.",
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

function renderPlanMarkdown(markdown: string): string {
  // Simple, email-safe markdown: ## headings, numbered lists, paragraphs.
  // No nesting, no inline formatting beyond bold (**x**).
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];
  let inOl = false;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length === 0) return;
    const joined = paraBuf.join(" ").trim();
    if (joined) {
      out.push(
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${EMAIL_COLORS.textMid};">${inlineFormat(joined)}</p>`,
      );
    }
    paraBuf = [];
  };
  const closeList = () => {
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      flushPara();
      closeList();
      out.push(
        `<h2 style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;letter-spacing:-0.01em;color:${EMAIL_COLORS.text};margin:28px 0 12px;line-height:1.25;">${escapeHtml(h2[1])}</h2>`,
      );
      continue;
    }
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (!inOl) {
        out.push(
          `<ol style="margin:0 0 16px;padding-left:22px;color:${EMAIL_COLORS.textMid};font-size:15px;line-height:1.65;">`,
        );
        inOl = true;
      }
      out.push(`<li style="margin-bottom:8px;">${inlineFormat(ol[2])}</li>`);
      continue;
    }
    // plain line, accumulate into paragraph
    if (inOl) closeList();
    paraBuf.push(line.trim());
  }
  flushPara();
  closeList();
  return out.join("\n");
}

function inlineFormat(s: string): string {
  // Escape first, then restore bold.
  let out = escapeHtml(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, `<strong style="color:${EMAIL_COLORS.text};">$1</strong>`);
  return out;
}

// ──────────────────────────────────────────────────────────
// Marketing plan generator
//
// Builds a real adaptive marketing plan from the audit findings. Each of
// the 6 marketing pillars (measurement, capture, content, freshness,
// distribution, conversion) gets its own narrative + 30-day actions. The
// opener, gap list, and priority ordering change based on what the site
// actually has vs what it's missing, so no two plans read the same.
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
  if (/saas|software|app|platform|tool|api|dev\b|startup/.test(s)) return "saas";
  if (/agency|studio|marketing|design|creative|seo\b|ads/.test(s)) return "agency";
  if (/coach|course|consult|mentor|teacher|info|education|training|academy/.test(s)) return "coach";
  if (/restaurant|cafe|bar\b|diner|bakery|food truck|eatery/.test(s)) return "restaurant";
  if (/clean|plumb|hvac|electric|roof|landscap|contract|handyman|install|repair|salon|spa|med spa|dentist|chiro|clinic|gym|studio\b|local|service/.test(s)) return s.includes("studio") ? "agency" : /clean|plumb|hvac|electric|roof|landscap|contract|handyman|repair/.test(s) ? "local" : "service";
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

// "Why this is #1 for YOU" paragraph. Reasons from the specific business kind
// so the same gap reads differently for a coach vs an ecom brand.
function priorityNarrative(
  priority: RankedPriority,
  biz: string,
  kind: BusinessKind,
): string {
  const p = priority.pillar;
  const isMissing = p.strength === "missing";
  const phrase = bizPhrase(biz, kind);

  switch (p.id) {
    case "pixels":
      if (isMissing) {
        const why: Record<BusinessKind, string> = {
          ecommerce: `For ${phrase}, this is costing you real money right now. Meta and Google both reward advertisers who feed them conversion data, and penalize the ones who don't. Without pixels, you're paying CPMs but missing the retargeting pool that makes ecommerce math actually work. Install them and your cost per purchase usually drops 20 to 40 percent inside the first month.`,
          saas: `For ${phrase}, no tracking means no funnel. You can't tell me which page drives signups, which signups convert to trials, or which trials become paid. Every product decision and every ad dollar is a guess. Fix this and suddenly your whole team argues about evidence instead of opinions.`,
          service: `For ${phrase}, tracking is what turns your website from a brochure into a lead machine. Right now you have no idea which visitors become enquiries and which bounce. Every ad dollar, every referral, every Google search gets mixed together. Install pixels and you start seeing the real path your best clients take before they book.`,
          agency: `For ${phrase}, this is the one you should be embarrassed about — you sell marketing and your own site isn't tracking anything. Clients check. Prospects check. Install this today and practice what you preach.`,
          coach: `For ${phrase}, tracking is the difference between building a cold audience and just hoping organic traffic buys. Pixels let you retarget everyone who lands on a sales page and doesn't convert. That retargeting audience is almost always where the next enrollment comes from.`,
          local: `For ${phrase}, tracking tells you which service page earns the most calls and which ones are dead weight. Local businesses leak leads to call tracking dead spots all the time. Get the pixel in and the conversion events wired so the next ad you run actually has a target.`,
          creator: `For ${phrase}, pixels unlock paid amplification of your best organic wins. Tracked visitors become retargeting audiences, and retargeting audiences become paid ad budget that returns. Without tracking, you're leaving the easiest win on the table.`,
          restaurant: `For ${phrase}, tracking is how you turn website visits into reservations and repeat diners. Right now you can't tell which page drives bookings. Install GA4 and Meta Pixel so you can retarget everyone who looked at your menu and didn't book.`,
          generic: `Every other decision you make after this depends on it. Ad spend, email strategy, which pages to optimize. Without tracking you're guessing at all of it.`,
        };
        return `You have no tracking pixels installed anywhere on your site. No Meta Pixel, no GA4, no Tag Manager. ${why[kind]}`;
      }
      return `Your tracking is partial, not complete. ${p.detail} That gap matters because the channels running without full attribution always end up looking better than they really are, and the ones doing the real work look quieter than they are. I'd audit and complete the stack in week one.`;

    case "email_capture":
      if (isMissing) {
        const why: Record<BusinessKind, string> = {
          ecommerce: `For ${phrase}, the math is brutal. About 98 percent of first-time visitors don't buy. If you're not capturing them you're burning the other 98. The welcome sequence you build next will do 20 to 30 percent of your total email revenue for the first year. This is the highest-leverage 2 hours of work on your whole site.`,
          saas: `For ${phrase}, email is how you convert cold traffic into trials on their second or third visit, not their first. Nobody signs up to a SaaS the first time they land. A simple "get our product updates" popup tied to a trial CTA will lift your signup rate within days.`,
          service: `For ${phrase}, email capture is what lets you stay in front of prospects who aren't ready to book today. Most service clients research for weeks before they reach out. If you're not capturing them during that research, a competitor with a newsletter is.`,
          agency: `For ${phrase}, a capture + nurture sequence is how you prove to prospects that you actually know what you're doing before the discovery call. The best agencies close deals through newsletters, not cold outreach.`,
          coach: `For ${phrase}, this is the entire game. Your business runs on email. If you don't have a list and a nurture sequence, you're building on rented social platforms and watching the roof cave in every algorithm change. A popup, a lead magnet, and a 5-email welcome sequence is your highest priority this month.`,
          local: `For ${phrase}, an email list is how you stop relying on cold leads and start booking from a warm audience. Even for a local business, a monthly newsletter with a seasonal offer doubles as cheap retention.`,
          creator: `For ${phrase}, your email list is the only audience asset you actually own. Everything else is rented. This is the most important button on your site.`,
          restaurant: `For ${phrase}, email means your regulars come back more often and new visitors book their second meal. A simple capture with a "first-visit drink on us" offer funds itself on the first night someone walks in.`,
          generic: `No capture means every non-buyer is gone forever. Fix this once and it runs forever.`,
        };
        return `I couldn't find any email capture on your site. ${why[kind]}`;
      }
      return `You have a signup form but it's not pulling its weight. ${p.detail} A capture that exists without a real offer and a sequence behind it is just decoration. I'd rewrite the offer and wire up a 5-email welcome this week.`;

    case "content_hub":
      if (isMissing) {
        const why: Record<BusinessKind, string> = {
          ecommerce: `For ${phrase}, content is how you show up in Google when buyers are researching before they purchase. "Best X for Y" searches are where 40 percent of ecom traffic comes from and right now you're invisible to all of it. A handful of buyer-intent blog posts can unlock a channel that runs forever with no ad spend.`,
          saas: `For ${phrase}, content IS distribution. SaaS founders who skip the blog end up trapped in paid forever. The founders who ship one good article a week for a year usually have organic out-earning paid by month 18. There is no shortcut and no substitute.`,
          service: `For ${phrase}, content is how you rank for the 50 long-tail "how do I..." questions your prospects are typing into Google right now. Each one you answer becomes a landing page that generates leads in its sleep. No content hub means 100 percent of your leads have to come from referrals or ads.`,
          agency: `For ${phrase}, your content hub is your sales pitch. Prospects judge your expertise by how you write about it. If there's nothing there, the pitch writes itself: "why should I hire you when you don't even write about your own work?"`,
          coach: `For ${phrase}, content is how you build the trust that lets a cold stranger pay you thousands of dollars. The coaching business model is content + proof + offer. You're missing the first leg of the tripod.`,
          local: `For ${phrase}, local SEO rewards businesses that publish regularly. One blog post a month targeting your city + service combinations is usually enough to outrank 80 percent of your competition in the local pack.`,
          creator: `For ${phrase}, the content IS the business. A thin blog or no blog is a signal to your audience that you're not really committed to the long game.`,
          restaurant: `For ${phrase}, a content section with seasonal menus, chef stories, and local partnerships is what helps you rank for "restaurants near me" in Google's local results.`,
          generic: `Content is how you stop renting attention and start owning it. This gap compounds every month you don't close it.`,
        };
        return `There's no blog or content library on your site. ${why[kind]}`;
      }
      return `Your content section exists but it's thin. ${p.detail} The fix isn't starting from scratch, it's commitment to cadence and topic clustering so each new post builds on the last.`;

    case "content_fresh":
      return isMissing
        ? `Your blog exists but hasn't been updated in a long time. ${p.detail} Abandoned blogs are worse than no blog because Google notices, readers notice, and it signals "this business stopped caring." Restart the cadence, even at one post a week, and the freshness signal flips back in your favor within a month.`
        : `Your cadence is inconsistent. ${p.detail} Regular publishing beats sporadic brilliance because Google rewards the drumbeat, not the individual post quality.`;

    case "social":
      return isMissing
        ? `No social links anywhere on your site. ${p.detail} For ${phrase}, that's two problems at once. Customers check social to decide if you're real, and algorithms check social to decide if you exist. Adding the links takes 5 minutes. Not having them costs you trust on every visit.`
        : `Your social footprint is sparse. ${p.detail} You don't need to be on every platform, but the ones your customers live on need to show up in your footer.`;

    case "conversion":
      return isMissing
        ? `No live chat or conversion tool on the site. ${p.detail} For ${phrase} that's a dropped baton every single time a high-intent visitor has a quick question and no way to ask it. "I'll come back later" almost always means never.`
        : `Your conversion tooling is present but underused. ${p.detail}`;

    default:
      return p.detail;
  }
}

function openingRead(
  pillars: Record<string, Pillar>,
  biz: string,
  domain: string,
  kind: BusinessKind,
): string {
  const values = Object.values(pillars);
  const missing = values.filter((p) => p.strength === "missing").length;
  const weak = values.filter((p) => p.strength === "weak").length;
  const strong = values.filter((p) => p.strength === "strong").length;
  const phrase = bizPhrase(biz, kind);

  if (missing >= 4) {
    return `I ran a real audit on ${domain} and here's the honest read. You're running ${phrase} with most of the marketing infrastructure still missing. I know how that sounds but stay with me. Most founders I work with look exactly like this when we start, and it's actually the best place to build from because we get to install things right the first time instead of untangling someone else's half-working stack. The roadmap below is ordered specifically for your situation.`;
  }
  if (missing >= 2) {
    return `I ran a real audit on ${domain} and here's what I see. You've got some of the pieces in place for ${phrase}, and a few foundational ones that aren't wired up yet. Each of those gaps is quietly costing you growth every month. The good news is none of them are hard to fix once you know which order to tackle them in, and that order matters a lot. Here's how I'd rank them for you specifically.`;
  }
  if (missing === 1) {
    return `I ran a real audit on ${domain} and honestly, most of the fundamentals are already there for ${phrase}. There's one real gap that's acting as the bottleneck right now. Close it, and everything else you're already doing starts compounding on top of a stronger base. Here's what I'd focus on.`;
  }
  if (weak >= 2) {
    return `I ran a real audit on ${domain}. No glaring holes. ${strong} of 6 foundational pillars are solid for ${phrase}. What I see instead is a few things that are present but not firing at full strength. This is optimization territory, which is a better conversation to have than "we need to rebuild from scratch." Here's where I'd push for more leverage.`;
  }
  if (weak === 1) {
    return `Honestly, ${phrase} is in great shape. ${strong} of 6 pillars are strong and only one needs tightening. This is the profile of a brand that's ready to scale, not one that needs to rebuild. Here's the single area where I'd push for more.`;
  }
  return `Your marketing system is already the kind of thing most brands are trying to build toward. Measurement, capture, content, distribution — all firing for ${phrase}. The audit gave you a clean grade because you've done the work. The opportunity now is compounding what's already working, not fixing what isn't.`;
}

function thirtyDayActions(
  pillars: Record<string, Pillar>,
  biz: string,
): string[] {
  const actions: string[] = [];
  const bizLower = biz.toLowerCase();
  const mNeed = pillars.measurement.strength !== "strong";
  const cNeed = pillars.capture.strength !== "strong";
  const contentNeed =
    pillars.content.strength !== "strong" ||
    pillars.freshness.strength === "missing";
  const allStrong = !mNeed && !cNeed && !contentNeed;

  if (allStrong) {
    actions.push(
      `**Week 1 is a measurement stack audit.** Even strong stacks drift. I want to confirm your Pixel and GA4 are firing clean events for add-to-cart, checkout, and purchase, and that your retargeting audiences are populated and recent. Fix the data before we touch the strategy.`,
    );
    actions.push(
      `**Week 2 is a conversion rate sprint.** One landing page, one email, one ad creative, all tested against your current baseline. We find the weakest link in your funnel for ${bizLower} and we reinforce it.`,
    );
    actions.push(
      `**Week 3 to 4 we open a new channel.** Based on your data, we pick the single highest leverage channel you're not running yet, and we launch with a real budget, a real creative, and real tracking in place from day one.`,
    );
    return actions;
  }

  if (mNeed) {
    actions.push(
      `**Week 1 is measurement.** We install Meta Pixel, GA4, and Google Tag Manager on day one. Configure conversion events for add-to-cart, checkout, and purchase so the data actually flows back to us. Build a 180 day retargeting audience in Meta Ads Manager so it's ready when we start spending.`,
    );
  }
  if (cNeed) {
    actions.push(
      `**Week 1 to 2 is email capture.** We wire Klaviyo or Mailchimp to your site with a welcome popup that offers something real. Not "10% off." For ${bizLower} the right offer is usually a specific guide, a sizing chart, a style quiz, or early access to a drop. Whatever the ask, the welcome sequence is 5 emails over 7 days doing the job of the salesperson you don't have.`,
    );
  }
  if (contentNeed) {
    actions.push(
      `**Week 2 to 4 is content kickoff.** We ship 4 pieces of cornerstone content in the first month. Not blog filler. Real SEO-targeted articles answering the exact questions your customers ask before they buy. We pull the topics from your existing customer emails, your reviews, and the Search Console queries you're already ranking for.`,
    );
  }
  if (mNeed || cNeed) {
    actions.push(
      `**End of month 1 we switch on paid traffic.** Small budget, measured carefully, feeding data back into the pixel and the email list we just built. We're not trying to scale in month one. We're proving the unit economics and building the audience pool that powers everything after.`,
    );
  }
  return actions;
}

function sixtyNinetyActions(
  pillars: Record<string, Pillar>,
  biz: string,
): string[] {
  const bizLower = biz.toLowerCase();
  const wasStrong =
    pillars.measurement.strength === "strong" &&
    pillars.capture.strength === "strong" &&
    pillars.content.strength === "strong";

  if (wasStrong) {
    return [
      `We scale what's working and cut what isn't. By day 60 we have 30 days of real data across the new channel, the CRO sprint, and the existing stack. Whichever channel is earning its keep gets double the budget. The rest get killed without sentiment.`,
      ``,
      `Content goes from optimization to compounding. Monthly volume for ${bizLower} goes up, we add internal linking between posts, and we start chasing specific keyword clusters instead of one-off posts. By day 90 the organic traffic curve should start bending up.`,
    ];
  }

  return [
    `With measurement, capture, and a content foundation live, the next 60 days are about compounding what we built.`,
    ``,
    `We scale paid traffic based on the unit economics we proved in month 1. Whichever channel is earning its keep gets more budget. The others get cut.`,
    ``,
    `We also add email automation beyond the welcome sequence. Abandoned cart, post-purchase, winback, and a monthly newsletter for ${bizLower} that actually gets read because it says something worth reading.`,
    ``,
    `Content continues at a steady 4 to 6 pieces a month, each one targeting a specific search intent. By day 90 the pieces we shipped in month 1 should start ranking, and you should see your first real organic traffic lift.`,
  ];
}

function oneThingThisWeek(pillars: Record<string, Pillar>): string {
  if (pillars.measurement.strength === "missing") {
    return `Install GA4 and a Meta Pixel on your site today. Both are free. Both take an hour with Shopify, less if you use a tag manager. Both unblock literally every marketing decision you'll make for the next year. If you do nothing else from this email, do this.`;
  }
  if (pillars.capture.strength === "missing") {
    return `Add a welcome popup to your site this week with one specific offer. Not a generic "10% off." A guide, a sample, a style quiz, something your ideal customer would actually want. Wire it to Klaviyo or Mailchimp, set up a 5 email welcome sequence, and ship it. About 2 hours of work for an asset that runs forever.`;
  }
  if (pillars.content.strength === "missing") {
    return `Write one blog post this week. Pick the single most common question your last 5 customers asked before they bought. Answer it in 800 words. Publish it. That's it. One post beats a plan for ten posts that never ship.`;
  }
  if (pillars.freshness.strength === "missing") {
    return `Publish one new post this week, even a short one. Your blog has gone quiet and that's telling Google your site is abandoned. A single 600 word post this week is enough to restart the clock. Don't overthink it.`;
  }
  if (pillars.distribution.strength === "missing") {
    return `Add your Instagram, TikTok, and one other relevant social handle to your footer this week. Customers check. Algorithms check. If the links aren't there, you look invisible to both.`;
  }
  if (pillars.measurement.strength === "weak") {
    return `Audit your existing tracking this week. Open GA4 and your Meta Pixel and confirm your key events (add to cart, checkout, purchase) are firing clean. A tracking stack that runs on broken events is worse than no stack because it makes you confident in bad data.`;
  }
  if (pillars.capture.strength === "weak") {
    return `Rewrite your welcome popup offer. If it's generic, make it specific. If it's specific, make it irresistible. One hour of copy work is worth weeks of capture optimization because the offer does 80% of the work.`;
  }
  return `Open Google Search Console and look at the top 10 queries you're ranking 5 to 20 for. Pick the one closest to a buying keyword for your business, and spend an afternoon rewriting whatever page ranks for it so it's the best answer on the internet. One week of work that can move real revenue.`;
}

export function buildMarketingPlan(
  result: AuditResult,
  businessType: string,
): string {
  const pillars = assessPillars(result);
  const biz = (businessType || "").trim();
  const kind = classifyBusiness(biz);
  const domain = result.finalUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const priorities = rankPriorities(pillars, kind);

  const lines: string[] = [];

  lines.push("## Here's what I see on your site");
  lines.push("");
  lines.push(openingRead(pillars, biz, domain, kind));
  lines.push("");

  lines.push("## Your roadmap, ranked in order of impact");
  lines.push("");
  if (priorities.length === 0) {
    lines.push(
      "Nothing broken to rank. Every pillar I checked is firing. The next moves are about sharpening what already works, not fixing what doesn't. Skip ahead to the 30 day plan below for what that looks like.",
    );
    lines.push("");
  } else {
    const rankLabel = ["**#1 priority**", "**#2 priority**", "**#3 priority**"];
    priorities.forEach((pri, i) => {
      lines.push(`${rankLabel[i]}: **${pri.pillar.name}.**`);
      lines.push("");
      lines.push(priorityNarrative(pri, biz, kind));
      lines.push("");
    });
  }

  lines.push("## What the first 30 days look like if we work together");
  lines.push("");
  for (const a of thirtyDayActions(pillars, biz)) {
    lines.push(a);
    lines.push("");
  }

  lines.push("## What happens in days 60 to 90");
  lines.push("");
  for (const a of sixtyNinetyActions(pillars, biz)) {
    lines.push(a);
  }
  lines.push("");

  lines.push("## The one thing I'd do this week, even without us");
  lines.push("");
  lines.push(oneThingThisWeek(pillars));

  return lines.join("\n");
}

function groupEvidence(checks: AuditCheck[]): {
  growth: AuditCheck[];
  content: AuditCheck[];
  basics: AuditCheck[];
} {
  const growthIds = new Set(["pixels", "email_capture", "conversion"]);
  const contentIds = new Set(["content_hub", "content_fresh", "social"]);
  const growth: AuditCheck[] = [];
  const content: AuditCheck[] = [];
  const basics: AuditCheck[] = [];
  for (const c of checks) {
    if (growthIds.has(c.id)) growth.push(c);
    else if (contentIds.has(c.id)) content.push(c);
    else basics.push(c);
  }
  return { growth, content, basics };
}

export function renderAuditEmail(
  result: AuditResult,
  recipientEmail: string,
  businessType: string = "",
): { subject: string; html: string; text: string } {
  const displayUrl = result.finalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const subject = result.reachable
    ? `Your Venti Scale marketing plan for ${displayUrl}`
    : `We couldn't reach ${displayUrl}. Here's what that means.`;

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

  const fails = result.checks.filter((c) => c.status === "fail");
  const warns = result.checks.filter((c) => c.status === "warn");
  const passes = result.checks.filter((c) => c.status === "pass");

  const planMarkdown = buildMarketingPlan(result, businessType);
  const planHtml = renderPlanMarkdown(planMarkdown);

  const evidence = groupEvidence(result.checks);

  const renderEvidenceCheck = (c: AuditCheck): string => `
    <tr>
      <td style="padding:10px 0;border-top:1px solid ${EMAIL_COLORS.border};vertical-align:top;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align:top;width:56px;padding-right:10px;">${darkStatusBadge(c.status)}</td>
            <td style="vertical-align:top;">
              <div style="font-size:13px;font-weight:600;color:${EMAIL_COLORS.text};">${escapeHtml(c.label)}</div>
              <div style="font-size:12px;color:${EMAIL_COLORS.textDim};line-height:1.5;margin-top:3px;">${escapeHtml(c.detail)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  const evidenceSection = (title: string, items: AuditCheck[]): string => {
    if (items.length === 0) return "";
    return `
      <div style="margin-top:22px;">
        <div style="font-size:10px;font-weight:600;letter-spacing:0.14em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-bottom:4px;">${title}</div>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${items.map(renderEvidenceCheck).join("")}
        </table>
      </div>
    `;
  };

  const fetchedDate = new Date(result.fetchedAt);
  const timeString = fetchedDate.toUTCString().replace("GMT", "UTC");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
${fontImport}
</head>
<body style="${bodyBase}">
  <div style="max-width:640px;margin:0 auto;padding:48px 28px 64px;">

    <!-- Header -->
    <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;">Venti Scale · Your marketing plan</div>
    <h1 style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:34px;font-weight:500;letter-spacing:-0.02em;margin:14px 0 10px;line-height:1.12;color:${EMAIL_COLORS.text};">
      Your marketing plan for<br/>
      <span style="color:${EMAIL_COLORS.blue};">${escapeHtml(displayUrl)}</span>
    </h1>
    <p style="font-size:14px;line-height:1.55;color:${EMAIL_COLORS.textDim};margin:0 0 8px;">
      Generated ${escapeHtml(timeString)} from ${result.checks.length} signals on your homepage.
    </p>

    <!-- Snapshot strip -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0 8px;">
      <tr>
        <td style="width:33.33%;padding:4px;">
          <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:10px;padding:18px 14px;text-align:center;">
            <div style="font-family:Fraunces,Georgia,serif;font-size:28px;font-weight:500;color:${EMAIL_COLORS.green};line-height:1;">${passes.length}</div>
            <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-top:6px;">Wins</div>
          </div>
        </td>
        <td style="width:33.33%;padding:4px;">
          <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:10px;padding:18px 14px;text-align:center;">
            <div style="font-family:Fraunces,Georgia,serif;font-size:28px;font-weight:500;color:#FFC850;line-height:1;">${warns.length}</div>
            <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-top:6px;">Gaps</div>
          </div>
        </td>
        <td style="width:33.33%;padding:4px;">
          <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:10px;padding:18px 14px;text-align:center;">
            <div style="font-family:Fraunces,Georgia,serif;font-size:28px;font-weight:500;color:${EMAIL_COLORS.red};line-height:1;">${fails.length}</div>
            <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-top:6px;">Blockers</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Plan body -->
    <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:12px;padding:28px 26px;margin-top:20px;">
      ${planHtml}
    </div>

    <!-- CTA -->
    <div style="margin-top:36px;padding:32px 28px;background:${EMAIL_COLORS.cardAlt};border:1px solid ${EMAIL_COLORS.borderStrong};border-radius:12px;text-align:center;">
      <div style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;line-height:1.3;color:${EMAIL_COLORS.text};">
        Want me to execute this plan for you?
      </div>
      <p style="font-size:14px;line-height:1.6;color:${EMAIL_COLORS.textMid};margin:12px 0 22px;">
        Venti Scale runs your content, email, ads, SEO, and reporting as your full marketing team, built around your brand voice. One quick call, no contract.
      </p>
      <a href="https://www.ventiscale.com" style="display:inline-block;background:${EMAIL_COLORS.red};color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:14px 26px;border-radius:8px;letter-spacing:0.01em;">
        Start a quick call
      </a>
    </div>

    <!-- Supporting evidence -->
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid ${EMAIL_COLORS.border};">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-bottom:4px;">Supporting evidence</div>
      <p style="font-size:12px;line-height:1.55;color:${EMAIL_COLORS.textDim};margin:6px 0 0;">The raw signals the plan is built on. Skim if you want the receipts.</p>
      ${evidenceSection("Growth foundation", evidence.growth)}
      ${evidenceSection("Content engine", evidence.content)}
      ${evidenceSection("Website basics", evidence.basics)}
    </div>

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid ${EMAIL_COLORS.border};font-size:12px;color:${EMAIL_COLORS.textDim};line-height:1.65;">
      Sent to ${escapeHtml(recipientEmail)} because you ran a free audit at <a href="https://www.ventiscale.com" style="color:${EMAIL_COLORS.blue};text-decoration:none;">ventiscale.com</a>. Reply any time.<br/><br/>
      Dustin Gilmour, Venti Scale
    </div>

  </div>
</body>
</html>`;

  // Plain-text fallback. Claude markdown renders cleanly as-is.
  const textLines = [
    `Your Venti Scale marketing plan for ${displayUrl}`,
    `Generated ${timeString}`,
    ``,
    `${passes.length} wins · ${warns.length} gaps · ${fails.length} blockers`,
    ``,
    planMarkdown,
    ``,
    `Want me to execute this plan for you? Start a quick call: https://www.ventiscale.com`,
    ``,
    `Dustin Gilmour, Venti Scale`,
  ];

  return { subject, html, text: textLines.join("\n") };
}
