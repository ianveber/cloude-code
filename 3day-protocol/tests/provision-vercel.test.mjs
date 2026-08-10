// provision-vercel.test.mjs — the Vercel side of `provision`.
//
// Fully OFFLINE: every test injects a fake command runner. Nothing here shells
// out to the real `vercel` CLI.
//
// Two properties carry real weight:
//   1. Secret values NEVER appear in argv. Anything on a command line is
//      visible in the process table to every process on the machine, and ends
//      up in shell history. Env values must travel on stdin.
//   2. Git is NEVER connected to a Vercel project. deploy-guard is the single
//      choke point that blocks deploys below gate-2 green; a git connection
//      would let Vercel build straight from a push and route around it
//      entirely.
//
// Run: node --test ".../3day-protocol/tests/provision-vercel.test.mjs"

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createVercel, VercelError } from '../lib/cloud/vercel-api.mjs';

/** Records every invocation; replies from a queue of canned results. */
function spyExec(replies = []) {
  const calls = [];
  let i = 0;
  const fn = (file, args, opts = {}) => {
    calls.push({ file, args, input: opts.input, cwd: opts.cwd });
    const r = replies[i++] ?? { stdout: '' };
    if (r.throws) {
      const e = new Error(r.stderr || 'command failed');
      e.status = r.status ?? 1;
      e.stderr = r.stderr || '';
      throw e;
    }
    return r.stdout ?? '';
  };
  fn.calls = calls;
  return fn;
}

const v = (execImpl) => createVercel({ execImpl });

// ── secrets must never touch argv ────────────────────────────────────────────

test('setEnv passes the VALUE on stdin and never in argv', () => {
  const exec = spyExec([{ stdout: '' }]);
  const SECRET = 'sb_secret_do_not_leak_me_1234567890';

  v(exec).setEnv('/tmp/app', 'SUPABASE_SECRET_KEY', SECRET, 'production');

  const call = exec.calls[0];
  assert.equal(call.input, SECRET, 'value must arrive on stdin');
  for (const a of call.args) {
    assert.ok(!String(a).includes(SECRET), `secret leaked into argv: ${a}`);
  }
  assert.ok(call.args.includes('SUPABASE_SECRET_KEY'), 'the NAME may be in argv');
});

test('setEnv refuses an empty value rather than writing a blank secret', () => {
  const exec = spyExec();
  assert.throws(() => v(exec).setEnv('/tmp/app', 'K', '', 'production'), VercelError);
  assert.equal(exec.calls.length, 0);
});

// ── git must never be connected ──────────────────────────────────────────────

test('assertNoGitConnection passes when project.link is null', () => {
  const exec = spyExec([{ stdout: JSON.stringify({ name: 'demo', link: null }) }]);
  assert.doesNotThrow(() => v(exec).assertNoGitConnection('demo'));
});

test('assertNoGitConnection passes when the link key is ABSENT', () => {
  // Verified live 2026-08-01: an unconnected project omits `link` entirely
  // rather than sending null. Absent and null must behave identically.
  const exec = spyExec([{ stdout: JSON.stringify({ name: 'demo', id: 'prj_x' }) }]);
  assert.doesNotThrow(() => v(exec).assertNoGitConnection('demo'));
});

test('inspect uses `vercel api`, not `project inspect --json`', () => {
  // `vercel project inspect` has no --json flag on 54.5.0 (it errors), and its
  // human output never mentions the git connection. This regression test pins
  // the working call so the broken one cannot come back.
  const exec = spyExec([{ stdout: JSON.stringify({ name: 'demo' }) }]);
  v(exec).inspect('demo');
  assert.deepEqual(exec.calls[0].args, ['api', '/v9/projects/demo']);
});

test('assertNoGitConnection THROWS when a git repo is attached', () => {
  // A connected repo means Vercel can build from a push, bypassing deploy-guard.
  const exec = spyExec([
    { stdout: JSON.stringify({ name: 'demo', link: { type: 'github', repo: 'ian/demo' } }) },
  ]);
  assert.throws(
    () => v(exec).assertNoGitConnection('demo'),
    (e) => e instanceof VercelError && /deploy-guard|git/i.test(e.message),
  );
});

// ── project lifecycle ────────────────────────────────────────────────────────

test('createProject shells out to `vercel project add <name>`', () => {
  const exec = spyExec([{ stdout: 'Success' }]);
  v(exec).createProject('acme-portal');
  assert.equal(exec.calls[0].file, 'vercel');
  assert.deepEqual(exec.calls[0].args.slice(0, 3), ['project', 'add', 'acme-portal']);
});

test('createProject is idempotent — an existing project is not an error', () => {
  const exec = spyExec([{ throws: true, stderr: 'Error: Project already exists' }]);
  const out = v(exec).createProject('acme-portal');
  assert.equal(out.alreadyExisted, true);
});

test('createProject surfaces a genuine failure', () => {
  const exec = spyExec([{ throws: true, stderr: 'Error: not authorised' }]);
  assert.throws(() => v(exec).createProject('acme-portal'), VercelError);
});

test('link uses --yes so it can never block on a prompt', () => {
  const exec = spyExec([{ stdout: 'Linked' }]);
  v(exec).link('/tmp/app', 'acme-portal');
  const { args, cwd } = exec.calls[0];
  assert.ok(args.includes('--yes'), 'must be non-interactive');
  assert.ok(args.includes('acme-portal'));
  assert.equal(cwd, '/tmp/app', 'link is directory-scoped');
});

test('projectName rejects names that are not URL-safe', () => {
  const exec = spyExec();
  for (const bad of ['', 'Has Space', 'UPPER', 'trailing-', '-leading', 'a'.repeat(101)]) {
    assert.throws(() => v(exec).createProject(bad), VercelError, `${JSON.stringify(bad)} must be refused`);
  }
  assert.equal(exec.calls.length, 0);
});

test('whoami returns the authenticated scope', () => {
  const exec = spyExec([{ stdout: 'ianveber-4538\n' }]);
  assert.equal(v(exec).whoami(), 'ianveber-4538');
});

test('removeProject confirms the prompt on stdin', () => {
  // --non-interactive does NOT suppress the prompt; it still asks, and with no
  // TTY it reads empty, defaults to N, and exits 0 having deleted nothing.
  const exec = spyExec([
    { stdout: JSON.stringify({ name: 'demo' }) }, // pre-check: exists
    { stdout: 'Removed' },                        // rm
    { throws: true, stderr: 'not found' },        // post-check: gone
  ]);
  v(exec).removeProject('demo');
  assert.deepEqual(exec.calls[1].args, ['project', 'rm', 'demo']);
  assert.equal(exec.calls[1].input, 'y\n', 'confirmation must be fed on stdin');
});

test('removeProject THROWS when rm exits 0 but the project survives', () => {
  // The exact false success observed live: exit 0, nothing deleted.
  const exec = spyExec([
    { stdout: JSON.stringify({ name: 'demo' }) }, // exists
    { stdout: '' },                               // rm "succeeds"
    { stdout: JSON.stringify({ name: 'demo' }) }, // still there
  ]);
  assert.throws(
    () => v(exec).removeProject('demo'),
    (e) => e instanceof VercelError && /still exists/i.test(e.message),
  );
});

test('removeProject treats an already-absent project as success', () => {
  const exec = spyExec([{ throws: true, stderr: 'Error: Project not found' }]);
  assert.equal(v(exec).removeProject('demo').alreadyGone, true);
});
