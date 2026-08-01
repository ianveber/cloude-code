/**
 * schema.mjs — spec.data → schema.sql
 *
 * Every table is deny-by-default: RLS is enabled and no policy exists until one
 * is written here. A table with RLS enabled and no policy returns zero rows to
 * everyone, which is the correct failure direction. The dangerous mistake is a
 * table with RLS *disabled*, which returns everything to anyone holding the
 * anon key — so `enable row level security` is emitted unconditionally, for
 * every table, with no way to opt out from the spec.
 *
 * Three tenancy models, drawn from what is already proven in this repo:
 *
 *   owner   — auth.uid() = <ownerColumn>.  The ais-os pattern.
 *   tenant  — membership through a join table. The Heva pattern, which was
 *             adversarially proven with 13 tests before it shipped.
 *   shared  — any authenticated user. Honest about being a weak boundary, and
 *             the generator says so in the SQL itself.
 *
 * ⚠️ Two traps this file is written to avoid, both learned the hard way on Heva:
 *   1. Never use FORCE ROW LEVEL SECURITY together with SECURITY DEFINER
 *      helpers — the helper reads the table whose policy calls the helper, and
 *      Postgres reports "infinite recursion detected in policy for relation".
 *      ENABLE alone is correct; service_role has BYPASSRLS regardless.
 *   2. A policy on a table must never sub-query that same table. Membership
 *      lookups go through a SECURITY DEFINER function in a private schema.
 */

const IDENT = /^[a-z_][a-z0-9_]*$/;

function ident(name, what = 'identifier') {
  if (typeof name !== 'string' || !IDENT.test(name) || name.length > 63) {
    throw new Error(
      `invalid ${what} ${JSON.stringify(name)}: use lowercase letters, digits and underscores, starting with a letter`,
    );
  }
  return name;
}

const TENANCY = new Set(['owner', 'tenant', 'shared']);

/** Columns every table gets, so tests and the app can rely on them. */
const BASE_COLUMNS = [
  { name: 'id', type: 'uuid', default: 'gen_random_uuid()', primaryKey: true },
  { name: 'created_at', type: 'timestamptz', default: 'now()', notNull: true },
];

function columnSql(c) {
  const parts = [`  ${ident(c.name, 'column name')} ${c.type}`];
  if (c.primaryKey) parts.push('primary key');
  if (c.notNull && !c.primaryKey) parts.push('not null');
  if (c.default) parts.push(`default ${c.default}`);
  if (c.references) parts.push(`references ${c.references} on delete cascade`);
  return parts.join(' ');
}

export function normaliseSpec(spec) {
  const data = spec?.data;
  if (!data || !Array.isArray(data.tables) || data.tables.length === 0) {
    throw new Error('spec.data.tables must list at least one table');
  }
  const model = data.tenancy?.model ?? 'owner';
  if (!TENANCY.has(model)) {
    throw new Error(`unknown tenancy model ${JSON.stringify(model)} — expected one of ${[...TENANCY].join(', ')}`);
  }
  if (model === 'owner' && !data.tenancy?.ownerColumn) {
    // A sane default rather than a hard error: user_id is the near-universal name.
    data.tenancy = { ...data.tenancy, ownerColumn: 'user_id' };
  }
  if (model === 'tenant') {
    if (!data.tenancy?.tenantTable || !data.tenancy?.tenantFk) {
      throw new Error('tenancy model "tenant" requires data.tenancy.tenantTable and data.tenancy.tenantFk');
    }
    ident(data.tenancy.tenantTable, 'tenantTable');
    ident(data.tenancy.tenantFk, 'tenantFk');
  }
  for (const t of data.tables) ident(t.name, 'table name');
  const names = data.tables.map((t) => t.name);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length) throw new Error(`duplicate table names in spec: ${[...new Set(dupes)].join(', ')}`);
  return { ...data, tenancy: { ...data.tenancy, model } };
}

function policiesFor(table, tenancy) {
  const t = table.name;
  const m = tenancy.model;

  if (m === 'shared') {
    return [
      `-- Any signed-in user can read ${t}. This is a WEAK boundary: it keeps`,
      `-- data away from the anonymous internet and from nobody else. Use it`,
      `-- only where every authenticated user is genuinely entitled to every row.`,
      `create policy "${t}_select" on public.${t} for select`,
      `  to authenticated using (true);`,
      ``,
      `create policy "${t}_insert" on public.${t} for insert`,
      `  to authenticated with check (true);`,
    ];
  }

  if (m === 'owner') {
    const col = ident(tenancy.ownerColumn, 'ownerColumn');
    return [
      `-- A row belongs to exactly one user. Split per operation rather than`,
      `-- using FOR ALL: a single "for all" policy is also evaluated on every`,
      `-- read, which the Supabase linter flags (0006) and which costs on scans.`,
      `create policy "${t}_select" on public.${t} for select`,
      `  to authenticated using (${col} = (select auth.uid()));`,
      ``,
      `create policy "${t}_insert" on public.${t} for insert`,
      `  to authenticated with check (${col} = (select auth.uid()));`,
      ``,
      `create policy "${t}_update" on public.${t} for update`,
      `  to authenticated using (${col} = (select auth.uid()))`,
      `  with check (${col} = (select auth.uid()));`,
      ``,
      `create policy "${t}_delete" on public.${t} for delete`,
      `  to authenticated using (${col} = (select auth.uid()));`,
    ];
  }

  // tenant
  const fk = ident(tenancy.tenantFk, 'tenantFk');
  return [
    `-- Membership is resolved by a SECURITY DEFINER function in the private`,
    `-- schema. It must NOT be a sub-query on this table, and the function must`,
    `-- not live in public — Postgres grants EXECUTE to PUBLIC by default, which`,
    `-- would expose it as a REST endpoint anon could probe.`,
    `create policy "${t}_select" on public.${t} for select`,
    `  to authenticated using (private.is_member(${fk}));`,
    ``,
    `create policy "${t}_insert" on public.${t} for insert`,
    `  to authenticated with check (private.is_member(${fk}));`,
    ``,
    `create policy "${t}_update" on public.${t} for update`,
    `  to authenticated using (private.is_member(${fk}))`,
    `  with check (private.is_member(${fk}));`,
    ``,
    `create policy "${t}_delete" on public.${t} for delete`,
    `  to authenticated using (private.is_member(${fk}));`,
  ];
}

export function generateSchema(spec) {
  const data = normaliseSpec(spec);
  const { tenancy } = data;
  const out = [
    `-- Generated by app-factory starter-kit. Do not edit by hand:`,
    `-- regenerate from .protocol/spec.json so the RLS suite stays in step.`,
    `--`,
    `-- Tenancy model: ${tenancy.model}`,
    ``,
    `create extension if not exists "pgcrypto";`,
    ``,
  ];

  if (tenancy.model === 'tenant') {
    out.push(
      `-- Membership helper. Lives in the private schema so PostgREST cannot`,
      `-- expose it: functions in public are callable as /rest/v1/rpc/<name>,`,
      `-- and Postgres grants EXECUTE to PUBLIC by default — that combination`,
      `-- once turned a membership check into an endpoint anon could probe.`,
      `create schema if not exists private;`,
      ``,
      `create table if not exists public.${tenancy.tenantTable} (`,
      `  id uuid primary key default gen_random_uuid(),`,
      `  name text not null,`,
      `  created_at timestamptz not null default now()`,
      `);`,
      ``,
      `create table if not exists public.membership (`,
      `  id uuid primary key default gen_random_uuid(),`,
      `  user_id uuid not null references auth.users(id) on delete cascade,`,
      `  ${tenancy.tenantFk} uuid not null references public.${tenancy.tenantTable}(id) on delete cascade,`,
      `  created_at timestamptz not null default now(),`,
      `  unique (user_id, ${tenancy.tenantFk})`,
      `);`,
      ``,
      `create or replace function private.is_member(target uuid)`,
      `returns boolean language sql security definer stable`,
      `set search_path = public, pg_temp as $$`,
      `  select exists (`,
      `    select 1 from public.membership m`,
      `    where m.${tenancy.tenantFk} = target and m.user_id = auth.uid()`,
      `  );`,
      `$$;`,
      ``,
      `revoke all on function private.is_member(uuid) from public;`,
      ``,
      `alter table public.${tenancy.tenantTable} enable row level security;`,
      `alter table public.membership enable row level security;`,
      ``,
      `create policy "${tenancy.tenantTable}_select" on public.${tenancy.tenantTable} for select`,
      `  to authenticated using (private.is_member(id));`,
      ``,
      `create policy "membership_select" on public.membership for select`,
      `  to authenticated using (user_id = (select auth.uid()));`,
      ``,
    );
  }

  for (const table of data.tables) {
    const cols = [...BASE_COLUMNS];
    if (tenancy.model === 'owner') {
      cols.push({
        name: tenancy.ownerColumn,
        type: 'uuid',
        notNull: true,
        default: 'auth.uid()',
        references: 'auth.users(id)',
      });
    }
    if (tenancy.model === 'tenant') {
      cols.push({
        name: tenancy.tenantFk,
        type: 'uuid',
        notNull: true,
        references: `public.${tenancy.tenantTable}(id)`,
      });
    }
    for (const c of table.columns ?? []) cols.push(c);

    out.push(
      `create table if not exists public.${table.name} (`,
      cols.map(columnSql).join(',\n'),
      `);`,
      ``,
      `-- ENABLE, never FORCE. FORCE plus a SECURITY DEFINER helper produces`,
      `-- "infinite recursion detected in policy for relation", and FORCE buys`,
      `-- nothing here because service_role holds BYPASSRLS either way.`,
      `alter table public.${table.name} enable row level security;`,
      ``,
      ...policiesFor(table, tenancy),
      ``,
    );
  }

  return out.join('\n') + '\n';
}
