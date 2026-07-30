/**
 * edokumenti.js — the hand-off payload.
 *
 * WHAT THIS IS NOT: an integration. We have no access to eDOKUMENTI, no field list from their
 * vendor and no test environment. Claiming otherwise in a file that gets forwarded to people who
 * were not in the room is exactly the kind of quiet overclaim that costs a project its credibility
 * in Phase 0. So every key below is OURS, named in plain Slovene, and the top level says so out
 * loud before anything else is read.
 *
 * WHAT IT IS: the same cells `toKlp()` produced, written out so that a reviewer can tell — field by
 * field — what the machine read from the document and what still needs a person. Nothing is
 * silently dropped. A field we could not resolve appears WITH an explicit "needs a human" marker
 * rather than being omitted, because an omitted field looks like a field that was never needed.
 *
 * Provenance is the whole point of the file. It carries the offer's Guarantee 2 ("no silent
 * errors") into a machine-readable shape: anything flagged here must not be written into their
 * systems without a person confirming it.
 *
 * Rules this file obeys:
 *   · time only — never a price, never a cost, never a euro
 *   · nothing invented — no field name from their systems, no value the run did not produce
 *   · the filename carries no personal data: it is a fixed prefix plus a timestamp, by construction
 */

import { KLP_FIELDS } from "./extract.js";

export const SHEMA = "0.1-predlog";

export const OPOMBA =
  "Predlog strukture za prenos v eDOKUMENTE. Poimenovanja polj so naša in niso povzeta po vaših " +
  "sistemih. Dokončno strukturo, nabor polj in način prenosa pisno potrdimo z dobaviteljem " +
  "eDOKUMENTOV v Fazi 0 — do takrat je ta datoteka namenjena pregledu, ne uvozu.";

/* ── provenance vocabulary ───────────────────────────────────────────────── */

/** The same four states the screen shows, plus an explicit "there is nothing here". */
export const IZVOR = {
  PONUDBA: "iz_ponudbe",
  ZA_POTRDITEV: "za_potrditev",
  REGISTER: "iz_registra",
  POTREBUJEM_REGISTER: "potrebujem_register",
  NI_PODATKA: "ni_podatka",
};

export const IZVOR_OPIS = {
  iz_ponudbe: "Prebrano iz ponudbe.",
  za_potrditev: "Izpeljano, ne prebrano — potrdi sodelavec.",
  iz_registra: "Dopolnjeno iz vašega registra zastopnikov.",
  potrebujem_register: "Te vrednosti v ponudbi ni — potrebujem vaš register zastopnikov.",
  ni_podatka: "Tega podatka v dokumentu ni.",
};

const POTREBUJE_CLOVEKA = new Set([IZVOR.ZA_POTRDITEV, IZVOR.POTREBUJEM_REGISTER]);

/* ── packet vocabulary ───────────────────────────────────────────────────── */

const PAKET_OPIS = {
  prehod: "Paket je popoln — zadržkov ni.",
  zadrzano: "Paket je zadržan do dopolnitve.",
  izjema: "Paket gre po posebni poti — obravnava izjeme.",
};

const IZJEMA_OPIS = {
  "kolektivno-pravna-oseba":
    "Kolektivno zavarovanje za pravno osebo — 545. člen pri tej obliki ne nastane.",
};

/** Whether the robot may hand the packet on. A held packet must not reach their systems. */
const PRENOS_PO_STATUSU = { prehod: true, zadrzano: false, izjema: true };

/* ── small helpers ───────────────────────────────────────────────────────── */

const imaVrednost = (v) => v != null && String(v).trim() !== "";

/** Everything written into the payload must survive JSON.stringify unchanged. */
function jsonValue(v) {
  if (v === undefined || v === null) return null;
  const t = typeof v;
  if (t === "string" || t === "boolean") return v;
  if (t === "number") return Number.isFinite(v) ? v : null;
  return String(v);
}

const strOrNull = (v) => (v == null ? null : String(v).trim() || null);
const round1 = (n) => Math.round(n * 10) / 10;

/**
 * Cell -> provenance. Mirrors what the screen shows, with one deliberate difference:
 * an unrecognised provenance is NEVER reported as read-from-the-offer. It goes to a human.
 * Failing toward a person is cheap; failing toward a false green is not.
 */
export function izvorCelice(cell) {
  const c = cell || {};
  const ima = imaVrednost(c.value);
  if (c.state === "UNMAPPED" || (c.source === "register" && !ima)) return IZVOR.POTREBUJEM_REGISTER;
  if (!ima) return IZVOR.NI_PODATKA;
  if (c.source === "ponudba") return IZVOR.PONUDBA;
  if (c.source === "register") return IZVOR.REGISTER;
  return IZVOR.ZA_POTRDITEV;
}

/** Carry the extractor's own extras through (oznaka, licenca_iz_ponudbe) without renaming them. */
const JEDRO_CELICE = new Set(["value", "source", "state", "razlog"]);
function dodatnoIz(cell) {
  if (!cell || typeof cell !== "object") return null;
  const out = {};
  for (const [k, v] of Object.entries(cell)) if (!JEDRO_CELICE.has(k)) out[k] = jsonValue(v);
  return Object.keys(out).length ? out : null;
}

/* ── time ────────────────────────────────────────────────────────────────── */

function toMs(v) {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  if (v instanceof Date && Number.isFinite(v.getTime())) return v.getTime();
  if (typeof v === "string") { const t = Date.parse(v); return Number.isFinite(t) ? t : null; }
  return null;
}

/**
 * When the run happened. runstats.js keeps no clock on purpose (it is pure, so its tests are
 * deterministic), so in practice this falls through to now — which is the honest answer anyway:
 * the stamp means "when this file was written". We still read a start if one is ever supplied.
 */
function runStartMs(run) {
  for (const v of [run, run?.zacetek, run?.start, run?.startedAt, run?.t0, run?.cas]) {
    const ms = toMs(v);
    if (ms != null) return ms;
  }
  return Date.now();
}

/**
 * Duration only if the run actually measured it. A guessed number is worse than no number.
 * Two shapes are real: `sekund` (runstats summary) and `msSkupaj` (the run itself, the sum of the
 * per-document timings the caller measured). Anything else reports null rather than inventing.
 */
function runSekund(run) {
  const s = run?.sekund;
  if (typeof s === "number" && Number.isFinite(s) && s >= 0) return round1(s);
  const ms = run?.msSkupaj;
  if (typeof ms === "number" && Number.isFinite(ms) && ms >= 0) return round1(ms / 1000);
  const a = toMs(run?.zacetek ?? run?.start ?? run?.t0);
  const b = toMs(run?.konec ?? run?.end);
  if (a != null && b != null && b >= a) return round1((b - a) / 1000);
  return null;
}

/* ── pieces ──────────────────────────────────────────────────────────────── */

const mapDoc = (d) => ({
  ime: strOrNull(d?.ime),
  vrsta: strOrNull(d?.klas),
  tip_zavarovalca: strOrNull(d?.tipZavarovalca),
  kolektivno: d?.kolektivno == null ? null : !!d.kolektivno,
});

/**
 * One kontrolni list. Iterates KLP_FIELDS so the shape is identical for every list, then appends
 * anything the extractor produced beyond them — a new field must never vanish just because this
 * module has not heard of it yet.
 */
function buildList(cells, zaporedna) {
  const c = cells && typeof cells === "object" ? cells : {};
  const kljuci = [...KLP_FIELDS, ...Object.keys(c).filter((k) => !KLP_FIELDS.includes(k))];

  const polja = {};
  for (const k of kljuci) {
    const cell = c[k] ?? null;
    const izvor = izvorCelice(cell);
    polja[k] = {
      vrednost: jsonValue(cell?.value),
      izvor,
      opis_izvora: IZVOR_OPIS[izvor],
      potrebuje_potrditev: POTREBUJE_CLOVEKA.has(izvor),
      pojasnilo: strOrNull(cell?.razlog),
      dodatno: dodatnoIz(cell),
    };
  }

  const vrednosti = Object.values(polja);
  const poimenovan = imaVrednost(polja["zavarovanec.ime_priimek"]?.vrednost);
  const zaPregled = vrednosti.filter((p) => p.potrebuje_potrditev).length;
  const izpeljanih = vrednosti.filter((p) => p.izvor === IZVOR.ZA_POTRDITEV).length;

  const opozorila = [];
  if (!poimenovan)
    opozorila.push("Zavarovanec ni poimensko naveden — kontrolnega lista brez ročnega pregleda ni mogoče izpolniti.");
  if (izpeljanih)
    opozorila.push(`${izpeljanih} podatkov ni na vrstici zavarovanca — čakajo na potrditev sodelavca.`);
  if (vrednosti.some((p) => p.izvor === IZVOR.POTREBUJEM_REGISTER))
    opozorila.push("Številke zastopnika v ponudbi ni — potrebujem vaš register zastopnikov.");

  return {
    zaporedna,
    polj: kljuci.length,
    polj_izpolnjenih: vrednosti.filter((p) => imaVrednost(p.vrednost)).length,
    polj_za_pregled: zaPregled,
    pripravljen_za_prenos: zaPregled === 0 && poimenovan,
    opozorila,
    polja,
  };
}

function buildPaket(packet, docs) {
  const p = packet && typeof packet === "object" ? packet : null;
  const status = strOrNull(p?.status);
  const izjema = strOrNull(p?.izjema);
  return {
    status,
    opis: status
      ? PAKET_OPIS[status] || "Stanja paketa ne prepoznam — potrebuje ročni pregled."
      : "Popolnost paketa ni bila preverjena.",
    razlog: strOrNull(p?.razlog),
    manjka: Array.isArray(p?.manjka) ? p.manjka.map(strOrNull).filter(Boolean) : [],
    izjema,
    izjema_opis: izjema ? IZJEMA_OPIS[izjema] ?? null : null,
    prenos_dovoljen:
      status && Object.prototype.hasOwnProperty.call(PRENOS_PO_STATUSU, status)
        ? PRENOS_PO_STATUSU[status]
        : null,
    dokumenti: (Array.isArray(docs) ? docs : []).map(mapDoc),
  };
}

/* ── the payload ─────────────────────────────────────────────────────────── */

/**
 * @param outputs  array of KLP cell maps from toKlp() — one per kontrolni list
 * @param docs     [{ klas, ime, tipZavarovalca?, kolektivno? }] the packet as classified
 * @param packet   result of checkPacket() — { status, razlog, manjka, izjema }
 * @param run      the run object; only its clock is read, and only if it kept one
 */
export function buildPayload({ outputs = [], docs = [], packet = null, run = null } = {}) {
  const listi = (Array.isArray(outputs) ? outputs : []).map((cells, i) => buildList(cells, i + 1));
  const dokumenti = Array.isArray(docs) ? docs : [];

  const zaRocniPregled = [];
  for (const l of listi)
    for (const [polje, p] of Object.entries(l.polja))
      if (p.potrebuje_potrditev)
        zaRocniPregled.push({
          kontrolni_list: l.zaporedna,
          polje,
          izvor: p.izvor,
          pojasnilo: p.pojasnilo,
        });

  const sum = (f) => listi.reduce((n, l) => n + l[f], 0);

  return {
    shema: SHEMA,
    opomba: OPOMBA,
    legenda_izvora: { ...IZVOR_OPIS },
    obdelava: {
      cas: new Date(runStartMs(run)).toISOString(),
      trajanje_sekund: runSekund(run),
      dokumentov: dokumenti.length,
      kontrolnih_listov: listi.length,
      polj_skupaj: sum("polj"),
      polj_izpolnjenih: sum("polj_izpolnjenih"),
      polj_za_pregled: sum("polj_za_pregled"),
    },
    paket: buildPaket(packet, dokumenti),
    kontrolni_listi: listi,
    za_rocni_pregled: zaRocniPregled,
  };
}

/**
 * Fixed prefix + timestamp. No name, no offer number, no document title — the filename is the one
 * part of this that shows up in a mail client's attachment strip, an IT ticket and a screen share.
 */
export function payloadFilename(run) {
  const d = new Date(runStartMs(run));
  const p = (n) => String(n).padStart(2, "0");
  const stamp =
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  return `edokumenti-predlog-${stamp}.json`;
}
