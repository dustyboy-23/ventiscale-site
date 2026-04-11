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

function pillarNarrative(p: Pillar, biz: string): string {
  const isMissing = p.strength === "missing";
  const bizLower = biz.toLowerCase();
  switch (p.id) {
    case "pixels":
      return isMissing
        ? `I didn't find any tracking pixels on your site. No Meta Pixel, no GA4, no Google Tag Manager. Every dollar of ad spend you run right now is a guess, and every visitor who bounces is a lost signal you can't retarget. Measurement is always move one because every downstream decision depends on it.`
        : `You have partial measurement in place but not the full stack. ${p.detail} The gap matters because any channel you run without full attribution is running blind, and you end up spending money on the channels that look loudest instead of the ones that actually convert.`;
    case "email_capture":
      return isMissing
        ? `No email capture anywhere I could find on the site. Every visitor who lands here and isn't ready to buy right this second walks away and you have no way to pull them back. That's the single most expensive leak in DTC, and it's a 30 minute fix the first time we wire it up.`
        : `There's some form of signup on the page but it's not doing the job. ${p.detail} A capture that doesn't capture is worse than no capture because it takes up attention without earning the return.`;
    case "content_hub":
      return isMissing
        ? `No blog, no content library, no evergreen assets working for you while you sleep. For ${bizLower} that means zero organic traffic compounding over time. Every visitor right now comes from paid or from word of mouth. Content is how you stop renting attention and start owning it.`
        : `You have a blog or content section but it's underbuilt. ${p.detail} The gap is depth, not existence. A thin content hub is almost worse than none because it sets an expectation and doesn't deliver.`;
    case "content_fresh":
      return isMissing
        ? `Your blog exists but the latest post is stale. Google treats abandoned blogs the same way it treats broken links. Cadence matters more than volume, and right now your cadence reads as "gave up."`
        : `Your blog is active but the cadence is inconsistent. ${p.detail} Regular publishing beats occasional brilliance every time because Google rewards the signal that you're alive.`;
    case "social":
      return isMissing
        ? `I couldn't find any social links on your site. For ${bizLower} in 2026, that's both a trust signal problem and a distribution problem. Customers check social to see if you're real. Algorithms check social to see if you exist at all.`
        : `You're on some platforms but not enough of them. ${p.detail} A sparse social footprint is a missed distribution channel, especially if your audience lives on one of the platforms you're not on yet.`;
    case "conversion":
      return isMissing
        ? `No live chat or conversion widget on the site. High intent visitors with a quick question have no way to ask it, and "I'll come back to this later" almost always means "I never come back."`
        : `You have some conversion tooling in place but it isn't optimized. ${p.detail}`;
    default:
      return p.detail;
  }
}

function openingParagraph(
  pillars: Record<string, Pillar>,
  biz: string,
  domain: string,
): string {
  const values = Object.values(pillars);
  const missing = values.filter((p) => p.strength === "missing").length;
  const weak = values.filter((p) => p.strength === "weak").length;
  const strong = values.filter((p) => p.strength === "strong").length;
  const strongNames = values
    .filter((p) => p.strength === "strong")
    .map((p) => p.name.toLowerCase());

  const bizLower = biz.toLowerCase();
  if (missing >= 4) {
    return `You're running ${bizLower} at ${domain} with close to a blank slate on the marketing side. That's not a criticism. Most founders I talk to are exactly here before they hire us, and it's actually the best place to build from because we get to set the system up right instead of untangling someone else's half-working stack. The gaps below are the ones I'd close first, in this order.`;
  }
  if (missing >= 2) {
    const strongPhrase =
      strongNames.length === 0
        ? "the basics on the site"
        : strongNames.length === 1
          ? `${strongNames[0]} already working`
          : `${strongNames.slice(0, -1).join(", ")} and ${strongNames[strongNames.length - 1]} already in place`;
    return `You've got some of the pieces together but the system isn't wired up yet. I can see ${strongPhrase} for ${bizLower} at ${domain}, which is a real starting point. The ${missing} foundational gaps I found below are each quietly costing you growth every month you don't close them.`;
  }
  if (missing === 1) {
    return `You're running a real marketing operation and most of the fundamentals are in place for ${bizLower}. One specific gap is the bottleneck right now. Close it, and everything else you're already doing compounds on top of what you have.`;
  }
  if (weak >= 2) {
    return `Your foundation is solid. No glaring holes across the ${values.length} pillars I assessed for ${bizLower} at ${domain}. What I see is a few things that are present but not firing at full strength. This is optimization territory, not repair. Different kind of engagement, but a higher ceiling to push against.`;
  }
  if (weak === 1) {
    return `Honestly, your marketing fundamentals are in great shape. ${strong} of ${values.length} pillars are strong, and only one needs tightening. This is the profile of a brand that's ready to scale, not one that needs to rebuild.`;
  }
  return `Your marketing system is already the kind of thing most brands are trying to build toward. Measurement, capture, content, distribution — all firing. This audit is giving you a clean grade because you've done the work. The opportunity here is compounding what's working, not fixing what isn't.`;
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
  const biz = businessType.trim() || "your business";
  const domain = result.finalUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const gapOrder: Array<keyof typeof pillars> = [
    "measurement",
    "capture",
    "content",
    "freshness",
    "distribution",
    "conversion",
  ];
  const gaps = gapOrder
    .map((k) => pillars[k])
    .filter((p) => p.strength === "missing" || p.strength === "weak")
    .slice(0, 3);

  const lines: string[] = [];

  lines.push("## Where you are right now");
  lines.push("");
  lines.push(openingParagraph(pillars, biz, domain));
  lines.push("");

  lines.push("## The biggest gaps I see");
  lines.push("");
  if (gaps.length === 0) {
    lines.push(
      "Nothing broken. Your system has the right pieces and they're all firing. The next moves are about sharpening what already works, not fixing what doesn't.",
    );
  } else {
    gaps.forEach((p, i) => {
      lines.push(`${i + 1}. **${p.name}.** ${pillarNarrative(p, biz)}`);
    });
  }
  lines.push("");

  lines.push("## What I'd do in your first 30 days with us");
  lines.push("");
  for (const a of thirtyDayActions(pillars, biz)) {
    lines.push(a);
    lines.push("");
  }

  lines.push("## What I'd do in the 60 to 90 day window");
  lines.push("");
  for (const a of sixtyNinetyActions(pillars, biz)) {
    lines.push(a);
  }
  lines.push("");

  lines.push("## The one thing I'd fix this week even without us");
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
