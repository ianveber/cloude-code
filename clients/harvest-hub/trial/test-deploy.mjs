/**
 * test-deploy.mjs — the deployment settings that are load-bearing, and silent when wrong.
 *
 *   node test-deploy.mjs
 *
 * Two unrelated things live here for one reason: both are single lines of vercel.json that break
 * something important without raising an error. The CSP crops documents; the region moves personal
 * data to another continent. Neither shows up in a log.
 *
 * WHY THIS TEST EXISTS. The KLP preview is an `about:srcdoc` iframe, and a srcdoc frame inherits
 * the PARENT page's CSP. Inside it, lib/klp.js ships one inline <script> (FIT_SCRIPT) that scales
 * the 1:1 trace down to the iframe width. Locally there is no CSP and it always ran; on Vercel the
 * policy in vercel.json blocked it, the trace rendered at full size, and the bottom of every
 * kontrolni list was silently cropped. Nothing threw — the page just quietly showed less than it
 * had. That is the whole failure mode: it looks fine until you notice the missing rows.
 *
 * The fix is a sha256 hash of the script body in script-src. A hash is exact, which is the point,
 * and also the danger: edit one character of FIT_SCRIPT and the hash no longer matches, the fit
 * dies again, and again nothing throws. So the hash is not allowed to be a constant somebody
 * remembers to update — it is recomputed from the source here and compared against the deployed
 * policy on every run.
 *
 * Assertions are printed rather than thrown one at a time so a run shows everything at once.
 */

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(HERE, f), "utf8");

let pass = 0, fail = 0;
const ok = (cond, label, detail = "") => {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ""}`); }
};

console.log("\n  deployment settings that fail quietly\n");

/* ── the inline script, straight out of the module that ships it ───────── */

const klp = read("lib/klp.js");
const m = klp.match(/const FIT_SCRIPT = `<script>([\s\S]*?)<\/script>`;/);
ok(!!m, "lib/klp.js still defines FIT_SCRIPT as an inline <script>",
  "if this fails the shape changed — re-read this test before trusting it");
if (!m) { console.log(`\n  ${pass} passed, ${fail} failed\n`); process.exit(1); }

// A CSP hash covers the element's text content exactly: no <script> tags, no trimming.
const body = m[1];
const want = "sha256-" + crypto.createHash("sha256").update(body, "utf8").digest("base64");

/* ── the policy that will actually be served ───────────────────────────── */

const vercel = JSON.parse(read("vercel.json"));
const csp = vercel.headers
  ?.flatMap((h) => h.headers || [])
  .find((h) => h.key.toLowerCase() === "content-security-policy")?.value;

ok(!!csp, "vercel.json serves a Content-Security-Policy");
if (!csp) { console.log(`\n  ${pass} passed, ${fail} failed\n`); process.exit(1); }

const scriptSrc = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("script-src"));
ok(!!scriptSrc, "the policy has a script-src directive");

ok(scriptSrc.includes(`'${want}'`),
  "script-src carries the hash of the CURRENT FIT_SCRIPT",
  `expected  '${want}'\n      in        ${scriptSrc}\n` +
  `      → FIT_SCRIPT changed and the hash did not. Paste the expected value into vercel.json.`);

/* ── the guarantees the hash is not allowed to buy back ────────────────── */

ok(!scriptSrc.includes("'unsafe-inline'"),
  "script-src does NOT fall back to 'unsafe-inline'",
  "a hash next to 'unsafe-inline' is theatre — browsers ignore the hash and allow everything");

ok(!scriptSrc.includes("'unsafe-eval'"),
  "script-src does NOT allow 'unsafe-eval'");

ok(/\bframe-ancestors 'none'/.test(csp), "frame-ancestors is still 'none'");
ok(/\bobject-src 'none'/.test(csp), "object-src is still 'none'");
ok(/\bbase-uri 'none'/.test(csp), "base-uri is still 'none'");

// The reading step must only ever talk to our own function. If a provider swap ever adds a
// third-party origin here, that is data leaving to somewhere the DPA does not name.
const connect = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("connect-src"));
ok(connect && !/https?:\/\//.test(connect),
  "connect-src names no external origin",
  `connect-src is: ${connect} — an external host here means documents go somewhere the DPA does not name`);

/* ── where the function runs ────────────────────────────────────────────
 * The DPA names the countries the client's data is processed in, and the client signs it. With no
 * `regions` key Vercel picks its own default — which was iad1, Washington DC, measured on the
 * first live deploy of this trial while the edge header still said fra1. The document text was
 * crossing to the United States and the response header read `fra1::iad1`, where only the first
 * half is the edge that received the request. Read the second half.
 *
 * Removing this line does not fail a build, does not log, and quietly falsifies a signed
 * contract. Hence a test.
 */
ok(Array.isArray(vercel.regions) && vercel.regions.length === 1 && vercel.regions[0] === "fra1",
  "the function is pinned to fra1 (Frankfurt), matching the DPA",
  `regions is ${JSON.stringify(vercel.regions)} — with no pin Vercel defaults to iad1 (US) and ` +
  `the transfer clause in 06-pogodba-obdelava-ocenjevanje.md becomes untrue`);

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
