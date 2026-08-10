/**
 * klp.js — render a filled KLP as HTML that traces the client's own form.
 *
 * Their KLP is produced by mPDF 6.0 (a PHP HTML→PDF renderer): A4 595.28×841.89pt,
 * OpenSans regular+bold, zero images, table rules as vector strokes. So an HTML/CSS trace
 * printed by the browser is the SAME technique — and stays vector and sharp.
 * Explicitly NOT html2canvas: that path cost two INSPECTUS sessions to a 0×0 offscreen bug.
 *
 * Geometry below is measured off the single-agent KLP sample, the sole golden target. The
 * two-agent sample is an Allianz form — a different template — do not diff against it.
 * (Sample filenames carry client names, so they live in the data home, not here.)
 */

export const PAGE = { w: 595.28, h: 841.89 };

// vertical rules
export const COL = { l: 42.9, mid: 297.3, r: 552.4, agentA: 215.6, agentB: 384.0 };
// horizontal rules
export const ROWS = {
  head: [67.5, 99.2], ime: [99.2, 127.2], naslov: [127.2, 155.3],
  telefon: [155.3, 183.3], email: [183.3, 211.4],
  zav: [219.6, 247.7], zast1: [255.9, 284.0], zast2: [292.2, 318.5],
};
const PAD_X = 4.1;          // text inset from the cell's left rule
const LABEL_DY = 3.7;       // label baseline offset from the row's top rule
const VALUE_DY = 12.4;      // value offset

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Absolutely-positioned text node, in points. */
function t(x, y, size, text, { bold = false, cls = "" } = {}) {
  if (text == null || text === "") return "";
  return `<div class="t${bold ? " b" : ""}${cls ? " " + cls : ""}" style="left:${x}pt;top:${y}pt;font-size:${size}pt">${esc(text)}</div>`;
}

/**
 * A cell: small label above, value below. `source` drives the provenance tint (screen only).
 * `dy` overrides the label offset — the zast2 row sits 8.2pt below its rule rather than 3.7,
 * because its left-hand cell wraps to two lines. Measured, not guessed.
 */
function cell(x, row, label, val, { bold = true, dy = LABEL_DY } = {}) {
  const [top] = ROWS[row];
  const v = val?.value ?? null;
  const amber = val && val.source && val.source !== "ponudba";
  return t(x, top + dy, 7.5, label) +
         t(x, top + dy + (VALUE_DY - LABEL_DY), 9, v, { bold, cls: amber ? "amber" : "" });
}

function rules() {
  const H = [67.5, 99.2, 127.2, 155.3, 183.3, 211.4, 219.6, 247.7, 255.9, 284.0, 292.2, 318.5];
  // header row carries a grey fill on both cells (measured: rgb 0.867 = #DDD)
  let s =
    `<div class="fill" style="left:42.5pt;top:67.1pt;width:${297.6 - 42.5}pt;height:${99.5 - 67.1}pt"></div>` +
    `<div class="fill" style="left:297.6pt;top:67.1pt;width:${552.8 - 297.6}pt;height:${99.5 - 67.1}pt"></div>`;
  for (const y of H) s += `<div class="hr" style="top:${y}pt;left:${COL.l}pt;width:${COL.r - COL.l}pt"></div>`;
  const seg = (x, a, b) => `<div class="vr" style="left:${x}pt;top:${a}pt;height:${b - a}pt"></div>`;
  for (const [a, b] of [[67.5, 211.4], [219.6, 247.7]]) { s += seg(COL.l, a, b) + seg(COL.mid, a, b) + seg(COL.r, a, b); }
  for (const [a, b] of [[255.9, 284.0], [292.2, 318.5]]) {
    s += seg(COL.l, a, b) + seg(COL.agentA, a, b) + seg(COL.agentB, a, b) + seg(COL.r, a, b);
  }
  return s;
}

/**
 * @param cells  one KLP output from toKlp()
 * @param opts   { screen } true adds the provenance tint + amber legend (never in print)
 */
export function klpHtml(cells, opts = {}) {
  const c = (k) => cells[k] || { value: null, source: null };
  const body =
    rules() +
    t(42.5, 46.5, 12, "KLP") +
    t(127.1, 70.7, 12, "ZAVAROVALEC", { bold: true }) +
    t(122.3, 85.6, 7.5, "(SKLENITELJ ZAVAROVANJA)") +
    t(380.3, 70.7, 12, "ZAVAROVANEC", { bold: true }) +
    t(385.6, 85.6, 7.5, "(ZAVAROVANA OSEBA)") +

    cell(47.0, "ime", "Ime in priimek:", c("zavarovalec.ime_priimek")) +
    cell(301.4, "ime", "Ime in priimek:", c("zavarovanec.ime_priimek")) +
    cell(47.0, "naslov", "Naslov, pošta in kraj:", c("zavarovalec.naslov_posta_kraj")) +
    cell(301.4, "naslov", "Naslov, pošta in kraj:", c("zavarovanec.naslov_posta_kraj")) +
    cell(47.0, "telefon", "Telefon / mobitel:", c("zavarovalec.telefon")) +
    cell(301.4, "telefon", "Telefon / mobitel:", c("zavarovanec.telefon")) +
    cell(47.0, "email", "E-mail:", c("zavarovalec.email")) +
    cell(301.4, "email", "E-mail:", c("zavarovanec.email")) +
    cell(47.0, "zav", "Zavarovalnica:", c("zavarovalnica")) +
    cell(301.4, "zav", "Št. ponudbe:", c("st_ponudbe")) +

    // agent block: section label bold on the left, values NOT bold (matches the original)
    t(47.0, ROWS.zast1[0] + 8.9, 7.5, "Zavarovalni zastopnik", { bold: true }) +
    cell(219.8, "zast1", "Ime in priimek:", c("zastopnik_1.ime_priimek"), { bold: false }) +
    cell(388.1, "zast1", "Številka zav. zastopnika:", c("zastopnik_1.stevilka"), { bold: false }) +

    t(47.0, ROWS.zast2[0] + 3.5, 7.5, "Zavarovalni zastopnik / pomožni zav.", { bold: true }) +
    t(47.0, ROWS.zast2[0] + 12.5, 7.5, "zastopnik", { bold: true }) +
    cell(219.8, "zast2", "Ime in priimek:", c("zastopnik_2.ime_priimek"), { bold: false, dy: 8.2 }) +
    cell(388.1, "zast2", "Številka zav. zastopnika:", c("zastopnik_2.stevilka"), { bold: false, dy: 8.2 });

  return `<!doctype html><html lang="sl"><head><meta charset="utf-8"><title>KLP</title><style>
  @page { size:A4; margin:0 }
  html,body { margin:0; padding:0 }
  .page { position:relative; width:${PAGE.w}pt; height:${PAGE.h}pt; background:#fff;
          font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif; color:#000; }
  .t  { position:absolute; white-space:nowrap; line-height:1.05; }
  .b  { font-weight:700 }
  .fill { position:absolute; background:#DDD }
  .hr { position:absolute; height:0; border-top:0.5pt solid #000 }
  .vr { position:absolute; width:0; border-left:0.5pt solid #000 }
  ${opts.screen ? SCREEN_CSS : ``}
</style></head><body><div class="page">${body}</div>${opts.screen ? FIT_SCRIPT : ``}</body></html>`;
}

/**
 * SCREEN ONLY — never printed.
 *
 * An A4 page is 595.28pt = 794 CSS px wide. The preview frame beside the field rows is about
 * 450, so an unscaled trace loses its whole right-hand third: the ZAVAROVANEC heading and both
 * "Številka zav. zastopnika" cells fall past the edge. That is the demo's payoff and its closing
 * beat, off-screen.
 *
 * So the screen copy is scaled to fit. `transform` does not change layout size, so the fit is
 * computed from the page's own offsetWidth and the frame's width, and re-computed on resize —
 * no hard-coded ratio to drift when the column widths change.
 *
 * Print output stays UNSCALED. The fidelity diff in scripts/render.mjs measures against the
 * client's own PDF in points, and a scaled page would silently pass a wrong geometry.
 */
const SCREEN_CSS = `
  html,body { overflow:hidden; background:#fff }
  .page { transform-origin:top left }
  .amber { background:#FDF2E0; box-shadow:0 0 0 1.5pt #FDF2E0; }`;

/**
 * Neither `resize` nor a ResizeObserver on the root element fires reliably inside an iframe when
 * the PARENT layout resizes the frame — measured, both stay silent while clientWidth has already
 * changed. A wrong scale here silently crops the trace, which is the exact failure this is here
 * to prevent, so the fit does not depend on being told: it re-reads the width and recomputes only
 * when it has actually moved. The two events stay as the fast path.
 */
const FIT_SCRIPT = `<script>
(function(){
  var p=document.querySelector('.page'), last=-1;
  function fit(){
    var w=document.documentElement.clientWidth;
    if(!w||!p.offsetWidth||w===last) return;
    last=w;
    var k=w/p.offsetWidth;
    p.style.transform='scale('+k+')';
    document.body.style.height=(p.offsetHeight*k)+'px';
  }
  fit();
  addEventListener('resize',fit);
  if(window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);
  setInterval(fit,400);
})();
</script>`;

/* ── Privolitvena izjava ─────────────────────────────────────────────────
   Needs SPLIT fields the KLP does not: Ime/Priimek separately, and Ulica separately
   from "Pošta in poštna številka". Both splits are guarded — a wrong guess here writes a
   real person's address incorrectly onto a signed GDPR consent form. */

/** 'Ime Priimek' -> {ime:'Ime', priimek:'Priimek'}; refuses on anything ambiguous. */
export function splitName(full) {
  if (!full) return null;
  const p = full.replace(/\s+/g, " ").trim().split(" ");
  if (p.length !== 2) return null;                    // company, s.p., or a middle name — ask a human
  return { ime: p[0], priimek: p[1] };
}

/** 'Ulica 39E, 1000 Kraj' -> {ulica, posta}; refuses on a non-SI postcode. */
export function splitAddress(addr) {
  if (!addr) return null;
  const m = addr.replace(/\s+/g, " ").trim().match(/^(.+?),\s*(\d{4}\s+.+)$/);
  if (!m) return null;                                // e.g. Italian '34170 GORIZIA' — flag, never guess
  return { ulica: m[1].trim(), posta: m[2].trim() };
}

export function privolitevHtml(cells) {
  const name = splitName(cells["zavarovalec.ime_priimek"]?.value);
  const addr = splitAddress(cells["zavarovalec.naslov_posta_kraj"]?.value);
  const L = (x, y, s) => t(x, y, 9, s);
  const V = (x, y, s) => t(x, y, 9, s, { bold: true });
  const body =
    t(162.6, 46.5, 12, "PRIVOLITVENA IZJAVA ZA OBDELAVO PODATKOV") +
    L(42.5, 79.2, "OSEBNI PODATKI") +
    L(47.0, 99.6, "Ime:")   + V(67.7, 99.5, name?.ime) +
    L(301.4, 99.6, "Mobilni telefon:") + V(369.5, 99.5, cells["zavarovalec.telefon"]?.value) +
    L(47.0, 118.7, "Priimek:") + V(83.5, 118.5, name?.priimek) +
    L(301.4, 118.7, "E-pošta:") + V(337.5, 118.5, cells["zavarovalec.email"]?.value) +
    L(47.0, 137.8, "Ulica:") + V(72.1, 137.6, addr?.ulica) +
    L(301.4, 137.8, "Pošta in poštna številka:") + V(404.5, 137.6, addr?.posta) +
    L(42.5, 169.4, "PRIVOLITEV") +
    L(42.5, 183.2, "Ker bi se vam v družbi") +
    V(142.0, 183.0, "Harvest Hub d.o.o., Dunajska cesta 190, 1000 Ljubljana") +
    L(394.9, 183.2, ", želeli v prihodnje še bolj približati s") +
    // signature block deliberately left empty — hands off to their epodpis@harvest.si flow
    L(42.5, 700, "Datum podpisa: ______________") +
    L(301.4, 700, "Podpis: ______________________");

  return `<!doctype html><html lang="sl"><head><meta charset="utf-8"><title>Privolitvena izjava</title><style>
  @page { size:A4; margin:0 } html,body{margin:0;padding:0}
  .page{position:relative;width:${PAGE.w}pt;height:${PAGE.h}pt;background:#fff;
        font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;color:#000}
  .t{position:absolute;white-space:nowrap;line-height:1.05} .b{font-weight:700}
</style></head><body><div class="page">${body}</div></body></html>`;
}
