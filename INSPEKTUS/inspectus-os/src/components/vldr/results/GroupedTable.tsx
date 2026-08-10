"use client";
// @ts-nocheck
import { toGroupedSurveyAOA } from "@/lib/vldr/transform";
import { downloadGroupedSurvey } from "@/lib/vldr/download";
import columnMap from "@/config/column-map.json";

interface Props {
  rawRows: any[];
}

export default function GroupedTable({ rawRows }: Props) {
  const aoa = toGroupedSurveyAOA(rawRows, columnMap as any);

  if (aoa.length <= 1) {
    return <div style={{ color: "#6b7280", fontSize: 14 }}>Brez vozil.</div>;
  }

  const [headerRow, ...dataRows] = aoa;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {dataRows.length} vozil · vse poškodbe vozila združene v eno vrstico (isti SURVEY REPORT stolpci)
        </div>
        <button
          onClick={() => downloadGroupedSurvey(rawRows)}
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
          ⬇ Prenesi Združen Survey Report.xlsx
        </button>
      </div>
      <div className="vinfilaj-scroll">
        <table className="vinfilaj-table">
          <thead>
            <tr>{headerRow.map((h: string, i: number) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {dataRows.map((row: any[], ri: number) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell ?? ""}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
