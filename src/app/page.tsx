import { Search } from "lucide-react";
import { AirportsBar } from "@/components/client/airports/AirportsBar";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text">
              SkyConnect Explorer
            </h1>

            {/* Input search */}
            <div className="my-8">
              <AirportsBar needSearchButton={false} />
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] bg-linear-to-r from-[#006AFF] to-[#00F9FF]"
              >
                <Search />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Datos proporcionados por{" "}
            <a
              href="https://aviationstack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Aviationstack API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
