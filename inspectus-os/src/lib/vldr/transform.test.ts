import { test, expect } from "bun:test";
import { groupByVin, toVinFilajRows, toVinFilajAOA, maxDamageCount, buildRemarks, toGroupedSurveyAOA } from "./transform";

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

test("buildRemarks: single damage drops the standalone CLASS 'Damage' (descriptor only)", () => {
  const xyz = groupByVin(ROWS, COLUMN_MAP).find(v => v.vin === "XYZ");
  expect(buildRemarks(xyz.damages, " ")).toBe("DEEP CHIP");
});

test("buildRemarks: multi damage = code-prefixed, joined, uppercased", () => {
  const abc = groupByVin(ROWS, COLUMN_MAP).find(v => v.vin === "ABC");
  expect(buildRemarks(abc.damages, " ")).toBe("03-12 OBSERVATION / 55-12 NO DAMAGE EVIDENCE");
  expect(buildRemarks(abc.damages, ": ")).toBe("03-12: OBSERVATION / 55-12: NO DAMAGE EVIDENCE");
});

// --- INSPECTUS rule (their approved VIN-FILAJ + Friday meeting): column F must NEVER contain
//     the standalone CLASS "Damage". The damage stays listed (code + inspector comment); only
//     the word is dropped. "No Damage Evidence" and "Observation" are left unchanged.
test("buildRemarks: single Damage with no comment falls back to the code (never empty, never 'DAMAGE')", () => {
  const damages = [{ part_code: "12", type_code: "12", severity: 3, class: "Damage", comments: "" }];
  expect(buildRemarks(damages, " ")).toBe("12-12");
});

test("buildRemarks: single Damage with a comment shows the comment, drops the word", () => {
  const damages = [{ part_code: "12", type_code: "34", severity: 1, class: "Damage", comments: "OTTD" }];
  expect(buildRemarks(damages, " ")).toBe("OTTD");
});

test("buildRemarks: multi with a Damage record keeps the code, drops the word", () => {
  const damages = [
    { part_code: "03", type_code: "09", severity: 3, class: "No Damage Evidence", comments: "" },
    { part_code: "81", type_code: "12", severity: 2, class: "Damage", comments: "" },
    { part_code: "81", type_code: "34", severity: 1, class: "Observation", comments: "" }
  ];
  expect(buildRemarks(damages, " ")).toBe("03-09 NO DAMAGE EVIDENCE / 81-12 / 81-34 OBSERVATION");
});

test("buildRemarks: all-Damage vehicle keeps inspector comments, drops every 'Damage' label", () => {
  const damages = [
    { part_code: "03", type_code: "04", severity: 5, class: "Damage", comments: "STEVEDORE DAMAGE" },
    { part_code: "27", type_code: "04", severity: 3, class: "Damage", comments: "STEVEDORE DAMAGE" }
  ];
  expect(buildRemarks(damages, " ")).toBe("03-04 STEVEDORE DAMAGE / 27-04 STEVEDORE DAMAGE");
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
  expect(abc["COMMENTS 1"]).toBe("03-12 OBSERVATION / 55-12 NO DAMAGE EVIDENCE");
  expect(abc["COMMENTS 2"]).toBe("");
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
  expect(abcRow[5]).toBe("03-12 OBSERVATION / 55-12 NO DAMAGE EVIDENCE"); // COMMENTS 1 = aggregate
  expect(abcRow[6]).toBe("55");          // PART 2
});

// --- Grouped SURVEY REPORT (Option A): 1 row per vehicle, SAME survey-report columns,
//     per-damage columns joined positionally with " / " (positions align across columns),
//     identity columns single, CLASS never prints "Damage" (→ "—"), all-empty per-damage
//     column → blank, CAUSE/orderID single if constant else joined.
test("toGroupedSurveyAOA: header = real SURVEY REPORT columns in order", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  expect(aoa[0]).toEqual(["MAKE/MODEL","VIN","PART CODE","TYPE CODE","PART TEXT","TYPE TEXT","SEVERITY","CAUSE","CLASS","COMMENTS","orderID"]);
});

test("toGroupedSurveyAOA: one row per vehicle (no vehicle lost)", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  expect(aoa.length).toBe(1 + 2); // header + ABC + XYZ
});

test("toGroupedSurveyAOA: multi-damage joins positionally; identity single; CAUSE differs → joined; empty COMMENTS → blank", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  const abc = aoa.find(r => r[1] === "ABC");
  expect(abc[0]).toBe("FORD TRANSIT");                       // MAKE/MODEL single
  expect(abc[2]).toBe("03 / 55");                            // PART CODE
  expect(abc[3]).toBe("12 / 12");                            // TYPE CODE
  expect(abc[6]).toBe("2 / 1");                              // SEVERITY
  expect(abc[7]).toBe("Transport / Warranty");              // CAUSE differs → joined
  expect(abc[8]).toBe("Observation / No Damage Evidence");  // CLASS (no Damage here)
  expect(abc[9]).toBe("");                                   // COMMENTS all empty → blank
});

test("toGroupedSurveyAOA: single Damage → CLASS '—', comment kept", () => {
  const aoa = toGroupedSurveyAOA(ROWS, COLUMN_MAP);
  const xyz = aoa.find(r => r[1] === "XYZ");
  expect(xyz[2]).toBe("81");          // PART CODE
  expect(xyz[8]).toBe("—");           // CLASS Damage → dash, never the word
  expect(xyz[9]).toBe("deep chip");   // COMMENTS kept
});

test("toGroupedSurveyAOA: all-Damage vehicle → all dashes, comments joined, CAUSE constant single", () => {
  const r = [
    { "MAKE/MODEL":"FORD CUSTOM","VIN":"D1","PART CODE":"03","TYPE CODE":"04","SEVERITY":5,"CAUSE":"Transport","CLASS":"Damage","COMMENTS":"STEVEDORE DAMAGE" },
    { "MAKE/MODEL":"FORD CUSTOM","VIN":"D1","PART CODE":"27","TYPE CODE":"04","SEVERITY":3,"CAUSE":"Transport","CLASS":"Damage","COMMENTS":"STEVEDORE DAMAGE" }
  ];
  const aoa = toGroupedSurveyAOA(r, COLUMN_MAP);
  const d1 = aoa.find(x => x[1] === "D1");
  expect(d1[8]).toBe("— / —");                                // CLASS all Damage → dashes
  expect(d1[9]).toBe("STEVEDORE DAMAGE / STEVEDORE DAMAGE");  // COMMENTS joined
  expect(d1[7]).toBe("Transport");                            // CAUSE constant → single
});

test("toGroupedSurveyAOA: blank-VIN rows are skipped (not attached to any vehicle)", () => {
  const r = [{ "MAKE/MODEL":"FORD","VIN":"","PART CODE":"03","TYPE CODE":"04","SEVERITY":1,"CAUSE":"Transport","CLASS":"Observation","COMMENTS":"" }];
  const aoa = toGroupedSurveyAOA(r, COLUMN_MAP);
  expect(aoa.length).toBe(1); // header only
});
