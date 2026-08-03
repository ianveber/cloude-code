/**
 * render-aneks.mjs — turn the amendment into a PDF the client can sign.
 *
 *   node render-aneks.mjs 10-aneks-1-gostovani-preizkus.md Aneks-1-Harvest-Hub.pdf
 *
 * The markdown is the source of truth; this only dresses it. Deliberately a tiny hand-rolled
 * converter rather than a dependency: the document is a fixed, known shape (headings, one lead
 * table, bold runs, a numbered list, two tables, a signature row) and a general markdown library
 * would be more code to audit for a file that goes to a client's lawyer.
 *
 * House style follows the AIS "Uradna ponudba" documents: Arial, brand blue #1E3CAE, generous
 * margins. Print CSS keeps signature blocks and table rows off page breaks — a signature line
 * orphaned onto its own page looks like a document that was assembled carelessly, which is not
 * the impression a data-processing agreement should give.
 */

import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const [, , mdPath, pdfPath] = process.argv;
if (!mdPath || !pdfPath) {
  console.error("usage: node render-aneks.mjs <in.md> <out.pdf>");
  process.exit(2);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Inline: `code`, **bold**, *italic*, »quotes« left alone. Order matters — code first. */
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

const src = fs.readFileSync(mdPath, "utf8").split("\n");
const out = [];
let i = 0;

while (i < src.length) {
  const line = src[i];

  if (/^\s*$/.test(line)) { i++; continue; }

  if (/^# /.test(line)) { out.push(`<h1>${inline(line.slice(2))}</h1>`); i++; continue; }
  if (/^## /.test(line)) { out.push(`<h2>${inline(line.slice(3))}</h2>`); i++; continue; }
  if (/^---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

  // table: header row, separator, body
  if (/^\|/.test(line) && /^\|[\s:|-]+\|\s*$/.test(src[i + 1] || "")) {
    const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    const head = cells(line);
    i += 2;
    const body = [];
    while (i < src.length && /^\|/.test(src[i])) { body.push(cells(src[i])); i++; }
    const headEmpty = head.every((c) => c === "");
    out.push(`<table>${headEmpty ? "" :
      `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>`}` +
      `<tbody>${body.map((r) =>
        `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
    continue;
  }

  // blockquote
  if (/^> /.test(line)) {
    const buf = [];
    while (i < src.length && /^>/.test(src[i])) { buf.push(src[i].replace(/^>\s?/, "")); i++; }
    out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
    continue;
  }

  // numbered list
  if (/^\d+\.\s/.test(line)) {
    const items = [];
    while (i < src.length && (/^\d+\.\s/.test(src[i]) || /^\s{3,}\S/.test(src[i]))) {
      if (/^\d+\.\s/.test(src[i])) items.push(src[i].replace(/^\d+\.\s/, ""));
      else items[items.length - 1] += " " + src[i].trim();
      i++;
    }
    out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ol>`);
    continue;
  }

  // paragraph: join continuation lines
  const buf = [line];
  i++;
  while (i < src.length && !/^\s*$/.test(src[i]) && !/^[|>#-]/.test(src[i]) && !/^\d+\.\s/.test(src[i])) {
    buf.push(src[i]); i++;
  }
  out.push(`<p>${inline(buf.join(" "))}</p>`);
}

const html = `<!doctype html><html lang="sl"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 18mm 17mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.6pt; line-height: 1.45;
         color: #14161a; margin: 0; }
  h1 { font-size: 14pt; color: #1E3CAE; margin: 0 0 3mm; letter-spacing: -.2px; }
  h2 { font-size: 10.5pt; color: #1E3CAE; margin: 6mm 0 2mm; }
  p { margin: 0 0 2.6mm; text-align: justify; }
  hr { border: 0; border-top: 1px solid #d8dbe2; margin: 4mm 0; }
  strong { font-weight: bold; }
  code { font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 8.6pt;
         background: #f3f4f7; padding: 0 2px; border-radius: 2px; }
  table { border-collapse: collapse; width: 100%; margin: 2mm 0 3.4mm; }
  th, td { border: 1px solid #c9cdd6; padding: 1.9mm 2.4mm; text-align: left;
           vertical-align: top; font-size: 9.2pt; }
  th { background: #eef1f9; color: #1E3CAE; font-weight: bold; }
  tr { page-break-inside: avoid; }
  ol { margin: 0 0 2.6mm; padding-left: 6mm; }
  li { margin-bottom: 1.4mm; text-align: justify; }
  blockquote { margin: 2mm 0 3mm; padding: 2.2mm 3mm; background: #f6f8fd;
               border-left: 2.5pt solid #1E3CAE; }
  /* the signature block is the last table — never let it break across pages */
  table:last-of-type { page-break-inside: avoid; margin-top: 6mm; }
  table:last-of-type td { padding-top: 9mm; }
</style></head><body>
${out.join("\n")}
</body></html>`;

// KEEP_HTML=1 leaves the intermediate behind — the only way to LOOK at the layout on a machine
// without poppler, since Chrome will print a PDF nobody can then rasterise back to an image.
const keep = process.env.KEEP_HTML === "1";
const tmp = path.join(path.dirname(pdfPath), keep ? "aneks-preview.html" : ".aneks-render.html");
fs.writeFileSync(tmp, html, "utf8");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
try {
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer",
    `--print-to-pdf=${path.resolve(pdfPath)}`, path.resolve(tmp)], { stdio: "ignore" });
} finally {
  if (!keep) fs.unlinkSync(tmp);
  else console.log(`  kept ${tmp} for inspection`);
}
const size = fs.statSync(pdfPath).size;
console.log(`  ${pdfPath} — ${size.toLocaleString("sl-SI")} bytes`);
if (size < 8000) { console.error("  suspiciously small — check the render"); process.exit(1); }
