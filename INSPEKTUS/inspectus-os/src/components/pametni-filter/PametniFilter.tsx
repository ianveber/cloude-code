"use client";

import { useCallback, useRef, useState } from "react";
import { orderByExif, runFilter, parseShipListFile, parseShipListText, uniqueShipList } from "@/lib/pametni-filter";
import type { FilterResult, IngestedPhoto, VinRead } from "@/lib/pametni-filter/types";
import { readVinWithFallback } from "@/lib/pametni-filter/ocr";
import { fileToJpegDataUrl } from "@/lib/zajem/photo";
import { saveFilterRun } from "@/lib/zajem/store";

type Photo = IngestedPhoto & { dataUrl: string };

const UNSORTED = "";

export default function PametniFilter() {
  const [shipText, setShipText] = useState("");
  const [shipList, setShipList] = useState<string[]>([]);
  const [shipName, setShipName] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [reads, setReads] = useState<Record<string, VinRead>>({});
  const [result, setResult] = useState<FilterResult | null>(null);
  const [assign, setAssign] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cloud, setCloud] = useState(true);
  const [drag, setDrag] = useState(false);
  const folderRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLInputElement>(null);

  const onShipFile = async (file: File) => {
    setError("");
    try {
      const vins = uniqueShipList(await parseShipListFile(file));
      setShipList(vins);
      setShipText(vins.join("\n"));
      if (!shipName) setShipName(file.name.replace(/\.[^.]+$/, ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Seznama ni bilo mogoče prebrati.");
    }
  };

  const applyPaste = () => {
    const vins = uniqueShipList(parseShipListText(shipText));
    setShipList(vins);
  };

  const addFolder = useCallback(async (files: FileList | File[]) => {
    setError("");
    setResult(null);
    const imgs = Array.from(files).filter(f => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name));
    setBusy(`Berem EXIF (${imgs.length})…`);
    try {
      const ordered = await orderByExif(imgs);
      const next: Photo[] = [];
      for (const { file, capturedAt } of ordered) {
        const dataUrl = await fileToJpegDataUrl(file);
        next.push({
          id: `p_${crypto.randomUUID?.() ?? `${Date.now()}_${Math.random()}`}`,
          name: file.name,
          capturedAt,
          dataUrl,
        });
      }
      setPhotos(prev => [...prev, ...next]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fotografij ni bilo mogoče naložiti.");
    } finally {
      setBusy("");
    }
  }, []);

  const run = async () => {
    if (!photos.length) return;
    setError("");
    setNotice("");
    const nextReads: Record<string, VinRead> = { ...reads };
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      if (nextReads[p.id]?.vin) continue;
      setBusy(`OCR ${i + 1} / ${photos.length}…`);
      const local = await readVinWithFallback(p.id, p.dataUrl, { cloud });
      nextReads[p.id] = {
        photoId: p.id,
        vin: local.vin,
        raw: local.raw,
        looksLikePlate: local.looksLikePlate,
        source: local.source,
      };
    }
    setReads(nextReads);
    setBusy("Razvrščam…");
    const list = uniqueShipList(shipList.length ? shipList : parseShipListText(shipText));
    setShipList(list);
    const filtered = runFilter({ photos, reads: nextReads, shipList: list, mode: "exif-stream" });
    setResult(filtered);
    const asg: Record<string, string> = {};
    for (const u of filtered.unsorted) asg[u.photoId] = UNSORTED;
    for (const v of filtered.vehicles) {
      for (const id of v.photoIds) asg[id] = v.vin || v.id;
    }
    setAssign(asg);
    setBusy("");
    setNotice(
      `${filtered.vehicles.length} vozil · ${filtered.unsorted.length} nerazvrščenih · ${filtered.alerts.length} opozoril`,
    );
    const persistable = {
      vehicles: filtered.vehicles.map(v => ({
        vin: v.vin,
        vinReadable: v.vinReadable,
        photoCount: v.photoIds.length,
        correctedFrom: v.correctedFrom,
        onShipList: v.onShipList,
        inspectorId: v.inspectorId,
      })),
      unsortedCount: filtered.unsorted.length,
      alerts: filtered.alerts,
      closedByFailedRead: filtered.closedByFailedRead,
    };
    await saveFilterRun({
      shipName: shipName || "ladja",
      shipList: list,
      result: persistable,
      sourceCount: photos.length,
    });
  };

  const reassign = (photoId: string, key: string) => {
    setAssign(prev => ({ ...prev, [photoId]: key }));
  };

  const groupKeys = Array.from(new Set([
    ...Object.values(assign).filter(k => k && k !== UNSORTED),
    ...(result?.vehicles.map(v => v.vin || v.id) ?? []),
  ]));
  const photosIn = (key: string) => photos.filter(p => assign[p.id] === key);
  const unsorted = photos.filter(p => (assign[p.id] ?? UNSORTED) === UNSORTED);

  const onDrop = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) reassign(id, key);
  };

  return (
    <div>
      <div style={{ display: "grid", gap: 16, marginBottom: 22 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, color: "var(--navy-deep)", marginBottom: 8 }}>1 · Seznam razkladanja</div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            CSV / XLSX ali prilepi VIN-e (17 znakov, brez I/O/Q). Filter primerja v obe smeri.
          </p>
          <input
            style={{ width: "100%", marginBottom: 8, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8 }}
            placeholder="Ime ladje (neobvezno)"
            value={shipName}
            onChange={e => setShipName(e.target.value)}
          />
          <textarea
            value={shipText}
            onChange={e => setShipText(e.target.value)}
            onBlur={applyPaste}
            rows={5}
            placeholder={"WVWZZZ3CZWE123456\nJM1BL1SF8A1234567"}
            style={{ width: "100%", fontFamily: "ui-monospace, monospace", fontSize: 12.5, padding: 10, border: "1px solid var(--border)", borderRadius: 8, resize: "vertical" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" onClick={() => listRef.current?.click()} style={ghostBtn}>Naloži CSV / XLSX</button>
            <button type="button" onClick={applyPaste} style={ghostBtn}>Uporabi prilepljene VIN-e</button>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{shipList.length} VIN na seznamu</span>
          </div>
          <input ref={listRef} type="file" accept=".csv,.xlsx,.xls,.txt" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) onShipFile(f); e.target.value = ""; }} />
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files?.length) addFolder(e.dataTransfer.files); }}
          style={{
            background: drag ? "#eef3f7" : "#fff",
            border: `2px dashed ${drag ? "var(--navy)" : "var(--border)"}`,
            borderRadius: 12, padding: 18,
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--navy-deep)", marginBottom: 8 }}>2 · Mapa fotografij</div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            Razvrstitev po EXIF času (DateTimeOriginal). VIN odpre vozilo; neberljiv VIN zapre prejšnje.
          </p>
          <button type="button" onClick={() => folderRef.current?.click()} style={ghostBtn}>Izberi fotografije / mapo</button>
          <input ref={folderRef} type="file" accept="image/*" multiple hidden
            onChange={e => { if (e.target.files?.length) addFolder(e.target.files); e.target.value = ""; }} />
          <span style={{ marginLeft: 10, fontSize: 13, color: "#6b7280" }}>{photos.length} fotografij</span>
        </div>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#374151", marginBottom: 12 }}>
        <input type="checkbox" checked={cloud} onChange={e => setCloud(e.target.checked)} />
        Če Tesseract VIN-a ne prebere, poskusi oblak (`/api/claude/vin`) — brez ugibanja.
      </label>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        <button type="button" onClick={run} disabled={!photos.length || Boolean(busy)}
          style={{ padding: "10px 18px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: photos.length && !busy ? "pointer" : "not-allowed", opacity: photos.length && !busy ? 1 : 0.5 }}>
          {busy || `Zaženi filter (${photos.length})`}
        </button>
        {photos.length > 0 && (
          <button type="button" onClick={() => { setPhotos([]); setReads({}); setResult(null); setAssign({}); setNotice(""); }} style={ghostBtn}>
            Počisti fotografije
          </button>
        )}
        {error && <span style={{ color: "#a01f0a", fontSize: 13 }}>{error}</span>}
        {!error && notice && <span style={{ color: "#15803d", fontSize: 13 }}>{notice}</span>}
      </div>

      {result && result.alerts.length > 0 && (
        <div style={{ background: "#fdf0ee", border: "1px solid #f0c9c2", borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <strong style={{ color: "#a01f0a", fontSize: 13 }}>Opozorila ({result.alerts.length})</strong>
          <ul style={{ margin: "8px 0 0 18px", fontSize: 13, color: "#6b3b34" }}>
            {result.alerts.map((a, i) => <li key={`${a.type}-${a.vin}-${i}`}>{a.message}</li>)}
          </ul>
        </div>
      )}

      {groupKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 22 }}>
          {groupKeys.map(key => {
            const meta = result?.vehicles.find(v => (v.vin || v.id) === key);
            return (
              <div key={key} onDragOver={e => e.preventDefault()} onDrop={onDrop(key)}
                style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <code style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy-deep)" }}>{key || "—"}</code>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{photosIn(key).length} foto</span>
                </div>
                {meta?.correctedFrom && (
                  <div style={{ fontSize: 12, color: "#8a6d3b", marginBottom: 6 }}>popravljen iz {meta.correctedFrom}</div>
                )}
                {meta && !meta.onShipList && meta.vinReadable && (
                  <div style={{ fontSize: 12, color: "#a01f0a", marginBottom: 6 }}>ni na seznamu ladje</div>
                )}
                <Thumbs photos={photosIn(key)} />
              </div>
            );
          })}
        </div>
      )}

      <div onDragOver={e => e.preventDefault()} onDrop={onDrop(UNSORTED)}
        style={{ background: "#f5f7f9", border: "1px dashed #d7dee4", borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <strong style={{ fontSize: 13, color: "var(--navy-deep)" }}>Nerazvrščeno</strong>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{unsorted.length} foto</span>
        </div>
        {photos.length === 0
          ? <div style={{ fontSize: 13, color: "#9aa3ad" }}>Naloži seznam in mapo fotografij, nato zaženi filter.</div>
          : <Thumbs photos={unsorted} empty={result ? "Predal je prazen." : "Klikni Zaženi filter."} />}
      </div>
    </div>
  );
}

function Thumbs({ photos, empty }: { photos: Photo[]; empty?: string }) {
  if (!photos.length) return <div style={{ fontSize: 12.5, color: "#9aa3ad", padding: "8px 0" }}>{empty ?? ""}</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: 6 }}>
      {photos.map(p => (
        <img key={p.id} src={p.dataUrl} alt={p.name} title={p.name} draggable
          onDragStart={e => e.dataTransfer.setData("text/plain", p.id)}
          style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 7, cursor: "grab", border: "1px solid #e1e7ec" }} />
      ))}
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  padding: "9px 14px", background: "#fff", color: "#374151",
  border: "1px solid #d7dee4", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer",
};
