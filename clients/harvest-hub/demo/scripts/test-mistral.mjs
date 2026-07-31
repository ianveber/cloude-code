/**
 * test-mistral.mjs — the Mistral adapter, proven against a local stub.
 *
 * Deliberately does NOT call Mistral. It proves the things that are our code's job and that would
 * otherwise be discovered against a live paid endpoint: the request we build, the translation of a
 * vision block, the mapping of their usage fields onto ours, the cost arithmetic, every error path,
 * and — the point of the whole exercise — that a `mistral-*` model id dispatches out of the
 * Anthropic path without any call site knowing.
 *
 * Accuracy is NOT tested here. That needs a real key and scripts/verify.mjs.
 *
 *   node scripts/test-mistral.mjs
 */

import http from "node:http";
import assert from "node:assert/strict";

let pass = 0;
const fail = [];
const ok = (name, fn) => { try { fn(); pass++; } catch (e) { fail.push(`${name}: ${e.message}`); } };

/* ── stub that records what we send ───────────────────────────────────────── */
let lastRequest = null;
let reply = { status: 200, body: null };

const stub = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    lastRequest = { url: req.url, method: req.method, headers: req.headers, body: JSON.parse(body) };
    res.writeHead(reply.status, { "content-type": "application/json" });
    res.end(typeof reply.body === "string" ? reply.body : JSON.stringify(reply.body));
  });
});
await new Promise((r) => stub.listen(0, "127.0.0.1", r));
const port = stub.address().port;

process.env.MISTRAL_BASE_URL = `http://127.0.0.1:${port}`;
process.env.MISTRAL_API_KEY = "test-key-not-real";

const { callClaude, costUsd } = await import("../lib/claude.mjs");
const { toMistralContent } = await import("../lib/mistral.mjs");

const mistralReply = (content, usage = { prompt_tokens: 2500, completion_tokens: 300 }) => ({
  id: "cmpl-1", model: "mistral-small-latest", created: 1,
  choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
  usage: { ...usage, total_tokens: usage.prompt_tokens + usage.completion_tokens },
});

console.log("\n  Mistral adapter — against a local stub, no network\n");

/* ── 1 · dispatch: a mistral model must leave the Anthropic path ──────────── */
reply = { status: 200, body: mistralReply('{"zavarovalec":{"ime":"Ime Priimek"}}') };
let res = await callClaude({ system: "SYS", user: "LAYOUT", model: "mistral-small-latest" });

ok("dispatch — mistral model reaches the stub, not api.anthropic.com", () =>
  assert.ok(lastRequest, "stub received no request"));
ok("endpoint is /v1/chat/completions", () =>
  assert.equal(lastRequest.url, "/v1/chat/completions"));
ok("method is POST", () => assert.equal(lastRequest.method, "POST"));
ok("auth is a Bearer token, not x-api-key", () => {
  assert.equal(lastRequest.headers.authorization, "Bearer test-key-not-real");
  assert.equal(lastRequest.headers["x-api-key"], undefined);
});

/* ── 2 · request body ─────────────────────────────────────────────────────── */
ok("model is passed through", () => assert.equal(lastRequest.body.model, "mistral-small-latest"));
ok("system prompt becomes a system message", () => {
  assert.equal(lastRequest.body.messages[0].role, "system");
  assert.equal(lastRequest.body.messages[0].content, "SYS");
});
ok("text-track user content stays a plain string", () => {
  assert.equal(lastRequest.body.messages[1].role, "user");
  assert.equal(lastRequest.body.messages[1].content, "LAYOUT");
});
ok("JSON mode is requested server-side", () =>
  assert.deepEqual(lastRequest.body.response_format, { type: "json_object" }));
ok("max_tokens is sent", () => assert.equal(typeof lastRequest.body.max_tokens, "number"));

/* ── 3 · response parsing and usage mapping ───────────────────────────────── */
ok("content is parsed into json", () =>
  assert.deepEqual(res.json, { zavarovalec: { ime: "Ime Priimek" } }));
ok("prompt_tokens -> input_tokens", () => assert.equal(res.usage.input_tokens, 2500));
ok("completion_tokens -> output_tokens", () => assert.equal(res.usage.output_tokens, 300));
ok("cache fields exist and are zero (Mistral reports none)", () => {
  assert.equal(res.usage.cache_read_input_tokens, 0);
  assert.equal(res.usage.cache_creation_input_tokens, 0);
});

/* ── 4 · cost arithmetic on the mapped usage ──────────────────────────────── */
ok("costUsd prices a mistral model from its own row", () => {
  const c = costUsd("mistral-small-latest", res.usage);
  const expect = (2500 / 1e6) * 0.1 + (300 / 1e6) * 0.3;
  assert.ok(Math.abs(c - expect) < 1e-12, `got ${c}, expected ${expect}`);
});
ok("a mistral document is cheaper than the same document on haiku", () =>
  assert.ok(costUsd("mistral-small-latest", res.usage) < costUsd("claude-haiku-4-5", res.usage)));

/* ── 5 · vision block translation ─────────────────────────────────────────── */
ok("anthropic image block becomes a data: URL", () => {
  const out = toMistralContent([
    { type: "image", source: { type: "base64", media_type: "image/png", data: "QUJD" } },
    { type: "text", text: "beri" },
  ]);
  assert.deepEqual(out, [
    { type: "image_url", image_url: "data:image/png;base64,QUJD" },
    { type: "text", text: "beri" },
  ]);
});
ok("an unsupported block throws rather than silently dropping the page", () =>
  assert.throws(() => toMistralContent([{ type: "tool_use" }]), /unsupported/));

/* ── 6 · fenced JSON, which models emit despite json_object ───────────────── */
reply = { status: 200, body: mistralReply('```json\n{"a":1}\n```') };
res = await callClaude({ system: "S", user: "U", model: "mistral-small-latest" });
ok("fenced json is repaired", () => assert.deepEqual(res.json, { a: 1 }));

/* ── 7 · error paths ──────────────────────────────────────────────────────── */
reply = { status: 429, body: { message: "rate limited" } };
res = await callClaude({ system: "S", user: "U", model: "mistral-small-latest" });
ok("non-200 surfaces as an error, never as data", () => {
  assert.equal(res.error, "mistral_429");
  assert.equal(res.json, undefined);
});

reply = { status: 200, body: mistralReply("this is not json at all") };
res = await callClaude({ system: "S", user: "U", model: "mistral-small-latest" });
ok("unparseable content surfaces as json_parse, and keeps usage for cost accounting", () => {
  assert.equal(res.error, "json_parse");
  assert.equal(res.usage.input_tokens, 2500);
});

delete process.env.MISTRAL_API_KEY;
res = await callClaude({ system: "S", user: "U", model: "mistral-small-latest" });
ok("missing key fails closed, before any network call", () =>
  assert.equal(res.error, "no_api_key"));
process.env.MISTRAL_API_KEY = "test-key-not-real";

/* ── 8 · the Anthropic path is untouched ──────────────────────────────────── */
const before = lastRequest;
res = await callClaude({ system: "S", user: "U", model: "claude-haiku-4-5" });
ok("a claude model never reaches the mistral stub", () => {
  assert.equal(lastRequest, before, "claude call leaked into the mistral endpoint");
  assert.ok(res.error, "expected the anthropic path to fail without a real key here");
});

stub.close();

console.log(`\n  ${fail.length ? "FAIL" : "PASS"} — ${pass} checks passed, ${fail.length} failed`);
for (const f of fail) console.log(`    ✗ ${f}`);
console.log("");
process.exit(fail.length ? 1 : 0);
