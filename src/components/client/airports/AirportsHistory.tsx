"use client";

import { Delete, History } from "lucide-react";
import Link from "next/link";
import { useHistoryStore } from "@/store/useHistoryStore";
import { Badge } from "../../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";

export function AirportsHistory() {
  const { getRecentSearches, removeFromHistory } = useHistoryStore();
  const recentSearches = getRecentSearches(5);

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Búsquedas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Link
                href={`/airports?search=${encodeURIComponent(search.query)}`}
                className="flex-1 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <div className="flex items-center gap-2">
                  <History />
                  <span>{search.query}</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {search.resultsCount > 0 && (
                  <Badge variant="info" className="text-xs">
                    {search.resultsCount}
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={() => removeFromHistory(search.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Eliminar búsqueda"
                >
                  <Delete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
