"use client";

import { useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { CrimeMap } from "@/components/maps/CrimeMap";
import type { RiskScore } from "@/types/analytics";

interface RiskScoreMapProps {
  scores: RiskScore[];
  loading?: boolean;
}

const DISTRICT_BOUNDS: Record<string, [[number, number], [number, number]]> = {
  "Bengaluru Urban": [[77.45, 12.82], [77.75, 13.05]],
  "Bengaluru Rural": [[77.30, 12.75], [77.60, 13.10]],
  "Mysuru": [[76.45, 12.10], [76.85, 12.60]],
  "Hubballi-Dharwad": [[74.90, 15.20], [75.20, 15.55]],
  "Belagavi": [[74.20, 15.60], [74.80, 16.10]],
  "Kalaburagi": [[76.60, 17.10], [77.40, 17.80]],
  "Mangaluru": [[74.70, 12.70], [75.00, 13.20]],
  "Shivamogga": [[75.00, 13.60], [75.70, 14.20]],
  "Ballari": [[76.50, 14.90], [77.20, 15.60]],
  "Davangere": [[75.40, 14.00], [76.10, 14.60]],
  "Tumakuru": [[76.80, 13.10], [77.30, 13.80]],
  "Udupi": [[74.60, 13.10], [74.90, 13.70]],
  "Hassan": [[75.70, 12.70], [76.40, 13.30]],
  "Raichur": [[76.60, 15.80], [77.40, 16.50]],
  "Kolar": [[77.80, 12.80], [78.30, 13.40]],
};

function getRiskColor(level: string): string {
  switch (level) {
    case "Low": return "#22c55e";
    case "Medium": return "#eab308";
    case "High": return "#f97316";
    case "Critical": return "#ef4444";
    default: return "#6b7280";
  }
}

function getRiskOpacity(level: string): number {
  switch (level) {
    case "Low": return 0.3;
    case "Medium": return 0.4;
    case "High": return 0.5;
    case "Critical": return 0.6;
    default: return 0.3;
  }
}

export function RiskScoreMap({ scores, loading }: RiskScoreMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    const scoreMap = new Map(scores.map((s) => [s.districtName, s]));

    map.on("load", () => {
      const features: GeoJSON.Feature[] = [];
      for (const [name, [[lng1, lat1], [lng2, lat2]]] of Object.entries(DISTRICT_BOUNDS)) {
        const score = scoreMap.get(name);
        const level = score?.riskLevel ?? "Low";
        features.push({
          type: "Feature",
          properties: {
            district: name,
            riskScore: score?.riskScore ?? 0,
            riskLevel: level,
            fillColor: getRiskColor(level),
            fillOpacity: getRiskOpacity(level),
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [lng1, lat1], [lng2, lat1], [lng2, lat2], [lng1, lat2], [lng1, lat1],
            ]],
          },
        });
      }

      const sourceId = "risk-choropleth";
      const layerId = "risk-choropleth-fill";
      const outlineId = "risk-choropleth-outline";

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features,
        });
        return;
      }

      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      map.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": ["get", "fillColor"],
          "fill-opacity": ["get", "fillOpacity"],
        },
      });

      map.addLayer({
        id: outlineId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#ffffff",
          "line-width": 1.5,
          "line-opacity": 0.6,
        },
      });

      map.on("click", layerId, (e) => {
        if (e.features?.[0]?.properties) {
          const props = e.features[0].properties;
          setSelectedDistrict(props.district);
          new maplibregl.Popup({ closeButton: true, closeOnClick: true })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family: system-ui; padding: 4px;">
                <p style="font-weight: 600; font-size: 14px; margin: 0 0 4px;">${props.district}</p>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">Risk Score: <strong>${props.riskScore}</strong></p>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">Level: <strong>${props.riskLevel}</strong></p>
              </div>
            `)
            .addTo(map);
        }
      });

      map.on("mouseenter", layerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }, [scores]);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        Loading risk scores...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <CrimeMap center={[76.5, 14.5]} zoom={6} onMapReady={handleMapReady} />
      </div>
      {selectedDistrict && (
        <p className="text-xs text-gray-500">Selected: {selectedDistrict}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500 opacity-40" /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-500 opacity-40" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-500 opacity-40" /> High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500 opacity-40" /> Critical
        </span>
      </div>
    </div>
  );
}
