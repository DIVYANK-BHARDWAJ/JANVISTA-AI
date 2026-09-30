import { describe, it, expect } from "vitest";
import { calculatePriorityScore } from "../../src/lib/engines/priority";

describe("Priority Engine (v1.0.0)", () => {
  it("should calculate Sitapur healthcare scenario deterministic priority score", () => {
    const input = {
      regionId: "reg-sitapur-up",
      category: "healthcare" as const,
      demandScore: 87.0,
      gapIndex: 91.2,
      vulnerabilityScore: 81.0,
      accessibilityDeficitScore: 89.0,
      urgencyScore: 90.0,
      investmentMismatchScore: 80.0,
    };

    const priority = calculatePriorityScore(input);
    expect(priority.score).toBe(87.4);
    expect(priority.methodologyVersion).toBe("v1.0.0");
    expect(priority.factors.length).toBe(6);
    expect(priority.dataClassification).toBe("PUBLIC_REAL_DATA");
  });

  it("should calculate exact weighted score sum across all 6 factors", () => {
    const input = {
      regionId: "reg-test",
      category: "water_sanitation" as const,
      demandScore: 50.0,
      gapIndex: 50.0,
      vulnerabilityScore: 50.0,
      accessibilityDeficitScore: 50.0,
      urgencyScore: 50.0,
      investmentMismatchScore: 50.0,
    };

    const priority = calculatePriorityScore(input);
    expect(priority.score).toBe(50.0);
  });
});
