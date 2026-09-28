import React, { useState, useEffect } from "react";
import { dataStore } from "@/lib/data/store";
import { WhyThisCard } from "../ui/WhyThisCard";
import { CategoryBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { ChevronRight } from "lucide-react";
import { Recommendation, CitizenRequest, OfficerJurisdiction } from "@/types";
import { filterByJurisdiction } from "@/lib/data/jurisdiction-filter";

interface RecommendationsViewProps {
  selectedState?: string;
  jurisdiction?: OfficerJurisdiction | null;
}

/**
 * RecommendationsView Component (Official Light Government Theme)
 * Renders priority recommendations calculated by the Priority Engine (v1.0.0) scoped by officer jurisdiction.
 */
export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ selectedState, jurisdiction }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecId, setSelectedRecId] = useState<string>("");

  const getRegionGeo = (regionId: string) => {
    const r = dataStore.getRegionById(regionId);
    return r ? { state: r.state, district: r.district } : undefined;
  };

  const refreshData = React.useCallback(() => {
    const opts = { selectedState, jurisdiction };
    const list = filterByJurisdiction(dataStore.getRecommendations(), opts, getRegionGeo);
    setRecommendations(list);
    if (list.length > 0 && (!selectedRecId || !list.some((r) => r.id === selectedRecId))) {
      setSelectedRecId(list[0].id);
    }
  }, [selectedState, jurisdiction, selectedRecId]);

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
      .catch((e) => console.warn("Recommendations sync notice:", e));

    window.addEventListener("janvista_data_updated", refreshData);
    return () => window.removeEventListener("janvista_data_updated", refreshData);
  }, [refreshData]);

  const selectedRec = recommendations.find((r) => r.id === selectedRecId) || recommendations[0];
  const selectedScore = selectedRec ? dataStore.getPriorityScoreByRegion(selectedRec.regionId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">EXPLAINABLE INFRASTRUCTURE RECOMMENDATIONS</h2>
          <p className="text-xs text-slate-600">Ranked development opportunities with complete evidence traceability</p>
        </div>
        <DataClassificationBadge classification="PUBLIC_REAL_DATA" />
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-600 space-y-2 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">No Infrastructure Recommendations Calculated Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Submit your first citizen grievance request to dynamically trigger the Gemini & Priority Calculation Engines.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommendation Cards List */}
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const isSelected = rec.id === selectedRecId;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecId(rec.id)}
                  className={`bg-white border p-4 rounded-lg cursor-pointer transition shadow-sm ${
                    isSelected ? "border-[#003366] ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CategoryBadge category={rec.category} />
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Priority</span>
                      <span className="text-base font-black text-rose-800">{rec.priorityScore} / 100</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mb-1">{rec.regionName} ({rec.state})</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-3">{rec.potentialIntervention}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>Reach: <strong className="text-slate-900">{rec.populationAffected.toLocaleString()} citizens</strong></span>
                    <span className="text-[#003366] font-bold flex items-center">
                      Inspect Why <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Dive Inspector Column */}
          <div className="lg:col-span-2 space-y-4">
            {selectedRec && selectedScore && (
              <>
                <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{selectedRec.potentialIntervention}</h3>
                    <CategoryBadge category={selectedRec.category} />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-500">Evidence Summary: </strong>
                    {selectedRec.evidenceSummary}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Target Reach</span>
                      <span className="font-black text-slate-900 text-sm">{selectedRec.populationAffected.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Model Confidence</span>
                      <span className="font-black text-emerald-800 text-sm">{selectedRec.confidence}%</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Data Coverage</span>
                      <span className="font-black text-[#003366] text-sm">{selectedRec.dataCoverage}%</span>
                    </div>
                  </div>
                </div>

                {/* WHY THIS Explainability Breakdown */}
                <WhyThisCard
                  priorityScore={selectedScore}
                  regionName={selectedRec.regionName}
                  categoryName={selectedRec.category}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
