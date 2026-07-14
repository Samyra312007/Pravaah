"use client";

import { MapPin, Calendar, Hash, FileText, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RepeatOffender } from "@/types/network";

interface RepeatOffenderProfileProps {
  offender: RepeatOffender;
  onCaseClick?: (caseId: number) => void;
}

export function RepeatOffenderProfile({ offender, onCaseClick }: RepeatOffenderProfileProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{offender.accusedName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="danger">{offender.caseCount} Cases</Badge>
            {offender.lastKnownLocation && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {offender.lastKnownLocation}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {offender.linkedCases.map((c) => (
          <button
            key={c.caseId}
            onClick={() => onCaseClick?.(c.caseId)}
            className="text-left p-3 rounded-lg border border-gray-200 hover:border-ksp-blue/30 hover:bg-ksp-blue/5 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-800">{c.crimeNo}</span>
              <Badge variant="warning" className="text-[10px]">{c.crimeGroup}</Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {c.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {c.registeredDate}
              </span>
            </div>
          </button>
        ))}
      </div>

      {offender.commonMO && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-medium text-amber-800">Modus Operandi Pattern</span>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed">{offender.commonMO}</p>
        </div>
      )}
    </div>
  );
}
