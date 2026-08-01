// generators.test.mjs — spec → schema.sql + adversarial RLS suite.
//
// The generators are the intellectual core of the kit: they are what makes it a
// factory rather than a folder you copy. Their output is a security boundary,
// so the tests below care much more about what CANNOT be generated than about
// what can.
//
// Run: node --test ".../app-factory/starter-kit/tests/generators.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { generateSchema, normaliseSpec } from '../generators/schema.mjs';
import { generateRlsTests, USERS } from '../generators/rlstests.mjs';

const ownerSpec = () => ({
  data: {
    tenancy: { model: 'owner', ownerColumn: 'user_id' },
    tables: [{ name: 'note', columns: [{ name: 'body', type: 'text', notNull: true }] }],
  },
});

const tenantSpec = () => ({
  data: {
    tenancy: { model: 'tenant', tenantTable: 'org', tenantFk: 'org_id' },
    tables: [{ name: 'document', columns: [{ name: 'title', type: 'text', notNull: true }] }],
  },
});

// ── RLS is never optional ────────────────────────────────────────────────────

test('every table gets RLS enabled — there is no way to opt out from the spec', () => {
  const sql = generateSchema({
    data: {
      tenancy: { model: 'owner' },
      tables: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
    },
  });
  for (const t of ['a', 'b', 'c']) {
    assert.match(sql, new RegExp(`alter table public\\.${t} enable row level security`), `${t} must have RLS on`);
  }
});

test('FORCE row level security is never emitted', () => {
  // FORCE + a SECURITY DEFINER helper produces "infinite recursion detected in
  // policy for relation" — hit on Heva, must not come back.
  const sql = generateSchema(tenantSpec());
  assert.doesNotMatch(sql, /force row level security/i);
});

test('the membership helper lives in the private schema, not public', () => {
  // A function in public is reachable as /rest/v1/rpc/<name>, and Postgres
  // grants EXECUTE to PUBLIC by default — that combination once made a
  // membership check probeable by anon.
  const sql = generateSchema(tenantSpec());
  assert.match(sql, /create schema if not exists private/);
  assert.match(sql, /create or replace function private\.is_member/);
  assert.match(sql, /revoke all on function private\.is_member\(uuid\) from public/);
  assert.doesNotMatch(sql, /create or replace function public\.is_member/);
});

test('a policy never sub-queries its own table', () => {
  const sql = generateSchema(tenantSpec());
  const policy = sql.slice(sql.indexOf('create policy "document_select"'));
  assert.doesNotMatch(policy.split(';')[0], /from public\.document/);
});

test('write policies are split per operation rather than FOR ALL', () => {
  // A single "for all" policy is also evaluated on every read (Supabase linter
  // 0006) and costs on scans.
  const sql = generateSchema(ownerSpec());
  // Look at policy statements only — the phrase appears in a comment that
  // explains why we avoid it, and matching that would be a false failure.
  const statements = sql
    .split('\n')
    .filter((l) => !l.trim().startsWith('--'))
    .join('\n');
  assert.doesNotMatch(statements, /create policy[^;]*\bfor all\b/i);
  for (const op of ['select', 'insert', 'update', 'delete']) {
    assert.match(sql, new RegExp(`create policy "note_${op}"`));
  }
});

// ── input validation ─────────────────────────────────────────────────────────

test('identifiers are validated — no SQL injection through a table name', () => {
  for (const bad of ['drop table users; --', 'Note', '1note', 'note-x', '']) {
    assert.throws(
      () => generateSchema({ data: { tenancy: { model: 'owner' }, tables: [{ name: bad }] } }),
      /invalid table name/,
      `${JSON.stringify(bad)} must be refused`,
    );
  }
});

test('duplicate table names are refused', () => {
  assert.throws(
    () => generateSchema({ data: { tenancy: { model: 'owner' }, tables: [{ name: 'a' }, { name: 'a' }] } }),
    /duplicate table names/,
  );
});

test('an unknown tenancy model is refused rather than defaulted', () => {
  assert.throws(
    () => normaliseSpec({ data: { tenancy: { model: 'everyone' }, tables: [{ name: 'a' }] } }),
    /unknown tenancy model/,
  );
});

test('tenant model demands its tenantTable and tenantFk', () => {
  assert.throws(
    () => normaliseSpec({ data: { tenancy: { model: 'tenant' }, tables: [{ name: 'a' }] } }),
    /requires data\.tenancy\.tenantTable/,
  );
});

test('a spec with no tables is refused', () => {
  assert.throws(() => generateSchema({ data: { tables: [] } }), /at least one table/);
});

// ── the adversarial suite ────────────────────────────────────────────────────

test('EVERY table gets an anonymous-denial case, mentioned in the spec or not', () => {
  const { files } = generateRlsTests({
    data: { tenancy: { model: 'owner' }, tables: [{ name: 'a' }, { name: 'b' }] },
  });
  assert.ok(files['cases/a-02-a-anon-denied.sql'], 'table a needs an anon denial');
  assert.ok(files['cases/b-02-b-anon-denied.sql'], 'table b needs an anon denial');
});

test('every denial case ships with a positive twin', () => {
  // Without the twin, a policy that denies EVERYONE scores full marks.
  const { counts } = generateRlsTests(ownerSpec());
  assert.ok(counts.positives >= 1, 'must emit at least one positive per table');
  assert.ok(counts.negatives >= counts.tables, 'at least one denial per table');
});

test('the positive twin explains WHY it exists when it fails', () => {
  const { files } = generateRlsTests(ownerSpec());
  const twin = files['cases/note-01-note-owner-can-read.sql'];
  assert.match(twin, /denial test above is therefore meaningless/i);
});

test('cross-user denial is generated for owner and tenant models', () => {
  for (const spec of [ownerSpec(), tenantSpec()]) {
    const { files } = generateRlsTests(spec);
    const names = Object.keys(files).join(' ');
    assert.match(names, /cross-user-denied/, 'the leak between two real accounts is the bug that matters');
    assert.match(names, /cross-user-write-denied/);
  }
});

test('the shared model gets no cross-user test, because there is no boundary to prove', () => {
  const { files } = generateRlsTests({
    data: { tenancy: { model: 'shared' }, tables: [{ name: 'post' }] },
  });
  const names = Object.keys(files).join(' ');
  assert.doesNotMatch(names, /cross-user/);
  assert.match(names, /anon-denied/, 'anonymous denial still applies');
});

test('tests set identity exactly the way Supabase resolves auth.uid()', () => {
  // This is what lets the same SQL run against a real project with no Docker
  // and no hand-written stub of the auth schema.
  const { files } = generateRlsTests(ownerSpec());
  const anyCase = files['cases/note-02-note-anon-denied.sql'];
  assert.match(anyCase, /set local role anon/);
  assert.match(files['cases/note-01-note-owner-can-read.sql'], /set local request\.jwt\.claims/);
  assert.match(files['cases/note-01-note-owner-can-read.sql'], new RegExp(USERS.alice));
});

test('fixtures insert two distinct users so cross-user tests are possible', () => {
  const { files } = generateRlsTests(ownerSpec());
  assert.match(files['fixtures.sql'], new RegExp(USERS.alice));
  assert.match(files['fixtures.sql'], new RegExp(USERS.bob));
});

test('a suite with zero denials is refused', () => {
  assert.throws(
    () => generateRlsTests({ data: { tenancy: { model: 'owner' }, tables: [] } }),
    /at least one table/,
  );
});
