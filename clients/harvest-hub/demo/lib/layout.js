/**
 * layout.js — restore table geometry from a PDF text layer.
 *
 * WHY THIS EXISTS
 * A PDF has no structure, only glyphs at coordinates. In the Merkur offers the VALUES
 * sit on a row ~1pt ABOVE their own labels, so naive reading order yields:
 *     "40.000,00 € 100,00 € 305,50 € Nezgodna smrt: Zlom kosti: Letna premija"
 * — every value, then every label. Any regex/template parser silently mis-pairs them.
 *
 * We rebuild rows by y (with tolerance), order cells by x, and merge wrapped
 * continuation lines. The result is handed to the model, which does the pairing.
 *
 * Runs unchanged in the browser (pdf.js) and in Node (pdfjs-dist) — the demo UI and
 * the scoring harness therefore exercise the SAME code.
 */

export const ROW_TOLERANCE_PT = 2.0;   // 298 and 299 must land in one row
export const CELL_GAP_PT      = 12.0;  // wider gap => new cell, not the same phrase
export const CONT_MIN_PT      = 4.0;   // vertical window for a wrapped continuation line
export const CONT_MAX_PT      = 16.0;
export const X_ALIGN_PT       = 6.0;   // how closely a continuation must align in x

/** pdf.js textContent -> flat items {text,x,y,w}. Accepts browser or Node shape. */
export function itemsFromTextContent(textContent) {
  const out = [];
  for (const it of textContent.items) {
    const s = it.str;
    if (!s || !s.trim()) continue;
    const t = it.transform || [];
    out.push({ text: s, x: +t[4] || 0, y: +t[5] || 0, w: +it.width || 0 });
  }
  return out;
}

/** Group items into visual rows: sort top-to-bottom, cluster y within tolerance. */
export function clusterRows(items, tol = ROW_TOLERANCE_PT) {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];
  for (const it of sorted) {
    const row = rows.find((r) => Math.abs(r.y - it.y) <= tol);
    if (row) { row.items.push(it); row.y = (r_avg(row.items)); }
    else rows.push({ y: it.y, items: [it] });
  }
  for (const r of rows) r.items.sort((a, b) => a.x - b.x);
  return rows.sort((a, b) => b.y - a.y);
}
const r_avg = (arr) => arr.reduce((s, i) => s + i.y, 0) / arr.length;

/** Merge items inside a row into cells; a gap wider than CELL_GAP_PT starts a new cell. */
export function rowToCells(row, gap = CELL_GAP_PT) {
  const cells = [];
  let cur = null;
  for (const it of row.items) {
    if (cur && it.x - (cur.x + cur.w) <= gap) {
      cur.text += (it.x - (cur.x + cur.w) > 0.6 ? " " : "") + it.text;
      cur.w = it.x + it.w - cur.x;
    } else {
      cur = { x: it.x, w: it.w, text: it.text };
      cells.push(cur);
    }
  }
  return cells.map((c) => ({ x: Math.round(c.x), text: c.text.replace(/\s+/g, " ").trim() }))
              .filter((c) => c.text);
}

const isLabel = (t) => /:\s*$/.test(t);
/** A lone cell that continues the previous row's value (wrapped address, long town name). */
function isContinuation(cells, prevCells, dy) {
  if (cells.length !== 1 || !prevCells || !prevCells.length) return false;
  if (dy < CONT_MIN_PT || dy > CONT_MAX_PT) return false;
  const c = cells[0];
  if (isLabel(c.text)) return false;
  if (/^\d[\d.,]*\s*€?$/.test(c.text)) return false;      // a bare amount is its own cell
  return prevCells.some((p) => Math.abs(p.x - c.x) <= X_ALIGN_PT && !isLabel(p.text));
}

/**
 * Full restoration. Returns rows of cells, with wrapped lines merged into the cell above.
 */
export function restoreLayout(items) {
  const rows = clusterRows(items).map((r) => ({ y: r.y, cells: rowToCells(r) }))
                                 .filter((r) => r.cells.length);
  const out = [];
  for (const row of rows) {
    const prev = out[out.length - 1];
    if (prev && isContinuation(row.cells, prev.cells, prev.y - row.y)) {
      const c = row.cells[0];
      // append to the aligned cell on the previous row
      let target = prev.cells.filter((p) => !isLabel(p.text))
                             .sort((a, b) => Math.abs(a.x - c.x) - Math.abs(b.x - c.x))[0];
      if (target) { target.text = (target.text + " " + c.text).replace(/,\s*$/, "").trim(); continue; }
    }
    out.push(row);
  }
  return out;
}

/**
 * Serialise restored rows for the model. Keeping the x positions matters: the grid carries
 * up to THREE label/value pairs per row, so "left = label, right = value" is wrong.
 */
export function serializeRows(rows) {
  return rows.map((r) => r.cells.map((c) => `x${c.x}⟨${c.text}⟩`).join("  ")).join("\n");
}

/** Convenience: one pdf.js page -> serialised layout string. */
export async function pageToLayout(page) {
  const tc = await page.getTextContent();
  return serializeRows(restoreLayout(itemsFromTextContent(tc)));
}

/** Router signal: printable characters on the page's text layer. */
export function pageCharCount(textContent) {
  return textContent.items.reduce((n, i) => n + (i.str || "").trim().length, 0);
}
export const VISION_THRESHOLD = 500;
