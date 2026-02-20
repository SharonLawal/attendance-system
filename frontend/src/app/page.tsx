import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Workflow } from "@/components/landing/Workflow";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden antialiased selection:bg-primary/30 selection:text-white">
      {/* Aurora Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] mix-blend-screen"></div>
      </div>

      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Footer />
    </div>
  );
}

