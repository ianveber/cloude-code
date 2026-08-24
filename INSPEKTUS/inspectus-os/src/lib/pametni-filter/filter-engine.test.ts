import { expect, test } from "bun:test";
import { runFilter } from "./filter-engine";
import { compareIngestOrder } from "./ingest";
import { parseShipListText } from "./ship-list";
import type { IngestedPhoto, VinRead } from "./types";
import {
  extractValidVin,
  isValidVin,
  looksLikeFailedVinRead,
  uniqueOneCharCorrection,
} from "./vin";

const SHIP = [
  "WVWZZZ3CZWE123456",
  "WVWZZZ3CZWE123457",
  "JM1BL1SF8A1234567",
];

function photo(id: string, extra: Partial<IngestedPhoto> = {}): IngestedPhoto {
  return { id, name: `${id}.jpg`, capturedAt: extra.capturedAt ?? Number(id.replace(/\D/g, "") || 1) * 1000, ...extra };
}

function reads(map: Record<string, string | { vin: string | null; raw?: string; looksLikePlate?: boolean }>): Record<string, VinRead> {
  const out: Record<string, VinRead> = {};
  for (const [id, v] of Object.entries(map)) {
    if (typeof v === "string") {
      out[id] = { photoId: id, vin: v || null, source: "manual" };
    } else {
      out[id] = { photoId: id, vin: v.vin, raw: v.raw, looksLikePlate: v.looksLikePlate, source: "manual" };
    }
  }
  return out;
}

test("VIN shape: 17 chars, no I/O/Q", () => {
  expect(isValidVin("WVWZZZ3CZWE123456")).toBe(true);
  expect(isValidVin("WVWZZZ3CZWE12345")).toBe(false); // 16
  expect(isValidVin("WVWZZZ3CZIE123456")).toBe(false); // I
  expect(isValidVin("WVWZZZ3CZOE123456")).toBe(false); // O
  expect(isValidVin("WVWZZZ3CZQE123456")).toBe(false); // Q
  expect(extractValidVin("plate WVWZZZ3CZWE123456 end")).toBe("WVWZZZ3CZWE123456");
  expect(extractValidVin("WVWZZZ3CZWE123456 and JM1BL1SF8A1234567")).toBe(null); // two VINs = don't guess
});

test("valid VIN opens a vehicle; following damages attach", () => {
  const result = runFilter({
    photos: [photo("1"), photo("2"), photo("3")],
    reads: reads({ "1": SHIP[0], "2": "", "3": "" }),
    shipList: SHIP,
  });
  expect(result.vehicles).toHaveLength(1);
  expect(result.vehicles[0].vin).toBe(SHIP[0]);
  expect(result.vehicles[0].photoIds).toEqual(["1", "2", "3"]);
  expect(result.unsorted).toHaveLength(0);
});

test("second VIN closes the first vehicle", () => {
  const result = runFilter({
    photos: [photo("1"), photo("2"), photo("3"), photo("4")],
    reads: reads({ "1": SHIP[0], "2": "", "3": SHIP[1], "4": "" }),
    shipList: SHIP,
  });
  expect(result.vehicles).toHaveLength(2);
  expect(result.vehicles[0].photoIds).toEqual(["1", "2"]);
  expect(result.vehicles[1].photoIds).toEqual(["3", "4"]);
});

test("failed VIN read closes previous vehicle; photos go to Nerazvrščeno", () => {
  const result = runFilter({
    photos: [photo("1"), photo("2"), photo("3"), photo("4")],
    reads: reads({
      "1": SHIP[0],
      "2": "",
      "3": { vin: null, raw: "WVWZZZ3CZWE12345", looksLikePlate: true }, // 16-char fail
      "4": "",
    }),
    shipList: SHIP,
  });
  expect(result.vehicles).toHaveLength(1);
  expect(result.vehicles[0].photoIds).toEqual(["1", "2"]);
  expect(result.closedByFailedRead).toBe(1);
  expect(result.unsorted.map(u => u.photoId).sort()).toEqual(["3", "4"]);
});

test("damage with no open vehicle is unsorted — never guessed onto a neighbour", () => {
  const result = runFilter({
    photos: [photo("1"), photo("2")],
    reads: reads({ "1": "", "2": "" }),
    shipList: SHIP,
  });
  expect(result.vehicles).toHaveLength(0);
  expect(result.unsorted).toHaveLength(2);
});

test("unique 1-char correction is applied and flagged", () => {
  // Change the first char only — unique vs SHIP[0] (SHIP[1] also differs at the last digit).
  const mistype = "XVWZZZ3CZWE123456";
  expect(uniqueOneCharCorrection(mistype, SHIP)).toBe(SHIP[0]);
  const result = runFilter({
    photos: [photo("1")],
    reads: reads({ "1": mistype }),
    shipList: SHIP,
  });
  expect(result.vehicles[0].vin).toBe(SHIP[0]);
  expect(result.vehicles[0].correctedFrom).toBe(mistype);
  expect(result.alerts.some(a => a.type === "corrected")).toBe(true);
});

test("ambiguous 1-char (two candidates) is not corrected — never guess", () => {
  // SHIP[0] and SHIP[1] differ by one char (6 vs 7). A read equal to neither
  // at distance 1 from BOTH would be e.g. last char 9 — distance 1 from both.
  const ambiguous = "WVWZZZ3CZWE123459";
  expect(uniqueOneCharCorrection(ambiguous, SHIP)).toBe(null);
  const result = runFilter({
    photos: [photo("1")],
    reads: reads({ "1": ambiguous }),
    shipList: SHIP,
  });
  expect(result.vehicles[0].vin).toBe(ambiguous);
  expect(result.vehicles[0].correctedFrom).toBeUndefined();
  expect(result.alerts.some(a => a.type === "unexpected_vin")).toBe(true);
});

test("invalid VIN is never mapped onto the closest ship VIN", () => {
  expect(uniqueOneCharCorrection("SHORT", SHIP)).toBe(null);
  expect(looksLikeFailedVinRead("WVWZZZ3CZWE12345")).toBe(true);
});

test("bidirectional alerts: VIN not on list + ship VIN with no photos", () => {
  const extra = "SALVA2BG3CH123456";
  const result = runFilter({
    photos: [photo("1")],
    reads: reads({ "1": extra }),
    shipList: SHIP,
  });
  expect(result.alerts.some(a => a.type === "unexpected_vin" && a.vin === extra)).toBe(true);
  expect(result.alerts.filter(a => a.type === "missing_on_ship")).toHaveLength(3);
});

test("duplicate VIN alert", () => {
  const result = runFilter({
    photos: [photo("1"), photo("2")],
    reads: reads({ "1": SHIP[0], "2": SHIP[0] }),
    shipList: SHIP,
  });
  expect(result.vehicles).toHaveLength(2);
  expect(result.alerts.some(a => a.type === "duplicate_vin")).toBe(true);
});

test("two inspector streams never mix even when timestamps interleave", () => {
  const result = runFilter({
    photos: [
      photo("a1", { inspectorId: "A", capturedAt: 1000 }),
      photo("b1", { inspectorId: "B", capturedAt: 1100 }),
      photo("a2", { inspectorId: "A", capturedAt: 1200 }),
      photo("b2", { inspectorId: "B", capturedAt: 1300 }),
    ],
    reads: reads({ a1: SHIP[0], b1: SHIP[1], a2: "", b2: "" }),
    shipList: SHIP,
  });
  const byVin = Object.fromEntries(result.vehicles.map(v => [v.vin, v.photoIds]));
  expect(byVin[SHIP[0]]).toEqual(["a1", "a2"]);
  expect(byVin[SHIP[1]]).toEqual(["b1", "b2"]);
});

test("explicit-boundary: failed OCR still opens the vehicle (field app)", () => {
  const result = runFilter({
    mode: "explicit-boundary",
    photos: [
      photo("1", { kind: "vin" }),
      photo("2", { kind: "damage" }),
    ],
    reads: reads({ "1": { vin: null, raw: "", looksLikePlate: true }, "2": "" }),
    shipList: SHIP,
  });
  expect(result.vehicles).toHaveLength(1);
  expect(result.vehicles[0].vinReadable).toBe(false);
  expect(result.vehicles[0].photoIds).toEqual(["1", "2"]);
});

test("parseShipListText extracts unique valid VINs from paste/CSV", () => {
  const text = `VIN,note\n${SHIP[0]},ok\n${SHIP[0]},dup\nbogus\n${SHIP[2]}`;
  expect(parseShipListText(text)).toEqual([SHIP[0], SHIP[2]]);
});

test("compareIngestOrder groups inspector then time then name", () => {
  const a = { capturedAt: 200, name: "b.jpg", inspectorId: "A" };
  const b = { capturedAt: 100, name: "a.jpg", inspectorId: "B" };
  expect(compareIngestOrder(a, b)).toBeLessThan(0);
});
