import { CTASection } from "@/components/CTAsection";
import Services from "@/components/ServiceScroll";
import CraftSection from "@/components/CraftSection";
import Separator from "@/components/ui/Separator";
import ServicesSection from "@/components/ServiceCards";


export default function AboutPage() {
  return (
    <main>


      <Services/>
      <ServicesSection/>
      
      <CraftSection
              title={"Architecture,\nDRIVEN BY PURPOSE"}
              paragraphs={[
                  "Every extraordinary residence begins with a quiet vision over trace paper and raw stone. Between that initial conceptual sketch and a finished sanctuary lies a complex landscape of municipal clearances, structural engineering, and artisan execution. We shepherd your project through this entire terrain with singular focus, quietly resolving every regulatory and technical challenge along the way."            
                  ,"By maintaining direct principal control over spatial design, legal entitlements, and site governance, we remove all friction from the build process. What we deliver is complete peace of mind and an uncompromised residence where every detail, sightline, and approval exists in effortless, enduring harmony.",
              ]}
              imageSrc="/craft2.avif"
              imageAlt="Craftsman working with wood in a Milan workshop"
              />
      <Separator 
        bgColor="bg-[#CCBEB5]" 
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