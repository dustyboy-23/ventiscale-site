#!/usr/bin/env python3
"""
Attach a Supabase auth user to a Venti Scale client with a role.

Usage:
    python scripts/seed-client-user.py \\
        --email ken@example.com \\
        --client-slug sprinkler-guard \\
        --role owner \\
        --confirm

Without --confirm the script does a dry-run: it looks up the user and
client, prints what it WOULD insert, and exits without writing.

Why this exists:
    Phase 3 RLS denies user-level writes on client_users (defense in
    depth, see supabase/migrations/20260411_03_rls_deny_writes.sql).
    All membership changes go through the service role. This script is
    the safe wrapper around that operation: it asserts the client slug
    actually exists, looks up the auth user by email, and inserts an
    idempotent client_users row.

    The auth.users row must already exist. To create it without sending
    an email, run:
        python scripts/login-link.py <email>
    once. Supabase's admin generate_link endpoint creates the auth user
    on first call.

Requires:
    NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
"""

import argparse
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional


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


def supabase_request(
    method: str,
    path: str,
    *,
    base_url: str,
    service_key: str,
    headers: Optional[dict] = None,
    body: Optional[dict] = None,
) -> dict:
    url = f"{base_url}{path}"
    h = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            raw = response.read()
            if not raw:
                return {}
            return json.loads(raw)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode()[:500] if exc.fp else ""
        raise SystemExit(f"HTTP {exc.code} on {method} {path}: {detail}")


def find_user_by_email(email: str, *, base_url: str, service_key: str) -> Optional[dict]:
    # GoTrue admin listUsers has no documented email filter, so paginate
    # and match client-side. 200 users/page; bail after 10 pages
    # (2,000 users) which is well above any realistic Venti Scale state.
    target = email.lower()
    for page in range(1, 11):
        path = f"/auth/v1/admin/users?per_page=200&page={page}"
        data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
        users = data.get("users") if isinstance(data, dict) else data
        if not users:
            return None
        for u in users:
            if (u.get("email") or "").lower() == target:
                return u
        if len(users) < 200:
            return None
    return None


def find_client_by_slug(slug: str, *, base_url: str, service_key: str) -> Optional[dict]:
    path = f"/rest/v1/clients?slug=eq.{urllib.parse.quote(slug)}&select=id,slug,name,is_agency"
    data = supabase_request(
        "GET",
        path,
        base_url=base_url,
        service_key=service_key,
        headers={"Accept": "application/json"},
    )
    if isinstance(data, list) and data:
        return data[0]
    return None


def find_membership(
    user_id: str, client_id: str, *, base_url: str, service_key: str
) -> Optional[dict]:
    path = (
        f"/rest/v1/client_users?user_id=eq.{user_id}"
        f"&client_id=eq.{client_id}&select=user_id,client_id,role,created_at"
    )
    data = supabase_request("GET", path, base_url=base_url, service_key=service_key)
    if isinstance(data, list) and data:
        return data[0]
    return None


def insert_membership(
    user_id: str,
    client_id: str,
    role: str,
    *,
    base_url: str,
    service_key: str,
) -> dict:
    path = "/rest/v1/client_users"
    body = {"user_id": user_id, "client_id": client_id, "role": role}
    return supabase_request(
        "POST",
        path,
        base_url=base_url,
        service_key=service_key,
        headers={"Prefer": "return=representation"},
        body=body,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--email", required=True, help="Email of the existing auth.users row")
    parser.add_argument("--client-slug", required=True, help="clients.slug to attach to")
    parser.add_argument(
        "--role",
        choices=["owner", "admin", "viewer"],
        default="owner",
        help="Role for this membership (default: owner)",
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Required to actually write. Without this, prints the plan only.",
    )
    args = parser.parse_args()

    load_env_local()
    base_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not base_url or not service_key:
        print("ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env.local")
        return 1

    email = args.email.strip().lower()
    slug = args.client_slug.strip().lower()

    print(f"Looking up client by slug: {slug}")
    client = find_client_by_slug(slug, base_url=base_url, service_key=service_key)
    if not client:
        print(f"ERROR: no clients row with slug='{slug}'. Seed the client first.")
        return 1
    print(f"  ✓ client_id={client['id']} name={client['name']!r} agency={client.get('is_agency')}")

    print(f"Looking up auth user by email: {email}")
    user = find_user_by_email(email, base_url=base_url, service_key=service_key)
    if not user:
        print(f"ERROR: no auth.users row for {email}.")
        print("  Create one with no email send: python scripts/login-link.py <email>")
        return 1
    print(f"  ✓ user_id={user['id']}")

    existing = find_membership(user["id"], client["id"], base_url=base_url, service_key=service_key)
    if existing:
        if existing["role"] == args.role:
            print(f"Already attached: role={existing['role']} since {existing['created_at']}")
            print("Nothing to do.")
            return 0
        else:
            print(
                f"WARNING: existing membership has role={existing['role']!r}, "
                f"requested role={args.role!r}."
            )
            print("This script will not change an existing role. Update via SQL if intended.")
            return 1

    plan = (
        f"INSERT INTO client_users (user_id={user['id']}, "
        f"client_id={client['id']}, role={args.role!r})"
    )
    print()
    print("Plan:")
    print(f"  {plan}")
    print()

    if not args.confirm:
        print("Dry run. Re-run with --confirm to write.")
        return 0

    inserted = insert_membership(
        user["id"], client["id"], args.role, base_url=base_url, service_key=service_key
    )
    print("Inserted:")
    print(json.dumps(inserted, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
