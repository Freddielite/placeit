import { Hero } from "./_molecules/hero";
import { Marquee } from "./_molecules/marquee";
import { Stats } from "./_molecules/stats";
import { OpportunitiesPreview } from "./_molecules/opportunities-preview";
import { Services } from "./_molecules/services";
import { HowItWorks } from "./_molecules/how-it-works";
import { BulkApply } from "./_molecules/bulk-apply";
import { ForCompanies } from "./_molecules/for-companies";
import { Testimonials } from "./_molecules/testimonials";
import { CtaBanner } from "./_molecules/cta-banner";
import { Faqs } from "./_molecules/faqs";
import { Reveal } from "./_molecules/reveal";
import { WhoIsItFor } from "./_molecules/who-is-it-for";
import { MobileCtaBar } from "./_molecules/mobile-cta-bar";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Reveal>
        <WhoIsItFor />
      </Reveal>
      <Reveal>
        <OpportunitiesPreview />
      </Reveal>
      <Reveal>
        <Services />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <BulkApply />
      </Reveal>
      <Reveal>
        <ForCompanies />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <CtaBanner />
      </Reveal>
      <Reveal>
        <Faqs />
      </Reveal>
      <MobileCtaBar />
    </>
  );
}
