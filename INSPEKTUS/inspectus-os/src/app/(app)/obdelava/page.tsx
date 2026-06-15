"use client";
import { useState } from "react";
import { useVldrPipeline, type Header, computeStats } from "@/hooks/useVldrPipeline";
import SaveStatus from "@/components/SaveStatus";
import DropZone from "@/components/vldr/DropZone";
import ReportHeaderForm from "@/components/vldr/ReportHeaderForm";
import PipelineSteps from "@/components/vldr/PipelineSteps";
import UrejanjeTable from "@/components/vldr/UrejanjeTable";
import ChatFilter from "@/components/vldr/ChatFilter";
import VinFilajTable from "@/components/vldr/results/VinFilajTable";
import GroupedTable from "@/components/vldr/results/GroupedTable";
import VldrCards from "@/components/vldr/results/VldrCards";
import SummaryPanel from "@/components/vldr/results/SummaryPanel";
import ValidationPanel from "@/components/vldr/results/ValidationPanel";

const TABS: { id: string; label: string }[] = [
  { id: "urejanje", label: "Urejanje podatkov" }, { id: "vinfilaj", label: "VIN-FILAJ" },
  { id: "grouped", label: "Združen Survey Report" }, { id: "vldr", label: "VLDR Kartice" },
  { id: "summary", label: "Povzetek" }, { id: "validate", label: "AI Validacija" },
];

export default function NovaObdelava() {
  const p = useVldrPipeline();
  const [header, setHeader] = useState<Header>({ date: "", transport_id: "", delivering_party: "", receiving_party: "", location: "" });
  const [tab, setTab] = useState("urejanje");
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)" }}>Nova obdelava</h1>
      <p style={{ color: "#6b7280", marginTop: 4, marginBottom: 20 }}>Povlecite SURVEY REPORT.xlsx — v nekaj sekundah dobite VIN-FILAJ, VLDR kartice in AI povzetek.</p>
      <ReportHeaderForm header={header} onChange={setHeader} />
      <DropZone onFile={p.handleFile} />
      {p.error && <div style={{ color: "#a01f0a", marginTop: 12 }}>{p.error}</div>}
      {p.rawRows.length > 0 && (
        <>
          <PipelineSteps steps={p.steps} />
          {p.ready && <div style={{ color: "var(--success)", fontWeight: 700, margin: "12px 0" }}>✅ Gotovo — {p.vehicles.length} vozil obdelanih · VIN-FILAJ pripravljen</div>}
          <SaveStatus
            ready={p.ready}
            payload={() => ({
              sourceFilename: header.transport_id ? `${header.transport_id}.xlsx` : "obdelava.xlsx",
              header,
              stats: computeStats(p.vehicles),
              summary: p.summary,
              validation: p.validation,
              vehicles: p.vehicles,
              rawRows: p.rawRows,
            })}
          />
          <nav style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", margin: "16px 0", overflowX: "auto" }}>
            {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 14px", fontWeight: 600, whiteSpace: "nowrap", color: tab === t.id ? "var(--navy)" : "#6b7280", borderBottom: tab === t.id ? "2px solid var(--navy)" : "2px solid transparent", borderTop: "none", borderLeft: "none", borderRight: "none", background: "none", cursor: "pointer" }}>{t.label}</button>)}
          </nav>
          {tab === "urejanje" && <UrejanjeTable rawRows={p.rawRows} setRawRows={p.setRawRows} regroup={p.regroup} />}
          {tab === "vinfilaj" && <VinFilajTable vehicles={p.vehicles} maxDamages={p.maxDamages} header={header} />}
          {tab === "grouped" && <GroupedTable rawRows={p.rawRows} />}
          {tab === "vldr" && <VldrCards vehicles={p.vehicles} header={header} />}
          {tab === "summary" && <SummaryPanel summary={p.summary} />}
          {tab === "validate" && <ValidationPanel validation={p.validation} />}
          <ChatFilter vehicles={p.vehicles} header={header} maxDamages={p.maxDamages} />
        </>
      )}
    </div>
  );
}
