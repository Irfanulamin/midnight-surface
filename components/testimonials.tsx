import Image from "next/image";

import { SectionIntro } from "@/components/section-intro";
import { Parallax } from "@/components/ui/parallax";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

export function Testimonials() {
  return (
    <section
      id="success-stories"
      className="relative scroll-mt-24 overflow-hidden bg-cream px-6 py-16 sm:py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-[1160px]">
        <SectionIntro
          label="Success Stories"
          heading="Real Results for Real Businesses"
          headingClassName="mx-auto mt-7 max-w-[700px] text-ink"
          body={
            <>
              Every website we build is designed to solve business challenges
              and drive growth. Here&apos;s how we&apos;ve helped our clients
              succeed.
            </>
          }
          bodyClassName="mx-auto mt-6 max-w-[790px] text-ink-muted"
        />

        {/* Portrait comes in from the left, quote from the right — they meet. */}
        {/*
          Flush against each other in the design. Stacked on mobile that reads
          as one broken card, so the two only close up once they sit side by
          side at md.
        */}
        <RevealGroup
          stagger={0.14}
          className="mt-10 flex flex-col gap-4 sm:mt-16 md:flex-row md:gap-0"
        >
          <RevealItem direction="left" className="shrink-0">
            {/*
              The portrait drifts against the scroll while the quote card stays
              put, which separates the two planes — the section reads as a
              person standing in front of the quote rather than beside it.
              Small distance: the row is only 405px tall and anything larger
              pulls the portrait off the card's top edge.
            */}
            <Parallax distance={26}>
              <Image
                src="/design/testimonial-kazi.png"
                alt="Kazi Mirajul Islam"
                width={287}
                height={405}
                className="h-[320px] w-full rounded-2xl object-cover object-top sm:h-[380px] md:h-[405px] md:w-[287px] md:object-center"
              />
            </Parallax>
          </RevealItem>

          <RevealItem
            direction="right"
            className="flex flex-1 flex-col justify-between rounded-2xl bg-white p-6 sm:p-8 md:p-11"
          >
            <div>
              <p className="max-w-[740px] text-[19px] leading-[1.4] tracking-[-0.01em] text-ink sm:text-[22px] md:text-[26px] md:leading-[1.35]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <p className="mt-6 text-[15px] text-ink-muted">
                Recommendation: <span className="text-coral">10/10</span>
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-6 sm:mt-10">
              <div>
                <p className="text-[18px] font-semibold text-ink">
                  Kazi Mirajul Islam
                </p>
                <p className="mt-1 text-[15px] text-ink-muted">
                  CEO, XYZ Studio
                </p>
              </div>
              <div className="flex items-center gap-3 text-[14px]">
                <span className="text-ink">01</span>
                <span className="h-px w-10 bg-ink" />
                <span className="h-px w-10 bg-ink/20" />
                <span className="text-ink/40">03</span>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
