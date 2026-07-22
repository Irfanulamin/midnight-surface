/*
 * Infinite marquee.
 *
 * Renders `children` twice inside a track that translates -50%, so the second
 * copy arrives exactly where the first started and the seam is invisible. This
 * only works if the gap between the two copies matches the gap between items,
 * which is why `gap` is applied to the track rather than by the caller.
 *
 * Deliberately not a Client Component: the motion is pure CSS, so this stays on
 * the server and ships no JavaScript at all.
 *
 * The duplicated copy is aria-hidden — a screen reader should hear the list
 * once, not twice.
 */
export function Marquee({
  children,
  /** Seconds for one full pass. Longer = slower. */
  duration = 40,
  gapClassName = "gap-5",
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  gapClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`marquee group relative overflow-hidden ${className ?? ""}`}
    >
      <div
        className={`marquee-track flex w-max ${gapClassName}`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className={`flex shrink-0 ${gapClassName}`}>{children}</div>
        <div className={`flex shrink-0 ${gapClassName}`} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
