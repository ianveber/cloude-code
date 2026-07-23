import { KNOWLEDGE } from "./_knowledge.mjs";

const apiKey = process.env.ANTHROPIC_API_KEY;

// Right-sized models: premium reasoning where judgment matters, efficient model where it doesn't.
export const MODEL_SONNET = "claude-sonnet-4-6"; // validation + user Q&A (quality-critical)
export const MODEL_HAIKU = "claude-haiku-4-5";   // summaries + legacy filter (low-stakes)

// Same Claude proxy logic as the tested Bun server: trained INSPECTUS knowledge as a
// prompt-cached system block, then the task-specific system block.
export async function callClaude({ system, user, expectJson = false, maxTokens = 1024, model = MODEL_SONNET }) {
  if (!apiKey) return { error: "no_api_key" };
  const sys = [];
  if (KNOWLEDGE) sys.push({ type: "text", text: KNOWLEDGE, cache_control: { type: "ephemeral" } });
  sys.push({ type: "text", text: system, cache_control: { type: "ephemeral" } });
  let r;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system: sys, messages: [{ role: "user", content: user }] })
    });
  } catch (e) { return { error: "network", detail: String(e) }; }
  if (!r.ok) return { error: "claude_" + r.status, detail: await r.text() };
  const data = await r.json();
  const text = data.content?.[0]?.text ?? "";
  if (!expectJson) return { text };
  try {
    let cleaned = text.replace(/```json\s*|\s*```/g, "").trim();
    const a = cleaned.indexOf("{"), b = cleaned.lastIndexOf("}");
    if (a !== -1 && b > a) cleaned = cleaned.slice(a, b + 1);
    return { json: JSON.parse(cleaned) };
  } catch { return { error: "json_parse", raw: text }; }
}

export function readBody(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  return b || {};
}

// --- Light abuse protection (deters casual key-burning; not a hard auth boundary) ---
// Same-origin browser POSTs from the app always carry Origin or Referer → allowed.
// Direct curl/bots with neither header, or a foreign origin, get 403. Plus a best-effort
// per-instance rate limit. Tunable via env: ALLOWED_ORIGINS (csv host list), RL_MAX, RL_WIN_MS.
const ALLOWED = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

function reqHost(req) {
  const o = req.headers?.origin || req.headers?.referer || "";
  try { return o ? new URL(o).host.toLowerCase() : ""; } catch { return ""; }
}

function originAllowed(req) {
  const h = reqHost(req);
  if (!h) return false;                                              // no Origin/Referer → likely curl/bot
  if (h === "localhost" || h.startsWith("localhost:") || h.startsWith("127.0.0.1")) return true;
  if (h === "inspectus-vldr.vercel.app") return true;                // production alias
  if (h.startsWith("inspectus-vldr-") && h.endsWith(".vercel.app")) return true; // this project's preview URLs
  return ALLOWED.includes(h);                                        // future custom domain via env
}

const _rl = new Map();                                               // ip -> { count, reset } — per warm instance
const RL_MAX = Number(process.env.RL_MAX || 40);
const RL_WIN = Number(process.env.RL_WIN_MS || 60000);

function rateLimited(req) {
  const ip = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  let e = _rl.get(ip);
  if (!e || now > e.reset) { e = { count: 0, reset: now + RL_WIN }; _rl.set(ip, e); }
  e.count++;
  return e.count > RL_MAX;
}

// Returns true (and writes the response) when the request should be blocked.
export function guard(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return true; }
  if (!originAllowed(req)) { res.status(403).json({ error: "forbidden_origin" }); return true; }
  if (rateLimited(req)) { res.status(429).json({ error: "rate_limited" }); return true; }
  return false;
}
