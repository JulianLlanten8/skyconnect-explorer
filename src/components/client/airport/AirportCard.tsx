"use client";

import Image from "next/image";
import Link from "next/link";
import type { Airport } from "@/types/airport";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";

interface AirportCardProps {
  airport: Airport;
}

export function AirportCard({ airport }: AirportCardProps) {
  return (
    <Link
      href={`/airport/${airport.iata_code || airport.icao_code}`}
      className="w-full"
    >
      <Card className="w-full hover:shadow-xl transition-shadow cursor-pointer relative  max-w-2xl overflow-hidden rounded-lg border-2 border-white bg-linear-to-br from-airport-card-bg to-airport-card-bg-end p-8">
        <CardHeader className="relative z-10 flex items-start justify-between">
          <section className="flex flex-col gap-4">
            <CardTitle className="text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium text-airport-text">
              {airport.airport_name}
            </CardTitle>
            <p className="text-2xl text-gray-500 dark:text-gray-400 mt-1">
              {airport.city_iata_code}, {airport.country_name}
            </p>
            {airport.iata_code && (
              <h1 className="text-3xl font-extrabold bg-linear-to-r from-[#006AFF] to-[#00F9FF]  inline-block text-transparent bg-clip-text">
                {airport.iata_code}
              </h1>
            )}
          </section>

          <div className="flex h-14 w-14 items-center justify-center">
            <Image
              className="mt-2 w-full h-auto object-cover rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              src="/icons/flight.svg"
              alt="Flight Icon"
              width={40}
              height={20}
              priority
            />
          </div>
        </CardHeader>

        <CardContent className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <Image
            src="/images/airplane.webp"
            alt="img-blur-shadow"
            width={400}
            height={200}
            className="object-fit h-full w-full"
            priority
          />
        </CardContent>
      </Card>
    </Link>
  );
}
