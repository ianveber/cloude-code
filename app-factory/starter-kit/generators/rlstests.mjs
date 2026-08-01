/**
 * rlstests.mjs — spec.data → an adversarial RLS suite.
 *
 * These tests exist to be FAILED by a broken policy. A suite that only proves
 * the happy path is worse than no suite, because it converts "we never checked"
 * into "we checked and it was fine".
 *
 * Two invariants the generator enforces on itself:
 *
 *   MANDATORY TWINS — every denial test is emitted alongside a positive test
 *   that must PASS. Without the twin, a policy that denies everyone (or a
 *   missing GRANT, or a typo'd table name) reads as a perfect score. The
 *   generator THROWS rather than emit a negative without its positive.
 *
 *   FULL COVERAGE — every table gets an anonymous-denial case, whether or not
 *   the spec mentions it. A table nobody thought about is exactly the table
 *   that ships with RLS off.
 *
 * Runs against a real Supabase project over psql rather than a container:
 * `set local request.jwt.claims` is precisely how Supabase resolves auth.uid(),
 * so the same SQL proves the real platform instead of a hand-written stub of
 * it. The whole suite runs inside a transaction that is rolled back.
 */

import { normaliseSpec } from './schema.mjs';

/** Stable fake user ids — readable in failure output, and obviously not real. */
export const USERS = {
  alice: '11111111-1111-1111-1111-111111111111',
  bob: '22222222-2222-2222-2222-222222222222',
};

const asUser = (uuid) => [
  `  set local role authenticated;`,
  `  set local request.jwt.claims = '{"sub":"${uuid}","role":"authenticated"}';`,
];

const asAnon = () => [`  set local role anon;`, `  set local request.jwt.claims = '{"role":"anon"}';`];

function block(title, body) {
  return [`do $$`, `declare n int; blocked boolean;`, `begin`, ...body, `end $$;`, ``].join('\n');
}

/**
 * Emit the test cases for one table.
 * Returns { negatives: [...], positives: [...] } so the caller can assert the
 * twin invariant rather than trusting this function to have honoured it.
 */
function casesFor(table, tenancy) {
  const t = table.name;
  const negatives = [];
  const positives = [];

  // ── N1: anonymous sees nothing. Emitted for EVERY table, always. ──────────
  negatives.push({
    id: `${t}-anon-denied`,
    sql: block(`${t}: anonymous read`, [
      ...asAnon(),
      `  select count(*) into n from public.${t};`,
      `  if n <> 0 then`,
      `    raise exception '${t} FAIL: anonymous read returned % rows — RLS is not protecting this table', n;`,
      `  end if;`,
      `  raise notice '${t} pass: anonymous sees nothing';`,
    ]),
  });

  // ── P1: the twin. A signed-in owner CAN see their own row. ────────────────
  // Without this, N1 passes just as happily on a table that denies everyone,
  // or on a table that does not exist at all.
  positives.push({
    id: `${t}-owner-can-read`,
    sql: block(`${t}: owner read`, [
      ...asUser(USERS.alice),
      `  select count(*) into n from public.${t};`,
      `  if n < 1 then`,
      `    raise exception '${t} FAIL: the owner cannot see their own row (got % rows). ` +
        `The denial test above is therefore meaningless — it would pass on a table nobody can read.';`,
      `  end if;`,
      `  raise notice '${t} pass: owner reads own rows (%)', n;`,
    ]),
  });

  if (tenancy.model === 'owner' || tenancy.model === 'tenant') {
    // ── N2: a DIFFERENT signed-in user sees nothing of alice's. ─────────────
    // This is the test that actually matters. Anonymous denial is table stakes;
    // cross-user leakage between two legitimate accounts is the real bug.
    negatives.push({
      id: `${t}-cross-user-denied`,
      sql: block(`${t}: cross-user read`, [
        ...asUser(USERS.bob),
        `  select count(*) into n from public.${t};`,
        `  if n <> 0 then`,
        `    raise exception '${t} FAIL: a different signed-in user read % of another user''s rows', n;`,
        `  end if;`,
        `  raise notice '${t} pass: cross-user read blocked';`,
      ]),
    });

    // ── N3: bob cannot write into alice's scope. ────────────────────────────
    negatives.push({
      id: `${t}-cross-user-write-denied`,
      sql: block(`${t}: cross-user write`, [
        ...asUser(USERS.bob),
        `  blocked := false;`,
        `  begin`,
        tenancy.model === 'owner'
          ? `    insert into public.${t} (${tenancy.ownerColumn}) values ('${USERS.alice}');`
          : `    insert into public.${t} (${tenancy.tenantFk}) select id from public.${tenancy.tenantTable} limit 1;`,
        `  exception when insufficient_privilege or others then blocked := true;`,
        `  end;`,
        `  if not blocked then`,
        `    raise exception '${t} FAIL: a user wrote a row scoped to someone else';`,
        `  end if;`,
        `  raise notice '${t} pass: cross-user write refused';`,
      ]),
    });
  }

  return { negatives, positives };
}

/**
 * @returns {{files: Record<string,string>, counts: {negatives:number, positives:number, tables:number}}}
 */
export function generateRlsTests(spec) {
  const data = normaliseSpec(spec);
  const { tenancy } = data;
  const files = {};
  let negatives = 0;
  let positives = 0;

  for (const table of data.tables) {
    const { negatives: neg, positives: pos } = casesFor(table, tenancy);

    // THE TWIN INVARIANT. Refuse to emit a suite that could score full marks
    // on a table nobody can read.
    if (neg.length > 0 && pos.length === 0) {
      throw new Error(
        `refusing to emit denial tests for "${table.name}" with no positive twin: ` +
          `a suite of pure denials passes just as well on a table that denies everyone, ` +
          `which would turn "we never checked" into "we checked and it was fine".`,
      );
    }

    let i = 0;
    for (const c of [...pos, ...neg]) {
      const n = String(++i).padStart(2, '0');
      files[`cases/${table.name}-${n}-${c.id}.sql`] = c.sql;
    }
    negatives += neg.length;
    positives += pos.length;
  }

  if (negatives === 0) {
    throw new Error('refusing to emit an RLS suite with zero denial tests — it would prove nothing');
  }

  files['fixtures.sql'] = buildFixtures(data);
  return { files, counts: { negatives, positives, tables: data.tables.length } };
}

function buildFixtures(data) {
  const { tenancy } = data;
  const lines = [
    `-- Fixtures for the RLS suite. Inserted as the table owner (which bypasses`,
    `-- RLS) so the tests measure POLICY behaviour, not insert permissions.`,
    `-- The whole suite runs inside a transaction that is rolled back.`,
    ``,
    `insert into auth.users (id, email) values`,
    `  ('${USERS.alice}', 'alice@factory.test'),`,
    `  ('${USERS.bob}', 'bob@factory.test')`,
    `on conflict (id) do nothing;`,
    ``,
  ];

  if (tenancy.model === 'tenant') {
    lines.push(
      `insert into public.${tenancy.tenantTable} (id, name)`,
      `  values ('33333333-3333-3333-3333-333333333333', 'Alice Org') on conflict do nothing;`,
      `insert into public.membership (user_id, ${tenancy.tenantFk})`,
      `  values ('${USERS.alice}', '33333333-3333-3333-3333-333333333333') on conflict do nothing;`,
      ``,
    );
  }

  for (const t of data.tables) {
    if (tenancy.model === 'owner') {
      lines.push(`insert into public.${t.name} (${tenancy.ownerColumn}) values ('${USERS.alice}');`);
    } else if (tenancy.model === 'tenant') {
      lines.push(
        `insert into public.${t.name} (${tenancy.tenantFk}) values ('33333333-3333-3333-3333-333333333333');`,
      );
    } else {
      lines.push(`insert into public.${t.name} default values;`);
    }
  }

  return lines.join('\n') + '\n';
}
