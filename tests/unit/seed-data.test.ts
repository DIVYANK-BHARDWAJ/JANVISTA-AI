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

  it("should start with 0 prefilled requests and compute dynamically upon adding requests", () => {
    const requests = dataStore.getRequests();
    expect(requests.length).toBe(0);
    
    // Adding a real request dynamically updates data store
    const newReq = dataStore.addRequest({
      id: "test-req-01",
      trackingId: "JAN-TEST-01",
      language: "hi",
      originalText: "Need water pipeline in village",
      normalizedText: "Need water pipeline in village",
      category: "water_sanitation",
      issue: "water_pipeline",
      infrastructureType: "water_pipeline",
      locationName: "Test Village, UP",
      coordinates: { latitude: 27.57, longitude: 80.66 },
      regionId: "reg-sitapur-up",
      urgency: "high",
      intent: "development_request",
      timestamp: new Date().toISOString(),
      processingModel: "gemini-1.5-flash",
      modelVersion: "v1.0.0",
      dataClassification: "PUBLIC_REAL_DATA",
    });

    expect(dataStore.getRequests().length).toBe(1);
    expect(newReq.dataClassification).toBe("PUBLIC_REAL_DATA");
  });
});
