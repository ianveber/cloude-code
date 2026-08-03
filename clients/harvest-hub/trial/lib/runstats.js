/**
 * runstats.js — what the run in front of you actually did, counted from the run itself.
 *
 * Two jobs, deliberately separate:
 *
 *   1. THE COUNTER CARD  — newRun / noteDoc / summary. Every number on that card is a tally of
 *      documents and cells this run produced. Nothing here is a stored figure from a past
 *      measurement, so a file the client drags in live moves the card the same way a sample does.
 *
 *   2. THE ROI CAPTURE   — ROI_KORAKI / roiSummary. The six manual steps come from the client's
 *      own description of today's process. Every default is ZERO minutes: the client says those
 *      numbers out loud in the meeting, we never pre-fill an assumption we would then defend.
 *
 * TIME ONLY. This module computes minutes, seconds, hours and working days. It computes no
 * money, and it must never learn how: a €/h box lets the director negotiate inside our own demo.
 *
 * Pure. No I/O, no clock — timings arrive as inputs (`ms`, `strojnoSekund`), so the same inputs
 * always give the same summary and the tests are deterministic.
 */

import { KLP_FIELDS } from "./extract.js";

/**
 * Document classes we need to recognise by name. Kept as literals rather than imported from
 * lib/classify.js so this module stands on its own — the two files agree by contract, and the
 * test pins these strings.
 */
const KLAS_NEZNANO = "neznano";   // recognised nothing — honest unknown, goes to a human
const KLAS_NEBRANO = "nebrano";   // no text layer — read from the page image

/** Offers per month the annual figures scale on: the midpoint of the client's stated 300–500. */
export const PONUDB_NA_MESEC = 400;
const MESECEV_V_LETU = 12;
const PRIVZETO_UR_NA_DAN = 8;

const round = (n, d = 1) => {
  if (!Number.isFinite(n)) return 0;
  const f = 10 ** d;
  return Math.round((n + Number.EPSILON) * f) / f;
};
const nonNeg = (n) => (Number.isFinite(n) && n > 0 ? n : 0);

/* ── cells ───────────────────────────────────────────────────────────────── */

/** A cell counts as filled only when it carries a real value. */
const jeIzpolnjeno = (c) => c != null && c.value != null && String(c.value).trim() !== "";

/**
 * Does this cell need a human? Same rule the shell paints amber, kept in one place so the
 * counter card can never disagree with the rows above it:
 *   - an external lookup we could not resolve (the agent's number)
 *   - a value we derived rather than read (inherited from the zavarovalec)
 * An empty cell with no source is simply absent — not a flag.
 */
const potrebujeCloveka = (c) => {
  if (!c) return false;
  if (c.state === "UNMAPPED") return true;
  if (c.source === "register" && !jeIzpolnjeno(c)) return true;
  if (!jeIzpolnjeno(c)) return false;
  return c.source === "pravilo";
};

/**
 * Tally one document's KLP outputs. The denominator is the shipping field list, so a partial
 * output shows up as missing fields instead of silently shrinking "12 of 14" into "12 of 12".
 * Filled and flagged are read off the actual cells — never assumed, never constant.
 */
function countCells(listi) {
  let skupaj = 0, izpolnjenih = 0, zaPotrditev = 0;
  for (const out of listi) {
    if (!out) continue;
    for (const f of KLP_FIELDS) {
      const c = out[f];
      skupaj += 1;
      if (jeIzpolnjeno(c)) izpolnjenih += 1;
      if (potrebujeCloveka(c)) zaPotrditev += 1;
    }
  }
  return { skupaj, izpolnjenih, zaPotrditev };
}

/* ── the run ─────────────────────────────────────────────────────────────── */

/** A fresh, empty run. No clock is read — the caller supplies every timing. */
export function newRun() {
  return { dokumenti: [], msSkupaj: 0 };
}

/**
 * Record one processed document.
 *
 * @param run          a run from newRun()
 * @param klas         document class (see lib/classify.js DOC)
 * @param scanned      true when the page had no usable text and was read from the image
 * @param ms           milliseconds this document took, measured by the caller
 * @param outputs      the KLP cell maps produced (0 for a non-ponudba, 2+ when children fan out)
 * @param napaka       true when reading this document could not be completed
 * @param neberljiv    true when the file could not be opened at all — so it has NEITHER a text
 *                     layer nor a page image, and must not be counted under either
 */
export function noteDoc(run, { klas = null, scanned = false, ms = 0, outputs = [],
                               napaka = false, neberljiv = false } = {}) {
  if (!run || !Array.isArray(run.dokumenti)) return;
  const listi = Array.isArray(outputs) ? outputs.filter(Boolean) : [];
  const trajanje = nonNeg(ms);
  const nedostopen = neberljiv === true;
  run.dokumenti.push({
    klas: klas ?? null,
    // a document still carrying the unread class was, by definition, read from the image —
    // unless it could not be opened at all, in which case nothing was read from anything
    skeniran: !nedostopen && (scanned === true || klas === KLAS_NEBRANO),
    neberljiv: nedostopen,
    neuspel: napaka === true,
    ms: trajanje,
    kontrolnihListov: listi.length,
    polja: countCells(listi),
  });
  run.msSkupaj = nonNeg(run.msSkupaj) + trajanje;
}

/**
 * The counter card. Every figure is a sum over what noteDoc actually saw.
 *
 * `poljIzpolnjenih` and `poljZaPotrditev` overlap on purpose: a value we derived is both filled
 * and awaiting a human, exactly as the row on screen shows it.
 */
export function summary(run) {
  const docs = run && Array.isArray(run.dokumenti) ? run.dokumenti : [];
  let skeniranih = 0, neprepoznanih = 0, kontrolnihListov = 0;
  let neberljivih = 0, neuspelih = 0;
  let poljSkupaj = 0, poljIzpolnjenih = 0, poljZaPotrditev = 0;

  for (const d of docs) {
    if (!d) continue;
    if (d.skeniran) skeniranih += 1;
    if (d.neberljiv) neberljivih += 1;
    if (d.neuspel) neuspelih += 1;
    if (d.klas === KLAS_NEZNANO) neprepoznanih += 1;
    kontrolnihListov += d.kontrolnihListov || 0;
    poljSkupaj += d.polja?.skupaj || 0;
    poljIzpolnjenih += d.polja?.izpolnjenih || 0;
    poljZaPotrditev += d.polja?.zaPotrditev || 0;
  }

  return {
    dokumentov: docs.length,
    // only pages whose text layer was actually read: a file we could not open has no text
    // layer to claim and no image either, so it is subtracted from both
    besedilnih: docs.length - skeniranih - neberljivih,
    skeniranih,
    neberljivih,
    neuspelih,
    neprepoznanih,
    kontrolnihListov,
    poljSkupaj,
    poljIzpolnjenih,
    poljZaPotrditev,
    sekund: round(nonNeg(run?.msSkupaj) / 1000, 1),
  };
}

/* ── ROI capture — time only ─────────────────────────────────────────────── */

/**
 * Today's process, in the client's own words (02-ponudba-prenos-zero.md, "Povzetek"):
 * retrieve from e-mail, save to the server folder, check completeness, retype into eDOKUMENTE,
 * retype the SAME data into the Zavarovalniški program, and fill the kontrolni list plus the
 * privolitvena izjava for signing.
 *
 * Every default is 0. The client fills these in live; we bring no guess to defend.
 */
export const ROI_KORAKI = [
  { id: "prevzem",        naslov: "Prevzem dokumentacije iz e-pošte",                       privzetoMinut: 0 },
  { id: "shranjevanje",   naslov: "Shranjevanje v mapo na strežniku",                       privzetoMinut: 0 },
  { id: "popolnost",      naslov: "Preverjanje popolnosti dokumentacije",                   privzetoMinut: 0 },
  { id: "edokumenti",     naslov: "Prepis podatkov v eDOKUMENTE",                           privzetoMinut: 0 },
  { id: "zavarovalniski", naslov: "Prepis istih podatkov v Zavarovalniški program",         privzetoMinut: 0 },
  { id: "listi",          naslov: "Izpolnitev kontrolnega lista in privolitvene izjave",    privzetoMinut: 0 },
];

/**
 * Turn the six spoken numbers plus this run's measured time into a time comparison.
 *
 * @param minutePoKoraku   { <korak id>: minute } — anything missing counts as 0, anything
 *                         unrecognised is ignored (only the six steps below can contribute)
 * @param strojnoSekund    seconds the machine took, from summary().sekund
 * @param stDokumentov     how many documents produced those seconds
 * @param ponudbNaMesec    volume the annual figures scale on — a parameter, never baked in
 * @param delovnihUrNaDan  how long a working day is, for the "days per year" line
 *
 * Returns time units only. Nothing here is, or may become, a monetary figure.
 */
export function roiSummary({
  minutePoKoraku = {},
  strojnoSekund = 0,
  stDokumentov = 0,
  ponudbNaMesec = PONUDB_NA_MESEC,
  delovnihUrNaDan = PRIVZETO_UR_NA_DAN,
} = {}) {
  const vir = minutePoKoraku || {};
  const koraki = ROI_KORAKI.map((k) => ({
    id: k.id,
    naslov: k.naslov,
    minut: round(nonNeg(Number(vir[k.id])) || k.privzetoMinut, 2),
  }));

  const rocnoMinutNaPonudbo = round(koraki.reduce((s, k) => s + k.minut, 0), 2);

  const stDok = Math.max(0, Math.trunc(nonNeg(stDokumentov)));
  const strojnoSekundNaPonudbo = stDok > 0 ? round(nonNeg(strojnoSekund) / stDok, 1) : 0;
  const strojnoMinutNaPonudbo = round(strojnoSekundNaPonudbo / 60, 2);

  const naMesec = Math.max(0, Math.round(nonNeg(ponudbNaMesec)));
  const ponudbLetno = naMesec * MESECEV_V_LETU;

  const rocnoUrLetno = round((rocnoMinutNaPonudbo * ponudbLetno) / 60, 1);
  const strojnoUrLetno = round((strojnoSekundNaPonudbo * ponudbLetno) / 3600, 1);

  // Until the client has spoken, there is no saving to show — not a negative one either.
  const vneseno = rocnoMinutNaPonudbo > 0;
  const urNaDan = nonNeg(delovnihUrNaDan) || PRIVZETO_UR_NA_DAN;
  const prihranekUrLetno = vneseno ? round(rocnoUrLetno - strojnoUrLetno, 1) : 0;

  return {
    vneseno,
    koraki,
    ponudbNaMesec: naMesec,
    ponudbLetno,
    delovnihUrNaDan: urNaDan,
    rocnoMinutNaPonudbo,
    strojnoSekundNaPonudbo,
    strojnoMinutNaPonudbo,
    rocnoUrLetno,
    strojnoUrLetno,
    prihranekMinutNaPonudbo: vneseno ? round(rocnoMinutNaPonudbo - strojnoMinutNaPonudbo, 2) : 0,
    prihranekUrLetno,
    prihranekDniLetno: vneseno ? round(prihranekUrLetno / urNaDan, 1) : 0,
  };
}
