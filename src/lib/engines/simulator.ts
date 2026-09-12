import { SimulationParameters, SimulationResult, PriorityScore } from "@/types";

export function runImpactSimulation(
  params: SimulationParameters,
  baselineScore: PriorityScore,
  regionPopulation: number
): SimulationResult {
  const capacityGainRatio = Math.min(1.0, params.additionalCapacity / 100);
  const investmentRatio = Math.min(1.0, params.investmentAmountLakhs / 5000);

  const deltaImpact = Math.round((capacityGainRatio * 30 + investmentRatio * 20) * 10) / 10;
  const postPriority = Math.max(10, Math.round((baselineScore.score - deltaImpact) * 10) / 10);
  const populationCovered = Math.round(regionPopulation * Math.min(0.85, capacityGainRatio + 0.15));
  const accessibilityImprovementPct = Math.round((deltaImpact / baselineScore.score) * 100 * 10) / 10;

  return {
    id: `sim-${Date.now()}`,
    scenarioName: `${params.proposedIntervention} in ${params.regionId}`,
    regionId: params.regionId,
    regionName: params.regionId.replace("reg-", "").replace("-", " ").toUpperCase(),
    category: params.category,
    baselinePriority: baselineScore.score,
    postInterventionPriority: postPriority,
    priorityDelta: Math.round(-deltaImpact * 10) / 10,
    populationCovered,
    accessibilityImprovementPct,
    dataClassification: "SIMULATION",
    timestamp: new Date().toISOString(),
  };
}
