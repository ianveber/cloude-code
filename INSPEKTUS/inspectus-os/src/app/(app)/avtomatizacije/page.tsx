import { AUTOMATIONS, SOON } from "@/lib/automations";
import AutomationTile from "@/components/avtomatizacije/AutomationTile";

export default function Avtomatizacije() {
  return (
    <div className="content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Avtomatizacije</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Poveljniški center — orodja in avtomatizacije za pregledovalce.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {AUTOMATIONS.map(a => <AutomationTile key={a.id} a={a} />)}

        {SOON.map((s, i) => (
          <div key={`soon-${i}`} style={{ background: "#f5f7f9", border: "1px dashed #d7dee4", borderRadius: 14, padding: 18, opacity: 0.8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 28, lineHeight: 1, filter: "grayscale(1)" }} aria-hidden>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9aa3ad" }}>Kmalu</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontSize: 13, color: "#9aa3ad", lineHeight: 1.5 }}>{s.description}</div>
          </div>
        ))}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 150, border: "1px dashed #d7dee4", borderRadius: 14, color: "#9aa3ad" }}>
          <span style={{ fontSize: 28, marginBottom: 6 }} aria-hidden>＋</span>
          <span style={{ fontSize: 13 }}>Dodaj avtomatizacijo</span>
        </div>
      </div>
    </div>
  );
}
