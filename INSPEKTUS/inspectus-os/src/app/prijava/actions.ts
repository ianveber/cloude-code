"use server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Log in an EXISTING account. Account creation is a separate, code-gated flow
// (signUpWithCode) — signing in never creates an account, so a mistyped password
// can't silently spawn a new one and the access code can't be bypassed via login.
export async function signInPassword(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Vnesi email in geslo." };
  if (!isSupabaseConfigured()) return { error: "Prijava trenutno ni na voljo." };

  // Frictionless access (security gate parked for now — re-add via signUpWithCode later):
  // sign in; if there's no account yet, create it on the spot and log straight in.
  if (password.length < 6) return { error: "Geslo mora imeti vsaj 6 znakov." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const signUp = await supabase.auth.signUp({ email, password });
      if (signUp.error) return { error: maps(signUp.error.message) };
      if (!signUp.data.session) {
        return { notice: "Račun ustvarjen — potrdi povezavo, ki smo jo poslali na tvoj email." };
      }
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Prijava ni uspela. Poskusi znova." };
  } catch {
    return { error: "Prijava ni uspela. Poskusi znova." };
  }
  redirect("/"); // OUTSIDE the try/catch: redirect() throws a control signal that must not be caught
}

// Create a NEW account. Gated by a shared team access code (env SIGNUP_ACCESS_CODE) so that
// opening the DB signup gate to any email doesn't let a random with the URL register. Fails
// CLOSED: if no code is configured server-side, account creation is disabled.
export async function signUpWithCode(_prev: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const code = String(formData.get("code") || "").trim();
  if (!email || !password) return { error: "Vnesi email in geslo." };
  if (password.length < 6) return { error: "Geslo mora imeti vsaj 6 znakov." };
  if (!isSupabaseConfigured()) return { error: "Registracija trenutno ni na voljo." };

  const required = (process.env.SIGNUP_ACCESS_CODE || "").trim();
  if (!required) return { error: "Registracija ni na voljo — obrni se na skrbnika." };
  if (code.toUpperCase() !== required.toUpperCase()) {
    return { error: code ? "Napačna pristopna koda." : "Vpiši pristopno kodo ekipe." };
  }

  try {
    const supabase = await createClient();
    const signUp = await supabase.auth.signUp({
      email,
      password,
      // Send the code as metadata too, so the gate can ALSO be enforced inside the
      // handle_new_user DB trigger (a hard gate even against direct GoTrue API calls)
      // by adding one SQL statement later — no further app change needed.
      options: { data: { access_code: code } },
    });
    if (signUp.error) return { error: maps(signUp.error.message) };
    if (!signUp.data.session) {
      // Only if email confirmation gets re-enabled — under autoconfirm a session is returned.
      return { notice: "Račun ustvarjen — potrdi povezavo, ki smo jo poslali na tvoj email." };
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Registracija ni uspela. Poskusi znova." };
  } catch {
    return { error: "Registracija ni uspela. Poskusi znova." };
  }
  redirect("/");
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
  const m = (msg || "").toLowerCase();
  // Domain/allowlist gate (now open, but kept as a safety net if it's ever re-tightened).
  if (m.includes("ni dovoljen") || m.includes("not allowed") || m.includes("database error saving new user"))
    return "Ta email ni dovoljen za INSPECTUS Center.";
  // Password too short (Supabase minimum is 6).
  if (m.includes("at least") || m.includes("weak password") || m.includes("password should"))
    return "Geslo mora imeti vsaj 6 znakov.";
  // Account already exists → they should log in, not create a new account.
  if (m.includes("already registered") || m.includes("already exists"))
    return "Ta račun že obstaja — prijavi se z geslom (klikni »Že imaš račun«).";
  if (m.includes("invalid login")) return "Napačen email ali geslo.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("after"))
    return "Preveč poskusov. Počakaj minuto in poskusi znova.";
  return "Nekaj je šlo narobe. Poskusi znova.";
}
