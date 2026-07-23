"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

import { useMediaQuery } from "@/components/ui/use-media-query";

/*
 * Hero growth chart.
 *
 * Geometry is measured off the Frame 1 export (1440 wide). The card occupies
 * x 254-1186, y 714-1310, so the viewBox below is that card's own 932 x 596 box
 * with every coordinate relative to its top-left corner.
 *
 * The curve is a live <path> rather than an exported raster because the reveal
 * is driven by pathLength and the marker rides it via a sampled lookup.
 *
 * Beat order matters to the pitch:
 *   1. frame in  - axes, labels, origin
 *   2. draw      - the black curve climbs, marker riding the head, red to green
 *   3. arrive    - peak marker punches, callout springs
 *   4. reveal    - only now does the green wash rise under the curve
 *
 * The green is the payoff, so it is gated entirely behind arrival. Filling it
 * progressively made the outcome visible before the story earned it.
 */

const CURVE = "M 163 453 C 450 456, 640 380, 739 134";
const BASELINE = 506;

const INK = "#101010";
const START = "#e5484d";
const END = "#2f9e68";

const X0 = 163;
const X1 = 739;
const SAMPLES = 260;

/*
 * Milestones sit ON the curve and pop as the line passes them, which turns a
 * single sweep into a story with beats. Points were solved off the cubic above
 * at t = 0.45 and t = 0.75.
 *
 * Both labels restate claims the page already makes ("Launch In A Week Not
 * Months", "Build Your Website with $0.00 Upfront") — nothing here invents a
 * promise the rest of the site does not.
 */
const MILESTONES = [
  { x: 492, y: 400, label: "Live in a week" },
  { x: 648, y: 288, label: "$0 upfront" },
] as const;

// Faint horizontal rules. They give the empty upper field structure so the
// curve reads as a measurement rather than a drawing.
const GRID_LINES = [190, 268, 346, 424];

const DRAW_SECONDS = 2.4;

// Long enough for the red "before" state to actually land before anything moves.
const LEAD_IN = 1.3;

// Entrances and settles.
const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * The draw itself eases IN, not out. Expo-out launched fast and coasted, which
 * rushed the steep climb — the interesting part — and crawled through the flat.
 * This lingers in the flat years and accelerates into the growth.
 */
const DRAW_EASE = [0.65, 0, 0.35, 1] as const;

/*
 * Colour holds red across the flat section and only turns over the climb. A
 * linear red->green ramp spent most of the journey as indeterminate brown.
 */
const SHIFT_START = 0.55;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Smoothstep, so the turn eases rather than switching on a hard edge.
const colourProgressAt = (p: number) => {
  const t = Math.min(Math.max((p - SHIFT_START) / (1 - SHIFT_START), 0), 1);
  return t * t * (3 - 2 * t);
};

const mixHex = (from: string, to: string, t: number) => {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const c = (a: number, b: number) =>
    Math.round(lerp(a, b, t)).toString(16).padStart(2, "0");
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
};

/*
 * Type scale for narrow viewports.
 *
 * The whole drawing is one 932-unit viewBox, so it scales uniformly with the
 * card — which means on a phone the 15-19 unit labels land under 7 device px.
 * Rather than letting the card scroll (a chart you have to drag sideways is not
 * a chart), the geometry stays fixed and only the type grows, in user units, so
 * it survives the downscale.
 *
 * 1.7 is the largest factor that still fits: at this size "TIME WITH US" spans
 * x 317-615 and the callout pill x 290-701, both inside the 932 box.
 */
const COMPACT_TYPE_SCALE = 1.7;

export function GrowthChart({ className = "" }: { className?: string } = {}) {
  /*
   * Matches Tailwind's sm breakpoint. Below it the card is narrow enough that
   * the labels need the boost; at sm and up the measured Figma sizes stand.
   */
  const compact = useMediaQuery("(max-width: 639px)");
  const s = compact ? COMPACT_TYPE_SCALE : 1;

  const rootRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);

  const [arrived, setArrived] = useState(false);

  // How many milestones the marker has swept past. Drives their pop-in.
  const [reached, setReached] = useState(0);
  const reachedRef = useRef(0);
  const arrivedRef = useRef(false);

  // Frame-to-frame velocity, smoothed, driving the marker's glow intensity.
  const previousRef = useRef(0);
  const heatRef = useRef(0);

  /*
   * The chart renders ~640px tall. On a 700-800px viewport with a sticky nav,
   * anything above ~0.7 here is unreachable — inView never flips, every element
   * stays at opacity 0 and the card renders blank. 0.6 is the highest value
   * that still triggers reliably; do not raise it without testing short
   * viewports.
   */
  const inView = useInView(rootRef, { amount: 0.6, once: true });
  const reduce = useReducedMotion();

  const progress = useMotionValue(0);

  /*
   * Pre-sample the curve once. Calling getPointAtLength every frame makes the
   * browser re-walk the path geometry; a lookup table reduces the per-frame
   * cost to an index and one interpolation.
   */
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    pointsRef.current = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const { x, y } = path.getPointAtLength((i / SAMPLES) * total);
      return { x, y };
    });
  }, []);

  // Marker position and colour are the only per-frame work.
  useMotionValueEvent(progress, "change", (p) => {
    const points = pointsRef.current;
    const marker = markerRef.current;
    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!points.length || !marker || !dot || !halo) return;

    const exact = Math.min(Math.max(p, 0), 1) * SAMPLES;
    const i = Math.floor(exact);
    const j = Math.min(i + 1, SAMPLES);
    const t = exact - i;
    const x = lerp(points[i].x, points[j].x, t);
    const y = lerp(points[i].y, points[j].y, t);

    marker.setAttribute("transform", `translate(${x} ${y})`);

    /*
     * Milestones trigger on the marker's x, not on progress — progress is a
     * path-length fraction, and length diverges from horizontal distance on the
     * steep section, so a fraction-based trigger would fire in the wrong place.
     * State is only set on an actual crossing, so this costs two renders total
     * rather than one per frame.
     */
    let count = 0;
    for (const m of MILESTONES) if (x >= m.x) count += 1;
    if (count !== reachedRef.current) {
      reachedRef.current = count;
      setReached(count);
    }

    /*
     * Arrival is derived from progress, not from the tween's onComplete.
     * useReducedMotion() resolves null -> false after hydration, which re-runs
     * the effect and calls controls.stop() on the in-flight animation — so
     * onComplete could silently never fire, leaving the peak marker and the
     * callout stuck at opacity 0 forever. Reading the value cannot miss.
     */
    if (p >= 0.999 && !arrivedRef.current) {
      arrivedRef.current = true;
      setArrived(true);
    }

    const colour = mixHex(START, END, colourProgressAt(p));
    dot.setAttribute("fill", colour);
    halo.setAttribute("fill", colour);

    /*
     * Glow scales with the marker's own velocity, smoothed. Because the curve
     * is exponential and the ease accelerates, the dot physically speeds up as
     * it climbs — tying light to that makes it look like it is heating up
     * under load rather than sliding at a constant temperature.
     */
    const velocity = Math.abs(p - previousRef.current);
    previousRef.current = p;
    heatRef.current += (velocity - heatRef.current) * 0.14;
    const heat = Math.min(heatRef.current * 110, 1);

    // Heat now only drives the dot's radius; the drop-shadow glow was removed
    // so the marker stays a flat disc, in keeping with the page's no-shadow rule.
    dot.setAttribute("r", String(9 + heat * 2.5));
  });

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      progress.set(1);
      arrivedRef.current = true;
      setArrived(true);
      return;
    }

    // Arrival is handled by the progress listener above, not by onComplete.
    const controls = animate(progress, 1, {
      duration: DRAW_SECONDS,
      ease: DRAW_EASE,
      delay: LEAD_IN,
    });

    return () => controls.stop();
  }, [inView, reduce, progress]);

  const show = inView;

  return (
    <motion.svg
      ref={rootRef}
      viewBox="0 0 932 596"
      /*
       * h-auto w-full by default. A caller can add a max-height — the viewBox
       * is 1.56:1, so across a full-bleed band the natural height runs past the
       * viewport. preserveAspectRatio then centres the drawing inside the wider
       * box rather than distorting it.
       */
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Chart showing business growth accelerating over time with Midnight Surface"
      initial={reduce ? false : { opacity: 0, scale: 0.97, y: 16 }}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, ease: EASE }}
    >
      <defs>
        {/* Green wash under the curve — the payoff, revealed only on arrival. */}
        <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={END} stopOpacity="0.38" />
          <stop offset="55%" stopColor={END} stopOpacity="0.13" />
          <stop offset="100%" stopColor={END} stopOpacity="0" />
        </linearGradient>

        <clipPath id="growth-area-shape">
          <path d={`${CURVE} L ${X1} ${BASELINE} L ${X0} ${BASELINE} Z`} />
        </clipPath>
      </defs>

      {/*
        1. The wash. Gated on `arrived`, so it cannot appear before the line
        tops out. Rises from the baseline rather than wiping across, which
        reads as the area filling up instead of a curtain sliding.
      */}
      <g clipPath="url(#growth-area-shape)">
        <motion.rect
          x="0"
          y="0"
          width="932"
          height="596"
          fill="url(#growth-area)"
          initial={reduce ? false : { opacity: 0, scaleY: 0.72 }}
          animate={arrived ? { opacity: 1, scaleY: 1 } : undefined}
          transition={{ duration: 1.05, ease: EASE, delay: 0.12 }}
          style={{ transformOrigin: `0px ${BASELINE}px` }}
        />
      </g>

      {/*
        1b. Gridlines. Deliberately near-invisible (6% ink) — they give the
        upper field structure without competing with the curve.
      */}
      {GRID_LINES.map((y, i) => (
        <motion.line
          key={y}
          x1={X0}
          x2="799"
          y1={y}
          y2={y}
          stroke={INK}
          strokeWidth="1"
          strokeOpacity="0.06"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={show ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            duration: 0.9,
            ease: EASE,
            delay: 0.15 + i * 0.07,
          }}
        />
      ))}

      {/* 2. Axes: bottom rule and right-hand vertical, as drawn in Figma. */}
      <motion.path
        d={`M 134 ${BASELINE} L 799 ${BASELINE} M 799 98 L 799 ${BASELINE}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: EASE }}
      />

      {/*
        3. The curve — design black, no gradient.

        strokeLinecap MUST stay "butt". Motion implements pathLength: 0 as
        `stroke-dasharray: 0px 1px`, and per the SVG spec a zero-length dash
        with a round cap paints a filled circle of stroke-width diameter — so
        a round cap renders a black dot at the curve's end before the draw
        starts. The opacity gate below is a second guard against the same class
        of pre-draw paint.
      */}
      <motion.path
        ref={pathRef}
        d={CURVE}
        fill="none"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="butt"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 1 } : undefined}
        /*
         * pathLength must match the marker's tween exactly — same duration,
         * ease and delay — or the dot drifts off the end of its own line.
         * opacity snaps on at the same instant rather than fading across the
         * draw, which would leave the stroke washed out for two seconds.
         */
        transition={{
          pathLength: {
            duration: DRAW_SECONDS,
            ease: DRAW_EASE,
            delay: LEAD_IN,
          },
          opacity: { duration: 0.01, delay: LEAD_IN },
        }}
      />

      {/* 4. Axis copy. Reads across the two axes as "your growth / time with us". */}
      <motion.g
        fill={INK}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.65, ease: EASE, delay: 0.32 }}
      >
        <text
          x="466"
          y="558"
          textAnchor="middle"
          fontSize={19 * s}
          letterSpacing={3.4 * s}
          fillOpacity="0.45"
        >
          TIME WITH US
        </text>
        <text
          x="-302"
          y="850"
          textAnchor="middle"
          fontSize={19 * s}
          letterSpacing={3.4 * s}
          fillOpacity="0.45"
          transform="rotate(-90)"
        >
          YOUR GROWTH
        </text>
      </motion.g>

      {/*
        4b. Milestones. Each pops as the marker sweeps past it, so the single
        sweep becomes a sequence of beats the eye can follow — and the labels
        put the product's actual promises on the curve itself.
      */}
      {MILESTONES.map((m, i) => {
        const hit = reached > i;
        return (
          <motion.g
            key={m.label}
            initial={reduce ? false : { opacity: 0 }}
            animate={hit ? { opacity: 1 } : undefined}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <motion.circle
              cx={m.x}
              cy={m.y}
              r="6"
              fill={INK}
              initial={reduce ? false : { scale: 0 }}
              animate={hit ? { scale: [0, 1.7, 1] } : undefined}
              transition={{ duration: 0.6, ease: EASE, times: [0, 0.4, 1] }}
              style={{ transformOrigin: `${m.x}px ${m.y}px` }}
            />
            <motion.text
              x={m.x - 18 * s}
              y={m.y - 16 * s}
              textAnchor="end"
              fontSize={16 * s}
              fill={INK}
              fillOpacity="0.55"
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={hit ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
            >
              {m.label}
            </motion.text>
          </motion.g>
        );
      })}

      {/*
        5. Origin marker plus its anchor label. The label gives the red beat
        something to mean — without a "before", the green ending has nothing
        to land against.
      */}
      <motion.circle
        cx={X0}
        cy="453"
        r="13"
        fill="#dedede"
        initial={reduce ? false : { scale: 0 }}
        animate={show ? { scale: 1 } : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.22 }}
        style={{ transformOrigin: `${X0}px 453px` }}
      />
      <motion.text
        x={X0}
        y={488 + 8 * (s - 1)}
        textAnchor="middle"
        fontSize={15 * s}
        letterSpacing={2.6 * s}
        fill={INK}
        fillOpacity="0.4"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.55, ease: EASE, delay: 0.42 }}
      >
        TODAY
      </motion.text>

      {/*
        6. Peak marker. Does not exist until the curve actually gets there —
        showing the destination up front gives away the ending and leaves a
        stray dot floating in empty space.
        `fill` stays a plain attribute: putting it in `initial` meant the first
        paint, before Motion applied anything, used SVG's default fill (black).
      */}
      <motion.circle
        cx={X1}
        cy="134"
        r="15"
        fill={END}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={arrived ? { scale: [0, 1.6, 1], opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: EASE, times: [0, 0.42, 1] }}
        style={{ transformOrigin: `${X1}px 134px` }}
      />

      {/*
        6b. Arrival burst. Two rings radiating out of the peak, staggered — the
        moment the line lands should read as an event, not just a stop.
      */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx={X1}
          cy="134"
          r="15"
          fill="none"
          stroke={END}
          strokeWidth="2"
          initial={reduce ? false : { scale: 1, opacity: 0 }}
          animate={arrived ? { scale: [1, 4.2], opacity: [0.55, 0] } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: i * 0.18 }}
          style={{ transformOrigin: `${X1}px 134px` }}
        />
      ))}

      {/* 7. Callout, springs in behind the arrival beat. */}
      <g transform={`translate(${X1} 134)`}>
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.8, y: 8 }}
          animate={arrived ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 22,
            delay: 0.14,
          }}
        >
          {/*
            The pill is sized from the same scale as its label, so the box and
            the type grow together — scaling only the font would spill the text
            straight out of the capsule.
          */}
          <rect
            x={-264 * s}
            y={-74 * s}
            width={242 * s}
            height={46 * s}
            rx={23 * s}
            fill={INK}
            fillOpacity="0.93"
          />
          <text
            x={-143 * s}
            y={-44 * s}
            textAnchor="middle"
            fontSize={17 * s}
            fill="#ffffff"
          >
            Your business, grown
          </text>
        </motion.g>
      </g>

      {/*
        8. Travelling marker, painted last so it sits above the curve.
        Outer <g> is positioned imperatively; the inner motion.g owns the fade.
        Sharing one element between Motion and an imperative transform write
        means one silently clobbers the other.
      */}
      <g ref={markerRef} transform={`translate(${X0} 453)`}>
        <motion.g
          initial={reduce ? false : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.26 }}
        >
          <motion.circle
            ref={haloRef}
            r="15"
            fill={START}
            /*
             * Slow breathe after arrival rather than freezing. A completely
             * static end state makes the whole thing read as a screenshot to
             * anyone who scrolls back up.
             */
            animate={
              reduce
                ? { scale: 1, opacity: 0.22 }
                : arrived
                  ? { scale: [1, 1.7, 1], opacity: [0.24, 0.06, 0.24] }
                  : { scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : arrived
                  ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 1.8, repeat: Infinity, ease: "easeOut" }
            }
          />
          <circle ref={dotRef} r="9" fill={START} />
        </motion.g>
      </g>
    </motion.svg>
  );
}
