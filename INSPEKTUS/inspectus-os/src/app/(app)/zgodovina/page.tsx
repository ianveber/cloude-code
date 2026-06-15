import Link from "next/link";
import { listRuns } from "@/lib/runs";

export default async function Zgodovina() {
  const runs = await listRuns();
  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Zgodovina</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Vse shranjene obdelave VLDR.</p>
      </div>
      {runs.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 14, padding: "32px 0" }}>Še ni shranjenih obdelav. Začni z <Link href="/obdelava">novo obdelavo</Link>.</div>
      ) : (
        <div className="vinfilaj-scroll">
          <table className="vinfilaj-table">
            <thead><tr><th>Datum</th><th>Datoteka</th><th>Vozil</th><th>Poškodb</th><th>Transport ID</th><th>Prevoznik</th><th>Lokacija</th></tr></thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id}>
                  <td>{(r.created_at || "").slice(0, 10)}</td>
                  <td><Link href={`/zgodovina/${r.id}`}>{r.source_filename || "—"}</Link></td>
                  <td style={{ textAlign: "right" }}>{r.vehicle_count.toLocaleString("sl-SI")}</td>
                  <td style={{ textAlign: "right" }}>{r.total_damages.toLocaleString("sl-SI")}</td>
                  <td>{r.transport_id || "—"}</td>
                  <td>{r.delivering_party || "—"}</td>
                  <td>{r.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
