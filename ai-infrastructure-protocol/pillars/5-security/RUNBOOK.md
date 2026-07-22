# Pillar ⑤ Security — G3 SECURE Runbook

The operator-facing, do-this-exactly companion to `SKILL.md`. The SKILL defines
the standard (the 8 controls, the gate rule, the evidence shape); this RUNBOOK
defines the **moves** — who does what, in what order, with which command and which
skill. G3 is mostly operator-automated: the adversarial review runs from Ian's
machine against artifacts already built in G2. Three things still need a human:
**provisioning production secrets safely**, **fixing findings**, and **the client
signing off on any residual/accepted risk**.

Read `SKILL.md` first. This file never overrides it — where they differ, the
standard wins.

---

## 1. Hands-free vs not

| Fully automated (protocol) | AIS operator (Claude Code) | Client |
|---|---|---|
| Per-artifact control loop over `.protocol/artifacts.json` (applicability matrix → controls) | Kicks off the adversarial review per artifact -> invoke `/cso` | Provisions the real production secret values into the vault we point them to (no plaintext to us) |
| Secret scan tree + history (`gitleaks` / regex fallback) → S1 evidence | Turns on the destructive-command guardrail before touching any live artifact -> invoke `/guard` | Grants the deploy/host role we need to run live probes + set env vars (Vercel/Supabase collaborator) |
| pgTAP RLS suite on the local shadow DB (`supabase test db`) → S3 evidence | Reviews raw findings, fixes reds in place, re-runs the affected control -> invoke `/security-review`, `/code-review` | Confirms the **access rules** per table/agent ("a coach sees only their own athletes") so RLS + scopes are provable |
| Dependency audit (`npm/bun/pip/cargo audit`) → S7 evidence | Runs the deployed anon-probe on every protected/AI route (S3/S5 live proof) -> invoke `/qa-only` | Approves the OAuth consent screen when we request narrow scopes for agents/automations |
| Rate-limit + cost-ceiling probe (N+1 → 429) → S5 evidence | Writes/rotates secrets into the host; verifies nothing leaked -> invoke `/careful` | **Signs the residual-risk form** — accepts any DONE_WITH_CONCERNS item or attestation, in writing |
| Gate close: `gate-check 3` verifies every artifact green, writes `gate-3.json` (+ staleness on drift) | Assembles the client-facing security summary PDF -> invoke `/make-pdf` | Names the **break-glass attester** (one person) if verification tooling is genuinely down |

The dividing line: the protocol *finds and proves*; the operator *decides and
fixes*; the client *grants access, confirms intent, and accepts residual risk*.
A leaked key (S1) and an open table (S3) are never attestable — no signature buys
past them.

---

## 2. Operator runbook

Run from the engagement root (where `.protocol/artifacts.json` was written in G2).
Every artifact registered in G2 must clear G3 **individually** before the gate
goes green.

### 2.0 — Pre-flight: arm the guardrails (before touching anything live)
1. Confirm G2 is green and artifacts are registered: read `.protocol/artifacts.json`.
2. For any artifact that talks to production data or live keys, turn on the
   edit-boundary + destructive-command guard scoped to that artifact's directory —
   hardening must never become the incident.
   -> invoke `/guard`
3. If you are only reading (scanning, not yet fixing), the lighter guardrail is
   enough. -> invoke `/careful`

### 2.1 — Run the adversarial review per artifact (the find pass)
1. Identify the artifact type (app / agent / automation / API) → read the
   applicability row in `SKILL.md` → the set of controls that apply.
2. Run the deep audit engine scoped to the controls that apply. Use its scoped
   phases: `--code` (S1/S4/S8), `--supply-chain` (S7), `--scope llm-ai` (S6),
   `--scope webhooks` (S4). Read the phase method from
   `skills/security/cso/sections/audit-phases.md` — do not paraphrase from memory.
   -> invoke `/cso`
3. In parallel, run the diff-scoped reviewer over anything changed in G2 to catch
   correctness/security regressions the deep audit misses.
   -> invoke `/security-review`
4. Collect raw findings. These are inputs to the gate, not the verdict — the
   verdict is per-control PASS+evidence or RED.

### 2.2 — Prove each control → write its evidence file
Write every evidence file under `.protocol/evidence/gate3-<artifact>-<control>.*`.
A control is green ONLY when its file exists and shows the proof.

- **S1 secrets** — `gitleaks detect --no-banner --redact` over tree + history; if
  absent, the regex fallback from `SKILL.md` (never skip). Evidence: tool name,
  scope, `findings: 0`. Any ever-committed secret is burned → rotate (§2.4) and
  note the rotation. -> invoke `/cso`
- **S2 auth + least privilege** — enumerate every endpoint/entrypoint + its auth
  requirement; inventory each credential → its exact scopes → why. Evidence: the
  list + "no credential holds more than its artifact needs". -> invoke `/security-review`
- **S3 data access / RLS** — run the pgTAP suite on the LOCAL shadow DB:
  `supabase test db`. Suite must include a deny-by-default negative for EVERY
  table (owner CAN reach / other tenant CANNOT). Zero tests = RED. Evidence: the
  TAP summary `tests passed N/N`. -> invoke `/supabase-postgres-best-practices`
- **S4 input validation** — inventory every route/tool/webhook handler; each
  mutating handler must schema-validate (zod/valibot/pydantic) before use; inbound
  webhooks verify signature. Evidence: handler inventory + injection-surface scan.
  -> invoke `/cso`
- **S5 API abuse protection** — per public + per AI endpoint: prove the limiter
  fires (send N+1 requests, the N+1th returns 429) and the AI cost ceiling caps
  spend. Evidence: limiter (store+window+threshold) + 429 proof + max page size.
  -> invoke `/qa-only`
- **S6 agent safety** (agents/automations only) — confirm per-agent scoped
  credential (no god-key), a human approve gate on every destructive/outward
  action (propose→approve→act), untrusted input quarantined as data, egress
  allowlisted. Evidence: credential+scopes, gated-action list, quarantine method,
  egress allowlist. -> invoke `/cso`
- **S7 dependency / supply chain** — lockfile present + git-tracked; run
  `npm audit` / `bun audit` / `pip-audit` / `cargo audit`; no high/critical CVE in
  a direct prod dep; no hostile install script. Evidence: audit summary.
  -> invoke `/cso`
- **S8 output hygiene** — sample a prod error (no stack trace / DB error / path),
  debug off in prod, CSP present + no wildcard CORS + HSTS, responses caller-scoped.
  Evidence: error sample + header check. -> invoke `/security-review`

### 2.3 — Live probes (apps + live APIs, run against the deployed URL)
1. Anonymously fetch every route in `protectedRoutes` — each MUST answer
   401/403/redirect. A 200 is RED (S3, independent of the session that wrote the
   policies).
2. Anonymously hit every AI/public endpoint N+1 times — the N+1th MUST 429 (S5).
3. Capture raw responses into the S3/S5 evidence files.
   -> invoke `/qa-only`

### 2.4 — Provision production secrets safely (the manual, high-stakes step)
Never accept a plaintext secret in chat, email, or a repo. The value goes from the
**client's clipboard into the host's encrypted store**, and we verify it never
reaches code.
1. Enumerate the exact secrets each artifact needs and their placement:
   - **server-only** (service-role / admin / API keys) → host env, never
     `NEXT_PUBLIC_*` / `VITE_*` / `PUBLIC_*`.
   - **client-safe** (anon/publishable keys only).
2. Point the client at the host secret store and have them paste the value (see
   §3.2). For Vercel: Project → Settings → Environment Variables (Production).
   For Supabase: Project → Settings → API / Edge Function secrets.
3. If a secret was EVER committed, treat it as burned: have the client rotate it at
   the source, then set the new value. Note the rotation in S1 evidence.
4. Re-run S1 to confirm `findings: 0` after provisioning. -> invoke `/careful`

### 2.5 — Fix reds in place → re-run → re-write evidence
1. With `/guard` on, fix the finding in the artifact's directory only.
2. Re-run ONLY the affected control; overwrite its evidence file. A fixed finding
   without a fresh evidence file is not fixed.
3. Repeat until every applicable control for the artifact is green.
   -> invoke `/code-review`

### 2.6 — Close the gate
1. Run the gate closer — it verifies every registered artifact is G3-green, runs
   the live probes, and writes `.protocol/gates/gate-3.json` (app-engine shape,
   with git HEAD for staleness):
   ```
   gate-check 3
   ```
2. If any control cannot be proven AND tooling is genuinely down (never S1/S3), a
   single named human may attest one control — this red-banners the report and
   counts against the ≤15 intervention budget:
   ```
   gate-check 3 --attest "<name>: <control>: <reason tooling is down>"
   ```
3. Confirm completion status: **DONE** / **DONE_WITH_CONCERNS** / **BLOCKED** /
   **NEEDS_CONTEXT** (see `SKILL.md` §Completion status).
   -> invoke `/verification-before-completion`

### 2.7 — Package the client-facing security summary
1. Turn the gate result + evidence index into a one-page plain-language security
   report the owner can read (what we checked, what's proven, any residual risk).
   -> invoke `/make-pdf`

---

## 3. Client actions

Plain-language, non-technical. Everything here is either **granting access**,
**confirming intent**, or **accepting risk**. You never touch the code.

### 3.1 — Confirm the access rules (so we can prove data is locked)
For each system that holds data, tell us in one line **who is allowed to see
what**. Examples:
- "A coach sees only their own athletes — never another coach's."
- "A client logging into the portal sees only their own invoices."
- "Only the owner and the accountant can see billing."

We turn each sentence into a lock and a test that proves an outsider can't read
past it. If you skip this, we cannot prove isolation and the gate stays red.

### 3.2 — Paste the production secret (keys/passwords) — never send them to us
We will send you one exact place to paste each key. Do NOT email or message us the
value.
- **Vercel (websites/apps):** open vercel.com → your project → **Settings** →
  **Environment Variables** → **Add** → paste the value → set Environment =
  **Production** → **Save**. Tell us the *name* you used (e.g. `ANTHROPIC_API_KEY`),
  not the value.
- **Supabase (database/login):** open supabase.com → your project → **Settings** →
  **API** (for keys) or **Edge Functions → Secrets** → paste → **Save**.
- **A key that must be replaced (rotation):** if we tell you a key was exposed, log
  into that service (e.g. OpenAI, Stripe, Google), click **Regenerate / Roll key**,
  copy the NEW value, and paste it into the box above. The old one stops working —
  that's the point.

### 3.3 — Give us the access to run the live safety checks
So we can prove your protected pages reject strangers and your AI can't be run up
in a loop:
- **Vercel:** project → **Settings → Members** (or Team → Members) → **Invite** →
  add our AIS email as a **Member** → **Send invite**.
- **Supabase:** project → **Settings → Team** → **Invite** → add our AIS email →
  role **Developer** → **Send**.
- You can remove us the moment G3 is signed green.

### 3.4 — Approve narrow permissions for any agent (OAuth consent)
When an agent needs to touch Google, a CRM, or messaging, a Google/Microsoft
consent screen appears. Read the scopes — we request the **narrowest** that work
(e.g. read-only calendar, send-as one mailbox). Click **Allow** only if the scopes
match what you were told. If it asks for more than expected, click **Cancel** and
tell us — that's us catching an over-broad request.

### 3.5 — Sign the residual-risk form (if anything is not clean-green)
If we ship with any accepted risk or a break-glass attestation, you sign it in
writing first. Use the form in §5 below. Nothing with residual risk reaches your
investor package unsigned.

### 3.6 — (Only if asked) Name the break-glass attester
If a safety tool is genuinely down and a ship truly can't wait, one named person
from your side accepts responsibility for that single item in writing. This is a
fire axe, not a convenience — and it is NEVER available for leaked keys or open
data tables.

---

## 4. What we need from you (client checklist)

Copy-paste block AIS sends the client for this pillar:

```
SECURITY (G3) — WHAT WE NEED FROM YOU

[ ] ACCESS RULES — one line per system: who may see what
    (e.g. "each client sees only their own data")
[ ] SECRETS — paste each production key into the exact box we send
    (Vercel → Settings → Environment Variables → Production;
     Supabase → Settings → API / Edge Function Secrets)
    → send us the key NAME only, never the value
[ ] ROTATE — if we flag an exposed key: regenerate it at the source, paste the new one
[ ] HOST ACCESS — invite our AIS email as a Member/Developer on:
    [ ] Vercel   [ ] Supabase   [ ] other host: __________
    (so we can run the live "does it reject a stranger?" checks)
[ ] OAUTH — approve the narrow-scope consent screens for any agents (click Allow
    only if scopes match; Cancel + tell us if they ask for more)
[ ] RESIDUAL RISK — a decision-maker signs the sign-off form for any accepted risk
[ ] ATTESTER (only if requested) — name one person for break-glass
```

---

## 5. Gate evidence

What this pillar writes to turn the gate green. All under the engagement-root
`.protocol/` (never the app-engine's per-build `.protocol/`).

### 5.1 — Evidence files (one per control, per artifact)
`.protocol/evidence/gate3-<artifact>-<control>.*`:

| Control | File | Proves |
|---|---|---|
| S1 | `gate3-<artifact>-secrets.txt` | tool (`gitleaks`/`regex-fallback`), scope, `findings: 0`; rotation notes |
| S2 | `gate3-<artifact>-auth.txt` | endpoints+auth requirement; credential→scope inventory; no god-token |
| S3 | `gate3-<artifact>-rls.txt` | pgTAP `tests passed N/N` (every table, negative cases); anon-probe per protected route |
| S4 | `gate3-<artifact>-input.txt` | handler inventory (mutating = schema-validated); webhook signatures; injection scan |
| S5 | `gate3-<artifact>-abuse.txt` | per endpoint: limiter + N+1→429 proof; AI cost ceiling; max page size |
| S6 | `gate3-<artifact>-agent.txt` | per-agent scoped credential; gated destructive/outward actions; input quarantine; egress allowlist |
| S7 | `gate3-<artifact>-deps.txt` | lockfile tracked; audit `0 high, 0 critical` in direct deps |
| S8 | `gate3-<artifact>-output.txt` | error sample (no internals); debug off; CSP/CORS/HSTS |

### 5.2 — The gate file
`.protocol/gates/gate-3.json`, written by `gate-check 3` in the app-engine shape:
- **GREEN:** `{ "status": "green", "ts", "head": "<git HEAD>", "artifacts": [ { id, type, controls: { S1: {pass, evidence, tool}, … } } ] }` — every applicable control on every registered artifact `pass: true` with an evidence file.
- **RED:** `{ "status": "red", "ts", "errors": [ "<artifact>:<control>: <finding>" ], "evidence": [...] }` — lists every failing control across every artifact.
- **ATTESTED:** `{ "status": "attested", …, "attestation": { artifact, control, approver, reason } }` — treated as *not clean-green*; G4 red-banners it. Never valid for S1 or S3.
- **STALE:** green records the git HEAD; any later commit or dirty worktree makes the gate stale, and G4 treats stale as RED. Change an artifact → re-run its controls → re-close.

### 5.3 — The residual-risk sign-off form
Written to `.protocol/evidence/gate3-<artifact>-signoff.md`, one per accepted risk
or attestation, before ship:

```
RESIDUAL RISK SIGN-OFF — <artifact> — <date>
Control affected:        <S-n> — <one-line what it protects>
Finding / residual risk: <plain-language description of what is NOT fully proven>
Why we are accepting it: <business reason>
Mitigations in place:    <compensating controls>
Re-verify by:            <date / trigger — when the real check runs>
This is an ATTESTATION:  [ yes → tooling down, control named ]  [ no → accepted residual ]
                         (NEVER valid for S1 secrets or S3 data access)
Accepted by (CLIENT):    <name, role>            Signature: __________  Date: ______
Confirmed by (AIS):      <operator name>         Date: ______
```

A signed form is the only thing that lets a DONE_WITH_CONCERNS or an attested
control move past G3 toward G4 — and the INFRASTRUCTURE-REPORT carries the banner
regardless.
