import {
  CursorClick,
  FastForward,
  IdentificationCard,
  Lightbulb,
  Rocket,
  TrendUp,
} from "@phosphor-icons/react/ssr";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { HorizontalPan } from "@/components/ui/horizontal-pan";
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

// Step 03 is the highlighted card in the design.
const ACTIVE = 2;

export function Process() {
  return (
    <section>
      <HorizontalPan
        gapClassName="gap-5"
        header={
          <Reveal className="mx-auto w-full max-w-[1160px] px-6 text-center">
            <SectionLabel>How It Works</SectionLabel>
            <SectionHeading className="mx-auto mt-7 max-w-[820px] text-ink">
              A Simple Process From Idea to Launch
            </SectionHeading>
            <p className="mx-auto mt-6 max-w-[790px] text-[17px] leading-7 text-ink-muted">
              We&apos;ve created a clear, collaborative process that keeps your
              project moving smoothly from the first conversation to a
              successful launch
            </p>
          </Reveal>
        }
      >
        {steps.map((step, index) => {
          const active = index === ACTIVE;
          return (
            <article
              key={step.n}
              className={`flex h-[500px] w-[340px] shrink-0 flex-col justify-between rounded-2xl p-8 ${
                active ? "bg-yellow" : "bg-cream"
              }`}
            >
              <div>
                <p
                  className={`text-[15px] tracking-[0.06em] ${
                    active ? "text-teal" : "text-teal/60"
                  }`}
                >
                  /STEPS
                </p>
                <p
                  className={`mt-4 text-[76px] font-bold leading-none ${
                    active ? "text-teal-deep" : "text-teal/40"
                  }`}
                >
                  {step.n}
                </p>
                <h3
                  className={`mt-10 text-[24px] font-semibold ${
                    active ? "text-teal-deep" : "text-teal/70"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`mt-4 max-w-[280px] text-[16px] leading-7 ${
                    active ? "text-teal-deep/80" : "text-teal/50"
                  }`}
                >
                  {step.body}
                </p>
              </div>

              <step.Icon
                size={84}
                weight="thin"
                aria-hidden
                className={`self-end ${
                  active ? "text-teal-deep" : "text-teal/40"
                }`}
              />
            </article>
          );
        })}
      </HorizontalPan>
    </section>
  );
}
