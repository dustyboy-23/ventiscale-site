import { NextResponse } from "next/server";

// Vercel serverless functions are read-only — filesystem persistence is not
// available here. This route currently logs incoming audit requests so they
// show up in Vercel's function logs. Wire to Supabase / Resend / a webhook
// in a follow-up so requests get captured + emailed automatically.

interface AuditRequest {
  id: string;
  email: string;
  url: string;
  receivedAt: string;
  userAgent?: string;
  ip?: string;
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

  // Visible in Vercel function logs. Replace with Supabase insert + Resend email later.
  console.log("[audit] new request", JSON.stringify(entry));

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
