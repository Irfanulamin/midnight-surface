"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

/*
 * Price that counts down to what you actually pay.
 *
 * The number starts high and falls to the real price, so the saving is
 * something the reader watches happen rather than a claim they have to take on
 * trust.
 *
 * It is deliberately not on any single easing curve, and not on the page's
 * standard cubic-bezier(0.16, 1, 0.3, 1) either. That curve is tuned for
 * movement, where a hard front-loaded decelerate reads as weight; on a number
 * it spends most of the count in the first few frames, where the digits are
 * illegible, and any single ease-out still arrives at the final price at its
 * fastest-changing moment relative to what is left — so the last few units,
 * the ones carrying the actual news, go by quickest.
 *
 * The count is two keyframed segments instead, which lets the drama sit where
 * the meaning is. The first covers everything down to SETTLE_FROM (the bulk of
 * the money) in a minority of the time, accelerating so it hands over at speed.
 * The last stretch is the small one, and it gets most of the clock: the digits
 * visibly slow, tick down one at a time and come to rest on the price. That
 * final crawl is the point of the whole thing.
 *
 * The two segment easings meet at high velocity (the first accelerates into the
 * handover, the second decelerates out of it), so the changeover reads as the
 * number braking rather than as a seam.
 *
 * Note the price deliberately does NOT use `tabular-nums`. Tabular figures are
 * a different glyph set from the proportional ones the rest of the page sets,
 * so the price visibly changed typeface while counting. The width does shift
 * as 2000 loses a digit, but that happens in the first moments and the number
 * is stable for the rest of the count.
 *
 * Nothing here re-renders React. The value is a MotionValue and Motion writes
 * the formatted string straight into the text node, so the whole count costs
 * zero renders — the alternative, a useState tick per frame, would re-render
 * the whole card a few hundred times and is banned by the taste skill for
 * exactly that.
 *
 * `animate()` on a MotionValue is imperative, so it cannot join the card's
 * variant tree and has to be started from an effect. It takes `started` from
 * the grid's single observer rather than opening one of its own — two counters
 * with two observers is exactly how the pair fell out of step before — and
 * `delay` places it inside the card's cascade.
 *
 * Screen readers get the final price as static text and never hear the count.
 */

/**
 * How much of the drop is held back for the slow finish. 0.14 = the last 14%
 * of the money. Raise it and the crawl starts earlier and covers more ground;
 * lower it and the ending is a shorter, sharper settle.
 */
const SETTLE_DISTANCE = 0.14;

/** Point in the timeline where the slow finish takes over. */
const SETTLE_AT = 0.34;

/*
 * Accelerates into the handover, so it arrives at SETTLE_AT moving fast and
 * the brake that follows is felt.
 */
const RUN_EASE = [0.4, 0, 0.85, 0.75] as const;

/*
 * Expo-out. The most extreme decelerate available: over the last stretch the
 * digits go from a blur to one every few frames to a full stop.
 */
const SETTLE_EASE = [0.15, 1, 0.25, 1] as const;
export function PriceCounter({
  from,
  to,
  started,
  delay = 0,
  duration = 3.2,
  className,
}: {
  from: number;
  to: number;
  /** Driven by the grid, so every counter starts on the same frame. */
  started: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const value = useMotionValue(from);
  const text = useTransform(value, (v) => `${Math.round(v)}$`);

  useEffect(() => {
    // Reduced motion gets the answer, not the performance.
    if (reduce) {
      value.set(to);
      return;
    }
    if (!started) return;

    // Where the fast run hands over to the slow finish.
    const settleFrom = to + (from - to) * SETTLE_DISTANCE;

    const controls = animate(value, [from, settleFrom, to], {
      duration,
      delay,
      times: [0, SETTLE_AT, 1],
      ease: [RUN_EASE, SETTLE_EASE],
    });
    return () => controls.stop();
  }, [started, reduce, value, from, to, delay, duration]);

  return (
    <span className={className}>
      <span className="sr-only">{to}$</span>
      <motion.span aria-hidden>{text}</motion.span>
    </span>
  );
}
