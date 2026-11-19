import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/footer/Footer";
import StickyScene from "@/components/three/StickyScene";
import TechMarquee from "@/components/ui/TechMarquee";

export default function Home() {
  return (
    <main className="relative">
      {/* Sticky 3D model - stays visible while scrolling */}
      <StickyScene />

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <About />
        <TechMarquee />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}