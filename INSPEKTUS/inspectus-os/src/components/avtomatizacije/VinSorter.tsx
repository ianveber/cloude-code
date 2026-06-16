"use client";
import { useCallback, useRef, useState } from "react";

type Photo = { id: string; name: string; url: string; media_type: string; data: string };

let _seq = 0;
const nextId = () => `p${Date.now().toString(36)}_${_seq++}`;

const UNSORTED = ""; // group key for not-yet-assigned / no-VIN photos

// Downscale an image to a long edge ≤ 1600px and return base64 JPEG (smaller payload, still readable).
function processImage(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode"));
      img.onload = () => {
        const max = 1600;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ id: nextId(), name: file.name, url: dataUrl, media_type: "image/jpeg", data: dataUrl.split(",")[1] ?? "" });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function VinSorter() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [assign, setAssign] = useState<Record<string, string>>({});
  const [extraGroups, setExtraGroups] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    const imgs = Array.from(files).filter(f => /^image\//.test(f.type));
    const skipped = Array.from(files).length - imgs.length;
    if (skipped > 0) setError(`${skipped} neslikovnih datotek preskočenih.`);
    const processed = await Promise.all(imgs.map(processImage).map(p => p.catch(() => null)));
    const ok = processed.filter(Boolean) as Photo[];
    setPhotos(prev => [...prev, ...ok]);
    setAssign(prev => { const n = { ...prev }; ok.forEach(p => { n[p.id] = UNSORTED; }); return n; });
  }, []);

  const analyze = useCallback(async () => {
    if (!photos.length) return;
    setAnalyzing(true); setError("");
    const BATCH = 3; // keep each POST small — base64 images must stay under the body-size limit
    const byId: Record<string, string> = {};
    let anyError = false;
    try {
      for (let i = 0; i < photos.length; i += BATCH) {
        const chunk = photos.slice(i, i + BATCH);
        try {
          const res = await fetch("/api/claude/vin", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ images: chunk.map(p => ({ id: p.id, media_type: p.media_type, data: p.data })) }),
          });
          if (!res.ok) { anyError = true; continue; }
          const json = await res.json() as { results?: { id: string; vin: string }[]; error?: string };
          if (json.error) anyError = true;
          (json.results ?? []).forEach(r => { byId[r.id] = r.vin || UNSORTED; });
        } catch { anyError = true; }
      }
      // Only touch photos we actually got a result for — preserves manual sorting on re-run.
      setAssign(prev => { const n = { ...prev }; for (const id in byId) n[id] = byId[id]; return n; });
      if (Object.keys(byId).length) setAnalyzed(true);
      if (anyError) setError("Nekatere fotografije niso bile analizirane — ostanejo nerazvrščene.");
    } finally {
      setAnalyzing(false);
    }
  }, [photos]);

  const reassign = useCallback((id: string, key: string) => {
    setAssign(prev => ({ ...prev, [id]: key }));
  }, []);

  const renameGroup = useCallback((oldKey: string, raw: string) => {
    const newKey = raw.trim().toUpperCase();
    if (!newKey || newKey === oldKey) return;
    setAssign(prev => { const n = { ...prev }; for (const id in n) if (n[id] === oldKey) n[id] = newKey; return n; });
    setExtraGroups(prev => prev.map(k => (k === oldKey ? newKey : k)));
  }, []);

  const addVehicle = useCallback(() => {
    setExtraGroups(prev => [...prev, `VOZILO ${prev.length + 1}`]);
  }, []);

  const reset = useCallback(() => {
    setPhotos([]); setAssign({}); setExtraGroups([]); setAnalyzed(false); setError("");
  }, []);

  // derive groups
  const groupKeys = Array.from(new Set([
    ...photos.map(p => assign[p.id]).filter(k => k && k !== UNSORTED),
    ...extraGroups,
  ]));
  const unsorted = photos.filter(p => (assign[p.id] ?? UNSORTED) === UNSORTED);
  const photosIn = (key: string) => photos.filter(p => assign[p.id] === key);

  const onDrop = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) reassign(id, key);
  };
  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  return (
    <div>
      {/* Dropzone / controls */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? "var(--navy, #16324f)" : "#d7dee4"}`, borderRadius: 14,
          padding: "28px 20px", textAlign: "center", cursor: "pointer", background: drag ? "#eef3f7" : "#fafbfc", marginBottom: 16,
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple hidden
          onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
        <div style={{ fontSize: 30, marginBottom: 6 }} aria-hidden>📷</div>
        <div style={{ fontWeight: 600, color: "var(--navy-deep)" }}>Povleci fotografije poškodb sem ali klikni za izbiro</div>
        <div style={{ fontSize: 12.5, color: "#9aa3ad", marginTop: 4 }}>AI prebere VIN iz vsake fotografije in jih razvrsti po vozilih.</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <button onClick={analyze} disabled={!photos.length || analyzing}
          style={{ padding: "10px 18px", background: "var(--navy, #16324f)", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: photos.length && !analyzing ? "pointer" : "not-allowed", opacity: photos.length && !analyzing ? 1 : 0.5 }}>
          {analyzing ? "Analiziram…" : `Analiziraj (${photos.length})`}
        </button>
        <button onClick={addVehicle} style={ghostBtn}>＋ Dodaj vozilo ročno</button>
        {photos.length > 0 && <button onClick={reset} style={ghostBtn}>Počisti vse</button>}
        {error && <span style={{ color: "#a01f0a", fontSize: 13 }}>{error}</span>}
      </div>

      {/* Car groups */}
      {groupKeys.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 22 }}>
          {groupKeys.map(key => (
            <div key={key} onDragOver={allowDrop} onDrop={onDrop(key)}
              style={{ background: "#fff", border: "1px solid var(--border, #e1e7ec)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <input defaultValue={key} onBlur={e => renameGroup(key, e.target.value)}
                  style={{ flex: 1, fontFamily: "var(--mono, monospace)", fontSize: 13, fontWeight: 700, color: "var(--navy-deep)", border: "1px solid transparent", borderRadius: 6, padding: "4px 6px", background: "#f5f7f9" }} />
                <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{photosIn(key).length} foto</span>
              </div>
              <Thumbs photos={photosIn(key)} empty="Povleci fotografije sem" />
            </div>
          ))}
        </div>
      )}

      {/* Unsorted tray */}
      <div onDragOver={allowDrop} onDrop={onDrop(UNSORTED)}
        style={{ background: "#f5f7f9", border: "1px dashed #d7dee4", borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <strong style={{ fontSize: 13, color: "var(--navy-deep)" }}>Nerazvrščeno</strong>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{unsorted.length} foto</span>
        </div>
        {photos.length === 0
          ? <div style={{ fontSize: 13, color: "#9aa3ad" }}>Najprej naloži fotografije.</div>
          : <Thumbs photos={unsorted} empty={analyzed ? "Vse razvrščeno 🎉" : "Klikni Analiziraj za razvrstitev po VIN."} />}
      </div>
    </div>
  );
}

function Thumbs({ photos, empty }: { photos: Photo[]; empty: string }) {
  if (!photos.length) return <div style={{ fontSize: 12.5, color: "#9aa3ad", padding: "8px 0" }}>{empty}</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: 6 }}>
      {photos.map(p => (
        <img key={p.id} src={p.url} alt={p.name} title={p.name} draggable
          onDragStart={e => e.dataTransfer.setData("text/plain", p.id)}
          style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 7, cursor: "grab", border: "1px solid #e1e7ec" }} />
      ))}
    </div>
  );
}

const ghostBtn: React.CSSProperties = { padding: "9px 14px", background: "#fff", color: "#374151", border: "1px solid #d7dee4", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" };
