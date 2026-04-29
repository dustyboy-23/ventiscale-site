#!/usr/bin/env python3
"""
Drain pending audit emails from audit_leads via gog Gmail.

The /api/audit route persists each submission to audit_leads and runs the
full audit, but does NOT send any email itself. This worker is the email
transport layer:

  1. Query audit_leads for rows where the audit has completed
     (reachable IS NOT NULL) AND email_visitor_sent IS NOT TRUE.
  2. For each row, build the visitor audit-report email and the founder
     lead-notification email.
  3. Send both via `gog gmail send` from dustin@ventiscale.com.
  4. Mark email_visitor_sent / email_lead_sent / *_sent_at on success.
  5. Telegram alert on failure (single alert per row per run).

Cron: */5 * * * * (every 5 min). The visitor sees the audit form's
"Audit queued, plan landing in your inbox shortly" UX and the email
arrives within 5 minutes.

Why gog instead of a transactional email API:
  Sending via the already-authenticated Workspace Gmail account has zero
  setup cost (no API key, no DNS verification, no third-party SaaS) and
  excellent deliverability since ventiscale.com is already a verified
  Workspace domain. Free up to 500 sends/day; current audit volume is
  <30/month so quota is irrelevant.

Usage:
  python3 scripts/send-pending-audit-emails.py
  python3 scripts/send-pending-audit-emails.py --dry-run
  python3 scripts/send-pending-audit-emails.py --limit 5
"""

import argparse
import json
import os
import shlex
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from html import escape as html_escape
from pathlib import Path
from typing import Optional

PORTAL_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PORTAL_ROOT / ".env.local"
TELEGRAM_ENV_PATH = Path("/home/dustin/.openclaw/.secure/telegram.env")

GOG = os.environ.get("GOG_BIN", "/home/dustin/.local/bin/gog")
SEND_FROM_ACCOUNT = "dustin@ventiscale.com"
LEAD_NOTIFY_TO = "dustin@ventiscale.com"
DEFAULT_LIMIT = 25

# CASL (Canada) + CAN-SPAM (US) require every commercial email to include the
# sender's physical mailing address and a working unsubscribe mechanism.
# Both env vars come from .env.local (loaded via load_env). If
# VS_BUSINESS_ADDRESS is unset, the footer falls back to a clearly-marked
# placeholder so non-compliant sends are visible immediately rather than
# silent.
BUSINESS_NAME_FALLBACK = "Venti Scale LLC"
BUSINESS_ADDRESS_FALLBACK = "[mailing address pending — set VS_BUSINESS_ADDRESS in .env.local]"


def load_env(path: Path) -> dict:
    env = {}
    if not path.exists():
        return env
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def supabase_request(method: str, url: str, headers: dict, body: Optional[dict] = None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, method=method, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            text = r.read().decode("utf-8")
            return r.status, json.loads(text) if text else None
    except urllib.error.HTTPError as e:
        body_text = e.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"supabase {method} {url} -> {e.code}: {body_text}") from None


def first_name(full: str) -> str:
    if not full:
        return ""
    return full.strip().split()[0]


def clean_hostname(url: str) -> str:
    if not url:
        return ""
    cleaned = url.strip().lower()
    cleaned = cleaned.replace("https://", "").replace("http://", "")
    cleaned = cleaned.split("/")[0]
    if cleaned.startswith("www."):
        cleaned = cleaned[4:]
    return cleaned


def build_compliance_footer(env: dict) -> tuple[str, str]:
    """Returns (text_footer, html_footer) for CASL + CAN-SPAM compliance.

    Required elements:
      - identification of the sender (business name)
      - physical mailing address
      - reason recipient is being contacted (consent reminder)
      - working opt-out mechanism (Reply STOP, manual processing within 10 bd)
      - link to privacy policy
    """
    business = env.get("VS_BUSINESS_NAME") or BUSINESS_NAME_FALLBACK
    address = env.get("VS_BUSINESS_ADDRESS") or BUSINESS_ADDRESS_FALLBACK
    text = (
        "\n\n--\n"
        "Why you got this email: you requested an audit at ventiscale.com. The audit and the growth plan above were prepared in response to that request.\n\n"
        "Don't want any further emails from me? Reply with the word STOP and I'll never email you again. (Allow up to 10 business days to process.)\n\n"
        f"{business} · {address}\n"
        "Privacy: https://www.ventiscale.com/privacy\n"
        "Contact: hello@ventiscale.com\n"
    )
    html = (
        "<div style=\"margin-top:48px;padding-top:24px;border-top:1px solid #eee;color:#888;font-size:12px;line-height:1.6;\">"
        "<p style=\"margin:0 0 8px;\"><strong style=\"color:#666;\">Why you got this email:</strong> you requested an audit at "
        "<a href=\"https://www.ventiscale.com\" style=\"color:#888;\">ventiscale.com</a>. The audit and the growth plan above were prepared in response to that request.</p>"
        "<p style=\"margin:0 0 8px;\">Don't want any further emails from me? Reply with the word <strong style=\"color:#666;\">STOP</strong> and I'll never email you again. (Allow up to 10 business days to process.)</p>"
        f"<p style=\"margin:0 0 4px;\">{html_escape(business)} &middot; {html_escape(address)}</p>"
        "<p style=\"margin:0;\"><a href=\"https://www.ventiscale.com/privacy\" style=\"color:#888;\">Privacy Policy</a> &middot; "
        "<a href=\"mailto:hello@ventiscale.com\" style=\"color:#888;\">hello@ventiscale.com</a></p>"
        "</div>"
    )
    return text, html


def render_visitor_email(row: dict, env: dict) -> dict:
    """Returns {subject, html, text} for the visitor's audit report email."""
    name = row.get("name") or ""
    email = row.get("email") or ""
    business = row.get("business") or ""
    url = row.get("url") or ""
    final_url = row.get("final_url") or url
    grade = row.get("grade") or ""
    score = row.get("score")
    reachable = row.get("reachable")
    error = row.get("error") or ""
    checks = row.get("checks") or []
    plan_markdown = row.get("plan_markdown") or ""
    footer_text, footer_html = build_compliance_footer(env)

    display_url = clean_hostname(final_url or url)
    first = first_name(name)
    greet = f"Hey {first}," if first else "Hey,"

    if not reachable:
        subject = f"We couldn't reach {display_url}"
        text = (
            f"{greet}\n\n"
            f"I tried to audit {display_url} but got this error:\n  {error}\n\n"
            "Possible causes:\n"
            "  - The URL is wrong or the site is temporarily down.\n"
            "  - Your host blocks automated requests (some CDNs do this).\n"
            "  - DNS isn't resolving from our server.\n\n"
            "Reply to this email with the correct URL and I'll run it manually.\n\n"
            "Dustin Gilmour\nVenti Scale\nhttps://www.ventiscale.com"
            f"{footer_text}"
        )
        html = (
            "<div style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"
            "max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a;line-height:1.55;font-size:15px;\">"
            f"<p>{html_escape(greet)}</p>"
            f"<p>I tried to audit <strong>{html_escape(display_url)}</strong> but got this error:</p>"
            f"<pre style=\"background:#f5f5f5;border:1px solid #ddd;border-radius:6px;padding:12px;font-family:'SF Mono',Consolas,monospace;font-size:13px;\">{html_escape(error)}</pre>"
            "<p>Possible causes:</p>"
            "<ul><li>The URL is wrong or the site is temporarily down.</li>"
            "<li>Your host blocks automated requests (some CDNs do this).</li>"
            "<li>DNS isn't resolving from our server.</li></ul>"
            "<p>Reply to this email with the correct URL and I'll run it manually.</p>"
            "<p style=\"margin-top:32px;color:#555;\">Dustin Gilmour<br>"
            "<a href=\"https://www.ventiscale.com\" style=\"color:#5280FF;text-decoration:none;\">ventiscale.com</a></p>"
            f"{footer_html}"
            "</div>"
        )
        return {"subject": subject, "html": html, "text": text}

    failed = [c for c in checks if c.get("status") == "fail"]
    warned = [c for c in checks if c.get("status") == "warn"]
    passed_count = sum(1 for c in checks if c.get("status") == "pass")

    biz_phrase = f" for {business}" if business else ""
    subject = f"Your {display_url} audit: Grade {grade} ({score}/100)"

    plan_html_blocks = []
    for line in plan_markdown.splitlines():
        line = line.rstrip()
        if not line:
            plan_html_blocks.append("")
            continue
        if line.startswith("# "):
            plan_html_blocks.append(
                f"<h2 style=\"font-family:Georgia,serif;font-size:22px;font-weight:500;margin:24px 0 8px;color:#1a1a1a;\">{html_escape(line[2:])}</h2>"
            )
        elif line.startswith("## "):
            plan_html_blocks.append(
                f"<h3 style=\"font-family:Georgia,serif;font-size:18px;font-weight:500;margin:20px 0 6px;color:#1a1a1a;\">{html_escape(line[3:])}</h3>"
            )
        elif line.startswith("### "):
            plan_html_blocks.append(
                f"<h4 style=\"font-size:15px;font-weight:600;margin:16px 0 4px;color:#1a1a1a;\">{html_escape(line[4:])}</h4>"
            )
        elif line.startswith("- "):
            plan_html_blocks.append(
                f"<div style=\"margin:4px 0 4px 16px;\">• {html_escape(line[2:])}</div>"
            )
        else:
            plan_html_blocks.append(f"<p style=\"margin:8px 0;\">{html_escape(line)}</p>")
    plan_html = "\n".join(plan_html_blocks)

    fail_html = ""
    if failed:
        fail_items = "\n".join(
            f"<li><strong>{html_escape(c.get('label',''))}</strong>: {html_escape(c.get('detail',''))}</li>"
            for c in failed[:8]
        )
        fail_html = (
            "<div style=\"background:#fff5f4;border-left:3px solid #C8362B;padding:14px 18px;margin:20px 0;border-radius:4px;\">"
            "<div style=\"font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#C8362B;margin-bottom:8px;\">"
            f"What's broken ({len(failed)} fail{'s' if len(failed) != 1 else ''})</div>"
            f"<ul style=\"margin:0;padding-left:20px;line-height:1.6;\">{fail_items}</ul></div>"
        )

    warn_html = ""
    if warned:
        warn_items = "\n".join(
            f"<li><strong>{html_escape(c.get('label',''))}</strong>: {html_escape(c.get('detail',''))}</li>"
            for c in warned[:8]
        )
        warn_html = (
            "<div style=\"background:#fff9f0;border-left:3px solid #F5B841;padding:14px 18px;margin:20px 0;border-radius:4px;\">"
            "<div style=\"font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#B07900;margin-bottom:8px;\">"
            f"What needs attention ({len(warned)} warning{'s' if len(warned) != 1 else ''})</div>"
            f"<ul style=\"margin:0;padding-left:20px;line-height:1.6;\">{warn_items}</ul></div>"
        )

    grade_color = "#10A36F" if grade in ("A", "B") else ("#B07900" if grade == "C" else "#C8362B")

    html = (
        "<div style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"
        "max-width:640px;margin:0 auto;padding:32px 24px;color:#1a1a1a;line-height:1.55;font-size:15px;\">"
        f"<p>{html_escape(greet)}</p>"
        f"<p>I ran the audit on <strong>{html_escape(display_url)}</strong>{html_escape(biz_phrase)}. "
        "Below is what I found, along with the growth plan I'd ship for you.</p>"
        "<div style=\"display:flex;gap:20px;align-items:baseline;margin:24px 0 28px;padding:18px 22px;background:#fafafa;border-radius:8px;border:1px solid #eee;\">"
        f"<div style=\"font-family:Georgia,serif;font-size:42px;font-weight:500;color:{grade_color};line-height:1;\">{html_escape(grade)}</div>"
        f"<div style=\"font-size:14px;color:#666;\">{score}/100 &middot; {len(failed)} failed &middot; {len(warned)} warnings &middot; {passed_count} passed</div>"
        "</div>"
        f"{fail_html}{warn_html}"
        "<div style=\"margin:32px 0 16px;padding-top:24px;border-top:1px solid #eee;\">"
        "<div style=\"font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#666;margin-bottom:12px;\">"
        "What I'd ship for you</div>"
        f"{plan_html}"
        "</div>"
        "<p style=\"margin-top:32px;\">Want me to actually do this work? Reply to this email or "
        "<a href=\"https://www.ventiscale.com#audit\" style=\"color:#5280FF;text-decoration:none;\">check out what running on Venti Scale looks like</a>.</p>"
        "<p style=\"margin-top:28px;color:#555;\">Dustin Gilmour<br>"
        "<a href=\"https://www.ventiscale.com\" style=\"color:#5280FF;text-decoration:none;\">ventiscale.com</a></p>"
        f"{footer_html}"
        "</div>"
    )

    text_lines = [
        greet,
        "",
        f"I ran the audit on {display_url}{biz_phrase}.",
        f"Grade: {grade} ({score}/100)",
        f"Checks: {len(failed)} failed, {len(warned)} warnings, {passed_count} passed",
        "",
    ]
    if failed:
        text_lines.append(f"What's broken ({len(failed)}):")
        for c in failed[:8]:
            text_lines.append(f"  - {c.get('label','')}: {c.get('detail','')}")
        text_lines.append("")
    if warned:
        text_lines.append(f"What needs attention ({len(warned)}):")
        for c in warned[:8]:
            text_lines.append(f"  - {c.get('label','')}: {c.get('detail','')}")
        text_lines.append("")
    text_lines.append("What I'd ship for you:")
    text_lines.append("")
    text_lines.append(plan_markdown)
    text_lines.append("")
    text_lines.append("Want me to actually do this work? Just reply.")
    text_lines.append("")
    text_lines.append("Dustin Gilmour")
    text_lines.append("Venti Scale")
    text_lines.append("https://www.ventiscale.com")

    return {"subject": subject, "html": html, "text": "\n".join(text_lines) + footer_text}


def render_lead_notification(row: dict) -> dict:
    """Returns {subject, html, text} for the lead-notification email to dustin@."""
    name = row.get("name") or ""
    business = row.get("business") or ""
    email = row.get("email") or ""
    url = row.get("url") or ""
    final_url = row.get("final_url") or url
    grade = row.get("grade") or ""
    score = row.get("score")
    reachable = row.get("reachable")
    error = row.get("error") or ""
    notes = row.get("notes") or ""
    checks = row.get("checks") or []
    lead_id = row.get("id") or ""
    received_at = row.get("received_at") or ""
    ip = row.get("ip") or "unknown"

    failed = sum(1 for c in checks if c.get("status") == "fail")
    warned = sum(1 for c in checks if c.get("status") == "warn")
    passed_c = sum(1 for c in checks if c.get("status") == "pass")

    if reachable:
        subject = f"New audit lead: {url} · Grade {grade} ({score})"
        body_block = (
            f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Grade</td>"
            f"<td style=\"padding:6px 0;color:#1a1a1a;\"><strong>{html_escape(grade)}</strong> · {score}/100</td></tr>"
            f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Checks</td>"
            f"<td style=\"padding:6px 0;color:#1a1a1a;\">{failed} failed · {warned} warnings · {passed_c} passed</td></tr>"
            f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Final URL</td>"
            f"<td style=\"padding:6px 0;color:#1a1a1a;\"><a href=\"{html_escape(final_url)}\" style=\"color:#5280FF;text-decoration:none;\">{html_escape(final_url)}</a></td></tr>"
        )
    else:
        subject = f"New audit lead: {url} · UNREACHABLE"
        body_block = (
            f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Status</td>"
            f"<td style=\"padding:6px 0;color:#C8362B;\"><strong>UNREACHABLE</strong>: {html_escape(error or 'site did not respond')}</td></tr>"
        )

    notes_html = (html_escape(notes).replace("\n", "<br>") if notes else "<span style=\"color:#999;\">(none)</span>")

    html = (
        "<div style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"
        "max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;\">"
        "<div style=\"font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#666;margin-bottom:8px;\">Venti Scale · New lead</div>"
        "<h1 style=\"margin:0 0 18px;font-family:Georgia,serif;font-size:24px;font-weight:500;\">New audit lead</h1>"
        "<table style=\"border-collapse:collapse;width:100%;font-size:14px;\">"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Name</td><td style=\"padding:6px 0;color:#1a1a1a;\">{html_escape(name)}</td></tr>"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Business</td><td style=\"padding:6px 0;color:#1a1a1a;\">{html_escape(business)}</td></tr>"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Website</td><td style=\"padding:6px 0;\"><a href=\"{html_escape(final_url or url)}\" style=\"color:#5280FF;text-decoration:none;\">{html_escape(url)}</a></td></tr>"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Email</td><td style=\"padding:6px 0;\"><a href=\"mailto:{html_escape(email)}\" style=\"color:#5280FF;text-decoration:none;\">{html_escape(email)}</a></td></tr>"
        f"{body_block}"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;vertical-align:top;\">Notes</td><td style=\"padding:6px 0;color:#444;\">{notes_html}</td></tr>"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Received</td><td style=\"padding:6px 0;color:#666;font-size:12px;\">{html_escape(received_at)}</td></tr>"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">ID</td><td style=\"padding:6px 0;font-family:'SF Mono',Consolas,monospace;font-size:11px;color:#999;\">{html_escape(lead_id)}</td></tr>"
        f"<tr><td style=\"padding:6px 12px 6px 0;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">IP</td><td style=\"padding:6px 0;font-family:'SF Mono',Consolas,monospace;font-size:11px;color:#999;\">{html_escape(ip)}</td></tr>"
        "</table>"
        "<div style=\"margin-top:24px;padding-top:18px;border-top:1px solid #eee;font-size:13px;color:#444;line-height:1.55;\">"
        "Their plan email is going out from this same account. Reply directly to this notification to follow up with them today."
        "</div></div>"
    )

    if reachable:
        text = (
            f"New audit lead\n\n"
            f"Name: {name}\nBusiness: {business}\nWebsite: {url}\nEmail: {email}\n"
            f"Grade: {grade} ({score}/100)\n"
            f"Checks: {failed} failed, {warned} warnings, {passed_c} passed\n"
            f"Lead ID: {lead_id}"
        )
    else:
        text = (
            f"New audit lead\n\n"
            f"Name: {name}\nBusiness: {business}\nWebsite: {url}\nEmail: {email}\n"
            f"Status: UNREACHABLE. {error or 'site did not respond'}\n"
            f"Lead ID: {lead_id}"
        )

    return {"subject": subject, "html": html, "text": text}


def gog_send(*, account: str, to: str, reply_to: Optional[str], subject: str, html: str, text: str) -> tuple[bool, str]:
    """Send via gog gmail. Returns (ok, output_or_error).

    Sender is implicit (the authed account, dustin@ventiscale.com). gog's
    --from flag requires a verified send-as alias; sending without it uses
    the account's primary identity, which is the founder-direct posture
    we want anyway.
    """
    cmd = [
        GOG, "gmail", "send",
        "--account", account,
        "--to", to,
        "--subject", subject,
        "--body", text,
        "--body-html", html,
        "--no-input",
    ]
    if reply_to:
        cmd += ["--reply-to", reply_to]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            return False, (result.stderr or result.stdout or "no output").strip()[:500]
        return True, (result.stdout or "ok").strip()[:200]
    except subprocess.TimeoutExpired:
        return False, "gog gmail send timed out after 60s"
    except FileNotFoundError:
        return False, f"gog binary not found at {GOG}"
    except Exception as e:
        return False, f"unexpected: {e}"


def telegram_alert(text: str, env: dict):
    token = env.get("TELEGRAM_BOT_TOKEN")
    chat_id = env.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return
    try:
        urllib.request.urlopen(
            urllib.request.Request(
                f"https://api.telegram.org/bot{token}/sendMessage",
                method="POST",
                data=json.dumps({"chat_id": chat_id, "text": text, "parse_mode": "Markdown", "disable_web_page_preview": True}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            ),
            timeout=10,
        )
    except Exception:
        pass  # alert failure is non-fatal


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--id", type=str, default=None, help="Process a specific lead ID")
    args = parser.parse_args()

    env = load_env(ENV_PATH)
    # Stream D: TELEGRAM keys live in centralized secure store, not .env.local
    env.update(load_env(TELEGRAM_ENV_PATH))
    sb_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    sb_key = env.get("SUPABASE_SERVICE_ROLE_KEY")
    if not sb_url or not sb_key:
        print("ERROR: Supabase keys missing in .env.local", file=sys.stderr)
        sys.exit(1)

    H = {
        "apikey": sb_key,
        "Authorization": f"Bearer {sb_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    # Find rows where:
    #   - the audit completed (reachable IS NOT NULL)
    #   - email_visitor_sent IS NOT TRUE (NULL or false)
    #   - within last 14 days (don't backfill ancient)
    # PostgREST: `email_visitor_sent=is.not.true` gives us NULL OR false.
    if args.id:
        query = f"id=eq.{args.id}"
    else:
        from datetime import timedelta
        cutoff = (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()
        from urllib.parse import quote
        cutoff_q = quote(cutoff, safe="")
        query = (
            f"reachable=not.is.null"
            f"&email_visitor_sent=not.is.true"
            f"&received_at=gte.{cutoff_q}"
            f"&order=received_at.asc&limit={args.limit}"
        )

    select = "id,received_at,name,business,email,url,notes,ip,final_url,reachable,grade,score,error,checks,plan_markdown,email_visitor_sent,email_lead_sent"
    list_url = f"{sb_url}/rest/v1/audit_leads?select={select}&{query}"

    status, rows = supabase_request("GET", list_url, H)
    rows = rows or []
    print(f"[{datetime.now(timezone.utc).isoformat()}] pending audit emails: {len(rows)}")

    if args.dry_run:
        for r in rows:
            print(f"  - {r.get('id')} {r.get('email')} {r.get('grade') or 'UNREACHABLE'}")
        return

    sent_count = 0
    fail_count = 0
    for row in rows:
        lead_id = row.get("id")
        recipient = row.get("email")
        if not recipient:
            print(f"  ! skipping {lead_id}: no email")
            continue

        # Guard: don't render until the audit has actually completed. The
        # main cron query already filters reachable=not.is.null, but the
        # --id path bypasses that filter, so a row whose audit hasn't
        # finished can still get pulled in. Without this check we'd
        # render the unreachable branch on a row that's just slow.
        if row.get("reachable") is None:
            print(f"  ⏳ skipping {lead_id}: audit not yet complete (reachable=None)")
            continue

        # Build emails
        try:
            visitor = render_visitor_email(row, env)
            lead_notif = render_lead_notification(row)
        except Exception as e:
            print(f"  ! render failed for {lead_id}: {e}", file=sys.stderr)
            telegram_alert(
                f"⚠️ *Audit email render failed*\n\n"
                f"*Lead:* `{lead_id}`\n*Recipient:* {recipient}\n*Error:* {e}",
                env,
            )
            fail_count += 1
            continue

        # Send visitor first (the prospect-facing email)
        visitor_ok, visitor_msg = (False, "")
        if not row.get("email_visitor_sent"):
            visitor_ok, visitor_msg = gog_send(
                account=SEND_FROM_ACCOUNT,
                to=recipient,
                reply_to="dustin@ventiscale.com",
                subject=visitor["subject"],
                html=visitor["html"],
                text=visitor["text"],
            )
        else:
            visitor_ok = True

        # Send lead notification (to Dustin)
        lead_ok, lead_msg = (False, "")
        if not row.get("email_lead_sent"):
            lead_ok, lead_msg = gog_send(
                account=SEND_FROM_ACCOUNT,
                to=LEAD_NOTIFY_TO,
                reply_to=recipient,
                subject=lead_notif["subject"],
                html=lead_notif["html"],
                text=lead_notif["text"],
            )
        else:
            lead_ok = True

        # Update row with whatever succeeded
        patch = {}
        if visitor_ok and not row.get("email_visitor_sent"):
            patch["email_visitor_sent"] = True
        if lead_ok and not row.get("email_lead_sent"):
            patch["email_lead_sent"] = True

        if patch:
            try:
                supabase_request("PATCH", f"{sb_url}/rest/v1/audit_leads?id=eq.{lead_id}", H, patch)
            except Exception as e:
                print(f"  ! patch failed for {lead_id}: {e}", file=sys.stderr)

        if visitor_ok and lead_ok:
            sent_count += 1
            print(f"  ✓ sent {lead_id} → {recipient}")
        else:
            fail_count += 1
            print(f"  ✗ {lead_id} visitor={visitor_ok} lead={lead_ok}")
            if not visitor_ok:
                print(f"      visitor err: {visitor_msg}")
            if not lead_ok:
                print(f"      lead err: {lead_msg}")
            telegram_alert(
                f"⚠️ *Audit email send failed*\n\n"
                f"*Lead:* `{lead_id}`\n"
                f"*Visitor:* {recipient}\n"
                f"*visitor_email:* {'✓' if visitor_ok else '✗'}\n"
                f"*lead_notification:* {'✓' if lead_ok else '✗'}\n\n"
                f"Lead is in Supabase. Manual follow-up required.",
                env,
            )

    print(f"done: sent={sent_count} failed={fail_count}")


if __name__ == "__main__":
    main()
