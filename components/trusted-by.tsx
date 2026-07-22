import Image from "next/image";

import { SectionIntro } from "@/components/section-intro";
import { Marquee } from "@/components/ui/marquee";

/* Client marks, exported from Figma. */
const clients = [
  { src: "/design/client-01.png", alt: "Barbershop KEL" },
  { src: "/design/client-02.png", alt: "Berkan's Barbershop" },
  { src: "/design/client-03.png", alt: "MC" },
  { src: "/design/client-04.png", alt: "The Golf Lab" },
  { src: "/design/client-05.png", alt: "Highballs Golf" },
  { src: "/design/client-06.png", alt: "Ri" },
];

export function TrustedBy() {
  return (
    <section className="px-6 py-14 sm:py-20 md:py-24">
      <SectionIntro
        className="mx-auto max-w-[1160px]"
        heading="Businesses That Trust Our Work"
        headingClassName="mx-auto max-w-[640px] text-ink"
        body={
          <>
            We&apos;re proud to partner with businesses across different
            industries, helping them build a strong online presence with
            websites that deliver real results
          </>
        }
        bodyClassName="mx-auto mt-6 max-w-[790px] text-ink-muted"
      />

      <Marquee duration={45} className="mt-10 sm:mt-16">
        {clients.map((client) => (
          <div
            key={client.src}
            /* No hover treatment — these are client marks scrolling past, not
               things to interact with. */
            className="grid h-[168px] w-[170px] shrink-0 place-items-center rounded-2xl bg-cream p-8 sm:h-[248px] sm:w-[250px] sm:p-12"
          >
            <Image
              src={client.src}
              alt={client.alt}
              width={608}
              height={320}
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
