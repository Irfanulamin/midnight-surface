/*
 * The page's motion system, in one place.
 *
 * Everything that moves on this site draws from the values below, so the page
 * decelerates, waits and reveals as one system rather than as a dozen
 * separately-tuned components. Before adding a new animation, reach for these;
 * only depart from them with a reason written next to the departure (the
 * price-counter's two-stage ease and the growth chart's draw curve are the
 * documented exceptions).
 */

/**
 * The one decelerate curve. A hard ease-out: quick to start, long to settle,
 * so motion arrives with weight instead of coasting to a stop. Mirrored in CSS
 * as `ease-[cubic-bezier(0.16,1,0.3,1)]` for hover and state transitions.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * When a scroll reveal fires, as a fraction of the element that must be in
 * view. The rule of thumb is inverse to size: a short element can wait until it
 * is a third visible without firing late, a tall one must fire near its edge or
 * its top has already been read by the time it animates.
 *
 *   edge      just-entered / mostly-clipped / above the fold at load
 *   in        the default — a short-to-medium element a third into view
 *   committed a self-contained set piece that should fully arrive first
 */
export const VIEWPORT = {
  edge: 0.1,
  in: 0.3,
  committed: 0.6,
} as const;

/**
 * Entrance durations, in seconds. Larger elements travel longer so nothing
 * looks like it snapped: a word mask or a whole heading takes DISPLAY, a card
 * or paragraph takes CONTENT, a small row takes DETAIL.
 */
export const DURATION = {
  detail: 0.5,
  content: 0.7,
  display: 0.9,
} as const;
