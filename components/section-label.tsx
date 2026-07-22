export function SectionLabel({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: "teal" | "onTeal";
}) {
  return (
    <span
      className={
        tone === "teal"
          ? "inline-block rounded-pill bg-teal px-5 py-2 text-[13px] uppercase tracking-[0.08em] text-white"
          : "inline-block rounded-pill bg-white/12 px-5 py-2 text-[13px] uppercase tracking-[0.08em] text-white"
      }
    >
      {children}
    </span>
  );
}

/*
 * Section h2 type ramp, measured off the Frame 1 export rather than eyeballed:
 * the two lines of "Businesses That Trust Our Work" have 48px cap heights
 * (=> ~66px at Inter's 0.727 cap ratio) and their tops sit 74px apart
 * (=> line-height 1.12). The previous 3.5rem cap was clamping this ~10px too
 * small at 1440.
 *
 * Exported as a class string rather than a component because <SectionIntro>
 * renders the h2 through <TextReveal>, which needs to own the element to split
 * it into per-word masks.
 */
export const sectionHeadingClass =
  "text-[clamp(2.25rem,4.6vw,4.125rem)] font-bold leading-[1.12] tracking-[-0.025em]";
