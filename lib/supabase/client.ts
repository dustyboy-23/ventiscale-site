import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Reads env vars inline every call so that a
// server-side dev restart with new env is reflected without a hard reload.
// Used from client components (e.g. the login form calling signInWithOtp).
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env var",
    );
  }
  return createBrowserClient(url, anonKey);
}
