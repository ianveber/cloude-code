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
