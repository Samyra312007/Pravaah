"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/catalyst";
import type { CaseListItem, CaseDetail } from "@/types/case";
import type { ApiResponse } from "@/types/common";

export function useCases(params?: Record<string, string | number>) {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const qs = params ? "?" + new URLSearchParams(
        Object.entries(params).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : "";
      const res = await api.get<ApiResponse<CaseListItem[]>>(`/cases${qs}`);
      if (res.status === "success" && res.data) {
        setCases(res.data);
        setTotal(res.meta?.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  return { cases, total, loading, error, refetch: fetchCases };
}

export function useCaseDetail(id: string) {
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<CaseDetail>>(`/cases/${id}`);
        if (res.status === "success" && res.data) setCaseDetail(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch case");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  return { caseDetail, loading, error };
}

export function useCreateCase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCase = async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ApiResponse<{ CaseMasterID: number }>>("/cases", data);
      if (res.status === "success" && res.data) return res.data.CaseMasterID;
      throw new Error("Failed to create case");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createCase, loading, error };
}
