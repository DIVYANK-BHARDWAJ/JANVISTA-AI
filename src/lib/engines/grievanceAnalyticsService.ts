import { Grievance, DistrictGrievanceData, DemandCluster, Hotspot, OpportunitySpotlight } from '@/types/grievance';

export class GrievanceAnalyticsService {
    public static computeDistrictAnalytics(
        districtId: string,
        districtName: string,
        stateName: string,
        grievances: Grievance[]
    ): DistrictGrievanceData {
        const districtGrievances = grievances.filter(g => g.districtId === districtId);
        const totalRequests = districtGrievances.length;

        if (totalRequests === 0) {
            return {
                districtId,
                districtName,
                stateName,
                citizenRequestsCount: 0,
                maxGapIndex: 0,
                priorityScore: 0,
                requests: [],
                demandClusters: [],
                hotspots: [],
            };
        }

        const clusterMap = new Map<string, Grievance[]>();
        districtGrievances.forEach(g => {
            const key = `${g.talukName}::${g.category}`;
            if (!clusterMap.has(key)) {
                clusterMap.set(key, []);
            }
            clusterMap.get(key)!.push(g);
        });

        const demandClusters: DemandCluster[] = [];
        let maxGapIndex = 0;

        clusterMap.forEach((items, key) => {
            const [talukName, category] = key.split('::');
            const avgSeverity = items.reduce((acc, curr) => acc + curr.severityScore, 0) / items.length;

            const gapScore = Number((items.length * 1.5 + avgSeverity * 2.0).toFixed(2));
            if (gapScore > maxGapIndex) {
                maxGapIndex = gapScore;
            }

            demandClusters.push({
                clusterId: `cluster-${talukName}-${category}`.toLowerCase().replace(/\s+/g, '-'),
                category,
                talukName,
                totalRequests: items.length,
                avgSeverity: Number(avgSeverity.toFixed(1)),
                gapScore,
                summary: `High concentrated demand for ${category} in ${talukName} logged by ${items.length} citizens.`,
                associatedGrievanceIds: items.map(item => item.id),
            });
        });

        const talukMap = new Map<string, Grievance[]>();
        districtGrievances.forEach(g => {
            if (!talukMap.has(g.talukName)) {
                talukMap.set(g.talukName, []);
            }
            talukMap.get(g.talukName)!.push(g);
        });

        const hotspots: Hotspot[] = [];
        talukMap.forEach((items, talukName) => {
            const talukClusters = demandClusters.filter(c => c.talukName === talukName);
            const totalTalukRequests = items.length;
            const talukMaxGap = Math.max(...talukClusters.map(c => c.gapScore), 0);

            let riskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM' = 'MEDIUM';
            if (talukMaxGap > 15 || totalTalukRequests > 10) riskLevel = 'CRITICAL';
            else if (talukMaxGap > 8 || totalTalukRequests > 5) riskLevel = 'HIGH';

            hotspots.push({
                hotspotId: `hotspot-${talukName}`.toLowerCase().replace(/\s+/g, '-'),
                talukName,
                latitude: 11.9261,
                longitude: 76.9437,
                clusterCount: talukClusters.length,
                totalCitizenRequests: totalTalukRequests,
                gapIndex: talukMaxGap,
                riskLevel,
            });
        });

        const avgDistrictSeverity = districtGrievances.reduce((acc, curr) => acc + curr.severityScore, 0) / totalRequests;
        const priorityScore = Math.min(100, Math.round((totalRequests * 3.5) + (maxGapIndex * 2.5) + (avgDistrictSeverity * 4)));

        const topCluster = [...demandClusters].sort((a, b) => b.gapScore - a.gapScore)[0];
        let highestPrioritySpotlight: OpportunitySpotlight | undefined = undefined;

        if (topCluster) {
            highestPrioritySpotlight = {
                spotlightId: `spotlight-${topCluster.clusterId}`,
                title: `Critical Gap Resolution: ${topCluster.category} Infrastructure in ${topCluster.talukName}`,
                description: `Automated analytical spotlight targeting major citizen deficit in ${topCluster.talukName}. Intervention directly addresses ${topCluster.totalRequests} logged citizen grievances with an average severity of ${topCluster.avgSeverity}/10.`,
                talukName: topCluster.talukName,
                category: topCluster.category,
                impactedPopulation: topCluster.totalRequests * 1250,
                underlyingGrievanceCount: topCluster.totalRequests,
            };
        }

        return {
            districtId,
            districtName,
            stateName,
            citizenRequestsCount: totalRequests,
            maxGapIndex,
            priorityScore,
            requests: districtGrievances,
            demandClusters,
            hotspots,
            highestPrioritySpotlight,
        };
    }
}