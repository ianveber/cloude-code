-- Arhiv Heva seed — generated from portal-ui/data.js. Idempotent.
-- REAL: the 42 object names + RAZGLEDNA 2's folder sizes/dates.
-- PLACEHOLDER: the documents (marked so they can be wiped in one statement).
begin;
insert into public.buildings (name, slug, kind) values ('TPC ZAGORJE', 'tpc-zagorje', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR BROD', 'spar-brod', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR ČRNOMELJ', 'spar-crnomelj', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC LENART', 'tpc-lenart', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC LITIJA', 'tpc-litija', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC LJUTOMER', 'tpc-ljutomer', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR MIKLAVŽ', 'spar-miklavz', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC SLO. BISTRICA', 'tpc-slo-bistrica', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC TRŽIČ', 'tpc-trzic', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR VOJNIK', 'spar-vojnik', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('NC VELENJE', 'nc-velenje', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('PC DRAVA PTUJ', 'pc-drava-ptuj', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('AJDOVŠČINA', 'ajdovscina', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('BEZENA 79', 'bezena-79', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('LJUBLJANSKA 3A', 'ljubljanska-3a', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('CAKARJEVA 6', 'cakarjeva-6', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('VOJNIŠKE TERASE', 'vojniske-terase', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('MD II/A', 'md-ii-a', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('ŠLANDROV TRG 34A', 'slandrov-trg-34a', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('CANKARJEVA 8', 'cankarjeva-8', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('DIII', 'diii', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('DRAPŠINOVA - 3D', 'drapsinova-3d', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('VILA BLOK MEDLOG 2', 'vila-blok-medlog-2', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('VILA BLOK MEDLOG 1', 'vila-blok-medlog-1', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('RAZGLEDNA 2', 'razgledna-2', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SAVINJSKO NABREŽJE', 'savinjsko-nabrezje', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('LENART 2', 'lenart-2', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('GOSPOSKA 2', 'gosposka-2', 'residential')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR ŠTEPANSKO NASELJE', 'spar-stepansko-naselje', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC VRHNIKA', 'tpc-vrhnika', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC RIBNICA', 'tpc-ribnica', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC POSTOJNA', 'tpc-postojna', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC PIVKA', 'tpc-pivka', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR TRZIN', 'spar-trzin', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR ZALOŠKA', 'spar-zaloska', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('TPC RADOVLJICA', 'tpc-radovljica', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR VRHOVCI', 'spar-vrhovci', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR SLOVENČEVA', 'spar-slovenceva', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR PLANINA', 'spar-planina', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR PEČNIK', 'spar-pecnik', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('SPAR BABNIK', 'spar-babnik', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;
insert into public.buildings (name, slug, kind) values ('RC', 'rc', 'commercial')
  on conflict (slug) do update set name = excluded.name, kind = excluded.kind;

-- folders
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-zagorje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-zagorje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-zagorje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-zagorje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-brod'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-brod'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-brod'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-brod'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-crnomelj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-crnomelj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-crnomelj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-crnomelj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-lenart'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-lenart'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-lenart'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-lenart'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-litija'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-litija'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-litija'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-litija'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-ljutomer'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-ljutomer'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-ljutomer'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-ljutomer'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-miklavz'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-miklavz'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-miklavz'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-miklavz'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-slo-bistrica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-slo-bistrica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-slo-bistrica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-slo-bistrica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-trzic'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-trzic'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-trzic'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-trzic'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-vojnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-vojnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-vojnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-vojnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'nc-velenje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'nc-velenje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'nc-velenje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'nc-velenje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'pc-drava-ptuj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'pc-drava-ptuj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'pc-drava-ptuj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'pc-drava-ptuj'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'ajdovscina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'ajdovscina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'ajdovscina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'ajdovscina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'bezena-79'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'bezena-79'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'bezena-79'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'bezena-79'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'ljubljanska-3a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'ljubljanska-3a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'ljubljanska-3a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'ljubljanska-3a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'cakarjeva-6'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'cakarjeva-6'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'cakarjeva-6'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'cakarjeva-6'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'vojniske-terase'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'vojniske-terase'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'vojniske-terase'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'vojniske-terase'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'md-ii-a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'md-ii-a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'md-ii-a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'md-ii-a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'slandrov-trg-34a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'slandrov-trg-34a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'slandrov-trg-34a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'slandrov-trg-34a'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'cankarjeva-8'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'cankarjeva-8'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'cankarjeva-8'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'cankarjeva-8'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'diii'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'diii'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'diii'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'diii'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'drapsinova-3d'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'drapsinova-3d'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'drapsinova-3d'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'drapsinova-3d'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'vila-blok-medlog-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'vila-blok-medlog-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'vila-blok-medlog-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'vila-blok-medlog-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'vila-blok-medlog-1'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'vila-blok-medlog-1'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'vila-blok-medlog-1'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'vila-blok-medlog-1'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'razgledna-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'razgledna-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'razgledna-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'razgledna-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'savinjsko-nabrezje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'savinjsko-nabrezje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'savinjsko-nabrezje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'savinjsko-nabrezje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'lenart-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'lenart-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'lenart-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'lenart-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'gosposka-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'gosposka-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'gosposka-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'gosposka-2'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-stepansko-naselje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-stepansko-naselje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-stepansko-naselje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-stepansko-naselje'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-vrhnika'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-vrhnika'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-vrhnika'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-vrhnika'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-ribnica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-ribnica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-ribnica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-ribnica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-postojna'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-postojna'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-postojna'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-postojna'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-pivka'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-pivka'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-pivka'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-pivka'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-trzin'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-trzin'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-trzin'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-trzin'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-zaloska'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-zaloska'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-zaloska'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-zaloska'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'tpc-radovljica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'tpc-radovljica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'tpc-radovljica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'tpc-radovljica'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-vrhovci'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-vrhovci'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-vrhovci'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-vrhovci'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-slovenceva'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-slovenceva'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-slovenceva'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-slovenceva'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-planina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-planina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-planina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-planina'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-pecnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-pecnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-pecnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-pecnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'spar-babnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'spar-babnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'spar-babnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'spar-babnik'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');
insert into public.folders (building_id, name)
  select b.id, 'GASILNIKI' from public.buildings b where b.slug = 'rc'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'GASILNIKI');
insert into public.folders (building_id, name)
  select b.id, 'RAČUNI' from public.buildings b where b.slug = 'rc'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'RAČUNI');
insert into public.folders (building_id, name)
  select b.id, 'STRELOVODNE NAPRAVE' from public.buildings b where b.slug = 'rc'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'STRELOVODNE NAPRAVE');
insert into public.folders (building_id, name)
  select b.id, 'ZAVAROVALNE POLICE' from public.buildings b where b.slug = 'rc'
  and not exists (select 1 from public.folders x where x.building_id = b.id and x.name = 'ZAVAROVALNE POLICE');

-- documents (PLACEHOLDER content)
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-zagorje/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 524288, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-zagorje/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 608174, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-zagorje/GASILNIKI/Popis gasilnikov po etažah.xlsx', 660603, 'application/pdf', '2026-04-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-zagorje/RAČUNI/Račun 07-2026 · julij.pdf', 18905825, 'application/pdf', '2026-07-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-zagorje/RAČUNI/Račun 06-2026 · junij.pdf', 7392461, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-zagorje/RAČUNI/Račun 05-2026 · maj.pdf', 13358858, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-zagorje/RAČUNI/Račun 04-2026 · april.pdf', 19335741, 'application/pdf', '2026-04-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-zagorje/RAČUNI/Račun 03-2026 · marec.pdf', 16672358, 'application/pdf', '2026-03-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-zagorje/RAČUNI/Račun 02-2026 · februar.pdf', 10108273, 'application/pdf', '2026-02-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-zagorje/RAČUNI/Račun 01-2026 · januar.pdf', 19388170, 'application/pdf', '2026-01-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-zagorje/RAČUNI/Letni obračun stroškov 2025.pdf', 7623148, 'application/pdf', '2026-02-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-zagorje/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 2852127, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-zagorje/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2317353, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-zagorje/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 2254438, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-zagorje/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 2359296, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-zagorje/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1876951, 'application/pdf', '2026-04-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-zagorje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-brod/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1918894, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-brod/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2715812, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-brod/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1625293, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-brod/RAČUNI/Račun 07-2026 · julij.pdf', 24326963, 'application/pdf', '2026-07-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-brod/RAČUNI/Račun 06-2026 · junij.pdf', 23949476, 'application/pdf', '2026-06-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-brod/RAČUNI/Račun 05-2026 · maj.pdf', 12593398, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-brod/RAČUNI/Račun 04-2026 · april.pdf', 20132659, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-brod/RAČUNI/Račun 03-2026 · marec.pdf', 14040433, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-brod/RAČUNI/Račun 02-2026 · februar.pdf', 16766730, 'application/pdf', '2026-02-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-brod/RAČUNI/Račun 01-2026 · januar.pdf', 9468641, 'application/pdf', '2026-01-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-brod/RAČUNI/Letni obračun stroškov 2025.pdf', 19493028, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-brod/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 754975, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-brod/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 671089, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-brod/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 2160067, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-brod/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 2348810, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-brod/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1646264, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-brod'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-crnomelj/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1520435, 'application/pdf', '2026-06-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-crnomelj/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2726298, 'application/pdf', '2026-06-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-crnomelj/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1541407, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-crnomelj/RAČUNI/Račun 07-2026 · julij.pdf', 7769948, 'application/pdf', '2026-07-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-crnomelj/RAČUNI/Račun 06-2026 · junij.pdf', 5567939, 'application/pdf', '2026-06-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-crnomelj/RAČUNI/Račun 05-2026 · maj.pdf', 7046431, 'application/pdf', '2026-05-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-crnomelj/RAČUNI/Račun 04-2026 · april.pdf', 3544187, 'application/pdf', '2026-04-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-crnomelj/RAČUNI/Račun 03-2026 · marec.pdf', 5179965, 'application/pdf', '2026-03-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-crnomelj/RAČUNI/Račun 02-2026 · februar.pdf', 6773801, 'application/pdf', '2026-02-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-crnomelj/RAČUNI/Račun 01-2026 · januar.pdf', 5704253, 'application/pdf', '2026-01-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-crnomelj/RAČUNI/Letni obračun stroškov 2025.pdf', 3963617, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-crnomelj/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3816817, 'application/pdf', '2026-05-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-crnomelj/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2181038, 'application/pdf', '2026-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-crnomelj/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1782579, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-crnomelj/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1855980, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-crnomelj/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1499464, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-crnomelj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-lenart/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1184891, 'application/pdf', '2026-06-26'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-lenart/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 964690, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-lenart/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2023752, 'application/pdf', '2026-06-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-lenart/RAČUNI/Račun 07-2026 · julij.pdf', 23446159, 'application/pdf', '2026-07-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-lenart/RAČUNI/Račun 06-2026 · junij.pdf', 19220398, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-lenart/RAČUNI/Račun 05-2026 · maj.pdf', 15781069, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-lenart/RAČUNI/Račun 04-2026 · april.pdf', 17427333, 'application/pdf', '2026-04-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-lenart/RAČUNI/Račun 03-2026 · marec.pdf', 13463716, 'application/pdf', '2026-03-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-lenart/RAČUNI/Račun 02-2026 · februar.pdf', 20677919, 'application/pdf', '2026-02-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-lenart/RAČUNI/Račun 01-2026 · januar.pdf', 16483615, 'application/pdf', '2026-01-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-lenart/RAČUNI/Letni obračun stroškov 2025.pdf', 17846764, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-lenart/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3460301, 'application/pdf', '2026-05-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-lenart/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2956984, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-lenart/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1835008, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-lenart/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1027604, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-lenart/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1950351, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-lenart'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-litija/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 3156214, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-litija/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1174405, 'application/pdf', '2026-06-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-litija/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2359296, 'application/pdf', '2026-05-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-litija/RAČUNI/Račun 07-2026 · julij.pdf', 17773363, 'application/pdf', '2026-07-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-litija/RAČUNI/Račun 06-2026 · junij.pdf', 14187233, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-litija/RAČUNI/Račun 05-2026 · maj.pdf', 18475909, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-litija/RAČUNI/Račun 04-2026 · april.pdf', 12782141, 'application/pdf', '2026-04-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-litija/RAČUNI/Račun 03-2026 · marec.pdf', 10192159, 'application/pdf', '2026-03-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-litija/RAČUNI/Račun 02-2026 · februar.pdf', 9867100, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-litija/RAČUNI/Račun 01-2026 · januar.pdf', 18350080, 'application/pdf', '2026-01-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-litija/RAČUNI/Letni obračun stroškov 2025.pdf', 18643681, 'application/pdf', '2026-02-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-litija/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 482345, 'application/pdf', '2026-05-26'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-litija/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 765460, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-litija/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 566231, 'application/pdf', '2026-06-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-litija/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 618660, 'application/pdf', '2026-04-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-litija/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 545260, 'application/pdf', '2026-05-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-litija'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-ljutomer/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1614807, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-ljutomer/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 723517, 'application/pdf', '2026-05-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-ljutomer/GASILNIKI/Popis gasilnikov po etažah.xlsx', 692060, 'application/pdf', '2026-04-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-ljutomer/RAČUNI/Račun 07-2026 · julij.pdf', 15204352, 'application/pdf', '2026-07-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-ljutomer/RAČUNI/Račun 06-2026 · junij.pdf', 10915676, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-ljutomer/RAČUNI/Račun 05-2026 · maj.pdf', 15476982, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-ljutomer/RAČUNI/Račun 04-2026 · april.pdf', 18654167, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-ljutomer/RAČUNI/Račun 03-2026 · marec.pdf', 9971958, 'application/pdf', '2026-03-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-ljutomer/RAČUNI/Račun 02-2026 · februar.pdf', 16473129, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-ljutomer/RAČUNI/Račun 01-2026 · januar.pdf', 22995272, 'application/pdf', '2026-01-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-ljutomer/RAČUNI/Letni obračun stroškov 2025.pdf', 17018388, 'application/pdf', '2026-02-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-ljutomer/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1069548, 'application/pdf', '2026-05-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-ljutomer/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1541407, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-ljutomer/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 545260, 'application/pdf', '2026-05-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-ljutomer/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 346030, 'application/pdf', '2026-04-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-ljutomer/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 230687, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-ljutomer'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-miklavz/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1111491, 'application/pdf', '2026-06-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-miklavz/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 534774, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-miklavz/GASILNIKI/Popis gasilnikov po etažah.xlsx', 671089, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-miklavz/RAČUNI/Račun 07-2026 · julij.pdf', 15833498, 'application/pdf', '2026-07-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-miklavz/RAČUNI/Račun 06-2026 · junij.pdf', 8503951, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-miklavz/RAČUNI/Račun 05-2026 · maj.pdf', 18350080, 'application/pdf', '2026-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-miklavz/RAČUNI/Račun 04-2026 · april.pdf', 13988004, 'application/pdf', '2026-04-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-miklavz/RAČUNI/Račun 03-2026 · marec.pdf', 18790482, 'application/pdf', '2026-03-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-miklavz/RAČUNI/Račun 02-2026 · februar.pdf', 20898120, 'application/pdf', '2026-02-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-miklavz/RAČUNI/Račun 01-2026 · januar.pdf', 21600666, 'application/pdf', '2026-01-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-miklavz/RAČUNI/Letni obračun stroškov 2025.pdf', 13348372, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-miklavz/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1247805, 'application/pdf', '2026-06-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-miklavz/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 461373, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-miklavz/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1635779, 'application/pdf', '2026-06-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-miklavz/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1436549, 'application/pdf', '2026-06-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-miklavz/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1457521, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-miklavz'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-slo-bistrica/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1405092, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-slo-bistrica/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2422211, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-slo-bistrica/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1027604, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 07-2026 · julij.pdf', 12499026, 'application/pdf', '2026-07-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 06-2026 · junij.pdf', 9909043, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 05-2026 · maj.pdf', 12268339, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 04-2026 · april.pdf', 7759462, 'application/pdf', '2026-04-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 03-2026 · marec.pdf', 12488540, 'application/pdf', '2026-03-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 02-2026 · februar.pdf', 19545457, 'application/pdf', '2026-02-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-slo-bistrica/RAČUNI/Račun 01-2026 · januar.pdf', 17144218, 'application/pdf', '2026-01-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-slo-bistrica/RAČUNI/Letni obračun stroškov 2025.pdf', 17825792, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-slo-bistrica/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 2967470, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-slo-bistrica/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2768241, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-slo-bistrica/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 314573, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-slo-bistrica/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 209715, 'application/pdf', '2026-05-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-slo-bistrica/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 209715, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-slo-bistrica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-trzic/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1163919, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-trzic/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1426063, 'application/pdf', '2026-04-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-trzic/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2191524, 'application/pdf', '2026-04-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-trzic/RAČUNI/Račun 07-2026 · julij.pdf', 19786629, 'application/pdf', '2026-07-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-trzic/RAČUNI/Račun 06-2026 · junij.pdf', 13904118, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-trzic/RAČUNI/Račun 05-2026 · maj.pdf', 24285020, 'application/pdf', '2026-05-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-trzic/RAČUNI/Račun 04-2026 · april.pdf', 11219763, 'application/pdf', '2026-04-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-trzic/RAČUNI/Račun 03-2026 · marec.pdf', 24872223, 'application/pdf', '2026-03-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-trzic/RAČUNI/Račun 02-2026 · februar.pdf', 15309210, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-trzic/RAČUNI/Račun 01-2026 · januar.pdf', 26476544, 'application/pdf', '2026-01-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-trzic/RAČUNI/Letni obračun stroškov 2025.pdf', 20552090, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-trzic/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 828375, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-trzic/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 419430, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-trzic/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1793065, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-trzic/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 3575644, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-trzic/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1478492, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-trzic'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-vojnik/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 954204, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-vojnik/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1887437, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-vojnik/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1247805, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-vojnik/RAČUNI/Račun 07-2026 · julij.pdf', 28080865, 'application/pdf', '2026-07-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-vojnik/RAČUNI/Račun 06-2026 · junij.pdf', 13274972, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-vojnik/RAČUNI/Račun 05-2026 · maj.pdf', 19283313, 'application/pdf', '2026-05-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-vojnik/RAČUNI/Račun 04-2026 · april.pdf', 21999124, 'application/pdf', '2026-04-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-vojnik/RAČUNI/Račun 03-2026 · marec.pdf', 21768438, 'application/pdf', '2026-03-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-vojnik/RAČUNI/Račun 02-2026 · februar.pdf', 27965522, 'application/pdf', '2026-02-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-vojnik/RAČUNI/Račun 01-2026 · januar.pdf', 15938355, 'application/pdf', '2026-01-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-vojnik/RAČUNI/Letni obračun stroškov 2025.pdf', 14942208, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-vojnik/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 2527068, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-vojnik/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 3544187, 'application/pdf', '2026-05-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-vojnik/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1866465, 'application/pdf', '2026-05-26'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-vojnik/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1667236, 'application/pdf', '2026-04-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-vojnik/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1814036, 'application/pdf', '2026-04-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-vojnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'nc-velenje/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 209715, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'nc-velenje/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 545260, 'application/pdf', '2026-07-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'nc-velenje/GASILNIKI/Popis gasilnikov po etažah.xlsx', 482345, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'nc-velenje/RAČUNI/Račun 07-2026 · julij.pdf', 15183380, 'application/pdf', '2026-07-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'nc-velenje/RAČUNI/Račun 06-2026 · junij.pdf', 8095007, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'nc-velenje/RAČUNI/Račun 05-2026 · maj.pdf', 6375342, 'application/pdf', '2026-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'nc-velenje/RAČUNI/Račun 04-2026 · april.pdf', 15267267, 'application/pdf', '2026-04-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'nc-velenje/RAČUNI/Račun 03-2026 · marec.pdf', 17857249, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'nc-velenje/RAČUNI/Račun 02-2026 · februar.pdf', 15267267, 'application/pdf', '2026-02-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'nc-velenje/RAČUNI/Račun 01-2026 · januar.pdf', 11859395, 'application/pdf', '2026-01-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'nc-velenje/RAČUNI/Letni obračun stroškov 2025.pdf', 12016681, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'nc-velenje/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3072328, 'application/pdf', '2026-05-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'nc-velenje/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2107638, 'application/pdf', '2026-04-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'nc-velenje/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 262144, 'application/pdf', '2026-06-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'nc-velenje/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 597688, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'nc-velenje/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 440402, 'application/pdf', '2026-05-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'nc-velenje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'pc-drava-ptuj/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 996147, 'application/pdf', '2026-06-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'pc-drava-ptuj/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1551892, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'pc-drava-ptuj/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1321206, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'pc-drava-ptuj/RAČUNI/Račun 07-2026 · julij.pdf', 24494735, 'application/pdf', '2026-07-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'pc-drava-ptuj/RAČUNI/Račun 06-2026 · junij.pdf', 15571354, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'pc-drava-ptuj/RAČUNI/Račun 05-2026 · maj.pdf', 20268974, 'application/pdf', '2026-05-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'pc-drava-ptuj/RAČUNI/Račun 04-2026 · april.pdf', 19000197, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'pc-drava-ptuj/RAČUNI/Račun 03-2026 · marec.pdf', 15655240, 'application/pdf', '2026-03-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'pc-drava-ptuj/RAČUNI/Račun 02-2026 · februar.pdf', 33795604, 'application/pdf', '2026-02-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'pc-drava-ptuj/RAČUNI/Račun 01-2026 · januar.pdf', 20038287, 'application/pdf', '2026-01-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'pc-drava-ptuj/RAČUNI/Letni obračun stroškov 2025.pdf', 13998490, 'application/pdf', '2026-02-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'pc-drava-ptuj/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1992294, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'pc-drava-ptuj/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2076180, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'pc-drava-ptuj/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 304087, 'application/pdf', '2026-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'pc-drava-ptuj/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 555745, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'pc-drava-ptuj/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 356516, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'pc-drava-ptuj'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'ajdovscina/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 283116, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'ajdovscina/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 660603, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'ajdovscina/GASILNIKI/Popis gasilnikov po etažah.xlsx', 555745, 'application/pdf', '2026-04-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'ajdovscina/RAČUNI/Račun 07-2026 · julij.pdf', 9038725, 'application/pdf', '2026-07-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'ajdovscina/RAČUNI/Račun 06-2026 · junij.pdf', 16536044, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'ajdovscina/RAČUNI/Račun 05-2026 · maj.pdf', 18622710, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'ajdovscina/RAČUNI/Račun 04-2026 · april.pdf', 16231956, 'application/pdf', '2026-04-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'ajdovscina/RAČUNI/Račun 03-2026 · marec.pdf', 11093934, 'application/pdf', '2026-03-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'ajdovscina/RAČUNI/Račun 02-2026 · februar.pdf', 10737418, 'application/pdf', '2026-02-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'ajdovscina/RAČUNI/Račun 01-2026 · januar.pdf', 24693965, 'application/pdf', '2026-01-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'ajdovscina/RAČUNI/Letni obračun stroškov 2025.pdf', 15435039, 'application/pdf', '2026-02-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'ajdovscina/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 660603, 'application/pdf', '2026-06-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'ajdovscina/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 387973, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'ajdovscina/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 891290, 'application/pdf', '2026-06-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'ajdovscina/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 870318, 'application/pdf', '2026-05-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'ajdovscina/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 597688, 'application/pdf', '2026-04-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'ajdovscina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'bezena-79/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 2558525, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'bezena-79/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1268777, 'application/pdf', '2026-05-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'bezena-79/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1803551, 'application/pdf', '2026-05-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'bezena-79/RAČUNI/Račun 07-2026 · julij.pdf', 6574572, 'application/pdf', '2026-07-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'bezena-79/RAČUNI/Račun 06-2026 · junij.pdf', 4781507, 'application/pdf', '2026-06-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'bezena-79/RAČUNI/Račun 05-2026 · maj.pdf', 3732931, 'application/pdf', '2026-05-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'bezena-79/RAČUNI/Račun 04-2026 · april.pdf', 5924454, 'application/pdf', '2026-04-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'bezena-79/RAČUNI/Račun 03-2026 · marec.pdf', 6197084, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'bezena-79/RAČUNI/Račun 02-2026 · februar.pdf', 5630853, 'application/pdf', '2026-02-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'bezena-79/RAČUNI/Račun 01-2026 · januar.pdf', 6543114, 'application/pdf', '2026-01-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'bezena-79/RAČUNI/Letni obračun stroškov 2025.pdf', 5221908, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'bezena-79/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3439329, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'bezena-79/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2537554, 'application/pdf', '2026-04-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'bezena-79/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 513802, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'bezena-79/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 450888, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'bezena-79/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 440402, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'bezena-79'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'ljubljanska-3a/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 461373, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'ljubljanska-3a/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 597688, 'application/pdf', '2026-06-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'ljubljanska-3a/GASILNIKI/Popis gasilnikov po etažah.xlsx', 692060, 'application/pdf', '2026-04-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'ljubljanska-3a/RAČUNI/Račun 07-2026 · julij.pdf', 5620367, 'application/pdf', '2026-07-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'ljubljanska-3a/RAČUNI/Račun 06-2026 · junij.pdf', 5672796, 'application/pdf', '2026-06-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'ljubljanska-3a/RAČUNI/Račun 05-2026 · maj.pdf', 8713667, 'application/pdf', '2026-05-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'ljubljanska-3a/RAČUNI/Račun 04-2026 · april.pdf', 11492393, 'application/pdf', '2026-04-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'ljubljanska-3a/RAČUNI/Račun 03-2026 · marec.pdf', 8766095, 'application/pdf', '2026-03-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'ljubljanska-3a/RAČUNI/Račun 02-2026 · februar.pdf', 9196012, 'application/pdf', '2026-02-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'ljubljanska-3a/RAČUNI/Račun 01-2026 · januar.pdf', 8556380, 'application/pdf', '2026-01-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'ljubljanska-3a/RAČUNI/Letni obračun stroškov 2025.pdf', 10810819, 'application/pdf', '2026-02-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'ljubljanska-3a/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3607101, 'application/pdf', '2026-06-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'ljubljanska-3a/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2233467, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'ljubljanska-3a/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 660603, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'ljubljanska-3a/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 597688, 'application/pdf', '2026-04-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'ljubljanska-3a/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 576717, 'application/pdf', '2026-04-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'ljubljanska-3a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'cakarjeva-6/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1918894, 'application/pdf', '2026-06-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'cakarjeva-6/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1289748, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'cakarjeva-6/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1541407, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'cakarjeva-6/RAČUNI/Račun 07-2026 · julij.pdf', 6375342, 'application/pdf', '2026-07-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'cakarjeva-6/RAČUNI/Račun 06-2026 · junij.pdf', 7077888, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'cakarjeva-6/RAČUNI/Račun 05-2026 · maj.pdf', 5158994, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'cakarjeva-6/RAČUNI/Račun 04-2026 · april.pdf', 5683282, 'application/pdf', '2026-04-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'cakarjeva-6/RAČUNI/Račun 03-2026 · marec.pdf', 5777654, 'application/pdf', '2026-03-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'cakarjeva-6/RAČUNI/Račun 02-2026 · februar.pdf', 10716447, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'cakarjeva-6/RAČUNI/Račun 01-2026 · januar.pdf', 4508877, 'application/pdf', '2026-01-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'cakarjeva-6/RAČUNI/Letni obračun stroškov 2025.pdf', 4330619, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'cakarjeva-6/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3428844, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'cakarjeva-6/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2076180, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'cakarjeva-6/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1667236, 'application/pdf', '2026-07-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'cakarjeva-6/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1814036, 'application/pdf', '2026-06-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'cakarjeva-6/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 2285896, 'application/pdf', '2026-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'cakarjeva-6'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'vojniske-terase/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1101005, 'application/pdf', '2026-04-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'vojniske-terase/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2726298, 'application/pdf', '2026-04-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'vojniske-terase/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1530921, 'application/pdf', '2026-05-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'vojniske-terase/RAČUNI/Račun 07-2026 · julij.pdf', 18769510, 'application/pdf', '2026-07-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'vojniske-terase/RAČUNI/Račun 06-2026 · junij.pdf', 18245222, 'application/pdf', '2026-06-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'vojniske-terase/RAČUNI/Račun 05-2026 · maj.pdf', 10338959, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'vojniske-terase/RAČUNI/Račun 04-2026 · april.pdf', 15057551, 'application/pdf', '2026-04-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'vojniske-terase/RAČUNI/Račun 03-2026 · marec.pdf', 10674504, 'application/pdf', '2026-03-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'vojniske-terase/RAČUNI/Račun 02-2026 · februar.pdf', 24442307, 'application/pdf', '2026-02-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'vojniske-terase/RAČUNI/Račun 01-2026 · januar.pdf', 9971958, 'application/pdf', '2026-01-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'vojniske-terase/RAČUNI/Letni obračun stroškov 2025.pdf', 19167969, 'application/pdf', '2026-02-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'vojniske-terase/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1142948, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'vojniske-terase/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 723517, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'vojniske-terase/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 2264924, 'application/pdf', '2026-06-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'vojniske-terase/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1478492, 'application/pdf', '2026-06-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'vojniske-terase/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 2757755, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vojniske-terase'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'md-ii-a/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 429916, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'md-ii-a/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 367002, 'application/pdf', '2026-04-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'md-ii-a/GASILNIKI/Popis gasilnikov po etažah.xlsx', 251658, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'md-ii-a/RAČUNI/Račun 07-2026 · julij.pdf', 17291018, 'application/pdf', '2026-07-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'md-ii-a/RAČUNI/Račun 06-2026 · junij.pdf', 18496881, 'application/pdf', '2026-06-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'md-ii-a/RAČUNI/Račun 05-2026 · maj.pdf', 8493466, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'md-ii-a/RAČUNI/Račun 04-2026 · april.pdf', 13065257, 'application/pdf', '2026-04-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'md-ii-a/RAČUNI/Račun 03-2026 · marec.pdf', 11733565, 'application/pdf', '2026-03-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'md-ii-a/RAČUNI/Račun 02-2026 · februar.pdf', 10286531, 'application/pdf', '2026-02-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'md-ii-a/RAČUNI/Račun 01-2026 · januar.pdf', 15497953, 'application/pdf', '2026-01-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'md-ii-a/RAČUNI/Letni obračun stroškov 2025.pdf', 6595543, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'md-ii-a/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3355443, 'application/pdf', '2026-05-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'md-ii-a/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 3009413, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'md-ii-a/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1080033, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'md-ii-a/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1080033, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'md-ii-a/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1237320, 'application/pdf', '2026-04-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'md-ii-a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'slandrov-trg-34a/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 859832, 'application/pdf', '2026-06-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'slandrov-trg-34a/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2002780, 'application/pdf', '2026-06-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'slandrov-trg-34a/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1426063, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'slandrov-trg-34a/RAČUNI/Račun 07-2026 · julij.pdf', 4865393, 'application/pdf', '2026-07-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'slandrov-trg-34a/RAČUNI/Račun 06-2026 · junij.pdf', 5148508, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'slandrov-trg-34a/RAČUNI/Račun 05-2026 · maj.pdf', 3869245, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'slandrov-trg-34a/RAČUNI/Račun 04-2026 · april.pdf', 6322913, 'application/pdf', '2026-04-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'slandrov-trg-34a/RAČUNI/Račun 03-2026 · marec.pdf', 6658458, 'application/pdf', '2026-03-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'slandrov-trg-34a/RAČUNI/Račun 02-2026 · februar.pdf', 4781507, 'application/pdf', '2026-02-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'slandrov-trg-34a/RAČUNI/Račun 01-2026 · januar.pdf', 5117051, 'application/pdf', '2026-01-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'slandrov-trg-34a/RAČUNI/Letni obračun stroškov 2025.pdf', 5525996, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'slandrov-trg-34a/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 429916, 'application/pdf', '2026-07-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'slandrov-trg-34a/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 356516, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'slandrov-trg-34a/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 377487, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'slandrov-trg-34a/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 681574, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'slandrov-trg-34a/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 671089, 'application/pdf', '2026-04-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'slandrov-trg-34a'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'cankarjeva-8/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1677722, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'cankarjeva-8/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1132462, 'application/pdf', '2026-05-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'cankarjeva-8/GASILNIKI/Popis gasilnikov po etažah.xlsx', 786432, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'cankarjeva-8/RAČUNI/Račun 07-2026 · julij.pdf', 17825792, 'application/pdf', '2026-07-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'cankarjeva-8/RAČUNI/Račun 06-2026 · junij.pdf', 12341740, 'application/pdf', '2026-06-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'cankarjeva-8/RAČUNI/Račun 05-2026 · maj.pdf', 16965960, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'cankarjeva-8/RAČUNI/Račun 04-2026 · april.pdf', 14921236, 'application/pdf', '2026-04-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'cankarjeva-8/RAČUNI/Račun 03-2026 · marec.pdf', 8912896, 'application/pdf', '2026-03-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'cankarjeva-8/RAČUNI/Račun 02-2026 · februar.pdf', 14826865, 'application/pdf', '2026-02-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'cankarjeva-8/RAČUNI/Račun 01-2026 · januar.pdf', 19230884, 'application/pdf', '2026-01-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'cankarjeva-8/RAČUNI/Letni obračun stroškov 2025.pdf', 8829010, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'cankarjeva-8/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1971323, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'cankarjeva-8/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1740636, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'cankarjeva-8/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 545260, 'application/pdf', '2026-07-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'cankarjeva-8/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 576717, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'cankarjeva-8/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 692060, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'cankarjeva-8'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'diii/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 492831, 'application/pdf', '2026-05-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'diii/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 356516, 'application/pdf', '2026-06-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'diii/GASILNIKI/Popis gasilnikov po etažah.xlsx', 954204, 'application/pdf', '2026-04-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'diii/RAČUNI/Račun 07-2026 · julij.pdf', 8818524, 'application/pdf', '2026-07-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'diii/RAČUNI/Račun 06-2026 · junij.pdf', 6259999, 'application/pdf', '2026-06-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'diii/RAČUNI/Račun 05-2026 · maj.pdf', 9248440, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'diii/RAČUNI/Račun 04-2026 · april.pdf', 4959764, 'application/pdf', '2026-04-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'diii/RAČUNI/Račun 03-2026 · marec.pdf', 7696548, 'application/pdf', '2026-03-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'diii/RAČUNI/Račun 02-2026 · februar.pdf', 8304722, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'diii/RAČUNI/Račun 01-2026 · januar.pdf', 5190451, 'application/pdf', '2026-01-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'diii/RAČUNI/Letni obračun stroškov 2025.pdf', 10485760, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'diii/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3323986, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'diii/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1992294, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'diii/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1384120, 'application/pdf', '2026-07-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'diii/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1132462, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'diii/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1111491, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'diii'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'drapsinova-3d/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 293601, 'application/pdf', '2026-06-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'drapsinova-3d/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 566231, 'application/pdf', '2026-06-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'drapsinova-3d/GASILNIKI/Popis gasilnikov po etažah.xlsx', 555745, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'drapsinova-3d/RAČUNI/Račun 07-2026 · julij.pdf', 27032289, 'application/pdf', '2026-07-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'drapsinova-3d/RAČUNI/Račun 06-2026 · junij.pdf', 14512292, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'drapsinova-3d/RAČUNI/Račun 05-2026 · maj.pdf', 21202207, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'drapsinova-3d/RAČUNI/Račun 04-2026 · april.pdf', 31446794, 'application/pdf', '2026-04-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'drapsinova-3d/RAČUNI/Račun 03-2026 · marec.pdf', 16703816, 'application/pdf', '2026-03-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'drapsinova-3d/RAČUNI/Račun 02-2026 · februar.pdf', 17133732, 'application/pdf', '2026-02-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'drapsinova-3d/RAČUNI/Račun 01-2026 · januar.pdf', 14155776, 'application/pdf', '2026-01-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'drapsinova-3d/RAČUNI/Letni obračun stroškov 2025.pdf', 18245222, 'application/pdf', '2026-02-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'drapsinova-3d/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1436549, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'drapsinova-3d/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1709179, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'drapsinova-3d/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1709179, 'application/pdf', '2026-06-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'drapsinova-3d/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1447035, 'application/pdf', '2026-06-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'drapsinova-3d/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1205862, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'drapsinova-3d'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'vila-blok-medlog-2/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1258291, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'vila-blok-medlog-2/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 3145728, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'vila-blok-medlog-2/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1572864, 'application/pdf', '2026-05-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 07-2026 · julij.pdf', 12970885, 'application/pdf', '2026-07-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 06-2026 · junij.pdf', 11817452, 'application/pdf', '2026-06-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 05-2026 · maj.pdf', 15099494, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 04-2026 · april.pdf', 8692695, 'application/pdf', '2026-04-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 03-2026 · marec.pdf', 23844618, 'application/pdf', '2026-03-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 02-2026 · februar.pdf', 22722642, 'application/pdf', '2026-02-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'vila-blok-medlog-2/RAČUNI/Račun 01-2026 · januar.pdf', 19985859, 'application/pdf', '2026-01-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'vila-blok-medlog-2/RAČUNI/Letni obračun stroškov 2025.pdf', 12194939, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'vila-blok-medlog-2/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 734003, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'vila-blok-medlog-2/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 471859, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'vila-blok-medlog-2/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1908408, 'application/pdf', '2026-06-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'vila-blok-medlog-2/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1845494, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'vila-blok-medlog-2/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1163919, 'application/pdf', '2026-05-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vila-blok-medlog-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'vila-blok-medlog-1/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1384120, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'vila-blok-medlog-1/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2233467, 'application/pdf', '2026-05-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'vila-blok-medlog-1/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1321206, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 07-2026 · julij.pdf', 4561306, 'application/pdf', '2026-07-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 06-2026 · junij.pdf', 11534336, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 05-2026 · maj.pdf', 11324621, 'application/pdf', '2026-05-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 04-2026 · april.pdf', 9059697, 'application/pdf', '2026-04-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 03-2026 · marec.pdf', 7340032, 'application/pdf', '2026-03-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 02-2026 · februar.pdf', 10684989, 'application/pdf', '2026-02-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'vila-blok-medlog-1/RAČUNI/Račun 01-2026 · januar.pdf', 13065257, 'application/pdf', '2026-01-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'vila-blok-medlog-1/RAČUNI/Letni obračun stroškov 2025.pdf', 7707034, 'application/pdf', '2026-02-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'vila-blok-medlog-1/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1394606, 'application/pdf', '2026-07-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'vila-blok-medlog-1/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2317353, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'vila-blok-medlog-1/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 692060, 'application/pdf', '2026-06-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'vila-blok-medlog-1/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 524288, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'vila-blok-medlog-1/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 744489, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'vila-blok-medlog-1'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'razgledna-2/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 524288, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'razgledna-2/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 398459, 'application/pdf', '2026-06-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'razgledna-2/GASILNIKI/Popis gasilnikov po etažah.xlsx', 534774, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'razgledna-2/RAČUNI/Račun 07-2026 · julij.pdf', 13673431, 'application/pdf', '2026-07-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'razgledna-2/RAČUNI/Račun 06-2026 · junij.pdf', 10905190, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'razgledna-2/RAČUNI/Račun 05-2026 · maj.pdf', 12771656, 'application/pdf', '2026-05-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'razgledna-2/RAČUNI/Račun 04-2026 · april.pdf', 26203914, 'application/pdf', '2026-04-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'razgledna-2/RAČUNI/Račun 03-2026 · marec.pdf', 15277752, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'razgledna-2/RAČUNI/Račun 02-2026 · februar.pdf', 25658655, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'razgledna-2/RAČUNI/Račun 01-2026 · januar.pdf', 28573696, 'application/pdf', '2026-01-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'razgledna-2/RAČUNI/Letni obračun stroškov 2025.pdf', 19996344, 'application/pdf', '2026-02-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'razgledna-2/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1027604, 'application/pdf', '2023-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'razgledna-2/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1447035, 'application/pdf', '2023-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'razgledna-2/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1929380, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'razgledna-2/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 2149581, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'razgledna-2/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 2663383, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'razgledna-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'savinjsko-nabrezje/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 262144, 'application/pdf', '2026-05-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'savinjsko-nabrezje/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 251658, 'application/pdf', '2026-04-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'savinjsko-nabrezje/GASILNIKI/Popis gasilnikov po etažah.xlsx', 230687, 'application/pdf', '2026-04-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 07-2026 · julij.pdf', 11911823, 'application/pdf', '2026-07-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 06-2026 · junij.pdf', 15351153, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 05-2026 · maj.pdf', 11869880, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 04-2026 · april.pdf', 13851689, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 03-2026 · marec.pdf', 16315843, 'application/pdf', '2026-03-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 02-2026 · februar.pdf', 15246295, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'savinjsko-nabrezje/RAČUNI/Račun 01-2026 · januar.pdf', 5578424, 'application/pdf', '2026-01-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'savinjsko-nabrezje/RAČUNI/Letni obračun stroškov 2025.pdf', 11062477, 'application/pdf', '2026-02-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'savinjsko-nabrezje/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1782579, 'application/pdf', '2026-06-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'savinjsko-nabrezje/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1080033, 'application/pdf', '2026-06-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'savinjsko-nabrezje/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 178258, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'savinjsko-nabrezje/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 241172, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'savinjsko-nabrezje/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 304087, 'application/pdf', '2026-05-26'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'savinjsko-nabrezje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'lenart-2/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1216348, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'lenart-2/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1614807, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'lenart-2/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1562378, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'lenart-2/RAČUNI/Račun 07-2026 · julij.pdf', 12593398, 'application/pdf', '2026-07-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'lenart-2/RAČUNI/Račun 06-2026 · junij.pdf', 15686697, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'lenart-2/RAČUNI/Račun 05-2026 · maj.pdf', 11817452, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'lenart-2/RAČUNI/Račun 04-2026 · april.pdf', 22544384, 'application/pdf', '2026-04-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'lenart-2/RAČUNI/Račun 03-2026 · marec.pdf', 26591887, 'application/pdf', '2026-03-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'lenart-2/RAČUNI/Račun 02-2026 · februar.pdf', 23551017, 'application/pdf', '2026-02-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'lenart-2/RAČUNI/Račun 01-2026 · januar.pdf', 22775071, 'application/pdf', '2026-01-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'lenart-2/RAČUNI/Letni obračun stroškov 2025.pdf', 24872223, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'lenart-2/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3512730, 'application/pdf', '2026-06-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'lenart-2/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 3313500, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'lenart-2/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 2474639, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'lenart-2/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 2107638, 'application/pdf', '2026-06-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'lenart-2/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 880804, 'application/pdf', '2026-05-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'lenart-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'gosposka-2/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1153434, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'gosposka-2/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2275410, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'gosposka-2/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2474639, 'application/pdf', '2026-05-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'gosposka-2/RAČUNI/Račun 07-2026 · julij.pdf', 16116613, 'application/pdf', '2026-07-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'gosposka-2/RAČUNI/Račun 06-2026 · junij.pdf', 15550382, 'application/pdf', '2026-06-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'gosposka-2/RAČUNI/Račun 05-2026 · maj.pdf', 7906263, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'gosposka-2/RAČUNI/Račun 04-2026 · april.pdf', 18821939, 'application/pdf', '2026-04-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'gosposka-2/RAČUNI/Račun 03-2026 · marec.pdf', 18895340, 'application/pdf', '2026-03-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'gosposka-2/RAČUNI/Račun 02-2026 · februar.pdf', 21212692, 'application/pdf', '2026-02-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'gosposka-2/RAČUNI/Račun 01-2026 · januar.pdf', 18475909, 'application/pdf', '2026-01-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'gosposka-2/RAČUNI/Letni obračun stroškov 2025.pdf', 18412995, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'gosposka-2/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 2222981, 'application/pdf', '2026-07-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'gosposka-2/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2642412, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'gosposka-2/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1960837, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'gosposka-2/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1835008, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'gosposka-2/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 2128609, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'gosposka-2'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-stepansko-naselje/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1457521, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-stepansko-naselje/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 964690, 'application/pdf', '2026-05-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-stepansko-naselje/GASILNIKI/Popis gasilnikov po etažah.xlsx', 744489, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 07-2026 · julij.pdf', 10202644, 'application/pdf', '2026-07-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 06-2026 · junij.pdf', 20457718, 'application/pdf', '2026-06-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 05-2026 · maj.pdf', 11051991, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 04-2026 · april.pdf', 11345592, 'application/pdf', '2026-04-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 03-2026 · marec.pdf', 21265121, 'application/pdf', '2026-03-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 02-2026 · februar.pdf', 14763950, 'application/pdf', '2026-02-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-stepansko-naselje/RAČUNI/Račun 01-2026 · januar.pdf', 7769948, 'application/pdf', '2026-01-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-stepansko-naselje/RAČUNI/Letni obračun stroškov 2025.pdf', 19734200, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-stepansko-naselje/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 3942646, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-stepansko-naselje/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 2862612, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-stepansko-naselje/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 933233, 'application/pdf', '2026-05-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-stepansko-naselje/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 880804, 'application/pdf', '2026-04-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-stepansko-naselje/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1101005, 'application/pdf', '2026-04-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-stepansko-naselje'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-vrhnika/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 272630, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-vrhnika/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 209715, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-vrhnika/GASILNIKI/Popis gasilnikov po etažah.xlsx', 272630, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-vrhnika/RAČUNI/Račun 07-2026 · julij.pdf', 21674066, 'application/pdf', '2026-07-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-vrhnika/RAČUNI/Račun 06-2026 · junij.pdf', 13201572, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-vrhnika/RAČUNI/Račun 05-2026 · maj.pdf', 22208840, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-vrhnika/RAČUNI/Račun 04-2026 · april.pdf', 8598323, 'application/pdf', '2026-04-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-vrhnika/RAČUNI/Račun 03-2026 · marec.pdf', 12803113, 'application/pdf', '2026-03-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-vrhnika/RAČUNI/Račun 02-2026 · februar.pdf', 12257853, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-vrhnika/RAČUNI/Račun 01-2026 · januar.pdf', 20698890, 'application/pdf', '2026-01-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-vrhnika/RAČUNI/Letni obračun stroškov 2025.pdf', 7927235, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-vrhnika/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1363149, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-vrhnika/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 964690, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-vrhnika/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 734003, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-vrhnika/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1719665, 'application/pdf', '2026-06-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-vrhnika/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1415578, 'application/pdf', '2026-05-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-vrhnika'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-ribnica/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 2181038, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-ribnica/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2747269, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-ribnica/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1468006, 'application/pdf', '2026-05-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-ribnica/RAČUNI/Račun 07-2026 · julij.pdf', 8682209, 'application/pdf', '2026-07-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-ribnica/RAČUNI/Račun 06-2026 · junij.pdf', 19346227, 'application/pdf', '2026-06-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-ribnica/RAČUNI/Račun 05-2026 · maj.pdf', 20227031, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-ribnica/RAČUNI/Račun 04-2026 · april.pdf', 10968105, 'application/pdf', '2026-04-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-ribnica/RAČUNI/Račun 03-2026 · marec.pdf', 21684552, 'application/pdf', '2026-03-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-ribnica/RAČUNI/Račun 02-2026 · februar.pdf', 11156849, 'application/pdf', '2026-02-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-ribnica/RAČUNI/Račun 01-2026 · januar.pdf', 23509074, 'application/pdf', '2026-01-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-ribnica/RAČUNI/Letni obračun stroškov 2025.pdf', 18979226, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-ribnica/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1163919, 'application/pdf', '2026-05-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-ribnica/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1478492, 'application/pdf', '2026-05-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-ribnica/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 566231, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-ribnica/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 304087, 'application/pdf', '2026-05-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-ribnica/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 608174, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-ribnica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-postojna/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1845494, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-postojna/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2118124, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-postojna/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2401239, 'application/pdf', '2026-05-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-postojna/RAČUNI/Račun 07-2026 · julij.pdf', 7780434, 'application/pdf', '2026-07-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-postojna/RAČUNI/Račun 06-2026 · junij.pdf', 7486833, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-postojna/RAČUNI/Račun 05-2026 · maj.pdf', 7046431, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-postojna/RAČUNI/Račun 04-2026 · april.pdf', 5630853, 'application/pdf', '2026-04-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-postojna/RAČUNI/Račun 03-2026 · marec.pdf', 5809111, 'application/pdf', '2026-03-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-postojna/RAČUNI/Račun 02-2026 · februar.pdf', 5400166, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-postojna/RAČUNI/Račun 01-2026 · januar.pdf', 5305795, 'application/pdf', '2026-01-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-postojna/RAČUNI/Letni obračun stroškov 2025.pdf', 5295309, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-postojna/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1247805, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-postojna/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1059062, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-postojna/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 996147, 'application/pdf', '2026-07-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-postojna/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1426063, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-postojna/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1373635, 'application/pdf', '2026-06-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-postojna'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-pivka/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 545260, 'application/pdf', '2026-06-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-pivka/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 534774, 'application/pdf', '2026-06-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-pivka/GASILNIKI/Popis gasilnikov po etažah.xlsx', 398459, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-pivka/RAČUNI/Račun 07-2026 · julij.pdf', 25983713, 'application/pdf', '2026-07-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-pivka/RAČUNI/Račun 06-2026 · junij.pdf', 11041505, 'application/pdf', '2026-06-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-pivka/RAČUNI/Račun 05-2026 · maj.pdf', 22345155, 'application/pdf', '2026-05-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-pivka/RAČUNI/Račun 04-2026 · april.pdf', 18507366, 'application/pdf', '2026-04-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-pivka/RAČUNI/Račun 03-2026 · marec.pdf', 16829645, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-pivka/RAČUNI/Račun 02-2026 · februar.pdf', 16819159, 'application/pdf', '2026-02-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-pivka/RAČUNI/Račun 01-2026 · januar.pdf', 20982006, 'application/pdf', '2026-01-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-pivka/RAČUNI/Letni obračun stroškov 2025.pdf', 15078523, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-pivka/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 660603, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-pivka/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 734003, 'application/pdf', '2026-05-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-pivka/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1646264, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-pivka/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1845494, 'application/pdf', '2026-05-30'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-pivka/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 2296381, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-pivka'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-trzin/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1352663, 'application/pdf', '2026-06-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-trzin/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1080033, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-trzin/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1761608, 'application/pdf', '2026-05-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-trzin/RAČUNI/Račun 07-2026 · julij.pdf', 7801405, 'application/pdf', '2026-07-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-trzin/RAČUNI/Račun 06-2026 · junij.pdf', 7811891, 'application/pdf', '2026-06-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-trzin/RAČUNI/Račun 05-2026 · maj.pdf', 12352225, 'application/pdf', '2026-05-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-trzin/RAČUNI/Račun 04-2026 · april.pdf', 5819597, 'application/pdf', '2026-04-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-trzin/RAČUNI/Račun 03-2026 · marec.pdf', 7098860, 'application/pdf', '2026-03-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-trzin/RAČUNI/Račun 02-2026 · februar.pdf', 8944353, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-trzin/RAČUNI/Račun 01-2026 · januar.pdf', 7518290, 'application/pdf', '2026-01-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-trzin/RAČUNI/Letni obračun stroškov 2025.pdf', 11093934, 'application/pdf', '2026-02-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-trzin/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 2202010, 'application/pdf', '2026-06-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-trzin/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1520435, 'application/pdf', '2026-05-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-trzin/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 387973, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-trzin/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 587203, 'application/pdf', '2026-05-08'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-trzin/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 775946, 'application/pdf', '2026-05-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-trzin'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-zaloska/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1048576, 'application/pdf', '2026-06-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-zaloska/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1698693, 'application/pdf', '2026-06-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-zaloska/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2736783, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-zaloska/RAČUNI/Račun 07-2026 · julij.pdf', 14365491, 'application/pdf', '2026-07-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-zaloska/RAČUNI/Račun 06-2026 · junij.pdf', 11932795, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-zaloska/RAČUNI/Račun 05-2026 · maj.pdf', 13295944, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-zaloska/RAČUNI/Račun 04-2026 · april.pdf', 14271119, 'application/pdf', '2026-04-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-zaloska/RAČUNI/Račun 03-2026 · marec.pdf', 12750684, 'application/pdf', '2026-03-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-zaloska/RAČUNI/Račun 02-2026 · februar.pdf', 6826230, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-zaloska/RAČUNI/Račun 01-2026 · januar.pdf', 14564721, 'application/pdf', '2026-01-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-zaloska/RAČUNI/Letni obračun stroškov 2025.pdf', 10297016, 'application/pdf', '2026-02-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-zaloska/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 671089, 'application/pdf', '2026-06-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-zaloska/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1038090, 'application/pdf', '2026-05-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-zaloska/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1342177, 'application/pdf', '2026-05-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-zaloska/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1551892, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-zaloska/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1677722, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-zaloska'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'tpc-radovljica/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1289748, 'application/pdf', '2026-07-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'tpc-radovljica/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1006633, 'application/pdf', '2026-06-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'tpc-radovljica/GASILNIKI/Popis gasilnikov po etažah.xlsx', 534774, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'tpc-radovljica/RAČUNI/Račun 07-2026 · julij.pdf', 8241807, 'application/pdf', '2026-07-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'tpc-radovljica/RAČUNI/Račun 06-2026 · junij.pdf', 4676649, 'application/pdf', '2026-06-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'tpc-radovljica/RAČUNI/Račun 05-2026 · maj.pdf', 4771021, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'tpc-radovljica/RAČUNI/Račun 04-2026 · april.pdf', 4739564, 'application/pdf', '2026-04-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'tpc-radovljica/RAČUNI/Račun 03-2026 · marec.pdf', 3837788, 'application/pdf', '2026-03-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'tpc-radovljica/RAČUNI/Račun 02-2026 · februar.pdf', 7654605, 'application/pdf', '2026-02-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'tpc-radovljica/RAČUNI/Račun 01-2026 · januar.pdf', 6941573, 'application/pdf', '2026-01-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'tpc-radovljica/RAČUNI/Letni obračun stroškov 2025.pdf', 7067402, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'tpc-radovljica/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1300234, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'tpc-radovljica/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1478492, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'tpc-radovljica/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 2369782, 'application/pdf', '2026-05-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'tpc-radovljica/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1447035, 'application/pdf', '2026-05-02'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'tpc-radovljica/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1069548, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'tpc-radovljica'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-vrhovci/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1268777, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-vrhovci/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1520435, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-vrhovci/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2610954, 'application/pdf', '2026-05-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-vrhovci/RAČUNI/Račun 07-2026 · julij.pdf', 18329108, 'application/pdf', '2026-07-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-vrhovci/RAČUNI/Račun 06-2026 · junij.pdf', 22942843, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-vrhovci/RAČUNI/Račun 05-2026 · maj.pdf', 20992492, 'application/pdf', '2026-05-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-vrhovci/RAČUNI/Račun 04-2026 · april.pdf', 19472056, 'application/pdf', '2026-04-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-vrhovci/RAČUNI/Račun 03-2026 · marec.pdf', 23498588, 'application/pdf', '2026-03-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-vrhovci/RAČUNI/Račun 02-2026 · februar.pdf', 15927869, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-vrhovci/RAČUNI/Račun 01-2026 · januar.pdf', 15854469, 'application/pdf', '2026-01-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-vrhovci/RAČUNI/Letni obračun stroškov 2025.pdf', 21894267, 'application/pdf', '2026-02-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-vrhovci/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1897923, 'application/pdf', '2026-06-26'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-vrhovci/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 849347, 'application/pdf', '2026-05-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-vrhovci/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 639631, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-vrhovci/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1237320, 'application/pdf', '2026-05-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-vrhovci/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 566231, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-vrhovci'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-slovenceva/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1646264, 'application/pdf', '2026-05-27'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-slovenceva/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1289748, 'application/pdf', '2026-05-29'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-slovenceva/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1551892, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-slovenceva/RAČUNI/Račun 07-2026 · julij.pdf', 11639194, 'application/pdf', '2026-07-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-slovenceva/RAČUNI/Račun 06-2026 · junij.pdf', 7056916, 'application/pdf', '2026-06-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-slovenceva/RAČUNI/Račun 05-2026 · maj.pdf', 11586765, 'application/pdf', '2026-05-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-slovenceva/RAČUNI/Račun 04-2026 · april.pdf', 8315208, 'application/pdf', '2026-04-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-slovenceva/RAČUNI/Račun 03-2026 · marec.pdf', 8808038, 'application/pdf', '2026-03-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-slovenceva/RAČUNI/Račun 02-2026 · februar.pdf', 11471421, 'application/pdf', '2026-02-10'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-slovenceva/RAČUNI/Račun 01-2026 · januar.pdf', 7224689, 'application/pdf', '2026-01-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-slovenceva/RAČUNI/Letni obračun stroškov 2025.pdf', 4414505, 'application/pdf', '2026-02-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-slovenceva/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 692060, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-slovenceva/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 828375, 'application/pdf', '2026-05-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-slovenceva/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1530921, 'application/pdf', '2026-06-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-slovenceva/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 713032, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-slovenceva/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 618660, 'application/pdf', '2026-06-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-slovenceva'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-planina/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1793065, 'application/pdf', '2026-05-31'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-planina/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2076180, 'application/pdf', '2026-05-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-planina/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1195377, 'application/pdf', '2026-04-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-planina/RAČUNI/Račun 07-2026 · julij.pdf', 4886364, 'application/pdf', '2026-07-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-planina/RAČUNI/Račun 06-2026 · junij.pdf', 6847201, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-planina/RAČUNI/Račun 05-2026 · maj.pdf', 8053064, 'application/pdf', '2026-05-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-planina/RAČUNI/Račun 04-2026 · april.pdf', 4645192, 'application/pdf', '2026-04-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-planina/RAČUNI/Račun 03-2026 · marec.pdf', 5452595, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-planina/RAČUNI/Račun 02-2026 · februar.pdf', 9059697, 'application/pdf', '2026-02-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-planina/RAČUNI/Račun 01-2026 · januar.pdf', 8944353, 'application/pdf', '2026-01-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-planina/RAČUNI/Letni obračun stroškov 2025.pdf', 5410652, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-planina/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 576717, 'application/pdf', '2026-06-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-planina/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 859832, 'application/pdf', '2026-05-07'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-planina/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1604321, 'application/pdf', '2026-06-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-planina/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 849347, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-planina/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1488978, 'application/pdf', '2026-04-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-planina'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-pecnik/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1059062, 'application/pdf', '2026-06-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-pecnik/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 1614807, 'application/pdf', '2026-05-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-pecnik/GASILNIKI/Popis gasilnikov po etažah.xlsx', 1635779, 'application/pdf', '2026-05-13'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-pecnik/RAČUNI/Račun 07-2026 · julij.pdf', 10905190, 'application/pdf', '2026-07-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-pecnik/RAČUNI/Račun 06-2026 · junij.pdf', 22303212, 'application/pdf', '2026-06-19'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-pecnik/RAČUNI/Račun 05-2026 · maj.pdf', 13463716, 'application/pdf', '2026-05-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-pecnik/RAČUNI/Račun 04-2026 · april.pdf', 11198792, 'application/pdf', '2026-04-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-pecnik/RAČUNI/Račun 03-2026 · marec.pdf', 10884219, 'application/pdf', '2026-03-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-pecnik/RAČUNI/Račun 02-2026 · februar.pdf', 11366564, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-pecnik/RAČUNI/Račun 01-2026 · januar.pdf', 12383683, 'application/pdf', '2026-01-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-pecnik/RAČUNI/Letni obračun stroškov 2025.pdf', 9248440, 'application/pdf', '2026-02-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-pecnik/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 639631, 'application/pdf', '2026-07-11'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-pecnik/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 985661, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-pecnik/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 1226834, 'application/pdf', '2026-06-26'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-pecnik/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 1730150, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-pecnik/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 1960837, 'application/pdf', '2026-05-03'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-pecnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'spar-babnik/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 702546, 'application/pdf', '2026-06-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'spar-babnik/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 796918, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'spar-babnik/GASILNIKI/Popis gasilnikov po etažah.xlsx', 440402, 'application/pdf', '2026-05-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'spar-babnik/RAČUNI/Račun 07-2026 · julij.pdf', 7203717, 'application/pdf', '2026-07-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'spar-babnik/RAČUNI/Račun 06-2026 · junij.pdf', 5389681, 'application/pdf', '2026-06-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'spar-babnik/RAČUNI/Račun 05-2026 · maj.pdf', 4414505, 'application/pdf', '2026-05-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'spar-babnik/RAČUNI/Račun 04-2026 · april.pdf', 7612662, 'application/pdf', '2026-04-17'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'spar-babnik/RAČUNI/Račun 03-2026 · marec.pdf', 4362076, 'application/pdf', '2026-03-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'spar-babnik/RAČUNI/Račun 02-2026 · februar.pdf', 4791992, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'spar-babnik/RAČUNI/Račun 01-2026 · januar.pdf', 3355443, 'application/pdf', '2026-01-06'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'spar-babnik/RAČUNI/Letni obračun stroškov 2025.pdf', 5473567, 'application/pdf', '2026-02-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'spar-babnik/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 1153434, 'application/pdf', '2026-05-05'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'spar-babnik/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 1090519, 'application/pdf', '2026-04-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'spar-babnik/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 765460, 'application/pdf', '2026-06-01'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'spar-babnik/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 629146, 'application/pdf', '2026-05-23'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'spar-babnik/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 408945, 'application/pdf', '2026-05-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'spar-babnik'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Servisni zapisnik gasilnikov 2026.pdf', 'rc/GASILNIKI/Servisni zapisnik gasilnikov 2026.pdf', 1342177, 'application/pdf', '2026-06-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Pregled gasilnih aparatov 2025.pdf', 'rc/GASILNIKI/Pregled gasilnih aparatov 2025.pdf', 2600468, 'application/pdf', '2026-05-28'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Popis gasilnikov po etažah.xlsx', 'rc/GASILNIKI/Popis gasilnikov po etažah.xlsx', 2642412, 'application/pdf', '2026-05-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'GASILNIKI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 07-2026 · julij.pdf', 'rc/RAČUNI/Račun 07-2026 · julij.pdf', 5326766, 'application/pdf', '2026-07-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 06-2026 · junij.pdf', 'rc/RAČUNI/Račun 06-2026 · junij.pdf', 8105492, 'application/pdf', '2026-06-20'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 05-2026 · maj.pdf', 'rc/RAČUNI/Račun 05-2026 · maj.pdf', 5106565, 'application/pdf', '2026-05-16'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 04-2026 · april.pdf', 'rc/RAČUNI/Račun 04-2026 · april.pdf', 4991222, 'application/pdf', '2026-04-18'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 03-2026 · marec.pdf', 'rc/RAČUNI/Račun 03-2026 · marec.pdf', 10674504, 'application/pdf', '2026-03-21'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 02-2026 · februar.pdf', 'rc/RAČUNI/Račun 02-2026 · februar.pdf', 9500099, 'application/pdf', '2026-02-15'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Račun 01-2026 · januar.pdf', 'rc/RAČUNI/Račun 01-2026 · januar.pdf', 5295309, 'application/pdf', '2026-01-04'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Letni obračun stroškov 2025.pdf', 'rc/RAČUNI/Letni obračun stroškov 2025.pdf', 6448742, 'application/pdf', '2026-02-14'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'RAČUNI'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Meritve strelovodne napeljave.pdf', 'rc/STRELOVODNE NAPRAVE/Meritve strelovodne napeljave.pdf', 639631, 'application/pdf', '2026-05-22'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Poročilo o pregledu strelovodov.pdf', 'rc/STRELOVODNE NAPRAVE/Poročilo o pregledu strelovodov.pdf', 356516, 'application/pdf', '2026-04-25'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'STRELOVODNE NAPRAVE'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Zavarovalna polica 2026.pdf', 'rc/ZAVAROVALNE POLICE/Zavarovalna polica 2026.pdf', 492831, 'application/pdf', '2026-06-09'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Splošni pogoji zavarovanja.pdf', 'rc/ZAVAROVALNE POLICE/Splošni pogoji zavarovanja.pdf', 167772, 'application/pdf', '2026-05-12'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
insert into public.documents (building_id, folder_id, name, storage_path, size_bytes, mime_type, created_at)
  select b.id, fo.id, 'Dodatek k polici 2026.pdf', 'rc/ZAVAROVALNE POLICE/Dodatek k polici 2026.pdf', 367002, 'application/pdf', '2026-04-24'::timestamptz
  from public.buildings b join public.folders fo on fo.building_id = b.id and fo.name = 'ZAVAROVALNE POLICE'
  where b.slug = 'rc'
  on conflict (storage_path) do nothing;
commit;
