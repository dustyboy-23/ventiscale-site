#!/usr/bin/env python3
"""
Generate a magic-link for the Venti Scale portal without using email.

Usage:
    python scripts/login-link.py                       # defaults to dustin@ventiscale.com
    python scripts/login-link.py ken@grassholesystem.com

Why this exists:
    Supabase's built-in email service is rate-limited to 2 magic links/hour
    on the free tier and can't be raised until custom SMTP is wired up via
    the dashboard. Until then, this script bypasses email entirely: it
    calls the Supabase admin API to generate a token, then constructs the
    click-through URL that hits /auth/confirm exactly like the real email
    link would.

Requires:
    NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


def load_env_local() -> None:
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def main() -> int:
    load_env_local()

    email = sys.argv[1] if len(sys.argv) > 1 else "dustin@ventiscale.com"
    site_url = os.environ.get("PORTAL_SITE_URL", "https://www.ventiscale.com")
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_key:
        print("ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local")
        return 1

    body = json.dumps(
        {
            "type": "magiclink",
            "email": email,
            "options": {"redirect_to": f"{site_url}/auth/confirm"},
        }
    ).encode()

    req = urllib.request.Request(
        f"{supabase_url}/auth/v1/admin/generate_link",
        data=body,
        headers={
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
    except urllib.error.HTTPError as exc:
        print(f"HTTP {exc.code}: {exc.read().decode()[:500]}")
        return 1

    properties = data.get("properties") or data
    hashed_token = properties.get("hashed_token")
    if not hashed_token:
        print("No hashed_token in response:", json.dumps(data)[:400])
        return 1

    link = f"{site_url}/auth/confirm?token_hash={hashed_token}&type=magiclink"
    print(f"Login link for {email}:")
    print()
    print(link)
    print()
    print("Single-use, ~1 hour validity. Open in browser to sign in.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
