// deploy-guard.test.mjs — T0 enforcement spike proof.
// Run: node --test "/Users/ianveber/Desktop/Cloude CODE/3day-protocol/tests"
//
// Simulates Claude Code PreToolUse events (JSON on stdin, exactly as Claude
// Code sends them) against bin/deploy-guard and asserts exit codes:
//   0 = allow, 2 = block (stderr carries the reason).
//
// Fixtures (created fresh in before()):
//   /Users/ianveber/builds/spike/         git repo + .protocol/gates/ + fake
//                                         .vercel/project.json (Vercel-linked)
//   /Users/ianveber/builds/spike-nolink/  git repo + .protocol/gates/, NOT linked

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

// Relative to this file — an absolute path makes a copied pack test the
// original instead of itself.
const GUARD = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'bin', 'deploy-guard');
const SPIKE = '/Users/ianveber/builds/spike';
const NOLINK = '/Users/ianveber/builds/spike-nolink';

// ---------------------------------------------------------------- helpers

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

/** Run the guard with a simulated PreToolUse event. */
function runGuard(command, cwd = SPIKE, toolName = 'Bash') {
  const event = { tool_name: toolName, tool_input: { command }, cwd };
  const res = spawnSync(process.execPath, [GUARD], {
    input: JSON.stringify(event),
    encoding: 'utf8',
  });
  return { code: res.status, stderr: res.stderr, stdout: res.stdout };
}

function writeGate2(dir, obj) {
  fs.writeFileSync(
    path.join(dir, '.protocol', 'gates', 'gate-2.json'),
    typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2)
  );
}

function head(dir) {
  return git(['rev-parse', 'HEAD'], dir);
}

/**
 * Gate-2 green, recorded at the CURRENT HEAD of dir (fresh green). Mirrors the
 * shape a real `gate-check 2` writes: rls summary + non-empty evidence[] (the
 * verification signature the guard now requires — a bare status/head is a
 * hand-edit and blocks).
 */
function greenGate(dir) {
  writeGate2(dir, {
    status: 'green',
    ts: new Date().toISOString(),
    head: head(dir),
    evidence: [
      '.protocol/evidence/gate2-rls.txt',
      '.protocol/evidence/gate2-secrets.txt',
      '.protocol/evidence/gate2-input-validation.txt',
    ],
    rls: { total: 12, passed: 12, failed: 0 },
    secrets: { tool: 'built-in regex scan', findings: 0 },
    inputValidation: { warnings: 0 },
  });
}

function makeFixture(dir, { vercelLinked }) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, '.protocol', 'gates'), { recursive: true });
  // .protocol and .vercel are gitignored so gate writes never dirty the tree.
  fs.writeFileSync(path.join(dir, '.gitignore'), '.protocol/\n.vercel/\n');
  fs.writeFileSync(path.join(dir, 'app.js'), 'console.log("spike v1");\n');
  if (vercelLinked) {
    fs.mkdirSync(path.join(dir, '.vercel'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.vercel', 'project.json'),
      JSON.stringify({ projectId: 'prj_spike_fake', orgId: 'team_fake' })
    );
  }
  git(['init', '-q'], dir);
  git(['config', 'user.email', 'spike@test.local'], dir);
  git(['config', 'user.name', 'Spike Fixture'], dir);
  git(['add', '-A'], dir);
  git(['commit', '-q', '-m', 'spike fixture v1'], dir);
}

before(() => {
  makeFixture(SPIKE, { vercelLinked: true });
  makeFixture(NOLINK, { vercelLinked: false });
});

// ------------------------------------------------------------- leg tests

test('red gate blocks vercel --prod', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /Gate 2 is "red"/);
});

test('red gate blocks vercel deploy', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('vercel deploy');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /BLOCKED/);
});

test('fresh green gate allows vercel --prod', () => {
  greenGate(SPIKE);
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 0, r.stderr);
});

test('stale gate blocks: commit landed after green', () => {
  greenGate(SPIKE); // records current HEAD
  fs.writeFileSync(path.join(SPIKE, 'app.js'), 'console.log("spike v2");\n');
  git(['add', '-A'], SPIKE);
  git(['commit', '-q', '-m', 'drift after gate-2 green'], SPIKE);
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /STALE/);
  assert.match(r.stderr, /re-run/i);
});

test('stale gate blocks: dirty working tree after green', () => {
  greenGate(SPIKE); // fresh HEAD, clean tree
  fs.writeFileSync(path.join(SPIKE, 'app.js'), 'console.log("dirty edit");\n');
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /STALE/);
  assert.match(r.stderr, /dirty/);
  git(['checkout', '--', 'app.js'], SPIKE); // restore for later tests
});

test('attested gate allows with a loud warning', () => {
  writeGate2(SPIKE, {
    status: 'attested',
    ts: new Date().toISOString(),
    approver: 'Ian Veber',
    reason: 'Docker down, manual RLS review done',
  });
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 0);
  assert.match(r.stderr, /WARNING/);
  assert.match(r.stderr, /ATTESTED/);
  assert.match(r.stderr, /Ian Veber/);
});

test('compound command: cd into run project && vercel --prod is caught', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('cd spike && vercel --prod', '/Users/ianveber/builds');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /Gate 2 is "red"/);
});

test('compound command: semicolon and pipe separators are scanned', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('echo hi; vercel deploy').code, 2);
  assert.equal(runGuard('echo hi | tee log.txt && npx vercel --prod').code, 2);
});

test('npx form: npx vercel --prod and npx -y vercel deploy blocked on red', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('npx vercel --prod').code, 2);
  assert.equal(runGuard('npx -y vercel deploy').code, 2);
});

test('npm run deploy blocked on red (and bun/pnpm forms)', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('npm run deploy').code, 2);
  assert.equal(runGuard('pnpm run deploy').code, 2);
  assert.equal(runGuard('bun run deploy:prod').code, 2);
});

test('git push in Vercel-linked project blocked on red', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('git push origin main');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /git push/);
});

test('git push in Vercel-linked project allowed on fresh green', () => {
  greenGate(SPIKE);
  assert.equal(runGuard('git push origin main').code, 0);
});

test('git push WITHOUT .vercel link passes even on red gate', () => {
  writeGate2(NOLINK, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('git push origin main', NOLINK);
  assert.equal(r.code, 0, r.stderr);
});

test('non-deploy vercel commands pass regardless of gate state', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('vercel env pull').code, 0);
  assert.equal(runGuard('vercel link').code, 0);
  assert.equal(runGuard('vercel whoami').code, 0);
  assert.equal(runGuard('npx vercel env pull .env.local').code, 0);
});

test('missing gate file blocks (fail closed)', () => {
  fs.rmSync(path.join(SPIKE, '.protocol', 'gates', 'gate-2.json'), {
    force: true,
  });
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /never been run|missing/);
});

test('malformed gate JSON blocks (fail closed)', () => {
  writeGate2(SPIKE, '{ "status": "green", '); // truncated JSON
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /malformed/i);
});

test('green gate without recorded head blocks (cannot prove freshness)', () => {
  writeGate2(SPIKE, { status: 'green', ts: new Date().toISOString() });
  const r = runGuard('vercel --prod');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /HEAD/);
});

test('deploy intent outside any .protocol project blocks (fail closed)', () => {
  const bare = '/Users/ianveber/builds/spike-bare-tmp';
  fs.rmSync(bare, { recursive: true, force: true });
  fs.mkdirSync(bare, { recursive: true });
  const r = runGuard('vercel --prod', bare);
  assert.equal(r.code, 2);
  assert.match(r.stderr, /no \.protocol/);
  fs.rmSync(bare, { recursive: true, force: true });
});

test('ordinary commands are never touched', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('ls -la').code, 0);
  assert.equal(runGuard('npm run build').code, 0);
  assert.equal(runGuard('git status && git log --oneline -5').code, 0);
  assert.equal(runGuard('node --test tests/').code, 0);
});

test('non-Bash tool events are ignored', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('vercel --prod', SPIKE, 'Write');
  assert.equal(r.code, 0);
});

test('unknown vercel subcommand fails closed on red gate', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('vercel some-future-subcommand').code, 2);
});

test('unparseable hook event does not brick the session (allow + warn)', () => {
  const res = spawnSync(process.execPath, [GUARD], {
    input: 'not json at all',
    encoding: 'utf8',
  });
  assert.equal(res.status, 0);
  assert.match(res.stderr, /unparseable/);
});

// ------------------------------ P1 regression: wrapper-bypass hardening ----
// A red gate must block deploys even when the real deploy is hidden inside a
// shell -c payload or behind env/xargs prefixes, and `vercel alias set` is a
// prod-domain cutover that must be gated like a deploy.

test('red gate blocks sh -c / bash -c / zsh -c wrapped deploys (fix: bypass)', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('sh -c "vercel --prod"').code, 2);
  assert.equal(runGuard('bash -lc "vercel deploy --prod"').code, 2);
  assert.equal(runGuard('zsh -c "vercel --prod"').code, 2);
  // env assignment in front of the wrapper is still peeled
  assert.equal(runGuard('FORCE=1 sh -c "vercel --prod"').code, 2);
});

test('red gate blocks env / xargs / nohup command wrappers (fix: bypass)', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('env vercel --prod').code, 2);
  assert.equal(runGuard('env FORCE=1 vercel deploy --prod').code, 2);
  assert.equal(runGuard('echo --prod | xargs vercel').code, 2);
  assert.equal(runGuard('nohup vercel --prod').code, 2);
});

test('red gate blocks `vercel alias set` prod-domain cutover (fix: bypass)', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  const r = runGuard('vercel alias set dep.vercel.app prod.example.com');
  assert.equal(r.code, 2);
  assert.match(r.stderr, /Gate 2 is "red"/);
});

test('wrapper hardening does not over-block: non-deploy wrapped commands pass', () => {
  writeGate2(SPIKE, { status: 'red', ts: new Date().toISOString() });
  assert.equal(runGuard('sh -c "echo hello world"').code, 0);
  assert.equal(runGuard('env NODE_ENV=production npm run build').code, 0);
  assert.equal(runGuard('bash script.sh').code, 0); // shell without -c
});

test('fresh green gate allows an sh -c wrapped deploy (no over-block)', () => {
  greenGate(SPIKE);
  assert.equal(runGuard('sh -c "vercel --prod"').code, 0);
});
