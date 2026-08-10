-- =====================================================================
-- Arhiv Heva — portal schema + row level security
-- Run this ONCE in the Supabase SQL editor of a fresh EU project.
-- Idempotent: safe to re-run.
--
-- Security model
--   * Two roles: 'manager' (Heva staff, sees everything) and 'resident'
--     (sees only the buildings they are a member of).
--   * Access is decided in Postgres, never in the UI. Even a fully
--     compromised front-end cannot read another building's documents.
--   * Files live in a PRIVATE storage bucket. Nothing is ever served
--     over a public URL; the app hands out short-lived signed URLs.
--   * Every document view/download is written to access_log (GDPR
--     accountability + proof of delivery to owners).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------

-- Heva staff + residents. Mirrors auth.users, adds the role.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'resident' check (role in ('manager','resident')),
  created_at  timestamptz not null default now()
);

-- Objekti — buildings and commercial centres (TPC / SPAR / NC / PC / blocks).
create table if not exists public.buildings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  kind        text not null default 'residential'
              check (kind in ('residential','commercial')),
  address     text,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Which resident may see which building. Managers need no rows here.
create table if not exists public.memberships (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, building_id)
);

-- Access granted BEFORE the person has ever logged in. Heva imports a
-- resident list per building; on first magic-link login a trigger
-- converts the matching rows into real memberships. This is what keeps
-- signup closed — an unknown email can authenticate but sees nothing.
create table if not exists public.pending_memberships (
  email       text not null,
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (email, building_id)
);

create table if not exists public.folders (
  id          uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  parent_id   uuid references public.folders(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  building_id  uuid not null references public.buildings(id) on delete cascade,
  folder_id    uuid references public.folders(id) on delete set null,
  name         text not null,
  -- Path inside the private bucket. Convention: <building_id>/<uuid>-<name>
  storage_path text not null unique,
  size_bytes   bigint not null default 0,
  mime_type    text,
  uploaded_by  uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- Append-only audit trail. Residents can write their own rows; only
-- managers can read it back.
create table if not exists public.access_log (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  building_id uuid references public.buildings(id) on delete set null,
  action      text not null check (action in ('view','download')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_memberships_user     on public.memberships(user_id);
create index if not exists idx_memberships_building on public.memberships(building_id);
create index if not exists idx_pending_email        on public.pending_memberships(lower(email));
create index if not exists idx_folders_building     on public.folders(building_id);
create index if not exists idx_documents_building   on public.documents(building_id);
create index if not exists idx_documents_folder     on public.documents(folder_id);
create index if not exists idx_access_log_building  on public.access_log(building_id, created_at desc);

-- ---------------------------------------------------------------------
-- 2. Helper functions
--
-- SECURITY DEFINER so they can read profiles/memberships without
-- tripping the RLS policies that call them (that would recurse).
-- search_path is pinned to '' and every name fully qualified, so the
-- functions cannot be hijacked by a caller-controlled search_path.
--
-- They live in `private`, NOT `public`, on purpose. PostgREST only
-- exposes the schemas it is configured with, so a function in `private`
-- is not reachable as /rest/v1/rpc/<name>. Left in public they would be
-- callable by anon — `can_read_building(uuid)` in particular would let
-- anyone probe building membership without signing in. Supabase's own
-- linter flags this as anon_security_definer_function_executable.
-- ---------------------------------------------------------------------

create schema if not exists private;
revoke all on schema private from public;

drop function if exists public.is_manager();
drop function if exists public.can_read_building(uuid);
drop function if exists public.current_role_name();

create or replace function private.is_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'manager'
  );
$$;

-- Own role, read through a definer function so the profiles policy can
-- reference it without self-referencing the table it guards.
create or replace function private.current_role_name()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid());
$$;

create or replace function private.can_read_building(b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    private.is_manager()
    or exists (
      select 1
      from public.memberships m
      where m.building_id = b
        and m.user_id = (select auth.uid())
    );
$$;

-- New signup -> create profile, then convert any pre-authorised
-- (email, building) rows into real memberships. Email match is
-- case-insensitive; the pending rows are consumed.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  insert into public.memberships (user_id, building_id)
  select new.id, pm.building_id
  from public.pending_memberships pm
  where lower(pm.email) = lower(new.email)
  on conflict do nothing;

  delete from public.pending_memberships pm
  where lower(pm.email) = lower(new.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. Row level security
--
-- RLS is enabled AND forced on every table. Nothing is readable by
-- default; each policy below opens exactly one door.
-- The server's service_role key bypasses RLS by design — it is used
-- only in server-side admin routes and must never reach the browser.
-- ---------------------------------------------------------------------

alter table public.profiles            enable row level security;
alter table public.buildings           enable row level security;
alter table public.memberships         enable row level security;
alter table public.pending_memberships enable row level security;
alter table public.folders             enable row level security;
alter table public.documents           enable row level security;
alter table public.access_log          enable row level security;

-- NOTE: deliberately NOT using FORCE ROW LEVEL SECURITY.
-- The helper functions above are SECURITY DEFINER and read profiles /
-- memberships — the very tables whose policies call them. FORCE would
-- subject the function owner to RLS too, so is_manager() would trigger
-- the profiles policy, which calls is_manager()... -> "infinite
-- recursion detected in policy for relation". FORCE also buys nothing
-- here: service_role carries BYPASSRLS and ignores it either way.

-- profiles: you see yourself; managers see everyone. Nobody may change
-- their own role — that is a service_role operation only.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or private.is_manager());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  -- role must equal what it already is: a resident cannot promote
  -- themselves to manager by PATCHing their own profile row.
  with check (
    id = (select auth.uid())
    and role = private.current_role_name()
  );

-- buildings
drop policy if exists buildings_select on public.buildings;
create policy buildings_select on public.buildings
  for select to authenticated
  using (private.can_read_building(id));

drop policy if exists buildings_write_insert on public.buildings;
drop policy if exists buildings_write_update on public.buildings;
drop policy if exists buildings_write_delete on public.buildings;
drop policy if exists buildings_write on public.buildings;
create policy buildings_write_insert on public.buildings
  for insert to authenticated
  with check (private.is_manager());

create policy buildings_write_update on public.buildings
  for update to authenticated
  using (private.is_manager())
  with check (private.is_manager());

create policy buildings_write_delete on public.buildings
  for delete to authenticated
  using (private.is_manager());

-- memberships: residents may read their own rows, managers everything.
drop policy if exists memberships_select on public.memberships;
create policy memberships_select on public.memberships
  for select to authenticated
  using (user_id = (select auth.uid()) or private.is_manager());

drop policy if exists memberships_write_insert on public.memberships;
drop policy if exists memberships_write_update on public.memberships;
drop policy if exists memberships_write_delete on public.memberships;
drop policy if exists memberships_write on public.memberships;
create policy memberships_write_insert on public.memberships
  for insert to authenticated
  with check (private.is_manager());

create policy memberships_write_update on public.memberships
  for update to authenticated
  using (private.is_manager())
  with check (private.is_manager());

create policy memberships_write_delete on public.memberships
  for delete to authenticated
  using (private.is_manager());

-- pending_memberships: managers only. Residents must never enumerate
-- who has been invited to which building.
drop policy if exists pending_all on public.pending_memberships;
create policy pending_all on public.pending_memberships
  for all to authenticated
  using (private.is_manager())
  with check (private.is_manager());

-- folders
drop policy if exists folders_select on public.folders;
create policy folders_select on public.folders
  for select to authenticated
  using (private.can_read_building(building_id));

drop policy if exists folders_write_insert on public.folders;
drop policy if exists folders_write_update on public.folders;
drop policy if exists folders_write_delete on public.folders;
drop policy if exists folders_write on public.folders;
create policy folders_write_insert on public.folders
  for insert to authenticated
  with check (private.is_manager());

create policy folders_write_update on public.folders
  for update to authenticated
  using (private.is_manager())
  with check (private.is_manager());

create policy folders_write_delete on public.folders
  for delete to authenticated
  using (private.is_manager());

-- documents — the row that matters. v1 is read-only for residents.
drop policy if exists documents_select on public.documents;
create policy documents_select on public.documents
  for select to authenticated
  using (private.can_read_building(building_id));

drop policy if exists documents_write_insert on public.documents;
drop policy if exists documents_write_update on public.documents;
drop policy if exists documents_write_delete on public.documents;
drop policy if exists documents_write on public.documents;
create policy documents_write_insert on public.documents
  for insert to authenticated
  with check (private.is_manager());

create policy documents_write_update on public.documents
  for update to authenticated
  using (private.is_manager())
  with check (private.is_manager());

create policy documents_write_delete on public.documents
  for delete to authenticated
  using (private.is_manager());

-- access_log: append-only from the client, readable by managers.
-- No update/delete policy exists, so the trail cannot be edited.
drop policy if exists access_log_insert on public.access_log;
create policy access_log_insert on public.access_log
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and private.can_read_building(building_id)
  );

drop policy if exists access_log_select on public.access_log;
create policy access_log_select on public.access_log
  for select to authenticated
  using (private.is_manager());

-- ---------------------------------------------------------------------
-- 4. Private storage bucket + its own RLS
--
-- Defence in depth: the app serves files through short-lived signed
-- URLs generated server-side, but a direct storage read is ALSO gated
-- by the same building membership check. Access is resolved by joining
-- back to documents, so a malformed object path grants nothing.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('dokumenti', 'dokumenti', false)
on conflict (id) do update set public = false;

drop policy if exists dokumenti_read on storage.objects;
create policy dokumenti_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'dokumenti'
    and exists (
      select 1
      from public.documents d
      where d.storage_path = storage.objects.name
        and private.can_read_building(d.building_id)
    )
  );

drop policy if exists dokumenti_write on storage.objects;
create policy dokumenti_write on storage.objects
  for all to authenticated
  using (bucket_id = 'dokumenti' and private.is_manager())
  with check (bucket_id = 'dokumenti' and private.is_manager());
