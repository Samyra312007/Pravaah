"use client";

import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

export default function MapsPage() {
  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Crime Heatmap</h3>
          <div className="h-[400px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <p className="font-medium">MapLibre GL Map</p>
              <p className="text-xs mt-1">District boundaries + crime heatmap overlay — Coming in Phase 3</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" disabled>
                <option>Crime Type</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" disabled>
                <option>Date Range</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" disabled>
                <option>District</option>
              </select>
            </div>
          </div>

          <div className="card p-5 lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-4">Station Details</h3>
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Station detail panel — Coming in Phase 3
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
