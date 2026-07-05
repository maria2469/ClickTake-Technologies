import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { Hero3D } from "./Hero3D";
import { useBackgroundsContext, getSectionBackground, bgToStyle, videoStyle } from "./BackgroundRenderer";

export function Hero() {
  const backgrounds = useBackgroundsContext();
  const heroBg = getSectionBackground(backgrounds, "hero");

  return (
    <section className="relative min-h-screen overflow-hidden pt-32" style={heroBg ? bgToStyle(heroBg) : {}}>
      {heroBg?.overlay_color && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundColor: heroBg.overlay_color,
          opacity: (heroBg.overlay_opacity || 0) / 100,
          mixBlendMode: heroBg.overlay_blend_mode as any,
        }} />
      )}
      {heroBg?.bg_type === "video" && (heroBg.video_desktop || heroBg.video_tablet || heroBg.video_mobile) && (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full" style={videoStyle(heroBg)}
          src={heroBg.video_desktop || heroBg.video_tablet || heroBg.video_mobile} />
      )}
      {!heroBg && <div className="absolute inset-0 bg-gradient-mesh opacity-80" />}
      {!heroBg && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,transparent,var(--background))]" />}
      {!heroBg && <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />}

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Sparkles className="h-3 w-3" />
            <span className="font-medium tracking-wide">Now booking projects for 2026</span>
          </motion.div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="block">
              We build
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="block text-gradient animate-gradient">
              AI‑powered
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="block">
              digital experiences.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            ClickTake Technologies is a digital agency from <span className="text-foreground">Multan</span> &amp; <span className="text-foreground">Birmingham</span>, crafting websites, apps, and growth campaigns that scale brands worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-4 font-medium text-white shadow-glow transition-transform hover:scale-105">
              Start your project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-4 font-medium backdrop-blur transition-colors hover:bg-secondary">
              View our work
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              <span className="ml-2 text-foreground">5.0 from 80+ clients</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div><span className="text-foreground font-semibold">120+</span> projects shipped</div>
            <div className="h-4 w-px bg-border" />
            <div><span className="text-foreground font-semibold">UK · PK</span> teams</div>
          </motion.div>
        </motion.div>

        {/* 3D scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[420px] lg:h-[600px]"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-mesh blur-3xl opacity-60" />
          <div className="absolute inset-0">
            <Hero3D />
          </div>
          
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative mt-8 overflow-hidden border-y border-border/50 py-6">
        <div className="flex animate-marquee gap-16 whitespace-nowrap font-display text-2xl font-medium text-muted-foreground">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-16">
              {["Web Development", "AI Solutions", "SEO & SEM", "Mobile Apps", "Brand Design", "E‑Commerce", "Automation", "Digital Marketing"].map((s) => (
                <span key={s} className="flex items-center gap-16">
                  <span className="hover:text-gradient">{s}</span>
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
