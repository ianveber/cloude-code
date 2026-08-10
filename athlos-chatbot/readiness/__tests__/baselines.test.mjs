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
