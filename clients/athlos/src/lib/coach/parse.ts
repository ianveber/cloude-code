// Pure parsing helpers for Coach replies. No I/O — unit-testable in isolation.
// Ported from athlos-chatbot/parse.mjs.

const DAY = "pon|tor|sre|[čc]et|pet|sob|ned|ponedeljek|torek|sreda|[čc]etrtek|petek|sobota|nedelja";

export type ExtractedPlan = { summary: string; phase: string };

// Pull a stored-plan summary out of a reply. STRONGLY prefers the explicit
// [[PLAN: summary | phase]] marker (the system prompt mandates it on every plan).
// The fallback is deliberately strict: it requires >=3 DISTINCT day names used as
// markdown HEADINGS plus a table — so ordinary chat that merely mentions days (or
// the word "pet" = five) is NOT misclassified as a saved plan.
export function extractPlan(reply: string): ExtractedPlan | null {
  const m = reply.match(/\[\[PLAN:\s*([^\]|]+?)(?:\|\s*([^\]]+?))?\s*\]\]/i);
  if (m) return { summary: m[1].trim(), phase: (m[2] || "").trim() };

  const dayHeadings = reply.match(new RegExp(`^#{1,3}[^\\n]*?\\b(${DAY})\\b`, "gim")) || [];
  const distinctDays = new Set(
    dayHeadings.map((h) => h.replace(/^#{1,3}\s*/, "").toLowerCase().slice(0, 3))
  );
  const hasTable = /\n\s*\|.+\|/.test(reply);
  if (distinctDays.size >= 3 && hasTable) {
    const firstHeading = (reply.match(/^#{1,2}\s*(.+)$/m) || [])[1];
    return { summary: (firstHeading || "7-dnevni plan").slice(0, 140), phase: "" };
  }
  return null;
}

// Pull <PROPOSE>…</PROPOSE> blocks (additions Coach wants made to the shared brain).
export function extractProposals(reply: string): string[] {
  const out: string[] = [];
  const re = /<PROPOSE>([\s\S]*?)<\/PROPOSE>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(reply)) !== null) {
    const t = m[1].trim();
    if (t) out.push(t);
  }
  return out;
}

// Pull <NOTE>…</NOTE> blocks — durable facts Coach learned about THIS athlete.
// This is the channel that was defined but unreachable in the standalone app:
// nothing ever wrote memoryNotes, so "kar sem se naučil o tebi" could never fill.
export function extractNotes(reply: string): string[] {
  const out: string[] = [];
  const re = /<NOTE>([\s\S]*?)<\/NOTE>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(reply)) !== null) {
    const t = m[1].trim();
    if (t) out.push(t.slice(0, 300));
  }
  return out;
}

// Strip ALL internal markers so the athlete NEVER sees them — tolerant of malformed
// markers (unclosed tags, ']' inside a PLAN summary, stray fragments). This is the sole
// sanitizer before the reply reaches the browser, so it must fail safe.
export function stripMarkers(reply: string): string {
  return String(reply ?? "")
    .replace(/\[\[PLAN:[\s\S]*?\]\]/gi, "")       // closed plan marker
    .replace(/<PROPOSE>[\s\S]*?<\/PROPOSE>/gi, "") // closed propose blocks
    .replace(/<NOTE>[\s\S]*?<\/NOTE>/gi, "")       // closed note blocks
    .replace(/<PROPOSE>[\s\S]*$/gi, "")            // dangling propose → drop to end
    .replace(/<NOTE>[\s\S]*$/gi, "")               // dangling note → drop to end
    .replace(/\[\[PLAN:[\s\S]*$/gi, "")            // dangling plan marker → drop to end
    .replace(/<\/?(?:PROPOSE|NOTE)>/gi, "")        // any stray fragments
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type SplitReply = {
  text: string;
  plan: ExtractedPlan | null;
  proposals: string[];
  notes: string[];
};

// One pass: athlete-facing text + everything extracted from it.
export function splitReply(raw: string): SplitReply {
  return {
    text: stripMarkers(raw),
    plan: extractPlan(raw),
    proposals: extractProposals(raw),
    notes: extractNotes(raw),
  };
}
