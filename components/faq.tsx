import { CaretDown, CaretUp } from "@phosphor-icons/react/ssr";

import { SectionIntro } from "@/components/section-intro";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

/*
 * The Figma writes the same placeholder question five times and only gives the
 * second row an answer. Kept verbatim rather than inventing five FAQs — swap in
 * the real copy when it exists.
 */
const QUESTION =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

const PLACEHOLDER_ANSWER =
  "Every business is different. If your project requires custom features, advanced integrations, or a unique workflow, we'll create a tailored solution designed specifically for your goals.";

const faqs = [
  { q: QUESTION, a: PLACEHOLDER_ANSWER },
  { q: QUESTION, a: PLACEHOLDER_ANSWER },
  { q: QUESTION, a: PLACEHOLDER_ANSWER },
  { q: QUESTION, a: PLACEHOLDER_ANSWER },
  { q: QUESTION, a: PLACEHOLDER_ANSWER },
];

export function Faq() {
  return (
    <section className="px-6 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1160px]">
        <SectionIntro
          label="Common Questions"
          heading="Everything You Need to Know"
          headingClassName="mt-7 text-ink"
          body={
            <>
              Have questions? We&apos;ve answered the ones we hear most often to
              help you make an informed decision with confidence.
            </>
          }
          bodyClassName="mx-auto mt-6 max-w-[790px] text-ink-muted"
        />

        {/* Row 2 open on load, matching the Figma's resting state. */}
        {/* fixedHeight reserves the tallest panel so the block never jumps. */}
        <Accordion
          defaultIndex={1}
          fixedHeight
          className="mx-auto mt-10 max-w-[935px] space-y-3 sm:mt-16 sm:space-y-4"
        >
          {faqs.map((faq, index) => (
            // Per-row reveal, same reasoning as the services list: the set is
            // taller than the viewport, so a single group would burn the later
            // rows' animations off screen.
            <Reveal
              key={index}
              delay={Math.min(index, 3) * 0.06}
              duration={0.6}
              amount={0.4}
            >
              <AccordionItem
                index={index}
                /*
                 * The open row is cream, closed rows are white. Driven off the
                 * trigger's aria-expanded via has-*, so the primitive does not
                 * need to leak its open state back out just for styling.
                 */
                className="overflow-hidden rounded-xl bg-white transition-colors duration-300 has-[[aria-expanded=true]]:bg-cream"
                triggerClassName="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-5 text-left sm:gap-6 sm:px-7 sm:py-6"
                trigger={
                  <>
                    <span className="text-[15px] text-ink sm:text-[17px]">
                      {faq.q}
                    </span>
                    {/* Both carets render; aria-expanded picks the visible one. */}
                    <span className="relative mt-1 block size-5 shrink-0">
                      <CaretDown
                        size={20}
                        aria-hidden
                        className="absolute inset-0 text-ink opacity-100 transition-opacity duration-300 group-aria-expanded:opacity-0"
                      />
                      <CaretUp
                        size={20}
                        aria-hidden
                        className="absolute inset-0 text-ink opacity-0 transition-opacity duration-300 group-aria-expanded:opacity-100"
                      />
                    </span>
                  </>
                }
              >
                <p className="max-w-[860px] px-5 pb-5 text-[15px] leading-7 text-ink-muted sm:px-7 sm:pb-6">
                  {faq.a}
                </p>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
