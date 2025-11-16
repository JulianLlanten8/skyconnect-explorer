import { SEARCH_LIMITS } from "@/lib/utils/constants";

import type { Airport } from "@/types/airport";
import type { AirportsResponse } from "@/types/api";

/**
 * Valida que un aeropuerto tenga los campos requeridos
 */
export function isValidAirport(airport: unknown): airport is Airport {
  if (!airport || typeof airport !== "object") return false;

  const a = airport as Record<string, unknown>;

  return (
    typeof a.airport_name === "string" &&
    a.airport_name.length > 0 &&
    (typeof a.iata_code === "string" || typeof a.icao_code === "string") &&
    typeof a.latitude === "number" &&
    typeof a.longitude === "number" &&
    !Number.isNaN(a.latitude) &&
    !Number.isNaN(a.longitude)
  );
}

/**
 * Valida que la respuesta de aeropuertos sea válida
 */
export function isValidAirportsResponse(
  response: unknown,
): response is AirportsResponse {
  if (!response || typeof response !== "object") return false;

  const r = response as Record<string, unknown>;

  // Validar estructura de paginación
  if (!r.pagination || typeof r.pagination !== "object") return false;
  const p = r.pagination as Record<string, unknown>;
  const hasPagination =
    typeof p.limit === "number" &&
    typeof p.offset === "number" &&
    typeof p.count === "number" &&
    typeof p.total === "number";

  // Validar estructura de datos
  const hasData = Array.isArray(r.data);

  if (!hasPagination || !hasData) return false;

  // Validar que cada elemento del array cumpla con la forma esperada
  const items = r.data as unknown[];
  const allItemsValid = items.every((item) => isValidAirport(item));

  return allItemsValid;
}

/**
 * Valida un término de búsqueda
 */
export function validateSearchQuery(query: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "El término de búsqueda no puede estar vacío",
    };
  }

  if (trimmed.length < SEARCH_LIMITS.MIN_QUERY_LENGTH) {
    return {
      isValid: false,
      error: `El término de búsqueda debe tener al menos ${SEARCH_LIMITS.MIN_QUERY_LENGTH} caracteres`,
    };
  }

  if (trimmed.length > SEARCH_LIMITS.MAX_QUERY_LENGTH) {
    return {
      isValid: false,
      error: `El término de búsqueda no puede exceder ${SEARCH_LIMITS.MAX_QUERY_LENGTH} caracteres`,
    };
  }

  return { isValid: true };
}

/**
 * Valida un código IATA
 */
export function validateIATACode(code: string): boolean {
  const regex = /^[A-Z]{3}$/;
  return regex.test(code.toUpperCase());
}

/**
 * Valida un código ICAO
 */
export function validateICAOCode(code: string): boolean {
  const regex = /^[A-Z]{4}$/;
  return regex.test(code.toUpperCase());
}

/**
 * Valida coordenadas geográficas
 */
export function validateCoordinates(
  lat: number,
  lng: number,
): { isValid: boolean; error?: string } {
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return {
      isValid: false,
      error: "Las coordenadas deben ser números válidos",
    };
  }

  if (lat < -90 || lat > 90) {
    return {
      isValid: false,
      error: "La latitud debe estar entre -90 y 90",
    };
  }

  if (lng < -180 || lng > 180) {
    return {
      isValid: false,
      error: "La longitud debe estar entre -180 y 180",
    };
  }

  return { isValid: true };
}

/**
 * Estandariza una cadena de texto para búsqueda, con el fin de mejorar resultados
 * Evita caracteres especiales y limita la longitud y posibles SQL Injections
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, " ") // Normalizar espacios
    .slice(0, SEARCH_LIMITS.MAX_QUERY_LENGTH);
}

/**
 * Valida el número de página para paginación
 */
export function validatePageNumber(
  page: number,
  totalPages: number,
): { isValid: boolean; normalized: number } {
  if (Number.isNaN(page) || page < 1) {
    return { isValid: true, normalized: 1 };
  }

  if (page > totalPages) {
    return { isValid: true, normalized: totalPages };
  }

  return { isValid: true, normalized: page };
}

/**
 * Filtra aeropuertos inválidos de una lista
 */
export function filterValidAirports(airports: unknown[]): Airport[] {
  return airports.filter(isValidAirport);
}
