/**
 * test-classify.mjs — run the SHIPPING classifier over the client's REAL sample documents.
 *
 *   node scripts/test-classify.mjs
 *
 * Imports the same lib/classify.js the browser imports, and reads the PDFs with the same
 * pdfjs-dist + pageCharCount path app.js uses, so what is asserted here is what happens on
 * screen. Exits non-zero on the first failure count above zero.
 *
 * PRIVACY. The samples hold real customer data — names, birth dates, tax numbers, health data.
 * This test prints class names, counts and MASKED filenames only. It never prints a value from
 * inside a document. No customer name appears in this source file either: expectations are keyed
 * by the non-personal prefix of each filename, and the name-bearing filename segments are masked
 * before they reach stdout.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pageCharCount } from "../lib/layout.js";
import { classify, DOC, DOC_LABEL } from "../lib/classify.js";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dir, "..");
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

const SAMPLES = [
  path.join(process.env.HOME, "ais-client-data/harvest-hub/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
  path.join(ROOT, "../materiali/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
].find((p) => fs.existsSync(p));

if (!SAMPLES) { console.error("Source documents not found. See 04-PLAN-demo.md Day 0."); process.exit(1); }

/* ── harness ─────────────────────────────────────────────────────────────── */

let pass = 0, fail = 0;
const ok = (cond, line) => { if (cond) { pass++; console.log(`  PASS  ${line}`); }
                             else      { fail++; console.log(`  FAIL  ${line}`); } };

/**
 * Mask the person-name segments of a sample filename. Rule: after an underscore, any segment
 * that is nothing but capitalised words is a name. Keeps the two Kontrolni list samples
 * distinguishable by their trailing lowercase description.
 */
function safeName(f) {
  const ext = /\.pdf$/i.test(f) ? f.slice(-4) : "";
  const base = ext ? f.slice(0, -4) : f;
  const parts = base.split("_");
  const masked = parts.map((seg, i) =>
    i > 0 && /^\p{Lu}[\p{Ll}]*(\s+\p{Lu}[\p{Ll}]*)*$/u.test(seg) ? "•" : seg);
  return masked.join("_") + ext;
}

/** Same read path as app.js: page 1 text layer + printable-character count. */
async function readPage1(file) {
  const data = new Uint8Array(fs.readFileSync(path.join(SAMPLES, file)));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  const charCount = pageCharCount(tc);
  const text = tc.items.map((i) => i.str).join(" ");
  await doc.destroy();
  return { text, charCount };
}

/* ── phase 1: every real sample ──────────────────────────────────────────── */

/**
 * Ground truth. First rule that matches a filename wins, so the three no-text-layer scans are
 * listed before the catch-all for offers.
 *
 * The three NEBRANO files ARE offers — but they carry no text layer, so the classifier must not
 * claim to know that. Their class is settled by the reading step, not here.
 */
const EXPECT = [
  { re: /^0 - 545\./,               klas: DOC.CLEN545,      count: 1, note: "545. člen notice" },
  { re: /^0 - KLP_/,                klas: DOC.KLP,          count: 2, note: "Kontrolni list" },
  { re: /^0 - Privolitvena izjava/, klas: DOC.PRIVOLITVENA, count: 1, note: "Privolitvena izjava" },
  { re: /^2 - Primer Merkur_/,      klas: DOC.NEBRANO,      count: 1, note: "offer, no text layer" },
  { re: /^3 - Primer Otroci/,       klas: DOC.NEBRANO,      count: 1, note: "offer, no text layer" },
  { re: /^9 - Primer Kolektivno/,   klas: DOC.NEBRANO,      count: 1, note: "offer, no text layer" },
  { re: /^[1-9] - /,                klas: DOC.PONUDBA,      count: 8, note: "offer, born-digital" },
];

const files = fs.readdirSync(SAMPLES).filter((f) => f.toLowerCase().endsWith(".pdf")).sort();

console.log(`\nlib/classify.js — ${files.length} real sample documents\n`);

const seen = new Map(EXPECT.map((e) => [e, 0]));
const byClass = {};
const texts = {};   // kept for phase 2, never printed

for (const f of files) {
  const { text, charCount } = await readPage1(f);
  texts[f] = { text, charCount };

  const rule = EXPECT.find((e) => e.re.test(f));
  const got = classify({ filename: f, text, charCount });
  byClass[got.klas] = (byClass[got.klas] || 0) + 1;

  if (!rule) { ok(false, `${safeName(f)}  ->  ${got.klas}   (no expectation covers this file)`); continue; }
  seen.set(rule, seen.get(rule) + 1);

  const classOk = got.klas === rule.klas;
  const readOk = got.potrebujeBranje === (rule.klas === DOC.NEBRANO);
  ok(classOk && readOk, `${safeName(f).padEnd(52)} ->  ${got.klas}`);
}

console.log("");
ok(files.length === 15, `sample count: ${files.length} files on disk`);
for (const e of EXPECT) {
  ok(seen.get(e) === e.count,
     `${String(seen.get(e)).padStart(2)}/${e.count}  ${e.klas.padEnd(13)} ${e.note}`);
}
ok((byClass[DOC.PONUDBA] || 0) + (byClass[DOC.NEBRANO] || 0) === 11,
   `11 offers accounted for: ${byClass[DOC.PONUDBA] || 0} read from text + ${byClass[DOC.NEBRANO] || 0} to read from the image`);
ok(!byClass[DOC.NEZNANO], `no real sample fell through to ${DOC.NEZNANO}`);

/* ── phase 2: adversarial ────────────────────────────────────────────────── */

console.log("\nadversarial — the fingerprint itself\n");

const t545 = texts[files.find((f) => /^0 - 545\./.test(f))];
const tKlp = texts[files.find((f) => /^0 - KLP_/.test(f))];
const tPon = texts[files.find((f) => /^5 - Riziko/.test(f))];

// the filename must never beat contradicting text, in either direction
ok(classify({ filename: "KLP kontrolni list.pdf", ...t545 }).klas === DOC.CLEN545,
   "545 text under a Kontrolni list filename  ->  clen545  (text wins)");
ok(classify({ filename: "0 - 545. clen.pdf", ...tKlp }).klas === DOC.KLP,
   "Kontrolni list text under a 545 filename  ->  klp  (text wins)");
ok(classify({ filename: "privolitvena izjava.pdf", ...tPon }).klas === DOC.PONUDBA,
   "offer text under a Privolitvena filename  ->  ponudba  (text wins)");

// ...and must never decide alone
ok(classify({ filename: "0 - KLP_kontrolni list.pdf", text: "brez vsebine ".repeat(60), charCount: 780 }).klas === DOC.NEZNANO,
   "meaningless text under a Kontrolni list filename  ->  neznano  (filename alone cannot decide)");
ok(classify({ filename: "545. clen.pdf", text: "brez vsebine ".repeat(60), charCount: 780 }).klas === DOC.NEZNANO,
   "meaningless text under a 545 filename  ->  neznano  (filename alone cannot decide)");

// a filename that agrees with the text is allowed to say so
{
  const r = classify({ filename: "0 - 545. clen.pdf", ...t545 });
  ok(r.klas === DOC.CLEN545 && r.signal === "po besedilu in imenu datoteke",
     "545 text under a 545 filename  ->  clen545, signal names both");
  const r2 = classify({ filename: "nekaj drugega.pdf", ...t545 });
  ok(r2.signal === "po besedilu dokumenta",
     "545 text under a neutral filename  ->  signal names the text only");
}

// empty text
{
  const r = classify({ filename: "prazno.pdf", text: "" });
  ok(r.klas === DOC.NEBRANO && r.potrebujeBranje === true,
     "empty text  ->  nebrano, flagged to read from the image");
  const r2 = classify({ filename: "prazno.pdf", text: "", charCount: 4000 });
  ok(r2.klas === DOC.NEZNANO && r2.potrebujeBranje === false,
     "empty text but a text layer is claimed  ->  neznano  (contradiction is not guessed away)");
  const r3 = classify();
  ok(r3.klas === DOC.NEBRANO, "no argument at all  ->  nebrano, no throw");
}

// classes that exist in the client's taxonomy but that we hold NO samples of. The correct
// answer is neznano — not the nearest match.
{
  const sepa = `SOGLASJE ZA SEPA DIREKTNO OBREMENITEV
    Referenca soglasja: ____  Ime dolznika: ____  Naslov dolznika: ____
    IBAN dolznika: SI56 ____  BIC banke dolznika: ____
    Vrsta placila: ponavljajoce se placilo.
    S podpisom tega soglasja pooblascam prejemnika placila, da posreduje navodilo svoji banki
    za obremenitev mojega racuna, in svojo banko, da obremeni moj racun v skladu z navodilom
    prejemnika placila. Vasa banka vam mora povrniti obremenjeni znesek v roku osmih tednov.
    Kraj in datum: ____  Podpis dolznika: ____`.repeat(2);
  const r = classify({ filename: "SEPA.pdf", text: sepa });
  ok(r.klas === DOC.NEZNANO, "SEPA mandate (class we hold no sample of)  ->  neznano");

  const kid = `DOKUMENT Z INFORMACIJAMI O ZAVAROVALNEM PRODUKTU
    Kaksna je vrsta zavarovanja? Kaj je zavarovano? Cesa zavarovanje ne krije?
    Ali zavarovalno kritje kje ne velja? Kaksne so moje obveznosti?
    Kdaj in kako placam? Kdaj se zavarovanje zacne in konca? Kako odstopim od pogodbe?
    Premija se placa v skladu s pogoji. Ta dokument je zgolj informativne narave.`.repeat(3);
  const r2 = classify({ filename: "KID.pdf", text: kid });
  ok(r2.klas === DOC.NEZNANO, "product information document  ->  neznano  (not the nearest match)");

  const dopis = `Spostovani, v prilogi vam posiljamo dokumentacijo. Prosimo, da jo pregledate,
    podpisete in nam vrnete. Za dodatna pojasnila smo vam na voljo. Lep pozdrav.`.repeat(8);
  ok(classify({ filename: "spremni dopis.pdf", text: dopis }).klas === DOC.NEZNANO,
     "covering letter  ->  neznano");

  // The likeliest real false positive: a non-offer document that legitimately reuses a few of
  // the offer's field labels. A handful of shared labels is not an identification.
  const izracun = `INFORMATIVNI IZRAČUN
    Zavarovalna doba: ____   Frekvenca plačevanja: ____   Način plačevanja: ____
    Ta izračun je informativne narave, ni zavezujoč in ne predstavlja ponudbe za sklenitev.
    Dejanske vrednosti se lahko razlikujejo glede na izbrane kritje in oceno tveganja.`.repeat(3);
  ok(classify({ filename: "informativni izracun.pdf", text: izracun }).klas === DOC.NEZNANO,
     "informative calculation sharing 3 offer labels  ->  neznano  (a few shared labels is not an identification)");

  ok(classify({ filename: "sum.pdf", text: "lorem ipsum dolor sit amet ".repeat(40) }).klas === DOC.NEZNANO,
     "nonsense text  ->  neznano");
}

// a weak partial overlap must not be enough
ok(classify({ filename: "x.pdf", text: ("Zavarovalec Ime in priimek Naslov posta in kraj E-mail Zavarovalnica ").repeat(12) }).klas === DOC.NEZNANO,
   "shared field labels only, no fingerprint  ->  neznano");

/**
 * A page carrying the markers of TWO classes at once — what a merged packet scanned into one
 * PDF actually looks like. Clearing the floor is not enough; the winner has to be clearly ahead,
 * or the page goes to a human. Built from label phrases only, never from a document value.
 */
{
  const filler = "Ta stran je namenoma brez vsebine. ".repeat(20);
  const both = (s) => ({ filename: "sken 001.pdf", text: s + filler });

  ok(classify(both("Številka zav. zastopnika: Št. ponudbe: 545. člen register zavarovalnih zastopnikov ")).klas === DOC.NEZNANO,
     "two classes tied above the floor  ->  neznano  (no arbitrary tie-break reaches the user)");
  ok(classify(both("Številka zav. zastopnika: Št. ponudbe: 545. člen ")).klas === DOC.NEZNANO,
     "two classes, narrow lead  ->  neznano  (a lead is not a decision)");
  ok(classify(both("Številka zav. zastopnika: Št. ponudbe: pomožni zav. zastopnik 545. člen register zavarovalnih zastopnikov ")).klas === DOC.KLP,
     "two classes, clear lead  ->  klp  (the rule is not a blanket refusal)");
}

/* ── phase 2b: properties that must hold over EVERY real sample ──────────── */

console.log("\nadversarial — sweeps over all 15 samples\n");

const CORRECT = new Map(files.map((f) => [f, EXPECT.find((e) => e.re.test(f)).klas]));
const WRONG_NAMES = ["0 - 545. clen.pdf", "KLP kontrolni list.pdf",
                     "Privolitvena izjava.pdf", "ponudba.pdf", "polica.pdf", "sken 001.pdf"];
{
  // no filename, right or wrong, may change the answer for any real document
  const moved = files.filter((f) =>
    WRONG_NAMES.some((n) => classify({ filename: n, ...texts[f] }).klas !== CORRECT.get(f)));
  ok(moved.length === 0,
     `${files.length} samples × ${WRONG_NAMES.length} substituted filenames: 0 reclassified (${moved.length} moved)`);
}
{
  // a document read only in part must DEGRADE (nebrano / neznano) — never mis-assign a class.
  // This is the property that matters when a page is short, cropped or partly rendered.
  const SAFE = new Set([DOC.NEZNANO, DOC.NEBRANO]);
  let checked = 0, bad = 0;
  for (const f of files) {
    const { text } = texts[f];
    for (let pct = 10; pct <= 100; pct += 10) {
      const cut = text.slice(0, Math.floor((text.length * pct) / 100));
      const got = classify({ filename: f, text: cut }).klas;
      checked++;
      if (got !== CORRECT.get(f) && !SAFE.has(got)) bad++;
    }
  }
  ok(bad === 0, `${checked} truncated reads: 0 assigned a wrong class (${bad} bad)`);
}

/* ── phase 3: the screen-facing strings ──────────────────────────────────── */

console.log("\nscreen-facing strings\n");

const CLASSES = Object.values(DOC);
ok(CLASSES.every((k) => typeof DOC_LABEL[k] === "string" && DOC_LABEL[k].length > 0)
   && Object.keys(DOC_LABEL).length === CLASSES.length,
   `every class has a label and there are no orphan labels (${CLASSES.length})`);

const SIGNALS = [
  "po besedilu dokumenta", "po besedilu in imenu datoteke",
  "dokument nima besedila", "besedilo ne ustreza nobenemu znanemu dokumentu",
];
{
  const produced = new Set();
  for (const f of files) produced.add(classify({ filename: f, ...texts[f] }).signal);
  produced.add(classify({ text: "" }).signal);
  produced.add(classify({ filename: "x.pdf", text: "lorem ".repeat(200) }).signal);
  ok([...produced].every((s) => SIGNALS.includes(s)),
     `every signal produced comes from the fixed set of ${SIGNALS.length} phrases (no document text can leak into it)`);
  ok(produced.size >= 3, `${produced.size} distinct signals exercised`);
}

// the UI rule: no technical word may reach the screen
const BANNED = /\b(vision|track|tir|pravilo|register|unmapped|payload|json|api|schema|model|token|prompt|opus|sonnet|haiku|claude|ocr|pdf|regex|score|fallback)\b/i;
ok([...Object.values(DOC_LABEL), ...SIGNALS].every((s) => !BANNED.test(s)),
   "no technical word in any label or signal");

/* ── summary ─────────────────────────────────────────────────────────────── */

console.log("\n" + "─".repeat(72));
console.log(`  ${pass} PASS   ${fail} FAIL`);
console.log("  classified: " + Object.entries(byClass).sort()
  .map(([k, n]) => `${n} ${k}`).join(" · "));
console.log("─".repeat(72) + "\n");
process.exit(fail ? 1 : 0);
