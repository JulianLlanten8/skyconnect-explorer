import { API_CONFIG } from "@/lib/utils/constants";

/**
 * Endpoints de la API de Aviationstack
 */
export const ENDPOINTS = {
  AIRPORTS: "/airports",
} as const;

/**
 * Construye la URL completa para un endpoint
 */
export function buildURL(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): string {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);

  // Agregar API key
  url.searchParams.append("access_key", API_CONFIG.API_KEY);

  // Agregar parámetros adicionales
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Parámetros disponibles para la búsqueda de aeropuertos
 * NOTA: La API gratuita solo soporta: iata_code, icao_code, country_iso2, limit, offset
 */
export interface AirportQueryParams {
  // Paginación
  limit?: number;
  offset?: number;

  // Filtros soportados en API gratuita
  iata_code?: string;
  icao_code?: string;
  country_iso2?: string;

  // Parámetros NO soportados en API gratuita (se usarán para filtrado en cliente)
  search?: string;
  city_iata_code?: string;
  airport_name?: string;
}

/**
 * Valida los parámetros de búsqueda
 */
export function validateQueryParams(
  params: AirportQueryParams,
): AirportQueryParams {
  const validated: AirportQueryParams = {};

  // Validar limit
  if (params.limit !== undefined) {
    validated.limit = Math.max(1, Math.min(100, params.limit));
  }

  // Validar offset
  if (params.offset !== undefined) {
    validated.offset = Math.max(0, params.offset);
  }

  // Copiar parámetros soportados por la API
  if (params.iata_code) validated.iata_code = params.iata_code.toUpperCase();
  if (params.icao_code) validated.icao_code = params.icao_code.toUpperCase();
  if (params.country_iso2)
    validated.country_iso2 = params.country_iso2.toUpperCase();

  // Guardar parámetros para filtrado en cliente
  if (params.search) validated.search = params.search.trim();
  if (params.city_iata_code)
    validated.city_iata_code = params.city_iata_code.toUpperCase();
  if (params.airport_name) validated.airport_name = params.airport_name.trim();

  return validated;
}
