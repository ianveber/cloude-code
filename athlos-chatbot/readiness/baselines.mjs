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
