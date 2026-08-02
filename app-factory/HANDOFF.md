# App Factory — handoff

**Built 2026-08-01 / 2026-08-02.** Everything here is committed on `session/veta-agency-build`.

Read this first in a fresh session. It says what exists, what is *proven* versus
merely *written*, and what to do next.

---

## 1. What this is

A system that takes one of Ian's app ideas to a deployed, secured web app. The
existing four-gate engine (`3day-protocol/`, built 2026-07-13) was **100%
brakes, 0% engine** — every gate was a *check*, and not one made a build faster.
This adds what was missing underneath.

**Design spec:** `docs/superpowers/specs/2026-08-01-app-factory-design.md`
(8 layers, 170h designed; L6/L7 deliberately unestimated because their design
agents died before running — a number would have been invented).

---

## 2. What exists, and how sure we are

| Piece | Path | Status |
|---|---|---|
| `provision` | `3day-protocol/bin/provision` | **Proven live.** Created + torn down real infrastructure twice. |
| Safety guards | `3day-protocol/lib/cloud/guards.mjs` | Proven. 13 adversarial tests. |
| Supabase client | `3day-protocol/lib/cloud/supabase-api.mjs` | Proven live. |
| Vercel client | `3day-protocol/lib/cloud/vercel-api.mjs` | Proven live. |
| Resumable manifest | `3day-protocol/lib/cloud/manifest.mjs` | Proven — recovered a real crashed run. |
| Schema + RLS generators | `app-factory/starter-kit/generators/` | **Proven live** against a real Supabase project. |
| RLS runner (pack-owned) | `3day-protocol/bin/rls-run` | Proven, incl. a mutation test. |
| Gate-2 integrity | `3day-protocol/lib/rls-integrity.mjs` | Proven — forged-runner attack is a test. |
| Next.js template | `app-factory/starter-kit/tracks/app/` | **Proven** — scaffolded, built, and probed on a running server. |
| Scaffolder | `app-factory/starter-kit/generators/scaffold.mjs` | Proven. |
| Engine defects F1–F5 | `3day-protocol/bin/gate-check` | All five fixed. |

**213 tests green:** 176 engine + 37 kit.

```bash
cd "/Users/ianveber/Desktop/Cloude CODE/3day-protocol" && node --test tests/*.test.mjs
cd "/Users/ianveber/Desktop/Cloude CODE/app-factory/starter-kit" && node --test tests/*.test.mjs
```

> ⚠️ Note the glob. `node --test tests/` (directory, no glob) fails with
> MODULE_NOT_FOUND and looks like a broken suite.

---

## 3. The one lesson worth carrying forward

**Six bugs were found in this build. Five were FALSE SUCCESSES** — code
reporting green while doing nothing, or checking the wrong thing:

1. `teardown` reported success while the Vercel project still existed
   (`project rm --non-interactive` still prompts, reads empty with no TTY,
   defaults to N, and **exits 0**).
2. An RLS case passed with **RLS entirely disabled** on the table — `when
   insufficient_privilege or others` swallowed a NOT NULL violation and called
   it "blocked by RLS".
3. `{ok: false, ...analysis}` — object spread put `analysis.ok: true` *after*
   the explicit `false`, so an unrun suite reported green.
4. `gate-check doctor` reported "docker OK" with the daemon dead
   (`docker --version` exits 0 without an engine).
5. `(app)/page.tsx` served the signed-in home from `/` — a route group creates
   no URL segment — while `routes.ts` protected an `/app` that did not exist.
   Every test passed. The build passed.

**None were caught by offline tests.** Each needed a real run, or a deliberate
attempt to make the check fail. The standing rules that came out of it:

- **A destructive act is never "done" on the strength of an exit code.** Delete,
  then prove absence. `setAuthConfig` patches, then reads back and asserts.
- **Every denial test needs a positive twin.** A suite of pure denials scores
  full marks against a policy that denies everyone.
- **Catch only the specific error.** `when others` turns a security test into
  theatre.
- **Absence of evidence is a refusal**, never a default-open. Unrun suite → red.
  Unprovable freshness → stale. Git unreachable → nothing excused.

---

## 4. Security model (do not weaken without reading this)

**The fence in Gate 2:** the app supplies test **cases** (data); the pack
supplies the **runner** and the **arithmetic** (code). The rejected design had
`gate-check` execute `<runDir>/supabase/tests/run.sh` and parse its stdout —
that script is written by the agent being judged.

**`DENY_REFS` is absolute.** Three live projects (AIS client portal
`myqcdljzseefrlicwnbm`, `heva-portal`, ATHLOS) are refused **even if written
into the ownership registry**. Data cannot move a boundary that lives in code.
Guards run *inside* the API clients, so no call path reaches a destructive verb
without passing them.

**Fail closed everywhere:** env unset + protected route → 503, never allow.

---

## 5. Decisions taken (do not re-litigate without reason)

- **Docker: deferred.** Not broken — heavy. 3.83 GiB VM on an 8 GiB Mac. RLS is
  proven against the app's own fresh Supabase project, which is *stronger* than
  a container plus a hand-written stub of Supabase's auth schema. Docker returns
  later as an optional offline path.
- **GitHub: deferred.** `vercel --prod` deploys from a local directory; gate
  freshness uses *local* git. A local `git init` IS still mandatory (F4).
  Ian's `gh` token has been invalid since ~2026-07-10; the fix that avoids the
  email-code wall is an SSH key.
- **Parallel builds (L6/L7): deferred.** 8 GiB RAM is the ceiling — realistic N
  is 2–3, never 5. And 3 apps back to back at a day each beats 3 in parallel at
  three days each.
- **Template uses `proxy.ts`, not `middleware.ts`** — Next 16 deprecates the
  latter. For a NEW app there is no Edge behaviour to preserve; for an EXISTING
  app that rename silently moves the handler onto Node.js, so migrate with a
  probe.

---

## 6. Open questions — Ian has not answered these

1. **Default UI language** for generated apps. `ais-os` is English; INSPEKTUS,
   Heva and social-dashboard are Slovene. Currently defaults to **English with a
   per-app `spec.i18n.locale` override**.
2. **One global SMTP provider** (e.g. Resend)? One setup turns on password reset
   and magic-link login for every future app. Currently **not set up** — the
   first account must be created by hand, as on Heva.
3. **Supabase project cap.** ~$10/month marginal per project, forever.
   Currently assumed **8 → ~$95/month ceiling**.
4. **Repo location.** The factory sits in the iCloud-synced Desktop repo. iCloud
   evicted files mid-work on 2026-07-11, and a full-tree `git merge` timed out at
   two minutes during this build. Recommendation: move off iCloud.

---

## 7. What to do next

**Immediately:** `new-app` — one command chaining scaffold → provision →
`gate-check`. Everything underneath it is built and proven, so this is small.

**Then: build app #1.** Ian names one of his ideas. That run is the real test —
the throwaways proved the machinery, not the workflow.

**Not yet built:** `reset-password` page (linked from login, route exists in
`AUTH_ROUTES`, page is absent), the `portal` static track, kit versioning
(`kit doctor` / `upgrade`), L6 enforcement refactor, L7 parallel factory.

### Running it by hand today

```bash
# 1. scaffold from a spec
cd "/Users/ianveber/Desktop/Cloude CODE/app-factory/starter-kit"
node -e "const fs=require('fs');const D='<runDir>';
  import('./generators/scaffold.mjs').then(m=>m.scaffold(JSON.parse(fs.readFileSync(D+'/.protocol/spec.json','utf8')),D))"

# 2. provision the backend (creates REAL paid infrastructure)
"/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/provision" plan  <runDir>
"/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/provision" apply <runDir>

# 3. prove RLS against the live project
node "/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/rls-run" <runDir>

# 4. tear down when finished
"/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/provision" teardown <runDir> --yes --project <slug>
```

**Run directories must live in `~/builds/<slug>`** — off iCloud, or `next dev`,
file watchers and `node_modules` all break. The guards enforce this.

### Gotchas that cost time

- `node --test tests/` needs the **glob**: `tests/*.test.mjs`.
- `new URL(import.meta.url).pathname` leaves `%20` in the repo path (it contains
  a space) — use `fileURLToPath`.
- A fresh Supabase project answers `COMING_UP` for 1–2 minutes; querying it dies
  with a 500 `"ipv6 address is not defined"` that says nothing about the cause.
- `vercel project inspect` has **no** `--json`; use `vercel api /v9/projects/<name>`.
  `link` is **absent** (not null) when no repo is connected.
- Supabase reports an already-deleted project as **400 "Resource has been
  removed"**, not 404.
- `supabase config push` would push **all 242** auth settings at the project.
  Never use it; PATCH the one key and read it back.

---

## 8. Portability note

Test paths resolve relative to their own file via `fileURLToPath`, so an
extracted copy tests **itself**. This was not originally true — three suites
hardcoded `/Users/ianveber/Desktop/Cloude CODE/3day-protocol`, which meant a
copy silently tested the ORIGINAL and passed while proving nothing about the
code you actually had. Fixed 2026-08-02.

**One remaining external dependency:** `tests/deploy-guard.test.mjs` references
fixture directories at `~/builds/spike` and `~/builds/spike-nolink`. Those exist
on this Mac. On a different machine those specific tests will fail — that is a
real limitation, not a passing suite lying to you.
