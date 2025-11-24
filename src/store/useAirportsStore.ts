import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Airport } from "@/types/airport";
import type { Pagination } from "@/types/api";

/**
 * Cache TTL - 5 minutos
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Estructura de cache por clave
 */
interface CacheEntry {
  airports: Airport[];
  pagination: Pagination;
  timestamp: number;
}

/**
 * Estado del store de aeropuertos
 */
interface AirportsState {
  // Datos
  airports: Airport[];
  pagination: Pagination | null;
  selectedAirport: Airport | null;

  // Cache - Convertido a objeto para poder persistir
  cache: Record<string, CacheEntry>;
  cacheKey: string | null;
  lastFetchTime: number | null;

  // Estado de carga
  isLoading: boolean;
  error: string | null;

  // Filtros y búsqueda
  searchQuery: string;
  currentPage: number;
  limit: number;
  countryFilter: string | null;

  // Acciones
  setAirports: (airports: Airport[], pagination: Pagination) => void;
  addAirports: (airports: Airport[]) => void;
  clearAirports: () => void;

  setSelectedAirport: (airport: Airport | null) => void;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setCountryFilter: (country: string | null) => void;

  // Helpers de Cache
  getCacheKey: () => string;
  isCacheValid: (key: string) => boolean;
  getFromCache: (key: string) => CacheEntry | null;
  needsRefetch: () => boolean;
  clearCache: () => void;

  // Helpers de Paginación
  getTotalPages: () => number;
  hasNextPage: () => boolean;
  hasPreviousPage: () => boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;

  // Reset
  reset: () => void;
}

/**
 * Estado inicial
 */
const initialState = {
  airports: [],
  pagination: null,
  selectedAirport: null,
  cache: {},
  cacheKey: null,
  lastFetchTime: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  limit: 6,
  countryFilter: null,
};

/**
 * Store de aeropuertos con cache inteligente
 */
export const useAirportsStore = create<AirportsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Obtener clave de cache actual
        getCacheKey: () => {
          const { searchQuery, currentPage, limit, countryFilter } = get();
          return `${searchQuery || "all"}-${currentPage}-${limit}-${countryFilter || "all"}`;
        },

        // Verificar si el cache es válido
        isCacheValid: (key: string) => {
          const { cache } = get();
          const entry = cache[key];

          if (!entry) return false;

          const now = Date.now();
          return now - entry.timestamp < CACHE_TTL;
        },

        // Obtener datos del cache
        getFromCache: (key: string) => {
          const { cache, isCacheValid } = get();

          if (!isCacheValid(key)) return null;

          return cache[key] || null;
        },

        // Verificar si necesita refetch
        needsRefetch: () => {
          const { getCacheKey, getFromCache } = get();
          const currentKey = getCacheKey();
          const cachedData = getFromCache(currentKey);

          return cachedData === null;
        },

        // Limpiar cache
        clearCache: () =>
          set(
            {
              cache: {},
              cacheKey: null,
              lastFetchTime: null,
            },
            false,
            "clearCache",
          ),

        // Establecer aeropuertos con paginación y actualizar cache
        setAirports: (airports, pagination) =>
          set(
            (state) => {
              const cacheKey = state.getCacheKey();
              const timestamp = Date.now();

              return {
                airports,
                pagination,
                isLoading: false,
                error: null,
                cacheKey,
                lastFetchTime: timestamp,
                cache: {
                  ...state.cache,
                  [cacheKey]: {
                    airports,
                    pagination,
                    timestamp,
                  },
                },
              };
            },
            false,
            "setAirports",
          ),

        // Agregar aeropuertos a la lista existente
        addAirports: (newAirports) =>
          set(
            (state) => ({
              airports: [...state.airports, ...newAirports],
            }),
            false,
            "addAirports",
          ),

        // Limpiar aeropuertos
        clearAirports: () =>
          set(
            {
              airports: [],
              pagination: null,
            },
            false,
            "clearAirports",
          ),

        // Establecer aeropuerto seleccionado
        setSelectedAirport: (airport) =>
          set(
            {
              selectedAirport: airport,
            },
            false,
            "setSelectedAirport",
          ),

        // Establecer estado de carga
        setLoading: (isLoading) =>
          set(
            {
              isLoading,
            },
            false,
            "setLoading",
          ),

        // Establecer error
        setError: (error) =>
          set(
            {
              error,
              isLoading: false,
            },
            false,
            "setError",
          ),

        // Establecer query de búsqueda
        setSearchQuery: (searchQuery) =>
          set(
            {
              searchQuery,
              currentPage: 1, // Reset a página 1 al buscar
            },
            false,
            "setSearchQuery",
          ),

        // Establecer página actual
        setCurrentPage: (currentPage) =>
          set(
            {
              currentPage,
            },
            false,
            "setCurrentPage",
          ),

        // Establecer límite de resultados
        setLimit: (limit) =>
          set(
            {
              limit,
              currentPage: 1, // Reset a página 1 al cambiar límite
            },
            false,
            "setLimit",
          ),

        // Establecer filtro de país
        setCountryFilter: (countryFilter) =>
          set(
            {
              countryFilter,
              currentPage: 1, // Reset a página 1 al filtrar
            },
            false,
            "setCountryFilter",
          ),

        // Obtener total de páginas
        getTotalPages: () => {
          const { pagination, limit } = get();
          if (!pagination) return 0;
          return Math.ceil(pagination.total / limit);
        },

        // Verificar si hay página siguiente
        hasNextPage: () => {
          const { currentPage } = get();
          const totalPages = get().getTotalPages();
          return currentPage < totalPages;
        },

        // Verificar si hay página anterior
        hasPreviousPage: () => {
          const { currentPage } = get();
          return currentPage > 1;
        },

        // Ir a la siguiente página
        nextPage: () => {
          if (get().hasNextPage()) {
            set(
              (state) => ({
                currentPage: state.currentPage + 1,
              }),
              false,
              "nextPage",
            );
          }
        },

        // Ir a la página anterior
        previousPage: () => {
          if (get().hasPreviousPage()) {
            set(
              (state) => ({
                currentPage: state.currentPage - 1,
              }),
              false,
              "previousPage",
            );
          }
        },

        // Ir a una página específica
        goToPage: (page) => {
          const totalPages = get().getTotalPages();
          const validPage = Math.max(1, Math.min(page, totalPages));
          set(
            {
              currentPage: validPage,
            },
            false,
            "goToPage",
          );
        },

        // Reset del store
        reset: () => set(initialState, false, "reset"),
      }),
      {
        name: "airports-storage",
        partialize: (state) => ({
          // Persistir datos importantes incluyendo cache
          cache: state.cache,
          airports: state.airports,
          pagination: state.pagination,
          searchQuery: state.searchQuery,
          currentPage: state.currentPage,
          limit: state.limit,
          countryFilter: state.countryFilter,
          cacheKey: state.cacheKey,
          lastFetchTime: state.lastFetchTime,
        }),
      },
    ),
    {
      name: "AirportsStore",
    },
  ),
);

/**
 * Selectores para optimizar renders
 */
export const selectAirports = (state: AirportsState) => state.airports;
export const selectPagination = (state: AirportsState) => state.pagination;
export const selectSelectedAirport = (state: AirportsState) =>
  state.selectedAirport;
export const selectIsLoading = (state: AirportsState) => state.isLoading;
export const selectError = (state: AirportsState) => state.error;
export const selectSearchQuery = (state: AirportsState) => state.searchQuery;
export const selectCurrentPage = (state: AirportsState) => state.currentPage;
export const selectLimit = (state: AirportsState) => state.limit;
export const selectCountryFilter = (state: AirportsState) =>
  state.countryFilter;
export const selectNeedsRefetch = (state: AirportsState) =>
  state.needsRefetch();
