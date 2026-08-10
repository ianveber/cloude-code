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
