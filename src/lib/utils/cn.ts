import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina class names de Tailwind sin conflictos
 * @param inputs - Array de class names
 * @returns String con las clases combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
