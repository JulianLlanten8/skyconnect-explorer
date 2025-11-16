"use client";

import { cn } from "@/lib/utils/cn";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn("border-b border-gray-200 dark:border-gray-700", className)}
    >
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
            )}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  activeTab: string;
  tabId: string;
  className?: string;
}

export function TabPanel({
  children,
  activeTab,
  tabId,
  className,
}: TabPanelProps) {
  if (activeTab !== tabId) return null;

  return (
    <div className={cn("py-6", className)} role="tabpanel">
      {children}
    </div>
  );
}
