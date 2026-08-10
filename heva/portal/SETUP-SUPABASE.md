# Arhiv Heva — Supabase

**Status: the database is live and verified.** Set up 2026-07-27.

| | |
|---|---|
| Project | `heva-portal` |
| Ref | `cdmllcscbfrmkvhzidam` |
| Region | `eu-central-1` (Frankfurt) — personal data of Slovenian residents stays in the EU |
| Dashboard | <https://supabase.com/dashboard/project/cdmllcscbfrmkvhzidam> |
| DB password | `~/.heva-db-password` (mode 600) — **move this into your password manager** |
| Keys | `heva/portal/.env.local` (gitignored, mode 600) |

---

## Done

- [x] Project created in the EU region, on the Pro org (no auto-pausing, 100 GB file storage)
- [x] `supabase/schema.sql` applied — 7 tables, RLS on all 7, 23 policies, 4 helper functions, signup trigger, private `dokumenti` bucket
- [x] Helper functions isolated in a `private` schema, unreachable from the REST API
- [x] `supabase db advisors` → **0 findings**
- [x] Cross-building isolation proven **on the live database** (a resident sees 1 building / 1 document, and the correct one). Test data rolled back; the database is empty.
- [x] `.env.local` written with the project URL + publishable key

## Left for you — two things

**1. Reveal the secret key.** The Management API masks it, so I can't fetch it.
Dashboard → **Project Settings → API Keys** → reveal the `secret` key → paste it into
`heva/portal/.env.local` as `SUPABASE_SECRET_KEY`. It bypasses RLS, so it is
server-side only and must never reach the browser.

**2. Close signup.** Dashboard → **Authentication → Sign In / Providers**:
- **Allow new users to sign up** → **OFF**
- **Email** enabled, **Confirm email** ON

This is defence in depth rather than a hole — test T10 proves an unknown account
that authenticates holds zero memberships and sees nothing. But closed signup
means they can't get a session at all.

I deliberately did not push this from the CLI: there's no `config.toml`, and
`supabase config push` would send *every* setting at the project, not just this one.

---

## When your dad first logs in

`profiles.role` defaults to `resident`, and nobody can promote themselves — the
RLS policy refuses it (proven, SQLSTATE 42501). So the first manager is set by hand,
once, after he has signed in at least once:

```sql
update public.profiles
set role = 'manager', full_name = 'Damijan Veber'
where email = 'HIS_EMAIL_HERE';
```

Repeat for any other Heva staff. Everyone else stays a resident.

---

## The security model

- Two roles: **manager** (Heva staff, sees everything) and **resident** (sees only
  buildings they're a member of).
- Access is decided in Postgres, never in the UI. A fully compromised front-end
  still cannot read another building's documents.
- Files sit in a **private** bucket; the app hands out ~60s signed URLs. Nothing
  is served from a public URL — the entire reason to replace Chamilo-over-HTTP.
- Every view/download is written to `access_log`. It's append-only: there is no
  update or delete policy, so the trail cannot be edited.
- **Onboarding is closed by construction.** No invite codes to lose in the post —
  managers import resident emails into `pending_memberships`, and a trigger
  converts them to real memberships on first magic-link login (case-insensitive,
  consuming the pending row). An email nobody imported sees nothing.

### Re-run the proof after any schema change

```bash
cd "heva/portal/supabase" && ./tests/run.sh
```

Spins up a throwaway Postgres in Docker, stubs Supabase's `auth`/`storage` schemas
so `schema.sql` runs unmodified, and asserts 13 properties. Exit code is the verdict.

| | |
|---|---|
| T1–T2 | signup trigger creates the profile; pre-authorised emails convert to memberships and the pending row is consumed |
| **T3** | **a resident sees exactly 1 building / 1 folder / 1 document — never the other building's** |
| T4, T11–T12 | self-promotion to manager refused (SQLSTATE 42501); a benign self-update still succeeds, which proves T4 isn't a false pass from a missing grant |
| T5 | invite list and audit log invisible to residents |
| T6 | residents cannot write documents (v1 is read-only for them) |
| T7 | audit rows cannot be forged for another user or another building |
| T8 | direct storage reads gated by the same membership check as the metadata |
| T9–T10 | managers see everything; an account with no memberships sees **nothing** |
| T13 | the helper functions are unreachable directly, yet the policies that call them still evaluate |

### Two RLS traps already hit — don't reintroduce them

1. **`FORCE ROW LEVEL SECURITY` + `SECURITY DEFINER` helpers = infinite recursion.**
   `is_manager()` reads `profiles`, whose policy calls `is_manager()`; FORCE subjects
   the function owner to RLS too. Use `ENABLE` only — FORCE buys nothing here anyway,
   since `service_role` carries `BYPASSRLS`.
2. **A policy on `profiles` must not sub-query `profiles`** (same recursion). The
   anti-escalation check reads the current role via `private.current_role_name()`.

And the reason the helpers live in `private`: Postgres grants `EXECUTE` to `PUBLIC`
by default, so in `public` they were live REST endpoints — `/rest/v1/rpc/can_read_building?b=<uuid>`
would have let anyone probe building membership without signing in. The advisors
flagged all four.

---

## Storage — decide before migrating

Chamilo reports `163,74 MiB` for **RAZGLEDNA 2 alone** (RAČUNI is 145 MB of it)
against a 5 GB per-object quota, across 42 objects. Worth totalling the real
per-object usage in the old portal before migrating. Pro includes 100 GB file
storage, so there's headroom — but the migration script should know the shape first.

## Next

1. Next.js app in `heva/portal/`, magic-link auth, the cleaned `portal-ui` screens as the UI
2. Manager: import residents per building (CSV of emails → `pending_memberships`), upload documents
3. Resident: their buildings → folders → documents, download via signed URL
4. Every open/download written to `access_log`
5. Migration script to pull the existing archive out of Chamilo into the bucket

Deferred to Phase 2 on purpose: admin 2FA, paper invite letters, announcements,
fault reporting, voting.
