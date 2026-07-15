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
