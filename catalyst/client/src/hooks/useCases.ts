"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/catalyst";
import type { CaseListItem, CaseDetail, CaseMaster } from "@/types/case";
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
      const endpoint = params?.q ? `/cases/search${qs}` : `/cases${qs}`;
      const res = await api.get<ApiResponse<CaseListItem[]>>(endpoint);
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

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<CaseDetail>>(`/cases/${id}`);
      if (res.status === "success" && res.data) setCaseDetail(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch case");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  return { caseDetail, loading, error, refetch: fetchDetail };
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

export function useCaseUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCase = async (id: string, data: Partial<CaseMaster>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put<ApiResponse<CaseMaster>>(`/cases/${id}`, data);
      if (res.status !== "success") throw new Error("Failed to update case");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update case");
    } finally {
      setLoading(false);
    }
  };

  return { updateCase, loading, error };
}

export function useDeleteCase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCase = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete<ApiResponse<{ message: string }>>(`/cases/${id}`);
      if (res.status !== "success") throw new Error("Failed to delete case");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete case");
    } finally {
      setLoading(false);
    }
  };

  return { deleteCase, loading, error };
}
