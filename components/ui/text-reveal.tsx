"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { EASE, VIEWPORT } from "@/components/ui/motion";

/*
 * Word-by-word mask reveal.
 *
 * Each word sits in its own overflow-hidden box and slides up from below its
 * own baseline, so the line assembles itself left to right instead of fading
 * in as a block. This is the single loudest piece of motion on the page, which
 * is why it is reserved for headings.
 *
 * Two details that look like noise but are not:
 *
 *   - pb-[0.14em] / -mb-[0.14em] on the mask. overflow-hidden clips at the
 *     content box, which cuts the descenders off g, y and p. The padding gives
 *     them room and the equal negative margin takes the space back out of the
 *     layout, so line spacing is unchanged.
 *
 *   - The space between words is a real text node BETWEEN the masks, not
 *     inside them. Inside an inline-block a trailing space is dropped, and a
 *     non-breaking space would stop the heading wrapping where the design
 *     needs it to.
 *
 * Only transform moves, so this stays on the compositor.
 */

/*
 * Same trigger as the reveal primitives, and for the same reload reason:
 * `once` fires on first entry, and anything already scrolled past on a
 * restored-scroll reload is shown at once (off screen) rather than left hidden.
 * See the fuller note on useReveal in components/ui/reveal.tsx.
 */
function useReveal<T extends Element>(amount: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView || passed) return;
    if (el.getBoundingClientRect().bottom <= 0) {
      const id = requestAnimationFrame(() => setPassed(true));
      return () => cancelAnimationFrame(id);
    }
  }, [inView, passed]);

  return [ref, inView || passed] as const;
}

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

export function TextReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.055,
  duration = 0.9,
  /** Fraction of the heading that must be visible before it fires. */
  amount = VIEWPORT.in,
}: {
  /**
   * Plain string only — it has to be split on spaces. Mixed markup (a coloured
   * span, an explicit line break) belongs in <MaskReveal> instead.
   */
  text: string;
  as?: keyof typeof tags;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal<HTMLElement>(amount);
  const words = text.split(" ");

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }

  const Tag = tags[as];

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={className}
      /*
       * Splitting into per-word spans leaves the text readable to a screen
       * reader, but the label guarantees it is announced as one phrase rather
       * than as a pile of fragments. The spans are hidden to avoid the double
       * read that would otherwise cause.
       */
      aria-label={text}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          <span className="inline-block overflow-hidden pb-[0.14em] mb-[-0.14em]">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "115%" },
                visible: { y: "0%", transition: { duration, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/*
 * Single-mask variant, for a line that is not a plain string — a coloured span,
 * an explicit break. Stack several to reveal a multi-line heading line by line.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
  amount = VIEWPORT.in,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal<HTMLSpanElement>(amount);

  if (reduce) {
    return <span className={`block ${className ?? ""}`}>{children}</span>;
  }

  /*
   * The trigger sits on the OUTER mask, with the inner span driven by
   * variants — it cannot go on the inner span itself.
   *
   * IntersectionObserver clips an element's intersection rect against its
   * ancestors' overflow. The inner span starts translated fully below the
   * mask's overflow-hidden box, so its visible area is exactly zero and it
   * never reaches the threshold: it cannot animate until it is on screen, and
   * it cannot be on screen until it animates. The headline in the CTA banner
   * sat invisible at its start position because of this.
   *
   * The mask itself is never clipped, so it observes normally. <TextReveal>
   * already worked for the same reason — its trigger is on the heading element,
   * not on the masked words.
   */
  return (
    <motion.span
      ref={ref}
      className={`block overflow-hidden pb-[0.14em] mb-[-0.14em] ${className ?? ""}`}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
    >
      <motion.span
        className="block"
        variants={{
          hidden: { y: "115%" },
          visible: { y: "0%", transition: { duration, delay, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
