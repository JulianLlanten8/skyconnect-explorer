import { House, Search, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <SearchX className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Aeropuerto no encontrado
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            El aeropuerto que buscas no existe o el código es incorrecto.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/airports">
            <Button size="lg" className="w-full sm:w-auto">
              <Search />
              Buscar Aeropuertos
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <House />
              Ir al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
