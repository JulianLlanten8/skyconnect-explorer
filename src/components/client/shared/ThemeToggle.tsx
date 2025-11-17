"use client";

import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "../../ui/Button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="w-10 h-10 p-0"
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
}
