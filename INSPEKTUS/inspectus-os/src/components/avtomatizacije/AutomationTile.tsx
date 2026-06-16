import Link from "next/link";
import { type Automation, statusLabel } from "@/lib/automations";

const STATUS_COLOR: Record<string, string> = {
  active: "var(--success, #1a7f37)",
  demo: "var(--navy, #16324f)",
  soon: "#9aa3ad",
};

export default function AutomationTile({ a }: { a: Automation }) {
  const color = STATUS_COLOR[a.status] ?? "#6b7280";
  return (
    <Link
      href={a.href}
      style={{
        display: "block", background: "#fff", border: a.status === "demo" ? "2px solid var(--navy, #16324f)" : "1px solid var(--border, #e1e7ec)",
        borderRadius: 14, padding: 18, textDecoration: "none", color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>{a.icon}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
          {statusLabel(a.status)}
        </span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 4 }}>{a.name}</div>
      <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{a.description}</div>
    </Link>
  );
}
