// Group SURVEY REPORT rows (1 row = 1 damage) into vehicles (1 = 1 VIN) with damages[].
// Reads real INSPECTUS column names from column-map.json (source_columns).
export function groupByVin(rows, columnMap) {
  const c = columnMap.source_columns;
  const vehicles = new Map();
  for (const row of rows) {
    const vin = String(row[c.vin] ?? "").trim();
    if (!vin) continue;
    if (!vehicles.has(vin)) {
      vehicles.set(vin, { vin, make_model: String(row[c.make_model] ?? "").trim(), damages: [] });
    }
    vehicles.get(vin).damages.push({
      part_code: String(row[c.part_code] ?? "").trim(),
      type_code: String(row[c.type_code] ?? "").trim(),
      severity:  row[c.severity] ?? "",
      class:     String(row[c.class] ?? "").trim(),
      comments:  String(row[c.comments] ?? "").trim(),
      part_text: String(row[c.part_text] ?? "").trim(),
      type_text: String(row[c.type_text] ?? "").trim(),
      cause:     String(row[c.cause] ?? "").trim()
    });
  }
  return Array.from(vehicles.values());
}

export function maxDamageCount(vehicles) {
  return vehicles.reduce((m, v) => Math.max(m, v.damages.length), 0);
}

// Aggregate REMARKS for a vehicle, per INSPECTUS convention (see VIN-FILAJ / VLDR-1).
// INSPECTUS rule (client → Ian, 2026-07-22 — CORRECTS the 2026-07-20 over-removal: that build
// wrongly stripped "Observation" / "No Damage Evidence" too, and the client relies on both).
// A damage reaches Remarks when it has something to say — an inspector COMMENT and/or a CLASS
// that is not the bare word "Damage":
//   • the standalone CLASS "Damage" is NEVER printed (banned since the Friday meeting)
//   • "Observation" and "No Damage Evidence" ARE printed — the client wants them back (2026-07-22)
//   • a damage whose only class is "Damage" with no comment writes NOTHING (no code, no word) —
//     this is the one part of the 2026-07-20 change that stays (client's phone request that day)
// descriptor = "{COMMENT, }{CLASS≠Damage}"; a Damage-with-no-comment therefore has an empty
// descriptor and is dropped entirely, while every other damage is listed.
//   single-damage vehicle -> "{descriptor}"        e.g. "OBSERVATION", "DEEP CHIP"  ("" if none)
//   multi-damage vehicle  -> "{PART}-{TYPE}{sep}{descriptor}" for the described damages, " / "-joined
//                            e.g. "03-09: NO DAMAGE EVIDENCE / 81-34: OBSERVATION"
// sep = " " for the VIN-FILAJ export, ": " for the on-card VLDR remarks box.

export const SLOTS_PER_ROW = 7;  // fixed: 7 damage slots per row (matches PRINT VLDR template)

export function buildRemarks(damages, sep = " ") {
  const parts = damages
    .map(d => {
      // Suppress ONLY the standalone class "Damage" (case-insensitive); keep every comment and
      // every other class ("Observation", "No Damage Evidence", …).
      const classLabel = String(d.class ?? "").trim().toLowerCase() === "damage" ? "" : String(d.class ?? "").trim();
      const descriptor = [String(d.comments ?? "").trim(), classLabel].filter(Boolean).join(", ");
      return { code: `${d.part_code}-${d.type_code}`, descriptor };
    })
    .filter(p => p.descriptor);   // a "Damage" with no comment has nothing to say → not listed
  if (!parts.length) return "";
  // A one-damage vehicle keeps the approved VIN-FILAJ look: the descriptor alone, no code prefix.
  const s = damages.length === 1
    ? parts[0].descriptor
    : parts.map(p => `${p.code}${sep}${p.descriptor}`).join(" / ");
  return s.toUpperCase();
}

// Združen Survey Report (client email 2026-06-11): one row per vehicle, but EACH DAMAGE gets its own
// set of columns — PART CODE 1, TYPE CODE 1, PART TEXT 1, TYPE TEXT 1, SEVERITY 1, CLASS 1, COMMENTS 1,
// PART CODE 2, … — instead of slash-joining every damage into shared cells (which the client found
// unreadable / "nepregledno"). Vehicle-level meta (MAKE/MODEL, VIN, CAUSE, orderID) stays single:
// identity collapses to one value, CAUSE/orderID collapse when constant else join. The number of
// damage-sets scales to the most-damaged vehicle; unused slots are blank. CLASS still never prints the
// word "Damage" → "—". Column names come from column-map.json (source_columns) so a schema change is a
// config edit, not code.
const GROUPED_META = ["make_model","vin","cause","order_id"];          // vehicle-level, single columns
const GROUPED_IDENTITY = new Set(["make_model","vin"]);                 // always one value (never joined)
const GROUPED_PER_DAMAGE = ["part_code","type_code","part_text","type_text","severity","class","comments"];

export function toGroupedSurveyAOA(rows, columnMap) {
  const c = columnMap.source_columns;
  const metaKeys = GROUPED_META.filter(k => c[k]);
  const dmgKeys  = GROUPED_PER_DAMAGE.filter(k => c[k]);

  const groups = new Map();                       // group by VIN, preserving order
  for (const row of rows) {
    const vin = String(row[c.vin] ?? "").trim();
    if (!vin) continue;                           // a damage with no VIN can't attach to a vehicle
    if (!groups.has(vin)) groups.set(vin, []);
    groups.get(vin).push(row);
  }
  const maxD = Math.max(0, ...[...groups.values()].map(g => g.length));

  const header = metaKeys.map(k => c[k]);
  for (let i = 1; i <= maxD; i++) for (const k of dmgKeys) header.push(`${c[k]} ${i}`);

  const cell = (d, k) => {
    let v = String(d[c[k]] ?? "").trim();
    if (k === "class" && v.toLowerCase() === "damage") v = "—";       // never the word "Damage"
    return v;
  };

  const aoa = [header];
  for (const damages of groups.values()) {
    const r = [];
    for (const k of metaKeys) {                   // vehicle-level meta
      if (GROUPED_IDENTITY.has(k)) { r.push(String(damages[0][c[k]] ?? "").trim()); continue; }
      const vals = damages.map(d => String(d[c[k]] ?? "").trim());
      const uniq = [...new Set(vals.filter(Boolean))];                 // single if constant, else joined
      r.push(uniq.length <= 1 ? (uniq[0] ?? "") : vals.join(" / "));
    }
    for (let i = 0; i < maxD; i++) {              // one column-set per damage
      const d = damages[i];
      for (const k of dmgKeys) r.push(d ? cell(d, k) : "");
    }
    aoa.push(r);
  }
  return aoa;
}

// On-screen VIN-FILAJ table rows (mirrors the real "prepare for report" columns:
// MODEL, VIN, then PART/TYPE/SEVERITY/COMMENTS per damage slot; slot-1 COMMENTS = aggregate remark).
// When a vehicle has more than SLOTS_PER_ROW damages, continuation rows are added with "↳" marker.
export function toVinFilajRows(vehicles) {
  return vehicles.flatMap(v => {
    const totalBlocks = Math.ceil(v.damages.length / SLOTS_PER_ROW);
    const result = [];
    for (let block = 0; block < Math.max(1, totalBlocks); block++) {
      const row = {};
      if (block === 0) {
        row["MODEL"] = v.make_model;
        row["VIN"]   = v.vin;
      } else {
        row["MODEL"] = "↳ (nadaljevanje)";
        row["VIN"]   = "";
      }
      for (let i = 0; i < SLOTS_PER_ROW; i++) {
        const di = block * SLOTS_PER_ROW + i;
        const d  = v.damages[di];
        const n  = i + 1;
        row[`PART ${n}`]     = d ? d.part_code : "";
        row[`TYPE ${n}`]     = d ? d.type_code : "";
        row[`SEVERITY ${n}`] = d ? d.severity  : "";
        row[`COMMENTS ${n}`] = (block === 0 && i === 0) ? buildRemarks(v.damages, " ") : "";
      }
      result.push(row);
    }
    return result;
  });
}

// Build the exact "prepare for report" sheet as an array-of-arrays, byte-compatible
// with INSPECTUS's PRINT VLDR.xlsx template (which pulls by absolute cell ref from row 14+).
// When a vehicle has more than SLOTS_PER_ROW damages, continuation rows are added with "↳" marker.
export function toVinFilajAOA(vehicles, header = {}, maxDamages = SLOTS_PER_ROW) {
  const rows = [];
  rows[0]  = ["DATE:", header.date || ""];
  rows[1]  = ["TRANSPORT ID:", header.transport_id || ""];
  rows[2]  = ["DELIVERING PARTY", header.delivering_party || ""];
  rows[3]  = ["DEL. SIGN."];
  rows[4]  = ["RECEIVING PARTY", header.receiving_party || ""];
  rows[5]  = ["LOCATION:", header.location || ""];
  rows[6]  = [];
  rows[7]  = [];
  rows[8]  = ["", "X"];                 // B9 = mode-of-arrival marker
  rows[9]  = [];
  rows[10] = [];
  const slotNums = ["", ""];            // row 12: slot numbers, 4 cols each, from col C
  for (let s = 1; s <= maxDamages; s++) for (let k = 0; k < 4; k++) slotNums.push(s);
  rows[11] = slotNums;
  const hdr = ["MODEL", "VIN"];         // row 13: sub-headers
  for (let s = 0; s < maxDamages; s++) hdr.push("PART", "TYPE", "SEVERITY", "COMMENTS");
  rows[12] = hdr;

  let dataRowIdx = 13;
  vehicles.forEach(v => {
    const totalBlocks = Math.ceil(v.damages.length / maxDamages);
    for (let block = 0; block < Math.max(1, totalBlocks); block++) {
      const r = [];
      if (block === 0) {
        r.push(v.make_model, v.vin);
      } else {
        r.push("↳", "");   // continuation marker — same vehicle, follow-up row
      }
      for (let i = 0; i < maxDamages; i++) {
        const di = block * maxDamages + i;
        const d  = v.damages[di];
        r.push(d ? d.part_code : "", d ? d.type_code : "", d ? d.severity : "");
        // COMMENTS: only in the first slot of the main row (contains buildRemarks for all damages)
        r.push((block === 0 && i === 0) ? buildRemarks(v.damages, " ") : "");
      }
      rows[dataRowIdx++] = r;
    }
  });

  return rows;
}
