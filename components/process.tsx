import {
  CursorClick,
  FastForward,
  IdentificationCard,
  Lightbulb,
  Rocket,
  TrendUp,
} from "@phosphor-icons/react/ssr";

import { ProcessTrack } from "@/components/process-track";
import { SectionIntro } from "@/components/section-intro";
import { HorizontalPan } from "@/components/ui/horizontal-pan";

/* Six steps, read off components S1-S6 in the Figma. */
const steps = [
  {
    n: "01",
    title: "Share Your Idea",
    body: "Tell us about your business and website goals",
    Icon: Lightbulb,
  },
  {
    n: "02",
    title: "Let's Meet",
    body: "A free 30-minute consultation to discuss your project",
    Icon: IdentificationCard,
  },
  {
    n: "03",
    title: "Free Design Preview",
    body: "See our initial homepage concept before making any commitment",
    Icon: CursorClick,
  },
  {
    n: "04",
    title: "Move Forward",
    body: "Approve the concept and we'll start the full website",
    Icon: FastForward,
  },
  {
    n: "05",
    title: "Build & Launch",
    body: "We design, develop, test, and launch your website",
    Icon: Rocket,
  },
  {
    n: "06",
    title: "Grow Together",
    body: "Need updates or improvements? We're here to help",
    Icon: TrendUp,
  },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-24">
      {/*
        Same pinned scrub as Our Work, for the same reason: the six steps are a
        sequence, and a marquee showed them as an undifferentiated loop the eye
        slides off. Pinned, each step arrives on its own and uncovers itself, so
        the section reads in the order the process actually happens.
      */}
      <HorizontalPan
        /*
          Enough trailing room for step 06 to reach the middle of the screen.
          At the default 12vw the track stops with the last card pinned near the
          right edge, so it never crossed the centre band and never lit up.

          38vw puts its centre at ~53% of the viewport on the final frame, which
          is inside the band. Going further (62vw was tried) just parks the card
          left of centre and leaves a screen of empty track scrolling past.
        */
        trailClassName="md:pr-[38vw]"
        header={
          <>
            <SectionIntro
              className="mx-auto max-w-[1160px] px-6"
              label="How It Works"
              heading="A Simple Process From Idea to Launch"
              headingClassName="mx-auto mt-7 max-w-[820px] text-ink"
              body={
                <>
                  We&apos;ve created a clear, collaborative process that keeps
                  your project moving smoothly from the first conversation to a
                  successful launch
                </>
              }
              bodyClassName="mx-auto mt-6 max-w-[790px] text-ink-muted"
            />

            {/* 2px rule above the carousel, sampled at #e8e7e5 in the Figma. */}
            <div className="mt-8 h-0.5 w-full bg-rule sm:mt-10" />
          </>
        }
      >
        {/*
          The yellow in the Figma is the card's HOVER variant, not a highlight
          on step 03 — 03 was just the card the state was demonstrated on. It is
          driven by scroll position now rather than by the cursor, so the
          sequence plays itself as the section scrubs; see <ProcessTrack>.

          Icons are rendered here and passed down as elements because
          ProcessTrack is a Client Component and a component reference cannot
          cross that boundary. Phosphor writes size onto the SVG's width/height
          attributes, so the size-* utilities (CSS) win and scale it without a
          second icon.
        */}
        <ProcessTrack
          steps={steps.map((step) => ({
            n: step.n,
            title: step.title,
            body: step.body,
            icon: (
              <step.Icon
                size={84}
                weight="thin"
                aria-hidden
                className="size-[56px] sm:size-[64px] md:size-[72px]"
              />
            ),
          }))}
        />
      </HorizontalPan>
    </section>
  );
}
