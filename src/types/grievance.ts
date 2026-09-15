export interface Grievance {
    id: string;
    districtId: string;
    talukName: string;
    category: string;
    severityScore: number;
}

export interface DemandCluster {
    clusterId: string;
    category: string;
    talukName: string;
    totalRequests: number;
    avgSeverity: number;
    gapScore: number;
    summary: string;
    associatedGrievanceIds: string[];
}

export interface Hotspot {
    hotspotId: string;
    talukName: string;
    latitude: number;
    longitude: number;
    clusterCount: number;
    totalCitizenRequests: number;
    gapIndex: number;
    riskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export interface OpportunitySpotlight {
    spotlightId: string;
    title: string;
    description: string;
    talukName: string;
    category: string;
    impactedPopulation: number;
    underlyingGrievanceCount: number;
}

export interface DistrictGrievanceData {
    districtId: string;
    districtName: string;
    stateName: string;
    citizenRequestsCount: number;
    maxGapIndex: number;
    priorityScore: number;
    requests: Grievance[];
    demandClusters: DemandCluster[];
    hotspots: Hotspot[];
    highestPrioritySpotlight?: OpportunitySpotlight;
}