"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/catalyst";
import type { Hotspot } from "@/types/analytics";

export function useMapData() {
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
