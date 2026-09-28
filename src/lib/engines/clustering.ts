import { CitizenRequest, DemandCluster, InfrastructureCategory } from "@/types";

export function aggregateRequestsToClusters(requests: CitizenRequest[]): DemandCluster[] {
  const grouped = new Map<string, CitizenRequest[]>();

  requests.forEach((req) => {
    const key = `${req.regionId}-${req.category}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(req);
  });

  const clusters: DemandCluster[] = [];

  grouped.forEach((reqList, key) => {
    const first = reqList[0];
    const languages = Array.from(new Set(reqList.map((r) => r.language)));
    const totalUrgent = reqList.filter((r) => r.urgency === "high" || r.urgency === "critical").length;
    const urgencyRatio = totalUrgent / reqList.length;

    clusters.push({
      id: `cluster-${key}`,
      regionId: first.regionId,
      category: first.category,
      dominantIssue: first.issue.replace(/_/g, " "),
      requestCount: reqList.length,
      normalizedDemand: Math.min(100, Math.round(50 + urgencyRatio * 40)),
      temporalTrend: urgencyRatio > 0.5 ? "increasing" : "stable",
      languagesRepresented: languages,
      confidence: 0.90,
      coordinates: first.coordinates,
      dataClassification: "PUBLIC_REAL_DATA",
    });
  });

  return clusters;
}
