import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SEOHead } from "@/components/SEOHead";

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
  const [seo, setSeo] = useState({
    title: "ClickTake Technologies — AI-Powered Digital Agency · UK & Pakistan",
    description: "ClickTake builds AI-powered websites, apps and growth systems.",
    canonical: "",
    ogImage: ""
  });

  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;
        if (data) {
          const settingsMap: Record<string, string> = {};
          data.forEach(item => {
            settingsMap[item.key] = item.value;
          });
          
          setSeo({
            title: settingsMap['seo_title'] || settingsMap['meta_title'] || settingsMap['site_title'] || "ClickTake Technologies — AI-Powered Digital Agency · UK & Pakistan",
            description: settingsMap['seo_description'] || settingsMap['meta_description'] || settingsMap['site_description'] || "ClickTake builds AI-powered websites, apps and growth systems.",
            canonical: settingsMap['seo_canonical'] || settingsMap['canonical_url'] || "",
            ogImage: settingsMap['seo_og_image'] || settingsMap['og_image_url'] || settingsMap['logo_url'] || ""
          });
        }
      } catch (err) {
      }
    };
    fetchSeoSettings();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SEOHead 
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical || undefined}
        ogImage={seo.ogImage || undefined}
      />
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