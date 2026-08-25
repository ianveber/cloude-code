# Coating technical questions (deep)

Companion to `coating-oriented-questions.md`. Use with a **formulator, QC lead, or process engineer**. If they only know brand names, stop and get the right person.

CoatingMind needs **setpoints, tolerances, sensors, and failure physics** — not slogans.

---

## A. Specification and standards stack

1. Governing spec: ISO 12944 (C-class?), NORSOK M-501, Qualicoat, Qualanod, AAMA, GSB, IMO PSPC, customer drawing, in-house SOP?
2. Substrate standard: steel grade, aluminium alloy/temper, plastic (PP/ABS/PC — which flame/plasma treat)?
3. Surface cleanliness: ISO 8501-1 grade (Sa 2½, Sa 3), ISO 8502-3 dust, ISO 8502-6/9 Bresle soluble salts (µS/cm or mg/m² NaCl equivalent) — **limit and method**.
4. Profile: ISO 8503, Rz / Rt target (µm), replica tape vs stylus. Over-profile starves DFT in valleys?
5. Coating system: number of coats, NDFT / MDFT per coat (ISO 19840), stripe coat required?
6. DFT measurement: ISO 19840 sampling plan, SSPC-PA 2, 80/20 rule? Gauge type (Type 1 magnetic / Type 2 eddy) and calibration (ISO 19840 shims on what substrate)?
7. Adhesion: ISO 2409 class 0–5 vs ASTM D3359; pull-off ISO 4624 / ASTM D4541 — dolly size, adhesive, pass MPa.
8. Corrosion: ISO 9227 NSS hours, ISO 12944-6 cyclic, ASTM B117, ISO 6270 QCT, filiform ISO 4623 — **hours to first red rust / blister ISO 4628 ratings**.
9. Color: CIELab D65/10°, ΔE00 vs ΔEab, customer light box? Metallic: flop / aspecular (15/45/110°).
10. Gloss: ISO 2813 geometry 20/60/85° — which and tolerance?
11. Other: mandrel ISO 1519, impact ISO 6272, MEK double rubs, Taber, QUV ISO 16474, xenon ISO 16474-2, pencil hardness, cross-link density (MEK, DMA Tg)?

---

## B. Formulation and rheology (lab)

12. PVC / CPVC — are they near CPVC (porosity, permeability jump)?
13. Pigment: TiO2 grade, zinc dust % (ISO 12944 zinc silicates), MIO, metallic flake aspect ratio — circulation required?
14. Solvent map: evaporation index blend (true solvents vs diluents), waterborne coalescent (Texanol type) and **MFFT vs booth T**.
15. Rheology: Newtonian vs shear-thinning vs thixotropic recovery. Instrument: Ford/DIN/Zahn cup vs Brookfield (spindle, rpm, T) vs cone-plate (s⁻¹). **Report cP or mPa·s at which shear.**
16. For spray: high-shear viscosity at gun tip (~10³–10⁵ s⁻¹) vs low-shear sag (0.1–1 s⁻¹). Do they have **both** numbers?
17. Thixotrope: fumed silica, HASE, clay — over-mix shear damage?
18. 2K: mix ratio by **weight or volume**, meter type (gear, piston), ±% tolerance, **induction**, pot life at 10/20/30 °C (Arrhenius — do they have a table?).
19. Isocyanate: HDI vs IPDI, NCO:OH index, moisture sensitivity, **pot decontamination**.
20. Amine blush (epoxy) — dew point / humidity limits after spray?
21. Waterborne: pH window, freeze-thaw, **conductivity** of mix water, defoamer vs cratering trade.
22. Powder: resin (epoxy, hybrid, polyester TGIC/primid), **d50 particle size**, gel time, Tg, melt viscosity, **Faraday / back-ionisation** limits on kV.
23. E-coat: bath solids %, pigment/binder, pH, conductivity, **voltage / time**, throw power, UF rinse, anode/cathode type, contamination (phosphate drag-in).
24. Coil: PMT (peak metal temperature), line speed m/min, DFT wet vs dry, peak IR vs convection, **MEK rubs after cure**.

---

## C. Atomisation, electrostatics, transfer efficiency

25. Applicator: HVLP, compliant, airless, AAA, rotary bell (rpm, shaping air), disc, powder corona vs tribo.
26. Fluid nozzle / air cap IDs; fan pattern width at standoff; **patternation** (is the fan wet in the middle?).
27. Atomising vs fan air pressures (bar) and **air-to-paint ratio**.
28. Fluid flow: cc/min or g/min — how measured (cup, Coriolis, gear meter)? Closed-loop or open?
29. Standoff (mm), gun angle to surface, lead/lag on edges, **overlap %** (typically 50%).
30. TCP path speed (mm/s) and **jerk** at corners — orange peel and fat edges live here.
31. Transfer efficiency % (ISO 22095 / supplier method) — what is it today vs target?
32. Electrostatic: kV, µA, **current limit**, wrapping vs Faraday cage on inner corners. Part **ground resistance** (MΩ) — measured how often?
33. Powder: kV, µA, powder feed g/min, transport air, **back ionisation** (starring, rejection) — recovery ΔP / cyclone vs cartridge.
34. Bell: high voltage + shaping air + turbine rpm — who owns the recipe, paint kitchen or robot OEM?
35. Flash / solvent pop: vapour pressure vs film thickness vs airflow. **Dry spray** vs **solvent entrapment** — which is their mode of failure?

---

## D. Booth, HVAC, oven (process utilities)

36. Booth class: ISO 14644 if any; more typically capture velocity (m/s) at face, **downdraft vs crossdraft**.
37. Filter stages: G4/F7/F9/HEPA — ΔP alarm? Change interval vs DFT dirt inclusions.
38. Make-up air: T ±°C, RH ±%, **dew point vs substrate T** (condensation = adhesion fail). Waterborne window?
39. Exhaust LEL monitoring, solvent mg/m³, **ATEX zone drawing** (0/1/2) — who signed it?
40. Powder: Kst / Pmax of dust, explosion venting NFPA/EN 14491, grounding <10 Ω typical — **measured**?
41. Oven: setpoint vs **part metal temperature** (thermocouple on part, not air). Gradient °C, dwell, IR wavelength vs color (dark parts over-bake).
42. UV: dose mJ/cm², irradiance mW/cm², photoinitiator, oxygen inhibition on 3D parts.
43. Line speed (m/min or jigs/h) vs gun flow — **mass balance**: paint in vs DFT × area × density × TE.

---

## E. Defect physics (root-cause, not names)

For each top defect: **mechanism, which parameter moved, how they would prove it**.

44. Craters / fisheyes: silicone, oil, overspray from incompatible chemistry — incoming wipe ISO 8502?
45. Pinholes / solvent pop: DFT too high, flash too short, oven ramp too fast, moisture in 2K.
46. Orange peel: viscosity, atomisation, standoff, booth T, **flow-and-leveling time** vs gel.
47. Sag / run: low-shear viscosity, film too thick, part vertical, **application temperature**.
48. Dry spray: standoff, air too high, RH, gun too far, powder too fine / gun too hot.
49. Poor wrap / Faraday: kV too high, poor ground, geometry, powder resistivity.
50. Intercoat adhesion fail: recoat window, amine blush, powder/gel mismatch, contamination.
51. Outgassing (castings, zinc, galvanised): preheat, porosity, **outgas primer**.
52. Color mismatch: film thickness, flop, oven PMT, contamination of metallic circulation.

---

## F. Control, metrology, data (what CoatingMind actually ingests)

53. Sampling: n spots per part, edge vs field, **ISO 19840** zones. Gauge R&R (%GRR)?
54. Wet film comb vs calculated WFT from DFT × volume solids — which do they trust?
55. In-line DFT: laser, ultrasonic, beta backscatter, or only handheld after cure?
56. Viscosity loop: in-line viscometer (vibrating, rotational) on circulation — T-compensated?
57. 2K machine: ratio alarm, pot-life interlock, **flush volume** and solvent type.
58. PLC tags we can read: booth T/RH, oven zones, line encoder, gun trigger, kV/µA, flow.
59. Historian / OPC-UA / MQTT — rate (1 Hz vs 100 Hz for gun)? Clock sync with QC timestamps?
60. Recipe versioning: SKU × color × gun × booth — who is source of truth (PLC vs paper)?
61. SPC: X-bar/R on DFT, Cp/Cpk vs spec. Special-cause rules they already use?
62. Lab panels vs production: same gun, same standoff, same flash — or lab is a lie?
63. Drawdown vs spray-out: which predicts production orange peel?
64. CoatingMind target variable: DFT, ΔE, defect class, viscosity@T, or **first-pass yield**?
65. Latency: predict **before** spray (mix) vs **during** (closed-loop flow) vs **after** (inspect).

---

## G. Pretreat and substrate (most “coating” failures start here)

66. Blast media, pressure, **nozzle wear**, profile drift over a shift.
67. Phosphate: Fe vs Zn, coating weight mg/m², crystal size, **nitrite**, sludge, rinse conductivity.
68. Zr / silane: bath age, pH, coating weight, **dry-in-place**.
69. Anodise / chromate / chrome-free — class and seal.
70. Plastic: surface energy (dyne pens), flame/plasma power and **time since treat**.
71. Galvanised: spangle, chromate, T-bend, outgassing.
72. Weld spatter, laser oxide, cutting fluids — hidden under primer?

---

## H. Application robot / TCP (technical, still coating)

73. Tool centre point at **fan centre**, not gun body. How calibrated (laser, paint-dot)?
74. Path: raster vs contour vs lead-in on edges. **Acceleration limits** at direction change.
75. Synchronisation: conveyor encoder vs robot — slip, jig repeatability (mm).
76. Multi-gun / dual-arm: overlap zone DFT double-hit?
77. Trigger timing vs motion (on/off delay) — spits, dry tails.
78. Hose ID, length, **pressure drop**, temperature-controlled hose for high-solids / 2K.
79. Circulation: dead-legs, shear of metallics, **settling** of zinc / MIO.
80. Safety: ISO 10218 + ATEX equipment category vs zone; **ground continuity** through robot to part.

---

## I. What to demand as a table (leave with this filled)

| SKU | Substrate | Pretreat | Coating | Mix / pot life | NDFT | Path speed | Standoff | kV | Booth T/RH | Oven PMT | Defect #1 | € scrap |

If kV is N/A (nonelectrostatic), write N/A. If pot life is N/A (1K), write N/A. Empty cells = CoatingMind cannot run.

---

## J. Lab sensors worth putting on a research arm first

81. Temperature-compensated viscometer (cup is not enough for a model).
82. DFT gauge (magnetic/eddy) with Bluetooth — log xyz pose + reading.
83. Gloss 60° + spectro on a **fixed jig** (hand-held robot wobble kills ΔE).
84. IR pyrometer on part entering oven.
85. Booth T/RH logger 1 Hz.
86. Camera: 45° lighting for orange peel; coaxial for holidays; polariser for orange-peel vs dirt.
87. Optional: wet film comb, conductivity (e-coat / pretreat rinse), LEL (do not put a humanoid on LEL duty).

Year-1 technical scope: **ingest 81–86 + mix ticket → predict DFT/defect class**. Do not start with whole-body spray.
