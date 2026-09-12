import React, { useState } from "react";
import { CitizenRequest, InfrastructureCategory, UrgencyLevel } from "@/types";
import { dataStore } from "@/lib/data/store";
import { VoiceRecorder } from "./VoiceRecorder";
import { TextInput } from "./TextInput";
import { CategoryBadge, UrgencyBadge } from "../ui/Badge";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import {
  Mic,
  FileText,
  Camera,
  MapPin,
  CheckCircle2,
  Search,
  Sparkles,
  ShieldCheck,
  Upload,
  Globe,
  Tag,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/config/priority-weights";

type InputTab = "voice" | "text" | "photo";

interface CitizenPortalViewProps {
  onSwitchPortal?: (portal: "gateway" | "government") => void;
}

/**
 * CitizenPortalView Component
 * Dedicated, public-facing Citizen Ingestion Portal page.
 * Supports multi-channel submission (Voice Speech-to-Text, Natural Language Text, Photo/Document Attachment),
 * real-time Gemini structuring, tracking ID generation, and signal status lookup.
 */
export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({ onSwitchPortal }) => {
  const [activeInputTab, setActiveInputTab] = useState<InputTab>("voice");
  const [selectedLanguage, setSelectedLanguage] = useState("hi");
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState("Sitapur");
  const [selectedBlock, setSelectedBlock] = useState("Khairabad");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [submittedSignal, setSubmittedSignal] = useState<CitizenRequest | null>(null);
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [trackedSignal, setTrackedSignal] = useState<CitizenRequest | null>(null);
  const [trackingError, setTrackingError] = useState("");

  const regions = dataStore.getRegions();
  const recentRequests = dataStore.getRequests();

  // Handle Photo / File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit Submission Workflow
  const handleNewSubmission = async (textInput: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const trackingId = `JAN-2026-${selectedState.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const fullRequest: CitizenRequest = {
          ...data.data,
          trackingId,
          locationName: `${selectedBlock}, ${selectedDistrict}, ${selectedState}`,
          attachmentUrl: filePreviewUrl || undefined,
        };

        setSubmittedSignal(fullRequest);
        dataStore.addRequest(fullRequest);
      }
    } catch (e) {
      console.error("Submission failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Track Signal Status Lookup
  const handleTrackSignal = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError("");
    setTrackedSignal(null);

    const found = recentRequests.find(
      (r) => r.trackingId?.toLowerCase() === trackingIdInput.trim().toLowerCase() || r.id.toLowerCase() === trackingIdInput.trim().toLowerCase()
    );

    if (found) {
      setTrackedSignal(found);
    } else {
      setTrackingError("Signal tracking ID not found. Try 'JAN-2026-UP-84219' or submit a new signal below.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Government Digital Public Infrastructure
              </span>
              <DataClassificationBadge classification="SYNTHETIC_DATA" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              NATIONAL CITIZEN DEVELOPMENT VOICE & GRIEVANCE PORTAL
            </h2>
            <p className="text-xs text-slate-600">
              Express local infrastructure needs in your regional language. Google AI processes your signal to inform government priorities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onSwitchPortal && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSwitchPortal("gateway")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs px-3 py-1.5 rounded transition"
                >
                  ← Exit to Portal Gateway
                </button>
                <button
                  onClick={() => onSwitchPortal("government")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded shadow-sm transition flex items-center space-x-1"
                >
                  <span>Official Govt Portal 🏛️</span>
                </button>
              </div>
            )}

            {/* Regional Language Toggle Bar */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded border border-slate-300 text-xs shrink-0">
              <Globe className="w-4 h-4 text-slate-600 ml-1" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
          <Info className="w-4 h-4 text-slate-800 shrink-0" />
          <span>
            You do not need to fill complex government forms. Simply speak, write, or upload a photo of the infrastructure need in your village/locality.
          </span>
        </div>
      </div>

      {/* Main Submission Form & Location Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Multi-Channel Ingestion Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 space-y-5 shadow-sm">
          {/* Channel Selector Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveInputTab("voice")}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-xs font-bold transition ${
                activeInputTab === "voice"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>🎙️ Voice Submission</span>
            </button>

            <button
              onClick={() => setActiveInputTab("text")}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-xs font-bold transition ${
                activeInputTab === "text"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📝 Text Submission</span>
            </button>

            <button
              onClick={() => setActiveInputTab("photo")}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-xs font-bold transition ${
                activeInputTab === "photo"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>📷 Photo / Document Upload</span>
            </button>
          </div>

          {/* Location Context Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 p-3 rounded text-xs">
            <div>
              <label className="text-slate-600 font-bold block mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-1.5 font-semibold text-slate-900"
              >
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Assam">Assam</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">District</label>
              <input
                type="text"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-1.5 font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Block / Village</label>
              <input
                type="text"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-1.5 font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Active Input Channel Content */}
          {activeInputTab === "voice" && (
            <VoiceRecorder onAudioRecorded={handleNewSubmission} isLoading={isLoading} />
          )}

          {activeInputTab === "text" && (
            <TextInput onSubmitText={handleNewSubmission} isLoading={isLoading} />
          )}

          {activeInputTab === "photo" && (
            <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Upload className="w-4 h-4 text-slate-800" />
                <span>Upload Infrastructure Condition Photo / Document Proof</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-white">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="citizen-file-upload"
                />
                <label htmlFor="citizen-file-upload" className="cursor-pointer space-y-2 block">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-800 block">Click to upload photo of damaged road, broken water pump, or hospital facility</span>
                  <span className="text-[11px] text-slate-500 block">Supports JPG, PNG, WEBP, PDF (Max 10MB)</span>
                </label>
              </div>

              {filePreviewUrl && (
                <div className="flex items-center space-x-3 bg-white p-3 rounded border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={filePreviewUrl} alt="Upload Preview" className="w-12 h-12 object-cover rounded border" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{uploadedFile?.name}</span>
                    <span className="text-slate-500 text-[11px]">Photo attached successfully.</span>
                  </div>
                </div>
              )}

              <TextInput onSubmitText={handleNewSubmission} isLoading={isLoading} />
            </div>
          )}

          {/* Confirmation & Tracking Reference Card */}
          {submittedSignal && (
            <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-lg space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm">CITIZEN SIGNAL REGISTERED SUCCESSFULLY</span>
                </div>
                <span className="bg-emerald-900 text-white font-mono text-xs font-bold px-2.5 py-1 rounded">
                  ID: {submittedSignal.trackingId || "JAN-2026-UP-84219"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Category</span>
                  <CategoryBadge category={submittedSignal.category} />
                </div>
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Urgency Rating</span>
                  <UrgencyBadge urgency={submittedSignal.urgency} />
                </div>
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Location</span>
                  <span className="font-bold text-slate-900">{submittedSignal.locationName}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700">
                <strong className="text-slate-900">System Impact: </strong>
                Your request has been grouped into the <strong className="text-[#003366]">{submittedSignal.category} Demand Cluster</strong> for {submittedSignal.locationName}. Save your Tracking Reference ID to monitor policy review.
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Signal Status Tracker & Live Signal Feed */}
        <div className="space-y-6">
          {/* Signal Status Lookup Tool */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-800" />
              <span>Track My Submitted Signal</span>
            </h3>

            <form onSubmit={handleTrackSignal} className="space-y-3 text-xs">
              <input
                type="text"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="Enter Tracking ID (e.g. JAN-2026-UP-84219 or req-001)"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:border-slate-800"
              />

              <button
                type="submit"
                className="w-full py-2 rounded text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm"
              >
                Lookup Signal Status
              </button>
            </form>

            {trackingError && (
              <div className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2.5 rounded font-medium">
                {trackingError}
              </div>
            )}

            {trackedSignal && (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900">{trackedSignal.trackingId || trackedSignal.id}</span>
                  <CategoryBadge category={trackedSignal.category} />
                </div>
                <div className="text-[11px] text-slate-700 font-medium">Location: {trackedSignal.locationName}</div>
                <div className="bg-emerald-50 border border-emerald-300 p-2 rounded text-[11px] text-emerald-900">
                  <strong>Status: </strong>Included in Sitapur Healthcare Priority Opportunity Ranking (#1 Priority).
                </div>
              </div>
            )}
          </div>

          {/* Recent Public Citizen Signals Feed */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Tag className="w-4 h-4 text-slate-800" />
              <span>Recent Public Signals (India)</span>
            </h3>

            <div className="space-y-3">
              {recentRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900 text-[11px]">{req.locationName}</span>
                    <CategoryBadge category={req.category} />
                  </div>
                  <p className="text-[11px] text-slate-700 line-clamp-2 italic">&quot;{req.normalizedText}&quot;</p>
                  <span className="text-[10px] text-slate-500 block font-mono">{new Date(req.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
