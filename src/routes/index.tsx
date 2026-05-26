import { createFileRoute } from "@tanstack/react-router";

import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact"; // ✅ FIXED (DO NOT import from routes)

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "ClickTake Technologies — AI-Powered Digital Agency · UK & Pakistan",
      },
      {
        name: "description",
        content:
          "ClickTake builds AI-powered websites, apps and growth systems.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background */}
      <BackgroundScene />

      {/* Cursor */}
      <CustomCursor />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <Work />
        <Process />
        <Testimonials />
        <Contact />
        <About />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}