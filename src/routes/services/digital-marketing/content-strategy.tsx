import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, BarChart3, FileText,
    Mail, Globe, Search, Layers, TrendingUp, Users,
    Zap, Award, Clock, Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/services/digital-marketing/content-strategy")({
    head: () => ({
        meta: [
            { title: "Content Strategy & Copywriting — ClickTake Technologies" },
            { name: "description", content: "SEO-aligned content strategy and conversion copywriting that compounds traffic and revenue over time." },
        ],
    }),
    component: ContentStrategyPage,
});

/* ─── Animation helpers ─────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

/* ─── Data ──────────────────────────────────────────────── */
const services = [
    {
        icon: Layers,
        title: "Content Strategy",
        color: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.15)",
        items: [
            "Full content audit with gap analysis",
            "Topic cluster mapping around buyer intent",
            "3–6 month editorial calendar",
            "Competitor content benchmarking",
            "Channel & frequency strategy",
        ],
    },
    {
        icon: Search,
        title: "SEO Copywriting",
        color: "from-violet-500 to-purple-700",
        glow: "rgba(139,92,246,0.15)",
        items: [
            "Long-form articles (1,500–4,000 words)",
            "Pillar pages & service pages",
            "Case studies that earn trust",
            "Thought leadership & bylines",
            "Featured-snippet optimisation",
        ],
    },
    {
        icon: TrendingUp,
        title: "Conversion Copywriting",
        color: "from-pink-500 to-rose-600",
        glow: "rgba(236,72,153,0.15)",
        items: [
            "Landing pages that eliminate doubt",
            "Email welcome & nurture sequences",
            "Google, Meta & LinkedIn ad copy",
            "Full website rewrites",
            "CTA and headline testing",
        ],
    },
];

const process = [
    { step: "01", title: "Discovery Call", desc: "We learn your business, audience, competitors, and goals. No template intake forms — a real strategic conversation." },
    { step: "02", title: "Audit & Research", desc: "We audit your existing content, map your competitors' rankings, and identify exactly where the opportunity sits." },
    { step: "03", title: "Strategy Blueprint", desc: "You receive a full content architecture — topic clusters, channel mix, publication cadence, and 90-day editorial plan." },
    { step: "04", title: "Write & Optimise", desc: "Our writers produce every piece in your brand voice, SEO-optimised, and tied to a specific conversion objective." },
    { step: "05", title: "Publish & Distribute", desc: "Content goes live with technical SEO checks, then gets distributed across channels for maximum reach." },
    { step: "06", title: "Measure & Compound", desc: "Monthly reporting on traffic, rankings, and leads. We iterate based on what's working — and double down." },
];

const differentiators = [
    { icon: Award, title: "Strategy Before Writing", desc: "Every engagement starts with research and architecture. We don't put fingers to keyboard until we know exactly what to say and why." },
    { icon: Users, title: "Your Brand Voice", desc: "No generic AI filler. We interview your team, study your existing content, and write copy that sounds unmistakably like you." },
    { icon: Zap, title: "SEO on Every Deliverable", desc: "Keyword targeting, internal linking, schema, and snippet optimisation are built into every piece — not an add-on." },
    { icon: BarChart3, title: "Tied to Revenue", desc: "Every piece of content has a measurable objective. We track rankings, traffic, leads, and revenue — not just views." },
    { icon: Clock, title: "Consistent Velocity", desc: "Content compounds over time only if you publish consistently. We handle the calendar so you never miss a beat." },
    { icon: Globe, title: "Multi-Channel Reach", desc: "We don't just write — we distribute. Every piece is adapted for organic search, social, email, and paid channels." },
];

const results = [
    { metric: "3.2×", label: "Average traffic increase in 6 months" },
    { metric: "68%", label: "Of clients rank page 1 within 90 days" },
    { metric: "41%", label: "Average improvement in lead conversion" },
    { metric: "120+", label: "Brands grown with content strategy" },
];

const deliverables = [
    { icon: FileText, label: "Content Audit Report" },
    { icon: Layers, label: "Topic Cluster Map" },
    { icon: Globe, label: "Editorial Calendar" },
    { icon: Search, label: "Keyword Research Deck" },
    { icon: Star, label: "SEO-Optimised Articles" },
    { icon: Mail, label: "Email Sequences" },
    { icon: TrendingUp, label: "Monthly Performance Report" },
    { icon: BarChart3, label: "Conversion Copy" },
];

/* ─── Page ──────────────────────────────────────────────── */
function ContentStrategyPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
            <BackgroundScene />
            <CustomCursor />
            <Navbar />

            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="relative pt-44 pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>

                        <motion.div variants={fadeUp} className="mb-5">
                            <Link to="/services" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
                                <ArrowLeft className="h-4 w-4" /> Back to Services
                            </Link>
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                                Digital Marketing
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl"
                        >
                            Content that{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                                compounds.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            Most businesses publish content. Few have a strategy. We build editorial systems and write words that attract the right audience, earn their trust, and convert them into customers — month after month.
                        </motion.p>

                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform"
                            >
                                Start your content strategy <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors"
                            >
                                See what's included
                            </a>
                        </motion.div>

                    </motion.div>
                </div>

                {/* decorative blurs */}
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ────────────────────────────────────── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div
                            key={r.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                                {r.metric}
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground leading-snug">{r.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PROBLEM / SOLUTION ─────────────────────────────── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">The Problem</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                            Publishing without strategy is just noise.
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Without a deliberate framework connecting topics, search intent, and funnel stages, you're producing content that nobody finds and nobody acts on.</p>
                            <p>Most businesses are stuck in a cycle of publishing blog posts that get zero traffic, writing copy that doesn't convert, and producing content their competitors are already outranking them on.</p>
                            <p>The result? Wasted budget, demoralised teams, and a content channel that feels like a cost centre instead of a growth engine.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-violet-600/5 p-8 backdrop-blur"
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                            A system that earns traffic on autopilot.
                        </h2>
                        <div className="space-y-3">
                            {[
                                "Research-first — we know exactly what your audience is searching before writing a word",
                                "Architecture-led — topic clusters that build topical authority, not random posts",
                                "Conversion-aware — every piece is mapped to a funnel stage and objective",
                                "Compounding — content keeps ranking and converting long after it's published",
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

            {/* ── SERVICE CARDS ──────────────────────────────────── */}
            <section id="services" className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">What We Do</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three pillars. One system.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                            Strategy, SEO writing, and conversion copy — each one essential, most powerful together.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div
                                    key={s.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.55 }}
                                    className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-7 hover:border-white/20 transition-all duration-300"
                                    style={{ boxShadow: `0 0 0 0 ${s.glow}` }}
                                    whileHover={{ boxShadow: `0 0 60px 0 ${s.glow}` }}
                                >
                                    {/* gradient top bar */}
                                    <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${s.color} mb-6`} />

                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-5 shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">{s.title}</h3>

                                    <ul className="space-y-2.5">
                                        {s.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── DELIVERABLES ───────────────────────────────────── */}
            <section className="relative z-10 py-20 px-4 border-y border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Every Engagement Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Tangible deliverables, not vague retainers.</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div
                                    key={d.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-cyan-500/30 transition-colors"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <span className="text-sm font-medium leading-snug">{d.label}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── PROCESS ────────────────────────────────────────── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From brief to compounding traffic.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                            A clear, repeatable process so you always know what's happening and what's coming next.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div
                                key={p.step}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group"
                            >
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-cyan-500/30 to-violet-600/30 bg-clip-text mb-4 select-none group-hover:from-cyan-500/60 group-hover:to-violet-600/60 transition-all">
                                    {p.step}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DIFFERENTIATORS ────────────────────────────────── */}
            <section className="relative z-10 py-24 px-4 border-t border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Not all content agencies are equal.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                            Here's what separates work that compounds from work that sits on a drive collecting dust.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div
                                    key={d.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-cyan-500/30 transition-colors group"
                                >
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-600/10 border border-border flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
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

            {/* ── WHO IT'S FOR ───────────────────────────────────── */}
            <section className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-10 md:p-14">
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Ideal For</div>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                                    Is this the right service for your business?
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { who: "SaaS & tech companies", need: "building organic pipeline to reduce CAC" },
                                        { who: "Professional service firms", need: "establishing authority in competitive niches" },
                                        { who: "E-commerce brands", need: "driving SEO traffic and reducing paid ad dependency" },
                                        { who: "Startups & scale-ups", need: "building a content moat before competitors do" },
                                        { who: "B2B businesses", need: "generating inbound leads from long-form content" },
                                    ].map((item) => (
                                        <div key={item.who} className="flex items-start gap-3 text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                                            <span>
                                                <span className="font-semibold text-foreground">{item.who}</span>
                                                <span className="text-muted-foreground"> — {item.need}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                                    <div className="text-sm font-semibold text-cyan-400 mb-1">Retainer</div>
                                    <div className="text-lg font-bold mb-1">Ongoing Content Programme</div>
                                    <div className="text-sm text-muted-foreground">Strategy + writing + distribution, on a rolling monthly engagement. Minimum 3 months.</div>
                                </div>
                                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                                    <div className="text-sm font-semibold text-violet-400 mb-1">Project</div>
                                    <div className="text-lg font-bold mb-1">Strategy Sprint</div>
                                    <div className="text-sm text-muted-foreground">A 4-week engagement delivering your full content architecture, keyword research, and 90-day editorial plan.</div>
                                </div>
                                <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
                                    <div className="text-sm font-semibold text-pink-400 mb-1">One-off</div>
                                    <div className="text-lg font-bold mb-1">Content & Copy Packages</div>
                                    <div className="text-sm text-muted-foreground">Standalone articles, landing pages, email sequences, or ad copy — scoped and priced individually.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Ready to start?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your competitors are publishing.<br />
                            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                                Are you ranking?
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute content audit call. We'll review your current content, identify your biggest opportunities, and show you exactly what we'd do first.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base"
                            >
                                Book a free content audit <ArrowUpRight className="h-5 w-5" />
                            </a>
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur hover:bg-secondary transition-colors text-base"
                            >
                                Explore all services
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </section>
        </div>
    );
}