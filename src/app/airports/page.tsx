import { SearchX, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getAirportsByPageAction } from "@/actions/airports";
import { AirportCard } from "@/components/client/airport/AirportCard";
import { AirportsBar } from "@/components/client/airports/AirportsBar";
import { Pagination } from "@/components/client/shared/Pagination";
import { ThemeToggle } from "@/components/client/shared/ThemeToggle";
import { Skeleton } from "@/components/ui/Skeleton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    country?: string;
  }>;
}

export default async function AirportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const page = Number(params.page) || 1;
  const country = params.country;

  return (
    <main className="relative min-h-screen">
      <section
        className="absolute inset-0 bg-[url(/images/airport.webp)] bg-cover bg-fixed opacity-10"
        aria-hidden="true"
      />

      {/* Blue overlay */}
      <div
        className="absolute inset-0 bg-[#006AFF] opacity-10"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <h1 className="text-3xl xl:text-4xl bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text whitespace-nowrap">
                  SkyConnect Explorer
                </h1>
              </Link>

              {/* Search Bar - Más espacio en desktop */}
              <div className="flex-1 max-w-2xl">
                <AirportsBar />
              </div>

              <ThemeToggle />
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden space-y-4">
              {/* Primera fila: Logo y Toggle */}
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text">
                    SkyConnect Explorer
                  </h1>
                </Link>
                <ThemeToggle />
              </div>

              {/* Segunda fila: Search Bar completo */}
              <div className="w-full">
                <AirportsBar />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Results */}
            <section className="lg:col-span-4">
              <Suspense
                key={`${search}-${page}-${country}`}
                fallback={<AirportsLoading />}
              >
                <AirportsResults
                  search={search}
                  page={page}
                  country={country}
                />
              </Suspense>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

async function AirportsResults({
  search,
  page,
  country,
}: {
  search?: string;
  page: number;
  country?: string;
}) {
  const result = await getAirportsByPageAction({
    page,
    limit: 6,
    search,
    country,
  });

  if (!result.success) {
    return (
      <div className="text-center py-12 animate-scale-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <TriangleAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Error al cargar aeropuertos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{result.error}</p>
      </div>
    );
  }

  const { data: airports, pagination } = result.data;

  if (airports.length === 0) {
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

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <section className="space-y-8">
      {/* Results Info */}
      <header className="flex items-center justify-between animate-slide-up">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pagination.offset + 1}-
            {Math.min(pagination.offset + pagination.limit, pagination.total)}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pagination.total}
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
