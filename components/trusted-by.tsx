import Image from "next/image";

import { SectionHeading } from "@/components/section-label";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";

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
    <section className="px-6 py-24">
      <Reveal className="mx-auto max-w-[1160px] text-center">
        <SectionHeading className="mx-auto max-w-[640px] text-ink">
          Businesses That Trust Our Work
        </SectionHeading>
        <p className="mx-auto mt-6 max-w-[790px] text-[17px] leading-7 text-ink-muted">
          We&apos;re proud to partner with businesses across different
          industries, helping them build a strong online presence with websites
          that deliver real results
        </p>
      </Reveal>

      <Marquee duration={45} className="mt-16">
        {clients.map((client) => (
          <div
            key={client.src}
            className="grid h-[248px] w-[250px] shrink-0 place-items-center rounded-2xl bg-cream p-12"
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
