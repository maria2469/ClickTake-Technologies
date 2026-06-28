import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Cloud, CreditCard, Users,
    BarChart3, Puzzle, Rocket, Globe, Zap, Clock, Award,
    ArrowLeft, Database, Layers, Shield, Settings, Bell,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/web/saas")({
    head: () => ({
        meta: [
            { title: "SaaS Platform Development — ClickTake Technologies" },
            { name: "description", content: "Multi-tenant SaaS products built with subscriptions, onboarding, and growth built in from the start." },
        ],
    }),
    component: SaaSPage,
});

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

const services = [
    {
        icon: Cloud,
        title: "Multi-Tenant Architecture",
        color: "from-amber-500 to-orange-600",
        glow: "rgba(245,158,11,0.15)",
        desc: "Database-per-tenant or shared schema with row-level security — designed for complete data isolation, per-tenant config, and the scale you'll need in year three, not just today.",
        items: [
            "Database-per-tenant or shared schema with RLS",
            "Subdomain and custom domain routing per tenant",
            "Per-tenant feature flags and configuration overrides",
            "Tenant onboarding and provisioning automation",
            "Cross-tenant admin and super-admin panels",
            "Data residency controls for GDPR compliance",
            "Tenant offboarding with data export and deletion",
        ],
    },
    {
        icon: CreditCard,
        title: "Billing & Subscription Engine",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "Stripe-powered billing that maximises revenue and minimises churn — from free trials to enterprise invoicing, usage-based pricing to annual contracts.",
        items: [
            "Tiered plans with feature gates and seat limits",
            "Usage-based billing with metered API and resource tracking",
            "Free trial management with conversion flows",
            "Annual billing with proration and mid-cycle upgrades",
            "Dunning automation — failed payment recovery sequences",
            "Enterprise invoicing with Net 30/60 terms",
            "Revenue recognition and MRR/ARR reporting dashboard",
        ],
    },
    {
        icon: Rocket,
        title: "Growth Infrastructure",
        color: "from-pink-500 to-rose-600",
        glow: "rgba(236,72,153,0.15)",
        desc: "Onboarding, analytics, integrations, and automation built in from the start — the features that turn signups into activated, retained, expanding customers.",
        items: [
            "Activation-focused onboarding with progress tracking",
            "In-app tooltips, checklists, and product tours",
            "Product analytics — funnels, retention, and feature adoption",
            "Webhook system for real-time event delivery to customers",
            "REST API with OpenAPI docs and sandbox environment",
            "Referral and affiliate tracking infrastructure",
            "In-app upgrade prompts and expansion revenue triggers",
        ],
    },
];

const results = [
    { metric: "90 days", label: "Average time from kick-off to first paying customer" },
    { metric: "99.9%", label: "Uptime SLA with auto-scaling infrastructure" },
    { metric: "3×", label: "Faster time to market vs. building in-house" },
    { metric: "Stripe", label: "Certified integration partner for billing" },
];

const process = [
    { step: "01", title: "Business Model Architecture", desc: "We map your pricing model, tenant types, permission structure, and growth loops before a schema is designed or a component is built." },
    { step: "02", title: "Technical Architecture", desc: "Database design, multi-tenancy strategy, auth layer, API contracts, and infrastructure plan — documented and signed off before build begins." },
    { step: "03", title: "Core Platform Build", desc: "Auth, multi-tenancy, billing, and admin — the four foundations every SaaS needs. Built in parallel by dedicated squads." },
    { step: "04", title: "Product Feature Build", desc: "Your differentiating features built on top of the core. API-first with a React frontend, tested and staged for review." },
    { step: "05", title: "Launch Readiness", desc: "Load testing, security audit, Stripe billing validation, onboarding QA, and infrastructure provisioning for go-live." },
    { step: "06", title: "Post-Launch Iteration", desc: "We monitor activation metrics, identify drop-off points, and ship growth-focused improvements on a retainer or sprint basis." },
];

const differentiators = [
    { icon: Award, title: "Billing-first approach", desc: "Subscription logic is the hardest part of SaaS. We design the billing model in week one — everything else is built around it." },
    { icon: Shield, title: "Multi-tenancy done right", desc: "Tenant data isolation is non-negotiable. We build it correctly from the schema up — not as a retrofit when your first enterprise client asks." },
    { icon: BarChart3, title: "Growth metrics wired in", desc: "Activation rate, feature adoption, MRR expansion — instrumented from launch so you know what to fix before investors ask." },
    { icon: Clock, title: "Core platform in 6 weeks", desc: "Auth, tenancy, billing, and admin panel live in six weeks. Your first customer can sign up and pay from day one." },
    { icon: Globe, title: "API-first, always", desc: "Every feature ships with a REST API. Your customers can integrate — and your team can build a mobile app — from day one." },
    { icon: Zap, title: "Scales with you", desc: "Infrastructure designed for 10 customers and 10,000. Auto-scaling, database read replicas, and CDN configuration included." },
];

const techStack = [
    { icon: Layers, label: "React / Next.js" },
    { icon: Database, label: "PostgreSQL" },
    { icon: Shield, label: "Supabase / Prisma" },
    { icon: CreditCard, label: "Stripe" },
    { icon: Cloud, label: "AWS / Vercel" },
    { icon: Bell, label: "Redis / BullMQ" },
    { icon: Settings, label: "Terraform" },
    { icon: Puzzle, label: "GitHub Actions" },
];

function SaaSPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
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
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
                                Web Development
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            SaaS platforms built to{" "}
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                                grow from day one.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            We build multi-tenant SaaS products with billing, onboarding, and growth infrastructure built in from the start — so you can focus on the product, not the plumbing.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Start your SaaS build <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{r.metric}</div>
                            <div className="mt-2 text-sm text-muted-foreground leading-snug">{r.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PROBLEM / SOLUTION ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">The Reality</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Most SaaS products die in the plumbing, not the product.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Teams spend months building auth, billing, and multi-tenancy before they write a single line of differentiated product code. By the time they launch, they've run out of runway.</p>
                            <p>Or they skip the foundations — and hit a wall the moment a paying customer asks for SSO, a custom subdomain, or an annual invoice.</p>
                            <p>We build the foundations correctly the first time, so your team ships what actually wins customers — not infrastructure every SaaS needs.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Foundations in six weeks. Product shipped in ninety days.</h2>
                        <div className="space-y-3">
                            {[
                                "Billing model designed in week one — architecture built around it",
                                "Multi-tenancy done correctly from the schema, not retrofitted",
                                "Onboarding instrumented from launch — activation metrics wired in",
                                "API-first: every feature ships with REST endpoints and docs",
                                "Infrastructure scales from 10 to 10,000 customers without re-work",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">What We Build</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three pillars. Every SaaS needs all three.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Multi-tenancy, billing, and growth infrastructure — the foundations that let you focus entirely on your differentiated product.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                    className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-7 hover:border-white/20 transition-all duration-300"
                                    whileHover={{ boxShadow: `0 0 60px 0 ${s.glow}` }}>
                                    <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${s.color} mb-6`} />
                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-4 shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                                    <ul className="space-y-2">
                                        {s.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TECH STACK ── */}
            <section className="relative z-10 py-20 px-4 border-y border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <div className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">Every Build Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">A proven stack. No experiments on your product.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {techStack.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-amber-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-amber-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Kick-off to first paying customer in 90 days.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-amber-500/30 to-orange-500/30 bg-clip-text mb-4 select-none group-hover:from-amber-500/60 group-hover:to-orange-500/60 transition-all">{p.step}</div>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We've built the plumbing. You build the product.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-amber-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-border flex items-center justify-center group-hover:border-amber-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-amber-400" />
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

            {/* ── CTA ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Ready to build?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your SaaS idea deserves<br />
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">foundations that won't crack.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute product architecture call. We'll review your idea, recommend the right stack and tenancy model, and give you a clear 90-day build plan.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free architecture call <ArrowUpRight className="h-5 w-5" />
                            </a>
                            <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur hover:bg-secondary transition-colors text-base">
                                Explore all services
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}