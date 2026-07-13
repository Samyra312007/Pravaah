"use client";

import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

export default function DashboardPage() {
  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Cases", value: "—", color: "text-ksp-blue" },
            { label: "Active Investigations", value: "—", color: "text-amber-600" },
            { label: "Clearance Rate", value: "—", color: "text-green-600" },
            { label: "Anomaly Flags", value: "—", color: "text-red-600" },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-5">
              <p className="kpi-label">{kpi.label}</p>
              <p className={`kpi-value ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Monthly Crime Trends</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Trend Chart (Recharts) — Coming in Phase 3
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Crime Category Breakdown</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Category Chart (Recharts) — Coming in Phase 3
            </div>
          </div>
        </div>

        {/* District Comparison */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">District Comparison</h3>
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            District Comparison Chart — Coming in Phase 3
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
