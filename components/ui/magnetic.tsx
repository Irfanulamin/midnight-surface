"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { useMediaQuery } from "@/components/ui/use-media-query";

/*
 * Magnetic pointer attraction.
 *
 * The wrapped element leans toward the cursor while it is over it and springs
 * back on exit. Used only on the two primary CTAs — the effect works because it
 * is rare, and putting it on every button turns a signal into noise.
 *
 * Gated on (pointer: fine). On touch there is no hover state to lean into, so
 * the listeners would only ever fire once on tap and shift the button out from
 * under the finger.
 */

const SPRING = { stiffness: 220, damping: 18, mass: 0.35 } as const;

export function Magnetic({
  children,
  className,
  /** Fraction of the cursor's offset from centre that the element follows. */
  strength = 0.32,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // Subscribed, not read once: a tablet that gains a mouse mid-session starts
  // responding without needing a remount.
  const finePointer = useMediaQuery("(pointer: fine)");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const active = finePointer && !reduce;

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={active ? { x: springX, y: springY } : undefined}
      onPointerMove={
        active
          ? (event) => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return;
              x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
              y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
            }
          : undefined
      }
      onPointerLeave={
        active
          ? () => {
              x.set(0);
              y.set(0);
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}
