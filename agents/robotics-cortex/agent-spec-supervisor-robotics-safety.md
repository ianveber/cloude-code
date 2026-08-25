# Agent Spec — supervisor-robotics-safety

## Header

| Field | Value |
|---|---|
| Agent name | `supervisor-robotics-safety` |
| Version | `0.1.0` |
| Spec author | Veta |
| Spec date | 2026-08-25 |
| Client / engagement | Veta Cortex (internal product; OEM TBD) |
| Project lead | TBD pending engagement |
| Status | `draft` |

---

## Purpose

Enforces a signed site policy on every actuator command so the cortex planner cannot move the robot unsafely, and so read-only commissioning never touches motors.

---

## Functional cluster

**Cluster name:** Safety supervisor
**Trigger:** Every `Command` emitted by the skill runtime
**Terminal output:** `SafetyVerdict` persisted to the event log; optional `hold`/`estop` command if policy requires
**Vertical:** robotics

---

## Inputs

| Input | Source | Format | Required? | Notes |
|---|---|---|---|---|
| Command | Skill runtime | `Command` JSON | yes | Typed action + magnitude |
| Observation | HAL | `Observation` JSON | yes | Pose, battery, proximity, stamp |
| Policy pack | Signed config | `PolicyPack` JSON | yes | Versioned |
| Runtime mode | Cortex runtime | `sim` / `read_only` / `write` | yes | |

**Data sensitivity:**
- [ ] PHI
- [x] PII (camera-derived identity if observation includes people flags — treat as PII)
- [ ] Privileged
- [ ] Regulated financial data
- [ ] None of the above

---

## Outputs

| Output | Destination | Format | Trigger condition | Notes |
|---|---|---|---|---|
| SafetyVerdict | Event log | JSON | Every command | `allow` / `modify` / `deny` / `estop` |
| Hold/estop command | HAL (write mode only) | `Command` | Deny/estop | Read-only: log only |
| Exception ticket | Operator loop | JSON | deny/estop or watchdog | |

**Output format note:** Verdict schema is defined in `robot_brain/types.py` (`verdict_to_dict`).

---

## Agent logic

1. Reject commands with missing fields or stale observation (`stamp` older than `watchdog_timeout_s`).
2. If mode is `read_only` or `sim`, compute the same verdict as write mode but never call `adapter.execute`.
3. If proximity < `proximity_halt_m`, verdict `estop` (or `hold` if already stopped).
4. If battery < `min_battery_pct` and command is not `dock`/`hold`/`estop`, verdict `deny` with reason `battery_reserve`.
5. If command speed exceeds `max_speed_mps`, `modify` down to cap or `deny` if command type cannot be scaled.
6. If projected pose is outside geofence, `deny`.
7. If skill is not in `allowed_skills`, `deny`.
8. Else `allow`.
9. Persist verdict. If write mode and `allow`/`modify`, execute (modified command if applicable). If `deny`/`estop` in write mode, execute `hold` or `estop` only.

**Decision thresholds:**

| Decision | Threshold | Below-threshold behavior |
|---|---|---|
| Observation freshness | `watchdog_timeout_s` | `estop` |
| Planner confidence (consumed by cortex, not supervisor) | n/a | Supervisor does not use model confidence |

---

## Tools and integrations

| Tool / system | Action type | Manifest file | Status |
|---|---|---|---|
| Robot HAL | read-write | `tool-manifest-robot-hal.md` | draft |
| Event log | write | (runtime file sink) | complete in sim |

---

## Exception handling

| Exception | Trigger | Agent behavior | Human notification |
|---|---|---|---|
| Missing required input | Null command or observation | Halt loop, `estop` verdict | Exception dashboard |
| Stale observation | Age > watchdog | `estop` | Dashboard + optional beep |
| HAL unavailable | Adapter timeout | `estop` intent, do not retry blindly | Immediate |
| Policy missing | No policy pack | Refuse to start | Block runtime |
| Geofence / speed / battery / proximity | Policy trip | `deny` or `estop` | Log every trip; ticket if N/hour |
| Duplicate estop | Repeated trips | Count; do not spam actuators | Rate-limit operator alerts |

**Exception dashboard:** `robot-brain.html` for recorded runs; live ops tool TBD per client.
**Escalation threshold:** More than 10 deny/estop events in 10 minutes → pause skill runner (supervisor stays up).

---

## Compliance flags

**Vertical compliance context:** Physical safety standards (ISO / ANSI) plus privacy if cameras are on.

| Compliance area | Applies? | Mitigation | Confirmed with client counsel? |
|---|---|---|---|
| HIPAA — PHI storage | no | | not required |
| HIPAA — PHI transmission | no | | |
| Attorney-client privilege | no | | |
| FINRA/SEC | no | | |
| GDPR / state privacy (CCPA, etc.) | yes / [STUB] until camera use confirmed | Minimize stored frames; purpose limitation | no |

Any row marked **[STUB]** blocks **write** phase, not sim.

---

## Read-only phase

**Duration:** 5–10 business days of live or bagged telemetry, commands logged only.
**Output review process:** Daily JSONL of would-be commands + verdicts; site owner reviews geofence trips.
**Sign-off criteria:**

| Criterion | Target | Measurement method |
|---|---|---|
| Supervisor agrees with human on sample | ≥ 95% | Manual review n≥30 |
| Unhandled HAL failures | 0 | Logs |
| Accidental execute() calls in read_only | 0 | Adapter audit counter |

**Sign-off required from:** Site safety owner + Veta project lead

---

## Write-access phase

**New write permissions enabled:**
- [ ] HAL — velocity / goto within policy
- [ ] HAL — dock
- [ ] HAL — hold / estop

**Monitoring during write-access phase:** First week, every deny/estop reviewed same shift.
**Rollback procedure:** Flip runtime mode to `read_only` (config); hardware e-stop if the process is wedged.

---

## Agent dependencies

| Dependency | Type | Required for | Status |
|---|---|---|---|
| HAL adapter | integration | Observation + execute | sim complete; OEM [STUB] |
| Signed policy pack | config | Verdicts | sim default pack |

---

## Known limitations and stubs

| Limitation / stub | Impact | Resolution path |
|---|---|---|
| OEM adapter not selected | Cannot write to a physical robot | Discovery: name chassis + SDK |
| 2D geofence only | No stair/cliff model | Add vertical constraints per site |
| No certified SIL rating | Not a replacement for hardware e-stop | Hardware e-stop remains primary |

---

## Operator documentation summary

- Pause skill runner vs hardware e-stop (different buttons)
- How to read a deny reason code
- Who can edit the policy pack

**Draft operator doc location:** `agents/robotics-cortex/architecture.md`

---

## Change log

| Version | Date | Author | Summary of change |
|---|---|---|---|
| 0.1.0 | 2026-08-25 | Veta | Initial draft |
