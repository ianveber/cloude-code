# Meeting brief — LimX Luna × coating industry

**Product:** [LimX Luna](https://www.limxdynamics.com/en/products/luna) — 160 cm interactive humanoid, 27 DoF, ~56 kg, **3 kg max arm payload**, ~4 h battery, textile exterior, RGB camera, LimX UP / LimX Studio.
**Sibling to ask about:** LimX **Oli** (their general-purpose humanoid). Luna is the show/interaction SKU (malls, museums, stages, dance, swarm shows). Oli is the closer cousin if they have any industrial story.
**Our angle:** Veta Cortex on their body — we own the job brain; they own locomotion. We do **not** try to replace an ATEX paint arm with a textile humanoid inside a solvent booth.

## Reality check before you sit down

| Coating-line need | Luna as published |
|---|---|
| Spray gun + hoses often 5–15 kg | **3 kg** arm payload |
| Repeatability ~±0.05–0.2 mm on a path | Humanoid walking base; not a paint-arm spec |
| ATEX / IECEx / Class I for solvent booths | **Not listed** |
| IP65–IP67, solvent wipe-down | **Not listed**; premium textile skin |
| Shift length 8–16 h | ~**4 h**, swap batteries |
| Tool flange / gun mount / grounding for electrostatic | Optional hand; no industrial toolchanger on the spec sheet |
| Perception for film thickness / defects | RGB camera only on the spec sheet (no lidar/depth called out) |
| Secondary development / on-robot brain | FAQ lists “secondary development” as a topic — **force a yes/no + SDK license** |

**Do not** open with “we want Luna to spray cars.” Open with: which jobs on a coating line are **outside the classified booth** and still expensive (racking, inspection, masking, sanding assist, QC photos, kitting, booth-adjacent handling). If they insist the job is *inside* a solvent spray zone, Luna is the wrong chassis — ask them to say that out loud and pivot to Oli, a paint-arm partner, or a split architecture (fixed Ex arm + humanoid for peri-booth work).

---

## Ask this, in this order

### 1. Kill-or-continue (first 8 minutes)

If these fail, the rest of the meeting is tourism.

1. **Which coating process?** Liquid solvent, waterborne, powder, e-coat, coil, wood/furniture, architectural, pipe/tank, automotive refinish?
2. **Is the target station inside a classified hazardous zone?** (ATEX zone 1/2, IECEx, NEC Class I). What does their safety officer already require on that floor?
3. **What is the actual job, minute by minute, for one part?** Load → mask → spray → flash → cure → inspect → pack. Where would a humanoid stand?
4. **Why a humanoid and not a 6-axis paint robot?** (ABB/FANUC/Yaskawa paint cells already exist.) What did they try and fail?
5. **Luna vs Oli vs a paint-arm SKU they have in the pipeline?** Who on their side owns industrial vs entertainment?

Walk-away line if they only sell Luna-for-stages: “Then we need a different LimX SKU or a different OEM for the booth. We can still talk SDK for a non-booth cell.”

### 2. Process and economics (the coating owner’s language)

6. Part size, weight, hang orientation (jig/rack/skid)? Cycle time today?
7. Mix: high-volume same SKU vs high-mix low-volume? (Humanoids lose to fixed arms on identical paths; they only win on **changeover** and **unstructured** peri-process work.)
8. First-pass yield / rework / orange peel / runs / holidays — who inspects, with what (eye, DFT gauge, camera)?
9. VOC, overspray, humidity, booth temperature, powder dust — **hours of exposure per shift** at the proposed station.
10. What does a missed coating defect cost (scrap, recode, warranty, customer chargeback)?
11. Headcount on the line, shifts, wage + PPE + medical surveillance for painters.

### 3. Hardware fit (use their spec sheet against them)

12. **3 kg payload:** which tool? HVLP gun, powder pump, DFT gauge, camera rig, part? Weight of gun + hose + fittings **at full extension**.
13. Reach: arm length 69 cm with hand — can it cover the part without walking (walking while spraying is a quality killer)?
14. Wrist: spec is mostly yaw at the wrist — can they mount a spray wrist / clocking for fan pattern?
15. IP rating, sealing, wash-down, chemical compatibility of **textile** vs solvents/powder.
16. Grounding / electrostatic powder or solvent electrostatic — is the body a spark/static risk?
17. Floor: grated booths, pits, wet floors, cable trays — biped vs rail.
18. Battery swap in a dirty room; charger 58.8 V in a classified area (usually **no**).
19. Fall mitigation vs a wet, paint-slick floor; recovery procedure; who picks it up.
20. End effector: fist vs 5-finger (optional). For coating we need a **flange + toolchanger**, not a handshake.

### 4. Software — this is our Cortex conversation

21. **Does Luna support secondary development on-device?** Real-time joint command, Cartesian, whole-body, or only Studio choreography?
22. LimX UP vs Studio vs COSA vs cloud mocap — **what is allowed without their cloud?**
23. SDK: ROS 2, gRPC, C++/Python, rate (Hz), license, NDA, export control.
24. Can we **disable** their AI task editor / natural-language dance stack in production?
25. Can we run **read-only**: we subscribe to state, we do not command actuators, for N days?
26. E-stop chain: hardware button, their “external force sensing,” our supervisor — **who is last to the motors?**
27. Localization: RGB only — how do they hold a spray standoff of ~150–250 mm on a moving line?
28. Repeatability and path speed stability (coating thickness is speed × flow). Numbers, not demos.
29. Data residency: video of customer parts leaving China cloud?
30. Swarm/group control is for shows — is there a **fleet API for work orders**, or only show sync?

### 5. Safety, CE, EU (if we ever put this in a Slovenian/EU plant)

31. CE Machinery Regulation, ISO 10218 / ISO/TS 15066, risk assessment owner.
32. ATEX if any solvent. No certificate = not in the booth. Period.
33. Human–robot shared space: painters still in the cell?
34. Warranty void if we wrap Cortex / third-party brain?
35. International ship / EU homologation — press has said **international ~2027**. Confirm for our timeline.

### 6. Commercial and support

36. Price for **dev kit + SDK + EU support**, not the 298k RMB show-floor number.
37. Spare motors, skin replacement cost (coating will destroy textiles), MTTR, local technician.
38. Who is the named engineer after the sales meeting?
39. Reference site that is **not** a mall or a stage — a factory, even a lab cell.

---

## Jobs that are plausible (if they pass section 1)

Use these as “we’re exploring these clusters, which is real?”

- **Pre/post booth:** racking, masking, unmasking, hang/unhang (payload permitting).
- **Inspection:** walk a line, capture RGB, flag holidays/orange peel for a human (our inspect skill). **Not** a replacement for a DFT robot unless they have a gauge under 3 kg and a stable pose.
- **Powder room adjacent:** box handling, filter change assist — only if dust rating exists.
- **Training / kinesthetic teaching** of a path that a **fixed paint arm** then replays (Luna as teacher, industrial arm as painter). This is often the only honest architecture.
- **Factory tour / customer demo** of a coated-product plant (their actual product-market). Do not confuse that with production spraying.

## Jobs to refuse on Luna

- Solvent spray inside a classified booth
- Electrostatic bell applicators (payload + Ex + high voltage)
- Continuous 2-shift painting without a sealed industrial arm
- Any task where film thickness is the KPI and the base is a walking biped

---

## What “good” looks like when you leave

You can fill this table:

| Field | Answer |
|---|---|
| Process + zone classification | |
| Station (booth vs peri-booth) | |
| Tool mass at wrist | |
| SDK: on-robot command yes/no | |
| Cloud required yes/no | |
| Read-only commissioning allowed | |
| Luna vs Oli vs paint-arm | |
| EU support + CE status | |
| Named technical owner | |

If SDK is “Studio only / cloud choreography,” Cortex cannot own the brain. Be polite and stop.

---

## How we introduce ourselves (30 seconds)

> We build the software brain that sits on OEM robots: work orders in, safety policy in the middle, actuators only after a supervisor allows it. We are here to see whether Luna (or Oli) can be that body **around** a coating process — not to pretend a stage humanoid is an ATEX paint robot.

Public spec sources: [product](https://www.limxdynamics.com/en/products/luna), [spec](https://www.limxdynamics.com/en/products/luna/spec), [FAQ](https://www.limxdynamics.com/en/products/luna/faq).
