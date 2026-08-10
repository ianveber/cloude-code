/**
 * render.mjs — produce filled KLP / Privolitvena izjava PDFs, and measure fidelity
 * against the client's own form.
 *
 *   node scripts/render.mjs --fidelity          fill with the golden record, diff vs the original
 *   node scripts/render.mjs --from "2 - Nezgoda.pdf"   full pipeline: ponudba -> KLP
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { klpHtml, privolitevHtml } from "../lib/klp.js";
import { restoreLayout, itemsFromTextContent, serializeRows } from "../lib/layout.js";
import { SYSTEM, buildUserPrompt, toKlp, KLP_FIELDS } from "../lib/extract.js";
import { callClaude } from "../lib/claude.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// Generated KLPs and privolitvene carry the client's real values, so they are personal data and
// must not land in the work tree — DPA 5(a). Write to the data home; fall back to ROOT/out only
// when that home does not exist (older checkout).
const DATA_HOME = path.join(process.env.HOME, "ais-client-data/harvest-hub");
const OUT = fs.existsSync(DATA_HOME) ? path.join(DATA_HOME, "out") : path.join(ROOT, "out");
fs.mkdirSync(OUT, { recursive: true });

const SAMPLES = [
  path.join(process.env.HOME, "ais-client-data/harvest-hub/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
  path.join(ROOT, "../materiali/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
].find((p) => fs.existsSync(p));

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** The browser's own print-to-PDF: vector, sharp, no html2canvas. */
function htmlToPdf(html, name) {
  const h = path.join(OUT, name + ".html"), p = path.join(OUT, name + ".pdf");
  fs.writeFileSync(h, html);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer",
    `--print-to-pdf=${p}`, "--virtual-time-budget=4000", `file://${h}`], { stdio: "pipe" });
  return p;
}

/** Text spans (x, y, size, bold, text) from a PDF — used to diff geometry numerically. */
function spans(pdfPath) {
  const py = `
import fitz, json, sys
d = fitz.open(sys.argv[1]); out = []
for b in d[0].get_text("dict")["blocks"]:
    for l in b.get("lines", []):
        for s in l["spans"]:
            t = s["text"].strip()
            if t: out.append({"x":round(s["bbox"][0],1),"y":round(s["bbox"][1],1),
                              "sz":round(s["size"],1),"b":"Bold" in s["font"],"t":t})
print(json.dumps(out))`;
  return JSON.parse(execFileSync("python3", ["-c", py, pdfPath], { encoding: "utf8", maxBuffer: 32e6 }));
}

const args = process.argv.slice(2);

/* ── fidelity: our trace vs their original, same data ────────────────────── */
if (args.includes("--fidelity")) {
  // The golden target is a KLP the client filled in by hand, so the fixture is one real person's
  // record — name, address, phone, e-mail — and an agent's name and internal number. That is
  // personal data: it lives in the data home, never in this repository (DPA 5(a)).
  const fixturePath = path.join(process.env.HOME, "ais-client-data/harvest-hub/fidelity-fixture.json");
  if (!fs.existsSync(fixturePath)) {
    console.error(`Fidelity fixture not found at ${fixturePath}.\n` +
      `It holds personal data and is deliberately outside the repo — see clients/harvest-hub/protokol/.`);
    process.exit(1);
  }
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const cell = (v) => ({ value: v ?? null, source: v == null ? null : "ponudba" });
  const golden = Object.fromEntries(KLP_FIELDS.map((f) => [f, cell(fixture.cells[f])]));

  const mine = spans(htmlToPdf(klpHtml(golden), "klp-fidelity"));
  const theirs = spans(path.join(SAMPLES, fixture.target_pdf));

  let matched = 0; const misses = [];
  for (const th of theirs) {
    const m = mine.find((o) => o.t === th.t && Math.abs(o.x - th.x) <= 2.5 && Math.abs(o.y - th.y) <= 2.5);
    if (m) matched++; else {
      const any = mine.find((o) => o.t === th.t);
      misses.push({ t: th.t, want: [th.x, th.y], got: any ? [any.x, any.y] : null });
    }
  }
  console.log(`\n  KLP FIDELITY — ${matched}/${theirs.length} text elements within 2.5pt of the original`);
  console.log(`  our spans: ${mine.length}   theirs: ${theirs.length}`);
  if (misses.length) {
    console.log("\n  OFF-POSITION / MISSING:");
    for (const m of misses.slice(0, 20))
      console.log(`    ${JSON.stringify(m.t).slice(0, 44).padEnd(46)} want ${JSON.stringify(m.want)}  got ${JSON.stringify(m.got)}`);
  }
  console.log(`\n  written: ${path.join(OUT, "klp-fidelity.pdf")}`);
}

/* ── full pipeline: a real ponudba -> filled KLP + privolitvena ──────────── */
const fromIdx = args.indexOf("--from");
if (fromIdx !== -1) {
  const file = args[fromIdx + 1];
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(path.join(SAMPLES, file))), useSystemFonts: true }).promise;
  const tc = await (await doc.getPage(1)).getTextContent();
  const layout = serializeRows(restoreLayout(itemsFromTextContent(tc)));
  await doc.destroy();

  // Personal data lives outside the repo (DPA 5(a)); fall back to the old in-repo path.
  const regPath = [
    path.join(process.env.HOME, "ais-client-data/harvest-hub/register-zastopnikov.json"),
    path.join(ROOT, "register-zastopnikov.json"),
  ].find((c) => fs.existsSync(c));
  const reg = regPath ? JSON.parse(fs.readFileSync(regPath, "utf8")) : null;
  const res = await callClaude({ system: SYSTEM, user: buildUserPrompt(layout) });
  if (res.error) { console.error("extract failed:", res.error, res.detail || ""); process.exit(1); }

  const outputs = toKlp(res.json, { register: reg });
  console.log(`\n  ${file}  ->  ${outputs.length} KLP`);
  outputs.forEach((cells, i) => {
    const tag = outputs.length > 1 ? `-${i + 1}` : "";
    const p = htmlToPdf(klpHtml(cells, { screen: false }), `klp${tag}`);
    htmlToPdf(privolitevHtml(cells), `privolitvena${tag}`);
    const amber = Object.entries(cells).filter(([, v]) => v.source && v.source !== "ponudba");
    console.log(`    ${path.basename(p)}   zavarovanec: ${cells["zavarovanec.ime_priimek"].value}`);
    for (const [k, v] of amber) console.log(`      AMBER  ${k} = ${JSON.stringify(v.value)}  (${v.source})`);
  });
  console.log(`\n  written to ${OUT}/`);
}
