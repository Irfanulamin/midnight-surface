import Image from "next/image";
import { CaretDoubleRight, Sun } from "@phosphor-icons/react/ssr";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/ui/reveal";

/*
 * Bento layout, measured off Frame 1 (cards span y 4195-4950):
 *
 *   col 1            col 2                    col 3
 *   ┌────────────┐   ┌────────────────────┐   ┌──────────────────┐
 *   │ star card  │   │ Clear Communication│   │ First Delivery   │
 *   ├────────────┤   ├────────────────────┤   │ + Launch In A Wk │
 *   │ One Stop   │   │ Responsive For All │   ├──────────────────┤
 *   └────────────┘   ├────────────────────┤   │ Start With 0.00$ │
 *                    │ Support After      │   └──────────────────┘
 *                    └────────────────────┘
 *
 * Columns are equal height; cards flex evenly inside, giving the 2 / 3 / 2
 * split. The illustrations are `Mask group` nodes in Figma — clipped by the
 * card bounds there too — so they are absolutely positioned and allowed to
 * bleed under `overflow-hidden` rather than being scaled down to fit.
 */
export function WhyUs() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-[1160px]">
        <Reveal className="text-center">
          <SectionLabel>Why Choose Us</SectionLabel>
          <SectionHeading className="mx-auto mt-7 max-w-[740px] text-ink">
            Built for Small Businesses That Want Results
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[780px] text-[17px] leading-7 text-ink-muted">
            We simplify the entire website process by bringing design,
            development, launch, and ongoing support together under one reliable
            team
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          amount={0.15}
          className="mt-16 grid gap-5 md:h-[760px] md:grid-cols-3"
        >
          {/* ── Column 1 ─────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* 4x export of node 132:8124 (366x370). */}
            <article className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-teal">
              <Image
                src="/design/bento-star.png"
                alt=""
                width={1464}
                height={1480}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative m-4 rounded-xl bg-cream px-6 py-5">
                <h3 className="text-[21px] font-semibold leading-snug text-teal-deep">
                  We Made Custom Design{" "}
                  <span className="bg-yellow px-1">Not Templates</span>
                </h3>
              </div>
            </article>

            <article className="flex flex-1 items-end rounded-2xl bg-cream p-7">
              <h3 className="text-[21px] font-semibold text-teal-deep">
                One Stop Solution
              </h3>
            </article>
          </div>

          {/* ── Column 2 ─────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* 4x export of node 135:8153 (364x242). */}
            <article className="relative flex-1 overflow-hidden rounded-2xl bg-cream">
              <h3 className="relative z-10 flex items-start gap-2 p-7 text-[21px] font-semibold leading-snug text-teal-deep">
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

            <article className="flex flex-1 rounded-2xl bg-cream p-7">
              <h3 className="max-w-[220px] text-[21px] font-semibold leading-snug text-teal-deep">
                Responsive For All Devices
              </h3>
            </article>

            <article className="relative flex-1 overflow-hidden rounded-2xl bg-cream">
              <h3 className="relative z-10 p-7 text-[21px] font-semibold leading-snug text-teal-deep">
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
          </div>

          {/* ── Column 3 ─────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <article className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-cream p-5">
              <h3 className="flex items-center gap-2 px-2 pt-2 text-[21px] font-semibold text-teal-deep">
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
              <div className="rounded-xl bg-teal-deep px-6 py-5">
                <p className="text-[21px] font-semibold leading-snug text-white">
                  Launch In A <span className="text-yellow">Week</span> Not
                  Months
                </p>
              </div>
            </article>

            <article className="flex flex-1 items-end rounded-2xl bg-cream p-7">
              <h3 className="text-[21px] font-semibold text-teal-deep">
                Start With 0.00$
              </h3>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
