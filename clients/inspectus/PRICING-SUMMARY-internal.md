# INSPECTUS — Pricing Summary (INTERNAL — Ian's decision doc)

_Corrected to the real cost basis: the client app (INSPECTUS Center) runs **Haiku 4.5** for text and **Opus 4.8** for VIN vision. Not a client-facing doc — proposal numbers to confirm, then I fold the chosen figures into the Slovene client docs._

---

## 1. Development to date (hours × rate)

Hours unchanged (development effort, from the delivery log):

| Scope | Hours |
|---|---|
| VLDR automation (trial product) + the 2 client documents | **62–66 h** |
| Full engagement (adds dashboard, VIN sorter, Constat, 5 offers) | **95–105 h** |

Proposed hourly rate — **recommend €90/h** (premium EU AI-automation work, live custom product):

| Rate | VLDR core (62–66 h) | Full engagement (95–105 h) |
|---|---|---|
| €70/h (lean) | €4.340 – 4.620 | €6.650 – 7.350 |
| **€90/h (recommended)** | **€5.580 – 5.940** | **€8.550 – 9.450** |
| €120/h (premium) | €7.440 – 7.920 | €11.400 – 12.600 |

---

## 2. Usage to date (trial, 10 Jun → 22 Jul) — ESTIMATE

**Text VLDR is trivially cheap.** Real cost ~**€0,02/report** (Haiku + compact JSON). Scenario:

| VLDR reports run in trial | AI cost |
|---|---|
| 20 | ~€0,40 |
| 50 | ~€1,00 |
| 100 | ~€2,00 |
| 200 | ~€4,00 |

→ **Text VLDR cost to date is almost certainly under €5** (likely ~€1). Exact number = Anthropic Console (Haiku 4.5) / Vercel `inspectus-os` invocations.

**VIN photo sorting is the real driver** (if they used it): ~€0,008/photo on Opus vision → **~€50 per full ship** (~6.000 photos). If they sorted N ships, that's ~N × €50. This is where the trial cost actually lives — pull the Opus 4.8 spend from the Console separately.

**"Cost to date" bottom line:** development value (§1) + a few € of text usage + ~€50/ship for any VIN sorting done. The token cost is a rounding error next to the build.

---

## 3. New automation price (going forward) — PROPOSAL

The old €0,45/report basis **underprices the value** — at their volume it just floors at the €49/mo minimum, while the automation saves ~10 h/ship. Two separate products, two prices:

### A. VLDR text automation
- **Recommended: flat €349/mo** (all-in: unlimited reports + hosting + prompt upkeep + monitoring). Predictable, value-based, ~1% of the time-value it delivers.
- Range: €249 – €449/mo (your June alternatives).
- Alternative (usage-based): €0,45/report, €49/mo minimum.

### B. VIN photo sorting (only if adopted) — price SEPARATELY
- Real cost ~€50/ship (Opus vision). Cost-plus managed → **~€150–250/ship**, or a monthly bundle by ship volume. Do **not** fold this into the flat text price — it would blow the margin.

---

## Decisions for Ian (then I finalize the client docs)

1. **Hourly rate** — confirm €90/h (or set your number).
2. **Monthly automation price** — confirm €349/mo (or pick from €249–449).
3. **VIN sorting** — in scope for INSPECTUS? If yes, confirm its separate price.
4. **Deploy** — ship the 2 micro-wins to the client app, or leave it (already optimal)?

_Real cost basis: Haiku 4.5 $1/$5, Opus 4.8 $5/$25 per 1M; EUR at 1 € = 1,08 $. Managed margin shown transparently per house style._
