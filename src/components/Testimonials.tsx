import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
}

const fallbackItems: TestimonialItem[] = [
  {
    quote:
      "ClickTake rebuilt our entire stack and tripled our online revenue in just four months. They genuinely felt like an extension of our internal team.",
    author: "Sarah Mitchell",
    role: "Founder, Lumen Commerce",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "The AI automations they engineered save us over 30 hours every week. Exceptional execution, clean systems and incredible design taste.",
    author: "James O'Connor",
    role: "CTO, Northwind",
    location: "Manchester, UK",
    rating: 5,
  },
  {
    quote:
      "The best digital partner we've worked with. Strategy, branding, development and growth — all executed at an elite level.",
    author: "Aisha Khan",
    role: "Marketing Director, Verve Studio",
    location: "Birmingham, UK",
    rating: 5,
  },
];

export function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(fallbackItems);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((t: any) => ({
            quote: t.content || t.message || "",
            author: t.name || t.client_name || "",
            role: t.company || "",
            location: t.rating === 5 ? "Verified Client" : "Client Partner",
            rating: t.rating || 5,
          }));
          setItems(mapped);
        }
      } catch (err) {
      }
    }

    loadTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {/* top glow */}
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-brand-cyan/10 blur-[120px]" />

        {/* bottom glow */}
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-magenta/10 blur-[120px]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Trusted Worldwide
          </div>

          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Loved by founders{" "}
            <span className="text-gradient">
              who ship.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Trusted by ambitious brands and fast-moving teams building the next
            generation of digital products.
          </p>
        </motion.div>

        {/* TESTIMONIAL GRID */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
              }}
              className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-card/60 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* ambient glow */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-cyan/10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-brand-magenta/10" />

              {/* subtle inner border */}
              <div className="absolute inset-[1px] rounded-[29px] border border-white/5" />

              {/* quote icon */}
              <Quote className="absolute right-7 top-7 h-14 w-14 text-white/5 transition-all duration-500 group-hover:scale-110 group-hover:text-primary/10" />

              {/* stars */}
              <div className="relative flex items-center gap-1">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-brand-cyan text-brand-cyan"
                  />
                ))}
              </div>

              {/* quote */}
              <p className="relative mt-6 text-lg leading-8 text-foreground/90">
                “{t.quote}”
              </p>

              {/* footer */}
              <div className="relative mt-8 border-t border-white/10 pt-6">
                <div className="font-display text-lg font-semibold text-foreground">
                  {t.author}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  {t.role}
                </div>

                <div className="mt-3 inline-flex items-center rounded-full border border-brand-cyan/15 bg-brand-cyan/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-brand-cyan/80">
                  {t.location}
                </div>
              </div>

              {/* hover glow border */}
              <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-brand-cyan/0 via-transparent to-brand-magenta/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}