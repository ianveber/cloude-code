/**
 * pdf-text.mjs — print the text of a PDF, for build.sh to grep.
 *
 *   node pdf-text.mjs vzorec/Vzorcna-ponudba.pdf
 *
 * WHY THIS EXISTS RATHER THAN pdftotext. build.sh has to look inside the sample PDF the page
 * offers for download, because a PDF hides its text in compressed streams where grep sees nothing
 * — a real client offer dropped into vzorec/ by mistake would pass every text check and then be
 * served, by us, to anyone with the trial code.
 *
 * The obvious tool is pdftotext, and reaching for it is how the check became decorative once
 * already: an earlier verification piped `pdftotext … | grep` on a machine where poppler was not
 * installed, sent stderr to /dev/null, and reported the file clean. It had read nothing. A guard
 * whose dependency is optional is a guard that reports success when it is absent.
 *
 * pdfjs-dist is not optional here. build.sh already copies two files out of it on every run, so
 * if it is missing the build has already failed for a louder reason. Same library the app itself
 * reads documents with.
 *
 * Exits non-zero and prints nothing on stdout if the file cannot be read, so `set -e` in the
 * caller treats "unreadable" as a failure rather than as an empty — and therefore clean — result.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const file = process.argv[2];
if (!file) {
  console.error("usage: node pdf-text.mjs <file.pdf>");
  process.exit(2);
}
if (!fs.existsSync(file)) {
  console.error(`pdf-text: no such file: ${file}`);
  process.exit(2);
}

// pdfjs lives in the demo's node_modules — this directory deliberately has none of its own.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(HERE, "../demo/package.json"));

let pdfjs;
try {
  pdfjs = await import(
    pathToUrl(require.resolve("pdfjs-dist/legacy/build/pdf.mjs")));
} catch (e) {
  console.error(`pdf-text: cannot load pdfjs-dist (${e?.name || "Error"}). ` +
    `Run npm install in ../demo. Refusing to report this PDF as readable.`);
  process.exit(2);
}

function pathToUrl(p) {
  return new URL(`file://${p.split(path.sep).map(encodeURIComponent).join("/")}`).href;
}

try {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    out.push(tc.items.map((it) => it.str).join(" "));
  }
  await doc.destroy();
  const text = out.join("\n").replace(/\s+/g, " ").trim();
  if (!text) {
    // A scan has no text layer. For OUR sample that is wrong by construction, and silence here
    // would read as "nothing incriminating found".
    console.error(`pdf-text: ${file} has no text layer — nothing to verify.`);
    process.exit(3);
  }
  process.stdout.write(text);
} catch (e) {
  console.error(`pdf-text: failed to read ${file} (${e?.name || "Error"}).`);
  process.exit(2);
}
