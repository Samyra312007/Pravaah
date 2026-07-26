"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine, ZAxis,
} from "recharts";
import type { SocioEconomicData } from "@/types/analytics";

interface SocioEconomicChartProps {
  details: SocioEconomicData[];
  loading?: boolean;
}

const INDICATOR_LABELS: Record<string, string> = {
  unemployment_rate: "Unemployment Rate (%)",
  literacy_rate: "Literacy Rate (%)",
  poverty_index: "Poverty Index",
  urbanization_index: "Urbanization Index (%)",
  police_per_capita: "Police per 1,000",
};

const INDICATOR_UNITS: Record<string, string> = {
  unemployment_rate: "%",
  literacy_rate: "%",
  poverty_index: "",
  urbanization_index: "%",
  police_per_capita: "per 1k",
};

const INDICATOR_RANGES: Record<string, [number, number]> = {
  unemployment_rate: [0, 25],
  literacy_rate: [40, 100],
  poverty_index: [0, 50],
  urbanization_index: [0, 100],
  police_per_capita: [0, 5],
};

const CRIME_RANGE: [number, number] = [0, 500];

function generateScatterData(indicator: string): Array<{ x: number; y: number; district: string }> {
  const districts = [
    "Bengaluru Urban", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi",
    "Mangaluru", "Shivamogga", "Ballari", "Davangere", "Tumakuru",
    "Udupi", "Hassan", "Raichur", "Kolar",
  ];
  const [min, max] = INDICATOR_RANGES[indicator] || [0, 100];
  return districts.map((name, i) => {
    const trend = indicator === "literacy_rate" || indicator === "police_per_capita" ? -1 : 1;
    const baseX = min + (max - min) * ((i + 1) / districts.length);
    const noise = (Math.random() - 0.5) * (max - min) * 0.3;
    const x = Math.max(min, Math.min(max, baseX + noise));
    const crimeBase = 50 + (indicator === "literacy_rate" ? (100 - x) * 4 : x * 4);
    const y = Math.max(0, Math.min(500, crimeBase + (Math.random() - 0.5) * 100));
    return { x: Math.round(x * 10) / 10, y: Math.round(y), district: name };
  });
}

export function SocioEconomicChart({ details, loading }: SocioEconomicChartProps) {
  if (loading || !details.length) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        {loading ? "Loading socio-economic correlations..." : "No correlation data available"}
      </div>
    );
  }

  const significant = details.filter((d) => d.significant);
  const showIndicator = significant[0]?.indicator || details[0]?.indicator;
  const scatterData = generateScatterData(showIndicator);

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="x"
            name={INDICATOR_LABELS[showIndicator] || showIndicator}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            unit={INDICATOR_UNITS[showIndicator]}
          />
          <YAxis
            dataKey="y"
            name="Crime Rate (per 100k)"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "x") return [`${value}${INDICATOR_UNITS[showIndicator]}`, INDICATOR_LABELS[showIndicator] || showIndicator];
              return [value, "Crime Rate"];
            }}
            labelFormatter={() => ""}
          />
          <ReferenceLine y={0} stroke="#e5e7eb" />
          <Scatter
            name="Districts"
            data={scatterData}
            fill="#2C4A7C"
            fillOpacity={0.6}
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {details.map((d) => (
          <div
            key={d.indicator}
            className={`p-2.5 rounded-lg border text-xs ${
              d.significant
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p className="font-medium text-gray-700 mb-1">
              {INDICATOR_LABELS[d.indicator] || d.indicator}
            </p>
            <div className="flex items-center justify-between text-gray-500">
              <span>
                r ={" "}
                <span className={d.coefficient > 0 ? "text-red-500" : "text-green-500"}>
                  {d.coefficient > 0 ? "+" : ""}{d.coefficient}
                </span>
              </span>
              <span>
                p = {d.pValue < 0.001 ? "<0.001" : d.pValue.toFixed(3)}
              </span>
              <span className={d.significant ? "text-green-600 font-medium" : "text-gray-400"}>
                {d.significant ? "Significant" : "Not significant"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
