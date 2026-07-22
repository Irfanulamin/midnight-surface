"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/*
 * Scroll-driven horizontal pan.
 *
 * The section pins at the top of the viewport, the inner track scrubs sideways
 * as the user scrolls, and once the track runs out the page releases and
 * continues to the next section.
 *
 * This is the one place GSAP earns its place over Motion: it needs real pinning
 * and scrubbing, which ScrollTrigger does natively and `whileInView` cannot.
 * Entry reveals elsewhere stay on Motion.
 *
 * Two details that break this if you get them wrong:
 *   - `start: "top top"` — anything else (e.g. "top center") begins the pan
 *     before the section is pinned, so the user sees the track already
 *     part-way across.
 *   - `end: "+=" + distance` — the scroll length must equal the horizontal
 *     travel, or the pan finishes early and the section sits pinned doing
 *     nothing.
 */
export function HorizontalPan({
  header,
  children,
  className,
  gapClassName = "gap-10",
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  gapClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || reduce) return;

    const ctx = gsap.context(() => {
      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 48);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          // Recalculates on resize; without it the distance is stale after a
          // viewport change and the pan over- or under-shoots.
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    /*
     * Images settle after first paint and change scrollWidth. Without a refresh
     * the pan distance is measured too short and the last cards never arrive.
     */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const timer = window.setTimeout(onLoad, 600);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, [reduce]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div className="flex min-h-[100dvh] flex-col justify-center py-20">
        {header}
        <div
          ref={trackRef}
          className={`mt-14 flex w-max px-6 ${gapClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
