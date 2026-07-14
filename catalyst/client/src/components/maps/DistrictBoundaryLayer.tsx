"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface DistrictBoundaryLayerProps {
  map?: maplibregl.Map | null;
  visible?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  selectedDistrict?: string | null;
  onDistrictClick?: (districtName: string) => void;
}

function computeBounds(coords: number[][][]): [[number, number], [number, number]] {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const ring of coords) {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [[minLng, minLat], [maxLng, maxLat]];
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
  const boundsMapRef = useRef<Map<string, [[number, number], [number, number]]>>(new Map());
  const sourceId = "district-boundaries";
  const fillLayerId = "district-boundaries-fill";
  const lineLayerId = "district-boundaries-line";
  const highlightLayerId = "district-boundaries-highlight";

  useEffect(() => {
    if (!map || !map.isStyleLoaded() || addedRef.current) return;

    fetch("/map-styles/karnataka-districts.geojson")
      .then((res) => res.json())
      .then((data: GeoJSON.FeatureCollection) => {
        if (addedRef.current || !map.isStyleLoaded()) return;

        boundsMapRef.current = new Map();
        for (const f of data.features) {
          const name = f.properties?.name || f.properties?.district;
          if (name && f.geometry.type === "Polygon") {
            boundsMapRef.current.set(name, computeBounds(f.geometry.coordinates));
          }
        }

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data,
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
            if (e.features?.[0]?.properties?.name) {
              const district = e.features[0].properties.name;
              onDistrictClick?.(district);

              const bounds = boundsMapRef.current.get(district);
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

              map.setFilter(highlightLayerId, ["==", "name", district]);
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
      })
      .catch((err) => console.error("Failed to load district GeoJSON:", err));

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

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    const hl = highlightLayerId;
    if (selectedDistrict) {
      if (map.getLayer(hl)) {
        map.setFilter(hl, ["==", "name", selectedDistrict]);
      }
    } else {
      if (map.getLayer(hl)) {
        map.setFilter(hl, ["==", "name", ""]);
      }
    }
  }, [map, selectedDistrict]);

  return null;
}
