import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Layers, Monitor, Server,
    BarChart3, Shield, Zap, Clock, GitBranch,
    Package, Globe, Code2, Award, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/web/full-stack")({
    head: () => ({
        meta: [
            { title: "Full-Stack Applications — ClickTake Technologies" },
            {
                name: "description",
                content: "React frontends with Node or Python backends — complete, tested, and handed over cleanly. Full-stack web applications built for production.",
            },
        ],
    }),
    component: FullStackPage,
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
        icon: Monitor,
        title: "React Frontend",
        color: "from-sky-500 to-cyan-600",
        glow: "rgba(14,165,233,0.15)",
        desc: "Performant, accessible React frontends with beautiful UX. Component architectures that scale with your product and teams that inherit them easily.",
        items: [
            "React 18 + TypeScript with strict mode enabled",
            "TanStack Router / Next.js App Router for routing",
            "TanStack Query for server state management",
            "Tailwind CSS with custom design systems",
            "Framer Motion for polished micro-interactions",
            "Accessibility-first (WCAG 2.1 AA compliant)",
            "Lighthouse scores 95+ across all core metrics",
        ],
    },
    {
        icon: Server,
        title: "Node or Python Backend",
        color: "from-emerald-500 to-green-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "Production-grade API layers that connect your React frontend to your data — with auth, validation, and business logic all cleanly separated.",
        items: [
            "Node.js (Hono, Fastify) or Python (FastAPI, Django)",
            "REST and GraphQL APIs with full OpenAPI docs",
            "Database design — PostgreSQL, MySQL, MongoDB",
            "Prisma or SQLAlchemy ORM with migrations",
            "Redis caching for high-performance reads",
            "File storage with S3-compatible object storage",
            "Email, notifications, and webhook integrations",
        ],
    },
    {
        icon: Package,
        title: "Deployment & Ops",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "From Vercel to Kubernetes — we handle deployment, monitoring, and the infrastructure your full-stack application needs to run reliably in production.",
        items: [
            "Vercel / Netlify for frontend edge deployment",
            "Docker + Kubernetes for backend containerisation",
            "CI/CD with automated testing and deployment",
            "Environment management (dev, staging, production)",
            "Error tracking with Sentry, monitoring with Datadog",
            "CDN configuration and edge caching",
            "Database backups, failover, and disaster recovery",
        ],
    },
];

const results = [
    { metric: "95+", label: "Lighthouse performance score on all frontends" },
    { metric: "4–10 wks", label: "Typical full-stack project delivery" },
    { metric: "90%+", label: "Test coverage — frontend and backend" },
    { metric: "99.9%", label: "Uptime target on all production deployments" },
];

const process = [
    { step: "01", title: "Discovery & Design", desc: "User flows, wireframes, and data model design before any code is written. We align on scope, tech choices, and acceptance criteria." },
    { step: "02", title: "Frontend Build", desc: "Component library, routing, and UI implementation. Regular review sessions with your team as features are completed." },
    { step: "03", title: "Backend Build", desc: "API development, database implementation, and business logic with tests written alongside every feature." },
    { step: "04", title: "Integration", desc: "Frontend and backend connected, end-to-end tested across all user flows and edge cases." },
    { step: "05", title: "Deployment", desc: "Production deployment with CI/CD, monitoring, and the full ops stack configured." },
    { step: "06", title: "Handover", desc: "Documentation, codebase walkthrough, and 30 days of post-launch support. Your team takes full ownership." },
];

const differentiators = [
    { icon: Award, title: "One team, full stack", desc: "Frontend and backend built by the same team — no interface friction, no finger-pointing, no coordination overhead between vendors." },
    { icon: Shield, title: "Security engineered in", desc: "OWASP top 10, CSRF protection, input sanitisation, and secure auth patterns built into every project from the start." },
    { icon: BarChart3, title: "Performance by design", desc: "Code splitting, lazy loading, query optimisation, and caching designed in from the architecture phase — not fixed after launch." },
    { icon: Clock, title: "Predictable delivery", desc: "Fixed-scope projects with clear milestones. Weekly demos so you always know where we are and what's next." },
    { icon: GitBranch, title: "Clean code handover", desc: "Full test coverage, comprehensive documentation, and architecture decision records. Future developers will thank you." },
    { icon: Zap, title: "AI-integration ready", desc: "We architect full-stack systems with AI feature integration in mind — streaming responses, async inference, and LLM API patterns built in." },
];

const deliverables = [
    { icon: Code2, label: "React Frontend" },
    { icon: Server, label: "Backend API" },
    { icon: Globe, label: "API Documentation" },
    { icon: Package, label: "Docker Config" },
    { icon: GitBranch, label: "CI/CD Pipeline" },
    { icon: Shield, label: "Test Suites" },
    { icon: BarChart3, label: "Monitoring Stack" },
    { icon: Layers, label: "Architecture Docs" },
];

function FullStackPage() {
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
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400">
                                Web Development
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Full-stack applications{" "}
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                                built to last.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            React frontends paired with Python or Node backends — tested end-to-end, deployed to production, and handed over with documentation your team can actually use.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Scope your application <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">{r.metric}</div>
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
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Split vendor projects create invisible seams.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>When frontend and backend are built by different teams or vendors, you get interface friction, blame games, and integration bugs that nobody owns.</p>
                            <p>Projects handed over without documentation become liabilities. The original developer leaves, and your team inherits code they're afraid to touch.</p>
                            <p>We build full-stack applications as a single, coherent system — one team, one architecture, one set of standards — and we hand it over ready to be owned.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-4">Our Standards</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Complete. Tested. Documented.</h2>
                        <div className="space-y-3">
                            {[
                                "One team owns the full stack — no coordination overhead",
                                "End-to-end tests covering every critical user flow",
                                "API contracts defined and tested against frontend and backend",
                                "Production deployment configured from week one",
                                "Architecture docs and codebase walkthrough at handover",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-sky-400 mt-0.5 shrink-0" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">What We Build</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Frontend. Backend. Infrastructure.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Every layer of a production web application built as one coherent system.</p>
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
                                                <CheckCircle2 className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />{item}
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Every Project Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything your team needs to take ownership.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-sky-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-sky-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Discovery to production in ten weeks.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-sky-500/30 to-cyan-500/30 bg-clip-text mb-4 select-none group-hover:from-sky-500/60 group-hover:to-cyan-500/60 transition-all">{p.step}</div>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">One team. One system. No excuses.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-sky-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border border-border flex items-center justify-center group-hover:border-sky-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-sky-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-4">Ready to build?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            An idea isn't a product.<br />
                            <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Let's build yours properly.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute scoping call. We'll review your requirements and give you an honest estimate, tech recommendation, and delivery timeline.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free scoping call <ArrowUpRight className="h-5 w-5" />
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