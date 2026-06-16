import { AUTOMATIONS } from "@/lib/automations";
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
      </div>
    </div>
  );
}
