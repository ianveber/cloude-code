// provision-supabase.test.mjs — the Supabase Management API client.
//
// Fully OFFLINE: every test injects a fake fetch. No test here may touch the
// network, because the real org contains live client databases.
//
// The central property under test: guards run INSIDE the client, BEFORE any
// request is issued. It is not enough that a refused call fails — it must
// never reach the wire at all. Every denial test therefore asserts the call
// count is zero.
//
// Run: node --test ".../3day-protocol/tests/provision-supabase.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { createClient } from '../lib/cloud/supabase-api.mjs';
import { GuardViolation, recordOwned } from '../lib/cloud/guards.mjs';

const OURS = 'aaaabbbbccccddddeeee';
const DENIED = 'myqcdljzseefrlicwnbm'; // the live AIS client portal
const UNKNOWN = 'zzzzyyyyxxxxwwwwvvvv';

function tmpRegistry() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sbapi-'));
  return path.join(dir, 'owned.jsonl');
}

/** A fetch stub that records every call and replies with `reply`. */
function spyFetch(reply = { status: 200, body: {} }) {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || 'GET', body: init.body });
    return {
      ok: reply.status >= 200 && reply.status < 300,
      status: reply.status,
      text: async () => JSON.stringify(reply.body),
      json: async () => reply.body,
    };
  };
  fn.calls = calls;
  return fn;
}

function client(fetchImpl, registry, extra = {}) {
  return createClient({ token: 'sbp_test', fetchImpl, registry, ...extra });
}

// ── guards fire before the wire ──────────────────────────────────────────────

test('runSql on a DENIED ref throws and issues NO request', async () => {
  const f = spyFetch();
  const c = client(f, tmpRegistry());
  await assert.rejects(() => c.runSql(DENIED, 'select 1'), GuardViolation);
  assert.equal(f.calls.length, 0, 'a denied ref must never reach the network');
});

test('runSql on an UNKNOWN ref throws and issues NO request', async () => {
  const f = spyFetch();
  const c = client(f, tmpRegistry());
  await assert.rejects(() => c.runSql(UNKNOWN, 'select 1'), GuardViolation);
  assert.equal(f.calls.length, 0);
});

test('setAuthConfig on a DENIED ref throws and issues NO request', async () => {
  const f = spyFetch();
  const c = client(f, tmpRegistry());
  await assert.rejects(() => c.setAuthConfig(DENIED, { disable_signup: true }), GuardViolation);
  assert.equal(f.calls.length, 0);
});

test('getApiKeys on a DENIED ref throws and issues NO request', async () => {
  const f = spyFetch();
  const c = client(f, tmpRegistry());
  await assert.rejects(() => c.getApiKeys(DENIED), GuardViolation);
  assert.equal(f.calls.length, 0);
});

test('BENIGN TWIN: runSql on an owned ref does reach the wire', async () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });
  const f = spyFetch({ status: 200, body: [{ ok: 1 }] });
  const c = client(f, reg);

  await c.runSql(OURS, 'select 1');
  assert.equal(f.calls.length, 1);
  assert.match(f.calls[0].url, new RegExp(`/v1/projects/${OURS}/database/query$`));
  assert.equal(f.calls[0].method, 'POST');
  assert.equal(JSON.parse(f.calls[0].body).query, 'select 1');
});

// ── listProjects is read-only and must NOT require ownership ─────────────────

test('listProjects works without any ownership record', async () => {
  const f = spyFetch({ status: 200, body: [{ ref: DENIED, name: 'live thing' }] });
  const c = client(f, tmpRegistry());
  const out = await c.listProjects();
  assert.equal(out.length, 1);
  assert.equal(f.calls[0].method, 'GET');
});

// ── createProject ────────────────────────────────────────────────────────────

test('createProject records ownership so later verbs are permitted', async () => {
  const reg = tmpRegistry();
  const f = spyFetch({ status: 201, body: { id: OURS, ref: OURS, name: 'demo' } });
  const c = client(f, reg);

  const p = await c.createProject({ name: 'demo', orgSlug: 'org', dbPass: 'x'.repeat(40) });
  assert.equal(p.ref, OURS);
  // The whole point: the ref is now usable.
  const f2 = spyFetch({ status: 200, body: [] });
  await client(f2, reg).runSql(OURS, 'select 1');
  assert.equal(f2.calls.length, 1);
});

test('createProject defaults to eu-central-1', async () => {
  const f = spyFetch({ status: 201, body: { ref: OURS } });
  await client(f, tmpRegistry()).createProject({ name: 'demo', orgSlug: 'org', dbPass: 'x'.repeat(40) });
  assert.equal(JSON.parse(f.calls[0].body).region, 'eu-central-1');
});

test('createProject REFUSES a non-EU region unless explicitly acknowledged', async () => {
  const f = spyFetch({ status: 201, body: { ref: OURS } });
  const c = client(f, tmpRegistry());
  await assert.rejects(
    () => c.createProject({ name: 'demo', orgSlug: 'org', dbPass: 'x'.repeat(40), region: 'us-east-1' }),
    (e) => e instanceof GuardViolation && /EU|GDPR/i.test(e.message),
  );
  assert.equal(f.calls.length, 0, 'refused before the wire');
});

test('createProject allows a non-EU region when acknowledged', async () => {
  const f = spyFetch({ status: 201, body: { ref: OURS } });
  await client(f, tmpRegistry()).createProject({
    name: 'demo', orgSlug: 'org', dbPass: 'x'.repeat(40),
    region: 'us-east-1', acknowledgeNonEU: true,
  });
  assert.equal(JSON.parse(f.calls[0].body).region, 'us-east-1');
});

test('createProject refuses a weak database password', async () => {
  const f = spyFetch({ status: 201, body: { ref: OURS } });
  const c = client(f, tmpRegistry());
  await assert.rejects(
    () => c.createProject({ name: 'demo', orgSlug: 'org', dbPass: 'short' }),
    (e) => e instanceof GuardViolation && /password/i.test(e.message),
  );
  assert.equal(f.calls.length, 0);
});

// ── setAuthConfig must verify, not assume ────────────────────────────────────

test('setAuthConfig PATCHes then READS BACK and asserts the value stuck', async () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });

  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || 'GET' });
    // PATCH replies first, then the read-back GET reports the new value.
    return {
      ok: true, status: 200,
      json: async () => ({ disable_signup: true }),
      text: async () => JSON.stringify({ disable_signup: true }),
    };
  };
  await client(fetchImpl, reg).setAuthConfig(OURS, { disable_signup: true });

  assert.equal(calls.length, 2, 'must PATCH and then GET back');
  assert.equal(calls[0].method, 'PATCH');
  assert.equal(calls[1].method, 'GET');
});

test('setAuthConfig THROWS when the read-back disagrees', async () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });

  const fetchImpl = async (url, init = {}) => ({
    ok: true, status: 200,
    // Server silently ignored the patch — signup is still open.
    json: async () => ({ disable_signup: false }),
    text: async () => JSON.stringify({ disable_signup: false }),
  });
  await assert.rejects(
    () => client(fetchImpl, reg).setAuthConfig(OURS, { disable_signup: true }),
    /did not take effect|read-back/i,
  );
});

// ── errors ───────────────────────────────────────────────────────────────────

test('an API error surfaces status and body rather than being swallowed', async () => {
  const f = spyFetch({ status: 403, body: { message: 'nope' } });
  await assert.rejects(() => client(f, tmpRegistry()).listProjects(), /403/);
});

test('the client refuses to construct without a token', () => {
  assert.throws(() => createClient({ token: '', fetchImpl: spyFetch() }), /token/i);
});

// ── waitUntilHealthy — the bug the first live run found ──────────────────────

test('waitUntilHealthy polls until ACTIVE_HEALTHY', async () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });
  const statuses = ['COMING_UP', 'COMING_UP', 'ACTIVE_HEALTHY'];
  let i = 0;
  const fetchImpl = async () => ({
    ok: true, status: 200,
    json: async () => ({ ref: OURS, status: statuses[i++] }),
    text: async () => '',
  });
  const c = client(fetchImpl, reg);
  const p = await c.waitUntilHealthy(OURS, { sleep: async () => {}, intervalMs: 0 });
  assert.equal(p.status, 'ACTIVE_HEALTHY');
  assert.equal(i, 3, 'polled until healthy');
});

test('waitUntilHealthy fails fast on a terminal status instead of burning the timeout', async () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });
  const fetchImpl = async () => ({
    ok: true, status: 200,
    json: async () => ({ ref: OURS, status: 'INACTIVE' }),
    text: async () => '',
  });
  await assert.rejects(
    () => client(fetchImpl, reg).waitUntilHealthy(OURS, { sleep: async () => {} }),
    /terminal status INACTIVE/,
  );
});

test('waitUntilHealthy on a DENIED ref throws before polling', async () => {
  const f = spyFetch();
  await assert.rejects(() => client(f, tmpRegistry()).waitUntilHealthy(DENIED), GuardViolation);
  assert.equal(f.calls.length, 0);
});

test('deleteProject on a DENIED ref throws and issues NO request', async () => {
  const f = spyFetch();
  await assert.rejects(() => client(f, tmpRegistry()).deleteProject(DENIED), GuardViolation);
  assert.equal(f.calls.length, 0, 'the live client portal must be undeletable by this tool');
});

test('deleteProject on an UNKNOWN ref throws and issues NO request', async () => {
  const f = spyFetch();
  await assert.rejects(() => client(f, tmpRegistry()).deleteProject(UNKNOWN), GuardViolation);
  assert.equal(f.calls.length, 0);
});

test('BENIGN TWIN: deleteProject on an owned ref issues DELETE', async () => {
  const reg = tmpRegistry();
  recordOwned(OURS, { registry: reg, project: 'demo' });
  const f = spyFetch({ status: 200, body: {} });
  await client(f, reg).deleteProject(OURS);
  assert.equal(f.calls[0].method, 'DELETE');
});
