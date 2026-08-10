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
