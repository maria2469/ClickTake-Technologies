import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Brain, Bot, Wand2, Eye,
    Server, Layers, Shield, Cloud,
    Search, PenTool, Megaphone, TrendingUp,
    Palette, Video,
    Sparkles, ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";
import { SEOHead } from "@/components/SEOHead";
import { useBackgroundsContext, getSectionBackground, bgToStyle, videoStyle, overlayStyle } from "@/components/BackgroundRenderer";

export const Route = createFileRoute("/services/")({
    head: () => ({
        meta: [
            { title: "Services — ClickTake Technologies" },
            {
                name: "description",
                content: "AI solutions, web development, digital marketing, creative services, and our flagship Business Development Starter Kit.",
            },
        ],
    }),
    component: ServicesIndex,
});

const ICON_MAP: Record<string, LucideIcon> = {
    Brain, Bot, Wand2, Eye,
    Server, Layers, Shield, Cloud,
    Search, PenTool, Megaphone, TrendingUp,
    Palette, Video, Rocket: Sparkles,
};

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

const CATEGORY_STYLES: Record<string, {
    gradient: string; glow: string; borderHover: string;
    accentColor: string; accentBg: string; accentBorder: string;
    title: string; description: string;
}> = {
    ai: {
        gradient: "from-brand-magenta to-brand-blue",
        glow: "color-mix(in oklab, var(--brand-magenta) 12%, transparent)",
        borderHover: "hover:border-brand-magenta/40",
        accentColor: "text-brand-magenta",
        accentBg: "bg-brand-magenta/10",
        accentBorder: "border-brand-magenta/30",
        title: "Intelligent Systems",
        description: "Custom AI solutions that automate decisions, understand language, and see the world — built for production, not demos.",
    },
    web: {
        gradient: "from-brand-cyan to-brand-blue",
        glow: "color-mix(in oklab, var(--brand-cyan) 12%, transparent)",
        borderHover: "hover:border-brand-cyan/40",
        accentColor: "text-brand-cyan",
        accentBg: "bg-brand-cyan/10",
        accentBorder: "border-brand-cyan/30",
        title: "Digital Products",
        description: "Production-grade applications built on proven stacks — performant, secure, and designed to scale from day one.",
    },
    marketing: {
        gradient: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.12)",
        borderHover: "hover:border-emerald-500/40",
        accentColor: "text-emerald-400",
        accentBg: "bg-emerald-500/10",
        accentBorder: "border-emerald-500/30",
        title: "Growth Systems",
        description: "Data-led marketing that compounds. SEO, paid, and conversion work that drives qualified pipeline — not vanity metrics.",
    },
    creative: {
        gradient: "from-brand-pink to-orange-500",
        glow: "color-mix(in oklab, var(--brand-pink) 12%, transparent)",
        borderHover: "hover:border-brand-pink/40",
        accentColor: "text-brand-pink",
        accentBg: "bg-brand-pink/10",
        accentBorder: "border-brand-pink/30",
        title: "Brand & Content",
        description: "Visual identities, digital product design, and video that makes your brand impossible to ignore.",
    },
};

function ServicesIndex() {
    const ctaBg = getSectionBackground(useBackgroundsContext(), "cta");
    const [dbServices, setDbServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data } = await supabase
                .from("services")
                .select("*")
                .order("display_order");
            setDbServices(data || []);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    const starterKit = dbServices.find(s => s.slug === "starter-kit");

    const groups = Object.entries(CATEGORY_STYLES).map(([key, style]) => {
        const items = dbServices
            .filter(s => s.category === key && s.slug !== "starter-kit")
            .map(s => ({
                label: s.title,
                desc: s.description,
                to: `/services/${s.slug}`,
                icon: ICON_MAP[s.icon_name] || Sparkles,
            }));
        return { id: key, ...style, eyebrow: key === "ai" ? "AI & Machine Learning" : key === "web" ? "Web Development" : key === "marketing" ? "Digital Marketing" : "Creative Services", items };
    }).filter(g => g.items.length > 0);

    const stats = [
        { value: "150+", label: "Brands served" },
        { value: "90 days", label: "Avg. time to revenue" },
        { value: "5★", label: "Average client rating" },
        { value: `${dbServices.length}`, label: "Service offerings" },
    ];

    return (
        <div className="relative min-h-screen text-foreground overflow-x-hidden">
            <SEOHead slug="/services" title="Services — ClickTake Technologies" description="AI solutions, web development, digital marketing, creative services, and our flagship Business Development Starter Kit." />
            <BackgroundScene />
            <CustomCursor />
            <Navbar />

            <main className="relative z-10 pt-32 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── HERO HEADER ── */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                        className="relative max-w-4xl"
                    >
                        <motion.div variants={fadeUp}>
                            <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-cyan mb-6">
                                What We Do
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            custom={1}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]"
                        >
                            Services built for{" "}
                            <span className="bg-gradient-to-r from-brand-cyan via-brand-magenta to-brand-pink bg-clip-text text-transparent">
                                modern brands.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
                        >
                            From AI and full-stack development to brand, video, and growth marketing — every service is built around one objective: measurable business outcomes.
                        </motion.p>

                        {/* Stats strip */}
                        <motion.div
                            variants={fadeUp}
                            custom={3}
                            className="mt-10 flex flex-wrap gap-x-10 gap-y-4"
                        >
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-brand-cyan to-brand-magenta bg-clip-text text-transparent">
                                        {s.value}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── FLAGSHIP STARTER KIT BANNER ── */}
                    {starterKit && (
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-16"
                        >
                            <Link
                                to="/services/starter-kit"
                                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/8 via-pink-500/5 to-brand-magenta/8 backdrop-blur-xl p-8 transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_0_60px_rgba(245,158,11,0.12)] overflow-hidden"
                            >
                                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/8 blur-3xl" />
                                <div className="pointer-events-none absolute -left-8 -bottom-8 h-48 w-48 rounded-full bg-brand-pink/8 blur-3xl" />

                                <div className="relative flex items-center gap-5">
                                    <div className="h-14 w-14 shrink-0 grid place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-brand-pink shadow-lg shadow-amber-500/25">
                                        <Sparkles className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Flagship Offering</span>
                                            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Most Popular</span>
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold">{starterKit.title}</div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {starterKit.detailed_description || starterKit.description}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex items-center gap-3 shrink-0">
                                    <div className="hidden sm:flex flex-col gap-1 text-right">
                                        <div className="text-xs text-muted-foreground">Typically live in</div>
                                        <div className="text-sm font-bold text-amber-400">90 days</div>
                                    </div>
                                    <div className="h-10 w-10 rounded-full border border-amber-500/40 bg-amber-500/10 grid place-items-center transition-all group-hover:bg-amber-500/20 group-hover:scale-110">
                                        <ArrowUpRight className="h-5 w-5 text-amber-400" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* ── SERVICE GROUPS ── */}
                    <div className="mt-20 space-y-24">
                        {groups.map((g) => (
                            <motion.section
                                key={g.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                                    <div>
                                        <div className={`text-xs font-bold uppercase tracking-widest ${g.accentColor} mb-2`}>
                                            {g.eyebrow}
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{g.title}</h2>
                                        <p className="mt-2 text-muted-foreground max-w-xl leading-relaxed">{g.description}</p>
                                    </div>
                                </div>

                                <div className={`grid sm:grid-cols-2 ${g.items.length === 4 ? "lg:grid-cols-4" : g.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 max-w-2xl"} gap-4`}>
                                    {g.items.map((item, ii) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.div
                                                key={item.to}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: ii * 0.08, duration: 0.45 }}
                                            >
                                                <Link
                                                    to={item.to}
                                                    className={`group relative flex flex-col h-full rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 ${g.borderHover} hover:shadow-[0_0_40px_var(--glow)] hover:bg-card/70 hover:-translate-y-0.5`}
                                                    style={{ "--glow": g.glow } as React.CSSProperties}
                                                >
                                                    <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${g.gradient} mb-5 transition-all duration-300 group-hover:w-16`} />

                                                    <div className={`h-11 w-11 grid place-items-center rounded-xl ${g.accentBg} border ${g.accentBorder} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                                        <Icon className={`h-5 w-5 ${g.accentColor}`} />
                                                    </div>

                                                    <div className="font-bold text-base mb-2 leading-snug">{item.label}</div>
                                                    <div className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</div>

                                                    <div className="mt-5 flex items-center justify-between">
                                                        <span className={`text-xs font-semibold ${g.accentColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                            Learn more
                                                        </span>
                                                        <ArrowUpRight className={`h-4 w-4 ${g.accentColor} opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        ))}
                    </div>

                    {/* ── BOTTOM CTA ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-28 relative rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-12 md:p-16 text-center overflow-hidden"
                        style={ctaBg ? bgToStyle(ctaBg) : {}}
                    >
                        {ctaBg?.bg_type === "video" && (ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile) && (
                            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full"
                                style={videoStyle(ctaBg)}
                                src={ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile || undefined} />
                        )}
                        {ctaBg?.overlay_color && <div style={overlayStyle(ctaBg)} />}
                        {!ctaBg?.bg_type && (
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute top-0 left-1/4 h-48 w-48 bg-brand-cyan/10 blur-3xl rounded-full" />
                                <div className="absolute bottom-0 right-1/4 h-48 w-48 bg-brand-magenta/10 blur-3xl rounded-full" />
                            </div>
                        )}

                        <div className="relative">
                            <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-4">Not sure where to start?</div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                                Let's figure out what<br />
                                <span className="bg-gradient-to-r from-brand-cyan via-brand-magenta to-brand-pink bg-clip-text text-transparent">
                                    your business actually needs.
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                                Book a free 30-minute discovery call. We'll understand your goals, gaps, and budget — then tell you exactly which services will move the needle fastest.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base"
                                >
                                    Book a free discovery call <ArrowUpRight className="h-5 w-5" />
                                </a>
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur hover:bg-secondary transition-colors text-base"
                                >
                                    View pricing
                                </a>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}