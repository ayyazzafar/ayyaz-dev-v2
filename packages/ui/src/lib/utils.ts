import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge.
 * clsx handles conditional classes, twMerge resolves Tailwind conflicts.
 *
 * @example
 * cn("p-4", isActive && "bg-blue-500", "text-white")
 * cn("p-2 p-4") // Returns "p-4" (twMerge resolves conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
