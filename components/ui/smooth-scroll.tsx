"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/*
 * Global smooth scroll.
 *
 * Lenis intercepts wheel/touch input and eases the real window scroll position
 * toward the target, so everything already reading scroll — ScrollTrigger's pin
 * in <HorizontalPan>, Motion's useScroll in the header and <Parallax> — inherits
 * the smoothing for free. Nothing downstream needs to know Lenis exists.
 *
 * Three wiring details carry the whole thing:
 *
 *   1. autoRaf: false + gsap.ticker
 *      Lenis' own rAF loop and GSAP's ticker are two independent loops. Running
 *      both means the smoothed scroll position is written in one frame and read
 *      by ScrollTrigger in the next, and the pinned section visibly trails the
 *      cursor. Driving lenis.raf from the ticker collapses them into one frame.
 *
 *   2. lenis.on("scroll", ScrollTrigger.update)
 *      Lenis' easing keeps moving after the input stops. Without this,
 *      ScrollTrigger only samples on native scroll events and the horizontal
 *      pan stutters through the tail of every gesture.
 *
 *   3. lagSmoothing(0)
 *      GSAP normally clamps a long frame's delta to avoid a jump. Here that
 *      desyncs the ticker from Lenis' real elapsed time, which reads as the page
 *      lurching after any hitch. Lenis does its own interpolation, so the
 *      clamp is not wanted.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    // Smoothing hijacks the scroll the user asked the OS for. Never do that to
    // someone who has asked for reduced motion — leave native scrolling alone.
    if (reduce) return;

    const lenis = new Lenis({
      // Per-frame interpolation toward the target. 0.1 is ~unnoticeable lag at
      // 60fps; higher reads as sluggish on a trackpad, lower defeats the point.
      lerp: 0.1,
      // Touch devices already have momentum scrolling from the OS. Doubling it
      // up feels wrong and costs a frame of latency on every drag.
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      // Lets Lenis ease in-page hash links instead of the browser jumping.
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      // GSAP's ticker reports seconds; Lenis wants milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Lenis sets height:auto on html/body, which can change document height.
    // Any trigger measured before that is measuring the old page.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default.
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
