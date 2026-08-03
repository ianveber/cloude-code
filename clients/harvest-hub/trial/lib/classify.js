/**
 * classify.js — WHAT KIND of document is this?
 *
 * The extractor (lib/extract.js) already answers "what is in this ponudba". This module answers
 * the question that comes first, when a whole client folder lands in the drop zone: is this a
 * Ponudba, the 545. člen notice, a Kontrolni list, a Privolitvena izjava — or something we have
 * never seen and must hand to a human.
 *
 * THREE DESIGN DECISIONS, all of them about not lying.
 *
 * 1. A scan is not classified. Below VISION_THRESHOLD there is no text to fingerprint, so we
 *    return NEBRANO ("preberem s slike") and let the reading step decide. Guessing the class of
 *    a page we cannot read would be the single easiest way to put a wrong document in the wrong
 *    folder — and it would look right on screen.
 *
 * 2. The filename can only RAISE confidence, never decide. A bonus is added to a class only if
 *    the TEXT already scored for that class. So a 545 notice saved under a KLP filename is still
 *    a 545 notice, and a file called "KLP.pdf" with unrecognisable contents is still NEZNANO.
 *
 * 3. An honest unknown is correct output. A best score has to clear both an absolute floor and a
 *    margin over the runner-up; otherwise NEZNANO. The nearest match is not an answer.
 *
 * SCOPE. Only the five real classes below exist, because those are the only ones we hold samples
 * of. The client's full taxonomy (IDD, KID, SEPA, SID, Splošni pogoji, Informativni izračun,
 * Spremni dopis) is deliberately NOT detected — pretending to would be a fabricated capability.
 * Those documents land in NEZNANO, which is the truthful answer today.
 *
 * Browser-importable ES module. No node builtins, no imports outside lib/.
 */

import { VISION_THRESHOLD } from "./layout.js";

export const DOC = {
  PONUDBA: "ponudba",
  CLEN545: "clen545",
  KLP: "klp",
  PRIVOLITVENA: "privolitvena",
  NEZNANO: "neznano",
  NEBRANO: "nebrano",
};

/** Screen-facing. Plain Slovene only — this text is rendered as-is. */
export const DOC_LABEL = {
  ponudba: "Ponudba",
  clen545: "545. člen",
  klp: "Kontrolni list",
  privolitvena: "Privolitvena izjava",
  neznano: "Ne prepoznam — za ročni pregled",
  nebrano: "Skeniran — preberem s slike",
};

/** Screen-facing too: a short phrase naming what decided it. Never carries a document value. */
const SIG = {
  BESEDILO: "po besedilu dokumenta",
  BESEDILO_IME: "po besedilu in imenu datoteke",
  BREZ_BESEDILA: "dokument nima besedila",
  NIC: "besedilo ne ustreza nobenemu znanemu dokumentu",
};

/* ── text folding ─────────────────────────────────────────────────────────
 * Fold to lowercase ASCII so every marker below can be written once, and so a document whose
 * font drops the carons (it happens on the printed-to-PDF files) still fingerprints. NFD splits
 * č/š/ž into base letter + combining caron, which we then strip; đ does not decompose.
 */
function fold(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── fingerprints ─────────────────────────────────────────────────────────
 * [weight, pattern]. Weights are hand-set: a phrase that appears on ONE class and nowhere else
 * is worth 3-4; a phrase that merely belongs to the insurance domain is worth 1-2. Every pattern
 * below was read off the client's own 15 sample documents, not invented.
 */

const M_PONUDBA = [
  // the Harvest Hub agency block — on 7 of the 8 born-digital offers
  [3, /zastopnik oz\.? posrednik in st\.? licence/],
  [3, /posredovano od \(agencija\)/],
  [3, /prejem ponudbe na merkur zavarovalnici/],
  // the offer/contract number field — on all 8, under one of two different labels
  [2, /stevilka pogodbe/],
  [2, /stevilka ponudbe/],
  // the party block
  [2, /davcna stevilka/],
  // the payment block
  [2, /frekvenca placevanja/],
  [1, /nacin placevanja/],
  [1, /letna premija|\bobrok\b/],
  // the cover block
  [1, /zavarovalna doba/],
  [1, /zacet(ek|ka) zavarovanja|datum zacetka zav/],
];

const M_CLEN545 = [
  [4, /pisno obvestilo zavarovalcu/],
  [4, /545\.\s*clen/],
  [3, /zakona? o zavarovalnistvu|zzavar-1/],
  [3, /dovoljenje za opravljanje poslov zavarovalnega zastopanja/],
  [2, /register zavarovalnih zastopnikov/],
  [2, /agencij[ae] za zavarovalni nadzor/],
];

const M_KLP = [
  [4, /stevilka zav\.? zastopnika/],
  [3, /zavarovanec \(zavarovana oseba\)/],
  [3, /pomozni zav\.? zastopnik/],
  [2, /^klp\b/],
  [2, /\bst\.\s*ponudbe/],   // the KLP's own short label; offers write "Številka ponudbe"
  [2, /telefon ?\/ ?mobitel/],
];

const M_PRIVOLITVENA = [
  [4, /privolitven[ai] izjav/],
  [3, /soglasam,? da druzba/],
  [3, /informacijskemu pooblascencu/],
  [2, /obdelav[oe] osebnih podatkov/],
  [2, /neposredn(ega trzenja|o trzenje)/],
  [2, /\bprivolitev\b/],
  [1, /gdpr/],
];

const MARKERS = {
  [DOC.PONUDBA]: M_PONUDBA,
  [DOC.CLEN545]: M_CLEN545,
  [DOC.KLP]: M_KLP,
  [DOC.PRIVOLITVENA]: M_PRIVOLITVENA,
};

/**
 * Filename hints. Never decisive on their own — see FILENAME_BONUS below. The client's own
 * offers are named after the product ("2 - Nezgoda.pdf"), so most of these never fire; they
 * exist for the four support documents, which ARE named after their type.
 */
const FILENAME_HINT = [
  [DOC.CLEN545, /545|\bclen\b/],
  [DOC.KLP, /\bklp\b|kontrolni list/],
  [DOC.PRIVOLITVENA, /privolitven/],
  [DOC.PONUDBA, /ponudb|polic/],
];

/**
 * Tuning. Measured over the 15 real samples — best score / margin over the runner-up:
 *
 *   545. člen                18 / 18      offers, born-digital     19-21 / 19-21
 *   Kontrolni list  (×2)     16 / 16      Popotnik                 10 /  8
 *   Privolitvena izjava      17 / 17      the three scans           — (no text layer)
 *
 * Popotnik is the floor: it is issued as a polica, so it carries none of the three agency-block
 * phrases the other seven offers share, and its Merkur footer names the supervisory authority,
 * which is the only cross-class contamination in the whole set (2 points towards 545). The floor
 * and margin below sit under that, with room to spare.
 */
const MIN_SCORE = 6;
const MIN_MARGIN = 3;
/**
 * Keep FILENAME_BONUS < MIN_SCORE. That inequality is what makes "a filename can never decide
 * alone" arithmetic rather than a promise: a class the text did not support tops out at the
 * bonus, which cannot reach the floor. The `base[k] > 0` guard below enforces the same rule
 * structurally, so the property survives someone retuning these three numbers.
 */
const FILENAME_BONUS = 2;

function score(markers, text) {
  let n = 0;
  for (const [w, re] of markers) if (re.test(text)) n += w;
  return n;
}

/**
 * @param {{filename?: string, text?: string, charCount?: number}} input
 *        `charCount` is the printable-character count of the page's text layer (layout.js
 *        pageCharCount). Omit it and it is derived from `text`.
 * @returns {{klas: string, signal: string, potrebujeBranje: boolean}}
 *        `signal` is a short Slovene phrase, safe to render.
 */
export function classify({ filename = "", text = "", charCount } = {}) {
  const t = fold(text);
  const chars = typeof charCount === "number" ? charCount : t.length;

  // No readable text layer -> we do not know, and we do not guess. The reading step decides.
  if (chars < VISION_THRESHOLD) {
    return { klas: DOC.NEBRANO, signal: SIG.BREZ_BESEDILA, potrebujeBranje: true };
  }

  const base = {};
  for (const k of Object.keys(MARKERS)) base[k] = score(MARKERS[k], t);

  // The filename may only reinforce a class the text already supports.
  const name = fold(String(filename).split(/[\\/]/).pop() || "");
  const hinted = new Set();
  for (const [k, re] of FILENAME_HINT) if (re.test(name)) hinted.add(k);

  const total = { ...base };
  for (const k of hinted) if (base[k] > 0) total[k] += FILENAME_BONUS;

  const ranked = Object.entries(total).sort((a, b) => b[1] - a[1]);
  const [bestK, bestS] = ranked[0];
  const runnerUp = ranked[1] ? ranked[1][1] : 0;

  if (bestS < MIN_SCORE || bestS - runnerUp < MIN_MARGIN) {
    return { klas: DOC.NEZNANO, signal: SIG.NIC, potrebujeBranje: false };
  }

  const helpedByName = hinted.has(bestK) && base[bestK] > 0;
  return {
    klas: bestK,
    signal: helpedByName ? SIG.BESEDILO_IME : SIG.BESEDILO,
    potrebujeBranje: false,
  };
}
