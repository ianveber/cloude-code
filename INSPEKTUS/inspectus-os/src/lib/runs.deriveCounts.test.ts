import { expect, test } from "bun:test";
import { deriveCounts } from "./runs";

test("deriveCounts sums vehicles, damages, and finds the max", () => {
  const vehicles = [
    { vin: "A", damages: [{}, {}] },          // 2
    { vin: "B", damages: [{}, {}, {}, {}] },  // 4
    { vin: "C", damages: [] },                // 0
  ];
  expect(deriveCounts(vehicles)).toEqual({
    vehicle_count: 3,
    total_damages: 6,
    max_damages: 4,
  });
});

test("deriveCounts handles an empty run", () => {
  expect(deriveCounts([])).toEqual({ vehicle_count: 0, total_damages: 0, max_damages: 0 });
});
