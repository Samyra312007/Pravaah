"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { Hotspot } from "@/types/analytics";

interface CrimeHeatmapLayerProps {
  map?: maplibregl.Map | null;
  hotspots: Hotspot[];
  visible?: boolean;
}

export function CrimeHeatmapLayer({ map, hotspots, visible = true }: CrimeHeatmapLayerProps) {
  const sourceId = "crime-heatmap";
  const layerId = "crime-heatmap-layer";
  const addedRef = useRef(false);

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || addedRef.current) return;

    if (!map.getSource(sourceId)) {
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: hotspots.map((h) => ({
          type: "Feature",
          properties: { count: h.incidentCount, crimeGroup: h.crimeGroupName, timeBlock: h.timeBlock, weight: Math.min(h.incidentCount / 20, 1) },
          geometry: { type: "Point", coordinates: [h.lngBucket, h.latBucket] },
        })),
      };

      map.addSource(sourceId, { type: "geojson", data: geojson });

      map.addLayer({
        id: layerId,
        type: "heatmap",
        source: sourceId,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": 0.8,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgba(103,169,207,0.4)",
            0.4, "rgb(209,229,240,0.6)",
            0.6, "rgb(253,219,199,0.8)",
            0.8, "rgb(239,138,98,0.9)",
            1, "rgb(178,24,43,1)",
          ],
          "heatmap-radius": 25,
          "heatmap-opacity": visible ? 0.7 : 0,
        },
      });

      addedRef.current = true;
    }

    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, "heatmap-opacity", visible ? 0.7 : 0);
    }

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
        addedRef.current = false;
      } catch { }
    };
  }, [map, hotspots, visible]);

  return null;
}
