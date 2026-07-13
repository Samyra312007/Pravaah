"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TrendDataPoint } from "@/types/analytics";

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export function TrendChart({ data, height = 320 }: TrendChartProps) {
  const [hidden, setHidden] = useState(false);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        No trend data available
      </div>
    );
  }

  const mean = data.reduce((s, d) => s + d.count, 0) / data.length;
  const variance = data.reduce((s, d) => s + (d.count - mean) ** 2, 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const threshold = mean + 2 * stdDev;

  return (
    <div>
      {hidden && (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          Chart hidden
        </div>
      )}
      {!hidden && (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [value.toLocaleString("en-IN"), "Cases"]}
            />
            <ReferenceLine
              y={threshold}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: "Alert Threshold (2σ)", position: "right", fill: "#ef4444", fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2C4A7C"
              strokeWidth={2}
              dot={(props: { cx: number; cy: number; payload: TrendDataPoint }) => {
                const { cx, cy, payload } = props;
                if (payload.isAnomaly) {
                  return (
                    <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="none">
                      <circle cx="6" cy="6" r="5" fill="#ef4444" stroke="#fff" strokeWidth={2} />
                    </svg>
                  );
                }
                return (
                  <circle cx={cx} cy={cy} r={3} fill="#2C4A7C" stroke="none" />
                );
              }}
              activeDot={{ r: 5, fill: "#2C4A7C", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
