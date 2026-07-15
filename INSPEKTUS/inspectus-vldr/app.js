import { groupByVin, toVinFilajRows, toVinFilajAOA, maxDamageCount, buildRemarks, toGroupedSurveyAOA } from "/lib/transform.js";
import { renderVLDRCard } from "/lib/vldr.js";
import * as claude from "/lib/claude.js";

const state = {
  columnMap: null,
  vehicles: [],
  rawRows: [],
  maxDamages: 0,
  validation: null,
  summary: null
};

const PIPELINE_STEPS = [
  { id: "parse",    label: "Branje Excel datoteke (SURVEY REPORT)" },
  { id: "urejanje", label: "Pregled in urejanje podatkov" },
  { id: "group",    label: "Združevanje po VIN" },
  { id: "vinfilaj", label: "Priprava VIN-FILAJ (prepare for report)" },
  { id: "vldr",     label: "Generiranje VLDR kartic" },
  { id: "validate", label: "AI validacija (dodatno)" },
  { id: "summary",  label: "Izvršilni povzetek (dodatno)" }
];

const tick = () => new Promise(r => setTimeout(r, 250));

// --- bootstrap ---------------------------------------------------------
fetch("/config/column-map.json").then(r => r.json()).then(m => { state.columnMap = m; applyHeaderDefaults(m); });
renderPipeline();
wireDropZone();
wireTabs();
wireChat();

function applyHeaderDefaults(m) {
  const h = m.header_fields || {};
  const set = (id, v) => { const el = document.getElementById(id); if (el && !el.value) el.value = v || ""; };
  set("hdr-date", h.date);
  set("hdr-transport", h.transport_id);
  set("hdr-delivering", h.delivering_party);
  set("hdr-receiving", h.receiving_party);
  set("hdr-location", h.location);
}

function getHeader() {
  const val = id => (document.getElementById(id)?.value ?? "").trim();
  return {
    date: val("hdr-date"),
    transport_id: val("hdr-transport"),
    delivering_party: val("hdr-delivering"),
    receiving_party: val("hdr-receiving"),
    location: val("hdr-location")
  };
}

// --- pipeline UI -------------------------------------------------------
function renderPipeline() {
  const ol = document.getElementById("pipeline-steps");
  ol.innerHTML = PIPELINE_STEPS.map(s =>
    `<li class="pipeline-step" data-step="${s.id}">
       <span class="pipeline-dot"></span><span>${s.label}</span>
     </li>`).join("");
}

function setStep(id, status) {
  const li = document.querySelector(`[data-step="${id}"]`);
  if (!li) return;
  li.classList.remove("active", "done");
  if (status) li.classList.add(status);
}

// --- drop zone ---------------------------------------------------------
function wireDropZone() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  dropZone.addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("dragover",  e => { e.preventDefault(); dropZone.classList.add("dragover"); });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  });
  fileInput.addEventListener("change", e => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  });
}

// --- tab switching -----------------------------------------------------
function wireTabs() {
  document.getElementById("tabs").addEventListener("click", e => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => {
      const on = b === btn;
      b.classList.toggle("border-[#425060]",   on);
      b.classList.toggle("text-[#425060]",     on);
      b.classList.toggle("border-transparent", !on);
      b.classList.toggle("text-[#6b7280]",     !on);
    });
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
  });
}

// --- Vprašaj po podatkih (filter OR analytical answer) -----------------
function wireChat() {
  document.getElementById("chat-form").addEventListener("submit", async e => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const feedback = document.getElementById("chat-feedback");
    const answerBox = document.getElementById("chat-answer");
    const query = input.value.trim();
    if (!query) return;
    if (!state.vehicles.length) { feedback.textContent = "Najprej naložite SURVEY REPORT."; return; }
    feedback.textContent = "Razmišljam...";
    if (answerBox) { answerBox.classList.add("hidden"); answerBox.textContent = ""; }

    const result = await claude.ask(query, computeChatStats());
    if (result.error) { feedback.textContent = `Napaka: ${result.error}`; return; }
    const j = result.json ?? {};

    // Analytical answer branch
    if (j.answer) {
      feedback.textContent = "";
      if (answerBox) { answerBox.textContent = j.answer; answerBox.classList.remove("hidden"); }
      return;
    }

    // Filter branch
    const filterList = Array.isArray(j.filter) ? j.filter : [];
    if (!filterList.length || j.error) {
      feedback.textContent = "Vprašanja nisem razumel. Poskusi: 'Pokaži vse VINe z resnostjo 3' ali 'Koliko vozil je poškodovanih, v %?'";
      return;
    }
    const filtered = applyFilter(state.vehicles, filterList);
    feedback.textContent = `Filter aktiven: ${filterList.map(f => `${f.field} ${f.op} ${f.value}`).join(" AND ")} → ${filtered.length} vozil`;
    const allVehicles = state.vehicles;
    state.vehicles = filtered;
    state.maxDamages = maxDamageCount(filtered);
    renderVinFilaj();
    renderVLDRs();
    state.vehicles = allVehicles;
    state.maxDamages = maxDamageCount(allVehicles);
  });
}

// Aggregated stats for the analytical-answer branch. Only aggregates leave the browser — no VINs/PII.
function computeChatStats() {
  const vehicles = state.vehicles;
  const classDist = { "No Damage Evidence": 0, "Damage": 0, "Observation": 0 };
  const sevHist = { 1: 0, 2: 0, 3: 0 };
  const codeCounts = {};
  const partCounts = {};   // by PART TEXT (e.g. "Bumper/Cover/Ext-Front") so the AI can answer part-name questions
  let totalDamages = 0, vehiclesDamaged = 0, vehiclesWithRemarks = 0;
  const isReal = d => {
    const k = String(d.class ?? "").trim().toLowerCase();
    return k === "damage" || k === "observation";
  };
  for (const v of vehicles) {
    if (v.damages.some(isReal)) vehiclesDamaged++;
    if (buildRemarks(v.damages, " ")) vehiclesWithRemarks++;
    for (const d of v.damages) {
      totalDamages++;
      const cls = String(d.class ?? "").trim() || "(blank)";
      classDist[cls] = (classDist[cls] || 0) + 1;
      if (d.severity in sevHist) sevHist[d.severity]++;
      const code = `${d.part_code}-${d.type_code}`;
      codeCounts[code] = (codeCounts[code] || 0) + 1;
      const pt = String(d.part_text ?? "").trim();
      if (pt) partCounts[pt] = (partCounts[pt] || 0) + 1;
    }
  }
  const topCodes = Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([code, n]) => ({ code, count: n }));
  const topParts = Object.entries(partCounts).sort((a, b) => b[1] - a[1]).slice(0, 15)
    .map(([part, n]) => ({ part, count: n }));
  return {
    vehicle_count: vehicles.length,
    vehicles_damaged: vehiclesDamaged,
    vehicles_with_remarks: vehiclesWithRemarks,
    total_damage_records: totalDamages,
    class_distribution: classDist,
    severity_histogram: sevHist,
    top_damage_codes: topCodes,
    damaged_parts: topParts
  };
}

function applyFilter(vehicles, filterList) {
  if (!filterList.length) return vehicles;
  return vehicles
    .map(v => {
      const filteredDamages = v.damages.filter(d => filterList.every(f => testField({ ...v, ...d }, f)));
      if (!filteredDamages.length) return null;
      return { ...v, damages: filteredDamages };
    })
    .filter(Boolean);
}

function testField(obj, { field, op, value }) {
  const actual = obj[field];
  switch (op) {
    case "eq":       return String(actual).toLowerCase() == String(value).toLowerCase();
    case "gt":       return Number(actual) >  Number(value);
    case "gte":      return Number(actual) >= Number(value);
    case "lt":       return Number(actual) <  Number(value);
    case "lte":      return Number(actual) <= Number(value);
    case "contains": return String(actual).toLowerCase().includes(String(value).toLowerCase());
    default:         return true;
  }
}

// --- main pipeline -----------------------------------------------------
async function handleFile(file) {
  resetUI();
  document.getElementById("pipeline").classList.remove("hidden");
  document.getElementById("results").classList.remove("hidden");

  try {
    setStep("parse", "active");
    if (!/\.xlsx?$/i.test(file.name)) throw new UserError("Pričakujem .xlsx datoteko.");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    if (!wb.SheetNames.length) throw new UserError("Datoteka ne vsebuje delovnih listov.");
    const wantSheet = state.columnMap.source_sheet;
    const sheetName = wb.SheetNames.includes(wantSheet) ? wantSheet : wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const headerOffset = (state.columnMap.source_header_row || 1) - 1;   // 0-indexed start row
    state.rawRows = XLSX.utils.sheet_to_json(sheet, { range: headerOffset, defval: "" });
    if (!state.rawRows.length) throw new UserError("Datoteka ne vsebuje vrstic za obdelavo.");

    const required = state.columnMap.required_columns || Object.values(state.columnMap.source_columns);
    const firstRow = state.rawRows[0];
    const missing = required.filter(col => !(col in firstRow));
    if (missing.length) throw new UserError(`Manjkajo stolpci: ${missing.join(", ")}. Preveri, da je list "${sheetName}" pravi SURVEY REPORT.`);
    setStep("parse", "done");

    // Show data editing panel — user can modify raw rows before grouping
    renderUrejanje();
    setStep("urejanje", "done");

    setStep("group", "active");
    await tick();
    state.vehicles = groupByVin(state.rawRows, state.columnMap);
    state.maxDamages = maxDamageCount(state.vehicles);
    setStep("group", "done");

    // Instant, client-side deliverables FIRST — the file is "out" in ~1s, no waiting on AI.
    setStep("vinfilaj", "active");
    await tick();
    renderVinFilaj();
    renderGrouped();
    renderAnalitika();
    setStep("vinfilaj", "done");

    setStep("vldr", "active");
    await tick();
    renderVLDRs();
    setStep("vldr", "done");

    showReady();   // prominent "done + download" banner, auto-download VIN-FILAJ, scroll to result

    // AI enrichment AFTER — does not block the output.
    setStep("validate", "active");
    const damagePayload = state.vehicles.flatMap((v, vi) =>
      v.damages.map((d, di) => ({ vin: v.vin, row_index: vi * 100 + di, part_code: d.part_code, type_code: d.type_code, severity: d.severity, class: d.class, comments: d.comments }))
    );
    const validation = await claude.validate(damagePayload);
    state.validation = validation;
    renderValidation(validation);
    setStep("validate", "done");

    setStep("summary", "active");
    const stats = computeStats();
    const summary = await claude.summarize(stats);
    state.summary = summary;
    renderSummary(summary);
    setStep("summary", "done");
  } catch (err) {
    if (err instanceof UserError) showError(err.message);
    else { console.error(err); showError("Nepričakovana napaka. Preveri konzolo."); }
  }
}

class UserError extends Error {}

function resetUI() {
  PIPELINE_STEPS.forEach(s => setStep(s.id, ""));
  ["tab-urejanje","tab-vinfilaj","tab-grouped","tab-vldr","tab-summary","tab-validate"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
  const banner = document.getElementById("error-banner");
  if (banner) banner.remove();
  const ready = document.getElementById("ready-banner");
  if (ready) ready.remove();
  document.getElementById("chat-feedback").textContent = "";
}

// File is OUT: prominent success banner at top of results + auto-download VIN-FILAJ + scroll.
function showReady() {
  const results = document.getElementById("results");
  let b = document.getElementById("ready-banner");
  if (!b) { b = document.createElement("div"); b.id = "ready-banner"; results.prepend(b); }
  const n = state.vehicles.length;
  b.className = "mb-5 rounded-xl border-2 border-[#16a34a] bg-[#f0fdf4] px-5 py-4 flex items-center justify-between gap-4 flex-wrap";
  b.innerHTML = `
    <div>
      <div class="text-[#15803d] font-bold text-base">✅ Gotovo — ${n} vozil obdelanih</div>
      <div class="text-[#3f6212] text-sm mt-0.5">VIN-FILAJ.xlsx je pripravljen za prenos. Spodaj: VLDR kartice, povzetek in AI validacija.</div>
    </div>
    <button id="ready-dl" class="shrink-0 bg-[#425060] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#33404e] transition-colors">⬇ Prenesi VIN-FILAJ.xlsx</button>`;
  document.getElementById("ready-dl").addEventListener("click", downloadVinFilaj);
  results.scrollIntoView({ behavior: "smooth", block: "start" });
  // Best-effort auto-download so a file literally "comes out" (some browsers may block; the button always works).
  try { downloadVinFilaj(); } catch (e) { console.error("auto-download blocked", e); }
}

function showError(message) {
  let banner = document.getElementById("error-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "error-banner";
    banner.className = "max-w-6xl mx-auto px-6 mt-4";
    document.querySelector("main").prepend(banner);
  }
  banner.innerHTML = `<div class="bg-[#fdecea] border border-[#f5c2bb] text-[#a01f0a] text-sm rounded-lg px-4 py-3">${escapeHtml(message)}</div>`;
}

// --- Urejanje podatkov render ------------------------------------------
function renderUrejanje() {
  const panel = document.getElementById("tab-urejanje");
  const rows = state.rawRows;
  if (!rows.length) { panel.innerHTML = "<div class='text-[#6b7280] text-sm'>Brez podatkov.</div>"; return; }

  const c = state.columnMap.source_columns;
  const editable = new Set(["vin", "part_code", "type_code", "severity", "class", "comments"]);
  const colDefs = [
    { key: "#",     editable: false },
    { key: c.make_model, editable: false },
    { key: c.vin,       editable: true,  inputType: "text" },
    { key: c.part_code, editable: true,  inputType: "text", style: "w-16" },
    { key: c.type_code, editable: true,  inputType: "text", style: "w-16" },
    { key: c.severity,  editable: true,  inputType: "number", style: "w-16", min: 1, max: 5 },
    { key: c.class,     editable: true,  tag: "select" },
    { key: c.comments,  editable: true,  inputType: "text", style: "w-40" },
    { key: c.cause,     editable: false },
    { key: c.part_text, editable: false },
    { key: c.type_text, editable: false }
  ];

  let html = `<div class="flex items-center justify-between mb-3 flex-wrap gap-2">
    <div class="text-sm text-[#6b7280]">${rows.length} vnosov poškodb · urejajte podatke in kliknite Uporabi spremembe</div>
    <div class="flex gap-2">
      <button id="btn-apply-changes" class="bg-[#16a34a] text-white font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-[#15803d] transition-colors">Uporabi spremembe</button>
      <button id="btn-reset-changes" class="bg-[#6b7280] text-white font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-[#4b5563] transition-colors">Ponastavi</button>
    </div>
  </div>`;

  html += `<div class="editable-scroll"><table class="editable-table">`;
  html += `<thead><tr>${colDefs.map(d => `<th>${escapeHtml(d.key)}</th>`).join("")}</tr></thead><tbody>`;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    html += "<tr>";
    html += `<td class="text-[#9aa3ad] text-xs">${i + 1}</td>`;
    for (const def of colDefs) {
      if (def.key === "#") continue;
      const val = String(r[def.key] ?? "");
      if (def.editable) {
        if (def.tag === "select") {
          const options = state.columnMap.class_values || ["No Damage Evidence", "Damage", "Observation", ""];
          html += `<td><select data-row="${i}" data-col="${def.key}" class="editable-select">`;
          for (const opt of options) {
            html += `<option value="${escapeHtml(opt)}"${val === opt ? " selected" : ""}>${escapeHtml(opt || "(prazno)")}</option>`;
          }
          html += `</select></td>`;
        } else {
          const extra = def.style ? ` class="${def.style}"` : "";
          const minmax = def.min ? ` min="${def.min}" max="${def.max}"` : "";
          html += `<td><input type="${def.inputType}" data-row="${i}" data-col="${def.key}" value="${escapeHtml(val)}"${extra}${minmax}></td>`;
        }
      } else {
        html += `<td class="text-[#6b7280]">${escapeHtml(val)}</td>`;
      }
    }
    html += "</tr>";
  }

  html += `</tbody></table></div>
  <div class="text-xs text-[#6b7280] mt-2">V sivi celici dvokliknite za urejanje · spremenite VIN za prerazporeditev poškodb med vozili</div>`;
  panel.innerHTML = html;

  document.getElementById("btn-apply-changes").addEventListener("click", applyUrejanjeChanges);

  document.getElementById("btn-reset-changes").addEventListener("click", () => {
    // Re-parse the original file — we don't store it, so re-render from current rawRows
    renderUrejanje();
  });
}

function applyUrejanjeChanges() {
  // Read all values from the editable fields
  const c = state.columnMap.source_columns;
  const inputs = document.querySelectorAll("#tab-urejanje input[data-row], #tab-urejanje select[data-row]");
  const updated = {};

  for (const el of inputs) {
    const row = el.dataset.row;
    const col = el.dataset.col;
    if (!updated[row]) updated[row] = {};
    updated[row][col] = el.value.trim();
  }

  // Apply changes to rawRows
  for (const [rowIdx, changes] of Object.entries(updated)) {
    const idx = parseInt(rowIdx, 10);
    if (idx >= 0 && idx < state.rawRows.length) {
      Object.assign(state.rawRows[idx], changes);
    }
  }

  // Re-group and re-render everything
  state.vehicles = groupByVin(state.rawRows, state.columnMap);
  state.maxDamages = maxDamageCount(state.vehicles);

  renderVinFilaj();
  renderGrouped();
  renderVLDRs();
  renderAnalitika();

  // Re-run AI if previously done
  rerunAI();

  // Show success flash
  const btn = document.getElementById("btn-apply-changes");
  if (btn) {
    const original = btn.textContent;
    btn.textContent = "✓ Uporabljeno";
    btn.style.background = "#15803d";
    setTimeout(() => { btn.textContent = original; btn.style.background = ""; }, 1500);
  }
}

async function rerunAI() {
  const summaryBtn = document.getElementById("btn-apply-changes");
  // Re-compute stats and re-summarize
  const damagePayload = state.vehicles.flatMap((v, vi) =>
    v.damages.map((d, di) => ({ vin: v.vin, row_index: vi * 100 + di, part_code: d.part_code, type_code: d.type_code, severity: d.severity, class: d.class, comments: d.comments }))
  );
  const validation = await claude.validate(damagePayload);
  state.validation = validation;
  renderValidation(validation);

  const stats = computeStats();
  const summary = await claude.summarize(stats);
  state.summary = summary;
  renderSummary(summary);
}

// --- VIN-FILAJ render --------------------------------------------------
function renderVinFilaj() {
  const panel = document.getElementById("tab-vinfilaj");
  const rows = toVinFilajRows(state.vehicles);
  if (!rows.length) { panel.innerHTML = "<div class='text-[#6b7280] text-sm'>Brez vozil.</div>"; return; }
  const headers = Object.keys(rows[0]);
  const thead = `<thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.map(r =>
    `<tr>${headers.map(h => `<td>${escapeHtml(r[h] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody>`;
  panel.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm text-[#6b7280]">${rows.length} vozil · ${state.maxDamages} max poškodb · list "prepare for report"</div>
      <button id="dl-vinfilaj" class="bg-[#425060] text-white font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-[#33404e] transition-colors">Prenesi VIN-FILAJ.xlsx</button>
    </div>
    <div class="vinfilaj-scroll"><table class="vinfilaj-table">${thead}${tbody}</table></div>
  `;
  document.getElementById("dl-vinfilaj").addEventListener("click", downloadVinFilaj);
}

function downloadVinFilaj() {
  const maxD = state.columnMap.max_damages || 7;
  const aoa = toVinFilajAOA(state.vehicles, getHeader(), maxD);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = ws["!merges"] || [];
  for (let s = 0; s < maxD; s++) { const c0 = 2 + s * 4; ws["!merges"].push({ s: { r: 11, c: c0 }, e: { r: 11, c: c0 + 3 } }); }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, state.columnMap.vin_filaj_sheet || "prepare for report");
  XLSX.writeFile(wb, "VIN-FILAJ.xlsx");
}

// --- Združen Survey Report (1 vozilo = 1 vrstica, isti SURVEY REPORT stolpci) ----------
function renderGrouped() {
  const panel = document.getElementById("tab-grouped");
  if (!panel) return;
  const aoa = toGroupedSurveyAOA(state.rawRows, state.columnMap);
  if (aoa.length <= 1) { panel.innerHTML = "<div class='text-[#6b7280] text-sm'>Brez vozil.</div>"; return; }
  const [header, ...rows] = aoa;
  const thead = `<thead><tr>${header.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.map(r => `<tr>${r.map(cell => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`).join("")}</tbody>`;
  panel.innerHTML = `
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <div class="text-sm text-[#6b7280]">${rows.length} vozil · vse poškodbe vozila združene v eno vrstico (isti SURVEY REPORT stolpci)</div>
      <button id="dl-grouped" class="bg-[#425060] text-white font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-[#33404e] transition-colors">⬇ Prenesi Združen Survey Report.xlsx</button>
    </div>
    <div class="vinfilaj-scroll"><table class="vinfilaj-table">${thead}${tbody}</table></div>`;
  document.getElementById("dl-grouped").addEventListener("click", downloadGroupedSurvey);
}

function downloadGroupedSurvey() {
  const aoa = toGroupedSurveyAOA(state.rawRows, state.columnMap);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Zdruzen Survey Report");
  XLSX.writeFile(wb, "Zdruzen-Survey-Report.xlsx");
}

// --- VLDR cards render -------------------------------------------------
function renderVLDRs() {
  const panel = document.getElementById("tab-vldr");
  const header = getHeader();
  const cards = state.vehicles.map(v =>
    `<div class="mb-6">
       ${renderVLDRCard(v, header)}
       <button class="dl-vldr mt-2 bg-[#425060] text-white hover:bg-[#33404e] text-xs px-3 py-1.5 rounded" data-vin="${escapeHtml(v.vin)}">Prenesi JPG</button>
     </div>`
  ).join("");
  panel.innerHTML = `
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="text-sm text-[#6b7280]">${state.vehicles.length} VLDR kartic</div>
      <button id="dl-all-vldr" class="bg-[#16a34a] text-white font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-[#15803d] transition-colors">⬇ Prenesi vse VLDR (ZIP)</button>
    </div>
    <div class="space-y-6">${cards}</div>`;
  panel.querySelectorAll(".dl-vldr").forEach(btn => {
    btn.addEventListener("click", async () => {
      const vin = btn.dataset.vin;
      const card = panel.querySelector(`.vldr-card[data-vin="${vin}"]`);
      const canvas = await html2canvas(card, { scale: 2, backgroundColor: "#ffffff" });
      const url = canvas.toDataURL("image/jpeg", 0.95);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VLDR-${vin}.jpg`;
      document.body.appendChild(a); a.click(); a.remove();
    });
  });
  document.getElementById("dl-all-vldr").addEventListener("click", downloadAllVldr);
}

// Export every VLDR card into one ZIP — no per-card clicking (client 2026-06-17).
async function downloadAllVldr() {
  const panel = document.getElementById("tab-vldr");
  const cards = Array.from(panel.querySelectorAll(".vldr-card"));
  if (!cards.length) return;
  const btn = document.getElementById("dl-all-vldr");
  const original = btn.textContent;
  btn.disabled = true;
  try {
    const zip = new JSZip();
    const pad = String(cards.length).length;
    let failed = 0;
    let firstError = null;

    // Inline the shared card images ONCE as data URIs. Every card embeds the same eu6546 form
    // background (~23 MB decoded) + 2 signature stamps; letting html2canvas load them itself means
    // ~3 fetches/decodes PER card (~940 for 314 cards) → renders fail under the pressure and the ZIP
    // comes out empty. One decode, reused via onclone, kills that failure mode.
    const assetCache = new Map();
    const assetToDataUri = async (u) => {
      if (assetCache.has(u)) return assetCache.get(u);
      const blob = await (await fetch(u)).blob();
      const data = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(blob);
      });
      assetCache.set(u, data);
      return data;
    };
    const srcs = new Set();
    cards[0].querySelectorAll("img").forEach(im => { const s = im.getAttribute("src"); if (s && !s.startsWith("data:")) srcs.add(s); });
    for (const s of srcs) { try { await assetToDataUri(s); } catch (_) { /* fall back to network for this src */ } }

    // ROOT CAUSE (reproduced at N=314): all cards render live in one ~337,000 px column, each with a
    // 2030×2873 (~23 MB decoded) form background. The browser can't hold 314 decoded copies, evicts /
    // never lays out most cards → they measure 0×0 → html2canvas returns a 0×0 canvas → toBlob() returns
    // NULL (no throw) → every card fails → EMPTY ZIP. Fix: render each card in a VISIBLE OFFSCREEN HOST,
    // one at a time, so a fresh laid-out clone always has real dimensions. Verified 314/314, 0 failures.
    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:fixed;left:-100000px;top:0;z-index:-1;opacity:0;pointer-events:none;";
    document.body.appendChild(host);

    try {
    for (let i = 0; i < cards.length; i++) {
      btn.textContent = `Pripravljam ${i + 1}/${cards.length}…`;
      const card = cards[i];
      // INDEX prefix → a unique filename per card even when VINs repeat or are blank. (Was just the
      // VIN, so a report with a repeated/placeholder VIN wrote every card to the same name and JSZip
      // kept only ONE → the "ZIP has only one file" bug. Index also sorts the files in card order.)
      const vin = (card.dataset.vin || "").replace(/[^A-Za-z0-9._-]/g, "");
      const fname = `VLDR-${String(i + 1).padStart(pad, "0")}${vin ? "-" + vin : ""}.jpg`;
      // Clone into the visible host and swap in the inlined (data-URI) images so it paints at once.
      const clone = card.cloneNode(true);
      clone.querySelectorAll("img").forEach(im => { const s = im.getAttribute("src"); if (s && assetCache.has(s)) im.setAttribute("src", assetCache.get(s)); });
      host.appendChild(clone);
      await new Promise(r => setTimeout(r, 0));                 // yield → layout the clone + paint progress
      // scale 1.5 / q0.85 keeps big batches (300+ vehicles) legible without ballooning size.
      try {
        const canvas = await html2canvas(clone, { scale: 1.5, backgroundColor: "#ffffff", imageTimeout: 0, logging: false });
        const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.85));
        canvas.width = canvas.height = 0;                       // free the canvas promptly
        if (blob && blob.size > 0) zip.file(fname, blob);
        else failed++;
      } catch (e) { failed++; if (!firstError) firstError = e; console.error("card export failed", fname, e); }  // one bad card ≠ total failure
      finally { host.removeChild(clone); }                     // free the clone (and its 23 MB bg) now
    }
    } finally { host.remove(); }
    // Never download an empty archive — if every card failed, say why (almost always memory).
    if (failed >= cards.length) {
      const why = firstError && firstError.message ? ` (${firstError.message})` : "";
      throw new Error(`Nobene od ${cards.length} kartic ni bilo mogoče izvoziti${why}. Najverjetneje je zmanjkalo pomnilnika — zapri druge zavihke/aplikacije in poskusi znova, ali izvozi v manjših sklopih.`);
    }
    btn.textContent = "Pakiram ZIP…";
    // STORE, not DEFLATE — the entries are already-compressed JPEGs; re-deflating burns CPU and a
    // second big buffer for ~0 gain.
    const content = await zip.generateAsync({ type: "blob", compression: "STORE" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url; a.download = "VLDR-kartice.zip";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    if (failed > 0) alert(`Izvoženih ${cards.length - failed} od ${cards.length} kartic. ${failed} kartic ni bilo mogoče izvoziti.`);
  } catch (e) {
    console.error("ZIP export failed", e);
    alert(e && e.message ? e.message : "Izvoz vseh VLDR kartic ni uspel. Poskusi posamično.");
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
}

// --- AI validation render ----------------------------------------------
function renderValidation(result) {
  const panel = document.getElementById("tab-validate");
  if (result.error) {
    panel.innerHTML = `<div class="text-[#b45309] text-sm">AI validacija ni dosegljiva: ${escapeHtml(result.error)}. VIN-FILAJ in VLDR še vedno delujeta.</div>`;
    return;
  }
  const issues = result.json?.issues ?? [];
  if (!issues.length) {
    panel.innerHTML = `<div class="text-[#3a7d00] text-sm">Brez najdenih nepravilnosti. ✓</div>`;
    return;
  }
  panel.innerHTML = `
    <div class="text-sm text-[#6b7280] mb-3">${issues.length} najdenih nepravilnosti:</div>
    <ul class="space-y-2">
      ${issues.map(i => `
        <li class="bg-white border border-[#e0e4e8] rounded-lg p-3 text-sm shadow-sm">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[#425060] font-mono text-xs uppercase font-semibold">${escapeHtml(i.kind || "issue")}</span>
            <span class="text-[#9aa3ad] text-xs">VIN ${escapeHtml(i.vin || "")} · vrstica ${i.row_index ?? "?"}</span>
          </div>
          <div class="text-[#333333]">${escapeHtml(i.message || "")}</div>
          ${i.suggestion ? `<div class="text-[#6b7280] text-xs mt-1">Predlog: ${escapeHtml(i.suggestion)}</div>` : ""}
        </li>`).join("")}
    </ul>`;
}

// --- summary render ----------------------------------------------------
function computeStats() {
  const classDist = {};
  const codeCounts = {};
  const sevHist = { 1: 0, 2: 0, 3: 0 };
  let totalDamages = 0;
  for (const v of state.vehicles) {
    for (const d of v.damages) {
      const k = d.class || "(blank)";
      classDist[k] = (classDist[k] || 0) + 1;
      const code = `${d.part_code}-${d.type_code}`;
      codeCounts[code] = (codeCounts[code] || 0) + 1;
      if (d.severity in sevHist) sevHist[d.severity]++;
      totalDamages++;
    }
  }
  const topCodes = Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    vehicle_count: state.vehicles.length,
    total_damages: totalDamages,
    damage_class_dist: classDist,
    severity_histogram: sevHist,
    top_damage_codes: topCodes
  };
}

function renderSummary(result) {
  const panel = document.getElementById("tab-summary");
  if (result.error) {
    panel.innerHTML = `<div class="text-[#b45309] text-sm">Povzetek trenutno ni dosegljiv: ${escapeHtml(result.error)}.</div>`;
    return;
  }
  const text = result.text || "";
  panel.innerHTML = `
    <div class="bg-white border border-[#e0e4e8] rounded-lg p-5 leading-relaxed text-[#333333] text-sm whitespace-pre-wrap shadow-sm">
      ${escapeHtml(text)}
    </div>`;
}

// --- Analitika (graphical analysis — client 2026-06-17) ----------------
function renderAnalitika() {
  const panel = document.getElementById("tab-analitika");
  if (!panel) return;
  if (!state.vehicles.length) { panel.innerHTML = "<div class='text-[#6b7280] text-sm'>Brez podatkov.</div>"; return; }
  const s = computeChatStats();

  const bar = (label, value, max, color) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return `<div class="flex items-center gap-3 mb-1.5">
      <div class="w-44 shrink-0 text-xs text-[#425060] truncate" title="${escapeHtml(label)}">${escapeHtml(label)}</div>
      <div class="flex-1 bg-[#eef1f3] rounded h-5 overflow-hidden"><div class="h-full rounded" style="width:${pct}%;background:${color};"></div></div>
      <div class="w-10 shrink-0 text-xs text-[#6b7280] text-right">${value}</div>
    </div>`;
  };
  const section = (title, rowsHtml) =>
    `<div class="bg-white border border-[#e0e4e8] rounded-xl p-5 shadow-sm mb-5"><h3 class="text-sm font-bold text-[#2a3340] mb-3">${title}</h3>${rowsHtml}</div>`;

  const cls = s.class_distribution || {};
  const clsRows = [["Damage", cls["Damage"] || 0, "#dc2626"], ["Observation", cls["Observation"] || 0, "#f59e0b"], ["No Damage Evidence", cls["No Damage Evidence"] || 0, "#16a34a"]];
  const clsMax = Math.max(1, ...clsRows.map(e => e[1]));

  const sev = s.severity_histogram || {};
  const sevRows = [["Resnost 1 (manjša)", sev[1] || 0, "#86bc25"], ["Resnost 2 (srednja)", sev[2] || 0, "#f59e0b"], ["Resnost 3 (večja)", sev[3] || 0, "#dc2626"]];
  const sevMax = Math.max(1, ...sevRows.map(e => e[1]));

  const parts = s.damaged_parts || [];
  const partMax = Math.max(1, ...parts.map(p => p.count));
  const partRows = parts.length ? parts.map(p => bar(p.part, p.count, partMax, "#425060")).join("") : "<div class='text-xs text-[#9aa3ad]'>Ni podatkov o delih (PART TEXT).</div>";

  const kpis = [["Vozil skupaj", s.vehicle_count], ["Poškodovanih vozil", s.vehicles_damaged], ["Z opombami", s.vehicles_with_remarks], ["Zapisov poškodb", s.total_damage_records]];
  const kpiHtml = `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">${kpis.map(([l, v]) =>
    `<div class="bg-[#f5f7f9] rounded-xl p-4"><div class="text-[11px] uppercase tracking-wider text-[#6b7280]">${l}</div><div class="text-2xl font-bold text-[#2a3340] mt-1">${v}</div></div>`).join("")}</div>`;

  panel.innerHTML = kpiHtml
    + section("Poškodbe po razredu", clsRows.map(([l, v, c]) => bar(l, v, clsMax, c)).join(""))
    + section("Poškodbe po resnosti", sevRows.map(([l, v, c]) => bar(l, v, sevMax, c)).join(""))
    + section("Najpogosteje poškodovani deli", partRows);
}

// --- util --------------------------------------------------------------
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
