/**
 * claude.mjs — one call, one schema. Text and vision tracks hit the SAME entry point
 * with the SAME system prompt; only the content blocks differ.
 *
 * Adapted from INSPEKTUS/inspectus-vldr/api/_lib.mjs (proven key-guard + JSON-repair path).
 */

const API = "https://api.anthropic.com/v1/messages";

// Text pairing is structural — Sonnet handles it. Vision reads degraded Canon scans,
// where accuracy decides the demo, so it gets the premium tier.
// Overridable by env so a model can be swapped and re-scored against truth.json without a code
// change — the client owns this after handover and will outlive any model we pick today.
export const MODEL_TEXT = process.env.MODEL_TEXT || "claude-sonnet-4-6";
export const MODEL_VISION = process.env.MODEL_VISION || "claude-opus-4-8";

function apiKey() {
  return process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || null;
}

function parseJson(text) {
  let s = String(text).replace(/```json\s*|\s*```/g, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a !== -1 && b > a) s = s.slice(a, b + 1);
  return JSON.parse(s);
}

/**
 * @param {object}  o
 * @param {string}  o.system
 * @param {string|Array} o.user    string (text track) or content blocks (vision track)
 * @param {string}  [o.model]
 * @param {number}  [o.maxTokens]
 */
export async function callClaude({ system, user, model = MODEL_TEXT, maxTokens = 2048 }) {
  const key = apiKey();
  if (!key) return { error: "no_api_key" };

  let r;
  try {
    r = await fetch(API, {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        // system prompt is identical across every document -> cache it
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: user }],
      }),
    });
  } catch (e) {
    return { error: "network", detail: String(e) };
  }

  if (!r.ok) return { error: `claude_${r.status}`, detail: (await r.text()).slice(0, 400) };

  const data = await r.json();
  const text = data.content?.[0]?.text ?? "";
  const usage = data.usage || {};
  try {
    return { json: parseJson(text), usage };
  } catch {
    return { error: "json_parse", raw: text.slice(0, 400), usage };
  }
}

/** Vision content blocks: a rendered page image plus the same instruction. */
export function imageBlocks(base64Png, instruction) {
  return [
    { type: "image", source: { type: "base64", media_type: "image/png", data: base64Png } },
    { type: "text", text: instruction },
  ];
}

/** Published prices, USD per 1M tokens. Used for the demo's cost line. */
const PRICES = {
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
  "claude-haiku-4-5": { in: 1, out: 5 },
};

/**
 * Cached tokens are NOT billed at the full input rate — a cache read is ~0.1× and a cache write
 * ~1.25×. Counting reads at 1.0× (as this did) overstates the cost of exactly the token class the
 * system prompt is designed to produce, and the overstatement grows as caching works better.
 * Every figure quoted to the client rests on this function, so it prices the three classes apart.
 */
const CACHE_READ = 0.1, CACHE_WRITE = 1.25;
export function costUsd(model, usage = {}) {
  const p = PRICES[model] || PRICES["claude-sonnet-4-6"];
  const fresh = usage.input_tokens || 0;
  const read = usage.cache_read_input_tokens || 0;
  const write = usage.cache_creation_input_tokens || 0;
  return ((fresh + read * CACHE_READ + write * CACHE_WRITE) / 1e6) * p.in
    + ((usage.output_tokens || 0) / 1e6) * p.out;
}
