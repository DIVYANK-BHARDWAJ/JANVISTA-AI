import { describe, it, expect } from "vitest";
import { processAskJanvistaQuery } from "../../src/lib/ai/ask-janvista";

describe("Ask JANVISTA Grounded Pipeline", () => {
  it("should process policy query and return grounded facts, model outputs, and evidence references", async () => {
    const question = "Why is Sitapur ranked first for healthcare?";
    const result = await processAskJanvistaQuery(question);

    expect(result.question).toBe(question);
    expect(result.retrievedFacts.length).toBeGreaterThan(0);
    expect(result.modelOutputs.length).toBeGreaterThan(0);
    expect(result.evidenceReferences.length).toBeGreaterThan(0);
    expect(result.generativeExplanation).toContain("Sitapur");
  });
});
