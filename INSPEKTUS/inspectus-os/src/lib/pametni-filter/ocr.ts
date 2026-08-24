import { extractValidVin, looksLikeFailedVinRead } from "./vin";

export type LocalRead = {
  vin: string | null;
  raw: string;
  looksLikePlate: boolean;
  source: "tesseract" | "cloud" | "none";
};

/**
 * Browser-side Tesseract path. Loaded on demand so VLDR / VIN sorter stay untouched.
 * Whitelist matches ISO 3779 (no I/O/Q). Empty read is not a guess.
 */
export async function readVinTesseract(dataUrl: string): Promise<LocalRead> {
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng", 1, {
      logger: () => undefined,
      workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js",
      corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core.wasm.js",
      langPath: "https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng@1.0.0/4.0.0_best_int",
    });
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHJKLMNPRSTUVWXYZ0123456789",
    });
    const { data } = await worker.recognize(dataUrl);
    await worker.terminate();
    const raw = (data.text ?? "").replace(/\s+/g, " ").trim();
    const vin = extractValidVin(raw);
    return {
      vin,
      raw,
      looksLikePlate: Boolean(vin) || looksLikeFailedVinRead(raw),
      source: "tesseract",
    };
  } catch {
    return { vin: null, raw: "", looksLikePlate: false, source: "none" };
  }
}

export async function readVinCloud(
  id: string,
  mediaType: string,
  data: string,
): Promise<LocalRead> {
  try {
    const res = await fetch("/api/claude/vin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        images: [{ id, media_type: mediaType, data }],
      }),
    });
    const json = await res.json().catch(() => ({})) as {
      results?: { id: string; vin: string }[];
      apiError?: string | null;
    };
    const vin = json.results?.find(r => r.id === id)?.vin || "";
    const valid = extractValidVin(vin);
    return {
      vin: valid,
      raw: vin,
      looksLikePlate: Boolean(valid),
      source: "cloud",
    };
  } catch {
    return { vin: null, raw: "", looksLikePlate: false, source: "none" };
  }
}

/** Local first; optional cloud fallback only when Tesseract found nothing. Never overwrites a valid local VIN. */
export async function readVinWithFallback(
  id: string,
  dataUrl: string,
  opts?: { cloud?: boolean },
): Promise<LocalRead> {
  const local = await readVinTesseract(dataUrl);
  if (local.vin) return local;
  if (!opts?.cloud) return local;
  const b64 = dataUrl.split(",")[1] ?? "";
  const media = dataUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg";
  const cloud = await readVinCloud(id, media, b64);
  if (cloud.vin) return cloud;
  return {
    vin: null,
    raw: local.raw || cloud.raw,
    looksLikePlate: local.looksLikePlate || cloud.looksLikePlate,
    source: local.source === "none" ? cloud.source : local.source,
  };
}
