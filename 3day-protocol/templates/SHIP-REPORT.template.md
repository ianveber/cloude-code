<!--
  SHIP-REPORT.template.md — rendered by `gate-check 3` on green.
  Placeholder conventions (consumed by the renderer in bin/gate-check):
    {{NAME}}                    scalar substitution
    {{#SECTION}}...{{/SECTION}} block: rendered once if present/true, omitted otherwise;
                                for table rows, repeated per item
    {{^SECTION}}...{{/SECTION}} inverse block: rendered only when SECTION is absent/empty
  This comment block is stripped from the rendered report.
-->
# SHIP REPORT — {{PROJECT_NAME}}

**Delivered:** {{SHIP_DATE}} · **Production URL:** {{PROD_URL}} · **Run duration (protocol-active):** {{RUN_DURATION}}
**Operator:** {{OPERATOR_NAME}} · **Protocol version:** {{PROTOCOL_VERSION}}

{{#HAS_OVERRIDES_OR_ATTESTATIONS}}
> 🟥 **ATTENTION — THIS RUN CONTAINS OVERRIDES OR ATTESTATIONS** 🟥
> One or more gates were passed by human override or break-glass attestation
> instead of full verification. Details in the
> [Overrides & attestations](#overrides--attestations) section below. This
> banner cannot be removed except by re-running the affected gates to a true
> green.
{{/HAS_OVERRIDES_OR_ATTESTATIONS}}

---

## 1. What was built

{{WHAT_WAS_BUILT_SUMMARY}}

| | |
|---|---|
| Core actors | {{ACTORS}} |
| Core actions | {{CORE_ACTIONS}} |
| Stack | Next.js {{NEXT_VERSION}} · Supabase (project `{{SUPABASE_REF}}`) · Vercel (`{{VERCEL_PROJECT}}`) |
| Spec | `.protocol/spec.json` (Gate 0 evidence: {{SPEC_EVIDENCE_LINK}}) |
| Repo HEAD at ship | `{{SHIP_HEAD}}` |

## 2. Gates

| Gate | Scope | Status | Passed at | Approver | Evidence |
|---|---|---|---|---|---|
| 0 — Spec & provisioning | spec.json valid, tools + accounts ready | {{GATE0_STATUS}} | {{GATE0_TS}} | — | {{GATE0_EVIDENCE_LINKS}} |
| 1 — Design | lint subset + human sign-off | {{GATE1_STATUS}} | {{GATE1_TS}} | {{GATE1_APPROVER}} | {{GATE1_EVIDENCE_LINKS}} |
| 2 — Security | pgTAP RLS, secrets, env, bundle, input validation | {{GATE2_STATUS}} | {{GATE2_TS}} | {{GATE2_APPROVER}} | {{GATE2_EVIDENCE_LINKS}} |
| 3 — Deploy verification | live 200s, smoke, PostgREST probe, lint re-run | {{GATE3_STATUS}} | {{GATE3_TS}} | — | {{GATE3_EVIDENCE_LINKS}} |

All evidence files live in `.protocol/evidence/` and ship with this report.

## 3. Security results

### 3.1 RLS — pgTAP (local shadow db, pre-deploy)

- Tests run: **{{PGTAP_TOTAL}}** · Passed: **{{PGTAP_PASSED}}** · Failed: **{{PGTAP_FAILED}}**
- Tables covered: {{PGTAP_TABLES_COVERED}} / {{TABLE_COUNT}} (deny-by-default negative cases included for every table)
- Suite source: {{PGTAP_SUITE_SOURCE}} · Runtime: {{PGTAP_RUNTIME}}
- Full TAP output: {{PGTAP_EVIDENCE_LINK}}

### 3.2 RLS — PostgREST anon-key probe (deployed proof)

Direct requests against the production database REST endpoint using ONLY the
anon key. Expected result for every protected table: **denied**.

| Table | Operation probed | Expected | Observed | Result |
|---|---|---|---|---|
{{#PROBE_ROWS}}
| `{{TABLE}}` | {{OPERATION}} | {{EXPECTED}} | {{OBSERVED}} | {{RESULT}} |
{{/PROBE_ROWS}}

Probe transcript: {{PROBE_EVIDENCE_LINK}}

### 3.3 Secrets, env, and bundle

| Check | Tool | Result | Detail |
|---|---|---|---|
| Repo secret scan | {{SECRETS_TOOL}} | {{SECRETS_RESULT}} | {{SECRETS_DETAIL}} |
| `NEXT_PUBLIC_*` env audit (`.env*` + `vercel env ls`) | gate-check | {{ENV_RESULT}} | {{ENV_DETAIL}} |
| Built-bundle scan (`.next/static`) | gate-check | {{BUNDLE_RESULT}} | {{BUNDLE_DETAIL}} |
| Input validation heuristics (route handlers) | gate-check | {{INPUT_VALIDATION_RESULT}} | {{INPUT_VALIDATION_DETAIL}} |

## 4. Design lint results

| Run | Target | Contrast (axe) | Type-scale tokens | Asset resolution | Hero heuristic | Report |
|---|---|---|---|---|---|---|
| Gate 1 | approved design variant | {{G1_CONTRAST}} | {{G1_TYPESCALE}} | {{G1_ASSETS}} | {{G1_HERO}} | {{G1_LINT_LINK}} |
| Gate 3 | built app ({{PROD_URL}}) | {{G3_CONTRAST}} | {{G3_TYPESCALE}} | {{G3_ASSETS}} | {{G3_HERO}} | {{G3_LINT_LINK}} |

Design sign-off: **{{GATE1_APPROVER}}** on {{GATE1_TS}}.

## 5. Overrides & attestations

{{^HAS_OVERRIDES_OR_ATTESTATIONS}}
None. Every gate reached true green through full verification. ✅
{{/HAS_OVERRIDES_OR_ATTESTATIONS}}
{{#HAS_OVERRIDES_OR_ATTESTATIONS}}
> 🟥🟥🟥 **RED FLAG SECTION — READ BEFORE ACCEPTING THIS DELIVERY** 🟥🟥🟥

{{#ATTESTATIONS}}
### ⛔ Gate {{GATE_N}} ATTESTED (break-glass) — not verified

- **Attested by:** {{ATTESTER}}
- **Reason given:** {{ATTEST_REASON}}
- **Timestamp:** {{ATTEST_TS}}
- **What this means:** the checks for this gate did NOT run to completion. A
  named human accepted personal responsibility for shipping without that
  verification. Re-verification is REQUIRED as soon as tooling permits.
- **Re-verification status:** {{REVERIFY_STATUS}}
{{/ATTESTATIONS}}

{{#FORCED_ADVANCES}}
### ⚠️ Forced advance past gate {{GATE_N}}

- **Forced by:** {{FORCER}} · **Reason:** {{FORCE_REASON}} · **Timestamp:** {{FORCE_TS}}
{{/FORCED_ADVANCES}}
{{/HAS_OVERRIDES_OR_ATTESTATIONS}}

## 6. Cost envelope

| Item | Value |
|---|---|
| Claude usage (run total) | {{CLAUDE_COST}} ({{COST_SOURCE}}) |
| Supabase tier | {{SUPABASE_TIER}} |
| Vercel tier | {{VERCEL_TIER}} |
| Other run costs | {{OTHER_COSTS}} |
| **Total run cost** | **{{TOTAL_COST}}** |
| Est. monthly operating cost | {{MONTHLY_ESTIMATE}} |

## 7. Interventions

- **Count this run: {{INTERVENTION_COUNT}} / 15 budget** — {{INTERVENTION_VERDICT}}
- Breakdown: {{FORCE_COUNT}} forced advance(s), {{ATTEST_COUNT}} attestation(s), {{NOTE_COUNT}} logged note(s), {{CHAT_CORRECTION_COUNT}} operator chat correction(s)

{{#INTERVENTION_ROWS}}
| {{TS}} | {{TYPE}} | {{DETAIL}} |
{{/INTERVENTION_ROWS}}

Full journal: `.protocol/journal.jsonl`

## 8. Credentials handling

| Credential | Where it lives | Who holds it | Rotation note |
|---|---|---|---|
{{#CREDENTIAL_ROWS}}
| {{CRED_NAME}} | {{CRED_LOCATION}} | {{CRED_HOLDER}} | {{CRED_ROTATION}} |
{{/CREDENTIAL_ROWS}}

Rules applied during the run: no secrets in code or chat; service-role key
never client-exposed (verified in §3.3); all env vars set via `vercel env` /
Supabase dashboard, never committed.

## 9. How to change things

| You want to… | Do this |
|---|---|
| Change copy / content | {{CHANGE_CONTENT_HOWTO}} |
| Change design / styling | {{CHANGE_DESIGN_HOWTO}} — re-run `gate-check 1` if structural |
| Add a feature or table | Update `.protocol/spec.json`, build, then `gate-check 2` MUST re-run before any deploy (the deploy hook enforces this) |
| Deploy an update | commit → `gate-check 2` → `vercel deploy --prod` → `gate-check 3` |
| Manage users / data | {{ADMIN_HOWTO}} |
| Get support | {{SUPPORT_CONTACT}} |

---

*Generated by the 3-Day App Protocol (`gate-check 3`) on {{RENDER_TS}}. Gate
state and journal for this run are preserved in `.protocol/`.*
