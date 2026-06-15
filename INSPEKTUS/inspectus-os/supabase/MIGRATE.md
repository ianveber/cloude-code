# INSPECTUS Center — backend portability & migration runbook

The entire backend is **defined as code in this folder**, so it is account-agnostic and
host-agnostic. The same definition can run on:

- a cloud Supabase project under **AIS's** account (during the trial),
- a cloud Supabase project under **INSPECTUS's** account (hand-off / they pay),
- a **fully local** Supabase stack on any machine (Docker, no cloud account).

Moving between any of these is a one-command schema push + an env-var swap. This doc is the
runbook.

## What lives where

| File | Role |
|---|---|
| `migrations/20260615120000_init.sql` | **Canonical** schema — tables, RLS, the `@inspectus.si` signup gate, triggers. Applied with `supabase db push`. |
| `schema.sql` | Identical convenience copy for zero-tooling **dashboard paste**. Keep in sync with the migration. |
| `config.toml` | Supabase CLI project config (ports, auth rules). Lets anyone reproduce the project. |

There is **no Storage and no Edge Functions** — every payload (vehicles, raw rows, AI output)
is stored as JSONB inside the `runs` table. So a migration is just: **schema + (optionally) data
+ auth users.** Nothing else to move.

The app reads only two values to point at a backend (both safe to commit-exclude, both
publishable-by-design):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Swapping these two values repoints the whole app. That is the entire "migration" from the
app's side.

---

## Install the CLI once (no global install, pinned to the repo)

The Supabase CLI is a single binary. The cloud workflows below (`link`, `db push`, `db dump`)
**do not need Docker** — Docker is only needed for the local self-host option.

```bash
# from inspectus-os/  — pins the CLI version in package.json
bun add -d supabase
# then call it as:  bunx supabase <cmd>
```

(Or install globally via Homebrew: `brew install supabase/tap/supabase`.)

---

## A. Stand up on a NEW cloud project (AIS now, or INSPECTUS later)

This is the normal path. Whoever owns the account does steps 1–2; everything else is CLI.

1. In the Supabase dashboard (the target account): **New project** → name `inspectus-center`,
   region **EU (Frankfurt)**. Save the DB password.
2. Project Settings → **Data API** → copy the **Project URL** and **anon** key.

Then, from `inspectus-os/`:

```bash
bunx supabase link --project-ref <PROJECT_REF>     # ref is in the project URL / settings
bunx supabase db push                              # applies migrations/ → creates the schema
```

3. Put the URL + anon key in `inspectus-os/.env.local` (and in Vercel's env if deploying).
4. Auth → Providers → **Email**: enable. SMTP must be configured for real magic-link/confirm
   emails in production (Auth → SMTP).

**Zero-tooling alternative** (no CLI at all): skip `link`/`db push`; instead paste `schema.sql`
into the dashboard **SQL Editor** and Run. Same result.

---

## B. Hand off AIS → INSPECTUS (move schema **and** data)

Use this when INSPECTUS takes over hosting and wants their existing run history preserved.

1. Stand up the empty target project (Section A, steps 1–2 + `link` + `db push` on the new ref).
2. **Dump from the source** project:

```bash
bunx supabase link --project-ref <SOURCE_REF>
# auth users (preserves UUIDs so runs.created_by FKs stay valid):
bunx supabase db dump --role postgres --schema auth --data-only -f dump_auth.sql
# app data:
bunx supabase db dump --data-only --schema public -f dump_data.sql
```

3. **Restore into the target** (psql with the target DB connection string from its dashboard →
   Settings → Database):

```bash
psql "<TARGET_DB_CONNECTION_STRING>" -f dump_auth.sql
psql "<TARGET_DB_CONNECTION_STRING>" -f dump_data.sql
```

4. Repoint the app: change the two `NEXT_PUBLIC_SUPABASE_*` env vars to the target project.
   Re-deploy. Done — the source project can be paused/deleted.

> **Simpler hand-off (no data):** if history doesn't need to move, skip the dumps entirely. Just
> do Section A on INSPECTUS's account and have the team **re-sign-up** (self-serve, `@inspectus.si`
> gated). Past runs stay in the old project until it's retired.

---

## C. Fully local, no cloud account (Docker)

For development or a self-hosted deployment "on our computers." Requires Docker Desktop.

```bash
# one-time: install Docker Desktop, then from inspectus-os/
bunx supabase init      # only if config.toml were missing — it already exists here
bunx supabase start     # boots Postgres + Auth + Studio + mail inbox in Docker
```

`supabase start` prints a local **API URL** and **anon key** — put those in `.env.local`. Local
Studio runs at http://localhost:54323; the local mail inbox (magic links) at
http://localhost:54324. `supabase stop` tears it down. Migrations in `migrations/` are applied
automatically on start.

---

## Admin allowlist (who can sign in besides @inspectus.si)

Edit the `allowed_emails()` function inside the init migration **before** pushing, then
`bunx supabase db push` (or re-paste `schema.sql`). AIS operators added there get in even though
they are not `@inspectus.si`.

---

## Quick checklist for any move

- [ ] Target project created; `db push` (or SQL paste) succeeded.
- [ ] (If preserving history) auth + data dumped from source and restored to target.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` swapped in `.env.local` + Vercel.
- [ ] Email provider (SMTP) configured on the target for production.
- [ ] `site_url` / redirect URLs in `config.toml` (and dashboard Auth settings) match the new origin.
- [ ] Smoke test: sign in, process a report, see it in Zgodovina.
