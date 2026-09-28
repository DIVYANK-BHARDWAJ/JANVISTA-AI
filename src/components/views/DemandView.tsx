import React, { useState, useEffect } from "react";
import { VoiceRecorder } from "../citizen/VoiceRecorder";
import { TextInput } from "../citizen/TextInput";
import { CategoryBadge, UrgencyBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { dataStore } from "@/lib/data/store";
import { CitizenRequest, OfficerJurisdiction, UserRole } from "@/types";
import { MessageSquare, CheckCircle2, Filter } from "lucide-react";

interface DemandViewProps {
  selectedState?: string;
  jurisdiction?: OfficerJurisdiction | null;
  currentRole?: UserRole;
}

/**
 * DemandView Component (Official Light Government Theme)
 * Citizens express development needs via voice or text.
 * Shows Gemini structured request extraction and systemic demand clusters.
 * Fully synchronized with persistent storage and District Collector filters.
 */
export const DemandView: React.FC<DemandViewProps> = ({ jurisdiction, currentRole }) => {
  const [requests, setRequests] = useState<CitizenRequest[]>(dataStore.getRequests());
  const [clusters] = useState(dataStore.getClusters());
  const [isLoading, setIsLoading] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<CitizenRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(null);
  const [districtFilterOnly, setDistrictFilterOnly] = useState(false);

  // Sync on mount and periodically check for new requests
  useEffect(() => {
    // 1. Instantly pull from dataStore (which checks localStorage on browser)
    const stored = dataStore.getRequests();
    setRequests(stored);

    // 2. Fetch server /api/requests to merge any server-side database records
    fetch("/api/requests")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          json.data.forEach((r: CitizenRequest) => dataStore.addRequest(r));
          setRequests(dataStore.getRequests());
        }
      })
      .catch((e) => console.warn("Failed to fetch /api/requests on mount:", e));
  }, []);

  const handleNewInput = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          state: jurisdiction?.state || "Uttar Pradesh",
          district: jurisdiction?.district || "Sitapur",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        dataStore.addRequest(data.data);
        setRequests(dataStore.getRequests());
        setLatestSubmission(data.data);
      }
    } catch (e) {
      console.error("Failed to submit request:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const isDistrictCollector = currentRole === "DISTRICT_COLLECTOR" || Boolean(jurisdiction?.district);
  const officerDistrict = jurisdiction?.district?.toLowerCase() || "";

  const displayedRequests = districtFilterOnly && officerDistrict
    ? requests.filter((r) => (r.district || "").toLowerCase() === officerDistrict)
    : requests;

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
          <span className="text-xs text-slate-500">{clusters.length} Clusters active</span>
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
              {clusters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    No active demand clusters yet. Submit a citizen grievance to generate AI demand clusters.
                  </td>
                </tr>
              ) : (
                clusters.map((c) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Citizen Grievance Inspection Ledger (District Collectors & Policymakers) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Complete Public Citizen Grievances (Official Audit Feed)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct raw & Gemini-structured citizen grievances for District Collectorate & Policymaker action.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {isDistrictCollector && officerDistrict && (
              <div className="inline-flex rounded-md shadow-sm border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDistrictFilterOnly(false)}
                  className={`px-2.5 py-1 rounded font-bold transition ${
                    !districtFilterOnly
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Grievances ({requests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDistrictFilterOnly(true)}
                  className={`px-2.5 py-1 rounded font-bold transition ${
                    districtFilterOnly
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  My District: {jurisdiction?.district} ({requests.filter((r) => (r.district || "").toLowerCase() === officerDistrict).length})
                </button>
              </div>
            )}
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {displayedRequests.length} Ingested Submissions
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Location</th>
                <th className="p-3">Category</th>
                <th className="p-3">Urgency</th>
                <th className="p-3">Issue Statement</th>
                <th className="p-3">Language</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-center">Complete Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                    {districtFilterOnly && requests.length > 0 ? (
                      <div className="space-y-2">
                        <p>No citizen complaints lodged for <strong>{jurisdiction?.district}</strong> yet.</p>
                        <p className="text-xs text-slate-400">({requests.length} complaints have been lodged in other districts / nationwide)</p>
                        <button
                          onClick={() => setDistrictFilterOnly(false)}
                          className="mt-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded transition"
                        >
                          View All Nationwide Grievances ({requests.length})
                        </button>
                      </div>
                    ) : (
                      "No citizen requests logged yet. Use the voice recorder or text form above to submit your first request!"
                    )}
                  </td>
                </tr>
              ) : (
                displayedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-[#003366]">
                      {req.trackingId || req.id}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      {req.locationName}
                    </td>
                    <td className="p-3">
                      <CategoryBadge category={req.category} />
                    </td>
                    <td className="p-3">
                      <UrgencyBadge urgency={req.urgency} />
                    </td>
                    <td className="p-3 max-w-sm truncate" title={req.rawTranscript || req.normalizedText}>
                      {req.issue}
                    </td>
                    <td className="p-3 uppercase text-[10px] font-bold text-slate-500">
                      {req.language}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(req.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded transition shadow-sm"
                      >
                        View Complete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Grievance Inspection Modal Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold tracking-wide">
                    Complete Citizen Grievance Inspection
                  </h4>
                  <span className="text-[11px] text-slate-300 font-mono">
                    ID: {selectedRequest.trackingId || selectedRequest.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Category</span>
                  <CategoryBadge category={selectedRequest.category} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Urgency Tier</span>
                  <UrgencyBadge urgency={selectedRequest.urgency} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                  <strong className="text-slate-900">{selectedRequest.locationName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Classification</span>
                  <DataClassificationBadge classification={selectedRequest.dataClassification} />
                </div>
              </div>

              <div>
                <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1">
                  Original Citizen Voice / Grievance Statement:
                </h5>
                <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded text-xs text-slate-900 font-medium leading-relaxed">
                  &quot;{selectedRequest.rawTranscript}&quot;
                </div>
              </div>

              <div>
                <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1">
                  Gemini AI Normalized & Structured Extraction:
                </h5>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs text-slate-800 space-y-1">
                  <div><strong>Structured Summary:</strong> {selectedRequest.normalizedText}</div>
                  <div><strong>Identified Asset Type:</strong> <span className="capitalize">{selectedRequest.infrastructureType}</span></div>
                  <div><strong>Processing Model:</strong> <span className="font-mono">{selectedRequest.processingModel} (v{selectedRequest.modelVersion})</span></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
