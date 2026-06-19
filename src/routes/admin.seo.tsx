import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo")({
    head: () => ({
        meta: [
            { title: "SEO & Analytics — ClickTake Admin Portal" },
            { name: "description", content: "Manage meta tags, sitemap, robots.txt, and search analytics tracking." },
        ],
    }),
    component: AdminSEO,
});

/* ───────────────── DATA TYPES ───────────────── */

type SeoPageKey = "home" | "about" | "services";

interface SeoPageMeta {
    title: string;
    desc: string;
}

/* ───────────────── MOCK DATA ───────────────── */

const initialSeoPages: Record<SeoPageKey, SeoPageMeta> = {
    home: { title: "ClickTake Technologies — AI-Powered Digital Agency", desc: "ClickTake builds AI-powered websites, apps and custom automation systems." },
    about: { title: "About Us — ClickTake Technologies", desc: "Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan." },
    services: { title: "Services — ClickTake Technologies", desc: "Explore our range of AI chatbots, Next.js web application buildouts, and Technical SEO." },
};

const initialSitemapText = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://clicktake.co/</loc><priority>1.0</priority></url>
  <url><loc>https://clicktake.co/about</loc><priority>0.8</priority></url>
  <url><loc>https://clicktake.co/services</loc><priority>0.8</priority></url>
</urlset>`;

const initialRobotsText = `User-agent: *
Allow: /
Sitemap: https://clicktake.co/sitemap.xml`;

/* ───────────────── COMPONENT ───────────────── */

function AdminSEO() {
    const [seoPages, setSeoPages] = useState<Record<SeoPageKey, SeoPageMeta>>(initialSeoPages);
    const [selectedSeoPage, setSelectedSeoPage] = useState<SeoPageKey>("home");
    const [sitemapText, setSitemapText] = useState(initialSitemapText);
    const [robotsText, setRobotsText] = useState(initialRobotsText);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">SEO Engine & Search Console</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage meta configurations and inspect organic analytics tracking.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    {Object.keys(seoPages).length} Pages Indexed
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Meta tag editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO Meta Tags Manager</h3>
                            <select
                                value={selectedSeoPage}
                                onChange={(e) => setSelectedSeoPage(e.target.value as SeoPageKey)}
                                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                            >
                                <option value="home">Home Page</option>
                                <option value="about">About Us</option>
                                <option value="services">Services</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Meta Title Tag</label>
                                <input
                                    type="text"
                                    value={seoPages[selectedSeoPage].title}
                                    onChange={(e) =>
                                        setSeoPages({
                                            ...seoPages,
                                            [selectedSeoPage]: { ...seoPages[selectedSeoPage], title: e.target.value },
                                        })
                                    }
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Meta Description Tag</label>
                                <textarea
                                    rows={3}
                                    value={seoPages[selectedSeoPage].desc}
                                    onChange={(e) =>
                                        setSeoPages({
                                            ...seoPages,
                                            [selectedSeoPage]: { ...seoPages[selectedSeoPage], desc: e.target.value },
                                        })
                                    }
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                                />
                            </div>

                            {/*
                Google SERP Preview Snippet.
                Always rendered as a fixed light "paper" card — a search-result mockup should
                look like an actual Google result regardless of the app's dark/light theme.
                Border + shadow give it clear separation from the surrounding dark glass panel
                so it never blends into the background, and every text color here is explicit
                (no inherited muted-foreground) so nothing can wash out against the white surface.
              */}
                            <div className="mt-2">
                                <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2 flex items-center gap-1.5">
                                    <ExternalLink className="h-3 w-3" /> Google SERP Preview Snippet
                                </div>
                                <div className="rounded-xl bg-white border border-black/10 shadow-lg p-4">
                                    <div className="font-sans text-left">
                                        <span className="text-[11px] text-[#202124] block truncate">https://clicktake.co</span>
                                        <span className="text-sm text-[#1a0dab] hover:underline cursor-pointer font-medium block mt-1 truncate">
                                            {seoPages[selectedSeoPage].title}
                                        </span>
                                        <span className="text-xs text-[#4d5156] block mt-1 leading-normal">
                                            {seoPages[selectedSeoPage].desc}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => toast.success("Meta tags updated across cloud servers!")}
                                className="w-full rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-bold shadow-md hover:opacity-90 transition"
                            >
                                Sync Google Meta Configuration
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sitemap & Robots.txt editors */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                            <span>sitemap.xml</span>
                            <Save
                                className="h-3.5 w-3.5 text-brand-magenta cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => toast.success("Sitemap XML rebuilt!")}
                            />
                        </div>
                        <textarea
                            rows={5}
                            value={sitemapText}
                            onChange={(e) => setSitemapText(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background p-3 text-[10px] font-mono text-foreground focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                        />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                            <span>robots.txt</span>
                            <Save
                                className="h-3.5 w-3.5 text-brand-magenta cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => toast.success("Robots.txt rules updated!")}
                            />
                        </div>
                        <textarea
                            rows={4}
                            value={robotsText}
                            onChange={(e) => setRobotsText(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background p-3 text-[10px] font-mono text-foreground focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}