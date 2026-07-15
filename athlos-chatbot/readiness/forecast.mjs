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
