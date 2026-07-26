"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; value: string };
  color?: string;
  loading?: boolean;
}

export function KpiCard({ label, value, icon, trend, color, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    );
  }

  const TrendIcon = trend?.direction === "up" ? TrendingUp
    : trend?.direction === "down" ? TrendingDown
    : Minus;

  const trendColor = trend?.direction === "up" ? "text-green-600"
    : trend?.direction === "down" ? "text-red-600"
    : "text-gray-400";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className={cn("text-2xl font-bold", color || "text-gray-900")}>
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
          <span className={cn("text-xs font-medium", trendColor)}>{trend.value}</span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
