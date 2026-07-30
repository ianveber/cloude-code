/**
 * verify.mjs — run the SHIPPING extractor over the real samples and score it against
 * truth.json. This produces the only accuracy number we are allowed to say out loud.
 *
 *   node scripts/verify.mjs [--only <substring>] [--vision] [--register]
 *
 * Scoring: a cell counts if truth marks it VALUE or ABSENT. UNMAPPED cells (the agent's
 * register number) are excluded from the denominator and reported separately.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { restoreLayout, itemsFromTextContent, serializeRows, pageCharCount, VISION_THRESHOLD } from "../lib/layout.js";
import { SYSTEM, SCHEMA_HINT, buildUserPrompt, toKlp, holderCells, KLP_FIELDS } from "../lib/extract.js";
import { callClaude, MODEL_TEXT, MODEL_VISION, imageBlocks, costUsd } from "../lib/claude.mjs";
import { execFileSync } from "node:child_process";

/**
 * Vision instruction. The scans carry handwritten notes, highlighter and sticky notes that
 * are Harvest's internal process remarks — on '2 - Primer Merkur_dva otroka' a red note reads
 * "Doba napišeš 1 leto" directly beneath the PRINTED "15 let". Treating either as data is the
 * single most dangerous failure on this track.
 */
const VISION_INSTRUCTION = `Preberi to sliko zavarovalne ponudbe in vrni ISTI JSON kot pri besedilni poti.

POZOR — ROKOPIS IN OZNAKE:
Na dokumentu so lahko rokopisne opombe, barvne oznake, nalepke ali obkroženi deli. To so
INTERNE OPOMBE družbe Harvest Hub o postopku — NISO podatki iz ponudbe. Nikoli jih ne
uporabi kot vrednost polja. Beri izključno TISKANO besedilo obrazca.

Če razdelek ZAVAROVANEC vsebuje samo oznake brez vrednosti, ga obravnavaj kot da ga ni (null).
Če zavarovanci niso poimensko navedeni (kolektivno zavarovanje), vrni zavarovanec: null in
zavarovani_otroci: [] — ne izmišljuj si oseb.

Vrni SAMO JSON v tej obliki:
` + SCHEMA_HINT;

/** Render page 1 with annotations OFF. Browser path uses pdf.js canvas + AnnotationMode.DISABLE. */
function renderPageBase64(file) {
  const py = `
import fitz, base64, sys
d = fitz.open(sys.argv[1])
# annots=False is the equivalent of pdf.js AnnotationMode.DISABLE — strips the sticky notes
p = d[0].get_pixmap(matrix=fitz.Matrix(2.6, 2.6), annots=False)
sys.stdout.write(base64.b64encode(p.tobytes("png")).decode())
`;
  return execFileSync("python3", ["-c", py, path.join(SAMPLES, file)], {
    maxBuffer: 64 * 1024 * 1024, encoding: "utf8",
  });
}

const require = createRequire(import.meta.url);
const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dir, "..");

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

const SAMPLES = [
  path.join(process.env.HOME, "ais-client-data/harvest-hub/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
  path.join(ROOT, "../materiali/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
].find((p) => fs.existsSync(p));

if (!SAMPLES) { console.error("Source documents not found. See 04-PLAN-demo.md Day 0."); process.exit(1); }

const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const doVision = args.includes("--vision");
const useRegister = args.includes("--register");

// Personal data lives outside the repo (DPA 5(a)) — prefer that home, fall back to the old
// in-repo path so an older checkout still runs. Same idiom as SAMPLES above.
const dataFile = (name) => [
  path.join(process.env.HOME, "ais-client-data/harvest-hub", name),
  path.join(ROOT, name),
].find((p) => fs.existsSync(p));

const truthPath = dataFile("truth.json");
if (!truthPath) { console.error("truth.json not found — see clients/harvest-hub/protokol/."); process.exit(1); }
const truth = JSON.parse(fs.readFileSync(truthPath, "utf8"));
const registerPath = dataFile("register-zastopnikov.json") || path.join(ROOT, "register-zastopnikov.json");
const register = useRegister && fs.existsSync(registerPath)
  ? JSON.parse(fs.readFileSync(registerPath, "utf8")) : null;

const norm = (v) => (v == null ? null : String(v).replace(/\s+/g, " ").trim() || null);
const eq = (a, b) => norm(a) === norm(b);

async function layoutFor(file) {
  const data = new Uint8Array(fs.readFileSync(path.join(SAMPLES, file)));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  const chars = pageCharCount(tc);
  const layout = serializeRows(restoreLayout(itemsFromTextContent(tc)));
  await doc.destroy();
  return { layout, chars };
}

/** Pick the truth unit (single doc or one of several fanned-out KLPs) best matching an output. */
function matchUnit(units, got) {
  if (units.length === 1) return units[0];
  const name = norm(got["zavarovanec.ime_priimek"]?.value);
  return units.find((u) => eq(u.cells["zavarovanec.ime_priimek"].value, name)) || units[0];
}

let okAll = 0, denAll = 0, unmappedAll = 0, cost = 0, t0 = Date.now();
const failures = [];
const klpCountMismatches = [];

for (const doc of truth.documents) {
  if (only && !doc.file.toLowerCase().includes(only.toLowerCase())) continue;
  if (doc.track === "VISION" && !doVision) { console.log(`  ${doc.file.slice(0, 44).padEnd(46)} SKIP (vision — pass --vision)`); continue; }

  const { layout, chars } = await layoutFor(doc.file);
  const routed = chars < VISION_THRESHOLD ? "VISION" : "text";
  const routeOk = routed === (doc.track === "VISION" ? "VISION" : "text");

  const useVision = routed === "VISION";
  const model = useVision ? MODEL_VISION : MODEL_TEXT;
  const user = useVision
    ? imageBlocks(renderPageBase64(doc.file), VISION_INSTRUCTION)
    : buildUserPrompt(layout);

  const res = await callClaude({ system: SYSTEM, user, model, maxTokens: 3000 });
  if (res.error) { console.log(`  ${doc.file.slice(0, 44).padEnd(46)} ERROR ${res.error} ${res.detail || ""}`); continue; }
  cost += costUsd(model, res.usage);   // vision runs Opus — must not be priced as Sonnet

  const outputs = toKlp(res.json, { register });
  const units = doc.klps || [{ label: null, cells: doc.cells }];

  /**
   * A ponudba that names nobody as insured produces NO kontrolni list — that empty array is the
   * correct answer, and truth.json records it as klp_count 0. Its holder-side cells are still
   * scored against the same truth, so refusing to fill a form does not quietly shrink the
   * denominator and flatter the accuracy figure.
   */
  const klpCount = outputs.length;
  const scored = klpCount ? outputs : [holderCells(res.json, { register })];
  const countExpected = typeof doc.klp_count === "number" ? doc.klp_count : units.length;
  if (klpCount !== countExpected) {
    klpCountMismatches.push({ file: doc.file, want: countExpected, got: klpCount });
  }

  let ok = 0, den = 0, unmapped = 0;
  for (const got of scored) {
    const unit = matchUnit(units, got);
    for (const f of KLP_FIELDS) {
      const t = unit.cells[f];
      if (t.state === "UNMAPPED") { unmapped++; continue; }
      den++;
      if (eq(t.value, got[f]?.value)) ok++;
      else failures.push({ file: doc.file, field: f, want: t.value, got: got[f]?.value ?? null });
    }
  }
  okAll += ok; denAll += den; unmappedAll += unmapped;

  const pct = den ? ((100 * ok) / den).toFixed(0) : "—";
  const flag = routeOk ? "" : `  ROUTE MISMATCH (${chars} chars -> ${routed})`;
  console.log(`  ${doc.file.slice(0, 44).padEnd(46)} ${String(ok).padStart(3)}/${String(den).padEnd(3)} ${pct.padStart(3)}%  ${klpCount} KLP${flag}`);
}

const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log("\n" + "─".repeat(72));
console.log(`  ACCURACY  ${okAll}/${denAll} = ${denAll ? ((100 * okAll) / denAll).toFixed(1) : "—"}%   (field level, truth.json)`);
console.log(`  UNMAPPED  ${unmappedAll} cells excluded — agent register number${register ? " (register loaded)" : ""}`);
console.log(`  COST      $${cost.toFixed(4)}   TIME ${secs}s`);
console.log(`  KLP COUNT ${klpCountMismatches.length ? `${klpCountMismatches.length} MISMATCH` : "as recorded in truth.json"}`);
console.log("─".repeat(72));

for (const m of klpCountMismatches)
  console.log(`  KLP COUNT  ${m.file.slice(0, 44).padEnd(46)} want ${m.want}, got ${m.got}`);

if (failures.length) {
  console.log(`\n  ${failures.length} MISMATCHES:\n`);
  for (const f of failures.slice(0, 40)) {
    console.log(`  ${f.file.slice(0, 30).padEnd(32)} ${f.field.padEnd(32)}`);
    console.log(`      want: ${JSON.stringify(f.want)}`);
    console.log(`      got : ${JSON.stringify(f.got)}`);
  }
}
process.exit(failures.length || klpCountMismatches.length ? 1 : 0);
