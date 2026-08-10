import { test, expect } from "bun:test";
import {
  buildRemarks    as vldrBuildRemarks,
  groupByVin      as vldrGroupByVin,
  toVinFilajAOA   as vldrToVinFilajAOA,
} from "./transform.js";
import {
  buildRemarks    as osBuildRemarks,
  groupByVin      as osGroupByVin,
  toVinFilajAOA   as osToVinFilajAOA,
} from "../../inspectus-os/src/lib/vldr/transform.ts";

// ─────────────────────────────────────────────────────────────────────────────
// DRIFT GUARD — the VLDR transform logic lives in TWO copies:
//   • DEPLOYED : inspectus-vldr/lib/transform.js        (served at inspectus-vldr.vercel.app)
//   • TWIN     : inspectus-os/src/lib/vldr/transform.ts  (the command-center build)
// They MUST agree on the shared Remarks / VIN-FILAJ logic. On 2026-07-16 they silently drifted —
// the twin was fixed to the new "Damage-with-no-comment lists its code" rule but the DEPLOYED copy
// still dropped those rows, so a client-reported bug (Rok Topalovič) shipped for weeks.
// This test makes that class of drift impossible: it feeds a large battery of damage scenarios
// through BOTH copies and fails the moment their outputs differ. Run `bun test` before `vercel --prod`.
//
// NOTE: `toGroupedSurveyAOA` is INTENTIONALLY different between the two (vldr = wide numbered
// per-damage columns; os = positional slash-join) — it is deliberately NOT covered here.
// If you ever unify it, add it below.
// ─────────────────────────────────────────────────────────────────────────────

const PART_TYPES = [["03", "12"], ["81", "34"], ["55", "09"], ["27", "04"]];
// include case variants of "Damage" (the field that must be suppressed) + the empty class
const CLASSES  = ["Damage", "damage", "DAMAGE", "No Damage Evidence", "Observation", ""];
const COMMENTS = ["", "OTTD", "deep chip", "STEVEDORE DAMAGE"];
const SEPS     = [" ", ": "];   // " " = VIN-FILAJ export, ": " = on-card remarks box

const mk = (pt, cls, com, sev = 2) => ({
  part_code: pt[0], type_code: pt[1], severity: sev, class: cls, comments: com,
});

// Every single-damage combination …
const SCENARIOS = [];
for (const pt of PART_TYPES) for (const cls of CLASSES) for (const com of COMMENTS) {
  SCENARIOS.push([mk(pt, cls, com)]);
}
// … plus a broad set of 2- and 3-damage vehicles covering class/comment mixes, each including
// a no-comment "Damage" (the exact record type that drifted).
for (let i = 0; i < CLASSES.length; i++) for (let j = 0; j < COMMENTS.length; j++) {
  SCENARIOS.push([
    mk(PART_TYPES[0], CLASSES[i], COMMENTS[j]),
    mk(PART_TYPES[1], CLASSES[(i + 2) % CLASSES.length], COMMENTS[(j + 1) % COMMENTS.length]),
  ]);
  SCENARIOS.push([
    mk(PART_TYPES[0], CLASSES[i], COMMENTS[j]),
    mk(PART_TYPES[1], CLASSES[(i + 1) % CLASSES.length], COMMENTS[(j + 2) % COMMENTS.length]),
    mk(PART_TYPES[2], "Damage", ""),   // always a no-comment Damage — the case that regressed
  ]);
}

const label = damages =>
  damages.map(d => `${d.part_code}-${d.type_code}/${d.class || "∅"}/${d.comments || "∅"}`).join(" + ");

test(`buildRemarks: DEPLOYED (vldr) and TWIN (os) agree on all ${SCENARIOS.length * SEPS.length} scenarios`, () => {
  const diffs = [];
  for (const damages of SCENARIOS) {
    for (const sep of SEPS) {
      const a = vldrBuildRemarks(damages, sep);
      const b = osBuildRemarks(damages, sep);
      if (a !== b) diffs.push({ in: label(damages), sep: JSON.stringify(sep), vldr: a, os: b });
    }
  }
  if (diffs.length) {
    const shown = diffs.slice(0, 8).map(d =>
      `  [${d.in}] sep=${d.sep}\n     vldr → ${JSON.stringify(d.vldr)}\n     os   → ${JSON.stringify(d.os)}`
    ).join("\n");
    throw new Error(
      `transform.js (DEPLOYED) and transform.ts (TWIN) buildRemarks DIVERGED on ` +
      `${diffs.length}/${SCENARIOS.length * SEPS.length} scenarios.\n` +
      `Re-sync buildRemarks in both files (canonical = the copy matching the latest client rule), ` +
      `then re-run.\n${shown}`
    );
  }
  expect(diffs.length).toBe(0);
});

// End-to-end: the full VIN-FILAJ export sheet (which internally calls buildRemarks) must be
// byte-for-byte identical from both copies on the same input — including a Rok-style all-Damage,
// no-comment vehicle.
test("toVinFilajAOA: DEPLOYED and TWIN produce identical export sheets", () => {
  const COLUMN_MAP = { source_columns: {
    make_model: "MAKE/MODEL", vin: "VIN", part_code: "PART CODE", type_code: "TYPE CODE",
    part_text: "PART TEXT", type_text: "TYPE TEXT", severity: "SEVERITY", cause: "CAUSE",
    class: "CLASS", comments: "COMMENTS", order_id: "orderID",
  } };
  const ROWS = [
    { "MAKE/MODEL": "FORD TRANSIT", "VIN": "ABC", "PART CODE": "03", "TYPE CODE": "12", "SEVERITY": 2, "CAUSE": "Transport", "CLASS": "Observation",        "COMMENTS": "" },
    { "MAKE/MODEL": "FORD TRANSIT", "VIN": "ABC", "PART CODE": "55", "TYPE CODE": "09", "SEVERITY": 1, "CAUSE": "Warranty",  "CLASS": "No Damage Evidence", "COMMENTS": "" },
    { "MAKE/MODEL": "FORD CUSTOM",  "VIN": "XYZ", "PART CODE": "81", "TYPE CODE": "34", "SEVERITY": 3, "CAUSE": "Transport", "CLASS": "Damage",             "COMMENTS": "deep chip" },
    { "MAKE/MODEL": "FORD",         "VIN": "DMG", "PART CODE": "03", "TYPE CODE": "12", "SEVERITY": 2, "CAUSE": "Transport", "CLASS": "Damage",             "COMMENTS": "" },
    { "MAKE/MODEL": "FORD",         "VIN": "DMG", "PART CODE": "27", "TYPE CODE": "04", "SEVERITY": 3, "CAUSE": "Transport", "CLASS": "Damage",             "COMMENTS": "" },
  ];
  // groupByVin is shared too — build vehicles with each copy and confirm both stages agree.
  const vVldr = vldrGroupByVin(ROWS, COLUMN_MAP);
  const vOs   = osGroupByVin(ROWS, COLUMN_MAP);
  expect(JSON.stringify(vVldr)).toBe(JSON.stringify(vOs));

  const aoaVldr = vldrToVinFilajAOA(vVldr, {}, 7);
  const aoaOs   = osToVinFilajAOA(vOs, {}, 7);
  expect(JSON.stringify(aoaVldr)).toBe(JSON.stringify(aoaOs));
});
