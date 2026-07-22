import Image from "next/image";

import { SectionHeading, SectionLabel } from "@/components/section-label";
import { HorizontalPan } from "@/components/ui/horizontal-pan";
import { Reveal } from "@/components/ui/reveal";

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
          <Reveal className="mx-auto w-full max-w-[1160px] px-6" direction="left">
            <SectionLabel>Our Work</SectionLabel>
            <SectionHeading className="mt-7 max-w-[620px] text-ink">
              Websites That Deliver Real Results
            </SectionHeading>
            <p className="mt-6 max-w-[640px] text-[17px] leading-7 text-ink-muted">
              Every project is designed with one goal in mind—helping businesses
              attract more customers, generate leads, and grow online
            </p>
          </Reveal>
        }
      >
        {projects.map((project, index) => (
          <article key={index} className="w-[420px] shrink-0">
            {/*
              Natural aspect ratio, no object-cover — the shots are 1853x2023
              and cropping to a fixed height was cutting the bottom off.
            */}
            <Image
              src={project.src}
              alt={project.title}
              width={1853}
              height={2023}
              className="h-auto w-full rounded-xl"
            />
            <h3 className="mt-7 text-[26px] font-semibold tracking-[-0.01em] text-ink">
              {project.title}
            </h3>
            <p className="mt-3 text-[15px] leading-7 text-ink-muted">
              {project.body}
            </p>
          </article>
        ))}
      </HorizontalPan>
    </section>
  );
}
