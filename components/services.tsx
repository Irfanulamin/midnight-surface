import { ArrowDownLeft, ArrowUpRight } from "@phosphor-icons/react/ssr";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

/*
 * The Figma only specifies body copy for the first row — every other row is
 * drawn collapsed, so its content is unknown. The same placeholder is reused
 * across all of them rather than inventing eight different service blurbs.
 * The tag sets are a guess at the stack; replace both when real copy exists.
 */
const PLACEHOLDER_BODY =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.";

const services = [
  {
    name: "Website Design",
    body: PLACEHOLDER_BODY,
    tags: ["Figma", "HTML", "CSS", "Node.js"],
  },
  {
    name: "Website Development",
    body: PLACEHOLDER_BODY,
    tags: ["Next.js", "TypeScript", "Node.js"],
  },
  {
    name: "UI/UX Design",
    body: PLACEHOLDER_BODY,
    tags: ["Figma", "Prototyping", "Design Systems"],
  },
  {
    name: "Website Redesign",
    body: PLACEHOLDER_BODY,
    tags: ["Audit", "Migration", "SEO"],
  },
  {
    name: "WordPress Development",
    body: PLACEHOLDER_BODY,
    tags: ["WordPress", "PHP", "Elementor"],
  },
  {
    name: "E-commerce Development",
    body: PLACEHOLDER_BODY,
    tags: ["Shopify", "Stripe", "Headless"],
  },
  {
    name: "Custom Web Applications",
    body: PLACEHOLDER_BODY,
    tags: ["React", "APIs", "Databases"],
  },
  {
    name: "AI Integration",
    body: PLACEHOLDER_BODY,
    tags: ["LLMs", "Automation", "Chatbots"],
  },
];

export function Services() {
  return (
    <section className="bg-teal px-6 py-28 text-white">
      <div className="mx-auto max-w-[1160px]">
        <Reveal className="text-center">
          <SectionLabel tone="onTeal">Our Services</SectionLabel>
          <SectionHeading className="mt-7 text-white">
            What We Build
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[760px] text-[18px] leading-8 text-white/70">
            From simple business websites to powerful custom platforms, we
            provide complete website solutions tailored to your goals
          </p>
        </Reveal>

        {/*
          Row 1 open on load, matching the Figma's resting state.

          fixedHeight reserves the tallest panel so the section never grows or
          shrinks as rows toggle. It measures at runtime rather than using a
          hardcoded px value, which silently under-reserves as soon as the copy
          or the viewport width changes how the body text wraps.
        */}
        <Accordion defaultIndex={0} fixedHeight className="mt-20">
          {services.map((service, index) => (
            <AccordionItem
              key={service.name}
              index={index}
              className="border-b border-white/15"
              triggerClassName="flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left"
              trigger={
                <>
                  <span className="text-[26px] tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-yellow/80 group-aria-expanded:text-yellow">
                    {service.name}
                  </span>

                  {/*
                    The design uses two different glyphs for the two states, not
                    one glyph at two angles — so these cross-fade rather than
                    rotate. Both are rendered and toggled by the trigger's
                    aria-expanded, since open state cannot be passed in.
                  */}
                  <span className="relative block size-[26px] shrink-0">
                    <ArrowUpRight
                      size={26}
                      aria-hidden
                      className="absolute inset-0 text-white opacity-100 transition-opacity duration-300 group-aria-expanded:opacity-0"
                    />
                    <ArrowDownLeft
                      size={26}
                      aria-hidden
                      className="absolute inset-0 text-yellow opacity-0 transition-opacity duration-300 group-aria-expanded:opacity-100"
                    />
                  </span>
                </>
              }
            >
              <div className="flex flex-col gap-8 pb-8 md:flex-row md:items-end md:justify-between">
                <p className="max-w-[640px] text-[15px] leading-7 text-white/70">
                  {service.body}
                </p>
                <ul className="flex flex-wrap gap-3">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-pill border border-yellow px-5 py-2.5 text-[14px] text-yellow"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
