"use client";

import { type ReactNode, useEffect } from "react";
import { useStoreEffects } from "./hooks";

/**
 * Provider para inicializar los efectos de los stores
 * Debe envolver la aplicación en el layout
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  // Inicializar efectos
  useStoreEffects();

  // Prevenir hydration mismatch
  useEffect(() => {
    // Este efecto se ejecuta solo en el cliente
    // Útil para cualquier inicio adicional
  }, []);

  return <>{children}</>;
}
