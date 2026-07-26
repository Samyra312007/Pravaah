"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/catalyst";
import type { DashboardKPI, TrendDataPoint, DistrictComparison, Hotspot } from "@/types/analytics";

export function useDashboard() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<{ status: string; data: DashboardKPI }>("/analytics/dashboard");
        if (res.status === "success") setKpis(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { kpis, loading };
}

export function useTrends() {
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<{ status: string; data: TrendDataPoint[] }>("/analytics/trends");
        if (res.status === "success") setTrends(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { trends, loading };
}

export function useDistrictComparison() {
  const [comparison, setComparison] = useState<DistrictComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<{ status: string; data: DistrictComparison[] }>("/analytics/district-comparison");
        if (res.status === "success") setComparison(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { comparison, loading };
}

export function useHotspots() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<{ status: string; data: Hotspot[] }>("/analytics/hotspots");
        if (res.status === "success") setHotspots(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { hotspots, loading };
}
