"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

export type Testimonial = {
  name: string;
  role: string;
  rating: string;
  quote: string;
  image: string;
  /** Intrinsic size of the export, so Next can reserve the right box. */
  width: number;
  height: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** How long each slide holds, and how long the bar takes to fill. */
const AUTOPLAY_DELAY = 5200;

/*
 * The Success Stories carousel.
 *
 * THE PROGRESS BAR IS THE CLOCK. When its fill animation ends, the carousel
 * advances. There is no autoplay timer running alongside it.
 *
 * This started as Embla's autoplay plugin with the CSS bar set to the same
 * delay, and the two drifted apart, because they were never measuring the same
 * thing: the plugin schedules its next advance around the scroll animation
 * settling, while the bar restarted the moment the slide index changed, which
 * is when that scroll *begins*. So the bar always finished early and sat full
 * while the carousel took its time. Matching the numbers cannot fix that — the
 * offset is the transition itself, and any figure that lined them up would
 * break the moment the scroll duration changed.
 *
 * Driving one from the other makes them the same event. The bar fills, its
 * `animationend` fires, the slide advances, `select` remounts the bar and it
 * starts again. Pausing on hover comes free and stays exact: pausing the
 * animation pauses the thing that triggers the advance, rather than pausing a
 * separate timer and hoping the two resume together.
 *
 * The bar renders inside every slide because the design puts it in the card,
 * so only the current slide's bar is wired up — all three animate, but three
 * `animationend` handlers would advance the carousel three times.
 *
 * Under reduced motion there is no animation, so there is nothing to end and
 * the carousel never moves on its own. It stays fully usable by drag and
 * keyboard.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  /*
   * Nothing runs until the section is fully on screen.
   *
   * Without this the carousel spends the whole page scrolling through its
   * slides off screen, and by the time the reader arrives it is part way
   * through a quote with the bar half full. `amount: "all"` holds it until the
   * whole carousel is in view, so the countdown only ever starts from full on a
   * quote the reader can actually see. No `once`: it stops again when the
   * section leaves, not just starts when it first arrives.
   *
   * Pausing the fill is all it takes. The fill is what advances the carousel,
   * so a paused bar is a stopped carousel, and it holds its position rather
   * than resetting, so scrolling back finds it where it was left.
   */
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: "all" });

  useEffect(() => {
    if (!api) return;
    // Subscribe only. Embla starts on slide 0, which is what `selected`
    // already holds, so there is nothing to read synchronously — and reading
    // it here would be a setState inside an effect, which the lint rules
    // reject for exactly the cascading-render reason they describe.
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  return (
    /* `group` is what lets the countdown bar pause when the pointer is over
       the carousel. */
    <div ref={ref} className="group mt-10 sm:mt-16">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start", duration: 32 }}
        className="w-full"
      >
        {/*
          The generated CarouselContent carries a negative margin to pair with
          per-item padding. There is one slide across at every width here, so
          the gutter is zeroed rather than fought.
        */}
        <CarouselContent className="ml-0">
          {items.map((item, i) => (
            <CarouselItem key={item.name} className="pl-0">
              {/*
                Portrait and quote sit flush at md, exactly as in the design.
                Stacked below that they read as one broken card, so they only
                close up once they are side by side.
              */}
              <div className="flex flex-col gap-4 md:flex-row md:gap-1">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={item.width}
                  height={item.height}
                  className="h-[320px] w-full shrink-0 rounded-2xl object-cover object-top sm:h-[380px] md:h-[405px] md:w-[287px] md:object-center"
                />

                <div className="flex flex-1 flex-col justify-between rounded-2xl bg-white p-6 sm:p-8 md:p-11">
                  <div>
                    <p className="max-w-[740px] text-[19px] leading-[1.4] tracking-[-0.01em] text-ink sm:text-[22px] md:text-[26px] md:leading-[1.35]">
                      {item.quote}
                    </p>
                    <p className="mt-6 text-[15px] text-ink-muted">
                      Recommendation:{" "}
                      <span className="text-coral">{item.rating}</span>
                    </p>
                  </div>

                  {/*
                    Name on the left, slide counter on the right, on one line at
                    the foot of the card — the row the design draws.

                    The counter lives inside the card rather than under the
                    carousel, so it has to be rendered per slide. It reads the
                    shared `selected` state, not anything from `item`, so every
                    slide shows the same figure and it looks like one fixed
                    control rather than something travelling with the quote.
                  */}
                  <div className="mt-8 flex items-end justify-between gap-6 sm:mt-10">
                    <div>
                      <p className="text-[18px] font-semibold text-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[15px] text-ink-muted">
                        {item.role}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-[14px]">
                      <span className="text-ink tabular-nums">
                        {pad(selected + 1)}
                      </span>
                      {/*
                        `key` is what makes this a countdown. Remounting the
                        element on every slide change restarts the CSS
                        animation from empty — restarting an animation in place
                        otherwise means removing the class, forcing a reflow
                        and adding it back, which is a DOM hack where React
                        already has the right tool.

                        Reduced motion has no countdown to show, so it falls
                        back to what the bar means statically: how far through
                        the set you are.
                      */}
                      <Progress
                        key={selected}
                        value={
                          reduce ? ((selected + 1) / items.length) * 100 : 0
                        }
                        indicatorClassName={
                          reduce
                            ? undefined
                            : `progress-fill group-hover:[animation-play-state:paused] ${
                                inView ? "" : "[animation-play-state:paused]"
                              }`
                        }
                        style={
                          {
                            "--progress-duration": `${AUTOPLAY_DELAY}ms`,
                          } as React.CSSProperties
                        }
                        /*
                          Only the visible slide's bar advances the carousel.
                          All three fill together, and three handlers would
                          scroll three slides at once. `animationend` bubbles,
                          so catching it on the root picks up the fill inside.
                        */
                        onAnimationEnd={
                          i === selected
                            ? () => api?.scrollNext()
                            : undefined
                        }
                        aria-label={`Testimonial ${selected + 1} of ${items.length}`}
                        className="w-16 sm:w-20"
                      />
                      <span className="text-ink/40 tabular-nums">
                        {pad(items.length)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
