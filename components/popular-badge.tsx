"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/components/ui/motion";

/*
 * The "Popular" flag on the recommended plan.
 *
 * Its job is hierarchy: the two packages are visually equal weight, so without
 * something pulling the eye the reader has to compare feature lists before
 * learning which one we recommend. The badge answers that before they read a
 * word of it.
 *
 * Three beats, in sequence, and the sequencing is the whole reason it reads as
 * smooth: the pill springs in and lands at -6deg, the word rises out of its own
 * mask, and only then does the yellow sheet behind it start to rock. Running
 * them concurrently — which is what the first version did, because the sheet's
 * CSS loop began at page load — meant a parent and its child were transforming
 * against each other while the pill was still settling, and no amount of tuning
 * the spring fixes that. One thing moves at a time.
 *
 * The spring is deliberately well damped (180/18 rather than the 260/12 it
 * started at, near the taste skill's 100/20 guidance). It keeps a single clean
 * overshoot, which is the pop, and drops the wobble that followed it. Opacity
 * is pulled out onto a plain tween: a spring on opacity has no physical meaning
 * and its overshoot clamps, which shows up as a flicker at the start of a fade.
 * The travel is shorter too — from 0.7 scale and -16deg rather than 0.4 and
 * -26deg — because most of what read as "jumpy" was simply distance covered too
 * fast.
 *
 * Both delays are absolute, measured from the moment the card's variant flips.
 * They cannot rely on the parent's staggerChildren: a child that declares its
 * own `delay` overrides the stagger-computed one, and the badge is the card's
 * first DOM child, so the stagger would have fired it first — the opposite of
 * what it is for. Stating both times explicitly also keeps the word tied to
 * the pill: the rise has to start after the pop, not moments after the card.
 *
 * Rotation is owned by Motion, never a `-rotate-6` utility: Tailwind v4
 * compiles rotate-* to the standalone `rotate` property, which composes with
 * rather than replaces the transform Motion writes, so using both would leave
 * the badge at -12deg animating against itself.
 */

const POP_AT = 0.6;
const RISE_AT = POP_AT + 0.18;

export function PopularBadge({ children }: { children: string }) {
  const reduce = useReducedMotion();
  /*
   * One setState, once, when the pill has finished landing. Under reduced
   * motion nothing animates so the callback never fires, hence the `reduce`
   * branch — the sheet is part of how the badge looks, not only how it moves.
   */
  const [landed, setLanded] = useState(false);
  const showSheet = landed || reduce;

  return (
    <motion.span
      className="absolute -top-3 right-6 sm:right-14"
      variants={{
        hidden: { opacity: 0, scale: 0.7, rotate: -16 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: -6,
          transition: {
            default: {
              type: "spring",
              stiffness: 180,
              damping: 18,
              mass: 0.9,
              delay: POP_AT,
            },
            opacity: { duration: 0.4, ease: EASE, delay: POP_AT },
          },
        },
      }}
      onAnimationComplete={() => setLanded(true)}
    >
      {/*
        The flat yellow sheet behind the pill. This is the page's own way of
        showing depth (see the stacked sheets on the star card) and it replaces
        what was a blurred glow — there is no blur anywhere else here, so a
        soft halo read as borrowed from a different site.

        It sits exactly behind the pill until it starts rocking, so it is
        invisible for the entrance and emerges as the last beat. See
        .badge-sticker in globals.css.
      */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-pill bg-yellow ${
          showSheet ? "badge-sticker" : ""
        }`}
      />

      {/* Paints after the sheet in DOM order, so it needs no z-index. */}
      <span className="relative flex rounded-pill bg-coral px-4 py-1.5 text-[12px] tracking-[0.06em] text-white uppercase sm:px-5 sm:py-2 sm:text-[13px]">
        <span className="inline-block overflow-hidden pb-[0.14em] mb-[-0.14em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "115%" },
              visible: {
                y: "0%",
                transition: { duration: 0.6, ease: EASE, delay: RISE_AT },
              },
            }}
          >
            {children}
          </motion.span>
        </span>
      </span>
    </motion.span>
  );
}
