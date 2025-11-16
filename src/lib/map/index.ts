/**
 * Utilidades para trabajar con mapas de Leaflet en Next.js
 * 
 * Este módulo proporciona:
 * - loadLeaflet(): Carga Leaflet de forma segura
 * - useLeafletMap(): Hook para crear mapas fácilmente
 * - Helpers para iconos, popups, etc.
 */

export { loadLeaflet } from "./leaflet-loader";
export { useLeafletMap } from "./use-leaflet-map";
export {
  createAirportIcon,
  createPopupContent,
  addAreaCircle,
} from "./map-helpers";
