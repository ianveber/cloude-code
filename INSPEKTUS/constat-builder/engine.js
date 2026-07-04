// Constat engine — turns an "Obdelava" export (Ares data) into one Constat model
// per vehicle, and renders the PSA Joint-Survey form (Option 1).
//
// ┌─ THE GUESS (flip here when Ian confirms) ──────────────────────────────────┐
// │ Which export column fills which grid cell. The form columns are:           │
// │   Élément | CD (Code Dommage) | LD (Localisation Dommage) | T (Taille)      │
// │ Certain:  CD = EXCEPT. TYPE,  T = DIMENZIJA.                                │
// │ Guess:    Élément = PART,     LD = MREŽA   (swap element/ld if wrong).      │
// └────────────────────────────────────────────────────────────────────────────┘
const CONSTAT_MAP = {
  vin: "VIN", model: "MODEL", couleur: "BARVA", transportId: "TRANSPORT ID",
  part: "PART", type: "EXCEPT. TYPE", cls: "CLASS", comments: "COMMENTS",
  grid: { element: "PART", cd: "EXCEPT. TYPE", ld: "MREŽA", t: "DIMENZIJA" },
};

const norm = (s) => String(s ?? "").trim();
const up = (s) => norm(s).toUpperCase().replace(/\s+/g, " ");
const isDamage = (cls) => /damage/i.test(cls) && !/no\s*damage/i.test(cls);
const isObservation = (cls) => /observation/i.test(cls);

// Build a header→index resolver tolerant of case / spacing / trailing dots.
function headerResolver(headerRow) {
  const idx = {};
  headerRow.forEach((h, i) => { idx[up(h).replace(/\.$/, "")] = i; });
  return (name) => {
    const key = up(name).replace(/\.$/, "");
    return key in idx ? idx[key] : -1;
  };
}

// rows: array-of-arrays incl. header row. podatki: { operation, kindOfLocation, inspectionDate, inspectionLocation, lieuExpedition }
function buildConstats(rows, podatki = {}) {
  if (!rows || rows.length < 2) return [];
  const get = headerResolver(rows[0]);
  const col = (r, name) => { const i = get(name); return i < 0 ? "" : norm(r[i]); };

  const byVin = new Map();
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.every((c) => norm(c) === "")) continue;
    const vin = col(row, CONSTAT_MAP.vin);
    if (!vin) continue;
    if (!byVin.has(vin)) {
      byVin.set(vin, {
        vin, model: col(row, CONSTAT_MAP.model), couleur: col(row, CONSTAT_MAP.couleur),
        transportId: col(row, CONSTAT_MAP.transportId),
        gridRows: [], observations: [],
      });
    }
    const v = byVin.get(vin);
    const cls = col(row, CONSTAT_MAP.cls);
    const part = col(row, CONSTAT_MAP.part);
    const type = col(row, CONSTAT_MAP.type);
    const comments = col(row, CONSTAT_MAP.comments);
    if (isDamage(cls)) {
      v.gridRows.push({
        element: col(row, CONSTAT_MAP.grid.element),
        cd: col(row, CONSTAT_MAP.grid.cd),
        ld: col(row, CONSTAT_MAP.grid.ld),
        t: col(row, CONSTAT_MAP.grid.t),
      });
    } else if (isObservation(cls)) {
      // Observation → remarks line, "PART-TYPE (comment)".
      const tag = [part, type].filter(Boolean).join("-");
      v.observations.push(tag + (comments ? ` (${comments})` : ""));
    }
    // else: "No Damage Evidence" / blank class → not rendered.
  }

  let seq = 0;
  return [...byVin.values()].map((v) => ({
    seq: ++seq,
    vin: v.vin, model: v.model, couleur: v.couleur,
    lieuExpedition: podatki.inspectionLocation || podatki.lieuExpedition || "",
    operation: podatki.operation || "unloading",
    kindOfLocation: podatki.kindOfLocation || "compound",
    inspectionDate: podatki.inspectionDate || "",
    inspectionLocation: podatki.inspectionLocation || "",
    gridRows: v.gridRows,
    numberA: v.gridRows.length,
    observationsText: v.observations.join(" "),
  }));
}

// ── Render one Constat page (faithful to the PSA form) ──────────────────────
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const CHK = (on) => (on ? "☒" : "☐");
const GRID_ROWS = 8;          // blank rows in the damage grid
const STAGES = ["A", "B", "C", "D", "E"];

function gridBody(model) {
  let html = "";
  for (let i = 0; i < GRID_ROWS; i++) {
    const d = model.gridRows[i];
    html += "<tr>";
    html += `<td class="g-el">${d ? esc(d.element) : ""}</td>`;
    // Stage A holds the data; B–E stay blank for Option 1.
    html += `<td>${d ? esc(d.cd) : ""}</td><td>${d ? esc(d.ld) : ""}</td><td class="g-sep">${d ? esc(d.t) : ""}</td>`;
    for (let s = 1; s < STAGES.length; s++) html += `<td></td><td></td><td class="g-sep"></td>`;
    html += "</tr>";
  }
  return html;
}

function stagesBlock(model) {
  const unloading = /unload|réception|reception/i.test(model.operation);
  const compound = /compound/i.test(model.kindOfLocation);
  const A = {
    enl: !unloading, rec: unloading, compound,
    date: model.inspectionDate, lieu: model.inspectionLocation, doc: model.transportId,
  };
  const cell = (s) => s === "A" ? A : null;
  const row = (label, sub, fn) =>
    `<tr><th>${label}${sub ? ` <i>${sub}</i>` : ""}</th>` +
    STAGES.map((s) => `<td>${fn(cell(s), s)}</td>`).join("") + "</tr>";

  return `<table class="c-stages">
    ${row("ÉTAPES DE TRANSPORT", "Transport stages", (c) =>
      `<div class="chk">${CHK(c && c.enl)} Enlèvement <i>Collection</i></div>
       <div class="chk">${CHK(c && c.rec)} Réception <i>Receipt</i></div>`)}
    ${row("Lieu du constat", "Kind of location", (c) =>
      `<div class="chk">☐ Usine <i>Factory</i></div>
       <div class="chk">☐ Parc interm. <i>Intermediate</i></div>
       <div class="chk">${CHK(c && c.compound)} Compound</div>`)}
    ${row("Ferroviaire Contrôle P&amp;T", "Rail P&amp;T control (wagon only)", () =>
      `<div class="chk muted">☐ Usine ☐ Transport ☐ Charg./Décharg.</div>`)}
    ${row("Date", "", (c) => esc(c ? c.date : ""))}
    ${row("Lieu", "Location", (c) => esc(c ? c.lieu : ""))}
    ${row("Immat. Camion / N° Wagon", "Truck reg / Wagon n°", () => "")}
    ${row("N° du Doc. de transport", "Delivery note n°", (c) => esc(c ? c.doc : ""))}
    ${row("Cabinet", "Name & company", (c) => c ? "INSPECTUS d.o.o." : "")}
    ${row("Signature", "", () => `<div class="sig"></div>`)}
    ${row("Prenant", "Receiving company", () => "")}
    ${row("Signature", "", () => `<div class="sig"></div>`)}
  </table>`;
}

function renderConstat(model) {
  const numBoxes = STAGES.map((s) =>
    `<div class="numbox"><span>${s}</span><div class="nb">${s === "A" ? esc(model.numberA) : ""}</div></div>`).join("");
  const obsLines = STAGES.map((s) =>
    `<div class="obsline"><span>${s}</span><div class="ol">${s === "A" ? esc(model.observationsText) : ""}</div></div>`).join("");

  return `<div class="constat">
    <div class="c-head">
      <div><div class="c-title-main">CONSTAT A L'ENLÈVEMENT / RÉCEPTION</div>
           <div class="c-title-sub">QUALITY CHECK BEFORE LOADING / AFTER UNLOADING</div></div>
      <div class="c-brand">PSA <b>PEUGEOT CITROËN</b></div>
    </div>
    <div class="c-idrow">
      <div class="c-idfields">
        <div><span class="lbl">VIN :</span> <span class="val">${esc(model.vin)}</span></div>
        <div><span class="lbl">Modèle <i>– Model</i> :</span> <span class="val">${esc(model.model)}</span></div>
        <div><span class="lbl">Couleur <i>– Colour</i> :</span> <span class="val">${esc(model.couleur)}</span></div>
      </div>
      <div class="c-lieu"><span class="lbl">Lieu d'expédition <i>– Point of departure</i> :</span>
        <span class="val">${esc(model.lieuExpedition)}</span></div>
      <div class="c-seq"><div class="lbl">N°</div><div class="seqnum">${esc(model.seq)}</div></div>
    </div>
    <div class="c-diagrams"><img src="assets/constat-diagrams.png" alt="Damage location diagrams"></div>
    <div class="c-legend">* Entourer le ou les N° de(s) l'élément(s) endommagé(s)
      &nbsp;·&nbsp; <b>CD</b> : Code Dommage &nbsp; <b>LD</b> : Localisation Dommage &nbsp; <b>T</b> : Taille</div>

    <div class="c-sec">Dommages lors des étapes de transport <i>– Damage during transport stages</i></div>
    <table class="c-grid">
      <thead>
        <tr><th rowspan="2" class="g-elh">Élément</th>${STAGES.map((s) => `<th colspan="3" class="g-stage">${s}</th>`).join("")}</tr>
        <tr>${STAGES.map(() => `<th>CD</th><th>LD</th><th class="g-sep">T</th>`).join("")}</tr>
      </thead>
      <tbody>${gridBody(model)}</tbody>
    </table>

    <div class="c-sec sm">Nombre d'éléments endommagés <i>– Number of damaged elements</i></div>
    <div class="c-numrow">${numBoxes}</div>

    <div class="c-sec sm">Observations <i>- Remarks</i> :</div>
    <div class="c-obs">${obsLines}</div>

    ${stagesBlock(model)}
    <div class="c-foot">PSA PEUGEOT CITROËN — Réf. DQ/CLIE 10_0069 · poganja AIS Slovenija za INSPECTUS</div>
  </div>`;
}

// ── The 3 worked examples from Rok's email (reproduced exactly) ──────────────
const DEMO_MODELS = [
  { seq: 1, vin: "VF3ABCDEF12345678", model: "PEUGEOT 208", couleur: "BLANC BANQUISE",
    lieuExpedition: "PORT OF KOPER", operation: "unloading", kindOfLocation: "compound",
    inspectionDate: "24/06/2026", inspectionLocation: "KOPER",
    gridRows: [{ element: "02", cd: "RF", ld: "6", t: "150x20" }], numberA: 1,
    observationsText: "57-TA (PAINT DEFECT) 56-EC" },
  { seq: 2, vin: "W0VABCDEF12345678", model: "OPEL CORSA", couleur: "GRIS ARTENSE",
    lieuExpedition: "PORT OF KOPER", operation: "unloading", kindOfLocation: "compound",
    inspectionDate: "24/06/2026", inspectionLocation: "KOPER",
    gridRows: [{ element: "56", cd: "EC", ld: "6", t: "10x10" }], numberA: 1,
    observationsText: "" },
  { seq: 3, vin: "VF7ABCDEF12345678", model: "CITROËN C3", couleur: "ROUGE ELIXIR",
    lieuExpedition: "PORT OF KOPER", operation: "unloading", kindOfLocation: "compound",
    inspectionDate: "24/06/2026", inspectionLocation: "KOPER",
    gridRows: [], numberA: 0, observationsText: "60-TA (PAINT DEFECT)" },
];

window.CONSTAT_ENGINE = { CONSTAT_MAP, buildConstats, renderConstat, DEMO_MODELS };
