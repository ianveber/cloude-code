import { test, expect } from "bun:test";
import { load, D_LOAD } from "../strain.mjs";

test("no session → 0 load", () => {
  expect(load(undefined)).toBe(0);
  expect(load({ rpe: 5 })).toBe(0);          // missing minutes
});

test("hard 2h session (RPE10x120) ≈ 88.6 (calibration anchor)", () => {
  expect(load({ rpe: 10, minutes: 120 })).toBeCloseTo(88.6, 1);
});

test("sustained maximal (AU == D_LOAD-1) saturates at 100", () => {
  expect(load({ rpe: 10, minutes: (D_LOAD - 1) / 10 })).toBeCloseTo(100, 3);
});

test("rpe is clamped to 0..10 and minutes floored at 0", () => {
  expect(load({ rpe: 99, minutes: 120 })).toBe(load({ rpe: 10, minutes: 120 }));
  expect(load({ rpe: 5, minutes: -30 })).toBe(0);
});
