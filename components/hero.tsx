import Link from "next/link";

import { GrowthChart } from "@/components/growth-chart";
import { Magnetic } from "@/components/ui/magnetic";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

/*
 * Stacked banner: copy on top, chart underneath, the whole thing inside one
 * screen.
 *
 * The height has to be definite (h-, not min-h-). The card caps the chart with
 * max-h-full, and a percentage max-height against an auto-height ancestor
 * resolves to `none` — on min-height alone the chart kept its natural 637px and
 * pushed the section past 1400px. dvh rather than vh so mobile browser chrome
 * does not hide the bottom of the card, plus a px floor so a very short window
 * overflows instead of crushing the headline.
 *
 * Everything above the card is deliberately tight: every px of leading spent up
 * here comes straight out of the chart's share of the screen.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="bg-dotgrid relative flex h-dvh min-h-[620px] flex-col px-6 pb-8 pt-10 sm:pt-14 md:pt-16"
    >
      <div className="mx-auto max-w-[1160px] text-center">
        {/*
          The headline assembles word by word, then subcopy and CTAs follow as
          one group. Sequencing the two separately — rather than making the h1
          another RevealItem — is what lets the words carry the opening beat on
          their own before anything else moves.
        */}
        <TextReveal
          as="h1"
          text="Everything Your Business Needs in One Website"
          /*
           * Stepped down from the Figma's 88px. Now that the banner is one
           * fixed screen, the headline and the chart draw on the same budget:
           * at 88px this wrapped to three lines and left the chart 218px tall.
           * At 56px it sets in two, which hands about 200px back to the chart.
           */
          className="mx-auto max-w-[760px] text-[clamp(1.875rem,4.8vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
          delay={0.15}
          stagger={0.06}
          duration={1}
          // Above the fold at load, so it must not wait to be scrolled into view.
          amount={0.1}
        />

        <RevealGroup stagger={0.11} delayChildren={0.55} amount={0.1}>
          <RevealItem>
            <p className="mx-auto mt-4 max-w-[520px] text-balance text-[15px] leading-6 text-ink-muted sm:mt-5 sm:text-[16px] sm:leading-7">
              Professional websites for small businesses—designed, developed,
              launched, and supported without breaking your bank.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6">
              {/* Magnetic on the primary only — the pull is the hierarchy. */}
              <Magnetic>
                <Link
                  href="/contact"
                  className="block rounded-pill bg-yellow px-6 py-3 text-[14px] font-semibold text-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-yellow-strong hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.35)] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-[15px]"
                >
                  Get a Free Consultation
                </Link>
              </Magnetic>
              <Link
                href="/work"
                className="rounded-pill bg-white px-6 py-3 text-[14px] font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.25)] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                View Our Work
              </Link>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>

      {/*
        Width is the measured 1060 from the Figma, unchanged. Only the height is
        new: flex-1 + min-h-0 makes the card take the rest of the viewport, and
        max-h-full caps the chart to that rather than to its own 1.56:1 aspect,
        which is what keeps banner and chart inside one screen.
      */}
      <div className="mx-auto mt-6 flex min-h-0 w-full max-w-[1060px] flex-1 items-center justify-center rounded-card bg-white p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_32px_80px_-40px_rgb(0_0_0/0.22)] sm:mt-8 sm:p-4 md:p-6">
        {/* Fits at any width — the chart grows its own type below sm. */}
        <GrowthChart className="max-h-full" />
      </div>
    </section>
  );
}
