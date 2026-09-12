import React from "react";
import { dataStore } from "@/lib/data/store";
import { CategoryBadge, UrgencyBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";

/**
 * HotspotsView Component (Official Light Government Theme)
 * Renders hotspot rankings based on demand density, population normalization, urgency, and accessibility.
 */
export const HotspotsView: React.FC = () => {
  const hotspots = dataStore.getHotspots();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">GEOSPATIAL HOTSPOT DETECTION</h2>
          <p className="text-xs text-slate-600">Deterministic hotspot scoring using demand density and geographic concentration</p>
        </div>
        <DataClassificationBadge classification="SYNTHETIC_DATA" />
      </div>

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
                <th className="p-3">Urgency</th>
                <th className="p-3">Coordinates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {hotspots.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition">
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
                  <td className="p-3">
                    <UrgencyBadge urgency={h.urgency} />
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">
                    {h.coordinates.latitude.toFixed(2)}°N, {h.coordinates.longitude.toFixed(2)}°E
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
