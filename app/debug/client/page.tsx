"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Client-side diagnostic page for the auth cookie bug. Shows:
//   - document.cookie contents (what the browser thinks it has)
//   - Whether supabase.auth.getSession() returns a session
//   - localStorage keys (to detect if Supabase fell back to localStorage
//     instead of cookies)
//
// Hit /debug/client in the browser after logging in. If getSession()
// returns a user but document.cookie has no sb-* entries, @supabase/ssr
// is writing to localStorage instead of cookies, which breaks SSR auth.
export default function ClientDebugPage() {
  const [cookie, setCookie] = useState<string>("(loading)");
  const [localKeys, setLocalKeys] = useState<string[]>([]);
  const [sessionInfo, setSessionInfo] = useState<string>("(loading)");
  const [userInfo, setUserInfo] = useState<string>("(loading)");

  useEffect(() => {
    setCookie(document.cookie || "(empty)");

    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keys.push(k);
      }
      setLocalKeys(keys);
    } catch {
      setLocalKeys(["(localStorage unavailable)"]);
    }

    (async () => {
      try {
        const supabase = createClient();
        const sessionRes = await supabase.auth.getSession();
        setSessionInfo(
          JSON.stringify(
            {
              hasSession: Boolean(sessionRes.data.session),
              userId: sessionRes.data.session?.user.id ?? null,
              email: sessionRes.data.session?.user.email ?? null,
              expiresAt: sessionRes.data.session?.expires_at ?? null,
              error: sessionRes.error?.message ?? null,
            },
            null,
            2,
          ),
        );

        const userRes = await supabase.auth.getUser();
        setUserInfo(
          JSON.stringify(
            {
              hasUser: Boolean(userRes.data.user),
              userId: userRes.data.user?.id ?? null,
              email: userRes.data.user?.email ?? null,
              error: userRes.error?.message ?? null,
            },
            null,
            2,
          ),
        );
      } catch (err) {
        setSessionInfo(`threw: ${err instanceof Error ? err.message : String(err)}`);
      }
    })();
  }, []);

  return (
    <div style={{ fontFamily: "monospace", padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>Client-side auth debug</h1>
      <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
        What the browser actually has stored for Supabase auth.
      </p>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginTop: 24 }}>document.cookie</h2>
      <pre style={{ background: "#f5f5f5", padding: 12, fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {cookie}
      </pre>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginTop: 16 }}>localStorage keys</h2>
      <pre style={{ background: "#f5f5f5", padding: 12, fontSize: 12 }}>
        {localKeys.length === 0 ? "(none)" : localKeys.join("\n")}
      </pre>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginTop: 16 }}>supabase.auth.getSession()</h2>
      <pre style={{ background: "#f5f5f5", padding: 12, fontSize: 12 }}>{sessionInfo}</pre>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginTop: 16 }}>supabase.auth.getUser()</h2>
      <pre style={{ background: "#f5f5f5", padding: 12, fontSize: 12 }}>{userInfo}</pre>
    </div>
  );
}
