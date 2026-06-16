import Link from "next/link";
import VinSorter from "@/components/avtomatizacije/VinSorter";

export default function VinPage() {
  return (
    <div className="content">
      <p style={{ marginBottom: 8 }}>
        <Link href="/avtomatizacije" style={{ fontSize: 13, color: "#6b7280" }}>← Avtomatizacije</Link>
      </p>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>VIN sortirnik fotografij</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Naloži fotografije poškodb — AI prebere VIN iz vsake in jih razvrsti v galerijo po vozilih.
          Fotografije brez berljivega VIN-a ostanejo v &quot;Nerazvrščeno&quot;; povleci jih v pravo vozilo.
        </p>
      </div>
      <VinSorter />
    </div>
  );
}
