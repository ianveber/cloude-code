"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isValidVin } from "@/lib/pametni-filter/vin";
import { readVinWithFallback } from "@/lib/pametni-filter/ocr";
import { fileToJpegDataUrl } from "@/lib/zajem/photo";
import {
  addPhoto,
  closeVehicle,
  completeShip,
  createShip,
  listPhotos,
  listShips,
  listVehicles,
  loadInspector,
  makeInspector,
  openVehicle,
  saveInspector,
  updateVehicleVin,
  type FieldPhoto,
  type FieldVehicle,
  type InspectorIdentity,
  type ShipSession,
} from "@/lib/zajem/store";

type Screen = "setup" | "capture" | "review";

export default function FieldCapture() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [inspectorName, setInspectorName] = useState("");
  const [inspector, setInspector] = useState<InspectorIdentity | null>(null);
  const [ships, setShips] = useState<ShipSession[]>([]);
  const [shipName, setShipName] = useState("");
  const [ship, setShip] = useState<ShipSession | null>(null);
  const [vehicles, setVehicles] = useState<FieldVehicle[]>([]);
  const [photos, setPhotos] = useState<FieldPhoto[]>([]);
  const [open, setOpen] = useState<FieldVehicle | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [cloudOcr, setCloudOcr] = useState(true);

  const vinInput = useRef<HTMLInputElement>(null);
  const dmgInput = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async (shipId: string, ident?: InspectorIdentity | null) => {
    const who = ident ?? inspector;
    const [v, p] = await Promise.all([listVehicles(shipId), listPhotos(shipId)]);
    setVehicles(v);
    setPhotos(p);
    const mineOpen = v
      .filter(x => !x.closedAt && (!who || x.inspectorId === who.id))
      .sort((a, b) => b.sequence - a.sequence)[0] ?? null;
    setOpen(mineOpen);
  }, [inspector]);

  useEffect(() => {
    const stored = loadInspector();
    if (stored) {
      setInspector(stored);
      setInspectorName(stored.name);
    }
    listShips().then(setShips);
  }, []);

  const enterShip = async (s: ShipSession, ident: InspectorIdentity) => {
    setShip(s);
    setInspector(ident);
    saveInspector(ident);
    await refresh(s.id, ident);
    setScreen("capture");
  };

  const onStart = async () => {
    setError("");
    const name = inspectorName.trim();
    if (name.length < 2) { setError("Vpiši ime inšpektorja."); return; }
    const ident = makeInspector(name);
    saveInspector(ident);
    setInspector(ident);
    if (!ship && !shipName.trim()) { setError("Izberi ladjo ali vpiši ime nove."); return; }
    if (ship) { await enterShip(ship, ident); return; }
    setBusy("Ustvarjam ladjo…");
    try {
      const created = await createShip(shipName.trim());
      setShips(prev => [created, ...prev]);
      await enterShip(created, ident);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ladje ni bilo mogoče ustvariti.");
    } finally {
      setBusy("");
    }
  };

  const captureFile = async (file: File, kind: "vin" | "damage") => {
    if (!ship || !inspector) return;
    setError("");
    setBusy(kind === "vin" ? "Odpiram vozilo…" : "Shranjujem poškodbo…");
    try {
      const dataUrl = await fileToJpegDataUrl(file);
      let vehicle = open;
      if (kind === "vin") {
        if (vehicle && !vehicle.closedAt) {
          await closeVehicle(vehicle.id, { vin: vehicle.vin, vinReadable: vehicle.vinReadable });
        }
        const seq = vehicles.length + 1;
        vehicle = await openVehicle({ shipId: ship.id, inspector, sequence: seq });
        setOpen(vehicle);
        const photo = await addPhoto({
          shipId: ship.id,
          vehicleId: vehicle.id,
          kind: "vin",
          dataUrl,
          inspectorId: inspector.id,
          inspectorName: inspector.name,
        });
        let vin = "";
        let readable = false;
        try {
          const read = await readVinWithFallback(photo.id, dataUrl, { cloud: cloudOcr });
          if (read.vin && isValidVin(read.vin)) {
            vin = read.vin;
            readable = true;
          }
        } catch { /* VIN stays empty — boundary is still this vehicle */ }
        await updateVehicleVin(vehicle.id, vin, readable);
        setOpen({ ...vehicle, vin, vinReadable: readable });
      } else {
        if (!vehicle) { setError("Najprej odpri novo vozilo (fotografija VIN)."); return; }
        await addPhoto({
          shipId: ship.id,
          vehicleId: vehicle.id,
          kind: "damage",
          dataUrl,
          inspectorId: inspector.id,
          inspectorName: inspector.name,
        });
      }
      await refresh(ship.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fotografije ni bilo mogoče shraniti.");
    } finally {
      setBusy("");
    }
  };

  const onComplete = async () => {
    if (!ship) return;
    setBusy("Zaključujem serijo…");
    await completeShip(ship.id);
    setShip({ ...ship, status: "complete" });
    setShips(prev => prev.map(s => s.id === ship.id ? { ...s, status: "complete" } : s));
    setBusy("");
    setScreen("review");
  };

  const mineVehicles = inspector
    ? vehicles.filter(v => v.inspectorId === inspector.id)
    : vehicles;
  const openPhotos = open ? photos.filter(p => p.vehicleId === open.id) : [];
  const damageCount = openPhotos.filter(p => p.kind === "damage").length;

  return (
    <div className="field-app">
      {screen === "setup" && (
        <section className="field-card">
          <h1 className="field-h1">Zajem na terenu</h1>
          <p className="field-lead">
            Fotografiraj VIN, nato poškodbe. Meja med vozili je gumb — ne EXIF.
            Dva inšpektorja delata ločeni seji.
          </p>

          <label className="field-label" htmlFor="ins-name">Ime inšpektorja</label>
          <input id="ins-name" className="field-input" value={inspectorName}
            onChange={e => setInspectorName(e.target.value)}
            placeholder="npr. Ana K." autoComplete="name" />

          <label className="field-label" htmlFor="ship-new">Nova ladja</label>
          <input id="ship-new" className="field-input" value={shipName}
            onChange={e => { setShipName(e.target.value); setShip(null); }}
            placeholder="npr. GRANDE LAGOS · 24. 8. 2026" />

          {ships.length > 0 && (
            <>
              <p className="field-label">Ali odpri obstoječo</p>
              <div className="field-ship-list">
                {ships.map(s => (
                  <button key={s.id} type="button" className={`field-ship ${ship?.id === s.id ? "on" : ""}`}
                    onClick={() => { setShip(s); setShipName(""); }}>
                    <strong>{s.name}</strong>
                    <span>{s.status === "complete" ? "Zaključena" : "Odprta"}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <label className="field-check">
            <input type="checkbox" checked={cloudOcr} onChange={e => setCloudOcr(e.target.checked)} />
            Če lokalni OCR ne prebere VIN, poskusi oblak (isti bralnik kot VIN sortirnik)
          </label>

          {error && <p className="field-err">{error}</p>}
          <button type="button" className="field-btn primary" onClick={onStart} disabled={Boolean(busy)}>
            {busy || "Začni sejo"}
          </button>
        </section>
      )}

      {screen === "capture" && ship && inspector && (
        <section className="field-card">
          <div className="field-meta">
            <div>
              <div className="kpi-label">Ladja</div>
              <div style={{ fontWeight: 700, color: "var(--navy-deep)" }}>{ship.name}</div>
            </div>
            <div>
              <div className="kpi-label">Inšpektor</div>
              <div style={{ fontWeight: 700, color: "var(--navy-deep)" }}>{inspector.name}</div>
            </div>
          </div>

          {open ? (
            <div className="field-open">
              <div className="kpi-label">Odprto vozilo #{open.sequence}</div>
              <div className="field-vin">{open.vin || (open.vinReadable ? "" : "VIN ni prebran — meja je znana")}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{damageCount} fotografij poškodb</div>
              <div className="field-thumbs">
                {openPhotos.map(p => (
                  <img key={p.id} src={p.dataUrl} alt={p.kind} className="field-thumb" />
                ))}
              </div>
            </div>
          ) : (
            <p className="field-lead">Ni odprtega vozila. Začni z VIN tablico.</p>
          )}

          <input ref={vinInput} type="file" accept="image/*" capture="environment" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) captureFile(f, "vin"); e.target.value = ""; }} />
          <input ref={dmgInput} type="file" accept="image/*" capture="environment" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) captureFile(f, "damage"); e.target.value = ""; }} />

          <button type="button" className="field-btn primary" disabled={Boolean(busy)}
            onClick={() => vinInput.current?.click()}>
            Novo vozilo — fotografiraj VIN
          </button>
          <button type="button" className="field-btn" disabled={!open || Boolean(busy)}
            onClick={() => dmgInput.current?.click()}>
            Fotografiraj poškodbo
          </button>

          {busy && <p className="field-lead">{busy}</p>}
          {error && <p className="field-err">{error}</p>}

          <div className="field-row">
            <button type="button" className="field-btn ghost" onClick={() => setScreen("review")}>
              Pregled ({mineVehicles.length})
            </button>
            <button type="button" className="field-btn ghost" onClick={onComplete} disabled={ship.status === "complete"}>
              {ship.status === "complete" ? "Serija zaključena" : "Zaključi serijo"}
            </button>
          </div>
          <button type="button" className="field-link" onClick={() => setScreen("setup")}>Zamenjaj ladjo / inšpektorja</button>
        </section>
      )}

      {screen === "review" && ship && (
        <section className="field-card">
          <h1 className="field-h1">Pregled — {ship.name}</h1>
          <p className="field-lead">
            {vehicles.length} vozil · {photos.length} fotografij
            {ship.status === "complete" ? " · serija zaključena" : ""}
          </p>
          {vehicles.length === 0 && <p className="field-lead">Še ni vozil.</p>}
          <ul className="field-review">
            {vehicles.map(v => {
              const vp = photos.filter(p => p.vehicleId === v.id);
              return (
                <li key={v.id} className="field-review-item">
                  <div>
                    <strong>#{v.sequence}</strong>{" "}
                    <span className="field-vin">{v.vin || "—"}</span>
                    {!v.vinReadable && <span className="field-warn"> VIN neprebran</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    {v.inspectorName} · {vp.filter(p => p.kind === "damage").length} poškodb
                  </div>
                  <div className="field-thumbs">
                    {vp.map(p => <img key={p.id} src={p.dataUrl} alt="" className="field-thumb" />)}
                  </div>
                </li>
              );
            })}
          </ul>
          <button type="button" className="field-btn primary" onClick={() => setScreen("capture")}>
            Nazaj na zajem
          </button>
        </section>
      )}
    </div>
  );
}
