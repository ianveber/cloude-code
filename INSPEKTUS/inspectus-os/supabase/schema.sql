-- INSPECTUS Center — Supabase schema (Phase 2: auth + persistence)
-- CONVENIENCE COPY for zero-tooling setup: paste this whole file into the Supabase
-- SQL Editor and Run. Canonical source is migrations/20260615120000_init.sql — if you
-- change the schema, change it THERE and re-copy here (they must stay identical).
-- Single shared INSPECTUS workspace (single-tenant). Signup gated to @inspectus.si + an admin allowlist.

-- ───────────────────────────────────────────────────────────────────────────
-- 1. profiles — one row per auth user, auto-created on signup
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'member',     -- 'admin' | 'member'
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ───────────────────────────────────────────────────────────────────────────
-- 2. runs — one saved VLDR processing run (shared across the workspace)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.runs (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  created_by       uuid references public.profiles(id),
  source_filename  text,
  -- report header (glava VIN-FILAJ)
  report_date      text,
  transport_id     text,
  delivering_party text,
  receiving_party  text,
  location         text,
  -- counts
  vehicle_count    int not null default 0,
  total_damages    int not null default 0,
  max_damages      int not null default 0,
  -- payloads
  stats            jsonb,   -- { class_dist, severity_histogram, top_codes }
  summary          text,    -- Claude Slovenian executive summary
  validation       jsonb,   -- AI issues array
  vehicles         jsonb,   -- structured grouped vehicles+damages (drives re-render + future analytics)
  raw_rows         jsonb    -- original parsed SURVEY REPORT rows (enables re-edit on reopen)
);
alter table public.runs enable row level security;
create index if not exists runs_created_at_idx on public.runs (created_at desc);

-- ───────────────────────────────────────────────────────────────────────────
-- 3. Signup gate — only @inspectus.si emails + an explicit admin allowlist.
--    EDIT THE ADMIN LIST BELOW (AIS operators) so we don't lock ourselves out.
-- ───────────────────────────────────────────────────────────────────────────
create or replace function public.allowed_emails()
returns text[] language sql immutable as $$
  -- AIS admin allowlist (these get in even though they aren't @inspectus.si):
  select array[
    'ian.veber@gmail.com'
    -- , 'anej@...'      -- TODO: add Anej's email
    -- , 'nejc@...'      -- TODO: add Nejc's email
  ];
$$;

-- Signup gate. OPEN to any email (the INSPECTUS team uses mixed domains) — see
-- migrations/20260617130000_open_signup_gate.sql. Admin role still bootstraps only
-- from allowed_emails() below. To re-tighten, restore the domain check here.
create or replace function public.is_email_allowed(addr text)
returns boolean language sql immutable as $$
  select true;
$$;

-- Auto-create the profile on signup + enforce the gate + bootstrap admins.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_email_allowed(new.email) then
    raise exception 'Email % ni dovoljen za INSPECTUS Center', new.email;
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when lower(new.email) = any (select lower(e) from unnest(public.allowed_emails()) e)
         then 'admin' else 'member' end
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────────────────────────────────────────────────────────
-- 4. RLS policies — single workspace: any authenticated member sees all runs.
-- ───────────────────────────────────────────────────────────────────────────
-- profiles
drop policy if exists profiles_select_auth on public.profiles;
create policy profiles_select_auth on public.profiles
  for select to authenticated using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (auth.uid() = id);

-- runs
drop policy if exists runs_select_auth on public.runs;
create policy runs_select_auth on public.runs
  for select to authenticated using (true);

drop policy if exists runs_insert_own on public.runs;
create policy runs_insert_own on public.runs
  for insert to authenticated with check (auth.uid() = created_by);

drop policy if exists runs_modify_owner_admin on public.runs;
create policy runs_modify_owner_admin on public.runs
  for update to authenticated using (
    auth.uid() = created_by
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists runs_delete_owner_admin on public.runs;
create policy runs_delete_owner_admin on public.runs
  for delete to authenticated using (
    auth.uid() = created_by
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Done. Next: Settings → API → copy Project URL + anon (publishable) key into inspectus-os/.env.local:
--   NEXT_PUBLIC_SUPABASE_URL=...
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
