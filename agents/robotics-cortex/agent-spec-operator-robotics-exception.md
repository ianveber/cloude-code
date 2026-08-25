# Agent Spec — operator-robotics-exception

## Header

| Field | Value |
|---|---|
| Agent name | `operator-robotics-exception` |
| Version | `0.1.0` |
| Spec author | Veta |
| Spec date | 2026-08-25 |
| Client / engagement | Veta Cortex |
| Project lead | TBD |
| Status | `draft` |

---

## Purpose

Turns supervisor denies, planner holds, and HAL faults into a structured queue a human can work without reading raw logs.

---

## Functional cluster

**Cluster name:** Exception and operator loop
**Trigger:** Verdict in `{deny, estop}` or planner exception or HAL fault
**Terminal output:** Ticket with suggested action `teleop` / `abort` / `retry` / `technician`
**Vertical:** robotics

---

## Inputs

| Input | Source | Format | Required? | Notes |
|---|---|---|---|---|
| SafetyVerdict | Supervisor | JSON | when safety | |
| Planner exception | Cortex | JSON | when plan | |
| Observation snapshot | HAL | JSON | yes | |

---

## Outputs

| Output | Destination | Format | Trigger condition | Notes |
|---|---|---|---|---|
| Ticket | Event log + dashboard | JSON | Each exception | Deduplicate by reason+window |

---

## Agent logic

1. Map reason codes to suggested action (`proximity` → `teleop` or wait; `battery_reserve` → `retry` after dock; `stale_observation` → `technician`).
2. Deduplicate identical reason within 30s.
3. If volume exceeds escalation threshold, set fleet flag `skill_runner_paused`.

---

## Tools and integrations

| Tool / system | Action type | Manifest file | Status |
|---|---|---|---|
| Event log | write | runtime | complete in sim |

---

## Exception handling

This agent *is* the exception path. If ticket serialization fails, write a minimal fallback line to stderr and crash the ticket writer only — never disable the supervisor.

**Escalation threshold:** 10 tickets / 10 minutes → pause skill runner.

---

## Compliance flags

Same as supervisor. Tickets must not dump raw camera frames by default.

---

## Read-only phase

Tickets are produced from simulated and live-read-only runs. Operators practice the queue before write.

---

## Write-access phase

No actuator writes from this agent.

---

## Known limitations and stubs

| Limitation / stub | Impact | Resolution path |
|---|---|---|
| No Slack/PagerDuty sink yet | Tickets only in JSONL/HTML | Per-client tool manifest |
| Dedup is in-process | Restart may re-alert | Persist ticket ids |

---

## Change log

| Version | Date | Author | Summary of change |
|---|---|---|---|
| 0.1.0 | 2026-08-25 | Veta | Initial draft |
