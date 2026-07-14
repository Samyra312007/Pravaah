"use client";

import { useState, useCallback, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { CrimeMap, CrimeHeatmapLayer, StationMarkers, SpatiotemporalHeatmap, DistrictBoundaryLayer } from "@/components/maps";
import { useHotspots } from "@/hooks/useMockAnalytics";
import { generateMockDistrictDrillDown } from "@/lib/mock/mockData";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

export default function MapsPage() {
  const { hotspots, loading } = useHotspots();
  const [activeTab, setActiveTab] = useState<"heatmap" | "spatiotemporal">("heatmap");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<{ name: string; totalCases: number; activeCases: number } | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const drillDownData = useMemo(() => {
    if (!selectedDistrict) return null;
    return generateMockDistrictDrillDown(selectedDistrict);
  }, [selectedDistrict]);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  const handleDistrictClick = useCallback((district: string) => {
    setSelectedDistrict(district);
    setSelectedStation(null);
  }, []);

  const handleStationClick = useCallback((station: { name: string; totalCases: number; activeCases: number }) => {
    setSelectedStation(station);
  }, []);

  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "heatmap" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Crime Heatmap
          </button>
          <button
            onClick={() => setActiveTab("spatiotemporal")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "spatiotemporal" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Spatiotemporal Analysis
          </button>
        </div>

        {activeTab === "heatmap" && (
          <>
            {/* Main Map + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Map */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: "520px" }}>
                {loading ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading map data...</div>
                ) : (
                  <CrimeMap center={[77.5, 12.9]} zoom={7} onDistrictClick={handleDistrictClick} onMapReady={handleMapReady} />
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Filters Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Map Filters</h3>
                  <div className="space-y-3">
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20">
                      <option>All Crime Types</option>
                      <option>Crimes Against Body</option>
                      <option>Crimes Against Property</option>
                      <option>Cyber Crimes</option>
                      <option>Narcotics</option>
                    </select>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20">
                      <option>Last 30 Days</option>
                      <option>Last Quarter</option>
                      <option>Last Year</option>
                      <option>Custom Range</option>
                    </select>
                    <select
                      value={selectedDistrict || ""}
                      onChange={(e) => handleDistrictClick(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20"
                    >
                      <option value="">All Districts</option>
                      {[
                        "Bengaluru Urban", "Mysuru", "Hubballi-Dharwad", "Belagavi",
                        "Kalaburagi", "Mangaluru", "Shivamogga",
                      ].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Drill-down Panel */}
                {drillDownData && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 text-sm">{drillDownData.districtName}</h3>
                      <button
                        onClick={() => { setSelectedDistrict(null); setSelectedStation(null); }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {drillDownData.stations.map((s) => (
                        <button
                          key={s.stationName}
                          onClick={() => handleStationClick({ name: s.stationName, totalCases: s.totalCases, activeCases: s.activeCases })}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-800">{s.stationName}</p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-500">
                            <span>Cases: {s.totalCases.toLocaleString("en-IN")}</span>
                            <span>Active: {s.activeCases.toLocaleString("en-IN")}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Station Detail */}
                {selectedStation && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">{selectedStation.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">Total Cases: <strong>{selectedStation.totalCases.toLocaleString("en-IN")}</strong></p>
                      <p className="text-gray-600">Active Cases: <strong>{selectedStation.activeCases.toLocaleString("en-IN")}</strong></p>
                      <p className="text-gray-600">
                        Clearance: <strong className="text-green-600">
                          {selectedStation.totalCases > 0
                            ? Math.round(((selectedStation.totalCases - selectedStation.activeCases) / selectedStation.totalCases) * 100)
                            : 0}%
                        </strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Layers (rendered outside map div, add to map instance directly) */}
            {mapInstance && !loading && (
              <>
                <DistrictBoundaryLayer
                  map={mapInstance}
                  visible={true}
                  selectedDistrict={selectedDistrict}
                  onDistrictClick={handleDistrictClick}
                />
                <CrimeHeatmapLayer map={mapInstance} hotspots={hotspots} visible={true} />
                {drillDownData && (
                  <StationMarkers
                    map={mapInstance}
                    stations={drillDownData.stations.map((s) => ({
                      name: s.stationName,
                      lat: s.lat,
                      lng: s.lng,
                      totalCases: s.totalCases,
                      activeCases: s.activeCases,
                    }))}
                    onStationClick={(s) => handleStationClick(s)}
                  />
                )}
              </>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Data Points", value: hotspots.length.toLocaleString("en-IN"), color: "text-ksp-blue" },
                { label: "Districts Mapped", value: "15", color: "text-green-600" },
                { label: "Active Hotspots", value: hotspots.filter(h => h.incidentCount > 10).length.toLocaleString("en-IN"), color: "text-red-600" },
                { label: "Time Blocks", value: "6", color: "text-purple-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "spatiotemporal" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Spatiotemporal Crime Analysis</h3>
            <p className="text-sm text-gray-500 mb-4">
              Filter by time block and crime type to identify when and where specific crimes concentrate.
            </p>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
            ) : (
              <SpatiotemporalHeatmap hotspots={hotspots} />
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
