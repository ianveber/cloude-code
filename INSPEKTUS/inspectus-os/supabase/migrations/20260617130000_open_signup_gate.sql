-- ───────────────────────────────────────────────────────────────────────────
-- Open the signup gate to ANY email address.
--
-- Why: the INSPECTUS team uses mixed email domains (not everyone is @inspectus.si),
-- so the original `like '%@inspectus.si'` gate silently blocked employees — Supabase
-- masks the trigger's raise as a generic "Database error saving new user", which the
-- login screen could only show as "Prijava ni uspela. Poskusi znova."
--
-- This makes `is_email_allowed()` always true, so the `handle_new_user` trigger no
-- longer rejects anyone. Access is then controlled by who has the app URL. Admin role
-- still bootstraps ONLY from `allowed_emails()` (currently ian.veber@gmail.com), so
-- new self-serve accounts come in as 'member', not 'admin'.
--
-- To re-tighten later: replace the body with a domain/allowlist check again, or layer
-- a shared access code at the app level (ask Claude to add it).
-- ───────────────────────────────────────────────────────────────────────────
create or replace function public.is_email_allowed(addr text)
returns boolean language sql immutable as $$
  select true;
$$;
