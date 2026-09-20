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

export const SEED_REGIONS: AdministrativeRegion[] = [
  {
    id: "reg-sitapur-up",
    name: "Sitapur",
    state: "Uttar Pradesh",
    district: "Sitapur",
    block: "Khairabad",
    population: 4483900,
    vulnerabilityIndex: 81,
    accessibilityIndex: 32,
    coordinates: { latitude: 27.57, longitude: 80.66 },
    bounds: { north: 27.8, south: 27.3, east: 81.0, west: 80.4 },
  },
  {
    id: "reg-muzaffarpur-br",
    name: "Muzaffarpur",
    state: "Bihar",
    district: "Muzaffarpur",
    block: "Kanti",
    population: 4801000,
    vulnerabilityIndex: 85,
    accessibilityIndex: 38,
    coordinates: { latitude: 26.12, longitude: 85.36 },
  },
  {
    id: "reg-gadchiroli-mh",
    name: "Gadchiroli",
    state: "Maharashtra",
    district: "Gadchiroli",
    block: "Aheri",
    population: 1072942,
    vulnerabilityIndex: 78,
    accessibilityIndex: 24,
    coordinates: { latitude: 20.18, longitude: 80.00 },
  },
  {
    id: "reg-ramanathapuram-tn",
    name: "Ramanathapuram",
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    block: "Kadaladi",
    population: 1352882,
    vulnerabilityIndex: 64,
    accessibilityIndex: 45,
    coordinates: { latitude: 9.36, longitude: 78.83 },
  },
  {
    id: "reg-baksa-as",
    name: "Baksa",
    state: "Assam",
    district: "Baksa",
    block: "Tamulpur",
    population: 950000,
    vulnerabilityIndex: 76,
    accessibilityIndex: 29,
    coordinates: { latitude: 26.68, longitude: 91.43 },
  },
];

export const SEED_INFRASTRUCTURE_ASSETS: InfrastructureAsset[] = [];
export const SEED_GAPS: InfrastructureGap[] = [];
export const SEED_DEMAND_CLUSTERS: DemandCluster[] = [];
export const SEED_HOTSPOTS: Hotspot[] = [];
export const SEED_EVIDENCE: Evidence[] = [];
export const SEED_PRIORITY_SCORES: PriorityScore[] = [];
export const SEED_RECOMMENDATIONS: Recommendation[] = [];
export const SEED_CITIZEN_REQUESTS: CitizenRequest[] = [];
export const SEED_SIMULATIONS: SimulationResult[] = [];

