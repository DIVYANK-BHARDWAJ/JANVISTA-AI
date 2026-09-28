import { PriorityScore, InfrastructureCategory, DataClassification } from "@/types";
import { DEFAULT_PRIORITY_WEIGHTS, PriorityWeightConfig } from "@/config/priority-weights";

export interface PriorityCalculationInput {
  regionId: string;
  category: InfrastructureCategory;
  demandScore: number; // 0-100
  gapIndex: number; // 0-100
  vulnerabilityScore: number; // 0-100
  accessibilityDeficitScore: number; // 0-100 (100 - accessibilityIndex)
  urgencyScore: number; // 0-100
  investmentMismatchScore: number; // 0-100
  confidence?: number;
  dataCoverage?: number;
  config?: PriorityWeightConfig;
  dataClassification?: DataClassification;
}

export function calculatePriorityScore(input: PriorityCalculationInput): PriorityScore {
  const cfg = input.config || DEFAULT_PRIORITY_WEIGHTS;

  const demandWeighted = input.demandScore * cfg.demandWeight;
  const gapWeighted = input.gapIndex * cfg.gapWeight;
  const vulWeighted = input.vulnerabilityScore * cfg.vulnerabilityWeight;
  const accWeighted = input.accessibilityDeficitScore * cfg.accessibilityWeight;
  const urgWeighted = input.urgencyScore * cfg.urgencyWeight;
  const invWeighted = input.investmentMismatchScore * cfg.investmentMismatchWeight;

  const totalRaw = demandWeighted + gapWeighted + vulWeighted + accWeighted + urgWeighted + invWeighted;
  const score = Math.min(100, Math.max(0, Math.round(totalRaw * 10) / 10));

  return {
    id: `prio-${input.regionId}-${input.category}`,
    regionId: input.regionId,
    category: input.category,
    score,
    factors: [
      { name: "Citizen Demand", weight: cfg.demandWeight, rawScore: input.demandScore, weightedScore: Math.round(demandWeighted * 10) / 10, sourceDataset: "Multilingual Ingestion Signals" },
      { name: "Infrastructure Gap", weight: cfg.gapWeight, rawScore: input.gapIndex, weightedScore: Math.round(gapWeighted * 10) / 10, sourceDataset: "Facility Audit & Gap Engine" },
      { name: "Population Vulnerability", weight: cfg.vulnerabilityWeight, rawScore: input.vulnerabilityScore, weightedScore: Math.round(vulWeighted * 10) / 10, sourceDataset: "Multidimensional Vulnerability Index" },
      { name: "Accessibility Deficit", weight: cfg.accessibilityWeight, rawScore: input.accessibilityDeficitScore, weightedScore: Math.round(accWeighted * 10) / 10, sourceDataset: "Spatial Travel Model" },
      { name: "Urgency Signal", weight: cfg.urgencyWeight, rawScore: input.urgencyScore, weightedScore: Math.round(urgWeighted * 10) / 10, sourceDataset: "Gemini Urgency Classifier" },
      { name: "Investment Mismatch", weight: cfg.investmentMismatchWeight, rawScore: input.investmentMismatchScore, weightedScore: Math.round(invWeighted * 10) / 10, sourceDataset: "State Capex Ledger" },
    ],
    confidence: input.confidence ?? 92,
    dataCoverage: input.dataCoverage ?? 90,
    methodologyVersion: cfg.version,
    timestamp: new Date().toISOString(),
    dataClassification: input.dataClassification || "PUBLIC_REAL_DATA",
  };
}
