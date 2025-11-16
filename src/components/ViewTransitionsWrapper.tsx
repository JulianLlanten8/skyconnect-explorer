"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * View Transitions usando la API nativa del navegador
 * Compatible con Next.js 16 sin dependencias extra
 */
export function ViewTransitionsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Verificar si el navegador soporta View Transitions
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      // Ya Next.js maneja las transiciones automáticamente
      // Solo necesitamos esta clase para activar los estilos CSS
      document.documentElement.classList.add("view-transitions-enabled");
    }
  }, [pathname]);

  return <>{children}</>;
}
