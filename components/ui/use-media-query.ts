"use client";

import { useSyncExternalStore } from "react";

/*
 * Subscribe to a media query.
 *
 * useSyncExternalStore rather than reading matchMedia into state from an
 * effect: the query IS external state, so this is what the hook is for, and it
 * keeps the components using it free of the setState-in-effect lint.
 *
 * The server snapshot is always false. Anything gated on this therefore renders
 * its wide/default form on the server and corrects on hydration — fine for
 * progressive enhancement, but do not use it to gate content that must be right
 * in the initial HTML.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
