import { ArrowUpRight } from "@phosphor-icons/react/ssr";

import { SectionIntro } from "@/components/section-intro";
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
    <section
      id="services"
      className="scroll-mt-24 bg-teal px-6 py-16 text-white sm:py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1160px]">
        <SectionIntro
          label="Our Services"
          tone="onTeal"
          heading="What We Build"
          headingClassName="mt-7 text-white"
          body="From simple business websites to powerful custom platforms, we provide complete website solutions tailored to your goals"
          bodyClassName="mx-auto mt-6 max-w-[760px] text-white/70"
        />

        {/*
          Row 1 open on load, matching the Figma's resting state.

          fixedHeight reserves the tallest panel so the section never grows or
          shrinks as rows toggle. It measures at runtime rather than using a
          hardcoded px value, which silently under-reserves as soon as the copy
          or the viewport width changes how the body text wraps.
        */}
        <Accordion
          defaultIndex={0}
          fixedHeight
          className="mt-10 sm:mt-14 md:mt-20"
        >
          {services.map((service, index) => (
            /*
              Each row reveals on its own entry rather than as one staggered
              group: the list is taller than the viewport, so a group would run
              the last rows' animations while they are still off screen and the
              user would scroll down to find them already finished.

              The delay is capped so the first rows cascade and the rest, which
              are scrolled to individually, arrive without a growing wait.
            */
            <Reveal
              key={service.name}
              delay={Math.min(index, 3) * 0.06}
              duration={0.6}
              amount={0.4}
            >
              <AccordionItem
                index={index}
                className="border-b border-white/15"
                triggerClassName="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left sm:gap-6 sm:py-7"
                trigger={
                  <>
                    <span className="text-[19px] tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-yellow/80 group-aria-expanded:text-yellow sm:text-[22px] md:text-[26px]">
                      {service.name}
                    </span>

                    {/*
                      One glyph that rotates a quarter turn, rather than two
                      glyphs cross-fading. The rotation reads as the row itself
                      turning open, and it is a single compositor transform.
                      Driven off the trigger's aria-expanded, since the
                      accordion's open state cannot be passed in.
                    */}
                    <ArrowUpRight
                      size={26}
                      aria-hidden
                      className="size-[22px] shrink-0 text-white transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-aria-expanded:rotate-90 group-aria-expanded:text-yellow sm:size-[26px]"
                    />
                  </>
                }
              >
                {/*
                  Side by side only at lg. At md the 640px paragraph leaves the
                  tag list ~80px, so every tag wrapped onto its own line and the
                  panel grew far taller than the row it was measured for —
                  which is what pushed the copy through the divider below.
                */}
                <div className="flex flex-col gap-6 pb-6 sm:gap-8 sm:pb-8 lg:flex-row lg:items-end lg:justify-between">
                  <p className="max-w-[640px] text-[15px] leading-7 text-white/70">
                    {service.body}
                  </p>
                  <ul className="flex shrink-0 flex-wrap gap-2 sm:gap-3">
                    {service.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-pill border border-yellow px-4 py-2 text-[13px] text-yellow sm:px-5 sm:py-2.5 sm:text-[14px]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
