import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, CheckCircle2, Search, Instagram, Linkedin,
  Target, BarChart3, TrendingUp, Zap, Award, Clock,
  Users, RefreshCw, Star, DollarSign, ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/digital-marketing/paid-advertising")({
  head: () => ({
    meta: [
      { title: "Paid Advertising — ClickTake Technologies" },
      { name: "description", content: "Google, Meta, and LinkedIn advertising managed for maximum ROI — every pound working harder." },
    ],
  }),
  component: PaidAdvertisingPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const, } }),
};

const services = [
  {
    icon: Search,
    title: "Google Ads",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.15)",
    desc: "Capture demand from people actively searching for what you sell. Google Ads done right is the fastest path to qualified pipeline — we build campaigns for the lowest possible cost per conversion.",
    items: [
      "Search campaigns — high-intent keyword targeting with tight match types & negative keywords",
      "Performance Max — AI-powered cross-channel campaigns with full asset group optimisation",
      "Shopping campaigns — product feed optimisation and smart bidding for e-commerce",
      "Display & remarketing — re-engage past visitors across the Google Display Network",
      "YouTube pre-roll — video ad campaigns for awareness and retargeting",
    ],
  },
  {
    icon: Instagram,
    title: "Meta Ads (Facebook & Instagram)",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.15)",
    desc: "Meta's platform reaches 3.2 billion people. With the right creative and targeting, it's where brands are built — and where purchases are driven at scale.",
    items: [
      "Prospecting campaigns — cold audience targeting using interest, behaviour, and lookalike signals",
      "Retargeting funnels — multi-touch sequences that bring warm audiences back to convert",
      "Creative testing — systematic ad creative iteration to find your highest-performing hooks",
      "Lead generation ads — native lead forms for high-volume, low-friction enquiry capture",
      "Catalogue and dynamic ads — automated product ads for e-commerce retargeting",
    ],
  },
  {
    icon: Linkedin,
    title: "LinkedIn Ads",
    color: "from-sky-500 to-blue-700",
    glow: "rgba(14,165,233,0.15)",
    desc: "For B2B businesses, LinkedIn is unmatched. We target by job title, company size, industry, and seniority — putting your message in front of exact decision-makers with budget and authority.",
    items: [
      "Sponsored content — single image, carousel, and video ads in the LinkedIn feed",
      "Lead gen forms — pre-filled native forms for frictionless B2B lead capture",
      "Message ads — direct inbox outreach to targeted decision-makers at scale",
      "Account-based targeting — upload your target account list and reach only the companies you want",
    ],
  },
];

const results = [
  { metric: "40–60%", label: "Of ad budgets wasted in unmanaged accounts" },
  { metric: "3.2B", label: "People reachable via Meta's ad platform" },
  { metric: "30-day", label: "Rolling contracts after initial 90-day build" },
  { metric: "100%", label: "Focus on CPA and ROAS — never vanity metrics" },
];

const process = [
  { step: "01", title: "Account Audit", desc: "We tear down your existing accounts and find every source of wasted spend — wrong audiences, broken bidding strategies, underperforming creatives." },
  { step: "02", title: "Strategy & Structure", desc: "Campaign architecture rebuilt around your buying journey, audience segments, and business objectives. Every campaign has a clear purpose." },
  { step: "03", title: "Creative Development", desc: "Ad copy and creative assets developed for each audience and funnel stage. We test multiple hooks and formats from launch." },
  { step: "04", title: "Launch & Stabilise", desc: "Campaigns go live with close monitoring in the first 14 days. Bid strategies, budgets, and targeting adjusted as data comes in." },
  { step: "05", title: "Weekly Optimisation", desc: "Bid adjustments, audience pruning, creative rotation, and negative keyword management — every week without exception." },
  { step: "06", title: "Monthly Reporting", desc: "Full performance report covering ROAS, CPA, and channel mix. Forward recommendations for the next period included every time." },
];

const differentiators = [
  { icon: Target, title: "CPA-obsessed management", desc: "Every decision we make is evaluated through the lens of cost-per-acquisition. ROAS and CPA are the only metrics that matter to us." },
  { icon: Award, title: "Full account rebuild included", desc: "If we're taking over existing campaigns, we audit and rebuild before we optimise. Bad structure can't be fixed with good management." },
  { icon: RefreshCw, title: "Weekly optimisation cadence", desc: "Ads don't manage themselves. We make optimisation touches every week — bid adjustments, audience pruning, and creative rotation." },
  { icon: Users, title: "Dedicated account manager", desc: "One senior paid media specialist owns your account. Available via Slack or WhatsApp — not routed through a helpdesk." },
  { icon: BarChart3, title: "Cross-channel view", desc: "Google, Meta, and LinkedIn managed as a unified strategy — budget is allocated where it's working, not siloed by platform." },
  { icon: Clock, title: "No long-term lock-in", desc: "30-day rolling contracts after the initial 90-day build period. We earn your business every month — not just at the point of sale." },
];

const deliverables = [
  { icon: Search, label: "Account Audit Report" },
  { icon: Target, label: "Campaign Architecture" },
  { icon: Star, label: "Ad Creative Set" },
  { icon: TrendingUp, label: "Keyword Research" },
  { icon: Users, label: "Audience Strategy" },
  { icon: BarChart3, label: "Weekly Optimisation" },
  { icon: DollarSign, label: "Monthly ROAS Report" },
  { icon: Zap, label: "Landing Page Brief" },
];

function PaidAdvertisingPage() {
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
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-400">
                Digital Marketing
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
              Every pound you spend on ads{" "}
              <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                should return more.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              We manage Google, Meta, and LinkedIn campaigns with a relentless focus on cost-per-acquisition — not click-through rates, impressions, or any other metric that doesn't put money in your business.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                Audit my ad accounts <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                See what's included
              </a>
            </motion.div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
      </section>

      {/* ── RESULTS BAR ── */}
      <section className="relative z-10 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {results.map((r, i) => (
            <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">{r.metric}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Most ad accounts waste 40–60% of their budget.</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Wrong audiences, wrong bidding strategies, and stale creative. The majority of ad accounts have structural problems that bleed budget silently — and the platforms aren't incentivised to tell you.</p>
              <p>Most businesses either manage ads in-house without the expertise to optimise properly, or hand them to generalist agencies who set campaigns up once and rarely touch them again.</p>
              <p>We audit, rebuild, and manage campaigns that are tightly focused on the metrics that matter — leads, sales, and return on ad spend.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-pink-500/5 p-8 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Our Approach</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Rebuild, optimise, report, repeat.</h2>
            <div className="space-y-3">
              {[
                "Full account audit before we touch a single campaign setting",
                "Strategy-led structure — every campaign exists for a reason tied to your funnel",
                "Creative testing built in from day one — we never run one ad and hope",
                "Weekly optimisation — bid adjustments, audience pruning, creative rotation",
                "Monthly reporting in ROAS and CPA — the metrics that matter to your business",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
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
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">What We Manage</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three platforms. One unified strategy.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Google, Meta, and LinkedIn — each with a distinct role in your funnel, managed as a single joined-up system.</p>
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
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />{item}
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
            <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-3">Every Engagement Includes</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Managed accounts, not managed promises.</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-blue-500/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-pink-500/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-400" />
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
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">How It Works</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From audit to optimised pipeline.</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              A clear process so you always know what's happening, what we're changing, and why.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {process.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-blue-500/30 to-pink-500/30 bg-clip-text mb-4 select-none group-hover:from-blue-500/60 group-hover:to-pink-500/60 transition-all">{p.step}</div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Why ClickTake</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We manage spend like it's our own money.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-blue-500/30 transition-colors group">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 border border-border flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                    <Icon className="h-5 w-5 text-blue-400" />
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
                <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-4">Ideal For</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Who we manage paid media for.</h2>
                <div className="space-y-3">
                  {[
                    { who: "E-commerce brands", need: "scaling product sales with Shopping, Meta DPA, and Performance Max" },
                    { who: "B2B companies", need: "generating qualified pipeline via LinkedIn and Google Search" },
                    { who: "Lead generation businesses", need: "driving enquiries at the lowest possible cost-per-lead" },
                    { who: "SaaS companies", need: "acquiring trial signups and reducing payback period" },
                    { who: "Businesses scaling spend", need: "professional management to ensure returns as budgets grow" },
                  ].map((item) => (
                    <div key={item.who} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-sky-400 mt-0.5 shrink-0" />
                      <span><span className="font-semibold text-foreground">{item.who}</span><span className="text-muted-foreground"> — {item.need}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
                  <div className="text-sm font-semibold text-blue-400 mb-1">Managed Service</div>
                  <div className="text-lg font-bold mb-1">Full Paid Media Management</div>
                  <div className="text-sm text-muted-foreground">End-to-end management across Google, Meta, and/or LinkedIn. 90-day build period followed by rolling monthly management.</div>
                </div>
                <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
                  <div className="text-sm font-semibold text-pink-400 mb-1">Project</div>
                  <div className="text-lg font-bold mb-1">Account Audit & Rebuild</div>
                  <div className="text-sm text-muted-foreground">A deep-dive audit of your existing accounts with a full restructure and documented quick-win recommendations.</div>
                </div>
                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
                  <div className="text-sm font-semibold text-sky-400 mb-1">Consultancy</div>
                  <div className="text-lg font-bold mb-1">In-House Team Support</div>
                  <div className="text-sm text-muted-foreground">Strategy, auditing, and training for businesses managing ads in-house who want expert oversight and guidance.</div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Ready to make every pound count?</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              You're spending on ads.<br />
              <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">Are they actually working?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a free 30-minute account audit call. We'll review your current campaigns, identify where budget is being wasted, and show you what we'd change first.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                Book a free account audit <ArrowUpRight className="h-5 w-5" />
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