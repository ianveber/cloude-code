// gate-freshness.test.mjs — F4: a gate whose freshness cannot be proven
// must not read as green.
//
// The staleness machinery is the only thing stopping a green Gate 2 from
// authorising a deploy of code the security pass never saw. It works by
// recording git HEAD at green and comparing on every read. But the comparison
// is guarded by `gate.head`, and gitHead() returns null outside a git repo — so
// in a run directory with no git, or on a gate written without a head, the
// engine NOTICED the problem ("freshness unproven"), set a detail string, and
// then left the gate green anyway.
//
// That is the dangerous direction: unprovable freshness read as proven
// freshness. These tests pin the opposite.
//
// Run: node --test ".../3day-protocol/tests/gate-freshness.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not URL.pathname — the repo path contains a space, and
// pathname leaves it percent-encoded, so every fixture silently fails to init.
const GC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'gate-check');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'freshness-'));

function run(args, cwd) {
  const res = spawnSync(process.execPath, [GC, ...args], { cwd, encoding: 'utf8' });
  return { code: res.status, text: (res.stdout || '') + (res.stderr || '') };
}

/** A run project with .protocol/ scaffolded. `git` controls whether a repo exists. */
function project({ git = true } = {}) {
  const dir = tmp();
  run(['init', dir], dir);
  if (git) {
    execFileSync('git', ['init', '-q'], { cwd: dir });
    execFileSync('git', ['config', 'user.email', 't@t.test'], { cwd: dir });
    execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
    fs.writeFileSync(path.join(dir, 'README.md'), '# t\n');
    execFileSync('git', ['add', '-A'], { cwd: dir });
    execFileSync('git', ['commit', '-qm', 'init'], { cwd: dir });
  }
  return dir;
}

/** Hand-write a green gate. `head` null means "no head recorded". */
function writeGreenGate(dir, n, head) {
  const gate = { status: 'green', ts: new Date().toISOString(), evidence: ['x'] };
  if (head) gate.head = head;
  fs.writeFileSync(path.join(dir, '.protocol', 'gates', `gate-${n}.json`), JSON.stringify(gate, null, 2));
}

const headOf = (dir) => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();

/** Pull one gate's status out of the `gate-check status` table. */
function gateStatus(text, n) {
  const row = text.split('\n').map((l) => l.trim()).find((l) => new RegExp(`^${n}\\s+[A-Z]`).test(l));
  return row ? row.split(/\s+/)[1] : null;
}

// ── the hole ─────────────────────────────────────────────────────────────────

test('a green gate in a NON-GIT run directory does not read as green', () => {
  // Nothing can prove this gate still matches the code it was granted for.
  // Unprovable freshness must fail closed.
  const dir = project({ git: false });
  writeGreenGate(dir, 2, 'a'.repeat(40));

  const r = run(['status'], dir);
  assert.notEqual(
    gateStatus(r.text, 2),
    'GREEN',
    'a gate whose freshness cannot be checked must not present as green',
  );
});

test('a green gate with NO head recorded does not read as green', () => {
  // A hand-edited gate file is the obvious way to forge one. Without a head
  // there is nothing to compare, so it must not count.
  const dir = project({ git: true });
  writeGreenGate(dir, 2, null);

  const r = run(['status'], dir);
  assert.notEqual(gateStatus(r.text, 2), 'GREEN', 'no head recorded means freshness is unproven');
});

// ── the benign twins: real greens must still work ────────────────────────────

test('BENIGN TWIN: a green gate matching HEAD in a clean repo DOES read as green', () => {
  // Without this, the tests above would pass just as happily against an engine
  // that reports every gate as not-green.
  const dir = project({ git: true });
  writeGreenGate(dir, 2, headOf(dir));

  const r = run(['status'], dir);
  assert.equal(gateStatus(r.text, 2), 'GREEN', 'a properly proven green must still be green');
});

test('BENIGN TWIN: staleness on drift still works and is not masked by the fix', () => {
  const dir = project({ git: true });
  writeGreenGate(dir, 2, headOf(dir));
  fs.writeFileSync(path.join(dir, 'new.txt'), 'drift\n');
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-qm', 'drift'], { cwd: dir });

  const r = run(['status'], dir);
  assert.equal(gateStatus(r.text, 2), 'STALE', 'a moved HEAD is still stale');
});

test('the reason freshness failed is reported, not just the verdict', () => {
  const dir = project({ git: false });
  writeGreenGate(dir, 2, 'a'.repeat(40));
  const r = run(['status'], dir);
  assert.match(r.text, /unproven|git/i, 'the operator must be told why, or the failure is unactionable');
});
