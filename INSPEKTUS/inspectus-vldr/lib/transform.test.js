import { test, expect } from "bun:test";
import { groupByVin, toVinFilajRows, toVinFilajAOA, maxDamageCount, buildRemarks, toGroupedSurveyAOA } from "./transform.js";

const COLUMN_MAP = {
  source_columns: {
    make_model: "MAKE/MODEL", vin: "VIN",
    part_code: "PART CODE", type_code: "TYPE CODE",
    part_text: "PART TEXT", type_text: "TYPE TEXT",
    severity: "SEVERITY", cause: "CAUSE",
    class: "CLASS", comments: "COMMENTS", order_id: "orderID"
  }
};

// Shaped like the real PRIMER 1 "SURVEY REPORT" rows (after header-row offset parse).
const ROWS = [
  { "MAKE/MODEL": "FORD TRANSIT", "VIN": "ABC", "PART CODE": "03", "TYPE CODE": "12", "PART TEXT": "Bumper-Front", "TYPE TEXT": "Scratched", "SEVERITY": 2, "CAUSE": "Transport", "CLASS": "Observation",        "COMMENTS": "" },
  { "MAKE/MODEL": "FORD TRANSIT", "VIN": "ABC", "PART CODE": "55", "TYPE CODE": "12", "PART TEXT": "Cargo Area", "TYPE TEXT": "Scratched", "SEVERITY": 1, "CAUSE": "Warranty",  "CLASS": "No Damage Evidence", "COMMENTS": "" },
  { "MAKE/MODEL": "FORD CUSTOM",  "VIN": "XYZ", "PART CODE": "81", "TYPE CODE": "34", "PART TEXT": "Gas Cap", "TYPE TEXT": "Chipped", "SEVERITY": 3, "CAUSE": "Transport", "CLASS": "Damage",             "COMMENTS": "deep chip" }
];

test("groupByVin merges damages on the same VIN and keeps the real columns", () => {
  const vehicles = groupByVin(ROWS, COLUMN_MAP);
  expect(vehicles).toHaveLength(2);
  const abc = vehicles.find(v => v.vin === "ABC");
  expect(abc.make_model).toBe("FORD TRANSIT");
  expect(abc.damages).toHaveLength(2);
  expect(abc.damages[0].part_text).toBe("Bumper-Front");
  expect(abc.damages[0].cause).toBe("Transport");
});

test("groupByVin keeps CLASS/COMMENTS/SEVERITY bound per damage", () => {
  const abc = groupByVin(ROWS, COLUMN_MAP).find(v => v.vin === "ABC");
  const d03 = abc.damages.find(d => d.part_code === "03");
  const d55 = abc.damages.find(d => d.part_code === "55");
  expect(d03.class).toBe("Observation");
  expect(d03.severity).toBe(2);
  expect(d55.class).toBe("No Damage Evidence");
  expect(d55.severity).toBe(1);
});

test("buildRemarks: single damage with a description = the description alone", () => {
  const xyz = groupByVin(ROWS, COLUMN_MAP).find(v => v.vin === "XYZ");
  expect(buildRemarks(xyz.damages, " ")).toBe("DEEP CHIP");
});

// --- INSPECTUS rule (client → Ian, 2026-07-20 — supersedes the 2026-07-16 "list the bare code"):
//     Remarks carry ONLY the inspector's description. Damage + description → it is listed;
//     damage with no description → nothing at all. No CLASS word ever reaches Remarks —
//     not "Damage", and no longer "No Damage Evidence" / "Observation" either.
test("buildRemarks: multi damage with NO descriptions is empty (no class labels, no codes)", () => {
  const abc = groupByVin(ROWS, COLUMN_MAP).find(v => v.vin === "ABC");
  expect(buildRemarks(abc.damages, " ")).toBe("");
  expect(buildRemarks(abc.damages, ": ")).toBe("");
});

test("buildRemarks: multi damage = code + description, joined, uppercased", () => {
  const damages = [
    { part_code: "03", type_code: "04", severity: 5, class: "Damage", comments: "stevedore damage" },
    { part_code: "27", type_code: "04", severity: 3, class: "Damage", comments: "OTTD" }
  ];
  expect(buildRemarks(damages, " ")).toBe("03-04 STEVEDORE DAMAGE / 27-04 OTTD");
  expect(buildRemarks(damages, ": ")).toBe("03-04: STEVEDORE DAMAGE / 27-04: OTTD");
});

test("buildRemarks: single Damage with no description writes NOTHING (not the code)", () => {
  const damages = [{ part_code: "12", type_code: "12", severity: 3, class: "Damage", comments: "" }];
  expect(buildRemarks(damages, " ")).toBe("");
});

test("buildRemarks: single Damage with a description shows it, drops the word 'Damage'", () => {
  const damages = [{ part_code: "12", type_code: "34", severity: 1, class: "Damage", comments: "OTTD" }];
  expect(buildRemarks(damages, " ")).toBe("OTTD");
});

test("buildRemarks: only the described damages are listed — the rest are silent", () => {
  const damages = [
    { part_code: "03", type_code: "09", severity: 3, class: "No Damage Evidence", comments: "" },
    { part_code: "81", type_code: "12", severity: 2, class: "Damage", comments: "" },
    { part_code: "81", type_code: "34", severity: 1, class: "Observation", comments: "scuffed on deck" }
  ];
  expect(buildRemarks(damages, " ")).toBe("81-34 SCUFFED ON DECK");
});

test("buildRemarks: a class-only damage never prints its class label", () => {
  const damages = [
    { part_code: "03", type_code: "09", severity: 3, class: "No Damage Evidence", comments: "" },
    { part_code: "81", type_code: "34", severity: 1, class: "Observation", comments: "" }
  ];
  expect(buildRemarks(damages, " ")).toBe("");
  expect(buildRemarks([damages[0]], " ")).toBe("");
});

test("buildRemarks: all-Damage vehicle keeps inspector comments, drops every 'Damage' label", () => {
  const damages = [
    { part_code: "03", type_code: "04", severity: 5, class: "Damage", comments: "STEVEDORE DAMAGE" },
    { part_code: "27", type_code: "04", severity: 3, class: "Damage", comments: "STEVEDORE DAMAGE" }
  ];
  expect(buildRemarks(damages, " ")).toBe("03-04 STEVEDORE DAMAGE / 27-04 STEVEDORE DAMAGE");
});

test("buildRemarks: vehicle of only Damage-without-description → Remarks box stays EMPTY (client, 2026-07-20)", () => {
  const damages = [
    { part_code: "03", type_code: "04", severity: 5, class: "Damage", comments: "" },
    { part_code: "27", type_code: "04", severity: 3, class: "Damage", comments: "" }
  ];
  expect(buildRemarks(damages, " ")).toBe("");
});

test("toVinFilajAOA: column F (COMMENTS 1) for a Damage vehicle has no standalone 'DAMAGE'", () => {
  const vehicles = groupByVin(ROWS, COLUMN_MAP);
  const aoa = toVinFilajAOA(vehicles, {}, 7);
  const xyzRow = aoa.find(r => r && r[1] === "XYZ");
  expect(xyzRow[5]).toBe("DEEP CHIP");
});

test("maxDamageCount", () => {
  expect(maxDamageCount(groupByVin(ROWS, COLUMN_MAP))).toBe(2);
});

test("toVinFilajRows lays damages out horizontally with aggregate remark in slot-1 COMMENTS", () => {
  const vehicles = groupByVin(ROWS, COLUMN_MAP);
  const rows = toVinFilajRows(vehicles);
  const abc = rows.find(r => r["VIN"] === "ABC");
  expect(abc["MODEL"]).toBe("FORD TRANSIT");
  expect(abc["PART 1"]).toBe("03");
  expect(abc["TYPE 1"]).toBe("12");
  expect(abc["PART 2"]).toBe("55");
  expect(abc["COMMENTS 1"]).toBe("");   // ABC's damages carry no inspector description (2026-07-20 rule)
  expect(abc["COMMENTS 2"]).toBe("");
  const xyz = rows.find(r => r["VIN"] === "XYZ");
  expect(xyz["COMMENTS 1"]).toBe("DEEP CHIP");   // described damage → aggregate lands in slot 1
});

test("toVinFilajAOA matches the real 'prepare for report' layout", () => {
  const vehicles = groupByVin(ROWS, COLUMN_MAP);
  const header = { date: "10.05.2026", transport_id: "NEPTUNE ITHAKI", delivering_party: "INSPECTUS ON BEHALF OF NEPTUNE LINES", receiving_party: "INSPECTUS ON BEHALF OF FRIKUS", location: "PORT OF KOPER" };
  const aoa = toVinFilajAOA(vehicles, header, 7);
  // header block
  expect(aoa[0]).toEqual(["DATE:", "10.05.2026"]);
  expect(aoa[1]).toEqual(["TRANSPORT ID:", "NEPTUNE ITHAKI"]);
  expect(aoa[5]).toEqual(["LOCATION:", "PORT OF KOPER"]);
  expect(aoa[8]).toEqual(["", "X"]);
  // row 13 (index 12) sub-headers: MODEL, VIN, then 7 × PART/TYPE/SEVERITY/COMMENTS = 30 cols
  expect(aoa[12].slice(0, 6)).toEqual(["MODEL", "VIN", "PART", "TYPE", "SEVERITY", "COMMENTS"]);
  expect(aoa[12]).toHaveLength(2 + 7 * 4);
  // first vehicle row (index 13)
  const abcRow = aoa.find(r => r && r[1] === "ABC");
  expect(abcRow[0]).toBe("FORD TRANSIT");
  expect(abcRow[2]).toBe("03");          // PART 1
  expect(abcRow[5]).toBe("");            // COMMENTS 1 = aggregate (empty: no descriptions on ABC)
  expect(abcRow[6]).toBe("55");          // PART 2
});

// --- Združen Survey Report (client email 2026-06-11): 1 row per vehicle, but EACH DAMAGE gets its
//     OWN columns (PART CODE 1, TYPE CODE 1, PART TEXT 1, TYPE TEXT 1, SEVERITY 1, CLASS 1, COMMENTS 1,
//     PART CODE 2, …) instead of slash-joining damages into shared cells (which was "nepregledno").
//     Vehicle-level meta (MAKE/MODEL, VIN, CAUSE, orderID) stays single (CAUSE/orderID joined only if
//     they differ). The number of damage-sets scales to the most-damaged vehicle; unused slots blank.
//     CLASS still never prints the word "Damage" (→ "—").
test("toGroupedSurveyAOA: wide header — meta once, then numbered per-damage sets", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  expect(aoa[0].slice(0, 11)).toEqual(["MAKE/MODEL","VIN","CAUSE","orderID","PART CODE 1","TYPE CODE 1","PART TEXT 1","TYPE TEXT 1","SEVERITY 1","CLASS 1","COMMENTS 1"]);
  expect(aoa[0].slice(11)).toEqual(["PART CODE 2","TYPE CODE 2","PART TEXT 2","TYPE TEXT 2","SEVERITY 2","CLASS 2","COMMENTS 2"]);
});

test("toGroupedSurveyAOA: one row per vehicle (no vehicle lost)", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  expect(aoa.length).toBe(1 + 2); // header + ABC + XYZ
});

test("toGroupedSurveyAOA: each damage in its OWN columns (not slash-joined); CAUSE differs → joined", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  const abc = aoa.find(r => r[1] === "ABC");
  expect(abc[0]).toBe("FORD TRANSIT");          // MAKE/MODEL single
  expect(abc[2]).toBe("Transport / Warranty");  // CAUSE differs → joined (vehicle meta)
  expect(abc[4]).toBe("03");                    // PART CODE 1
  expect(abc[5]).toBe("12");                    // TYPE CODE 1
  expect(abc[8]).toBe("2");                     // SEVERITY 1
  expect(abc[9]).toBe("Observation");           // CLASS 1
  expect(abc[11]).toBe("55");                   // PART CODE 2
  expect(abc[15]).toBe("1");                    // SEVERITY 2
  expect(abc[16]).toBe("No Damage Evidence");   // CLASS 2
});

test("toGroupedSurveyAOA: Damage CLASS → '—', comment kept; unused damage slots blank", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  const xyz = aoa.find(r => r[1] === "XYZ");
  expect(xyz[4]).toBe("81");          // PART CODE 1
  expect(xyz[9]).toBe("—");           // CLASS 1 (Damage → dash, never the word)
  expect(xyz[10]).toBe("deep chip");  // COMMENTS 1 kept
  expect(xyz[11]).toBe("");           // PART CODE 2 blank (vehicle has only 1 damage)
});

test("toGroupedSurveyAOA: all-Damage vehicle → dashes per set, comments per set, CAUSE constant single", () => {
  const r = [
    { "MAKE/MODEL":"FORD CUSTOM","VIN":"D1","PART CODE":"03","TYPE CODE":"04","SEVERITY":5,"CAUSE":"Transport","CLASS":"Damage","COMMENTS":"STEVEDORE DAMAGE" },
    { "MAKE/MODEL":"FORD CUSTOM","VIN":"D1","PART CODE":"27","TYPE CODE":"04","SEVERITY":3,"CAUSE":"Transport","CLASS":"Damage","COMMENTS":"STEVEDORE DAMAGE" }
  ];
  const aoa = toGroupedSurveyAOA(r, COLUMN_MAP);
  const d1 = aoa.find(x => x[1] === "D1");
  expect(d1[2]).toBe("Transport");          // CAUSE constant → single
  expect(d1[9]).toBe("—");                  // CLASS 1
  expect(d1[10]).toBe("STEVEDORE DAMAGE");  // COMMENTS 1
  expect(d1[16]).toBe("—");                 // CLASS 2
  expect(d1[17]).toBe("STEVEDORE DAMAGE");  // COMMENTS 2
});

test("toGroupedSurveyAOA: blank-VIN rows are skipped (not attached to any vehicle)", () => {
  const r = [{ "MAKE/MODEL":"FORD","VIN":"","PART CODE":"03","TYPE CODE":"04","SEVERITY":1,"CAUSE":"Transport","CLASS":"Observation","COMMENTS":"" }];
  const aoa = toGroupedSurveyAOA(r, COLUMN_MAP);
  expect(aoa.length).toBe(1); // header only
});
