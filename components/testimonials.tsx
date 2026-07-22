import Image from "next/image";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-28">
      <div className="relative mx-auto max-w-[1160px]">
        <Reveal className="text-center">
          <SectionLabel>Success Stories</SectionLabel>
          <SectionHeading className="mx-auto mt-7 max-w-[700px] text-ink">
            Real Results for Real Businesses
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[790px] text-[17px] leading-7 text-ink-muted">
            Every website we build is designed to solve business challenges and
            drive growth. Here&apos;s how we&apos;ve helped our clients succeed.
          </p>
        </Reveal>

        {/* Portrait comes in from the left, quote from the right — they meet. */}
        <RevealGroup
          stagger={0.14}
          className="mt-16 flex flex-col gap-0 md:flex-row"
        >
          <RevealItem direction="left" className="shrink-0">
            <Image
              src="/design/testimonial-kazi.png"
              alt="Kazi Mirajul Islam"
              width={287}
              height={405}
              className="h-[405px] w-[287px] rounded-2xl object-cover"
            />
          </RevealItem>

          <RevealItem
            direction="right"
            className="flex flex-1 flex-col justify-between rounded-2xl bg-white p-11"
          >
            <div>
              <p className="max-w-[740px] text-[26px] leading-[1.35] tracking-[-0.01em] text-ink">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <p className="mt-6 text-[15px] text-ink-muted">
                Recommendation: <span className="text-coral">10/10</span>
              </p>
            </div>

            <div className="mt-10 flex items-end justify-between gap-6">
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
