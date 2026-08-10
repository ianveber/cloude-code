# ATHLOS Readiness Engine (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-athlete readiness engine to the ATHLOS Coach that turns a manual morning check-in into a 0–100 Readiness score, a 0–100 Load score, and a next-day forecast, feeds it into the Coach's reasoning, and shows it to the athlete as a card.

**Architecture:** Pure scoring modules (`readiness/*.mjs`) with no I/O — re-implemented clean-room from published methods (Task Force HRV, Foster sRPE, EWMA baselines, z-score→logistic recovery). A thin orchestrator (`readiness/index.mjs`) does all load/persist through the existing profile store. A manual adapter normalizes check-in input. Two server endpoints + a Coach system-prompt block + an athlete-facing card wire it into the running app.

**Tech Stack:** Bun runtime, ESM `.mjs`, `bun:test` for tests, zero new dependencies. Storage = existing per-athlete JSON (`athlos-chatbot/profiles/<id>.json`).

**Working directory for all commands:** `athlos-chatbot/` (the Coach app). All paths below are relative to it unless noted.

**Reference spec:** `docs/superpowers/specs/2026-07-15-athlos-readiness-engine-design.md`

---

## File Structure

**Create:**
- `athlos-chatbot/package.json` — minimal, adds `bun test` script + `type: module`
- `athlos-chatbot/readiness/baselines.mjs` — EWMA baseline + robust z-score (spine)
- `athlos-chatbot/readiness/recovery.mjs` — Readiness composite + bands + cold-start
- `athlos-chatbot/readiness/strain.mjs` — Load (Foster sRPE, phase 1)
- `athlos-chatbot/readiness/sleep.mjs` — sleep performance 0–1
- `athlos-chatbot/readiness/forecast.mjs` — coarse next-day readiness
- `athlos-chatbot/readiness/adapters/manual.mjs` — check-in fields → DailyInput
- `athlos-chatbot/readiness/score.mjs` — pure `scoreDaily(input, state) → {record, baselines}`
- `athlos-chatbot/readiness/index.mjs` — `computeDaily()` + `readinessBlock()` (I/O edge)
- `athlos-chatbot/readiness/__tests__/*.test.mjs` — one test file per module

**Modify:**
- `athlos-chatbot/profiles.mjs` — add `readReadiness()` + `writeReadiness()`
- `athlos-chatbot/server.mjs` — add 2 endpoints + inject `readinessBlock()` into `buildSystemBlocks()`
- `athlos-chatbot/app.js` — `loadReadiness()` + `renderReadinessCard()`; call from `openProfile`
- `athlos-chatbot/style.css` — `.readiness-card` styles (Apple-light)

**Out of scope (phase 2, not in this plan):** `readiness/hrv.mjs` (RR intervals), `adapters/appleHealth.mjs`, `adapters/garmin.mjs`, `adapters/whoopApi.mjs`, HR-stream TRIMP, sleep staging, skin-temp/respiration terms. The recovery module already accepts those terms; they simply stay absent until a phase-2 adapter supplies them.

---

## Task 0: Scaffold + test runner

**Files:**
- Create: `package.json`
- Create: `readiness/__tests__/smoke.test.mjs`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "athlos-coach",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "test": "bun test",
    "start": "bun server.mjs"
  }
}
```

- [ ] **Step 2: Write a smoke test to confirm `bun:test` runs**

Create `readiness/__tests__/smoke.test.mjs`:

```js
import { test, expect } from "bun:test";

test("bun test runs", () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 3: Run it**

Run: `bun test readiness/__tests__/smoke.test.mjs`
Expected: `1 pass, 0 fail`.

- [ ] **Step 4: Commit**

```bash
git add package.json readiness/__tests__/smoke.test.mjs
git commit -m "chore(athlos): scaffold readiness engine + bun test runner"
```

---

## Task 1: `baselines.mjs` — EWMA baseline + z-score

**Files:**
- Create: `readiness/baselines.mjs`
- Test: `readiness/__tests__/baselines.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { updateBaseline, isUsable, zScore, MIN_NIGHTS_SEED } from "../baselines.mjs";

test("first update seeds mean=value, spread=0, nValid=1", () => {
  const s = updateBaseline(undefined, 50);
  expect(s).toEqual({ mean: 50, spread: 0, nValid: 1 });
});

test("second update is EWMA of mean and abs-dev spread", () => {
  const s = updateBaseline({ mean: 50, spread: 0, nValid: 1 }, 60);
  expect(s.mean).toBeCloseTo(51.3, 5);   // 0.13*60 + 0.87*50
  expect(s.spread).toBeCloseTo(1.3, 5);  // 0.13*|60-50|
  expect(s.nValid).toBe(2);
});

test("non-finite value does not change state", () => {
  const prev = { mean: 50, spread: 1, nValid: 3 };
  expect(updateBaseline(prev, NaN)).toBe(prev);
});

test("isUsable gates at MIN_NIGHTS_SEED", () => {
  expect(isUsable({ mean: 1, spread: 1, nValid: MIN_NIGHTS_SEED - 1 })).toBe(false);
  expect(isUsable({ mean: 1, spread: 1, nValid: MIN_NIGHTS_SEED })).toBe(true);
  expect(isUsable(undefined)).toBe(false);
});

test("zScore uses 1.253*spread as sigma, floored at 1e-9", () => {
  expect(zScore(60, 50, 1.3)).toBeCloseTo((60 - 50) / (1.253 * 1.3), 5);
  expect(zScore(50, 50, 0)).toBe(0); // value==mean → 0 regardless of spread
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/baselines.test.mjs`
Expected: FAIL — `Cannot find module '../baselines.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/baselines.mjs`:

```js
// EWMA personal baseline (mean + spread) + robust z-score. Pure, no I/O.
// Method: exponentially-weighted mean and mean-absolute-deviation spread; the
// z-score divides by 1.253*spread (abs-dev → std-dev conversion for normal data).

export const DEFAULT_ALPHA = 0.13;   // ~ EWMA over 14 nights (2/(N+1))
export const MIN_NIGHTS_SEED = 14;   // nights of valid data before a baseline is trusted

export function updateBaseline(state, value, alpha = DEFAULT_ALPHA) {
  if (!Number.isFinite(value)) return state ?? null;
  if (!state) return { mean: value, spread: 0, nValid: 1 };
  const mean = alpha * value + (1 - alpha) * state.mean;
  const spread = alpha * Math.abs(value - state.mean) + (1 - alpha) * state.spread;
  return { mean, spread, nValid: state.nValid + 1 };
}

export function isUsable(state, seed = MIN_NIGHTS_SEED) {
  return !!state && state.nValid >= seed;
}

export function zScore(value, mean, spread) {
  const sigma = Math.max(1.253 * spread, 1e-9);
  return (value - mean) / sigma;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/baselines.test.mjs`
Expected: `5 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add readiness/baselines.mjs readiness/__tests__/baselines.test.mjs
git commit -m "feat(athlos): EWMA readiness baselines + robust z-score"
```

---

## Task 2: `recovery.mjs` — Readiness composite + bands

**Files:**
- Create: `readiness/recovery.mjs`
- Test: `readiness/__tests__/recovery.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { recovery, band } from "../recovery.mjs";

const usableHrv = { mean: 60, spread: 4, nValid: 20 };
const usableRhr = { mean: 50, spread: 3, nValid: 20 };

test("cold-start: unusable HRV baseline → null score", () => {
  const r = recovery({ hrv: 60, restingHR: 50, sleepPerf: 0.85 },
                      { hrv: { mean: 60, spread: 4, nValid: 5 }, restingHR: usableRhr });
  expect(r.score).toBeNull();
  expect(band(r.score)).toBe("calibrating");
});

test("all terms at baseline (z=0) → ~58 (population anchor)", () => {
  const r = recovery({ hrv: 60, restingHR: 50, sleepPerf: 0.85 },
                      { hrv: usableHrv, restingHR: usableRhr });
  expect(r.score).toBeGreaterThan(57);
  expect(r.score).toBeLessThan(59);
  expect(band(r.score)).toBe("yellow");
});

test("high HRV + low RHR + good sleep → green", () => {
  const r = recovery({ hrv: 80, restingHR: 44, sleepPerf: 0.95 },
                      { hrv: usableHrv, restingHR: usableRhr });
  expect(r.score).toBeGreaterThan(67);
  expect(band(r.score)).toBe("green");
});

test("suppressed HRV + elevated RHR → red", () => {
  const r = recovery({ hrv: 45, restingHR: 60, sleepPerf: 0.6 },
                      { hrv: usableHrv, restingHR: usableRhr });
  expect(r.score).toBeLessThan(34);
  expect(band(r.score)).toBe("red");
});

test("missing RHR term drops and weights renormalize (still scores)", () => {
  const r = recovery({ hrv: 60, sleepPerf: 0.85 }, { hrv: usableHrv });
  expect(r.score).toBeGreaterThan(57);
  expect(r.score).toBeLessThan(59);
  expect(r.drivers.map(d => d.metric)).toEqual(["HRV", "Sleep"]);
});

test("drivers carry value, baseline and deltaPct", () => {
  const r = recovery({ hrv: 48, restingHR: 50, sleepPerf: 0.85 },
                     { hrv: usableHrv, restingHR: usableRhr });
  const hrvDriver = r.drivers.find(d => d.metric === "HRV");
  expect(hrvDriver.value).toBe(48);
  expect(hrvDriver.baseline).toBe(60);
  expect(hrvDriver.deltaPct).toBe(-20);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/recovery.test.mjs`
Expected: FAIL — `Cannot find module '../recovery.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/recovery.mjs`:

```js
// Readiness (recovery) score — z-score → logistic composite. Pure, no I/O.
// APPROXIMATE proxy of published readiness methods; not WHOOP-identical, not medical.
// Weighting: HRV .55 (dominant) · RHR .20 · Sleep .15 · Resp .05 · SkinTemp .05.
// Missing terms drop and weights renormalize. Anchored so composite z=0 → ~58%.
import { zScore, isUsable } from "./baselines.mjs";

export const W = { hrv: 0.55, rhr: 0.20, sleep: 0.15, resp: 0.05, skinTemp: 0.05 };
export const SLEEP_CENTER = 0.85;
export const SLEEP_SCALE = 0.12;
export const LOGISTIC_K = 1.6;
export const LOGISTIC_Z0 = -0.20;
export const BAND_RED_MAX = 34;
export const BAND_YELLOW_MAX = 67;

const round2 = (x) => Math.round(x * 100) / 100;

function driver(metric, value, baseline, z, weight) {
  const deltaPct = baseline ? Math.round(((value - baseline) / baseline) * 100) : null;
  return { metric, value, baseline, deltaPct, z: round2(z), weight };
}

export function band(score) {
  if (score == null) return "calibrating";
  if (score < BAND_RED_MAX) return "red";
  if (score < BAND_YELLOW_MAX) return "yellow";
  return "green";
}

// inputs: { hrv?, restingHR?, resp?, sleepPerf?, skinTempDevC? }
// baselines: { hrv?, restingHR?, resp? }  each { mean, spread, nValid }
// → { score: number|null, drivers: [] }
export function recovery(inputs, baselines = {}) {
  if (!isUsable(baselines.hrv)) return { score: null, drivers: [] }; // cold-start gate

  const terms = [];
  const drivers = [];

  if (Number.isFinite(inputs.hrv) && baselines.hrv) {
    const z = zScore(inputs.hrv, baselines.hrv.mean, baselines.hrv.spread); // higher better
    terms.push({ z, w: W.hrv });
    drivers.push(driver("HRV", inputs.hrv, baselines.hrv.mean, z, W.hrv));
  }
  if (Number.isFinite(inputs.restingHR) && baselines.restingHR) {
    const b = baselines.restingHR; // lower better → z(mean, value)
    const z = zScore(b.mean, inputs.restingHR, b.spread);
    terms.push({ z, w: W.rhr });
    drivers.push(driver("RestingHR", inputs.restingHR, b.mean, z, W.rhr));
  }
  if (Number.isFinite(inputs.sleepPerf)) {
    const z = (inputs.sleepPerf - SLEEP_CENTER) / SLEEP_SCALE;
    terms.push({ z, w: W.sleep });
    drivers.push(driver("Sleep", inputs.sleepPerf, SLEEP_CENTER, z, W.sleep));
  }
  if (Number.isFinite(inputs.resp) && baselines.resp) {
    const b = baselines.resp; // lower better
    const z = zScore(b.mean, inputs.resp, b.spread);
    terms.push({ z, w: W.resp });
    drivers.push(driver("Resp", inputs.resp, b.mean, z, W.resp));
  }
  if (Number.isFinite(inputs.skinTempDevC)) {
    const z = -Math.abs(inputs.skinTempDevC) / 1.0; // symmetric penalty
    terms.push({ z, w: W.skinTemp });
    drivers.push(driver("SkinTemp", inputs.skinTempDevC, 0, z, W.skinTemp));
  }

  if (!terms.length) return { score: null, drivers: [] };
  const totalW = terms.reduce((s, t) => s + t.w, 0);
  if (totalW <= 0) return { score: null, drivers: [] };
  const z = terms.reduce((s, t) => s + t.z * t.w, 0) / totalW;
  const score = 100 / (1 + Math.exp(-LOGISTIC_K * (z - LOGISTIC_Z0)));
  return { score: Math.max(0, Math.min(100, score)), drivers };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/recovery.test.mjs`
Expected: `6 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add readiness/recovery.mjs readiness/__tests__/recovery.test.mjs
git commit -m "feat(athlos): Readiness recovery composite + color bands"
```

---

## Task 3: `strain.mjs` — Load (Foster sRPE)

**Files:**
- Create: `readiness/strain.mjs`
- Test: `readiness/__tests__/strain.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { load, D_LOAD } from "../strain.mjs";

test("no session → 0 load", () => {
  expect(load(undefined)).toBe(0);
  expect(load({ rpe: 5 })).toBe(0);          // missing minutes
});

test("hard 2h session (RPE10x120) ≈ 88.6 (calibration anchor)", () => {
  expect(load({ rpe: 10, minutes: 120 })).toBeCloseTo(88.6, 1);
});

test("sustained maximal (AU == D_LOAD-1) saturates at 100", () => {
  expect(load({ rpe: 10, minutes: (D_LOAD - 1) / 10 })).toBeCloseTo(100, 3);
});

test("rpe is clamped to 0..10 and minutes floored at 0", () => {
  expect(load({ rpe: 99, minutes: 120 })).toBe(load({ rpe: 10, minutes: 120 }));
  expect(load({ rpe: 5, minutes: -30 })).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/strain.test.mjs`
Expected: FAIL — `Cannot find module '../strain.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/strain.mjs`:

```js
// Load (training strain) — phase 1 = Foster session-RPE (sRPE). Pure, no I/O.
// AU = RPE(0-10) * minutes; log-compressed to 0-100.
// D_LOAD calibrated so a hard 2h session (1200 AU) ~= 88 and a sustained max ~= 100.
// Phase 2 swaps AU for TRIMP (Karvonen/Edwards/Banister) at the same output scale.
export const D_LOAD = 3001;

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const round1 = (x) => Math.round(x * 10) / 10;

export function load(session) {
  if (!session || !Number.isFinite(session.rpe) || !Number.isFinite(session.minutes)) return 0;
  const rpe = clamp(session.rpe, 0, 10);
  const minutes = Math.max(0, session.minutes);
  const au = rpe * minutes;
  const score = 100 * Math.log(au + 1) / Math.log(D_LOAD);
  return round1(clamp(score, 0, 100));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/strain.test.mjs`
Expected: `4 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add readiness/strain.mjs readiness/__tests__/strain.test.mjs
git commit -m "feat(athlos): Load score via Foster session-RPE"
```

---

## Task 4: `sleep.mjs` — sleep performance

**Files:**
- Create: `readiness/sleep.mjs`
- Test: `readiness/__tests__/sleep.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { sleepPerformance, DEFAULT_NEED_HOURS } from "../sleep.mjs";

test("no hours → null", () => {
  expect(sleepPerformance({ quality: 0.8 })).toBeNull();
});

test("full night + top quality → 1.0", () => {
  expect(sleepPerformance({ hours: 8, quality: 1 })).toBeCloseTo(1.0, 3);
});

test("6h + 0.6 quality → 0.705", () => {
  expect(sleepPerformance({ hours: 6, quality: 0.6 })).toBeCloseTo(0.705, 3);
});

test("missing quality mirrors duration score", () => {
  // 6/8 = 0.75; 0.7*0.75 + 0.3*0.75 = 0.75
  expect(sleepPerformance({ hours: 6 })).toBeCloseTo(0.75, 3);
});

test("oversleep past need is capped at duration 1.0", () => {
  expect(sleepPerformance({ hours: 12, quality: 1 })).toBeCloseTo(1.0, 3);
  expect(DEFAULT_NEED_HOURS).toBe(8);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/sleep.test.mjs`
Expected: FAIL — `Cannot find module '../sleep.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/sleep.mjs`:

```js
// Sleep performance 0-1 (phase 1 coarse) — duration vs need, blended with subjective quality.
// Feeds the recovery Sleep term (centered at 0.85). Phase 2 replaces this with staging + debt.
export const DEFAULT_NEED_HOURS = 8;

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const round3 = (x) => Math.round(x * 1000) / 1000;

export function sleepPerformance({ hours, quality } = {}, needHours = DEFAULT_NEED_HOURS) {
  if (!Number.isFinite(hours)) return null;
  const durationScore = clamp(hours / needHours, 0, 1);
  const q = Number.isFinite(quality) ? clamp(quality, 0, 1) : durationScore;
  return round3(0.7 * durationScore + 0.3 * q);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/sleep.test.mjs`
Expected: `5 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add readiness/sleep.mjs readiness/__tests__/sleep.test.mjs
git commit -m "feat(athlos): coarse sleep-performance score"
```

---

## Task 5: `forecast.mjs` — next-day readiness trend

**Files:**
- Create: `readiness/forecast.mjs`
- Test: `readiness/__tests__/forecast.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { forecast } from "../forecast.mjs";

test("null today → null forecast", () => {
  expect(forecast(null, [50, 55], [40])).toBeNull();
});

test("flat history + low load → forecast equals today", () => {
  expect(forecast(60, [60, 60, 60], [50])).toBe(60);
});

test("recent overload drags tomorrow down", () => {
  // avgLoad7 = 60 → penalty (60-50)/5 = 2 → 60 - 2 = 58
  expect(forecast(60, [60, 60], [60, 60])).toBe(58);
});

test("upward readiness trend lifts the forecast", () => {
  // slope of [50,55,60] = 5/day; today 60, load neutral 50 → 65
  expect(forecast(60, [50, 55, 60], [50])).toBe(65);
});

test("result is clamped to 0..100", () => {
  expect(forecast(2, [10, 6, 2], [90])).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/forecast.test.mjs`
Expected: FAIL — `Cannot find module '../forecast.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/forecast.mjs`:

```js
// Next-day readiness forecast (phase 1 coarse): today + 7-day readiness trend
// minus a penalty for recent training overload. Pure, no I/O.
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);

function slope(ys) {
  const n = ys.length;
  if (n < 2) return 0;
  const xs = ys.map((_, i) => i);
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  return den === 0 ? 0 : num / den;
}

export function forecast(todayReadiness, recentReadiness = [], recentLoads = []) {
  if (todayReadiness == null) return null;
  const trend7 = slope(recentReadiness.slice(-7));
  const avgLoad7 = mean(recentLoads.slice(-7));
  const loadPenalty = Math.max(0, (avgLoad7 - 50) / 5);
  const f = todayReadiness + trend7 - loadPenalty;
  return Math.max(0, Math.min(100, Math.round(f)));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/forecast.test.mjs`
Expected: `5 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add readiness/forecast.mjs readiness/__tests__/forecast.test.mjs
git commit -m "feat(athlos): coarse next-day readiness forecast"
```

---

## Task 6: `adapters/manual.mjs` — check-in → DailyInput

**Files:**
- Create: `readiness/adapters/manual.mjs`
- Test: `readiness/__tests__/manual.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { fromManualCheckin } from "../adapters/manual.mjs";

test("parses and tags source + identity", () => {
  const d = fromManualCheckin(
    { hrv: "62", restingHR: "48", sleepHours: "7.5", sleepQuality: "0.8" },
    { athleteId: "tim", date: "2026-07-15" }
  );
  expect(d.athleteId).toBe("tim");
  expect(d.date).toBe("2026-07-15");
  expect(d.source).toBe("manual");
  expect(d.hrv).toBe(62);
  expect(d.restingHR).toBe(48);
  expect(d.sleepHours).toBe(7.5);
  expect(d.sleepQuality).toBe(0.8);
});

test("rejects implausible values to undefined (won't pollute baselines)", () => {
  const d = fromManualCheckin(
    { hrv: "2", restingHR: "20", sleepHours: "26", sleepQuality: "5" },
    { athleteId: "a", date: "2026-07-15" }
  );
  expect(d.hrv).toBeUndefined();        // < 5 ms
  expect(d.restingHR).toBeUndefined();  // < 25 bpm dropout
  expect(d.sleepHours).toBeUndefined(); // > 24 h
  expect(d.sleepQuality).toBeUndefined(); // > 1
});

test("parses a training session and clamps rpe", () => {
  const d = fromManualCheckin(
    { session: { rpe: "12", minutes: "75", type: "  Speed  " } },
    { athleteId: "a", date: "2026-07-15" }
  );
  expect(d.session).toEqual({ rpe: 10, minutes: 75, type: "Speed" });
});

test("omits session when incomplete", () => {
  const d = fromManualCheckin({ session: { rpe: "7" } }, { athleteId: "a", date: "2026-07-15" });
  expect(d.session).toBeUndefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/manual.test.mjs`
Expected: FAIL — `Cannot find module '../adapters/manual.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/adapters/manual.mjs`:

```js
// Manual morning check-in → normalized DailyInput. Out-of-range values become
// undefined so they neither score nor update baselines (artifact rejection).
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const num = (v) => (v === "" || v == null ? undefined : Number(v));
const inRange = (v, lo, hi) => (Number.isFinite(v) && v >= lo && v <= hi ? v : undefined);

export function fromManualCheckin(raw = {}, { athleteId, date } = {}) {
  let session;
  const rpe = num(raw.session?.rpe);
  const minutes = num(raw.session?.minutes);
  if (Number.isFinite(rpe) && Number.isFinite(minutes)) {
    session = {
      rpe: clamp(rpe, 0, 10),
      minutes: Math.max(0, minutes),
      type: typeof raw.session?.type === "string" ? raw.session.type.trim().slice(0, 40) : "",
    };
  }

  return {
    athleteId,
    date,
    source: "manual",
    hrv: inRange(num(raw.hrv), 5, 300),           // ms RMSSD plausible band
    restingHR: inRange(num(raw.restingHR), 25, 120), // < 25 rejected as dropout
    sleepHours: inRange(num(raw.sleepHours), 0, 24),
    sleepQuality: inRange(num(raw.sleepQuality), 0, 1),
    soreness: inRange(num(raw.soreness), 0, 1),
    mood: inRange(num(raw.mood), 0, 1),
    session,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/manual.test.mjs`
Expected: `4 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add readiness/adapters/manual.mjs readiness/__tests__/manual.test.mjs
git commit -m "feat(athlos): manual check-in adapter with artifact rejection"
```

---

## Task 7: `score.mjs` — pure daily scoring orchestrator

**Files:**
- Create: `readiness/score.mjs`
- Test: `readiness/__tests__/score.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect } from "bun:test";
import { scoreDaily } from "../score.mjs";

// Thread state across N identical days like the real store would.
function runDays(n, input) {
  let state = { records: [], baselines: {} };
  const out = [];
  for (let i = 0; i < n; i++) {
    const day = { ...input, date: `2026-07-${String(i + 1).padStart(2, "0")}` };
    const { record, baselines } = scoreDaily(day, state);
    state = { records: [...state.records, record], baselines };
    out.push(record);
  }
  return out;
}

test("cold-start: readiness null until HRV baseline seeds (>=14 prior nights)", () => {
  const days = runDays(16, { hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1, source: "manual" });
  expect(days[13].scores.readiness).toBeNull();   // day 14 scores against 13 priors
  expect(days[13].band).toBe("calibrating");
  expect(days[13].calibration).toEqual({ nights: 13, seed: 14 });
  expect(days[14].scores.readiness).not.toBeNull(); // day 15: 14 priors → usable
  expect(days[14].calibration).toBeNull();
});

test("load is computed from day 1 (no baseline needed)", () => {
  const days = runDays(1, { hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1,
                            session: { rpe: 8, minutes: 60 }, source: "manual" });
  expect(days[0].scores.load).toBeGreaterThan(0);
  expect(days[0].scores.sleepPerf).toBeCloseTo(1.0, 3);
});

test("record carries inputs, drivers once scored, and source", () => {
  const days = runDays(16, { hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1, source: "manual" });
  const scored = days[15];
  expect(scored.source).toBe("manual");
  expect(scored.inputs.hrv).toBe(55);
  expect(scored.drivers.length).toBeGreaterThan(0);
});

test("undefined input never creates a baseline", () => {
  const { baselines } = scoreDaily(
    { hrv: 55, restingHR: undefined, sleepHours: 8, sleepQuality: 1, date: "2026-07-01", source: "manual" },
    { records: [], baselines: {} }
  );
  expect(baselines.hrv).toBeDefined();        // hrv present → baseline seeded
  expect(baselines.restingHR).toBeUndefined(); // absent → no baseline created
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/score.test.mjs`
Expected: FAIL — `Cannot find module '../score.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/score.mjs`:

```js
// Pure daily scoring: (DailyInput, {records, baselines}) → {record, baselines}.
// Scores against the INCOMING baselines, then folds today's in-range values in
// (so a value never scores against itself). No I/O — the index.mjs edge persists.
import { updateBaseline } from "./baselines.mjs";
import { recovery, band } from "./recovery.mjs";
import { load } from "./strain.mjs";
import { sleepPerformance } from "./sleep.mjs";
import { forecast } from "./forecast.mjs";

export function scoreDaily(input, state = {}) {
  const prev = state.records || [];
  const baselines = { ...(state.baselines || {}) };

  const sleepPerf = sleepPerformance({ hours: input.sleepHours, quality: input.sleepQuality });

  const rec = recovery(
    { hrv: input.hrv, restingHR: input.restingHR, resp: input.resp,
      sleepPerf, skinTempDevC: input.skinTempDevC },
    baselines
  );

  const loadScore = load(input.session);

  const recentReadiness = prev.map((r) => r.scores?.readiness).filter((x) => x != null);
  const recentLoads = prev.map((r) => r.scores?.load).filter((x) => x != null);
  const fc = forecast(rec.score, recentReadiness, recentLoads);

  // Fold today's in-range values into the baselines (after scoring).
  if (Number.isFinite(input.hrv)) baselines.hrv = updateBaseline(baselines.hrv, input.hrv);
  if (Number.isFinite(input.restingHR)) baselines.restingHR = updateBaseline(baselines.restingHR, input.restingHR);
  if (Number.isFinite(input.resp)) baselines.resp = updateBaseline(baselines.resp, input.resp);

  const calibration = rec.score == null
    ? { nights: baselines.hrv?.nValid ?? 0, seed: 14 }
    : null;
  // nValid was just incremented above; report the PRE-fold count the score saw.
  if (calibration) calibration.nights = Math.max(0, (baselines.hrv?.nValid ?? 0) - (Number.isFinite(input.hrv) ? 1 : 0));

  const record = {
    date: input.date,
    source: input.source || "manual",
    inputs: {
      hrv: input.hrv ?? null,
      restingHR: input.restingHR ?? null,
      sleepHours: input.sleepHours ?? null,
      sleepQuality: input.sleepQuality ?? null,
      soreness: input.soreness ?? null,
      mood: input.mood ?? null,
      session: input.session ?? null,
    },
    scores: { readiness: rec.score, load: loadScore, sleepPerf, forecast: fc, hrv: null },
    band: band(rec.score),
    drivers: rec.drivers,
    calibration,
  };
  return { record, baselines };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/score.test.mjs`
Expected: all pass (4 tests).

- [ ] **Step 5: Commit**

```bash
git add readiness/score.mjs readiness/__tests__/score.test.mjs
git commit -m "feat(athlos): pure daily readiness scoring orchestrator"
```

---

## Task 8: `profiles.mjs` — readiness persistence helpers

**Files:**
- Modify: `profiles.mjs` (add two exports near the other mutations, after `saveConversation`)
- Test: `readiness/__tests__/profiles-readiness.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createProfile, readReadiness, writeReadiness } from "../../profiles.mjs";

const TEST_ID_PREFIX = "rtest";
let id;

beforeEach(() => {
  const p = createProfile({ name: "R Test", sport: "Test" });
  id = p.id;
});
afterEach(() => {
  const f = join(import.meta.dir, "..", "..", "profiles", `${id}.json`);
  if (existsSync(f)) rmSync(f);
});

test("readReadiness on fresh profile → empty records + baselines", () => {
  expect(readReadiness(id)).toEqual({ records: [], baselines: {} });
});

test("writeReadiness appends a record and stores baselines", () => {
  writeReadiness(id, { record: { date: "2026-07-15", scores: { readiness: 60 } },
                       baselines: { hrv: { mean: 55, spread: 4, nValid: 20 } } });
  const { records, baselines } = readReadiness(id);
  expect(records.length).toBe(1);
  expect(records[0].date).toBe("2026-07-15");
  expect(baselines.hrv.mean).toBe(55);
});

test("writeReadiness replaces a same-date record (idempotent per day)", () => {
  writeReadiness(id, { record: { date: "2026-07-15", scores: { readiness: 60 } }, baselines: {} });
  writeReadiness(id, { record: { date: "2026-07-15", scores: { readiness: 42 } }, baselines: {} });
  const { records } = readReadiness(id);
  expect(records.length).toBe(1);
  expect(records[0].scores.readiness).toBe(42);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/profiles-readiness.test.mjs`
Expected: FAIL — `readReadiness`/`writeReadiness` are not exported.

- [ ] **Step 3: Add the implementation to `profiles.mjs`**

Append after the `saveConversation` function (around line 160, before the `memoryBlock` export):

```js
// ── readiness engine store (sub-project A) ──────────────────────────────────
export function readReadiness(id) {
  const p = loadProfile(id);
  return { records: p?.readiness || [], baselines: p?.readinessBaselines || {} };
}

export function writeReadiness(id, { record, baselines }) {
  const p = loadProfile(id);
  if (!p) return null;
  p.readiness = p.readiness || [];
  const i = p.readiness.findIndex((r) => r.date === record.date);
  if (i >= 0) p.readiness[i] = record;
  else p.readiness.push(record);
  if (p.readiness.length > 120) p.readiness = p.readiness.slice(-120);
  p.readinessBaselines = baselines || {};
  return saveProfile(p);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/profiles-readiness.test.mjs`
Expected: `3 pass, 0 fail`.

- [ ] **Step 5: Commit**

```bash
git add profiles.mjs readiness/__tests__/profiles-readiness.test.mjs
git commit -m "feat(athlos): per-athlete readiness persistence helpers"
```

---

## Task 9: `index.mjs` — computeDaily + readinessBlock

**Files:**
- Create: `readiness/index.mjs`
- Test: `readiness/__tests__/index.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createProfile } from "../../profiles.mjs";
import { computeDaily, readinessBlock } from "../index.mjs";

let id;
beforeEach(() => { id = createProfile({ name: "Idx Test", sport: "Test" }).id; });
afterEach(() => {
  const f = join(import.meta.dir, "..", "..", "profiles", `${id}.json`);
  if (existsSync(f)) rmSync(f);
});

test("computeDaily persists a record and returns snapshot", () => {
  const snap = computeDaily(id, { date: "2026-07-15", source: "manual",
    hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1, session: { rpe: 8, minutes: 60 } });
  expect(snap.record.date).toBe("2026-07-15");
  expect(snap.record.scores.load).toBeGreaterThan(0);
  expect(snap.history.length).toBe(1);
});

test("readinessBlock is empty before any check-in", () => {
  expect(readinessBlock(id, "Idx Test")).toBe("");
});

test("readinessBlock renders band + guidance after a check-in", () => {
  computeDaily(id, { date: "2026-07-15", source: "manual",
    hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1 });
  const block = readinessBlock(id, "Idx Test");
  expect(block).toContain("Readiness");
  expect(block.toLowerCase()).toContain("guidance");
  expect(block).toContain("Idx Test");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test readiness/__tests__/index.test.mjs`
Expected: FAIL — `Cannot find module '../index.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `readiness/index.mjs`:

```js
// Readiness engine edge: I/O orchestrator + Coach system-prompt block.
import { readReadiness, writeReadiness } from "../profiles.mjs";
import { scoreDaily } from "./score.mjs";

export function computeDaily(athleteId, input) {
  const state = readReadiness(athleteId);
  const { record, baselines } = scoreDaily({ ...input, athleteId }, state);
  writeReadiness(athleteId, { record, baselines });
  const after = readReadiness(athleteId);
  return { record, history: after.records.slice(-30) };
}

const pct = (d) => (d == null ? "" : ` (${d > 0 ? "+" : ""}${d}%)`);

export function readinessBlock(athleteId, athleteName = "") {
  const { records } = readReadiness(athleteId);
  if (!records.length) return "";
  const r = records[records.length - 1];
  const s = r.scores || {};
  const lines = [];
  lines.push(`## Današnja pripravljenost (Readiness) — ${athleteName}`);

  if (s.readiness == null) {
    const n = r.calibration?.nights ?? 0;
    lines.push(`Readiness: KALIBRACIJA — ${n} od 14 noči. Load in spanje sta že na voljo.`);
  } else {
    lines.push(`Readiness ${Math.round(s.readiness)} (${r.band.toUpperCase()}).`);
    const drv = (r.drivers || []).map((d) => {
      if (d.metric === "HRV") return `HRV ${d.value}ms${pct(d.deltaPct)}`;
      if (d.metric === "RestingHR") return `mirovni SU ${d.value}${pct(d.deltaPct)}`;
      if (d.metric === "Sleep") return `spanje ${Math.round((s.sleepPerf ?? 0) * 100)}%`;
      return `${d.metric} ${d.value}`;
    });
    if (drv.length) lines.push(drv.join(", ") + ".");
  }
  if (s.load != null) lines.push(`Današnji Load: ${s.load}/100.`);
  if (s.forecast != null) lines.push(`Napoved za jutri: ~${s.forecast}.`);
  if (r.inputs?.soreness != null || r.inputs?.mood != null) {
    lines.push(`Subjektivno: bolečina/utrujenost ${r.inputs.soreness ?? "?"}, razpoloženje ${r.inputs.mood ?? "?"} (upoštevaj kot kontekst — lahko premosti oceno).`);
  }
  lines.push(
    "Guidance: RED → predlagaj deload / tehniko / mobilnost, NE dovoli preobremenitve; " +
    "YELLOW → zmeren volumen, drži intenziteto; " +
    "GREEN + nizek nedavni load → prižgi ključni trening; " +
    "GREEN + visok nedavni load → vzdržuj, pazi na kopičenje utrujenosti."
  );
  lines.push("Opomba: Readiness je približek, ne medicinski nasvet.");
  return lines.join("\n");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test readiness/__tests__/index.test.mjs`
Expected: `3 pass, 0 fail`.

- [ ] **Step 5: Run the whole suite (regression gate)**

Run: `bun test`
Expected: all test files pass, `0 fail`.

- [ ] **Step 6: Commit**

```bash
git add readiness/index.mjs readiness/__tests__/index.test.mjs
git commit -m "feat(athlos): computeDaily orchestrator + Coach readiness block"
```

---

## Task 10: `server.mjs` — endpoints + Coach injection

**Files:**
- Modify: `server.mjs` — imports (top), `buildSystemBlocks` (inject block), `fetch` router (2 endpoints)

- [ ] **Step 1: Add imports at the top of `server.mjs`**

Find the existing import block (lines ~6–11) and add these two imports right after the `./proposals.mjs` import:

```js
import { computeDaily, readinessBlock } from "./readiness/index.mjs";
import { fromManualCheckin } from "./readiness/adapters/manual.mjs";
```

Also add `readReadiness` to the existing `./profiles.mjs` import list (the destructured import that already includes `loadProfile`, `createProfile`, etc.):

```js
import {
  listProfiles, loadProfile, createProfile, appendPlan, appendFeedback,
  memoryBlock, isValidId, readReadiness,
} from "./profiles.mjs";
```

- [ ] **Step 2: Inject the readiness block into `buildSystemBlocks`**

In `buildSystemBlocks(profile)`, find the per-athlete memory push:

```js
  if (profile) {
    const mem = memoryBlock(profile);
    if (mem) blocks.push({ type: "text", text: mem });
  }
  return blocks;
```

Replace it with (adds the readiness block right after memory — not cached, changes daily):

```js
  if (profile) {
    const mem = memoryBlock(profile);
    if (mem) blocks.push({ type: "text", text: mem });
    const rb = readinessBlock(profile.id, profile.name);
    if (rb) blocks.push({ type: "text", text: rb });
  }
  return blocks;
```

- [ ] **Step 3: Add the two endpoints in the `fetch` router**

Find the profiles GET-by-id block (the `profMatch` handler). Immediately after its closing `}`, add:

```js
    // ── API: readiness — manual check-in ───────────────────────────────────
    if (url.pathname === "/api/readiness/checkin" && req.method === "POST") {
      try {
        const raw = await req.json();
        const id = raw.athleteId;
        if (!isValidId(id) || !loadProfile(id)) return json({ error: "Unknown profile" }, 404);
        const date = raw.date || new Date().toISOString().slice(0, 10);
        const input = fromManualCheckin(raw, { athleteId: id, date });
        const snapshot = computeDaily(id, input);
        return json(snapshot, 201);
      } catch (e) {
        return json({ error: String(e) }, 400);
      }
    }

    // ── API: readiness — history for the athlete card ──────────────────────
    const rdMatch = url.pathname.match(/^\/api\/readiness\/([^/]+)$/);
    if (rdMatch && req.method === "GET") {
      const id = decodeURIComponent(rdMatch[1]);
      if (!isValidId(id)) return json({ error: "Invalid id" }, 400);
      const { records } = readReadiness(id);
      return json({ latest: records[records.length - 1] || null, history: records.slice(-30) });
    }
```

> The GET regex would also match `.../checkin`, but `checkin` is only handled on POST and is listed first, so a real `GET /api/readiness/:id` never collides. `:id` is validated by `isValidId`, so `checkin` (a valid slug) simply returns an empty history if ever hit via GET — harmless.

- [ ] **Step 4: Smoke-test the endpoints (manual — the underlying logic is unit-tested)**

Start the server (run from `athlos-chatbot/`; if the repo is on iCloud and Bun `ETIMEDOUT`s, retry or copy the folder to `/tmp` first):

Run: `bun server.mjs` (leave running in one terminal)

In another terminal, create a profile then post a check-in:

```bash
ID=$(curl -s -X POST localhost:8010/api/profiles -H 'content-type: application/json' \
  -d '{"name":"Smoke Test","sport":"Košarka"}' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "profile: $ID"
curl -s -X POST localhost:8010/api/readiness/checkin -H 'content-type: application/json' \
  -d "{\"athleteId\":\"$ID\",\"hrv\":58,\"restingHR\":49,\"sleepHours\":7.5,\"sleepQuality\":0.8,\"session\":{\"rpe\":8,\"minutes\":60}}"
echo
curl -s localhost:8010/api/readiness/$ID
```

Expected: the POST returns JSON with `record.scores.load > 0` and `record.band` = `"calibrating"` (new athlete, no baseline yet); the GET returns `{ latest: {...}, history: [ {...} ] }`. Clean up: `rm profiles/$ID.json`.

- [ ] **Step 5: Commit**

```bash
git add server.mjs
git commit -m "feat(athlos): readiness check-in + history endpoints, Coach injection"
```

---

## Task 11: Athlete-facing readiness card

**Files:**
- Modify: `app.js` — add `loadReadiness()` + `renderReadinessCard()`; call from `openProfile`
- Modify: `style.css` — append `.readiness-card` styles
- Modify: `index.html` — nothing required (card is created in JS and inserted into `#chatView`)

- [ ] **Step 1: Append the card styles to `style.css`**

Add at the end of `style.css` (Apple-light: white surface, soft border, band-colored ring):

```css
/* ── Readiness card ──────────────────────────────────────────────── */
.readiness-card{background:#fff;border:1px solid #ececf1;border-radius:16px;
  padding:16px 18px;margin:0 0 14px;display:flex;gap:18px;align-items:center;
  box-shadow:0 1px 2px rgba(16,17,26,.04)}
.readiness-ring{--rc:#9aa0ac;width:64px;height:64px;border-radius:50%;flex:none;
  display:grid;place-items:center;font-weight:700;font-size:20px;color:#10111a;
  background:conic-gradient(var(--rc) calc(var(--pct,0)*1%),#eef0f4 0)}
.readiness-ring>span{width:50px;height:50px;border-radius:50%;background:#fff;
  display:grid;place-items:center}
.readiness-ring.red{--rc:#e5484d}.readiness-ring.yellow{--rc:#f5a623}
.readiness-ring.green{--rc:#30a46c}.readiness-ring.calibrating{--rc:#c9ccd4}
.readiness-main{flex:1;min-width:0}
.readiness-title{font-size:12px;letter-spacing:.04em;color:#8a8f9a;text-transform:uppercase}
.readiness-band{font-size:15px;font-weight:600;color:#10111a;margin:2px 0 6px}
.readiness-chips{display:flex;flex-wrap:wrap;gap:6px}
.readiness-chip{font-size:12px;color:#41454f;background:#f4f5f7;border-radius:999px;
  padding:3px 9px;white-space:nowrap}
.readiness-chip .up{color:#30a46c}.readiness-chip .down{color:#e5484d}
.readiness-load{margin-top:8px;font-size:12px;color:#8a8f9a}
.readiness-load b{color:#10111a}
.readiness-checkin{margin-left:auto;font-size:12px;font-weight:600;color:#5b5ef0;
  background:none;border:none;cursor:pointer;padding:6px}
.readiness-note{font-size:11px;color:#aeb2bb;margin-top:6px}
```

- [ ] **Step 2: Add the fetch + render functions to `app.js`**

Add near the other render helpers (e.g. after `renderMarkdown`, before `addMessage`):

```js
async function loadReadiness(profileId) {
  document.getElementById('readinessCard')?.remove();
  let data;
  try {
    const r = await fetch(`/api/readiness/${encodeURIComponent(profileId)}`);
    if (!r.ok) return;
    data = await r.json();
  } catch { return; }
  if (!data || !data.latest) { renderReadinessCard(null, profileId); return; }
  renderReadinessCard(data.latest, profileId);
}

function renderReadinessCard(rec, profileId) {
  const card = document.createElement('div');
  card.id = 'readinessCard';
  card.className = 'readiness-card';

  const s = rec?.scores || {};
  const band = rec?.band || 'calibrating';
  const scored = s.readiness != null;
  const pct = scored ? Math.round(s.readiness) : 0;

  const chips = (rec?.drivers || []).map(d => {
    if (d.metric === 'HRV') return chip(`HRV ${d.value}ms`, d.deltaPct);
    if (d.metric === 'RestingHR') return chip(`Mirovni SU ${d.value}`, d.deltaPct == null ? null : -d.deltaPct);
    if (d.metric === 'Sleep') return chip(`Spanje ${Math.round((s.sleepPerf ?? 0) * 100)}%`, null);
    return chip(`${d.metric} ${d.value}`, null);
  }).join('');

  card.innerHTML = `
    <div class="readiness-ring ${band}" style="--pct:${pct}"><span>${scored ? pct : '–'}</span></div>
    <div class="readiness-main">
      <div class="readiness-title">Pripravljenost</div>
      <div class="readiness-band">${scored ? bandLabel(band) : `Kalibracija — ${rec?.calibration?.nights ?? 0}/14 noči`}</div>
      <div class="readiness-chips">${chips}</div>
      ${s.load != null ? `<div class="readiness-load">Današnji load: <b>${s.load}</b>/100${s.forecast != null ? ` · napoved jutri ~${s.forecast}` : ''}</div>` : ''}
      <div class="readiness-note">Približek, ne medicinski nasvet.</div>
    </div>
    <button class="readiness-checkin" id="readinessCheckin">＋ Jutranji vnos</button>`;

  const view = document.getElementById('chatView');
  view.insertBefore(card, view.firstChild);
  document.getElementById('readinessCheckin').addEventListener('click', () => checkinPrompt(profileId));
}

function chip(label, deltaPct) {
  const arrow = deltaPct == null ? '' :
    ` <span class="${deltaPct >= 0 ? 'up' : 'down'}">${deltaPct >= 0 ? '▲' : '▼'}${Math.abs(deltaPct)}%</span>`;
  return `<span class="readiness-chip">${label}${arrow}</span>`;
}
function bandLabel(band) {
  return { red: 'Slaba (rdeča)', yellow: 'Zmerna (rumena)', green: 'Dobra (zelena)' }[band] || band;
}

async function checkinPrompt(profileId) {
  const hrv = prompt('HRV (ms) — iz aplikacije/pasu (prazno = preskoči):', '');
  const restingHR = prompt('Mirovni srčni utrip (bpm):', '');
  const sleepHours = prompt('Ure spanja:', '');
  const sleepQuality = prompt('Kakovost spanja 0–1 (npr. 0.8):', '');
  const rpe = prompt('Včerajšnji trening RPE 0–10 (prazno = brez):', '');
  const minutes = rpe ? prompt('Trajanje treninga (min):', '') : '';
  const body = { athleteId: profileId, hrv, restingHR, sleepHours, sleepQuality };
  if (rpe && minutes) body.session = { rpe, minutes, type: '' };
  try {
    const r = await fetch('/api/readiness/checkin', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) { alert('Vnos ni uspel.'); return; }
    await loadReadiness(profileId);
  } catch { alert('Napaka pri pošiljanju.'); }
}
```

- [ ] **Step 3: Call `loadReadiness` when a profile opens**

In `app.js`, in `openProfile(id)`, after `enterChat(false);` add the readiness load:

```js
    currentProfile = data.profile;
    enterChat(false);
    loadReadiness(currentProfile.id);
```

- [ ] **Step 4: Manual verification in the browser**

Start the server (`bun server.mjs`), open `http://localhost:8010`, open an existing profile (or create one).
Expected: a readiness card appears above the chat showing "Kalibracija — 0/14 noči" for a new athlete. Click "＋ Jutranji vnos", enter HRV 58 / RHR 49 / sleep 7.5 / quality 0.8 / RPE 8 / 60 min. Expected: the card refreshes showing a Load value and the calibrating state (readiness stays calibrating until 14 nights). No console errors.

- [ ] **Step 5: Commit**

```bash
git add app.js style.css
git commit -m "feat(athlos): athlete-facing readiness card + morning check-in"
```

---

## Final verification

- [ ] **Run the full test suite**

Run: `bun test`
Expected: every `readiness/__tests__/*.test.mjs` file passes, `0 fail`.

- [ ] **Confirm the Coach actually sees readiness**

With the server running and a profile that has ≥1 check-in, start a chat and ask the Coach: *"Kakšna je moja pripravljenost danes in kaj naj treniram?"*
Expected: the Coach references today's readiness/load and gives a matching train-hard/hold/deload recommendation (proof the `readinessBlock` reached the system prompt).

---

## Self-Review notes (done during authoring)

- **Spec coverage:** baselines §6.1 → T1 · recovery §6.2 (incl. cold-start, missing-term renormalize, drivers) → T2 · load §6.3 sRPE → T3 · sleep §6.5 → T4 · forecast §6.6 → T5 · input contract + artifact rejection §5/§9 → T6 · orchestrator §8 → T7/T9 · data model §7 (athlete-keyed, source-tagged, same-day upsert) → T8 · Coach block + guidance §8 → T9 · endpoints §10 → T10 · athlete card §10 → T11 · disclaimer §2/§9 → present in T9 block + T11 card. HRV RR-interval module (§6.4) and wearable adapters are explicitly phase-2 and excluded.
- **Soreness/mood:** captured in `record.inputs` (T7) and surfaced as override context in the Coach block (T9), never in the numeric score — matches the spec's §6.2 decision.
- **Type consistency:** `updateBaseline/isUsable/zScore` (T1) used unchanged in T2 and T7; `recovery()` returns `{score, drivers}` consumed identically in T7/T9; `scoreDaily(input, state)` shape matches `computeDaily` (T9) and the store's `{records, baselines}` (T8); `band()` string values (`red/yellow/green/calibrating`) match the CSS classes in T11.
- **Placeholders:** none — every code step is complete and runnable.
