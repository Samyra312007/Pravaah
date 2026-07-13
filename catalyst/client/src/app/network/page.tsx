"use client";

import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

export default function NetworkPage() {
  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Network Graph</h3>
          <div className="h-[450px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <p className="font-medium">D3-force Network Graph</p>
              <p className="text-xs mt-1">Suspect, victim, case, and location connections — Coming in Phase 4</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Repeat Offenders</h3>
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Repeat offender profiles — Coming in Phase 4
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Hidden Associations</h3>
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Association detection results — Coming in Phase 4
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
