import { GoogleGenAI, ApiError, FinishReason } from "@google/genai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { buildSystemInstruction } from "@/lib/coach/prompt";
import { splitReply, stripMarkers } from "@/lib/coach/parse";
import {
  applyTurn,
  isServerStoreConfigured,
  isValidId,
  loadProfile,
  normalizeProfile,
  persistProfile,
} from "@/lib/coach/store";
import type { CoachProfile } from "@/lib/coach/types";

// A full 7-day periodized plan is a long generation, so this route streams. Beyond
// UX, it is what keeps a slow turn from dying on a serverless function timeout.
export const runtime = "nodejs";
export const maxDuration = 300;

const MODEL = "gemini-3.5-flash";
const MAX_OUTPUT_TOKENS = 16000;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(40),
  profileId: z.string().optional(),
  // Sent only when there is no server-side store; hard-capped by normalizeProfile.
  profile: z.unknown().optional(),
});

const encoder = new TextEncoder();
const event = (obj: unknown) => encoder.encode(JSON.stringify(obj) + "\n");

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
      { ok: false, error: parsed.error.issues[0]?.message ?? "Neveljaven zahtevek." },
      { status: 400 }
    );
  }
  const { messages, profileId } = parsed.data;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Coach trenutno ni na voljo.", detail: "GEMINI_API_KEY ni nastavljen." },
      { status: 503 }
    );
  }

  // Where memory comes from decides whether the client can be trusted with it.
  let profile: CoachProfile | null = null;
  try {
    profile =
      isServerStoreConfigured() && isValidId(profileId)
        ? await loadProfile(profileId)
        : normalizeProfile(parsed.data.profile);
  } catch (e) {
    console.error("Coach store load failed:", e);
    profile = normalizeProfile(parsed.data.profile); // degrade to the client's copy
  }

  let systemInstruction: string;
  try {
    systemInstruction = buildSystemInstruction(profile);
  } catch (e) {
    // The brain failed to load. Refuse rather than let Coach invent exercises.
    console.error("Coach brain load failed:", e);
    return NextResponse.json(
      { ok: false, error: "Coachova baza vaj ni dosegljiva. Poskusi kasneje." },
      { status: 503 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Gemini's roles are 'user' | 'model' — there is no 'assistant'. Sending the
  // Anthropic-style role silently yields a malformed turn, so map it explicitly.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const stream = new ReadableStream({
    async start(controller) {
      let raw = "";
      let sent = "";

      try {
        const result = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: { systemInstruction, maxOutputTokens: MAX_OUTPUT_TOKENS },
        });

        let finishReason: FinishReason | undefined;
        let cachedTokens = 0;
        let totalTokens = 0;

        for await (const chunk of result) {
          const delta = chunk.text;
          if (delta) {
            raw += delta;
            // Markers ([[PLAN]], <NOTE>, <PROPOSE>) arrive mid-stream and must never
            // reach the athlete. stripMarkers drops a dangling marker through to the
            // end of the buffer, so re-sanitizing the whole accumulation each tick
            // naturally withholds a half-arrived marker instead of leaking it.
            const clean = stripMarkers(raw);
            if (clean.startsWith(sent) && clean.length > sent.length) {
              controller.enqueue(event({ type: "delta", v: clean.slice(sent.length) }));
              sent = clean;
            }
          }
          const fr = chunk.candidates?.[0]?.finishReason;
          if (fr) finishReason = fr;
          if (chunk.usageMetadata) {
            cachedTokens = chunk.usageMetadata.cachedContentTokenCount ?? cachedTokens;
            totalTokens = chunk.usageMetadata.totalTokenCount ?? totalTokens;
          }
        }

        // A safety block ends the stream with EMPTY content rather than an error —
        // without this branch it is indistinguishable from a silent failure.
        if (!raw.trim()) {
          const blocked =
            finishReason === FinishReason.SAFETY || finishReason === FinishReason.RECITATION;
          controller.enqueue(
            event({
              type: "error",
              error: blocked
                ? "Odgovor je bil blokiran s strani varnostnega filtra. Preoblikuj vprašanje."
                : "Coach ni vrnil odgovora. Poskusi znova.",
              detail: String(finishReason ?? "brez razloga"),
            })
          );
          return;
        }

        const truncated = finishReason === FinishReason.MAX_TOKENS;
        const { text, plan, proposals, notes } = splitReply(raw);

        let nextProfile = profile;
        if (profile) {
          // Never store a cut-off plan as a completed one.
          nextProfile = applyTurn(profile, { plan: truncated ? null : plan, notes });
          if (isServerStoreConfigured()) {
            try {
              await persistProfile(nextProfile);
            } catch (e) {
              // A persistence failure must not discard an answer already paid for.
              console.error("Coach persist failed:", e);
            }
          }
        }

        if (proposals.length) {
          // Global-brain suggestions are Ian's to approve; nothing edits the brain.
          console.log(
            `[coach:proposal] ${profile?.name ?? "anon"} (${profile?.profile.sport ?? "?"})\n` +
              proposals.join("\n---\n")
          );
        }

        // cachedContentTokenCount is the only way to confirm implicit caching is
        // actually hitting — if it stays 0 across turns, the ~22K brain is being
        // re-billed every request and the prefix ordering has drifted.
        console.log(
          `[coach] ${profile?.name ?? "anon"} · ${totalTokens} tok · cached ${cachedTokens}` +
            `${plan ? " · plan saved" : ""}${notes.length ? ` · ${notes.length} note` : ""}`
        );

        controller.enqueue(
          event({
            type: "done",
            text, // authoritative, fully sanitized — client replaces streamed text
            truncated,
            profile: nextProfile,
            learned: { plan: truncated ? null : plan, notes },
          })
        );
      } catch (e) {
        console.error("Coach stream error:", e);
        const detail = e instanceof ApiError ? `${e.status}` : "";
        controller.enqueue(
          event({
            type: "error",
            error: sent
              ? "Povezava se je prekinila sredi odgovora."
              : "Coach se ni odzval. Poskusi znova.",
            detail,
          })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
    },
  });
}
