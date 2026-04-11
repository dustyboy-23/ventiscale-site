"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

const FROM_EMAIL = "noreply@ventiscale.com";
const FROM_NAME = "Venti Scale";
const REPLY_TO_EMAIL = "dustin@ventiscale.com";
const REPLY_TO_NAME = "Dusty at Venti Scale";

// Persistent rate limit via rate_limits table. 5 magic link requests
// per email per 10 minutes. Keyed by email so an attacker trying to
// enumerate users can't use a single IP to spray, and a victim who
// mistypes their address a few times isn't locked out of the whole
// service.
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export type RequestLoginResult =
  | { ok: true }
  | { ok: false; error: "rate_limit" | "send_failed" | "supabase_misconfigured" | "invalid_email" };

export async function requestMagicLink(emailRaw: string): Promise<RequestLoginResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "invalid_email" };
  }

  const rateOk = await checkRateLimit(
    `login:${email}`,
    LOGIN_RATE_LIMIT_MAX,
    LOGIN_RATE_LIMIT_WINDOW_MS,
  );
  if (!rateOk) {
    // Don't log the email — PII hygiene.
    console.warn("[login] rate limit hit");
    return { ok: false, error: "rate_limit" };
  }

  const admin = createAdminClient();
  if (!admin) {
    console.error("[login] admin client unavailable — missing Supabase env");
    return { ok: false, error: "supabase_misconfigured" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ventiscale.com";

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error || !data) {
    console.error("[login] generateLink failed", error?.message || error);
    // Supabase returns 422 when the email isn't in auth.users. We pretend
    // success so we don't leak which emails are registered — attacker
    // enumeration defense. The user will just never get an email.
    if (error?.message?.toLowerCase().includes("user not found")) {
      return { ok: true };
    }
    return { ok: false, error: "send_failed" };
  }

  const hashedToken =
    data.properties?.hashed_token ||
    (data as unknown as { hashed_token?: string }).hashed_token;

  if (!hashedToken) {
    console.error("[login] no hashed_token in generateLink response");
    return { ok: false, error: "send_failed" };
  }

  const link = `${siteUrl}/auth/confirm?token_hash=${hashedToken}&type=magiclink`;
  const sent = await sendLoginEmail(email, link);
  if (!sent) {
    return { ok: false, error: "send_failed" };
  }
  return { ok: true };
}

async function sendLoginEmail(email: string, link: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[login] BREVO_API_KEY not set, cannot send");
    return false;
  }

  const { html, text, subject } = renderLoginEmail(link);

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email }],
        replyTo: { email: REPLY_TO_EMAIL, name: REPLY_TO_NAME },
        subject,
        htmlContent: html,
        textContent: text,
        tags: ["portal-login"],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[login] Brevo send failed", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[login] Brevo send threw", err);
    return false;
  }
}

function renderLoginEmail(link: string): { subject: string; html: string; text: string } {
  const subject = "Your Venti Scale sign-in link";

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background:#F6F7F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0B0E1A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7F9; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:16px; border:1px solid #E6E8EE; box-shadow:0 4px 24px rgba(10,14,31,0.04); overflow:hidden;">
          <tr>
            <td style="padding:36px 36px 8px 36px;">
              <div style="display:inline-block; width:36px; height:36px; background:#0B0E1A; border-radius:9px; text-align:center; line-height:36px; color:#ffffff; font-weight:700; font-size:14px; letter-spacing:-0.02em;">VS</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 0 36px;">
              <h1 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; font-weight:700; letter-spacing:-0.01em; color:#0B0E1A;">Here's your sign-in link</h1>
              <p style="margin:0 0 28px 0; font-size:14px; line-height:1.6; color:#475063;">Click the button below to sign in to your Venti Scale portal. The link works one time and expires in about an hour.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 8px 36px;">
              <a href="${link}" style="display:inline-block; background:#0B0E1A; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; padding:14px 22px; border-radius:10px;">Sign in to Venti Scale →</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 12px 36px;">
              <p style="margin:0; font-size:12px; line-height:1.6; color:#7B8597;">Or paste this URL into your browser:</p>
              <p style="margin:6px 0 0 0; font-size:12px; line-height:1.5; color:#475063; word-break:break-all;"><a href="${link}" style="color:#475063; text-decoration:underline;">${link}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 32px 36px; border-top:1px solid #EEF0F5; margin-top:16px;">
              <p style="margin:16px 0 0 0; font-size:12px; line-height:1.6; color:#7B8597;">Didn't request this? You can ignore it — nobody gets in without clicking the link above.</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0 0; font-size:11px; color:#98A1B2;">Venti Scale · <a href="mailto:dustin@ventiscale.com" style="color:#98A1B2;">dustin@ventiscale.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Here's your sign-in link

Click this to sign in to your Venti Scale portal. It works one time and expires in about an hour.

${link}

Didn't request this? You can ignore it — nobody gets in without clicking the link above.

— Dusty at Venti Scale`;

  return { subject, html, text };
}
