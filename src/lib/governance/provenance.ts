import { Evidence, Recommendation, PriorityScore, DataClassification } from "@/types";

export interface ProvenanceChain {
  recommendationId: string;
  regionId: string;
  regionName: string;
  priorityScore: PriorityScore;
  evidenceItems: Evidence[];
  dataClassification: DataClassification;
  timestamp: string;
  traceabilitySummary: string;
}

class ProvenanceService {
  private evidenceMap: Map<string, Evidence> = new Map();

  registerEvidence(evidence: Evidence): Evidence {
    this.evidenceMap.set(evidence.id, evidence);
    return evidence;
  }

  getEvidenceById(id: string): Evidence | undefined {
    return this.evidenceMap.get(id);
  }

  getEvidenceForRecommendation(evidenceIds: string[]): Evidence[] {
    return evidenceIds
      .map((id) => this.evidenceMap.get(id))
      .filter((ev): ev is Evidence => ev !== undefined);
  }

  buildChain(recommendation: Recommendation, priorityScore: PriorityScore): ProvenanceChain {
    const evidenceItems = this.getEvidenceForRecommendation(recommendation.evidenceIds);

    return {
      recommendationId: recommendation.id,
      regionId: recommendation.regionId,
      regionName: recommendation.regionName,
      priorityScore,
      evidenceItems,
      dataClassification: recommendation.dataClassification,
      timestamp: new Date().toISOString(),
      traceabilitySummary: `Recommendation ${recommendation.id} derived from Priority ${priorityScore.score}/100 (${priorityScore.methodologyVersion}) grounded by ${evidenceItems.length} evidence items. Classification: ${recommendation.dataClassification}`,
    };
  }
}

export const provenanceService = new ProvenanceService();
