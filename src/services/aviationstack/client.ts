import { notFound } from "next/navigation";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/utils/constants";
import type { Airport } from "@/types/airport";
import type { AirportsResponse, ApiError } from "@/types/api";
import {
  type AirportQueryParams,
  buildURL,
  ENDPOINTS,
  validateQueryParams,
} from "./endpoints";
import {
  mapAirportsResponse,
  mapSingleAirport,
  removeDuplicateAirports,
} from "./mappers";

/**
 * Error personalizado para la API
 */
export class AviationstackError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
  ) {
    super(message);
    this.name = "AviationstackError";
  }
}

/**
 * Opciones de fetch usando Next.js 16 cache nativo
 */
interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Fetch con cache de Next.js 16 y manejo de errores
 */
async function fetchAPI<T>(url: string, options?: FetchOptions): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,

      cache: "force-cache",
      next: {
        revalidate: options?.revalidate ?? 3600,
        tags: options?.tags,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: {
          code: "UNKNOWN_ERROR",
          message: ERROR_MESSAGES.API_ERROR,
        },
      }));

      throw new AviationstackError(
        errorData.error.message || ERROR_MESSAGES.API_ERROR,
        errorData.error.code,
        response.status,
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new AviationstackError(ERROR_MESSAGES.TIMEOUT, "TIMEOUT");
    }

    if (error instanceof AviationstackError) {
      throw error;
    }

    throw new AviationstackError(ERROR_MESSAGES.NETWORK_ERROR, "NETWORK_ERROR");
  }
}

/**
 * Cliente optimizado para Next.js 16
 */
export const aviationstackClient = {
  async getAirports(
    params?: AirportQueryParams,
    options?: FetchOptions,
  ): Promise<AirportsResponse> {
    const validatedParams = params ? validateQueryParams(params) : {};
    const { search, ...supportedParams } = validatedParams;
    const url = buildURL(ENDPOINTS.AIRPORTS, supportedParams);

    const rawData = await fetchAPI<{
      pagination: {
        limit: number;
        offset: number;
        count: number;
        total: number;
      };
      data: Array<{
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
      }>;
    }>(url, {
      revalidate: options?.revalidate ?? 3600,
      tags: ["airports"],
    });

    const mapped = mapAirportsResponse(rawData);
    mapped.data = removeDuplicateAirports(mapped.data);

    // Filtrar en memoria si hay búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = mapped.data.filter(
        (airport) =>
          airport.airport_name.toLowerCase().includes(searchLower) ||
          airport.iata_code.toLowerCase().includes(searchLower) ||
          airport.icao_code.toLowerCase().includes(searchLower) ||
          airport.city_iata_code.toLowerCase().includes(searchLower) ||
          airport.country_name.toLowerCase().includes(searchLower),
      );

      return {
        ...mapped,
        data: filtered,
        pagination: {
          ...mapped.pagination,
          count: filtered.length,
          total: filtered.length,
        },
      };
    }

    return mapped;
  },

  async getAirportByIATA(
    iataCode: string,
    options?: FetchOptions,
  ): Promise<Airport | null> {
    const code = iataCode.toUpperCase();
    const url = buildURL(ENDPOINTS.AIRPORTS, { iata_code: code });

    const rawData = await fetchAPI<{
      pagination: {
        limit: number;
        offset: number;
        count: number;
        total: number;
      };
      data: Array<{
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
      }>;
    }>(url, {
      revalidate: options?.revalidate ?? 7200,
      tags: ["airports", `airport-${code}`],
    });

    return mapSingleAirport(rawData);
  },

  async getAirportByICAO(
    icaoCode: string,
    options?: FetchOptions,
  ): Promise<Airport | null> {
    const code = icaoCode.toUpperCase();
    const url = buildURL(ENDPOINTS.AIRPORTS, { icao_code: code });

    const rawData = await fetchAPI<{
      pagination: {
        limit: number;
        offset: number;
        count: number;
        total: number;
      };
      data: Array<{
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
      }>;
    }>(url, {
      revalidate: options?.revalidate ?? 7200,
      tags: ["airports", `airport-${code}`],
    });

    return mapSingleAirport(rawData);
  },

  async searchAirports(
    query: string,
    options?: FetchOptions,
  ): Promise<AirportsResponse> {
    // Códigos IATA (3 letras)
    if (query.length === 3) {
      try {
        const airport = await this.getAirportByIATA(query, options);
        if (airport) {
          return {
            pagination: { limit: 1, offset: 0, count: 1, total: 1 },
            data: [airport],
          };
        }
      } catch (_error) {
        // Continuar
      }
    }

    // Códigos ICAO (4 letras)
    if (query.length === 4) {
      try {
        const airport = await this.getAirportByICAO(query, options);
        if (airport) {
          return {
            pagination: { limit: 1, offset: 0, count: 1, total: 1 },
            data: [airport],
          };
        }
      } catch (_error) {
        return notFound();
      }
    }

    // Búsqueda general
    return this.getAirports(
      { search: query, limit: 100 },
      {
        revalidate: options?.revalidate ?? 1800,
        tags: ["search", `search-${query}`],
      },
    );
  },

  async getAirportsByCountry(
    countryCode: string,
    params?: Omit<AirportQueryParams, "country_iso2">,
    options?: FetchOptions,
  ): Promise<AirportsResponse> {
    return this.getAirports(
      { ...params, country_iso2: countryCode },
      {
        revalidate: options?.revalidate ?? 3600,
        tags: ["airports", `country-${countryCode}`],
      },
    );
  },
};

export default aviationstackClient;
