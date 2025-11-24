"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cache } from "react";
import { PAGINATION } from "@/lib/utils/constants";
import {
  AviationstackError,
  aviationstackClient,
} from "@/services/aviationstack";
import {
  validateIATACode,
  validatePageNumber,
  validateSearchQuery,
} from "@/services/validation";
import type { Airport } from "@/types/airport";
import type { AirportsResponse } from "@/types/api";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Obtiene lista de aeropuertos con paginación
 * Guardada con React cache para evitar llamadas duplicadas
 */
export const getAirportsAction = cache(
  async (
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
  ): Promise<ActionResponse<AirportsResponse>> => {
    try {
      const { normalized: validPage } = validatePageNumber(page, 1000);
      const validLimit = Math.min(
        Math.max(limit, PAGINATION.MIN_LIMIT),
        PAGINATION.MAX_LIMIT,
      );
      const offset = (validPage - 1) * validLimit;

      const response = await aviationstackClient.getAirports(
        { limit: validLimit, offset },
        { revalidate: 3600 }, // 1 hora
      );

      return { success: true, data: response };
    } catch (error) {
      if (error instanceof AviationstackError) {
        return { success: false, error: error.message };
      }

      return {
        success: false,
        error:
          "Error al obtener los aeropuertos. Por favor, intenta nuevamente.",
      };
    }
  },
);

/**
 * Obtiene detalles de un aeropuerto
 * Guardada con React cache
 * Intenta buscar por IATA, ICAO y búsqueda general si no encuentra
 */
export const getAirportDetailsAction = cache(
  async (code: string): Promise<ActionResponse<Airport>> => {
    try {
      if (!code || code.trim().length === 0) {
        return {
          success: false,
          error: "El código del aeropuerto es requerido",
        };
      }

      const trimmedCode = code.trim().toUpperCase();
      let airport: Airport | null = null;

      // 1. Intentar búsqueda por IATA (3 letras)
      if (trimmedCode.length === 3 && validateIATACode(trimmedCode)) {
        try {
          airport = await aviationstackClient.getAirportByIATA(trimmedCode, {
            revalidate: 7200, // 2 horas
          });
        } catch (_error) {
          // Si falla IATA, continuar con ICAO
          console.log(`⚠️ No encontrado por IATA: ${trimmedCode}`);
        }
      }

      // 2. Si no encontró por IATA, intentar por ICAO (4 letras)
      if (!airport && trimmedCode.length === 4) {
        try {
          airport = await aviationstackClient.getAirportByICAO(trimmedCode, {
            revalidate: 7200,
          });
        } catch (_error) {
          console.log(`⚠️ No encontrado por ICAO: ${trimmedCode}`);
        }
      }

      // 3. Si aún no encontró, intentar búsqueda general
      if (!airport) {
        try {
          const searchResult = await aviationstackClient.searchAirports(
            trimmedCode,
            { revalidate: 7200 },
          );

          // Buscar coincidencia exacta en los resultados
          if (searchResult.data.length > 0) {
            airport =
              searchResult.data.find(
                (a) =>
                  a.iata_code?.toUpperCase() === trimmedCode ||
                  a.icao_code?.toUpperCase() === trimmedCode,
              ) || searchResult.data[0]; // Si no hay coincidencia exacta, tomar el primero
          }
        } catch (_error) {
          console.log(`⚠️ No encontrado en búsqueda general: ${trimmedCode}`);
        }
      }

      if (!airport) {
        return {
          success: false,
          error: `No se encontró el aeropuerto con código: ${trimmedCode}`,
        };
      }

      return { success: true, data: airport };
    } catch (error) {
      if (error instanceof AviationstackError) {
        return { success: false, error: error.message };
      }

      return {
        success: false,
        error:
          "Error al obtener los detalles del aeropuerto. Por favor, intenta nuevamente.",
      };
    }
  },
);

/**
 * Busca aeropuertos
 * Guardada con React cache
 */
export const searchAirportsAction = cache(
  async (
    query: string,
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
  ): Promise<ActionResponse<AirportsResponse>> => {
    try {
      const validation = validateSearchQuery(query);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Búsqueda inválida",
        };
      }

      const { normalized: validPage } = validatePageNumber(page, 1000);
      const validLimit = Math.min(
        Math.max(limit, PAGINATION.MIN_LIMIT),
        PAGINATION.MAX_LIMIT,
      );
      const offset = (validPage - 1) * validLimit;

      const response = await aviationstackClient.searchAirports(query.trim(), {
        revalidate: 1800, // 30 minutos
      });

      // Paginación manual
      const startIndex = offset;
      const endIndex = startIndex + validLimit;
      const paginatedData = response.data.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          data: paginatedData,
          pagination: {
            limit: validLimit,
            offset,
            count: paginatedData.length,
            total: response.data.length,
          },
        },
      };
    } catch (error) {
      if (error instanceof AviationstackError) {
        return { success: false, error: error.message };
      }

      return {
        success: false,
        error: "Error al buscar aeropuertos. Por favor, intenta nuevamente.",
      };
    }
  },
);

/**
 * Obtiene aeropuertos por país
 * Guardada con React cache
 */
export const getAirportsByCountryAction = cache(
  async (
    countryCode: string,
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
  ): Promise<ActionResponse<AirportsResponse>> => {
    try {
      if (!countryCode || countryCode.trim().length !== 2) {
        return {
          success: false,
          error:
            "Código de país inválido. Debe ser un código ISO2 de 2 letras.",
        };
      }

      const { normalized: validPage } = validatePageNumber(page, 1000);
      const validLimit = Math.min(
        Math.max(limit, PAGINATION.MIN_LIMIT),
        PAGINATION.MAX_LIMIT,
      );
      const offset = (validPage - 1) * validLimit;

      const response = await aviationstackClient.getAirportsByCountry(
        countryCode.toUpperCase(),
        { limit: validLimit, offset },
        { revalidate: 3600 },
      );

      return { success: true, data: response };
    } catch (error) {
      if (error instanceof AviationstackError) {
        return { success: false, error: error.message };
      }

      return {
        success: false,
        error:
          "Error al obtener aeropuertos por país. Por favor, intenta nuevamente.",
      };
    }
  },
);

/**
 * Revalida cache de aeropuertos (Next.js 16)
 */
export async function revalidateAirportsAction(
  path?: string,
): Promise<ActionResponse<null>> {
  try {
    if (path) {
      revalidatePath(path);
    } else {
      revalidateTag("airports", "page");
    }

    return { success: true, data: null };
  } catch (_error) {
    return { success: false, error: "Error al revalidar la caché" };
  }
}

/**
 * Revalida cache de aeropuerto específico (Next.js 16)
 */
export async function revalidateAirportDetailsAction(
  code: string,
): Promise<ActionResponse<null>> {
  try {
    const upperCode = code.toUpperCase();
    revalidateTag(`airport-${upperCode}`, "page");
    revalidatePath(`/airport/${code.toLowerCase()}`);

    return { success: true, data: null };
  } catch (_error) {
    return {
      success: false,
      error: "Error al revalidar la caché del aeropuerto",
    };
  }
}

/**
 * Helper para paginación
 * Guardada con React cache para evitar llamadas duplicadas
 */
export const getAirportsByPageAction = cache(
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
  }): Promise<ActionResponse<AirportsResponse>> => {
    try {
      const {
        page = 1,
        limit = PAGINATION.DEFAULT_LIMIT,
        search,
        country,
      } = params;

      if (search && search.trim().length > 0) {
        return searchAirportsAction(search, page, limit);
      }

      if (country && country.trim().length > 0) {
        return getAirportsByCountryAction(country, page, limit);
      }

      return getAirportsAction(page, limit);
    } catch (_error) {
      return {
        success: false,
        error: `Error al obtener aeropuertos. Por favor, intenta nuevamente.`,
      };
    }
  },
);
