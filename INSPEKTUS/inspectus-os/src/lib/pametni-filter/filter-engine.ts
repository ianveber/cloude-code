import { compareIngestOrder } from "./ingest";
import type {
  FilterResult,
  IngestedPhoto,
  RunFilterInput,
  UnsortedPhoto,
  VehicleGroup,
} from "./types";
import { isValidVin, looksLikeFailedVinRead, uniqueOneCharCorrection } from "./vin";

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * The 9 automations of the pametni filter, in one pass:
 *  1. Capture / ingest order (EXIF or explicit)
 *  2. Photo type (VIN plate vs damage)
 *  3. VIN read (supplied by OCR; this engine never invents one)
 *  4. VIN shape (17 chars, no I/O/Q)
 *  5. Vehicle grouping (VIN opens, damages follow)
 *  6. Failed read closes the previous vehicle
 *  7. Unique 1-char correction vs ship list
 *  8. Bidirectional alerts vs ship list
 *  9. Nerazvrščeno drawer for anything uncertain
 *
 * Never guesses. Inspector streams stay isolated.
 */
export function runFilter(input: RunFilterInput): FilterResult {
  const mode = input.mode ?? "exif-stream";
  const shipSet = new Set(input.shipList.filter(isValidVin));
  const photos = [...input.photos].sort(compareIngestOrder);

  const vehicles: VehicleGroup[] = [];
  const unsorted: UnsortedPhoto[] = [];
  let closedByFailedRead = 0;

  // Open vehicle per inspector stream — two inspectors never share a current vehicle.
  const current: Record<string, VehicleGroup | null> = {};

  const close = (inspectorKey: string, reason: UnsortedPhoto["reason"]) => {
    const open = current[inspectorKey];
    if (open) {
      vehicles.push(open);
      current[inspectorKey] = null;
      if (reason === "closed_by_failed_read" || reason === "unreadable_vin") {
        closedByFailedRead++;
      }
    }
  };

  for (const photo of photos) {
    const inspectorKey = photo.inspectorId ?? "_";
    if (!(inspectorKey in current)) current[inspectorKey] = null;

    const read = input.reads[photo.id];
    const explicitVin = photo.kind === "vin";
    const explicitDamage = photo.kind === "damage";
    const validVin = read?.vin && isValidVin(read.vin) ? read.vin : null;
    const failedPlate =
      !validVin &&
      (explicitVin ||
        read?.looksLikePlate === true ||
        (read?.raw ? looksLikeFailedVinRead(read.raw) : false));

    if (mode === "explicit-boundary") {
      // Boundary is known: VIN button opens a vehicle even when OCR fails.
      if (explicitVin || validVin) {
        close(inspectorKey, "unreadable_vin");
        const vin = validVin ?? "";
        current[inspectorKey] = {
          id: newId("v"),
          vin,
          vinPhotoId: photo.id,
          photoIds: [photo.id],
          inspectorId: photo.inspectorId,
          inspectorName: photo.inspectorName,
          onShipList: vin ? shipSet.has(vin) : false,
          vinReadable: Boolean(validVin),
        };
        continue;
      }
      const open = current[inspectorKey];
      if (open && (explicitDamage || !failedPlate)) {
        open.photoIds.push(photo.id);
        continue;
      }
      unsorted.push({ photoId: photo.id, reason: open ? "unreadable_vin" : "no_open_vehicle" });
      continue;
    }

    // --- EXIF stream (folder of mixed photos) ---
    if (validVin) {
      close(inspectorKey, "unreadable_vin");
      current[inspectorKey] = {
        id: newId("v"),
        vin: validVin,
        vinPhotoId: photo.id,
        photoIds: [photo.id],
        inspectorId: photo.inspectorId,
        inspectorName: photo.inspectorName,
        onShipList: shipSet.has(validVin),
        vinReadable: true,
      };
      continue;
    }

    if (failedPlate) {
      close(inspectorKey, "closed_by_failed_read");
      current[inspectorKey] = null;
      unsorted.push({ photoId: photo.id, reason: "unreadable_vin" });
      continue;
    }

    const open = current[inspectorKey];
    if (open) {
      open.photoIds.push(photo.id);
    } else {
      unsorted.push({ photoId: photo.id, reason: "no_open_vehicle" });
    }
  }

  for (const key of Object.keys(current)) {
    if (current[key]) vehicles.push(current[key]!);
  }

  // Ship-list matching + unique 1-char correction.
  const seenVin = new Map<string, string[]>();
  for (const v of vehicles) {
    if (!v.vinReadable || !v.vin) continue;
    if (shipSet.size === 0) {
      v.onShipList = false;
      continue;
    }
    if (shipSet.has(v.vin)) {
      v.onShipList = true;
    } else {
      const corrected = uniqueOneCharCorrection(v.vin, shipSet);
      if (corrected) {
        v.correctedFrom = v.vin;
        v.vin = corrected;
        v.onShipList = true;
      } else {
        v.onShipList = false;
      }
    }
    const list = seenVin.get(v.vin) ?? [];
    list.push(v.id);
    seenVin.set(v.vin, list);
  }

  const alerts: FilterResult["alerts"] = [];
  for (const v of vehicles) {
    if (v.correctedFrom) {
      alerts.push({
        type: "corrected",
        vin: v.vin,
        message: `VIN ${v.correctedFrom} samodejno popravljen v ${v.vin} (1 znak, edinstveno ujemanje s seznamom ladje).`,
      });
    }
    if (v.vinReadable && v.vin && shipSet.size > 0 && !v.onShipList) {
      alerts.push({
        type: "unexpected_vin",
        vin: v.vin,
        message: `VIN ${v.vin} ni na seznamu razkladanja.`,
      });
    }
  }
  for (const [vin, ids] of seenVin) {
    if (ids.length > 1) {
      alerts.push({
        type: "duplicate_vin",
        vin,
        message: `VIN ${vin} se pojavi pri ${ids.length} vozilih.`,
      });
    }
  }
  if (shipSet.size > 0) {
    const present = new Set(vehicles.filter(v => v.onShipList).map(v => v.vin));
    for (const vin of shipSet) {
      if (!present.has(vin)) {
        alerts.push({
          type: "missing_on_ship",
          vin,
          message: `Vozilo ${vin} je na seznamu ladje, nima pa fotografij.`,
        });
      }
    }
  }

  return { vehicles, unsorted, alerts, closedByFailedRead };
}
