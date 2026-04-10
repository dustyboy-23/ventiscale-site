import { NextResponse } from "next/server";
import { runAudit, renderAuditEmail, type AuditResult } from "@/lib/audit";

// Audit lead capture + real audit generation:
// 1. Validates input
// 2. Runs a 15-check surface audit on the submitted URL
// 3. Emails the visitor their personalized audit report (Brevo)
// 4. Notifies dustin@ventiscale.com with lead + grade summary (Brevo)
// 5. Logs to Vercel function logs as a backup record
//
// Brevo API key lives in BREVO_API_KEY (Vercel env). If the key is missing
// the route still returns 200 so the form never appears broken to a visitor
// — the lead is preserved in function logs and can be backfilled by hand.

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
export const maxDuration = 30;

const NOTIFY_TO = "dustin@ventiscale.com";
const NOTIFY_FROM_EMAIL = "noreply@ventiscale.com";
const NOTIFY_FROM_NAME = "Venti Scale Audit";

async function brevoSend(payload: Record<string, unknown>) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[audit] BREVO_API_KEY not set — skipping email send");
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
  const { subject, html, text } = renderAuditEmail(result, entry.email);
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
    result.grade === "A" ? "#1F3D2B" :
    result.grade === "B" ? "#2E5B3E" :
    result.grade === "C" ? "#A06A00" :
    "#A12A1A";

  const reachableRow = result.reachable
    ? `<tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Grade</td><td style="padding:6px 0;"><strong style="color:${gradeColor};font-size:18px;">${result.grade}</strong> <span style="color:#1B1B1B;opacity:0.5;">(${result.score}/100)</span></td></tr>
       <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Checks</td><td style="padding:6px 0;">${failed} failed · ${warned} warnings · ${passed} passed</td></tr>
       <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Final URL</td><td style="padding:6px 0;"><a href="${result.finalUrl}">${result.finalUrl}</a></td></tr>`
    : `<tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Status</td><td style="padding:6px 0;color:#A12A1A;"><strong>UNREACHABLE</strong> — ${result.error || "site did not respond"}</td></tr>`;

  const subject = result.reachable
    ? `New audit lead: ${entry.url} — Grade ${result.grade} (${result.score})`
    : `New audit lead: ${entry.url} — UNREACHABLE`;

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const notesHtml = entry.notes
    ? escapeHtml(entry.notes).replace(/\n/g, "<br>")
    : "(none)";

  const htmlContent = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1B1B1B;">
      <h2 style="margin:0 0 16px;font-weight:500;">New audit lead</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Name</td><td style="padding:6px 0;">${escapeHtml(entry.name)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Type of business</td><td style="padding:6px 0;">${escapeHtml(entry.business)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Website</td><td style="padding:6px 0;"><a href="${result.finalUrl || entry.url}">${entry.url}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Email</td><td style="padding:6px 0;"><a href="mailto:${entry.email}">${entry.email}</a></td></tr>
        ${reachableRow}
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;vertical-align:top;">Notes from them</td><td style="padding:6px 0;">${notesHtml}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Received</td><td style="padding:6px 0;">${entry.receivedAt}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px;">${entry.id}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">IP</td><td style="padding:6px 0;font-family:monospace;font-size:12px;">${entry.ip || "—"}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:#1B1B1B;opacity:0.6;">Audit email was sent to the visitor. Reply directly to follow up.</p>
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
  // Telegram Markdown (legacy) parse_mode — escape the reserved chars that
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
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
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
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined,
  };

  console.log("[audit] new request", JSON.stringify(entry));

  // Run the audit. Failures here should never fail the response — the lead
  // is still captured and Dusty can follow up manually.
  let result: AuditResult | null = null;
  try {
    result = await runAudit(url);
    console.log("[audit] result", entry.id, result.reachable ? `${result.grade} ${result.score}/100` : `UNREACHABLE: ${result.error}`);
  } catch (err) {
    console.error("[audit] runAudit threw", err);
  }

  // Fire both emails in parallel. Failures are logged, never thrown.
  if (result) {
    await Promise.allSettled([
      sendAuditToVisitor(entry, result),
      sendLeadNotification(entry, result),
    ]);
  }

  // Fire-and-forget Telegram ping. Never blocks or fails the response.
  void sendTelegramPing(entry);

  return NextResponse.json({
    ok: true,
    id: entry.id,
    ...(result && result.reachable
      ? { score: result.score, grade: result.grade }
      : {}),
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: 0,
    requests: [],
    note: "Audit requests are logged to Vercel function logs only. Persistence pending.",
  });
}
