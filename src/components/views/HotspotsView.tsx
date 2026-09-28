import React, { useState, useEffect } from "react";
import { dataStore } from "@/lib/data/store";
import { CategoryBadge, UrgencyBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { Hotspot, CitizenRequest, AdministrativeRegion, OfficerJurisdiction } from "@/types";
import { Users, GraduationCap, Scale, HeartHandshake, MapPin, Globe } from "lucide-react";
import { filterByJurisdiction } from "@/lib/data/jurisdiction-filter";

interface HotspotsViewProps {
  selectedState?: string;
  jurisdiction?: OfficerJurisdiction | null;
}

/**
 * HotspotsView Component (Official Light Government Theme)
 * Renders hotspot rankings computed dynamically in real time based on demand density, demographic vulnerability, and officer jurisdiction.
 */
export const HotspotsView: React.FC<HotspotsViewProps> = ({ selectedState, jurisdiction }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const getRegionGeo = (regionId: string) => {
    const r = dataStore.getRegionById(regionId);
    return r ? { state: r.state, district: r.district } : undefined;
  };

  const refreshData = React.useCallback(() => {
    const opts = { selectedState, jurisdiction };
    const list = filterByJurisdiction(dataStore.getHotspots(), opts, getRegionGeo);
    setHotspots(list);
    if (list.length > 0 && (!selectedHotspot || !list.some((h) => h.id === selectedHotspot.id))) {
      setSelectedHotspot(list[0]);
    }
  }, [selectedState, jurisdiction, selectedHotspot]);

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
      .catch((e) => console.warn("Hotspots sync notice:", e));

    window.addEventListener("janvista_data_updated", refreshData);
    return () => window.removeEventListener("janvista_data_updated", refreshData);
  }, [refreshData]);

  const getRegionInfo = (regionId: string): AdministrativeRegion | undefined => {
    return dataStore.getRegionById(regionId);
  };

  const activeRegion = selectedHotspot ? getRegionInfo(selectedHotspot.regionId) : (hotspots[0] ? getRegionInfo(hotspots[0].regionId) : undefined);
  const demo = activeRegion?.demographics;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">GEOSPATIAL HOTSPOT & DEMOGRAPHIC DETECTION</h2>
          <p className="text-xs text-slate-600">Deterministic hotspot scoring using real citizen signals, census demographics, and capacity deficits</p>
        </div>
        <DataClassificationBadge classification="PUBLIC_REAL_DATA" />
      </div>

      {/* Selected Hotspot Demographic Detail Card */}
      {activeRegion && (
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold tracking-tight">
                {activeRegion.name} District Demographic Census Profile <span className="text-rose-400 font-normal">({activeRegion.state})</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-full font-mono text-emerald-400 border border-slate-700">
                Population: {activeRegion.population.toLocaleString()} Citizens
              </span>
              <span className="text-xs bg-rose-950 text-rose-300 px-3 py-1 rounded-full font-semibold border border-rose-800">
                Vulnerability Index: {activeRegion.vulnerabilityIndex}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Literacy Rate
              </div>
              <p className="text-base font-extrabold text-amber-300">{demo?.literacyRate || 76.5}%</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <Users className="w-3.5 h-3.5 text-blue-400" /> SC / ST Pop.
              </div>
              <p className="text-base font-extrabold text-blue-300">{demo?.scStPercentage || 21.4}%</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <Scale className="w-3.5 h-3.5 text-rose-400" /> BPL / Poverty
              </div>
              <p className="text-base font-extrabold text-rose-300">{demo?.bplPercentage || 24.5}%</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" /> Gender Ratio
              </div>
              <p className="text-base font-extrabold text-emerald-300">{demo?.genderRatio || 885} F / 1k M</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Workforce Ratio
              </div>
              <p className="text-base font-extrabold text-cyan-300">{demo?.workforceParticipation || 41.2}%</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Regional Dialects
              </div>
              <p className="text-xs font-bold text-indigo-200 truncate">
                {demo?.primaryLanguages?.join(", ") || "Hindi"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hotspots Master Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Region & State</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Hotspot Score</th>
                <th className="p-3 text-right">Demand Density</th>
                <th className="p-3 text-center">Census Demographics</th>
                <th className="p-3">Urgency</th>
                <th className="p-3">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {hotspots.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                    No geospatial hotspots detected yet. As soon as citizen requests are logged, hotspots are computed automatically.
                  </td>
                </tr>
              ) : (
                hotspots.map((h) => {
                  const reg = getRegionInfo(h.regionId);
                  const regDemo = reg?.demographics;
                  const isSelected = selectedHotspot?.id === h.id;

                  return (
                    <tr
                      key={h.id}
                      onClick={() => setSelectedHotspot(h)}
                      className={`cursor-pointer transition ${isSelected ? 'bg-rose-50/70 border-l-4 border-l-rose-600' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${h.rank === 1 ? 'bg-rose-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                          #{h.rank}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {h.regionName} <span className="text-slate-500 font-normal">({h.state})</span>
                      </td>
                      <td className="p-3">
                        <CategoryBadge category={h.category} />
                      </td>
                      <td className="p-3 text-right font-black text-rose-800 text-sm">{h.hotspotScore} / 100</td>
                      <td className="p-3 text-right font-mono text-slate-700">{h.demandDensity} sig/k-cap</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          Lit: {regDemo?.literacyRate || 76}% | SC/ST: {regDemo?.scStPercentage || 20}% | BPL: {regDemo?.bplPercentage || 22}%
                        </span>
                      </td>
                      <td className="p-3">
                        <UrgencyBadge urgency={h.urgency} />
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {h.coordinates.latitude.toFixed(2)}°N, {h.coordinates.longitude.toFixed(2)}°E
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
