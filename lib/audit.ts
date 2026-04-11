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

// "Why this is #1 for YOU" paragraph — outcome-first, no jargon, no tool
// names. A pizza shop owner and a SaaS founder should both read this and
// feel like it's about their business, not a marketing lecture.
function priorityNarrative(
  priority: RankedPriority,
  biz: string,
  kind: BusinessKind,
): string {
  const p = priority.pillar;
  const isMissing = p.strength === "missing";

  switch (p.id) {
    case "pixels":
      if (isMissing) {
        const why: Record<BusinessKind, string> = {
          ecommerce: `Right now you can't see which of your ads are actually selling product and which ones are just burning money. We fix that so every dollar you spend goes to the stuff that's actually working. Most shops who do this drop their cost per sale by a third inside the first month. It's the single biggest lever you're not pulling.`,
          saas: `Right now you can't see where your signups come from, which visitors turn into trials, or which trials turn into paying customers. Every decision about marketing is a guess. We fix that so you know what's working and what isn't, instead of arguing about hunches.`,
          service: `Right now you have no idea which of your website visitors end up calling you and which ones leave without a trace. That means when you run an ad or post on social, you're guessing at whether it actually made the phone ring. We fix that so you can spend your marketing money on what works.`,
          agency: `You sell marketing, and your own site isn't set up to measure anything. Not a great look for a prospect who checks. Let's get this in place first so you can practice what you preach and actually prove what's working.`,
          coach: `Right now you can't see which of your posts, emails, or ads are bringing people to your offers. Your whole business depends on moving cold strangers toward trust and a buy — and right now you can't see any of that happening. We fix it so you know what's working and double down.`,
          local: `Right now you can't see which of your website visitors actually called you or booked you. That means every dollar of marketing you spend is a coin flip. We fix that so you know exactly which ads and posts are making the phone ring, and you stop paying for the ones that don't.`,
          creator: `Right now you have no idea which of your posts, videos, or emails are actually bringing people to your site. We fix that so you can see exactly what's working with your audience and do more of it.`,
          restaurant: `Right now you can't tell which of your visitors actually booked a table and which ones just looked at the menu and left. We fix that so you know which ads, posts, and promotions actually fill seats — and you stop spending on the ones that don't.`,
          generic: `Every other marketing decision depends on this. Without it, you're guessing at which ads work, which emails get opened, which pages sell. We fix that so every move you make after is backed by real numbers, not hunches.`,
        };
        return `Right now, your website isn't telling you anything about who visits or what they do. ${why[kind]}`;
      }
      return `Some of your tracking is set up, but not all of it. ${p.detail} That means the parts you can see are making some of your marketing look better than it is, and some worse. We get the full picture in place in week one so you can trust what your dashboard is telling you.`;

    case "email_capture":
      if (isMissing) {
        const why: Record<BusinessKind, string> = {
          ecommerce: `About 98 out of every 100 people who visit your site don't buy on the first visit. Right now, every one of them disappears forever. We fix that so you collect their email with a small reward (a discount, a guide, early access to something new), then bring them back with a friendly series of emails. Most shops see this become their best-performing marketing channel within 90 days.`,
          saas: `Almost nobody signs up for software the first time they visit a website. They come back two or three times first. Right now you have no way to stay in front of them between visits. We fix that so you catch their email, show them what your product does, and stay on their mind until they're ready to try it.`,
          service: `Most of your future customers research for weeks before they reach out. Right now, during all that research, you're invisible to them. We fix that so they leave their email on the first visit, and you stay in their inbox with helpful stuff until they're ready to hire someone — and that someone is you.`,
          agency: `The best agencies close deals through helpful newsletters, not cold pitches. Right now you have no way to stay in front of prospects who aren't ready today. We fix that so the next time they need help, you're the first name they think of.`,
          coach: `Your whole business runs on email. If someone lands on your site and isn't ready to buy yet, you need a way to stay in front of them — otherwise they forget you exist within a week. We fix that so you catch their email, build trust over time, and turn cold strangers into buyers.`,
          local: `Right now, if someone checks out your site but isn't ready to book, they're gone. We fix that so you can collect their email, send them a friendly follow-up, and pull them back when it's time. A simple monthly email with a seasonal deal is often the difference between a dead Tuesday and a full schedule.`,
          creator: `Your email list is the only audience you actually own. Every follower on Instagram or TikTok is rented — one algorithm change and it's gone. Right now you have no way to reach your audience directly. We fix that so you build an audience that nobody can take from you.`,
          restaurant: `Right now, if someone looks at your menu and doesn't book, they're gone. We fix that so you can catch their email with a "first-visit drink on us" offer, then bring them back with news about tonight's special or this weekend's live music. Turns browsers into regulars.`,
          generic: `Right now, every visitor who doesn't buy or call is gone forever. We fix that so you can bring them back later with news, offers, and updates. This is the single highest-leverage change on your website, and it pays off for years.`,
        };
        return `I couldn't find a way to collect email addresses anywhere on your site. ${why[kind]}`;
      }
      return `You've got a signup form, but it's not doing much. ${p.detail} The offer isn't strong enough to make someone hand over their email. We rewrite it this week with something your customers actually want, and turn the form into a real asset.`;

    case "content_hub":
      if (isMissing) {
        const why: Record<BusinessKind, string> = {
          ecommerce: `When people search Google for "best [your product]" or "how to choose [your product]" — and they do it thousands of times a month — you're nowhere to be found. We fix that by writing a handful of helpful articles that answer the exact questions your customers ask. Those articles bring in free traffic for years, with zero ad spend.`,
          saas: `The software businesses that win long-term are the ones that publish helpful stuff their customers search for. Right now you're invisible on Google. We fix that by writing articles that answer real questions your customers have — and over time, Google starts sending you free customers every day.`,
          service: `Every day, people in your area are typing questions into Google that you could answer — things like "how much does X cost" or "do I need Y." Right now you're not showing up for any of them. We fix that, and those people become your next clients without you paying for ads.`,
          agency: `Your prospects judge your expertise by what you've published. Right now there's nothing there for them to read, and that makes them hesitant. We fix that by writing helpful articles that show you know your stuff, and those articles become your best sales tool.`,
          coach: `Most of your future clients find coaches by searching Google for things like "how to start a business" or "how to get more clients." Right now you're invisible to all of them. We fix that by writing the articles they're searching for, so they find you instead of someone else.`,
          local: `People in your neighborhood are searching for your services on Google every day. Right now you're buried on page 3. We fix that by writing helpful articles and pages that rank for the searches your future customers are actually typing. Get to page 1 and your phone starts ringing without a single dollar of ad spend.`,
          creator: `The creators who grow long-term are the ones who have a home base on their own website, not just social accounts. Right now you don't have that foundation. We fix that so your best content lives somewhere permanent and keeps working years from now.`,
          restaurant: `When locals or tourists search "best restaurant near me" or "[your food] in [your city]", you want to be the first name they see. Right now you're not. We fix that so when people in your area are hungry and searching, your name comes up first.`,
          generic: `Right now your website isn't bringing in any free traffic from Google. We fix that by writing helpful articles your customers are already searching for, and over time those articles become your best marketing channel — no ads, no spending, just visitors who found you because they needed exactly what you offer.`,
        };
        return `Your website doesn't have any articles or helpful pages on it. ${why[kind]}`;
      }
      return `You've got a blog or resources section, but it's thin. ${p.detail} The fix isn't starting over — it's publishing more regularly and making each new piece answer a specific question your customers ask.`;

    case "content_fresh":
      return isMissing
        ? `Your blog is there, but it hasn't been updated in a while. ${p.detail} Google notices when a site goes quiet and stops recommending it. Visitors notice too — a stale blog makes people wonder if you're still in business. We restart the cadence (even one short post a week is enough) and Google starts sending you traffic again within about a month.`
        : `Your posting schedule is inconsistent. ${p.detail} Regular short posts beat occasional brilliant ones, because Google rewards steady activity, not one-off home runs.`;

    case "social":
      return isMissing
        ? `Your website doesn't link out to any social accounts. ${p.detail} When people check you out, they almost always peek at Instagram or TikTok first. If they can't find you there, they assume you're not the real deal and move on. We fix that so you look legitimate and trustworthy at first glance.`
        : `Your social presence shows up in some places but not others. ${p.detail} We tighten this up so customers can find you wherever they already hang out.`;

    case "conversion":
      return isMissing
        ? `There's no easy way for a visitor to ask you a quick question. ${p.detail} A lot of people won't pick up the phone or send an email — they just move on to the next option. We add a simple chat box so you catch those people in the moment, answer their question, and turn them into customers before they bounce.`
        : `You've got some way for visitors to reach out, but it's not working as well as it could. ${p.detail} We sharpen it so more visitors actually use it.`;

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
  const phrase = bizPhrase(biz, kind);

  if (missing >= 4) {
    return `I took a real look at ${domain} and here's the honest read. You're running ${phrase}, and most of the stuff that actually brings in new customers from your website isn't set up yet. Don't freak out. Most business owners I talk to are in this exact spot, and honestly it's the best place to start because we get to do it right the first time instead of fixing someone else's half-finished work. Here's what I'd fix, in the order that makes you the most money the fastest.`;
  }
  if (missing >= 2) {
    return `I took a real look at ${domain} and here's what I see. You've got a few things going for you with ${phrase}, but there are a couple of big holes that are quietly costing you customers every week. The good news is none of this is hard to fix once you know what order to fix it in, and the order really matters. Here's how I'd rank it for you.`;
  }
  if (missing === 1) {
    return `I took a real look at ${domain}, and honestly, you're in decent shape for ${phrase}. There's one real gap that's holding you back right now. Close it, and everything else you're already doing starts working harder for you. Here's what to focus on.`;
  }
  if (weak >= 2) {
    return `I took a real look at ${domain}. No giant holes. A few things for ${phrase} are present but not pulling their weight. That's a much better conversation than "start over." Here's where you'd get the most bang for your buck.`;
  }
  if (weak === 1) {
    return `Honestly, ${phrase} is in great shape. Almost everything I check for is working, and only one thing needs tightening up. This is what a business ready to step on the gas looks like, not one that needs to rebuild. Here's the one area where I'd push.`;
  }
  return `You're in rare air. Almost everything I look for is working for ${phrase}. Most businesses I audit are trying to get to where you already are. The move now is pouring fuel on what's already working, not fixing things that aren't broken.`;
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
      `**Week 1, we double-check the foundation.** Everything on your site looks good from the outside, but I want to make sure the numbers you're seeing are actually accurate before we start making decisions with them. Nothing's worse than building a strategy on bad data.`,
    );
    actions.push(
      `**Week 2, we find your weak spot.** Every business has one place where visitors drop off. For ${bizLower}, we figure out exactly where that is and we fix it. Could be the homepage, could be the booking flow, could be an email that's not doing its job. We'll know within a week.`,
    );
    actions.push(
      `**Weeks 3 and 4, we turn on a new way to bring people in.** You're probably leaving at least one easy growth channel on the table. We pick the best one for your kind of business and we launch it with a real budget and real tracking from day one.`,
    );
    return actions;
  }

  if (mNeed) {
    actions.push(
      `**Week 1, we turn on your visibility.** Right now you're flying blind. We set up the invisible tools that show you who's visiting your site, what they're doing, and which ads or posts are actually sending you real customers. This is usually done in a few hours and changes every decision you make from here on out.`,
    );
  }
  if (cNeed) {
    actions.push(
      `**Weeks 1 and 2, we start catching leads.** Right now, people visit your site and leave. We add a simple way to catch their email with something they actually want (not a generic "10% off"). For ${bizLower}, we pick the right offer, write the first few emails that do the selling for you while you sleep, and hook it all up.`,
    );
  }
  if (contentNeed) {
    actions.push(
      `**Weeks 2 to 4, we start showing up on Google.** We write 4 real articles that answer the exact questions your customers type in before they buy. Not blog filler. Real stuff that gets found, builds trust, and quietly brings in customers for years without you paying for every click.`,
    );
  }
  if (mNeed || cNeed) {
    actions.push(
      `**End of month 1, we turn on paid traffic.** Small budget, carefully watched, feeding everything we just built. We're not trying to hit a home run in month one. We're proving this actually makes you money before we pour fuel on it.`,
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
      `We pour more fuel on what's making you money and cut what isn't. By day 60 we've got a month of real numbers to look at. Whatever's paying for itself gets double the budget. Whatever isn't, we kill without being precious about it.`,
      ``,
      `The articles start stacking. We write more, we link them together, and by day 90 for ${bizLower} you should start seeing your first real wave of free traffic from Google. This is the part that keeps compounding every month after, even if you did nothing else.`,
    ];
  }

  return [
    `Month 1 was about building. The next 60 days are about making it work harder for you.`,
    ``,
    `Whatever ad or channel we turned on in month 1 is now producing real numbers. We double down on whatever's paying for itself and cut whatever isn't. No guessing.`,
    ``,
    `We also turn on the emails that work while you sleep: the "you forgot something" email, the "thanks, here's what to do next" email, the "come back, we miss you" email, and a monthly newsletter for ${bizLower} that actually gets read because it's worth reading.`,
    ``,
    `The articles keep coming, 4 to 6 a month. By day 90 the ones we wrote in month 1 should start showing up on Google, and you should see your first free customers rolling in from search.`,
  ];
}

function oneThingThisWeek(pillars: Record<string, Pillar>): string {
  if (pillars.measurement.strength === "missing") {
    return `Get the invisible stuff that shows you who's visiting your site turned on. It's free, it takes about an hour, and without it you're just guessing at every single marketing decision. If you do nothing else from this email, do this. If you don't know how, reply to this email and I'll walk you through it in two minutes.`;
  }
  if (pillars.capture.strength === "missing") {
    return `Add one way for a visitor to give you their email in exchange for something they actually want. Not "10% off." A real guide, a sample, a checklist, an early-access offer, something worth it. About two hours of work for something that runs and brings you customers forever.`;
  }
  if (pillars.content.strength === "missing") {
    return `Write one article this week. Pick the single question your last 5 customers asked you before they bought. Answer it in plain English, 800 words or so. Publish it. One real article beats a fancy plan for ten articles you never write.`;
  }
  if (pillars.freshness.strength === "missing") {
    return `Post one new article this week, even a short one. Your site has gone quiet and Google is starting to treat it like it's closed. One 600-word post is enough to flip the signal back on. Don't overthink it, just ship something.`;
  }
  if (pillars.distribution.strength === "missing") {
    return `Put your Instagram, TikTok, and one other relevant social link in your site footer this week. Customers look for it. If it's not there, they assume you're not serious. Two minutes of work, zero downside.`;
  }
  if (pillars.measurement.strength === "weak") {
    return `Take 20 minutes this week and check that the visitor-tracking on your site is actually working. Bad data is worse than no data because it makes you confident in wrong decisions. If you're not sure how, reply to this email and I'll show you how to check in under five minutes.`;
  }
  if (pillars.capture.strength === "weak") {
    return `Look at what you're offering people in exchange for their email right now. If it's generic, rewrite it. If it's "sign up for our newsletter," rewrite it. Make it one specific thing your ideal customer would actually want. One hour of thinking is worth weeks of tweaking everything else.`;
  }
  return `Look at your top few Google searches where you're showing up on page 2 but not page 1. Pick the one closest to a customer ready to buy. Spend an afternoon making that page the best answer on the internet for that search. One week of work that can move real money.`;
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

  if (priorities.length > 0) {
    lines.push("## The 3 biggest moves, in order");
    lines.push("");
    const rankLabel = ["**#1 for you**", "**#2 for you**", "**#3 for you**"];
    priorities.forEach((pri, i) => {
      lines.push(`${rankLabel[i]}: **${pri.pillar.name}.**`);
      lines.push("");
      lines.push(priorityNarrative(pri, biz, kind));
      lines.push("");
    });
  } else {
    lines.push("## You're ahead of the curve");
    lines.push("");
    lines.push(openingRead(pillars, biz, domain, kind));
    lines.push("");
  }

  lines.push("## What your first month with us looks like");
  lines.push("");
  for (const a of thirtyDayActions(pillars, biz)) {
    lines.push(a);
    lines.push("");
  }

  lines.push("## Where things go in month 2 and 3");
  lines.push("");
  for (const a of sixtyNinetyActions(pillars, biz)) {
    lines.push(a);
  }
  lines.push("");

  lines.push("## The one thing I'd do this week, even if we never talk again");
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

type ReadoutStatus = "good" | "weak" | "broken";

interface ReadoutItem {
  label: string;
  status: ReadoutStatus;
  line: string;
}

// Roll the 6 marketing checks into 5 business-owner-friendly categories.
// Each one gets a one-sentence read: what's going on + what we'd do, in
// the voice of a consultant not an auditor. This is what replaces the
// "wins / gaps / blockers" strip — the visitor is here for marketing
// advice, not a website report card.
function buildMarketingReadout(
  checks: AuditCheck[],
  kind: BusinessKind,
): ReadoutItem[] {
  const byId = new Map(checks.map((c) => [c.id, c]));
  const statusOf = (id: string): ReadoutStatus => {
    const c = byId.get(id);
    if (!c) return "weak";
    if (c.status === "fail") return "broken";
    if (c.status === "warn") return "weak";
    return "good";
  };

  // 1. Visibility (tracking pixels / analytics)
  const visibility: ReadoutItem = (() => {
    const s = statusOf("pixels");
    if (s === "good") {
      return {
        label: "Knowing what's working",
        status: s,
        line: "You can already see which marketing is bringing you customers. That's the foundation most businesses don't have.",
      };
    }
    if (s === "weak") {
      return {
        label: "Knowing what's working",
        status: s,
        line: "You can see part of the picture, not all of it. That leads to bad calls on where to spend next. We'd get the full view in place in an afternoon.",
      };
    }
    return {
      label: "Knowing what's working",
      status: s,
      line: "You're flying blind on every marketing dollar you spend. We'd turn on the invisible tools that show which ads and posts are actually bringing you customers. It's the single biggest lever you're not pulling.",
    };
  })();

  // 2. Catching leads (email capture)
  const capture: ReadoutItem = (() => {
    const s = statusOf("email_capture");
    const capturePhrase: Record<BusinessKind, string> = {
      ecommerce: "98 out of every 100 visitors leave your site without buying. We'd catch their email on the way out and bring them back with a series of emails that do the selling while you sleep.",
      saas: "Most people don't sign up the first time they hear about your product. We'd catch their email and stay in their inbox with helpful stuff until they're ready to try it.",
      service: "Your future customers research for weeks before they reach out. We'd get you in their inbox during that whole window so you're the first name they think of when it's time.",
      agency: "The best agencies close deals through helpful newsletters, not cold pitches. We'd build you one so the next time a prospect needs help, you're the first name they think of.",
      coach: "Your business runs on email. We'd get visitors onto your list with a real offer and write the welcome sequence that turns cold strangers into buyers.",
      local: "We'd catch visitor emails with a simple offer and send them a friendly follow-up so they book with you instead of the next shop down the road.",
      creator: "Your email list is the only audience nobody can take from you. We'd start building it this week so you're not renting reach from the algorithm forever.",
      restaurant: "We'd catch their email with a 'first-visit drink on us' offer and keep them coming back with news about tonight's special or this weekend's event.",
      generic: "Visitors leave your site every day without giving you a way to bring them back. We'd fix that with one smart offer and a short welcome sequence — usually the highest-ROI thing you can add.",
    };
    if (s === "good") {
      return {
        label: "Catching leads that aren't ready yet",
        status: s,
        line: "You're already collecting emails, which puts you ahead of most businesses in your space. Now it's about making what you send them pull harder.",
      };
    }
    if (s === "weak") {
      return {
        label: "Catching leads that aren't ready yet",
        status: s,
        line: "You've got a signup form, but the offer isn't working. We'd rewrite it this week into something your customers actually want — that alone usually doubles signups.",
      };
    }
    return {
      label: "Catching leads that aren't ready yet",
      status: s,
      line: capturePhrase[kind],
    };
  })();

  // 3. Showing up on Google (content_hub + content_fresh merged)
  const google: ReadoutItem = (() => {
    const hub = statusOf("content_hub");
    const fresh = statusOf("content_fresh");
    const worst: ReadoutStatus =
      hub === "broken" || fresh === "broken"
        ? "broken"
        : hub === "weak" || fresh === "weak"
        ? "weak"
        : "good";
    const googlePhrase: Record<BusinessKind, string> = {
      ecommerce: "People search for your products every day. We'd write the helpful articles that put you on page 1 — free traffic that compounds for years.",
      saas: "We'd write the articles your customers are already searching for, and over time Google starts sending you free signups every day.",
      service: "People in your area are typing questions into Google right now that you could answer. We'd get you showing up for them so your phone starts ringing without ad spend.",
      agency: "Prospects judge you by what you've published. We'd write the articles that show you know your stuff and turn them into your best sales tool.",
      coach: "We'd write the articles your future clients are searching for, so they find you instead of someone else.",
      local: "People in your neighborhood are searching for your services today. We'd get you to page 1 for the searches that actually send you customers.",
      creator: "Your best content should live somewhere permanent. We'd help you build a home base that keeps bringing in new fans years from now.",
      restaurant: "When locals search 'best [your food] near me', you want to be the first name they see. We'd make that happen without paying for every click.",
      generic: "You're invisible on Google for the questions your future customers are typing right now. We'd write the articles that put you on page 1 — free traffic that compounds forever.",
    };
    if (worst === "good") {
      return {
        label: "Showing up on Google",
        status: worst,
        line: "You're publishing content and Google can see you're active. That's the long-term compounding channel already working in your favor.",
      };
    }
    if (worst === "weak") {
      return {
        label: "Showing up on Google",
        status: worst,
        line: "Your content is there but it's thin or quiet, and Google notices. We'd get you on a simple rhythm of one helpful article a week that answers what customers actually search for.",
      };
    }
    return {
      label: "Showing up on Google",
      status: worst,
      line: googlePhrase[kind],
    };
  })();

  // 4. Social presence
  const social: ReadoutItem = (() => {
    const s = statusOf("social");
    if (s === "good") {
      return {
        label: "Social proof",
        status: s,
        line: "Your social channels are hooked up and customers can find you wherever they already hang out. You look legitimate at first glance, which matters more than most business owners realize.",
      };
    }
    if (s === "weak") {
      return {
        label: "Social proof",
        status: s,
        line: "You're on some platforms but not all the ones that matter for your business. We'd help you focus on the right 2-3 and post the kind of content that actually gets shared.",
      };
    }
    return {
      label: "Social proof",
      status: s,
      line: "No social links on your site. Customers check Instagram or TikTok before they buy, and if they can't find you there, they assume you're not the real deal. We'd get you posting the content that builds trust fast.",
    };
  })();

  // 5. Turning visitors into customers (conversion tools)
  const convert: ReadoutItem = (() => {
    const c = byId.get("conversion");
    const s: ReadoutStatus =
      c?.status === "pass"
        ? "good"
        : c?.status === "warn"
        ? "weak"
        : c?.status === "fail"
        ? "broken"
        : "weak"; // "info" (no widget) is a soft miss, not a fail
    if (s === "good") {
      return {
        label: "Turning visitors into customers",
        status: s,
        line: "You've got a way for visitors to get help on the spot. That's quietly lifting your conversion every day.",
      };
    }
    if (s === "weak") {
      return {
        label: "Turning visitors into customers",
        status: s,
        line: "No easy way for a curious visitor to ask a quick question. Most people who hesitate just leave for the next option. We'd add a simple chat so you catch them while they're warm.",
      };
    }
    return {
      label: "Turning visitors into customers",
      status: s,
      line: "Your site is missing the tools that turn visitors into buyers. We'd add the small touches (smart chat, clearer next-steps, better CTAs) that lift sales 10-20% without more traffic.",
    };
  })();

  return [visibility, capture, google, social, convert];
}

export function renderAuditEmail(
  result: AuditResult,
  recipientEmail: string,
  businessType: string = "",
  visitorName: string = "",
): { subject: string; html: string; text: string } {
  const displayUrl = cleanHostname(result.finalUrl);
  const subject = result.reachable
    ? `Your growth plan for ${displayUrl}`
    : `We couldn't reach ${displayUrl}. Here's what that means.`;
  const first = firstName(visitorName);
  const greeting = first ? `Hey ${first},` : "Hey,";

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

  const planMarkdown = buildMarketingPlan(result, businessType);
  const planHtml = renderPlanMarkdown(planMarkdown);

  const bizKind = classifyBusiness(businessType);
  const readout = buildMarketingReadout(result.checks, bizKind);

  // Dot colors for the readout rows.
  const dotColor: Record<ReadoutStatus, string> = {
    good: EMAIL_COLORS.green,
    weak: "#F5B841",
    broken: EMAIL_COLORS.red,
  };

  const readoutRows = readout
    .map(
      (item) => `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:18px;">
      <tr>
        <td width="22" valign="top" style="padding-top:7px;padding-right:12px;">
          <div style="width:11px;height:11px;border-radius:50%;background:${dotColor[item.status]};box-shadow:0 0 0 3px ${dotColor[item.status]}22;"></div>
        </td>
        <td valign="top">
          <div style="font-size:14px;font-weight:600;color:${EMAIL_COLORS.text};letter-spacing:-0.005em;">${escapeHtml(item.label)}</div>
          <div style="font-size:13.5px;color:${EMAIL_COLORS.textMid};line-height:1.6;margin-top:4px;">${escapeHtml(item.line)}</div>
        </td>
      </tr>
    </table>
  `,
    )
    .join("");

  const opener = first
    ? `${greeting} I took a real look at your site and pulled together a plain-English read on where you are with marketing right now and what I'd do about it. No jargon. No fluff. Here's the short version.`
    : `I took a real look at your site and pulled together a plain-English read on where you are with marketing right now and what I'd do about it. No jargon. No fluff. Here's the short version.`;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
${fontImport}
</head>
<body style="${bodyBase}">
  <div style="max-width:640px;margin:0 auto;padding:44px 24px 56px;">

    <!-- Header -->
    <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;">Venti Scale</div>
    <h1 style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:36px;font-weight:500;letter-spacing:-0.025em;margin:12px 0 6px;line-height:1.1;color:${EMAIL_COLORS.text};">
      Your growth plan
    </h1>
    <div style="font-size:14px;font-weight:500;color:${EMAIL_COLORS.textMid};letter-spacing:-0.005em;">
      ${escapeHtml(displayUrl)}
    </div>

    <!-- Personal opener -->
    <p style="font-size:15px;line-height:1.65;color:${EMAIL_COLORS.textMid};margin:26px 0 0;">
      ${escapeHtml(opener)}
    </p>

    <!-- Marketing readout card -->
    <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:14px;padding:28px 26px 14px;margin-top:28px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.16em;color:${EMAIL_COLORS.textDim};text-transform:uppercase;margin-bottom:4px;">The five-minute read</div>
      <div style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;letter-spacing:-0.015em;color:${EMAIL_COLORS.text};margin:6px 0 22px;line-height:1.25;">
        Where your marketing is right now
      </div>
      ${readoutRows}
    </div>

    <!-- Plan body -->
    <div style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:14px;padding:28px 26px;margin-top:22px;">
      ${planHtml}
    </div>

    <!-- CTA -->
    <div style="margin-top:32px;padding:34px 28px;background:${EMAIL_COLORS.cardAlt};border:1px solid ${EMAIL_COLORS.borderStrong};border-radius:14px;text-align:center;">
      <div style="font-family:Fraunces,Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;line-height:1.25;color:${EMAIL_COLORS.text};letter-spacing:-0.015em;">
        Want us to actually do all this for you?
      </div>
      <p style="font-size:14.5px;line-height:1.65;color:${EMAIL_COLORS.textMid};margin:14px 0 24px;max-width:480px;margin-left:auto;margin-right:auto;">
        We become the marketing team you'd hire if you had the budget to hire one. You keep running your business. We bring you more customers. One quick call, no contract, no pressure.
      </p>
      <a href="https://www.ventiscale.com" style="display:inline-block;background:${EMAIL_COLORS.red};color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:10px;letter-spacing:0.01em;">
        Book a quick call
      </a>
      <div style="margin-top:16px;font-size:12px;color:${EMAIL_COLORS.textDim};">
        Or just hit reply to this email. I read every one.
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
  const readoutLines = readout.map((item) => {
    const icon = item.status === "good" ? "✓" : item.status === "weak" ? "~" : "✗";
    return `${icon} ${item.label}\n  ${item.line}`;
  });

  const textLines = [
    `Your growth plan — ${displayUrl}`,
    ``,
    opener,
    ``,
    `WHERE YOUR MARKETING IS RIGHT NOW`,
    ``,
    ...readoutLines.flatMap((l) => [l, ""]),
    planMarkdown,
    ``,
    `Want us to actually do all this for you? Book a quick call: https://www.ventiscale.com`,
    `Or just hit reply to this email. I read every one.`,
    ``,
    `Dustin Gilmour, Venti Scale`,
  ];

  return { subject, html, text: textLines.join("\n") };
}
