import { NextResponse, after } from "next/server";
import {
  runAudit,
  buildMarketingPlan,
  type AuditResult,
} from "@/lib/audit";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

// Audit lead capture + real audit generation:
// 1. Validates input
// 2. Persists the lead to Supabase (audit_leads) so nothing is lost
// 3. Runs a 15-check surface audit on the submitted URL
// 4. Stores the audit results + marketing plan on the row
// 5. Telegram pings on new lead
//
// Email delivery (visitor audit report + lead notification) is handled
// asynchronously by the local cron worker at
//   ~/venti-scale/portal/scripts/send-pending-audit-emails.py
// which sends from dustin@ventiscale.com via the already-authed gog Gmail
// OAuth setup. This route never touches a transactional email API.

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

// Persistent rate limit via Supabase rate_limits table. Max 3 audit
// submissions per IP per 10 minutes. Survives cold starts, which the
// old in-memory Map did not.
const AUDIT_RATE_LIMIT_MAX = 3;
const AUDIT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function escapeMarkdown(s: string) {
  // Telegram Markdown (legacy) parse_mode, escape the reserved chars that
  // commonly trip it up. Good enough for our plain-text user inputs.
  return s.replace(/([_*`\[])/g, "\\$1");
}

async function sendTelegramPing(entry: AuditRequest): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return false;
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
      `\n\n_The audit email queue worker will deliver their plan within 5 minutes._`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[audit] telegram ping threw", err);
    return false;
  }
}

async function sendTelegramAlert(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[audit] telegram alert threw", err);
    return false;
  }
}

async function insertLead(entry: AuditRequest) {
  const db = createAdminClient();
  if (!db) {
    console.warn("[audit] supabase admin client unavailable, skipping insert");
    return false;
  }
  const { error } = await db.from("audit_leads").insert({
    id: entry.id,
    received_at: entry.receivedAt,
    name: entry.name,
    business: entry.business,
    email: entry.email,
    url: entry.url,
    notes: entry.notes || null,
    ip: entry.ip || null,
    user_agent: entry.userAgent || null,
  });
  if (error) {
    console.error("[audit] insertLead failed", error.message);
    return false;
  }
  return true;
}

async function updateLead(id: string, patch: Record<string, unknown>) {
  const db = createAdminClient();
  if (!db) return;
  const { error } = await db.from("audit_leads").update(patch).eq("id", id);
  if (error) {
    console.error("[audit] updateLead failed", id, error.message);
  }
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidUrl(s: string) {
  if (!s) return false;
  const cleaned = s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  // Must look like a real hostname with a TLD. Reject bare IP literals
  // (the fetchHtml SSRF guard catches them too, but we'd rather never
  // touch the network in the first place). At least one alpha char
  // between dots keeps 169.254.169.254 / 127.0.0.1 / 10.0.0.1 out.
  const host = cleaned.split("/")[0];
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) return false;
  if (/^\d+(\.\d+)+$/.test(host)) return false;
  // Require the TLD to contain at least one letter — no numeric TLDs.
  const tld = host.split(".").pop() || "";
  if (!/[a-z]/.test(tld)) return false;
  return true;
}

// Only allow browser form POSTs from our own marketing site. Server-to-
// server callers (curl, Postman, test runners) have no Origin header and
// are allowed through — only cross-site browser POSTs get blocked. This
// is a lightweight CSRF control for an unauthed endpoint; the real spam
// shield is rate limiting + the honeypot.
const ALLOWED_ORIGINS = new Set([
  "https://www.ventiscale.com",
  "https://ventiscale.com",
  "http://localhost:3000",
  "http://localhost:3030",
]);

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

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
    console.warn("[audit] honeypot tripped");
    return NextResponse.json({ ok: true, id: "hp_blocked" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rateOk = await checkRateLimit(
    `audit:${ip}`,
    AUDIT_RATE_LIMIT_MAX,
    AUDIT_RATE_LIMIT_WINDOW_MS,
  );
  if (!rateOk) {
    console.warn("[audit] rate limit hit");
    return NextResponse.json(
      { ok: false, error: "You've run a few audits already. Give it 10 minutes and try again, or just email me at hello@ventiscale.com." },
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

  // Log only the non-PII parts. The full entry (name/email/notes/IP)
  // lands in the audit_leads table where it belongs, not in Vercel logs.
  console.log("[audit] new request", { id: entry.id, host: new URL(url).host });

  // All heavy lifting runs after the response is sent so the visitor sees
  // instant success. The lead is persisted first thing so nothing is lost
  // even if the audit step fails. Email delivery happens out-of-band via
  // the local cron worker; this route never sends mail itself.
  after(async () => {
    await insertLead(entry);

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
      const planMarkdown = result.reachable ? buildMarketingPlan(result, business) : null;
      await updateLead(entry.id, {
        final_url: result.finalUrl || null,
        reachable: result.reachable,
        grade: result.grade || null,
        score: typeof result.score === "number" ? result.score : null,
        error: result.error || null,
        checks: result.checks || null,
        plan_markdown: planMarkdown,
      });
    } else {
      await updateLead(entry.id, { reachable: false, error: "runAudit threw" });
      await sendTelegramAlert(
        `🚨 *Audit crashed*\n\nLead: ${escapeMarkdown(entry.name)} (${escapeMarkdown(entry.email)})\nSite: ${escapeMarkdown(entry.url)}\nLead ID: \`${entry.id}\`\n\nrunAudit threw before completing. Check logs and manually email them.`,
      );
    }

    const telegramSent = await sendTelegramPing(entry);
    await updateLead(entry.id, { telegram_sent: telegramSent });
  });

  // Respond immediately. The UI shows "Audit queued" and tells the visitor
  // their plan is being written and will land in their inbox shortly.
  return NextResponse.json({ ok: true, id: entry.id });
}
