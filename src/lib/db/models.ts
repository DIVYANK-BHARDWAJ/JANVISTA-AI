/**
 * JANVISTA AI — Google Cloud Firestore Database Models
 * Schema definitions for document collections stored in Google Cloud Firestore.
 */

export interface CitizenRequestDoc {
  id: string;
  trackingId: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  villageOrWard: string;
  category: "healthcare" | "education" | "transportation" | "water_sanitation" | "energy" | "digital_infra";
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
  originalLanguage: string;
  translatedText?: string;
  extractedEntities?: string[];
  status: "Submitted" | "Under Review" | "Allocated" | "In Progress" | "Resolved";
  audioUrl?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InfrastructureAssetDoc {
  id: string;
  name: string;
  state: string;
  district: string;
  category: string;
  capacity: number;
  operationalStatus: "optimal" | "stressed" | "critical" | "non_operational";
  coverageRadiusKm: number;
  lastAudited: string;
}

export interface DemandClusterDoc {
  id: string;
  regionId: string;
  category: string;
  count: number;
  urgencyScore: number;
  primaryKeywords: string[];
  createdAt: string;
}

export interface HotspotDoc {
  id: string;
  regionName: string;
  state: string;
  gapIndex: number;
  priorityScore: number;
  rank: number;
  category: string;
  citizenRequestsCount: number;
  updatedAt: string;
}

export interface AuditEventDoc {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
}

export interface SimulationDoc {
  id: string;
  scenarioName: string;
  regionId: string;
  category: string;
  investmentAmountCr: number;
  populationReached: number;
  priorityDelta: number;
  createdAt: string;
}

export interface UserCredentialDoc {
  id: string;
  role: string;
  jurisdictionKey: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

