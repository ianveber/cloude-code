import Link from "next/link";
import { SEED_RUNS } from "@/lib/seed";
import { listRuns } from "@/lib/runs";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function Domov() {
  const live = isSupabaseConfigured() ? await listRuns() : [];
  const useLive = live.length > 0;
  const runs = useLive
    ? live.map(r => ({
        id: r.id,
        created_at: (r.created_at || "").slice(0, 10),
        source_filename: r.source_filename || "—",
        vehicle_count: r.vehicle_count,
        total_damages: r.total_damages,
        transport_id: r.transport_id || "—",
        delivering_party: r.delivering_party || "—",
        location: r.location || "—",
      }))
    : SEED_RUNS;

  const totalVehicles = runs.reduce((s, r) => s + r.vehicle_count, 0);
  const lastRun = runs[0]?.created_at ?? "—";
  const runCount = runs.length;

  return (
    <div className="content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Domov</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Pregled obdelav VLDR — INSPECTUS poveljniški center.</p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card"><span className="kpi-label">Skupno obdelanih vozil</span><span className="kpi-value">{totalVehicles.toLocaleString("sl-SI")}</span></div>
        <div className="kpi-card"><span className="kpi-label">Zadnja obdelava</span><span className="kpi-value">{lastRun}</span></div>
        <div className="kpi-card"><span className="kpi-label">Število obdelav</span><span className="kpi-value">{runCount}</span></div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Link href="/obdelava" className="kpi-cta">＋ Nova obdelava</Link>
      </div>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 14 }}>Zadnje obdelave</h2>
        <div className="vinfilaj-scroll">
          <table className="vinfilaj-table">
            <thead><tr><th>Datum</th><th>Datoteka</th><th>Vozil</th><th>Poškodb</th><th>Transport ID</th><th>Prevoznik</th><th>Lokacija</th></tr></thead>
            <tbody>
              {runs.map(run => (
                <tr key={run.id}>
                  <td>{run.created_at}</td>
                  <td>{useLive ? <Link href={`/zgodovina/${run.id}`}>{run.source_filename}</Link> : run.source_filename}</td>
                  <td style={{ textAlign: "right" }}>{run.vehicle_count.toLocaleString("sl-SI")}</td>
                  <td style={{ textAlign: "right" }}>{run.total_damages.toLocaleString("sl-SI")}</td>
                  <td>{run.transport_id}</td>
                  <td>{run.delivering_party}</td>
                  <td>{run.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
