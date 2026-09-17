import AboutHero from "@/components/abouthero";
import StatCards from "@/components/statcards";
import CraftSection from "@/components/CraftSection";
import Quote from "@/components/quote";
import Separator from "@/components/ui/Separator";
import Faq from "@/components/faq";


export default function AboutPage() {
  return (
    <main>
      <AboutHero
        title={"CRAFTING\nEXCELLENCE\nSINCE 2015"}
        description="We are a boutique architectural and project consultancy practice dedicated to high-end private residences. We bridge spatial design, municipal liaisoning, and technical site handling every layer of administrative and structural complexity to deliver bespoke, legally compliant interiors and estates with absolute precision and reliability."
        imageSrc="/random1.avif"
        imageAlt="placeholder"
        textureSrc="/samplebg.avif"

      />

      <StatCards
        stats={[
          {
            value: "15+",
            label: "Projects",
            description:
              "Architectural design, interior curation, municipal liaisoning, and consultancy under one roof.",
          },
          {
            value: "120K+",
            label: "Sq. ft. curated",
            description:
              "Bespoke residences and spatial designs realized for discerning clients.",
          },
          {
            value: "200+",
            label: "Happy Clients",
            description:
              "Projects managed with the highest quality and commitment.",
          },
        ]}
      />

      <Quote/>
      <Separator 
              bgColor="bg-[#CCBEB5]" 
              lineColor="bg-black/30" 
              className="py-6" 
            />

      <CraftSection
        title={"DESIGN & DISCIPLINE,\nROOTED IN THE CRAFT"}
        paragraphs={[
            "Mumbai is our foundation. Operating from our private practice, we work directly within a rich ecosystem of master craftsmen, structural engineers, and local governance. We handpick the right stone, custom millworkers, and legal specialists for every individual site, coordinating every moving part under one clear direction.",
            "By taking personal control of spatial planning, interior details, and municipal approvals under a single workflow, we remove the friction from the build process. The result is a seamless transition from initial concept to completed residence, delivered with total accountability and structural precision.",
        ]}
        imageSrc="/aboutbg.jpg"
        imageAlt="Craftsman working with wood in a Milan workshop"
        />

    <Faq/>
    </main>
  );
}