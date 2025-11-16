import type { Airport } from "@/types/airport";
import type { AirportsResponse, Pagination } from "@/types/api";

/**
 * Tipo de respuesta cruda de la API de Aviationstack
 */
interface RawAirportData {
  airport_name: string;
  iata_code: string;
  icao_code: string;
  latitude: string | number;
  longitude: string | number;
  geoname_id: string;
  timezone: string;
  gmt: string;
  phone_number: string | null;
  country_name: string;
  country_iso2: string;
  city_iata_code: string;
}

interface RawAviationstackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: RawAirportData[];
}

/**
 * Mapea un aeropuerto crudo de la API a nuestro formato
 * @param raw - Datos crudos del aeropuerto
 * @returns Aeropuerto mapeado
 */
export function mapAirport(raw: RawAirportData): Airport {
  return {
    id: raw.iata_code || raw.icao_code || `unknown-${Date.now()}`,
    airport_name: raw.airport_name || "Unknown Airport",
    iata_code: raw.iata_code || "",
    icao_code: raw.icao_code || "",
    latitude:
      typeof raw.latitude === "string"
        ? Number.parseFloat(raw.latitude)
        : raw.latitude,
    longitude:
      typeof raw.longitude === "string"
        ? Number.parseFloat(raw.longitude)
        : raw.longitude,
    geoname_id: raw.geoname_id || "",
    timezone: raw.timezone || "",
    gmt: raw.gmt || "",
    phone_number: raw.phone_number || "No disponible",
    country_name: raw.country_name || "",
    country_iso2: raw.country_iso2 || "",
    city_iata_code: raw.city_iata_code || "",
  };
}

/**
 * Mapea la paginación de la API
 * @param raw - Paginación cruda
 * @returns Paginación mapeada
 */
export function mapPagination(raw: {
  limit: number;
  offset: number;
  count: number;
  total: number;
}): Pagination {
  return {
    limit: raw.limit,
    offset: raw.offset,
    count: raw.count,
    total: raw.total,
  };
}

/**
 * Mapea la respuesta completa de aeropuertos
 * @param raw - Respuesta cruda de la API
 * @returns Respuesta mapeada
 */
export function mapAirportsResponse(
  raw: RawAviationstackResponse,
): AirportsResponse {
  return {
    pagination: mapPagination(raw.pagination),
    data: raw.data.map(mapAirport),
  };
}

/**
 * Mapea un único aeropuerto desde la respuesta de la API
 * @param raw - Respuesta cruda de la API
 * @returns Aeropuerto mapeado o null si no existe
 */
export function mapSingleAirport(
  raw: RawAviationstackResponse,
): Airport | null {
  if (!raw.data || raw.data.length === 0) {
    return null;
  }
  return mapAirport(raw.data[0]);
}

/**
 * Filtra aeropuertos duplicados basándose en el código IATA
 * @param airports - Lista de aeropuertos
 * @returns Lista sin duplicados
 */
export function removeDuplicateAirports(airports: Airport[]): Airport[] {
  const seen = new Set<string>();
  return airports.filter((airport) => {
    const key = airport.iata_code || airport.icao_code;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Ordena aeropuertos alfabéticamente por nombre
 * @param airports - Lista de aeropuertos
 * @returns Lista ordenada
 */
export function sortAirportsByName(airports: Airport[]): Airport[] {
  return [...airports].sort((a, b) =>
    a.airport_name.localeCompare(b.airport_name),
  );
}
