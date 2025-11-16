import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Airport } from "@/types/airport";
import type { Pagination } from "@/types/api";

/**
 * Estado del store de aeropuertos
 */
interface AirportsState {
  // Datos
  airports: Airport[];
  pagination: Pagination | null;
  selectedAirport: Airport | null;

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

  // Helpers
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
  isLoading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  limit: 6,
  countryFilter: null,
};

/**
 * Store de aeropuertos
 */
export const useAirportsStore = create<AirportsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Establecer aeropuertos con paginación
        setAirports: (airports, pagination) =>
          set(
            {
              airports,
              pagination,
              isLoading: false,
              error: null,
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
          // Solo persistir estos campos
          searchQuery: state.searchQuery,
          currentPage: state.currentPage,
          limit: state.limit,
          countryFilter: state.countryFilter,
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
