import Image from "next/image";

import { SectionIntro } from "@/components/section-intro";
import { HorizontalPan } from "@/components/ui/horizontal-pan";
import { CurtainReveal } from "@/components/ui/reveal";

const projects = [
  {
    src: "/design/work-01.png",
    title: "Website Development",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    src: "/design/work-02.png",
    title: "Website Development",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    src: "/design/work-01.png",
    title: "Website Development",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    src: "/design/work-02.png",
    title: "Website Development",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];

export function OurWork() {
  return (
    <section>
      <HorizontalPan
        header={
          /* Left-aligned in the design, unlike its sibling sections. */
          <SectionIntro
            align="left"
            className="mx-auto w-full max-w-[1160px] px-6"
            label="Our Work"
            heading="Websites That Deliver Real Results"
            headingClassName="mt-7 max-w-[620px] text-ink"
            body="Every project is designed with one goal in mind—helping businesses attract more customers, generate leads, and grow online"
            bodyClassName="mt-6 max-w-[640px] text-ink-muted"
          />
        }
      >
        {projects.map((project, index) => (
          <article
            key={index}
            className="flex w-full flex-col md:h-full md:w-[420px] md:shrink-0"
          >
            {/*
              Each shot is covered by a teal panel that lifts away as the card
              arrives, so the work is revealed rather than just appearing.
              rounded-xl lives on the wrapper so the cover is clipped to the
              same corners as the image beneath it.
            */}
            <CurtainReveal
              className="rounded-xl md:min-h-0 md:flex-1"
              delay={0.05}
            >
              {/*
                Stacked on mobile the shot keeps its natural 1853x2023 ratio.

                Inside the pin it cannot: the section is exactly one viewport
                tall, and at 420px wide this image is ~460px high, which pushed
                the title and body below the fold where they were unreachable.
                So on md it fills the height the track has left over and crops,
                anchored to the top — these are website screenshots, and the top
                of the page is the part worth showing.
              */}
              <Image
                src={project.src}
                alt={project.title}
                width={1853}
                height={2023}
                className="h-auto w-full md:h-full md:object-cover md:object-top"
              />
            </CurtainReveal>
            <h3 className="mt-5 shrink-0 text-[22px] font-semibold tracking-[-0.01em] text-ink sm:text-[26px] md:mt-6">
              {project.title}
            </h3>
            <p className="mt-3 shrink-0 text-[15px] leading-7 text-ink-muted">
              {project.body}
            </p>
          </article>
        ))}
      </HorizontalPan>
    </section>
  );
}
