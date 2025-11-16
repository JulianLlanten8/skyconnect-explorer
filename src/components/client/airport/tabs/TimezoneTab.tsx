"use client";

import { useEffect, useState } from "react";
import { formatGMT, getLocalTime } from "@/lib/utils/formatters";
import type { Airport } from "@/types/airport";
import { Badge } from "../../../ui/Badge";
import { Card, CardContent } from "../../../ui/Card";

interface TimezoneTabProps {
  airport: Airport;
}

export function TimezoneTab({ airport }: TimezoneTabProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Actualizar la hora cada segundo
    const updateTime = () => {
      if (airport.gmt) {
        setCurrentTime(getLocalTime(airport.gmt));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [airport.gmt]);

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
            <title>Timezone Information</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Zona Horaria
          </h3>
        </div>

        <div className="space-y-4">
          {airport.timezone && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Zona Horaria:
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                {airport.timezone}
              </p>
            </div>
          )}

          {airport.gmt && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                GMT:
              </p>
              <Badge variant="info" className="text-base font-mono px-3 py-1">
                {formatGMT(airport.gmt)}
              </Badge>
            </div>
          )}
        </div>

        {currentTime && (
          <div className="mt-6 p-6 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Hora Local:
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">
              {currentTime}
            </p>
          </div>
        )}

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            La hora local se calcula automáticamente basándose en el offset GMT
            del aeropuerto. Ten en cuenta que algunos aeropuertos pueden
            observar horario de verano.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
