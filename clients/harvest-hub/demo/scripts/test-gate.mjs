/**
 * test-gate.mjs — scores lib/gate.js.
 *
 *   node scripts/test-gate.mjs
 *
 * No fixtures, no I/O, no client documents: the gate reasons about document CLASSES and counts
 * only, so this test contains no personal data of any kind and prints none. The Slovene
 * sentences echoed at the end are string constants out of gate.js, not values read from a file.
 */

import { checkPacket } from "../lib/gate.js";

/* ── harness ────────────────────────────────────────────────────────────── */

let pass = 0, fail = 0;

function ok(name, cond, detail = "") {
  if (cond) { pass++; console.log(`PASS  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? "  — " + detail : ""}`); }
}
function eq(name, actual, expected) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  ok(name, a === e, a === e ? "" : `dobil ${a}, pričakoval ${e}`);
}

/** Packets are built from classes only. `ime` is a neutral placeholder, never a real filename. */
const d = (klas, extra = {}) => Object.freeze({ klas, ...extra });
const PONUDBA = d("ponudba");
const PONUDBA_FIZICNA = d("ponudba", { tipZavarovalca: "fizicna" });
const PONUDBA_KOLEKTIVNA = d("ponudba", { tipZavarovalca: "pravna", kolektivno: true });
const CLEN545 = d("clen545");
const KLP = d("klp");
const PRIVOLITVENA = d("privolitvena");
const NEZNANO = d("neznano");
const NEBRANO = d("nebrano");

const run = (docs) => checkPacket({ docs });

/* ── 1. the full packet passes ──────────────────────────────────────────── */

{
  const r = run([PONUDBA, CLEN545, KLP, PRIVOLITVENA]);
  eq("poln paket (ponudba+clen545+klp+privolitvena) -> prehod", r.status, "prehod");
  eq("poln paket: nič ne manjka", r.manjka, []);
  eq("poln paket: brez izjeme", r.izjema, null);
  ok("poln paket: razlog je stavek", typeof r.razlog === "string" && r.razlog.length > 0);
}

/* ── 2. the 545 removed -> held, with a Slovene reason ──────────────────── */

{
  const r = run([PONUDBA, KLP, PRIVOLITVENA]);
  eq("brez clen545 -> zadrzano", r.status, "zadrzano");
  eq("brez clen545: manjka nosi oznako razreda", r.manjka, ["545. člen"]);
  eq("brez clen545: brez izjeme", r.izjema, null);
  ok("brez clen545: razlog je poveden slovenski stavek",
    typeof r.razlog === "string" && r.razlog.length > 30 && /\.$/.test(r.razlog)
      && r.razlog[0] === r.razlog[0].toLocaleUpperCase("sl"));
  ok("brez clen545: razlog imenuje manjkajoči dokument", r.razlog.includes("545. člen"));
}

/* ── 3. collective for a legal entity -> exception, NOT held ────────────── */

{
  const r = run([PONUDBA_KOLEKTIVNA, PONUDBA_KOLEKTIVNA, KLP]);
  eq("same kolektivne pravne osebe -> izjema", r.status, "izjema");
  ok("kolektivno: NI zadrzano", r.status !== "zadrzano");
  eq("kolektivno: oznaka izjeme", r.izjema, "kolektivno-pravna-oseba");
  eq("kolektivno: nič ne manjka", r.manjka, []);
  ok("kolektivno: razlog pojasni posebno pot",
    typeof r.razlog === "string" && r.razlog.includes("kolektivn"));
}

/* ── 4. mixed packet -> held, because the non-exempt ponudba needs it ───── */

{
  const r = run([PONUDBA_FIZICNA, PONUDBA_KOLEKTIVNA]);
  eq("mešan paket (fizična + kolektivna, brez clen545) -> zadrzano", r.status, "zadrzano");
  eq("mešan paket: manjka clen545", r.manjka, ["545. člen"]);
  eq("mešan paket: brez izjeme", r.izjema, null);
  ok("mešan paket: razlog pove, da ena ponudba dokument potrebuje",
    r.razlog.includes("Ena od ponudb"));
}

/* ── 5. no ponudba at all -> passes, nothing to gate ────────────────────── */

{
  const r = run([KLP, PRIVOLITVENA, NEZNANO, NEBRANO]);
  eq("brez ponudbe -> prehod", r.status, "prehod");
  eq("brez ponudbe: razlog je null", r.razlog, null);
  eq("brez ponudbe: nič ne manjka", r.manjka, []);
  eq("brez ponudbe: brez izjeme", r.izjema, null);
}

/* ── 6. degenerate input must not throw ─────────────────────────────────── */

for (const [name, arg] of [
  ["prazen paket", { docs: [] }],
  ["docs manjka", {}],
  ["brez argumenta", undefined],
  ["docs = null", { docs: null }],
  ["docs ni seznam", { docs: "ponudba" }],
  ["seznam z luknjami", { docs: [null, undefined, PONUDBA, CLEN545] }],
  ["dokument brez razreda", { docs: [{}, PONUDBA, CLEN545] }],
]) {
  let r = null, threw = null;
  try { r = arg === undefined ? checkPacket() : checkPacket(arg); } catch (e) { threw = e; }
  ok(`${name}: ne vrže napake`, threw === null, threw && threw.message);
  ok(`${name}: vrne veljaven status`,
    r !== null && ["prehod", "zadrzano", "izjema"].includes(r.status), r && r.status);
}
eq("prazen paket -> prehod, razlog null", (({ status, razlog }) => ({ status, razlog }))(run([])),
  { status: "prehod", razlog: null });
eq("seznam z luknjami se ne šteje kot dokument", run([null, undefined, PONUDBA, CLEN545]).status, "prehod");

/* ── 7. the exception needs BOTH signals, explicitly ────────────────────── */

{
  eq("kolektivno brez tipa zavarovalca -> zadrzano",
    run([d("ponudba", { kolektivno: true })]).status, "zadrzano");
  eq("pravna oseba brez kolektivnega -> zadrzano",
    run([d("ponudba", { tipZavarovalca: "pravna" })]).status, "zadrzano");
  eq("kolektivno + fizična oseba -> zadrzano",
    run([d("ponudba", { tipZavarovalca: "fizicna", kolektivno: true })]).status, "zadrzano");
  eq("ponudba brez oznak -> zadrzano",
    run([PONUDBA]).status, "zadrzano");
  eq("kolektivno + pravna -> izjema",
    run([PONUDBA_KOLEKTIVNA]).status, "izjema");
  eq("kolektivna pravna oseba S priloženim clen545 -> prehod",
    run([PONUDBA_KOLEKTIVNA, CLEN545]).status, "prehod");
}

/* ── 8. shape of the answer is stable ───────────────────────────────────── */

for (const [name, docs] of [
  ["prehod", [PONUDBA, CLEN545]],
  ["zadrzano", [PONUDBA]],
  ["izjema", [PONUDBA_KOLEKTIVNA]],
  ["prazen", []],
]) {
  const r = run(docs);
  eq(`${name}: štirje ključi`, Object.keys(r).sort(), ["izjema", "manjka", "razlog", "status"]);
  ok(`${name}: manjka je seznam`, Array.isArray(r.manjka));
  ok(`${name}: izjema je oznaka ali null`,
    r.izjema === null || r.izjema === "kolektivno-pravna-oseba");
}

/* ── 9. slovenska števila: ena, dve, tri, pet ───────────────────────────── */

{
  const rz = (n) => run(Array.from({ length: n }, () => PONUDBA)).razlog;
  ok("1 ponudba: 'je ponudba'", rz(1).includes("V paketu je ponudba,"), rz(1));
  ok("2 ponudbi: dvojina 'sta 2 ponudbi'", rz(2).includes("V paketu sta 2 ponudbi,"), rz(2));
  ok("3 ponudbe: 'so 3 ponudbe'", rz(3).includes("V paketu so 3 ponudbe,"), rz(3));
  ok("5 ponudb: 'je 5 ponudb'", rz(5).includes("V paketu je 5 ponudb,"), rz(5));
  ok("1 ponudba: zadržim ponudbo", rz(1).includes("Ponudbo zadržim"), rz(1));
  ok("2 ponudbi: zadržim paket", rz(2).includes("Paket zadržim"), rz(2));
  ok("prehod, 1 ponudba: 'ponudbe ne zadržim'",
    run([PONUDBA, CLEN545]).razlog.endsWith("ponudbe ne zadržim."));
  ok("prehod, 2 ponudbi: 'ponudb ne zadržim'",
    run([PONUDBA, PONUDBA, CLEN545]).razlog.endsWith("ponudb ne zadržim."));
}

/* ── 10. nothing technical, and no filename, reaches the screen ─────────── */

{
  // Internal words, machine values and money must never appear in a razlog.
  const PREPOVEDANO = [
    "klas", "status", "prehod", "zadrzano", "izjema", "clen545", "null", "undefined",
    "true", "false", "JSON", "API", "payload", "pravilo", "register", "UNMAPPED",
    "vision", "track", "tir", "€", "EUR", "%", "{", "}", "_",
  ];
  const paketi = [
    [PONUDBA, CLEN545], [PONUDBA], [PONUDBA, PONUDBA], [PONUDBA, PONUDBA, PONUDBA],
    [PONUDBA_KOLEKTIVNA], [PONUDBA_KOLEKTIVNA, PONUDBA_KOLEKTIVNA],
    [PONUDBA_FIZICNA, PONUDBA_KOLEKTIVNA],
    [PONUDBA_FIZICNA, PONUDBA_FIZICNA, PONUDBA_KOLEKTIVNA],
  ];
  let cist = true, krivec = "";
  for (const p of paketi) {
    const t = run(p).razlog || "";
    for (const w of PREPOVEDANO) {
      if (t.toLowerCase().includes(w.toLowerCase())) { cist = false; krivec = w; }
    }
  }
  ok(`vseh ${paketi.length} razlogov je brez internih besed in brez denarja`, cist,
    krivec && `najdena beseda: ${krivec}`);

  // A filename can carry a client's name. It must never be interpolated into the sentence.
  const r = run([d("ponudba", { ime: "vzorec-1.pdf" }), d("klp", { ime: "vzorec-2.pdf" })]);
  ok("ime datoteke ne pride v razlog", !r.razlog.includes("vzorec") && !r.razlog.includes(".pdf"));
}

/* ── 11. purity: the caller's packet is never touched ───────────────────── */

{
  const docs = [{ klas: "ponudba", tipZavarovalca: "fizicna" }, { klas: "klp" }];
  const before = JSON.stringify(docs);
  const a = run(docs), b = run(docs);
  ok("vhod ostane nespremenjen", JSON.stringify(docs) === before);
  eq("dvakratni klic vrne isto", a, b);
  ok("zamrznjeni dokumenti ne sprožijo napake", run([PONUDBA, CLEN545]).status === "prehod");
}

/* ── screen copy, for review ────────────────────────────────────────────── */

console.log("\nBesedila, ki jih vidi stranka (iz konstant v gate.js):");
for (const [oznaka, docs] of [
  ["prehod   ", [PONUDBA, CLEN545]],
  ["zadrzano ", [PONUDBA]],
  ["zadrzano ", [PONUDBA, PONUDBA]],
  ["zadrzano ", [PONUDBA_FIZICNA, PONUDBA_KOLEKTIVNA]],
  ["izjema   ", [PONUDBA_KOLEKTIVNA]],
  ["prehod   ", [KLP]],
]) {
  console.log(`  ${oznaka} ${run(docs).razlog ?? "(brez razloga)"}`);
}

console.log(`\n${fail === 0 ? "PASS" : "FAIL"}  gate.js — ${pass} od ${pass + fail} preverjanj`);
process.exit(fail === 0 ? 0 : 1);
