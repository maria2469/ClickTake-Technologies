import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Eye, ScanSearch, FileSearch,
    BarChart3, Shield, Zap, Clock, Globe,
    Camera, Languages, Package, Award, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/ai/cv-nlp")({
    head: () => ({
        meta: [
            { title: "Computer Vision & NLP — ClickTake Technologies" },
            {
                name: "description",
                content: "Visual recognition, document understanding, and natural language pipelines that process your unstructured data at scale.",
            },
        ],
    }),
    component: CvNlpPage,
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
        icon: Camera,
        title: "Computer Vision",
        color: "from-rose-500 to-pink-600",
        glow: "rgba(244,63,94,0.15)",
        desc: "Make your systems see. We build vision pipelines that classify, detect, segment, and extract information from images and video at production scale.",
        items: [
            "Object detection and classification (YOLO, DETR, SAM)",
            "OCR and document layout understanding",
            "Visual quality control for manufacturing",
            "Face and identity detection (compliance-scoped)",
            "Medical imaging analysis and annotation",
            "Video analytics — activity recognition, tracking",
            "Edge deployment on embedded and mobile hardware",
        ],
    },
    {
        icon: FileSearch,
        title: "Document Intelligence",
        color: "from-indigo-500 to-violet-600",
        glow: "rgba(99,102,241,0.15)",
        desc: "Turn unstructured documents into structured data. We extract, classify, and route information from any document format — at scale, with high accuracy.",
        items: [
            "Invoice, contract, and form data extraction",
            "Multi-format ingestion (PDF, images, scans, HTML)",
            "Table and chart extraction with structure preservation",
            "Classification and routing pipelines",
            "Named entity recognition for legal, financial, medical text",
            "Document comparison and change detection",
            "Compliance review and clause extraction",
        ],
    },
    {
        icon: Languages,
        title: "NLP & Text Intelligence",
        color: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "Understand, classify, and generate language at production scale. We build NLP pipelines that turn text into signals your business can act on.",
        items: [
            "Sentiment and opinion mining at scale",
            "Topic modelling and content classification",
            "Custom NER for domain-specific entity extraction",
            "Semantic search and similarity ranking",
            "Text summarisation for long-form documents",
            "Multi-language pipelines — 50+ languages",
            "Real-time stream processing for social and review data",
        ],
    },
];

const results = [
    { metric: "95%+", label: "Accuracy on production document extraction tasks" },
    { metric: "1000+", label: "Documents or images processed per minute" },
    { metric: "80%", label: "Reduction in manual data entry costs" },
    { metric: "3 wks", label: "Average time to first production pipeline" },
];

const process = [
    { step: "01", title: "Data & Task Audit", desc: "We inventory your data sources, formats, and target outputs. This shapes the model choice and pipeline architecture." },
    { step: "02", title: "Dataset Preparation", desc: "Annotation, labelling, and augmentation. We can also use synthetic data generation to reduce annotation costs." },
    { step: "03", title: "Model Selection & Training", desc: "Foundation model selection or custom training, benchmarked against your specific accuracy and latency requirements." },
    { step: "04", title: "Pipeline Engineering", desc: "End-to-end inference pipeline — pre-processing, model serving, post-processing, and output formatting." },
    { step: "05", title: "Integration & Testing", desc: "API integration into your existing systems, with full load testing and accuracy validation on real data." },
    { step: "06", title: "Monitor & Improve", desc: "Production monitoring for accuracy drift, with retraining pipelines to maintain performance as data distributions shift." },
];

const differentiators = [
    { icon: Award, title: "Domain-specific models", desc: "We fine-tune on your actual data — not generic benchmarks. Domain accuracy consistently beats out-of-the-box solutions by 20–40%." },
    { icon: Shield, title: "Privacy-first architecture", desc: "All processing can run inside your cloud environment. Sensitive documents never leave your infrastructure." },
    { icon: BarChart3, title: "Accuracy-scoped delivery", desc: "We set accuracy targets at the start and don't consider the project complete until they're hit on your real data." },
    { icon: Clock, title: "Fast to first result", desc: "Most data extraction and classification pipelines deliver first production results within three weeks of kick-off." },
    { icon: Globe, title: "Edge to cloud", desc: "We deploy on cloud GPU clusters for throughput or embedded hardware for real-time on-device inference — based on your constraints." },
    { icon: Zap, title: "Cost-engineered", desc: "We design for your throughput requirements, using distillation and quantisation to hit cost-per-document targets." },
];

const deliverables = [
    { icon: Camera, label: "Trained Model" },
    { icon: Package, label: "Inference API" },
    { icon: FileSearch, label: "Extraction Pipeline" },
    { icon: BarChart3, label: "Accuracy Report" },
    { icon: Shield, label: "Test Suite" },
    { icon: Globe, label: "API Documentation" },
    { icon: ScanSearch, label: "Monitoring Setup" },
    { icon: Eye, label: "Annotation Guidelines" },
];

function CvNlpPage() {
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
                            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-400">
                                AI & Machine Learning
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            AI that reads images and{" "}
                            <span className="bg-linear-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                                understands language.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            Vast amounts of business value are locked in unstructured data — images, documents, text. We build computer vision and NLP pipelines that extract that value at production scale.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Discuss your pipeline <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">{r.metric}</div>
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
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Unstructured data is your biggest untapped asset.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>80% of enterprise data is unstructured — images, PDFs, emails, contracts, support tickets. Most of it sits untouched because extracting signal from it manually doesn't scale.</p>
                            <p>Generic APIs like Google Vision or AWS Textract work for simple cases. They break on domain-specific formats, rare layouts, and specialised terminology.</p>
                            <p>Custom-trained vision and NLP models process your exact data formats with accuracy general solutions can't approach — and cost a fraction of manual processing at scale.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-rose-500/20 bg-linear-to-br from-rose-500/5 to-violet-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Purpose-built pipelines. Production accuracy.</h2>
                        <div className="space-y-3">
                            {[
                                "Domain-specific training on your actual data formats",
                                "End-to-end pipeline from raw input to structured output",
                                "Privacy-first — all processing inside your infrastructure",
                                "Accuracy targets agreed upfront and verified on real data",
                                "Monitoring and retraining pipelines included for sustained accuracy",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3">What We Build</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Vision. Documents. Language. All at scale.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Three pipeline categories that cover every major unstructured data challenge your business faces.</p>
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
                                                <CheckCircle2 className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />{item}
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">Every Pipeline Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything to run in production from day one.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-rose-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-linear-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-rose-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Data in. Structured intelligence out.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-linear-to-br from-rose-500/30 to-pink-500/30 bg-clip-text mb-4 select-none group-hover:from-rose-500/60 group-hover:to-pink-500/60 transition-all">{p.step}</div>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We build for accuracy, not demos.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-rose-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-br from-rose-500/10 to-pink-500/10 border border-border flex items-center justify-center group-hover:border-rose-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-rose-400" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">Ready to unlock your data?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your unstructured data is valuable.<br />
                            <span className="bg-linear-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Let's extract that value.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute data audit. We'll review your unstructured data sources and show you what's extractable, at what accuracy, and at what cost.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free data audit <ArrowUpRight className="h-5 w-5" />
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