import { describe, it, expect } from "vitest";
import { dataStore } from "../../src/lib/data/store";
import { DEFAULT_PRIORITY_WEIGHTS } from "../../src/config/priority-weights";

describe("Data Store & Seed Integrity", () => {
  it("should return pre-seeded administrative regions", () => {
    const regions = dataStore.getRegions();
    expect(regions.length).toBeGreaterThan(0);
    const sitapur = dataStore.getRegionById("reg-sitapur-up");
    expect(sitapur).toBeDefined();
    expect(sitapur?.name).toBe("Sitapur");
  });

  it("should contain default priority weights version v1.0.0", () => {
    expect(DEFAULT_PRIORITY_WEIGHTS.version).toBe("v1.0.0");
    const sumWeights =
      DEFAULT_PRIORITY_WEIGHTS.demandWeight +
      DEFAULT_PRIORITY_WEIGHTS.gapWeight +
      DEFAULT_PRIORITY_WEIGHTS.vulnerabilityWeight +
      DEFAULT_PRIORITY_WEIGHTS.accessibilityWeight +
      DEFAULT_PRIORITY_WEIGHTS.urgencyWeight +
      DEFAULT_PRIORITY_WEIGHTS.investmentMismatchWeight;

    expect(Math.round(sumWeights * 100) / 100).toBe(1.0);
  });

  it("should contain Sitapur demo healthcare scenario recommendation with SYNTHETIC_DATA classification", () => {
    const recs = dataStore.getRecommendations();
    const sitapurRec = recs.find((r) => r.regionId === "reg-sitapur-up");
    expect(sitapurRec).toBeDefined();
    expect(sitapurRec?.priorityScore).toBe(89.4);
    expect(sitapurRec?.dataClassification).toBe("SYNTHETIC_DATA");
  });
});
