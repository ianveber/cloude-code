import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { subscribe as espSubscribe } from "@/lib/esp";
import { appendToSheet, sheetConfigured } from "@/lib/sheets";

const bodySchema = z.object({
  email: z.string().email("Neveljaven email"),
  sport: z.string().optional(),
  source: z.string().optional(),
  consent: z.boolean().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neveljaven request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Neveljaven email" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // GDPR: weekly marketing emails require explicit, specific consent. No box, no signup.
  if (data.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Za prijavo potrebujemo tvoje soglasje za prejemanje e-pošte." },
      { status: 400 }
    );
  }

  // 1) Newsletter tool — this is what sends the double opt-in confirmation email
  //    and drives the weekly promos. Best-effort: a provider hiccup is logged but
  //    must not lose the signup (Supabase + Sheet still record it).
  const esp = await espSubscribe({
    email: data.email,
    source: data.source,
    sport: data.sport,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    referringSite: request.headers.get("referer"),
  });
  if (!esp.ok) {
    console.error("[waitlist] newsletter subscribe failed:", esp.error);
  }
  const espLive = esp.ok && esp.configured;

  // 2) Supabase — system-of-record + early-bird position counter.
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  let position: number | null = null;
  let already = false;

  if (supabaseConfigured) {
    const supabase = await createClient();

    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    position = (count ?? 0) + 1;

    const { error } = await supabase.from("waitlist").insert({
      email: data.email,
      sport: data.sport ?? null,
      source: data.source ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      early_bird_position: position,
    });

    if (error) {
      if (error.code === "23505") {
        // Returning email — not an error. The newsletter tool re-sends the
        // confirmation if they never confirmed the first time.
        already = true;
        position = null;
      } else {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
    }
  } else {
    // Demo mode — no Supabase yet. Keep the form feeling real with a fake position.
    position = Math.floor(Math.random() * 60) + 40;
  }

  // 3) Google Sheet mirror — the at-a-glance list. Best-effort, fresh signups only.
  if (sheetConfigured() && !already) {
    const sheet = await appendToSheet({
      email: data.email,
      source: data.source,
      sport: data.sport,
      status: espLive ? esp.status : supabaseConfigured ? "captured" : "demo",
      position,
      consent: true,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
    });
    if (!sheet.ok) console.error("[waitlist] Sheet append failed:", sheet.error);
  }

  return NextResponse.json({
    ok: true,
    position,
    already,
    needsConfirm: espLive, // newsletter tool live → user must confirm via email
    demo: !supabaseConfigured && !espLive,
  });
}
