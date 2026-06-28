import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Wand2, FileText, TestTube,
    BarChart3, Shield, Zap, Clock, RefreshCw,
    Package, GitBranch, Layers, Award, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/ai/prompt-engineering")({
    head: () => ({
        meta: [
            { title: "AI Prompt Engineering — ClickTake Technologies" },
            {
                name: "description",
                content: "Structured prompt systems that make foundation models reliably useful for your workflows — consistent, testable, and production-ready.",
            },
        ],
    }),
    component: PromptEngineeringPage,
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
        icon: FileText,
        title: "Prompt System Design",
        color: "from-amber-500 to-orange-600",
        glow: "rgba(245,158,11,0.15)",
        desc: "Turn ad-hoc prompts into engineered systems. We design prompt architectures that produce consistent, reliable outputs at production scale — not just in demos.",
        items: [
            "System prompt architecture for your specific use case",
            "Few-shot example selection and formatting strategies",
            "Chain-of-thought and reasoning scaffolds",
            "Output format specification (JSON, structured text, code)",
            "Context window management and compression techniques",
            "Role and persona design for consistent behaviour",
            "Multi-turn conversation state management",
        ],
    },
    {
        icon: TestTube,
        title: "Evaluation & Benchmarking",
        color: "from-violet-500 to-purple-700",
        glow: "rgba(139,92,246,0.15)",
        desc: "You can't improve what you don't measure. We build eval frameworks that quantify prompt performance and make optimisation systematic, not guesswork.",
        items: [
            "Custom eval datasets reflecting your real workload",
            "Automated scoring with LLM-as-judge frameworks",
            "Hallucination detection and factuality metrics",
            "Regression testing for prompt changes",
            "A/B testing infrastructure for prompt variants",
            "Cost and latency benchmarking across models",
            "Human eval pipelines with inter-rater reliability",
        ],
    },
    {
        icon: Package,
        title: "Prompt Ops & Versioning",
        color: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "Manage prompts like code. Version control, deployment pipelines, and monitoring infrastructure that makes your prompt layer a first-class engineering concern.",
        items: [
            "Prompt registry and version control system",
            "CI/CD pipeline for prompt testing and deployment",
            "Production monitoring for output quality drift",
            "Rollback mechanisms for degraded performance",
            "Prompt template library for team reuse",
            "Cost optimisation through prompt compression",
            "Multi-model routing based on task complexity",
        ],
    },
];

const results = [
    { metric: "3–10×", label: "Output consistency improvement over ad-hoc prompts" },
    { metric: "40–60%", label: "Cost reduction through prompt compression and routing" },
    { metric: "< 2 wks", label: "Time to first production-grade prompt system" },
    { metric: "100%", label: "Prompts covered by automated regression tests" },
];

const process = [
    { step: "01", title: "Use-Case Analysis", desc: "We audit your current prompt usage, identify failure modes, and map the tasks that need the highest reliability." },
    { step: "02", title: "Eval Dataset Creation", desc: "We build a golden dataset of inputs and expected outputs — the benchmark everything is measured against." },
    { step: "03", title: "Prompt Architecture", desc: "System design, few-shot selection, and output formatting — all engineered against your eval dataset." },
    { step: "04", title: "Iterative Optimisation", desc: "We run scoring loops against the eval, identify weakest performing cases, and iterate until targets are hit." },
    { step: "05", title: "Prompt Ops Setup", desc: "Version control, CI/CD pipeline, and monitoring infrastructure deployed so your team can manage prompts confidently." },
    { step: "06", title: "Team Handoff", desc: "Documentation, internal training, and a prompt engineering playbook your team can use to extend the system themselves." },
];

const differentiators = [
    { icon: Award, title: "Eval-first methodology", desc: "Every prompt is developed against a test suite. We ship prompts when they pass benchmarks — not when they look good in a demo." },
    { icon: BarChart3, title: "Quantified improvement", desc: "We baseline your current outputs before starting. Every engagement ends with a measured improvement report." },
    { icon: GitBranch, title: "Model-agnostic", desc: "We optimise for GPT-4o, Claude, Gemini, and open models. We recommend the best model per task based on cost-performance data." },
    { icon: Clock, title: "Fast results", desc: "First production-grade prompt system in under two weeks. Immediate improvement in output consistency and reliability." },
    { icon: RefreshCw, title: "Maintained systems", desc: "Retainer options for ongoing prompt optimisation as your models, use cases, and evaluation data evolve." },
    { icon: Zap, title: "Cost engineering included", desc: "Prompt compression, model routing, and caching strategies reduce your inference spend alongside accuracy improvements." },
];

const deliverables = [
    { icon: FileText, label: "Prompt Library" },
    { icon: TestTube, label: "Eval Dataset" },
    { icon: BarChart3, label: "Benchmark Report" },
    { icon: GitBranch, label: "Version Control Setup" },
    { icon: Package, label: "CI/CD Pipeline" },
    { icon: Shield, label: "Regression Tests" },
    { icon: Layers, label: "Prompt Playbook" },
    { icon: RefreshCw, label: "Monitoring Alerts" },
];

function PromptEngineeringPage() {
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
                                AI & Machine Learning
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Prompts engineered for{" "}
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                                production, not demos.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            A clever prompt in a notebook proves nothing. We build prompt systems that are tested, versioned, and monitored — producing consistent, reliable outputs at production scale.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Engineer your prompts <ArrowUpRight className="h-4 w-4" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">The Problem</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Ad-hoc prompts break in production.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Teams spend weeks crafting prompts that work in demos, then watch them degrade under real workloads — inconsistent outputs, hallucinations on edge cases, and no way to tell when things get worse.</p>
                            <p>The problem is treating prompts as creative writing instead of engineering. There's no eval framework, no version control, and no monitoring.</p>
                            <p>Prompt engineering done right is a disciplined, measurement-driven process. The outputs are prompt systems that behave predictably across thousands of real inputs.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Eval-first. Measured. Maintained.</h2>
                        <div className="space-y-3">
                            {[
                                "Every prompt developed against a custom benchmark dataset",
                                "Automated scoring that quantifies improvement at every iteration",
                                "Version control and CI/CD pipeline for safe prompt deployment",
                                "Production monitoring to catch quality drift before users do",
                                "Full documentation and team training included in every engagement",
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">What We Deliver</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Design. Evaluate. Operate.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Three layers of prompt engineering — each one making your AI outputs more reliable and more cost-effective.</p>
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

            {/* ── DELIVERABLES ── */}
            <section className="relative z-10 py-20 px-4 border-y border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <div className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">Every Engagement Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Systems your team can own and extend.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From scattered prompts to a production system.</h2>
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Engineering rigour. Measurable results.</h2>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Ready to get reliable?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Stop hoping your prompts work.<br />
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Start knowing they do.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute prompt audit. We'll review your current AI outputs, identify the biggest reliability gaps, and show you what a proper eval framework would catch.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free prompt audit <ArrowUpRight className="h-5 w-5" />
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