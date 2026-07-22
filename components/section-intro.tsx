import { SectionLabel, sectionHeadingClass } from "@/components/section-label";
import { DURATION } from "@/components/ui/motion";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

/*
 * The label / heading / body trio that opens almost every section.
 *
 * It exists for the choreography, not to save markup. Every section entrance
 * runs the same three beats in the same order — pill, then the heading
 * assembling word by word, then the body catching up underneath — so the page
 * has one entrance gesture instead of nine slightly different ones.
 *
 * Per-section widths stay with the section: the measured max-w values differ
 * everywhere and are part of how the design breaks its lines, so they are
 * passed in rather than guessed at here.
 */
export function SectionIntro({
  label,
  tone = "teal",
  heading,
  headingClassName = "",
  body,
  bodyClassName = "",
  align = "center",
  className = "",
}: {
  label?: string;
  tone?: "teal" | "onTeal";
  /** Plain string — <TextReveal> splits it into per-word masks. */
  heading: string;
  headingClassName?: string;
  body?: React.ReactNode;
  bodyClassName?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {/*
        Label, heading and body all fire at the same viewport threshold (the
        primitives' shared default), so the three beats are sequenced purely by
        DOM order and the body's delay — one predictable gesture in every
        section, rather than three elements each crossing their own line.
      */}
      {label ? (
        <Reveal direction={align === "center" ? "up" : "left"} duration={DURATION.content}>
          <SectionLabel tone={tone}>{label}</SectionLabel>
        </Reveal>
      ) : null}

      <TextReveal
        as="h2"
        text={heading}
        className={`${sectionHeadingClass} ${headingClassName}`}
      />

      {/*
        Starts while the heading is still assembling. Waiting for the words to
        finish leaves a visible dead beat on the longer headings.
      */}
      {body ? (
        <Reveal delay={0.26} duration={DURATION.display}>
          {/*
            The type ramp lives here, not in the caller: it is identical in
            every section and the small-screen step down needs to happen in one
            place. Callers pass only what actually differs — the measured
            max-width and the colour for the surface they sit on.
          */}
          <p className={`text-[16px] leading-7 sm:text-[18px] sm:leading-8 ${bodyClassName}`}>
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
