import Link from "next/link";
import { notFound } from "next/navigation";
import { getAirportDetailsAction } from "@/actions/airports";
import { AirportTabContent } from "@/components/client/airport/AirportTabContent";
import { AirportTabs } from "@/components/client/airport/AirportTabs";
import { BackButton } from "@/components/client/shared/BackButton";
import { ThemeToggle } from "@/components/client/shared/ThemeToggle";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function AirportDetailsPage({ params }: PageProps) {
  const { code } = await params;
  const result = await getAirportDetailsAction(code);

  if (!result.success || !result.data) {
    notFound();
  }

  const airport = result.data;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <section className="flex items-center gap-4">
            <BackButton fallbackUrl="/airports" />

            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
                SkyConnect Explorer
              </span>
            </Link>
          </section>

          <ThemeToggle />
        </nav>
      </header>

      {/* Main Content */}
      <article className="container mx-auto py-8">
        {/* Airport Header */}
        <header className="mb-8">
          <h1 className="text-8xl md:text-4xl font-extrabold  bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text text-center mb-5">
            {airport.airport_name}
          </h1>

          {/* Navigation Tabs */}
          <AirportTabs />
        </header>

        {/* Tab Content */}
        <section className="max-w-8xl">
          <AirportTabContent airport={airport} />
        </section>
      </article>
    </main>
  );
}

// Generar metadata dinámica
export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const result = await getAirportDetailsAction(code);

  if (!result.success || !result.data) {
    return {
      title: "Aeropuerto no encontrado",
    };
  }

  const airport = result.data;

  return {
    title: `${airport.airport_name} (${
      airport.iata_code || airport.icao_code
    })`,
    description: `Información detallada sobre ${airport.airport_name} en ${
      airport.city_iata_code
    }, ${airport.country_name}. Códigos: ${
      airport.iata_code || airport.icao_code
    }`,
  };
}
