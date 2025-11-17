"use client";

import { Map as MapIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCoordinates } from "@/lib/utils/formatters";
import type { Airport } from "@/types/airport";
import { LeafletMap } from "../../map/LeafletMap";
import SubCard from "./cards/SubCard";
import { Subtitle } from "./titles/AirportSubtitle";

interface LocationTabProps {
  airport: Airport;
}

export function LocationTab({ airport }: LocationTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <SubCard
              elements={
                <>
                  <section className="mb-8 flex items-center gap-3">
                    <Image
                      src="/icons/location.svg"
                      alt="Ícono de ubicación"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                    <Subtitle value="Ubicación" className="text-4xl" />
                  </section>

                  <div>
                    <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Latitud:
                      <span className="text-md font-mono text-gray-900 dark:text-white ml-3">
                        {airport.latitude.toFixed(6)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Longitud:
                      <span className="text-md font-mono text-gray-900 dark:text-white ml-3">
                        {airport.longitude.toFixed(6)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Coordenadas:
                      <span className="text-md text-gray-900 dark:text-white ml-3">
                        {formatCoordinates(airport.latitude, airport.longitude)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {airport.geoname_id && (
                      <div>
                        <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-1">
                          ID Geoname:
                          <span className="text-lg font-mono text-gray-900 dark:text-white ml-2">
                            {airport.geoname_id}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </>
              }
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Suspense fallback={<MapSkeleton />}>
              <LeafletMap airport={airport} />
            </Suspense>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${airport.latitude},${airport.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Image
                  src="/icons/location.svg"
                  alt="Ícono de ubicación"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Abrir en Google Maps
              </a>

              <a
                href={`https://www.openstreetmap.org/?mlat=${airport.latitude}&mlon=${airport.longitude}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <MapIcon size={20} />
                Abrir en OpenStreetMap
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
