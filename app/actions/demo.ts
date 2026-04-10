"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Enter demo mode: sets vs-demo cookie and navigates to /dashboard.
// The portal layout reads this cookie to short-circuit auth and render
// the Stoneline demo data so marketing can tour the product.
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
