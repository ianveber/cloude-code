import { test, expect } from "bun:test";
import { forecast } from "../forecast.mjs";

test("null today → null forecast", () => {
  expect(forecast(null, [50, 55], [40])).toBeNull();
});

test("flat history + low load → forecast equals today", () => {
  expect(forecast(60, [60, 60, 60], [50])).toBe(60);
});

test("recent overload drags tomorrow down", () => {
  // avgLoad7 = 60 → penalty (60-50)/5 = 2 → 60 - 2 = 58
  expect(forecast(60, [60, 60], [60, 60])).toBe(58);
});

test("upward readiness trend lifts the forecast", () => {
  // slope of [50,55,60] = 5/day; today 60, load neutral 50 → 65
  expect(forecast(60, [50, 55, 60], [50])).toBe(65);
});

test("result is clamped to 0..100", () => {
  expect(forecast(2, [10, 6, 2], [90])).toBe(0);
});
