"use server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInPassword(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Vnesi email in geslo." };
  const supabase = await createClient();
  // Sign in; if the account doesn't exist yet, create it (gate enforced by DB trigger).
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const signUp = await supabase.auth.signUp({ email, password });
    if (signUp.error) return { error: maps(signUp.error.message) };
  }
  redirect("/");
}

export async function sendMagicLink(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Vnesi email." };
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: maps(error.message) };
  return { sent: true };
}

function maps(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("ni dovoljen") || m.includes("not allowed")) return "Ta email ni dovoljen za INSPECTUS Center.";
  if (m.includes("invalid login")) return "Napačen email ali geslo.";
  if (m.includes("already registered")) return "Napačen email ali geslo.";
  return "Prijava ni uspela. Poskusi znova.";
}
