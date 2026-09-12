import { Evidence, Recommendation, PriorityScore } from "@/types";
import { provenanceService, ProvenanceChain } from "../governance/provenance";

export function assembleEvidenceChain(
  recommendation: Recommendation,
  priorityScore: PriorityScore,
  availableEvidence: Evidence[]
): ProvenanceChain {
  availableEvidence.forEach((ev) => provenanceService.registerEvidence(ev));
  return provenanceService.buildChain(recommendation, priorityScore);
}
