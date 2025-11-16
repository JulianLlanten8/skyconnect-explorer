import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";
import type { InputProps } from "@/types/ui";

export function Input({
  className,
  label,
  error,
  helperText,
  ref,
  ...props
}: InputProps & { ref?: Ref<HTMLInputElement> }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2 rounded-lg border transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
