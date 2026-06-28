import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, CheckCircle2, MousePointerClick, FlaskConical,
  LayoutTemplate, RefreshCw, BarChart3, Eye,
  Zap, Award, Clock, Users, TrendingUp, Star, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/digital-marketing/cro")({
  head: () => ({
    meta: [
      { title: "Conversion Rate Optimisation — ClickTake Technologies" },
      { name: "description", content: "Turn more of your existing traffic into leads and revenue with systematic CRO." },
    ],
  }),
  component: CroPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

const services = [
  {
    icon: Eye,
    title: "CRO Audit & Research",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.15)",
    desc: "We don't guess. Before changing anything, we spend time understanding exactly what's happening on your site and why visitors aren't converting.",
    items: [
      "Heatmap & session recording analysis — see where users click, scroll, and abandon",
      "Funnel drop-off analysis — identify pages bleeding the most conversions",
      "User surveys & exit intent research — ask visitors directly what stopped them",
      "Technical friction audit — page speed, mobile UX, form usability, checkout flow",
      "Competitor benchmarking — what are high-converting competitors doing differently?",
    ],
  },
  {
    icon: FlaskConical,
    title: "A/B Testing & Experimentation",
    color: "from-teal-500 to-cyan-600",
    glow: "rgba(20,184,166,0.15)",
    desc: "Every change we recommend is tested — never deployed based on opinion. Our structured experimentation programme builds a compounding bank of conversion learnings.",
    items: [
      "Hypothesis development — prioritised test backlog based on impact & confidence",
      "A/B and multivariate testing — statistically significant tests on headlines, CTAs, layouts",
      "Landing page optimisation — dedicated test variants for highest-traffic pages",
      "Personalisation testing — different experiences for different traffic sources",
    ],
  },
  {
    icon: LayoutTemplate,
    title: "Landing Page & Funnel Design",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.15)",
    desc: "Sometimes the fastest path to better conversions isn't testing — it's rebuilding. We design high-converting pages and funnels from the ground up.",
    items: [
      "Lead generation pages — optimised for form completions with minimal friction",
      "Sales pages — long-form persuasion pages for higher-ticket products and services",
      "E-commerce product pages — layout, copy, and trust signal optimisation",
      "Checkout optimisation — reducing abandonment with streamlined flows",
    ],
  },
];

const results = [
  { metric: "25–60%", label: "Average conversion rate lift within 90 days" },
  { metric: "1–3%", label: "Industry average we consistently beat" },
  { metric: "90 days", label: "Typical timeframe to measurable ROI" },
  { metric: "100%", label: "Data-driven — zero opinion-based changes" },
];

const process = [
  { step: "01", title: "Discovery & Baseline", desc: "We establish your current conversion metrics, traffic patterns, and business goals — the benchmark everything is measured against." },
  { step: "02", title: "Research Sprint", desc: "Heatmaps, session recordings, user surveys, and technical audit run in parallel to build a complete picture of friction points." },
  { step: "03", title: "Hypothesis Backlog", desc: "Every insight becomes a testable hypothesis, scored by potential impact and confidence. You see exactly what we're testing and why." },
  { step: "04", title: "Test & Measure", desc: "Experiments run to statistical significance. No calls made on gut feeling or early data — we wait for certainty before acting." },
  { step: "05", title: "Implement Wins", desc: "Winning variants are implemented permanently. Losing tests still teach us something — every result refines the next hypothesis." },
  { step: "06", title: "Review & Compound", desc: "Monthly conversion reviews document learnings and set the next quarter's roadmap. Each cycle builds on the last." },
];

const differentiators = [
  { icon: Award, title: "Data before opinions", desc: "Every recommendation is backed by user behaviour evidence — heatmaps, recordings, or survey data. We never present gut-feel changes as strategy." },
  { icon: Users, title: "Cross-discipline team", desc: "CRO sits at the intersection of analytics, UX, copywriting, and development. Our team covers all four — no gaps, no handoffs." },
  { icon: FlaskConical, title: "Rigorous testing protocol", desc: "We run tests to statistical significance with proper sample sizes. No calling winners early, no cognitive bias in analysis." },
  { icon: BarChart3, title: "Revenue-tied reporting", desc: "We report in money, not just percentages. Every monthly review shows what the conversion lift is worth in actual revenue." },
  { icon: Clock, title: "Fast first wins", desc: "Quick wins are identified in week one. You'll see tangible improvements before the long-term programme has fully ramped." },
  { icon: TrendingUp, title: "Compounding results", desc: "Each test cycle builds on learnings from the last. CRO compounds — clients who stay longer see exponentially higher returns." },
];

const deliverables = [
  { icon: Eye, label: "Heatmap Analysis" },
  { icon: BarChart3, label: "Funnel Audit Report" },
  { icon: FlaskConical, label: "Test Hypothesis Backlog" },
  { icon: MousePointerClick, label: "A/B Test Results" },
  { icon: LayoutTemplate, label: "Optimised Landing Pages" },
  { icon: RefreshCw, label: "Monthly CRO Review" },
  { icon: Star, label: "Competitor Benchmarking" },
  { icon: Zap, label: "Quick-Win Implementations" },
];

function CroPage() {
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
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Digital Marketing
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
              More revenue from the{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                traffic you already have.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              You don't always need more traffic. You need more of your existing traffic to convert. CRO is the highest-ROI investment most businesses aren't making — we fix that with data, not guesswork.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                Start your CRO programme <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                See what's included
              </a>
            </motion.div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </section>

      {/* ── RESULTS BAR ── */}
      <section className="relative z-10 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {results.map((r, i) => (
            <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{r.metric}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Most sites convert 1–3% of visitors. That's 97% walking away.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The average website converts between 1–3% of visitors. Every business that isn't actively working to improve that number is silently leaving the majority of its ad spend, SEO effort, and brand investment on the table.</p>
              <p>Most businesses respond to poor conversions by spending more on traffic. That's expensive. Small improvements to your conversion rate — without spending a penny more on ads — directly multiply revenue.</p>
              <p>We use a systematic, data-driven process to find exactly where visitors are dropping off and precisely what changes will fix it.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-8 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Our Approach</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Evidence first. Test everything. Implement wins.</h2>
            <div className="space-y-3">
              {[
                "Research before changes — heatmaps, recordings, and surveys before a single edit",
                "Structured testing programme — every change tested to statistical significance",
                "Funnel-wide view — from landing page to checkout, no stage ignored",
                "Revenue-tied results — we report in pounds earned, not just lift percentages",
                "Compounding learnings — each cycle builds on the last for accelerating returns",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
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
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">What We Do</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three pillars of systematic CRO.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Research, experimentation, and design — working together to compound your conversion rate over time.</p>
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
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />{item}
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
            <div className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">Every Engagement Includes</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Tangible outputs, not black-box optimisation.</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-emerald-500/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-emerald-400" />
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
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">How It Works</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From audit to compounding growth.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              A repeatable, evidence-led process that gets smarter with every cycle.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {process.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 bg-clip-text mb-4 select-none group-hover:from-emerald-500/60 group-hover:to-cyan-500/60 transition-all">{p.step}</div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Why ClickTake</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We optimise for revenue, not vanity metrics.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-emerald-500/30 transition-colors group">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-border flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                    <Icon className="h-5 w-5 text-emerald-400" />
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
                <div className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">Ideal For</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Who gets the most from CRO.</h2>
                <div className="space-y-3">
                  {[
                    { who: "E-commerce brands", need: "reducing cart abandonment and increasing average order value" },
                    { who: "SaaS companies", need: "improving trial-to-paid conversion and onboarding completion" },
                    { who: "Lead generation businesses", need: "turning more ad clicks into qualified enquiries" },
                    { who: "Professional services", need: "converting website visitors into booked consultations" },
                    { who: "Funded businesses", need: "maximising ROI on paid media before scaling spend" },
                  ].map((item) => (
                    <div key={item.who} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 shrink-0" />
                      <span><span className="font-semibold text-foreground">{item.who}</span><span className="text-muted-foreground"> — {item.need}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <div className="text-sm font-semibold text-emerald-400 mb-1">Retainer</div>
                  <div className="text-lg font-bold mb-1">Ongoing CRO Programme</div>
                  <div className="text-sm text-muted-foreground">Monthly test cycles, full documentation, quarterly reviews, and direct platform integration. Rolling engagement.</div>
                </div>
                <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
                  <div className="text-sm font-semibold text-teal-400 mb-1">Project</div>
                  <div className="text-lg font-bold mb-1">CRO Audit & Quick-Win Sprint</div>
                  <div className="text-sm text-muted-foreground">A focused 4-week audit delivering a full friction analysis, prioritised test backlog, and immediate quick-win implementations.</div>
                </div>
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                  <div className="text-sm font-semibold text-cyan-400 mb-1">One-off</div>
                  <div className="text-lg font-bold mb-1">Landing Page Rebuild</div>
                  <div className="text-sm text-muted-foreground">A single conversion-optimised landing page designed and built from scratch using proven frameworks — scoped and priced per project.</div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Ready to stop leaving money on the table?</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Your traffic is valuable.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Start converting more of it.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a free 30-minute CRO audit call. We'll review your funnel, identify your biggest conversion leaks, and show you exactly what we'd fix first.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                Book a free CRO audit <ArrowUpRight className="h-5 w-5" />
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