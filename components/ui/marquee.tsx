import { Children } from "react";

/*
 * Infinite marquee.
 *
 * Renders `children` twice and translates the track -50%, so the second copy
 * lands exactly where the first began.
 *
 * The spacing is padding-right on each item, NOT flex `gap`. That distinction
 * is the whole trick: with `gap`, the seam between the two copies is one gap
 * wider than the total (2 x copyWidth + gap), so -50% lands half a gap short
 * and the loop visibly jumps every pass. Folding the gap into each item's own
 * box makes the total exactly 2 x copyWidth, and -50% is seamless.
 *
 * Not a Client Component — the motion is pure CSS, so this ships no JS.
 * The duplicate is aria-hidden; a screen reader should hear the list once.
 */
export function Marquee({
  children,
  /** Seconds for one full pass. Longer = slower. */
  duration = 40,
  /** Padding-right utility applied to every item; this is the visual gap. */
  gapClassName = "pr-5",
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  gapClassName?: string;
  className?: string;
}) {
  const items = Children.map(children, (child, i) => (
    <div key={i} className={`shrink-0 ${gapClassName}`}>
      {child}
    </div>
  ));

  return (
    <div className={`marquee group relative overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0">{items}</div>
        <div className="flex shrink-0" aria-hidden>
          {items}
        </div>
      </div>
    </div>
  );
}
