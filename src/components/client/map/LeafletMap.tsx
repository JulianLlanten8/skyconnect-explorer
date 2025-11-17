"use client";
import type L from "leaflet";
import { useEffect, useRef } from "react";
import type { Airport } from "@/types/airport";

interface LeafletMapProps {
  airport: Airport;
  className?: string;
}

export function LeafletMap({ airport, className = "" }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

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
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
        ._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Limpiar mapa anterior si existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
      // Crear mapa
      const el = mapRef.current;
      if (!el) return;

      const map = L.map(el).setView([airport.latitude, airport.longitude], 10);

      // Guardar instancia
      mapInstanceRef.current = map;

      // Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map,
      );

      // Marcador
      L.marker([airport.latitude, airport.longitude])
        .addTo(map)
        .bindPopup(
          `<b>${airport.airport_name}</b><br>${airport.city_iata_code}`,
        )
        .openPopup();
    })();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [airport]);

  return <div ref={mapRef} className={`h-96 rounded-lg ${className}`} />;
}
