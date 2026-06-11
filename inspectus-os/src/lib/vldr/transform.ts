// @ts-nocheck

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
// INSPECTUS rule (Friday meeting + their approved VIN-FILAJ): the standalone CLASS "Damage"
// must NEVER be written in column F. The damage is still listed via its PART-TYPE code +
// the inspector's free-text COMMENT — only the literal classification word is dropped.
// "No Damage Evidence" and "Observation" are written unchanged.
//   single damage -> "{COMMENT, }{CLASS≠Damage}"  (falls back to "{PART}-{TYPE}" if that is empty)
//                    e.g. "NO DAMAGE EVIDENCE", "OTTD", "12-12"
//   multi damage  -> "{PART}-{TYPE}[ {COMMENT, }{CLASS≠Damage}]" joined by " / "
//                    e.g. "03-09 NO DAMAGE EVIDENCE / 81-12 / 81-34 OBSERVATION"
// sep = " " for the VIN-FILAJ export, ": " for the on-card VLDR remarks box.

export const SLOTS_PER_ROW = 7;  // fixed: 7 damage slots per row (matches PRINT VLDR template)

export function buildRemarks(damages, sep = " ") {
  const parts = damages.map(d => {
    // Suppress only the standalone classification "Damage" (case-insensitive); keep comments + other classes.
    const classLabel = String(d.class ?? "").trim().toLowerCase() === "damage" ? "" : d.class;
    const descriptor = [d.comments, classLabel].filter(Boolean).join(", ");
    return { code: `${d.part_code}-${d.type_code}`, descriptor };
  });
  const s = parts.length === 1
    ? (parts[0].descriptor || parts[0].code)
    : parts.map(p => p.descriptor ? `${p.code}${sep}${p.descriptor}` : p.code).join(" / ");
  return s.toUpperCase();
}

// Grouped SURVEY REPORT (Option A): one row per vehicle, keeping the REAL SURVEY REPORT columns.
// Per-damage columns join positionally with " / " so positions line up across columns
// (PART[i] ↔ TYPE[i] ↔ SEVERITY[i] ↔ CLASS[i] ↔ COMMENTS[i]). Identity columns (make/model, VIN)
// collapse to one value; CAUSE/orderID collapse when constant, else join. INSPECTUS rule: the
// standalone CLASS "Damage" is never written — rendered "—" to keep alignment. A per-damage column
// that is empty for every damage renders as a blank cell (not " / / "). Columns/order come from
// column-map.json (source_columns) so a schema change is a config edit, not code.
const GROUPED_ORDER = ["make_model","vin","part_code","type_code","part_text","type_text","severity","cause","class","comments","order_id"];
const GROUPED_IDENTITY = new Set(["make_model","vin"]);
const GROUPED_PER_DAMAGE = new Set(["part_code","type_code","part_text","type_text","severity","class","comments"]);

export function toGroupedSurveyAOA(rows, columnMap) {
  const c = columnMap.source_columns;
  const keys = GROUPED_ORDER.filter(k => c[k]);   // logical keys present in the map, in order
  const header = keys.map(k => c[k]);             // real column names

  const groups = new Map();                       // group by VIN, preserving order
  for (const row of rows) {
    const vin = String(row[c.vin] ?? "").trim();
    if (!vin) continue;                           // a damage with no VIN can't attach to a vehicle
    if (!groups.has(vin)) groups.set(vin, []);
    groups.get(vin).push(row);
  }

  const aoa = [header];
  for (const damages of groups.values()) {
    aoa.push(keys.map(k => {
      const real = c[k];
      const vals = damages.map(d => {
        let v = String(d[real] ?? "").trim();
        if (k === "class" && v.toLowerCase() === "damage") v = "—";   // never the word "Damage"
        return v;
      });
      if (GROUPED_IDENTITY.has(k)) return vals[0] ?? "";
      if (GROUPED_PER_DAMAGE.has(k)) return vals.every(v => v === "") ? "" : vals.join(" / ");
      const uniq = [...new Set(vals.filter(Boolean))];                 // meta: single if constant
      return uniq.length <= 1 ? (uniq[0] ?? "") : vals.join(" / ");
    }));
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
