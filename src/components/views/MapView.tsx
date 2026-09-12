import React, { useState } from "react";
import { IndiaMap } from "../map/IndiaMap";
import { dataStore } from "@/lib/data/store";
import { WhyThisCard } from "../ui/WhyThisCard";

/**
 * MapView Component (Official Light Government Theme)
 * Renders full-screen India geospatial decision workspace with district drilldown.
 */
export const MapView: React.FC = () => {
  const hotspots = dataStore.getHotspots();
  const regions = dataStore.getRegions();
  const [selectedRegionId, setSelectedRegionId] = useState<string>("reg-sitapur-up");

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
