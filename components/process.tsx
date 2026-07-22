import {
  CursorClick,
  FastForward,
  IdentificationCard,
  Lightbulb,
  Rocket,
  TrendUp,
} from "@phosphor-icons/react/ssr";

import { SectionIntro } from "@/components/section-intro";
import { Marquee } from "@/components/ui/marquee";

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
    <section className="py-16 sm:py-20 md:py-28">
      <SectionIntro
        className="mx-auto max-w-[1160px] px-6"
        label="How It Works"
        heading="A Simple Process From Idea to Launch"
        headingClassName="mx-auto mt-7 max-w-[820px] text-ink"
        body={
          <>
            We&apos;ve created a clear, collaborative process that keeps your
            project moving smoothly from the first conversation to a successful
            launch
          </>
        }
        bodyClassName="mx-auto mt-6 max-w-[790px] text-ink-muted"
      />

      {/* 2px rule above the carousel, sampled at #e8e7e5 in the Figma. */}
      <div className="mt-10 h-0.5 w-full bg-rule sm:mt-16" />

      {/*
        Scrolls continuously; pauses on hover so a card can be read and hovered.
        py-10 gives the hover lift somewhere to go — the marquee clips
        overflow, so without it the raised card's top edge gets cut off.
      */}
      <Marquee duration={55} gapClassName="pr-4 sm:pr-5" className="py-8 sm:py-10">
        {steps.map((step) => (
          /*
            Every card rests in the cream state. The yellow in the Figma is the
            component's HOVER variant, not a highlight on step 03 — 03 was just
            the card the state was demonstrated on. So: lift and turn yellow on
            hover, nothing permanently singled out.

            No border and no shadow: pixel-sampling the card's top edge showed
            #fbf9f5 -> #f6f2e9 with no intermediate line at all.
          */
          <article
            key={step.n}
            className="group flex h-[400px] w-[270px] shrink-0 flex-col justify-between rounded-2xl bg-cream-light p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-4 hover:bg-yellow sm:h-[460px] sm:w-[310px] sm:p-7 md:h-[500px] md:w-[340px] md:p-8"
          >
            <div>
              <p className="text-[13px] tracking-[0.06em] text-teal/60 transition-colors duration-500 group-hover:text-teal sm:text-[15px]">
                /STEPS
              </p>
              <p className="mt-3 text-[56px] font-bold leading-none text-teal/40 transition-colors duration-500 group-hover:text-teal-deep sm:mt-4 sm:text-[66px] md:text-[76px]">
                {step.n}
              </p>
              <h3 className="mt-7 text-[20px] font-semibold text-teal/70 transition-colors duration-500 group-hover:text-teal-deep sm:mt-9 sm:text-[22px] md:mt-10 md:text-[24px]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[280px] text-[15px] leading-7 text-teal/50 transition-colors duration-500 group-hover:text-teal-deep/80 sm:mt-4 sm:text-[16px]">
                {step.body}
              </p>
            </div>

            {/*
              Phosphor writes size onto the SVG's width/height attributes; the
              size-* utilities are CSS and win, which is how this scales down
              without a second icon.
            */}
            <step.Icon
              size={84}
              weight="thin"
              aria-hidden
              className="size-[60px] self-end text-teal/40 transition-colors duration-500 group-hover:text-teal-deep sm:size-[72px] md:size-[84px]"
            />
          </article>
        ))}
      </Marquee>
    </section>
  );
}
