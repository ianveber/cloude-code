// @ts-nocheck
import * as XLSXns from "xlsx";
import { toVinFilajAOA, toGroupedSurveyAOA } from "@/lib/vldr/transform";
import columnMap from "@/config/column-map.json";

export function downloadVinFilaj(vehicles: any[], header: any) {
  const XLSX = XLSXns as any;
  const maxD = (columnMap as any).max_damages || 7;
  const aoa = toVinFilajAOA(vehicles, header, maxD);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = ws["!merges"] || [];
  for (let s = 0; s < maxD; s++) { const c0 = 2 + s * 4; ws["!merges"].push({ s: { r: 11, c: c0 }, e: { r: 11, c: c0 + 3 } }); }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, (columnMap as any).vin_filaj_sheet || "prepare for report");
  XLSX.writeFile(wb, "VIN-FILAJ.xlsx");
}

export function downloadGroupedSurvey(rawRows: any[]) {
  const XLSX = XLSXns as any;
  const aoa = toGroupedSurveyAOA(rawRows, columnMap as any);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Zdruzen Survey Report");
  XLSX.writeFile(wb, "Zdruzen-Survey-Report.xlsx");
}

export async function downloadVldrJpg(cardEl: HTMLElement, vin: string) {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(cardEl, { scale: 2, backgroundColor: "#ffffff" });
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg", 0.95);
  a.download = `VLDR-${vin}.jpg`;
  document.body.appendChild(a); a.click(); a.remove();
}

// Render every .vldr-card inside `container` to a JPG and bundle them into one ZIP.
export async function downloadAllVldrZip(container: HTMLElement, onProgress) {
  const html2canvas = (await import("html2canvas")).default;
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const cards = Array.from(container.querySelectorAll(".vldr-card"));
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const vin = card.getAttribute("data-vin") || `kartica-${i + 1}`;
    if (onProgress) onProgress(i + 1, cards.length);
    const canvas = await html2canvas(card, { scale: 2, backgroundColor: "#ffffff" });
    const blob = await new Promise((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.95));
    zip.file(`VLDR-${vin}.jpg`, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = "VLDR-kartice.zip";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
}
