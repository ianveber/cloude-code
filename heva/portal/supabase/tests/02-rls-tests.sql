-- =====================================================================
-- Adversarial RLS tests for the Arhiv Heva schema.
-- Every check raises on failure; psql runs with ON_ERROR_STOP=1, so a
-- nonzero exit means the isolation model is broken.
-- =====================================================================

\set MGR   '''11111111-1111-1111-1111-111111111111'''
\set RES_A '''22222222-2222-2222-2222-222222222222'''

-- --- fixtures (as superuser; RLS not in play here) -------------------

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'damijan@heva.si'),
  ('22222222-2222-2222-2222-222222222222', 'resident.a@example.com'),
  ('33333333-3333-3333-3333-333333333333', 'resident.b@example.com');

update public.profiles set role = 'manager' where email = 'damijan@heva.si';

insert into public.buildings (id, name, slug) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'OBJEKT A', 'obj-a'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'OBJEKT B', 'obj-b');

insert into public.folders (id, building_id, name) values
  ('ffff0001-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'RAČUNI A'),
  ('ffff0002-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 'RAČUNI B');

insert into public.documents (building_id, folder_id, name, storage_path) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'ffff0001-0000-0000-0000-000000000001', 'a.pdf',
   'aaaaaaaa-0000-0000-0000-000000000001/a.pdf'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', 'b.pdf',
   'bbbbbbbb-0000-0000-0000-000000000002/b.pdf');

insert into storage.objects (bucket_id, name) values
  ('dokumenti', 'aaaaaaaa-0000-0000-0000-000000000001/a.pdf'),
  ('dokumenti', 'bbbbbbbb-0000-0000-0000-000000000002/b.pdf');

-- Resident A belongs to building A only.
insert into public.memberships (user_id, building_id)
values ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001');

\echo '--- fixtures loaded'

-- --- T1: trigger created a profile for every auth user ---------------
do $$
declare n int;
begin
  select count(*) into n from public.profiles;
  if n <> 3 then raise exception 'T1 FAIL: expected 3 profiles, got %', n; end if;
  raise notice 'T1 pass: handle_new_user created % profiles', n;
end $$;

-- --- T2: pending_memberships convert on first login ------------------
insert into public.pending_memberships (email, building_id)
values ('NewOwner@Example.com', 'bbbbbbbb-0000-0000-0000-000000000002');

insert into auth.users (id, email)
values ('44444444-4444-4444-4444-444444444444', 'newowner@example.com');

do $$
declare n_mem int; n_pend int;
begin
  select count(*) into n_mem from public.memberships
   where user_id = '44444444-4444-4444-4444-444444444444';
  select count(*) into n_pend from public.pending_memberships
   where lower(email) = 'newowner@example.com';
  if n_mem <> 1 then raise exception 'T2 FAIL: pending did not convert (% memberships)', n_mem; end if;
  if n_pend <> 0 then raise exception 'T2 FAIL: pending row not consumed'; end if;
  raise notice 'T2 pass: case-insensitive pending membership converted and consumed';
end $$;

-- --- T3: resident sees ONLY their own building -----------------------
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare nb int; nd int; nf int;
  begin
    select count(*) into nb from public.buildings;
    select count(*) into nd from public.documents;
    select count(*) into nf from public.folders;
    if nb <> 1 then raise exception 'T3 FAIL: resident saw % buildings, expected 1', nb; end if;
    if nd <> 1 then raise exception 'T3 FAIL: resident saw % documents, expected 1', nd; end if;
    if nf <> 1 then raise exception 'T3 FAIL: resident saw % folders, expected 1', nf; end if;
    if (select name from public.documents) <> 'a.pdf' then
      raise exception 'T3 FAIL: resident saw the WRONG building''s document';
    end if;
    raise notice 'T3 pass: cross-building read blocked (1 building, 1 folder, 1 doc)';
  end $$;
rollback;

-- --- T4: resident cannot escalate to manager -------------------------
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare blocked boolean := false; n int;
  begin
    begin
      update public.profiles set role = 'manager'
       where id = '22222222-2222-2222-2222-222222222222';
      get diagnostics n = row_count;
      if n = 0 then blocked := true; end if;
    exception when others then
      blocked := true;
    end;
    if not blocked then raise exception 'T4 FAIL: resident PROMOTED THEMSELVES to manager'; end if;
    raise notice 'T4 pass: self-promotion to manager refused';
  end $$;
rollback;

-- --- T5: resident cannot read the invite list or the audit trail -----
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare n int;
  begin
    select count(*) into n from public.pending_memberships;
    if n <> 0 then raise exception 'T5 FAIL: resident enumerated % invite rows', n; end if;
    select count(*) into n from public.access_log;
    if n <> 0 then raise exception 'T5 FAIL: resident read the audit log'; end if;
    raise notice 'T5 pass: invites and audit log invisible to residents';
  end $$;
rollback;

-- --- T6: resident cannot write documents (v1 is read-only) -----------
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare blocked boolean := false;
  begin
    begin
      insert into public.documents (building_id, name, storage_path)
      values ('aaaaaaaa-0000-0000-0000-000000000001', 'evil.pdf', 'x/evil.pdf');
    exception when others then blocked := true;
    end;
    if not blocked then raise exception 'T6 FAIL: resident uploaded a document'; end if;
    raise notice 'T6 pass: resident write to documents refused';
  end $$;
rollback;

-- --- T7: audit rows cannot be forged for another user or building ----
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare blocked_user boolean := false; blocked_bldg boolean := false;
  begin
    begin  -- pretend to be someone else
      insert into public.access_log (user_id, building_id, action)
      values ('11111111-1111-1111-1111-111111111111',
              'aaaaaaaa-0000-0000-0000-000000000001', 'view');
    exception when others then blocked_user := true;
    end;
    begin  -- log against a building they cannot read
      insert into public.access_log (user_id, building_id, action)
      values ('22222222-2222-2222-2222-222222222222',
              'bbbbbbbb-0000-0000-0000-000000000002', 'view');
    exception when others then blocked_bldg := true;
    end;
    if not blocked_user then raise exception 'T7 FAIL: forged audit row for another user'; end if;
    if not blocked_bldg then raise exception 'T7 FAIL: logged access to a foreign building'; end if;
    raise notice 'T7 pass: audit log cannot be forged';
  end $$;
rollback;

-- --- T8: storage objects gated by the same membership check ----------
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare n int; nm text;
  begin
    select count(*) into n from storage.objects;
    if n <> 1 then raise exception 'T8 FAIL: resident saw % storage objects, expected 1', n; end if;
    select name into nm from storage.objects;
    if nm not like 'aaaaaaaa%' then raise exception 'T8 FAIL: resident reached foreign file %', nm; end if;
    raise notice 'T8 pass: direct storage read gated by building membership';
  end $$;
rollback;

-- --- T9: manager sees everything -------------------------------------
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
  do $$
  declare nb int; nd int; np int;
  begin
    select count(*) into nb from public.buildings;
    select count(*) into nd from public.documents;
    select count(*) into np from public.profiles;
    if nb <> 2 then raise exception 'T9 FAIL: manager saw % buildings, expected 2', nb; end if;
    if nd <> 2 then raise exception 'T9 FAIL: manager saw % documents, expected 2', nd; end if;
    if np <> 4 then raise exception 'T9 FAIL: manager saw % profiles, expected 4', np; end if;
    raise notice 'T9 pass: manager sees all buildings, documents and profiles';
  end $$;
rollback;

-- --- T10: an authenticated stranger with no memberships sees nothing --
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
  do $$
  declare nb int; nd int;
  begin
    select count(*) into nb from public.buildings;
    select count(*) into nd from public.documents;
    if nb <> 0 or nd <> 0 then
      raise exception 'T10 FAIL: unaffiliated user saw % buildings / % docs', nb, nd;
    end if;
    raise notice 'T10 pass: fails closed — unknown account sees nothing';
  end $$;
rollback;

-- T11: a BENIGN self-update must SUCCEED. If this fails too, then T4's
-- "blocked" was just a missing grant, not the WITH CHECK doing its job.
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare n int; newname text;
  begin
    update public.profiles set full_name = 'Test Stanovalec'
     where id = '22222222-2222-2222-2222-222222222222';
    get diagnostics n = row_count;
    if n <> 1 then
      raise exception 'T11 FAIL: benign self-update affected % rows -> T4 was a FALSE PASS (grant issue, not policy)', n;
    end if;
    select full_name into newname from public.profiles
     where id = '22222222-2222-2222-2222-222222222222';
    if newname <> 'Test Stanovalec' then raise exception 'T11 FAIL: update did not persist'; end if;
    raise notice 'T11 pass: benign self-update works -> T4 blocked by the role WITH CHECK, not by grants';
  end $$;
rollback;

-- T12: the exact error class on privilege escalation, made visible.
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare msg text; code text;
  begin
    begin
      update public.profiles set role = 'manager'
       where id = '22222222-2222-2222-2222-222222222222';
      raise exception 'T12 FAIL: escalation was NOT refused';
    exception when others then
      get stacked diagnostics msg = message_text, code = returned_sqlstate;
      if code = 'P0001' and msg like 'T12 FAIL%' then raise exception '%', msg; end if;
      raise notice 'T12 pass: escalation refused with SQLSTATE % — %', code, msg;
    end;
  end $$;
rollback;



-- --- T13: helpers are unreachable directly, yet policies still work ----
-- This is the whole point of moving them to `private`. In Supabase the
-- equivalent of a direct call is POST /rest/v1/rpc/<name>; PostgREST only
-- exposes configured schemas, and on top of that `authenticated` has no
-- USAGE on `private`. T3 already proved the policies that call these same
-- functions still evaluate fine.
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  do $$
  declare blocked_a boolean := false; blocked_b boolean := false; n int;
  begin
    begin
      perform private.is_manager();
    exception when others then blocked_a := true;
    end;
    begin
      perform private.can_read_building('bbbbbbbb-0000-0000-0000-000000000002');
    exception when others then blocked_b := true;
    end;
    if not blocked_a then raise exception 'T13 FAIL: authenticated called private.is_manager() directly'; end if;
    if not blocked_b then raise exception 'T13 FAIL: authenticated could probe building membership via can_read_building()'; end if;

    -- ...and the policies that call those very functions still work.
    select count(*) into n from public.documents;
    if n <> 1 then raise exception 'T13 FAIL: locking down the helpers broke RLS (% docs visible)', n; end if;
    raise notice 'T13 pass: helpers unreachable directly, policies still evaluate correctly';
  end $$;
rollback;

\echo '--- ALL 13 RLS TESTS PASSED'
