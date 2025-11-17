"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  className,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handlePageChange = (page: number) => {
    const next = Math.max(1, Math.min(totalPages, Math.floor(page)));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`?${params.toString()}`);
  };

  const range = (start: number, end: number) => {
    const out: number[] = [];
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  };

  const getPageNumbers = () => {
    if (!totalPages || totalPages < 1 || Number.isNaN(totalPages)) return [1];

    // Si son pocas páginas, devolver todas
    if (totalPages <= 7) return range(1, totalPages);

    const pages: number[] = [];
    // Siempre incluir la primera página para hacer el salto a la primera
    if (pages.length === 0) pages.push(1);

    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    pages.push(...range(left, right));

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
      aria-label="Paginación"
    >
      <Button
        variant="primary"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <ul className="flex gap-1 list-none">
        {getPageNumbers().map((page) => (
          <li key={`page-${page}`}>
            <button
              type="button"
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={
                currentPage === page
                  ? `Página ${page}, página actual`
                  : `Ir a la página ${page}`
              }
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                currentPage === page
                  ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  : "bg-blue-600 text-white",
              )}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <Button
        variant="primary"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </Button>
    </nav>
  );
}
