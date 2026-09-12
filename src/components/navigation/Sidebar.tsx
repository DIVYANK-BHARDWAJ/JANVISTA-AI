import React from "react";
import {
  LayoutDashboard,
  Map,
  MessageSquarePlus,
  Flame,
  Building2,
  Award,
  Database,
  Sliders,
  Sparkles,
} from "lucide-react";

export type NavTab =
  | "overview"
  | "map"
  | "demand"
  | "citizen-portal"
  | "hotspots"
  | "infrastructure"
  | "recommendations"
  | "evidence"
  | "simulator"
  | "ask-janvista";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

/**
 * Sidebar Component (Neutral Slate Theme - No Blue)
 * Renders structured, clean navigation across primary decision-intelligence modules.
 */
export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: NavTab; label: string; icon: React.ElementType; tag?: string }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "map", label: "National Map", icon: Map },
    { id: "demand", label: "Citizen Demand", icon: MessageSquarePlus },
    { id: "citizen-portal", label: "Citizen Ingestion Portal", icon: MessageSquarePlus, tag: "LIVE" },
    { id: "hotspots", label: "Hotspots", icon: Flame, tag: "AI" },
    { id: "infrastructure", label: "Infrastructure Gaps", icon: Building2 },
    { id: "recommendations", label: "Recommendations", icon: Award, tag: "WHY THIS?" },
    { id: "evidence", label: "Evidence Explorer", icon: Database },
    { id: "simulator", label: "Impact Simulator", icon: Sliders },
    { id: "ask-janvista", label: "Ask JANVISTA", icon: Sparkles, tag: "RAG" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-3 shrink-0 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 border-b border-slate-100 mb-2">
        National Decision Modules
      </div>

      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </div>

              {tab.tag && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800 border border-slate-300"
                  }`}
                >
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
