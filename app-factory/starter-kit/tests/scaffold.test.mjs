/**
 * scaffold.mjs — .gitignore merge behaviour.
 *
 * Regression tests for a defect found on the first real app (Soul, 2026-08-03):
 * the scaffolder wrote the template `.gitignore` over the one `gate-check init`
 * had already written, silently dropping `.protocol/`. The next `git add -A`
 * would have committed the build spec, gate results and journal into history —
 * after which every gate write dirties the tree and staleness detection breaks.
 *
 * Nothing tested scaffold.mjs before this file.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { scaffold } from '../generators/scaffold.mjs';

const SPEC = {
  project: 'gitignore-probe',
  slug: 'gitignore-probe',
  name: 'Gitignore Probe',
  description: 'Fixture app for scaffolder tests.',
  i18n: { locale: 'en' },
  protectedRoutes: ['/app'],
  homeRoute: '/app',
  data: {
    tenancy: { model: 'owner', ownerColumn: 'user_id' },
    tables: [{ name: 'thing', columns: [{ name: 'label', type: 'text' }] }],
  },
};

function freshDir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-test-'));
  return d;
}

function rules(body) {
  return body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

test('a fresh dir gets the template .gitignore, including the load-bearing secret rules', () => {
  const dir = freshDir();
  scaffold(SPEC, dir);
  const body = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
  assert.ok(rules(body).includes('.env.local'), '.env.local must be ignored');
  assert.ok(rules(body).includes('node_modules/'), 'node_modules must be ignored');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('an existing .protocol/ rule SURVIVES the scaffold — the actual regression', () => {
  const dir = freshDir();
  // Exactly what `gate-check init` leaves behind before the scaffolder runs.
  fs.writeFileSync(path.join(dir, '.gitignore'), '.protocol/\n');

  scaffold(SPEC, dir);

  const r = rules(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8'));
  assert.ok(r.includes('.protocol/'), 'protocol state must stay ignored');
  // The positive twin: proving .protocol/ survived means nothing unless the
  // template's own rules also arrived. Adding .gitignore to SEED would pass the
  // assertion above and fail this one — leaving .env.local trackable.
  assert.ok(r.includes('.env.local'), 'template rules must still be applied');
  assert.ok(r.includes('node_modules/'), 'template rules must still be applied');

  fs.rmSync(dir, { recursive: true, force: true });
});

test('scaffolding twice does not duplicate rules', () => {
  const dir = freshDir();
  fs.writeFileSync(path.join(dir, '.gitignore'), '.protocol/\n');

  scaffold(SPEC, dir);
  const once = rules(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8'));
  scaffold(SPEC, dir);
  const twice = rules(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8'));

  assert.deepEqual(twice, once, 're-scaffolding must be idempotent');
  assert.equal(
    twice.filter((l) => l === '.env.local').length,
    1,
    'a rule present in both files must appear exactly once',
  );

  fs.rmSync(dir, { recursive: true, force: true });
});

test('a hand-added app rule is preserved across a re-scaffold', () => {
  const dir = freshDir();
  fs.writeFileSync(path.join(dir, '.gitignore'), '.protocol/\ncoverage/\n');

  scaffold(SPEC, dir);

  const r = rules(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8'));
  assert.ok(r.includes('coverage/'), 'hand-added rules must not be discarded');
  assert.ok(r.includes('.env.local'), 'template rules must still be applied');

  fs.rmSync(dir, { recursive: true, force: true });
});
