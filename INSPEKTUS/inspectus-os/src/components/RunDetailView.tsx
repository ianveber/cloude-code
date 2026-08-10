"use client";
import { useState } from "react";
import { maxDamageCount } from "@/lib/vldr/transform";
import type { Header } from "@/hooks/useVldrPipeline";
import VinFilajTable from "@/components/vldr/results/VinFilajTable";
import GroupedTable from "@/components/vldr/results/GroupedTable";
import VldrCards from "@/components/vldr/results/VldrCards";
import SummaryPanel from "@/components/vldr/results/SummaryPanel";
import ValidationPanel from "@/components/vldr/results/ValidationPanel";

const TABS = [
  { id: "vinfilaj", label: "VIN-FILAJ" }, { id: "grouped", label: "Združen Survey Report" },
  { id: "vldr", label: "VLDR Kartice" }, { id: "summary", label: "Povzetek" }, { id: "validate", label: "AI Validacija" },
];

export default function RunDetailView({ vehicles, rawRows, header, summary, validation }: {
  vehicles: any[]; rawRows: any[]; header: Header; summary: any; validation: any;
}) {
  const [tab, setTab] = useState("vinfilaj");
  const maxDamages = maxDamageCount(vehicles);
  return (
    <>
      <nav style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", margin: "16px 0", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 14px", fontWeight: 600, whiteSpace: "nowrap", color: tab === t.id ? "var(--navy)" : "#6b7280", borderBottom: tab === t.id ? "2px solid var(--navy)" : "2px solid transparent", borderTop: "none", borderLeft: "none", borderRight: "none", background: "none", cursor: "pointer" }}>{t.label}</button>
        ))}
      </nav>
      {tab === "vinfilaj" && <VinFilajTable vehicles={vehicles} maxDamages={maxDamages} header={header} />}
      {tab === "grouped" && <GroupedTable rawRows={rawRows} />}
      {tab === "vldr" && <VldrCards vehicles={vehicles} header={header} />}
      {tab === "summary" && <SummaryPanel summary={summary ? { text: summary } : null} />}
      {tab === "validate" && <ValidationPanel validation={validation} />}
    </>
  );
}
