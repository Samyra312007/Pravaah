"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/catalyst";
import type { CaseListItem, CaseDetail } from "@/types/case";
import type { PaginationParams, FilterParams, ApiResponse } from "@/types/common";

export function useCases(params?: PaginationParams & FilterParams) {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null) qs.set(key, String(val));
        });
      }
      const res = await api.get<ApiResponse<CaseListItem[]>>(`/cases?${qs.toString()}`);
      if (res.status === "success" && res.data) setCases(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  return { cases, loading, error, refetch: fetchCases };
}

export function useCaseDetail(id: string) {
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<ApiResponse<CaseDetail>>(`/cases/${id}`);
        if (res.status === "success" && res.data) setCaseDetail(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  return { caseDetail, loading };
}
