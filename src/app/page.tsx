"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Sidebar, NavTab } from "@/components/navigation/Sidebar";
import { OfficerJurisdiction, UserRole } from "@/types";
import { dataStore } from "@/lib/data/store";
import { OfficerLogin } from "@/components/auth/OfficerLogin";
import { CitizenLogin } from "@/components/auth/CitizenLogin";

import { OverviewView } from "@/components/views/OverviewView";
import { MapView } from "@/components/views/MapView";
import { DemandView } from "@/components/views/DemandView";
import { HotspotsView } from "@/components/views/HotspotsView";
import { InfrastructureView } from "@/components/views/InfrastructureView";
import { RecommendationsView } from "@/components/views/RecommendationsView";
import { EvidenceView } from "@/components/views/EvidenceView";
import { SimulatorView } from "@/components/views/SimulatorView";
import { AskJanvistaView } from "@/components/views/AskJanvistaView";
import { CitizenPortalView } from "@/components/citizen/CitizenPortalView";
import { PortalGateway } from "@/components/gateway/PortalGateway";

/**
 * JANVISTA AI Main Landing & Application Page
 * Enforces strict Password Protection for BOTH Citizen Portal and Government Official Portal.
 */
export default function Home() {
  const [viewMode, setViewMode] = useState<"gateway" | "citizen" | "government">("gateway");
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [currentRole, setCurrentRole] = useState<UserRole>("POLICYMAKER");
  const [selectedState, setSelectedState] = useState<string>("All India");
  const [jurisdiction, setJurisdiction] = useState<OfficerJurisdiction | null>(null);
  
  // Password protection login gates
  const [pendingOfficerRole, setPendingOfficerRole] = useState<Extract<UserRole, "STATE_PLANNER" | "DISTRICT_COLLECTOR" | "POLICYMAKER"> | null>(null);
  const [pendingCitizenLogin, setPendingCitizenLogin] = useState<boolean>(false);

  const availableStates = Array.from(new Set(dataStore.getRegions().map((r) => r.state)));

  const handleOfficerLoginSuccess = (j: OfficerJurisdiction) => {
    if (!pendingOfficerRole) return;
    setJurisdiction(j);
    setCurrentRole(pendingOfficerRole);
    setSelectedState(j.state);
    setViewMode("government");
    setPendingOfficerRole(null);
  };

  const handleCitizenLoginSuccess = () => {
    setPendingCitizenLogin(false);
    setCurrentRole("CITIZEN");
    setViewMode("citizen");
  };

  // Citizen Login Gate — shown whenever Citizen Portal access is requested
  if (pendingCitizenLogin) {
    return (
      <CitizenLogin
        onSuccess={handleCitizenLoginSuccess}
        onCancel={() => setPendingCitizenLogin(false)}
      />
    );
  }

  // Officer Login Gate — shown whenever Government Official access is requested
  if (pendingOfficerRole) {
    return (
      <OfficerLogin
        role={pendingOfficerRole === "POLICYMAKER" ? "STATE_PLANNER" : pendingOfficerRole}
        onSuccess={handleOfficerLoginSuccess}
        onCancel={() => setPendingOfficerRole(null)}
      />
    );
  }

  // Gateway Selector View
  if (viewMode === "gateway") {
    return (
      <PortalGateway
        onSelectPortal={(portal, role) => {
          if (portal === "citizen") {
            setPendingCitizenLogin(true);
            return;
          }
          if (portal === "government" || role) {
            setPendingOfficerRole(role === "POLICYMAKER" ? "STATE_PLANNER" : (role as Extract<UserRole, "STATE_PLANNER" | "DISTRICT_COLLECTOR">) || "STATE_PLANNER");
          }
        }}
      />
    );
  }

  // Citizen Portal View
  if (viewMode === "citizen") {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        <main className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
          <CitizenPortalView onSwitchPortal={() => setViewMode("gateway")} />
        </main>
        <footer className="bg-white border-t border-slate-200 text-center py-3 text-xs text-slate-600 font-medium">
          JANVISTA AI • Jan-AI National Vision & Infrastructure Strategic Targeting Assistant • Government of India Citizen Services
        </footer>
      </div>
    );
  }

  // Government Official Decision Intelligence View
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-slate-700 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          if (role === "CITIZEN") {
            setPendingCitizenLogin(true);
            return;
          }
          setPendingOfficerRole(role === "POLICYMAKER" ? "STATE_PLANNER" : (role as Extract<UserRole, "STATE_PLANNER" | "DISTRICT_COLLECTOR">));
        }}
        selectedState={selectedState}
        onStateChange={setSelectedState}
        availableStates={availableStates}
        onSwitchPortal={() => setViewMode("gateway")}
        jurisdictionLabel={jurisdiction?.displayName}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} currentRole={currentRole} />

        {/* Tab View Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          {activeTab === "overview" && <OverviewView onNavigate={setActiveTab} />}
          {activeTab === "map" && <MapView />}
          {activeTab === "demand" && <DemandView />}
          {activeTab === "citizen-portal" && (
            <CitizenPortalView onSwitchPortal={() => setViewMode("gateway")} />
          )}
          {activeTab === "hotspots" && <HotspotsView />}
          {activeTab === "infrastructure" && <InfrastructureView />}
          {activeTab === "recommendations" && <RecommendationsView />}
          {activeTab === "evidence" && <EvidenceView />}
          {activeTab === "simulator" && <SimulatorView />}
          {activeTab === "ask-janvista" && <AskJanvistaView />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-3 text-xs text-slate-600 font-medium">
        JANVISTA AI • Jan-AI National Vision & Infrastructure Strategic Targeting Assistant • Government of India Decision Support System
      </footer>
    </div>
  );
}
