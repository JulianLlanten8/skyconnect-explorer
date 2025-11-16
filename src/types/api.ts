import type { Airport } from "./airport";

// Respuesta de la API de Aviationstack
export interface AviationstackResponse<T> {
  pagination: Pagination;
  data: T[];
}

export interface Pagination {
  offset: number;
  limit: number;
  count: number;
  total: number;
}

// Tipo para la respuesta de airports
export type AirportsResponse = AviationstackResponse<Airport>;

// Tipo para la respuesta de un solo airport
export interface AirportResponse {
  data: Airport[];
}

// Parámetros de búsqueda
export interface SearchParams {
  search?: string;
  limit?: number;
  offset?: number;
  iata_code?: string;
  icao_code?: string;
  country_iso2?: string;
  city_iata_code?: string;
}

// Errores de la API
export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// Estado de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
