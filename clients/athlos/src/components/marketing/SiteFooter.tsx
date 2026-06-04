import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer>
      <div className="land foot foot-grid">
        <div className="foot-col foot-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/app-icon.svg" alt="ATHLOS" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <span style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 900, letterSpacing: "0.04em" }}>
              ATHL<span style={{ color: "var(--accent)" }}>·</span>OS
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55, maxWidth: 280, margin: 0 }}>
            Athlete Operating System. AI-personaliziran trening za profesionalne športnike in olimpijske klube.
          </p>
        </div>

        <div className="foot-col">
          <div className="foot-col-title">Produkt</div>
          <Link href="/#produkt">Funkcionalnosti</Link>
          <Link href="/#cene">Cenik</Link>
          <Link href="/klubi">Za klube</Link>
          <Link href="/app">Demo</Link>
        </div>

        <div className="foot-col">
          <div className="foot-col-title">Pristop</div>
          <Link href="/tim">Tim Drenovc</Link>
          <Link href="/science">Znanost</Link>
          <Link href="/faq">FAQ</Link>
        </div>

        <div className="foot-col">
          <div className="foot-col-title">Pravno</div>
          <a href="#">Pogoji uporabe</a>
          <Link href="/zasebnost">Politika zasebnosti</Link>
          <Link href="/zasebnost">GDPR</Link>
          <a href="mailto:hello@athlos.si">hello@athlos.si</a>
        </div>
      </div>

      <div className="land foot foot-bottom">
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)", letterSpacing: "0.18em" }}>
          © 2026 · ATHLOS · ATHLETE OPERATING SYSTEM
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)", letterSpacing: "0.18em" }}>
          MADE IN SLOVENIA · LJUBLJANA
        </span>
      </div>
    </footer>
  );
}
