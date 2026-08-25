# Tool Manifest — Robot HAL

## Header

| Field | Value |
|---|---|
| Tool / system name | Veta Robot HAL |
| Provider / vendor | Veta adapter over OEM / ROS 2 / simulation |
| Version / API version | 0.1.0 |
| Manifest author | Veta |
| Manifest date | 2026-08-25 |
| Client / engagement | Veta Cortex |
| Agent(s) using this tool | supervisor-robotics-safety, cortex-robotics-plan |
| Status | `draft` |

---

## What this tool does in this engagement

The HAL is the only process allowed to talk to OEM locomotion and sensors. Cortex and skills never import vendor SDKs. Simulation adapter is the default until an OEM is named.

---

## Access type

| Permission level | Granted? | Scope |
|---|---|---|
| Read | yes | Observation stream |
| Write | yes — write mode only | Commands after supervisor allow |
| Delete | no | |
| Admin / configuration | no | |

---

## Authentication

| Field | Value |
|---|---|
| Auth method | OEM-specific — [STUB] until chassis named |
| Token scope | [STUB] |
| Token storage location | secrets manager — never git |
| Token rotation policy | [STUB] |
| Credential owner | Client robot admin |

---

## Endpoints and operations used

| Operation | Method | Endpoint / query | Purpose | R/W | Notes |
|---|---|---|---|---|---|
| observe | in-process | `HardwareAdapter.observe()` | Snapshot | R | |
| execute | in-process | `HardwareAdapter.execute(cmd)` | Actuate | W | Forbidden in read_only |
| estop | in-process | `Command(type=estop)` | Safe stop | W | Also hardware button |

OEM SDK rows are **[STUB]** until discovery.

---

## Rate limits and quotas

| Limit type | Value | What happens at limit | Mitigation |
|---|---|---|---|
| Observe rate | 10–50 Hz | Jitter | Supervisor watchdog |
| Execute rate | Bound to observe | Command pileup | Drop to hold |

---

## Data touched

| Field name | Data type | R/W | PII? | PHI? | Privileged? | Notes |
|---|---|---|---|---|---|---|
| pose x,y,yaw | float | R | no | no | no | Site frame |
| battery_pct | float | R | no | no | no | |
| proximity_m | float | R | no | no | no | Min obstacle distance |
| camera frames | bytes | R | yes | no | no | Not stored by default |

---

## Failure modes

| Failure mode | Cause | Detection | Agent response |
|---|---|---|---|
| API unavailable | OEM disconnect | Timeout / exception | estop verdict, no blind retry |
| Authentication failure | Bad OEM token | 401 | Halt, alert lead |
| Rate limit | Vendor quota | 429 | Hold, back off |
| Malformed observation | Driver bug | Schema validation | estop |
| Partial write | Command ack missing | Missing ack | Treat as fail, hold |

---

## Compliance notes

| Area | Finding | Action required |
|---|---|---|
| HIPAA BAA | not applicable unless healthcare site cameras | confirm per site |
| Encryption in transit | [STUB] OEM dependent | confirm |
| Encryption at rest | logs on disk | restrict permissions |
| SOC 2 | Veta process [STUB] | |
| GDPR / CCPA | cameras | [STUB] |

---

## Sandbox / test environment

| Field | Value |
|---|---|
| Sandbox available? | yes — `SimulationAdapter` |
| Sandbox URL / credentials location | in-process |
| Sandbox data policy | synthetic |
| Parity with production | kinematics simplified (unicycle) |

---

## Known issues and limitations

| Issue | Impact | Workaround / notes |
|---|---|---|
| OEM adapter not implemented | No physical write | Sim + read_only log sink |
| Unicycle model | Humanoids will need a different execute mapping | New adapter, same Command types |

---

## Deprecation and offboarding

- [ ] Revoke OEM credentials
- [ ] Remove robot from fleet policy
- [ ] Archive this manifest

---

## Change log

| Version | Date | Author | Summary |
|---|---|---|---|
| 0.1.0 | 2026-08-25 | Veta | Initial draft |
