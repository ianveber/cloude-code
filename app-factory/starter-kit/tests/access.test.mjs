// access.test.mjs — the auth boundary, tested exhaustively without a browser.
//
// decide() is pure, so every case the middleware can face is reachable here.
// The cases that matter most are the ones where a wrong answer is INVISIBLE:
// an app that serves protected pages because its env vars are missing looks
// perfectly healthy until someone notices the data is public.
//
// Run: node --test ".../app-factory/starter-kit/tests/access.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { decide } from '../tracks/app/src/lib/access.ts';

const base = {
  hasEnv: true,
  protectedPrefixes: ['/app', '/api/notes'],
  authRoutes: ['/login', '/reset-password'],
  homeRoute: '/app',
};

const at = (over) => decide({ ...base, ...over });

// ── env-unset must fail CLOSED ───────────────────────────────────────────────

test('env unset + protected path → 503, NOT allow', () => {
  // The failure this exists to prevent: a missing env var in production
  // silently serving every protected page to the open internet.
  const r = at({ path: '/app/dashboard', hasUser: false, hasEnv: false });
  assert.equal(r.action, 'gate503');
});

test('env unset + protected path + a "user" → still 503', () => {
  // With no Supabase there is no way to have authenticated anyone, so a
  // truthy hasUser here is a bug upstream. Trusting it would be worse.
  const r = at({ path: '/app/dashboard', hasUser: true, hasEnv: false });
  assert.equal(r.action, 'gate503');
});

test('env unset + PUBLIC path → allow (the marketing page still works)', () => {
  const r = at({ path: '/', hasUser: false, hasEnv: false });
  assert.equal(r.action, 'allow');
});

// ── signed out ───────────────────────────────────────────────────────────────

test('signed out + protected page → redirect to login carrying the destination', () => {
  const r = at({ path: '/app/dashboard', hasUser: false });
  assert.equal(r.action, 'redirect');
  assert.equal(r.to, '/login?next=%2Fapp%2Fdashboard');
});

test('signed out + protected API → 401 JSON, never a redirect', () => {
  // Redirecting a fetch() to an HTML login page surfaces as a JSON parse error
  // at the call site, which sends people debugging entirely the wrong thing.
  const r = at({ path: '/api/notes', hasUser: false });
  assert.equal(r.action, 'json401');
});

test('signed out + public page → allow', () => {
  assert.equal(at({ path: '/', hasUser: false }).action, 'allow');
  assert.equal(at({ path: '/pricing', hasUser: false }).action, 'allow');
});

test('signed out + login page → allow (or nobody could ever sign in)', () => {
  assert.equal(at({ path: '/login', hasUser: false }).action, 'allow');
});

// ── signed in ────────────────────────────────────────────────────────────────

test('signed in + protected page → allow', () => {
  assert.equal(at({ path: '/app/dashboard', hasUser: true }).action, 'allow');
});

test('signed in + login page → redirect home, not a form they cannot use', () => {
  const r = at({ path: '/login', hasUser: true });
  assert.equal(r.action, 'redirect');
  assert.equal(r.to, '/app');
});

// ── prefix matching must not be sloppy in either direction ───────────────────

test('a prefix matches the bare path and its children', () => {
  assert.equal(at({ path: '/app', hasUser: false }).action, 'redirect');
  assert.equal(at({ path: '/app/deep/nested', hasUser: false }).action, 'redirect');
});

test('a prefix does NOT match a path that merely starts with the same letters', () => {
  // /application must not be protected by a rule about /app — that would lock
  // people out of a public page for no stated reason.
  assert.equal(at({ path: '/application', hasUser: false }).action, 'allow');
  assert.equal(at({ path: '/appointments', hasUser: false }).action, 'allow');
});

test('the API rule does not swallow a lookalike path', () => {
  // /apidocs is not /api/...
  assert.equal(at({ path: '/apidocs', hasUser: false }).action, 'allow');
});

test('an unprotected API route is allowed signed out', () => {
  // Only prefixes named in protectedPrefixes are protected; /api/health is not.
  assert.equal(at({ path: '/api/health', hasUser: false }).action, 'allow');
});

// ── no protected prefixes at all ─────────────────────────────────────────────

test('with no protected prefixes, everything is allowed — and that is visible', () => {
  // Not a bug in decide(), but a spec that protects nothing should be caught
  // upstream. Gate 0 requires at least one protectedRoute for exactly this.
  const r = decide({ ...base, protectedPrefixes: [], path: '/app/secret', hasUser: false });
  assert.equal(r.action, 'allow');
});
