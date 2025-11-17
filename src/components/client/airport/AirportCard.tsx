"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Airport } from "@/types/airport";
import { Card, CardContent, CardHeader } from "../../ui/Card";

interface AirportCardProps {
  airport: Airport;
  index?: number;
}

export function AirportCard({ airport, index = 0 }: AirportCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={`/airport/${airport.iata_code || airport.icao_code}`}
        className="block w-full"
      >
        <Card className="w-full hover:shadow-xl transition-shadow cursor-pointer relative max-w-2xl overflow-hidden rounded-lg border-2 border-white bg-linear-to-br from-airport-card-bg to-airport-card-bg-end p-8 group">
          <CardHeader className="relative z-10 flex items-start justify-between">
            <header className="flex flex-col gap-4">
              <h2 className="text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium text-airport-text">
                {airport.airport_name}
              </h2>
              <address className="text-2xl text-gray-500 dark:text-gray-400 mt-1 not-italic">
                {airport.city_iata_code}, {airport.country_name}
              </address>
              {airport.iata_code && (
                <motion.strong
                  className="text-3xl font-extrabold bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text"
                  whileHover={{ scale: 1.05 }}
                >
                  {airport.iata_code}
                </motion.strong>
              )}
            </header>

            <motion.div
              className="flex h-14 w-14 items-center justify-center"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                className="mt-2 w-full h-auto object-cover rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                src="/icons/flight.svg"
                alt="Flight Icon"
                width={40}
                height={20}
                priority
              />
            </motion.div>
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
    </motion.article>
  );
}
