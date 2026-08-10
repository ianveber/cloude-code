// gate2-rls-integrity.test.mjs — F3: Gate 2's RLS verdict must not be forgeable
// by the thing it is judging.
//
// Gate 2 decides whether an app is safe to deploy. The app is written by an
// agent. So the one thing Gate 2 must never do is derive its verdict from
// something the app controls:
//
//   - it must not EXECUTE a script from the app directory (that is the app
//     supplying the runner)
//   - it must not read its pass/fail from app-authored stdout (that is the app
//     supplying the verdict)
//   - it must count the evidence ITSELF, from the filesystem
//   - a suite that proves nothing must be RED, never a silent pass
//
// The app supplies test CASES — data. The pack supplies the runner and the
// arithmetic — code.
//
// Run: node --test ".../3day-protocol/tests/gate2-rls-integrity.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { analyseRlsSuite } from '../lib/rls-integrity.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'rlsint-'));

/** Build a run project with a schema and a set of case files. */
function project({ tables = ['note'], cases = null, extraFiles = {} } = {}) {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'supabase', 'tests', 'cases'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'supabase', 'schema.sql'),
    tables
      .map((t) => `create table if not exists public.${t} (\n  id uuid primary key\n);\nalter table public.${t} enable row level security;\n`)
      .join('\n'),
  );
  const files =
    cases ??
    tables.flatMap((t) => [
      [`${t}-01-${t}-owner-can-read.sql`, `-- positive\n`],
      [`${t}-02-${t}-anon-denied.sql`, `-- denial\n`],
    ]);
  for (const [name, body] of files) {
    fs.writeFileSync(path.join(dir, 'supabase', 'tests', 'cases', name), body);
  }
  for (const [rel, body] of Object.entries(extraFiles)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  return dir;
}

// ── the suite must prove something ───────────────────────────────────────────

test('an EMPTY cases directory is red — a suite that proves nothing is not a pass', () => {
  const dir = project({ cases: [] });
  const r = analyseRlsSuite(dir);
  assert.equal(r.ok, false);
  assert.match(r.findings.join(' '), /no RLS cases|proves nothing/i);
});

test('a missing cases directory is red, not skipped', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'supabase'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'supabase', 'schema.sql'), 'create table public.note (id uuid);\n');
  const r = analyseRlsSuite(dir);
  assert.equal(r.ok, false, 'absence of tests is never a pass');
});

// ── coverage is computed by the pack, from the app's own schema ──────────────

test('a table with NO denial case is red, even when other tables are covered', () => {
  // The table nobody wrote a test for is exactly the one that ships open.
  const dir = project({
    tables: ['note', 'secret'],
    cases: [
      ['note-01-note-owner-can-read.sql', ''],
      ['note-02-note-anon-denied.sql', ''],
      ['secret-01-secret-owner-can-read.sql', ''], // positive only — no denial
    ],
  });
  const r = analyseRlsSuite(dir);
  assert.equal(r.ok, false);
  assert.match(r.findings.join(' '), /secret/, 'the uncovered table must be named');
});

test('a denial case with NO positive twin is red', () => {
  // Pure denials score full marks against a policy that denies everyone.
  const dir = project({
    tables: ['note'],
    cases: [['note-02-note-anon-denied.sql', '']],
  });
  const r = analyseRlsSuite(dir);
  assert.equal(r.ok, false);
  assert.match(r.findings.join(' '), /twin|positive/i);
});

test('BENIGN TWIN: a complete suite passes analysis', () => {
  // Without this, every test above would pass against an analyser that always
  // returns false.
  const dir = project({ tables: ['note', 'task'] });
  const r = analyseRlsSuite(dir);
  assert.equal(r.ok, true, r.findings.join(' '));
  assert.equal(r.tables.length, 2);
  assert.equal(r.caseCount, 4);
});

// ── the app must not be able to supply the runner or the verdict ────────────

test('a run.sh in the app directory is NEVER executed', () => {
  // The forgeable design: gate-check runs the app's own script and believes
  // its stdout. A script that prints success and exits 0 would be the whole
  // security verdict, written by the thing being judged.
  const dir = project({
    extraFiles: {
      'supabase/tests/run.sh': '#!/bin/sh\necho "All tests successful."\nexit 0\n',
    },
  });
  const r = analyseRlsSuite(dir);
  assert.ok(!r.executed?.includes('run.sh'), 'the app-supplied runner must never be executed');
  // And its presence must not influence the verdict either way.
  assert.equal(r.ok, true, 'a stray run.sh neither helps nor hurts — it is simply ignored');
});

test('case COUNT comes from the filesystem, not from any app-authored output', () => {
  // A case file that claims a hundred passes in a comment still counts as one.
  const dir = project({
    tables: ['note'],
    cases: [
      ['note-01-note-owner-can-read.sql', '-- ok 1..100\n# tests 100\n# pass 100\n'],
      ['note-02-note-anon-denied.sql', ''],
    ],
  });
  const r = analyseRlsSuite(dir);
  assert.equal(r.caseCount, 2, 'counted by file, not by anything the file says about itself');
});

test('tables are read from the app schema, so a table cannot hide from coverage', () => {
  const dir = project({
    tables: ['note', 'hidden'],
    cases: [
      ['note-01-note-owner-can-read.sql', ''],
      ['note-02-note-anon-denied.sql', ''],
      ['hidden-01-hidden-owner-can-read.sql', ''],
      ['hidden-02-hidden-anon-denied.sql', ''],
    ],
  });
  const r = analyseRlsSuite(dir);
  assert.deepEqual(r.tables.sort(), ['hidden', 'note']);
  assert.equal(r.ok, true);
});

test('a table declared in the schema but RLS-disabled is reported', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'supabase', 'tests', 'cases'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'supabase', 'schema.sql'),
    'create table public.note (id uuid);\n', // no `enable row level security`
  );
  fs.writeFileSync(path.join(dir, 'supabase', 'tests', 'cases', 'note-01-note-owner-can-read.sql'), '');
  fs.writeFileSync(path.join(dir, 'supabase', 'tests', 'cases', 'note-02-note-anon-denied.sql'), '');
  const r = analyseRlsSuite(dir);
  assert.equal(r.ok, false);
  assert.match(r.findings.join(' '), /row level security|RLS/i);
});

// ── end to end through gate-check itself ─────────────────────────────────────

import { spawnSync } from 'node:child_process';
const PACK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('THE FORGERY: a fake run.sh claiming success cannot green Gate 2', () => {
  // This is the attack the design exists to stop. Under the rejected design,
  // gate-check would have executed this script and believed its stdout.
  const dir = project({
    extraFiles: {
      'supabase/tests/run.sh':
        '#!/bin/sh\necho "TAP version 13"\necho "1..99"\necho "ok 1 - everything is fine"\necho "# tests 99"\necho "# pass 99"\nexit 0\n',
    },
  });
  const r = spawnSync(process.execPath, [path.join(PACK, 'bin', 'rls-run'), dir], { encoding: 'utf8' });
  const report = JSON.parse(r.stdout);

  assert.equal(report.ok, false, 'a forged runner must not produce a pass');
  assert.notEqual(report.total, 99, 'the forged count must never be adopted');
  assert.match(
    report.findings.join(' '),
    /no provisioned project|unrun/i,
    'it fails because nothing was actually run — not because the script said so',
  );
});

test('cases present but never executed is RED, not a pass', () => {
  // An unrun suite proves nothing. Reporting it green is precisely the
  // false-success failure mode this gate exists to prevent.
  const dir = project();
  const r = spawnSync(process.execPath, [path.join(PACK, 'bin', 'rls-run'), dir], { encoding: 'utf8' });
  const report = JSON.parse(r.stdout);
  assert.equal(report.ok, false);
  assert.equal(r.status, 1, 'non-zero exit so a caller cannot miss it');
});

test('an incomplete suite fails at ANALYSIS, before anything is executed', () => {
  // Coverage is judged by the pack from the app's schema, so a missing denial
  // case is caught without needing a database at all.
  const dir = project({
    tables: ['note', 'secret'],
    cases: [
      ['note-01-note-owner-can-read.sql', ''],
      ['note-02-note-anon-denied.sql', ''],
    ],
  });
  const r = spawnSync(process.execPath, [path.join(PACK, 'bin', 'rls-run'), dir], { encoding: 'utf8' });
  const report = JSON.parse(r.stdout);
  assert.equal(report.ok, false);
  assert.equal(report.stage, 'analysis', 'caught before execution');
  assert.match(report.findings.join(' '), /secret/);
});
