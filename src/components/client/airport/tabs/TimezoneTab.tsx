"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatGMT, getLocalTime } from "@/lib/utils/formatters";
import type { Airport } from "@/types/airport";
import { Card, CardContent } from "../../../ui/Card";
import SubCard from "./cards/SubCard";
import { Subtitle } from "./titles/AirportSubtitle";

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
        <SubCard
          elements={
            <>
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/global.svg"
                  alt="Ícono de ubicación"
                  width={10}
                  height={10}
                  className="w-8 h-8"
                />
                <Subtitle value="Zona Horaria" className="text-2xl" />
              </div>

              <div className="space-y-4">
                {airport.timezone && (
                  <p className="text-lg font-bold my-2">
                    Zona Horaria:
                    <span className="text-sm ml-3">{airport.timezone}</span>
                  </p>
                )}

                {airport.gmt && (
                  <div>
                    <p className="text-lg font-bold mb-1">
                      GMT:
                      <span className="text-sm ml-3">
                        {formatGMT(airport.gmt)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </>
          }
        />

        <SubCard
          elements={
            <section>
              <div className="flex items-center gap-3">
                <Clock height={80} />
                <Subtitle value="Hora Local:" className="text-2xl" />
              </div>
              <p className="font-mono">{currentTime}</p>
            </section>
          }
        />
      </CardContent>
    </Card>
  );
}
