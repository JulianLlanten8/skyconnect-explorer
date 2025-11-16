import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";
import type { BadgeProps } from "@/types/ui";

export function Badge({
  className,
  variant = "default",
  children,
  ref,
  ...props
}: BadgeProps & { ref?: Ref<HTMLSpanElement> }) {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    success:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    warning:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    info: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
