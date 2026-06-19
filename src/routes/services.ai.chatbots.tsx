import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Bot, MessageSquare, Workflow,
    BarChart3, Shield, Zap, Clock, Globe,
    Headphones, ShoppingCart, Users, Award, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/ai/chatbots")({
    head: () => ({
        meta: [
            { title: "AI Chatbots & Agents — ClickTake Technologies" },
            {
                name: "description",
                content: "Autonomous AI agents that handle support, sales, and operations around the clock — without human intervention.",
            },
        ],
    }),
    component: ChatbotsPage,
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
        icon: Headphones,
        title: "Customer Support Agents",
        color: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.15)",
        desc: "Resolve 70–80% of support tickets without a human — instantly, at any hour, in any language. Escalation to your team only when it genuinely matters.",
        items: [
            "Natural language understanding across all ticket types",
            "Deep integration with Zendesk, Intercom, Freshdesk",
            "Knowledge base grounding with citation and accuracy controls",
            "Sentiment detection and priority escalation routing",
            "Multi-language support — 50+ languages",
            "CSAT tracking and conversation analytics",
            "Human handoff with full context preservation",
        ],
    },
    {
        icon: ShoppingCart,
        title: "Sales & Lead Agents",
        color: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "Qualify leads, book meetings, and answer product questions 24/7. Your best salesperson — available at 3am on a Sunday.",
        items: [
            "Prospect qualification with custom scoring logic",
            "Product recommendation based on buyer intent signals",
            "Calendar booking with CRM sync (HubSpot, Salesforce)",
            "Outbound follow-up sequences triggered by behaviour",
            "Objection handling trained on your winning conversations",
            "Pipeline stage updates and rep notifications",
            "A/B testing for conversation flows and scripts",
        ],
    },
    {
        icon: Workflow,
        title: "Autonomous Operations Agents",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "Multi-step agents that operate across your tools — reading, deciding, and executing without waiting for a human in the loop.",
        items: [
            "Tool-using agents with 100+ integration connectors",
            "Multi-agent orchestration for complex workflows",
            "Email triage, summarisation, and draft generation",
            "Document processing and data extraction pipelines",
            "Scheduled and event-triggered autonomous tasks",
            "Audit logs and approval gates for sensitive actions",
            "LangChain, CrewAI, and custom agent frameworks",
        ],
    },
];

const results = [
    { metric: "70–80%", label: "Support ticket deflection rate" },
    { metric: "< 2s", label: "Average first response time" },
    { metric: "24/7", label: "Availability with zero marginal cost" },
    { metric: "3×", label: "Lead qualification throughput vs. human team" },
];

const process = [
    { step: "01", title: "Workflow Mapping", desc: "We document every conversation type, decision point, and integration your agent needs to handle. Nothing is left to assumptions." },
    { step: "02", title: "Knowledge Architecture", desc: "We structure your product docs, FAQs, policies, and CRM data into the knowledge layer the agent reasons from." },
    { step: "03", title: "Agent Build & Tuning", desc: "Conversation flows, tool integrations, escalation logic, and persona — all built and iteratively tested." },
    { step: "04", title: "Shadow Mode Testing", desc: "The agent runs alongside your human team for two weeks — we compare its decisions against human ones and close the gaps." },
    { step: "05", title: "Live Deployment", desc: "Phased rollout starting with low-risk ticket types. Traffic expanded as confidence metrics hit targets." },
    { step: "06", title: "Continuous Improvement", desc: "Weekly review of mishandled conversations. Model updates, flow adjustments, and new capability rollouts on a defined cadence." },
];

const differentiators = [
    { icon: Award, title: "Outcome-scoped builds", desc: "We scope every project against a deflection rate or conversion target — not lines of code or number of intents." },
    { icon: Shield, title: "Guardrails built in", desc: "Hallucination prevention, topic boundaries, and PII handling are engineered into the agent — not added as an afterthought." },
    { icon: BarChart3, title: "Full analytics suite", desc: "Every conversation logged, scored, and surfaced in a dashboard. You always know exactly how your agent is performing." },
    { icon: Clock, title: "Live in 4 weeks", desc: "Most customer support and sales agents go from kick-off to live deployment in under four weeks." },
    { icon: Globe, title: "Omnichannel native", desc: "One agent, every channel — web chat, WhatsApp, SMS, email, Slack, and Teams. No per-channel rebuilds." },
    { icon: Zap, title: "Human-in-the-loop ready", desc: "Escalation architecture designed from day one. Agents hand off with full conversation context — no copy-paste for your team." },
];

const channels = [
    { icon: MessageSquare, label: "Web Chat" },
    { icon: Globe, label: "WhatsApp" },
    { icon: Bot, label: "Slack / Teams" },
    { icon: Headphones, label: "Email Triage" },
    { icon: ShoppingCart, label: "SMS" },
    { icon: Users, label: "Voice (IVR)" },
    { icon: Workflow, label: "API / Webhook" },
    { icon: BarChart3, label: "Analytics Hub" },
];

function ChatbotsPage() {
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
                                AI & Machine Learning
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            AI agents that work while{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                                your team sleeps.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            We build AI chatbots and autonomous agents that resolve support tickets, qualify leads, and run operations workflows — without human intervention, at any scale.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Build your AI agent <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">The Reality</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Most chatbots are expensive FAQ pages.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Rule-based chatbots fail the moment a customer asks anything slightly outside the script. The result: frustrated users, poor CSAT, and your team still buried in tickets.</p>
                            <p>Most "AI chatbots" are one-turn systems that can't take action, can't integrate with your tools, and can't reason across context.</p>
                            <p>We build agents — systems that understand intent, use your data, call your APIs, and complete real tasks from start to finish.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Agents that understand, decide, and act.</h2>
                        <div className="space-y-3">
                            {[
                                "Intent understanding from real conversation data, not rigid flows",
                                "Tool-using agents that call APIs, update CRMs, book calendars",
                                "Knowledge-grounded responses with accuracy controls",
                                "Omnichannel — web, WhatsApp, Slack, email from one build",
                                "Shadow mode testing before any live traffic is handled",
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three agent types. Every use case.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Support, sales, and operations — each agent purpose-built for the outcomes your business needs most.</p>
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

            {/* ── CHANNELS ── */}
            <section className="relative z-10 py-20 px-4 border-y border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Every Deployment Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">One build. Every channel your customers use.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {channels.map((d, i) => {
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Kick-off to live agent in four weeks.</h2>
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We build agents that earn their keep.</h2>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Ready to automate?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your customers want answers now.<br />
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Give them an agent that never sleeps.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute agent scoping call. We'll map your highest-volume workflows and show you exactly what can be automated in 30 days.
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