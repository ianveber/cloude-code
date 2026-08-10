import { test, expect } from "bun:test";
import { fromManualCheckin } from "../adapters/manual.mjs";

test("parses and tags source + identity", () => {
  const d = fromManualCheckin(
    { hrv: "62", restingHR: "48", sleepHours: "7.5", sleepQuality: "0.8" },
    { athleteId: "tim", date: "2026-07-15" }
  );
  expect(d.athleteId).toBe("tim");
  expect(d.date).toBe("2026-07-15");
  expect(d.source).toBe("manual");
  expect(d.hrv).toBe(62);
  expect(d.restingHR).toBe(48);
  expect(d.sleepHours).toBe(7.5);
  expect(d.sleepQuality).toBe(0.8);
});

test("rejects implausible values to undefined (won't pollute baselines)", () => {
  const d = fromManualCheckin(
    { hrv: "2", restingHR: "20", sleepHours: "26", sleepQuality: "5" },
    { athleteId: "a", date: "2026-07-15" }
  );
  expect(d.hrv).toBeUndefined();        // < 5 ms
  expect(d.restingHR).toBeUndefined();  // < 25 bpm dropout
  expect(d.sleepHours).toBeUndefined(); // > 24 h
  expect(d.sleepQuality).toBeUndefined(); // > 1
});

test("parses a training session and clamps rpe", () => {
  const d = fromManualCheckin(
    { session: { rpe: "12", minutes: "75", type: "  Speed  " } },
    { athleteId: "a", date: "2026-07-15" }
  );
  expect(d.session).toEqual({ rpe: 10, minutes: 75, type: "Speed" });
});

test("omits session when incomplete", () => {
  const d = fromManualCheckin({ session: { rpe: "7" } }, { athleteId: "a", date: "2026-07-15" });
  expect(d.session).toBeUndefined();
});
