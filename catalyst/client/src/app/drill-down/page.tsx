"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, MapPin, Building2, Shield } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

const DISTRICTS = [
  { id: 1, name: "Bengaluru Urban" }, { id: 2, name: "Bengaluru Rural" },
  { id: 3, name: "Mysuru" }, { id: 4, name: "Hubballi-Dharwad" },
  { id: 5, name: "Belagavi" }, { id: 6, name: "Kalaburagi" },
  { id: 7, name: "Mangaluru" }, { id: 8, name: "Shivamogga" },
  { id: 9, name: "Ballari" }, { id: 10, name: "Davangere" },
  { id: 11, name: "Tumakuru" }, { id: 12, name: "Udupi" },
  { id: 13, name: "Hassan" }, { id: 14, name: "Raichur" }, { id: 15, name: "Kolar" },
];

const STATIONS_BY_DISTRICT: Record<string, { id: number; name: string }[]> = {
  "Bengaluru Urban": [
    { id: 1, name: "Cubbon Park Police Station" }, { id: 2, name: "Wilson Garden Police Station" },
    { id: 11, name: "Whitefield Police Station" }, { id: 12, name: "Vijayanagar Police Station" },
  ],
  "Mysuru": [{ id: 3, name: "Mysuru North Police Station" }],
  "Hubballi-Dharwad": [{ id: 4, name: "Hubballi City Police Station" }],
  "Belagavi": [{ id: 5, name: "Belagavi Fort Police Station" }],
  "Ballari": [{ id: 6, name: "Ballari Town Police Station" }],
  "Mangaluru": [{ id: 7, name: "Mangaluru East Police Station" }],
  "Shivamogga": [{ id: 8, name: "Shivamogga City Police Station" }],
  "Kalaburagi": [{ id: 9, name: "Kalaburagi North Police Station" }],
  "Udupi": [{ id: 10, name: "Udupi Town Police Station" }],
};

type Level = "state" | "district" | "station" | "cases";

export default function DrillDownPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<{ id: number; name: string } | null>(null);

  const level: Level = selectedStation ? "cases" : selectedDistrict ? "station" : "district";

  const mockCases = selectedStation ? [
    { id: 101, crimeNo: "FIR-2026-001", type: "Murder", status: "Under Investigation", date: "12 Jul 2026" },
    { id: 102, crimeNo: "FIR-2026-002", type: "Robbery", status: "Chargesheet Filed", date: "10 Jul 2026" },
    { id: 103, crimeNo: "FIR-2026-003", type: "Cyber Crime", status: "Under Investigation", date: "08 Jul 2026" },
    { id: 104, crimeNo: "FIR-2026-004", type: "Assault", status: "Convicted", date: "05 Jul 2026" },
  ] : [];

  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => { setSelectedDistrict(null); setSelectedStation(null); }} className="flex items-center gap-1 hover:text-ksp-blue transition-colors">
            <Home className="h-4 w-4" /> State
          </button>
          {selectedDistrict && (
            <>
              <ChevronRight className="h-4 w-4" />
              <button onClick={() => { setSelectedStation(null); }} className="flex items-center gap-1 hover:text-ksp-blue transition-colors">
                <MapPin className="h-4 w-4" /> {selectedDistrict}
              </button>
            </>
          )}
          {selectedStation && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="flex items-center gap-1 text-gray-800 font-medium">
                <Building2 className="h-4 w-4" /> {selectedStation.name}
              </span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-ksp-blue" />
                Karnataka State
              </h3>
              {level === "district" && (
                <div className="space-y-1">
                  {DISTRICTS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDistrict(d.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedDistrict === d.name
                          ? "bg-ksp-blue/10 text-ksp-blue font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              )}
              {level === "station" && selectedDistrict && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 mb-2">Police Stations in {selectedDistrict}</p>
                  {(STATIONS_BY_DISTRICT[selectedDistrict] || []).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStation(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedStation?.id === s.id
                          ? "bg-ksp-blue/10 text-ksp-blue font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                  <button onClick={() => setSelectedDistrict(null)} className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-gray-600 mt-2">
                    ← Back to Districts
                  </button>
                </div>
              )}
              {level === "cases" && (
                <div className="text-xs text-gray-400">
                  <p>Showing cases for {selectedStation?.name}</p>
                  <button onClick={() => setSelectedStation(null)} className="text-ksp-blue hover:underline mt-2 inline-block">
                    ← Back to Stations
                  </button>
                </div>
              )}
            </div>

            {/* Level Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">Summary</h3>
              {level === "district" && (
                <p className="text-sm text-gray-500">{DISTRICTS.length} districts across Karnataka</p>
              )}
              {level === "station" && selectedDistrict && (
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">District: <strong>{selectedDistrict}</strong></p>
                  <p className="text-gray-600">Stations: <strong>{(STATIONS_BY_DISTRICT[selectedDistrict] || []).length}</strong></p>
                </div>
              )}
              {level === "cases" && (
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">Station: <strong>{selectedStation?.name}</strong></p>
                  <p className="text-gray-600">Total Cases: <strong>{mockCases.length}</strong></p>
                </div>
              )}
            </div>
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-3">
            {level === "district" && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a District</h2>
                <p className="text-sm text-gray-500">Choose a district from the left panel to view its police stations, or click below to view district-level analytics.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {DISTRICTS.slice(0, 6).map((d) => (
                    <button key={d.id} onClick={() => setSelectedDistrict(d.name)}
                      className="p-4 border border-gray-200 rounded-xl text-left hover:border-ksp-blue/30 hover:bg-ksp-blue/5 transition-colors"
                    >
                      <MapPin className="h-5 w-5 text-ksp-blue mb-2" />
                      <p className="font-medium text-gray-800 text-sm">{d.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {level === "station" && selectedDistrict && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{selectedDistrict}</h2>
                <p className="text-sm text-gray-500 mb-4">Select a police station to view its cases.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(STATIONS_BY_DISTRICT[selectedDistrict] || []).map((s) => (
                    <button key={s.id} onClick={() => setSelectedStation(s)}
                      className="p-4 border border-gray-200 rounded-xl text-left hover:border-ksp-blue/30 hover:bg-ksp-blue/5 transition-colors"
                    >
                      <Building2 className="h-5 w-5 text-ksp-blue mb-2" />
                      <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {level === "cases" && selectedStation && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">{selectedStation.name}</h2>
                  <p className="text-sm text-gray-400">{mockCases.length} cases found</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockCases.map((c) => (
                    <Link key={c.id} href={`/cases/${c.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{c.crimeNo}</p>
                        <p className="text-sm text-gray-500">{c.type} · {c.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.status === "Under Investigation" ? "bg-yellow-100 text-yellow-700" :
                          c.status === "Chargesheet Filed" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>{c.status}</span>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
