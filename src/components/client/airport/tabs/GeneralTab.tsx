"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { Airport } from "@/types/airport";
import { Card, CardContent } from "../../../ui/Card";

interface GeneralTabProps {
  airport: Airport;
}

export function GeneralTab({ airport }: GeneralTabProps) {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/location.svg"
            alt="Ícono de ubicación"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Información General
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Código IATA" value={airport.iata_code || "N/A"} />
          <InfoItem label="Código ICAO" value={airport.icao_code || "N/A"} />
          <InfoItem label="País" value={airport.country_name} />
          <InfoItem
            label="Ciudad IATA"
            value={airport.city_iata_code || "N/A"}
          />
          <InfoItem label="Teléfono" value={airport.phone_number} />
        </div>

        {airport.iata_code && airport.icao_code && (
          <div className="flex gap-2">
            <Badge variant="info" className="font-mono text-sm px-3 py-1">
              IATA: {airport.iata_code}
            </Badge>
            <Badge variant="default" className="font-mono text-sm px-3 py-1">
              ICAO: {airport.icao_code}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}:
      </p>
      <p className="text-base text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
