"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Enter demo mode: sets vs-demo cookie and navigates to /dashboard.
// The portal layout reads this cookie to render the Stoneline fixtures.
// For unauthenticated visitors this is the marketing tour. For
// authenticated agency users (Dusty) this is a layered preview that
// shows the portal as a prospect would see it without losing the real
// session underneath.
export async function enterDemo() {
  const cookieStore = await cookies();
  cookieStore.set("vs-demo", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}

// Exit demo mode: clears the vs-demo cookie. After this an authenticated
// user falls back to their real workspace; an unauth visitor falls back
// to /login.
export async function exitDemo() {
  const cookieStore = await cookies();
  cookieStore.set("vs-demo", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  redirect("/dashboard");
}
