import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SearchHistoryItem } from "@/types/airports";

/**
 * Estado del store de historial
 */
interface HistoryState {
  // Datos
  history: SearchHistoryItem[];

  // Acciones
  addToHistory: (query: string, resultsCount: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Consultas
  getRecentSearches: (limit?: number) => SearchHistoryItem[];
  getMostFrequent: (limit?: number) => Array<{ query: string; count: number }>;
  isInHistory: (query: string) => boolean;
  getHistoryCount: () => number;
}

/**
 * Máximo de items en el historial
 */
const MAX_HISTORY_ITEMS = 10;

/**
 * Store de historial de búsqueda
 */
export const useHistoryStore = create<HistoryState>()(
  devtools(
    persist(
      (set, get) => ({
        history: [],

        // Agregar búsqueda al historial
        addToHistory: (query, resultsCount) =>
          set(
            (state) => {
              const trimmedQuery = query.trim();

              // No agregar búsquedas vacías
              if (trimmedQuery.length === 0) return state;

              // Filtrar duplicados (mismo query)
              const filteredHistory = state.history.filter(
                (item) =>
                  item.query.toLowerCase() !== trimmedQuery.toLowerCase(),
              );

              // Crear nuevo item
              const newItem: SearchHistoryItem = {
                id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                query: trimmedQuery,
                timestamp: Date.now(),
                resultsCount,
              };

              // Agregar al inicio y limitar
              const updatedHistory = [newItem, ...filteredHistory].slice(
                0,
                MAX_HISTORY_ITEMS,
              );

              return {
                history: updatedHistory,
              };
            },
            false,
            "addToHistory",
          ),

        // Eliminar item del historial
        removeFromHistory: (id) =>
          set(
            (state) => ({
              history: state.history.filter((item) => item.id !== id),
            }),
            false,
            "removeFromHistory",
          ),

        // Limpiar todo el historial
        clearHistory: () =>
          set(
            {
              history: [],
            },
            false,
            "clearHistory",
          ),

        // Obtener búsquedas recientes
        getRecentSearches: (limit = 5) => {
          const { history } = get();
          return history
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
        },

        // Obtener búsquedas más frecuentes
        getMostFrequent: (limit = 5) => {
          const { history } = get();

          // Contar frecuencia de cada query
          const frequencyMap = new Map<string, number>();

          for (const item of history) {
            const normalizedQuery = item.query.toLowerCase();
            const count = frequencyMap.get(normalizedQuery) || 0;
            frequencyMap.set(normalizedQuery, count + 1);
          }

          // Convertir a array y ordenar
          return Array.from(frequencyMap.entries())
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        },

        // Verificar si una búsqueda está en el historial
        isInHistory: (query) => {
          const { history } = get();
          const normalizedQuery = query.trim().toLowerCase();
          return history.some(
            (item) => item.query.toLowerCase() === normalizedQuery,
          );
        },

        // Obtener cantidad de items en el historial
        getHistoryCount: () => {
          return get().history.length;
        },
      }),
      {
        name: "search-history-storage",
      },
    ),
    {
      name: "HistoryStore",
    },
  ),
);

/**
 * Selectores
 */
export const selectHistory = (state: HistoryState) => state.history;
export const selectHistoryCount = (state: HistoryState) =>
  state.getHistoryCount();
