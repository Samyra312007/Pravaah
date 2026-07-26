"use client";

import { AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendAlert {
  district: string;
  crimeType: string;
  increase: number;
  message: string;
}

interface TrendAlertIndicatorProps {
  alerts: TrendAlert[];
  onDismiss?: (index: number) => void;
}

export function TrendAlertIndicator({ alerts, onDismiss }: TrendAlertIndicatorProps) {
  if (!alerts.length) return null;

  const criticalCount = alerts.filter((a) => a.increase > 50).length;
  const severity = criticalCount > 0 ? "high" : alerts.length > 3 ? "medium" : "low";

  const severityStyles = {
    low: "border-yellow-200 bg-yellow-50",
    medium: "border-orange-200 bg-orange-50",
    high: "border-red-200 bg-red-50 animate-pulse",
  };

  const dotStyles = {
    low: "bg-yellow-500",
    medium: "bg-orange-500",
    high: "bg-red-500",
  };

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", severityStyles[severity])}>
      <div className="flex items-center gap-2">
        <div className={cn("w-2.5 h-2.5 rounded-full", dotStyles[severity])} />
        <AlertTriangle className={cn(
          "h-4 w-4",
          severity === "high" ? "text-red-600" : severity === "medium" ? "text-orange-600" : "text-yellow-600"
        )} />
        <span className={cn(
          "text-sm font-semibold",
          severity === "high" ? "text-red-800" : severity === "medium" ? "text-orange-800" : "text-yellow-800"
        )}>
          {alerts.length} Trend Alert{alerts.length > 1 ? "s" : ""}
          {criticalCount > 0 && ` (${criticalCount} Critical)`}
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-2 text-sm bg-white/60 rounded-lg p-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <span className="font-medium text-gray-800">{alert.district}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600">{alert.crimeType}</span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">{alert.message}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <TrendingUp className={cn(
                "h-3.5 w-3.5",
                alert.increase > 50 ? "text-red-500" : alert.increase > 30 ? "text-orange-500" : "text-yellow-500"
              )} />
              <span className={cn(
                "text-xs font-bold",
                alert.increase > 50 ? "text-red-600" : alert.increase > 30 ? "text-orange-600" : "text-yellow-600"
              )}>
                +{alert.increase}%
              </span>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(i)}
                className="text-gray-400 hover:text-gray-600 text-xs ml-1"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
