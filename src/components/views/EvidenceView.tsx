import React from "react";
import { dataStore } from "@/lib/data/store";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { Database } from "lucide-react";

/**
 * EvidenceView Component (Official Light Government Theme)
 * Renders the multi-dimensional Evidence Explorer dataset (Citizen Signals, Facility Audits, Vulnerability Maps, Capex Ledgers).
 */
export const EvidenceView: React.FC = () => {
  const evidenceItems = dataStore.getEvidence();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">EVIDENCE EXPLORER</h2>
          <p className="text-xs text-slate-600">Multi-dimensional traceability across Citizen, Infrastructure, Demographic, and Geospatial datasets</p>
        </div>
        <DataClassificationBadge classification="SYNTHETIC_DATA" />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#003366]" />
          <span>Supporting Evidence Provenance Ledger</span>
        </h3>

        <div className="space-y-4">
          {evidenceItems.map((ev) => (
            <div key={ev.id} className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-[#003366]">{ev.id}</span>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{ev.type}</span>
                </div>
                <DataClassificationBadge classification={ev.classification} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Source & Dataset</span>
                  <span className="text-slate-900 font-semibold">{ev.source}</span>
                  <span className="text-slate-600 block text-[11px] font-mono">{ev.dataset} ({ev.datasetVersion})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Geographic Scope</span>
                  <span className="text-slate-800">{ev.geographicScope}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Confidence & Timestamp</span>
                  <span className="text-emerald-800 font-bold">{(ev.confidence * 100).toFixed(0)}% Confidence</span>
                  <span className="text-slate-500 block text-[10px]">{new Date(ev.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded border border-slate-200 text-xs text-slate-800 mt-2">
                <strong className="text-slate-600">Observed Evidence Value: </strong>{String(ev.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
