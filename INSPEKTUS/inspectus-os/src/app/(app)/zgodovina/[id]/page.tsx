import Link from "next/link";
import { getRun } from "@/lib/runs";
import RunDetailView from "@/components/RunDetailView";

export default async function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    return (
      <div className="content">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-deep)" }}>Obdelava ni najdena.</h1>
        <p style={{ marginTop: 8 }}><Link href="/zgodovina">← Nazaj na Zgodovino</Link></p>
      </div>
    );
  }

  const header = {
    date: run.report_date || "", transport_id: run.transport_id || "",
    delivering_party: run.delivering_party || "", receiving_party: run.receiving_party || "",
    location: run.location || "",
  };

  return (
    <div className="content">
      <p style={{ marginBottom: 8 }}><Link href="/zgodovina" style={{ fontSize: 13, color: "#6b7280" }}>← Zgodovina</Link></p>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--navy-deep)" }}>{run.source_filename || "Obdelava"}</h1>
      <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
        {(run.created_at || "").slice(0, 10)} · {run.vehicle_count} vozil · {run.total_damages} poškodb
      </p>
      <RunDetailView
        vehicles={run.vehicles ?? []}
        rawRows={run.raw_rows ?? []}
        header={header}
        summary={run.summary}
        validation={run.validation}
      />
    </div>
  );
}
