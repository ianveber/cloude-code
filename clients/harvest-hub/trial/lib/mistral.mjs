/**
 * mistral.mjs — the second provider.
 *
 * Exists to prove a claim we make to the client: the reading engine is not tied to one AI vendor.
 * The whole provider surface of this build is one call, so a second provider is one adapter that
 * satisfies the same contract — `{ system, user, model, maxTokens } -> { json, usage } | { error }`
 * — and nothing else in the codebase changes.
 *
 * Mistral is the interesting alternative for this client specifically: a French company processing
 * in the EU, which removes the third-country transfer and the Article 46 clauses from their
 * compliance story entirely. Whether it is accurate enough is a measurement, not an opinion —
 * point scripts/verify.mjs at it and read the score.
 *
 *   MODEL_TEXT=mistral-small-latest node scripts/verify.mjs
 *
 * Key: MISTRAL_API_KEY, or ~/.mistral_key (same convention as the Anthropic key).
 * Endpoint overridable via MISTRAL_BASE_URL — for a stub, a self-hosted deployment, or a
 * cloud-hosted Mistral behind a different origin.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.env.MISTRAL_BASE_URL || "https://api.mistral.ai";

export function mistralKey() {
  if (process.env.MISTRAL_API_KEY) return process.env.MISTRAL_API_KEY.trim();
  const f = path.join(os.homedir(), ".mistral_key");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim() : null;
}

/**
 * Anthropic content blocks -> Mistral (OpenAI-shaped) content.
 * Text track passes a plain string through. Vision track arrives as Anthropic image blocks
 * (`{type:"image", source:{type:"base64", media_type, data}}`) and becomes a data: URL, which is
 * the shape Mistral's vision models take.
 */
export function toMistralContent(user) {
  if (typeof user === "string") return user;
  return user.map((b) => {
    if (b.type === "text") return { type: "text", text: b.text };
    if (b.type === "image" && b.source?.type === "base64") {
      return { type: "image_url", image_url: `data:${b.source.media_type};base64,${b.source.data}` };
    }
    throw new Error(`unsupported content block for Mistral: ${b.type}`);
  });
}

function parseJson(text) {
  let s = String(text).replace(/```json\s*|\s*```/g, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a !== -1 && b > a) s = s.slice(a, b + 1);
  return JSON.parse(s);
}

/** Same return contract as callClaude — deliberately, so no call site has to know the difference. */
export async function callMistral({ system, user, model, maxTokens = 3000 }) {
  const key = mistralKey();
  if (!key) return { error: "no_api_key" };

  let r;
  try {
    r = await fetch(`${BASE}/v1/chat/completions`, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        // The extractor's whole contract is "return only JSON". Mistral can enforce that server
        // side, which the Anthropic path has to do with a prompt instruction and a repair parse.
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: toMistralContent(user) },
        ],
      }),
    });
  } catch (e) {
    return { error: "network", detail: String(e) };
  }

  if (!r.ok) return { error: `mistral_${r.status}`, detail: (await r.text()).slice(0, 400) };

  const data = await r.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  // Normalise to the Anthropic usage shape so costUsd() and every counter work unchanged.
  const u = data.usage || {};
  const usage = {
    input_tokens: u.prompt_tokens || 0,
    output_tokens: u.completion_tokens || 0,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
  };
  try {
    return { json: parseJson(text), usage };
  } catch {
    return { error: "json_parse", raw: text.slice(0, 400), usage };
  }
}
