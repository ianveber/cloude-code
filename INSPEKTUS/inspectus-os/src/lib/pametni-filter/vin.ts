/** ISO 3779 VIN: 17 chars, A–Z excluding I/O/Q, plus digits. Never guess. */

export const VIN_LENGTH = 17;
export const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

const VIN_CHAR = /[A-HJ-NPR-Z0-9]/;

export function normalizeVinCandidate(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[IOQ]/g, "");
}

export function isValidVin(value: string): boolean {
  return VIN_RE.test(value);
}

/** Extract a well-formed VIN from free text. Null if none — or if more than one, which would be a guess. */
export function extractValidVin(raw: string): string | null {
  const all = extractAllVins(raw);
  return all.length === 1 ? all[0] : null;
}

export function extractAllVins(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const upper = text.toUpperCase();
  const matches = upper.match(/[A-HJ-NPR-Z0-9]{17}/g) ?? [];
  for (const m of matches) {
    if (isValidVin(m) && !seen.has(m)) {
      seen.add(m);
      out.push(m);
    }
  }
  return out;
}

/**
 * A "VIN attempt" is OCR text that looks like someone tried to read a plate
 * (near-17 alphanumeric) but failed validation. Used to close the previous vehicle
 * instead of silently attaching the plate photo as damage.
 */
export function looksLikeFailedVinRead(raw: string): boolean {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length < 12 || compact.length > 20) return false;
  const vinChars = compact.split("").filter(c => VIN_CHAR.test(c)).length;
  return vinChars >= 12;
}

export function hamming(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

/**
 * Unique 1-character correction against the ship list.
 * Returns the unique ship VIN at Hamming distance 1, or null if none / ambiguous.
 * Never "picks the closest" among several — that would be guessing.
 */
export function uniqueOneCharCorrection(read: string, shipList: Iterable<string>): string | null {
  if (!isValidVin(read)) return null;
  const hits: string[] = [];
  for (const vin of shipList) {
    if (!isValidVin(vin)) continue;
    if (hamming(read, vin) === 1) hits.push(vin);
    if (hits.length > 1) return null;
  }
  return hits.length === 1 ? hits[0] : null;
}
