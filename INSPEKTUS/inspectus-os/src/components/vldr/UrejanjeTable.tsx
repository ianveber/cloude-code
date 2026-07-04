"use client";
// @ts-nocheck
import { useState, useCallback } from "react";
import columnMap from "@/config/column-map.json";

interface Props {
  rawRows: any[];
  setRawRows: (r: any[]) => void;
  regroup: (r: any[]) => any[];
}

export default function UrejanjeTable({ rawRows, setRawRows, regroup }: Props) {
  const [flash, setFlash] = useState(false);
  // local edits keyed by [rowIdx][col]
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({});

  const c = (columnMap as any).source_columns;
  const classValues: string[] = (columnMap as any).class_values || ["No Damage Evidence", "Damage", "Observation"];

  const colDefs = [
    { key: c.make_model, editable: false },
    { key: c.vin,        editable: true, inputType: "text" },
    { key: c.part_code,  editable: true, inputType: "text", style: { width: "3rem" } },
    { key: c.type_code,  editable: true, inputType: "text", style: { width: "3rem" } },
    { key: c.severity,   editable: true, inputType: "number", style: { width: "3rem" }, min: 1, max: 5 },
    { key: c.class,      editable: true, tag: "select" },
    { key: c.comments,   editable: true, inputType: "text", style: { width: "8rem" } },
    { key: c.cause,      editable: false },
    { key: c.part_text,  editable: false },
    { key: c.type_text,  editable: false },
  ];

  function getVal(rowIdx: number, col: string) {
    if (edits[rowIdx]?.[col] !== undefined) return edits[rowIdx][col];
    return String(rawRows[rowIdx]?.[col] ?? "");
  }

  function setEdit(rowIdx: number, col: string, val: string) {
    setEdits(prev => ({
      ...prev,
      [rowIdx]: { ...(prev[rowIdx] || {}), [col]: val },
    }));
  }

  function applyChanges() {
    const updated = rawRows.map((row, i) => {
      if (!edits[i]) return row;
      return { ...row, ...edits[i] };
    });
    setRawRows(updated);
    regroup(updated);
    setEdits({});
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  }

  function reset() {
    setEdits({});
  }

  if (!rawRows.length) {
    return <div style={{ color: "#6b7280", fontSize: 14 }}>Brez podatkov.</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {rawRows.length} vnosov poškodb · urejajte podatke in kliknite Uporabi spremembe
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={applyChanges}
            style={{
              background: flash ? "#15803d" : "#16a34a",
              color: "#fff",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              transition: "background .15s",
            }}
          >
            {flash ? "✓ Uporabljeno" : "Uporabi spremembe"}
          </button>
          <button
            onClick={reset}
            style={{
              background: "#6b7280",
              color: "#fff",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
            }}
          >
            Ponastavi
          </button>
        </div>
      </div>

      <div className="editable-scroll">
        <table className="editable-table">
          <thead>
            <tr>
              <th>#</th>
              {colDefs.map(d => <th key={d.key}>{d.key}</th>)}
            </tr>
          </thead>
          <tbody>
            {rawRows.map((row, i) => (
              <tr key={i}>
                <td style={{ color: "#9aa3ad", fontSize: 11 }}>{i + 1}</td>
                {colDefs.map(def => {
                  const val = getVal(i, def.key);
                  if (!def.editable) {
                    return <td key={def.key} style={{ color: "#6b7280" }}>{val}</td>;
                  }
                  if (def.tag === "select") {
                    return (
                      <td key={def.key}>
                        <select
                          className="editable-select"
                          value={val}
                          onChange={e => setEdit(i, def.key, e.target.value)}
                        >
                          {classValues.map(opt => (
                            <option key={opt} value={opt}>{opt || "(prazno)"}</option>
                          ))}
                          <option value="">{"(prazno)"}</option>
                        </select>
                      </td>
                    );
                  }
                  return (
                    <td key={def.key}>
                      <input
                        type={def.inputType || "text"}
                        value={val}
                        onChange={e => setEdit(i, def.key, e.target.value)}
                        style={def.style}
                        min={def.min}
                        max={def.max}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
        Spremenite VIN za prerazporeditev poškodb med vozili
      </div>
    </div>
  );
}
