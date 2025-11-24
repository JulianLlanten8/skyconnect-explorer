"use client";

import { SearchX, TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { getAirportsByPageAction } from "@/actions/airports";
import { AirportCard } from "@/components/client/airport/AirportCard";
import { Pagination } from "@/components/client/shared/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAirportsStore } from "@/store/useAirportsStore";

interface AirportsListClientProps {
  search?: string;
  page: number;
  country?: string;
}

/**
 * Componente cliente que maneja la lista de aeropuertos con cache inteligente
 */
export function AirportsListClient({
  search,
  page,
  country,
}: AirportsListClientProps) {
  const {
    airports,
    pagination,
    isLoading,
    error,
    setAirports,
    setLoading,
    setError,
    setSearchQuery,
    setCurrentPage,
    setCountryFilter,
    getCacheKey,
    getFromCache,
    needsRefetch,
  } = useAirportsStore();

  // Flag para evitar llamadas duplicadas en React Strict Mode
  const fetchingRef = useRef<string | null>(null);

  // Sincronizar params con el store
  useEffect(() => {
    if (search !== undefined) setSearchQuery(search);
    setCurrentPage(page);
    if (country !== undefined) setCountryFilter(country);
  }, [search, page, country, setSearchQuery, setCurrentPage, setCountryFilter]);

  // Fetch de datos con cache inteligente
  useEffect(() => {
    const fetchAirports = async () => {
      // 1. Obtener clave de cache
      const cacheKey = getCacheKey();

      // 2. Evitar llamadas duplicadas
      if (fetchingRef.current === cacheKey) {
        console.log("⏭️ Saltando fetch duplicado:", cacheKey);
        return;
      }

      // 3. Verificar si hay datos en cache válidos
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        // Usar datos del cache sin hacer llamada a la API
        console.log("✅ Usando datos del cache:", cacheKey);
        setAirports(cachedData.airports, cachedData.pagination);
        return;
      }

      // 4. Si no hay cache válido, hacer fetch
      if (needsRefetch()) {
        console.log("🔄 Fetching desde API:", cacheKey);
        fetchingRef.current = cacheKey; // Marcar como fetching
        setLoading(true);

        try {
          const result = await getAirportsByPageAction({
            page,
            limit: 6,
            search,
            country,
          });

          if (result.success) {
            setAirports(result.data.data, result.data.pagination);
          } else {
            setError(result.error);
          }
        } catch (_err) {
          setError("Error al cargar los aeropuertos");
        } finally {
          fetchingRef.current = null; // Liberar flag
        }
      }
    };

    fetchAirports();
  }, [
    search,
    page,
    country,
    getCacheKey,
    getFromCache,
    needsRefetch,
    setAirports,
    setLoading,
    setError,
  ]);

  // Loading state
  if (isLoading && airports.length === 0) {
    return <AirportsLoading />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <TriangleAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Error al cargar aeropuertos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  // Empty state
  if (airports.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <SearchX className="w-8 h-8 text-gray-600 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No se encontraron aeropuertos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {search
            ? `No hay resultados para "${search}"`
            : "Intenta con otra búsqueda"}
        </p>
      </div>
    );
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 0;

  return (
    <section className="space-y-8">
      {/* Results Info */}
      <header className="flex items-center justify-between animate-slide-up">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pagination ? pagination.offset + 1 : 0}-
            {pagination
              ? Math.min(pagination.offset + pagination.limit, pagination.total)
              : 0}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pagination?.total || 0}
          </span>{" "}
          aeropuertos
        </p>
      </header>

      {/* Grid con animaciones escalonadas */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4 list-none">
        {airports.map((airport, index) => (
          <li key={airport.id}>
            <AirportCard airport={airport} index={index} />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 animate-slide-up delay-300">
          <Pagination currentPage={page} totalPages={totalPages} />
        </nav>
      )}
    </section>
  );
}

function AirportsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
