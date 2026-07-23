import Image from "next/image";

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
          containers whose children divide a fixed height between them, and
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

            The pinned height was 760px when the card headings were the Figma's
            ~21px. They now run at 32px, which is ~1.5x taller per line — at
            760px the flex cells were shorter than the wrapped headings and the
            text clipped against each card's overflow-hidden. 900px gives the
            enlarged type the room it needs without collapsing the 2/3/2 split.
          */
          className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:mt-16 md:h-[900px] md:grid-cols-3"
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
              {/*
                The cream panel is the top sheet of a stack: two green sheets
                (sampled #6d938e and #69928f at 75%) peek 9px and 20px above
                its edge, exactly as the Figma layers them. Only their tops are
                visible, so they are simple absolutely-positioned tabs.
              */}
              <div className="relative m-4">
                <div
                  aria-hidden
                  className="absolute inset-x-[30px] -top-5 h-8 rounded-t-[13px] bg-[#69928f]/75"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-[9px] -top-[9px] h-8 rounded-t-[15px] bg-[#6d938e]"
                />
                <div className="relative rounded-2xl bg-cream px-5 py-4 sm:px-6 sm:py-5">
                  {/*
                    The yellow is a marker strip — a half-em band sitting
                    behind the lower part of the words, per the Figma (an 18px
                    strip under 36px text) — not a full background around the
                    span. nowrap keeps the phrase on one line so the strip has
                    a single line box to span.
                  */}
                  <h3 className="text-[32px] font-semibold leading-[1.1] text-teal-deep">
                    We Made Custom Design{" "}
                    <span className="relative whitespace-nowrap">
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-[0.1em] h-[0.5em] bg-yellow"
                      />
                      <span className="relative">Not Templates</span>
                    </span>
                  </h3>
                </div>
              </div>
            </article>

            <article className="flex min-h-[120px] flex-1 items-end rounded-2xl bg-cream p-6 sm:p-7 md:min-h-0">
              <h3 className="text-[32px] font-semibold text-teal-deep">
                One Stop Solution
              </h3>
            </article>
          </RevealItem>

          {/* â”€â”€ Column 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <RevealItem className="flex flex-col gap-4 sm:gap-5">
            {/* 4x export of node 135:8153 (364x242). */}
            <article className="relative min-h-[260px] flex-1 overflow-hidden rounded-2xl bg-cream md:min-h-0">
              <h3 className="relative z-10 flex items-start gap-2 p-6 text-[32px] font-semibold leading-snug text-teal-deep sm:p-7">
                {/* Yellow sun-burst mark exported from the Figma bento (was the
                    Phosphor Sun icon). Already brand-yellow, so no colour class. */}
                <Image
                  src="/design/circle.png"
                  alt=""
                  width={192}
                  height={192}
                  className="mt-0.5 size-8 shrink-0"
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
              <h3 className="max-w-[220px] text-[32px] font-semibold leading-snug text-teal-deep">
                Responsive For All Devices
              </h3>
            </article>

            <article className="relative min-h-[360px] flex-1 overflow-hidden rounded-2xl bg-cream md:min-h-[240px]">
              {/*
                "Finish" sits on a solid coral bar that starts where the text
                starts and runs clean off the card's right edge — in the Figma
                the rectangle is wider than the card and clipped by it. A block
                span with only a left margin reproduces that: it fills the
                remaining width to the edge, no right padding to stop short.
              */}
              <h3 className="relative z-10 pt-6 text-[32px] font-semibold leading-snug text-teal-deep sm:pt-7">
                <span className="block px-6 sm:px-7">Support After</span>
                <span className="mt-1.5 ml-6 block bg-coral py-0.5 text-white sm:ml-7">
                  Finish
                </span>
              </h3>
              {/*
                Both measured off the Figma's 364x242 card (nodes 146:30551 and
                146:33186), and both sized as a share of the card so they hold
                at any width:

                  high-five   x 170, y 109, 194.4 x 133.4
                              -> right edge 364.4 and bottom edge 242.4 on a
                                 364x242 card, i.e. flush into the corner
                              -> 194.4 / 364 = 53.4% of the card

                  pinwheel    x -24, y 185.4, 114.3 square
                              -> 114.3 / 364 = 31.4% of the card
                              -> hangs 24 off the left and 57.7 below the
                                 bottom, which is 21% and 50.5% of its OWN size

                The pinwheel's bleed is written as translates of itself rather
                than as fixed px offsets. It was -left-6 / -bottom-14 before,
                which is right only on a card that happens to be exactly 364
                wide — every other width left it sitting at the wrong depth in
                the corner. As a share of its own size it stays put.
              */}
              <Image
                src="/design/bento-pinwheel.png"
                alt=""
                width={458}
                height={458}
                className="pointer-events-none absolute bottom-0 left-0 w-[25.5%]  "
              />
              <Image
                src="/design/bento-high-five.png"
                alt=""
                width={778}
                height={534}
                className="pointer-events-none absolute right-0 bottom-0 w-[44%]"
              />
            </article>
          </RevealItem>

          {/* â”€â”€ Column 3 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <RevealItem className="flex flex-col gap-4 sm:gap-5">
            <article className="flex min-h-[340px] flex-1 flex-col overflow-hidden rounded-2xl bg-cream p-5 md:min-h-0">
              <h3 className="flex items-center gap-2 px-2 pt-2 text-[32px] font-semibold text-teal-deep">
                {/* Yellow chevron exported from the Figma bento (was the
                    Phosphor CaretDoubleRight icon). */}
                <Image
                  src="/design/arrow.png"
                  alt=""
                  width={80}
                  height={92}
                  className="h-7 w-auto shrink-0"
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
                {/* The yellow spans all of "Week Not Months" in the Figma,
                    not just "Week". */}
                <p className="text-[32px] font-semibold leading-snug text-white">
                  Launch In A{" "}
                  <span className="text-yellow">Week Not Months</span>
                </p>
              </div>
            </article>

            <article className="flex min-h-[120px] flex-1 items-end rounded-2xl bg-cream p-6 sm:p-7 md:min-h-0">
              <h3 className="text-[32px] font-semibold text-teal-deep">
                Start With 0.00$
              </h3>
            </article>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
