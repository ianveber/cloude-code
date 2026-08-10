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
