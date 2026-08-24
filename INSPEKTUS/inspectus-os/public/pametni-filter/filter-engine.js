/* Pametni filter — same rules as src/lib/pametni-filter (TS is canonical). */
(function (global) {
  const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
  const VIN_CHAR = /[A-HJ-NPR-Z0-9]/;

  function extractAllVins(text) {
    const seen = new Set();
    const out = [];
    const matches = String(text).toUpperCase().match(/[A-HJ-NPR-Z0-9]{17}/g) || [];
    for (const m of matches) {
      if (VIN_RE.test(m) && !seen.has(m)) { seen.add(m); out.push(m); }
    }
    return out;
  }
  function extractValidVin(raw) {
    const all = extractAllVins(raw);
    return all.length === 1 ? all[0] : null;
  }
  function looksLikeFailedVinRead(raw) {
    const compact = String(raw).toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (compact.length < 12 || compact.length > 20) return false;
    return compact.split("").filter(c => VIN_CHAR.test(c)).length >= 12;
  }
  function hamming(a, b) {
    if (a.length !== b.length) return Infinity;
    let d = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
    return d;
  }
  function uniqueOneCharCorrection(read, shipList) {
    if (!VIN_RE.test(read)) return null;
    const hits = [];
    for (const vin of shipList) {
      if (!VIN_RE.test(vin)) continue;
      if (hamming(read, vin) === 1) hits.push(vin);
      if (hits.length > 1) return null;
    }
    return hits.length === 1 ? hits[0] : null;
  }

  function compareIngestOrder(a, b) {
    const ia = a.inspectorId || "";
    const ib = b.inspectorId || "";
    if (ia !== ib) return ia < ib ? -1 : 1;
    if (a.capturedAt !== b.capturedAt) return a.capturedAt - b.capturedAt;
    return String(a.name).localeCompare(String(b.name), "en", { numeric: true });
  }

  function runFilter(input) {
    const mode = input.mode || "exif-stream";
    const shipSet = new Set((input.shipList || []).filter(v => VIN_RE.test(v)));
    const photos = (input.photos || []).slice().sort(compareIngestOrder);
    const vehicles = [];
    const unsorted = [];
    let closedByFailedRead = 0;
    const current = {};
    const nid = () => "v_" + Math.random().toString(36).slice(2, 10);

    function close(key, reason) {
      if (current[key]) {
        vehicles.push(current[key]);
        current[key] = null;
        if (reason === "closed_by_failed_read" || reason === "unreadable_vin") closedByFailedRead++;
      }
    }

    for (const photo of photos) {
      const key = photo.inspectorId || "_";
      if (!(key in current)) current[key] = null;
      const read = (input.reads || {})[photo.id] || {};
      const validVin = read.vin && VIN_RE.test(read.vin) ? read.vin : null;
      const failedPlate = !validVin && (photo.kind === "vin" || read.looksLikePlate || (read.raw && looksLikeFailedVinRead(read.raw)));

      if (mode === "explicit-boundary") {
        if (photo.kind === "vin" || validVin) {
          close(key, "unreadable_vin");
          current[key] = {
            id: nid(), vin: validVin || "", vinPhotoId: photo.id, photoIds: [photo.id],
            inspectorId: photo.inspectorId, onShipList: validVin ? shipSet.has(validVin) : false, vinReadable: !!validVin,
          };
          continue;
        }
        if (current[key] && (photo.kind === "damage" || !failedPlate)) {
          current[key].photoIds.push(photo.id);
          continue;
        }
        unsorted.push({ photoId: photo.id, reason: current[key] ? "unreadable_vin" : "no_open_vehicle" });
        continue;
      }

      if (validVin) {
        close(key, "unreadable_vin");
        current[key] = {
          id: nid(), vin: validVin, vinPhotoId: photo.id, photoIds: [photo.id],
          inspectorId: photo.inspectorId, onShipList: shipSet.has(validVin), vinReadable: true,
        };
        continue;
      }
      if (failedPlate) {
        close(key, "closed_by_failed_read");
        current[key] = null;
        unsorted.push({ photoId: photo.id, reason: "unreadable_vin" });
        continue;
      }
      if (current[key]) current[key].photoIds.push(photo.id);
      else unsorted.push({ photoId: photo.id, reason: "no_open_vehicle" });
    }
    for (const k of Object.keys(current)) if (current[k]) vehicles.push(current[k]);

    const seen = new Map();
    const alerts = [];
    for (const v of vehicles) {
      if (!v.vinReadable || !v.vin) continue;
      if (shipSet.size && !shipSet.has(v.vin)) {
        const corrected = uniqueOneCharCorrection(v.vin, shipSet);
        if (corrected) { v.correctedFrom = v.vin; v.vin = corrected; v.onShipList = true; }
        else v.onShipList = false;
      }
      const list = seen.get(v.vin) || [];
      list.push(v.id);
      seen.set(v.vin, list);
      if (v.correctedFrom) alerts.push({ type: "corrected", vin: v.vin, message: "VIN " + v.correctedFrom + " → " + v.vin });
      if (v.vinReadable && v.vin && shipSet.size && !v.onShipList) {
        alerts.push({ type: "unexpected_vin", vin: v.vin, message: "VIN " + v.vin + " ni na seznamu razkladanja." });
      }
    }
    for (const [vin, ids] of seen) {
      if (ids.length > 1) alerts.push({ type: "duplicate_vin", vin, message: "VIN " + vin + " se ponovi." });
    }
    if (shipSet.size) {
      const present = new Set(vehicles.filter(v => v.onShipList).map(v => v.vin));
      for (const vin of shipSet) {
        if (!present.has(vin)) alerts.push({ type: "missing_on_ship", vin, message: "Vozilo " + vin + " je na seznamu, nima pa fotografij." });
      }
    }
    return { vehicles, unsorted, alerts, closedByFailedRead };
  }

  global.PametniFilter = {
    VIN_RE, extractAllVins, extractValidVin, looksLikeFailedVinRead,
    uniqueOneCharCorrection, compareIngestOrder, runFilter,
  };
})(typeof window !== "undefined" ? window : globalThis);
