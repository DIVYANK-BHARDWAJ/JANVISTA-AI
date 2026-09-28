import { Hotspot, DemandCluster, AdministrativeRegion } from "@/types";

export function detectHotspots(clusters: DemandCluster[], regions: AdministrativeRegion[]): Hotspot[] {
  const hotspots: Hotspot[] = clusters.map((c, idx) => {
    const region = regions.find((r) => r.id === c.regionId);
    const regionName = region ? region.name : c.regionId;
    const state = region ? region.state : "India";
    const pop = region ? region.population : 1000000;

    const density = Math.round((c.requestCount / (pop / 100000)) * 100) / 100;
    const hotspotScore = Math.min(100, Math.round(c.normalizedDemand * 0.7 + density * 10));

    return {
      id: `hotspot-${c.id}`,
      regionId: c.regionId,
      regionName,
      state,
      category: c.category,
      hotspotScore,
      demandDensity: density,
      urgency: hotspotScore > 85 ? "critical" : hotspotScore > 70 ? "high" : "medium",
      rank: idx + 1,
      coordinates: c.coordinates,
      dataClassification: "PUBLIC_REAL_DATA",
    };
  });

  return hotspots.sort((a, b) => b.hotspotScore - a.hotspotScore).map((h, i) => ({ ...h, rank: i + 1 }));
}
