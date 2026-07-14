"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import type { CategoryBreakdown } from "@/types/analytics";

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
  height?: number;
}

const COLORS = [
  "#2C4A7C", "#C0392B", "#E67E22", "#27AE60",
  "#8E44AD", "#2980B9", "#F39C12", "#1ABC9C",
];

export function CategoryBreakdownChart({ data, height = 320 }: CategoryBreakdownChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        No category data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="crimeGroupName"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={55}
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value: number, name: string) => [
            `${value.toLocaleString("en-IN")} cases`,
            name,
          ]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-xs text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
