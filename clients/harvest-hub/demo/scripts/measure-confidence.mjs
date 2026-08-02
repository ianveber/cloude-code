/**
 * measure-confidence.mjs — what the reliability signal actually does on the client's documents.
 *
 * Reads every sample twice with two different models, scores each field with lib/confidence.mjs,
 * and reports the tier distribution, the flag rate, and every disagreement between the two reads.
 *
 * The flag rate is the number the guarantee addendum needs: Jamstvo 1 counts a flagged field as
 * correct, so without an upper bound on flagging a system that flags everything scores 100% and
 * passes the acceptance test while the client still types every value by hand. This measures what
 * the bound would have to be.
 *
 *   ANTHROPIC_API_KEY=... node scripts/measure-confidence.mjs
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { callClaude, imageBlocks, costUsd } from "../lib/claude.mjs";
import { SYSTEM, SCHEMA_HINT, buildUserPrompt, toKlp, KLP_FIELDS } from "../lib/extract.js";
import { restoreLayout, itemsFromTextContent, serializeRows, pageCharCount, VISION_THRESHOLD }
  from "../lib/layout.js";
import { klpConfidence, PISNI_PRAG, TIERS } from "../lib/confidence.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const { createCanvas } = await import("@napi-rs/canvas");

// Read A is the production pair. Read B is a deliberately different model on both tracks — two
// runs of the same model would agree with themselves and prove nothing.
const A = { text: "claude-sonnet-4-6", vision: "claude-opus-4-8" };
const B = { text: "claude-haiku-4-5", vision: "claude-sonnet-4-6" };

const HOME = os.homedir();
const SAMPLES = [
  path.join(HOME, "ais-client-data/harvest-hub/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
  path.join(ROOT, "../materiali/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
].find((p) => fs.existsSync(p));
const truthPath = [path.join(HOME, "ais-client-data/harvest-hub/truth.json"), path.join(ROOT, "truth.json")]
  .find((p) => fs.existsSync(p));
if (!SAMPLES || !truthPath) { console.error("samples or truth.json not found"); process.exit(1); }
const truth = JSON.parse(fs.readFileSync(truthPath, "utf8"));

const VISION_INSTRUCTION = `Preberi to sliko zavarovalne ponudbe in vrni ISTI JSON kot pri besedilni poti.\n\nVrni SAMO JSON v tej obliki:\n${SCHEMA_HINT}`;

async function pageOf(file) {
  const data = new Uint8Array(fs.readFileSync(path.join(SAMPLES, file)));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  const chars = pageCharCount(tc);
  const layout = serializeRows(restoreLayout(itemsFromTextContent(tc)));
  let image = null;
  if (chars < VISION_THRESHOLD) {
    const vp = page.getViewport({ scale: 2.2 });
    const cv = createCanvas(vp.width, vp.height);
    await page.render({ canvasContext: cv.getContext("2d"), viewport: vp,
      annotationMode: pdfjs.AnnotationMode.DISABLE }).promise;
    image = cv.toBuffer("image/png").toString("base64");
  }
  await doc.destroy();
  return { layout, chars, image, vision: chars < VISION_THRESHOLD };
}

let cost = 0;
const tally = Object.fromEntries(TIERS.map((t) => [t, 0]));
const disagreements = [];
const perDoc = [];
let nEmpty = 0, nFlag = 0, nBearing = 0;

console.log(`\n  Read A: ${A.text} / ${A.vision}`);
console.log(`  Read B: ${B.text} / ${B.vision}`);
console.log(`  Write threshold: ${PISNI_PRAG}\n`);

for (const doc of truth.documents) {
  const { layout, image, vision } = await pageOf(doc.file);
  const user = vision ? imageBlocks(image, VISION_INSTRUCTION) : buildUserPrompt(layout);
  const [ma, mb] = vision ? [A.vision, B.vision] : [A.text, B.text];

  const [ra, rb] = await Promise.all([
    callClaude({ system: SYSTEM, user, model: ma, maxTokens: 3000 }),
    callClaude({ system: SYSTEM, user, model: mb, maxTokens: 3000 }),
  ]);
  if (ra.error || rb.error) {
    console.log(`  ${doc.file.slice(0, 44).padEnd(46)} ERROR ${ra.error || rb.error}`);
    continue;
  }
  cost += costUsd(ma, ra.usage) + costUsd(mb, rb.usage);

  const outA = toKlp(ra.json), outB = toKlp(rb.json);
  // Compare the KLP that carries the same insured; fan-out order is not guaranteed to match.
  const pick = (list, target) => list.find((c) =>
    (c["zavarovanec.ime_priimek"]?.value || "") === (target["zavarovanec.ime_priimek"]?.value || "")) || list[0];

  let dFlag = 0, dTotal = 0;
  for (const cells of outA) {
    const r = klpConfidence({ cells, secondCells: outB.length ? pick(outB, cells) : null,
      layout, fields: KLP_FIELDS });
    for (const f of KLP_FIELDS) {
      tally[r.fields[f].tier]++;
      if (r.fields[f].agreement === "razhajanje") {
        disagreements.push({ file: doc.file, field: f });
      }
    }
    dFlag += r.flagged.length; dTotal += r.bearing;
    nEmpty += r.empty.length; nFlag += r.flagged.length; nBearing += r.bearing;
  }
  if (!outA.length) { console.log(`  ${doc.file.slice(0, 44).padEnd(46)} (no KLP — nobody named)`); continue; }
  perDoc.push({ file: doc.file, flagged: dFlag, total: dTotal });
  console.log(`  ${doc.file.slice(0, 44).padEnd(46)} ${String(dTotal - dFlag).padStart(3)}/${String(dTotal).padEnd(3)} za pisanje` +
    `  ${dFlag ? `${dFlag} v pregled` : ""}`);
}

const total = Object.values(tally).reduce((a, b) => a + b, 0);
const flagged = tally.nizka + tally.brez;

console.log(`\n  ── tier distribution over ${total} cells ───────────────────`);
for (const t of [...TIERS].reverse()) {
  const n = tally[t];
  console.log(`  ${t.padEnd(9)} ${String(n).padStart(4)}  ${(100 * n / total).toFixed(1).padStart(5)}%  ${"█".repeat(Math.round(40 * n / total))}`);
}

console.log(`\n  ── the number the addendum needs ──────────────────────────`);
console.log(`  cells in total        : ${total}`);
console.log(`  of those, empty       : ${nEmpty}  (no value on the ponudba — not review work)`);
console.log(`  data-bearing          : ${nBearing}`);
console.log(`  written automatically : ${nBearing - nFlag}/${nBearing}  (${(100 * (nBearing - nFlag) / nBearing).toFixed(1)}%)`);
console.log(`  routed to a person    : ${nFlag}/${nBearing}  (${(100 * nFlag / nBearing).toFixed(1)}%)`);
console.log(`  -> flag-rate cap [X] at or just above ${Math.ceil(100 * nFlag / nBearing)}%`);
console.log(`\n  (counting empty fields as review work would report ${(100 * (nFlag + nEmpty) / total).toFixed(1)}% —`);
console.log(`   overstating the human burden by ${((100 * (nFlag + nEmpty) / total) - (100 * nFlag / nBearing)).toFixed(0)} points. They are excluded deliberately.)`);

console.log(`\n  ── disagreement between the two reads ─────────────────────`);
if (!disagreements.length) {
  console.log(`  none — the two models agreed on every one of ${total} cells.`);
  console.log(`  Read that as a ceiling on the signal, not a triumph: on documents this clean the`);
  console.log(`  agreement channel contributes nothing, and the tiers are carried by verbatim +`);
  console.log(`  provenance. It earns its cost on the hard documents, which are not in this sample.`);
} else {
  for (const d of disagreements) console.log(`  ${d.file.slice(0, 44).padEnd(46)} ${d.field}`);
}

console.log(`\n  dual-read cost: $${cost.toFixed(4)} for ${truth.documents.length} documents ` +
  `($${(cost / truth.documents.length).toFixed(4)}/document)\n`);
