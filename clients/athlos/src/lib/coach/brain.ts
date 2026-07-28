import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Coach's knowledge base. These four files ARE the agent's competence — the system
// prompt forbids inventing exercises, so a plan built without them would be made up.
// That makes a silent load failure worse than a hard error: we throw instead.
//
// Files live in src/lib/coach/brain/ and are pulled into the serverless bundle by
// `outputFileTracingIncludes` in next.config.ts. Read once at module scope so the
// cost is paid per cold start, not per request.

const BRAIN_DIR = join(process.cwd(), "src", "lib", "coach", "brain");

const FILES = [
  "periodization.md",
  "exercise-database.md",
  "example-plans.md",
  "speed-protocols.md",
  "system-prompt.md",
] as const;

type BrainFile = (typeof FILES)[number];

function read(name: BrainFile): string {
  let raw: string;
  try {
    raw = readFileSync(join(BRAIN_DIR, name), "utf8");
  } catch (e) {
    throw new Error(
      `Coach brain file "${name}" ni dosegljiva (${BRAIN_DIR}). ` +
        `Brez baze bi Coach vaje izmišljeval — zahtevek zavrnjen. Izvirna napaka: ${
          e instanceof Error ? e.message : String(e)
        }`
    );
  }
  // A present-but-empty file is the same failure wearing a disguise.
  if (raw.trim().length < 100) {
    throw new Error(`Coach brain file "${name}" je prazna ali okrnjena (${raw.length} B).`);
  }
  return raw;
}

let cached: Record<BrainFile, string> | null = null;

export function loadBrain(): Record<BrainFile, string> {
  if (!cached) {
    cached = Object.fromEntries(FILES.map((f) => [f, read(f)])) as Record<BrainFile, string>;
  }
  return cached;
}
