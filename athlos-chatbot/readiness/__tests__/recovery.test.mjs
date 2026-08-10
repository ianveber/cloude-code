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
