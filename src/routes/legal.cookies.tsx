import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cookie, Calendar, Settings, Info } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";

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
          <div className="border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow mb-4">
              <Cookie className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Cookie Policy & Preferences
            </h1>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground justify-center sm:justify-start">
              <Calendar className="h-3.5 w-3.5" /> Last Updated: May 26, 2026
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            
            {/* Policy Info */}
            <div className="space-y-6 text-sm leading-7 text-muted-foreground">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-cyan-400" /> What are Cookies?
                </h2>
                <p>
                  Cookies are small text files placed on your device to store data that can be recalled by a web server in the domain that placed the cookie. We use cookies and similar technologies for storing and respecting your preferences and settings, analyzing how our site performs, and targeting promotional campaigns.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground mb-3">How We Classify Our Cookies</h2>
                <div className="space-y-4">
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <strong className="text-foreground">Essential Cookies:</strong> Required to enable core site functionality such as secure login authentication, routing systems, and contact form submissions. These cannot be disabled.
                  </div>
                  <div className="border-l-2 border-violet-500 pl-4">
                    <strong className="text-foreground">Analytical Cookies:</strong> Help us gather anonymous traffic patterns, monitor loading speeds, and observe user interaction statistics via Google Analytics.
                  </div>
                  <div className="border-l-2 border-fuchsia-500 pl-4">
                    <strong className="text-foreground">Marketing & Advertising Cookies:</strong> Used to track ad conversion performance and serve relevant ClickTake banners on social media networks (e.g. LinkedIn, Meta).
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Control Preferences Card */}
            <div>
              <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Settings className="h-4 w-4 text-violet-400" />
                  <h3 className="font-display font-bold text-sm text-foreground">Preferences Control</h3>
                </div>

                {/* Essential Switch */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-foreground">Essential Cookies</div>
                    <div className="text-muted-foreground text-[10px]">Always active</div>
                  </div>
                  <input
                    type="checkbox"
                    disabled
                    checked={essential}
                    className="h-4 w-8 rounded-full bg-cyan-500/20 text-cyan-500 focus:ring-0 accent-cyan-400 cursor-not-allowed"
                  />
                </div>

                {/* Analytics Switch */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-foreground">Analytics Tracker</div>
                    <div className="text-muted-foreground text-[10px]">Measure traffic stats</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-8 rounded-full focus:ring-0 accent-violet-500 cursor-pointer"
                  />
                </div>

                {/* Marketing Switch */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-foreground">Marketing Pixel</div>
                    <div className="text-muted-foreground text-[10px]">Ad retargeting tags</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-8 rounded-full focus:ring-0 accent-fuchsia-500 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-2.5 text-xs font-semibold text-white shadow hover:scale-[1.02] transition-transform"
                >
                  Save Settings
                </button>

                {saveSuccess && (
                  <div className="text-center text-[10px] text-green-400 animate-pulse font-medium">
                    Preferences saved successfully!
                  </div>
                )}
              </form>
            </div>

          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
