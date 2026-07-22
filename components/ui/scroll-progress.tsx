"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/*
 * Reading-progress rule pinned to the top of the viewport.
 *
 * The page is one long scroll with no chrome to anchor against, so this is the
 * only persistent signal of how far through it you are.
 *
 * scaleX on a full-width bar rather than an animated width — width would lay
 * out on every frame of every scroll, which is the most expensive way possible
 * to draw a 3px line.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Lenis already smooths the scroll position; the spring only takes the last
  // edge off so the bar settles rather than stopping dead.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : smoothed }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-yellow-strong"
    />
  );
}
