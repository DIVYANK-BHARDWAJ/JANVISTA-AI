import React, { useState } from "react";
import { Hotspot, AdministrativeRegion } from "@/types";
import { MapPin, Globe, Layers, Navigation } from "lucide-react";

interface IndiaMapProps {
  hotspots: Hotspot[];
  regions: AdministrativeRegion[];
  onSelectRegion?: (regionId: string) => void;
  selectedRegionId?: string;
}

type MapMode = "google_maps" | "vector_map";

/**
 * IndiaMap Component (Official Light Government Theme)
 * Integrates Google Maps and dynamic Lat/Lng coordinate plotting for all Indian states and districts (Haryana, UP, Bihar, etc.).
 */
export const IndiaMap: React.FC<IndiaMapProps> = ({
  hotspots,
  regions,
  onSelectRegion,
  selectedRegionId,
}) => {
  const [mapMode, setMapMode] = useState<MapMode>("google_maps");
  const [hoveredRegion, setHoveredRegion] = useState<AdministrativeRegion | null>(null);

  // Active selected region
  const activeRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  // Helper to project Lat/Lng to SVG percentage canvas
  // India bounds roughly: Lat 8°N - 37°N, Lng 68°E - 97°E
  const projectCoordsToCanvas = (lat: number, lng: number) => {
    const minLat = 8.0;
    const maxLat = 37.0;
    const minLng = 68.0;
    const maxLng = 97.0;

    const x = Math.min(95, Math.max(5, ((lng - minLng) / (maxLng - minLng)) * 90 + 5));
    const y = Math.min(95, Math.max(5, (1 - (lat - minLat) / (maxLat - minLat)) * 90 + 5));

    return { x, y };
  };

  const centerLat = activeRegion ? activeRegion.coordinates.latitude : 28.4595;
  const centerLng = activeRegion ? activeRegion.coordinates.longitude : 77.0266;
  const googleMapsUrl = `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=10&output=embed`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-sm">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Geospatial Regional Intelligence Map</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              GOOGLE MAPS INTEGRATED
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Currently displaying: <strong className="text-slate-900">{activeRegion ? `${activeRegion.name} (${activeRegion.state})` : "Haryana / All India"}</strong>
          </p>
        </div>

        {/* Mode Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setMapMode("google_maps")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition ${
              mapMode === "google_maps" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Google Maps
          </button>
          <button
            onClick={() => setMapMode("vector_map")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition ${
              mapMode === "vector_map" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Vector Grid
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[420px] bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shadow-inner">
        {mapMode === "google_maps" ? (
          <div className="w-full h-full relative">
            <iframe
              title="Google Maps Location View"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={googleMapsUrl}
              allowFullScreen
            />
            <div className="absolute top-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-2 rounded-lg text-xs shadow-lg border border-slate-700 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <div className="font-bold">{activeRegion?.name} District</div>
                <div className="text-[10px] text-slate-300">Lat: {centerLat.toFixed(4)}° | Lng: {centerLng.toFixed(4)}°</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-slate-50 flex items-center justify-center">
            {/* India Outline Background */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-4 max-w-[480px] text-slate-200 fill-current stroke-slate-400 stroke-[0.5]">
              <path d="M 45 10 Q 52 12 55 18 L 62 25 L 75 28 L 88 35 L 85 45 L 75 48 L 68 45 L 60 52 L 52 65 L 48 85 L 42 90 L 38 78 L 32 68 L 25 58 L 22 45 L 30 35 L 35 25 Z" />
            </svg>

            {/* Dynamic Region Pins plotted from real Lat/Lng */}
            {regions.map((reg) => {
              const isSelected = selectedRegionId === reg.id;
              const hotspot = hotspots.find((h) => h.regionId === reg.id);
              const score = hotspot ? hotspot.hotspotScore : 65;
              const pos = projectCoordsToCanvas(reg.coordinates.latitude, reg.coordinates.longitude);

              return (
                <div
                  key={reg.id}
                  onClick={() => onSelectRegion && onSelectRegion(reg.id)}
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div
                    className={`px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-extrabold text-white shadow-md border transition ${
                      isSelected
                        ? "bg-rose-700 border-white ring-4 ring-rose-400 scale-110"
                        : "bg-slate-900 border-white hover:bg-slate-800"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{reg.name}</span>
                    <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">{score}</span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block z-30 bg-slate-900 text-white p-2.5 rounded-lg text-xs whitespace-nowrap shadow-xl border border-slate-700">
                    <div className="font-bold text-amber-300">{reg.name} ({reg.state})</div>
                    <div className="text-[11px] text-slate-200 mt-0.5">
                      Population: <strong>{reg.population.toLocaleString()}</strong>
                    </div>
                    {reg.demographics && (
                      <div className="text-[10px] text-slate-300 mt-1 pt-1 border-t border-slate-800">
                        Literacy: {reg.demographics.literacyRate}% | BPL: {reg.demographics.bplPercentage}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Hover Inspector */}
            {hoveredRegion && (
              <div className="absolute top-3 left-3 bg-white/95 border border-slate-300 p-3 rounded-lg text-xs text-slate-900 max-w-[240px] shadow-lg z-20 backdrop-blur">
                <div className="font-bold text-slate-900">{hoveredRegion.name} District</div>
                <div className="text-[11px] text-slate-600 font-medium">{hoveredRegion.state}</div>
                <div className="mt-1 text-[11px] space-y-0.5 text-slate-700">
                  <div>Vulnerability Index: <strong className="text-rose-700">{hoveredRegion.vulnerabilityIndex}/100</strong></div>
                  {hoveredRegion.demographics && (
                    <div>Literacy Rate: <strong>{hoveredRegion.demographics.literacyRate}%</strong></div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
            <span className="font-medium text-slate-700">Selected Region Hotspot</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
            <span className="font-medium text-slate-700">Administrative District</span>
          </div>
        </div>
        <span className="font-mono text-slate-600 font-semibold">{regions.length} Active Regions Registered</span>
      </div>
    </div>
  );
};
