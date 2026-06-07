// @ts-nocheck
import { buildRemarks } from "./transform";

// Content-faithful VLDR card modelled on INSPECTUS's real Ford "Vehicle Loss and Damage Report"
// (VLDR IZGLED.jpg): trilingual title + AIAG coding, Model/Serial, Location/Date, Position/Damage/
// Severity table, aggregated Remarks (POS-DMG: CLASS), Mode of Arrival, delivering/receiving carriers
// with INSPECTUS logo, form id EU 6546. Header values come from the VIN-FILAJ report header inputs.
export function renderVLDRCard(vehicle, header = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const date = header.date || today;
  const location = header.location || "—";
  const delivering = header.delivering_party || "—";
  const receiving = header.receiving_party || "—";
  const transport = header.transport_id || "—";

  const damageRows = vehicle.damages.map((d, i) => `
    <tr>
      <td style="text-align:center;color:#6b7280;">${i + 1}</td>
      <td style="font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;">${esc(d.part_code)}</td>
      <td style="font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;">${esc(d.type_code)}</td>
      <td style="text-align:center;">${esc(d.severity)}</td>
      <td style="font-size:.7rem;color:#52525b;">${esc(d.part_text)}${d.part_text && d.type_text ? " · " : ""}${esc(d.type_text)}</td>
    </tr>`).join("");

  const remarks = buildRemarks(vehicle.damages, ": ");

  return `
  <div class="vldr-card" data-vin="${esc(vehicle.vin)}">
    <div class="vldr-header">
      <div>
        <div style="font-size:.95rem;font-weight:700;letter-spacing:.02em;">Vehicle Loss and Damage Report</div>
        <div style="font-size:.6rem;opacity:.75;margin-top:.12rem;">Meldung über Transportschäden /- verluste · Informe de Daños y Faltas</div>
      </div>
      <div style="text-align:right;font-size:.58rem;opacity:.85;letter-spacing:.1em;line-height:1.3;">AIAG<br>CODING</div>
    </div>

    <div class="vldr-section" style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
      <div><div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;">Model</div><div style="font-weight:700;font-size:.95rem;">${esc(vehicle.make_model) || "—"}</div></div>
      <div><div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;">Serial No.</div><div style="font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.9rem;">${esc(vehicle.vin)}</div></div>
    </div>

    <div class="vldr-section" style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;font-size:.72rem;color:#52525b;">
      <div><span style="font-weight:700;color:#27272a;">Location of Inspection:</span> ${esc(location)}</div>
      <div><span style="font-weight:700;color:#27272a;">Date:</span> ${esc(date)}</div>
    </div>

    <div class="vldr-section" style="display:flex;align-items:center;gap:1rem;">
      <svg viewBox="0 0 320 96" style="width:55%;max-height:92px;">
        <path d="M40,68 L62,40 L120,40 L132,26 L210,26 L222,40 L282,40 L296,68 Z M58,68 a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 M250,68 a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0" fill="none" stroke="#9aa3ad" stroke-width="2"/>
      </svg>
      <div style="font-size:.6rem;color:#9aa3ad;line-height:1.4;">AIAG kodirana shema pozicij<br>Position Code = območje vozila</div>
    </div>

    <div class="vldr-section">
      <table class="vldr-table">
        <thead><tr><th style="width:7%;">#</th><th style="width:16%;">Position</th><th style="width:16%;">Damage</th><th style="width:13%;">Severity</th><th>Part / Type</th></tr></thead>
        <tbody>${damageRows || `<tr><td colspan="5" style="text-align:center;color:#9aa3ad;padding:1rem;">No damages recorded</td></tr>`}</tbody>
      </table>
    </div>

    <div class="vldr-section">
      <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;margin-bottom:.25rem;">Remarks / Bemerkungen / Observaciones</div>
      <div style="font-size:.8rem;">${esc(remarks) || "—"}</div>
    </div>

    <div class="vldr-section" style="font-size:.72rem;">
      <span style="font-weight:700;color:#27272a;">Mode of Arrival:</span> &#9746; Vessel — ${esc(transport)}
    </div>

    <div class="vldr-section" style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
      <div>
        <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;">Delivering Carrier</div>
        <div style="font-size:.76rem;font-weight:700;">${esc(delivering)}</div>
        <img src="/inspectus-logo.png" alt="Inspectus" style="height:16px;margin-top:.3rem;opacity:.85;">
      </div>
      <div>
        <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;">Receiving Carrier</div>
        <div style="font-size:.76rem;font-weight:700;">${esc(receiving)}</div>
        <img src="/inspectus-logo.png" alt="Inspectus" style="height:16px;margin-top:.3rem;opacity:.85;">
      </div>
    </div>

    <div class="vldr-section" style="display:flex;justify-content:space-between;align-items:center;font-size:.62rem;color:#71717a;border-bottom:none;">
      <span style="font-weight:700;color:#425060;">EU 6546</span>
      <span>Claims agent / Schadensagent / Agente de recobro</span>
      <span>${esc(date)}</span>
    </div>
  </div>`;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
