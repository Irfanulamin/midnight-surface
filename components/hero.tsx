import Link from "next/link";

import { GrowthChart } from "@/components/growth-chart";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export function Hero() {
  return (
    <section className="bg-dotgrid relative px-6 pb-24 pt-24">
      {/*
        Staggered entrance: eyebrow-less hero, so the sequence is headline ->
        subcopy -> CTAs. Each element arrives on the same curve a beat after the
        last, which reads as composed rather than everything snapping in at once.
      */}
      <RevealGroup
        stagger={0.11}
        delayChildren={0.1}
        amount={0.1}
        className="mx-auto max-w-[1160px] text-center"
      >
        {/*
          830px is measured off the Figma frame (1440 wide) and is what makes
          the copy break as "Everything Your / Business Needs in One / Website".
          No text-balance — it would rebalance those lines away.
        */}
        <RevealItem>
          <h1 className="mx-auto max-w-[830px] text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-ink">
            Everything Your Business Needs in One Website
          </h1>
        </RevealItem>

        <RevealItem>
          <p className="mx-auto mt-8 max-w-[560px] text-balance text-[17px] leading-7 text-ink-muted">
            Professional websites for small businesses—designed, developed,
            launched, and supported without breaking your bank.
          </p>
        </RevealItem>

        <RevealItem>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-pill bg-yellow px-8 py-4 text-[15px] font-semibold text-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-yellow-strong hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.35)] active:scale-[0.98]"
            >
              Get a Free Consultation
            </Link>
            <Link
              href="/work"
              className="rounded-pill bg-white px-8 py-4 text-[15px] font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.25)] active:scale-[0.98]"
            >
              View Our Work
            </Link>
          </div>
        </RevealItem>
      </RevealGroup>

      {/* Scaled up from the Figma 932px so the chart carries the hero. */}
      <div className="mx-auto mt-20 w-full max-w-[1060px] rounded-card bg-white p-8 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_32px_80px_-40px_rgb(0_0_0/0.22)]">
        <GrowthChart />
      </div>
    </section>
  );
}
