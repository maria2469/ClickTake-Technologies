import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Server, Database, Zap,
    BarChart3, Shield, Clock, GitBranch,
    Package, Globe, Cloud, Code2, Award, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/web/python-backend")({
    head: () => ({
        meta: [
            { title: "Python Backend Development — ClickTake Technologies" },
            {
                name: "description",
                content: "FastAPI, Django, and async Python systems built for real-world load. Production-grade backends delivered with full test coverage and clean handover.",
            },
        ],
    }),
    component: PythonBackendPage,
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
        icon: Zap,
        title: "FastAPI & Async Systems",
        color: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.15)",
        desc: "High-performance async APIs for demanding workloads. We build FastAPI backends that handle real traffic — tested, documented, and production-hardened.",
        items: [
            "FastAPI with async/await for maximum throughput",
            "Pydantic v2 schema validation and serialisation",
            "WebSocket endpoints for real-time features",
            "Background task processing with Celery / ARQ",
            "OpenAPI / Swagger documentation auto-generated",
            "JWT + OAuth2 authentication out of the box",
            "Performance profiling and query optimisation",
        ],
    },
    {
        icon: Database,
        title: "Django & Data-Heavy Systems",
        color: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "Django's ORM and admin for data-intensive applications where reliability and rapid iteration matter more than raw throughput.",
        items: [
            "Django ORM with complex query optimisation",
            "Django REST Framework and GraphQL APIs",
            "Custom admin interfaces for operations teams",
            "Django Channels for real-time WebSocket features",
            "Multi-database setups and database sharding",
            "Celery task queues with Redis / RabbitMQ",
            "Full Django test suite with pytest-django",
        ],
    },
    {
        icon: Cloud,
        title: "Infrastructure & DevOps",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "Code without infrastructure is a prototype. We deploy, containerise, and monitor every backend we build — handing over a system you can run and scale.",
        items: [
            "Docker and docker-compose for reproducible environments",
            "Kubernetes deployments on EKS, GKE, or AKS",
            "CI/CD pipelines with GitHub Actions or GitLab CI",
            "PostgreSQL, MySQL, Redis, and MongoDB setup",
            "AWS / GCP / Azure infrastructure as code (Terraform)",
            "Application monitoring with Datadog, Grafana, Sentry",
            "Auto-scaling policies and cost alerting",
        ],
    },
];

const results = [
    { metric: "99.9%", label: "Uptime target on all production deployments" },
    { metric: "< 100ms", label: "p95 API response time target" },
    { metric: "90%+", label: "Test coverage on all delivered codebases" },
    { metric: "4–8 wks", label: "Typical backend to production timeline" },
];

const process = [
    { step: "01", title: "Architecture Design", desc: "We map your data models, traffic patterns, and integration requirements before writing a line of code." },
    { step: "02", title: "API Design", desc: "RESTful or GraphQL API design with full schema documentation. Reviewed and approved before implementation." },
    { step: "03", title: "Test-Driven Build", desc: "Implementation with tests written first. We don't consider a feature done until its test suite is green." },
    { step: "04", title: "Code Review & QA", desc: "Internal code review plus automated linting, type checking, and security scanning on every commit." },
    { step: "05", title: "Deployment", desc: "Containerised deployment to your cloud environment with CI/CD, monitoring, and alerting configured." },
    { step: "06", title: "Handover & Support", desc: "Documentation, onboarding session, and 30 days of post-launch support included in every engagement." },
];

const differentiators = [
    { icon: Award, title: "Test-first culture", desc: "We write tests before features — not as an afterthought. Every codebase we deliver has 90%+ coverage and a working CI pipeline." },
    { icon: Shield, title: "Security by default", desc: "OWASP top 10 addressed in every project. Rate limiting, input validation, and secrets management engineered in from the start." },
    { icon: BarChart3, title: "Performance profiled", desc: "Every production system ships with performance baselines established. Slow queries and bottlenecks found before they hit users." },
    { icon: Clock, title: "Clean handover", desc: "Documented APIs, onboarding guides, and architecture decision records. Your team can maintain and extend the code from day one." },
    { icon: GitBranch, title: "Modern Python standards", desc: "Python 3.12+, type hints throughout, ruff linting, and mypy type checking. Code that reads clean and runs clean." },
    { icon: Code2, title: "AI-ready architecture", desc: "We build Python backends with ML integration patterns — async inference, vector stores, streaming endpoints — so adding AI features is straightforward." },
];

const deliverables = [
    { icon: Code2, label: "Source Code" },
    { icon: Database, label: "Database Schema" },
    { icon: Globe, label: "API Documentation" },
    { icon: Package, label: "Docker Setup" },
    { icon: GitBranch, label: "CI/CD Pipeline" },
    { icon: Shield, label: "Test Suite" },
    { icon: BarChart3, label: "Monitoring Stack" },
    { icon: Server, label: "Architecture Docs" },
];

function PythonBackendPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
            <BackgroundScene />
            <CustomCursor />
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative pt-36 pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className="mb-5">
                            <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                                <ArrowLeft className="h-4 w-4" /> Back to Services
                            </Link>
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                                Web Development
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Python backends that{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                hold under pressure.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            FastAPI and Django systems built test-first, documented thoroughly, and deployed to production with full monitoring. Code your team can own, not decipher.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Scope your backend <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{r.metric}</div>
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
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Fast backends that fall apart under load.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Most backend projects start fast and end with tech debt: untested code, N+1 query problems, no documentation, and deployment that only the original dev understands.</p>
                            <p>When scale hits — or the original developer leaves — the cost of that early velocity becomes painful. Refactoring a production backend is expensive, risky, and demoralising.</p>
                            <p>We build backends the right way from the start: tested, typed, documented, and deployed with proper observability. Slower upfront, dramatically cheaper over time.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Our Standards</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Test-first. Typed. Production-ready.</h2>
                        <div className="space-y-3">
                            {[
                                "Type hints throughout — mypy strict mode, no Any types",
                                "Test-driven development with 90%+ coverage minimum",
                                "OpenAPI docs generated automatically from code",
                                "Docker + CI/CD configured on day one, not day last",
                                "30-day post-launch support and clean team handover included",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">What We Build</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Framework. Database. Infrastructure.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Three capability areas that cover every layer of a production Python backend — from API design to cloud deployment.</p>
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
                                                <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />{item}
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Every Backend Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Code you can run, understand, and extend.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-cyan-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-cyan-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Architecture to production in eight weeks.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-cyan-500/30 to-blue-500/30 bg-clip-text mb-4 select-none group-hover:from-cyan-500/60 group-hover:to-blue-500/60 transition-all">{p.step}</div>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We engineer backends, not just write code.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-cyan-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-border flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-cyan-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Ready to build?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your backend should be an asset,<br />
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">not a liability.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute technical scoping call. We'll review your requirements and give you an honest architecture recommendation and project estimate.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
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