"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

/**
 * ThemeProvider - Aplica el tema al documento HTML
 *
 * Este componente se encarga de sincronizar el tema de Zustand
 * con la clase 'dark' del elemento HTML para que Tailwind CSS
 * aplique los estilos correctos.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
