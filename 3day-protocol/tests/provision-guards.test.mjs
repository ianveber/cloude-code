// provision-guards.test.mjs — adversarial suite for lib/cloud/guards.mjs.
//
// These guards are the only thing standing between an autonomous build agent
// and Ian's LIVE databases. The AIS client portal, the Heva family portal and
// ATHLOS all share one Supabase org with anything the factory creates, so a
// destructive verb reaching the wrong ref is a real-world outage.
//
// Every test here is an ATTACK. A test that only proves the happy path is
// worthless; each denial test has a benign twin proving the denial came from
// the guard and not from a broken code path.
//
// Run: node --test "/Users/ianveber/Desktop/Cloude CODE/3day-protocol/tests/provision-guards.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  DENY_REFS,
  GuardViolation,
  assertOwned,
  assertSafeRunDir,
  recordOwned,
  isOwned,
} from '../lib/cloud/guards.mjs';

// A ref the factory legitimately created, used as the benign twin throughout.
const OURS = 'aaaabbbbccccddddeeee';

function tmpRegistry() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'guards-'));
  return path.join(dir, 'owned.jsonl');
}

// ── DENY_REFS is the hard floor ──────────────────────────────────────────────

test('DENY_REFS contains every known live project', () => {
  // Sourced from reference_supabase_account_map + verified via the Management
  // API on 2026-08-01. If a new live project is created, it belongs here.
  assert.ok(DENY_REFS.has('myqcdljzseefrlicwnbm'), 'AIS client portal must be denied');
  assert.ok(DENY_REFS.has('cdmllcscbfrmkvhzidam'), 'heva-portal must be denied');
  assert.ok(DENY_REFS.has('fuhmndzrjzwhfbcmfaii'), 'ATHLOS must be denied');
});

test('assertOwned refuses every denied ref', () => {
  const reg = tmpRegistry();
  for (const ref of DENY_REFS) {
    assert.throws(
      () => assertOwned(ref, { registry: reg }),
      (e) => e instanceof GuardViolation && /protected|denied/i.test(e.message),
      `${ref} must be refused`,
    );
  }
});

test('a FORGED registry entry cannot unlock a denied ref', () => {
  // The attack: an agent (or a corrupted manifest) writes a denied ref into the
  // ownership registry to make it look factory-created. DENY_REFS must win.
  const reg = tmpRegistry();
  fs.writeFileSync(reg, JSON.stringify({ ref: 'myqcdljzseefrlicwnbm', createdBy: 'provision' }) + '\n');

  assert.ok(isOwned('myqcdljzseefrlicwnbm', { registry: reg }), 'precondition: forged row IS in the registry');
  assert.throws(
    () => assertOwned('myqcdljzseefrlicwnbm', { registry: reg }),
    (e) => e instanceof GuardViolation,
    'DENY_REFS must override registry ownership',
  );
});

// ── ownership must be positively proven, not assumed ─────────────────────────

test('assertOwned refuses a ref that is simply unknown', () => {
  // Not denied, but never created by us either. Absence of evidence is a refusal.
  const reg = tmpRegistry();
  assert.throws(
    () => assertOwned('zzzzyyyyxxxxwwwwvvvv', { registry: reg }),
    (e) => e instanceof GuardViolation && /not created by the factory|unknown/i.test(e.message),
  );
});

test('BENIGN TWIN: assertOwned allows a ref the factory recorded', () => {
  // Proves the refusals above come from the guard logic, not from assertOwned
  // being broken and throwing on everything.
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });
  assert.doesNotThrow(() => assertOwned(OURS, { registry: reg }));
});

test('assertOwned refuses a malformed ref before any lookup', () => {
  const reg = tmpRegistry();
  for (const bad of ['', '   ', 'short', '../../etc/passwd', 'has space', null, undefined]) {
    assert.throws(() => assertOwned(bad, { registry: reg }), GuardViolation, `${JSON.stringify(bad)} must be refused`);
  }
});

test('a corrupt registry line does not crash and does not grant ownership', () => {
  const reg = tmpRegistry();
  fs.writeFileSync(reg, 'not json at all\n' + JSON.stringify({ ref: OURS }) + '\n');
  assert.doesNotThrow(() => assertOwned(OURS, { registry: reg }), 'valid line after a corrupt one still counts');
  assert.throws(() => assertOwned('zzzzyyyyxxxxwwwwvvvv', { registry: reg }), GuardViolation);
});

test('a missing registry denies everything rather than defaulting open', () => {
  const missing = path.join(os.tmpdir(), 'definitely-does-not-exist-' + Date.now(), 'owned.jsonl');
  assert.throws(() => assertOwned(OURS, { registry: missing }), GuardViolation);
});

test('recordOwned is idempotent and never duplicates a ref', () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });
  recordOwned(OURS, { registry: reg, project: 'demo' });
  const rows = fs.readFileSync(reg, 'utf8').trim().split('\n').filter(Boolean);
  assert.equal(rows.length, 1);
});

test('recordOwned REFUSES to record a denied ref', () => {
  // Closes the obvious bypass: record it first, then it is "owned".
  const reg = tmpRegistry();
  assert.throws(() => recordOwned('myqcdljzseefrlicwnbm', { registry: reg, project: 'x' }), GuardViolation);
  assert.equal(fs.existsSync(reg), false, 'nothing may be written on a refused record');
});

// ── run directories must never be on iCloud ──────────────────────────────────

test('assertSafeRunDir refuses iCloud-synced paths', () => {
  const home = os.homedir();
  for (const bad of [
    path.join(home, 'Desktop', 'Cloude CODE', 'x'),
    path.join(home, 'Documents', 'thing'),
    path.join(home, 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'y'),
  ]) {
    assert.throws(
      () => assertSafeRunDir(bad),
      (e) => e instanceof GuardViolation && /iCloud/i.test(e.message),
      `${bad} must be refused`,
    );
  }
});

test('BENIGN TWIN: assertSafeRunDir allows ~/builds', () => {
  assert.doesNotThrow(() => assertSafeRunDir(path.join(os.homedir(), 'builds', 'demo')));
});

test('GuardViolation carries exit code 2', () => {
  const e = new GuardViolation('nope');
  assert.equal(e.exitCode, 2);
  assert.equal(e.name, 'GuardViolation');
});
