"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface Station {
  name: string;
  lat: number;
  lng: number;
  totalCases: number;
  activeCases: number;
}

interface StationMarkersProps {
  map?: maplibregl.Map | null;
  stations: Station[];
  onStationClick?: (station: Station) => void;
}

export function StationMarkers({ map, stations, onStationClick }: StationMarkersProps) {
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const el = document.createElement("div");
    el.className = "flex items-center justify-center w-8 h-8 rounded-full bg-ksp-navy text-white text-xs font-bold shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform";

    stations.forEach((station) => {
      const markerEl = el.cloneNode(true) as HTMLDivElement;
      markerEl.textContent = station.name.charAt(0);

      markerEl.addEventListener("click", () => onStationClick?.(station));

      const popup = new maplibregl.Popup({ offset: 25, closeButton: true }).setHTML(`
        <div style="font-family: system-ui; padding: 4px;">
          <p style="font-weight: 600; font-size: 14px; margin: 0 0 4px;">${station.name}</p>
          <p style="font-size: 12px; color: #6b7280; margin: 0;">Total Cases: <strong>${station.totalCases.toLocaleString("en-IN")}</strong></p>
          <p style="font-size: 12px; color: #6b7280; margin: 0;">Active: <strong>${station.activeCases.toLocaleString("en-IN")}</strong></p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([station.lng, station.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [map, stations, onStationClick]);

  return null;
}
