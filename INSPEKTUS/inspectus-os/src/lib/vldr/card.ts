// @ts-nocheck
import { buildRemarks } from "./transform";

// Pixel-faithful clone of INSPECTUS's Ford "Vehicle Loss and Damage Report" form, version EU 6546
// (the blank template Tihomir sent, 2026-06-11). The real scanned form is the base layer; dynamic
// data is overlaid at coordinates calibrated against the form's own grid lines:
//   • Model + Serial No. (VIN)
//   • the 4 damage columns — Position Code (part), Damage Code (type), Severity Code — filled
//     column-major (column 1 top→bottom, then 2, 3, 4); capacity 4 × 6 = 24 damages
//   • Remarks (per the INSPECTUS rule — "Damage"-class entries omitted unless they carry a comment)
//   • Delivering / Receiving carrier, vessel name, date
//   • the INSPECTUS logo + signature extracted from their PRINT VLDR (image6) — a mandatory part of
//     the VLDR — placed in both Signature rows.
// Exports to a VIN-named JPG via html2canvas exactly like before.

const FORM_W = 760;                                  // card render width (px)
const FORM_H = Math.round(FORM_W * 2873 / 2030);     // keep the A4-portrait aspect of eu6546-form.png

// Damage-cell centres, in % of form W/H (4 columns × 6 rows).
const DMG_COL_X = [
  { pos: 26.8, dmg: 31.7, sev: 38.7 },   // column 1
  { pos: 45.7, dmg: 50.6, sev: 57.7 },   // column 2
  { pos: 64.7, dmg: 69.6, sev: 76.7 },   // column 3
  { pos: 83.6, dmg: 88.5, sev: 95.4 }    // column 4
];
const DMG_ROW_Y = [51.2, 53.5, 55.8, 58.1, 60.3, 62.6];
const DMG_CAPACITY = DMG_COL_X.length * DMG_ROW_Y.length;   // 24

export function renderVLDRCard(vehicle, header = {}) {
  const date = header.date || new Date().toISOString().slice(0, 10);
  const els = [];

  // Model + Serial No. (VIN)
  els.push(text(10, 13.4, vehicle.make_model, { size: 13, weight: 700 }));
  els.push(text(10, 16.5, vehicle.vin,        { size: 12, weight: 700, mono: true }));

  // Damage codes — column-major fill across the 4 numbered columns
  vehicle.damages.slice(0, DMG_CAPACITY).forEach((d, i) => {
    const c = DMG_COL_X[Math.floor(i / DMG_ROW_Y.length)];
    const y = DMG_ROW_Y[i % DMG_ROW_Y.length];
    els.push(center(c.pos, y, d.part_code, { size: 10.5, mono: true, weight: 700 }));
    els.push(center(c.dmg, y, d.type_code, { size: 10.5, mono: true, weight: 700 }));
    els.push(center(c.sev, y, fmtSev(d.severity), { size: 10.5, mono: true, weight: 700 }));
  });
  if (vehicle.damages.length > DMG_CAPACITY)
    els.push(text(25, 64.6, `+${vehicle.damages.length - DMG_CAPACITY} poškodb v opombah`, { size: 8, color: "#555" }));

  // Remarks (INSPECTUS rule applied inside buildRemarks)
  const remarks = buildRemarks(vehicle.damages, ": ");
  if (remarks) els.push(block(25, 67.4, 73, remarks, { size: 9.5 }));

  // Bottom carrier / inspector block. Value-cell centres (the value column is subdivided finer than
  // the label column): Delivering 81.9 · Truck/Ship 83.85 · Sig 85.75 · Receiving 90.0 · Sig 95.15 · Date 97.3
  els.push(text(44.5, 81.9,  header.delivering_party, { size: 9.5, weight: 700 }));
  els.push(text(44.5, 83.85, header.transport_id,     { size: 9.5 }));            // Truck No./Ship = vessel
  els.push(text(44.5, 90.0,  header.receiving_party,  { size: 9.5, weight: 700 }));
  els.push(text(44.5, 97.3,  date, { size: 10, weight: 600 }));

  // INSPECTUS logo + signature (extracted from PRINT VLDR.xlsx, image6) — mandatory on the VLDR.
  els.push(img(45.5, 85.75, "/inspectus-signature.jpeg", 30));   // delivering carrier signature
  els.push(img(45.5, 95.15, "/inspectus-signature.jpeg", 30));   // inspector signature

  return `<div class="vldr-card" data-vin="${esc(vehicle.vin)}" style="position:relative;width:${FORM_W}px;height:${FORM_H}px;background:#fff;font-family:'Open Sans',Arial,sans-serif;color:#111;overflow:hidden;">
    <img src="/eu6546-form.png" alt="EU 6546" style="position:absolute;inset:0;width:100%;height:100%;display:block;">
    ${els.join("")}
  </div>`;
}

// --- positioning helpers (coordinates are % of the form) ---------------
function baseStyle(x, y, o) {
  const font = o.mono ? "ui-monospace,Menlo,Consolas,monospace" : "'Open Sans',Arial,sans-serif";
  return `position:absolute;left:${x}%;top:${y}%;font-family:${font};font-size:${o.size || 10}px;`
    + `font-weight:${o.weight || 400};color:${o.color || "#111"};`;
}
// left-aligned, vertically centred on y, single line
function text(x, y, t, o = {}) {
  if (t === undefined || t === null || t === "") return "";
  return `<div style="${baseStyle(x, y, o)}transform:translateY(-50%);white-space:nowrap;">${esc(t)}</div>`;
}
// centred horizontally + vertically on (x,y)
function center(x, y, t, o = {}) {
  if (t === undefined || t === null || t === "") return "";
  return `<div style="${baseStyle(x, y, o)}transform:translate(-50%,-50%);white-space:nowrap;text-align:center;">${esc(t)}</div>`;
}
// left-aligned, top-anchored, wraps within wPct width
function block(x, y, wPct, t, o = {}) {
  if (!t) return "";
  return `<div style="${baseStyle(x, y, o)}width:${wPct}%;line-height:1.3;">${esc(t)}</div>`;
}
// image, left-aligned, vertically centred on y, fixed pixel height
function img(x, y, src, hPx) {
  return `<img src="${src}" alt="" style="position:absolute;left:${x}%;top:${y}%;height:${hPx}px;transform:translateY(-50%);">`;
}

function fmtSev(s) {
  const v = String(s ?? "").trim();
  return v === "" ? "" : v;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
