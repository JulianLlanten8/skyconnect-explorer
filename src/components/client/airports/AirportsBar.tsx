"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHistoryStore } from "@/store/useHistoryStore";

interface Props {
  needSearchButton?: boolean;
}

export function AirportsBar({ needSearchButton = true }: Props) {
  const router = useRouter();
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

  const handleClear = () => {
    setQuery("");
    router.push("/airports");
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar aeropuertos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full"
          />
        </div>

        {query && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            disabled={isPending}
          >
            Limpiar
          </Button>
        )}

        {needSearchButton && (
          <Button
            className="w-full sm:w-auto min-w-[200px] bg-linear-to-r from-[#006AFF] to-[#00F9FF]"
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={isPending}
          >
            <Search />
            Buscar
          </Button>
        )}
      </div>
    </form>
  );
}
