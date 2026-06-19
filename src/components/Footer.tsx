import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Mail,
  ArrowUpRight,
  Sparkles,
  Phone,
  Clock3,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

import logo from "@/assets/clicktake-logo.jpg";

const socials = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/clicktaketechnologies/",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/clicktaketechnologiesuk/",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/click-take-technologies/",
    label: "LinkedIn",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/channel/UCt527M4hxeFOavWdXSRTsdw",
    label: "YouTube",
  },
];

const services = [
  "Web Development",
  "Mobile Apps",
  "AI Solutions",
  "SEO & Marketing",
  "Brand Identity",
  "E-Commerce",
];

const companyLinks = [
  { label: "About Us", to: "/about", isPage: true },
  { label: "Our Work", to: "/portfolio", isPage: true },
  { label: "Resources", to: "/resources", isPage: true },
  { label: "Process", href: "#work" }, // Wait, keep existing scroll links
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", to: "/contact", isPage: true },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-background">
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* GLOW ORBS */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20">

        {/* TOP CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:p-12"
        >
          {/* glow */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                LET'S BUILD SOMETHING GREAT
              </div>

              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Ready to scale your
                <span className="block text-gradient animate-gradient">
                  digital presence?
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
                We help startups and brands build modern websites,
                AI-powered systems and high-converting digital experiences.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 py-4 font-semibold text-white shadow-glow transition-all duration-300 hover:scale-105"
              >
                Start a project

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>

                Available for 2026 projects
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN FOOTER */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">

          {/* BRAND */}
          <div>
            <a href="/" className="group flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border shadow-elegant transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
                <img
                  src={logo}
                  alt="ClickTake Technologies"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <div>
                <div className="font-display text-lg font-bold">
                  ClickTake Technologies
                </div>

                <div className="text-xs tracking-wide text-muted-foreground">
                  Connecting in a better way
                </div>
              </div>
            </a>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              A modern digital agency helping businesses grow with
              premium websites, AI automation, mobile apps and
              growth-focused marketing systems.
            </p>

            {/* INFO */}
            <div className="mt-6 space-y-4">

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                  <MapPin className="h-4 w-4" />
                </div>

                <div>
                  Birmingham, UK <br />
                  Multan, Pakistan
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                  <Mail className="h-4 w-4" />
                </div>

                <a
                  href="mailto:hello@clicktaketechnologies.com"
                  className="transition-colors hover:text-foreground"
                >
                  hello@clicktaketechnologies.com
                </a>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                  <Phone className="h-4 w-4" />
                </div>

                <div>
                  +92 306 9753003 <br />
                  +44 7391 653377
                </div>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="mt-8 flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="group grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-gradient-brand hover:text-white hover:shadow-glow"
                >
                  <s.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div>
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Services
            </div>

            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {service}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Company
            </div>

            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  {item.isPage && item.to ? (
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {item.label}
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* STRATEGY CARD */}
          <div>
            <div className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant">

              {/* glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              </div>

              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <Clock3 className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-display text-xl font-bold">
                  Free strategy session
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Book a free consultation call and discover how we
                  can help scale your business with technology and AI.
                </p>

                <Link
                  to="/contact"
                  className="group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-105"
                >
                  Book a free call

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>

                  Usually responds within a few hours
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 flex flex-col gap-5 border-t border-border/50 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">

          <div>
            © {new Date().getFullYear()} ClickTake Technologies Ltd.
            All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/legal/privacy"
              className="transition-colors duration-300 hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <Link
              to="/legal/terms"
              className="transition-colors duration-300 hover:text-foreground"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/legal/cookies"
              className="transition-colors duration-300 hover:text-foreground"
            >
              Cookie Preferences
            </Link>

            <span className="text-muted-foreground/80">
              Crafted with passion in Multan & Birmingham
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}