import { useEffect, useRef } from "react";
import { loadLeaflet } from "@/lib/map/leaflet-loader";

/**
 * Hook para manejar mapas de Leaflet en Next.js
 * 
 * Simplifica la creación de mapas manejando:
 * - Carga dinámica de Leaflet
 * - Referencias al DOM
 * - Cleanup automático
 * 
 * @param onMapReady - Callback que recibe (L, map) cuando el mapa está listo
 * @param deps - Dependencias para recrear el mapa
 */
export function useLeafletMap(
  onMapReady: (L: typeof import("leaflet"), map: any) => void | Promise<void>,
  deps: any[] = []
) {
  // Referencia al div donde se renderiza el mapa
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Referencia a la instancia del mapa (para limpieza)
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Validación 1: Solo ejecutar en el navegador
    if (typeof window === "undefined") {
      return;
    }

    // Validación 2: El contenedor debe existir
    if (!mapContainerRef.current) {
      return;
    }

    // Función para inicializar el mapa
    async function initializeMap() {
      // Paso 1: Cargar Leaflet
      const L = await loadLeaflet();

      // Paso 2: Limpiar mapa anterior si existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Paso 3: Crear el mapa
      const map = L.map(mapContainerRef.current!);

      // Paso 4: Añadir capa base de OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Paso 5: Guardar instancia para cleanup
      mapInstanceRef.current = map;

      // Paso 6: Ejecutar callback con L y map
      await onMapReady(L, map);
    }

    initializeMap();

    // Cleanup: Eliminar el mapa cuando el componente se desmonte
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, deps);

  return mapContainerRef;
}
