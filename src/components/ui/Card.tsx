import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";
import type { CardProps } from "@/types/ui";

export function Card({
  className,
  variant = "default",
  children,
  ref,
  ...props
}: CardProps & { ref?: Ref<HTMLDivElement> }) {
  const variants = {
    default:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    outlined: "bg-transparent border-2 border-gray-300 dark:border-gray-600",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg p-6 transition-all",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold text-gray-900 dark:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn("text-gray-600 dark:text-gray-300", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn(
        "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
