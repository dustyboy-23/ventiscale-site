import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { money, parsePlan, quote } from "@/lib/pricing";

// "Start my plan" requests from the public site.
//
// 1. Validates input and recomputes the price server-side from lib/pricing
//    (the browser's totals are never trusted).
// 2. Persists the request to audit_leads (the existing leads table). The
//    `reachable` column stays NULL, so the audit email worker
//    (scripts/send-pending-audit-emails.py) never picks these rows up.
// 3. Telegram ping so the founder can reply personally.
// 4. Only then answers. If BOTH 2 and 3 failed the visitor gets an error,
//    never a false "sent".
//
// No email is sent from here and nothing is charged. The page promises a
// personal reply within one business day; that reply is a human's job.

export const runtime = "nodejs";
export const maxDuration = 30;

const RATE_MAX = 4;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const ALLOWED_ORIGINS = new Set([
  "https://www.ventiscale.com",
  "https://ventiscale.com",
  "http://localhost:3000",
  "http://localhost:3030",
]);

function escapeMarkdown(s: string) {
  return s.replace(/([_*`\[])/g, "\\$1");
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 200;
}

function cleanUrl(s: string): string | null {
  const t = s.trim();
  if (!t) return "";
  const host = t.toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) return null;
  if (/^\d+(\.\d+)+$/.test(host)) return null;
  return t.slice(0, 300);
}

async function telegram(text: string): Promise<boolean> {
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
    console.error("[start] telegram threw", err);
    return false;
  }
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json(
      { ok: false, error: "This form only works on ventiscale.com. Email hello@ventiscale.com instead." },
      { status: 403 },
    );
  }

  let body: {
    name?: string;
    business?: string;
    email?: string;
    url?: string;
    notes?: string;
    plan?: string;
    website?: string; // honeypot
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.website && body.website.trim().length > 0) {
    console.warn("[start] honeypot tripped");
    return NextResponse.json({ ok: true, id: "hp_blocked" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rateOk = await checkRateLimit(`start:${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!rateOk) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "That's a few requests in a row. Give it 10 minutes, or email hello@ventiscale.com and I'll pick it up from there.",
      },
      { status: 429 },
    );
  }

  const name = (body.name || "").trim();
  const business = (body.business || "").trim();
  const email = (body.email || "").trim();
  const notes = (body.notes || "").trim().slice(0, 2000);
  const url = cleanUrl(body.url || "");
  const ids = parsePlan(body.plan);

  if (!name || name.length > 120) {
    return NextResponse.json({ ok: false, error: "Add your name so I know who I'm writing to." }, { status: 400 });
  }
  if (!business || business.length > 160) {
    return NextResponse.json({ ok: false, error: "Add your business name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right. Check it and try again." }, { status: 400 });
  }
  if (url === null) {
    return NextResponse.json(
      { ok: false, error: "That website address doesn't look right. Fix it, or leave it blank if you don't have one." },
      { status: 400 },
    );
  }
  if (ids.length === 0) {
    return NextResponse.json({ ok: false, error: "Pick at least one service." }, { status: 400 });
  }

  const q = quote(ids);
  const planLine = `${q.services.map((s) => s.name).join(", ")} | ${money(q.monthly)}/mo + ${money(q.setup)} setup`;
  const id = `plan_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  console.log("[start] new plan request", { id, services: q.ids, monthly: q.monthly });

  // Save and notify BEFORE answering. The page tells the visitor their
  // request is in, so that has to be true: if it reached neither the leads
  // table nor Telegram, they get an error and the email address instead.
  const db = createAdminClient();
  let stored = false;
  if (db) {
    const { error } = await db.from("audit_leads").insert({
      id,
      received_at: new Date().toISOString(),
      name,
      business,
      email,
      url: url || "(no website)",
      notes: `[PLAN REQUEST] ${planLine}${notes ? `\n\n${notes}` : ""}`,
      ip: ip !== "unknown" ? ip : null,
      user_agent: req.headers.get("user-agent") || null,
    });
    if (error) console.error("[start] insert failed", error.message);
    else stored = true;
  } else {
    console.warn("[start] supabase admin client unavailable");
  }

  const pinged = await telegram(
    `🟢 *New plan request*\n\n` +
      `*Name:* ${escapeMarkdown(name)}\n` +
      `*Business:* ${escapeMarkdown(business)}\n` +
      `*Website:* ${escapeMarkdown(url || "none")}\n` +
      `*Email:* ${escapeMarkdown(email)}\n\n` +
      `*Plan:* ${escapeMarkdown(q.services.map((s) => s.name).join(", "))}\n` +
      `*Monthly:* ${money(q.monthly)}` +
      (q.saved > 0 ? ` (list ${money(q.listMonthly)}, ${q.discount * 100}% bundle)` : "") +
      `\n*Setup:* ${money(q.setup)}` +
      (notes ? `\n\n*Their note:*\n${escapeMarkdown(notes)}` : "") +
      `\n\n_The site promised a reply within one business day._` +
      (stored ? "" : `\n⚠️ Not saved to the leads table. This message is the only copy.`),
  );

  // Record whether the ping went out, so the leads table shows it.
  if (stored && db) {
    const { error } = await db.from("audit_leads").update({ telegram_sent: pinged }).eq("id", id);
    if (error) console.error("[start] telegram_sent update failed", error.message);
  }

  if (!stored && !pinged) {
    console.error("[start] request reached neither the leads table nor Telegram", { id });
    return NextResponse.json(
      {
        ok: false,
        error:
          "Your request didn't save on my end. Email hello@ventiscale.com with the services you want and I'll take it from there.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id });
}
