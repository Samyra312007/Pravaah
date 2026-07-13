"use client";

import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const reportRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "ANALYST"];

export default function ReportsPage() {
  return (
    <RoleGuard roles={reportRoles}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["District Intelligence Summary", "Trend Analysis Report", "Anomaly Report"].map((report) => (
            <div key={report} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-800">{report}</h3>
              <p className="text-sm text-gray-400 mt-1">Generate and download PDF report</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Last generated: —</span>
                <span className="text-ksp-blue font-medium">Generate</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Report History</h3>
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            Report generation and history — Coming in Phase 6
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
