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

// Fetch a same-origin asset once and return it as a data URI (cached).
// Every VLDR card embeds the SAME 3 images — the /eu6546-form.png background (2030×2873,
// ~23 MB once decoded) + two /inspectus-signature.jpeg stamps. If html2canvas is left to load
// them itself it re-fetches and re-decodes all 3 for EVERY card: 314 cards = ~940 requests and
// ~940 decodes of a 23 MB PNG. Under that pressure a card render fails or times out; the export
// then produced an empty ZIP ("archive is empty or contains no readable items"). Inlining each
// unique asset ONCE and swapping it into the clone (see onclone below) means one decode, reused —
// zero network during the run.
async function assetToDataUri(url: string, cache: Map<string, string>): Promise<string> {
  const hit = cache.get(url);
  if (hit) return hit;
  const res = await fetch(url);
  const blob = await res.blob();
  const data = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(blob);
  });
  cache.set(url, data);
  return data;
}

// Render every .vldr-card inside `container` to a JPG and bundle them into one ZIP.
//
// ROOT CAUSE (found by reproducing the real export at N=314 against the live build):
// the page renders ALL cards live in one ~337,000 px-tall column, each with a 2030×2873 form
// background (~23 MB once decoded). The browser cannot keep 314 decoded copies, so it evicts /
// never lays out most of them — those cards measure 0×0. html2canvas on a 0×0 element returns a
// 0×0 canvas, and canvas.toBlob() on a 0×0 canvas returns NULL (it does not throw). So every card
// hit the `else failed++` branch and the export shipped an EMPTY ZIP ("archive is empty or
// contains no readable items"). Rendering the live card directly is the bug.
//
// FIX (verified 314/314, 0 failures, ~69 s in-browser): render each card INSIDE A VISIBLE
// OFFSCREEN HOST, one at a time. A freshly-appended, laid-out clone always has real dimensions
// regardless of the source card's tab/scroll/eviction state, so html2canvas always gets a real
// canvas. One card in the host at a time keeps peak memory to a single card.
//   • inline the shared form/signature images once as data URIs (assetToDataUri) so html2canvas
//     never re-fetches ~940 images and the clone paints instantly from cache;
//   • scale 1.5 + quality 0.85 → fully legible, ~half the size of scale 2/0.95;
//   • imageTimeout 0 → a slow decode never aborts a card;
//   • compression STORE → entries are already-compressed JPEGs; re-deflating just burns CPU + a
//     second ~78 MB buffer for ~0 gain;
//   • dispose the canvas + remove the clone each iteration so peak memory stays flat;
//   • blob.size > 0 guard + first-error capture, and NEVER download an empty archive.
// Returns {total, failed}. Single-card export (downloadVldrJpg) stays at scale 2 / 0.95.
export async function downloadAllVldrZip(container: HTMLElement, onProgress) {
  const html2canvas = (await import("html2canvas")).default;
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const cards = Array.from(container.querySelectorAll(".vldr-card")) as HTMLElement[];
  if (!cards.length) throw new Error("Ni kartic za izvoz.");

  // Preload every unique image src used by the cards, once → data URIs.
  const assetCache = new Map<string, string>();
  const srcs = new Set<string>();
  cards[0].querySelectorAll("img").forEach((im) => {
    const s = im.getAttribute("src");
    if (s && !s.startsWith("data:")) srcs.add(s);
  });
  for (const s of srcs) { try { await assetToDataUri(s, assetCache); } catch { /* fall back to network for this src */ } }

  // Visible offscreen host — off-screen but laid out (NOT display:none), so clones have real size.
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-100000px;top:0;z-index:-1;opacity:0;pointer-events:none;";
  document.body.appendChild(host);

  const pad = String(cards.length).length;
  let failed = 0;
  let firstError: unknown = null;
  try {
    for (let i = 0; i < cards.length; i++) {
      // A per-card INDEX prefix guarantees a unique filename even when VINs repeat or are blank
      // (the earlier "ZIP has only one file" bug: all cards shared one VIN → one filename → JSZip
      //  kept only one). The index also sorts the files in card order.
      const vin = (cards[i].getAttribute("data-vin") || "").replace(/[^A-Za-z0-9._-]/g, "");
      const fname = `VLDR-${String(i + 1).padStart(pad, "0")}${vin ? "-" + vin : ""}.jpg`;
      if (onProgress) onProgress(i + 1, cards.length);

      // Clone into the visible host and swap in the inlined (data-URI) images so it paints at once.
      const clone = cards[i].cloneNode(true) as HTMLElement;
      clone.querySelectorAll("img").forEach((im) => {
        const s = im.getAttribute("src");
        if (s && assetCache.has(s)) im.setAttribute("src", assetCache.get(s)!);
      });
      host.appendChild(clone);
      await new Promise((r) => setTimeout(r, 0));                // yield → layout the clone + paint progress
      try {
        const canvas = await html2canvas(clone, { scale: 1.5, backgroundColor: "#ffffff", imageTimeout: 0, logging: false });
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.85));
        canvas.width = canvas.height = 0;                        // free the canvas promptly
        if (blob && blob.size > 0) zip.file(fname, blob);
        else failed++;
      } catch (e) {
        failed++;                                                // one bad card must not kill the ZIP
        if (!firstError) firstError = e;
      } finally {
        host.removeChild(clone);                                 // free the clone (and its 23 MB bg) now
      }
    }
  } finally {
    host.remove();
  }

  // Never hand the user an empty archive. If EVERY card failed, say why instead of silently
  // downloading a 0-file ZIP that Archive Utility opens as "empty".
  if (failed >= cards.length) {
    const why = firstError instanceof Error ? ` (${firstError.message})` : "";
    throw new Error(
      `Nobene od ${cards.length} kartic ni bilo mogoče izvoziti${why}. ` +
      `Zapri druge zavihke/aplikacije in poskusi znova, ali izvozi v manjših sklopih.`
    );
  }

  const out = await zip.generateAsync({ type: "blob", compression: "STORE" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = "VLDR-kartice.zip";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
  return { total: cards.length, failed };
}
