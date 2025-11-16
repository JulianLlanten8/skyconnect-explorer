"use client";

import { Grid3x2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/useUIStore";

export function ViewModeToggle() {
  const { viewMode, toggleViewMode } = useUIStore();

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Button
        variant={viewMode === "grid" ? "primary" : "ghost"}
        size="sm"
        onClick={() => viewMode !== "grid" && toggleViewMode()}
        className="px-3 py-1.5"
      >
        <Grid3x2 />
        <span className="ml-1.5 hidden sm:inline">Grid</span>
      </Button>

      <Button
        variant={viewMode === "map" ? "primary" : "ghost"}
        size="sm"
        onClick={() => viewMode !== "map" && toggleViewMode()}
        className="px-3 py-1.5"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Mapa</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="ml-1.5 hidden sm:inline">Mapa</span>
      </Button>
    </div>
  );
}
