"use client";

import { useState, useMemo, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { CrimeMap } from "./CrimeMap";
import { CrimeHeatmapLayer } from "./CrimeHeatmapLayer";
import type { Hotspot } from "@/types/analytics";

interface SpatiotemporalHeatmapProps {
  hotspots: Hotspot[];
}

const timeBlocks = ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"];

export function SpatiotemporalHeatmap({ hotspots }: SpatiotemporalHeatmapProps) {
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedCrime, setSelectedCrime] = useState<string>("all");
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const filtered = useMemo(() => {
    return hotspots.filter((h) => {
      const matchTime = selectedTime === "all" || h.timeBlock === selectedTime;
      const matchCrime = selectedCrime === "all" || h.crimeGroupName === selectedCrime;
      return matchTime && matchCrime;
    });
  }, [hotspots, selectedTime, selectedCrime]);

  const crimeTypes = useMemo(() => {
    const types = new Set(hotspots.map((h) => h.crimeGroupName));
    return Array.from(types).sort();
  }, [hotspots]);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium">Time Block:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20"
          >
            <option value="all">All Hours</option>
            {timeBlocks.map((t) => (
              <option key={t} value={t}>{t} hrs</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium">Crime Type:</label>
          <select
            value={selectedCrime}
            onChange={(e) => setSelectedCrime(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20"
          >
            <option value="all">All Crimes</option>
            {crimeTypes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400 self-center ml-auto">
          {filtered.length} data points
        </div>
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <CrimeMap center={[77.5, 12.9]} zoom={6.5} onMapReady={handleMapReady} />
      </div>

      {mapInstance && <CrimeHeatmapLayer map={mapInstance} hotspots={filtered} visible={true} />}
    </div>
  );
}
