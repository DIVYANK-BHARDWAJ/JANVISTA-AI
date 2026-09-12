import {
  AdministrativeRegion,
  InfrastructureAsset,
  InfrastructureGap,
  DemandCluster,
  Hotspot,
  PriorityScore,
  Recommendation,
  Evidence,
  CitizenRequest,
  SimulationResult,
  AuditEvent,
} from "@/types";

import {
  SEED_REGIONS,
  SEED_INFRASTRUCTURE_ASSETS,
  SEED_GAPS,
  SEED_DEMAND_CLUSTERS,
  SEED_HOTSPOTS,
  SEED_EVIDENCE,
  SEED_PRIORITY_SCORES,
  SEED_RECOMMENDATIONS,
  SEED_CITIZEN_REQUESTS,
  SEED_SIMULATIONS,
} from "./seed-data";

import { provenanceService } from "../governance/provenance";
import { auditLogger } from "../governance/audit";

class DataStore {
  private regions: AdministrativeRegion[] = [...SEED_REGIONS];
  private assets: InfrastructureAsset[] = [...SEED_INFRASTRUCTURE_ASSETS];
  private gaps: InfrastructureGap[] = [...SEED_GAPS];
  private clusters: DemandCluster[] = [...SEED_DEMAND_CLUSTERS];
  private hotspots: Hotspot[] = [...SEED_HOTSPOTS];
  private evidenceItems: Evidence[] = [...SEED_EVIDENCE];
  private priorityScores: PriorityScore[] = [...SEED_PRIORITY_SCORES];
  private recommendations: Recommendation[] = [...SEED_RECOMMENDATIONS];
  private requests: CitizenRequest[] = [...SEED_CITIZEN_REQUESTS];
  private simulations: SimulationResult[] = [...SEED_SIMULATIONS];

  constructor() {
    this.evidenceItems.forEach((ev) => provenanceService.registerEvidence(ev));
  }

  getRegions(): AdministrativeRegion[] {
    return this.regions;
  }

  getRegionById(id: string): AdministrativeRegion | undefined {
    return this.regions.find((r) => r.id === id);
  }

  getInfrastructureAssets(): InfrastructureAsset[] {
    return this.assets;
  }

  getGaps(): InfrastructureGap[] {
    return this.gaps;
  }

  getClusters(): DemandCluster[] {
    return this.clusters;
  }

  getHotspots(): Hotspot[] {
    return this.hotspots;
  }

  getEvidence(): Evidence[] {
    return this.evidenceItems;
  }

  getEvidenceById(id: string): Evidence | undefined {
    return this.evidenceItems.find((e) => e.id === id);
  }

  getPriorityScores(): PriorityScore[] {
    return this.priorityScores;
  }

  getPriorityScoreByRegion(regionId: string): PriorityScore | undefined {
    return this.priorityScores.find((p) => p.regionId === regionId);
  }

  getRecommendations(): Recommendation[] {
    return this.recommendations;
  }

  getRecommendationById(id: string): Recommendation | undefined {
    return this.recommendations.find((r) => r.id === id);
  }

  getRequests(): CitizenRequest[] {
    return this.requests;
  }

  addRequest(req: CitizenRequest): CitizenRequest {
    this.requests.unshift(req);
    auditLogger.log({
      action: "CITIZEN_REQUEST_SUBMITTED",
      entityType: "CitizenRequest",
      entityId: req.id,
      metadata: { category: req.category, urgency: req.urgency, regionId: req.regionId },
    });
    return req;
  }

  getSimulations(): SimulationResult[] {
    return this.simulations;
  }

  addSimulation(sim: SimulationResult): SimulationResult {
    this.simulations.unshift(sim);
    auditLogger.log({
      action: "IMPACT_SIMULATION_EXECUTED",
      entityType: "SimulationResult",
      entityId: sim.id,
      metadata: { scenario: sim.scenarioName, delta: sim.priorityDelta },
    });
    return sim;
  }

  getAuditEvents(): AuditEvent[] {
    return auditLogger.getEvents();
  }
}

export const dataStore = new DataStore();
