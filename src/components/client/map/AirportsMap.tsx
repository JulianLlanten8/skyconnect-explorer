"use client";

import { useEffect, useRef } from "react";
import type { Airport } from "@/types/airport";

interface AirportsMapProps {
  airports: Airport[];
  className?: string;
}

export function AirportsMap({ airports, className = "" }: AirportsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || airports.length === 0) return;

    (async () => {
      // Cargar CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Importar Leaflet
      const L = await import("leaflet");

      // Fix iconos
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Limpiar mapa anterior si existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Crear mapa
      const map = L.map(mapRef.current!);

      // Guardar instancia
      mapInstanceRef.current = map;

      // Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      // Calcular bounds
      const bounds = L.latLngBounds(
        airports.map(a => [a.latitude, a.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });

      // Añadir marcadores
      airports.forEach(airport => {
        const marker = L.marker([airport.latitude, airport.longitude])
          .addTo(map)
          .bindPopup(`<b>${airport.airport_name}</b><br>${airport.city_iata_code}`);
        
        marker.on("click", () => {
          const code = airport.iata_code || airport.icao_code;
          if (code) window.location.href = `/airport/${code}`;
        });
      });
    })();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [airports]);

  if (airports.length === 0) return null;

  return <div ref={mapRef} className={`h-96 rounded-lg ${className}`} />;
}
