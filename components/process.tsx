import {
  CursorClick,
  FastForward,
  IdentificationCard,
  Lightbulb,
  Rocket,
  TrendUp,
} from "@phosphor-icons/react/ssr";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";

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
    <section className="py-28">
      <Reveal className="mx-auto max-w-[1160px] px-6 text-center">
        <SectionLabel>How It Works</SectionLabel>
        <SectionHeading className="mx-auto mt-7 max-w-[820px] text-ink">
          A Simple Process From Idea to Launch
        </SectionHeading>
        <p className="mx-auto mt-6 max-w-[790px] text-[18px] leading-8 text-ink-muted">
          We&apos;ve created a clear, collaborative process that keeps your
          project moving smoothly from the first conversation to a successful
          launch
        </p>
      </Reveal>

      {/* 2px rule above the carousel, sampled at #e8e7e5 in the Figma. */}
      <div className="mt-16 h-0.5 w-full bg-rule" />

      {/*
        Scrolls continuously; pauses on hover so a card can be read and hovered.
        py-10 gives the hover lift somewhere to go — the marquee clips
        overflow, so without it the raised card's top edge gets cut off.
      */}
      <Marquee duration={55} gapClassName="pr-5" className="py-10">
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
            className="group flex h-[500px] w-[340px] shrink-0 flex-col justify-between rounded-2xl bg-cream-light p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-4 hover:bg-yellow"
          >
            <div>
              <p className="text-[15px] tracking-[0.06em] text-teal/60 transition-colors duration-500 group-hover:text-teal">
                /STEPS
              </p>
              <p className="mt-4 text-[76px] font-bold leading-none text-teal/40 transition-colors duration-500 group-hover:text-teal-deep">
                {step.n}
              </p>
              <h3 className="mt-10 text-[24px] font-semibold text-teal/70 transition-colors duration-500 group-hover:text-teal-deep">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[280px] text-[16px] leading-7 text-teal/50 transition-colors duration-500 group-hover:text-teal-deep/80">
                {step.body}
              </p>
            </div>

            <step.Icon
              size={84}
              weight="thin"
              aria-hidden
              className="self-end text-teal/40 transition-colors duration-500 group-hover:text-teal-deep"
            />
          </article>
        ))}
      </Marquee>
    </section>
  );
}
