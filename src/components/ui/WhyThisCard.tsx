import React from "react";
import { PriorityScore } from "@/types";
import { DataClassificationBadge } from "./DataClassificationBadge";
import { ShieldCheck, Info } from "lucide-react";

interface Props {
  priorityScore: PriorityScore;
  regionName: string;
  categoryName: string;
}

/**
 * WhyThisCard Component (Neutral Slate Theme - No Blue)
 * Official explainability deep-dive component detailing calculated Priority Scores, factor weights, and provenance.
 */
export const WhyThisCard: React.FC<Props> = ({ priorityScore, regionName, categoryName }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5 shadow-sm">
      {/* Official Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-wide">ANALYTICAL PRIORITY BREAKDOWN</h3>
            <DataClassificationBadge classification={priorityScore.dataClassification} />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Regional signal breakdown for <strong className="text-slate-900">{regionName}</strong> ({categoryName})
          </p>
        </div>

        <div className="bg-slate-900 text-white border border-slate-700 px-4 py-2 rounded text-right shadow-sm">
          <span className="text-[10px] font-bold text-slate-300 block uppercase">Calculated Score</span>
          <span className="text-2xl font-black">{priorityScore.score}</span>
          <span className="text-xs text-slate-300"> / 100</span>
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-800" />
          <span>Priority Signals (Model {priorityScore.methodologyVersion})</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {priorityScore.factors.map((factor, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{factor.name}</span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {factor.rawScore}/100 <span className="text-slate-500">({(factor.weight * 100)}% wt)</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded transition-all duration-300"
                  style={{ width: `${Math.min(100, factor.rawScore)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span>Dataset: {factor.sourceDataset}</span>
                <span className="font-bold text-slate-900">+{factor.weightedScore} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance & Audit Footer */}
      <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-start space-x-2.5 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-[11px]">
          <strong className="font-bold text-amber-950 block mb-0.5">AUTHORIZED HUMAN POLICYMAKER REVIEW REQUIRED</strong>
          JANVISTA provides decision support based on analytical modeling. Final infrastructure project funding requires official government approval.
        </div>
      </div>
    </div>
  );
};
