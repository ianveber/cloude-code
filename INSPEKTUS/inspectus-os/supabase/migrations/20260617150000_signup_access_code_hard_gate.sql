-- ───────────────────────────────────────────────────────────────────────────
-- OPTIONAL hard signup gate — enforce the shared access code INSIDE the DB trigger.
--
-- Why: the app already checks the access code in the signup server action, but the
-- Supabase anon key is public (it ships in the browser), so a technical user could call
-- the GoTrue /signup endpoint directly and skip the app check. Enforcing the code in the
-- trigger makes it a HARD gate that holds even against direct API calls.
--
-- The app already passes the code as user metadata (options.data.access_code), so no app
-- change is needed — just run this. Admin-allowlist emails bypass the code so you can't
-- lock yourself out. To CHANGE the code later, re-run this with a new literal AND update
-- SIGNUP_ACCESS_CODE in Vercel + .env.local (keep them identical, compared case-insensitively).
--
-- Run in Supabase Dashboard → SQL Editor. is_email_allowed() stays open (any domain).
-- ───────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_code     text    := upper(trim(coalesce(new.raw_user_meta_data->>'access_code', '')));
  v_is_admin boolean := lower(new.email) = any (select lower(e) from unnest(public.allowed_emails()) e);
begin
  -- Admins (AIS operators) always get in; everyone else must present the shared code.
  if not v_is_admin and v_code <> upper('INSPEKTUS-7K4Q') then
    raise exception 'Napačna pristopna koda';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when v_is_admin then 'admin' else 'member' end
  );
  return new;
end; $$;
