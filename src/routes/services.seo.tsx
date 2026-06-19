import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, CheckCircle2, Search, MapPin, Code2,
  BarChart3, TrendingUp, ShieldCheck, Clock, Award,
  Zap, Globe, FileSearch, Star, Users, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/seo")({
  head: () => ({
    meta: [
      { title: "SEO Services — ClickTake Technologies" },
      { name: "description", content: "Technical SEO, On-Page SEO, and Local SEO that gets your business found by the right people at the right time." },
    ],
  }),
  component: SeoPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

const services = [
  {
    icon: Code2,
    title: "Technical SEO",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.15)",
    desc: "The foundation everything else is built on. If search engines can't crawl and index your site properly, nothing else matters.",
    items: [
      "Full technical site audit (200+ checkpoints)",
      "Core Web Vitals optimisation (LCP, CLS, FID)",
      "Schema markup & structured data implementation",
      "XML sitemap and robots.txt configuration",
      "Crawl budget management & log file analysis",
      "Canonicalisation and duplicate content fixes",
      "HTTPS, redirect chain & broken link repair",
    ],
  },
  {
    icon: Search,
    title: "On-Page SEO",
    color: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.15)",
    desc: "Content and structure that tells Google exactly what you are, who you serve, and why you deserve to rank.",
    items: [
      "Comprehensive keyword research & mapping",
      "Title tags, meta descriptions & heading optimisation",
      "Content gap analysis vs top-ranking competitors",
      "Internal linking architecture & anchor text strategy",
      "E-E-A-T signals and author authority building",
      "Page-level content expansion and optimisation",
      "Featured snippet and People Also Ask targeting",
    ],
  },
  {
    icon: MapPin,
    title: "Local SEO",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.15)",
    desc: "Dominate the map pack and local search results in every city and town you serve.",
    items: [
      "Google Business Profile setup & optimisation",
      "Local citation building across 50+ directories",
      "NAP consistency audit and correction",
      "Local landing page creation and optimisation",
      "Review generation strategy & reputation management",
      "Local schema markup implementation",
      "Competitor local ranking analysis",
    ],
  },
];

const results = [
  { metric: "4.1×", label: "Average organic traffic increase in 12 months" },
  { metric: "73%", label: "Clients reach page 1 within 6 months" },
  { metric: "£0", label: "Extra ad spend needed — pure organic growth" },
  { metric: "200+", label: "Businesses ranked on page 1" },
];

const process = [
  { step: "01", title: "SEO Audit", desc: "We crawl your entire site, analyse your backlink profile, review your content, and benchmark against your top competitors." },
  { step: "02", title: "Keyword Strategy", desc: "We map every high-intent keyword your audience uses to the right pages — building a targeting architecture that wins at scale." },
  { step: "03", title: "Technical Fixes", desc: "Prioritised technical issues are resolved first — the structural work that unlocks everything else." },
  { step: "04", title: "On-Page Optimisation", desc: "Every target page is optimised for its primary keyword cluster — content, structure, internal links, and schema." },
  { step: "05", title: "Content & Authority", desc: "We build topical authority with supporting content and earn backlinks through outreach, PR, and digital mentions." },
  { step: "06", title: "Track & Compound", desc: "Monthly rank tracking and traffic reporting. We iterate on what's working and push into new keyword territory continuously." },
];

const differentiators = [
  { icon: ShieldCheck, title: "White-hat only", desc: "Zero shortcuts, zero penalties. Every technique we use is built to last through algorithm updates." },
  { icon: BarChart3, title: "Revenue-focused tracking", desc: "We track rankings, traffic, and revenue — not just impressions. You always know the business impact." },
  { icon: Clock, title: "Faster results", desc: "Our technical-first approach unlocks ranking potential faster than content-first agencies typically achieve." },
  { icon: Award, title: "Dedicated SEO lead", desc: "One experienced strategist owns your account — no account manager relay or offshore execution." },
  { icon: Zap, title: "Integrated with content", desc: "SEO and content are managed together, not siloed. Topic clusters, keyword mapping, and writing all aligned." },
  { icon: Globe, title: "Multi-location expertise", desc: "UK and Pakistan market expertise. We understand local search dynamics in both regions deeply." },
];

const deliverables = [
  { icon: FileSearch, label: "Technical SEO Audit" },
  { icon: Search, label: "Keyword Research Deck" },
  { icon: BarChart3, label: "Competitor Gap Analysis" },
  { icon: Code2, label: "Schema Markup Implementation" },
  { icon: TrendingUp, label: "Monthly Rank Tracking Report" },
  { icon: MapPin, label: "Local Citation Building" },
  { icon: Star, label: "Content Optimisation" },
  { icon: Users, label: "Backlink Acquisition Plan" },
];

export default function SeoPage() {
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
                Digital Marketing
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
              Get found by people{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                ready to buy.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Technical, On-Page, and Local SEO that moves your business to page 1 — and keeps it there. We turn organic search into your most cost-effective acquisition channel.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                Get a free SEO audit <ArrowUpRight className="h-4 w-4" />
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
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{r.metric}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Page 2 of Google doesn't exist.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>92% of all search clicks go to page 1. If you're not there, you're invisible — regardless of how good your product or service is.</p>
              <p>Most businesses either ignore SEO entirely, or invest in surface-level fixes that produce no movement. Technical issues go unfixed, content is never optimised, and local listings sit incomplete.</p>
              <p>Meanwhile, competitors who invest in SEO compound their advantage every single month — making it harder and more expensive to catch up the longer you wait.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 p-8 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Our Approach</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Systematic. Compounding. Permanent.</h2>
            <div className="space-y-3">
              {[
                "Technical-first — we fix the foundations before anything else",
                "Keyword architecture tied to buyer intent at every funnel stage",
                "Content and on-page optimisation that earns featured snippets",
                "Local SEO that dominates map packs in every target area",
                "Rankings that compound month over month — not a one-time boost",
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
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">What We Do</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three disciplines. One ranking system.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Technical, On-Page, and Local SEO — each critical, most powerful when unified under one strategy.</p>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Every Engagement Includes</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Concrete deliverables, not vague promises.</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-cyan-500/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From audit to page 1.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">A clear process so you always know what we're doing and why.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {process.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 bg-clip-text mb-4 select-none group-hover:from-cyan-500/60 group-hover:to-emerald-500/60 transition-all">{p.step}</div>
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">SEO done properly looks different.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-cyan-500/30 transition-colors group">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-border flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
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

      {/* ── WHO IT'S FOR ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-10 md:p-14">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Ideal For</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Is this the right investment for you?</h2>
                <div className="space-y-3">
                  {[
                    { who: "Local service businesses", need: "dominating map packs and local search results" },
                    { who: "E-commerce brands", need: "reducing paid ad dependency with organic traffic" },
                    { who: "SaaS companies", need: "capturing high-intent buyers searching for solutions" },
                    { who: "Professional services", need: "building authority and trust through search visibility" },
                    { who: "Multi-location businesses", need: "ranking in every city and region they serve" },
                  ].map((item) => (
                    <div key={item.who} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span><span className="font-semibold text-foreground">{item.who}</span><span className="text-muted-foreground"> — {item.need}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                  <div className="text-sm font-semibold text-cyan-400 mb-1">Monthly Retainer</div>
                  <div className="text-lg font-bold mb-1">Full SEO Management</div>
                  <div className="text-sm text-muted-foreground">Ongoing technical, on-page, and off-page SEO with monthly reporting. Minimum 6-month engagement.</div>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <div className="text-sm font-semibold text-emerald-400 mb-1">One-off Project</div>
                  <div className="text-lg font-bold mb-1">SEO Audit & Strategy</div>
                  <div className="text-sm text-muted-foreground">A comprehensive audit plus a prioritised 12-month roadmap your team can execute independently.</div>
                </div>
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                  <div className="text-sm font-semibold text-violet-400 mb-1">Add-on</div>
                  <div className="text-lg font-bold mb-1">Local SEO Sprint</div>
                  <div className="text-sm text-muted-foreground">6-week intensive focused entirely on map pack rankings and local visibility in your target areas.</div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">Ready to rank?</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Your competitors are already investing.<br />
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Don't let them compound.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a free 30-minute SEO audit call. We'll review your current rankings, identify your biggest technical issues, and show you exactly what's holding you back.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                Book your free audit <ArrowUpRight className="h-5 w-5" />
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