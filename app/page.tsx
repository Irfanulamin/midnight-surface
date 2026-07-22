import { CtaBanner } from "@/components/cta-banner";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { OurWork } from "@/components/our-work";
import { Pricing } from "@/components/pricing";
import { Process } from "@/components/process";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { TrustedBy } from "@/components/trusted-by";
import { WhyUs } from "@/components/why-us";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <Services />
        <WhyUs />
        <OurWork />
        <Process />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
