/**
 * dnevnik.js — the running time tally for the 14-day trial.
 *
 * WHAT THIS IS FOR. The whole product is a time argument. Everything else the trial shows — the
 * reliability tiers, the packet gate, the honest refusals — exists to make the time saving
 * trustworthy, not to replace it. But a single run only ever proves a single run, and the number
 * that decides Faza 1 is what fourteen days of real work actually saved. So the trial keeps a
 * tally: how many offers went through, how long the machine took, and, against the client's own
 * stated manual minutes, how much time that came to.
 *
 * The client reads that number out at the end and tells us whether it is worth it. That is a
 * measurement they made, on their own documents, which is worth more than any figure we quote.
 *
 * WHAT IT MAY CONTAIN — and this is the whole design constraint.
 *
 * Aneks 1 A3(d) says nothing is stored: not the document, not the extracted data. That must stay
 * literally true, so this module stores COUNTS AND SECONDS ONLY. No name, no filename, no field
 * value, no offer number, nothing derived from the contents of a document. If a future edit is
 * tempted to add "which documents" or "which fields were corrected", it does not belong here — it
 * belongs in a design conversation about the audit trail the production system will need.
 *
 * WHERE IT LIVES. localStorage, in the user's own browser, on their own machine. It never reaches
 * our server; there is no endpoint that receives it. That keeps A3(d) true as written. It also
 * means the tally is per-browser and per-machine: two colleagues each get their own, and clearing
 * site data clears it. Both facts are stated on screen rather than discovered.
 *
 * Browser-importable ES module. No node builtins, no imports outside lib/.
 */

const KLJUC = "hh_prihranek_v1";
const VERZIJA = 1;

/** Everything this module is allowed to remember. Deliberately five numbers and a date. */
const PRAZEN = {
  verzija: VERZIJA,
  zacetek: null,          // ISO date of the first recorded run
  zadnji: null,           // ISO date of the most recent one
  pregledov: 0,           // how many times documents were dropped in
  ponudb: 0,              // how many offers were actually read
  strojnoSekund: 0,       // total machine time over those offers
  rocnoMinutNaPonudbo: 0, // the client's own stated manual minutes, last value entered
};

/**
 * A storage that may not exist and may throw.
 *
 * Safari in private mode throws on setItem once the quota is zero, and an iframe with third-party
 * storage blocked throws on the mere ACCESS to localStorage — not on the call. Both would take
 * down the whole page from a feature that is, in the end, a counter. Every entry point here
 * degrades to "no tally" rather than propagating.
 */
function shramba() {
  try {
    const s = globalThis.localStorage;
    if (!s) return null;
    // Touch it: access alone is what throws when storage is blocked.
    const t = "__hh_test__";
    s.setItem(t, "1");
    s.removeItem(t);
    return s;
  } catch {
    return null;
  }
}

export function naVoljo() {
  return shramba() !== null;
}

function danes() {
  return new Date().toISOString().slice(0, 10);
}

const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);

/** Read the tally. Any corruption resets to empty rather than throwing at render time. */
export function beri() {
  const s = shramba();
  if (!s) return { ...PRAZEN };
  try {
    const raw = s.getItem(KLJUC);
    if (!raw) return { ...PRAZEN };
    const o = JSON.parse(raw);
    if (!o || typeof o !== "object" || o.verzija !== VERZIJA) return { ...PRAZEN };
    return {
      verzija: VERZIJA,
      zacetek: typeof o.zacetek === "string" ? o.zacetek : null,
      zadnji: typeof o.zadnji === "string" ? o.zadnji : null,
      pregledov: num(o.pregledov),
      ponudb: num(o.ponudb),
      strojnoSekund: num(o.strojnoSekund),
      rocnoMinutNaPonudbo: num(o.rocnoMinutNaPonudbo),
    };
  } catch {
    return { ...PRAZEN };
  }
}

function pisi(stanje) {
  const s = shramba();
  if (!s) return false;
  try {
    s.setItem(KLJUC, JSON.stringify(stanje));
    return true;
  } catch {
    return false;
  }
}

/**
 * Record one completed review.
 *
 * A review with no offers read still counts as a review — the client dropped a packet in and got
 * an answer, even if the answer was "there is no offer here". But it contributes no machine time
 * and no saving, because no offer was processed.
 *
 * `rocnoMinutNaPonudbo` is the client's own figure from the ROI panel. It OVERWRITES rather than
 * accumulates: it is a standing estimate of their manual process, not a per-run measurement, and
 * the most recent one they typed is the one they believe.
 */
export function zabelezi({ ponudb = 0, strojnoSekund = 0, rocnoMinutNaPonudbo = null } = {}) {
  const prej = beri();
  const p = Math.trunc(num(ponudb));
  const stanje = {
    ...prej,
    zacetek: prej.zacetek || danes(),
    zadnji: danes(),
    pregledov: prej.pregledov + 1,
    ponudb: prej.ponudb + p,
    strojnoSekund: Math.round((prej.strojnoSekund + num(strojnoSekund)) * 10) / 10,
    rocnoMinutNaPonudbo: rocnoMinutNaPonudbo === null || num(rocnoMinutNaPonudbo) === 0
      ? prej.rocnoMinutNaPonudbo
      : num(rocnoMinutNaPonudbo),
  };
  pisi(stanje);
  return stanje;
}

/**
 * Record the client's standing manual estimate on its own.
 *
 * They usually type their minutes into the ROI panel AFTER a run, having just seen how long the
 * machine took. Without this, the total would sit there saying "no saving computed" until they
 * happened to drop another packet in — which reads as broken, and is the moment the whole trial
 * is trying to make legible. Counters are untouched: this is not a review.
 */
export function nastaviRocno(minutNaPonudbo) {
  const v = num(minutNaPonudbo);
  const prej = beri();
  if (v === prej.rocnoMinutNaPonudbo) return prej;
  const stanje = { ...prej, rocnoMinutNaPonudbo: v };
  pisi(stanje);
  return stanje;
}

/**
 * What the tally means, in time.
 *
 * `prihranjenoMinut` is deliberately null — not 0 — until the client has stated their manual
 * minutes. Zero would read as "this saved you nothing", which is a different and false claim.
 * The same rule the ROI panel already follows: we bring no guess of our own to defend.
 *
 * The saving can legitimately be NEGATIVE if the client's stated manual time is lower than the
 * machine's. It is reported as measured. A tally that can only ever go up is a marketing device,
 * not a measurement, and this number's only value is that they can trust it.
 */
export function povzetek() {
  const t = beri();
  const strojnoMinut = Math.round((t.strojnoSekund / 60) * 100) / 100;
  const rocnoZnano = t.rocnoMinutNaPonudbo > 0;
  const rocnoMinut = rocnoZnano ? Math.round(t.rocnoMinutNaPonudbo * t.ponudb * 100) / 100 : null;
  return {
    ...t,
    strojnoMinut,
    rocnoMinut,
    prihranjenoMinut: rocnoZnano ? Math.round((rocnoMinut - strojnoMinut) * 10) / 10 : null,
    prihranjenoUr: rocnoZnano ? Math.round(((rocnoMinut - strojnoMinut) / 60) * 10) / 10 : null,
  };
}

/** Wipe it. The client owns this number and must be able to start again. */
export function pocisti() {
  const s = shramba();
  if (!s) return false;
  try {
    s.removeItem(KLJUC);
    return true;
  } catch {
    return false;
  }
}

/**
 * The plain-text summary the client sends back to us at the end of the trial.
 *
 * Written to be pasted into an e-mail, which is why it is prose with numbers rather than JSON,
 * and why it carries the caveat about the manual figure being theirs. It contains no personal
 * data for the same reason nothing else here does — if this ends up forwarded around their
 * office, it must be harmless.
 */
export function besedilo(p = povzetek()) {
  const n = (v, d = 1) => Number(v).toLocaleString("sl-SI", { maximumFractionDigits: d });
  const vrstice = [
    "Prihranek v času preizkusa — Prenos dokumentacije (AIS)",
    "",
    `Obdobje:            ${p.zacetek || "—"} do ${p.zadnji || "—"}`,
    `Pregledov:          ${n(p.pregledov, 0)}`,
    `Prebranih ponudb:   ${n(p.ponudb, 0)}`,
    `Strojni čas skupaj: ${n(p.strojnoMinut, 1)} min`,
  ];
  if (p.prihranjenoMinut === null) {
    vrstice.push(
      "",
      "Ročni čas ni vpisan, zato prihranka ne izračunam.",
      "Vpišite minute v panelu »Koliko časa to vzame danes?« in številka se pojavi.");
  } else {
    vrstice.push(
      `Ročno bi bilo:      ${n(p.rocnoMinut, 1)} min` +
      ` (${n(p.rocnoMinutNaPonudbo, 2)} min na ponudbo, vaša ocena)`,
      "",
      `PRIHRANJENO:        ${n(p.prihranjenoMinut, 1)} min (${n(p.prihranjenoUr, 1)} h)`);
  }
  vrstice.push(
    "",
    "Številke so izmerjene v vašem brskalniku in niso nikamor poslane.",
    "Ročni čas je vaša ocena, strojni čas je merjen.");
  return vrstice.join("\n");
}
