import React from "react";
import { dataStore } from "@/lib/data/store";
import { CategoryBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { Building2, Activity } from "lucide-react";

/**
 * InfrastructureView Component (Official Light Government Theme)
 * Compares citizen demand with existing infrastructure capacity to reveal Infrastructure Gap Index.
 */
export const InfrastructureView: React.FC = () => {
  const gaps = dataStore.getGaps();
  const assets = dataStore.getInfrastructureAssets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">INFRASTRUCTURE GAP ANALYSIS</h2>
          <p className="text-xs text-slate-600">Formula: Infrastructure Gap = (Demand * 0.40) + ((100 - Coverage) * 0.40) + (Vulnerability * 0.20)</p>
        </div>
        <DataClassificationBadge classification="SYNTHETIC_DATA" />
      </div>

      {/* Infrastructure Gaps Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[#003366]" />
          <span>Regional Infrastructure Gap Index (v1.0.0)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Region</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Demand Score</th>
                <th className="p-3 text-right">Coverage Score</th>
                <th className="p-3 text-right">Vulnerability Score</th>
                <th className="p-3 text-right">Gap Index</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gaps.map((g) => {
                const region = dataStore.getRegionById(g.regionId);
                return (
                  <tr key={g.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{region?.name || g.regionId} ({region?.state})</td>
                    <td className="p-3"><CategoryBadge category={g.category} /></td>
                    <td className="p-3 text-right font-mono">{g.demandScore}/100</td>
                    <td className="p-3 text-right font-mono text-rose-700">{g.coverageScore}/100</td>
                    <td className="p-3 text-right font-mono">{g.vulnerabilityScore}/100</td>
                    <td className="p-3 text-right font-black text-rose-800 text-sm">{g.gapIndex} / 100</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${g.gapIndex > 85 ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-amber-100 text-amber-900'}`}>
                        {g.gapIndex > 85 ? 'CRITICAL GAP' : 'HIGH GAP'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Audit Census */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-700" />
          <span>Registered Facility Asset Census</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((ast) => (
            <div key={ast.id} className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{ast.name}</span>
                <CategoryBadge category={ast.category} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Capacity: <strong className="text-slate-900">{ast.capacity} beds/units</strong></span>
                <span>Condition Score: <strong className="text-amber-800">{ast.conditionScore}/100</strong></span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Status: <strong className="text-rose-800 uppercase">{ast.activeStatus}</strong></span>
                <span className="font-mono">{ast.coordinates.latitude}°N, {ast.coordinates.longitude}°E</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
