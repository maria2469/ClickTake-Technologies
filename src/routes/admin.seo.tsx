import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

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

type SeoPageKey = "home" | "about" | "contact" | "portfolio" | "resources" | "services" | "services_seo" | "services_starter_kit" | "services_ai_chatbots" | "services_ai_llm" | "services_ai_cv_nlp" | "services_ai_prompt_engineering" | "services_creative_graphic_design" | "services_creative_video_production" | "services_web_full_stack" | "services_web_auth" | "services_web_python_backend" | "services_web_saas" | "services_dm_cro" | "services_dm_paid_advertising" | "services_dm_content_strategy" | "legal_terms" | "legal_privacy" | "legal_cookies";

interface SeoPageMeta {
    title: string;
    desc: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical?: string;
}

const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
    home: "Home Page",
    about: "About Us",
    contact: "Contact",
    portfolio: "Portfolio",
    resources: "Resources",
    services: "Services Overview",
    services_seo: "SEO Services",
    services_starter_kit: "Starter Kit",
    services_ai_chatbots: "AI Chatbots",
    services_ai_llm: "AI LLM",
    services_ai_cv_nlp: "AI CV/NLP",
    services_ai_prompt_engineering: "AI Prompt Engineering",
    services_creative_graphic_design: "Graphic Design",
    services_creative_video_production: "Video Production",
    services_web_full_stack: "Web Full Stack",
    services_web_auth: "Web Auth",
    services_web_python_backend: "Python Backend",
    services_web_saas: "SaaS Development",
    services_dm_cro: "CRO",
    services_dm_paid_advertising: "Paid Advertising",
    services_dm_content_strategy: "Content Strategy",
    legal_terms: "Terms of Service",
    legal_privacy: "Privacy Policy",
    legal_cookies: "Cookie Policy",
};

/* ───────────────── COMPONENT ───────────────── */

function AdminSEO() {
    const [seoPages, setSeoPages] = useState<Record<SeoPageKey, SeoPageMeta>>({
        home: { title: "ClickTake Technologies — AI-Powered Digital Agency", desc: "ClickTake builds AI-powered websites, apps and custom automation systems." },
        about: { title: "About Us — ClickTake Technologies", desc: "Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan." },
        contact: { title: "Contact — ClickTake Technologies", desc: "Get in touch with ClickTake Technologies." },
        portfolio: { title: "Portfolio — ClickTake Technologies", desc: "View our portfolio of projects." },
        resources: { title: "Resources — ClickTake Technologies", desc: "Explore our blog and resources." },
        services: { title: "Services — ClickTake Technologies", desc: "Explore our range of AI chatbots, Next.js web application buildouts, and Technical SEO." },
        services_seo: { title: "SEO Services — ClickTake Technologies", desc: "Technical SEO services." },
        services_starter_kit: { title: "Starter Kit — ClickTake Technologies", desc: "Quick-start your project." },
        services_ai_chatbots: { title: "AI Chatbots — ClickTake Technologies", desc: "Custom AI chatbot solutions." },
        services_ai_llm: { title: "LLM Solutions — ClickTake Technologies", desc: "Large language model services." },
        services_ai_cv_nlp: { title: "CV & NLP — ClickTake Technologies", desc: "Computer vision and NLP services." },
        services_ai_prompt_engineering: { title: "Prompt Engineering — ClickTake Technologies", desc: "Prompt engineering services." },
        services_creative_graphic_design: { title: "Graphic Design — ClickTake Technologies", desc: "Creative graphic design." },
        services_creative_video_production: { title: "Video Production — ClickTake Technologies", desc: "Professional video production." },
        services_web_full_stack: { title: "Full Stack Web — ClickTake Technologies", desc: "Full-stack web development." },
        services_web_auth: { title: "Auth Solutions — ClickTake Technologies", desc: "Authentication and security." },
        services_web_python_backend: { title: "Python Backend — ClickTake Technologies", desc: "Python backend development." },
        services_web_saas: { title: "SaaS Development — ClickTake Technologies", desc: "SaaS application development." },
        services_dm_cro: { title: "CRO — ClickTake Technologies", desc: "Conversion rate optimization." },
        services_dm_paid_advertising: { title: "Paid Advertising — ClickTake Technologies", desc: "Paid ad campaigns." },
        services_dm_content_strategy: { title: "Content Strategy — ClickTake Technologies", desc: "Content marketing strategy." },
        legal_terms: { title: "Terms of Service — ClickTake Technologies", desc: "Our terms and conditions." },
        legal_privacy: { title: "Privacy Policy — ClickTake Technologies", desc: "Our privacy policy." },
        legal_cookies: { title: "Cookie Policy — ClickTake Technologies", desc: "Our cookie policy." },
    });
    const [selectedSeoPage, setSelectedSeoPage] = useState<SeoPageKey>("home");
    const [sitemapText, setSitemapText] = useState(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://clicktake.co/</loc><priority>1.0</priority></url>\n  <url><loc>https://clicktake.co/about</loc><priority>0.8</priority></url>\n  <url><loc>https://clicktake.co/services</loc><priority>0.8</priority></url>\n</urlset>`);
    const [robotsText, setRobotsText] = useState("User-agent: *\nAllow: /\nSitemap: https://clicktake.co/sitemap.xml");
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        loadSeoData();
    }, []);

    const loadSeoData = async () => {
        setPageLoading(true);
        try {
            const { data: metaData } = await supabase.from("seo_page_meta").select("*");
            if (metaData && metaData.length > 0) {
                const pages: Record<string, SeoPageMeta> = {};
                metaData.forEach((m: any) => {
                    pages[m.page_key] = {
                        title: m.meta_title || "",
                        desc: m.meta_description || "",
                        og_title: m.og_title || "",
                        og_description: m.og_description || "",
                        og_image: m.og_image || "",
                        canonical: m.canonical || "",
                    };
                });
                setSeoPages((prev) => ({ ...prev, ...pages }));
            }
            const { data: sitemapData } = await supabase.from("seo_sitemap_config").select("content").limit(1).single();
            if (sitemapData?.content) setSitemapText(sitemapData.content);
            const { data: robotsData } = await supabase.from("seo_robots_config").select("content").limit(1).single();
            if (robotsData?.content) setRobotsText(robotsData.content);
        } catch (err) {
            console.error("Error loading SEO data:", err);
        } finally {
            setPageLoading(false);
        }
    };

    const savePageMeta = async () => {
        const page = seoPages[selectedSeoPage];
        const { error } = await supabase.from("seo_page_meta").upsert(
            {
                page_key: selectedSeoPage,
                meta_title: page.title,
                meta_description: page.desc,
                og_title: page.og_title || null,
                og_description: page.og_description || null,
                og_image: page.og_image || null,
                canonical: page.canonical || null,
            },
            { onConflict: "page_key" }
        );
        if (error) throw error;
    };

    const saveSitemap = async () => {
        const { data: existing } = await supabase.from("seo_sitemap_config").select("id").limit(1);
        if (existing && existing.length > 0) {
            await supabase.from("seo_sitemap_config").update({ content: sitemapText }).eq("id", existing[0].id);
        } else {
            await supabase.from("seo_sitemap_config").insert({ content: sitemapText });
        }
    };

    const saveRobots = async () => {
        const { data: existing } = await supabase.from("seo_robots_config").select("id").limit(1);
        if (existing && existing.length > 0) {
            await supabase.from("seo_robots_config").update({ content: robotsText }).eq("id", existing[0].id);
        } else {
            await supabase.from("seo_robots_config").insert({ content: robotsText });
        }
    };

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
                    {pageLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                    {pageLoading ? "Loading..." : `${Object.keys(seoPages).length} Pages Indexed`}
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
                                {Object.entries(SEO_PAGE_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
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

                            <div className="border-t border-white/5 pt-4 space-y-3">
                                <h4 className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Open Graph & Canonical</h4>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">OG Title</label>
                                    <input
                                        type="text"
                                        value={seoPages[selectedSeoPage].og_title || ""}
                                        onChange={(e) =>
                                            setSeoPages({
                                                ...seoPages,
                                                [selectedSeoPage]: { ...seoPages[selectedSeoPage], og_title: e.target.value },
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">OG Description</label>
                                    <textarea
                                        rows={2}
                                        value={seoPages[selectedSeoPage].og_description || ""}
                                        onChange={(e) =>
                                            setSeoPages({
                                                ...seoPages,
                                                [selectedSeoPage]: { ...seoPages[selectedSeoPage], og_description: e.target.value },
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">OG Image URL</label>
                                    <input
                                        type="text"
                                        value={seoPages[selectedSeoPage].og_image || ""}
                                        onChange={(e) =>
                                            setSeoPages({
                                                ...seoPages,
                                                [selectedSeoPage]: { ...seoPages[selectedSeoPage], og_image: e.target.value },
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Canonical URL</label>
                                    <input
                                        type="text"
                                        value={seoPages[selectedSeoPage].canonical || ""}
                                        onChange={(e) =>
                                            setSeoPages({
                                                ...seoPages,
                                                [selectedSeoPage]: { ...seoPages[selectedSeoPage], canonical: e.target.value },
                                            })
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                    />
                                </div>
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
                                onClick={async () => {
                                    try {
                                        await savePageMeta();
                                        toast.success("Meta tags saved to database!");
                                    } catch {
                                        toast.error("Failed to save meta tags");
                                    }
                                }}
                                className="w-full rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-bold shadow-md hover:opacity-90 transition"
                            >
                                Save Meta Configuration
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
                                onClick={async () => {
                                    try { await saveSitemap(); toast.success("Sitemap XML saved!"); } catch { toast.error("Failed to save sitemap"); }
                                }}
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
                                onClick={async () => {
                                    try { await saveRobots(); toast.success("Robots.txt saved!"); } catch { toast.error("Failed to save robots.txt"); }
                                }}
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