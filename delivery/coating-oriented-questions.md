# Coating-oriented questions (CoatingMind + robot body)

Use these with a **coating plant, lab, or chemist** — not with a humanoid salesperson. Robot questions at the end translate the same topics into “can your machine survive this.”

If they cannot answer the **bold** items, CoatingMind has nothing to learn from.

---

## 0. What business are they actually in?

Coating is not one job. Get the product first.

1. **What gets coated?** Metal parts, wood furniture, plastic housings, coil steel, pipes, facades, cars, aerospace, medical, something else?
2. **Who is the customer of the coated part?** (OEM, job shop, in-house finishing, lab R&D.) Job shops have high mix; OEM lines have the same part all day.
3. **Liquid, powder, e-coat, coil, or a mix?** If mix, which line is the pain?
4. **Shop-applied or field-applied?** (A robot that walks a factory is useless for a bridge painter.)
5. **What does “done” mean?** Decorative color, corrosion protection, food-contact, fire rating, anti-slip, electrical insulation?

---

## 1. Chemistry and wet process (what CoatingMind must “understand”)

These numbers are the brain. A robot that cannot sense or log them is just waving a gun.

6. **Resin family?** Epoxy, PU, acrylic, alkyd, polyester powder, fluoropolymer, zinc-rich, other?
7. **1K or 2K?** If 2K: mix ratio, **pot life** (minutes until it gels), induction time.
8. **Solvent-borne, waterborne, or high-solids?** Approximate **VOC**?
9. **How do you set viscosity today?** Cup (DIN/Ford/Zahn number + seconds), viscometer, “by eye”? Temperature when you measure?
10. **Thinner / reducer rules?** Who is allowed to add solvent, and how much before the coating is illegal or off-spec?
11. **Pigment / metallic / mica?** (Metallics show every bad stroke.)
12. **Is it electrostatic?** Liquid electrostatic or powder corona/tribo? Grounding of the **part** — how do you check it?
13. **Film build target?** DFT in µm or mils — min / target / max. Primer + topcoat stack?
14. **Recoat window?** Too soon = solvent pop; too late = delamination. What is the clock?
15. **Cure:** air dry, oven °C / minutes, IR, UV? What happens if the oven is 10 °C low?
16. **Pretreatment:** blast profile, phosphate, zirconium, wipe, flame, plasma? Who signs that the part is clean enough to coat?
17. **Contamination they already fight:** silicone, oil, moisture, salt, powder from next booth, shop dust.

---

## 2. The line, station by station (where a person — or robot — stands)

Walk one part. For each station: **who, how long, what goes wrong, what is measured.**

18. Incoming inspection / racking / hanging — orientation rules? (Faraday cage in powder: insides and corners starve.)
19. Masking / plugging — tape, liquid mask, boots? How often is mask the bottleneck?
20. Pretreat / blow-off / tack rag — still manual?
21. **Booth:** open-face, downdraft, side-draft, powder booth with recovery, dip tank?
22. **Application:** HVLP, airless, air-assisted, bell, disc, powder gun, dip, flow-coat, brush/roller (field)?
23. Gun settings they actually use: fluid tip, air cap, atomizing air, fan, kV / µA for electrostatic, powder kV.
24. **Standoff** (gun-to-part distance) and **overlap** — taught by a person or written?
25. Flash-off / solvent pop / moisture blush — timed or “until it looks right”?
26. Oven / IR / UV — recipe per SKU? Who changes it?
27. Unmask, hang-off, pack — damage here kills a perfect coat.
28. Rework / sand / recode — **what % of parts** and **why** (the real CoatingMind dataset).

Ask: **which three stations cost the most labor or scrap?** That is where we attach CoatingMind first — not “the whole factory.”

---

## 3. Quality — what “good coating” is in numbers

If they only say “it looks nice,” we cannot train a brain.

29. **DFT** — how measured (Elcometer / Positector), how many spots, who logs it?
30. **Adhesion** — crosshatch, pull-off, tape? Spec (ISO 2409, ASTM D3359…)?
31. **Gloss** (60° / 20°) and **color** (ΔE, spectrophotometer vs “by eye”)?
32. **Orange peel / DOI** — measured or tribal?
33. **Holidays / pinholes** — wet sponge, high-pot for linings?
34. **Runs, sags, fat edges, dry spray, telegraphing, craters, fisheyes** — which defect is #1 this month?
35. Corrosion tests they must pass (salt spray hours, cyclic, humidity)?
36. What does a **failed batch** cost (scrap, strip, customer claim, line stop)?
37. Is QC **in-line** or **end-of-line**? Delay between spray and DFT (wet vs dry)?

CoatingMind should own: **recipe + environment + application → predicted DFT/defect**, then a human or robot acts.

---

## 4. Environment that destroys robots and ruins film

38. Booth **airflow** (m/s) and filters — when were they last changed? (Bad airflow = dry spray and dirt.)
39. **Temperature and humidity** in the booth vs paint kitchen. Do they log it? Waterborne is humidity-sensitive.
40. Part **temperature** (cold steel = moisture, poor flow).
41. **Solvent concentration / LEL** — classified zone or not? (If they don’t know, stop.)
42. Powder **cloud / recovery** — explosion venting, grounding, housekeeping.
43. Overspray on floors — **slippery**, conductive, flammable sludge. Bipeds fall here.
44. Wash-down chemicals (strippers, MEK, acetone, caustic). What would they wipe a robot with?
45. Noise, PPE, breathing air — painters still in the cell with a robot?

---

## 5. Data they already have (or don’t) — CoatingMind input map

46. Batch / lot of paint — TDS and SDS on file? Do operators follow TDS or tribal knowledge?
47. Mix tickets: weight of A/B, thinner, time mixed?
48. PLC / booth controller / oven chart recorder — can we **read** setpoints?
49. MES / ERP: which SKU, which color, which line?
50. Photos of defects today — phone in a group chat, or nothing?
51. Who is allowed to change a recipe? (If “everyone,” CoatingMind will fight the culture.)

---

## 6. What we might automate (pick one cluster)

Ask them to rank 1–5 (1 = do this first):

| Cluster | In coating words | Robot / brain role |
|---|---|---|
| A | Incoming / hang / mask | Handling, not spraying |
| B | Paint kitchen: viscosity, mix, pot-life clock | Lab arm + sensors (CoatingMind core) |
| C | Spray path inside booth | **Paint arm**, not humanoid |
| D | Flash / oven recipe | Software + PLC, no walking robot |
| E | DFT / gloss / photo inspection | Camera + gauge; humanoid may hold the gauge |
| F | Rework decision | Brain only: pass / sand / recode |

52. If we could only fix **one** of A–F this year, which pays back?
53. For that cluster: volume per shift, minutes per part, error rate, € per error.

---

## 7. Ask the **robot vendor** in coating language

Same meeting, different person. Do not let them demo a dance.

54. **Chemical wipe-down:** MEK / acetone / powder on joints for 6 months — what fails first (seals, textile, encoder)?
55. **IP rating** of wrists and torso. Powder is dust; wet spray is mist.
56. **ATEX / IECEx** for the booth they just described. No certificate = **outside the booth**.
57. **Grounding path** through the robot if the process is electrostatic. Isolated robot = shock and bad wrap.
58. **Payload with hose:** gun + 3–8 m fluid/air hose hanging off the wrist. Peak vs rated.
59. **Constant tool speed** at 200–400 mm/s with ±10% (film thickness lives here). Walking while spraying?
60. **Standoff control** at 150–250 mm using their cameras — demo on a moving or hanging part.
61. **Hold a DFT gauge / viscometer cup / drawdown bar** and log the reading. (This is CoatingMind, not Instagram.)
62. **Hose and cable** from a paint kitchen: snag, trip, leak into the hip joints.
63. **Oven proximity:** radiant heat on plastic covers and batteries.
64. **Shift:** 8 h vs their battery; charger **outside** classified space.
65. **Contamination from the robot:** grease drip, paint on textile fibers in the next part.

If they cannot talk viscosity, DFT, and pot life, they are not a coating partner.

---

## 8. Lab vs factory (CoatingMind Year 1)

Many “coating robots” should start in the **lab**, not the booth.

66. Do they already pull **drawdowns**, spray panels, or viscosity cups every batch?
67. How many panels per day? Who sprays the panel (same as production gun)?
68. What would they want CoatingMind to **predict** first: viscosity at 20 °C, DFT from gun settings, or “this batch will crater”?
69. Can we put a **sensor** (viscometer, thermometer, camera) on the bench before a walking robot?

Year 1 honest scope: **CoatingMind on the mix/QC bench** + a research humanoid holding cups/panels. Year 2: peri-booth handling. Booth spray: **certified paint robot**, our brain as the recipe layer.

---

## How to use this in a 45-minute call

| Minutes | Ask |
|---|---|
| 0–8 | Business + chemistry (0–1). If 2K pot life and zone class are blank, slow down. |
| 8–25 | Walk one SKU through stations 18–28. Pick the painful station. |
| 25–35 | Quality numbers (29–37) and data (46–51). |
| 35–42 | Rank clusters A–F. One number: €/month. |
| 42–45 | If a robot vendor is in the room: 54–61 only. |

Cheat sheet: **pot life, DFT, viscosity, booth zone, defect #1, € of scrap.** If you leave with those six, the meeting worked.

Deeper process/QC/TCP questions: `delivery/coating-technical-questions.md`.
