import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";
import type { SkeletonProps } from "@/types/ui";

export function Skeleton({
  className,
  variant = "rectangular",
  ref,
  ...props
}: SkeletonProps & { ref?: Ref<HTMLDivElement> }) {
  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full w-12 h-12",
    rectangular: "h-24 w-full",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
