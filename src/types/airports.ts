import type { Airport } from "./airport";
import type { Pagination } from "./api";

// Respuesta de búsqueda de aeropuertos
export interface Airports {
  pagination: Pagination;
  data: Airport[];
}

// Estado de búsqueda
export interface SearchState {
  query: string;
  results: Airport[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
}

// Filtros de búsqueda
export interface SearchFilters {
  country?: string;
  city?: string;
  type?: "all" | "international" | "domestic";
}

// Historial de búsqueda
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultsCount: number;
}
