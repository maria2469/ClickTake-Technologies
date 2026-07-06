import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export const Route = createFileRoute("/services/$")({
  component: DynamicServicePage,
});

/* ─────────────────────────────────────────────
   Lucide icon resolver — maps stored icon_name
   strings to SVG paths rendered inline, so the
   page works without dynamic imports.
───────────────────────────────────────────── */
const ICON_PATHS: Record<string, string> = {
  Search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  Bot: "M12 2a2 2 0 012 2v2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2zM8 14a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  Rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z",
  Layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  Brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z",
  Sparkles: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
  Award: "M12 15l-2 5l2-1l2 1zM8.21 13.89L7 23l5-3l5 3l-1.21-9.12",
  Shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  BarChart3: "M3 3v18h18M18 17V9M13 17V5M8 17v-3",
  Clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 6v4l3 3",
  Globe: "M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20M2 12a10 10 0 0020 0",
  Code2: "M18 16l4-4-4-4M6 8l-4 4 4 4m8.5-12l-5 16",
  Server: "M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01",
  Palette: "M12 2a10 10 0 100 20 5 5 0 005-5c0-.3 0-.6-.1-.9L12 12V2zm4.2 4.8a6 6 0 010 8.4",
  Megaphone: "M3 11l19-9-9 19-2-8-8-2z",
  TrendingUp: "M22 7l-8.5 8.5-5-5L2 17",
  ShieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-2-7l-2-2 1.5-1.5L10 13l4-4 1.5 1.5L10 15z",
  Compass: "M12 2a10 10 0 100 20A10 10 0 0012 2zm4.24-4.24l-2.83 2.83M12 12m-2-2l-4.95 1.95 1.95-4.95 4.95-1.95-1.95 4.95z",
  FileSearch: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-2 13a2 2 0 110-4 2 2 0 010 4zm3 2.93l2 2",
  Users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const path = ICON_PATHS[name] || ICON_PATHS["Sparkles"];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const PACKAGE_STYLES = {
  Basic: {
    badge: "bg-slate-500/15 border-slate-500/30 text-slate-300",
    accent: "from-slate-400 to-slate-500",
    glow: "rgba(148,163,184,0.1)",
  },
  Standard: {
    badge: "bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan",
    accent: "from-brand-cyan to-brand-blue",
    glow: "color-mix(in oklab, var(--brand-cyan) 14%, transparent)",
  },
  Premium: {
    badge: "bg-brand-magenta/15 border-brand-magenta/30 text-brand-magenta",
    accent: "from-brand-magenta to-brand-blue",
    glow: "color-mix(in oklab, var(--brand-magenta) 14%, transparent)",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function DynamicServicePage() {
  const { _splat } = Route.useParams();
  // Build slug from URL path params
  const slug = _splat || "";

  const [service, setService] = useState<any>(null);
  const [processes, setProcesses] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchServiceData();
  }, [slug]);

  const fetchServiceData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setService(data);

      // Fetch processes ordered by step_number
      const { data: procs } = await supabase
        .from("service_processes")
        .select("*")
        .eq("service_id", data.id)
        .order("step_number");
      setProcesses(procs || []);

      // Fetch pricing packages
      const { data: pkgs } = await supabase
        .from("pricing_packages")
        .select("*")
        .eq("service_id", data.id);
      setPackages(pkgs || []);
    } catch {
      // silently fail — show not found below
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative min-h-screen bg-background flex items-center justify-center">
        <BackgroundScene />
        <Navbar />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="h-12 w-12 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading service details…</p>
        </div>
      </div>
    );
  }

  // Service not found in DB
  if (!service) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <BackgroundScene />
        <CustomCursor />
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 z-10 relative">
          <div className="text-6xl font-bold text-muted-foreground/20 mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            This service page doesn't exist yet. You can add it from the admin dashboard under Services & Packages.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" /> View All Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const items: any[] = service.items || [];
  const results: any[] = service.results || [];
  const differentiators: any[] = service.differentiators || [];
  const deliverables: any[] = service.deliverables || [];
  const hasPackages = packages.length > 0;
  const hasProcess = processes.length > 0;

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      <SEOHead
        slug={`/services/${slug}`}
        title={`${service.title} — ClickTake Technologies`}
        description={service.description}
      />
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-44 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} className="mb-5">
              <Link
                to="/services"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Services
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
                {service.eyebrow || service.category_label}
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl"
            >
              <span
                className={`bg-gradient-to-r ${service.gradient || "from-brand-cyan via-brand-magenta to-brand-pink"} bg-clip-text text-transparent`}
              >
                {service.title}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              {service.detailed_description || service.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="/contact"
                className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${service.gradient || "from-brand-cyan to-brand-magenta"} px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform`}
              >
                Get started <ArrowUpRight className="h-4 w-4" />
              </a>
              {hasPackages && (
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors"
                >
                  View pricing
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      {results.length > 0 && (
        <section className="relative py-12 px-4 border-y border-border/40 bg-card/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {results.map((r: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div
                  className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${service.gradient || "from-brand-cyan to-brand-magenta"} bg-clip-text text-transparent`}
                >
                  {r.metric}
                </div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-[140px] mx-auto">
                  {r.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── CAPABILITIES / ITEMS ── */}
      {items.length > 0 && (
        <section className="relative py-24 px-4" id="services">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-3">What's Included</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Service capabilities
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 hover:border-brand-cyan/40 hover:shadow-glow transition-all duration-300"
                >
                  <div
                    className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${service.gradient || "from-brand-cyan to-brand-magenta"} mb-5 group-hover:w-16 transition-all duration-300`}
                  />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 grid place-items-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                      <ServiceIcon name={item.icon_name || "Sparkles"} className="h-5 w-5 text-brand-cyan" />
                    </div>
                    <h3 className="font-bold text-base leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                  {Array.isArray(item.features) && item.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {item.features.map((feat: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-cyan shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS TIMELINE ── */}
      {hasProcess && (
        <section className="relative py-24 px-4 bg-card/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-3">How We Work</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our delivery process</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processes.map((step: any, i: number) => (
                <motion.div
                  key={step.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 hover:border-brand-cyan/30 transition-all duration-300"
                >
                  <div
                    className={`text-4xl font-bold bg-gradient-to-r ${service.gradient || "from-brand-cyan to-brand-magenta"} bg-clip-text text-transparent mb-4 font-mono`}
                  >
                    {String(step.step_number).padStart(2, "0")}
                  </div>
                  <h3 className="font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US / DIFFERENTIATORS ── */}
      {differentiators.length > 0 && (
        <section className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-3">Why Choose Us</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What makes us different</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentiators.map((d: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card/40 p-5 hover:border-brand-cyan/30 transition-all duration-300"
                >
                  <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
                    <ServiceIcon name={d.icon_name || "Sparkles"} className="h-5 w-5 text-brand-cyan" />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">{d.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{d.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DELIVERABLES CHIP CLOUD ── */}
      {deliverables.length > 0 && (
        <section className="relative py-16 px-4 bg-card/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-3">What You Receive</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Included deliverables</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {deliverables.map((d: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-semibold backdrop-blur"
                >
                  <ServiceIcon name={d.icon_name || "CheckCircle2"} className="h-4 w-4 text-brand-cyan" />
                  {d.label}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING PACKAGES ── */}
      {hasPackages && (
        <section className="relative py-24 px-4" id="pricing">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-3">Pricing</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Transparent, fixed-scope packages
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                You know exactly what you're getting before you sign. No scope creep surprises.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(["Basic", "Standard", "Premium"] as const).map((level) => {
                const pkg = packages.find((p: any) => p.package_level === level);
                if (!pkg) return null;
                const style = PACKAGE_STYLES[level];

                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    whileHover={{ y: -4, boxShadow: `0 0 50px ${style.glow}` }}
                    className={`relative flex flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-7 hover:border-opacity-60 transition-all duration-300 ${
                      level === "Standard" ? "ring-1 ring-brand-cyan/40" : ""
                    }`}
                  >
                    {level === "Standard" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold mb-4 ${style.badge}`}>
                      {level}
                    </div>

                    <div className={`text-4xl font-bold bg-gradient-to-r ${style.accent} bg-clip-text text-transparent mb-1`}>
                      {pkg.price}
                    </div>

                    {pkg.delivery_days && (
                      <div className="text-xs text-muted-foreground mb-4">
                        Delivered in {pkg.delivery_days}
                      </div>
                    )}

                    {pkg.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 border-b border-border pb-5">
                        {pkg.description}
                      </p>
                    )}

                    <ul className="space-y-2.5 flex-1 mb-7">
                      {(Array.isArray(pkg.features) ? pkg.features : []).map((feat: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="/contact"
                      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${style.accent} px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-transform`}
                    >
                      Get {level} Package <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ── */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-12 relative overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/4 h-48 w-48 bg-brand-cyan/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 right-1/4 h-48 w-48 bg-brand-magenta/10 blur-3xl rounded-full" />
            </div>
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-4">Ready to get started?</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Let's build something{" "}
                <span className="bg-gradient-to-r from-brand-cyan via-brand-magenta to-brand-pink bg-clip-text text-transparent">
                  exceptional together.
                </span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Book a free 30-minute discovery call and let's map out exactly what you need.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform"
              >
                Book a discovery call <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
