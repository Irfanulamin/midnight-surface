"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/*
 * Scroll-linked vertical drift.
 *
 * The child travels from +distance to -distance across the window pass, so it
 * moves slightly slower than the page and the section gains depth. Motion's
 * useScroll rather than a ScrollTrigger scrub: this is a plain linked value
 * with no pinning, and Lenis has already smoothed the scroll position feeding
 * it.
 *
 * The spring is what keeps it from feeling mechanical — the raw transform
 * tracks scroll exactly, which reads as the element being nailed to the
 * scrollbar. Softening it slightly is the whole effect.
 *
 * Default offset assumes the element enters from below the fold. Something
 * already on screen at load needs ["start start", "end start"], or it will sit
 * visibly displaced on first paint.
 */
export function Parallax({
  children,
  className,
  /** Peak displacement in px, applied in both directions. */
  distance = 60,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.3 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
