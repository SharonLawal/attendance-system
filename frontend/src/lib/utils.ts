/**
 * @fileoverview Contextual execution boundary for frontend/src/lib/utils.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
