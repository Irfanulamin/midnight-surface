"use client";

import { useCallback, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

export type Step = {
  n: string;
  title: string;
  body: string;
  /* Passed as a rendered element, not a component: functions cannot cross the
     server/client boundary, but JSX can. */
  icon: React.ReactNode;
};

/*
 * The six step cards, with exactly one lit at a time.
 *
 * The highlight used to be a hover state, so the steps only read as a sequence
 * if you dragged a cursor across them. It is driven by position now, so the
 * scrub itself walks the user through the process: each step lifts and turns
 * yellow as it takes the centre of the screen, and settles back as the next one
 * takes over.
 *
 * Nearest-to-centre rather than an IntersectionObserver band, because "one at a
 * time" cannot be expressed as a band. Cards sit on a 380px pitch with a 40px
 * gap, so any observer window wider than that gap catches two neighbours at
 * once, and any window narrower than it drops to zero while a gap crosses the
 * middle. Measuring distance to the centre has neither failure: there is always
 * exactly one winner.
 *
 * The axis flips at the same breakpoint the pan does: horizontal while pinned
 * at md and up, vertical once the cards stack.
 *
 * Cost is six getBoundingClientRect reads per scroll frame, and setState only
 * when the winner actually changes, so the tree re-renders once per step rather
 * than once per frame. This is the sanctioned way to read scroll — a raw
 * scroll listener is banned by the taste skill.
 */
export function ProcessTrack({ steps }: { steps: Step[] }) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  // -1 = nothing lit, which is correct until the section is actually on screen.
  const [activeIndex, setActiveIndex] = useState(-1);
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const horizontal = window.matchMedia("(min-width: 768px)").matches;
    const centre = horizontal ? window.innerWidth / 2 : window.innerHeight / 2;

    let winner = -1;
    let shortest = Infinity;

    refs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();

      // Ignore anything off screen, so nothing is lit before you arrive.
      const offScreen = horizontal
        ? r.right < 0 || r.left > window.innerWidth
        : r.bottom < 0 || r.top > window.innerHeight;
      if (offScreen) return;

      const cardCentre = horizontal ? (r.left + r.right) / 2 : (r.top + r.bottom) / 2;
      const distance = Math.abs(cardCentre - centre);
      if (distance < shortest) {
        shortest = distance;
        winner = i;
      }
    });

    setActiveIndex((prev) => (prev === winner ? prev : winner));
  }, []);

  useMotionValueEvent(scrollY, "change", measure);

  return (
    <>
      {steps.map((step, i) => {
        const active = i === activeIndex;
        return (
          <div
            key={step.n}
            className="w-full md:h-full md:w-[340px] md:shrink-0 md:py-4"
          >
            {/*
              No border and no shadow at rest: pixel-sampling the card's top
              edge in the Figma showed #fbf9f5 -> #f6f2e9 with no intermediate
              line at all.

              700ms, not the 500ms used elsewhere: this transition is the
              storytelling beat, so it wants to be seen rather than snapped
              through. The lift is gated behind motion-safe, leaving
              reduced-motion users the colour change, which carries the same
              information without moving anything.

              The wrapper's md:py-4 gives the lift somewhere to go — the pan
              clips its overflow, so a card flush with the track would have its
              raised top edge cut off. overflow-hidden on the card is a guard
              for short viewports, where the icon would otherwise spill past the
              rounded corner.
            */}
            <article
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-active={active}
              className="group flex h-full min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl bg-cream-light p-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-[active=true]:bg-yellow data-[active=true]:shadow-[0_20px_44px_-24px_rgb(0_0_0/0.3)] motion-safe:data-[active=true]:-translate-y-3 sm:p-7 md:min-h-0 md:p-7"
            >
              <div>
                <p className="text-[13px] tracking-[0.06em] text-teal/60 transition-colors duration-700 group-data-[active=true]:text-teal sm:text-[15px]">
                  /STEPS
                </p>
                <p className="mt-3 text-[56px] font-bold leading-none text-teal/40 transition-colors duration-700 group-data-[active=true]:text-teal-deep sm:mt-4 sm:text-[66px] md:text-[72px]">
                  {step.n}
                </p>
                <h3 className="mt-6 text-[20px] font-semibold text-teal/70 transition-colors duration-700 group-data-[active=true]:text-teal-deep sm:mt-8 sm:text-[22px] md:text-[24px]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[280px] text-[15px] leading-7 text-teal/50 transition-colors duration-700 group-data-[active=true]:text-teal-deep/80 sm:mt-4 sm:text-[16px]">
                  {step.body}
                </p>
              </div>

              <div className="shrink-0 self-end text-teal/40 transition-colors duration-700 group-data-[active=true]:text-teal-deep">
                {step.icon}
              </div>
            </article>
          </div>
        );
      })}
    </>
  );
}
