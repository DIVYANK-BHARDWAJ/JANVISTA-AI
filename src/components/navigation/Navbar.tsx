import React from "react";
import { UserRole } from "@/types";
import { Landmark, MapPin, UserCheck, ShieldCheck } from "lucide-react";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  availableStates: string[];
  onSwitchPortal?: () => void;
  /** Shown next to the role badge when logged in as a State Planner / District Collector. */
  jurisdictionLabel?: string;
}

/**
 * Navbar Component (Official Neutral Slate Theme - No Blue)
 * Official National Portal header styling with National Emblem iconography,
 * tricolor accent line, state selector, and role switcher.
 */
export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedState,
  onStateChange,
  availableStates,
  onSwitchPortal,
  jurisdictionLabel,
}) => {
  return (
    <header className="bg-[#0f172a] border-b border-slate-700 text-white sticky top-0 z-50 shadow-sm">
      {/* Official Tricolor Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-white to-emerald-600" />

      <div className="px-4 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & National Emblem Header */}
        <div className="flex items-center space-x-3.5">
          <div className="bg-amber-500/20 border border-amber-400/40 p-2.5 rounded-md text-amber-300">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-extrabold text-white tracking-wide">JANVISTA AI</h1>
              <span className="bg-slate-800 text-slate-200 border border-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Government Decision Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Jan-AI National Vision & Infrastructure Strategic Targeting Assistant
            </p>
          </div>

          {onSwitchPortal && (
            <button
              onClick={onSwitchPortal}
              className="ml-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold px-2.5 py-1 rounded transition"
            >
              ← Portal Gateway
            </button>
          )}
        </div>

        {/* Official Jurisdiction & Role Selectors */}
        <div className="flex items-center space-x-3">
          {/* State Jurisdiction Selector */}
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-xs text-white">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 text-[11px] font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="All India" className="bg-slate-900 text-white">All India (National)</option>
              {availableStates.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-xs text-white">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 text-[11px] font-medium">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="POLICYMAKER" className="bg-slate-900 text-white">Policymaker</option>
              <option value="ANALYST" className="bg-slate-900 text-white">Analyst</option>
              <option value="DISTRICT_OFFICIAL" className="bg-slate-900 text-white">District Official</option>
              <option value="STATE_PLANNER" className="bg-slate-900 text-white">State Planner</option>
              <option value="DISTRICT_COLLECTOR" className="bg-slate-900 text-white">District Collector</option>
              <option value="CITIZEN" className="bg-slate-900 text-white">Citizen View</option>
            </select>
          </div>

          {jurisdictionLabel && (
            <div className="hidden lg:flex items-center space-x-1.5 bg-amber-900/40 border border-amber-500/40 px-2.5 py-1 rounded text-xs text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px]">{jurisdictionLabel}</span>
            </div>
          )}

          {/* System Online Stamp */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-emerald-900/60 border border-emerald-500/50 px-2.5 py-1 rounded text-xs text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px]">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
