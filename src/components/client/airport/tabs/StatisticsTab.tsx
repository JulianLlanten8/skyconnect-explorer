"use client";

import type { Airport } from "@/types/airport";
import { Badge } from "../../../ui/Badge";
import { Card, CardContent } from "../../../ui/Card";

interface StatisticsTabProps {
  airport: Airport;
}

export function StatisticsTab({ airport }: StatisticsTabProps) {
  // Estadísticas calculadas
  const hasIATA = !!airport.iata_code;
  const hasICAO = !!airport.icao_code;
  const hasPhone = airport.phone_number !== "No disponible";
  const hasTimezone = !!airport.timezone;

  const completeness = [hasIATA, hasICAO, hasPhone, hasTimezone].filter(
    Boolean,
  ).length;
  const completenessPercentage = (completeness / 4) * 100;

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Statistics</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Estadísticas
          </h3>
        </div>

        {/* Completitud de datos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completitud de Datos
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {completenessPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-linear-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all"
              style={{ width: `${completenessPercentage}%` }}
            />
          </div>
        </div>

        {/* Información disponible */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Información Disponible:
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <StatItem label="Código IATA" available={hasIATA} />
            <StatItem label="Código ICAO" available={hasICAO} />
            <StatItem label="Teléfono" available={hasPhone} />
            <StatItem label="Zona Horaria" available={hasTimezone} />
          </div>
        </div>

        {/* Coordenadas */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ubicación Geográfica:
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hemisferio
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {airport.latitude >= 0 ? "Norte" : "Sur"}
                {" / "}
                {airport.longitude >= 0 ? "Este" : "Oeste"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Distancia del Ecuador
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.abs(airport.latitude).toFixed(2)}°
              </p>
            </div>
          </div>
        </div>

        {/* País */}
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              País
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {airport.country_name}
            </p>
          </div>
          <Badge variant="info" className="font-mono">
            {airport.country_iso2}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, available }: { label: string; available: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
      {available ? (
        <svg
          className="w-5 h-5 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Available</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Not Available</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}
