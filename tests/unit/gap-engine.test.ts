import { describe, it, expect } from "vitest";
import { calculateInfrastructureGap } from "../../src/lib/engines/gap";

describe("Infrastructure Gap Engine", () => {
  it("should calculate deterministic gap index score", () => {
    const input = {
      regionId: "reg-sitapur-up",
      category: "healthcare" as const,
      demandScore: 87.0,
      coverageScore: 18.5,
      vulnerabilityScore: 81.0,
    };

    const gap = calculateInfrastructureGap(input);
    expect(gap.gapIndex).toBe(83.6);
    expect(gap.methodologyVersion).toBe("v1.0.0");
    expect(gap.dataClassification).toBe("PUBLIC_REAL_DATA");
  });

  it("should clamp gap index within [0, 100]", () => {
    const inputExtreme = {
      regionId: "reg-test",
      category: "healthcare" as const,
      demandScore: 100.0,
      coverageScore: 0.0,
      vulnerabilityScore: 100.0,
    };

    const gap = calculateInfrastructureGap(inputExtreme);
    expect(gap.gapIndex).toBe(100.0);
  });
});
