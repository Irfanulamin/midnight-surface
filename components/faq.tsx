import { CaretDown, CaretUp } from "@phosphor-icons/react/ssr";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

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
    <section className="px-6 py-28">
      <div className="mx-auto max-w-[1160px]">
        <div className="text-center">
          <SectionLabel>Common Questions</SectionLabel>
          <SectionHeading className="mt-7 text-ink">
            Everything You Need to Know
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[790px] text-[17px] leading-7 text-ink-muted">
            Have questions? We&apos;ve answered the ones we hear most often to
            help you make an informed decision with confidence.
          </p>
        </div>

        {/* Row 2 open on load, matching the Figma's resting state. */}
        <Accordion
          defaultIndex={1}
          className="mx-auto mt-16 max-w-[935px] space-y-4"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              index={index}
              /*
               * The open row is cream, closed rows are white. Driven off the
               * trigger's aria-expanded via has-*, so the primitive does not
               * need to leak its open state back out just for styling.
               */
              className="overflow-hidden rounded-xl bg-white transition-colors duration-300 has-[[aria-expanded=true]]:bg-cream"
              triggerClassName="flex w-full cursor-pointer items-start justify-between gap-6 px-7 py-6 text-left"
              trigger={
                <>
                  <span className="text-[17px] text-ink">{faq.q}</span>
                  {/* Both carets render; aria-expanded picks which is visible. */}
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
              <p className="max-w-[860px] px-7 pb-6 text-[15px] leading-7 text-ink-muted">
                {faq.a}
              </p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
