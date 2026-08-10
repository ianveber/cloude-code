/**
 * test-edokumenti.mjs — pins lib/edokumenti.js against the REAL extractor.
 *
 *   node scripts/test-edokumenti.mjs
 *
 * The cells are produced by toKlp() from lib/extract.js, not hand-written, so the payload cannot
 * drift away from the extractor: change the cell shape and this test fails here first.
 *
 * PRIVACY: this file drives the extractor with obviously synthetic input, and it prints CLASS NAMES
 * AND COUNTS ONLY. No field value and no person's name is ever written to stdout — the same rule
 * the on-screen run log obeys, applied to the terminal.
 */

import { toKlp, holderCells, KLP_FIELDS } from "../lib/extract.js";
import { buildPayload, payloadFilename, SHEMA } from "../lib/edokumenti.js";

/* ── harness ─────────────────────────────────────────────────────────────── */

let pass = 0, fail = 0;
const ok = (cond, name) => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}`); }
};
const section = (t) => console.log(`\n${t}`);

/** Structural equality INCLUDING key order — a round-trip must not reshuffle anything. */
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return false;
  for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
  return true;
}

/**
 * Paths whose value JSON cannot carry faithfully: undefined (silently dropped by stringify),
 * NaN/Infinity (become null), Date/Map/Set/class instances (become something else).
 * Returns PATHS ONLY — never a value.
 */
function jsonImpurities(v, path = "$", out = []) {
  if (v === undefined) { out.push(path); return out; }
  if (v === null) return out;
  const t = typeof v;
  if (t === "string" || t === "boolean") return out;
  if (t === "number") { if (!Number.isFinite(v)) out.push(path); return out; }
  if (t !== "object") { out.push(path); return out; }
  if (Array.isArray(v)) { v.forEach((x, i) => jsonImpurities(x, `${path}[${i}]`, out)); return out; }
  const proto = Object.getPrototypeOf(v);
  if (proto !== Object.prototype && proto !== null) { out.push(path); return out; }
  for (const [k, x] of Object.entries(v)) jsonImpurities(x, `${path}.${k}`, out);
  return out;
}

/** Independent oracle for provenance — written from the cell contract, not from the module. */
function pricakovanIzvor(cell) {
  const has = cell?.value != null && String(cell.value).trim() !== "";
  if (cell?.state === "UNMAPPED") return "potrebujem_register";
  if (cell?.source === "register" && !has) return "potrebujem_register";
  if (!has) return "ni_podatka";
  if (cell.source === "ponudba") return "iz_ponudbe";
  if (cell.source === "register") return "iz_registra";
  return "za_potrditev";
}

/** Every string leaf in the payload — used to prove none of them leaked into the filename. */
function stringLeaves(v, out = []) {
  if (typeof v === "string") { out.push(v); return out; }
  if (v && typeof v === "object") for (const x of Object.values(v)) stringLeaves(x, out);
  return out;
}

const tally = (payload, field) => {
  const t = {};
  for (const l of payload.kontrolni_listi)
    for (const p of Object.values(l.polja)) t[p[field]] = (t[p[field]] || 0) + 1;
  return t;
};

/* ── synthetic input, shaped exactly like the model's JSON (SCHEMA_HINT) ──── */

const RAW_ENA = {
  vrsta_dokumenta: "ponudba",
  tip_zavarovalca: "fizicna",
  zavarovalec: {
    ime: "VZOREC ZAVAROVALEC",
    naslov: "VZORCNA ULICA 1, 1000 LJUBLJANA, SLOVENIJA",
    telefon: "01 000 00 00",
    email: "VZOREC@PRIMER.INVALID",
  },
  // named insured, but with no own address/phone/e-mail -> three inherited cells
  zavarovanec: { ime: "VZOREC ZAVAROVANEC", naslov: null, telefon: null, email: null },
  zavarovani_otroci: [],
  st_ponudbe: { vrednost: "330009276", oznaka: "Številka ponudbe" },
  // AZN licence, not the NNN-NNNN internal number -> the agent number stays UNMAPPED
  zastopnik: { ime: "Vzorka Zastopnica", licenca: "30220-1022/06-4" },
};

const RAW_OTROKA = {
  ...RAW_ENA,
  zavarovanec: { ime: null, naslov: null, telefon: null, email: null },
  zavarovani_otroci: [
    { ime: "VZOREC OTROKPRVI", naslov: null, telefon: null, email: null },
    { ime: "VZOREC OTROKDRUGI", naslov: null, telefon: null, email: null },
  ],
};

// collective policy: nobody is named as insured
const RAW_KOLEKTIVNO = {
  ...RAW_ENA,
  tip_zavarovalca: "pravna",
  zavarovalec: { ...RAW_ENA.zavarovalec, ime: "VZOREC PODJETJE d.o.o." },
  zavarovanec: { ime: null, naslov: null, telefon: null, email: null },
  zavarovani_otroci: [],
};

// invertAgentName turns 'Vzorka Zastopnica' into 'Zastopnica Vzorka'
const REGISTER = { "Zastopnica Vzorka": "220-1044" };

const RUN = { zacetek: Date.parse("2026-07-30T09:14:05+02:00"), konec: Date.parse("2026-07-30T09:14:17.400+02:00") };

const DOCS_POLN = [
  { klas: "ponudba", ime: "vzorec-ponudba.pdf", tipZavarovalca: "fizicna", kolektivno: false },
  { klas: "clen545", ime: "vzorec-545.pdf" },
  { klas: "privolitvena", ime: "vzorec-privolitvena.pdf" },
];
const PAKET_PREHOD = { status: "prehod", razlog: null, manjka: [], izjema: null };
const PAKET_ZADRZAN = {
  status: "zadrzano",
  razlog: "V paketu je ponudba brez dokumenta 545. člen.",
  manjka: ["545. člen"],
  izjema: null,
};
const PAKET_IZJEMA = {
  status: "izjema", razlog: null, manjka: [], izjema: "kolektivno-pravna-oseba",
};

/* ── 1. provenance survives, for every field ─────────────────────────────── */

section("Provenance");

const outputsEna = toKlp(RAW_ENA);
const pEna = buildPayload({ outputs: outputsEna, docs: DOCS_POLN, packet: PAKET_PREHOD, run: RUN });

ok(SHEMA === "0.1-predlog", "shema is the proposal marker");
ok(typeof pEna.opomba === "string" && /eDOKUMENT/i.test(pEna.opomba) && /Faz[ie] 0/i.test(pEna.opomba),
  "top level names eDOKUMENTI and Phase 0 as the confirmation point");

const listEna = pEna.kontrolni_listi[0];
ok(KLP_FIELDS.every((f) => f in listEna.polja), `all ${KLP_FIELDS.length} KLP fields present in the payload`);
ok(KLP_FIELDS.every((f, i) => Object.keys(listEna.polja)[i] === f), "fields keep the extractor's order");

let izvorOk = 0, izvorBad = 0;
for (const f of KLP_FIELDS) {
  const want = pricakovanIzvor(outputsEna[0][f]);
  const got = listEna.polja[f]?.izvor;
  if (want === got) izvorOk++; else { izvorBad++; console.log(`        mismatch on field: ${f}`); }
}
ok(izvorBad === 0, `provenance matches the cell for every field  (${izvorOk}/${KLP_FIELDS.length})`);
ok(Object.values(listEna.polja).every((p) => typeof p.opis_izvora === "string" && p.opis_izvora.length > 0),
  "every field carries a plain-Slovene description of its provenance");

// named oracles — the classes the demo actually depends on
ok(listEna.polja["zavarovalec.ime_priimek"].izvor === "iz_ponudbe", "read from the offer -> iz_ponudbe");
ok(listEna.polja["zavarovanec.telefon"].izvor === "za_potrditev", "inherited from the holder -> za_potrditev");
ok(listEna.polja["zavarovanec.telefon"].potrebuje_potrditev === true, "inherited value is marked as needing a human");
ok(listEna.polja["zastopnik_2.ime_priimek"].izvor === "ni_podatka", "absent field -> ni_podatka");
ok(listEna.polja["zastopnik_2.ime_priimek"].potrebuje_potrditev === false, "absent field does not fake a review task");

console.log(`        classes present: ${JSON.stringify(tally(pEna, "izvor"))}`);

/* ── 2. UNMAPPED is explicit, never omitted ──────────────────────────────── */

section("UNMAPPED");

const unmapped = outputsEna[0]["zastopnik_1.stevilka"];
ok(unmapped.state === "UNMAPPED", "the extractor still produces an UNMAPPED agent number (fixture is honest)");

const cellUnmapped = listEna.polja["zastopnik_1.stevilka"];
ok(cellUnmapped !== undefined, "UNMAPPED field is present, not omitted");
ok(cellUnmapped.vrednost === null, "UNMAPPED field carries no invented value");
ok(cellUnmapped.izvor === "potrebujem_register", "UNMAPPED field -> potrebujem_register");
ok(cellUnmapped.potrebuje_potrditev === true, "UNMAPPED field is flagged as needing a human");
ok(typeof cellUnmapped.pojasnilo === "string" && cellUnmapped.pojasnilo.length > 0,
  "UNMAPPED field states why, in Slovene");
ok(cellUnmapped.dodatno !== null && "licenca_iz_ponudbe" in cellUnmapped.dodatno,
  "what WAS found in the offer travels with it");
ok(pEna.za_rocni_pregled.some((r) => r.polje === "zastopnik_1.stevilka" && r.kontrolni_list === 1),
  "UNMAPPED field appears in the human worklist");
ok(pEna.za_rocni_pregled.length === pEna.obdelava.polj_za_pregled,
  `worklist and counter agree  (${pEna.za_rocni_pregled.length})`);
ok(listEna.pripravljen_za_prenos === false, "a list with open questions is not marked ready to transfer");
ok(listEna.opozorila.length === 2, `list warnings raised: ${listEna.opozorila.length}`);

// the same field, once the register is loaded
const pRegister = buildPayload({ outputs: toKlp(RAW_ENA, { register: REGISTER }), docs: DOCS_POLN, packet: PAKET_PREHOD, run: RUN });
const cellRegister = pRegister.kontrolni_listi[0].polja["zastopnik_1.stevilka"];
ok(cellRegister.izvor === "iz_registra", "with the register loaded -> iz_registra");
ok(cellRegister.potrebuje_potrditev === false, "resolved agent number no longer needs a human");
ok(pRegister.obdelava.polj_za_pregled < pEna.obdelava.polj_za_pregled,
  `register reduces the review count  (${pEna.obdelava.polj_za_pregled} -> ${pRegister.obdelava.polj_za_pregled})`);

// a field the extractor might grow later must not vanish
const pExtra = buildPayload({ outputs: [{ ...outputsEna[0], "zavarovalna_doba": { value: "15 let", source: "ponudba" } }] });
ok("zavarovalna_doba" in pExtra.kontrolni_listi[0].polja, "an unknown extra field is carried, not dropped");

/* ── 3. filename carries no personal data ────────────────────────────────── */

section("Filename");

const fn = payloadFilename(RUN);
ok(/^edokumenti-predlog-\d{4}-\d{2}-\d{2}-\d{6}\.json$/.test(fn), "filename is prefix + timestamp only");
ok(payloadFilename(RUN) === fn, "filename is stable for the same run");

const leaves = stringLeaves(pEna).filter((s) => s.length >= 3);
const leaked = leaves.filter((s) => fn.toLowerCase().includes(s.toLowerCase()));
ok(leaked.length === 0, `no payload string appears in the filename  (${leaves.length} strings checked)`);
ok(!/[A-Za-zČŠŽčšž]/.test(fn.replace(/^edokumenti-predlog-/, "").replace(/\.json$/, "")),
  "the variable part of the filename is digits only");
ok(typeof payloadFilename(null) === "string" && payloadFilename(null).endsWith(".json"),
  "filename still works without a run");

/* ── 4. JSON round-trip ──────────────────────────────────────────────────── */

section("JSON round-trip");

for (const [name, payload] of [
  ["single", pEna],
  ["register", pRegister],
  ["held packet", buildPayload({ outputs: outputsEna, docs: [DOCS_POLN[0]], packet: PAKET_ZADRZAN, run: RUN })],
  ["no packet, no run", buildPayload({ outputs: outputsEna })],
  ["empty run", buildPayload({})],
]) {
  const impure = jsonImpurities(payload);
  if (impure.length) console.log(`        impure paths: ${impure.join(", ")}`);
  ok(impure.length === 0, `${name}: every value is JSON-native`);
  const back = JSON.parse(JSON.stringify(payload));
  ok(deepEqual(payload, back), `${name}: survives stringify/parse unchanged (keys and order)`);
}

/* ── 5. children fan out to one entry per kontrolni list ─────────────────── */

section("Multi-insured");

const outputsOtroka = toKlp(RAW_OTROKA);
ok(outputsOtroka.length === 2, `the extractor fans out to ${outputsOtroka.length} kontrolna lista`);

const pOtroka = buildPayload({ outputs: outputsOtroka, docs: DOCS_POLN, packet: PAKET_PREHOD, run: RUN });
ok(pOtroka.kontrolni_listi.length === 2, "payload carries one entry per kontrolni list");
ok(pOtroka.obdelava.kontrolnih_listov === 2, "the counter agrees");
ok(pOtroka.kontrolni_listi.map((l) => l.zaporedna).join(",") === "1,2", "lists are numbered 1..n");

const [a, b] = pOtroka.kontrolni_listi;
ok(a.polja["zavarovanec.ime_priimek"].vrednost !== b.polja["zavarovanec.ime_priimek"].vrednost,
  "the two lists hold different insured persons");
ok(a.polja["zavarovalec.ime_priimek"].vrednost === b.polja["zavarovalec.ime_priimek"].vrednost,
  "both lists share the one policyholder");
ok(pOtroka.obdelava.polj_skupaj === 2 * KLP_FIELDS.length,
  `field count scales with the lists  (${pOtroka.obdelava.polj_skupaj})`);
ok(pOtroka.za_rocni_pregled.filter((r) => r.kontrolni_list === 2).length > 0,
  "the second list has its own review entries");

/* ── 6. the packet gate travels with the payload ─────────────────────────── */

section("Packet");

const pHeld = buildPayload({ outputs: outputsEna, docs: [DOCS_POLN[0]], packet: PAKET_ZADRZAN, run: RUN });
ok(pHeld.paket.status === "zadrzano", "held packet keeps its status");
ok(pHeld.paket.prenos_dovoljen === false, "a held packet is not cleared for transfer");
ok(pHeld.paket.manjka.length === 1, `missing document labels carried through  (${pHeld.paket.manjka.length})`);
ok(typeof pHeld.paket.razlog === "string" && pHeld.paket.razlog.length > 0, "the hold states a reason");

/**
 * The collective legal-entity policy names NOBODY as insured, so it produces no kontrolni list
 * at all — not a half-filled one. Emitting one had the counter card and the packet list claim a
 * produced document while the card beside them refused to complete it, and it disagreed with
 * truth.json, which records klp_count 0 for exactly this document.
 */
const outputsKolektivno = toKlp(RAW_KOLEKTIVNO);
ok(outputsKolektivno.length === 0,
  `a policy with nobody named produces no kontrolni list  (${outputsKolektivno.length})`);

const pIzjema = buildPayload({ outputs: outputsKolektivno, docs: DOCS_POLN, packet: PAKET_IZJEMA, run: RUN });
ok(pIzjema.paket.prenos_dovoljen === true, "the collective/legal-entity exception is not a hold");
ok(typeof pIzjema.paket.izjema_opis === "string", "the exception is explained in Slovene");
ok(pIzjema.kontrolni_listi.length === 0 && pIzjema.obdelava.kontrolnih_listov === 0,
  "the payload reports zero kontrolni listi, matching the screen and truth.json");
ok(pIzjema.paket.dokumenti.length === DOCS_POLN.length,
  "the document itself is still listed in the packet — nothing vanishes");

// holderCells() is what the screen shows for such a document: everything read except the
// ZAVAROVANEC column. It is NOT a kontrolni list, but the payload must still treat it honestly
// if it is ever handed one.
const pNepoimenovan = buildPayload({ outputs: [holderCells(RAW_KOLEKTIVNO)] });
ok(pNepoimenovan.kontrolni_listi[0].pripravljen_za_prenos === false,
  "a list with nobody named is never ready to transfer");
ok(pNepoimenovan.kontrolni_listi[0].opozorila.length > 0,
  `the unnamed insured is surfaced as a warning  (${pNepoimenovan.kontrolni_listi[0].opozorila.length})`);
ok(pNepoimenovan.kontrolni_listi[0].polja["zavarovalec.ime_priimek"].vrednost === "VZOREC PODJETJE d.o.o.",
  "what WAS read from the document survives — the legal-entity Naziv, verbatim");

const pNoGate = buildPayload({ outputs: outputsEna, docs: DOCS_POLN });
ok(pNoGate.paket.status === null && pNoGate.paket.prenos_dovoljen === null,
  "no gate result means unknown, not approved");
ok(pNoGate.paket.dokumenti.length === DOCS_POLN.length,
  `document classes recorded: ${JSON.stringify(pNoGate.paket.dokumenti.map((d) => d.vrsta))}`);

/* ── 7. house rules ──────────────────────────────────────────────────────── */

section("House rules");

const allStrings = stringLeaves(pEna).concat(stringLeaves(pHeld), stringLeaves(pIzjema));
ok(!allStrings.some((s) => /€|EUR\b|\bcen[ai]\b|strošek/i.test(s)), "no money anywhere in the payload");
ok(pEna.obdelava.trajanje_sekund === 12.4, "measured duration comes from the run, in seconds");
ok(buildPayload({ outputs: outputsEna }).obdelava.trajanje_sekund === null,
  "an unmeasured run reports no duration rather than a guess");
ok(typeof pEna.obdelava.cas === "string" && !Number.isNaN(Date.parse(pEna.obdelava.cas)),
  "the payload is timestamped");
ok(Object.keys(pEna.legenda_izvora).length === 5, "the file explains its own provenance vocabulary");

/* ── 8. interop with the modules that actually feed this payload ─────────── */

section("Interop");

// runstats.js and gate.js are owned elsewhere. Imported dynamically so that a change over there
// shows up as a loud failure here rather than taking the whole suite down at load time.
try {
  const { newRun, noteDoc, summary } = await import("../lib/runstats.js");
  const { checkPacket } = await import("../lib/gate.js");

  const run = newRun();
  noteDoc(run, { klas: "ponudba", scanned: false, ms: 4200, outputs: outputsEna });
  noteDoc(run, { klas: "ponudba", scanned: false, ms: 8200, outputs: outputsOtroka });
  noteDoc(run, { klas: "clen545", scanned: false, ms: 300, outputs: [] });
  const s = summary(run);

  const docsRun = [
    { klas: "ponudba", ime: "vzorec-a.pdf" },
    { klas: "ponudba", ime: "vzorec-b.pdf" },
    { klas: "clen545", ime: "vzorec-c.pdf" },
  ];
  const pRun = buildPayload({
    outputs: [...outputsEna, ...outputsOtroka],
    docs: docsRun,
    packet: checkPacket({ docs: docsRun }),
    run,
  });

  ok(pRun.obdelava.trajanje_sekund === s.sekund,
    `duration read off a real run  (${pRun.obdelava.trajanje_sekund}s)`);
  ok(pRun.obdelava.kontrolnih_listov === s.kontrolnihListov,
    `kontrolni list count agrees with the counter card  (${s.kontrolnihListov})`);
  ok(pRun.obdelava.polj_skupaj === s.poljSkupaj, `field total agrees  (${s.poljSkupaj})`);
  ok(pRun.obdelava.polj_izpolnjenih === s.poljIzpolnjenih, `filled count agrees  (${s.poljIzpolnjenih})`);
  // two independent implementations of "this needs a human" must not disagree
  ok(pRun.obdelava.polj_za_pregled === s.poljZaPotrditev,
    `review count agrees with the counter card  (${s.poljZaPotrditev})`);

  ok(pRun.paket.status === "prehod" && pRun.paket.prenos_dovoljen === true,
    "a complete packet clears the gate and the payload says so");

  const held = checkPacket({ docs: [{ klas: "ponudba", ime: "vzorec-a.pdf" }] });
  const pHeldReal = buildPayload({ outputs: outputsEna, docs: [{ klas: "ponudba", ime: "vzorec-a.pdf" }], packet: held, run });
  ok(pHeldReal.paket.status === "zadrzano" && pHeldReal.paket.prenos_dovoljen === false,
    "a real gate hold blocks transfer in the payload");
  ok(pHeldReal.paket.manjka.length === held.manjka.length && pHeldReal.paket.manjka[0] === held.manjka[0],
    `the gate's missing-document label travels verbatim  (${pHeldReal.paket.manjka.length})`);
  ok(jsonImpurities(pRun).length === 0 && deepEqual(pRun, JSON.parse(JSON.stringify(pRun))),
    "a payload built from real run + gate output still round-trips");
} catch (e) {
  ok(false, `interop with runstats.js / gate.js  (${e?.code || e?.name || "failed"})`);
}

/* ── result ──────────────────────────────────────────────────────────────── */

console.log("\n" + "─".repeat(66));
console.log(`  ${pass} PASS   ${fail} FAIL`);
console.log("─".repeat(66));
process.exit(fail ? 1 : 0);
