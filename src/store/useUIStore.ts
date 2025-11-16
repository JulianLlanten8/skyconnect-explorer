import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TabType, Theme } from "@/types/ui";

/**
 * Estado del store de UI
 */
interface UIState {
  // Tema
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  // Modales
  isSearchModalOpen: boolean;
  isFilterModalOpen: boolean;
  isHistoryModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  openHistoryModal: () => void;
  closeHistoryModal: () => void;
  closeAllModals: () => void;

  // Tabs (para detalles de aeropuerto)
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Loading states
  isPageLoading: boolean;
  setPageLoading: (isLoading: boolean) => void;

  // Notificaciones
  notification: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    isVisible: boolean;
  } | null;
  showNotification: (
    message: string,
    type: "success" | "error" | "info" | "warning",
  ) => void;
  hideNotification: () => void;

  // View mode (list/grid/map para aeropuertos)
  viewMode: "list" | "grid" | "map";
  setViewMode: (mode: "list" | "grid" | "map") => void;
  toggleViewMode: () => void;
}

/**
 * Store de UI
 */
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, _get) => ({
        // Estado inicial del tema
        theme: "light",

        toggleTheme: () =>
          set(
            (state) => ({
              theme: state.theme === "light" ? "dark" : "light",
            }),
            false,
            "toggleTheme",
          ),

        setTheme: (theme) =>
          set(
            {
              theme,
            },
            false,
            "setTheme",
          ),

        // Estado inicial de modales
        isSearchModalOpen: false,
        isFilterModalOpen: false,
        isHistoryModalOpen: false,

        openSearchModal: () =>
          set(
            {
              isSearchModalOpen: true,
              isFilterModalOpen: false,
              isHistoryModalOpen: false,
            },
            false,
            "openSearchModal",
          ),

        closeSearchModal: () =>
          set(
            {
              isSearchModalOpen: false,
            },
            false,
            "closeSearchModal",
          ),

        openFilterModal: () =>
          set(
            {
              isFilterModalOpen: true,
              isSearchModalOpen: false,
              isHistoryModalOpen: false,
            },
            false,
            "openFilterModal",
          ),

        closeFilterModal: () =>
          set(
            {
              isFilterModalOpen: false,
            },
            false,
            "closeFilterModal",
          ),

        openHistoryModal: () =>
          set(
            {
              isHistoryModalOpen: true,
              isSearchModalOpen: false,
              isFilterModalOpen: false,
            },
            false,
            "openHistoryModal",
          ),

        closeHistoryModal: () =>
          set(
            {
              isHistoryModalOpen: false,
            },
            false,
            "closeHistoryModal",
          ),

        closeAllModals: () =>
          set(
            {
              isSearchModalOpen: false,
              isFilterModalOpen: false,
              isHistoryModalOpen: false,
            },
            false,
            "closeAllModals",
          ),

        // Tab activo (para detalles de aeropuerto)
        activeTab: "general",

        setActiveTab: (tab) =>
          set(
            {
              activeTab: tab,
            },
            false,
            "setActiveTab",
          ),

        // Sidebar
        isSidebarOpen: false,

        toggleSidebar: () =>
          set(
            (state) => ({
              isSidebarOpen: !state.isSidebarOpen,
            }),
            false,
            "toggleSidebar",
          ),

        openSidebar: () =>
          set(
            {
              isSidebarOpen: true,
            },
            false,
            "openSidebar",
          ),

        closeSidebar: () =>
          set(
            {
              isSidebarOpen: false,
            },
            false,
            "closeSidebar",
          ),

        // Mobile menu
        isMobileMenuOpen: false,

        toggleMobileMenu: () =>
          set(
            (state) => ({
              isMobileMenuOpen: !state.isMobileMenuOpen,
            }),
            false,
            "toggleMobileMenu",
          ),

        closeMobileMenu: () =>
          set(
            {
              isMobileMenuOpen: false,
            },
            false,
            "closeMobileMenu",
          ),

        // Loading state global
        isPageLoading: false,

        setPageLoading: (isLoading) =>
          set(
            {
              isPageLoading: isLoading,
            },
            false,
            "setPageLoading",
          ),

        // Notificaciones
        notification: null,

        showNotification: (message, type) =>
          set(
            {
              notification: {
                message,
                type,
                isVisible: true,
              },
            },
            false,
            "showNotification",
          ),

        hideNotification: () =>
          set(
            {
              notification: null,
            },
            false,
            "hideNotification",
          ),

        // View mode
        viewMode: "grid",

        setViewMode: (mode) =>
          set(
            {
              viewMode: mode,
            },
            false,
            "setViewMode",
          ),

        toggleViewMode: () =>
          set(
            (state) => ({
              viewMode: state.viewMode === "grid" ? "list" : "grid",
            }),
            false,
            "toggleViewMode",
          ),
      }),
      {
        name: "ui-storage",
        partialize: (state) => ({
          // Solo persistir estos campos
          theme: state.theme,
          viewMode: state.viewMode,
          activeTab: state.activeTab,
        }),
      },
    ),
    {
      name: "UIStore",
    },
  ),
);

/**
 * Selectores
 */
export const selectTheme = (state: UIState) => state.theme;
export const selectActiveTab = (state: UIState) => state.activeTab;
export const selectViewMode = (state: UIState) => state.viewMode;
export const selectIsSearchModalOpen = (state: UIState) =>
  state.isSearchModalOpen;
export const selectIsFilterModalOpen = (state: UIState) =>
  state.isFilterModalOpen;
export const selectIsHistoryModalOpen = (state: UIState) =>
  state.isHistoryModalOpen;
export const selectNotification = (state: UIState) => state.notification;
export const selectIsPageLoading = (state: UIState) => state.isPageLoading;
