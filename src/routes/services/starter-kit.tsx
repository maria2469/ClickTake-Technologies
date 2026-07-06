import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, CheckCircle2, Compass, Palette, Code2,
  Megaphone, Rocket, BarChart3, Users, Zap, Award,
  Clock, TrendingUp, Star, Package, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { CtaSection } from "@/components/BackgroundRenderer";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/starter-kit")({
  head: () => ({
    meta: [
      { title: "Business Development Starter Kit — ClickTake Technologies" },
      { name: "description", content: "Our flagship end-to-end launch package: Strategy, Branding, MVP Build, and Go-to-Market — from zero to revenue." },
    ],
  }),
  component: StarterKitPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

const services = [
  {
    icon: Compass,
    title: "Phase 1 — Strategy & Positioning",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.15)",
    desc: "Before a single design is made or line of code written, we do the strategic work that makes everything else land. This phase defines who you're for, what you stand for, and how you win.",
    items: [
      "Market research — competitive landscape, audience segments, and whitespace opportunities",
      "Positioning workshop — facilitated session to define your unique value proposition",
      "Business model review — pricing strategy, revenue model, and unit economics",
      "Brand platform — mission, vision, values, tone of voice, and personality",
      "Roadmap — a prioritised 90-day launch plan with clear milestones and owners",
    ],
  },
  {
    icon: Palette,
    title: "Phase 2 — Brand & Identity",
    color: "from-brand-pink to-brand-pink",
    glow: "color-mix(in oklab, var(--brand-pink) 15%, transparent)",
    desc: "A brand that looks the part earns trust before a word is read. We build visual and verbal identities that position you as a credible, premium choice from day one.",
    items: [
      "Logo system — primary, secondary, and icon variants with full usage rules",
      "Visual identity — colour palette, typography, imagery style, iconography",
      "Brand guidelines — comprehensive document for team and vendor consistency",
      "Core collateral — business cards, email signatures, presentation template, letterhead",
      "Social profiles — branded profile and cover images for all relevant platforms",
    ],
  },
  {
    icon: Code2,
    title: "Phase 3 — MVP Build",
    color: "from-brand-magenta to-brand-magenta",
    glow: "color-mix(in oklab, var(--brand-magenta) 15%, transparent)",
    desc: "A production-ready digital product that looks and performs like a fully funded startup. Built on proven stacks with performance, SEO, and scalability baked in from the start.",
    items: [
      "Website or web app — fully responsive, fast-loading, and conversion-optimised",
      "CMS integration — so your team can update content without touching code",
      "Analytics setup — GA4, conversion tracking, and heatmaps installed and verified",
      "SEO foundations — technical SEO, schema markup, sitemap, and core on-page optimisation",
      "Hosting & deployment — configured, documented, and handed over with full access",
    ],
  },
  {
    icon: Megaphone,
    title: "Phase 4 — Go-to-Market",
    color: "from-brand-cyan to-brand-blue",
    glow: "color-mix(in oklab, var(--brand-cyan) 15%, transparent)",
    desc: "A great product with no launch plan is just a website. We build and execute the channel strategy that gets your first customers through the door.",
    items: [
      "Launch plan — channel prioritisation, messaging calendar, and activation timeline",
      "Paid media setup — Google and/or Meta campaign structure, targeting, and first creative",
      "Organic content strategy — SEO content plan and social framework for the first 90 days",
      "Email foundations — welcome sequence, list setup, and lead capture configured",
      "Analytics & reporting — KPI dashboard built so you know exactly what to watch",
    ],
  },
];

const results = [
  { metric: "4", label: "Phases from idea to revenue — nothing left out" },
  { metric: "1", label: "Team owns everything — no briefing gaps or misaligned vendors" },
  { metric: "90 days", label: "Typical time from kickoff to live and trading" },
  { metric: "30-day", label: "Post-launch support window included in every engagement" },
];

const process = [
  { step: "01", title: "Kickoff & Discovery", desc: "A structured discovery session to deeply understand your business, market, audience, and competitive landscape. This session drives every decision that follows." },
  { step: "02", title: "Strategy & Brand Platform", desc: "Positioning, value proposition, and brand platform delivered first — so design and copy have a clear strategic foundation to build on." },
  { step: "03", title: "Brand & Identity Design", desc: "Visual identity developed in concept stages with clear rationale. Refined to a complete brand system with guidelines and all core assets." },
  { step: "04", title: "Build & Develop", desc: "MVP built on the approved brand foundation. Every page, component, and integration delivered with performance and SEO baked in." },
  { step: "05", title: "Go-to-Market Activation", desc: "Launch plan executed — paid campaigns live, content calendar set, email sequences active, analytics verified and tracking every KPI." },
  { step: "06", title: "Handover & Support", desc: "Full documentation of everything built, all access transferred, and a 30-day post-launch support window to handle any issues or iterations." },
];

const differentiators = [
  { icon: Award, title: "One team, zero briefing gaps", desc: "Strategy informs design informs copy informs build. Each phase feeds the next — no misaligned deliverables from coordinating five separate agencies." },
  { icon: Users, title: "Built for your audience", desc: "Every deliverable is grounded in research about your specific market. We don't apply generic templates — we build for the people you're selling to." },
  { icon: Rocket, title: "Moves at startup speed", desc: "The entire engagement — strategy to live product — typically completes in 90 days. Faster than any multi-agency approach, without cutting corners." },
  { icon: BarChart3, title: "Transparent, fixed-scope pricing", desc: "You know exactly what you're getting before you sign. No scope creep surprises, no 'that's a change request' conversations mid-project." },
  { icon: Clock, title: "Clean handover guaranteed", desc: "Full documentation, all access and credentials transferred, and 30 days of post-launch support. You're never left stranded after go-live." },
  { icon: TrendingUp, title: "Built to scale from day one", desc: "The tech stack, brand system, and marketing infrastructure are chosen with growth in mind — so you don't have to rebuild in 12 months." },
];

const deliverables = [
  { icon: Compass, label: "Positioning Document" },
  { icon: Palette, label: "Brand Guidelines" },
  { icon: Code2, label: "Production Website" },
  { icon: Star, label: "Logo System" },
  { icon: Megaphone, label: "Launch Campaign" },
  { icon: BarChart3, label: "Analytics Dashboard" },
  { icon: Package, label: "Content Strategy" },
  { icon: Zap, label: "Email Sequences" },
];

function StarterKitPage() {
  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
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
                ⭐ Flagship Offering
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
              From idea to revenue{" "}
              <span className="bg-gradient-to-r from-amber-400 via-brand-pink to-brand-magenta bg-clip-text text-transparent">
                in one package.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              The Starter Kit combines everything a new or expanding business needs to launch with confidence — strategy, brand, product, and go-to-market, delivered as one joined-up engagement by one team.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-brand-pink px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                Start your Starter Kit <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                See what's included
              </a>
            </motion.div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-brand-magenta/10 blur-3xl" />
      </section>

      {/* ── RESULTS BAR ── */}
      <section className="relative z-10 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {results.map((r, i) => (
            <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-400 to-brand-pink bg-clip-text text-transparent">{r.metric}</div>
              <div className="mt-2 text-sm text-muted-foreground leading-snug">{r.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-pink mb-4">The Problem</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Piecing it together yourself is slow, expensive, and misaligned.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Most agencies make you piece it together yourself — a branding studio here, a developer there, a marketing freelancer somewhere else. The result is misaligned work, wasted budget, and a launch that never quite fires.</p>
              <p>Coordinating multiple vendors means endless re-briefing. The brand agency doesn't talk to the developer. The developer doesn't talk to the marketer. Everything arrives late and slightly off.</p>
              <p>The Starter Kit is different: one team, one process, one outcome — a business that's ready to grow.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-brand-magenta/5 p-8 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">The Solution</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">One team. Four phases. Zero gaps.</h2>
            <div className="space-y-3">
              {[
                "Strategy, brand, build, and go-to-market under one roof — no briefing gaps",
                "Each phase feeds the next — positioning drives design, design drives copy, copy drives build",
                "90 days from kickoff to live — faster than coordinating multiple agencies",
                "Fixed-scope pricing — you know exactly what's included before you sign",
                "30-day post-launch support window so you're never left stranded",
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
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">What's Included</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Four phases. One complete launch.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Strategy, brand, product, and go-to-market — each phase built on the last, all delivered by one team.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
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
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-pink mb-3">Every Engagement Includes</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">You receive a complete, ready-to-grow business.</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-amber-500/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-brand-pink/20 flex items-center justify-center">
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Kickoff to live in 90 days.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              A structured, sequential process so every phase lands on a solid foundation — and nothing falls through the cracks.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {process.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-amber-500/30 to-brand-pink/30 bg-clip-text mb-4 select-none group-hover:from-amber-500/60 group-hover:to-brand-pink/60 transition-all">{p.step}</div>
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">One team that builds things that last.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-amber-500/30 transition-colors group">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500/10 to-brand-pink/10 border border-border flex items-center justify-center group-hover:border-amber-500/30 transition-colors">
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

      {/* ── WHO IT'S FOR ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-10 md:p-14">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-magenta mb-4">Ideal For</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Who the Starter Kit is built for.</h2>
                <div className="space-y-3">
                  {[
                    { who: "Startups", need: "launching their first product who need to look credible from day one" },
                    { who: "Solopreneurs & consultants", need: "turning deep expertise into a productised, scalable business" },
                    { who: "SMEs", need: "entering a new market, launching a new product line, or replacing an outdated brand" },
                    { who: "Funded founders", need: "who need to move fast and can't afford to coordinate five separate agencies" },
                    { who: "Side projects going serious", need: "that need a proper brand, product, and launch strategy to compete" },
                  ].map((item) => (
                    <div key={item.who} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-brand-magenta mt-0.5 shrink-0" />
                      <span><span className="font-semibold text-foreground">{item.who}</span><span className="text-muted-foreground"> — {item.need}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                  <div className="text-sm font-semibold text-amber-400 mb-1">Full Package</div>
                  <div className="text-lg font-bold mb-1">Complete Starter Kit</div>
                  <div className="text-sm text-muted-foreground">All four phases — strategy, brand, build, and go-to-market — delivered as one fixed-scope engagement. Typically 90 days.</div>
                </div>
                <div className="rounded-2xl border border-brand-pink/20 bg-brand-pink/5 p-6">
                  <div className="text-sm font-semibold text-brand-pink mb-1">Modular</div>
                  <div className="text-lg font-bold mb-1">Select Phases</div>
                  <div className="text-sm text-muted-foreground">Already have a brand? Need strategy and build only? Individual phases can be scoped and delivered separately.</div>
                </div>
                <div className="rounded-2xl border border-brand-magenta/20 bg-brand-magenta/5 p-6">
                  <div className="text-sm font-semibold text-brand-magenta mb-1">Add-on</div>
                  <div className="text-lg font-bold mb-1">Post-Launch Growth Retainer</div>
                  <div className="text-sm text-muted-foreground">Ongoing CRO, paid media, and content management after launch — available as a monthly retainer after the Starter Kit completes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaSection>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Ready to launch properly?</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Stop piecing it together.<br />
              <span className="bg-gradient-to-r from-amber-400 to-brand-pink bg-clip-text text-transparent">Launch with everything in place.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a free 30-minute discovery call. We'll understand your idea, show you how the Starter Kit would work for your business, and give you a clear scope and timeline.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-brand-pink px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                Book a free discovery call <ArrowUpRight className="h-5 w-5" />
              </a>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur hover:bg-secondary transition-colors text-base">
                Explore all services
              </Link>
            </div>
          </motion.div>
        </div>
      </CtaSection>
    </div>
  );
}