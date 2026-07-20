"use client";
// @ts-nocheck
import { useMemo, useState } from "react";
import * as claude from "@/lib/vldr/claude-client";
import { applyFilter } from "@/lib/vldr/filter";
import { aiErrorMessage } from "@/lib/ai-error";
import { toVinFilajRows, buildRemarks } from "@/lib/vldr/transform";
import { renderVLDRCard } from "@/lib/vldr/card";
import type { Header } from "@/hooks/useVldrPipeline";

interface Props {
  vehicles: any[];
  header: Header;
  maxDamages: number;
}

// Aggregated stats for the analytical-answer branch. Only aggregates leave the browser — no VINs/PII.
function computeChatStats(vehicles: any[]) {
  const classDist: Record<string, number> = { "No Damage Evidence": 0, "Damage": 0, "Observation": 0 };
  const sevHist: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  const codeCounts: Record<string, number> = {};
  const partCounts: Record<string, number> = {};   // by PART TEXT, so the AI can answer part-name questions
  let totalDamages = 0, vehiclesDamaged = 0, vehiclesWithRemarks = 0;
  const isReal = (d: any) => { const k = String(d.class ?? "").trim().toLowerCase(); return k === "damage" || k === "observation"; };
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
  const topCodes = Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([code, n]) => ({ code, count: n }));
  const topParts = Object.entries(partCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([part, n]) => ({ part, count: n }));
  return {
    vehicle_count: vehicles.length,
    vehicles_damaged: vehiclesDamaged,
    vehicles_with_remarks: vehiclesWithRemarks,
    total_damage_records: totalDamages,
    class_distribution: classDist,
    severity_histogram: sevHist,
    top_damage_codes: topCodes,
    damaged_parts: topParts,
  };
}

// Deterministic "outcome of the run" — always works (no AI call), instant.
function buildOutcome(s: any) {
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);
  const cd = s.class_distribution || {};
  return {
    vehicles: s.vehicle_count,
    damaged: s.vehicles_damaged,
    damagedPct: pct(s.vehicles_damaged, s.vehicle_count),
    remarks: s.vehicles_with_remarks,
    total: s.total_damage_records,
    damage: cd["Damage"] || 0,
    observation: cd["Observation"] || 0,
    noDamage: cd["No Damage Evidence"] || 0,
    blank: cd["(blank)"] || 0,
    sev: s.severity_histogram || { 1: 0, 2: 0, 3: 0 },
    topCodes: (s.top_damage_codes || []).slice(0, 5).map((c: any) => `${c.code} (${c.count})`).join(", "),
    topParts: (s.damaged_parts || []).slice(0, 5).map((p: any) => `${p.part} (${p.count})`).join(", "),
  };
}

export default function ChatFilter({ vehicles, header, maxDamages }: Props) {
  const stats = useMemo(() => computeChatStats(vehicles), [vehicles]);
  const outcome = useMemo(() => buildOutcome(stats), [stats]);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("");
  const [filtered, setFiltered] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setFeedback("Razmišljam...");
    setAnswer("");
    setFiltered(null);

    const result = await claude.ask(q, stats);
    setLoading(false);

    if (result.error) { setFeedback("⚠️ Vprašanje ni uspelo: " + aiErrorMessage(result.error) + ". Poskusi znova."); return; }
    const j = result.json ?? {};

    // Analytical answer branch (aggregate / % / part-name questions)
    if (j.answer) { setFeedback(""); setAnswer(j.answer); return; }

    // Filter branch
    const filterList = Array.isArray(j.filter) ? j.filter : [];
    if (!filterList.length || j.error) {
      setFeedback("Vprašanja nisem razumel. Poskusi: 'Pokaži vse VINe z resnostjo 3' ali 'Koliko vozil je poškodovanih, v %?'");
      return;
    }
    const filteredVehicles = applyFilter(vehicles, filterList);
    setFeedback(`Filter aktiven: ${filterList.map((f: any) => `${f.field} ${f.op} ${f.value}`).join(" AND ")} → ${filteredVehicles.length} vozil`);
    setFiltered(filteredVehicles);
  }

  if (!vehicles.length) return null;

  return (
    <div style={{ marginTop: 32, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy-deep)", marginBottom: 10 }}>
        Pregled & vprašanja
      </div>

      {/* Outcome of the run — shown automatically, computed locally (no AI needed) */}
      <div style={{ background: "#f7f9fb", border: "1px solid var(--border, #e0e4e8)", borderRadius: 10, padding: "14px 16px", marginBottom: 14, fontSize: 13.5, lineHeight: 1.7, color: "#333" }}>
        <div style={{ fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>📋 Pregled obdelave</div>
        <div><b>{outcome.vehicles}</b> vozil obdelanih · <b>{outcome.damaged}</b> poškodovanih ({outcome.damagedPct} %) · <b>{outcome.remarks}</b> z opombami</div>
        <div><b>{outcome.total}</b> zapisov poškodb — Poškodbe (Damage): <b>{outcome.damage}</b>, Opažanja (Observation): <b>{outcome.observation}</b>, brez poškodbe: <b>{outcome.noDamage}</b>{outcome.blank ? <>, <span style={{ color: "#a01f0a" }}>brez razreda: {outcome.blank}</span></> : null}</div>
        <div>Resnost — 1: <b>{outcome.sev[1]}</b> · 2: <b>{outcome.sev[2]}</b> · 3: <b>{outcome.sev[3]}</b></div>
        {outcome.topCodes && <div>Najpogostejše kode: {outcome.topCodes}</div>}
        {outcome.topParts && <div>Najbolj poškodovani deli: {outcome.topParts}</div>}
        <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12.5 }}>Spodaj lahko vprašaš karkoli o teh podatkih.</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="npr. 'Pokaži vse VINe z resnostjo 3' ali 'Koliko vozil je poškodovanih, v %?'"
          style={{ flex: 1, border: "1px solid #d6dce1", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#333", outline: "none" }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{ background: "#425060", color: "#fff", fontWeight: 600, padding: "8px 18px", borderRadius: 8, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          Vprašaj
        </button>
      </form>
      {feedback && <div style={{ fontSize: 13, color: "#425060", marginBottom: 12 }}>{feedback}</div>}
      {answer && (
        <div style={{ marginTop: 4, marginBottom: 12, background: "#fff", border: "1px solid var(--border, #e0e4e8)", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.6, color: "#333", whiteSpace: "pre-wrap" }}>
          {answer}
        </div>
      )}

      {filtered && filtered.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#425060", marginBottom: 6 }}>
            VIN-FILAJ (filtrirano — {filtered.length} vozil)
          </div>
          <FilteredVinFilaj vehicles={filtered} />

          <div style={{ fontWeight: 600, fontSize: 13, color: "#425060", margin: "16px 0 8px" }}>
            VLDR kartice (filtrirano)
          </div>
          {filtered.map((v: any) => (
            <div key={v.vin} style={{ marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: renderVLDRCard(v, header) }} />
          ))}
        </div>
      )}
      {filtered && filtered.length === 0 && (
        <div style={{ color: "#6b7280", fontSize: 13 }}>Filter ne vrne nobenega vozila.</div>
      )}
    </div>
  );
}

function FilteredVinFilaj({ vehicles }: { vehicles: any[] }) {
  const rows = toVinFilajRows(vehicles) as Record<string, any>[];
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  return (
    <div className="vinfilaj-scroll" style={{ maxHeight: 300 }}>
      <table className="vinfilaj-table">
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r: Record<string, any>, i: number) => (
            <tr key={i}>{headers.map(h => <td key={h}>{r[h] ?? ""}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
