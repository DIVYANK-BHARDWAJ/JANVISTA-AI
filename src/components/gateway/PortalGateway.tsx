import React, { useState } from "react";
import { UserRole } from "@/types";
import {
  User,
  Building2,
  Mic,
  MessageSquare,
  Search,
  ShieldCheck,
  MapPin,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Landmark,
} from "lucide-react";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";

interface PortalGatewayProps {
  onSelectPortal: (portal: "citizen" | "government", role?: UserRole) => void;
}

/**
 * PortalGateway Component (Neutral Slate Government Theme - No Blue)
 * Gateway landing page presenting 2 distinct access entry points:
 * 1. Citizen Portal ("I am a Citizen") - Focused grievance submission & tracking.
 * 2. Government Official Portal ("I am a Govt Official") - Decision intelligence platform.
 */
export const PortalGateway: React.FC<PortalGatewayProps> = ({ onSelectPortal }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("POLICYMAKER");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-slate-700 selection:text-white">
      {/* Official Government Top Bar Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-3.5 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center font-black text-amber-400 text-lg">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black tracking-tight text-white">JANVISTA AI</h1>
                <DataClassificationBadge classification="SYNTHETIC_DATA" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Jan-AI National Vision & Infrastructure Strategic Targeting Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Gateway Portal • Government of India</span>
          </div>
        </div>
      </header>

      {/* Main Gateway Body */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 my-auto">
        {/* Intro Headline */}
        <div className="text-center space-y-3 max-w-2xl">
          <span className="bg-slate-200 text-slate-800 text-[11px] font-extrabold uppercase px-3 py-1 rounded tracking-wider border border-slate-300">
            Select Entry Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Unified Public Service & Infrastructure Decision Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Please choose your access portal below to proceed into the JANVISTA AI System.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* OPTION 1: CITIZEN PORTAL */}
          <div className="bg-white border-2 border-slate-300 hover:border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition group">
            <div className="space-y-4">
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-700" />
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                  Citizen Services
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-slate-900 transition">
                  I am a Citizen
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  जन सेवा पोर्टल — Submit your local infrastructure grievances, report requests, and track request resolution status.
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Features List */}
              <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Mic className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>🎙️ Voice Speech-to-Text input in Hindi & English</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>📝 Text input with district selection & photo uploads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>🔍 Live Grievance Tracking ID lookup</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onSelectPortal("citizen")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-lg shadow-sm transition flex items-center justify-center space-x-2 group-hover:translate-x-0.5"
            >
              <span>Enter Citizen Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* OPTION 2: GOVERNMENT OFFICIAL PORTAL */}
          <div className="bg-white border-2 border-slate-300 hover:border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition group">
            <div className="space-y-4">
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-700" />
                </div>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                  Official Access
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-slate-900 transition">
                  I am a Govt Official / Policymaker
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  शासकीय निर्णय पोर्टल — Analyze regional demand, evaluate infrastructure gaps, review priorities, and run impact simulations.
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Features List */}
              <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>🗺️ Interactive Regional Infrastructure Gap Map</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Flame className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>🔥 AI Demand Cluster & Hotspot Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>🎯 Audited Priority Scores & "WHY THIS?" Provenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <span>💬 Ask JANVISTA Grounded Gemini Policy RAG</span>
                </div>
              </div>

              {/* Official Role Selector */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Select Official Designation:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-800 p-2 focus:ring-1 focus:ring-slate-800"
                >
                  <option value="POLICYMAKER">Policymaker / Cabinet Secretary</option>
                  <option value="INFRASTRUCTURE_AUTHORITY">District Magistrate / Infra Authority</option>
                  <option value="DATA_ANALYST">National Data Analyst</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onSelectPortal("government", selectedRole)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-lg shadow-sm transition flex items-center justify-center space-x-2 group-hover:translate-x-0.5"
            >
              <span>Enter Government Decision Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-4 text-xs text-slate-600 font-medium">
        JANVISTA AI • Jan-AI National Vision & Infrastructure Strategic Targeting Assistant • Government of India Digital Public Infrastructure
      </footer>
    </div>
  );
};
