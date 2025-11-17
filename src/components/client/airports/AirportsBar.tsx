"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHistoryStore } from "@/store/useHistoryStore";

interface Props {
  needSearchButton?: boolean;
}

export function AirportsBar({ needSearchButton = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isPending, startTransition] = useTransition();
  const { addToHistory } = useHistoryStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim().length === 0) {
      router.push("/airports");
      return;
    }

    startTransition(() => {
      const params = new URLSearchParams();
      params.set("search", query.trim());
      router.push(`/airports?${params.toString()}`);

      // Agregar al historial local (el servidor se encargará del resto)
      addToHistory(query.trim(), 0);
    });
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (e.target.value.trim().length === 0 && pathname !== "/") {
      setQuery("");
      router.push("/airports");
    }
  };

  return (
    <section className="w-full">
      <form onSubmit={handleSearch} id="airport-search">
        <div className="flex gap-2 w-full">
          <Input
            id="airport-search-input"
            type="search"
            placeholder="Buscar aeropuertos..."
            value={query}
            onChange={handlechange}
            className="flex-1 rounded-full bg-white dark:bg-gray-800"
            aria-label="Buscar aeropuertos por nombre o código"
          />

          {needSearchButton && (
            <Button
              className="shrink-0 bg-linear-to-r from-[#006AFF] to-[#00F9FF] hover:opacity-90 transition-opacity"
              type="submit"
              variant="primary"
              isLoading={isPending}
              disabled={isPending}
              size="md"
            >
              <Search className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
