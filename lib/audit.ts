/**
 * Ventiscale audit runner.
 *
 * Fetches a URL, runs a set of surface checks (SEO, performance hints,
 * meta, structured data, accessibility), and returns a scored report
 * plus an HTML email body ready to send via Brevo.
 *
 * Zero external deps — regex parsing on the raw HTML. Good enough for a
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
}

const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 2 * 1024 * 1024; // 2 MB cap
const USER_AGENT =
  "Mozilla/5.0 (compatible; VentiScaleAuditBot/1.0; +https://ventiscale.com/)";

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
  // content first, then name — less common but valid
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
      ? "Your site is served over HTTPS. Good — Google penalizes plain HTTP and browsers mark it insecure."
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
      fix: "Add a descriptive title — this is the single most important on-page SEO element.",
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
      detail: `${title.length} chars — Google will truncate this in search. "${title}"`,
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
      detail: `Only ${desc.length} characters — too thin to rank or sell.`,
      fix: "Target 150-160 characters.",
    });
  } else if (desc.length > 170) {
    checks.push({
      id: "description",
      label: "Meta description",
      status: "warn",
      detail: `${desc.length} characters — will be truncated in search.`,
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
      detail: "Exactly one H1 — clean.",
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
      : "No viewport meta — your site renders zoomed out on phones.",
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
      : "No og:image — your site shares as a blank card on LinkedIn, Slack, iMessage.",
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
      : "No canonical link — risks duplicate content penalties.",
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
      : "Add Organization and Product schema — Google uses this for rich search results.",
  });

  // 11. Favicon
  const hasFavicon = /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i.test(
    html,
  );
  checks.push({
    id: "favicon",
    label: "Favicon",
    status: hasFavicon ? "pass" : "warn",
    detail: hasFavicon ? "Favicon linked." : "No favicon — looks unfinished in browser tabs.",
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
      fix: "Add descriptive alt text to every image. SEO + accessibility — both critical.",
    });
  }

  // 14. Page weight
  const sizeMB = fetched.size / 1024 / 1024;
  if (sizeMB < 1) {
    checks.push({
      id: "weight",
      label: "Page weight",
      status: "pass",
      detail: `${sizeMB.toFixed(2)} MB HTML. Lean — loads fast.`,
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
      detail: `~${wordCount} words — a little light.`,
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

function statusBadge(status: CheckStatus): string {
  const palette: Record<CheckStatus, { bg: string; fg: string; label: string }> = {
    pass: { bg: "#E8F0EA", fg: "#1F3D2B", label: "PASS" },
    warn: { bg: "#FBF2DD", fg: "#8A5A00", label: "WARN" },
    fail: { bg: "#F7E2DD", fg: "#8A1F0F", label: "FAIL" },
    info: { bg: "#EEEEEE", fg: "#555555", label: "INFO" },
  };
  const p = palette[status];
  return `<span style="display:inline-block;background:${p.bg};color:${p.fg};font-size:10px;font-weight:700;letter-spacing:0.08em;padding:3px 7px;border-radius:3px;text-transform:uppercase;">${p.label}</span>`;
}

function gradeBlock(grade: string, score: number): string {
  const color =
    grade === "A" ? "#1F3D2B" : grade === "B" ? "#2E5A3F" : grade === "C" ? "#8A5A00" : "#8A1F0F";
  return `
    <div style="text-align:center;padding:32px 24px;background:#FAF6EF;border:1px solid rgba(27,27,27,0.10);border-radius:12px;margin:24px 0;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#1B1B1B;opacity:0.55;text-transform:uppercase;">Overall grade</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:72px;font-weight:400;line-height:1;color:${color};margin:12px 0 4px;">${grade}</div>
      <div style="font-size:14px;color:#1B1B1B;opacity:0.65;">${score} / 100</div>
    </div>
  `;
}

export function renderAuditEmail(
  result: AuditResult,
  recipientEmail: string,
): { subject: string; html: string; text: string } {
  const displayUrl = result.finalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const subject = result.reachable
    ? `Your Venti Scale audit for ${displayUrl} — ${result.grade} (${result.score}/100)`
    : `We couldn't reach ${displayUrl} — here's what that means`;

  if (!result.reachable) {
    const html = `
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F6F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1B1B1B;">
  <div style="max-width:600px;margin:0 auto;padding:48px 32px;">
    <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#1F3D2B;text-transform:uppercase;">Venti Scale · Audit</div>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;letter-spacing:-0.02em;margin:14px 0 8px;line-height:1.1;">We couldn't reach your site.</h1>
    <p style="font-size:16px;line-height:1.55;color:#1B1B1B;opacity:0.75;">
      We tried to audit <strong style="color:#1B1B1B;opacity:1;">${escapeHtml(displayUrl)}</strong> but got this error:
    </p>
    <div style="background:#FAF6EF;border:1px solid rgba(27,27,27,0.10);border-radius:8px;padding:16px;font-family:'SF Mono',Consolas,monospace;font-size:13px;color:#1B1B1B;margin:16px 0 24px;">
      ${escapeHtml(result.error || "Network error")}
    </div>
    <p style="font-size:15px;line-height:1.55;color:#1B1B1B;opacity:0.75;">
      Possible causes:
    </p>
    <ul style="font-size:15px;line-height:1.7;color:#1B1B1B;opacity:0.75;padding-left:20px;">
      <li>The URL is wrong or the site is temporarily down.</li>
      <li>Your host blocks automated requests (some CDNs do this).</li>
      <li>DNS isn't resolving from our server.</li>
    </ul>
    <p style="font-size:15px;line-height:1.55;color:#1B1B1B;opacity:0.75;margin-top:24px;">
      Reply to this email with the correct URL and I'll run it manually.
    </p>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(27,27,27,0.10);">
      <p style="font-size:13px;color:#1B1B1B;opacity:0.55;margin:0;">
        — Dustin<br/>
        <a href="https://ventiscale.com" style="color:#1F3D2B;text-decoration:none;">ventiscale.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
    return {
      subject,
      html,
      text: `We couldn't reach ${displayUrl}: ${result.error}\n\nReply with the correct URL and I'll run it manually.\n— Dustin`,
    };
  }

  // Group checks by status
  const fails = result.checks.filter((c) => c.status === "fail");
  const warns = result.checks.filter((c) => c.status === "warn");
  const passes = result.checks.filter((c) => c.status === "pass");
  const infos = result.checks.filter((c) => c.status === "info");

  const renderCheck = (c: AuditCheck): string => `
    <tr>
      <td style="padding:16px 0;border-top:1px solid rgba(27,27,27,0.08);vertical-align:top;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="vertical-align:top;width:60px;padding-right:12px;">
              ${statusBadge(c.status)}
            </td>
            <td style="vertical-align:top;">
              <div style="font-size:15px;font-weight:600;color:#1B1B1B;">${escapeHtml(c.label)}</div>
              <div style="font-size:14px;color:#1B1B1B;opacity:0.70;line-height:1.5;margin-top:4px;">${escapeHtml(c.detail)}</div>
              ${
                c.fix
                  ? `<div style="font-size:13px;color:#1F3D2B;line-height:1.5;margin-top:8px;padding:10px 12px;background:#F1EBDF;border-left:2px solid #1F3D2B;border-radius:2px;"><strong>Fix:</strong> ${escapeHtml(c.fix)}</div>`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  const section = (title: string, items: AuditCheck[]): string => {
    if (items.length === 0) return "";
    return `
      <div style="margin-top:32px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#1B1B1B;opacity:0.55;text-transform:uppercase;margin-bottom:4px;">${title}</div>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${items.map(renderCheck).join("")}
        </table>
      </div>
    `;
  };

  const html = `
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F6F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1B1B1B;">
  <div style="max-width:640px;margin:0 auto;padding:48px 32px 64px;">

    <!-- Header -->
    <div style="font-size:11px;font-weight:600;letter-spacing:0.14em;color:#1F3D2B;text-transform:uppercase;">Venti Scale · Audit report</div>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;letter-spacing:-0.02em;margin:14px 0 8px;line-height:1.1;">
      Your audit for <br/>
      <span style="color:#1F3D2B;">${escapeHtml(displayUrl)}</span>
    </h1>
    <p style="font-size:15px;line-height:1.55;color:#1B1B1B;opacity:0.65;margin:0 0 8px;">
      ${result.checks.length} surface checks run in ${(result.durationMs / 1000).toFixed(1)}s. Here's what I found.
    </p>

    ${gradeBlock(result.grade, result.score)}

    <!-- Summary counts -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 16px;">
      <tr>
        <td style="text-align:center;padding:12px;background:#F7E2DD;border-radius:6px 0 0 6px;">
          <div style="font-size:22px;font-weight:700;color:#8A1F0F;font-family:Georgia,serif;">${fails.length}</div>
          <div style="font-size:10px;font-weight:600;letter-spacing:0.08em;color:#8A1F0F;text-transform:uppercase;margin-top:2px;">Failed</div>
        </td>
        <td style="text-align:center;padding:12px;background:#FBF2DD;border-left:1px solid rgba(255,255,255,0.6);border-right:1px solid rgba(255,255,255,0.6);">
          <div style="font-size:22px;font-weight:700;color:#8A5A00;font-family:Georgia,serif;">${warns.length}</div>
          <div style="font-size:10px;font-weight:600;letter-spacing:0.08em;color:#8A5A00;text-transform:uppercase;margin-top:2px;">Warnings</div>
        </td>
        <td style="text-align:center;padding:12px;background:#E8F0EA;border-radius:0 6px 6px 0;">
          <div style="font-size:22px;font-weight:700;color:#1F3D2B;font-family:Georgia,serif;">${passes.length}</div>
          <div style="font-size:10px;font-weight:600;letter-spacing:0.08em;color:#1F3D2B;text-transform:uppercase;margin-top:2px;">Passed</div>
        </td>
      </tr>
    </table>

    ${section("What to fix first", fails)}
    ${section("Worth cleaning up", warns)}
    ${section("Already solid", passes)}
    ${section("Notes", infos)}

    <!-- CTA -->
    <div style="margin-top:48px;padding:32px 28px;background:#1B1B1B;border-radius:12px;text-align:center;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;line-height:1.25;color:#F6F1EA;">
        Want me to fix these <span style="font-style:italic;">for you?</span>
      </div>
      <p style="font-size:14px;line-height:1.55;color:#F6F1EA;opacity:0.65;margin:12px 0 20px;">
        This audit scratches the surface. The full Venti Scale system covers email, content, ads, SEO,
        and reports — $1,500/mo flat, cancel any time.
      </p>
      <a href="https://ventiscale.com/#pricing" style="display:inline-block;background:#F6F1EA;color:#1B1B1B;text-decoration:none;font-size:13px;font-weight:600;padding:12px 22px;border-radius:6px;">
        See what you get →
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(27,27,27,0.10);font-size:12px;color:#1B1B1B;opacity:0.50;line-height:1.6;">
      Sent to ${escapeHtml(recipientEmail)} because you ran an audit at <a href="https://ventiscale.com" style="color:#1F3D2B;text-decoration:none;">ventiscale.com</a>. No follow-up sequence, no spam. If you want to chat, just reply.<br/><br/>
      — Dustin Gilmour, Venti Scale
    </div>

  </div>
</body>
</html>`;

  // Plain-text fallback
  const textLines = [
    `Your Venti Scale audit for ${displayUrl}`,
    `Grade: ${result.grade} (${result.score}/100)`,
    ``,
    `${fails.length} failed · ${warns.length} warnings · ${passes.length} passed`,
    ``,
  ];
  const appendSection = (title: string, items: AuditCheck[]) => {
    if (items.length === 0) return;
    textLines.push(`— ${title.toUpperCase()} —`);
    for (const c of items) {
      textLines.push(`[${c.status.toUpperCase()}] ${c.label}: ${c.detail}`);
      if (c.fix) textLines.push(`  Fix: ${c.fix}`);
    }
    textLines.push("");
  };
  appendSection("What to fix first", fails);
  appendSection("Worth cleaning up", warns);
  appendSection("Already solid", passes);
  textLines.push(
    "Want me to fix these for you? $1,500/mo flat. https://ventiscale.com/#pricing",
    "",
    "— Dustin Gilmour, Venti Scale",
  );

  return { subject, html, text: textLines.join("\n") };
}
