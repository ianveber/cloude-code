import { test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createProfile, readReadiness, writeReadiness } from "../../profiles.mjs";

const TEST_ID_PREFIX = "rtest";
let id;

beforeEach(() => {
  const p = createProfile({ name: "R Test", sport: "Test" });
  id = p.id;
});
afterEach(() => {
  const f = join(import.meta.dir, "..", "..", "profiles", `${id}.json`);
  if (existsSync(f)) rmSync(f);
});

test("readReadiness on fresh profile → empty records + baselines", () => {
  expect(readReadiness(id)).toEqual({ records: [], baselines: {} });
});

test("writeReadiness appends a record and stores baselines", () => {
  writeReadiness(id, { record: { date: "2026-07-15", scores: { readiness: 60 } },
                       baselines: { hrv: { mean: 55, spread: 4, nValid: 20 } } });
  const { records, baselines } = readReadiness(id);
  expect(records.length).toBe(1);
  expect(records[0].date).toBe("2026-07-15");
  expect(baselines.hrv.mean).toBe(55);
});

test("writeReadiness replaces a same-date record (idempotent per day)", () => {
  writeReadiness(id, { record: { date: "2026-07-15", scores: { readiness: 60 } }, baselines: {} });
  writeReadiness(id, { record: { date: "2026-07-15", scores: { readiness: 42 } }, baselines: {} });
  const { records } = readReadiness(id);
  expect(records.length).toBe(1);
  expect(records[0].scores.readiness).toBe(42);
});
