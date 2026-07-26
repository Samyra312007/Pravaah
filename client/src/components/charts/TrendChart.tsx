"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TrendDataPoint } from "@/types/analytics";

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  showQuarterly?: boolean;
}

export function TrendChart({ data, height = 320, showQuarterly = false }: TrendChartProps) {
  const [hidden, setHidden] = useState(false);

  const displayData = useMemo(() => {
    if (!showQuarterly || !data.length) return data;

    const quarterly: Record<string, { year: number; quarter: number; label: string; count: number; months: number[] }> = {};
    for (const d of data) {
      const q = Math.ceil(d.month / 3);
      const key = `${d.year}-Q${q}`;
      if (!quarterly[key]) {
        quarterly[key] = { year: d.year, quarter: q, label: `Q${q} ${d.year}`, count: 0, months: [] };
      }
      quarterly[key].count += d.count;
      quarterly[key].months.push(d.month);
    }
    return Object.values(quarterly).sort((a, b) => a.year - b.year || a.quarter - b.quarter);
  }, [data, showQuarterly]);

  if (!displayData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        No trend data available
      </div>
    );
  }

  const mean = displayData.reduce((s, d) => s + d.count, 0) / displayData.length;
  const variance = displayData.reduce((s, d) => s + (d.count - mean) ** 2, 0) / displayData.length;
  const stdDev = Math.sqrt(variance);
  const threshold = mean + 2 * stdDev;

  const isAnomaly = (d: typeof displayData[0]): boolean => {
    return d.count > threshold;
  };

  const isQuarterly = showQuarterly && displayData.length > 0 && "quarter" in displayData[0];

  return (
    <div>
      {hidden && (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          Chart hidden
        </div>
      )}
      {!hidden && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setHidden(true)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200"
            >
              Hide
            </button>
            {isQuarterly && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Quarterly Aggregation</span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={displayData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                formatter={(value: number) => [value.toLocaleString("en-IN"), isQuarterly ? "Cases (quarterly)" : "Cases"]}
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
                dot={(props: { cx: number; cy: number; payload: TrendDataPoint & { quarter?: number } }) => {
                  const { cx, cy, payload } = props;
                  if (isAnomaly(payload)) {
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
        </div>
      )}
    </div>
  );
}
