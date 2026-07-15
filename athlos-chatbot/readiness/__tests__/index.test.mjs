import { test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createProfile } from "../../profiles.mjs";
import { computeDaily, readinessBlock } from "../index.mjs";

let id;
beforeEach(() => { id = createProfile({ name: "Idx Test", sport: "Test" }).id; });
afterEach(() => {
  const f = join(import.meta.dir, "..", "..", "profiles", `${id}.json`);
  if (existsSync(f)) rmSync(f);
});

test("computeDaily persists a record and returns snapshot", () => {
  const snap = computeDaily(id, { date: "2026-07-15", source: "manual",
    hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1, session: { rpe: 8, minutes: 60 } });
  expect(snap.record.date).toBe("2026-07-15");
  expect(snap.record.scores.load).toBeGreaterThan(0);
  expect(snap.history.length).toBe(1);
});

test("readinessBlock is empty before any check-in", () => {
  expect(readinessBlock(id, "Idx Test")).toBe("");
});

test("readinessBlock renders band + guidance after a check-in", () => {
  computeDaily(id, { date: "2026-07-15", source: "manual",
    hrv: 55, restingHR: 50, sleepHours: 8, sleepQuality: 1 });
  const block = readinessBlock(id, "Idx Test");
  expect(block).toContain("Readiness");
  expect(block.toLowerCase()).toContain("guidance");
  expect(block).toContain("Idx Test");
});
