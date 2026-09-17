import AlliancePartners from "@/components/AlliancePartners";
import { CTASection } from "@/components/CTAsection";
import HeroReveal from "@/components/Heroreveal";
import PhilosophySection from "@/components/PhilosophySection";
import ProcessScrollJack from "@/components/processscrolljack";
import SelectedWorks from "@/components/SelectedWorks";
import Separator from "@/components/ui/Separator";

export default function Home() {
  return (
    <main className="w-full overflow-x-clip">
      {/* HERO */}
      <HeroReveal
        bwSrc="/herosketch.png"
        colorSrc="/heroimg.png"
        textTop="FROM AN IDEA"
        textBottom="TO A MASTERPIECE"
        ctaLabel="Book A Consultation"
        contactHref="/contact"
        scrollLengthVh={2.5}
        postRevealHoldVh={1}
      />

      {/*
       * IMPORTANT:
       *
       * Hero total track:
       * 450vh
       *
       * Sticky Hero releases:
       * 450 - 100 = 350vh
       *
       * Philosophy is positioned:
       * 100vh before that = 250vh
       *
       * Therefore:
       *
       * 150vh  → reveal finishes
       * 150-250vh → completed Hero hold
       * 250-350vh → Philosophy slides upward
       * 350vh → Philosophy reaches exact top
       */}
      <div className="relative z-20 -mt-[100vh] w-full">
        <PhilosophySection />
      </div>

      <ProcessScrollJack/>
      <SelectedWorks/>
      <AlliancePartners/>
      <Separator 
        bgColor="bg-[#F2E8D4]" 
        lineColor="bg-black/30" 
        className="py-6" 
      />
      <CTASection/>
      <Separator 
        bgColor="bg-[#F2E8D4]" 
        lineColor="bg-black/0" 
        className="py-2" 
      />
    </main>
  );
}