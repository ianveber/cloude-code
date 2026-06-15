# INSPEKTUS OS — Phase 2: Auth + Saved Runs (Design)

**Date:** 2026-06-15
**Project:** `INSPEKTUS/inspectus-os/` — the logged-in command center for INSPECTUS d.o.o. (AIS Slovenia's first paying client)
**Phase 1 status:** ✅ done — branded shell + the VLDR pipeline ported to React at parity, verified on the real PRIMER 1 dataset (314 vehicles), running in seed mode (no login).
**This phase:** turn the seed-mode tool into a real, multi-user product — login, automatic saving of every run, a history page, live home KPIs, and a team/settings page.

---

## Guiding principles

These two are co-equal and non-negotiable. Every decision below is justified against them.

1. **UX must be effortless.** The INSPECTUS team are inspectors, not engineers. Logging in, processing a report, and finding a past one must take the fewest possible clicks, with clear Slovene microcopy, obvious states (loading / saved / error), and no dead ends. Saving is automatic — the user never has to remember to do it.
2. **Security and professionalism must be proper — and invisible.** Protection is enforced server-side and by the database, not by hiding buttons. The user feels a smooth app; underneath, every row is RLS-protected and every route is auth-gated. No privileged secrets ship to the browser; nothing technical leaks into the UI.

---

## Security model (the foundation)

The protection already lives in `supabase/schema.sql` and the Supabase platform. This phase wires the app to it correctly.

- **Row-Level Security on every table** (`profiles`, `runs`) — already enabled in `schema.sql`. An authenticated INSPECTUS member can read all workspace runs (single-tenant by design); only the run's owner or an admin can modify/delete. No anonymous access to any data.
- **Server-enforced signup gate** — the `handle_new_user` trigger rejects any email that is not `@inspectus.si` or on the explicit AIS admin allowlist. This runs in the database, so it cannot be bypassed from the client.
- **The anon key is publishable by design.** Supabase's anon/`NEXT_PUBLIC_` key is safe to expose; it grants nothing beyond what RLS permits. The real keys to protect — the `ANTHROPIC_API_KEY` and (deliberately unused this phase) the service-role key — never reach the browser.
- **No service-role key in this phase.** We chose self-serve signup over admin email-invites specifically to avoid introducing a privileged secret. Adding a non-`@inspectus.si` admin is a one-line edit to the SQL allowlist.
- **All DB access is server-side** — server components and server actions using `lib/supabase/server.ts`. The browser Supabase client is used only on `/prijava` for the auth handshake itself.
- **Every `(app)` route is auth-gated** by root middleware before any data renders — there is no pre-auth path to workspace data.
- **Transport security** — production runs on HTTPS (Vercel) with `Secure`/`HttpOnly` session cookies managed by `@supabase/ssr`. Magic links and sessions use Supabase's built-in expiry and rate limiting.
- **Graceful, professional failure** — every Supabase call is wrapped. Failures degrade to a calm Slovene notice or to seed mode; the app never crashes or shows a stack trace to the client.

---

## Scope

**In scope**
- Auth: `/prijava` login page (email+password primary, magic-link fallback), `/auth/callback`, sign-out, root middleware route protection.
- Save-on-complete: automatic, idempotent save of each finished run via a server action.
- Zgodovina: history list + run-detail page (reopen + re-download deliverables from stored data).
- Real Domov KPIs from saved runs (replacing seed numbers).
- Nastavitve: team roster + admin role management + self-serve-signup info panel.

**Out of scope (this phase)**
- Vercel deployment — a separate step after local verification.
- True email invites (service-role `inviteUserByEmail`).
- "Ponovno uredi" re-edit wiring (stub link only; data is stored to enable it later).
- Phase 4 carrier-intelligence analytics.

---

## Architecture & components

### New files
```
middleware.ts                              # root: guards (app)/*, redirects to /prijava
src/app/prijava/page.tsx                    # login (password primary + magic-link fallback)
src/app/prijava/actions.ts                  # signInWithPassword / signInWithOtp server actions
src/app/auth/callback/route.ts              # exchange code → session
src/lib/runs.ts                             # RunRecord type, saveRun() server action, deriveCounts() (pure), listRuns(), getRun()
src/app/(app)/zgodovina/page.tsx            # history list
src/app/(app)/zgodovina/[id]/page.tsx       # run detail (rehydrated result panels + re-download)
src/app/(app)/nastavitve/page.tsx           # team roster + signup-info panel
src/app/(app)/nastavitve/actions.ts         # setRole() admin server action
src/lib/runs.deriveCounts.test.ts           # unit test for pure counts derivation
```

### Modified files (minimal, surgical)
```
src/components/TopBar.tsx                    # show signed-in email + "Odjava" button
src/app/(app)/obdelava/page.tsx             # call saveRun() once when `ready`; show Shranjevanje/Shranjeno state
src/app/(app)/page.tsx                       # Domov KPIs from listRuns() instead of SEED_RUNS (seed fallback kept)
```
The Phase-1 pipeline (`useVldrPipeline`, `transform.ts`, result components, AI routes) is **untouched** except the single `saveRun` call site.

### Data flow
```
/prijava ──(password | magic link)──► Supabase Auth ──Secure cookie──►
  middleware guards every (app)/* request (else → /prijava)
obdelava: pipeline `ready` ──► saveRun(result) [server action]
  └─ deriveCounts() + created_by from session ──RLS insert──► public.runs
zgodovina (list)   ◄──server fetch (RLS)── public.runs (created_at desc)
zgodovina/[id]     ◄──server fetch── one run → rehydrate result panels from `vehicles` + re-download
Domov KPIs         ◄──server fetch── public.runs (totals, last run, count)
nastavitve         ◄──server fetch── public.profiles ──admin setRole()──► role update
```

### Component boundaries (each independently understandable)
- **`lib/runs.ts`** — the only module that knows the `runs` table shape. `deriveCounts(result)` is a pure function (unit-tested, no DB). `saveRun`, `listRuns`, `getRun` are server actions/functions taking typed inputs. Consumers never write raw SQL.
- **`/prijava` + `actions.ts`** — the only place using the browser/auth client; knows nothing about runs.
- **`middleware.ts`** — knows only "is there a session, is this an `(app)` route" — pure routing concern.
- **Zgodovina/Domov/Nastavitve pages** — read-only server components that call `lib/runs.ts` / fetch `profiles`; no business logic of their own.

---

## UX specifics

- **Login** — one clean INSPECTUS-branded page. Email + password fields and a primary "Prijava" button; below it, a quiet "Pošlji magično povezavo" option. A single friendly error line on failure ("Napačen email ali geslo." / "Ta email ni dovoljen."). No jargon.
- **First-time use** — the same page handles sign-up (password set on first login for `@inspectus.si` emails); copy makes clear who can register.
- **Saving** — entirely automatic. When deliverables are ready the user sees a subtle inline `Shranjevanje…` → `✓ Shranjeno`. If saving fails, a non-blocking `Ni shranjeno — preveri prijavo` note; the deliverables remain fully usable and downloadable regardless.
- **Zgodovina** — a scannable table; one click opens a past run with all panels and re-download buttons exactly as on the day it was processed. Empty state: "Še ni shranjenih obdelav."
- **Domov** — real numbers the moment runs exist; identical layout to today so nothing visually regresses.
- **Nastavitve** — plain-language roster; admins see role toggles, members see a read-only list; a short "Kako dodati člana ekipe" panel explains self-serve signup.
- **TopBar** — shows the signed-in email and a one-click "Odjava".
- **Seed mode preserved** — with Supabase env unset, the app still boots with sample data and no login, so the tool is demoable offline and nothing breaks before keys are pasted.

---

## Error handling

| Condition | Behavior |
|---|---|
| Supabase env unset | Seed mode: no login, sample data, save is a logged no-op. App fully usable. |
| Login fails (bad creds / disallowed email) | Single Slovene inline message; no technical detail. |
| Magic link expired/invalid | Friendly "Povezava je potekla — poskusi znova." on `/auth/callback`. |
| `saveRun` fails (network/RLS) | Non-blocking notice; deliverables still work; error logged server-side. |
| Run detail id not found / not permitted | Clean "Obdelava ni najdena." page, not a crash. |
| Non-admin attempts role change | Action rejected by RLS + UI never offers the control. |

Never silently fail; never show a stack trace to the user.

---

## Testing & verification

- **Unit:** `deriveCounts()` test (pure, no DB). Existing `transform.ts` suite stays green (18/18), untouched.
- **Manual (local, `:3020`) acceptance path:**
  1. Create fresh Supabase project, run `schema.sql`, paste URL + anon key into `.env.local`.
  2. Sign up/login with the admin email → land on Domov.
  3. Verify an unauthenticated visit to `/` and `/zgodovina` redirects to `/prijava`.
  4. Process PRIMER 1 → see `✓ Shranjeno` → run appears in Zgodovina and in Domov KPIs.
  5. Open it from Zgodovina → all panels rehydrate, re-download works.
  6. Nastavitve lists the admin as `admin`; role toggle present for admin only.
  7. Sign out → back to `/prijava`; protected routes no longer reachable.
- **Security spot-check:** confirm no service-role key anywhere; confirm only `NEXT_PUBLIC_` (anon) values reach the client bundle; confirm direct anon REST read of `runs` without a session returns nothing (RLS).

---

## Rollout note

Ship and verify entirely in local seed-then-live mode first. Vercel deploy + subdomain is a deliberate follow-up step once the acceptance path passes, so the client never sees a half-wired auth state.
