/**
 * rls-integrity.mjs — the part of Gate 2 the app under test cannot influence.
 *
 * Gate 2 decides whether an app is safe to deploy, and the app was written by
 * an agent. So the verdict must never be derived from anything that agent
 * controls. The division of responsibility:
 *
 *   the APP supplies test CASES        — data
 *   the PACK supplies the runner       — code
 *   the PACK does the arithmetic       — code
 *
 * Concretely, this module:
 *   - reads the app's schema to learn which tables EXIST (a table cannot hide
 *     from coverage by not being mentioned in the tests)
 *   - counts case files from the filesystem, never from anything a file says
 *     about itself
 *   - requires a denial case per table, and a positive twin per denial
 *   - NEVER executes anything from the app directory
 *
 * The rejected alternative was to run `<runDir>/supabase/tests/run.sh` and
 * parse its stdout. That script lives inside the app under test and is written
 * by the agent being judged: a four-line shell script printing "All tests
 * successful" would have become the entire security verdict.
 */

import fs from 'node:fs';
import path from 'node:path';

/** Tables the app actually declares, with whether RLS is switched on. */
export function readSchemaTables(runDir) {
  const file = path.join(runDir, 'supabase', 'schema.sql');
  let sql;
  try {
    sql = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  // Strip line comments so a commented-out table cannot inflate coverage.
  const bare = sql
    .split('\n')
    .filter((l) => !l.trim().startsWith('--'))
    .join('\n');

  const tables = new Map();
  const createRe = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z_][a-z0-9_]*)/gi;
  let m;
  while ((m = createRe.exec(bare))) tables.set(m[1].toLowerCase(), { rls: false });

  const rlsRe = /alter\s+table\s+(?:public\.)?([a-z_][a-z0-9_]*)\s+enable\s+row\s+level\s+security/gi;
  while ((m = rlsRe.exec(bare))) {
    const t = m[1].toLowerCase();
    if (tables.has(t)) tables.get(t).rls = true;
  }
  return tables;
}

const DENIAL_RE = /(denied|deny|refused|blocked|anon)/i;
const POSITIVE_RE = /(can-read|can-write|owner-can|allowed|positive|twin)/i;

/**
 * Judge the suite without running it or trusting it.
 * @returns {{ok:boolean, findings:string[], tables:string[], caseCount:number, executed:string[]}}
 */
export function analyseRlsSuite(runDir) {
  const findings = [];
  const executed = []; // stays empty by construction — nothing here runs anything

  const tableMap = readSchemaTables(runDir);
  if (!tableMap) {
    return {
      ok: false,
      findings: ['RLS: no supabase/schema.sql — cannot determine which tables need protecting.'],
      tables: [],
      caseCount: 0,
      executed,
    };
  }
  const tables = [...tableMap.keys()];

  // Tables that exist without RLS return every row to anyone holding the anon
  // key. No test suite can compensate for that, so it is checked here.
  for (const [t, info] of tableMap) {
    if (!info.rls) {
      findings.push(
        `RLS: table "${t}" is created without \`alter table public.${t} enable row level security\` — ` +
          `it is readable by anyone with the anon key regardless of any policy.`,
      );
    }
  }

  const casesDir = path.join(runDir, 'supabase', 'tests', 'cases');
  let caseFiles = [];
  try {
    caseFiles = fs.readdirSync(casesDir).filter((f) => f.endsWith('.sql'));
  } catch {
    return {
      ok: false,
      findings: [
        ...findings,
        `RLS: no case directory at supabase/tests/cases — absence of tests is a red gate, never a skip.`,
      ],
      tables,
      caseCount: 0,
      executed,
    };
  }

  if (caseFiles.length === 0) {
    findings.push('RLS: no RLS cases found — a suite that proves nothing cannot make a gate green.');
  }

  // Coverage, computed per table from the SCHEMA, not from the tests. A table
  // nobody wrote a test for is exactly the one that ships open.
  for (const t of tables) {
    const mine = caseFiles.filter((f) => f.toLowerCase().startsWith(`${t}-`) || f.toLowerCase().includes(`-${t}-`));
    const denials = mine.filter((f) => DENIAL_RE.test(f));
    const positives = mine.filter((f) => POSITIVE_RE.test(f));

    if (denials.length === 0) {
      findings.push(
        `RLS: table "${t}" has no denial case — nothing proves an unauthorised reader is refused.`,
      );
    }
    if (denials.length > 0 && positives.length === 0) {
      findings.push(
        `RLS: table "${t}" has denial cases but no positive twin — a suite of pure denials scores ` +
          `full marks against a policy that denies everyone, which proves nothing.`,
      );
    }
  }

  return { ok: findings.length === 0, findings, tables, caseCount: caseFiles.length, executed };
}
