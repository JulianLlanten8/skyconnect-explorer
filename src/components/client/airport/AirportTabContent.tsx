"use client";

import { GeneralTab } from "@/components/client/airport/tabs/GeneralTab";
import { LocationTab } from "@/components/client/airport/tabs/LocationTab";
import { StatisticsTab } from "@/components/client/airport/tabs/StatisticsTab";
import { TimezoneTab } from "@/components/client/airport/tabs/TimezoneTab";
import { useUIStore } from "@/store/useUIStore";
import type { Airport } from "@/types/airport";

interface AirportTabContentProps {
  airport: Airport;
}

export function AirportTabContent({ airport }: AirportTabContentProps) {
  const { activeTab } = useUIStore();

  return (
    <div>
      {activeTab === "general" && <GeneralTab airport={airport} />}
      {activeTab === "location" && <LocationTab airport={airport} />}
      {activeTab === "timezone" && <TimezoneTab airport={airport} />}
      {activeTab === "statistics" && <StatisticsTab airport={airport} />}
    </div>
  );
}
