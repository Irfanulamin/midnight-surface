import Link from "next/link";
import { CheckSquare } from "@phosphor-icons/react/ssr";

import { SectionIntro } from "@/components/section-intro";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const landing = [
  "1 Custom Landing Page",
  "Responsive Development",
  "UI/UX Design",
  "Contact Form",
  "Basic SEO Setup",
  "Speed Optimization",
  "Speed Optimization",
  "2 Rounds of Revisions",
  "Delivery in 5–7 Days",
];

const complete = [
  "Up to 5-10 Pages",
  "Responsive Development",
  "UI/UX Design",
  "Contact Form",
  "Basic SEO Setup",
  "Speed Optimization",
  "Speed Optimization",
  "2 Rounds of Revisions",
  "Delivery in 5–7 Days",
];

export function Pricing() {
  return (
    <section className="px-6 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1160px]">
        <SectionIntro
          label="Pricing"
          heading="Affordable Website Packages for Every Business"
          headingClassName="mx-auto mt-7 max-w-[860px] text-ink"
          body="Choose the package that fits your business today, with the flexibility to scale as your needs grow"
          bodyClassName="mx-auto mt-6 max-w-[820px] text-ink-muted"
        />

        {/*
          The two packages arrive one after the other rather than together, so
          the eye is walked across the comparison instead of being handed both
          at once. `lift` is the shared hover physics from globals.css.
        */}
        <RevealGroup
          stagger={0.12}
          delayChildren={0.08}
          amount={0.2}
          className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2"
        >
          <RevealItem>
            <article className="lift relative h-full rounded-2xl bg-cream p-6 sm:p-8 md:p-10">
              <span className="absolute -top-3 right-6 -rotate-6 rounded-pill bg-coral px-4 py-1.5 text-[12px] uppercase tracking-[0.06em] text-white sm:right-14 sm:px-5 sm:py-2 sm:text-[13px]">
                Popular
              </span>
              <h3 className="text-[23px] font-semibold text-teal-deep sm:text-[28px]">
                Landing Page
              </h3>
              <p className="mt-3 text-[15px] text-ink-muted">
                Perfect for launching a product, service, or campaign.
              </p>
              <p className="mt-6 flex items-baseline gap-3 sm:mt-8">
                <span className="text-[44px] font-bold leading-none text-ink sm:text-[56px]">
                  399$
                </span>
                <span className="text-[16px] italic text-ink-muted">
                  Onetime
                </span>
              </p>
              <Link
                href="/contact"
                className="mt-6 block rounded-pill bg-yellow py-3.5 text-center text-[15px] font-medium text-ink transition-colors hover:bg-yellow-strong sm:mt-8 sm:py-4 sm:text-[16px]"
              >
                Get Started
              </Link>
              <p className="mt-8 border-t border-ink/10 pt-7 text-[15px] text-ink-muted">
                What&apos;s Included:
              </p>
              <ul className="mt-5 space-y-4">
                {landing.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px]">
                    <CheckSquare
                      size={20}
                      weight="fill"
                      aria-hidden
                      className="shrink-0 text-teal"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="lift h-full rounded-2xl bg-teal-deep p-6 text-white sm:p-8 md:p-10">
              <h3 className="text-[23px] font-semibold sm:text-[28px]">
                Complete Website
              </h3>
              <p className="mt-3 text-[15px] text-white/65">
                Perfect for launching a product, service, or campaign.
              </p>
              <p className="mt-6 flex items-baseline gap-3 sm:mt-8">
                <span className="text-[44px] font-bold leading-none sm:text-[56px]">
                  699$
                </span>
                <span className="text-[16px] italic text-white/65">
                  Onetime
                </span>
              </p>
              <Link
                href="/contact"
                className="mt-6 block rounded-pill bg-yellow py-3.5 text-center text-[15px] font-medium text-ink transition-colors hover:bg-yellow-strong sm:mt-8 sm:py-4 sm:text-[16px]"
              >
                Get Started
              </Link>
              <p className="mt-8 border-t border-white/20 pt-7 text-[15px] text-white/65">
                What&apos;s Included:
              </p>
              <ul className="mt-5 space-y-4">
                {complete.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px]">
                    <CheckSquare
                      size={20}
                      weight="fill"
                      aria-hidden
                      className="shrink-0 text-white/85"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        </RevealGroup>

        <Reveal
          delay={0.14}
          className="mt-5 flex flex-col gap-6 rounded-2xl border border-ink/10 bg-surface p-6 sm:mt-6 sm:p-8 md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div>
            <h3 className="text-[22px] font-semibold text-ink sm:text-[26px]">
              Custom Solution
            </h3>
            <p className="mt-3 max-w-[700px] text-[15px] leading-7 text-ink-muted">
              Every business is different. If your project requires custom
              features, advanced integrations, or a unique workflow, we&apos;ll
              create a tailored solution designed specifically for your goals.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 self-start rounded-pill bg-yellow px-6 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-yellow-strong sm:px-7 sm:py-4 md:self-auto"
          >
            Request a Custom Quote
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
