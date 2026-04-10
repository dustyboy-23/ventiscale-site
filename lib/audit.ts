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
  plan?: string | null;
  businessType?: string;
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
// Claude-powered marketing plan generator
// ──────────────────────────────────────────────────────────
const ANTHROPIC_TIMEOUT_MS = 45_000;

export async function generateMarketingPlan(
  result: AuditResult,
  url: string,
  businessType: string,
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("[audit] ANTHROPIC_API_KEY not set, skipping plan generation");
    return null;
  }
  if (!result.reachable) return null;

  // Structured findings for the prompt
  const findings = result.checks
    .filter((c) => c.status !== "info")
    .map((c) => `${c.status.toUpperCase()}: ${c.label}. ${c.detail}`)
    .join("\n");

  const bodyText = result.bodyText || "(no body text extracted)";
  const domain = result.finalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const prompt = `You are Dustin Gilmour, founder of Venti Scale, a done-for-you marketing agency for ecommerce brands. You're writing a personalized marketing plan for a prospect who just ran our free AI audit on their website. Write in first person, confident but never salesy. No em dashes. No corporate jargon. Direct. Think: how would a senior marketing operator explain what this business needs, in plain English, to the founder?

URL audited: ${url}
Business type (as entered by the prospect): ${businessType || "(not specified)"}
Domain: ${domain}

AUDIT FINDINGS:
${findings}

WHAT THE HOMEPAGE SAYS ABOUT ITSELF (first 3000 chars of visible text, scripts and styles stripped):
"""
${bodyText}
"""

Output in this exact structure, using markdown headings:

## Where you are right now
[2-3 sentences assessing their current marketing maturity based on the findings]

## The 3 biggest gaps I see
1. [Gap with specific reference to the findings]
2. [Gap with specific reference to the findings]
3. [Gap with specific reference to the findings]

## What I'd do in your first 30 days with us
[3-5 specific actions that address the gaps, written as if you're already their marketing team. Reference what they DO have as a starting point, not just what's missing.]

## What I'd do in the 60-90 day window
[2-3 actions that build on the 30-day foundation]

## The one thing I'd fix this week even without us
[One high-leverage fix they can do themselves. Earn trust by not gating everything behind hiring you.]

Reference their specific business and what you see on their site. Adapt to what they have. If they already have a blog, don't tell them to start one, tell them to improve it. If they have no email capture, that's the first move. If they have pixels but no analytics, the priority is measurement. Be ADAPTIVE. Never generic. No em dashes anywhere. No pricing numbers. No mention of "free". Write like a real operator, not a marketer.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text();
      console.error("[audit] Anthropic API error", res.status, txt.slice(0, 500));
      return null;
    }
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const block = (data.content || []).find((b) => b.type === "text");
    const text = block?.text?.trim();
    if (!text) {
      console.error("[audit] Anthropic response had no text block");
      return null;
    }
    // Final safety sweep, just in case
    return text.replace(/—/g, ",").replace(/–/g, ",");
  } catch (err) {
    clearTimeout(timer);
    console.error("[audit] generateMarketingPlan threw", err);
    return null;
  }
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

function renderPlanFallback(result: AuditResult): string {
  // If Claude didn't return anything, build a plan-shaped email from the
  // findings alone so nothing ever looks broken.
  const fails = result.checks.filter((c) => c.status === "fail");
  const warns = result.checks.filter((c) => c.status === "warn");
  const passes = result.checks.filter((c) => c.status === "pass");

  const lines: string[] = [];
  lines.push("## Where you are right now");
  if (fails.length > 3) {
    lines.push(
      `I ran ${result.checks.length} checks across your site and found ${fails.length} critical gaps, ${warns.length} things worth cleaning up, and ${passes.length} things you already have working. There's real foundational work to do before any growth channel will compound.`,
    );
  } else if (fails.length > 0) {
    lines.push(
      `Your site has a decent foundation. ${passes.length} of ${result.checks.length} checks passed. There are ${fails.length} blockers and ${warns.length} smaller gaps keeping you from compounding growth.`,
    );
  } else {
    lines.push(
      `Your site is in solid shape. ${passes.length} of ${result.checks.length} checks passed, with ${warns.length} smaller things to clean up. The opportunity now is leveraging what you have, not fixing what's broken.`,
    );
  }
  lines.push("");
  lines.push("## The biggest gaps I see");
  if (fails.length > 0) {
    fails.slice(0, 3).forEach((c, i) => {
      lines.push(`${i + 1}. **${c.label}**. ${c.detail}`);
    });
  } else if (warns.length > 0) {
    warns.slice(0, 3).forEach((c, i) => {
      lines.push(`${i + 1}. **${c.label}**. ${c.detail}`);
    });
  } else {
    lines.push("1. No critical gaps flagged. The next move is optimization, not repair.");
  }
  lines.push("");
  lines.push("## What I'd do first");
  lines.push(
    "The quickest wins are usually the measurement stack, email capture, and a steady content cadence. Those three together unlock paid ads, owned reach, and organic discovery all at once.",
  );
  lines.push("");
  lines.push("## The one thing I'd fix this week");
  if (fails.length > 0 && fails[0].fix) {
    lines.push(fails[0].fix);
  } else {
    lines.push(
      "Install a Meta Pixel and GA4 if you haven't already. Without measurement you can't optimize anything, and it's a one-hour job.",
    );
  }
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

  const planMarkdown = result.plan && result.plan.trim().length > 0 ? result.plan : renderPlanFallback(result);
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
