"use server";

import { cookies } from "next/headers";
import type { SearchHistoryItem } from "@/types/airports";
import type { ActionResponse } from "./airports";

/**
 * Nombre de la cookie para el historial
 */
const HISTORY_COOKIE_NAME = "search_history";

/**
 * Tiempo de expiración de la cookie (30 días)
 */
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 días en segundos

/**
 * Máximo de items en el historial
 */
const MAX_HISTORY_ITEMS = 10;

/**
 * Obtiene el historial de búsqueda desde las cookies
 * @returns Array de búsquedas anteriores
 */
export async function getSearchHistoryAction(): Promise<
  ActionResponse<SearchHistoryItem[]>
> {
  try {
    const cookieStore = await cookies();
    const historyJson = cookieStore.get(HISTORY_COOKIE_NAME)?.value;

    if (!historyJson) {
      return {
        success: true,
        data: [],
      };
    }

    const history: SearchHistoryItem[] = JSON.parse(historyJson);

    // Ordenar por timestamp descendente (más reciente primero)
    history.sort((a, b) => b.timestamp - a.timestamp);

    return {
      success: true,
      data: history,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al obtener el historial de búsqueda",
    };
  }
}

/**
 * Guarda una búsqueda en el historial
 * @param query - Término de búsqueda
 * @param resultsCount - Cantidad de resultados encontrados
 * @returns Item guardado
 */
export async function saveSearchHistoryAction(
  query: string,
  resultsCount: number,
): Promise<ActionResponse<SearchHistoryItem>> {
  try {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: "La búsqueda no puede estar vacía",
      };
    }

    const trimmedQuery = query.trim();
    const cookieStore = await cookies();

    // Obtener historial actual
    const currentHistoryResult = await getSearchHistoryAction();
    const currentHistory = currentHistoryResult.success
      ? currentHistoryResult.data
      : [];

    // Crear nuevo item
    const newItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      query: trimmedQuery,
      timestamp: Date.now(),
      resultsCount,
    };

    // Filtrar duplicados (mismo query)
    const filteredHistory = currentHistory.filter(
      (item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase(),
    );

    // Agregar nuevo item al inicio
    const updatedHistory = [newItem, ...filteredHistory];

    // Limitar a MAX_HISTORY_ITEMS
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    // Guardar en cookie
    cookieStore.set(HISTORY_COOKIE_NAME, JSON.stringify(limitedHistory), {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      data: newItem,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al guardar en el historial",
    };
  }
}

/**
 * Elimina un item del historial
 * @param id - ID del item a eliminar
 * @returns Historial actualizado
 */
export async function deleteSearchHistoryItemAction(
  id: string,
): Promise<ActionResponse<SearchHistoryItem[]>> {
  try {
    const cookieStore = await cookies();
    const currentHistoryResult = await getSearchHistoryAction();

    if (!currentHistoryResult.success) {
      return {
        success: false,
        error: "Error al obtener el historial",
      };
    }

    const currentHistory = currentHistoryResult.data;

    // Filtrar el item a eliminar
    const updatedHistory = currentHistory.filter((item) => item.id !== id);

    // Guardar en cookie
    cookieStore.set(HISTORY_COOKIE_NAME, JSON.stringify(updatedHistory), {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return {
      success: true,
      data: updatedHistory,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al eliminar del historial",
    };
  }
}

/**
 * Limpia todo el historial de búsqueda
 * @returns Confirmación de limpieza
 */
export async function clearSearchHistoryAction(): Promise<
  ActionResponse<null>
> {
  try {
    const cookieStore = await cookies();

    // Eliminar la cookie
    cookieStore.delete(HISTORY_COOKIE_NAME);

    return {
      success: true,
      data: null,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al limpiar el historial",
    };
  }
}

/**
 * Obtiene las búsquedas más frecuentes
 * @param limit - Cantidad de resultados
 * @returns Búsquedas más frecuentes
 */
export async function getMostFrequentSearchesAction(
  limit = 5,
): Promise<ActionResponse<{ query: string; count: number }[]>> {
  try {
    const historyResult = await getSearchHistoryAction();

    if (!historyResult.success) {
      return {
        success: false,
        error: "Error al obtener el historial",
      };
    }

    const history = historyResult.data;

    // Contar frecuencia de cada query
    const frequencyMap = new Map<string, number>();

    for (const item of history) {
      const normalizedQuery = item.query.toLowerCase();
      const count = frequencyMap.get(normalizedQuery) || 0;
      frequencyMap.set(normalizedQuery, count + 1);
    }

    // Convertir a array y ordenar por frecuencia
    const frequentSearches = Array.from(frequencyMap.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return {
      success: true,
      data: frequentSearches,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al obtener búsquedas frecuentes",
    };
  }
}

/**
 * Obtiene las búsquedas recientes (últimas N búsquedas)
 * @param limit - Cantidad de resultados
 * @returns Búsquedas recientes
 */
export async function getRecentSearchesAction(
  limit = 5,
): Promise<ActionResponse<SearchHistoryItem[]>> {
  try {
    const historyResult = await getSearchHistoryAction();

    if (!historyResult.success) {
      return {
        success: false,
        error: "Error al obtener el historial",
      };
    }

    const history = historyResult.data;

    // Ya están ordenadas por timestamp descendente
    const recentSearches = history.slice(0, limit);

    return {
      success: true,
      data: recentSearches,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al obtener búsquedas recientes",
    };
  }
}

/**
 * Verifica si una búsqueda está en el historial
 * @param query - Término de búsqueda
 * @returns true si existe en el historial
 */
export async function isInHistoryAction(
  query: string,
): Promise<ActionResponse<boolean>> {
  try {
    const historyResult = await getSearchHistoryAction();

    if (!historyResult.success) {
      return {
        success: false,
        error: "Error al verificar el historial",
      };
    }

    const history = historyResult.data;
    const normalizedQuery = query.trim().toLowerCase();

    const exists = history.some(
      (item) => item.query.toLowerCase() === normalizedQuery,
    );

    return {
      success: true,
      data: exists,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Error al verificar el historial",
    };
  }
}
