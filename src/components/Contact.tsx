import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ArrowUpRight,
  Sparkles,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const contactMethods = [
  {
    icon: MessageCircle,
    label: "WhatsApp · Pakistan",
    value: "+92 306 9753003",
    href: "https://wa.me/923069753003",
    glow: "from-emerald-400 to-green-500",
  },
  {
    icon: Phone,
    label: "WhatsApp · United Kingdom",
    value: "+44 7391 653377",
    href: "https://wa.me/447391653377",
    glow: "from-cyan-400 to-blue-500",
  },
  {
    icon: Mail,
    label: "Email Address",
    value: "info@clicktaketech.com",
    href: "mailto:info@clicktaketech.com",
    glow: "from-fuchsia-500 to-violet-500",
  },
];

const offices = [
  {
    label: "UK Office",
    addr: "Flat 312, Kitts Green Road, Birmingham B33 9SB",
  },
  {
    label: "Pakistan · Multan HQ",
    addr: "Office #12, B.C.G Chowk, Paracha Street, Multan 60600",
  },
  {
    label: "Pakistan · Multan",
    addr: "Basti Rid Lar, Multan, Punjab 59130",
  },
];

const benefits = [
  "Free project consultation",
  "Fast response within hours",
  "AI-powered scalable solutions",
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 lg:py-36"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 " />

      <div className="absolute inset-0 opacity-[0.05]">
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
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>

            LET'S BUILD SOMETHING AMAZING
          </div>

          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            Start your next
            <span className="block text-gradient animate-gradient">
              digital experience.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Whether you're launching a startup, scaling an AI product,
            or redesigning your brand — we help ambitious companies
            move faster with premium design and engineering.
          </p>
        </motion.div>

        {/* MAIN CARD */}
        <div className="relative mt-16 overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/70 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl">

          {/* animated glow */}
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative grid gap-12 p-6 lg:grid-cols-[1fr_0.95fr] lg:p-14">

            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* SMALL INFO */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs backdrop-blur">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  Available for 2026 projects
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI + Design + Growth
                </div>
              </div>

              <h3 className="mt-8 font-display text-3xl font-bold sm:text-4xl">
                Let's turn your vision into a scalable product.
              </h3>

              <p className="mt-4 max-w-lg text-muted-foreground leading-relaxed">
                We partner with startups, creators and enterprises to
                build high-performance websites, AI systems, mobile apps
                and growth-focused digital experiences.
              </p>

              {/* BENEFITS */}
              <div className="mt-8 space-y-3">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {b}
                  </div>
                ))}
              </div>

              {/* CONTACT METHODS */}
              <div className="mt-10 space-y-4">
                {contactMethods.map((m) => (
                  <a
                    key={m.href}
                    href={m.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                  >
                    {/* hover glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${m.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
                    />

                    <div
                      className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${m.glow} text-white shadow-lg`}
                    >
                      <m.icon className="h-5 w-5" />
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                        {m.label}
                      </div>

                      <div className="mt-1 truncate font-medium text-foreground">
                        {m.value}
                      </div>
                    </div>

                    <ArrowUpRight className="relative h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* FORM */}
            <motion.form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! We'll contact you shortly.");
              }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/80 p-6 backdrop-blur-xl lg:p-8"
            >
              {/* glow */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <h4 className="font-display text-2xl font-bold">
                  Tell us about your project
                </h4>

                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form and our team will get back to you shortly.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Your name"
                    className="h-12 rounded-xl border border-border bg-card/60 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    className="h-12 rounded-xl border border-border bg-card/60 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Company name"
                    className="h-12 rounded-xl border border-border bg-card/60 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <select className="h-12 rounded-xl border border-border bg-card/60 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>Web Development</option>
                    <option>AI Automation</option>
                    <option>Mobile App</option>
                    <option>Branding</option>
                    <option>SEO & Marketing</option>
                  </select>
                </div>

                <textarea
                  rows={6}
                  placeholder="Tell us about your idea, goals, timeline and requirements..."
                  className="mt-4 w-full rounded-2xl border border-border bg-card/60 px-4 py-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="submit"
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-4 font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.02]"
                >
                  Send Project Inquiry

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </motion.form>
          </div>

          {/* OFFICES */}
          <div className="relative border-t border-border/50 px-6 py-8 lg:px-14">
            <div className="grid gap-6 md:grid-cols-3">
              {offices.map((o, i) => (
                <motion.div
                  key={o.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl border border-border/40 bg-background/50 p-5 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        {o.label}
                      </div>

                      <div className="mt-2 text-sm leading-relaxed text-foreground">
                        {o.addr}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}