import React, { useState, useEffect } from "react";
import { IndiaMap } from "../map/IndiaMap";
import { dataStore } from "@/lib/data/store";
import { WhyThisCard } from "../ui/WhyThisCard";
import { Hotspot, CitizenRequest, OfficerJurisdiction, AdministrativeRegion } from "@/types";
import { filterByJurisdiction } from "@/lib/data/jurisdiction-filter";

interface MapViewProps {
  selectedState?: string;
  jurisdiction?: OfficerJurisdiction | null;
}

/**
 * MapView Component (Official Light Government Theme)
 * Renders full-screen India geospatial decision workspace with district drilldown scoped by officer jurisdiction.
 */
export const MapView: React.FC<MapViewProps> = ({ selectedState, jurisdiction }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [regions, setRegions] = useState<AdministrativeRegion[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");

  const getRegionGeo = (regionId: string) => {
    const r = dataStore.getRegionById(regionId);
    return r ? { state: r.state, district: r.district } : undefined;
  };

  const refreshData = React.useCallback(() => {
    const opts = { selectedState, jurisdiction };
    const allRegs = filterByJurisdiction(dataStore.getRegions(), opts);
    const list = filterByJurisdiction(dataStore.getHotspots(), opts, getRegionGeo);

    setRegions(allRegs);
    setHotspots(list);

    if (allRegs.length > 0 && (!selectedRegionId || !allRegs.some((r) => r.id === selectedRegionId))) {
      setSelectedRegionId(allRegs[0].id);
    }
  }, [selectedState, jurisdiction, selectedRegionId]);

  useEffect(() => {
    refreshData();
    fetch("/api/requests")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          json.data.forEach((r: CitizenRequest) => dataStore.addRequest(r));
          refreshData();
        }
      })
      .catch((e) => console.warn("Map sync notice:", e));

    window.addEventListener("janvista_data_updated", refreshData);
    return () => window.removeEventListener("janvista_data_updated", refreshData);
  }, [refreshData]);

  const selectedRegion = dataStore.getRegionById(selectedRegionId);
  const selectedScore = dataStore.getPriorityScoreByRegion(selectedRegionId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">NATIONAL GEOSPATIAL MAP WORKSPACE</h2>
        <p className="text-xs text-slate-600">Drill down across states, districts, and administrative clusters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IndiaMap
            hotspots={hotspots}
            regions={regions}
            onSelectRegion={setSelectedRegionId}
            selectedRegionId={selectedRegionId}
          />
        </div>

        <div className="space-y-4">
          {selectedRegion && selectedScore ? (
            <WhyThisCard
              priorityScore={selectedScore}
              regionName={selectedRegion.name}
              categoryName={selectedScore.category}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-xs text-slate-500">
              Select a region pin on the map to inspect analytical priority breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
