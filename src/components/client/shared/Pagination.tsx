"use client";

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

    const LEFT_ELL = "ELLIPSIS_LEFT";
    const RIGHT_ELL = "ELLIPSIS_RIGHT";

    const pages: (number | string)[] = [];

    pages.push(1);

    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) pages.push(LEFT_ELL);

    pages.push(...range(left, right));

    if (right < totalPages - 1) pages.push(RIGHT_ELL);

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page) =>
          typeof page === "number" ? (
            <button
              type="button"
              key={`page-${page}`}
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
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600",
              )}
            >
              {page}
            </button>
          ) : (
            <span
              key={String(page)}
              className="px-2 py-1 text-gray-500 dark:text-gray-400"
              aria-hidden
            >
              ...
            </span>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </Button>
    </div>
  );
}
