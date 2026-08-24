import { extractAllVins, isValidVin } from "./vin";

/** Parse a pasted block, CSV text, or spreadsheet cell dump into unique valid VINs. */
export function parseShipListText(text: string): string[] {
  return extractAllVins(text);
}

/**
 * Parse CSV/XLSX via the browser File + SheetJS (xlsx), already in inspectus-os.
 * Falls back to treating the file as UTF-8 text.
 */
export async function parseShipListFile(file: File): Promise<string[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    const XLSX = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const chunks: string[] = [];
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      chunks.push(csv);
    }
    return parseShipListText(chunks.join("\n"));
  }
  const text = await file.text();
  return parseShipListText(text);
}

export function uniqueShipList(vins: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of vins) {
    const vin = v.trim().toUpperCase();
    if (!isValidVin(vin) || seen.has(vin)) continue;
    seen.add(vin);
    out.push(vin);
  }
  return out;
}
