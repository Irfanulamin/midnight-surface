import Link from "next/link";

import { GrowthChart } from "@/components/growth-chart";
import { Magnetic } from "@/components/ui/magnetic";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

export function Hero() {
  return (
    <section className="bg-dotgrid relative px-6 pb-16 pt-14 sm:pb-20 sm:pt-20 md:pb-24 md:pt-24">
      <div className="mx-auto max-w-[1160px] text-center">
        {/*
          The headline assembles word by word, then subcopy and CTAs follow as
          one group. Sequencing the two separately — rather than making the h1
          another RevealItem — is what lets the words carry the opening beat on
          their own before anything else moves.

          830px is measured off the Figma frame (1440 wide) and is what makes
          the copy break as "Everything Your / Business Needs in One / Website".
          No text-balance — it would rebalance those lines away.

          Line tops sit 92.5px apart in the Figma at 88px type => 1.05.
        */}
        <TextReveal
          as="h1"
          text="Everything Your Business Needs in One Website"
          // Only the clamp floor is mobile-specific: 7vw still resolves to the
          // measured 88px at 1440, so the desktop line breaks are untouched.
          className="mx-auto max-w-[830px] text-[clamp(2.25rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
          delay={0.15}
          stagger={0.06}
          duration={1}
          // Above the fold at load, so it must not wait to be scrolled into view.
          amount={0.1}
        />

        <RevealGroup stagger={0.11} delayChildren={0.55} amount={0.1}>
          <RevealItem>
            <p className="mx-auto mt-6 max-w-[560px] text-balance text-[16px] leading-7 text-ink-muted sm:mt-8 sm:text-[18px] sm:leading-8">
              Professional websites for small businesses—designed, developed,
              launched, and supported without breaking your bank.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
              {/* Magnetic on the primary only — the pull is the hierarchy. */}
              <Magnetic>
                <Link
                  href="/contact"
                  className="block rounded-pill bg-yellow px-6 py-3.5 text-[14px] font-semibold text-ink sm:px-8 sm:py-4 sm:text-[15px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-yellow-strong hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.35)] active:scale-[0.98]"
                >
                  Get a Free Consultation
                </Link>
              </Magnetic>
              <Link
                href="/work"
                className="rounded-pill bg-white px-6 py-3.5 text-[14px] font-semibold text-ink sm:px-8 sm:py-4 sm:text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.25)] active:scale-[0.98]"
              >
                View Our Work
              </Link>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>

      {/* Scaled up from the Figma 932px so the chart carries the hero. */}
      <div className="mx-auto mt-12 w-full max-w-[1060px] rounded-card bg-white p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_32px_80px_-40px_rgb(0_0_0/0.22)] sm:mt-16 sm:p-6 md:mt-20 md:p-8">
        {/* Fits at any width — the chart grows its own type below sm. */}
        <GrowthChart />
      </div>
    </section>
  );
}
