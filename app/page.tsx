import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import WorkingSection from "@/components/WorkingSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mx-8">
        <HeroSection />
        <AboutSection />
        <WorkingSection />
        <ContactSection />
      </div>
      <Footer />
    </>
  );
}
