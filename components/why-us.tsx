import Image from "next/image";
import { CaretDoubleRight, Sun } from "@phosphor-icons/react/ssr";

import { SectionIntro } from "@/components/section-intro";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

/*
 * Bento layout, measured off Frame 1 (cards span y 4195-4950):
 *
 *   col 1            col 2                    col 3
 *   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 *   â”‚ star card  â”‚   â”‚ Clear Communicationâ”‚   â”‚ First Delivery   â”‚
 *   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚ + Launch In A Wk â”‚
 *   â”‚ One Stop   â”‚   â”‚ Responsive For All â”‚   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 *   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚ Start With 0.00$ â”‚
 *                    â”‚ Support After      â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
 *                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
 *
 * Columns are equal height; cards flex evenly inside, giving the 2 / 3 / 2
 * split. The illustrations are `Mask group` nodes in Figma — clipped by the
 * card bounds there too — so they are absolutely positioned and allowed to
 * bleed under `overflow-hidden` rather than being scaled down to fit.
 */
export function WhyUs() {
  return (
    <section className="px-6 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1160px]">
        <SectionIntro
          label="Why Choose Us"
          heading="Built for Small Businesses That Want Results"
          headingClassName="mx-auto mt-7 max-w-[740px] text-ink"
          body="We simplify the entire website process by bringing design, development, launch, and ongoing support together under one reliable team"
          bodyClassName="mx-auto mt-6 max-w-[780px] text-ink-muted"
        />

        {/*
          Cascades column by column, left to right.

          The stagger is at column level, not card level: the columns are flex
          containers whose children divide a fixed 760px between them, and
          wrapping each card in its own animated element would put a div between
          the column and the `flex-1` that does the dividing.
        */}
        <RevealGroup
          stagger={0.12}
          delayChildren={0.1}
          amount={0.15}
          /*
            Below md the columns stack and `flex-1` has no fixed height to
            divide, so each card collapses to its content. The cards whose
            illustration is absolutely positioned would collapse to just their
            heading and the artwork would spill out, which is why those carry an
            explicit min-height that is dropped again at md.
          */
          className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:mt-16 md:h-[760px] md:grid-cols-3"
        >
          {/* â”€â”€ Column 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <RevealItem className="flex flex-col gap-4 sm:gap-5">
            {/* 4x export of node 132:8124 (366x370). */}
            <article className="relative flex min-h-[300px] flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-teal md:min-h-0">
              <Image
                src="/design/bento-star.png"
                alt=""
                width={1464}
                height={1480}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative m-4 rounded-xl bg-cream px-5 py-4 sm:px-6 sm:py-5">
                <h3 className="text-[19px] font-semibold leading-snug text-teal-deep sm:text-[21px]">
                  We Made Custom Design{" "}
                  <span className="bg-yellow px-1">Not Templates</span>
                </h3>
              </div>
            </article>

            <article className="flex min-h-[120px] flex-1 items-end rounded-2xl bg-cream p-6 sm:p-7 md:min-h-0">
              <h3 className="text-[19px] font-semibold text-teal-deep sm:text-[21px]">
                One Stop Solution
              </h3>
            </article>
          </RevealItem>

          {/* â”€â”€ Column 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <RevealItem className="flex flex-col gap-4 sm:gap-5">
            {/* 4x export of node 135:8153 (364x242). */}
            <article className="relative min-h-[260px] flex-1 overflow-hidden rounded-2xl bg-cream md:min-h-0">
              <h3 className="relative z-10 flex items-start gap-2 p-6 text-[19px] font-semibold leading-snug text-teal-deep sm:p-7 sm:text-[21px]">
                <Sun
                  size={28}
                  weight="fill"
                  aria-hidden
                  className="shrink-0 text-yellow"
                />
                <span>
                  Clear
                  <br />
                  Communication
                </span>
              </h3>
              <Image
                src="/design/bento-handshake.png"
                alt=""
                width={1456}
                height={968}
                className="pointer-events-none absolute -bottom-4 left-0 w-full"
              />
            </article>

            <article className="flex min-h-[120px] flex-1 rounded-2xl bg-cream p-6 sm:p-7 md:min-h-0">
              <h3 className="max-w-[220px] text-[19px] font-semibold leading-snug text-teal-deep sm:text-[21px]">
                Responsive For All Devices
              </h3>
            </article>

            <article className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl bg-cream md:min-h-0">
              <h3 className="relative z-10 p-6 text-[19px] font-semibold leading-snug text-teal-deep sm:p-7 sm:text-[21px]">
                Support After{" "}
                <span className="bg-coral px-1 text-white">Finish</span>
              </h3>
              {/* Yellow pinwheel sits behind the illustration, bottom-left. */}
              <Image
                src="/design/high-five-icon.png"
                alt=""
                width={362}
                height={324}
                className="pointer-events-none absolute -bottom-2 left-0 w-[86px]"
              />
              <Image
                src="/design/high-five.png"
                alt=""
                width={776}
                height={532}
                className="pointer-events-none absolute -bottom-1 left-1/2 w-[72%] -translate-x-1/2"
              />
            </article>
          </RevealItem>

          {/* â”€â”€ Column 3 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <RevealItem className="flex flex-col gap-4 sm:gap-5">
            <article className="flex min-h-[340px] flex-1 flex-col overflow-hidden rounded-2xl bg-cream p-5 md:min-h-0">
              <h3 className="flex items-center gap-2 px-2 pt-2 text-[19px] font-semibold text-teal-deep sm:text-[21px]">
                <CaretDoubleRight
                  size={22}
                  weight="fill"
                  aria-hidden
                  className="shrink-0 text-yellow"
                />
                First Delivery
              </h3>
              {/*
                NOTE: Next's image optimizer caches by URL — replacing a file in
                public/ without changing its name keeps serving the old bytes.
                Rename when you re-export, or restart the dev server.
              */}
              <Image
                src="/design/Frame.png"
                alt=""
                width={759}
                height={707}
                className="my-auto w-[62%] self-center"
              />
              <div className="rounded-xl bg-teal-deep px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-[19px] font-semibold leading-snug text-white sm:text-[21px]">
                  Launch In A <span className="text-yellow">Week</span> Not
                  Months
                </p>
              </div>
            </article>

            <article className="flex min-h-[120px] flex-1 items-end rounded-2xl bg-cream p-6 sm:p-7 md:min-h-0">
              <h3 className="text-[19px] font-semibold text-teal-deep sm:text-[21px]">
                Start With 0.00$
              </h3>
            </article>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
