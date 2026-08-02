/**
 * server.mjs — static host + the one API route.
 *
 * The PDF is read IN THE BROWSER and never uploaded. Only the restored layout text (or a
 * page image) crosses to this process, which holds the API key. That is the privacy story,
 * and it is architecture rather than a promise.
 *
 *   ANTHROPIC_API_KEY=... node server.mjs      ->  http://localhost:8020
 *
 * Plain node:http on purpose — this repo lives on iCloud, which has hung Bun/Vite dev
 * servers on three prior projects.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { callClaude, MODEL_TEXT, MODEL_VISION, MODEL_TEXT_B, MODEL_VISION_B, imageBlocks, costUsd }
  from "./lib/claude.mjs";
import { SYSTEM, SCHEMA_HINT, buildUserPrompt } from "./lib/extract.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8020;

const VISION_INSTRUCTION = `Preberi to sliko zavarovalne ponudbe in vrni ISTI JSON kot pri besedilni poti.

POZOR — ROKOPIS IN OZNAKE:
Na dokumentu so lahko rokopisne opombe, barvne oznake, nalepke ali obkroženi deli. To so
INTERNE OPOMBE družbe Harvest Hub o postopku — NISO podatki iz ponudbe. Nikoli jih ne
uporabi kot vrednost polja. Beri izključno TISKANO besedilo obrazca.

Če razdelek ZAVAROVANEC vsebuje samo oznake brez vrednosti, ga obravnavaj kot da ga ni (null).
Če zavarovanci niso poimensko navedeni (kolektivno zavarovanje), vrni zavarovanec: null in
zavarovani_otroci: [] — ne izmišljuj si oseb.

Vrni SAMO JSON v tej obliki:
` + SCHEMA_HINT;

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".map": "application/json" };

function serveStatic(req, res) {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel === "/") rel = "/index.html";
  // vendor pdf.js straight out of node_modules — no build step
  const file = rel.startsWith("/vendor/")
    ? path.join(ROOT, "node_modules/pdfjs-dist/build", rel.slice(8))
    : path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
  // never serve the data files, even by accident
  if (/truth\.json|register-zastopnikov\.json|\/out\//.test(file)) { res.writeHead(404).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end("not found"); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(buf);
  });
}

/* ── local-only guard ─────────────────────────────────────────────────────────
 * Binding to loopback is not on its own enough. A page the operator visits can
 * still reach this server by DNS rebinding: the attacker's hostname is made to
 * resolve to 127.0.0.1, so the browser considers the request same-origin and
 * never runs a CORS preflight. What the rebound request cannot hide is the Host
 * header — it still carries the attacker's hostname. Checking Host closes that
 * hole; checking Origin closes the ordinary cross-site case. Applied to every
 * route, because /api/register serves personal data too.
 */
const LOOPBACK_HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`, `[::1]:${PORT}`]);
const LOOPBACK_ORIGINS = new Set([...LOOPBACK_HOSTS].map((h) => `http://${h}`));
const isLocal = (req) =>
  LOOPBACK_HOSTS.has(req.headers.host || "") &&
  (!req.headers.origin || LOOPBACK_ORIGINS.has(req.headers.origin));

/* ── spend guards on the one paid route ───────────────────────────────────────
 * Deliberately generous: a 15-file folder drop is ~11 calls and a whole meeting
 * costs about $0.25. These exist to stop a runaway loop, not to ration the demo.
 */
const MAX_CALLS_PER_MIN = 60;
const MAX_USD_PER_RUN = 5;
let callTimes = [];
let spentUsd = 0;

function spendBlock() {
  const now = Date.now();
  callTimes = callTimes.filter((t) => now - t < 60_000);
  if (spentUsd >= MAX_USD_PER_RUN) return "cost_ceiling";
  if (callTimes.length >= MAX_CALLS_PER_MIN) return "rate_limit";
  callTimes.push(now);
  return null;
}

const server = http.createServer(async (req, res) => {
  if (!isLocal(req)) {
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end("forbidden — local requests only");
    return;
  }
  if (req.url === "/api/extract" && req.method === "POST") {
    const blocked = spendBlock();
    if (blocked) {
      console.warn(`  refused /api/extract — ${blocked} (spent $${spentUsd.toFixed(4)})`);
      res.writeHead(429, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: blocked }));
      return;
    }
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 40e6) req.destroy(); });
    req.on("end", async () => {
      try {
        // `second: true` asks for the independent second reading that feeds the reliability
        // signal. Same prompt, same page, deliberately a different model.
        const { layout, imageBase64, second } = JSON.parse(body);
        const vision = !!imageBase64;
        const model = vision ? (second ? MODEL_VISION_B : MODEL_VISION)
                             : (second ? MODEL_TEXT_B : MODEL_TEXT);
        const r = await callClaude({
          system: SYSTEM,
          user: vision ? imageBlocks(imageBase64, VISION_INSTRUCTION) : buildUserPrompt(layout),
          model,
          maxTokens: 3000,
        });
        const cost = r.error ? 0 : costUsd(model, r.usage);
        spentUsd += cost;
        res.writeHead(r.error ? 502 : 200, { "content-type": "application/json" });
        res.end(JSON.stringify(r.error ? { error: r.error } : { data: r.json, cost }));
      } catch (e) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "bad_request", detail: String(e) }));
      }
    });
    return;
  }
  // the agent register is loaded on demand — this is the demo's closing beat
  if (req.url === "/api/register") {
    // Personal data lives outside the repo (DPA 5(a)); fall back to the old in-repo path.
    const p = [
      path.join(process.env.HOME, "ais-client-data/harvest-hub/register-zastopnikov.json"),
      path.join(ROOT, "register-zastopnikov.json"),
    ].find((c) => fs.existsSync(c));
    if (!p) { res.writeHead(404).end("{}"); return; }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(fs.readFileSync(p));
    return;
  }
  // DEV ONLY, off unless DEMO_SAMPLES=1: serve the sample ponudbe so the flow can be driven
  // without a file picker. Never enable this on a deployed instance — it would publish
  // real personal data over HTTP.
  if (process.env.DEMO_SAMPLES === "1" && req.url.startsWith("/samples/")) {
    const base = [
      path.join(process.env.HOME, "ais-client-data/harvest-hub/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
      path.join(ROOT, "../materiali/vzorci/Vzorci dokumentacije - Ponudbe - vrste zavarovanj"),
    ].find((p) => fs.existsSync(p));
    const name = path.basename(decodeURIComponent(new URL(req.url, "http://x").pathname));
    const f = base && path.join(base, name);
    if (f && fs.existsSync(f) && f.endsWith(".pdf")) {
      res.writeHead(200, { "content-type": "application/pdf" });
      res.end(fs.readFileSync(f));
    } else res.writeHead(404).end();
    return;
  }

  serveStatic(req, res);
});

// Bind to loopback only. On a client's network an all-interfaces bind would expose /samples/
// — and therefore their real personal data — to anyone on the same wifi. This is also the
// technical measure the evaluation DPA commits to (5(e) of 06-pogodba-obdelava-ocenjevanje.md).
server.listen(PORT, "127.0.0.1", () => {
  const ok = !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY);
  console.log(`  http://localhost:${PORT}${ok ? "" : "   (no API key in env — extraction will fail)"}`);
});
