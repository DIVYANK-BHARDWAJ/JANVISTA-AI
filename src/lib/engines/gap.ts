import { InfrastructureGap, InfrastructureCategory, DataClassification } from "@/types";

export interface GapCalculationInput {
  regionId: string;
  category: InfrastructureCategory;
  demandScore: number; // 0-100
  coverageScore: number; // 0-100
  vulnerabilityScore: number; // 0-100
  dataClassification?: DataClassification;
}

export function calculateInfrastructureGap(input: GapCalculationInput): InfrastructureGap {
  const demandWeight = 0.40;
  const deficitWeight = 0.40;
  const vulnerabilityWeight = 0.20;

  const coverageDeficit = Math.max(0, 100 - input.coverageScore);
  
  const rawGap = 
    (input.demandScore * demandWeight) + 
    (coverageDeficit * deficitWeight) + 
    (input.vulnerabilityScore * vulnerabilityWeight);

  const gapIndex = Math.min(100, Math.max(0, Math.round(rawGap * 10) / 10));

  return {
    id: `gap-${input.regionId}-${input.category}`,
    regionId: input.regionId,
    category: input.category,
    gapIndex,
    demandScore: input.demandScore,
    coverageScore: input.coverageScore,
    vulnerabilityScore: input.vulnerabilityScore,
    methodologyVersion: "v1.0.0",
    dataClassification: input.dataClassification || "SYNTHETIC_DATA",
  };
}
