// gates23.test.mjs — T3 (Gate 2, security pass) + T4 (Gate 3, verified deploy
// + SHIP-REPORT) test suite.
// Run: node --test "/Users/ianveber/Desktop/Cloude CODE/3day-protocol/tests"
//
// Fixture pattern: fresh tmp dir per test (fs.mkdtempSync), gate-check init,
// then a controlled PATH pointing at a fake bin dir so the external tool
// matrix (supabase CLI, gitleaks, npx/playwright) is deterministic on any
// machine. Gate 3 network paths run against a local http server on an
// ephemeral port.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

// Resolved relative to THIS file, never hardcoded: an absolute path means a
// copy of the pack silently tests the ORIGINAL rather than itself, so the
// suite passes while proving nothing about the code you actually have.
const PACK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const GC = path.join(PACK, 'bin', 'gate-check');
const GIT_BIN = execFileSync('which', ['git'], { encoding: 'utf8' }).trim();

// ---------------------------------------------------------------- helpers

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gates23-'));
}

function run(args, cwd, opts = {}) {
  const res = spawnSync(process.execPath, [GC, ...args], {
    cwd,
    encoding: 'utf8',
    ...opts,
  });
  return { code: res.status, stdout: res.stdout, stderr: res.stderr };
}

function out(r) {
  return `${r.stdout}\n${r.stderr}`;
}

/**
 * Async spawn for the gate-3 network tests: the fixture http server lives in
 * THIS process, so the runner's event loop must stay free to answer the
 * spawned gate-check's probes (spawnSync would deadlock them into timeouts).
 */
function runAsync(args, cwd, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [GC, ...args], { cwd, ...opts });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

function initProject() {
  const dir = tmp();
  const r = run(['init', dir], dir);
  assert.equal(r.code, 0, out(r));
  return dir;
}

function writeSpec(dir, spec) {
  fs.writeFileSync(
    path.join(dir, '.protocol', 'spec.json'),
    typeof spec === 'string' ? spec : JSON.stringify(spec, null, 2)
  );
}

function readGate(dir, n) {
  const p = path.join(dir, '.protocol', 'gates', `gate-${n}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeGate(dir, n, obj) {
  fs.writeFileSync(
    path.join(dir, '.protocol', 'gates', `gate-${n}.json`),
    JSON.stringify(obj, null, 2)
  );
}

function journalEntries(dir) {
  const p = path.join(dir, '.protocol', 'journal.jsonl');
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function setPhase(dir, phase) {
  fs.writeFileSync(path.join(dir, '.protocol', 'phase'), `${phase}\n`);
}

function evidencePath(dir, name) {
  return path.join(dir, '.protocol', 'evidence', name);
}

function readEvidence(dir, name) {
  return fs.readFileSync(evidencePath(dir, name), 'utf8');
}

function git(args, cwd) {
  return execFileSync(GIT_BIN, args, { cwd, encoding: 'utf8' }).trim();
}

function gitify(dir) {
  fs.writeFileSync(path.join(dir, '.gitignore'), '.protocol/\n.claude/\n');
  fs.writeFileSync(path.join(dir, 'app.js'), 'console.log("v1");\n');
  git(['init', '-q'], dir);
  git(['config', 'user.email', 'fixture@test.local'], dir);
  git(['config', 'user.name', 'Fixture'], dir);
  git(['add', '-A'], dir);
  git(['commit', '-q', '-m', 'v1'], dir);
}

// Fake pg_prove-style outputs for the stub supabase CLI.
const SUPABASE_OK = `#!/bin/sh
echo "supabase/tests/rls.test.sql .. ok"
echo "All tests successful."
echo "Files=1, Tests=12,  2 wallclock secs"
echo "Result: PASS"
exit 0
`;
const SUPABASE_ZERO_TESTS = `#!/bin/sh
echo "All tests successful."
echo "Files=0, Tests=0,  0 wallclock secs"
exit 0
`;
const SUPABASE_FAILING = `#!/bin/sh
echo "supabase/tests/rls.test.sql .. Failed 1/12 subtests"
echo "not ok 3 - anon can read clients"
echo "Files=1, Tests=12,  2 wallclock secs"
echo "Result: FAIL"
exit 1
`;
const SUPABASE_GIBBERISH = `#!/bin/sh
echo "hello, no TAP here"
exit 0
`;

// Stub gitleaks: `version` exits 0 (present); `detect` exits 1 (leak found).
const GITLEAKS_LEAK = `#!/bin/sh
case "$1" in
  version) echo "8.18.0"; exit 0 ;;
  detect)  echo "1 leaks found"; exit 1 ;;
  *) exit 0 ;;
esac
`;
// Stub npx: `playwright --version` exits 0 (present); `playwright test <spec>`
// exits 1 (smoke FAILED), which must drive Gate 3 RED.
const NPX_PLAYWRIGHT_FAIL = `#!/bin/sh
# args: --no-install playwright <version|test> ...
for a in "$@"; do
  case "$a" in
    --version) echo "Version 1.44.0"; exit 0 ;;
    test) echo "1 failed"; echo "smoke.spec.ts:3 signup flow FAILED"; exit 1 ;;
  esac
done
exit 0
`;

/**
 * Build a controlled PATH: a dir containing only what each test wants —
 * a stub `supabase` (optional) and a `git` symlink (optional). gitleaks and
 * npx/playwright default to absent (built-in regex scan + curl-level smoke
 * fallback, deterministic on any machine); pass `gitleaks`/`npx` stub scripts
 * to exercise the real-tool branches (found-leak RED, playwright-smoke RED).
 */
function fakeBin(opts = {}) {
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'gates23bin-'));
  const put = (name, body) => {
    const p = path.join(bin, name);
    fs.writeFileSync(p, body);
    fs.chmodSync(p, 0o755);
  };
  if (opts.supabase) put('supabase', opts.supabase);
  if (opts.gitleaks) put('gitleaks', opts.gitleaks);
  if (opts.npx) put('npx', opts.npx);
  // git is ALWAYS on the stub PATH. Every run project has a repo (P0 requires
  // it) and gate freshness is computed from git HEAD, so a PATH without git
  // makes gitHead() return null — which since F4 correctly renders every green
  // gate stale. Omitting it modelled a run project that cannot exist.
  fs.symlinkSync(GIT_BIN, path.join(bin, 'git'));
  return bin;
}

function envWithPath(bin) {
  return { ...process.env, PATH: bin };
}

function startServer(handler) {
  return new Promise((resolve) => {
    const srv = http.createServer(handler);
    srv.listen(0, '127.0.0.1', () => {
      resolve({ srv, url: `http://127.0.0.1:${srv.address().port}` });
    });
  });
}

function routeServer(routes) {
  return startServer((req, res) => {
    const r = routes[req.url] || { status: 404 };
    res.writeHead(r.status, r.headers || {});
    res.end(r.body || '');
  });
}

const PLANTED_SECRET = '9fK2mQ4xZ1pL6vB3nR5tY0wC8eH4jU7iO2aSdG1kW9qP'; // entropy > 4.5
const SERVICE_ROLE_JWT =
  'eyJhbGciOiJIUzI1NiJ9.' +
  Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url') +
  '.' + 'x'.repeat(24);
const ANON_JWT =
  'eyJhbGciOiJIUzI1NiJ9.' +
  Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url') +
  '.' + 'x'.repeat(24);

// ------------------------------------------------------- Gate 2: RLS check

test('gate 2: missing supabase CLI is RED with an actionable message, never green', () => {
  const dir = initProject();
  const r = run(['2'], dir, { env: envWithPath(fakeBin({})) }); // no supabase anywhere
  assert.notEqual(r.code, 0);
  assert.match(out(r), /supabase CLI not found/i);
  assert.match(out(r), /brew install|--attest/i);
  assert.equal(readGate(dir, 2).status, 'red');
  assert.ok(fs.existsSync(evidencePath(dir, 'gate2-rls.txt')), 'RLS evidence written');
});

test('gate 2: failing `supabase test db` is RED', () => {
  const dir = initProject();
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_FAILING })) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /exited 1|failing/i);
  assert.equal(readGate(dir, 2).status, 'red');
  assert.match(readEvidence(dir, 'gate2-rls.txt'), /not ok 3/);
});

test('gate 2: zero-test RLS suite is RED (a zero-test pass is not a pass)', () => {
  const dir = initProject();
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_ZERO_TESTS })) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /zero tests/i);
  assert.equal(readGate(dir, 2).status, 'red');
});

test('gate 2: exit-0 supabase output with no readable test count is RED (fail closed)', () => {
  const dir = initProject();
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_GIBBERISH })) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /no test count/i);
  assert.equal(readGate(dir, 2).status, 'red');
});

// --------------------------------------------------- Gate 2: secrets scan

test('gate 2: planted secrets are RED via built-in regex, evidence values redacted', () => {
  const dir = initProject();
  fs.writeFileSync(path.join(dir, '.env.local'), `SUPABASE_SERVICE_KEY=${PLANTED_SECRET}\n`);
  fs.mkdirSync(path.join(dir, 'lib'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'lib', 'config.ts'),
    `export const ANTHROPIC = 'sk-ant-api03-Zx9Qw8Er7Ty6Ui5Op4As3Df2Gh1Jk0LzXcVbNm';\n` +
      `export const SRK = '${SERVICE_ROLE_JWT}';\n`
  );
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_OK })) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /secret/i);
  assert.equal(readGate(dir, 2).status, 'red');
  const ev = readEvidence(dir, 'gate2-secrets.txt');
  assert.match(ev, /\.env\.local/);
  assert.match(ev, /sk-ant-\w?/i);
  assert.match(ev, /service_role JWT/);
  // secret values themselves are redacted to their first 6 chars
  assert.ok(!ev.includes(PLANTED_SECRET), 'full planted secret must NOT appear in evidence');
  assert.ok(!ev.includes(SERVICE_ROLE_JWT), 'full JWT must NOT appear in evidence');
  assert.ok(ev.includes(PLANTED_SECRET.slice(0, 6)), 'redacted prefix present');
  assert.match(ev, /redacted/i);
});

test('gate 2: .env.example is exempt and a public anon JWT is not a finding', () => {
  const dir = initProject();
  fs.writeFileSync(path.join(dir, '.env.example'), `SUPABASE_SERVICE_KEY=${PLANTED_SECRET}\n`);
  fs.writeFileSync(path.join(dir, '.env.local'), `NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_JWT}\n`);
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_OK })) });
  assert.equal(r.code, 0, out(r));
  assert.equal(readGate(dir, 2).status, 'green');
  assert.match(readEvidence(dir, 'gate2-secrets.txt'), /no findings/i);
});

test('gate 2: gitleaks-found-leak path is RED (covers the real-tool secret branch)', () => {
  const dir = initProject();
  const r = run(['2'], dir, {
    env: envWithPath(fakeBin({ supabase: SUPABASE_OK, gitleaks: GITLEAKS_LEAK })),
  });
  assert.notEqual(r.code, 0, out(r));
  assert.match(out(r), /leaked secret|gitleaks/i);
  assert.equal(readGate(dir, 2).status, 'red');
  const ev = readEvidence(dir, 'gate2-secrets.txt');
  assert.match(ev, /gitleaks detect/);
  assert.match(ev, /leaks found/);
});

// ------------------------------------------- Gate 2: input validation scan

test('gate 2: unparsed POST handler is RED naming the file; a zod parse clears it', () => {
  const dir = initProject();
  const routeDir = path.join(dir, 'app', 'api', 'things');
  fs.mkdirSync(routeDir, { recursive: true });
  const routeFile = path.join(routeDir, 'route.ts');
  fs.writeFileSync(
    routeFile,
    `export async function POST(request: Request) {\n` +
      `  const body = await request.json();\n` +
      `  return Response.json({ ok: true, body });\n` +
      `}\n`
  );
  const env = envWithPath(fakeBin({ supabase: SUPABASE_OK }));
  let r = run(['2'], dir, { env });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /input validation/i);
  assert.match(out(r), /app\/api\/things\/route\.ts/);
  assert.equal(readGate(dir, 2).status, 'red');

  // same handler with a zod parse in it passes
  fs.writeFileSync(
    routeFile,
    `import { z } from 'zod';\n` +
      `const schema = z.object({ name: z.string() });\n` +
      `export async function POST(request: Request) {\n` +
      `  const body = schema.parse(await request.json());\n` +
      `  return Response.json({ ok: true, body });\n` +
      `}\n`
  );
  r = run(['2'], dir, { env });
  assert.equal(r.code, 0, out(r));
  assert.equal(readGate(dir, 2).status, 'green');
});

test('gate 2: unparsed GET searchParams is a warning in evidence, not a red gate', () => {
  const dir = initProject();
  const routeDir = path.join(dir, 'src', 'app', 'api', 'search');
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(
    path.join(routeDir, 'route.ts'),
    `export function GET(request: Request) {\n` +
      `  const { searchParams } = new URL(request.url);\n` +
      `  return Response.json({ q: searchParams.get('q') });\n` +
      `}\n`
  );
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_OK })) });
  assert.equal(r.code, 0, out(r));
  const gate = readGate(dir, 2);
  assert.equal(gate.status, 'green');
  assert.equal(gate.inputValidation.warnings, 1);
  assert.match(readEvidence(dir, 'gate2-input-validation.txt'), /GET .*searchParams|searchParams/);
});

test('gate 2: an incidental JSON.parse does NOT clear a raw-body POST (fix: false-green)', () => {
  const dir = initProject();
  const routeDir = path.join(dir, 'app', 'api', 'things');
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(
    path.join(routeDir, 'route.ts'),
    `export async function POST(request: Request) {\n` +
      `  const body = await request.json();\n` +
      `  const meta = JSON.parse(body.rawMeta);\n` + // incidental, not schema validation
      `  await db.from('clients').insert(body);\n` +
      `  return Response.json({ ok: true, meta });\n` +
      `}\n`
  );
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_OK })) });
  assert.notEqual(r.code, 0, out(r));
  assert.match(out(r), /input validation/i);
  assert.equal(readGate(dir, 2).status, 'red');
});

test('gate 2: a raw request.formData() POST without a parse is RED (fix: false-green)', () => {
  const dir = initProject();
  const routeDir = path.join(dir, 'app', 'api', 'upload');
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(
    path.join(routeDir, 'route.ts'),
    `export async function POST(request: Request) {\n` +
      `  const form = await request.formData();\n` +
      `  await db.from('files').insert(Object.fromEntries(form));\n` +
      `  return Response.json({ ok: true });\n` +
      `}\n`
  );
  const r = run(['2'], dir, { env: envWithPath(fakeBin({ supabase: SUPABASE_OK })) });
  assert.notEqual(r.code, 0, out(r));
  assert.match(out(r), /input validation/i);
  assert.equal(readGate(dir, 2).status, 'red');
});

// ------------------------------------------------ Gate 2: green + attest

test('gate 2: green records HEAD, evidence paths, and the RLS summary', () => {
  const dir = initProject();
  gitify(dir);
  const r = run(['2'], dir, {
    env: envWithPath(fakeBin({ supabase: SUPABASE_OK, git: true })),
  });
  assert.equal(r.code, 0, out(r));
  const gate = readGate(dir, 2);
  assert.equal(gate.status, 'green');
  assert.equal(gate.head, git(['rev-parse', 'HEAD'], dir), 'git HEAD recorded');
  assert.ok(gate.ts);
  assert.equal(gate.evidence.length, 3, 'rls + secrets + input-validation evidence');
  for (const rel of gate.evidence) {
    assert.ok(fs.existsSync(path.join(dir, rel)), `evidence exists: ${rel}`);
  }
  assert.deepEqual(gate.rls, { total: 12, passed: 12, failed: 0 });
  assert.equal(gate.secrets.findings, 0);
});

test('gate 2 --attest: break-glass records attested status; malformed attest refused', () => {
  const dir = initProject();
  const bad = run(['2', '--attest', 'no-colon-here'], dir);
  assert.notEqual(bad.code, 0);
  assert.match(out(bad), /<name>: <reason>/);

  const r = run(['2', '--attest', 'Ian Veber: Docker down, client demo in 1h'], dir);
  assert.equal(r.code, 0, out(r));
  const gate = readGate(dir, 2);
  assert.equal(gate.status, 'attested');
  assert.equal(gate.approver, 'Ian Veber');
  assert.match(gate.reason, /Docker down/);
  const attests = journalEntries(dir).filter((e) => e.type === 'attest');
  assert.equal(attests.length, 1);
  assert.match(out(r), /NOT a verification|red attestation banner/i);
});

// --------------------------------------------------- Gate 3: preconditions

test('gate 3: refuses when gate 2 has never run / is red', () => {
  const dir = initProject();
  let r = run(['3', '--url', 'http://127.0.0.1:9'], dir, { env: envWithPath(fakeBin({})) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /gate 2/i);
  assert.equal(readGate(dir, 3).status, 'red');

  writeGate(dir, 2, { status: 'red', ts: new Date().toISOString() });
  r = run(['3', '--url', 'http://127.0.0.1:9'], dir, { env: envWithPath(fakeBin({})) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /gate 2 is RED/i);
});

test('gate 3: a STALE green gate 2 does NOT count', () => {
  const dir = initProject();
  gitify(dir);
  writeGate(dir, 2, {
    status: 'green',
    ts: new Date().toISOString(),
    head: git(['rev-parse', 'HEAD'], dir),
  });
  // drift the tree after the "security pass"
  fs.writeFileSync(path.join(dir, 'app.js'), 'console.log("drifted");\n');
  const r = run(['3', '--url', 'http://127.0.0.1:9'], dir, {
    env: envWithPath(fakeBin({ git: true })),
  });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /stale/i);
  assert.equal(readGate(dir, 3).status, 'red');
});

test('gate 3: refuses without a production URL (spec deployUrl or --url)', () => {
  const dir = initProject();
  gitify(dir); // a real gate-2 green records HEAD; without one it is stale (F4)
  writeGate(dir, 2, {
    status: 'green',
    ts: new Date().toISOString(),
    head: git(['rev-parse', 'HEAD'], dir),
    rls: { total: 12, passed: 12, failed: 0 },
    evidence: ['.protocol/evidence/gate2-rls.txt'],
  });
  const r = run(['3'], dir, { env: envWithPath(fakeBin({})) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /deployUrl|--url/);
  assert.equal(readGate(dir, 3).status, 'red');
});

// ------------------------------------------- Gate 3: live probes + report

function gate3Fixture(extraSpec = {}) {
  const dir = initProject();
  // gitify FIRST: a real gate-2 green records git HEAD, and since F4 a green
  // with no recorded head is stale (freshness unproven). gitify's .gitignore
  // excludes .protocol/, so writing the spec afterwards does not dirty the tree.
  gitify(dir);
  writeGate(dir, 2, {
    status: 'green',
    ts: new Date().toISOString(),
    head: git(['rev-parse', 'HEAD'], dir),
    rls: { total: 12, passed: 12, failed: 0 },
    secrets: { tool: 'built-in regex scan', findings: 0 },
    inputValidation: { warnings: 0 },
    // non-empty evidence = the verification signature a real `gate-check 2`
    // green records; Gate 3 rejects a bare hand-edited green without it.
    evidence: ['.protocol/evidence/gate2-rls.txt'],
  });
  writeSpec(dir, {
    project: 'fixture-app',
    pages: [{ name: 'Home', purpose: 'landing' }],
    entities: [{ name: 'clients' }],
    auth: { roles: ['admin'] },
    design: { direction: 'apple-light', tokens: {} },
    deployTarget: 'vercel',
    scopeFence: ['nothing else'],
    provisioning: {},
    protectedRoutes: ['/admin'],
    ...extraSpec,
  });
  return dir;
}

test('gate 3: green path — 200 root, 401 anon probe, curl-level smoke, SHIP-REPORT rendered', async () => {
  const dir = gate3Fixture();
  // journal a forced override first so the report's override scan has a hit
  setPhase(dir, 'P2');
  assert.equal(run(['status', '--force', 'client demo in 1h'], dir).code, 0);

  const { srv, url } = await routeServer({
    '/': { status: 200, body: 'home' },
    '/admin': { status: 401, body: 'denied' },
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.equal(r.code, 0, out(r));

    const gate = readGate(dir, 3);
    assert.equal(gate.status, 'green');
    assert.equal(gate.url, url);
    assert.ok(gate.ts);
    assert.equal(gate.evidence.length, 2, 'probe + smoke evidence');
    assert.match(gate.smoke, /curl-level/);

    const probeEv = readEvidence(dir, 'gate3-probe.txt');
    assert.match(probeEv, /\/admin.*401.*PASS/);
    const smokeEv = readEvidence(dir, 'gate3-smoke.txt');
    assert.match(smokeEv, /curl-level \(playwright/);

    const reportPath = path.join(dir, 'SHIP-REPORT.md');
    assert.ok(fs.existsSync(reportPath), 'SHIP-REPORT.md rendered in run root');
    const report = fs.readFileSync(reportPath, 'utf8');
    assert.match(report, /SHIP REPORT — fixture-app/);
    assert.match(report, /\| 401 \| PASS \|/, 'probe row in the report table');
    assert.match(report, /curl-level/);
    assert.match(report, /ATTENTION — THIS RUN CONTAINS OVERRIDES/, 'force events surfaced');
    assert.match(report, /Count this run: 1 \/ 15/, 'intervention count from journal');
    assert.ok(!report.includes('{{'), 'no unrendered placeholders left');
    assert.ok(!report.includes('<!--'), 'template comment stripped');
  } finally {
    srv.close();
  }
});

test('gate 3: anon 200 on a protected route is RED and no SHIP-REPORT is rendered', async () => {
  const dir = gate3Fixture();
  const { srv, url } = await routeServer({
    '/': { status: 200, body: 'home' },
    '/admin': { status: 200, body: 'OOPS public' }, // the product-killing leak
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.notEqual(r.code, 0);
    assert.match(out(r), /RLS PROBE FAILED/);
    assert.match(out(r), /PUBLIC/);
    assert.equal(readGate(dir, 3).status, 'red');
    assert.ok(!fs.existsSync(path.join(dir, 'SHIP-REPORT.md')), 'no report on red');
    assert.match(readEvidence(dir, 'gate3-probe.txt'), /\/admin.*200.*FAIL/);
  } finally {
    srv.close();
  }
});

test('gate 3: redirect-to-login on a protected route passes the probe', async () => {
  const dir = gate3Fixture();
  const { srv, url } = await routeServer({
    '/': { status: 200, body: 'home' },
    '/admin': { status: 302, headers: { location: '/login' } },
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.equal(r.code, 0, out(r));
    assert.equal(readGate(dir, 3).status, 'green');
    assert.match(readEvidence(dir, 'gate3-probe.txt'), /\/admin.*302.*PASS/);
  } finally {
    srv.close();
  }
});

test('gate 3: non-200 prod root is RED', async () => {
  const dir = gate3Fixture();
  const { srv, url } = await routeServer({
    '/': { status: 500, body: 'boom' },
    '/admin': { status: 401 },
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.notEqual(r.code, 0);
    assert.match(out(r), /returned 500, expected 200/);
    assert.equal(readGate(dir, 3).status, 'red');
  } finally {
    srv.close();
  }
});

test('gate 3: unreachable prod URL is RED, never green', () => {
  const dir = gate3Fixture();
  // port 9 (discard) on localhost: connection refused, fails fast
  const r = run(['3', '--url', 'http://127.0.0.1:9'], dir, { env: envWithPath(fakeBin({})) });
  assert.notEqual(r.code, 0);
  assert.match(out(r), /unreachable|failing closed/i);
  assert.equal(readGate(dir, 3).status, 'red');
});

test('gate 3: attested gate 2 is honored but warned about, and the report screams it', async () => {
  const dir = gate3Fixture();
  writeGate(dir, 2, {
    status: 'attested',
    ts: new Date().toISOString(),
    approver: 'Ian Veber',
    reason: 'Docker down',
  });
  const { srv, url } = await routeServer({
    '/': { status: 200, body: 'home' },
    '/admin': { status: 401 },
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.equal(r.code, 0, out(r));
    assert.match(out(r), /ATTESTED/i);
    const report = fs.readFileSync(path.join(dir, 'SHIP-REPORT.md'), 'utf8');
    assert.match(report, /ATTESTED \(break-glass\)/);
    assert.match(report, /Ian Veber/);
    assert.match(report, /Docker down/);
  } finally {
    srv.close();
  }
});

test('gate 3: zero protectedRoutes is RED — the deployed RLS probe checked nothing (fix: false-green)', async () => {
  // spec with NO protectedRoutes: the deployed anon probe has nothing to prove.
  const dir = gate3Fixture({ protectedRoutes: [] });
  const { srv, url } = await routeServer({ '/': { status: 200, body: 'home' } });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.notEqual(r.code, 0, out(r));
    assert.match(out(r), /no protectedRoutes/i);
    assert.equal(readGate(dir, 3).status, 'red');
    assert.ok(!fs.existsSync(path.join(dir, 'SHIP-REPORT.md')), 'no report on red');
  } finally {
    srv.close();
  }
});

test('gate 3: a hand-edited bare-green gate 2 (no rls/evidence) is REJECTED, not honored (fix: false-green)', async () => {
  const dir = gate3Fixture();
  // Overwrite the fixture's verified green with a bare hand-edit: status+ts only.
  writeGate(dir, 2, { status: 'green', ts: new Date().toISOString() });
  const { srv, url } = await routeServer({
    '/': { status: 200, body: 'home' },
    '/admin': { status: 401 },
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(fakeBin({})) });
    assert.notEqual(r.code, 0, out(r));
    // Since F4 a bare hand-edit is caught by the missing head (freshness
    // unproven) before the evidence check runs. Both are correct rejections of
    // the same forgery — the test's point is that it is never honored.
    assert.match(out(r), /verification evidence|hand-edited|freshness unproven/i);
    assert.equal(readGate(dir, 3).status, 'red');
    assert.ok(!fs.existsSync(path.join(dir, 'SHIP-REPORT.md')), 'no report on rejected precondition');
  } finally {
    srv.close();
  }
});

test('gate 3: playwright smoke FAILED drives Gate 3 RED (covers the smoke.ok===false branch)', async () => {
  const dir = gate3Fixture();
  // Plant a smoke spec so runSmoke takes the playwright path (not curl fallback),
  // and a fake npx whose `playwright test` exits 1 → smoke.ok === false → RED.
  fs.mkdirSync(path.join(dir, 'tests'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'tests', 'smoke.spec.ts'), '// smoke spec (stub)\n');
  // Commit it: an uncommitted file dirties the tree, which correctly makes
  // gate 2 stale and would stop Gate 3 before it ever reaches the smoke run.
  // A real run commits early and often for exactly this reason.
  git(['add', '-A'], dir);
  git(['commit', '-qm', 'add smoke spec'], dir);
  writeGate(dir, 2, {
    status: 'green',
    ts: new Date().toISOString(),
    head: git(['rev-parse', 'HEAD'], dir),
    rls: { total: 12, passed: 12, failed: 0 },
    secrets: { tool: 'built-in regex scan', findings: 0 },
    inputValidation: { warnings: 0 },
    evidence: ['.protocol/evidence/gate2-rls.txt'],
  });
  const bin = fakeBin({ npx: NPX_PLAYWRIGHT_FAIL });
  const { srv, url } = await routeServer({
    '/': { status: 200, body: 'home' },
    '/admin': { status: 401 },
  });
  try {
    const r = await runAsync(['3', '--url', url], dir, { env: envWithPath(bin) });
    assert.notEqual(r.code, 0, out(r));
    assert.match(out(r), /smoke.*FAILED/i);
    assert.equal(readGate(dir, 3).status, 'red');
    assert.match(readEvidence(dir, 'gate3-smoke.txt'), /playwright/i);
  } finally {
    srv.close();
  }
});
