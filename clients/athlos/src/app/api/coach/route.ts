import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { NextResponse } from "next/server";
import { buildSystemBlocks } from "@/lib/coach/prompt";
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

const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 16000;
// Interactive chat: `medium` keeps turns responsive. Raise to "high" if plan quality
// matters more than latency — it is the single lever worth tuning here.
const EFFORT = "medium" as const;

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

function loadApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) throw new Error("ANTHROPIC_API_KEY ni nastavljen.");
  return key;
}

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

  let apiKey: string;
  try {
    apiKey = loadApiKey();
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Coach trenutno ni na voljo.", detail: String((e as Error).message) },
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

  let system;
  try {
    system = buildSystemBlocks(profile);
  } catch (e) {
    // The brain failed to load. Refuse rather than let Coach invent exercises.
    console.error("Coach brain load failed:", e);
    return NextResponse.json(
      { ok: false, error: "Coachova baza vaj ni dosegljiva. Poskusi kasneje." },
      { status: 503 }
    );
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      let raw = "";
      let sent = "";

      try {
        const mstream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          thinking: { type: "adaptive" },
          output_config: { effort: EFFORT },
          system,
          messages,
        });

        mstream.on("text", (delta) => {
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
          // If clean no longer extends `sent` (a marker just closed and text was
          // removed behind us), emit nothing — the final `done` carries the truth.
        });

        const final = await mstream.finalMessage();
        const truncated = final.stop_reason === "max_tokens";
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
        const detail = e instanceof Anthropic.APIError ? `${e.status}` : "";
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
