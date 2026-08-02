// gate-check.test.mjs — T1 (core) + T5 (Gate 0) + T6 (Gate 1) test suite.
// Run: node --test "/Users/ianveber/Desktop/Cloude CODE/3day-protocol/tests"
//
// Covers the plan's test-suite paths touching init/0/doctor/1/status/reopen/note
// plus the journal PostToolUse appender (bin/journal-append). Every test gets a
// fresh tmp fixture dir (fs.mkdtempSync in os.tmpdir()).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

// Resolved relative to THIS file, never hardcoded: an absolute path means a
// copy of the pack silently tests the ORIGINAL rather than itself, so the
// suite passes while proving nothing about the code you actually have.
const PACK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const GC = path.join(PACK, 'bin', 'gate-check');
const JA = path.join(PACK, 'bin', 'journal-append');
const GUARD = path.join(PACK, 'bin', 'deploy-guard');

// ---------------------------------------------------------------- helpers

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gatecheck-'));
}

function run(args, cwd, opts = {}) {
  const res = spawnSync(process.execPath, [GC, ...args], {
    cwd,
    encoding: 'utf8',
    ...opts,
  });
  return { code: res.status, stdout: res.stdout, stderr: res.stderr };
}

function out(r) {
  return `${r.stdout}\n${r.stderr}`;
}

/** Scaffold a run project via `gate-check init` and return its dir. */
function initProject() {
  const dir = tmp();
  const r = run(['init', dir], dir);
  assert.equal(r.code, 0, out(r));
  // A run project ALWAYS has git: P0 requires it (SKILL.md), gates record HEAD
  // for freshness, and since F4 a gate whose freshness cannot be proven fails
  // closed. Fixtures without git were encoding a hole rather than reality.
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 'fixture@test.local'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'Fixture'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-qm', 'fixture: initial'], { cwd: dir });
  return dir;
}

function validSpec(mutate) {
  const spec = {
    project: 'fixture-app',
    pages: [{ name: 'Home', purpose: 'landing' }, { name: 'Dashboard' }],
    entities: [{ name: 'clients', fields: ['id', 'name'] }],
    auth: { roles: ['admin', 'member'] },
    design: { direction: 'apple-light minimalism', tokens: { accent: '#111' } },
    deployTarget: 'vercel',
    scopeFence: ['no multi-tenant billing', 'no native app'],
    protectedRoutes: ['/dashboard'],
    provisioning: {
      docker: { checked: true },
      supabaseCli: { checked: true },
      vercelCli: { checked: true },
      node: { checked: true },
      claudePlan: { attested: true },
      supabaseRef: { attested: true },
      vercelAccount: { attested: true },
    },
  };
  if (mutate) mutate(spec);
  return spec;
}

function writeSpec(dir, spec) {
  fs.writeFileSync(
    path.join(dir, '.protocol', 'spec.json'),
    typeof spec === 'string' ? spec : JSON.stringify(spec, null, 2)
  );
}

function readGate(dir, n) {
  const p = path.join(dir, '.protocol', 'gates', `gate-${n}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeGate(dir, n, obj) {
  fs.writeFileSync(
    path.join(dir, '.protocol', 'gates', `gate-${n}.json`),
    JSON.stringify(obj, null, 2)
  );
}

function journalEntries(dir) {
  const p = path.join(dir, '.protocol', 'journal.jsonl');
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l)); // throws if any line is broken JSONL
}

function setPhase(dir, phase) {
  fs.writeFileSync(path.join(dir, '.protocol', 'phase'), `${phase}\n`);
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

/** Turn a run project into a git repo (with .protocol/ ignored). */
function gitify(dir) {
  fs.writeFileSync(path.join(dir, '.gitignore'), '.protocol/\n.claude/\n');
  fs.writeFileSync(path.join(dir, 'app.js'), 'console.log("v1");\n');
  git(['init', '-q'], dir);
  git(['config', 'user.email', 'fixture@test.local'], dir);
  git(['config', 'user.name', 'Fixture'], dir);
  git(['add', '-A'], dir);
  git(['commit', '-q', '-m', 'v1'], dir);
}

// -------------------------------------------------------- dispatch errors

test('dispatch: no arguments prints usage and exits non-zero', () => {
  const r = run([], tmp());
  assert.notEqual(r.code, 0);
  assert.match(out(r), /usage/i);
});

test('dispatch: unknown subcommand named in the error, non-zero exit', () => {
  const r = run(['frobnicate'], tmp());
  assert.notEqual(r.code, 0);
  assert.match(out(r), /frobnicate/);
});

test('dispatch: init without a directory argument errors', () => {
  const r = run(['init'], tmp());
  assert.notEqual(r.code, 0);
  assert.match(out(r), /init <dir>|directory/i);
});

// -------------------------------------------------------------------- init

test('init scaffolds the full .protocol/ layout with phase=P1', () => {
  const dir = initProject();
  const p = path.join(dir, '.protocol');
  assert.ok(fs.existsSync(path.join(p, 'spec.json')), 'spec.json placeholder');
  assert.ok(fs.existsSync(path.join(p, 'gates')), 'gates/');
  assert.ok(fs.existsSync(path.join(p, 'evidence')), 'evidence/');
  assert.ok(fs.existsSync(path.join(p, 'journal.jsonl')), 'journal.jsonl');
  assert.equal(fs.readFileSync(path.join(p, 'phase'), 'utf8').trim(), 'P1');
  // placeholder spec parses and carries the unchecked provisioning checklist
  const spec = JSON.parse(fs.readFileSync(path.join(p, 'spec.json'), 'utf8'));
  assert.equal(spec.provisioning.docker.checked, false);
  assert.equal(spec.provisioning.claudePlan.attested, false);
  // journal lines are all valid JSONL
  journalEntries(dir);
});

test('init writes .claude/settings.json hooks with ABSOLUTE pack paths', () => {
  const dir = initProject();
  const settings = JSON.parse(
    fs.readFileSync(path.join(dir, '.claude', 'settings.json'), 'utf8')
  );
  const pre = JSON.stringify(settings.hooks.PreToolUse);
  const post = JSON.stringify(settings.hooks.PostToolUse);
  assert.ok(pre.includes(GUARD.replace(/"/g, '\\"')) || pre.includes(GUARD), `deploy-guard abs path in PreToolUse: ${pre}`);
  assert.ok(post.includes(JA.replace(/"/g, '\\"')) || post.includes(JA), `journal-append abs path in PostToolUse: ${post}`);
});

test('init is idempotent: re-init never clobbers spec, phase, journal, or hooks', () => {
  const dir = initProject();
  writeSpec(dir, validSpec());
  setPhase(dir, 'P3');
  const r = run(['note', 'survives reinit'], dir);
  assert.equal(r.code, 0, out(r));
  const journalBefore = journalEntries(dir).filter((e) => e.type === 'note');

  const r2 = run(['init', dir], dir);
  assert.equal(r2.code, 0, out(r2));

  const spec = JSON.parse(
    fs.readFileSync(path.join(dir, '.protocol', 'spec.json'), 'utf8')
  );
  assert.equal(spec.project, 'fixture-app', 'spec preserved');
  assert.equal(
    fs.readFileSync(path.join(dir, '.protocol', 'phase'), 'utf8').trim(),
    'P3',
    'phase preserved'
  );
  const notesAfter = journalEntries(dir).filter((e) => e.type === 'note');
  assert.deepEqual(notesAfter, journalBefore, 'journal preserved');

  // hooks not duplicated
  const settings = JSON.parse(
    fs.readFileSync(path.join(dir, '.claude', 'settings.json'), 'utf8')
  );
  const guardEntries = settings.hooks.PreToolUse.flatMap((m) => m.hooks).filter(
    (h) => h.command.includes('deploy-guard')
  );
  assert.equal(guardEntries.length, 1, 'exactly one deploy-guard hook');
});

test('init merges into an existing settings.json without clobbering', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, '.claude'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, '.claude', 'settings.json'),
    JSON.stringify({
      permissions: { allow: ['Bash(ls:*)'] },
      hooks: {
        PreToolUse: [
          { matcher: 'Write', hooks: [{ type: 'command', command: 'echo pre-existing' }] },
        ],
      },
    })
  );
  const r = run(['init', dir], dir);
  assert.equal(r.code, 0, out(r));
  const settings = JSON.parse(
    fs.readFileSync(path.join(dir, '.claude', 'settings.json'), 'utf8')
  );
  assert.deepEqual(settings.permissions, { allow: ['Bash(ls:*)'] }, 'foreign keys kept');
  const pre = JSON.stringify(settings.hooks.PreToolUse);
  assert.ok(pre.includes('echo pre-existing'), 'existing hook kept');
  assert.ok(pre.includes('deploy-guard'), 'guard hook added');
  assert.ok(JSON.stringify(settings.hooks.PostToolUse).includes('journal-append'));
});

test('init refuses to overwrite a malformed settings.json', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.claude', 'settings.json'), '{ broken');
  const r = run(['init', dir], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /malformed|parse/i);
  assert.equal(
    fs.readFileSync(path.join(dir, '.claude', 'settings.json'), 'utf8'),
    '{ broken',
    'file untouched'
  );
});

// ---------------------------------------------------------- Gate 0 (spec)

test('gate 0: valid spec goes green with head + evidence recorded', () => {
  const dir = initProject();
  gitify(dir);
  writeSpec(dir, validSpec());
  const r = run(['0'], dir);
  assert.equal(r.code, 0, out(r));
  const gate = readGate(dir, 0);
  assert.equal(gate.status, 'green');
  assert.ok(gate.ts, 'timestamp recorded');
  assert.equal(gate.head, git(['rev-parse', 'HEAD'], dir), 'git HEAD recorded');
  assert.ok(Array.isArray(gate.evidence) && gate.evidence.length > 0);
});

test('gate 0: schema violation goes RED naming the failing path', () => {
  const dir = initProject();
  writeSpec(
    dir,
    validSpec((s) => {
      s.auth.roles = []; // minItems violation
    })
  );
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /auth\.roles/);
  assert.equal(readGate(dir, 0).status, 'red');
});

test('gate 0: missing required field goes RED naming the path', () => {
  const dir = initProject();
  const spec = validSpec();
  delete spec.design;
  writeSpec(dir, spec);
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /design/);
});

test('gate 0: malformed spec JSON goes RED with a malformed-JSON message', () => {
  const dir = initProject();
  writeSpec(dir, '{ "project": "broken", ');
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /malformed|invalid json|parse/i);
  assert.equal(readGate(dir, 0).status, 'red');
});

test('gate 0: missing spec.json goes RED', () => {
  const dir = initProject();
  fs.rmSync(path.join(dir, '.protocol', 'spec.json'));
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /spec\.json/);
});

test('gate 0: unchecked docker provisioning item goes RED naming provisioning.docker', () => {
  const dir = initProject();
  writeSpec(
    dir,
    validSpec((s) => {
      s.provisioning.docker.checked = false;
    })
  );
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /provisioning\.docker\.checked/);
  assert.equal(readGate(dir, 0).status, 'red');
});

test('gate 0: un-attested human item (supabaseRef) goes RED naming the path', () => {
  const dir = initProject();
  writeSpec(
    dir,
    validSpec((s) => {
      s.provisioning.supabaseRef.attested = false;
    })
  );
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /provisioning\.supabaseRef\.attested/);
});

test('gate 0: placeholder spec from init is RED (never accidentally green)', () => {
  const dir = initProject();
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.equal(readGate(dir, 0).status, 'red');
});

test('gate 0: missing protectedRoutes is RED — Gate 3 needs it for the deployed proof', () => {
  const dir = initProject();
  const spec = validSpec();
  delete spec.protectedRoutes;
  writeSpec(dir, spec);
  const r = run(['0'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /protectedRoutes/);
  assert.equal(readGate(dir, 0).status, 'red');
});

// ------------------------------------------------------------------ doctor

test('doctor prints a tool/version table including node and gitleaks rows', () => {
  const r = run(['doctor'], tmp());
  assert.ok([0, 1].includes(r.code), out(r));
  assert.match(r.stdout, /node/i);
  assert.match(r.stdout, new RegExp(process.version.replace('.', '\\.')));
  assert.match(r.stdout, /docker/i);
  assert.match(r.stdout, /supabase/i);
  assert.match(r.stdout, /vercel/i);
  assert.match(r.stdout, /playwright/i);
  assert.match(r.stdout, /gitleaks/i);
});

test('doctor exits non-zero when required tools are missing (broken PATH)', () => {
  const r = run(['doctor'], tmp(), {
    env: { ...process.env, PATH: '/nonexistent-gatecheck-path' },
  });
  assert.equal(r.code, 1);
  assert.match(out(r), /missing/i);
});

// ---------------------------------------------------------- Gate 1 (design)

test('gate 1: --approve is REFUSED before any lint report is ingested', () => {
  const dir = initProject();
  const r = run(['1', '--approve', 'Ian Veber'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /report/i);
  const gate = readGate(dir, 1);
  assert.ok(!gate || gate.status !== 'green', 'gate must not be green');
});

test('gate 1: --report ingests the lint report as evidence', () => {
  const dir = initProject();
  const report = path.join(dir, 'lint-report.txt');
  fs.writeFileSync(report, 'contrast: pass\ntype-scale: pass\n');
  const r = run(['1', '--report', report], dir);
  assert.equal(r.code, 0, out(r));
  const gate = readGate(dir, 1);
  assert.ok(gate.report, 'report path recorded');
  assert.notEqual(gate.status, 'green', 'ingest alone is not green');
  const evidenceDir = path.join(dir, '.protocol', 'evidence');
  const copied = fs.readdirSync(evidenceDir).filter((f) => f.includes('gate1'));
  assert.equal(copied.length, 1, 'report copied into evidence/');
});

test('gate 1: --report with a nonexistent file errors', () => {
  const dir = initProject();
  const r = run(['1', '--report', '/no/such/report.txt'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /no such|not found|missing|does not exist/i);
});

test('gate 1: --approve after a report goes green with the approver recorded', () => {
  const dir = initProject();
  const report = path.join(dir, 'lint-report.txt');
  fs.writeFileSync(report, 'all checks pass\n');
  assert.equal(run(['1', '--report', report], dir).code, 0);
  const r = run(['1', '--approve', 'Ian Veber'], dir);
  assert.equal(r.code, 0, out(r));
  const gate = readGate(dir, 1);
  assert.equal(gate.status, 'green');
  assert.equal(gate.approver, 'Ian Veber');
  assert.ok(gate.ts);
});

test('gate 1: reopen starts a NEW gate cycle — approve refused until a fresh report', () => {
  const dir = initProject();
  const report = path.join(dir, 'lint-report.txt');
  fs.writeFileSync(report, 'pass\n');
  assert.equal(run(['1', '--report', report], dir).code, 0);
  assert.equal(run(['1', '--approve', 'Ian Veber'], dir).code, 0);
  assert.equal(run(['reopen', '1'], dir).code, 0);
  assert.equal(readGate(dir, 1).status, 'pending');
  const refused = run(['1', '--approve', 'Ian Veber'], dir);
  assert.notEqual(refused.code, 0, 'approve must be refused after reopen');
  // fresh report re-enables approval
  assert.equal(run(['1', '--report', report], dir).code, 0);
  assert.equal(run(['1', '--approve', 'Ian Veber'], dir).code, 0);
  assert.equal(readGate(dir, 1).status, 'green');
});

// ------------------------------------------------------------------ status

test('status prints all four gates and exits 1 when the prior gate is not green', () => {
  const dir = initProject();
  setPhase(dir, 'P2'); // prior gate = 0, which is pending
  const r = run(['status'], dir);
  assert.equal(r.code, 1);
  for (const n of [0, 1, 2, 3]) {
    assert.match(r.stdout, new RegExp(`\\b${n}\\b`));
  }
  assert.match(out(r), /gate 0/i);
});

test('status exits 0 in P1 (no prior gate) and after the prior gate is green', () => {
  const dir = initProject();
  assert.equal(run(['status'], dir).code, 0, 'P1 has no prior gate');
  writeSpec(dir, validSpec());
  assert.equal(run(['0'], dir).code, 0);
  setPhase(dir, 'P2');
  const r = run(['status'], dir);
  assert.equal(r.code, 0, out(r));
});

test('status --force "<reason>" overrides the block, exits 0, and journals it', () => {
  const dir = initProject();
  setPhase(dir, 'P2'); // gate 0 pending -> blocked
  assert.equal(run(['status'], dir).code, 1);
  const r = run(['status', '--force', 'client demo in 1h'], dir);
  assert.equal(r.code, 0, out(r));
  const overrides = journalEntries(dir).filter((e) => e.type === 'override');
  assert.equal(overrides.length, 1);
  assert.equal(overrides[0].reason, 'client demo in 1h');
  assert.ok(overrides[0].ts);
});

test('status --force without a reason is refused', () => {
  const dir = initProject();
  setPhase(dir, 'P2');
  const r = run(['status', '--force'], dir);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /reason/i);
});

test('status detects STALE: green gate + git drift (dirty, then new commit)', () => {
  const dir = initProject();
  gitify(dir);
  writeSpec(dir, validSpec());
  assert.equal(run(['0'], dir).code, 0);
  setPhase(dir, 'P2');
  assert.equal(run(['status'], dir).code, 0, 'fresh green passes');

  // dirty working tree => stale
  fs.writeFileSync(path.join(dir, 'app.js'), 'console.log("dirty");\n');
  let r = run(['status'], dir);
  assert.equal(r.code, 1);
  assert.match(r.stdout, /stale/i);

  // committed drift => still stale (HEAD mismatch)
  git(['add', '-A'], dir);
  git(['commit', '-q', '-m', 'drift'], dir);
  r = run(['status'], dir);
  assert.equal(r.code, 1);
  assert.match(r.stdout, /stale/i);

  // re-running the gate re-greens it
  assert.equal(run(['0'], dir).code, 0);
  assert.equal(run(['status'], dir).code, 0);
});

// ------------------------------------------------------------------ reopen

test('reopen N resets gate N to pending and cascades to ALL later gates', () => {
  const dir = initProject();
  for (const n of [0, 1, 2, 3]) {
    writeGate(dir, n, { status: 'green', ts: new Date().toISOString(), head: null });
  }
  const r = run(['reopen', '1'], dir);
  assert.equal(r.code, 0, out(r));
  assert.equal(readGate(dir, 0).status, 'green', 'earlier gate untouched');
  assert.equal(readGate(dir, 1).status, 'pending');
  assert.equal(readGate(dir, 2).status, 'pending', 'cascade to gate 2');
  assert.equal(readGate(dir, 3).status, 'pending', 'cascade to gate 3');
  const entries = journalEntries(dir).filter((e) => e.type === 'reopen');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].gate, 1);
});

test('reopen rejects an invalid gate number', () => {
  const dir = initProject();
  assert.notEqual(run(['reopen', '7'], dir).code, 0);
  assert.notEqual(run(['reopen'], dir).code, 0);
});

// -------------------------------------------------------------------- note

test('note appends {ts,type:"note",text} and keeps journal.jsonl valid JSONL', () => {
  const dir = initProject();
  assert.equal(run(['note', 'first intervention'], dir).code, 0);
  assert.equal(
    run(['note', 'tricky "quoted" text — with unicode ✓ and\tnewline-ish'], dir).code,
    0
  );
  const notes = journalEntries(dir).filter((e) => e.type === 'note'); // parse throws on broken lines
  assert.equal(notes.length, 2);
  assert.equal(notes[0].text, 'first intervention');
  assert.equal(notes[1].text, 'tricky "quoted" text — with unicode ✓ and\tnewline-ish');
  assert.ok(notes.every((n) => typeof n.ts === 'string' && n.ts.length > 0));
});

test('note without text is refused', () => {
  const dir = initProject();
  assert.notEqual(run(['note'], dir).code, 0);
});

test('subcommands outside a run project fail with a clear message', () => {
  const bare = tmp();
  const r = run(['status'], bare);
  assert.notEqual(r.code, 0);
  assert.match(out(r), /\.protocol|gate-check init/);
});

// -------------------------------------------------- journal-append (hook)

function runAppender(input, opts = {}) {
  const res = spawnSync(process.execPath, [JA], {
    input,
    encoding: 'utf8',
    ...opts,
  });
  return { code: res.status, stdout: res.stdout, stderr: res.stderr };
}

test('journal-append appends {ts,tool,phase} from a PostToolUse event', () => {
  const dir = initProject();
  setPhase(dir, 'P3');
  const before = journalEntries(dir).length;
  const r = runAppender(
    JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'ls' }, cwd: dir })
  );
  assert.equal(r.code, 0, r.stderr);
  const entries = journalEntries(dir);
  assert.equal(entries.length, before + 1);
  const last = entries[entries.length - 1];
  assert.equal(last.tool, 'Bash');
  assert.equal(last.phase, 'P3');
  assert.ok(last.ts);
});

test('journal-append walks up to .protocol from a nested cwd', () => {
  const dir = initProject();
  const nested = path.join(dir, 'src', 'components');
  fs.mkdirSync(nested, { recursive: true });
  const before = journalEntries(dir).length;
  const r = runAppender(JSON.stringify({ tool_name: 'Edit', cwd: nested }));
  assert.equal(r.code, 0);
  assert.equal(journalEntries(dir).length, before + 1);
});

test('journal-append NEVER blocks: garbage stdin warns to stderr and exits 0', () => {
  const r = runAppender('this is not json');
  assert.equal(r.code, 0);
  assert.match(r.stderr, /warn/i);
});

test('journal-append NEVER blocks: no .protocol anywhere exits 0', () => {
  const bare = tmp();
  const r = runAppender(JSON.stringify({ tool_name: 'Bash', cwd: bare }));
  assert.equal(r.code, 0);
});

test('journal-append NEVER blocks: empty stdin exits 0', () => {
  const r = runAppender('');
  assert.equal(r.code, 0);
});
