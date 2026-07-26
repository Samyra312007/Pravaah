"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface CrimeMapProps {
  center?: [number, number];
  zoom?: number;
  onDistrictClick?: (districtName: string) => void;
  onMapReady?: (map: maplibregl.Map) => void;
}

export function CrimeMap({ center = [77.5, 12.9], zoom = 7, onDistrictClick, onMapReady }: CrimeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center,
        zoom,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

      map.on("load", () => {
        mapRef.current = map;
        onMapReady?.(map);
      });

      map.on("error", (e) => {
        setMapError(`Map error: ${e.error?.message || "Unknown"}`);
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      setMapError(err instanceof Error ? err.message : "Failed to initialize map");
    }
  }, [center, zoom, onMapReady]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-6">
            <p className="text-red-500 font-medium mb-2">Map Error</p>
            <p className="text-gray-500 text-sm">{mapError}</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
