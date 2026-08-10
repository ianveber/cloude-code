"use client";

import { aiErrorMessage } from "@/lib/ai-error";

interface Props {
  summary: any;
}

export default function SummaryPanel({ summary }: Props) {
  if (!summary) {
    return <div style={{ color: "#9aa3ad", fontSize: 14 }}>AI povzetek se pripravlja…</div>;
  }
  if (summary.error) {
    return (
      <div style={{ color: "#b45309", fontSize: 14 }}>
        Povzetek trenutno ni dosegljiv: {aiErrorMessage(summary.error)}.
      </div>
    );
  }
  const text = summary.text || "";
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e0e4e8",
      borderRadius: 10,
      padding: "20px",
      lineHeight: 1.7,
      color: "#333",
      fontSize: 14,
      whiteSpace: "pre-wrap",
      boxShadow: "0 1px 4px rgba(33,48,66,.07)",
    }}>
      {text || <span style={{ color: "#9aa3ad" }}>Ni vsebine.</span>}
    </div>
  );
}
