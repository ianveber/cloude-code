import "server-only";
import type { CoachFeedback, CoachPlan, CoachProfile, CoachProfileFacts } from "./types";

/**
 * Coach's memory store.
 *
 * Two backends, chosen at runtime:
 *   - Supabase, when NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
 *     Server-authoritative: the client sends only an id.
 *   - Client-held, otherwise. The browser keeps the profile in localStorage and posts
 *     it with each turn. Vercel is serverless — there is no writable disk — so this is
 *     what makes the agent work at all before a database exists.
 *
 * The client-held mode means athlete memory arrives from the browser and is therefore
 * UNTRUSTED on two axes: content (already handled — memoryBlock wraps it in
 * <athlete_data> and the system prompt forbids following instructions inside it) and
 * SIZE. Size is the one that costs money: an unbounded profile would be pasted into
 * every prompt after the cache breakpoint. normalizeProfile() hard-caps every field
 * server-side, on every request, regardless of backend.
 */

// Caps mirror the standalone app's slice() limits, enforced on input rather than on write.
const CAP = {
  name: 60,
  str: 120,
  arrayItems: 12,
  plans: 24,
  feedback: 60,
  notes: 80,
  summary: 140,
  noteText: 300,
} as const;

// Annotate as `number`, not the inferred literal from `CAP` — `as const` would
// otherwise pin these params to the default's literal type and reject every other cap.
const str = (v: unknown, max: number = CAP.str): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const strArray = (v: unknown, max: number = CAP.arrayItems): string[] =>
  Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean).slice(0, max) : [];

const num = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
export const isValidId = (id: unknown): id is string =>
  typeof id === "string" && ID_RE.test(id);

export function slugifyName(s: unknown): string {
  return (
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip accents (š→s, č→c …)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "sportnik"
  );
}

function normalizeFacts(raw: unknown): CoachProfileFacts {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    sport: str(r.sport),
    level: str(r.level),
    goal: str(r.goal),
    seasonPhase: str(r.seasonPhase),
    equipment: strArray(r.equipment),
    daysPerWeek: num(r.daysPerWeek),
    sessionMinutes: num(r.sessionMinutes),
    injuries: strArray(r.injuries),
  };
}

/** Hard-cap an arbitrary (possibly client-supplied) profile into a safe CoachProfile. */
export function normalizeProfile(raw: unknown): CoachProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const id = isValidId(r.id) ? r.id : slugifyName(r.name);
  const now = new Date().toISOString();

  const plans: CoachPlan[] = Array.isArray(r.plans)
    ? (r.plans as unknown[])
        .slice(-CAP.plans)
        .map((p) => {
          const pp = (p ?? {}) as Record<string, unknown>;
          return {
            date: str(pp.date, 40) || now,
            phase: str(pp.phase),
            summary: str(pp.summary, CAP.summary),
            // markdown is intentionally dropped: memoryBlock only ever renders the
            // summary line, so carrying full plan text would bloat every request.
          };
        })
    : [];

  const feedback: CoachFeedback[] = Array.isArray(r.feedback)
    ? (r.feedback as unknown[])
        .slice(-CAP.feedback)
        .map((f) => {
          const ff = (f ?? {}) as Record<string, unknown>;
          return {
            date: str(ff.date, 40) || now,
            planDate: str(ff.planDate, 40) || null,
            rpe: num(ff.rpe),
            completed: typeof ff.completed === "boolean" ? ff.completed : null,
            pain: strArray(ff.pain),
            notes: str(ff.notes, CAP.noteText),
          };
        })
    : [];

  const memoryNotes = Array.isArray(r.memoryNotes)
    ? (r.memoryNotes as unknown[])
        .map((n) => str(n, CAP.noteText))
        .filter(Boolean)
        .slice(-CAP.notes)
    : [];

  return {
    id,
    name: str(r.name, CAP.name) || "Športnik",
    createdAt: str(r.createdAt, 40) || now,
    updatedAt: now,
    profile: normalizeFacts(r.profile),
    plans,
    feedback,
    memoryNotes,
  };
}

/** Apply this turn's learnings to a profile. Pure — returns a new object. */
export function applyTurn(
  profile: CoachProfile,
  turn: { plan?: { summary: string; phase: string } | null; notes?: string[] }
): CoachProfile {
  const next: CoachProfile = {
    ...profile,
    plans: [...profile.plans],
    memoryNotes: [...profile.memoryNotes],
    updatedAt: new Date().toISOString(),
  };

  if (turn.plan) {
    next.plans.push({
      date: new Date().toISOString(),
      summary: turn.plan.summary.slice(0, CAP.summary),
      phase: turn.plan.phase.slice(0, CAP.str),
    });
    if (next.plans.length > CAP.plans) next.plans = next.plans.slice(-CAP.plans);
  }

  for (const n of turn.notes ?? []) {
    const clean = n.trim().slice(0, CAP.noteText);
    // Don't store the same lesson twice — the standalone app had no dedupe and
    // would have accumulated near-identical notes until the cap evicted real ones.
    if (clean && !next.memoryNotes.includes(clean)) next.memoryNotes.push(clean);
  }
  if (next.memoryNotes.length > CAP.notes) next.memoryNotes = next.memoryNotes.slice(-CAP.notes);

  return next;
}

// ── Supabase backend (optional) ─────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isServerStoreConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

const TABLE = "coach_profiles";

export async function loadProfile(id: string): Promise<CoachProfile | null> {
  if (!isServerStoreConfigured() || !isValidId(id)) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&select=data&limit=1`,
    {
      headers: { apikey: SERVICE_KEY!, Authorization: `Bearer ${SERVICE_KEY!}` },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Supabase load ${res.status}`);
  const rows = (await res.json()) as Array<{ data: unknown }>;
  return rows.length ? normalizeProfile(rows[0].data) : null;
}

export async function persistProfile(profile: CoachProfile): Promise<void> {
  if (!isServerStoreConfigured()) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({ id: profile.id, data: profile, updated_at: profile.updatedAt }),
  });
  if (!res.ok) throw new Error(`Supabase persist ${res.status}: ${await res.text()}`);
}
