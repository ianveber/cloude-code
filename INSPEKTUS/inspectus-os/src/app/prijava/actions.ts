"use server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInPassword(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Vnesi email in geslo." };
  if (!isSupabaseConfigured()) return { error: "Prijava trenutno ni na voljo." };

  let outcome: "in" | "confirm" = "in";
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // No account yet → create it on first sign-in. The DB trigger enforces the
      // @inspectus.si + admin allowlist gate. A wrong password for an existing
      // account falls through here and surfaces a generic "wrong email/password".
      const signUp = await supabase.auth.signUp({ email, password });
      if (signUp.error) return { error: maps(signUp.error.message) };
      if (!signUp.data.session) outcome = "confirm"; // email confirmation required
    }
  } catch {
    return { error: "Prijava ni uspela. Poskusi znova." };
  }
  // Only redirect when a session actually exists — otherwise the middleware would
  // bounce the user straight back to /prijava (the confirm-your-email case).
  if (outcome === "confirm") {
    return { notice: "Račun ustvarjen — potrdi povezavo, ki smo jo poslali na tvoj email." };
  }
  redirect("/"); // OUTSIDE the try/catch: redirect() throws a control signal that must not be caught
}

export async function sendMagicLink(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Vnesi email." };
  if (!isSupabaseConfigured()) return { error: "Prijava trenutno ni na voljo." };
  try {
    const supabase = await createClient();
    const origin = (await headers()).get("origin") ?? "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) return { error: maps(error.message) };
    return { sent: true };
  } catch {
    return { error: "Pošiljanje ni uspelo. Poskusi znova." };
  }
}

function maps(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("ni dovoljen") || m.includes("not allowed")) return "Ta email ni dovoljen za INSPECTUS Center.";
  if (m.includes("invalid login")) return "Napačen email ali geslo.";
  if (m.includes("already registered")) return "Napačen email ali geslo.";
  return "Prijava ni uspela. Poskusi znova.";
}
