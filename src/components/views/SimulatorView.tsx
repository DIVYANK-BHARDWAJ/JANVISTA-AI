import React, { useState } from "react";
import { dataStore } from "@/lib/data/store";
import { runImpactSimulation } from "@/lib/engines/simulator";
import { SimulationResult } from "@/types";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { Sliders, Play } from "lucide-react";

/**
 * SimulatorView Component (Official Light Government Theme)
 * Renders interactive policy impact simulator.
 * Allows policymakers to test hypothetical investment scenarios and observe priority score deltas and population reach.
 */
export const SimulatorView: React.FC = () => {
  const regions = dataStore.getRegions();
  const [selectedRegionId, setSelectedRegionId] = useState("reg-sitapur-up");
  const [intervention, setIntervention] = useState("Construct 100-Bed Specialty Hospital & Rural Trauma Center");
  const [investmentLakhs, setInvestmentLakhs] = useState(3500);
  const [capacity, setCapacity] = useState(80);
  const [result, setResult] = useState<SimulationResult | null>(dataStore.getSimulations()[0] || null);

  const handleRunSimulation = () => {
    const region = dataStore.getRegionById(selectedRegionId) || regions[0];
    const score = dataStore.getPriorityScoreByRegion(selectedRegionId) || dataStore.getPriorityScores()[0];

    const sim = runImpactSimulation(
      {
        regionId: region.id,
        category: "healthcare",
        proposedIntervention: intervention,
        investmentAmountLakhs: investmentLakhs,
        additionalCapacity: capacity,
      },
      score,
      region.population
    );

    setResult(sim);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">POLICY IMPACT SIMULATOR</h2>
          <p className="text-xs text-slate-600">Hypothetical policy scenario modeling for public infrastructure interventions</p>
        </div>
        <DataClassificationBadge classification="SIMULATION" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls Form */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#003366]" />
            <span>Scenario Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Target Region</label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded p-2 font-semibold"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Proposed Intervention</label>
              <input
                type="text"
                value={intervention}
                onChange={(e) => setIntervention(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded p-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>Capex Investment (₹ Lakhs)</span>
                <span className="text-[#003366]">₹ {(investmentLakhs / 100).toFixed(1)} Cr</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={investmentLakhs}
                onChange={(e) => setInvestmentLakhs(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#003366]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>Additional Capacity Index</span>
                <span className="text-[#003366]">{capacity} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#003366]"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              className="w-full py-2.5 rounded text-xs font-bold text-white bg-[#003366] hover:bg-blue-900 flex items-center justify-center space-x-2 shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Run Model Simulation</span>
            </button>
          </div>
        </div>

        {/* Simulation Output Display Column */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white border border-purple-300 rounded-lg p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Simulated Output</span>
                  <h3 className="text-base font-bold text-slate-900">{result.scenarioName}</h3>
                </div>
                <DataClassificationBadge classification="SIMULATION" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold block uppercase">Baseline Priority</span>
                  <span className="text-2xl font-black text-rose-800">{result.baselinePriority} / 100</span>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded text-center space-y-1">
                  <span className="text-xs text-purple-900 font-bold block uppercase">Post-Intervention Score</span>
                  <span className="text-2xl font-black text-emerald-800">{result.postInterventionPriority} / 100</span>
                  <span className="text-[11px] font-bold text-emerald-800 block">{result.priorityDelta} pts delta</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold block uppercase">Estimated Population Reach</span>
                  <span className="text-2xl font-black text-[#003366]">{result.populationCovered.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-500 block">citizens covered</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs text-slate-800 space-y-1">
                <strong className="text-slate-600 block">Model Summary:</strong>
                Estimated priority reduction of <span className="text-emerald-800 font-bold">{Math.abs(result.priorityDelta)} points</span>, improving regional service accessibility by <span className="text-[#003366] font-bold">{result.accessibilityImprovementPct}%</span>.
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
              Run a model simulation to estimate priority reduction and citizen reach.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
