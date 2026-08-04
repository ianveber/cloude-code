/**
 * test-dnevnik.mjs — the trial time tally.
 *
 *   node scripts/test-dnevnik.mjs
 *
 * Two things are being protected here, and only one of them is arithmetic.
 *
 * 1. THE NUMBER MUST BE HONEST. It is the number that decides Faza 1, and the client reads it out
 *    themselves. So: no saving is claimed before they state their own manual minutes (null, not
 *    zero — zero reads as "this saved you nothing", a different and false claim), and a negative
 *    saving is reported as measured rather than floored at zero. A tally that can only go up is a
 *    marketing device, not a measurement.
 *
 * 2. IT MUST NOT BECOME A DATA STORE. Aneks 1 A3(d) tells the client nothing is stored: not the
 *    document, not the extracted data. The tally lives in their own browser, but "in their
 *    browser" is not a licence to keep field values there. The last block asserts that what gets
 *    written is counts and seconds and nothing else — so an edit that starts remembering WHICH
 *    documents, or which fields were corrected, fails here rather than in a lawyer's hands.
 *
 * localStorage is faked, because the module has to survive a browser that does not offer one.
 */

import assert from "node:assert";

/* ── a localStorage that can be made to misbehave ──────────────────────── */

function fakeStorage({ throwOnAccess = false, throwOnWrite = false } = {}) {
  const map = new Map();
  return {
    _map: map,
    getItem: (k) => (throwOnAccess ? (() => { throw new Error("blocked"); })() : map.get(k) ?? null),
    setItem: (k, v) => {
      if (throwOnAccess || throwOnWrite) throw new Error("quota");
      map.set(k, String(v));
    },
    removeItem: (k) => {
      if (throwOnAccess) throw new Error("blocked");
      map.delete(k);
    },
  };
}

let pass = 0, fail = 0;
const ok = (cond, label, detail = "") => {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ""}`); }
};

const load = async () => {
  // fresh module instance per scenario, so module-level state cannot leak between them
  const m = await import(`../lib/dnevnik.js?${Math.random()}`);
  return m;
};

console.log("\n  trial time tally\n");

/* ── 1 · nothing recorded yet ──────────────────────────────────────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  const p = d.povzetek();
  ok(p.pregledov === 0 && p.ponudb === 0, "an untouched tally is empty");
  ok(p.prihranjenoMinut === null,
    "…and claims NO saving rather than a saving of zero",
    `got ${p.prihranjenoMinut} — 0 would read as \"this saved you nothing\"`);
  ok(d.besedilo(p).includes("Ročni čas ni vpisan"), "…and the summary says why it cannot compute");
}

/* ── 2 · accumulation across runs ──────────────────────────────────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  d.zabelezi({ ponudb: 2, strojnoSekund: 9 });
  d.zabelezi({ ponudb: 3, strojnoSekund: 15 });
  const p = d.povzetek();
  ok(p.pregledov === 2, `two runs counted (${p.pregledov})`);
  ok(p.ponudb === 5, `offers add up (${p.ponudb})`);
  ok(Math.abs(p.strojnoSekund - 24) < 0.01, `machine seconds add up (${p.strojnoSekund})`);
  ok(Math.abs(p.strojnoMinut - 0.4) < 0.01, `and convert to minutes (${p.strojnoMinut})`);
  ok(p.prihranjenoMinut === null, "still no saving claimed — they have not stated manual minutes");
}

/* ── 3 · the client states their manual time ───────────────────────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  d.zabelezi({ ponudb: 4, strojnoSekund: 24, rocnoMinutNaPonudbo: 7 });
  const p = d.povzetek();
  // 4 offers x 7 min = 28 min by hand; machine took 24 s = 0.4 min
  ok(Math.abs(p.rocnoMinut - 28) < 0.01, `manual total is offers x their minutes (${p.rocnoMinut})`);
  ok(Math.abs(p.prihranjenoMinut - 27.6) < 0.05, `saving is the difference (${p.prihranjenoMinut})`);
  ok(Math.abs(p.prihranjenoUr - 0.5) < 0.05, `and in hours (${p.prihranjenoUr})`);
  ok(d.besedilo(p).includes("PRIHRANJENO"), "the summary states it");
  ok(d.besedilo(p).includes("vaša ocena"),
    "…and marks the manual figure as THEIR estimate, not our claim");
}

/* ── 4 · the manual figure overwrites, it does not accumulate ──────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  d.zabelezi({ ponudb: 1, strojnoSekund: 6, rocnoMinutNaPonudbo: 5 });
  d.zabelezi({ ponudb: 1, strojnoSekund: 6, rocnoMinutNaPonudbo: 9 });
  const p = d.povzetek();
  ok(p.rocnoMinutNaPonudbo === 9,
    `the latest stated figure wins (${p.rocnoMinutNaPonudbo}) — it is a standing estimate, not a per-run measurement`);
  ok(Math.abs(p.rocnoMinut - 18) < 0.01, `applied to every offer so far (${p.rocnoMinut})`);

  // A later run that does not restate it must not wipe it.
  d.zabelezi({ ponudb: 1, strojnoSekund: 6 });
  ok(d.povzetek().rocnoMinutNaPonudbo === 9, "a run without the figure keeps the previous one");
}

/* ── 5 · a saving can be negative, and is reported as measured ─────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  // 1 offer, machine took 120 s = 2 min, they say the manual job takes 1 min
  d.zabelezi({ ponudb: 1, strojnoSekund: 120, rocnoMinutNaPonudbo: 1 });
  const p = d.povzetek();
  ok(p.prihranjenoMinut < 0,
    `a slower-than-manual result reports NEGATIVE (${p.prihranjenoMinut})`,
    "flooring this at zero would make the tally a marketing device rather than a measurement");
}

/* ── 6 · a review that read nothing still counts as a review ───────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  d.zabelezi({ ponudb: 0, strojnoSekund: 0, rocnoMinutNaPonudbo: 7 });
  const p = d.povzetek();
  ok(p.pregledov === 1 && p.ponudb === 0,
    "dropping a packet with no offer in it counts as a review, not as an offer");
  ok(p.prihranjenoMinut === 0,
    `and contributes no saving (${p.prihranjenoMinut})`);
}

/* ── 7 · storage that is absent, blocked, or corrupt ───────────────────── */
{
  delete globalThis.localStorage;
  const d = await load();
  ok(d.naVoljo() === false, "no localStorage at all: reports unavailable");
  ok(d.povzetek().pregledov === 0, "…and still returns a usable empty summary");
  let threw = false;
  try { d.zabelezi({ ponudb: 1, strojnoSekund: 5 }); } catch { threw = true; }
  ok(!threw, "…and recording is a no-op rather than an exception");
}
{
  // Safari private mode / blocked third-party storage: the ACCESS throws, not just the write.
  globalThis.localStorage = fakeStorage({ throwOnAccess: true });
  const d = await load();
  ok(d.naVoljo() === false, "storage that throws on access: reports unavailable");
  let threw = false;
  try { d.zabelezi({ ponudb: 1, strojnoSekund: 5 }); d.povzetek(); } catch { threw = true; }
  ok(!threw, "…and the page does not go down because of a counter");
}
{
  globalThis.localStorage = fakeStorage();
  globalThis.localStorage.setItem("hh_prihranek_v1", "{ this is not json");
  const d = await load();
  ok(d.povzetek().pregledov === 0, "corrupt stored value resets to empty instead of throwing");
}
{
  globalThis.localStorage = fakeStorage();
  globalThis.localStorage.setItem("hh_prihranek_v1", JSON.stringify({ verzija: 99, ponudb: 500 }));
  const d = await load();
  ok(d.povzetek().ponudb === 0,
    "a tally written by a different version is discarded, not misread");
}

/* ── 8 · IT MUST NOT BECOME A DATA STORE ───────────────────────────────── */
{
  globalThis.localStorage = fakeStorage();
  const d = await load();
  // Hand it everything a caller might carelessly pass through.
  d.zabelezi({
    ponudb: 2, strojnoSekund: 12, rocnoMinutNaPonudbo: 6,
    ime: "Radovan Zlatokrilec", datoteka: "ponudba-4400.pdf",
    polja: { "zavarovalec.ime": "Radovan Zlatokrilec", "st_ponudbe": "4400-2026-000999" },
    naslov: "Nekje na Robu 14",
  });
  const raw = globalThis.localStorage._map.get("hh_prihranek_v1") || "";
  const parsed = JSON.parse(raw);

  for (const needle of ["Radovan", "Zlatokrilec", "ponudba-4400", "4400-2026", "Nekje na Robu"]) {
    ok(!raw.includes(needle), `nothing resembling document content is written (${needle})`);
  }
  const dovoljeni = ["verzija", "zacetek", "zadnji", "pregledov", "ponudb",
    "strojnoSekund", "rocnoMinutNaPonudbo"];
  const odvec = Object.keys(parsed).filter((k) => !dovoljeni.includes(k));
  ok(odvec.length === 0,
    "the stored object holds ONLY the allowed counters",
    `unexpected keys: ${odvec.join(", ")} — Aneks 1 A3(d) says nothing about the documents is kept`);
  for (const [k, v] of Object.entries(parsed)) {
    if (k === "verzija" || k === "zacetek" || k === "zadnji") continue;
    ok(typeof v === "number", `${k} is a number, not text carrying a value`);
  }

  // And the text the client pastes into an e-mail must be equally harmless.
  const txt = d.besedilo();
  ok(!/Radovan|Zlatokrilec|4400-2026/.test(txt),
    "the copyable summary carries no document content either", txt);
}

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
