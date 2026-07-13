"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendAlertBadgeProps {
  count: number;
  severity?: "low" | "medium" | "high";
  onClick?: () => void;
}

export function TrendAlertBadge({ count, severity = "medium", onClick }: TrendAlertBadgeProps) {
  if (count === 0) return null;

  const colors = {
    low: "bg-yellow-50 text-yellow-700 border-yellow-200",
    medium: "bg-orange-50 text-orange-700 border-orange-200",
    high: "bg-red-50 text-red-700 border-red-200 animate-pulse",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80",
        colors[severity]
      )}
    >
      <AlertTriangle className="h-4 w-4" />
      <span>{count} Alert{count !== 1 ? "s" : ""}</span>
    </button>
  );
}
