# Agent Spec — cortex-robotics-plan

## Header

| Field | Value |
|---|---|
| Agent name | `cortex-robotics-plan` |
| Version | `0.1.0` |
| Spec author | Veta |
| Spec date | 2026-08-25 |
| Client / engagement | Veta Cortex |
| Project lead | TBD |
| Status | `draft` |

---

## Purpose

Turns a work order plus the latest observation into a skill intent the runtime can execute — or a human-review item when confidence is too low.

---

## Functional cluster

**Cluster name:** Task cortex
**Trigger:** New work order, or skill completion / abort requiring replan
**Terminal output:** `Intent` with `skill_id`, `params`, `confidence`
**Vertical:** robotics

---

## Inputs

| Input | Source | Format | Required? | Notes |
|---|---|---|---|---|
| Work order | Operator / WMS | `{id, job, target?}` | yes | |
| Observation | HAL | `Observation` | yes | |
| Skill catalog | Runtime | named skills | yes | |
| Policy allowed_skills | Policy pack | list | yes | Planner must not propose disallowed skills |

**Data sensitivity:** PII possible if job text includes names/locations of people.

---

## Outputs

| Output | Destination | Format | Trigger condition | Notes |
|---|---|---|---|---|
| Intent | Skill runtime | JSON | Plan succeeds | |
| Exception | Operator | JSON | Low confidence or unknown job | No command stream |

---

## Agent logic

1. Normalize work order `job` to a catalog skill (`idle`, `goto`, `patrol`, `inspect`, `dock`, `hold`).
2. If unknown job → exception, intent `hold`.
3. Fill params (e.g. `goto` needs `x,y`; missing → exception).
4. If observation.battery_pct < policy reserve and job is not `dock`, propose `dock` instead of the job (safe default).
5. Attach confidence: 1.0 for exact catalog match; 0.4 for fuzzy/unknown.
6. If confidence < 0.7 → do not send skill commands; emit `hold` + exception.
7. Skill runtime expands intent to commands; supervisor still gates every command.

**Decision thresholds:**

| Decision | Threshold | Below-threshold behavior |
|---|---|---|
| Skill classification | 0.7 | `hold` + operator ticket |

---

## Tools and integrations

| Tool / system | Action type | Manifest file | Status |
|---|---|---|---|
| Skill catalog | read | (in-process) | complete in sim |
| Optional LLM | read | [STUB] not on actuator path | unused in v0.1 |

v0.1 uses deterministic catalog matching only. An LLM may later propose skill ids; it still cannot bypass the supervisor.

---

## Exception handling

| Exception | Trigger | Agent behavior | Human notification |
|---|---|---|---|
| Unknown job | No catalog match | `hold` | Ticket with raw job text |
| Missing params | e.g. goto without x,y | `hold` | Ticket |
| Disallowed skill | Not in policy | `hold` | Ticket |
| Low battery | Reserve trip | Replan to `dock` | Info, not alarm unless dock fails |

**Exception dashboard:** same as supervisor.
**Escalation threshold:** 10 unknown jobs / hour → pause new work orders.

---

## Compliance flags

| Compliance area | Applies? | Mitigation | Confirmed with client counsel? |
|---|---|---|---|
| HIPAA — PHI storage | no | | not required |
| HIPAA — PHI transmission | no | | |
| Attorney-client privilege | no | | |
| FINRA/SEC | no | | |
| GDPR / state privacy | [STUB] | Job text retention policy | no |

---

## Read-only phase

Planner runs fully. Intents and would-be commands are logged. No actuator writes.
**Duration:** same window as supervisor.
**Sign-off:** sampled jobs produce the skill a competent operator would have chosen, ≥ 95%.

---

## Write-access phase

No new permissions for this agent. Write is entirely HAL via supervisor.

---

## Agent dependencies

| Dependency | Type | Required for | Status |
|---|---|---|---|
| supervisor-robotics-safety | downstream | Command gate | spec'd |
| operator-robotics-exception | downstream | Low confidence | spec'd |

---

## Known limitations and stubs

| Limitation / stub | Impact | Resolution path |
|---|---|---|
| No LLM in v0.1 | Natural language jobs must match catalog keywords | Phase 2: LLM proposal layer |
| Single-skill intents | No multi-step graphs yet | Skill graph in fleet OS cluster |
| OEM TBD | Site frames unknown | Discovery |

---

## Operator documentation summary

How to phrase work orders that match the catalog; how to force `hold`.

---

## Change log

| Version | Date | Author | Summary of change |
|---|---|---|---|
| 0.1.0 | 2026-08-25 | Veta | Initial draft |
