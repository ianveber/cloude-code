"use client";

import { aiErrorMessage } from "@/lib/ai-error";

interface Issue {
  kind?: string;
  vin?: string;
  row_index?: number;
  message?: string;
  suggestion?: string;
}

interface Props {
  validation: any;
}

export default function ValidationPanel({ validation }: Props) {
  if (!validation) {
    return <div style={{ color: "#9aa3ad", fontSize: 14 }}>AI validacija se izvaja…</div>;
  }
  if (validation.error) {
    return (
      <div style={{ color: "#b45309", fontSize: 14 }}>
        AI validacija ni dosegljiva: {aiErrorMessage(validation.error)}. VIN-FILAJ in VLDR še vedno delujeta.
      </div>
    );
  }
  const issues: Issue[] = validation.json?.issues ?? [];
  if (!issues.length) {
    return <div style={{ color: "#3a7d00", fontSize: 14 }}>Brez najdenih nepravilnosti. ✓</div>;
  }
  return (
    <div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        {issues.length} najdenih nepravilnosti:
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {issues.map((issue, i) => (
          <li key={i} style={{
            background: "#fff",
            border: "1px solid #e0e4e8",
            borderRadius: 10,
            padding: "12px",
            fontSize: 14,
            boxShadow: "0 1px 3px rgba(33,48,66,.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ color: "#425060", fontFamily: "ui-monospace,Menlo,Consolas,monospace", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>
                {issue.kind || "issue"}
              </span>
              <span style={{ color: "#9aa3ad", fontSize: 12 }}>
                VIN {issue.vin || ""} · vrstica {issue.row_index ?? "?"}
              </span>
            </div>
            <div style={{ color: "#333" }}>{issue.message || ""}</div>
            {issue.suggestion && (
              <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                Predlog: {issue.suggestion}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
