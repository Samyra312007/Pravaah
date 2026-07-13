"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { DistrictComparison } from "@/types/analytics";

interface DistrictComparisonChartProps {
  data: DistrictComparison[];
  height?: number;
}

export function DistrictComparisonChart({ data, height = 280 }: DistrictComparisonChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        No district data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="districtName"
          tick={{ fontSize: 10, fill: "#6b7280" }}
          tickLine={false}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend iconType="circle" iconSize={8} />
        <Bar dataKey="totalCases" name="Total Cases" fill="#2C4A7C" radius={[4, 4, 0, 0]} />
        <Bar dataKey="heinousCases" name="Heinous" fill="#C0392B" radius={[4, 4, 0, 0]} />
        <Bar dataKey="resolvedCases" name="Resolved" fill="#27AE60" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
