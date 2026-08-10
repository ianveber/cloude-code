# ATHLOS Readiness Engine — Design Spec

- **Date:** 2026-07-15
- **Status:** Approved design — ready for implementation plan
- **Sub-project:** A of 4 (Readiness Engine). B = Accounts & Roles, C = Live Program Editing, D = Coach/Admin Console are defined follow-on sub-projects, each with its own spec → plan → build cycle.
- **Stack:** ATHLOS Coach — Bun/Node, ESM `.mjs`, vanilla-JS front-end, Anthropic Claude (Sonnet 4.6). Per-athlete JSON store (`athlos-chatbot/profiles/<id>.json`). Zero new dependencies.

---

## 1. Purpose

Give the ATHLOS AI Coach a genuine recovery/strain brain — the single biggest capability WHOOP has that ATHLOS lacks — so it can make an intelligent daily "train hard / hold / deload" call per athlete, and so each athlete sees a readiness score and the reasoning behind it.

The engine computes, per athlete per day:

- **Readiness** (0–100, red/yellow/green) — a recovery composite.
- **Load** (0–100) — training strain.
- Supporting metrics — HRV (RMSSD/SDNN), sleep performance, and a next-day readiness forecast.

It is **input-agnostic**: the scoring core runs identically on a 4-field manual morning check-in (phase 1, ships today) or a full wearable feed (phase 2, plugs in later with no core changes).

## 2. Provenance & legal posture (clean-room)

The methods below were identified by studying two open-source WHOOP companion apps — `ParthJadhav/noop` (NOOP) and `b-nnett/goose` — specifically NOOP's `StrandAnalytics` package. **We do not copy their source.** Every algorithm NOOP implements is an *independent implementation of published, cited exercise-physiology and HRV methods* (NOOP states this explicitly in each file header). We re-implement those same published methods in our own JS. NOOP's docs are used as a reference spec only.

- NOOP's own source is **PolyForm Noncommercial 1.0.0** — we copy none of it.
- The methods we implement are public academic work (citations in §5) — facts/ideas, not copyrightable expression.
- Result: commercially clean, no reverse-engineering, no strap dependency.

**Non-negotiable:** all scores are approximations, **not clinically validated, not a medical device.** This disclaimer ships in the athlete UI card and in the Coach's readiness block.

## 3. Scope

### In scope (this spec, sub-project A)
- Pure scoring core: baselines, recovery, strain/load, hrv, sleep, forecast.
- Input adapter boundary + the phase-1 **manual** adapter (morning check-in).
- Per-athlete readiness store (extends existing profile JSON).
- `computeDaily()` orchestrator.
- Coach integration: `readinessBlock()` injected into the system prompt; readiness-adjusted proposals through the existing propose→approve flow.
- Athlete-visible **readiness card** in the existing Coach UI + two server endpoints.
- Deterministic unit tests.

### Out of scope (defined follow-on sub-projects)
- **B — Accounts & Roles:** team plan (admin/coach over many athletes) vs individual plan (self-managed). Cloud DB + auth.
- **C — Live Program Editing:** coach (team) or athlete (individual) edits a program, synced live. Shared cloud state + real-time.
- **D — Coach/Admin Console:** admin view of every athlete's readiness + program, editable.
- Phase-2 wearable/WHOOP adapters are *stubbed to the same contract* here but not implemented.

The engine's data model and interfaces are designed so B/C/D attach without reworking A (see §11).

## 4. Architecture

```
athlos-chatbot/
  readiness/
    baselines.mjs     — EWMA personal baseline (mean+spread) + robust z-score  [spine]
    recovery.mjs      — 0–100 Readiness (recovery composite)
    strain.mjs        — 0–100 Load (sRPE phase 1 → TRIMP phase 2)
    hrv.mjs           — RMSSD/SDNN from RR intervals + Malik cleaning  (phase 2)
    sleep.mjs         — sleep performance 0–1 → feeds recovery  (coarse now, staging later)
    forecast.mjs      — next-day readiness trend
    index.mjs         — computeDaily() orchestrator + readinessBlock()
    adapters/
      manual.mjs      — morning check-in fields → DailyInput   (phase 1, implemented)
      appleHealth.mjs — stub to contract  (phase 2)
      garmin.mjs      — stub to contract  (phase 2)
      whoopApi.mjs    — stub to contract  (phase 2)
    __tests__/        — deterministic golden-value tests
```

**Design rule:** every core module is a **pure function** — `(baselines, input) → scores`, no I/O, no network. All load/persist happens only in `index.mjs`. This is what makes the core offline-testable and portable to the cloud in B.

## 5. The input contract (`DailyInput`)

One object; every adapter produces it; the core never knows the source.

```js
DailyInput = {
  athleteId: string,
  date: "YYYY-MM-DD",

  // Phase 1 — manual morning check-in (all optional)
  hrv:         number,   // ms, entered from a phone-camera HRV app or chest strap
  restingHR:   number,   // bpm
  sleepHours:  number,   // 0–24
  sleepQuality:number,   // subjective 0–1 (UI: 1–5 stars → /5)
  soreness:    number,   // subjective 0–1 (0 = fresh, 1 = wrecked)
  mood:        number,   // subjective 0–1
  session:     { rpe: number /*0–10*/, minutes: number, type: string }, // yesterday's/today's training

  // Phase 2 — raw wearable signals (optional; activate raw-signal modules)
  rrIntervals: number[], // ms, for hrv.mjs
  hrStream:    { ts: number, bpm: number }[], // for TRIMP strain
  sleepStages: object,   // for sleep staging + debt
}
```

**Missing-term rule (from NOOP):** any absent field drops its term and the remaining weights renormalize. The score is always honest about the data it had. This single rule is what makes phase-1 and phase-2 run on the same core.

## 6. Modules, methods & phase gates

All formulas are the published methods; constants are NOOP's documented, explainable defaults and are tunable.

### 6.1 `baselines.mjs` — personal baseline + z-score (spine)

Per metric, per athlete, an EWMA baseline:

```
baselineₜ = α·value + (1−α)·baselineₜ₋₁
spreadₜ   = β·|value − baselineₜ₋₁| + (1−β)·spreadₜ₋₁
```

- Defaults: `α = β = 0.13` (≈ EWMA over ~14 nights, `2/(N+1)`).
- Only **in-range** values update a baseline (out-of-range = artifact, see §9).
- `nValid` counts in-range nights; baseline is **usable** when `nValid ≥ minNightsSeed = 14`.

Robust z-score (used by every scorer):

```
z(value, mean, spread) = (value − mean) / max(1.253·spread, 1e-9)
```

Phase: **live in phase 1** (works on any daily number).

### 6.2 `recovery.mjs` — Readiness 0–100

Baseline-normalized z-score → logistic composite (independent implementation; approximate, not WHOOP-identical).

Terms (each present only if its input + baseline exist):

| Term | Direction | z | Weight |
|---|---|---|---|
| HRV | higher better | `z(hrv, hrvBaseline)` | 0.55 |
| Resting HR | lower better | `z(rhrBaseline.mean, rhr, rhrBaseline.spread)` | 0.20 |
| Sleep performance | higher better | `(sleepPerf − 0.85) / 0.12` | 0.15 |
| Respiration | lower better | `z(respBaseline.mean, resp, respBaseline.spread)` | 0.05 |
| Skin-temp deviation | any drift penalized | `−|devC| / 1.0` | 0.05 |

```
z_composite = Σ(zᵢ·wᵢ) / Σ(wᵢ)          // over present terms only
Readiness   = 100 / (1 + e^(−1.6·(z_composite − (−0.20))))   // Z=0 → 58%
```

- Bands: `red < 34`, `yellow < 67`, `green ≥ 67`.
- **Cold-start gate:** if HRV baseline not yet usable (`nValid < 14`), `recovery` returns `null`; UI/Coach show *"Calibrating — N of 14 nights."*
- **Phase 1** contributes only **HRV / RHR / Sleep** (weights 0.55 / 0.20 / 0.15, renormalized to sum 0.90). The **respiration and skin-temp terms are absent in phase 1** (manual check-in supplies neither) → they drop and the weights renormalize. **Phase 2** adds HRV-from-RR, respiration, and skin-temp.
- **Subjective fields (`soreness`, `mood`) are NOT folded into the numeric Readiness in v1** — this keeps the score faithful to the cited physiological composite and avoids inventing unvalidated weights. Instead they are captured, stored, and **surfaced to the Coach block as qualitative context that can override the recommendation** (e.g. Readiness green but athlete reports high soreness → Coach moderates the session).

### 6.3 `strain.mjs` — Load 0–100

Two interchangeable modes, same output scale (log-compressed), selected by available input:

**Phase 1 — Foster session-RPE (sRPE):**
```
AU   = rpe(0–10) × minutes
Load = 100 · ln(AU + 1) / ln(D_load)      // D_load = 3001 (tunable calibration constant)
```
`D_load` is calibrated so a hard 2 h session (RPE 10 × 120 = 1200 AU) ≈ 88 and a sustained maximal effort approaches 100; final value pinned by a golden test during implementation.

**Phase 2 — TRIMP (needs `hrStream`):**
```
%HRR = clamp((HR − RHR) / (HRmax − RHR) × 100, 0, 100)        // Karvonen
TRIMP = Σ over samples of  duration × zoneWeight               // Edwards 5-zone (50/60/70/80/90 %HRR)
     OR duration × x × 0.64 × e^(b·x), b = 1.92 M / 1.67 F     // Banister
Load  = 100 · ln(TRIMP + 1) / ln(7201)
HRmax = 208 − 0.7·age (Tanaka) or observed 99.5th pct once ≥600 samples
```

Phase: sRPE **live in phase 1**; TRIMP activates when `hrStream` arrives.

### 6.4 `hrv.mjs` — RMSSD/SDNN (phase 2)

```
range filter: drop RR ∉ [300, 2000] ms
ectopic: drop beats > 20% from local median (Malik, window radius 2)
require ≥ 20 valid intervals
RMSSD = sqrt(mean( (NNᵢ₊₁ − NNᵢ)² ))     // Task Force 1996
SDNN  = stdev(NN, ddof=1)                 // Task Force 1996
```

Phase 1: athlete enters an HRV number directly (validated here); this module activates when `rrIntervals` are supplied.

### 6.5 `sleep.mjs` — sleep performance

**Phase 1 (coarse):**
```
durationScore = clamp(sleepHours / needHours, 0, 1)   // needHours default 8, per-athlete later
sleepPerf     = 0.7·durationScore + 0.3·sleepQuality
```
Feeds the recovery sleep term (centered 0.85). **Phase 2:** sleep staging + sleep debt from wearable data replace the coarse estimate.

### 6.6 `forecast.mjs` — next-day readiness trend

**Phase 1 (coarse):**
```
trend7      = slope of last 7 days' Readiness
loadPenalty = max(0, (avgLoad7 − 50) / 5)             // recent overreach drags tomorrow down
forecast    = clamp(todayReadiness + trend7 − loadPenalty, 0, 100)
```
`null` while Readiness is in cold-start. **Phase 2** refines with richer inputs.

## 7. Data model & storage

Extends the existing per-athlete profile (`profiles/<id>.json`) with a `readiness[]` array. One record per day (same-day recompute replaces the day's record).

```js
ReadinessRecord = {
  date: "2026-07-15",
  source: "manual",                    // | "appleHealth" | "garmin" | "whoopApi"
  inputs: { hrv, restingHR, sleepHours, sleepQuality, soreness, mood, session },
  scores: {
    readiness: 41 | null,
    load: 63,
    hrv: { rmssd, sdnn } | null,       // phase 2
    sleepPerf: 0.78,
    forecast: 55 | null,
  },
  band: "red" | "yellow" | "green" | "calibrating",
  drivers: [                           // transparency: exactly why the score is what it is
    { metric: "HRV", value: 48, baseline: 58, deltaPct: -17, z: -1.1, contribution: -0.60 },
    { metric: "RestingHR", value: 57, baseline: 52, ... },
    { metric: "Sleep", value: 6.1, ... },
  ],
  calibration: { nights: 8, seed: 14 } | null,   // present only during cold-start
}
```

- Keyed by `athleteId` (the profile id) and `source`-tagged **from day one** → team/admin console (D) reads it unchanged.
- Follows the existing `profiles.mjs` atomic temp+rename write pattern; input free-text (e.g. `session.type`) is sanitized as data, never instructions (existing `sanitizeText`).

## 8. Orchestrator & Coach integration

### `computeDaily(athleteId, dailyInput) → ReadinessSnapshot`  (`readiness/index.mjs`)
1. Load profile → per-metric baselines.
2. Defensive validate/clamp inputs (adapter validated already).
3. Run each module whose inputs are present (skip the rest).
4. Compute Readiness (may be `null` — cold-start) and Load.
5. Update baselines (EWMA) using in-range values only; advance `nValid`.
6. Build `ReadinessRecord` incl. `drivers`.
7. Persist (append or replace same-day).
8. Return the snapshot.

Deterministic given `(baselines, input)`; the only I/O is load/persist at the edges.

### `readinessBlock(athleteId) → string`
Builds a compact, **cacheable** markdown block injected into the Coach's existing `buildSystemBlocks()` alongside the brain:

```
## Today's Readiness — {athleteName}
Readiness 41 (RED). HRV 48ms (−17% vs baseline), RHR 57 (+5), slept 6.1h (perf 0.78).
Subjective: soreness 0.7 (high), mood 0.4. 7-day: readiness ↓ trend, load HIGH. Forecast tomorrow ~55.
Guidance:
  RED     → recommend deload / technical / mobility; do NOT green-light overload.
  YELLOW  → moderate volume; hold intensity; monitor.
  GREEN + low recent load  → green-light overload / key session.
  GREEN + high recent load → maintain; watch for accumulating fatigue.
Note: readiness is an approximation, not medical advice.
```

The Coach then proposes a readiness-adjusted session through the **existing propose→approve flow** (`proposals.mjs`) — the exact seam sub-project C (live editing) will hook into.

## 9. Edge cases & non-negotiables

- **Artifact rejection (from NOOP):** RHR < 25 bpm rejected as dropout; HRV clamped to plausible [300–2000 ms RR ⇒ ~10–200 ms RMSSD sanity], sleepHours clamped 0–24, subjective fields clamped 0–1. Rejected values do not update baselines.
- **Cold-start:** Readiness `null` + honest "Calibrating — N of 14" until HRV baseline usable. Load and sleepPerf still shown (they don't need the seed).
- **Missing metrics:** term drops, weights renormalize.
- **Missed days:** gaps allowed; baselines use available nights; forecast degrades to `null` gracefully.
- **Not a medical device:** disclaimer in card + Coach block; no diagnostic language.

## 10. Athlete-visible surface (in scope)

**Readiness card** in the existing Coach UI (`index.html`) — Apple-light minimal per Ian's design standard:
- Color-band ring + big Readiness number (or "Calibrating — N/14").
- 7-day sparkline.
- Driver chips: HRV / RHR / Sleep, each with ± vs-baseline arrow.
- Today's **Load** bar.
- Small disclaimer footnote.

Shows the **same data the Coach reasons over** (Ian's "athlete sees everything the coach sees" requirement).

**Server endpoints** (add to `server.mjs`, guard `athleteId` with `isValidId`):
- `POST /api/readiness/checkin` — body = manual fields → `manual` adapter → `computeDaily` → returns snapshot.
- `GET  /api/readiness/:athleteId` — returns `{ latest, history: last 30 records }`.

## 11. Interface hooks for B/C/D (so the platform snaps on later)

- **Athlete-keyed, source-tagged records** → admin console (D) reads every athlete's readiness with no schema change.
- **`drivers` on every score** → full transparency for both athlete and coach views.
- **Program stays the editable artifact** (existing `plans[]`); readiness *annotates* it. The propose→approve seam is where live editing (C) attaches.
- **Storage isolated behind the `index.mjs` load/persist edge** → swapping local JSON for a cloud DB (B) touches only that edge, not the pure core.

## 12. Testing

- **Golden-value unit tests** for every pure module: known input → known score (mirrors NOOP's `RecoveryScorerTests`, `StrainScorerTests`, `HRVAnalyzerTests`, baseline, cold-start-gate, adapter-normalization tests).
- Baseline EWMA convergence test; cold-start gate returns `null` below seed, a score at/above.
- Missing-term renormalization test (same input minus one term → expected renormalized score).
- `D_load` denominator pinned by a golden test (hard-2h ≈ 88, max ≈ 100).
- No network in the core → fully offline-testable.

## 13. Success criteria

1. A new athlete can submit a manual morning check-in and get a Load score immediately and a Readiness score once calibrated (≤14 days), with an honest calibrating state before that.
2. The Coach's daily recommendation visibly changes with readiness (red → deload proposal; green + low load → overload proposal), via the existing propose→approve flow.
3. The athlete sees a readiness card with the same drivers the Coach used.
4. Adding a phase-2 adapter (e.g. Apple Health) requires **zero changes to the scoring core** — only a new file in `adapters/`.
5. All scoring modules pass deterministic golden-value tests offline.

## 14. Phasing summary

- **Phase 1 (this build):** manual adapter, baselines, recovery, sRPE load, coarse sleep + forecast, per-athlete store, Coach block + propose→approve, readiness card, tests.
- **Phase 2 (later, no core changes):** wearable/WHOOP adapters, RR-interval HRV, HR-stream TRIMP, sleep staging + debt, skin-temp term, richer forecast.
- **Sub-projects B → C → D:** accounts/roles → live program editing/real-time → coach/admin console.
