"use client";

import { useState, useEffect } from "react";
import type { DashboardKPI, TrendDataPoint, DistrictComparison, CategoryBreakdown, Hotspot, RiskScore, AnomalyData, SocioEconomicCorrelation } from "@/types/analytics";
import {
  mockKpis,
  generateMockTrends,
  generateMockDistrictComparison,
  generateMockCategoryBreakdown,
  generateMockHotspots,
  generateMockRiskScores,
  generateMockAnomalies,
  generateMockSocioEconomic,
} from "@/lib/mock/mockData";

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function useDashboard() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => { setKpis(mockKpis); setLoading(false); });
  }, []);

  return { kpis, loading };
}

export function useTrends() {
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => { setTrends(generateMockTrends()); setLoading(false); });
  }, []);

  return { trends, loading };
}

export function useDistrictComparison() {
  const [comparison, setComparison] = useState<DistrictComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => { setComparison(generateMockDistrictComparison()); setLoading(false); });
  }, []);

  return { comparison, loading };
}

export function useCategoryBreakdown() {
  const [data, setData] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => { setData(generateMockCategoryBreakdown()); setLoading(false); });
  }, []);

  return { data, loading };
}

export function useHotspots() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => { setHotspots(generateMockHotspots()); setLoading(false); });
  }, []);

  return { hotspots, loading };
}

export function useRiskScores() {
  const [scores, setScores] = useState<RiskScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => { setScores(generateMockRiskScores()); setLoading(false); });
  }, []);

  return { scores, loading };
}

export function useAnomalies() {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(500).then(() => { setAnomalies(generateMockAnomalies()); setLoading(false); });
  }, []);

  return { anomalies, loading };
}

export function useSocioEconomic() {
  const [data, setData] = useState<SocioEconomicCorrelation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(500).then(() => { setData(generateMockSocioEconomic()); setLoading(false); });
  }, []);

  return { data, loading };
}

export function useTrendAlerts() {
  const [alerts, setAlerts] = useState<Array<{ district: string; crimeType: string; increase: number; message: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(600).then(() => {
      setAlerts([
        { district: "Bengaluru Urban", crimeType: "Cyber Crimes", increase: 62, message: "62% spike compared to same period last year. 47 cases this month vs 29 avg." },
        { district: "Mysuru", crimeType: "Crimes Against Women", increase: 41, message: "41% increase. 34 cases reported this quarter vs 24 historical average." },
        { district: "Hubballi-Dharwad", crimeType: "Narcotics", increase: 28, message: "28% uptick in narcotics-related incidents. Potential new distribution network." },
      ]);
      setLoading(false);
    });
  }, []);

  return { alerts, loading };
}
