"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/catalyst";
import type { NetworkGraph, RepeatOffender } from "@/types/network";

export function useNetworkConnections(entityId: string) {
  const [graph, setGraph] = useState<NetworkGraph | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<{ status: string; data: NetworkGraph }>(
          `/network/connections/${entityId}`
        );
        if (res.status === "success") setGraph(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [entityId]);

  return { graph, loading };
}

export function useRepeatOffenders() {
  const [offenders, setOffenders] = useState<RepeatOffender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get<{ status: string; data: RepeatOffender[] }>(
          "/network/repeat-offenders"
        );
        if (res.status === "success") setOffenders(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { offenders, loading };
}
