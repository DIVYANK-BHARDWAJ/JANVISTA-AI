import React, { useState } from "react";
import { VoiceRecorder } from "../citizen/VoiceRecorder";
import { TextInput } from "../citizen/TextInput";
import { CategoryBadge, UrgencyBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { dataStore } from "@/lib/data/store";
import { CitizenRequest } from "@/types";
import { MessageSquare, CheckCircle2 } from "lucide-react";

/**
 * DemandView Component (Official Light Government Theme)
 * Citizens express development needs via voice or text.
 * Shows Gemini structured request extraction and systemic demand clusters.
 */
export const DemandView: React.FC = () => {
  const [requests, setRequests] = useState<CitizenRequest[]>(dataStore.getRequests());
  const [clusters, setClusters] = useState(dataStore.getClusters());
  const [isLoading, setIsLoading] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<CitizenRequest | null>(null);

  const handleNewInput = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRequests(dataStore.getRequests());
        setLatestSubmission(data.data);
      }
    } catch (e) {
      console.error("Failed to submit request:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">CITIZEN DEMAND INTELLIGENCE</h2>
        <p className="text-xs text-slate-600">Multilingual voice & text ingestion with Gemini semantic structuring</p>
      </div>

      {/* Input Ingestion Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VoiceRecorder onAudioRecorded={handleNewInput} isLoading={isLoading} />
        <TextInput onSubmitText={handleNewInput} isLoading={isLoading} />
      </div>

      {/* Live Gemini Extraction Output Card */}
      {latestSubmission && (
        <div className="bg-white border border-emerald-300 rounded-lg p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Gemini Structured Intelligence Result</h3>
            </div>
            <DataClassificationBadge classification={latestSubmission.dataClassification} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-3 rounded text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
              <CategoryBadge category={latestSubmission.category} />
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Urgency</span>
              <UrgencyBadge urgency={latestSubmission.urgency} />
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Infrastructure Type</span>
              <span className="text-slate-900 font-bold capitalize">{latestSubmission.infrastructureType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
              <span className="text-[#003366] font-bold">{latestSubmission.locationName}</span>
            </div>
          </div>

          <div className="text-xs text-slate-800">
            <strong className="text-slate-600">Summary: </strong>{latestSubmission.normalizedText}
          </div>
        </div>
      )}

      {/* Demand Clusters Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#003366]" />
            <span>Systemic Demand Clusters (Aggregated Signals)</span>
          </h3>
          <span className="text-xs text-slate-500">5 Clusters active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Cluster ID</th>
                <th className="p-3">Region</th>
                <th className="p-3">Category</th>
                <th className="p-3">Dominant Issue</th>
                <th className="p-3 text-right">Signals</th>
                <th className="p-3 text-right">Normalized Demand</th>
                <th className="p-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clusters.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-[#003366] font-bold">{c.id}</td>
                  <td className="p-3 font-bold text-slate-900">
                    {dataStore.getRegionById(c.regionId)?.name || c.regionId}
                  </td>
                  <td className="p-3">
                    <CategoryBadge category={c.category} />
                  </td>
                  <td className="p-3 max-w-xs truncate">{c.dominantIssue}</td>
                  <td className="p-3 text-right font-extrabold text-slate-900">{c.requestCount.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-[#003366]">{c.normalizedDemand} / 100</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${c.temporalTrend === 'increasing' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700'}`}>
                      {c.temporalTrend}
                    </span>
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
