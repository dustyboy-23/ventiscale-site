import { NextResponse, after } from "next/server";
import {
  runAudit,
  renderAuditEmail,
  type AuditResult,
} from "@/lib/audit";

// Audit lead capture + real audit generation:
// 1. Validates input
// 2. Runs a 15-check surface audit on the submitted URL
// 3. Emails the visitor their personalized audit report (Brevo)
// 4. Notifies dustin@ventiscale.com with lead + grade summary (Brevo)
// 5. Logs to Vercel function logs as a backup record
//
// Brevo API key lives in BREVO_API_KEY (Vercel env). If the key is missing
// the route still returns 200 so the form never appears broken to a visitor
// the lead is preserved in function logs and can be backfilled by hand.

interface AuditRequest {
  id: string;
  name: string;
  business: string;
  email: string;
  url: string;
  notes: string;
  receivedAt: string;
  userAgent?: string;
  ip?: string;
}

export const runtime = "nodejs";
export const maxDuration = 60;

const NOTIFY_TO = "dustin@ventiscale.com";
const NOTIFY_FROM_EMAIL = "noreply@ventiscale.com";
const NOTIFY_FROM_NAME = "Venti Scale Audit";

// In-memory rate limit. Resets on cold start, which is fine as a soft gate
// against casual abuse, anything serious gets stopped by Vercel's DDoS
// protection upstream. Max 3 submissions per IP per 10 minutes.
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const rateBuckets = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const existing = (rateBuckets.get(ip) || []).filter((t) => t > cutoff);
  if (existing.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(ip, existing);
    return false;
  }
  existing.push(now);
  rateBuckets.set(ip, existing);
  // Opportunistic cleanup so the map doesn't grow unbounded across warm invocations.
  if (rateBuckets.size > 500) {
    for (const [key, stamps] of rateBuckets) {
      const fresh = stamps.filter((t) => t > cutoff);
      if (fresh.length === 0) rateBuckets.delete(key);
      else rateBuckets.set(key, fresh);
    }
  }
  return true;
}

async function brevoSend(payload: Record<string, unknown>) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[audit] BREVO_API_KEY not set, skipping email send");
    return false;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[audit] Brevo send failed", res.status, text);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[audit] Brevo send threw", err);
    return false;
  }
}

async function sendAuditToVisitor(entry: AuditRequest, result: AuditResult) {
  const { subject, html, text } = renderAuditEmail(result, entry.email, entry.business);
  return brevoSend({
    sender: { name: NOTIFY_FROM_NAME, email: NOTIFY_FROM_EMAIL },
    to: [{ email: entry.email }],
    replyTo: { email: "dustin@ventiscale.com", name: "Dustin at Venti Scale" },
    subject,
    htmlContent: html,
    textContent: text,
  });
}

async function sendLeadNotification(entry: AuditRequest, result: AuditResult) {
  const failed = result.checks.filter((c) => c.status === "fail").length;
  const warned = result.checks.filter((c) => c.status === "warn").length;
  const passed = result.checks.filter((c) => c.status === "pass").length;
  const gradeColor =
    result.grade === "A" ? "#10E39A" :
    result.grade === "B" ? "#10E39A" :
    result.grade === "C" ? "#F5B841" :
    "#C8362B";

  const subtle = "rgba(255,255,255,0.55)";
  const muted = "rgba(255,255,255,0.72)";
  const rowStyle = `padding:8px 14px 8px 0;color:${subtle};font-family:'SF Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;vertical-align:top;`;
  const valStyle = `padding:8px 0;color:#F5F6FA;font-size:14px;vertical-align:top;`;

  const reachableRow = result.reachable
    ? `<tr><td style="${rowStyle}">Grade</td><td style="${valStyle}"><strong style="color:${gradeColor};font-size:22px;font-family:Georgia,serif;">${result.grade}</strong> <span style="color:${subtle};font-size:13px;">· ${result.score}/100</span></td></tr>
       <tr><td style="${rowStyle}">Checks</td><td style="${valStyle}"><span style="color:#C8362B;">${failed} failed</span> · <span style="color:#F5B841;">${warned} warnings</span> · <span style="color:#10E39A;">${passed} passed</span></td></tr>
       <tr><td style="${rowStyle}">Final URL</td><td style="${valStyle}"><a href="${result.finalUrl}" style="color:#5280FF;text-decoration:none;">${result.finalUrl}</a></td></tr>`
    : `<tr><td style="${rowStyle}">Status</td><td style="${valStyle};color:#C8362B;"><strong>UNREACHABLE</strong>. ${result.error || "site did not respond"}</td></tr>`;

  const subject = result.reachable
    ? `New audit lead: ${entry.url} · Grade ${result.grade} (${result.score})`
    : `New audit lead: ${entry.url} · UNREACHABLE`;

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const notesHtml = entry.notes
    ? escapeHtml(entry.notes).replace(/\n/g, "<br>")
    : `<span style="color:${subtle};">(none)</span>`;

  const htmlContent = `
    <div style="background:#07080C;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#11131B;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px 32px;">
        <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${subtle};margin-bottom:10px;">
          Venti Scale · New lead
        </div>
        <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:26px;font-weight:400;letter-spacing:-0.01em;color:#F5F6FA;">
          New audit lead
        </h1>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="${rowStyle}">Name</td><td style="${valStyle}">${escapeHtml(entry.name)}</td></tr>
          <tr><td style="${rowStyle}">Business</td><td style="${valStyle}">${escapeHtml(entry.business)}</td></tr>
          <tr><td style="${rowStyle}">Website</td><td style="${valStyle}"><a href="${result.finalUrl || entry.url}" style="color:#5280FF;text-decoration:none;">${escapeHtml(entry.url)}</a></td></tr>
          <tr><td style="${rowStyle}">Email</td><td style="${valStyle}"><a href="mailto:${entry.email}" style="color:#5280FF;text-decoration:none;">${escapeHtml(entry.email)}</a></td></tr>
          ${reachableRow}
          <tr><td style="${rowStyle}">Notes</td><td style="${valStyle}color:${muted};">${notesHtml}</td></tr>
          <tr><td style="${rowStyle}">Received</td><td style="${valStyle}color:${muted};font-size:12px;">${entry.receivedAt}</td></tr>
          <tr><td style="${rowStyle}">ID</td><td style="${valStyle}font-family:'SF Mono',Menlo,monospace;font-size:11px;color:${subtle};">${entry.id}</td></tr>
          <tr><td style="${rowStyle}">IP</td><td style="${valStyle}font-family:'SF Mono',Menlo,monospace;font-size:11px;color:${subtle};">${entry.ip || "unknown"}</td></tr>
        </table>
        <div style="margin-top:28px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0;font-size:13px;color:${muted};line-height:1.55;">
            Their plan email is on the way. Reply directly to this notification to follow up with them today.
          </p>
        </div>
      </div>
    </div>
  `.trim();

  return brevoSend({
    sender: { name: NOTIFY_FROM_NAME, email: NOTIFY_FROM_EMAIL },
    to: [{ email: NOTIFY_TO }],
    replyTo: { email: entry.email },
    subject,
    htmlContent,
  });
}

function escapeMarkdown(s: string) {
  // Telegram Markdown (legacy) parse_mode, escape the reserved chars that
  // commonly trip it up. Good enough for our plain-text user inputs.
  return s.replace(/([_*`\[])/g, "\\$1");
}

async function sendTelegramPing(entry: AuditRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return;
  }
  try {
    const notesBlock = entry.notes
      ? `\n\n*Notes from them:*\n${escapeMarkdown(entry.notes)}`
      : "";
    const text =
      `🔥 *New AI audit request*\n\n` +
      `*Name:* ${escapeMarkdown(entry.name)}\n` +
      `*Business:* ${escapeMarkdown(entry.business)}\n` +
      `*Website:* ${escapeMarkdown(entry.url)}\n` +
      `*Email:* ${escapeMarkdown(entry.email)}` +
      notesBlock +
      `\n\n_Pull the pitch template at pitch-templates/audit-delivery.md, customize it, and send from hello@ventiscale.com today._`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("[audit] telegram ping threw", err);
  }
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidUrl(s: string) {
  if (!s) return false;
  const cleaned = s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+/.test(cleaned);
}

export async function POST(req: Request) {
  let body: {
    name?: string;
    business?: string;
    email?: string;
    url?: string;
    notes?: string;
    website?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field. Bots that autofill every
  // input get a silent 200 OK so they don't learn anything from the response.
  if (body.website && body.website.trim().length > 0) {
    console.warn("[audit] honeypot tripped", {
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      website: body.website.slice(0, 80),
    });
    return NextResponse.json({ ok: true, id: "hp_blocked" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    console.warn("[audit] rate limit hit", { ip });
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a few minutes or email hello@ventiscale.com." },
      { status: 429 },
    );
  }

  const name = (body.name || "").trim();
  const business = (body.business || "").trim();
  const email = (body.email || "").trim();
  const url = (body.url || "").trim();
  const notes = (body.notes || "").trim().slice(0, 2000);

  if (!name || name.length > 120) {
    return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
  }
  if (!business || business.length > 160) {
    return NextResponse.json({ ok: false, error: "Invalid business" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (!isValidUrl(url)) {
    return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
  }

  const entry: AuditRequest = {
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    business,
    email,
    url,
    notes,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") || undefined,
    ip: ip !== "unknown" ? ip : undefined,
  };

  console.log("[audit] new request", JSON.stringify(entry));

  // All heavy lifting runs after the response is sent so the visitor sees
  // instant success. Claude can take its time thinking, freshness probes can
  // hit slow sitemaps, Brevo can retry, none of it blocks the user. after()
  // still counts against maxDuration (60s) but doesn't make the user wait.
  after(async () => {
    let result: AuditResult | null = null;
    try {
      result = await runAudit(url);
      console.log(
        "[audit] result",
        entry.id,
        result.reachable ? `${result.grade} ${result.score}/100` : `UNREACHABLE: ${result.error}`,
      );
    } catch (err) {
      console.error("[audit] runAudit threw", err);
    }

    if (result) {
      await Promise.allSettled([
        sendAuditToVisitor(entry, result),
        sendLeadNotification(entry, result),
      ]);
    }

    try {
      await sendTelegramPing(entry);
    } catch (err) {
      console.error("[audit] telegram ping threw", err);
    }
  });

  // Respond immediately. The UI shows "Audit queued" and tells the visitor
  // their plan is being written and will land in their inbox shortly.
  return NextResponse.json({ ok: true, id: entry.id });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: 0,
    requests: [],
    note: "Audit requests are logged to Vercel function logs only. Persistence pending.",
  });
}
