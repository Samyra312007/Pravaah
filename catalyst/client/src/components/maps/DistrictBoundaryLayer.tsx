"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

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

interface DistrictBoundaryLayerProps {
  map?: maplibregl.Map | null;
  visible?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  selectedDistrict?: string | null;
  onDistrictClick?: (districtName: string) => void;
}

export function DistrictBoundaryLayer({
  map,
  visible = true,
  fillColor = "#2C4A7C",
  fillOpacity = 0.1,
  selectedDistrict,
  onDistrictClick,
}: DistrictBoundaryLayerProps) {
  const addedRef = useRef(false);
  const sourceId = "district-boundaries";
  const fillLayerId = "district-boundaries-fill";
  const lineLayerId = "district-boundaries-line";
  const highlightLayerId = "district-boundaries-highlight";

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || addedRef.current) return;

    const features: GeoJSON.Feature[] = [];
    for (const [name, [[lng1, lat1], [lng2, lat2]]] of Object.entries(DISTRICT_BOUNDS)) {
      features.push({
        type: "Feature",
        properties: { district: name },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lng1, lat1], [lng2, lat1], [lng2, lat2], [lng1, lat2], [lng1, lat1],
          ]],
        },
      });
    }

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": fillColor,
          "fill-opacity": visible ? fillOpacity : 0,
        },
      });

      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#ffffff",
          "line-width": 1.5,
          "line-opacity": 0.6,
        },
      });

      map.addLayer({
        id: highlightLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": "#F59E0B",
          "fill-opacity": 0.3,
        },
        filter: ["==", "district", ""],
      });

      map.on("click", fillLayerId, (e) => {
        if (e.features?.[0]?.properties?.district) {
          const district = e.features[0].properties.district;
          onDistrictClick?.(district);

          // Zoom to district
          const bounds = DISTRICT_BOUNDS[district];
          if (bounds) {
            const [[lng1, lat1], [lng2, lat2]] = bounds;
            map.fitBounds(
              [
                [lng1 - 0.1, lat1 - 0.1],
                [lng2 + 0.1, lat2 + 0.1],
              ],
              { padding: 50, duration: 800 }
            );
          }

          // Highlight clicked district
          map.setFilter(highlightLayerId, ["==", "district", district]);
        }
      });

      map.on("mouseenter", fillLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", fillLayerId, () => {
        map.getCanvas().style.cursor = "";
      });

      addedRef.current = true;
    }

    if (map.getLayer(fillLayerId)) {
      map.setPaintProperty(fillLayerId, "fill-opacity", visible ? fillOpacity : 0);
    }

    return () => {
      try {
        if (map.getLayer(highlightLayerId)) map.removeLayer(highlightLayerId);
        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
        addedRef.current = false;
      } catch { /* already removed */ }
    };
  }, [map, visible, fillColor, fillOpacity, onDistrictClick]);

  // Update highlight when selectedDistrict changes (e.g. cleared)
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    const hl = highlightLayerId;
    if (selectedDistrict) {
      if (map.getLayer(hl)) {
        map.setFilter(hl, ["==", "district", selectedDistrict]);
      }
    } else {
      if (map.getLayer(hl)) {
        map.setFilter(hl, ["==", "district", ""]);
      }
    }
  }, [map, selectedDistrict]);

  return null;
}
