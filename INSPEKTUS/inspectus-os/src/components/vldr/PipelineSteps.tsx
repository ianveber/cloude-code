"use client";

const PIPELINE_STEPS = [
  { id: "parse",    label: "Branje Excel datoteke (SURVEY REPORT)" },
  { id: "urejanje", label: "Pregled in urejanje podatkov" },
  { id: "group",    label: "Združevanje po VIN" },
  { id: "vinfilaj", label: "Priprava VIN-FILAJ" },
  { id: "vldr",     label: "Generiranje VLDR kartic" },
  { id: "validate", label: "AI validacija (dodatno)" },
  { id: "summary",  label: "Izvršilni povzetek (dodatno)" },
];

interface Props {
  steps: Record<string, "active" | "done" | "">;
}

export default function PipelineSteps({ steps }: Props) {
  return (
    <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, margin: "16px 0", padding: "12px 16px", background: "#f8f9fa", borderRadius: 10, border: "1px solid var(--border)" }}>
      {PIPELINE_STEPS.map(s => {
        const status = steps[s.id] || "";
        return (
          <li key={s.id} className={`pipeline-step${status ? ` ${status}` : ""}`}>
            <span className="pipeline-dot" />
            <span>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
