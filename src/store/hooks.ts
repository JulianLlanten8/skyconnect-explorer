import { useEffect } from "react";
import { getAirportsByPageAction } from "@/actions/airports";
import { getSearchHistoryAction } from "@/actions/search";
import { useAirportsStore } from "./useAirportsStore";
import { useHistoryStore } from "./useHistoryStore";
import { useUIStore } from "./useUIStore";

/**
 * Hook para sincronizar el store de aeropuertos con Server Actions
 */
export function useAirportsSync() {
  const {
    searchQuery,
    currentPage,
    limit,
    countryFilter,
    setAirports,
    setLoading,
    setError,
  } = useAirportsStore();

  useEffect(() => {
    const fetchAirports = async () => {
      setLoading(true);

      const result = await getAirportsByPageAction({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        country: countryFilter || undefined,
      });

      if (result.success) {
        setAirports(result.data.data, result.data.pagination);
      } else {
        setError(result.error);
      }
    };

    fetchAirports();
  }, [
    searchQuery,
    currentPage,
    limit,
    countryFilter,
    setAirports,
    setLoading,
    setError,
  ]);

  return useAirportsStore();
}

/**
 * Hook para sincronizar el store de historial con Server Actions
 */
export function useHistorySync() {
  const { history } = useHistoryStore();

  useEffect(() => {
    const syncHistory = async () => {
      const result = await getSearchHistoryAction();

      if (result.success && result.data.length > 0) {
        // Si hay historial en el servidor pero no en el cliente,
        // podríamos sincronizarlo aquí si fuera necesario
        // Por ahora, el historial local tiene prioridad
      }
    };

    // Solo sincronizar si el historial local está vacío
    if (history.length === 0) {
      syncHistory();
    }
  }, [history.length]);

  return useHistoryStore();
}

/**
 * Hook para manejar efectos del tema
 */
export function useThemeEffect() {
  const { theme } = useUIStore();

  useEffect(() => {
    // Aplicar clase al documentElement
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Actualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#000000" : "#ffffff",
      );
    }
  }, [theme]);
}

/**
 * Hook para cerrar modales con Escape
 */
export function useModalKeyboardShortcuts() {
  const { closeAllModals } = useUIStore();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeAllModals]);
}

/**
 * Hook para cerrar el mobile menu al cambiar de tamaño
 */
export function useMobileMenuResponsive() {
  const { closeMobileMenu, isMobileMenuOpen } = useUIStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);
}

/**
 * Hook combinado para inicializar todos los efectos
 */
export function useStoreEffects() {
  useThemeEffect();
  useModalKeyboardShortcuts();
  useMobileMenuResponsive();
}
