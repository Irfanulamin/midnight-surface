"use client";

import { motion, useReducedMotion } from "motion/react";

/*
 * Scroll-entry primitive.
 *
 * Motion's `whileInView` rather than GSAP ScrollTrigger: there is no pinning or
 * scrubbing here, just "appear once on enter", and ScrollTrigger would mean
 * shipping and registering a plugin for something the built-in viewport prop
 * already does. GSAP earns its place on pin/scrub work — this is not that.
 *
 * Animates transform and opacity only, so it stays on the compositor.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = "up" | "left" | "right" | "none";

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  left: { x: -28 },
  right: { x: 28 },
  none: {},
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.7,
  className,
  /** Fraction of the element that must be visible before it fires. */
  amount = 0.25,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  duration?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/*
 * Staggered container. Children must be <RevealItem>, which reads the parent's
 * variants — this is why the stagger works without hand-tuning a delay per
 * child, and why inserting or removing a card cannot desync the sequence.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offsets[direction] },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.65, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
