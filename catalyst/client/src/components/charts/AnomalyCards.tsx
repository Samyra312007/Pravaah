"use client";

import { AlertTriangle, Info, MapPin, Calendar } from "lucide-react";
import type { AnomalyData } from "@/types/analytics";

interface AnomalyCardsProps {
  anomalies: AnomalyData[];
  loading?: boolean;
}

export function AnomalyCards({ anomalies, loading }: AnomalyCardsProps) {
  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        Loading anomaly flags...
      </div>
    );
  }

  if (!anomalies.length) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <Info className="h-6 w-6 mx-auto mb-2" />
          <p>No anomalies detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
      {anomalies.map((a) => (
        <div
          key={a.caseId}
          className={`p-3 rounded-lg border ${
            a.isAnomaly
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 ${a.isAnomaly ? "text-red-500" : "text-gray-400"}`}>
                {a.isAnomaly ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${a.isAnomaly ? "text-red-800" : "text-gray-700"}`}>
                  Case #{a.caseId}
                  {a.isAnomaly && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                      Anomaly
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
              </div>
            </div>
            {a.isAnomaly && (
              <span className="text-xs font-medium text-red-600 whitespace-nowrap">
                Score: {(a.anomalyScore * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {a.district}
            </span>
            <span>{a.crimeHead}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {a.registeredDate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
