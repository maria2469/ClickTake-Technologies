import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, Video, Film, Smartphone,
    Building2, Mic, Clapperboard, Play, BarChart3,
    Clock, Award, Users, Zap, Globe, Star, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/creative/video-production")({
    head: () => ({
        meta: [
            { title: "Video Editing & Production — ClickTake Technologies" },
            { name: "description", content: "Story-led video production for explainers, social platforms, and corporate communications that actually get watched." },
        ],
    }),
    component: VideoProductionPage,
});

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

const services = [
    {
        icon: Play,
        title: "Explainer Videos",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "Turn complex products into clear, compelling stories. Explainer videos increase landing page conversions by up to 80% — ours are built specifically to rank, share, and sell.",
        items: [
            "Animated 2D/3D explainers with custom motion graphics",
            "Live-action product demos and walkthroughs",
            "Whiteboard and hybrid illustration styles",
            "Full script and storyboard development included",
            "Professional voiceover in any accent or language",
            "Custom sound design and music licensing",
            "Multiple length edits (30s, 60s, 90s, full)",
        ],
    },
    {
        icon: Smartphone,
        title: "Social Video",
        color: "from-pink-500 to-rose-600",
        glow: "rgba(236,72,153,0.15)",
        desc: "Platform-native short-form content built for each feed's culture — not repurposed long-form chopped into vertical.",
        items: [
            "Instagram Reels & TikTok — hook-driven, trend-aware",
            "YouTube Shorts — purpose-built or repurposed content",
            "LinkedIn video for thought leadership & culture",
            "Ad-ready cuts — 6s, 15s, and 30s variants",
            "Captions, subtitles, and platform-specific edits",
            "Content strategy and scripting included",
            "Batch production for consistent content calendars",
        ],
    },
    {
        icon: Building2,
        title: "Corporate Video",
        color: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.15)",
        desc: "Build credibility at scale. Corporate video creates powerful impressions with clients, investors, and talent — without needing to be in the room.",
        items: [
            "Cinematic brand films — who you are and why you exist",
            "Client case studies and testimonial interviews",
            "CEO addresses and internal communications",
            "Product launch and announcement videos",
            "Training modules and onboarding content",
            "Event coverage and conference highlight reels",
            "Investor pitch video production",
        ],
    },
];

const results = [
    { metric: "80%", label: "Average conversion lift from explainer videos" },
    { metric: "3×", label: "More time spent on pages with video" },
    { metric: "1200+", label: "Videos produced across all formats" },
    { metric: "48hrs", label: "Turnaround on social video edits" },
];

const process = [
    { step: "01", title: "Brief & Discovery", desc: "We learn your audience, message, and goal. Then we define the video's role in your funnel and what a successful outcome looks like." },
    { step: "02", title: "Script & Storyboard", desc: "Our writers craft a script built around your core message. A visual storyboard is presented for approval before production begins." },
    { step: "03", title: "Production", desc: "Animation build or live-action shoot, voiceover recording, and all B-roll and asset capture." },
    { step: "04", title: "Post-Production", desc: "Editing, colour grading, motion graphics, sound mix, and music. Multiple revision rounds included." },
    { step: "05", title: "Platform Delivery", desc: "Every export optimised for its target platform — aspect ratios, bitrates, captions, and thumbnails all handled." },
    { step: "06", title: "Performance Review", desc: "We track view rate, completion rate, and conversion impact — and use the data to improve the next video." },
];

const differentiators = [
    { icon: Clapperboard, title: "Story-first approach", desc: "Every video starts with a script and story structure — not an edit. Story is what makes people watch to the end." },
    { icon: Award, title: "End-to-end production", desc: "Script, storyboard, production, editing, and delivery — all under one roof. No briefing different vendors at every stage." },
    { icon: Mic, title: "Professional voiceover", desc: "Access to a vetted roster of voiceover artists in multiple accents and languages. No stock-sounding AI voices." },
    { icon: Clock, title: "Fast delivery", desc: "Social video edits in 48 hours. Full explainer videos in 3 weeks. Corporate productions scoped on a project basis." },
    { icon: Globe, title: "Platform-native formats", desc: "We know exactly how each platform rewards video. Every deliverable is built for where it will actually run." },
    { icon: BarChart3, title: "Conversion-focused", desc: "We design every video with a specific conversion goal — watch time, click-through, or form completion." },
];

const deliverables = [
    { icon: Film, label: "Script & Storyboard" },
    { icon: Play, label: "Master Video File" },
    { icon: Smartphone, label: "Platform-Sized Cuts" },
    { icon: Mic, label: "Voiceover Recording" },
    { icon: Star, label: "Motion Graphics" },
    { icon: Video, label: "Social Edits" },
    { icon: Zap, label: "Source Project Files" },
    { icon: Users, label: "Thumbnail Design" },
];

export default function VideoProductionPage() {
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
                                Creative Services
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Video that makes people{" "}
                            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                watch and act.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            Video is the highest-converting content format on the internet. We produce story-led videos that stop the scroll, communicate your value in seconds, and move viewers to act.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Start your video project <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{r.metric}</div>
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
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">People skip ads. They don't skip good stories.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>Audiences skip ads in 5 seconds, ignore banners, and skim blog posts. But they watch video — if it's built to hold their attention from the first frame.</p>
                            <p>Most business video fails because it starts with production, not story. The result is polished content with nothing to say — watched once, forgotten immediately.</p>
                            <p>We start with message, audience, and goal. Production is the last step — and it shows in the results.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-pink-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Story first. Production second.</h2>
                        <div className="space-y-3">
                            {[
                                "Every video starts with a brief, script, and storyboard approval",
                                "Platform-native — built for where it will run, not just where it looks good",
                                "Full production end-to-end — script to delivery under one roof",
                                "Conversion-focused — every video has a measurable objective",
                                "Fast turnarounds — social edits in 48hrs, explainers in 3 weeks",
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">What We Produce</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three formats. Every platform. One team.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Explainers, social video, and corporate production — each built for a specific audience and conversion goal.</p>
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
                        <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">Every Project Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to publish, nothing you don't.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {deliverables.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-violet-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Brief to published in three weeks.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-violet-500/30 to-pink-500/30 bg-clip-text mb-4 select-none group-hover:from-violet-500/60 group-hover:to-pink-500/60 transition-all">{p.step}</div>
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
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We don't just shoot. We engineer results.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-violet-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-border flex items-center justify-center group-hover:border-violet-500/30 transition-colors">
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

            {/* ── CTA ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Ready to roll?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your audience is watching video.<br />
                            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Is yours worth watching?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute video strategy call. We'll discuss your goals, recommend the right format, and give you a clear brief for your first video.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free strategy call <ArrowUpRight className="h-5 w-5" />
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