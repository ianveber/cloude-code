/**
 * api/extract.js — the one paid route, as a Vercel Node function.
 *
 * Ported verbatim in behaviour from demo/server.mjs. Same request contract the browser
 * already speaks:
 *
 *   POST { layout }                  -> text track
 *   POST { imageBase64 }             -> vision track (a rendered page image)
 *   POST { ..., second: true }       -> the independent second reading (different model)
 *
 *   200 { data, cost }   |   4xx/5xx { error }
 *
 * The PDF is still read IN THE BROWSER and never uploaded. Only the restored layout text —
 * or, for a scan, one rendered page image — crosses to this function, which is the only
 * place the API key exists. That is architecture, not a promise, and it is unchanged by
 * moving from a laptop to a hosted URL.
 *
 * ESM on purpose: ../lib/extract.js and ../lib/claude.mjs are ES modules, so the deployed
 * package.json must carry "type": "module". The build step drops lib/ in beside api/, which
 * is why ../lib/... resolves here.
 */

import {
  callClaude, MODEL_TEXT, MODEL_VISION, MODEL_TEXT_B, MODEL_VISION_B, imageBlocks, costUsd,
} from "../lib/claude.mjs";
import { SYSTEM, SCHEMA_HINT, buildUserPrompt } from "../lib/extract.js";

/* Verbatim from demo/server.mjs. The middle paragraph is load-bearing: Harvest Hub writes
   process notes in the margins of these offers, and a reader that treats a handwritten note
   as a field value produces a confidently wrong kontrolni list. */
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

const MAX_BODY_BYTES = 40e6;

/* ── same-origin guard ────────────────────────────────────────────────────────
 * The local server could name its allowed hosts (localhost:8020 and friends). A
 * deployment cannot: the production alias, every preview URL and any custom domain
 * added later are all different hostnames, and a hard-coded list would either lock
 * the client out of a fresh deploy or drift into a stale allow-list nobody prunes.
 *
 * So the expected origin is derived from the request's own Host header. The browser
 * sets Origin on every cross-origin request and on same-origin POSTs, and a page
 * cannot forge it — so "Origin's host equals the host this request arrived at" is
 * exactly "this came from our own page", whatever the deployment is called today.
 *
 * A request with NO Origin (curl, a scraper, a bot) is refused rather than waved
 * through. That is the opposite of the usual convenience default, and it is the
 * right way round here: the only legitimate caller is our own page, and our own
 * page always sends the header.
 */
function sameOrigin(req) {
  const host = String(req.headers?.host || "").toLowerCase();
  const origin = req.headers?.origin;
  if (!host || !origin) return false;            // no Origin at all -> not a browser on our page
  let u;
  try { u = new URL(String(origin)); } catch { return false; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  return u.host.toLowerCase() === host;
}

/* ── spend guards ─────────────────────────────────────────────────────────────
 * PLAINLY: per-instance state is weak on serverless. Vercel runs many instances in
 * parallel and recycles them freely, so these counters are per-instance and per-lifetime,
 * not global. A determined caller who spreads requests across cold starts is not stopped
 * by them. They deter a runaway loop or an accidental retry storm — nothing more.
 *
 * THE REAL BOUNDARY IS THE PASSCODE GATE IN FRONT OF THIS FUNCTION. If that gate is ever
 * removed, this file does not become the thing protecting the key; something else has to.
 *
 * Deliberately generous, as on the laptop: a folder drop of fifteen files is ~30 calls,
 * and a whole working session stays far under the ceiling. These stop a loop, not the trial.
 */
const MAX_CALLS_PER_MIN = Number(process.env.MAX_CALLS_PER_MIN || 60);
const MAX_USD_PER_INSTANCE = Number(process.env.MAX_USD_PER_INSTANCE || 5);
let callTimes = [];       // sliding one-minute window, per warm instance
let spentUsd = 0;         // per warm instance, for its whole lifetime

function spendBlock() {
  const now = Date.now();
  callTimes = callTimes.filter((t) => now - t < 60_000);
  if (spentUsd >= MAX_USD_PER_INSTANCE) return "cost_ceiling";
  if (callTimes.length >= MAX_CALLS_PER_MIN) return "rate_limit";
  callTimes.push(now);
  return null;
}

/* ── key hygiene ──────────────────────────────────────────────────────────────
 * callClaude returns { error, detail } on failure, where `detail` is the provider's own
 * response text. We never forward it. Not because Anthropic is known to echo the key —
 * it is not — but because "the upstream error body is safe to relay" is an assumption
 * about someone else's code that would have to stay true forever, on every status code,
 * for a key that guards a client's GDPR Article 9 workload.
 *
 * The client gets a short code we chose. The detail goes to the server log only, with any
 * literal occurrence of the key scrubbed on the way out.
 */
function scrub(s) {
  let out = String(s ?? "");
  for (const k of [process.env.ANTHROPIC_API_KEY, process.env.CLAUDE_API_KEY]) {
    if (k && k.length > 8) out = out.split(k).join("[kljuc]");
  }
  // and anything that merely looks like one, in case it arrived by another route
  return out.replace(/sk-[A-Za-z0-9_\-]{8,}/g, "[kljuc]").slice(0, 400);
}

/** Vercel usually pre-parses a JSON body; fall back to the stream when it has not. */
async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString("utf8"));
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY_BYTES) throw new Error("body_too_large");
    chunks.push(c);
  }
  if (!size) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const send = (res, status, obj) => {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");        // a reading is personal data; never cached
  res.setHeader("x-robots-tag", "noindex, nofollow");
  res.end(JSON.stringify(obj));
};

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!sameOrigin(req)) return send(res, 403, { error: "forbidden_origin" });

  const blocked = spendBlock();
  if (blocked) {
    console.warn(`refused /api/extract — ${blocked}`);
    return send(res, 429, { error: blocked });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (e) {
    console.warn(`/api/extract bad body — ${scrub(e?.message)}`);
    return send(res, 400, { error: "bad_request" });
  }

  const { layout, imageBase64, second } = body || {};
  const vision = typeof imageBase64 === "string" && imageBase64.length > 0;
  if (!vision && (typeof layout !== "string" || !layout.trim())) {
    return send(res, 400, { error: "bad_request" });
  }

  // `second: true` asks for the independent second reading that feeds the reliability
  // signal. Same prompt, same page, deliberately a different model.
  const model = vision ? (second ? MODEL_VISION_B : MODEL_VISION)
                       : (second ? MODEL_TEXT_B : MODEL_TEXT);

  let r;
  try {
    r = await callClaude({
      system: SYSTEM,
      user: vision ? imageBlocks(imageBase64, VISION_INSTRUCTION) : buildUserPrompt(layout),
      model,
      maxTokens: 3000,
    });
  } catch (e) {
    console.error(`/api/extract threw — ${scrub(e?.stack || e)}`);
    return send(res, 502, { error: "upstream" });
  }

  if (r?.error) {
    // log the provider's own words (scrubbed), return only our own
    console.warn(`/api/extract ${r.error} — ${scrub(r.detail || r.raw || "")}`);
    return send(res, 502, { error: String(r.error).slice(0, 40) });
  }

  const cost = costUsd(model, r.usage);
  spentUsd += cost;
  return send(res, 200, { data: r.json, cost });
}
