import Link from "next/link";
import PametniFilter from "@/components/pametni-filter/PametniFilter";

export default function PametniFilterPage() {
  return (
    <div>
      <p style={{ marginBottom: 8 }}>
        <Link href="/avtomatizacije" style={{ fontSize: 13, color: "#6b7280" }}>← Avtomatizacije</Link>
      </p>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>
          Pametni filter
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 720 }}>
          Devet avtomatizacij v enem prehodu: EXIF vrstni red, prepoznava VIN tablice,
          branje (Tesseract, oblak samo kot rezervna), 17 znakov brez I/O/Q, združevanje po vozilih,
          neuspešno branje zapre prejšnje vozilo, edinstven popravek enega znaka, opozorila v obe
          smeri proti seznamu ladje, predal Nerazvrščeno. Filter nikoli ne ugiba.
        </p>
      </div>
      <PametniFilter />
    </div>
  );
}
