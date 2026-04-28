// Application-layer URL validation helpers.
//
// The database's clients_logo_url_https constraint forces HTTPS scheme
// at the storage layer (defense in depth). This file adds the host-
// allowlist check at the application layer so future client-facing
// settings UIs can validate input before it reaches the DB.

const LOGO_HOST_ALLOWLIST = [
  // Self-hosted assets on Venti Scale
  "ventiscale.com",
  "www.ventiscale.com",
  // Google Drive thumbnails (used in portal previews)
  "lh3.googleusercontent.com",
  "drive.google.com",
  "docs.google.com",
  // Common CDN hosts for client-uploaded logos
  "cdn.shopify.com",
  "imgix.net",
  "cloudfront.net",
  "amazonaws.com",
  "googleusercontent.com",
];

// Subdomain-aware match: "*.amazonaws.com" matches any subdomain.
function hostAllowed(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  for (const allowed of LOGO_HOST_ALLOWLIST) {
    if (lower === allowed) return true;
    if (lower.endsWith("." + allowed)) return true;
  }
  return false;
}

export type LogoUrlCheck =
  | { ok: true }
  | { ok: false; reason: string };

export function validateLogoUrl(raw: string | null | undefined): LogoUrlCheck {
  if (raw == null || raw === "") return { ok: true };
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false, reason: "Not a valid URL" };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "Must use https://" };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "Must not contain user info" };
  }
  if (!hostAllowed(parsed.hostname)) {
    return {
      ok: false,
      reason:
        "Host not on the logo CDN allowlist. Use a Drive/Shopify/Cloudfront/S3 link or upload to Venti Scale directly.",
    };
  }
  return { ok: true };
}

export function listAllowedLogoHosts(): readonly string[] {
  return LOGO_HOST_ALLOWLIST;
}
