"use client";

import { useUIStore } from "@/store/useUIStore";
import { Tabs } from "../../ui/Tabs";

const tabs = [
  {
    id: "general",
    label: "General",
  },
  {
    id: "location",
    label: "Ubicación",
  },
  {
    id: "timezone",
    label: "Zona Horaria",
  },
  {
    id: "statistics",
    label: "Estadísticas",
  },
];

export function AirportTabs() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
    />
  );
}
