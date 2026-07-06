import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, MouseEvent, useState, useEffect } from "react";
import {
    MapPin, Mail, Phone, Globe, Clock, Users, Award, Zap,
    ArrowUpRight, Building2, Star, TrendingUp, Code2, Megaphone,
    Facebook, Instagram, Linkedin, Youtube, ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useBackgroundsContext, getSectionBackground, bgToStyle, videoStyle, overlayStyle } from "./BackgroundRenderer";

/* ─── DATA ────────────────────────────────────────────────────── */

const stats = [
    { val: "120+", label: "Projects Shipped", icon: Code2, color: "from-brand-cyan to-brand-blue" },
    { val: "80+", label: "Happy Clients", icon: Users, color: "from-brand-magenta to-brand-magenta" },
    { val: "5.0", label: "Average Rating", icon: Star, color: "from-amber-400 to-orange-500" },
    { val: "6+", label: "Years Active", icon: TrendingUp, color: "from-teal-400 to-brand-cyan" },
];

const values = [
    {
        icon: Zap,
        title: "Speed Without Compromise",
        desc: "48-hour feedback turnarounds. Milestone-driven sprints. We move fast and ship quality.",
        color: "from-amber-400 to-orange-500",
        glowRaw: "rgba(251,191,36,0.2)",
    },
    {
        icon: Award,
        title: "Results-First Mindset",
        desc: "Every decision we make is tied to your KPIs — traffic, leads, conversions, revenue.",
        color: "from-brand-magenta to-brand-magenta",
        glowRaw: "color-mix(in oklab, var(--brand-magenta) 20%, transparent)",
    },
    {
        icon: Globe,
        title: "Global Delivery",
        desc: "Dual-continent teams in the UK and Pakistan, built for worldwide digital reach.",
        color: "from-brand-cyan to-brand-blue",
        glowRaw: "color-mix(in oklab, var(--brand-cyan) 20%, transparent)",
    },
    {
        icon: Users,
        title: "Dedicated Partnership",
        desc: "A named strategist on every project. Real relationships, not anonymous tickets.",
        color: "from-teal-400 to-emerald-500",
        glowRaw: "rgba(20,184,166,0.2)",
    },
];

const services = [
    "Custom Web Development", "Mobile Applications", "E-Commerce Systems",
    "SEO & Search Strategy", "Paid Media Campaigns", "Brand Identity",
    "AI Automations", "Lead Generation", "Growth Operations",
];
/* ─── SOCIALS & OFFICES ────────────────────────────────────────── */

const socials = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/clicktaketech" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/clicktaketech" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/clicktaketech" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com/clicktaketech" },
];

const offices: Office[] = [
    {
        flag: "🇬🇧",
        country: "United Kingdom",
        city: "Birmingham",
        address: "123 Innovation Street, Birmingham, B1 1AA, UK",
        phone: "+44 123 456 7890",
        color: "from-brand-blue to-brand-cyan",
        glow: "color-mix(in oklab, var(--brand-cyan) 30%, transparent)",
    },
    {
        flag: "🇵🇰",
        country: "Pakistan",
        city: "Multan",
        address: "456 Tech Hub, Multan, Punjab, Pakistan",
        phone: "+92 300 1234567",
        color: "from-emerald-500 to-teal-500",
        glow: "rgba(20,184,166,0.3)",
    },
];

/* ─── TILT CARD (reused pattern from Services) ─────────────────── */

function TiltCard({
    children,
    glowColor = "color-mix(in oklab, var(--brand-cyan) 20%, transparent)",
    className = "",
}: {
    children: React.ReactNode;
    glowColor?: string;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 150, damping: 20 });
    const sy = useSpring(y, { stiffness: 150, damping: 20 });
    const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
    const glowX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
    const glowY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

    const onMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
            className={className}
        >
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                    background: `radial-gradient(circle at ${glowX} ${glowY}, ${glowColor}30, transparent 60%)`,
                }}
            />
            {children}
        </motion.div>
    );
}

/* ─── STAT COUNTER ──────────────────────────────────────────────── */

function StatCard({ s, i }: { s: typeof stats[0]; i: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const Icon = s.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-xl text-center transition-all duration-500 hover:border-white/20 hover:-translate-y-2"
        >
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
            />
            <motion.div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg mb-3`}
                animate={{ boxShadow: ["0 0 0 0 transparent", "0 0 20px -4px color-mix(in oklab, var(--brand-cyan) 40%, transparent)", "0 0 0 0 transparent"] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            >
                <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <div className="font-display text-3xl font-extrabold text-foreground">{s.val}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
        </motion.div>
    );
}

/* ─── VALUE CARD ────────────────────────────────────────────────── */

function ValueCard({ v, i }: { v: typeof values[0]; i: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const Icon = v.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:-translate-y-1"
        >
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 30% 30%, ${v.glowRaw}, transparent 65%)` }}
            />
            <motion.div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${v.color} shadow-lg`}
                style={{ boxShadow: `0 0 20px -4px ${v.glowRaw}` }}
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
            >
                <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <h4 className="font-semibold text-foreground">{v.title}</h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{v.desc}</p>
        </motion.div>
    );
}

/* ─── OFFICE CARD ───────────────────────────────────────────────── */

interface Office {
    flag: string;
    country: string;
    city: string;
    address: string;
    phone: string;
    color: string;
    glow: string;
}

function OfficeCard({ o, i }: { o: Office; i: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="group"
        >
            <TiltCard glowColor={o.glow}>
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-card/60 p-7 backdrop-blur-xl transition-all duration-500 group-hover:border-white/20 group-hover:shadow-2xl">
                    {/* Background glow blob */}
                    <motion.div
                        className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${o.color} opacity-15 blur-3xl`}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.07),transparent_40%)] rounded-[28px]" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <span className="text-4xl">{o.flag}</span>
                                <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{o.country}</div>
                                <h3 className="font-display text-2xl font-bold text-foreground mt-1">{o.city}</h3>
                            </div>
                            <motion.div
                                className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${o.color} shadow-xl`}
                                style={{ boxShadow: `0 0 20px -4px ${o.glow}` }}
                                whileHover={{ rotate: 15, scale: 1.1 }}
                            >
                                <Building2 className="h-5 w-5 text-white" />
                            </motion.div>
                        </div>

                        {/* Info rows */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-background/30 px-4 py-3">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                                <span className="text-sm leading-6 text-muted-foreground">{o.address}</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-background/30 px-4 py-3">
                                <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                                <span className="text-sm text-muted-foreground">{o.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
}


/* ─── MAIN EXPORT ───────────────────────────────────────────────── */

export function About() {
    const ctaBg = getSectionBackground(useBackgroundsContext(), "cta");
    const heroRef = useRef<HTMLDivElement>(null);
    const heroInView = useInView(heroRef, { once: true });

    return (
        <section id="about" className="relative overflow-hidden py-24 lg:py-36">

            {/* ── BACKGROUND ── */}
            <div className="absolute inset-0">
                <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-brand-magenta/10 blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/10 blur-[120px]" />
                <div className="absolute top-1/2 left-0 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-teal-500/8 blur-[100px]" />
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.022]"
                    style={{
                        backgroundImage:
                            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                        backgroundSize: "70px 70px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4">

                {/* ── SECTION HEADER ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        Our Story
                    </div>

                    <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        The agency behind{" "}
                        <span className="text-gradient">your growth</span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                        ClickTake Technologies is a full-service digital agency operating from the UK and Pakistan,
                        helping ambitious businesses grow through innovative technology, data-driven marketing, and AI-powered systems.
                    </p>
                </motion.div>

                {/* ── HERO SPLIT: STORY + STATS ── */}
                <div ref={heroRef} className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">

                    {/* Left — narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={heroInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Large decorative number */}
                        <div className="font-display text-[7rem] font-extrabold leading-none text-white/[0.04] select-none">
                            CT
                        </div>

                        {/* Story block */}
                        <div className="relative -mt-12 rounded-[28px] border border-white/10 bg-card/50 p-8 backdrop-blur-xl">
                            <motion.div
                                className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-brand-cyan to-brand-magenta opacity-15 blur-3xl"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 5, repeat: Infinity }}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.06),transparent_40%)] rounded-[28px]" />

                            <div className="relative z-10 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-gradient-to-r from-brand-cyan/40 to-transparent" />
                                    <span className="text-xs uppercase tracking-[0.3em] text-primary">Est. Digital Growth Partner</span>
                                    <div className="h-px flex-1 bg-gradient-to-l from-brand-magenta/40 to-transparent" />
                                </div>

                                <p className="text-sm leading-8 text-muted-foreground">
                                    We specialize in{" "}
                                    <span className="text-foreground font-medium">search engine optimisation</span>,{" "}
                                    <span className="text-foreground font-medium">social media marketing</span>,{" "}
                                    <span className="text-foreground font-medium">PPC advertising</span>, and{" "}
                                    <span className="text-foreground font-medium">custom web development</span> — building
                                    high-performance websites, scalable applications and conversion-focused campaigns tailored to each client.
                                </p>

                                <p className="text-sm leading-8 text-muted-foreground">
                                    From startups to established enterprises, we provide end-to-end digital solutions with
                                    a sharp focus on ROI — helping businesses generate leads, increase visibility and scale
                                    efficiently in competitive markets.
                                </p>

                                {/* Working hours chip */}
                                <div className="flex flex-wrap gap-3 pt-1">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                        Mon–Sat · 09:30 AM – 09:00 PM
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                        info@clicktaketech.com
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service tags */}
                        <div className="flex flex-wrap gap-2">
                            {services.map((s, i) => (
                                <motion.span
                                    key={s}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className="rounded-full border border-white/10 bg-card/50 px-3 py-1 text-[11px] font-mono text-muted-foreground/70 backdrop-blur hover:border-primary/30 hover:text-foreground transition-all"
                                >
                                    {s}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — stats grid + social */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={heroInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((s, i) => (
                                <StatCard key={s.label} s={s} i={i} />
                            ))}
                        </div>

                        {/* Positioning statement */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-cyan/10 to-brand-magenta/10 p-6 backdrop-blur-xl text-center"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-brand-magenta/5"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="relative z-10">
                                <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Positioning</div>
                                <div className="font-display text-xl font-bold text-foreground">
                                    ClickTake Technologies
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">= Digital Growth Partner</div>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <span className="text-xs text-muted-foreground/60">🇬🇧 Birmingham</span>
                                    <span className="text-white/20">·</span>
                                    <span className="text-xs text-muted-foreground/60">🇵🇰 Multan</span>
                                    <span className="text-white/20">·</span>
                                    <span className="text-xs text-muted-foreground/60">🌍 Worldwide</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social links */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-mono">Follow us</span>
                            <div className="h-px flex-1 bg-white/5" />
                            <div className="flex gap-2">
                                {socials.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <motion.a
                                            key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.15, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-card/60 text-muted-foreground backdrop-blur hover:border-primary/30 hover:text-primary transition-colors"
                                            aria-label={s.label}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── OUR VALUES ── */}
                <div className="mt-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl mb-4">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-magenta" />
                            What Drives Us
                        </div>
                        <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                            Our core <span className="text-gradient">values</span>
                        </h3>
                    </motion.div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((v, i) => (
                            <ValueCard key={v.title} v={v} i={i} />
                        ))}
                    </div>
                </div>

                {/* ── OFFICES ── */}
                <div className="mt-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl mb-4">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
                            Where We Are
                        </div>
                        <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                            Our <span className="text-gradient">offices</span>
                        </h3>
                    </motion.div>

                    {/* Animated connecting line */}
                    <div className="relative">
                        <div className="absolute left-0 right-0 top-1/2 hidden lg:block overflow-hidden -z-0">
                            <div className="h-px w-full bg-white/5" />
                            <motion.div
                                className="absolute inset-0 h-px bg-gradient-to-r from-teal-500 via-brand-cyan to-brand-blue"
                                initial={{ scaleX: 0, originX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                style={{ opacity: 0.6, filter: "blur(0.5px)" }}
                            />
                            <motion.div
                                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-cyan"
                                style={{ boxShadow: "0 0 8px 2px color-mix(in oklab, var(--brand-cyan) 80%, transparent)" }}
                                animate={{ left: ["0%", "100%", "0%"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="relative z-10 grid gap-8 lg:grid-cols-2">
                            {offices.map((o, i) => (
                                <OfficeCard key={o.country} o={o} i={i} />
                            ))}
                        </div>
                    </div>

                    {/* Contact details strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 rounded-2xl border border-white/8 bg-card/40 p-6 backdrop-blur-xl"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                            <a
                                href="mailto:info@clicktaketech.com"
                                className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-cyan/20 to-brand-blue/10 border border-white/10">
                                    <Mail className="h-3.5 w-3.5 text-primary" />
                                </div>
                                info@clicktaketech.com
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                            </a>

                            <a
                                href="https://www.clicktaketech.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-magenta/20 to-brand-magenta/10 border border-white/10">
                                    <Globe className="h-3.5 w-3.5 text-primary" />
                                </div>
                                www.clicktaketech.com
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                            </a>

                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-white/10">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                </div>
                                Mon–Sat · 09:30 – 21:00
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── BOTTOM CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className={`${ctaBg ? 'relative overflow-hidden' : ''} mt-16 text-center`}
                    style={ctaBg ? bgToStyle(ctaBg) : {}}
                >
                    {ctaBg?.bg_type === "video" && (ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile) && (
                        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full"
                            style={videoStyle(ctaBg)}
                            src={ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile || undefined} />
                    )}
                    {ctaBg?.overlay_color && <div style={overlayStyle(ctaBg)} />}
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm">
                            Ready to work with us?{" "}
                            <a
                                href="#contact"
                                className="group inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
                            >
                                Start your project today
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </a>
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}