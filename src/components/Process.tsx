import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Brain, Pencil, Cog, Rocket, CheckCircle, Clock, Users, Zap } from "lucide-react";
import { useBackgroundsContext, getSectionBackground, bgToStyle, videoStyle, overlayStyle } from "./BackgroundRenderer";

const steps = [
  {
    n: "01",
    title: "Discovery",
    desc: "Deep research into your goals, users and positioning to uncover opportunities that drive long-term growth.",
    icon: Search,
    color: "from-brand-cyan to-brand-blue",
    glow: "shadow-cyan-500/25",
    glowRaw: "rgba(0,200,255,0.3)",
    detail: "Competitor audits · User research · Market positioning · KPI mapping",
    duration: "Week 1",
  },
  {
    n: "02",
    title: "Strategy",
    desc: "A scalable roadmap aligned with branding, user experience and measurable business impact.",
    icon: Brain,
    color: "from-brand-blue to-sky-600",
    glow: "shadow-blue-500/25",
    glowRaw: "rgba(59,130,246,0.3)",
    detail: "Tech stack selection · Wireframes · Sprint planning · Resource allocation",
    duration: "Week 1-2",
  },
  {
    n: "03",
    title: "Design",
    desc: "Premium interfaces crafted with motion, clarity and immersive visual systems that captivate.",
    icon: Pencil,
    color: "from-brand-cyan to-teal-500",
    glow: "shadow-sky-500/25",
    glowRaw: "rgba(14,165,233,0.3)",
    detail: "UI/UX systems · Component libraries · Motion design · Brand integration",
    duration: "Week 2-3",
  },
  {
    n: "04",
    title: "Build",
    desc: "Modern engineering with AI integrations, scalable architecture and production-ready performance.",
    icon: Cog,
    color: "from-teal-500 to-brand-cyan",
    glow: "shadow-teal-500/25",
    glowRaw: "rgba(20,184,166,0.3)",
    detail: "Agile sprints · Code reviews · QA testing · Performance audits",
    duration: "Week 3-6",
  },
  {
    n: "05",
    title: "Launch",
    desc: "Deployment, optimisation and continuous iteration focused on performance and growth metrics.",
    icon: Rocket,
    color: "from-brand-cyan to-brand-blue",
    glow: "shadow-cyan-500/25",
    glowRaw: "rgba(0,200,255,0.3)",
    detail: "CI/CD pipeline · Analytics setup · SEO launch · Growth tracking",
    duration: "Week 6+",
  },
];

const outcomes = [
  { icon: CheckCircle, label: "Quality Guaranteed", desc: "Every deliverable reviewed twice before handoff." },
  { icon: Clock, label: "On-Time Delivery", desc: "Milestone-based sprints with transparent reporting." },
  { icon: Users, label: "Dedicated Team", desc: "A named team member on every project, not tickets." },
  { icon: Zap, label: "Fast Iterations", desc: "48-hr turnaround on feedback and revisions." },
];

function StepNode({ s, i }: { s: typeof steps[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = s.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className="group relative flex flex-col items-center text-center"
    >
      {/* Ambient glow blob */}
      <motion.div
        className={`absolute top-0 h-36 w-36 rounded-full bg-gradient-to-r ${s.color} opacity-15 blur-3xl`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Timeline dot (desktop) */}
      <div className="absolute top-[3.5rem] hidden lg:block">
        <motion.div
          className={`h-3.5 w-3.5 rounded-full bg-gradient-to-r ${s.color}`}
          animate={{ boxShadow: [`0 0 0 0 ${s.glowRaw}`, `0 0 0 8px transparent`] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Main node card */}
      <motion.div
        className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-card/60 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 ${s.glow} group-hover:shadow-2xl`}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ rotateY: 8, rotateX: -5 }}
      >
        {/* inner gradient fill */}
        <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${s.color} opacity-10`} />

        {/* Edge highlight */}
        <div className="absolute inset-[1px] rounded-[27px] border border-white/5" />

        {/* Animated scan line */}
        <motion.div
          className="absolute left-3 right-3 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${s.glowRaw}, transparent)` }}
          animate={{ top: ['20%', '80%', '20%'] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Icon container */}
        <motion.div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}
          style={{ boxShadow: `0 0 20px -4px ${s.glowRaw}` }}
          animate={{ boxShadow: [`0 0 20px -4px ${s.glowRaw}`, `0 0 30px -2px ${s.glowRaw}`, `0 0 20px -4px ${s.glowRaw}`] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>

        {/* Step number badge */}
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-white/20 text-[10px] font-bold text-primary">
          {i + 1}
        </div>
      </motion.div>

      {/* Duration pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: i * 0.1 + 0.3 }}
        className="mt-4 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[10px] font-mono text-muted-foreground/60 backdrop-blur"
      >
        {s.duration}
      </motion.div>

      {/* Step label */}
      <div className="mt-2 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
        Step {s.n}
      </div>

      {/* Title */}
      <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{s.title}</h3>

      {/* Description */}
      <p className="mt-3 max-w-[220px] text-sm leading-7 text-muted-foreground">{s.desc}</p>

      {/* Detail tags — appear on hover */}
      <motion.div
        className="mt-3 max-w-[220px] text-[10px] leading-5 text-muted-foreground/50 font-mono opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {s.detail}
      </motion.div>
    </motion.div>
  );
}

export function Process() {
  const ctaBg = getSectionBackground(useBackgroundsContext(), "cta");
  const outcomesRef = useRef<HTMLDivElement>(null);
  const outcomesInView = useInView(outcomesRef, { once: true, margin: '-60px' });

  return (
    <section id="process" className="relative overflow-hidden py-24 lg:py-36">
      {/* BACKGROUND — unchanged per user request */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-cyan/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            How We Work
          </div>

          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Our{" "}
            <span className="text-gradient">proven process</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            A refined workflow engineered to transform ambitious ideas into
            scalable digital experiences with clarity, speed and precision.
            Every engagement follows the same five-phase system.
          </p>
        </motion.div>

        {/* PROCESS TIMELINE */}
        <div className="relative mt-24">
          {/* Animated connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-14 hidden lg:block overflow-hidden">
            <div className="h-px w-full bg-white/5" />
            <motion.div
              className="absolute inset-0 h-px bg-gradient-to-r from-brand-cyan via-brand-blue via-sky-500 to-brand-cyan"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              style={{ opacity: 0.7, filter: 'blur(0.5px)' }}
            />
            {/* Moving light dot on line */}
            <motion.div
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-400"
              style={{ boxShadow: '0 0 8px 2px rgba(0,200,255,0.8)' }}
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <StepNode key={s.n} s={s} i={i} />
            ))}
          </div>
        </div>

        {/* Connector arrow (mobile) */}
        <div className="mt-4 flex justify-center lg:hidden">
          <div className="h-12 w-px bg-gradient-to-b from-brand-cyan/40 to-transparent" />
        </div>

        {/* OUTCOMES GRID */}
        <div ref={outcomesRef} className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => {
            const Icon = o.icon;
            return (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 30 }}
                animate={outcomesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,200,255,0.05), transparent 70%)' }}
                />
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-blue/10 border border-white/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">{o.label}</h4>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{o.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`${ctaBg ? 'relative overflow-hidden' : ''} mt-16 text-center`}
          style={ctaBg ? bgToStyle(ctaBg) : {}}
        >
          {ctaBg?.bg_type === "video" && (ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile) && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full"
              style={videoStyle(ctaBg)}
              src={ctaBg.video_desktop || ctaBg.video_tablet || ctaBg.video_mobile || undefined} />
          )}
          {ctaBg?.overlay_color && <div style={overlayStyle(ctaBg)} />}
          <div className="relative z-10">
            <p className="text-muted-foreground text-sm">
              Ready to start?{" "}
              <a
                href="#contact"
                className="group inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
              >
                Let's talk about your project
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
