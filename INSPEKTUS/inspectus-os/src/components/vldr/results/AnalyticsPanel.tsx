"use client";
// @ts-nocheck
import { buildRemarks } from "@/lib/vldr/transform";

function computeStats(vehicles: any[]) {
  const classDist: Record<string, number> = { "Damage": 0, "Observation": 0, "No Damage Evidence": 0 };
  const sevHist: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  const codeCounts: Record<string, number> = {};
  const partCounts: Record<string, number> = {};
  let totalDamages = 0, vehiclesDamaged = 0, vehiclesWithRemarks = 0;
  const isReal = (d: any) => { const k = String(d.class ?? "").trim().toLowerCase(); return k === "damage" || k === "observation"; };
  for (const v of vehicles) {
    if (v.damages.some(isReal)) vehiclesDamaged++;
    if (buildRemarks(v.damages, " ")) vehiclesWithRemarks++;
    for (const d of v.damages) {
      totalDamages++;
      const cls = String(d.class ?? "").trim() || "(prazno)";
      classDist[cls] = (classDist[cls] || 0) + 1;
      if (d.severity in sevHist) sevHist[d.severity]++;
      const code = `${d.part_code}-${d.type_code}`;
      codeCounts[code] = (codeCounts[code] || 0) + 1;
      const pt = String(d.part_text ?? "").trim();
      if (pt) partCounts[pt] = (partCounts[pt] || 0) + 1;
    }
  }
  return {
    vehicle_count: vehicles.length,
    vehicles_damaged: vehiclesDamaged,
    vehicles_with_remarks: vehiclesWithRemarks,
    total_damage_records: totalDamages,
    class_distribution: classDist,
    severity_histogram: sevHist,
    top_codes: Object.entries(codeCounts).sort((a, b) => b[1] - a[1]).slice(0, 8) as [string, number][],
    top_parts: Object.entries(partCounts).sort((a, b) => b[1] - a[1]).slice(0, 12) as [string, number][],
  };
}

function Bar({ label, value, max, color }: any) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div style={{ width: 210, fontSize: 12, color: "#425060", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      <div style={{ flex: 1, background: "#eef1f3", borderRadius: 6, height: 20 }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 6, minWidth: value ? 3 : 0 }} />
      </div>
      <div style={{ width: 44, fontSize: 12, fontWeight: 700, color: "#2a3340" }}>{value}</div>
    </div>
  );
}

function Kpi({ label, value }: any) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#9aa3ad" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginTop: 4, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--navy-deep)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

const CLASS_COLOR: Record<string, string> = { "Damage": "#b4452f", "Observation": "#b09575", "No Damage Evidence": "#7a8794", "(prazno)": "#c3ccd4" };
const SEV_COLOR: Record<string, string> = { "1": "#9bbf8a", "2": "#d9b15a", "3": "#c0584a" };

export default function AnalyticsPanel({ vehicles }: { vehicles: any[] }) {
  if (!vehicles.length) return <div style={{ color: "#6b7280", fontSize: 14 }}>Brez vozil.</div>;
  const s = computeStats(vehicles);
  const cls = Object.entries(s.class_distribution).filter(([, n]) => n > 0);
  const clsMax = Math.max(1, ...cls.map(([, n]) => n));
  const sev = Object.entries(s.severity_histogram);
  const sevMax = Math.max(1, ...sev.map(([, n]) => n));
  const partMax = Math.max(1, ...s.top_parts.map(([, n]) => n));
  const codeMax = Math.max(1, ...s.top_codes.map(([, n]) => n));
  const pctDmg = s.vehicle_count ? Math.round((s.vehicles_damaged / s.vehicle_count) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 4 }}>
        <Kpi label="Vozila" value={s.vehicle_count} />
        <Kpi label="Poškodovana" value={`${s.vehicles_damaged} (${pctDmg}%)`} />
        <Kpi label="Zapisi poškodb" value={s.total_damage_records} />
        <Kpi label="Z opombami" value={s.vehicles_with_remarks} />
      </div>

      <Section title="Poškodbe po razredu">
        {cls.map(([l, n]) => <Bar key={l} label={l} value={n} max={clsMax} color={CLASS_COLOR[l] || "#425060"} />)}
      </Section>

      <Section title="Poškodbe po resnosti">
        {sev.map(([l, n]) => <Bar key={l} label={`Resnost ${l}`} value={n} max={sevMax} color={SEV_COLOR[l] || "#425060"} />)}
      </Section>

      <Section title="Najpogostejši deli (PART)">
        {s.top_parts.length ? s.top_parts.map(([l, n]) => <Bar key={l} label={l} value={n} max={partMax} color="#425060" />)
          : <div style={{ fontSize: 12, color: "#9aa3ad" }}>Ni podatkov o delih (PART TEXT).</div>}
      </Section>

      <Section title="Najpogostejše kode (PART-TYPE)">
        {s.top_codes.map(([l, n]) => <Bar key={l} label={l} value={n} max={codeMax} color="#5b6b7d" />)}
      </Section>
    </div>
  );
}
