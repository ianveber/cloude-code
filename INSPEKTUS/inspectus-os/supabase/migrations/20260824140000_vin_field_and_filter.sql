-- INSPECTUS Center — field capture (zajem) + pametni filter persistence
-- Additive. Does not change VLDR `runs` or auth. Safe to apply on existing projects.
-- After push: set the same NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
-- No new secrets. Photos may be stored as compressed JPEG data URLs in field_photos.data_url
-- (typical field shot is <400 KB after the 1600px cap). Optional Storage bucket is documented
-- in NAVODILA-PAMETNI-FILTER.md if you later want blobs off-row.

-- ───────────────────────────────────────────────────────────────────────────
-- ships — one ladja session (two inspectors can share a ship; vehicles stay tagged)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ships (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  status      text not null default 'open' check (status in ('open', 'complete')),
  created_at  timestamptz not null default now(),
  created_by  uuid references public.profiles(id)
);
alter table public.ships enable row level security;
create index if not exists ships_created_at_idx on public.ships (created_at desc);

-- ───────────────────────────────────────────────────────────────────────────
-- field_vehicles — explicit VIN boundary (opened by the inspector, not EXIF)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.field_vehicles (
  id              uuid primary key default gen_random_uuid(),
  ship_id         uuid not null references public.ships(id) on delete cascade,
  sequence        int not null default 0,
  vin             text not null default '',
  vin_readable    boolean not null default false,
  inspector_id    text not null,
  inspector_name  text not null,
  opened_at       timestamptz not null default now(),
  closed_at       timestamptz
);
alter table public.field_vehicles enable row level security;
create index if not exists field_vehicles_ship_idx on public.field_vehicles (ship_id, sequence);

-- ───────────────────────────────────────────────────────────────────────────
-- field_photos — VIN plate or damage, always belonging to a known vehicle
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.field_photos (
  id              uuid primary key default gen_random_uuid(),
  ship_id         uuid not null references public.ships(id) on delete cascade,
  vehicle_id      uuid not null references public.field_vehicles(id) on delete cascade,
  kind            text not null check (kind in ('vin', 'damage')),
  data_url        text,
  storage_path    text,
  captured_at     timestamptz not null default now(),
  inspector_id    text not null,
  inspector_name  text not null
);
alter table public.field_photos enable row level security;
create index if not exists field_photos_vehicle_idx on public.field_photos (vehicle_id, captured_at);

-- ───────────────────────────────────────────────────────────────────────────
-- filter_runs — pametni filter results (metadata; images stay in the browser session)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.filter_runs (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  created_by    uuid references public.profiles(id),
  ship_name     text,
  ship_list     jsonb not null default '[]'::jsonb,
  result        jsonb,
  source_count  int not null default 0
);
alter table public.filter_runs enable row level security;
create index if not exists filter_runs_created_at_idx on public.filter_runs (created_at desc);

-- RLS: same single-tenant workspace as `runs` — any authenticated member.
drop policy if exists ships_select_auth on public.ships;
create policy ships_select_auth on public.ships for select to authenticated using (true);
drop policy if exists ships_insert_auth on public.ships;
create policy ships_insert_auth on public.ships for insert to authenticated with check (true);
drop policy if exists ships_update_auth on public.ships;
create policy ships_update_auth on public.ships for update to authenticated using (true);

drop policy if exists field_vehicles_select_auth on public.field_vehicles;
create policy field_vehicles_select_auth on public.field_vehicles for select to authenticated using (true);
drop policy if exists field_vehicles_insert_auth on public.field_vehicles;
create policy field_vehicles_insert_auth on public.field_vehicles for insert to authenticated with check (true);
drop policy if exists field_vehicles_update_auth on public.field_vehicles;
create policy field_vehicles_update_auth on public.field_vehicles for update to authenticated using (true);

drop policy if exists field_photos_select_auth on public.field_photos;
create policy field_photos_select_auth on public.field_photos for select to authenticated using (true);
drop policy if exists field_photos_insert_auth on public.field_photos;
create policy field_photos_insert_auth on public.field_photos for insert to authenticated with check (true);

drop policy if exists filter_runs_select_auth on public.filter_runs;
create policy filter_runs_select_auth on public.filter_runs for select to authenticated using (true);
drop policy if exists filter_runs_insert_auth on public.filter_runs;
create policy filter_runs_insert_auth on public.filter_runs for insert to authenticated with check (true);
