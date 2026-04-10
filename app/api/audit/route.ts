import { NextResponse } from "next/server";

// Audit lead capture: validates input, logs to Vercel function logs, and
// emails dustin@ventiscale.com via Brevo Transactional API. Brevo key lives
// in BREVO_API_KEY (Vercel env). If the key is missing the route still
// returns 200 so the form never appears broken to a visitor — the lead is
// preserved in function logs and can be backfilled.

interface AuditRequest {
  id: string;
  email: string;
  url: string;
  receivedAt: string;
  userAgent?: string;
  ip?: string;
}

const NOTIFY_TO = "dustin@ventiscale.com";
const NOTIFY_FROM_EMAIL = "noreply@ventiscale.com";
const NOTIFY_FROM_NAME = "Venti Scale Audit";

async function sendBrevoNotification(entry: AuditRequest) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[audit] BREVO_API_KEY not set — skipping email notification");
    return;
  }

  const subject = `New audit request: ${entry.url}`;
  const htmlContent = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1B1B1B;">
      <h2 style="margin:0 0 16px;font-weight:500;">New audit request</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">URL</td><td style="padding:6px 0;"><a href="https://${entry.url.replace(/^https?:\/\//, "")}">${entry.url}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Email</td><td style="padding:6px 0;"><a href="mailto:${entry.email}">${entry.email}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">Received</td><td style="padding:6px 0;">${entry.receivedAt}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px;">${entry.id}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#1B1B1B;opacity:0.6;">IP</td><td style="padding:6px 0;font-family:monospace;font-size:12px;">${entry.ip || "—"}</td></tr>
      </table>
    </div>
  `.trim();

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: NOTIFY_FROM_NAME, email: NOTIFY_FROM_EMAIL },
        to: [{ email: NOTIFY_TO }],
        replyTo: { email: entry.email },
        subject,
        htmlContent,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[audit] Brevo send failed", res.status, text);
    }
  } catch (err) {
    console.error("[audit] Brevo send threw", err);
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
  let body: { email?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const url = (body.url || "").trim();

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (!isValidUrl(url)) {
    return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
  }

  const entry: AuditRequest = {
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    email,
    url,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") || undefined,
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined,
  };

  // Visible in Vercel function logs as a backup record of every lead.
  console.log("[audit] new request", JSON.stringify(entry));

  // Fire-and-await Brevo notification. Failures are logged but never thrown:
  // a flaky email provider should not fail a working form submission.
  await sendBrevoNotification(entry);

  return NextResponse.json({ ok: true, id: entry.id });
}

export async function GET() {
  // Storage layer is intentionally absent in serverless. Returning empty list
  // until a real backing store is wired up.
  return NextResponse.json({
    ok: true,
    count: 0,
    requests: [],
    note: "Audit requests are logged to Vercel function logs only. Persistence pending.",
  });
}
