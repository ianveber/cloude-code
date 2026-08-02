// engine-fixes.test.mjs — F1, F2, F5.
//
// F1  doctor reported "docker OK" with the daemon dead, because it probed the
//     BINARY (`docker --version`) rather than the ENGINE. SKILL.md claimed it
//     verified the daemon. A green preflight then died hours later at Gate 2.
//
// F2  the secret scan reads every .env* file except .env.example. `provision`
//     writes a real anon key into .env.local, so a correctly-provisioned app
//     failed its own security gate. The right rule is what git would carry: a
//     gitignored file cannot leak through the repo, and an UNignored .env is a
//     genuine finding.
//
// F5  `gate-check 1 --approve "<name>"` accepted arbitrary text, so the design
//     sign-off — one of only two blocking gates — was not a control at all.
//
// Run: node --test ".../3day-protocol/tests/engine-fixes.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { partitionIgnored } from '../lib/git-ignore.mjs';

const PACK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const GC = path.join(PACK, 'bin', 'gate-check');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'enginefix-'));

function run(args, cwd, opts = {}) {
  const r = spawnSync(process.execPath, [GC, ...args], { cwd, encoding: 'utf8', ...opts });
  return { code: r.status, text: (r.stdout || '') + (r.stderr || '') };
}

function project() {
  const dir = tmp();
  run(['init', dir], dir);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 'f@t.local'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'F'], { cwd: dir });
  fs.writeFileSync(path.join(dir, '.gitignore'), '.env.local\n.protocol/\n.claude/\n');
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-qm', 'init'], { cwd: dir });
  return dir;
}

// ── F1: doctor must probe the daemon, not the binary ─────────────────────────

test('F1: the docker check runs `docker info`, never `docker --version`', () => {
  // `docker --version` exits 0 with the daemon completely down — it only
  // proves a binary is on PATH. Only `docker info` talks to the engine.
  //
  // Read the whole check object, not one line: the entry spans several lines,
  // and a line-scoped grep silently stops covering the `args` it exists to pin.
  const src = fs.readFileSync(GC, 'utf8');
  const at = src.indexOf("name: 'docker'");
  assert.ok(at > -1, 'the docker check must still exist');
  const block = src.slice(at, src.indexOf('},', at) + 2);
  assert.doesNotMatch(block, /'--version'/, 'probing the binary proves nothing about the daemon');
  assert.match(block, /'info'/, 'must query the daemon');
});

test('F1: the doctor descriptor no longer advertises the binary probe', () => {
  const src = fs.readFileSync(GC, 'utf8');
  assert.doesNotMatch(src, /verify: 'docker --version/, 'the stale descriptor was a second copy of the lie');
});

// ── F2: the secret scan follows git, not a filename ──────────────────────────
//
// Tested at the unit rather than through `gate-check 2`, which short-circuits
// on the RLS check before the secret scan ever runs — a CLI-level test here
// would assert nothing and quietly pass.

test('F2: a gitignored .env.local is recognised as unable to leak', () => {
  const dir = project();
  const envLocal = path.join(dir, '.env.local');
  fs.writeFileSync(envLocal, 'NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI.aaaa\n');
  const { ignored } = partitionIgnored(dir, [envLocal]);
  assert.ok(ignored.has(envLocal), 'provision writes this file by design; it cannot reach the repo');
});

test('F2: an UNIGNORED .env is NOT excused — the dangerous case stays dangerous', () => {
  // The twin. Without it the "fix" could be "stop scanning .env files", which
  // removes a real protection instead of correcting it.
  const dir = project();
  const envFile = path.join(dir, '.env');
  fs.writeFileSync(envFile, 'SUPABASE_SECRET_KEY=eyJhbGciOiJI.bbbb\n');
  const { ignored } = partitionIgnored(dir, [envFile]);
  assert.ok(!ignored.has(envFile), 'one `git add -A` from a public leak — must still be scanned');
});

test('F2: when git cannot answer, NOTHING is excused', () => {
  // Fails safe. An unavailable tool must never silence a security check —
  // that is how a missing dependency becomes a silent pass.
  const bare = tmp();
  const f = path.join(bare, '.env.local');
  fs.writeFileSync(f, 'x=1\n');
  const { ignored, gitAvailable } = partitionIgnored(bare, [f]);
  assert.equal(gitAvailable, false, 'not a git repo');
  assert.equal(ignored.size, 0, 'no answer means no exemption');
});

// ── F5: the design signature must be a control ───────────────────────────────

test('F5: --approve REFUSES a name that is not in spec.approvers', () => {
  const dir = project();
  const specPath = path.join(dir, '.protocol', 'spec.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  spec.approvers = ['Ian Veber'];
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
  // Pretend a lint report was ingested so we test the NAME check specifically.
  fs.writeFileSync(
    path.join(dir, '.protocol', 'gates', 'gate-1.json'),
    JSON.stringify({ status: 'pending', report: '.protocol/evidence/lint.json' }),
  );

  const r = run(['1', '--approve', 'Definitely Not Ian'], dir);
  assert.notEqual(r.code, 0, 'an unlisted approver must be refused');
  assert.match(r.text, /approver|allowlist|spec\.approvers/i);
});

test('F5: BENIGN TWIN — a listed approver is accepted', () => {
  // Without this, the test above would pass against an --approve that refuses
  // everyone, which would break the gate rather than secure it.
  const dir = project();
  const specPath = path.join(dir, '.protocol', 'spec.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  spec.approvers = ['Ian Veber'];
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
  fs.writeFileSync(
    path.join(dir, '.protocol', 'gates', 'gate-1.json'),
    JSON.stringify({ status: 'pending', report: '.protocol/evidence/lint.json' }),
  );

  const r = run(['1', '--approve', 'Ian Veber'], dir);
  assert.equal(r.code, 0, r.text);
});

test('F5: with NO approvers listed, any name is still accepted (backwards compatible)', () => {
  // Existing specs have no approvers[]. Refusing them would break every run in
  // flight; the allowlist only binds once someone declares one.
  const dir = project();
  fs.writeFileSync(
    path.join(dir, '.protocol', 'gates', 'gate-1.json'),
    JSON.stringify({ status: 'pending', report: '.protocol/evidence/lint.json' }),
  );
  const r = run(['1', '--approve', 'Anybody'], dir);
  assert.equal(r.code, 0, r.text);
});
