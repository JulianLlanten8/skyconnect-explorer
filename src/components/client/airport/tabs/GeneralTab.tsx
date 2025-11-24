"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { Airport } from "@/types/airport";
import { Card, CardContent } from "../../../ui/Card";
import SubCard from "./cards/SubCard";
import { Subtitle } from "./titles/AirportSubtitle";

interface GeneralTabProps {
  airport: Airport;
}

export function GeneralTab({ airport }: GeneralTabProps) {
  return (
    <Card>
      <CardContent className="space-y-6">
        <SubCard
          elements={
            <>
              <header className="flex items-center gap-3 my-3">
                <Image
                  src="/icons/info-circle.svg"
                  alt="Ícono de información"
                  width={20}
                  height={20}
                  className="w-8 h-8"
                />
                <Subtitle value="Información General" className="text-4xl" />
              </header>

              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Código IATA:
                <span className="text-lg ml-3 font-normal text-gray-700 dark:text-gray-300">
                  {airport.iata_code || "N/A"}
                </span>
              </p>

              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Código ICAO:
                <span className="text-lg ml-3 font-normal text-gray-700 dark:text-gray-300">
                  {airport.icao_code || "N/A"}
                </span>
              </p>

              <p className="text-xl font-bold text-gray-900 dark:text-white">
                País:
                <span className="text-lg ml-3 font-normal text-gray-700 dark:text-gray-300">
                  {airport.country_name || "N/A"}
                </span>
              </p>

              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Ciudad IATA:
                <span className="text-lg ml-3 font-normal text-gray-700 dark:text-gray-300">
                  {airport.city_iata_code || "N/A"}
                </span>
              </p>

              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Teléfono:
                <span className="text-lg ml-3 font-normal text-gray-700 dark:text-gray-300">
                  {airport.phone_number || "N/A"}
                </span>
              </p>

              {airport.iata_code && airport.icao_code && (
                <footer className="flex gap-2 my-2">
                  <Badge variant="info" className="font-mono text-sm px-3 py-1">
                    IATA: {airport.iata_code}
                  </Badge>
                  <Badge
                    variant="default"
                    className="font-mono text-sm px-3 py-1"
                  >
                    ICAO: {airport.icao_code}
                  </Badge>
                </footer>
              )}
            </>
          }
        />
      </CardContent>
    </Card>
  );
}
