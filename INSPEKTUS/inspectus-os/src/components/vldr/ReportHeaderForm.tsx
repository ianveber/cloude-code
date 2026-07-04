"use client";
import { useEffect } from "react";
import type { Header } from "@/hooks/useVldrPipeline";
import columnMap from "@/config/column-map.json";

interface Props {
  header: Header;
  onChange: (h: Header) => void;
}

const FIELDS: { id: keyof Header; label: string }[] = [
  { id: "date",             label: "Datum" },
  { id: "transport_id",     label: "Transport ID" },
  { id: "location",         label: "Lokacija" },
  { id: "delivering_party", label: "Dostavni prevoznik" },
  { id: "receiving_party",  label: "Prejemni prevoznik" },
];

export default function ReportHeaderForm({ header, onChange }: Props) {
  // Apply defaults from columnMap.header_fields on first mount
  useEffect(() => {
    const hf = (columnMap as any).header_fields || {};
    const patched: Header = { ...header };
    let changed = false;
    for (const f of FIELDS) {
      if (!patched[f.id] && hf[f.id]) {
        (patched as any)[f.id] = hf[f.id];
        changed = true;
      }
    }
    if (changed) onChange(patched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(key: keyof Header, val: string) {
    onChange({ ...header, [key]: val });
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: 12,
      marginBottom: 16,
      padding: "16px",
      background: "#f8f9fa",
      borderRadius: 10,
      border: "1px solid var(--border)",
    }}>
      {FIELDS.map(f => (
        <label key={f.id} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#425060", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {f.label}
          </span>
          <input
            type={f.id === "date" ? "date" : "text"}
            value={(header as any)[f.id] || ""}
            onChange={e => set(f.id, e.target.value)}
            style={{
              border: "1px solid #d6dce1",
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 13,
              color: "#333",
              background: "#fff",
              outline: "none",
            }}
            onFocus={e => { e.target.style.borderColor = "#425060"; e.target.style.boxShadow = "0 0 0 2px rgba(66,80,96,.12)"; }}
            onBlur={e => { e.target.style.borderColor = "#d6dce1"; e.target.style.boxShadow = "none"; }}
          />
        </label>
      ))}
    </div>
  );
}
