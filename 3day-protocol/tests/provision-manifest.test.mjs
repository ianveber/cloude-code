// provision-manifest.test.mjs — password handling and the resumable manifest.
//
// The manifest is what makes provisioning survivable. Creating a cloud project
// is the one step that cannot be undone by deleting a file, so a crash between
// "I asked for a project" and "I recorded the project" must be recoverable
// without creating a second one.
//
// Run: node --test ".../3day-protocol/tests/provision-manifest.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  generateDbPassword,
  writeSecretFile,
  readManifest,
  writeManifest,
  recordIntent,
  pendingIntent,
  STEPS,
} from '../lib/cloud/manifest.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-'));

// ── passwords ────────────────────────────────────────────────────────────────

test('generateDbPassword returns 40 URL-safe characters', () => {
  const p = generateDbPassword();
  assert.equal(p.length, 40);
  assert.match(p, /^[A-Za-z0-9]{40}$/, 'alphanumeric only — avoids shell/URL quoting bugs downstream');
});

test('generateDbPassword is not predictable', () => {
  const seen = new Set(Array.from({ length: 200 }, () => generateDbPassword()));
  assert.equal(seen.size, 200, 'no collisions across 200 draws');
});

test('writeSecretFile creates the file mode 600', () => {
  const dir = tmp();
  const f = path.join(dir, 'db-password');
  writeSecretFile(f, 'hunter2');
  assert.equal(fs.readFileSync(f, 'utf8'), 'hunter2');
  assert.equal(fs.statSync(f).mode & 0o777, 0o600, 'must not be group- or world-readable');
});

test('writeSecretFile refuses to silently clobber an existing secret', () => {
  const dir = tmp();
  const f = path.join(dir, 'db-password');
  writeSecretFile(f, 'first');
  assert.throws(() => writeSecretFile(f, 'second'), /exists/i);
  assert.equal(fs.readFileSync(f, 'utf8'), 'first', 'original must survive');
});

// ── manifest ─────────────────────────────────────────────────────────────────

test('a manifest round-trips', () => {
  const dir = tmp();
  writeManifest(dir, { slug: 'demo', supabase: { ref: 'aaaabbbbccccddddeeee' } });
  const m = readManifest(dir);
  assert.equal(m.slug, 'demo');
  assert.equal(m.supabase.ref, 'aaaabbbbccccddddeeee');
  assert.equal(m.schemaVersion, 1);
});

test('readManifest returns null when there is nothing yet', () => {
  assert.equal(readManifest(tmp()), null);
});

test('the manifest file is mode 600 — it names real infrastructure', () => {
  const dir = tmp();
  writeManifest(dir, { slug: 'demo' });
  const f = path.join(dir, '.protocol', 'provision.json');
  assert.equal(fs.statSync(f).mode & 0o777, 0o600);
});

// ── crash recovery ───────────────────────────────────────────────────────────

test('recordIntent persists BEFORE the irreversible call, so a crash is visible', () => {
  const dir = tmp();
  recordIntent(dir, STEPS.CREATE_SUPABASE, { name: 'demo' });
  // Simulate the process dying here — nothing else was written.
  const p = pendingIntent(dir);
  assert.equal(p.step, STEPS.CREATE_SUPABASE);
  assert.equal(p.detail.name, 'demo');
});

test('an intent is cleared once its step completes', () => {
  const dir = tmp();
  recordIntent(dir, STEPS.CREATE_SUPABASE, { name: 'demo' });
  writeManifest(dir, { slug: 'demo', supabase: { ref: 'aaaabbbbccccddddeeee' } }, { clearIntent: true });
  assert.equal(pendingIntent(dir), null, 'a completed step leaves no pending intent');
});

test('pendingIntent is null on a clean directory', () => {
  assert.equal(pendingIntent(tmp()), null);
});

test('a pending CREATE_SUPABASE intent is exactly what resume must reconcile', () => {
  // The dangerous case: we asked Supabase for a project and never learned the
  // ref. Resume must look for it by name rather than blindly creating another.
  const dir = tmp();
  recordIntent(dir, STEPS.CREATE_SUPABASE, { name: 'acme-portal' });
  const p = pendingIntent(dir);
  assert.equal(p.step, STEPS.CREATE_SUPABASE);
  assert.ok(p.detail.name, 'the name is the only handle we have to find it again');
  assert.ok(p.ts, 'intents are timestamped');
});
