"use client";
// @ts-nocheck
import { toVinFilajRows } from "@/lib/vldr/transform";
import { downloadVinFilaj } from "@/lib/vldr/download";
import type { Header } from "@/hooks/useVldrPipeline";

interface Props {
  vehicles: any[];
  maxDamages: number;
  header: Header;
}

export default function VinFilajTable({ vehicles, maxDamages, header }: Props) {
  const rows = toVinFilajRows(vehicles) as Record<string, any>[];

  if (!rows.length) {
    return <div style={{ color: "#6b7280", fontSize: 14 }}>Brez vozil.</div>;
  }

  const headers = Object.keys(rows[0]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {vehicles.length} vozil · {maxDamages} max poškodb · list &quot;prepare for report&quot;
        </div>
        <button
          onClick={() => downloadVinFilaj(vehicles, header)}
          style={{
            background: "#425060",
            color: "#fff",
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 13,
            border: "none",
            cursor: "pointer",
          }}
        >
          Prenesi VIN-FILAJ.xlsx
        </button>
      </div>
      <div className="vinfilaj-scroll">
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
    </div>
  );
}
