import { format } from "date-fns";

/**
 * Formatea una fecha a string legible
 * @param date - Fecha a formatear
 * @param pattern - Patrón de formato (default: "PPP")
 * @returns Fecha formateada
 */
export function formatDate(
  date: Date | string | number,
  pattern = "PPP",
): string {
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  return format(dateObj, pattern);
}

/**
 * Formatea un número con separadores de miles
 * @param num - Número a formatear
 * @returns Número formateado
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CO").format(num);
}

/**
 * Formatea coordenadas geográficas
 * @param lat - Latitud
 * @param lng - Longitud
 * @returns Coordenadas formateadas
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Formatea la zona horaria GMT
 * @param gmt - GMT offset (ej: "-5")
 * @returns GMT formateado (ej: "GMT-5")
 */
export function formatGMT(gmt: string): string {
  const offset = Number.parseInt(gmt, 10);
  const sign = offset >= 0 ? "+" : "";
  return `GMT${sign}${offset}`;
}

/**
 * Obtiene la hora local basada en el offset GMT
 * @param gmt - GMT offset (ej: "-5")
 * @returns Hora local formateada
 */
export function getLocalTime(gmt: string): string {
  const now = new Date();
  const offset = Number.parseInt(gmt, 10);
  const localTime = new Date(now.getTime() + offset * 60 * 60 * 1000);
  return format(localTime, "dd/MM/yyyy, HH:mm:ss");
}
