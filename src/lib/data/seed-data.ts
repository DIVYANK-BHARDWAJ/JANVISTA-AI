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
} from "@/types";

import { KNOWN_DISTRICTS } from "./geo-utils";

export const SEED_REGIONS: AdministrativeRegion[] = KNOWN_DISTRICTS.map((item) => ({
  id: item.id,
  name: item.district,
  state: item.state,
  district: item.district,
  block: `${item.district} Central`,
  population: item.population,
  vulnerabilityIndex: item.vulnerabilityIndex,
  accessibilityIndex: item.accessibilityIndex,
  coordinates: item.coordinates,
  demographics: item.demographics,
}));

export const SEED_INFRASTRUCTURE_ASSETS: InfrastructureAsset[] = [];
export const SEED_GAPS: InfrastructureGap[] = [];
export const SEED_DEMAND_CLUSTERS: DemandCluster[] = [];
export const SEED_HOTSPOTS: Hotspot[] = [];
export const SEED_EVIDENCE: Evidence[] = [];
export const SEED_PRIORITY_SCORES: PriorityScore[] = [];
export const SEED_RECOMMENDATIONS: Recommendation[] = [];
export const SEED_CITIZEN_REQUESTS: CitizenRequest[] = [];
export const SEED_SIMULATIONS: SimulationResult[] = [];

