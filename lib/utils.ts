import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditional class names, with later Tailwind utilities winning over earlier
 * conflicting ones. Required by the shadcn components under `components/ui`;
 * the hand-written primitives there predate it and compose strings directly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
