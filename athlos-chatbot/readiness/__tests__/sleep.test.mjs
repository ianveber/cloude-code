import { test, expect } from "bun:test";
import { sleepPerformance, DEFAULT_NEED_HOURS } from "../sleep.mjs";

test("no hours → null", () => {
  expect(sleepPerformance({ quality: 0.8 })).toBeNull();
});

test("full night + top quality → 1.0", () => {
  expect(sleepPerformance({ hours: 8, quality: 1 })).toBeCloseTo(1.0, 3);
});

test("6h + 0.6 quality → 0.705", () => {
  expect(sleepPerformance({ hours: 6, quality: 0.6 })).toBeCloseTo(0.705, 3);
});

test("missing quality mirrors duration score", () => {
  // 6/8 = 0.75; 0.7*0.75 + 0.3*0.75 = 0.75
  expect(sleepPerformance({ hours: 6 })).toBeCloseTo(0.75, 3);
});

test("oversleep past need is capped at duration 1.0", () => {
  expect(sleepPerformance({ hours: 12, quality: 1 })).toBeCloseTo(1.0, 3);
  expect(DEFAULT_NEED_HOURS).toBe(8);
});
