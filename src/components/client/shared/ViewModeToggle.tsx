"use client";

import { Grid3x2, Map as MapIcon } from "lucide-react";
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
        <MapIcon />
        <span className="ml-1.5 hidden sm:inline">Mapa</span>
      </Button>
    </div>
  );
}
