"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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
 */
export async function getAirportsAction(
  page = 1,
  limit = PAGINATION.DEFAULT_LIMIT,
): Promise<ActionResponse<AirportsResponse>> {
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
      error: "Error al obtener los aeropuertos. Por favor, intenta nuevamente.",
    };
  }
}

/**
 * Obtiene detalles de un aeropuerto
 */
export async function getAirportDetailsAction(
  code: string,
): Promise<ActionResponse<Airport>> {
  try {
    if (!code || code.trim().length === 0) {
      return {
        success: false,
        error: "El código del aeropuerto es requerido",
      };
    }

    const trimmedCode = code.trim().toUpperCase();
    let airport: Airport | null = null;

    if (trimmedCode.length === 3 && validateIATACode(trimmedCode)) {
      airport = await aviationstackClient.getAirportByIATA(trimmedCode, {
        revalidate: 7200, // 2 horas
      });
    } else if (trimmedCode.length === 4) {
      airport = await aviationstackClient.getAirportByICAO(trimmedCode, {
        revalidate: 7200,
      });
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
}

/**
 * Busca aeropuertos
 */
export async function searchAirportsAction(
  query: string,
  page = 1,
  limit = PAGINATION.DEFAULT_LIMIT,
): Promise<ActionResponse<AirportsResponse>> {
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
}

/**
 * Obtiene aeropuertos por país
 */
export async function getAirportsByCountryAction(
  countryCode: string,
  page = 1,
  limit = PAGINATION.DEFAULT_LIMIT,
): Promise<ActionResponse<AirportsResponse>> {
  try {
    if (!countryCode || countryCode.trim().length !== 2) {
      return {
        success: false,
        error: "Código de país inválido. Debe ser un código ISO2 de 2 letras.",
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
}

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
 */
export async function getAirportsByPageAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
}): Promise<ActionResponse<AirportsResponse>> {
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
  } catch (error) {
    return {
      success: false,
      error: `"Error al obtener aeropuertos. Por favor, intenta nuevamente.", ${error}`,
    };
  }
}
