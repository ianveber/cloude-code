/**
 * test-logs.mjs — nothing a person could be identified from may reach a log line.
 *
 *   node test-logs.mjs
 *
 * WHY. On the hosted trial, console output is not console output: it is retained by the hosting
 * provider, on a workload the DPA describes as storing nothing. Every log line in api/extract.js
 * is therefore a potential breach of a signed clause, and the failure is silent — the request
 * succeeds or fails as normal and the trace is left behind either way.
 *
 * Two real leaks were found this way, neither of them obvious from reading the code:
 *
 *   1. On a JSON parse failure the handler logged `r.raw`, which is the MODEL'S OWN OUTPUT — that
 *      is, the extracted fields. A person's name, address and date of birth, into log retention.
 *   2. V8 quotes the offending input inside a JSON.parse message, so logging `e.message` on a bad
 *      request body logged the document itself, about twenty characters of it.
 *
 * HOW. Rather than reading the source and reasoning about it — which is how both leaks survived
 * review in the first place — this drives the real handler with a body full of planted identifiers
 * and asserts that none of them appear in anything it wrote to the console. The planted values are
 * invented; no client data is used.
 *
 * No API key is needed or wanted: every path exercised here fails before or at the provider call.
 */

import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

// fileURLToPath, not URL.pathname — this repository lives under a directory with a space in it,
// and pathname hands back the percent-encoded form.
const HERE = path.dirname(fileURLToPath(import.meta.url));

/* ── the identifiers that must never surface ───────────────────────────── */

const PLANTED = {
  ime: "Radovan Zlatokrilec",
  naslov: "Nekje na Robu 14, 4270 Jesenice",
  rojstvo: "07.03.1978",
  epost: "radovan.zlatokrilec@primer-vzorec.si",
  telefon: "041 777 111",
  davcna: "87654321",
  polica: "4400-2026-000999",
};
const NEEDLES = Object.values(PLANTED);

/* ── capture everything the handler writes ─────────────────────────────── */

const written = [];
const real = { log: console.log, warn: console.warn, error: console.error, info: console.info };
const capture = () => {
  for (const k of Object.keys(real)) console[k] = (...a) => written.push(a.join(" "));
};
const release = () => { for (const k of Object.keys(real)) console[k] = real[k]; };

/* ── minimal req/res doubles ───────────────────────────────────────────── */

function makeReq({ body, method = "POST", host = "trial.test" }) {
  const req = {
    method,
    headers: { host, origin: `https://${host}`, "content-type": "application/json" },
    body,
  };
  // When `body` is a Buffer the handler streams it, which is the path that hits JSON.parse.
  if (Buffer.isBuffer(body)) {
    req[Symbol.asyncIterator] = async function* () { yield body; };
    delete req.body;
  }
  return req;
}
function makeRes() {
  const res = { statusCode: 0, body: "", headers: {} };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (c) => { res.statusCode = c; return res; };
  res.end = (b) => { res.body = String(b ?? ""); return res; };
  res.json = (o) => res.end(JSON.stringify(o));
  return res;
}

/* ── report ────────────────────────────────────────────────────────────── */

let pass = 0, fail = 0;
const ok = (cond, label, detail = "") => {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ""}`); }
};
const leaks = (lines) => {
  const found = [];
  for (const line of lines) for (const n of NEEDLES) if (line.includes(n)) found.push(n);
  return [...new Set(found)];
};

/**
 * Whole-identifier matching is too weak, and measuring it is what showed that.
 *
 * V8 truncates the input it quotes to about twenty characters, so the leak it produces is a
 * FRAGMENT: `Unexpected token 'Z', ...""layout": Zlatokrile"...`. "Zlatokrile" is not in NEEDLES,
 * so an exact-match check calls that clean while a recognisable piece of a real surname sits in
 * the hosting provider's log.
 *
 * A partial name, a date of birth, a tax number — all of them fit inside the window, and all of
 * them identify someone. So the standard is any run of RUN characters from the payload, not any
 * whole field. Eight is short enough to catch `Zlatokrile`, long enough that ordinary prose and
 * our own log wording do not collide with it.
 */
const RUN = 8;
const fragments = (payload, lines) => {
  const hay = lines.join("\n");
  const hits = [];
  for (let i = 0; i + RUN <= payload.length; i++) {
    const w = payload.slice(i, i + RUN);
    if (/^[\s"'{}\[\],:]+$/.test(w)) continue;   // structural noise, not content
    if (hay.includes(w)) hits.push(w);
  }
  return [...new Set(hits)];
};

console.log("\n  what reaches a log line\n");

const { default: handler } = await import(pathToFileURL(path.join(HERE, "api/extract.js")).href);

/* ── 1 · malformed body: the V8 message trap ───────────────────────────── */
{
  /**
   * Shaped to produce the QUOTING form of the parse error, not the positional one. V8 only echoes
   * the input on "Unexpected token", and then only the opening ~20 characters — so the personal
   * data has to sit at the very front to be inside the window. That is not a contrivance: a real
   * body begins `{"layout":"` and the document's first line follows immediately after.
   *
   * An unquoted value is what forces it. Verified to yield:
   *   Unexpected token 'Z', ...""layout": Zlatokrile"... is not valid JSON
   */
  const payload = `${PLANTED.ime.replace(/\s/g, "")}${PLANTED.davcna}${PLANTED.rojstvo}`;
  const broken = Buffer.from(`{"layout": ${payload}}`, "utf8");

  written.length = 0;
  capture();
  const res = makeRes();
  await handler(makeReq({ body: broken }), res);
  release();

  ok(res.statusCode === 400, "malformed body is rejected with 400", `got ${res.statusCode}`);
  ok(written.length > 0, "the failure is logged at all (silence would hide real faults)");

  const f = fragments(payload, written);
  ok(f.length === 0,
    `no ${RUN}-character fragment of the document in the log after a parse failure`,
    `leaked: ${f.slice(0, 6).join(", ")}\n      lines: ${written.join(" / ")}`);
  ok(!written.join(" ").includes("Unexpected token") && !written.join(" ").includes("not valid JSON"),
    "the raw V8 parse message is not echoed", written.join(" / "));
}

/* ── 2 · well-formed body, provider unreachable ────────────────────────── */
{
  // No key configured -> callClaude returns { error: "no_api_key" } without a network call.
  const before = { A: process.env.ANTHROPIC_API_KEY, C: process.env.CLAUDE_API_KEY };
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.CLAUDE_API_KEY;

  const layout = Object.values(PLANTED).join(" \n ");
  written.length = 0;
  capture();
  const res = makeRes();
  await handler(makeReq({ body: { layout } }), res);
  release();

  if (before.A) process.env.ANTHROPIC_API_KEY = before.A;
  if (before.C) process.env.CLAUDE_API_KEY = before.C;

  ok(res.statusCode >= 400, "a provider failure is reported as an error", `got ${res.statusCode}`);
  const f = fragments(layout, written);
  ok(f.length === 0 && leaks(written).length === 0,
    `no ${RUN}-character fragment of the document in the log after a provider failure`,
    `leaked: ${f.slice(0, 6).join(", ")}\n      lines: ${written.join(" / ")}`);
  ok(!res.body.includes(PLANTED.ime), "no planted identifier in the RESPONSE body either", res.body);
}

/* ── 3 · the describe-don't-quote helper, over hostile inputs ──────────── */
{
  // The handler's own log for an upstream error must summarise, never quote. Drive it through
  // the same shape the provider produces on a bad status.
  const hostile = [
    `{"error":{"message":"invalid content: ${PLANTED.ime} ${PLANTED.davcna}"}}`,
    `<html><body>${PLANTED.naslov}</body></html>`,
    `{"zavarovalec":{"ime":"${PLANTED.ime}","polica":"${PLANTED.polica}"}}`,
  ];
  const src = await import("node:fs").then((fs) =>
    fs.readFileSync(path.join(HERE, "api/extract.js"), "utf8"));
  const m = src.match(/function describeFailure\(s\) \{[\s\S]*?\n\}/);
  ok(!!m, "describeFailure() is present");
  if (m) {
    // eslint-disable-next-line no-new-func
    const describeFailure = new Function(`${m[0]}; return describeFailure;`)();
    let clean = true, sample = "";
    for (const h of hostile) {
      const out = describeFailure(h);
      if (NEEDLES.some((n) => out.includes(n))) { clean = false; sample = out; }
    }
    ok(clean, "describeFailure() quotes nothing from the provider's body", sample);
    ok(/znakov/.test(describeFailure(hostile[0])), "it still reports the shape and length",
      describeFailure(hostile[0]));
  }
}

/* ── 4 · the source itself: no log site may take a message ─────────────── */
{
  const src = await import("node:fs").then((fs) =>
    fs.readFileSync(path.join(HERE, "api/extract.js"), "utf8"));
  const logLines = src.split("\n")
    .filter((l) => /console\.(log|warn|error|info)\(/.test(l));

  /**
   * Only what is INTERPOLATED can leak — the surrounding prose is ours and may say "bad body"
   * freely. So pull the ${...} expressions out and judge those, and treat a value handed to
   * describeFailure() as handled, since test 3 above proves that function quotes nothing.
   *
   * The first version of this check read whole lines and flagged both remaining log statements:
   * one for the word "body" in an English sentence, one for `r.raw` inside the very call that
   * makes it safe. A guard that cries wolf on correct code gets deleted, so it judges expressions.
   */
  const DANGEROUS = /\.message\b|\blayout\b|\bimageBase64\b|\braw\b|\bdetail\b|\bbody\b/;
  const risky = [];
  for (const line of logLines) {
    for (const [, expr] of line.matchAll(/\$\{([^}]*)\}/g)) {
      const handled = /describeFailure\s*\(/.test(expr);
      if (!handled && DANGEROUS.test(expr)) risky.push(`${expr}   in: ${line.trim()}`);
    }
  }
  ok(risky.length === 0,
    "no log statement interpolates a message or a payload field",
    risky.join("\n      "));
  ok(logLines.length >= 3, "the handler still logs its failures", `found ${logLines.length}`);
}

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
