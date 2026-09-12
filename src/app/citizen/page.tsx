"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Sidebar, NavTab } from "@/components/navigation/Sidebar";
import { UserRole } from "@/types";
import { dataStore } from "@/lib/data/store";
import { CitizenPortalView } from "@/components/citizen/CitizenPortalView";

/**
 * Citizen Portal Standalone Route (/citizen)
 * Public-facing citizen ingestion portal page.
 */
export default function CitizenPage() {
  const [activeTab, setActiveTab] = useState<NavTab>("demand");
  const [currentRole, setCurrentRole] = useState<UserRole>("CITIZEN");
  const [selectedState, setSelectedState] = useState<string>("Uttar Pradesh");

  const availableStates = Array.from(new Set(dataStore.getRegions().map((r) => r.state)));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#003366] selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedState={selectedState}
        onStateChange={setSelectedState}
        availableStates={availableStates}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Citizen Ingestion Workspace Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          <CitizenPortalView />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a2540] text-slate-300 text-center py-3 text-xs border-t border-slate-700">
        JANVISTA AI • Public Citizen Development Voice & Grievance Portal • Powered by Google AI
      </footer>
    </div>
  );
}
