/**
 * test-runstats.mjs — pins lib/runstats.js.
 *
 *   node scripts/test-runstats.mjs
 *
 * PRIVACY: this test builds synthetic cells only. It prints class names, counts and time
 * figures — never a field value and never a person's name. Do not add a real sample here.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KLP_FIELDS } from "../lib/extract.js";
import { newRun, noteDoc, summary, ROI_KORAKI, roiSummary, PONUDB_NA_MESEC } from "../lib/runstats.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) fails += 1; };
const eq = (got, want, msg) => ok(Object.is(got, want), `${msg} — dobil ${JSON.stringify(got)}, pričakoval ${JSON.stringify(want)}`);
const head = (t) => console.log(`\n── ${t} ──`);

/* ── synthetic KLP cells: shapes only, no values that mean anything ───────── */

const V = "x";  // stand-in for any real value; never a name, never an address

/**
 * @param empty     fields with no value at all
 * @param pravilo   fields we derived rather than read (amber, needs a human)
 * @param unmapped  fields that need an external lookup we do not have (amber, no value)
 */
function makeOutput({ empty = [], pravilo = [], unmapped = [] } = {}) {
  const out = {};
  for (const f of KLP_FIELDS) {
    if (empty.includes(f)) out[f] = { value: null, source: null };
    else if (pravilo.includes(f)) out[f] = { value: V, source: "pravilo", razlog: "podedovano" };
    else if (unmapped.includes(f)) out[f] = { value: null, source: "register", state: "UNMAPPED" };
    else out[f] = { value: V, source: "ponudba" };
  }
  return out;
}

const F = {
  zavNaslov: "zavarovanec.naslov_posta_kraj",
  zavTel: "zavarovanec.telefon",
  zavMail: "zavarovanec.email",
  agentNo: "zastopnik_1.stevilka",
  agent2: "zastopnik_2.ime_priimek",
  agent2No: "zastopnik_2.stevilka",
};

/* ── 1. a mixed run: text + scan + unrecognised ───────────────────────────── */

head("mešan zagon — besedilo, skenirano, neprepoznano");

const run = newRun();

// one ponudba read from text: 3 fields derived, 1 needing the register, 2 genuinely absent
const a = makeOutput({
  pravilo: [F.zavNaslov, F.zavTel, F.zavMail],
  unmapped: [F.agentNo],
  empty: [F.agent2, F.agent2No],
});
noteDoc(run, { klas: "ponudba", scanned: false, ms: 4200, outputs: [a] });

// one scanned ponudba that fans out into two kontrolna lista, everything read
noteDoc(run, { klas: "ponudba", scanned: true, ms: 9100, outputs: [makeOutput(), makeOutput()] });

// supporting documents produce no kontrolni list
noteDoc(run, { klas: "clen545", scanned: false, ms: 700 });
noteDoc(run, { klas: "neznano", scanned: false, ms: 500, outputs: [] });
// class 'nebrano' must count as scanned even when the caller forgets the flag
noteDoc(run, { klas: "nebrano", ms: 300 });

const s = summary(run);

eq(s.dokumentov, 5, "dokumentov");
eq(s.skeniranih, 2, "skeniranih (eno skenirano + eno nebrano)");
eq(s.besedilnih, 3, "besedilnih");
ok(s.besedilnih + s.skeniranih + s.neberljivih === s.dokumentov,
   "besedilnih + skeniranih + neberljivih = dokumentov");
eq(s.neprepoznanih, 1, "neprepoznanih");
eq(s.neberljivih, 0, "neberljivih");
eq(s.neuspelih, 0, "neuspelih");
eq(s.kontrolnihListov, 3, "kontrolnih listov (1 + 2)");
eq(s.poljSkupaj, 3 * KLP_FIELDS.length, "polj skupaj = 3 lista x nabor polj");
eq(s.poljIzpolnjenih, (KLP_FIELDS.length - 3) + 2 * KLP_FIELDS.length, "polj izpolnjenih");
eq(s.poljZaPotrditev, 4, "polj za potrditev (3 podedovana + 1 iz registra)");
eq(s.sekund, 14.8, "sekund");
ok(s.poljIzpolnjenih <= s.poljSkupaj, "izpolnjenih ne more preseči skupnih");

eq(Object.keys(s).length, 11, "summary vrne točno 11 ključev");

/* A failed read and an unopenable file are counted, and neither is allowed to hide inside
   "z besedilnim slojem". The counter card used to show "0 za ročni pregled" above rows that
   said branja ni bilo mogoče dokončati. */
head("neuspela branja in datoteke, ki jih ni mogoče odpreti");

const runF = newRun();
noteDoc(runF, { klas: "ponudba", ms: 1000, outputs: [makeOutput()] });
noteDoc(runF, { klas: "nebrano", ms: 2000, outputs: [], napaka: true });      // scan, read failed
noteDoc(runF, { klas: "neznano", ms: 50, outputs: [], neberljiv: true });     // could not be opened
const f = summary(runF);

eq(f.dokumentov, 3, "dokumentov");
eq(f.neuspelih, 1, "neuspelih (branje se ni dokončalo)");
eq(f.neberljivih, 1, "neberljivih (datoteke ni bilo mogoče odpreti)");
eq(f.skeniranih, 1, "neberljiva datoteka se ne šteje med skenirane");
eq(f.besedilnih, 1, "neberljiva datoteka se ne šteje niti med besedilne");
eq(f.kontrolnihListov, 1, "neuspelo branje ne prispeva kontrolnega lista");

/* ── 2. the field counts follow the cells, not a constant ─────────────────── */

head("polja se štejejo iz celic");

const runB = newRun();
noteDoc(runB, { klas: "ponudba", ms: 1000, outputs: [makeOutput({ pravilo: [F.zavNaslov, F.zavTel, F.zavMail, F.agentNo, F.agent2] })] });
const b = summary(runB);

ok(b.poljZaPotrditev === 5 && b.poljZaPotrditev !== s.poljZaPotrditev,
  "iste število dokumentov, druge celice -> drugo število za potrditev");
eq(b.poljIzpolnjenih, KLP_FIELDS.length, "izpolnjena tudi podedovana polja (imajo vrednost)");

const runC = newRun();
noteDoc(runC, { klas: "ponudba", ms: 1000, outputs: [makeOutput({ empty: KLP_FIELDS })] });
const c = summary(runC);
eq(c.poljIzpolnjenih, 0, "prazen list -> 0 izpolnjenih");
eq(c.poljZaPotrditev, 0, "prazen list brez oznak -> 0 za potrditev");
eq(c.poljSkupaj, KLP_FIELDS.length, "prazen list še vedno šteje cel nabor polj");

// a partial output must not shrink the denominator
const runD = newRun();
noteDoc(runD, { klas: "ponudba", ms: 1000, outputs: [{ [KLP_FIELDS[0]]: { value: V, source: "ponudba" } }] });
const d = summary(runD);
eq(d.poljSkupaj, KLP_FIELDS.length, "delen list ne skrči imenovalca");
eq(d.poljIzpolnjenih, 1, "delen list -> 1 izpolnjeno");

/* ── 3. an empty run returns zeroes and never divides by zero ─────────────── */

head("prazen zagon");

const zero = summary(newRun());
for (const [k, v] of Object.entries(zero)) {
  ok(v === 0, `${k} = 0`);
  ok(Number.isFinite(v), `${k} je končno število`);
}
ok(Number.isFinite(summary(undefined).sekund), "summary(undefined) ne pade in vrne končno število");
eq(summary({}).dokumentov, 0, "summary({}) = 0 dokumentov");

const roiZero = roiSummary({ minutePoKoraku: {}, strojnoSekund: 0, stDokumentov: 0 });
eq(roiZero.strojnoSekundNaPonudbo, 0, "0 dokumentov -> 0 sekund na ponudbo (brez deljenja z nič)");
eq(roiZero.rocnoMinutNaPonudbo, 0, "brez vnosa -> 0 ročnih minut");
eq(roiZero.vneseno, false, "brez vnosa -> vneseno = false");
eq(roiZero.prihranekMinutNaPonudbo, 0, "brez vnosa -> prihranek 0, nikoli negativen");
eq(roiSummary().prihranekUrLetno, 0, "roiSummary() brez argumentov ne pade");
eq(roiSummary({ strojnoSekund: 66.6, stDokumentov: 0 }).strojnoSekundNaPonudbo, 0,
  "sekunde brez dokumentov -> 0, ne Infinity");

/* ── 4. the six steps default to zero ─────────────────────────────────────── */

head("šest korakov");

eq(ROI_KORAKI.length, 6, "šest korakov");
ok(ROI_KORAKI.every((k) => k.privzetoMinut === 0), "vsi privzeti časi so 0 — nič ne ugibamo namesto stranke");
ok(new Set(ROI_KORAKI.map((k) => k.id)).size === 6, "id-ji so unikatni");
ok(ROI_KORAKI.every((k) => typeof k.naslov === "string" && k.naslov.trim().length > 3), "vsak korak ima naslov");

/* ── 5. only time, never money ────────────────────────────────────────────── */

head("samo čas, nikoli denar");

const DENAR = /(eur|€|\$|usd|cen[aeiu]|stro[sš]|denar|pla[cč]il|znesek|tarif|money|cost|price|budget|invoice|racun|račun)/i;

function scanForMoney(node, trail = "roi") {
  if (node == null) return [];
  if (Array.isArray(node)) return node.flatMap((v, i) => scanForMoney(v, `${trail}[${i}]`));
  if (typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) =>
      (DENAR.test(k) ? [`${trail}.${k} (ključ)`] : []).concat(scanForMoney(v, `${trail}.${k}`)));
  }
  if (typeof node === "string") return DENAR.test(node) ? [`${trail} (besedilo)`] : [];
  return [];
}

const roi = roiSummary({
  minutePoKoraku: { prevzem: 2, shranjevanje: 1, popolnost: 3, edokumenti: 7, zavarovalniski: 6, listi: 2 },
  strojnoSekund: 14.8,
  stDokumentov: 5,
});

const hits = scanForMoney(roi);
ok(hits.length === 0, `v izpisu ni ničesar denarnega${hits.length ? " — " + hits.join(", ") : ""}`);
ok(scanForMoney(ROI_KORAKI, "koraki").length === 0, "v korakih ni ničesar denarnega");

const nums = Object.entries(roi).filter(([, v]) => typeof v === "number");
ok(nums.every(([, v]) => Number.isFinite(v)), "vse številke so končne (brez NaN/Infinity)");
ok(nums.length >= 8, "izpis nosi časovne številke");

eq(roi.rocnoMinutNaPonudbo, 21, "ročno = vsota šestih korakov");
eq(roi.strojnoSekundNaPonudbo, 3, "strojno na ponudbo = 14,8 s / 5 dokumentov");
eq(roi.vneseno, true, "z vnosom -> vneseno = true");
ok(roi.prihranekMinutNaPonudbo > 20 && roi.prihranekMinutNaPonudbo < 21, "prihranek na ponudbo je pod ročnim časom");
ok(roi.prihranekDniLetno > 0, "prihranek v delovnih dneh je pozitiven");

// unknown ids must not sneak into the total
eq(roiSummary({ minutePoKoraku: { prevzem: 4, izmisljen_korak: 999 } }).rocnoMinutNaPonudbo, 4,
  "neznan korak se ne šteje");
eq(roiSummary({ minutePoKoraku: { prevzem: -5 } }).rocnoMinutNaPonudbo, 0, "negativen vnos se ne šteje");
eq(roiSummary({ minutePoKoraku: { prevzem: "ne vem" } }).rocnoMinutNaPonudbo, 0, "besedilni vnos se ne šteje");

/* ── 6. the volume parameter drives the annual figure ─────────────────────── */

head("letna slika se ravna po številu ponudb na mesec");

const min = { edokumenti: 7, zavarovalniski: 6, popolnost: 3, prevzem: 2, shranjevanje: 1, listi: 2 };
const at300 = roiSummary({ minutePoKoraku: min, strojnoSekund: 14.8, stDokumentov: 5, ponudbNaMesec: 300 });
const at400 = roiSummary({ minutePoKoraku: min, strojnoSekund: 14.8, stDokumentov: 5 });
const at500 = roiSummary({ minutePoKoraku: min, strojnoSekund: 14.8, stDokumentov: 5, ponudbNaMesec: 500 });

eq(at400.ponudbNaMesec, PONUDB_NA_MESEC, "privzeto 400 ponudb na mesec (sredina 300–500)");
eq(at300.ponudbLetno, 3600, "300/mesec -> 3600 letno");
eq(at500.ponudbLetno, 6000, "500/mesec -> 6000 letno");
ok(at300.rocnoUrLetno < at400.rocnoUrLetno && at400.rocnoUrLetno < at500.rocnoUrLetno,
  "več ponudb -> več ročnih ur letno");
eq(at500.rocnoUrLetno, Math.round((at300.rocnoUrLetno * 5) / 3 * 10) / 10, "letne ure se skalirajo linearno z obsegom");
ok(at300.rocnoMinutNaPonudbo === at500.rocnoMinutNaPonudbo, "čas na eno ponudbo je neodvisen od obsega");
ok(at500.prihranekUrLetno > at300.prihranekUrLetno, "prihranek raste z obsegom");

/* ── 7. deterministic: no clock inside the module ─────────────────────────── */

head("brez ure v modulu");

const src = fs.readFileSync(path.join(HERE, "..", "lib", "runstats.js"), "utf8");
ok(!/Date\.now|new Date|performance\.now/.test(src), "modul ne bere ure — časi so vhod");
ok(!/require\(|node:/.test(src), "modul nima node odvisnosti (teče v brskalniku)");

// Comments may discuss why money is banned; code may not contain it. Strip the comments,
// then scan what is left — identifiers, string literals, anything that could reach a screen.
const koda = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/.*$/gm, "$1");
ok(!DENAR.test(koda), "v kodi modula ni ničesar denarnega");
ok(/€|denar|valut/i.test(src), "modul vseeno pojasni, zakaj denarja ni");

// same inputs, same output
const twice = JSON.stringify(roiSummary({ minutePoKoraku: min, strojnoSekund: 14.8, stDokumentov: 5 }));
ok(twice === JSON.stringify(at400), "isti vhod -> isti izhod");

/* ── 8. noteDoc is tolerant and does not mutate ───────────────────────────── */

head("noteDoc");

const outputs = [makeOutput()];
const before = JSON.stringify(outputs);
const runE = newRun();
noteDoc(runE, { klas: "ponudba", ms: 100, outputs });
ok(JSON.stringify(outputs) === before, "noteDoc ne spremeni vhodnih podatkov");
noteDoc(runE, { klas: "klp" });
noteDoc(runE, {});
noteDoc(runE, { klas: "ponudba", ms: -50, outputs: null });
noteDoc(runE, { klas: "ponudba", ms: NaN });
noteDoc(null, { klas: "ponudba", ms: 100 });
const e = summary(runE);
eq(e.dokumentov, 5, "manjkajoča polja ne podrejo štetja");
eq(e.sekund, 0.1, "neveljavni časi se štejejo kot 0");
eq(e.kontrolnihListov, 1, "brez izhodov ni kontrolnih listov");

/* ── done ─────────────────────────────────────────────────────────────────── */

console.log(`\n${fails ? `FAIL — ${fails} preverb ni uspelo` : "OK — vse preverbe uspele"}`);
process.exit(fails ? 1 : 0);
