---
name: 3day-app-protocol
description: >
  The 3-Day App Protocol — a four-gate engine for shipping a client-ready
  Next.js + Supabase + Vercel app in three working days with verified security,
  design sign-off, and a rendered SHIP-REPORT. Use this skill whenever Ian
  starts a protocol run, says "start a protocol run", "3-day app", "new client
  app build", "gate-check", or resumes work inside a run project (any directory
  containing .protocol/). Also use when asked what gate a build is on, how to
  clear a red gate, or how to hand a build over.
---

# The 3-Day App Protocol

You are the operator of a gated build pipeline. The client gets an app in three
working days. The gates are how you prove — not claim — that it is safe to ship.
Everything in this file is an instruction, not a suggestion. When the protocol
and your instinct disagree, the protocol wins; if the protocol is genuinely
wrong, log it with `gate-check note` and keep moving.

The engine is one script: `/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/gate-check`
(zero-dep stock Node — never `npm install` anything in the pack; the pack repo
lives on iCloud where `node_modules` corrupts).

## The pipeline at a glance

```
P0 SETUP  →  P1 DISCOVERY ─G0→  P2 DESIGN ─G1→  P3 BUILD  →  P4 VERIFY ─G2→  P5 DEPLOY+HANDOVER ─G3→ SHIP-REPORT.md
```

Gate state machine (per `.protocol/gates/gate-N.json`):

```
pending ──check──▶ red ──fix + recheck──▶ green ──(code drift)──▶ stale ──recheck──▶ green
                                            │
                                            └── gate-check reopen N ──▶ pending
                                                (cascades: every gate > N resets to pending)
```

Gate discipline — the three rules that are never negotiable:

1. **Never advance a phase while the prior gate is red.** `gate-check status`
   exits 1 when the current phase's prior gate isn't green. The only escape is
   `gate-check status --force "<reason>"` — which is logged to `journal.jsonl`
   AND printed in the SHIP-REPORT under "Gates overridden". A `--force` is an
   intervention. It is visible to the client. Use it like a fire axe.
2. **A green gate goes stale the moment code drifts.** Gate 2 records the git
   HEAD at green; any new commit or dirty worktree turns it stale, and stale is
   treated as red by both `status` and the deploy hook. Fix: re-run the gate.
3. **Deploys are physically blocked below Gate 2 green.** A PreToolUse hook
   (`bin/deploy-guard`) blocks `vercel deploy` / `vercel --prod` / `vercel alias
   set` / `npx vercel` / `npm run deploy*` / `git push` on Vercel-linked
   projects unless gate-2 is green AND fresh. Shell wrappers do not help:
   `sh -c "…"`, `bash -lc "…"`, `env …`, and `xargs …` are unwrapped and
   inspected too. A green that carries no verification evidence (a hand-edited
   `gate-2.json`) is treated as not-green. Do not fight the hook. Do not edit
   the hook. Clear the gate.

## P0 — Setup

**Topology requirement (non-negotiable):** the Claude Code session that drives
a run MUST be started IN the run project directory. Hooks live in the run
project's `.claude/settings.json` and only fire for sessions rooted there — a
session started in the pack repo, in `~`, or anywhere else has NO enforcement.
If you find yourself operating a run from outside its directory, stop and
restart the session in `~/builds/<project>/`.

**Run directory rule:** run projects live OFF iCloud, in `~/builds/<project>/`.
Never inside `~/Desktop`, `~/Documents`, or anything iCloud-synced — iCloud
breaks `next dev`, file watchers, and `node_modules`.

Sequence:

1. `mkdir -p ~/builds/<project> && cd ~/builds/<project>` — then START THE
   SESSION HERE.
2. `gate-check init ~/builds/<project>` — scaffolds `.protocol/` (spec slot,
   `phase` marker set to P1, `gates/`, `journal.jsonl`, `evidence/`) and merges
   the enforcement hooks from `templates/hooks.json` into the run project's
   `.claude/settings.json`. Idempotent — safe to re-run.
3. `gate-check doctor` — verifies the full external tool matrix with versions:
   node, supabase CLI, **Docker (running, not just installed)**, vercel CLI,
   Playwright, gitleaks (or confirms the built-in regex fallback will be used).
   Doctor failures are Gate 0 failures. Docker is a hard prerequisite: Gate 2
   cannot run without a local shadow database.
4. Provisioning checklist (verified again by `gate-check 0`):
   - Supabase project created; project ref recorded in spec
   - Vercel account/team ready; project will be CLI-linked
   - **Vercel git auto-deploy DISABLED for this project** — deploys happen only
     via CLI so the hook is the single choke point
   - Claude plan/credits sufficient for a 3-day run
   - git repo initialized in the run project (gates record HEAD; no git = no
     freshness proof = permanent block)

## P1 — Discovery → Gate 0

Run the `web-intake` question set with the client (or against their brief).
Compile the answers into `.protocol/spec.json` — the single source of truth for
everything downstream. Then fork on ONE question: *does the client care how it
is built?*

**Build path (default — outcome-only).** The client describes outcomes: who
uses it, what they do, what must be true when it works. The protocol decides
tech, and the decision is already made: Next.js + Supabase + Vercel, scaffolded
from the ais-os skeleton. Do not surface stack choices, schema design, or auth
mechanics to the client. Spec captures: actors, core actions, data the app
must remember, access rules in plain language ("a coach sees only their own
athletes"), and the launch checklist.

**Tech path (stack-aware client or operator).** Same stack — the protocol never
changes stack in v1 — but the spec additionally exposes the decisions a
technical counterpart will want to sign: table-level schema sketch, auth mode
(email/password, magic link, OAuth providers), RLS policy intent per table,
third-party integrations, environment/secret inventory. These become explicit
spec fields they approve, not conversations that evaporate.

Close the phase: `gate-check 0` — validates spec.json against
`templates/build-spec.schema.json` and re-checks the provisioning checklist
(including Docker). Green means: the spec is machine-valid and everything the
later gates need already exists. Fix reds by editing spec.json or provisioning,
then re-run. Do not hand-edit gate files, ever.

## P2 — Design → Gate 1

1. Produce 2–3 design variants for the core screens (apply `ian-design-standards`
   — that skill is the rule source, this gate is its enforcement).
2. `gate-check 1` — runs the lint subset against the chosen variant:
   axe contrast, type-scale tokens, asset resolution, hero heuristic. Produces
   a report in `.protocol/evidence/`.
3. Human sign-off: show the client (or Ian) the variant and the lint report,
   then record it: `gate-check 1 --approve "<name>"`. The tool REFUSES to
   record approval before the lint passes — lint first, sign-off second, no
   exceptions. A signature on a red lint is worthless to everyone.

Gate 1 green = a named human approved a lint-clean design. Build nothing user-
facing before this.

## P3 — Build

Scaffold from the ais-os skeleton pattern: Next.js app + Supabase (schema.sql,
RLS policies, SSR auth helpers, useStore) + Vercel target. Drive every schema,
policy, and auth decision from `.protocol/spec.json` — if it isn't in the spec,
it goes back through P1, not into the code.

Build rules:

- **RLS is deny-by-default on every table.** Write the policy, then the pgTAP
  test that proves it, in the same sitting. Gate 2 will independently verify
  with negative cases you didn't write.
- Every route handler validates input (zod or equivalent) before use. Raw
  `req.body` / `searchParams` passthrough is a Gate 2 finding.
- No secrets in code. Service-role keys never touch `NEXT_PUBLIC_*` variables.
- Commit early and often — gates record HEAD, and an unborn/dirty repo blocks
  deploys.

There is no gate between P3 and P4; P4 IS the gate on the build.

## P4 — Verify → Gate 2 (the security gate)

`gate-check 2` runs the security pass:

- **RLS proof (layer 1):** pgTAP suite via `supabase test db` on the LOCAL
  shadow database (this is why Docker is a Gate 0 prerequisite). The suite must
  include deny-by-default negative cases for EVERY table — not only spec-derived
  cases. A suite that generates ZERO tests is a red gate, never a silent pass.
  A missing supabase CLI is a red gate too — never a skip. TAP summary lands in
  `.protocol/evidence/gate2-rls.txt`.
- **Secrets:** `gitleaks detect --no-banner --redact` if installed, else the
  built-in regex scan (Supabase `service_role` JWTs, `sk-ant-*` keys, generic
  40+ char high-entropy assignments in `.env*`/source — `.env.example` is
  exempt). Any hit is red; evidence is written with secret values redacted to
  their first 6 characters.
- **Input validation heuristics:** route handlers under `app/api` and
  `src/app/api` that consume raw `req.body` / `request.json()` /
  `searchParams` without a zod/valibot parse in the same handler are flagged;
  any unparsed POST/PUT/PATCH handler is a red gate (unparsed GETs are
  warnings in the evidence).
- *(post-v0, not yet run by `gate-check 2`: `NEXT_PUBLIC_*` env audit via
  `vercel env ls`, and the `.next/static` built-bundle key scan.)*

On green, gate-2.json records the git HEAD. From that moment, ANY code change
makes the gate stale and re-blocks deploys until you re-run `gate-check 2`.
That is the point: nothing ships that the security pass hasn't seen.

**Break-glass (`--attest`) — Gate 2 only.** If verification tooling is down
(Docker won't start, `supabase test db` broken) and the deploy genuinely cannot
wait: `gate-check 2 --attest "<name>: <reason>"`. Understand what this costs
before typing it:

- The deploy hook allows the deploy but prints a loud warning on every one.
- The SHIP-REPORT carries a RED attestation banner naming the attester and the
  reason. The client sees it. It cannot be removed except by a real green.
- The attestation counts as an intervention.
- You are obligated to re-run `gate-check 2` for real as soon as tooling is
  back, even post-deploy.

An attestation is a named human accepting personal responsibility for shipping
unverified security. It is not a convenience flag.

## P5 — Deploy + Handover → Gate 3

Deploy via `deploy-to-vercel` / `vercel deploy --prod` (the hook lets it
through on a fresh green gate-2). Then close the run: `gate-check 3
[--url <prod-url>]` verifies against the LIVE deployment. It REFUSES to run
unless gate 2 is effectively green (a stale green does not count; an
`--attest` break-glass is honored but the report screams it). The production
URL comes from `deployUrl` in `.protocol/spec.json`, or `--url` if the spec
has none.

- Prod URL must return 200.
- **Thin anon RLS probe (deployed proof):** every route listed in
  `spec.protectedRoutes` is fetched anonymously (no auth cookie) and MUST
  answer 401/403/redirect-to-login — a 200 is a red gate. Each probe result is
  recorded in `.protocol/evidence/gate3-probe.txt`. This layer is independent
  of the pgTAP suite and of whatever session wrote the policies.
  `protectedRoutes` is a REQUIRED spec field (Gate 0 enforces at least one) and
  an empty set is a red Gate 3 — a probe that checks nothing proves nothing.
- Smoke: if Playwright is usable in the run project AND a smoke spec exists
  (`tests/smoke.spec.*`, `e2e/smoke.spec.*`, or `.protocol/smoke.spec.*`), it
  runs signup → core action → persist. Otherwise the fallback is curl-level
  reachability, clearly marked "smoke: curl-level" in the evidence —
  v0-dogfood acceptable, never silently upgraded to a claim of a real smoke.
- *(post-v0, not yet run by `gate-check 3`: design-lint re-run against the
  built app, and the `ccusage`/`/cost` cost-envelope prompt.)*

On green, Gate 3 renders `SHIP-REPORT.md` from
`templates/SHIP-REPORT.template.md` — gates table with evidence links, security
results, design lint, overrides/attestations (red-bannered if any), cost
envelope, intervention count, credentials handling, and how-to-change-things.
The SHIP-REPORT is the handover artifact. A run without one is not finished.

## Resumability

A run is self-contained in `.protocol/` and survives any session death. On a
new session (or after a crash):

1. Start the session IN the run project (topology requirement — always).
2. `gate-check status` — prints the gate table (including STALE flags) and the
   current phase from `.protocol/phase`. That output is the truth about where
   you are; trust it over your memory of the previous session.
3. Read the tail of `.protocol/journal.jsonl` for what actually happened last.
4. Continue from the current phase. Never re-run green gates for comfort —
   they either hold or the staleness machinery flags them.

## Interventions — the ≤15 budget

An intervention is any human correction the run needed: a `--force`, an
`--attest`, a `gate-check note "<text>"` entry, or an operator chat correction
(tally those at each gate-green prompt). The budget is **15 per run, absolute**.
Log interventions the moment they happen — an unlogged intervention is a lie in
the SHIP-REPORT. If the count is trending past budget mid-run, that is a signal
the spec or the protocol failed, not the client: note WHY, finish the run, and
fix the pack afterward.

## Quick reference

| Command | When |
|---|---|
| `gate-check init <dir>` | P0, once per run (idempotent) |
| `gate-check doctor` | P0, and any time tooling misbehaves |
| `gate-check 0` | close P1 — spec valid + provisioned |
| `gate-check 1` / `1 --approve "<name>"` | close P2 — lint, then human sign-off |
| `gate-check 2` / `2 --attest "<name>: <reason>"` | close P4 — security pass / break-glass |
| `gate-check 3 [--url <prod-url>]` | close P5 — live verification + SHIP-REPORT |
| `gate-check status` / `status --force "<reason>"` | where am I / logged override |
| `gate-check reopen <N>` | deliberately reopen gate N (+ cascade) |
| `gate-check note "<text>"` | log an intervention or observation |
