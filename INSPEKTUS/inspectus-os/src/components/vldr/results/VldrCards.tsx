"use client";
// @ts-nocheck
import { useRef, useState } from "react";
import { renderVLDRCard } from "@/lib/vldr/card";
import { downloadVldrJpg, downloadAllVldrZip } from "@/lib/vldr/download";
import type { Header } from "@/hooks/useVldrPipeline";

interface Props {
  vehicles: any[];
  header: Header;
}

export default function VldrCards({ vehicles, header }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zip, setZip] = useState<string>("");

  if (!vehicles.length) {
    return <div style={{ color: "#6b7280", fontSize: 14 }}>Brez vozil.</div>;
  }

  async function handleDownload(vin: string) {
    const card = containerRef.current?.querySelector(`.vldr-card[data-vin="${vin}"]`) as HTMLElement | null;
    if (!card) return;
    await downloadVldrJpg(card, vin);
  }

  async function handleAll() {
    if (!containerRef.current) return;
    setZip("…");
    try {
      const res = await downloadAllVldrZip(containerRef.current, (i: number, n: number) => setZip(`${i}/${n}`));
      if (res && res.failed > 0)
        alert(`Izvoženih ${res.total - res.failed} od ${res.total} kartic. ${res.failed} kartic ni bilo mogoče izvoziti.`);
    } catch (e) {
      console.error("ZIP export failed", e);
      const msg = e instanceof Error && e.message ? e.message : "Izvoz vseh kartic ni uspel. Poskusi znova ali prenesi posamezno kartico.";
      alert(msg);
    } finally { setZip(""); }
  }

  return (
    <div ref={containerRef}>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleAll}
          disabled={!!zip}
          style={{ background: "var(--navy, #16324f)", color: "#fff", fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 8, border: "none", cursor: zip ? "wait" : "pointer", opacity: zip ? 0.7 : 1 }}
        >
          {zip ? `Pripravljam ZIP… ${zip}` : `⬇ Prenesi vse kartice (${vehicles.length}) — ZIP`}
        </button>
      </div>
      {vehicles.map((v: any) => (
        <div key={v.vin} style={{ marginBottom: 24 }}>
          <div dangerouslySetInnerHTML={{ __html: renderVLDRCard(v, header) }} />
          <button
            onClick={() => handleDownload(v.vin)}
            style={{
              marginTop: 8,
              background: "#425060",
              color: "#fff",
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Prenesi JPG
          </button>
        </div>
      ))}
    </div>
  );
}
