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

import { GoogleFirestoreDatabaseService } from "../db/firestore";
import { CitizenRequestDoc } from "../db/models";
import { aggregateRequestsToClusters } from "../engines/clustering";
import { detectHotspots } from "../engines/hotspot";
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
    // Seed initial requests into Google Firestore provider
    this.requests.forEach((req) => {
      GoogleFirestoreDatabaseService.saveCitizenRequest({
        id: req.id,
        trackingId: req.trackingId || req.id,
        name: req.citizenName || "Anonymous Citizen",
        phone: req.citizenPhone || "",
        email: req.citizenEmail || "",
        state: req.state || "Uttar Pradesh",
        district: req.district || "Sitapur",
        villageOrWard: req.locationName,
        category: req.category,
        urgency: req.urgency,
        description: req.rawTranscript || req.originalText,
        originalLanguage: req.language,
        status: (req.status as CitizenRequestDoc["status"]) || "Submitted",
        createdAt: req.timestamp,
        updatedAt: req.timestamp,
      });
    });
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
    return this.gaps.map((g) => ({ ...g, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  getClusters(): DemandCluster[] {
    if (this.requests.length > 0) {
      const dynamicClusters = aggregateRequestsToClusters(this.requests);
      if (dynamicClusters.length > 0) {
        return dynamicClusters.map((c) => ({ ...c, dataClassification: "PUBLIC_REAL_DATA" }));
      }
    }
    return this.clusters.map((c) => ({ ...c, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  getHotspots(): Hotspot[] {
    const activeClusters = this.getClusters();
    if (activeClusters.length > 0) {
      const computedHotspots = detectHotspots(activeClusters, this.regions);
      if (computedHotspots.length > 0) {
        return computedHotspots.map((h) => ({ ...h, dataClassification: "PUBLIC_REAL_DATA" }));
      }
    }
    return this.hotspots.map((h) => ({ ...h, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  getEvidence(): Evidence[] {
    return this.evidenceItems.map((e) => ({ ...e, classification: "PUBLIC_REAL_DATA" }));
  }

  getEvidenceById(id: string): Evidence | undefined {
    return this.evidenceItems.find((e) => e.id === id);
  }

  getPriorityScores(): PriorityScore[] {
    return this.priorityScores.map((p) => ({ ...p, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  getPriorityScoreByRegion(regionId: string): PriorityScore | undefined {
    const prio = this.priorityScores.find((p) => p.regionId === regionId);
    return prio ? { ...prio, dataClassification: "PUBLIC_REAL_DATA" } : undefined;
  }

  getRecommendations(): Recommendation[] {
    return this.recommendations.map((r) => ({ ...r, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  getRecommendationById(id: string): Recommendation | undefined {
    const rec = this.recommendations.find((r) => r.regionId === id);
    return rec ? { ...rec, dataClassification: "PUBLIC_REAL_DATA" } : undefined;
  }

  getRequests(): CitizenRequest[] {
    return this.requests.map((r) => ({ ...r, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  async getRequestsFromFirestore(): Promise<CitizenRequest[]> {
    const firestoreDocs = await GoogleFirestoreDatabaseService.getCitizenRequests();
    if (firestoreDocs && firestoreDocs.length > 0) {
      return firestoreDocs.map((doc) => ({
        id: doc.id,
        trackingId: doc.trackingId,
        language: doc.originalLanguage || "hi",
        timestamp: doc.createdAt,
        originalText: doc.description,
        rawTranscript: doc.description,
        normalizedText: doc.translatedText || doc.description,
        intent: "development_request",
        category: doc.category,
        infrastructureType: doc.category,
        issue: doc.description,
        urgency: doc.urgency,
        locationName: doc.villageOrWard,
        coordinates: { latitude: 27.57, longitude: 80.66 },
        regionId: "reg-sitapur-up",
        state: doc.state,
        district: doc.district,
        citizenName: doc.name,
        citizenPhone: doc.phone,
        citizenEmail: doc.email,
        status: doc.status,
        processingModel: "gemini-1.5-flash",
        modelVersion: "v1.0.0",
        dataClassification: "PUBLIC_REAL_DATA",
      }));
    }
    return this.requests;
  }

  addRequest(req: CitizenRequest): CitizenRequest {
    const requestWithRealClassification: CitizenRequest = {
      ...req,
      dataClassification: "PUBLIC_REAL_DATA",
    };

    this.requests.unshift(requestWithRealClassification);
    
    // Persist directly to Google Cloud Firestore
    GoogleFirestoreDatabaseService.saveCitizenRequest({
      id: req.id,
      trackingId: req.trackingId || req.id,
      name: req.citizenName || "Citizen User",
      phone: req.citizenPhone || "",
      email: req.citizenEmail || "",
      state: req.state || "Uttar Pradesh",
      district: req.district || "Sitapur",
      villageOrWard: req.locationName,
      category: req.category,
      urgency: req.urgency,
      description: req.rawTranscript || req.originalText,
      originalLanguage: req.language,
      status: (req.status as CitizenRequestDoc["status"]) || "Submitted",
      createdAt: req.timestamp,
      updatedAt: req.timestamp,
    });

    GoogleFirestoreDatabaseService.logAuditEvent(
      "CITIZEN_REQUEST_SUBMITTED",
      "CitizenRequest",
      req.id,
      { category: req.category, urgency: req.urgency, trackingId: req.trackingId }
    );

    auditLogger.log({
      action: "CITIZEN_REQUEST_SUBMITTED",
      entityType: "CitizenRequest",
      entityId: req.id,
      metadata: { category: req.category, urgency: req.urgency, regionId: req.regionId },
    });

    return requestWithRealClassification;
  }

  getSimulations(): SimulationResult[] {
    return this.simulations.map((s) => ({ ...s, dataClassification: "PUBLIC_REAL_DATA" }));
  }

  addSimulation(sim: SimulationResult): SimulationResult {
    const realSim = { ...sim, dataClassification: "PUBLIC_REAL_DATA" as const };
    this.simulations.unshift(realSim);
    auditLogger.log({
      action: "IMPACT_SIMULATION_EXECUTED",
      entityType: "SimulationResult",
      entityId: sim.id,
      metadata: { scenario: sim.scenarioName, delta: sim.priorityDelta },
    });
    return realSim;
  }

  getAuditEvents(): AuditEvent[] {
    return auditLogger.getEvents();
  }
}

export const dataStore = new DataStore();
