export type DataClassification = 
  | 'PUBLIC_REAL_DATA' 
  | 'SYNTHETIC_DATA' 
  | 'MODEL_OUTPUT' 
  | 'SIMULATION';

export type UserRole = 
  | 'ADMIN' 
  | 'POLICYMAKER' 
  | 'ANALYST' 
  | 'DISTRICT_OFFICIAL' 
  | 'STATE_PLANNER'
  | 'DISTRICT_COLLECTOR'
  | 'CITIZEN';

/** Jurisdiction context captured at officer login (State Planner / District Collector). */
export interface OfficerJurisdiction {
  state: string;
  stateCode: string;
  district?: string;
  displayName: string;
}

export type InfrastructureCategory = 
  | 'healthcare' 
  | 'education' 
  | 'transportation' 
  | 'water_sanitation' 
  | 'energy' 
  | 'digital_infra';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface CitizenRequest {
  id: string;
  trackingId?: string;
  language: string;
  originalText: string;
  normalizedText: string;
  category: InfrastructureCategory;
  issue: string;
  infrastructureType: string;
  locationName: string;
  coordinates: LocationCoordinates;
  regionId: string;
  urgency: UrgencyLevel;
  intent: 'development_request' | 'grievance' | 'inquiry';
  attachmentUrl?: string;
  timestamp: string;
  processingModel: string;
  modelVersion: string;
  dataClassification: DataClassification;
  evidenceId?: string;
}

export interface AdministrativeRegion {
  id: string;
  name: string;
  state: string;
  district: string;
  block?: string;
  population: number;
  vulnerabilityIndex: number; // 0-100
  accessibilityIndex: number; // 0-100
  coordinates: LocationCoordinates;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  category: InfrastructureCategory;
  regionId: string;
  capacity: number;
  conditionScore: number; // 0-100
  activeStatus: 'operational' | 'strained' | 'critical' | 'decommissioned';
  coordinates: LocationCoordinates;
  dataClassification: DataClassification;
}

export interface InfrastructureGap {
  id: string;
  regionId: string;
  category: InfrastructureCategory;
  gapIndex: number; // 0-100
  demandScore: number; // 0-100
  coverageScore: number; // 0-100
  vulnerabilityScore: number; // 0-100
  methodologyVersion: string;
  dataClassification: DataClassification;
}

export interface DemandCluster {
  id: string;
  regionId: string;
  category: InfrastructureCategory;
  dominantIssue: string;
  requestCount: number;
  normalizedDemand: number; // 0-100
  temporalTrend: 'increasing' | 'stable' | 'decreasing';
  languagesRepresented: string[];
  confidence: number; // 0-1
  coordinates: LocationCoordinates;
  dataClassification: DataClassification;
}

export interface Hotspot {
  id: string;
  regionId: string;
  regionName: string;
  state: string;
  category: InfrastructureCategory;
  hotspotScore: number; // 0-100
  demandDensity: number; // signals per sq km / population
  urgency: UrgencyLevel;
  rank: number;
  coordinates: LocationCoordinates;
  dataClassification: DataClassification;
}

export interface PriorityFactor {
  name: string;
  weight: number; // 0-1
  rawScore: number; // 0-100
  weightedScore: number;
  sourceDataset: string;
}

export interface PriorityScore {
  id: string;
  regionId: string;
  category: InfrastructureCategory;
  score: number; // 0-100
  factors: PriorityFactor[];
  confidence: number; // 0-100
  dataCoverage: number; // 0-100
  methodologyVersion: string; // e.g. "v1.0.0"
  timestamp: string;
  dataClassification: DataClassification;
}

export interface Evidence {
  id: string;
  type: 'CITIZEN' | 'INFRASTRUCTURE' | 'DEMOGRAPHIC' | 'INVESTMENT' | 'GEOSPATIAL';
  source: string;
  dataset: string;
  datasetVersion: string;
  classification: DataClassification;
  timestamp: string;
  geographicScope: string;
  value: string | number;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  regionId: string;
  regionName: string;
  state: string;
  category: InfrastructureCategory;
  potentialIntervention: string;
  priorityScore: number; // 0-100
  confidence: number; // 0-100
  evidenceIds: string[];
  evidenceSummary: string;
  populationAffected: number;
  dataCoverage: number;
  modelVersion: string;
  humanReviewRequired: boolean;
  dataClassification: DataClassification;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  modelVersion: string;
  datasetVersion: string;
  metadata?: Record<string, unknown>;
}

export interface PolicyQueryResult {
  question: string;
  intent: string;
  retrievedFacts: Array<{ title: string; content: string; source: string }>;
  modelOutputs: Array<{ title: string; score: number | string }>;
  simulations: Array<{ title: string; impact: string }>;
  generativeExplanation: string;
  evidenceReferences: Evidence[];
  timestamp: string;
}

export interface SimulationParameters {
  regionId: string;
  category: InfrastructureCategory;
  proposedIntervention: string;
  investmentAmountLakhs: number;
  additionalCapacity: number;
}

export interface SimulationResult {
  id: string;
  scenarioName: string;
  regionId: string;
  regionName: string;
  category: InfrastructureCategory;
  baselinePriority: number;
  postInterventionPriority: number;
  priorityDelta: number;
  populationCovered: number;
  accessibilityImprovementPct: number;
  dataClassification: DataClassification;
  timestamp: string;
}
