import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cookie, Calendar, Settings, Info } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { motion } from "framer-motion";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy & Preferences — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Manage cookie preferences and read the cookie policy for ClickTake Technologies Ltd.",
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const [essential, setEssential] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        <section className="mx-auto max-w-4xl px-4 py-12">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-border/50 pb-8 mb-8 text-center sm:text-left relative"
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-32 h-32 bg-emerald-500/20 blur-[50px] -z-10 rounded-full" />
            
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-glow mb-4">
              <Cookie className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Cookie Policy & Preferences
            </h1>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground justify-center sm:justify-start bg-secondary/50 border border-border px-3 py-1.5 rounded-full backdrop-blur-sm w-fit mx-auto sm:mx-0">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Last Updated: May 26, 2026
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            
            {/* Policy Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 text-sm leading-7 text-muted-foreground"
            >
              <div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm">
                <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-cyan-400" /> What are Cookies?
                </h2>
                <p>
                  Cookies are small text files placed on your device to store data that can be recalled by a web server in the domain that placed the cookie. We use cookies and similar technologies for storing and respecting your preferences and settings, analyzing how our site performs, and targeting promotional campaigns.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm">
                <h2 className="text-lg font-display font-bold text-foreground mb-4">How We Classify Our Cookies</h2>
                <div className="space-y-4">
                  <div className="border-l-2 border-cyan-500 pl-4 py-1">
                    <strong className="text-foreground block mb-1">Essential Cookies</strong>
                    Required to enable core site functionality such as secure login authentication, routing systems, and contact form submissions. These cannot be disabled.
                  </div>
                  <div className="border-l-2 border-violet-500 pl-4 py-1">
                    <strong className="text-foreground block mb-1">Analytical Cookies</strong>
                    Help us gather anonymous traffic patterns, monitor loading speeds, and observe user interaction statistics via Google Analytics.
                  </div>
                  <div className="border-l-2 border-fuchsia-500 pl-4 py-1">
                    <strong className="text-foreground block mb-1">Marketing & Advertising Cookies</strong>
                    Used to track ad conversion performance and serve relevant ClickTake banners on social media networks (e.g. LinkedIn, Meta).
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Custom Control Preferences Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-elegant space-y-5 sticky top-32">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Settings className="h-4 w-4 text-violet-400" />
                  <h3 className="font-display font-bold text-sm text-foreground">Preferences Control</h3>
                </div>

                {/* Essential Switch */}
                <div className="flex items-center justify-between text-xs group">
                  <div>
                    <div className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">Essential Cookies</div>
                    <div className="text-muted-foreground text-[10px]">Always active</div>
                  </div>
                  <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-cyan-500/50 cursor-not-allowed">
                    <span className="translate-x-5 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition" />
                  </div>
                </div>

                {/* Analytics Switch */}
                <div className="flex items-center justify-between text-xs group">
                  <div>
                    <div className="font-bold text-foreground group-hover:text-violet-400 transition-colors">Analytics Tracker</div>
                    <div className="text-muted-foreground text-[10px]">Measure traffic stats</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalytics(!analytics)}
                    className={`${
                      analytics ? 'bg-violet-500' : 'bg-muted'
                    } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background`}
                  >
                    <span className={`${analytics ? 'translate-x-5' : 'translate-x-1'} inline-block h-3.5 w-3.5 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {/* Marketing Switch */}
                <div className="flex items-center justify-between text-xs group">
                  <div>
                    <div className="font-bold text-foreground group-hover:text-fuchsia-400 transition-colors">Marketing Pixel</div>
                    <div className="text-muted-foreground text-[10px]">Ad retargeting tags</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMarketing(!marketing)}
                    className={`${
                      marketing ? 'bg-fuchsia-500' : 'bg-muted'
                    } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-background`}
                  >
                    <span className={`${marketing ? 'translate-x-5' : 'translate-x-1'} inline-block h-3.5 w-3.5 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-semibold text-white shadow-glow hover:scale-[1.02] transition-all duration-300"
                >
                  Save Settings
                </button>

                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[11px] text-emerald-400 font-medium"
                  >
                    Preferences saved successfully!
                  </motion.div>
                )}
              </form>
            </motion.div>

          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
