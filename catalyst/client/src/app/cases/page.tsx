"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const caseMgmtRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

export default function CasesPage() {
  return (
    <RoleGuard roles={caseMgmtRoles}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by Crime No, Case No, or Name..."
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksp-blue/20 focus:border-ksp-blue w-80"
            />
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>All Districts</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>All Crime Types</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>All Statuses</option>
            </select>
          </div>
          <Link
            href="/cases/new"
            className="flex items-center gap-2 px-4 py-2 bg-ksp-navy text-white rounded-lg text-sm font-medium hover:bg-ksp-blue transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Case
          </Link>
        </div>

        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Case List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Crime No</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Case No</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Crime Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    No cases found. Use the search or filters above, or create a new case.
                    <br />
                    <span className="text-xs">Case data will be available after seeding in Phase 2</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
