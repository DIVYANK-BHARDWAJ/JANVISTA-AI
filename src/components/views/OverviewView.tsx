import React from "react";
import { KpiCard } from "../ui/KpiCard";
import { WhyThisCard } from "../ui/WhyThisCard";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import {
  MessageSquare,
  Flame,
  Building2,
  Award,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { dataStore } from "@/lib/data/store";
import { NavTab } from "../navigation/Sidebar";

interface Props {
  onNavigate: (tab: NavTab) => void;
}

/**
 * OverviewView Component (Neutral Slate Theme - No Blue)
 * Answers: "WHERE SHOULD WE ACT FIRST?"
 * Displays national metrics, official priority spotlight, and national decision pipeline.
 */
export const OverviewView: React.FC<Props> = ({ onNavigate }) => {
  const requests = dataStore.getRequests();
  const clusters = dataStore.getClusters();
  const hotspots = dataStore.getHotspots();
  const gaps = dataStore.getGaps();
  const priorityScores = dataStore.getPriorityScores();
  const recs = dataStore.getRecommendations();

  const topRec = recs.length > 0 ? recs[0] : null;
  const sitapurScore = topRec ? dataStore.getPriorityScoreByRegion(topRec.regionId) : null;

  const maxGapVal = gaps.length > 0 ? Math.max(...gaps.map((g) => g.gapIndex)).toFixed(1) : "0.0";
  const topPrioVal = priorityScores.length > 0 ? Math.max(...priorityScores.map((p) => p.score)).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Official Government Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-2 relative overflow-hidden shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            National Vision & Infrastructure Decision Support
          </span>
          <DataClassificationBadge classification="PUBLIC_REAL_DATA" />
        </div>

        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          WHERE SHOULD WE ACT FIRST?
        </h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            JANVISTA transforms fragmented multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities for national and state decision-makers.
          </p>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigate("citizen-portal")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded shadow transition flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Submit Citizen Request</span>
            </button>
            <a
              href="/citizen"
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded transition flex items-center space-x-1"
            >
              <span>Open Citizen Portal ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Citizen Requests"
          value={requests.length.toLocaleString()}
          subtitle={requests.length > 0 ? `Ingested across states` : "0 requests submitted yet"}
          icon={MessageSquare}
          accentColor="sky"
        />
        <KpiCard
          title="Demand Clusters"
          value={`${clusters.length} Clusters`}
          subtitle="Spatial & semantic aggregation"
          icon={Users}
          accentColor="purple"
        />
        <KpiCard
          title="Hotspots Detected"
          value={`${hotspots.length} Regions`}
          subtitle={hotspots.length > 0 ? `Top: ${hotspots[0].regionName}` : "0 hotspots active"}
          icon={Flame}
          accentColor="rose"
        />
        <KpiCard
          title="Max Gap Index"
          value={`${maxGapVal} %`}
          subtitle="Infrastructure Deficit"
          icon={Building2}
          accentColor="amber"
        />
        <KpiCard
          title="Top Priority Score"
          value={`${topPrioVal} / 100`}
          subtitle="Model v1.0.0 (Live)"
          icon={Award}
          accentColor="emerald"
        />
      </div>


      {/* Priority Opportunity Spotlight */}
      {topRec && sitapurScore && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-800" />
              <span>Highest Priority Opportunity Spotlight</span>
            </h3>

            <button
              onClick={() => onNavigate("recommendations")}
              className="text-xs font-semibold text-slate-800 hover:underline flex items-center space-x-1"
            >
              <span>View All Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <WhyThisCard
            priorityScore={sitapurScore}
            regionName={topRec.regionName}
            categoryName={topRec.category}
          />
        </div>
      )}

      {/* Decision Pipeline Navigation Row */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          National Intelligence Workflow Stages
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          {[
            { step: "01", name: "Citizen Voice", tab: "demand" as NavTab },
            { step: "02", name: "Gemini Extract", tab: "demand" as NavTab },
            { step: "03", name: "Demand Cluster", tab: "demand" as NavTab },
            { step: "04", name: "Map Hotspot", tab: "map" as NavTab },
            { step: "05", name: "Infra Gap", tab: "infrastructure" as NavTab },
            { step: "06", name: "Priority Score", tab: "recommendations" as NavTab },
            { step: "07", name: "Evidence & Action", tab: "evidence" as NavTab },
          ].map((s, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(s.tab)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-800 hover:bg-slate-100 p-2.5 rounded flex flex-col items-start space-y-1 transition group"
            >
              <span className="text-[10px] font-extrabold text-slate-900">STAGE {s.step}</span>
              <span className="font-semibold text-slate-800 text-[11px]">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
