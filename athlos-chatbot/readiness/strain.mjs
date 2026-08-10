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
