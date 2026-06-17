"use client";
// @ts-nocheck
import { useState } from "react";
import * as claude from "@/lib/vldr/claude-client";
import { applyFilter } from "@/lib/vldr/filter";
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

export default function ChatFilter({ vehicles, header, maxDamages }: Props) {
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

    const result = await claude.ask(q, computeChatStats(vehicles));
    setLoading(false);

    if (result.error) { setFeedback(`Napaka: ${result.error}`); return; }
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
        Vprašaj po podatkih
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
