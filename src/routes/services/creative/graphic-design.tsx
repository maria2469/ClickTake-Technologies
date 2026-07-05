import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Palette, Monitor, Image,
    Layers, PenTool, Layout, Package, Smartphone,
    Award, Clock, Users, Zap, Star, RefreshCw, ArrowLeft,
} from "lucide-react";
import { CtaSection } from "@/components/BackgroundRenderer";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/creative/graphic-design")({
    head: () => ({
        meta: [
            { title: "Graphic Design — ClickTake Technologies" },
            { name: "description", content: "Brand identity, UI/UX design, and marketing assets that make your business impossible to ignore." },
        ],
    }),
    component: GraphicDesignPage,
});

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

const services = [
    {
        icon: Palette,
        title: "Brand Identity",
        color: "from-pink-500 to-rose-600",
        glow: "rgba(236,72,153,0.15)",
        desc: "Your brand is the sum of every impression you make. We build identity systems that command attention, earn trust, and stay consistent across every touchpoint.",
        items: [
            "Logo system — primary, secondary, and icon variants",
            "Full brand guidelines with usage rules & examples",
            "Typography system & colour palette selection",
            "Brand collateral — cards, letterheads, signatures",
            "Presentation & pitch deck templates",
            "Rebrand strategy with phased rollout planning",
            "Brand voice & tone of voice documentation",
        ],
    },
    {
        icon: Monitor,
        title: "UI/UX Design",
        color: "from-violet-500 to-purple-700",
        glow: "rgba(139,92,246,0.15)",
        desc: "Beautiful interfaces that users actually understand. We design digital products that guide people intuitively from first visit to conversion.",
        items: [
            "Product UI — SaaS dashboards, apps, storefronts",
            "UX research, user journey mapping & wireframes",
            "Figma design systems & component libraries",
            "Interactive prototypes for testing & investor decks",
            "Mobile-first responsive design",
            "Usability testing & iteration cycles",
            "Developer handoff with annotated specs",
        ],
    },
    {
        icon: Image,
        title: "Marketing Assets",
        color: "from-amber-500 to-orange-600",
        glow: "rgba(245,158,11,0.15)",
        desc: "Consistent, on-brand creative across every channel — built at the speed your campaigns demand without compromising quality.",
        items: [
            "Social media graphics for every platform",
            "Paid ad creatives — display, social, native",
            "Pitch decks & investor presentations",
            "Brochures, banners & exhibition materials",
            "Packaging design & product visualisation",
            "Email template design",
            "Animated & motion graphic assets",
        ],
    },
];

const results = [
    { metric: "2–3 wks", label: "Average brand identity delivery" },
    { metric: "100%", label: "Projects delivered with unlimited revisions" },
    { metric: "150+", label: "Brands designed from scratch" },
    { metric: "5★", label: "Average client rating across all design projects" },
];

const process = [
    { step: "01", title: "Brand Discovery", desc: "We run a structured workshop to understand your business, audience, competitors, and the emotional space you want to own." },
    { step: "02", title: "Research & Moodboard", desc: "Competitor visual analysis, trend research, and a curated moodboard presented for directional approval." },
    { step: "03", title: "Concept Development", desc: "2–3 distinct design directions presented with rationale. You pick a direction and we develop it to completion." },
    { step: "04", title: "Design & Refine", desc: "Full design execution with revision rounds. We iterate until every element is exactly right." },
    { step: "05", title: "Guidelines & Assets", desc: "Complete brand guidelines document plus all asset exports in every format you'll need." },
    { step: "06", title: "Ongoing Support", desc: "Design retainer options available for ongoing asset production, campaign creative, and product design." },
];

const differentiators = [
    { icon: Award, title: "Strategy-first design", desc: "Every design decision is tied to a business objective. We don't just make things look good — we make them perform." },
    { icon: Users, title: "Dedicated senior designer", desc: "One experienced designer owns your project from brief to delivery. No junior handoffs or offshore execution." },
    { icon: RefreshCw, title: "Unlimited revisions", desc: "Within scope, we revise until you're completely satisfied. No per-revision fees, no awkward conversations." },
    { icon: Clock, title: "Fast turnarounds", desc: "Brand identity in 2–3 weeks. Marketing assets in 48–72 hours. We move at the pace your business needs." },
    { icon: Layers, title: "Figma-native delivery", desc: "All work delivered in Figma with organised components and layers — ready for your developers and team to use immediately." },
    { icon: Zap, title: "Cross-discipline thinking", desc: "Our designers understand SEO, conversion, and development — so the work we produce always fits the bigger picture." },
];

const deliverables = [
    { icon: Palette, label: "Logo System" },
    { icon: PenTool, label: "Brand Guidelines" },
    { icon: Layout, label: "UI/UX Designs" },
    { icon: Package, label: "Design System" },
    { icon: Smartphone, label: "Mobile Designs" },
    { icon: Image, label: "Marketing Assets" },
    { icon: Star, label: "Ad Creatives" },
    { icon: Monitor, label: "Pitch Deck Template" },
];

export default function GraphicDesignPage() {
    return (
        <div className="relative min-h-screen text-foreground overflow-x-hidden">
            <BackgroundScene />
            <CustomCursor />
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative pt-44 pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className="mb-5">
                            <Link to="/services" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
                                <ArrowLeft className="h-4 w-4" /> Back to Services
                            </Link>
                            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-400">
                                Creative Services
                            </div>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Design that makes people{" "}
                            <span className="bg-linear-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
                                stop and look.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            First impressions are permanent. We craft visual identities, product interfaces, and marketing assets that make your brand instantly recognisable — and impossible to forget.
                        </motion.p>

                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-pink-500 to-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Start your project <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">{r.metric}</div>
                            <div className="mt-2 text-sm text-muted-foreground leading-snug">{r.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PROBLEM / SOLUTION ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">The Problem</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Bad design is costing you customers silently.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Visitors judge your credibility in 50 milliseconds. An inconsistent brand, a cluttered interface, or generic marketing creative can lose you business before you've said a word.</p>
                            <p>Most businesses live with design that was "good enough" at launch — unaware it's actively undermining trust and conversion every single day.</p>
                            <p>Generic freelancers deliver logos. We deliver identity systems, product experiences, and creative assets built specifically around your audience's psychology and your business objectives.</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-pink-500/20 bg-linear-to-br from-pink-500/5 to-orange-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-4">What We Deliver</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Design that builds trust and drives action.</h2>
                        <div className="space-y-3">
                            {[
                                "Strategy-led — every design choice tied to a business goal",
                                "Identity systems that scale across every medium and channel",
                                "UI/UX that converts — not just looks beautiful",
                                "Marketing creative that performs in paid and organic channels",
                                "Delivered fast — brand identity in 2–3 weeks, assets in 48hrs",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-pink-400 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SERVICE CARDS ── */}
            <section id="services" className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">What We Do</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three design disciplines. One creative team.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Brand identity, product design, and marketing creative — built to work together, not in isolation.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                    className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-7 hover:border-white/20 transition-all duration-300"
                                    whileHover={{ boxShadow: `0 0 60px 0 ${s.glow}` }}>
                                    <div className={`h-1 w-16 rounded-full bg-linear-to-r ${s.color} mb-6`} />
                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${s.color} mb-4 shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                                    <ul className="space-y-2">
                                        {s.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" />{item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── DELIVERABLES ── */}
            <section className="relative z-10 py-20 px-4 border-y border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <div className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">Every Engagement Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">You receive files, not promises.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-pink-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-linear-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-pink-400" />
                                    </div>
                                    <span className="text-sm font-medium leading-snug">{d.label}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── PROCESS ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From brief to brand in weeks, not months.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-linear-to-br from-pink-500/30 to-orange-500/30 bg-clip-text mb-4 select-none group-hover:from-pink-500/60 group-hover:to-orange-500/60 transition-all">{p.step}</div>
                                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DIFFERENTIATORS ── */}
            <section className="relative z-10 py-24 px-4 border-t border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We design for outcomes, not awards.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-pink-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-br from-pink-500/10 to-orange-500/10 border border-border flex items-center justify-center group-hover:border-pink-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-pink-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">{d.title}</div>
                                        <div className="text-sm text-muted-foreground leading-relaxed">{d.desc}</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── WHO IT'S FOR ── */}
            <section className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-3xl border border-border bg-linear-to-br from-card/80 to-card/40 backdrop-blur-xl p-10 md:p-14">
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">Ideal For</div>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Who we work with.</h2>
                                <div className="space-y-3">
                                    {[
                                        { who: "Startups & new businesses", need: "building a brand identity that earns immediate credibility" },
                                        { who: "Scaling businesses", need: "refreshing an outdated brand to match their growth" },
                                        { who: "Product companies", need: "UI/UX design that reduces churn and increases activation" },
                                        { who: "Marketing teams", need: "high-volume creative asset production at consistent quality" },
                                        { who: "Agencies & consultancies", need: "white-label design capacity for client projects" },
                                    ].map((item) => (
                                        <div key={item.who} className="flex items-start gap-3 text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
                                            <span><span className="font-semibold text-foreground">{item.who}</span><span className="text-muted-foreground"> — {item.need}</span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
                                    <div className="text-sm font-semibold text-pink-400 mb-1">Full Project</div>
                                    <div className="text-lg font-bold mb-1">Brand Identity Package</div>
                                    <div className="text-sm text-muted-foreground">Logo system, brand guidelines, typography, colour palette, and core collateral. Delivered in 2–3 weeks.</div>
                                </div>
                                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                                    <div className="text-sm font-semibold text-violet-400 mb-1">Product Design</div>
                                    <div className="text-lg font-bold mb-1">UI/UX Design Engagement</div>
                                    <div className="text-sm text-muted-foreground">Research, wireframes, UI design, and Figma design system. Scoped per project complexity.</div>
                                </div>
                                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
                                    <div className="text-sm font-semibold text-orange-400 mb-1">Retainer</div>
                                    <div className="text-lg font-bold mb-1">Ongoing Creative Support</div>
                                    <div className="text-sm text-muted-foreground">Monthly design hours for campaign assets, social graphics, and ad creatives. Flexible volume.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <CtaSection>
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-4">Ready to transform your brand?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your brand is talking.<br />
                            <span className="bg-linear-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Make sure it's saying the right things.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute design consultation. We'll review your current brand, identify what's working against you, and show you what's possible.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-pink-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free consultation <ArrowUpRight className="h-5 w-5" />
                            </a>
                            <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur hover:bg-secondary transition-colors text-base">
                                Explore all services
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </CtaSection>
        </div>
    );
}