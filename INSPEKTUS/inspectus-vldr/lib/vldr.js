import { buildRemarks } from "/lib/transform.js";

// Pixel-faithful clone of INSPECTUS's Ford "Vehicle Loss and Damage Report" form, version EU 6546
// (the blank template Tihomir sent, 2026-06-11). The real scanned form is the base layer; dynamic
// data is overlaid at coordinates calibrated against the form's own grid lines:
//   • Model + Serial No. (VIN) — one clean bordered box per value
//   • the 4 damage columns — Position Code (part), Damage Code (type), Severity Code — filled
//     column-major (column 1 top→bottom, then 2, 3, 4); capacity 4 × 6 = 24 damages
//   • Remarks (per the INSPECTUS rule — "Damage"-class entries omitted unless they carry a comment)
//   • Delivering / Receiving carrier (wrapped in-column), vessel name, date — all COLUMN 1
//   • the INSPECTUS logo + signature extracted from their PRINT VLDR (image6) — a mandatory part of
//     the VLDR — placed in both Signature rows, clear of the vessel name.
// Exports to a VIN-named JPG via html2canvas exactly like before.
// Kept identical to inspectus-os/src/lib/vldr/card.ts (single source of truth for the renderer).

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

  // Model + Serial No. (VIN) — ONE unified box (the form's own cell, x8.67→49.11%, y11.76→18.0%,
  // measured from the form) split by a horizontal divider into two EQUAL cells: model on top,
  // serial below (Ian, 2026-07-06: "make them one big square, same size, joined by a horizontal
  // line between model and serial"). Wipe the form's per-character serial squares first.
  els.push(whiteBox(8.8, 11.5, 41.0, 6.9));
  els.push(twoRowBox(8.7, 11.76, 40.4, 6.24, 0.5,
    vehicle.make_model, vehicle.vin,
    { size: 12.5, weight: 700 }, { size: 13.5, weight: 700, mono: true }));   // serial font larger (Ian, 2026-07-09)

  // Location of Inspection — the header's location (e.g. PORT OF KOPER / PORT OF VENICE, entered in
  // the header form) in column 1 of the Location-of-Inspection row (Ian, 2026-07-09).
  els.push(text(27.5, 44.0, header.location, { size: 9, weight: 600 }));

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

  // Remarks — wrap WITHIN the first Remarks cell (x24.31→43.28%, measured) so long text drops to
  // new lines instead of crossing the vertical divider; stays inside the box (Ian, 2026-07-09).
  const remarks = buildRemarks(vehicle.damages, ": ");
  if (remarks) els.push(block(25, 66.4, 17.5, remarks, { size: 9 }));

  // X centred in the ship-icon cell (cell x33.79→38.55 → centre 36.17; mark-row centre ~79.8;
  // measured from the form — Ian, 2026-07-09: put the X more in the centre of its box).
  els.push(center(36.17, 79.8, "X", { size: 13, weight: 900 }));

  // Bottom carrier / inspector block — all in COLUMN 1 (Ian, 2026-06-26).
  // Carrier names wrap WITHIN column 1 (cell x24.29→43.25%, measured) — width capped at 17% so a
  // long name drops to a 2nd line rather than crossing the vertical divider (Ian, 2026-07-06:
  // "do not let it cross any vertical line — paste it down under the horizontal line").
  // transport_id (vessel) + date stay single-line.
  // Delivering carrier, vessel, receiving carrier all in the SAME font — 8px/700 (Ian, 2026-07-09).
  els.push(wrapCell(25, 80.95, 17, header.delivering_party, { size: 8, weight: 700, lh: 1.08 }));
  els.push(text(25, 83.85, header.transport_id, { size: 8, weight: 700 }));   // Truck No./Ship = vessel
  els.push(wrapCell(25, 88.75, 17, header.receiving_party, { size: 8, weight: 700, lh: 1.08 }));
  els.push(text(25, 97.3,  date, { size: 10, weight: 600 }));

  // INSPECTUS logo + signature (extracted from PRINT VLDR.xlsx, image6) — mandatory on the VLDR.
  // Top-anchored (NO translateY) so the html2canvas JPG export matches the live view, and
  // dropped clear of the vessel name above (Ian, 2026-07-06: the logo was covering the ship
  // name in the downloaded JPG). Both stamps in COLUMN 1.
  els.push(imgTop(26, 84.9, "/inspectus-signature.jpeg", 26));   // delivering carrier signature
  els.push(imgTop(26, 94.0, "/inspectus-signature.jpeg", 26));   // inspector signature

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
// image, left-aligned, TOP-anchored, fixed pixel height (no transform → the live DOM and the
// html2canvas JPG export render it in the same place).
function imgTop(x, y, src, hPx) {
  return `<img src="${src}" alt="" style="position:absolute;left:${x}%;top:${y}%;height:${hPx}px;">`;
}
// opaque white rectangle — covers fixed form lines (e.g. the 11 serial squares)
function whiteBox(x, y, wPct, hPct) {
  return `<div style="position:absolute;left:${x}%;top:${y}%;width:${wPct}%;height:${hPct}%;background:#fff;"></div>`;
}
// value vertically centred + left-padded inside a cell (no border of its own)
function cellText(x, y, wPct, hPct, t, o = {}) {
  const font = o.mono ? "ui-monospace,Menlo,Consolas,monospace" : "'Open Sans',Arial,sans-serif";
  return `<div style="position:absolute;left:${x}%;top:${y}%;width:${wPct}%;height:${hPct}%;box-sizing:border-box;`
    + `display:flex;align-items:center;padding-left:9px;font-family:${font};font-size:${o.size || 12}px;`
    + `font-weight:${o.weight || 700};color:#111;white-space:nowrap;overflow:hidden;">${esc(t)}</div>`;
}
// one bordered box split by a horizontal divider into two equal cells (top value + bottom value)
function twoRowBox(x, y, wPct, hPct, midFrac, top, bot, oTop = {}, oBot = {}) {
  const midY = y + hPct * midFrac;
  return `<div style="position:absolute;left:${x}%;top:${y}%;width:${wPct}%;height:${hPct}%;border:1.3px solid #111;box-sizing:border-box;background:#fff;"></div>`
    + `<div style="position:absolute;left:${x}%;top:${midY}%;width:${wPct}%;height:0;border-top:1.3px solid #111;"></div>`
    + cellText(x, y, wPct, hPct * midFrac, top, oTop)
    + cellText(x, midY, wPct, hPct * (1 - midFrac), bot, oBot);
}
// top-anchored, left-aligned, wraps within wPct — keeps long text inside its column
function wrapCell(x, y, wPct, t, o = {}) {
  if (t === undefined || t === null || t === "") return "";
  return `<div style="position:absolute;left:${x}%;top:${y}%;width:${wPct}%;`
    + `font-family:'Open Sans',Arial,sans-serif;font-size:${o.size || 9}px;font-weight:${o.weight || 400};`
    + `color:#111;line-height:${o.lh || 1.15};white-space:normal;overflow-wrap:break-word;">${esc(t)}</div>`;
}

function fmtSev(s) {
  const v = String(s ?? "").trim();
  return v === "" ? "" : v;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
