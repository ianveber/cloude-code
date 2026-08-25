# Vertical Playbook — Robotics (Veta Cortex)

**Subtypes in scope:** Indoor service / inspection / logistics robots (AMRs, humanoids with vendor SDKs, telepresence, facility patrol) where Veta owns the **software brain** and the OEM owns motors, kinematics, and low-level firmware.
**Out of scope for this playbook:** Designing robot hardware, writing motor controllers, surgical robots, weapons systems, vehicles on public roads (separate regulatory stack).

Last updated: 2026-08-25
Engagements completed in this vertical: 0 (first-run baseline)

---

## The business reality

Robot companies sell bodies. The buyer then discovers the body is not a business: it cannot take a work order, refuse an unsafe command, escalate an exception to a human, or improve across a fleet. OEM "autonomy" is usually a demo stack (vendor app + cloud account + a few scripted skills) that the operator cannot own or extend.

The operational failures are consistent:

- **Vendor lock on the brain:** Skills, maps, and task logic live in the OEM cloud. Switching hardware later means rewriting operations. The asset that compounds (task data, exception patterns, site maps, operator playbooks) is trapped.
- **Unsafe by default at the application layer:** Low-level e-stop exists. Application-layer policy does not: geofences, battery reserves, payload limits, "never act without a signed intent," dual-control for high-risk skills. Operators invent tribal rules that are not enforced in software.
- **No read-only commissioning:** Robots go from demo to live actuators in one step. There is no period where the brain proposes motions and a human signs off before writes.
- **Silent skill failure:** When a patrol, dock, or inspect skill fails, the robot idles or retries blindly. Nothing lands in an exception dashboard with pose, sensor snapshot, and a recommended human action.
- **Fleet without an OS:** Multi-robot sites get a vendor dashboard of battery % and "online." They do not get a shared skill registry, shared safety policy, or a single operator protocol.

The decision-maker is typically the founder/COO of the robot business, a facilities ops lead, or a warehouse/site manager. Close on **owning the intelligence layer** — not on replacing the OEM.

**Positioning sentence:** We do not build robots. We install a Veta-owned brain on the robots you already have: perception in, signed intents out, safety supervisor always between cortex and actuators.

---

## Functional clusters available for automation

Ranked by operational leverage:

### Cluster 1 — Safety supervisor (non-negotiable; ships first)

**What it is:** A hard policy layer that every actuator command must pass. Independent of the LLM/cortex. Can halt the robot without asking the planner.

**What we automate:**
- `supervisor-robotics-safety`: geofence, max speed / acceleration, proximity halt, battery reserve, watchdog, mode gate (read-only vs write)
- Command log: every proposed command is recorded with verdict `allow` / `modify` / `deny` / `estop`

**Value framing:** This is the insurance and commissioning layer. Without it, we do not connect the brain to motors.

### Cluster 2 — Task cortex (work orders → skills)

**What it is:** High-level work ("patrol north wing," "inspect dock 4," "return to charger") becomes a skill graph with preconditions, not a prompt dumped into teleop.

**What we automate:**
- `cortex-robotics-plan`: maps a work order + latest observation into a skill sequence
- Skill registry: `idle`, `goto`, `patrol`, `inspect`, `dock`, `hold` — each with input schema and abort conditions
- Confidence thresholds: below-threshold plans go to the operator, not to actuators

**Value framing:** Operators stop "driving" robots and start assigning jobs. Cycle time and coverage become measurable.

### Cluster 3 — Exception and operator loop

**What it is:** When a skill cannot complete (blocked aisle, localization lost, sensor disagreement), the brain stops, holds pose if safe, and opens a human-review item with context.

**What we automate:**
- `operator-robotics-exception`: structured tickets (pose, last command, sensor flags, suggested next action: teleop / abort / retry / send technician)
- Escalation: N exceptions / hour pauses the fleet skill runner (not the safety supervisor)

**Value framing:** Replaces "the robot is stuck and nobody knows" with a queue a night-shift operator can work.

### Cluster 4 — Fleet + site memory (retainer / Tier 2)

**What it is:** Maps, no-go zones, skill success rates, and per-site quirks compound across robots. This is the moat — not the chassis.

**What we automate:** Shared policy pack per site, skill metrics, replay of denied commands for training.

**Best fit:** After a single-robot read-only + write commissioning on one platform.

---

## Integration map

| System | Category | Prevalence | Integration method | Notes |
|---|---|---|---|---|
| Vendor SDK (Unitree, Boston Dynamics Spot, Agility, etc.) | Locomotion + sensors | Varies by fleet | Native SDK → Veta HAL adapter | Adapter is per OEM; brain is not |
| ROS 2 | Middleware | Common in inspection / research fleets | Topics/services → HAL | Prefer ROS 2 Humble+; do not put LLM on the realtime loop |
| PLC / facility I/O | Doors, conveyors, interlocks | Warehouses | OPC-UA / vendor API | Treat as write-dangerous; read-only first |
| Fleet telematics (OEM cloud) | Status | Default from OEM | REST / MQTT | Use for observability; do not make it the planner of record |
| WMS / CMMS / ticketing | Work orders | If the robot does real work | REST | Work-order in, exception out |
| Veta Cortex runtime | Brain | This product | On-robot companion + optional cloud cortex | Cloud may plan; on-robot supervisor is authoritative for actuators |

**Integration complexity tiers:**
- Simulation adapter only: fastest — used for every engagement's read-only phase even when hardware exists
- ROS 2 HAL: moderate — well-documented, still needs site-specific frames and topics
- Closed OEM SDK with no sandbox: highest — flag extra commissioning time; insist on a vendor developer kit or recorded bag files

**Adjacent ecosystem (not competition):** OEM autonomy stacks (Spot's GraphNav, AMR vendor "missions"), Nvidia Isaac, Open-RMF. We sit **above** locomotion and **beside** facility systems. We do not replace inverse kinematics. When a prospect says "the robot already has AI," ask: "Can you change the safety policy and skill graph without a vendor ticket?"

---

## Compliance considerations

Robotics is physical harm, not just data.

Before write-access to actuators:
- [ ] Site risk assessment: humans in workspace? public access? payload hazards?
- [ ] E-stop path tested independently of Cortex (hardware e-stop still works if the brain dies)
- [ ] Geofence and max-speed signed by the site owner
- [ ] Read-only phase completed against recorded or live telemetry with **zero** actuator writes
- [ ] GDPR/PII if cameras record identifiable people — retention and purpose limitation documented
- [ ] ISO 10218 / ISO 3691-4 / ANSI R15.08 awareness: we are not a notified body; client's safety officer owns certification; we implement the policy they sign
- [ ] No dual-use / weapons tasking — refuse those work orders in software and in contract

**Credential handling:** OEM cloud keys and robot SSH never in git. Secrets manager only.

---

## Pricing guidance

| Cluster | Tier | Price range | Key value anchor |
|---|---|---|---|
| Safety supervisor + sim commissioning | Tier 1 | $22K–$40K | Insurance to go live; avoided incident + OEM lock-in |
| Cortex + skill pack (one robot class) | Tier 1 | $28K–$48K | Operator hours + coverage of a defined job (patrol/inspect) |
| Exception loop + operator dashboard | add-on | $12K–$22K | Night-shift headcount / missed tickets |
| Fleet OS (multi-robot, shared policy) | Tier 2 | $70K–$130K | N robots × avoided vendor lock + shared site memory |

**Discount discipline:** Do not skip the safety cluster to "just hook up GPT." If they only want a prompt on a joystick, decline.

---

## Discovery questions

**Hardware and OEM:**
- "Which robot models are on site, and which vendor app do operators use today?"
- "Do you have SDK or ROS access, or only the consumer app?"
- "Is there a hardware e-stop that works with the brain powered off?"

**Jobs to be done:**
- "Walk me through one successful robot shift, minute by minute."
- "What does the robot do when it gets stuck? Who gets the call?"
- "Which jobs are scripted vs teleoperated vs not attempted?"

**Safety:**
- "Are people in the same space? Any no-go zones that exist only as a verbal rule?"
- "What is the worst credible incident on this site?"

**Ownership:**
- "If you swapped the chassis in 18 months, which software would you need to keep?"

---

## Common objections and responses

**"The OEM already has autonomy."**
Yes — for locomotion and a few missions. We replace the application brain: work orders, policy, exceptions, ownership. Keep their walking stack.

**"We'll just put an LLM on the robot."**
LLMs do not belong on the actuator path. Cortex may propose; supervisor must approve. Read-only first.

**"We need it on the live robot this week."**
Then we still run read-only against live sensors and a simulated command sink. Write access is a signed milestone, not a calendar wish.

**"Can you support every humanoid?"**
We support a HAL. Each OEM is an adapter. The second chassis is cheaper than the first if the brain is ours.

---

## Post-engagement update protocol

After each robotics engagement, append: OEM + adapter difficulty, which skills actually ran, incident/near-miss (if any), and policy pack changes. Update the HAL adapter list and the skill registry. Baseline sections are hypotheses; logs are evidence.

---

## Product name

**Veta Cortex** — the software brain. Hardware remains the OEM's. Cortex is specified in `agents/robotics-cortex/` and implemented in `robot_brain/`.
