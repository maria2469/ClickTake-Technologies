import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Brain, Database, Cpu,
    BarChart3, Shield, Zap, Clock, GitBranch,
    FlaskConical, Package, Globe, Award, Users, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/ai/llm")({
    head: () => ({
        meta: [
            { title: "Custom LLM Development — ClickTake Technologies" },
            {
                name: "description",
                content: "Fine-tuned language models trained on your data for domain-specific intelligence. Production-ready LLMs that understand your industry, terminology, and workflows.",
            },
        ],
    }),
    component: LLMPage,
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
        icon: FlaskConical,
        title: "Fine-Tuning & Alignment",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "Take a foundation model and make it yours. We fine-tune on your proprietary data so the model thinks, speaks, and reasons the way your business needs.",
        items: [
            "Supervised fine-tuning on domain-specific datasets",
            "RLHF and preference alignment for tone and behaviour",
            "LoRA / QLoRA for efficient, cost-effective training",
            "Instruction tuning for task-specific performance",
            "Multi-task learning across related use cases",
            "Continuous learning pipelines for model refresh",
            "Evaluation suites benchmarked against business KPIs",
        ],
    },
    {
        icon: Database,
        title: "RAG & Knowledge Systems",
        color: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.15)",
        desc: "Ground your model in real, current knowledge. RAG architectures let LLMs answer accurately from your internal documents, databases, and live data sources.",
        items: [
            "Vector database setup (Pinecone, Weaviate, pgvector)",
            "Document ingestion pipelines for any format",
            "Hybrid search — semantic + keyword — for precision",
            "Re-ranking and context compression",
            "Citation and source attribution built in",
            "Real-time data integration and live index updates",
            "Multi-tenant knowledge isolation for SaaS products",
        ],
    },
    {
        icon: Cpu,
        title: "Inference & Deployment",
        color: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "A model that lives in a notebook is worthless. We engineer the inference layer — scalable, low-latency, and production-hardened from day one.",
        items: [
            "Model quantisation (INT8/INT4) for cost reduction",
            "vLLM and TGI for high-throughput serving",
            "API gateway with auth, rate limiting, and logging",
            "GPU autoscaling on AWS, GCP, or Azure",
            "Streaming inference for real-time UX",
            "Latency optimisation — p95 < 500ms targets",
            "Monitoring, drift detection, and alerting",
        ],
    },
];

const results = [
    { metric: "40–70%", label: "Cost reduction vs. GPT-4 on equivalent tasks" },
    { metric: "< 500ms", label: "p95 inference latency target" },
    { metric: "10×", label: "Domain accuracy vs. base foundation models" },
    { metric: "6 wks", label: "Average time from brief to production deployment" },
];

const process = [
    { step: "01", title: "Use-Case Audit", desc: "We map your target tasks, success criteria, and data assets. This determines whether fine-tuning, RAG, or a hybrid approach is right." },
    { step: "02", title: "Data Preparation", desc: "Dataset cleaning, deduplication, formatting, and synthetic augmentation to give the model the highest-quality signal." },
    { step: "03", title: "Training Runs", desc: "Iterative fine-tuning with evaluation checkpoints. We track loss, benchmark performance, and adjust hyperparameters." },
    { step: "04", title: "Evaluation & Red-Teaming", desc: "Automated evals plus adversarial testing for hallucination, bias, and edge-case failure modes." },
    { step: "05", title: "Inference Engineering", desc: "Model compression, quantisation, and serving setup. We build the API layer and integrate it into your systems." },
    { step: "06", title: "Monitor & Improve", desc: "Production monitoring dashboards, usage analytics, and a refresh cadence to keep accuracy high as your data evolves." },
];

const differentiators = [
    { icon: Award, title: "Model-agnostic", desc: "We work with Llama, Mistral, Gemma, Phi, and proprietary APIs — whatever gives you the best price-performance for your task." },
    { icon: Shield, title: "Your data stays yours", desc: "We can train entirely within your cloud account. No model weights leave your infrastructure. Full data sovereignty." },
    { icon: BarChart3, title: "Benchmark-driven", desc: "Every model is evaluated against a custom benchmark built around your actual use case — not generic leaderboards." },
    { icon: Clock, title: "Production in weeks", desc: "Our training pipelines are pre-built. Most projects go from signed brief to production API in 4–6 weeks." },
    { icon: GitBranch, title: "Full MLOps handoff", desc: "We deliver the model and the infrastructure to manage it — CI/CD for model updates, versioning, and rollback." },
    { icon: Zap, title: "Cost-engineered from day one", desc: "We design for inference cost targets — quantisation, caching, and batching are planned into the architecture, not bolted on." },
];

const deliverables = [
    { icon: FlaskConical, label: "Fine-Tuned Model Weights" },
    { icon: Database, label: "Vector Knowledge Base" },
    { icon: Cpu, label: "Inference API" },
    { icon: Package, label: "Evaluation Suite" },
    { icon: BarChart3, label: "Monitoring Dashboard" },
    { icon: Globe, label: "API Documentation" },
    { icon: GitBranch, label: "MLOps Pipeline" },
    { icon: Shield, label: "Red-Team Report" },
];

function LLMPage() {
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
                            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
                                AI & Machine Learning
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Language models trained on{" "}
                            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                your world.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            Generic models give generic answers. We build and deploy fine-tuned LLMs that understand your domain, your terminology, and your workflows — at a fraction of GPT-4 inference costs.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Start your LLM project <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{r.metric}</div>
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
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Foundation models don't know your business.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>GPT-4 knows everything and nothing. It hallucinates your product names, misses your internal terminology, and costs a fortune at scale — because it's trained for the world, not for you.</p>
                            <p>Most AI implementations fail because teams bolt a general model onto a specific problem and wonder why accuracy is low and costs are high.</p>
                            <p>Domain-specific models trained on your data outperform general models by 10–40× on targeted tasks — and cost 70% less to run at scale.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Right model. Right data. Right architecture.</h2>
                        <div className="space-y-3">
                            {[
                                "We audit your use case before recommending any approach",
                                "Fine-tuning, RAG, or hybrid — we pick what performs, not what's trendy",
                                "All training happens inside your cloud environment",
                                "Production inference APIs delivered with full MLOps tooling",
                                "Ongoing evaluation and refresh cadence included",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">What We Build</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three capabilities. One production system.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Fine-tuning, knowledge retrieval, and inference engineering — every layer of a production LLM stack.</p>
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
                                                <CheckCircle2 className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />{item}
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Every Engagement Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">You own everything. Model weights included.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-violet-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-violet-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Brief to production in six weeks.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-violet-500/30 to-indigo-500/30 bg-clip-text mb-4 select-none group-hover:from-violet-500/60 group-hover:to-indigo-500/60 transition-all">{p.step}</div>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We build models that ship, not slides.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-violet-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-border flex items-center justify-center group-hover:border-violet-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-violet-400" />
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
                    <div className="rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-10 md:p-14">
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">Ideal For</div>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Who we build LLMs for.</h2>
                                <div className="space-y-3">
                                    {[
                                        { who: "SaaS companies", need: "embedding AI features that require domain accuracy" },
                                        { who: "Enterprises", need: "replacing expensive GPT-4 calls with private, fine-tuned models" },
                                        { who: "Legal & financial firms", need: "private models that never send data to third-party APIs" },
                                        { who: "Healthcare providers", need: "HIPAA-compliant medical language models" },
                                        { who: "E-commerce platforms", need: "product recommendation and search models trained on their catalogue" },
                                    ].map((item) => (
                                        <div key={item.who} className="flex items-start gap-3 text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                                            <span><span className="font-semibold text-foreground">{item.who}</span><span className="text-muted-foreground"> — {item.need}</span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                                    <div className="text-sm font-semibold text-violet-400 mb-1">Starting Point</div>
                                    <div className="text-lg font-bold mb-1">RAG Knowledge System</div>
                                    <div className="text-sm text-muted-foreground">Vector database + retrieval pipeline grounding a foundation model in your internal documents. Fastest path to accurate AI.</div>
                                </div>
                                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                                    <div className="text-sm font-semibold text-indigo-400 mb-1">Full Build</div>
                                    <div className="text-lg font-bold mb-1">Fine-Tuned Production Model</div>
                                    <div className="text-sm text-muted-foreground">Custom-trained model with inference API, monitoring, and MLOps pipeline. Full data sovereignty. You own the weights.</div>
                                </div>
                                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                                    <div className="text-sm font-semibold text-cyan-400 mb-1">Enterprise</div>
                                    <div className="text-lg font-bold mb-1">End-to-End AI Platform</div>
                                    <div className="text-sm text-muted-foreground">Multi-model architecture, evaluation framework, and ongoing model operations. Built into your existing infrastructure.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Ready to build?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Stop paying GPT-4 prices<br />
                            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">for a model that doesn't know you.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute technical scoping call. We'll audit your use case, recommend the right architecture, and give you a realistic project plan.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
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