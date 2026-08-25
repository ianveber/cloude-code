# Veta Cortex — Software brain architecture

Last updated: 2026-08-25
Status: draft — simulation runtime is live; OEM adapters are stubs until discovery names the chassis.

---

## What we own vs what the OEM owns

| Layer | Owner | Lives where | May call an LLM? |
|---|---|---|---|
| Motors, kinematics, balance, vendor locomotion | OEM | Robot firmware / vendor stack | No |
| Sensors as bytes (lidar, IMU, camera, battery) | OEM | Drivers | No |
| **Hardware abstraction (HAL)** | Veta | Adapter process | No |
| **Safety supervisor** | Veta | On-robot, always on | **No** |
| **Skill runtime** | Veta | On-robot | No |
| **Cortex planner** | Veta | On-robot or cloud | Yes — proposals only |
| Work orders, operators, exception dashboard | Veta | Ops tools | Optional |

Invariant: **no planner output reaches actuators unless the supervisor returns `allow` or a constrained `modify`.** In `read_only` mode the supervisor records the verdict and **never** calls `adapter.execute`.

```
Work order  →  Cortex (plan)  →  Intent (skills)
                                      ↓
Observation ← HAL ← OEM sensors    Supervisor
                                      ↓
                               allow / deny / estop
                                      ↓
                         write mode: HAL.execute
                         read_only: log only
```

---

## Modes

| Mode | Sensors | Supervisor | Actuators |
|---|---|---|---|
| `sim` | Simulated | Full policy | Simulated only |
| `read_only` | Live or bag | Full policy | Command sink is a log |
| `write` | Live | Full policy | OEM adapter after sign-off |

Promotion `read_only` → `write` requires the sign-off table in `agent-spec-supervisor-robotics-safety.md`.

---

## Control loop (on-robot)

1. HAL produces an `Observation` (pose, battery, proximity, stamp, mode flags).
2. Cortex consumes observation + active work order → `Intent` (skill id + params + confidence).
3. Skill runtime turns intent into one or more `Command`s (typed: `velocity`, `goto`, `dock`, `hold`, `estop`).
4. Supervisor evaluates each command against the signed `PolicyPack`.
5. If mode is `write` and verdict is `allow`/`modify`, HAL executes. Otherwise log.

Loop rate: supervisor and HAL at 10–50 Hz. Cortex planner may run slower (1 Hz or event-driven). Never block the supervisor on a model call.

---

## Policy pack (signed)

Stored as versioned JSON, signed by the site owner:

- `max_speed_mps`, `max_accel_mps2`
- `geofence` polygon in site frame
- `min_battery_pct` (reserve for dock)
- `proximity_halt_m`
- `watchdog_timeout_s`
- `allowed_skills`
- `mode`

Changing policy is a controlled edit — not a prompt.

---

## Failure philosophy

Matches `docs/principles.md`: no silent failures. Supervisor deny/estop is success of the safety system, not a crash. Unhandled: HAL timeout with no hold command, or planner writing directly to the OEM SDK (forbidden).

---

## Repository map

| Path | Role |
|---|---|
| `robot_brain/` | Runtime (Python, stdlib) |
| `agents/robotics-cortex/` | Specs and manifests |
| `verticals/robotics/playbook.md` | Vertical commercial playbook |
| `robot-brain.html` | Operator view of a recorded run |
