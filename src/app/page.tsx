import { Search } from "lucide-react";
import { Suspense } from "react";
import { AirportsBar } from "@/components/client/airports/AirportsBar";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="container mx-auto px-4 py-16 text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text">
            SkyConnect Explorer
          </h1>

          {/* Input search */}
          <search className="my-8 block">
            <Suspense fallback={<div>Cargando...</div>}>
              <AirportsBar needSearchButton={false} />
            </Suspense>
          </search>
          {/* CTA Buttons */}
          <nav className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] bg-linear-to-r from-[#006AFF] to-[#00F9FF]"
            >
              <Search />
              Buscar
            </Button>
          </nav>
        </header>
      </section>
    </main>
  );
}
