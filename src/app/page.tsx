import Navbar               from "@/components/Navbar";
import HeroSection          from "@/components/HeroSection";
import CraftSection         from "@/components/CraftSection";
import MenuSection          from "@/components/MenuSection";
import AtmosphereSection    from "@/components/AtmosphereSection";
import VisitSection         from "@/components/VisitSection";
import ScrollChoreographer  from "@/components/ScrollChoreographer";

export default function HomePage() {
  return (
    <>
      {/* Pure side-effect: GSAP ScrollTrigger + cup waypoints */}
      <ScrollChoreographer />

      <Navbar />

      <main>
        <HeroSection />
        <CraftSection />
        <MenuSection />
        <AtmosphereSection />
        <VisitSection />
      </main>
    </>
  );
}
