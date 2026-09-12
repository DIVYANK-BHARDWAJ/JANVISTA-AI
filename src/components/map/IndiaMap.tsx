import React, { useState } from "react";
import { Hotspot, AdministrativeRegion } from "@/types";

interface IndiaMapProps {
  hotspots: Hotspot[];
  regions: AdministrativeRegion[];
  onSelectRegion?: (regionId: string) => void;
  selectedRegionId?: string;
}

type MapLayer = "all" | "hotspots" | "priority";

/**
 * IndiaMap Component (Neutral Slate Theme - No Blue)
 * Official regional map rendering clean pins, hotspot overlays, and region selection.
 */
export const IndiaMap: React.FC<IndiaMapProps> = ({
  hotspots,
  regions,
  onSelectRegion,
  selectedRegionId,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("all");
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);

  const mapPins = [
    { id: "reg-sitapur-up", name: "Sitapur (UP)", x: 52, y: 38, score: 89.4 },
    { id: "reg-muzaffarpur-br", name: "Muzaffarpur (BR)", x: 64, y: 42, score: 84.2 },
    { id: "reg-gadchiroli-mh", name: "Gadchiroli (MH)", x: 44, y: 58, score: 83.8 },
    { id: "reg-ramanathapuram-tn", name: "Ramanathapuram (TN)", x: 46, y: 84, score: 76.8 },
    { id: "reg-baksa-as", name: "Baksa (AS)", x: 80, y: 36, score: 81.4 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-sm">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Geospatial Regional Intelligence</h3>
          <p className="text-[11px] text-slate-500">Select an administrative cluster to inspect priority factors</p>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setActiveLayer("all")}
            className={`px-2.5 py-1 rounded font-semibold transition ${activeLayer === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
          >
            All Clusters
          </button>
          <button
            onClick={() => setActiveLayer("hotspots")}
            className={`px-2.5 py-1 rounded font-semibold transition ${activeLayer === "hotspots" ? "bg-rose-700 text-white" : "text-slate-600 hover:text-slate-900"}`}
          >
            Hotspots
          </button>
        </div>
      </div>

      {/* Clean Light SVG Canvas */}
      <div className="relative w-full h-[380px] bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full p-4 max-w-[460px] text-slate-200 fill-current stroke-slate-400 stroke-[0.5]">
          <path d="M 45 10 Q 52 12 55 18 L 62 25 L 75 28 L 88 35 L 85 45 L 75 48 L 68 45 L 60 52 L 52 65 L 48 85 L 42 90 L 38 78 L 32 68 L 25 58 L 22 45 L 30 35 L 35 25 Z" />
        </svg>

        {/* Region Map Pins */}
        {mapPins.map((pin) => {
          const isSelected = selectedRegionId === pin.id;
          const hotspot = hotspots.find((h) => h.regionId === pin.id);

          return (
            <div
              key={pin.id}
              onClick={() => onSelectRegion && onSelectRegion(pin.id)}
              onMouseEnter={() => setHoveredHotspot(hotspot || null)}
              onMouseLeave={() => setHoveredHotspot(null)}
              className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shadow border transition ${
                  isSelected
                    ? "bg-rose-700 border-white ring-2 ring-rose-400"
                    : "bg-slate-900 border-white hover:bg-slate-800"
                }`}
              >
                {pin.score}
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block z-30 bg-slate-900 text-white p-2 rounded text-xs whitespace-nowrap shadow-lg">
                <div className="font-bold text-amber-300">{pin.name}</div>
                <div className="text-[11px] text-slate-200">Priority Score: <strong>{pin.score} / 100</strong></div>
              </div>
            </div>
          );
        })}

        {/* Hover Inspector */}
        {hoveredHotspot && (
          <div className="absolute top-3 left-3 bg-white border border-slate-300 p-3 rounded text-xs text-slate-900 max-w-[220px] shadow-md z-20">
            <div className="font-bold text-slate-900">{hoveredHotspot.regionName}</div>
            <div className="text-[11px] text-slate-500">{hoveredHotspot.state}</div>
            <div className="mt-1 text-[11px]">
              <span>Hotspot Rank: </span>
              <strong className="text-rose-700">#{hoveredHotspot.rank}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            <span>Selected / Critical</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
            <span>Regional Signal</span>
          </div>
        </div>
        <span>5 Administrative Clusters</span>
      </div>
    </div>
  );
};
