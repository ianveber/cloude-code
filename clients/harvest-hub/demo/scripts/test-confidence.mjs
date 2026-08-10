/**
 * test-confidence.mjs — proves the reliability signal discriminates.
 *
 * The awkward fact this file exists to handle: the extractor scores 157/157 on truth.json, so the
 * real documents contain **no errors for a confidence signal to catch**. A mechanism validated only
 * on data where nothing is wrong is unfalsifiable. So the failures are injected here — a
 * hallucinated value, a disagreement between two reads, a rule-derived value — and the test asserts
 * the tier drops. That is the only evidence that the signal is doing work rather than agreeing with
 * everything.
 *
 *   node scripts/test-confidence.mjs
 */

import assert from "node:assert/strict";
import { fieldConfidence, appearsInSource, jeZaPisanje, klpConfidence, PISNI_PRAG }
  from "../lib/confidence.js";

let pass = 0;
const fail = [];
const ok = (name, fn) => { try { fn(); pass++; } catch (e) { fail.push(`${name}: ${e.message}`); } };

// A restored page, in the shape layout.js produces: uppercase source text, labels and values.
const LAYOUT = `
x42⟨ZAVAROVALEC⟩
x47⟨Ime in priimek:⟩ x180⟨JANEZ NOVAK⟩
x47⟨Naslov:⟩ x180⟨CANKARJEVA ULICA 12, 1000 LJUBLJANA, SLOVENIJA⟩
x47⟨E-pošta:⟩ x180⟨JANEZ.NOVAK@EXAMPLE.SI⟩
x42⟨Zastopnik oz. posrednik in št. licence:⟩ x300⟨PETER KRIZNAR, 30220-1022/06-4⟩
x47⟨Številka ponudbe:⟩ x180⟨330009276⟩
`;

console.log("\n  Reliability signal — injected failures\n");

/* ── appearsInSource: survives our own normalisation ──────────────────────── */
ok("verbatim — title-cased value still found (JANEZ NOVAK -> Janez Novak)", () =>
  assert.equal(appearsInSource("Janez Novak", LAYOUT), true));
ok("verbatim — country-stripped address still found", () =>
  assert.equal(appearsInSource("Cankarjeva ulica 12, 1000 Ljubljana", LAYOUT), true));
ok("verbatim — INVERTED agent name still found (token match, not string match)", () =>
  assert.equal(appearsInSource("Kriznar Peter", LAYOUT), true));
ok("verbatim — lowercased e-mail still found", () =>
  assert.equal(appearsInSource("janez.novak@example.si", LAYOUT), true));
ok("verbatim — a value that is NOT in the document is not found", () =>
  assert.equal(appearsInSource("Marija Horvat", LAYOUT), false));
ok("verbatim — empty and null are false, never true by accident", () => {
  assert.equal(appearsInSource("", LAYOUT), false);
  assert.equal(appearsInSource(null, LAYOUT), false);
  assert.equal(appearsInSource("Janez", null), false);
});

/* ── the signal at its best ───────────────────────────────────────────────── */
ok("two reads agree AND text is in the document -> visoka", () => {
  const c = fieldConfidence({ value: "Janez Novak", second: "Janez Novak",
    source: "ponudba", layout: LAYOUT });
  assert.equal(c.tier, "visoka");
  assert.equal(c.agreement, "ujemanje");
  assert.equal(c.verbatim, true);
});

/* ── INJECTED FAILURE 1 · hallucination ───────────────────────────────────── */
ok("both reads agree on a value that is NOT in the document -> never visoka", () => {
  const c = fieldConfidence({ value: "Marija Horvat", second: "Marija Horvat",
    source: "ponudba", layout: LAYOUT });
  assert.notEqual(c.tier, "visoka");
  assert.equal(c.tier, "srednja");
  assert.equal(c.verbatim, false);
});

/* ── INJECTED FAILURE 2 · the two reads disagree ──────────────────────────── */
ok("reads disagree -> nizka, and below the write threshold", () => {
  const c = fieldConfidence({ value: "Janez Novak", second: "Janez Novakk",
    source: "ponudba", layout: LAYOUT });
  assert.equal(c.tier, "nizka");
  assert.equal(c.agreement, "razhajanje");
  assert.equal(jeZaPisanje(c.tier), false, "a disagreement must not be written automatically");
});
ok("disagreement outranks verbatim — being in the document does not rescue it", () => {
  const c = fieldConfidence({ value: "Janez Novak", second: "Peter Kriznar",
    source: "ponudba", layout: LAYOUT });
  assert.equal(c.verbatim, true);
  assert.equal(c.tier, "nizka");
});
ok("agreement is insensitive to case and spacing, not to content", () => {
  assert.equal(fieldConfidence({ value: "Janez Novak", second: "  janez   novak ",
    source: "ponudba", layout: LAYOUT }).agreement, "ujemanje");
  assert.equal(fieldConfidence({ value: "Janez Novak", second: "Janez Nowak",
    source: "ponudba", layout: LAYOUT }).agreement, "razhajanje");
});

/* ── INJECTED FAILURE 3 · derived, not read ───────────────────────────────── */
ok("a rule-derived value is nizka even when both reads agree", () => {
  const c = fieldConfidence({ value: "Janez Novak", second: "Janez Novak",
    source: "pravilo", layout: LAYOUT });
  assert.equal(c.tier, "nizka");
  assert.equal(jeZaPisanje(c.tier), false);
});

/* ── register and absent ──────────────────────────────────────────────────── */
ok("a register value is srednja — trusted, but not from this document", () =>
  assert.equal(fieldConfidence({ value: "120-2089", source: "register", layout: LAYOUT }).tier,
    "srednja"));
ok("UNMAPPED -> brez", () =>
  assert.equal(fieldConfidence({ value: null, state: "UNMAPPED", source: "register",
    layout: LAYOUT }).tier, "brez"));
ok("empty -> brez", () =>
  assert.equal(fieldConfidence({ value: null, source: null, layout: LAYOUT }).tier, "brez"));

/* ── single read degrades honestly ────────────────────────────────────────── */
ok("one read + verbatim -> srednja, never visoka", () => {
  const c = fieldConfidence({ value: "Janez Novak", source: "ponudba", layout: LAYOUT });
  assert.equal(c.tier, "srednja");
  assert.equal(c.agreement, "enojno branje");
});
ok("one read + not verbatim -> nizka", () =>
  assert.equal(fieldConfidence({ value: "Marija Horvat", source: "ponudba", layout: LAYOUT }).tier,
    "nizka"));

/* ── the threshold ────────────────────────────────────────────────────────── */
ok("write threshold admits visoka and srednja, refuses nizka and brez", () => {
  assert.equal(jeZaPisanje("visoka"), true);
  assert.equal(jeZaPisanje("srednja"), true);
  assert.equal(jeZaPisanje("nizka"), false);
  assert.equal(jeZaPisanje("brez"), false);
});
ok("the threshold is a parameter — raising it to visoka refuses srednja", () =>
  assert.equal(jeZaPisanje("srednja", "visoka"), false));
ok("default threshold is srednja", () => assert.equal(PISNI_PRAG, "srednja"));

/* ── whole-KLP aggregation ────────────────────────────────────────────────── */
ok("klpConfidence counts writable vs flagged and reports a rate", () => {
  const fields = ["a", "b", "c", "d"];
  const cells = {
    a: { value: "Janez Novak", source: "ponudba" },          // visoka
    b: { value: "Marija Horvat", source: "ponudba" },        // srednja (agree, not verbatim)
    c: { value: "Janez Novak", source: "pravilo" },          // nizka
    d: { value: null, state: "UNMAPPED", source: "register" }, // brez
  };
  const second = { a: { value: "Janez Novak" }, b: { value: "Marija Horvat" },
    c: { value: "Janez Novak" }, d: { value: null } };
  const r = klpConfidence({ cells, secondCells: second, layout: LAYOUT, fields });
  assert.deepEqual(r.flagged.sort(), ["c", "d"]);
  assert.equal(r.writable, 2);
  assert.equal(r.total, 4);
  assert.equal(r.flagRate, 0.5);
});
ok("an EMPTY field is not review work; an UNMAPPED one is", () => {
  const fields = ["empty", "unmapped", "good"];
  const cells = {
    empty: { value: null, source: null },
    unmapped: { value: null, state: "UNMAPPED", source: "register" },
    good: { value: "Janez Novak", source: "ponudba" },
  };
  const second = { empty: { value: null }, unmapped: { value: null }, good: { value: "Janez Novak" } };
  const r = klpConfidence({ cells, secondCells: second, layout: LAYOUT, fields });
  assert.deepEqual(r.empty, ["empty"], "an absent second agent is not a task for anyone");
  assert.deepEqual(r.flagged, ["unmapped"], "needing the register IS work");
  assert.equal(r.bearing, 2, "the denominator excludes empty fields");
  assert.equal(r.flagRate, 0.5, "1 of 2 data-bearing fields needs a person");
  // The mistake this guards against: counting the empty field would give 2/3 = 67%.
  assert.notEqual(r.flagRate, 2 / 3);
});

ok("with no second read, nothing reaches visoka — the cap is structural", () => {
  const fields = ["a"];
  const r = klpConfidence({ cells: { a: { value: "Janez Novak", source: "ponudba" } },
    secondCells: null, layout: LAYOUT, fields });
  assert.equal(r.fields.a.tier, "srednja");
});

console.log(`  ${fail.length ? "FAIL" : "PASS"} — ${pass} checks passed, ${fail.length} failed`);
for (const f of fail) console.log(`    ✗ ${f}`);
console.log("");
process.exit(fail.length ? 1 : 0);
