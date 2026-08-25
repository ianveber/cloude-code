# Research: CoatingMind humanoid shortlist (Aug 2026)

Checked against manufacturer pages, GitHub, and (for Unitree) US DoD Section 1260H filings. Aggregator prices are treated as **unverified** unless a dealer or OEM publishes them.

**CoatingMind constraint (does not change):** none of these are ATEX/IP-rated paint-booth machines. Use for **lab / peri-process / inspection / handling**. Spray-in-booth stays a dedicated paint arm.

---

## Corrections to the ranking you were given

| Claim in the ranking | What checks out |
|---|---|
| H2 EDU ~$30–60k | **Risky.** Consumer **H2** is often quoted near ~$30k. **EDU** (the only SKU with secondary development) is quote-based; a US dealer lists H2-Edu around **$77k**. Treat $30k as “wrong SKU.” |
| 2070 TOPS included | **Optional.** EDU can take Jetson AGX Thor (~2070 TOPS). Base EDU compute is Intel i5 + i7. Do not assume Thor is in the box. |
| Dexterous hands in the standard pack | **Options.** Multiple hand SKUs. Confirm which hand and whether it is in the quote. |
| “Fully open ROS2 on GitHub” | **Mostly true for Unitree platform**, not unique to H2. Official stack is **unitree_sdk2** (C++/Python, DDS). ROS2 packages exist; locomotion can run **without** ROS. Ask H2-specific examples, not Go2/G1 only. |
| EngineAI SE01 cheapest + most open-source | **Mixed up with PM01.** Official SE01 is the 170 cm gait flagship (quote-only). The cheap open developer bot is **PM01** (~¥88k / ~$12k class). GitHub `engineai_ros2_workspace` examples point at **PM01**, not SE01. EngineAI’s current full-size push is also **T800**. |
| SE01 $20k+ | **Unverified.** Official site has no price. Some blogs say $40–80k B2B. The $12k figure is PM01. |
| KUAVO “full ROS2” | **Native stack is ROS1 (Noetic)** on the open-source controller. ROS2 is a **bridge**. CAN is documented on the **two-finger claw**, not “open the whole bus and bolt anything.” |
| KUAVO “Huawei OS — your AI may not run” | **Half true.** Kuavo uses **KaihongOS / OpenHarmony** (Huawei-origin, not HarmonyOS phone OS) and often **Pangu** in demos. Leju still publishes **Linux/ROS** control repos. You must get in writing: *CoatingMind runs on our compute, Pangu optional, no cloud required.* |
| Walker S2 $160k | **No official list price.** UBTECH sells enterprise/tender. Third-party listings ~$145–150k; a 2025 revenue proxy ~$106k/unit including services. 15 kg payload **is** official. |
| “Shenzhen visit ✅” for all except AgiBot | **Wrong for Unitree.** HQ is **Hangzhou**. They have a **Shenzhen office** (Nanshan). Factory/R&D visit ≠ a sales office. AgiBot is **Shanghai** (true). EngineAI, Leju, UBTECH are Shenzhen-native. |
| Isolate Unitree from internet | **Correct instinct, slightly wrong label.** Unitree (Hangzhou Yushu) was added to the US **DoD Section 1260H** list on **8 Jun 2026**. That is a *US defense-contractor* list, not a global ban. For EU/SI: still air-gap, no OEM cloud, own server — because of telemetry risk, not because Pentagon forbids Slovenian labs. |

---

## Model-by-model (research, not marketing)

### 1. Unitree H2 EDU — still the best *documented* Cortex body

- **Body:** 182 cm, ~70 kg, 31 DoF (7 per arm), rated **7 kg** / peak **15 kg** arm (dealer + spec tables). ~3 h, quick-release battery.
- **Critical SKU split:** Standard **H2 = no secondary development.** **EDU = yes.** Buying the cheap H2 kills CoatingMind.
- **SDK:** [unitree_sdk2](https://github.com/unitreerobotics/unitree_sdk2) is public. English docs exist; community is the largest in this set.
- **Hands:** not one standard hand — options. Lab tools need a named SKU + payload with the hand mounted.
- **HQ:** Hangzhou; Shenzhen office exists.
- **Risk:** 1260H listing; OTA/cloud. Contract: disable cloud, local-only, no training data off-box.
- **CoatingMind fit:** Best for **lab manipulation** (cups, probes, coupons) if the tool is under ~7 kg. Still not a booth sprayer.

### 2. EngineAI SE01 — do not treat as “open PM01 at full size”

- **Official:** 170 cm, 32 DoF, 5-finger **6-DoF** hand, lidar + depth + IR, Ethernet/USB. Endurance on their page is marketing (~2 h UI). **No payload number on the official SE01 page.**
- **Open source:** ROS2 workspace is real ([engineai_ros2_workspace](https://github.com/engineai-robotics/engineai_ros2_workspace)) but **PM01-oriented**. Ask: *SE01 joint API today, or only T800/PM01?*
- **T800:** their newer full-size; if you fly to Shenzhen, ask to see **T800 + SE01** side by side.
- **CoatingMind fit:** Unknown wrist payload = do not rank #2 until they write kilograms. Gait demos ≠ lab dexterity.

### 3. Leju KUAVO-5 — best *instrument* story, messier software

- **Official advanced KUAVO_5:** 1.73 m, 63.5 kg, 29 DoF body + 6 head + 7/arm + 6/leg; **1 h** walk endurance; Mid-360 lidar + Gemini-335L. Two-finger claw: 180 N, **CAN**, 600 g.
- **Software:** [kuavo-ros-opensource](https://github.com/LejuRobotics/kuavo-ros-opensource) + imitation-learning examples. ROS2 via **ros1_bridge**.
- **Huawei:** partner stack (OpenHarmony/KaihongOS + optional Pangu). Not automatically “your Python cannot run.”
- **CoatingMind fit:** Strong if you want a **viscosity probe / coupon gripper** on a documented claw/CAN. Weak if you need 8-hour shifts or native ROS2 only.

### 4. UBTECH Walker S2 — real industrial humanoid, not a Year-1 lab buy unless budget is fake

- **Official:** 15 kg payload, autonomous **battery swap ~3 min**, industrial positioning, binocular RGB (no head lidar on the product story).
- **SDK:** enterprise Python/ROS2 claimed by resellers; treat as **NDA + paid**.
- **Price:** quote. $160k is a guess, not a catalog.
- **CoatingMind fit:** Makes sense for **line handling / 24h** later. Overkill and closed for teaching CoatingMind in a lab.

### 5. AgiBot X2 — good SDK, wrong body for coating lab

- **Official AimDK specs:** 1.31 m; payload **3 kg in one posture, ≤1 kg across the workspace** (excluding end-effector). Ultra adds lidar + Orin NX.
- **SDK:** AimDK on **ROS 2 Humble**, documented. Secondary development is **Ultra**, not base X2.
- **CoatingMind fit:** Fine for navigation/HRI. **Too small and too weak** for guns, hoses, or most lab instruments.

---

## Ranking I would actually use (CoatingMind + Cortex)

1. **Unitree H2 EDU** — only EDU, Thor optional, named hand, SDK in the PO, air-gapped. Visit **Hangzhou** (or Shenzhen office if they staff engineers there).
2. **Leju KUAVO-5** — if the first job is *bolt a probe / claw*, and you accept ROS1+bridge + Huawei-adjacent OS.
3. **EngineAI** — **PM01** for cheap SDK learning; **SE01/T800** only after payload + SE01 SDK in writing.
4. **AgiBot X2 Ultra** — backup for software experiments, not coating hardware.
5. **Walker S2** — Year 2 production handling, not Year 1 brain development.
6. **LimX Luna** (previous meeting) — still last for this job (3 kg, textile, show SKU).

---

## Shenzhen trip.com link

`https://hk.trip.com/toplist/tripbest/shenzhe` is **truncated** (404). Trip.Best is **tourism rankings** (hotels, Window of the World, Shenzhen Bay), not a robotics cluster map.

For a Shenzhen factory week, plan **company addresses**, not Trip.Best:

| Company | Where |
|---|---|
| EngineAI | Shenzhen HQ |
| Leju | Shenzhen |
| UBTECH | Shenzhen |
| Unitree | **Hangzhou HQ** + Shenzhen Nanshan office |
| AgiBot | Shanghai |
| LimX | Shenzhen (show/humanoid, not coating cell) |

---

## Questions to add to every Shenzhen meeting

1. Written **payload with the exact hand/tool** we will mount (not brochure peak).
2. **Which SKU** has secondary development (H2 vs H2 EDU; X2 vs X2 Ultra; SE01 vs PM01 vs T800).
3. Demo: **our laptop** sends a joint/Cartesian command on **their** robot, no cloud.
4. Read-only log of state for 24 h.
5. IP / chemical wipe-down / ATEX — expect “no”; then restrict CoatingMind to **lab benches**.
6. Spare parts, MTTR, English engineer after sales leaves.

Sources: Unitree dealers/spec tables + [sdk2](https://github.com/unitreerobotics/unitree_sdk2); DoD 1260H Jun 2026 (Hangzhou Yushu); EngineAI [SE01](https://www.engineai.com.cn/product-se01.html) + GitHub ROS2 workspace; Leju KUAVO_5 manual + GitHub; UBTECH [Walker S2](https://www.ubtrobot.com/en/humanoid/products/walker-s2); AgiBot [AimDK specs](https://x2-aimdk.agibot.com/en/latest/about_agibot_X2/robot_specifications.html).
