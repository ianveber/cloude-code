// Constat (Opel/Citroën/Peugeot) demo — embeds the standalone builder served from
// /public/constat. Demo for INSPECTUS feedback; ports into native React once the real
// Ares export + working CONSTAT Excel land and the column mapping is confirmed.
export default function ConstatPage() {
  return (
    <div className="content">
      <p style={{ marginBottom: 10 }}>
        <a href="/avtomatizacije" style={{ color: "#6b7280", textDecoration: "none" }}>← Avtomatizacije</a>
      </p>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>
          Constat — Opel · Citroën · Peugeot
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          <b>Demo</b> — PSA / Stellantis Joint Survey (RUA V3). Kliknite »Pokaži 3 primere« ali povlecite »Obdelava« izvoz (.xlsx / .csv).
        </p>
      </div>
      <iframe
        src="/constat/index.html"
        title="Constat — Joint Survey"
        style={{ width: "100%", height: "82vh", border: "1px solid #e1e7ec", borderRadius: 12, background: "#fff" }}
      />
    </div>
  );
}
