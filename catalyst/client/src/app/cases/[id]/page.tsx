"use client";

import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/layout/RoleGuard";
import type { Role } from "@/types/common";

const caseRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  return (
    <RoleGuard roles={caseRoles}>
      <div className="space-y-6">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Case #{caseId}</h3>
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
            Case detail view — Coming in Phase 2
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
