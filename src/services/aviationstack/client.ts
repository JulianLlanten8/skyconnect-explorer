import { notFound } from "next/navigation";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/utils/constants";
import { apiCache, createCacheKey } from "@/services/cache";
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
 * Opciones para las peticiones
 */
interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number;
  timeout?: number;
  skipCache?: boolean;
}

/**
 * Realiza una petición a la API con manejo de errores Y CACHE
 */
async function fetchAPI<T>(url: string, options?: FetchOptions): Promise<T> {
  const cacheKey = createCacheKey('api', { url });

  if (!options?.skipCache) {
    const cached = apiCache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }


  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options?.timeout || API_CONFIG.TIMEOUT,
  );

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: options?.cache || "force-cache",
      next: options?.revalidate
        ? { revalidate: options.revalidate }
        : undefined,
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

    const data: T = await response.json();
    apiCache.set(cacheKey, data, 60 * 60 * 1000);
    return data;
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

export const aviationstackClient = {
  async getAirports(
    params?: AirportQueryParams,
    options?: FetchOptions,
  ): Promise<AirportsResponse> {
    const validatedParams = params ? validateQueryParams(params) : {};
    const { search, ...supportedParams } = validatedParams;
    const cacheKey = createCacheKey('airports', supportedParams);

    if (!options?.skipCache) {
      const cached = apiCache.get<AirportsResponse>(cacheKey);
      if (cached) {

        if (search) {
          const searchLower = search.toLowerCase();
          const filtered = cached.data.filter((airport) =>
            airport.airport_name.toLowerCase().includes(searchLower) ||
            airport.iata_code.toLowerCase().includes(searchLower) ||
            airport.icao_code.toLowerCase().includes(searchLower) ||
            airport.city_iata_code.toLowerCase().includes(searchLower) ||
            airport.country_name.toLowerCase().includes(searchLower)
          );

          return {
            ...cached,
            data: filtered,
            pagination: {
              ...cached.pagination,
              count: filtered.length,
              total: filtered.length,
            },
          };
        }

        return cached;
      }
    }

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
    }>(url, options);

    const mapped = mapAirportsResponse(rawData);
    mapped.data = removeDuplicateAirports(mapped.data);
    apiCache.set(cacheKey, mapped, 60 * 60 * 1000);

    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = mapped.data.filter((airport) =>
        airport.airport_name.toLowerCase().includes(searchLower) ||
        airport.iata_code.toLowerCase().includes(searchLower) ||
        airport.icao_code.toLowerCase().includes(searchLower) ||
        airport.city_iata_code.toLowerCase().includes(searchLower) ||
        airport.country_name.toLowerCase().includes(searchLower)
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
    const cacheKey = createCacheKey('airport-iata', { code });

    // SOLO retornar cache si NO es null
    if (!options?.skipCache) {
      const cached = apiCache.get<Airport | null>(cacheKey);
      if (cached !== undefined && cached !== null) {
        return cached;
      }
    }

    const url = buildURL(ENDPOINTS.AIRPORTS, { iata_code: code });
    const rawData = await fetchAPI<{
      pagination: { limit: number; offset: number; count: number; total: number };
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
    }>(url, options);

    const airport = mapSingleAirport(rawData);

    // Solo cachear si encontramos algo
    if (airport) {
      apiCache.set(cacheKey, airport, 2 * 60 * 60 * 1000);
    } else {
    }

    return airport;
  },

  async getAirportByICAO(
    icaoCode: string,
    options?: FetchOptions,
  ): Promise<Airport | null> {
    const code = icaoCode.toUpperCase();
    const cacheKey = createCacheKey('airport-icao', { code });

    // SOLO retornar cache si NO es null
    if (!options?.skipCache) {
      const cached = apiCache.get<Airport | null>(cacheKey);
      if (cached !== undefined && cached !== null) {
        return cached;
      }
    }

    const url = buildURL(ENDPOINTS.AIRPORTS, { icao_code: code });
    const rawData = await fetchAPI<{
      pagination: { limit: number; offset: number; count: number; total: number };
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
    }>(url, options);

    const airport = mapSingleAirport(rawData);

    // Solo cachear si encontramos algo
    if (airport) {
      apiCache.set(cacheKey, airport, 2 * 60 * 60 * 1000);
    } else {
    }

    return airport;
  },

  async searchAirports(
    query: string,
    options?: FetchOptions,
  ): Promise<AirportsResponse> {
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
        return notFound();
      }
    }

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

    return this.getAirports({ search: query, limit: 100 }, options);
  },

  async getAirportsByCountry(
    countryCode: string,
    params?: Omit<AirportQueryParams, "country_iso2">,
    options?: FetchOptions,
  ): Promise<AirportsResponse> {
    return this.getAirports({ ...params, country_iso2: countryCode }, options);
  },

  clearCache() {
    apiCache.clear();
  },
};

export default aviationstackClient;
