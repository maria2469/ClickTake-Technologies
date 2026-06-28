import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import image1 from "@/assets/image1.png";
import image2 from "@/assets/image2.jpg";
import image3 from "@/assets/image3.jpg";
import image4 from "@/assets/image4.jpg";

interface ProjectItem {
  title: string;
  category: string;
  description: string;
  metric: string;
  tags: string[];
  image: string;
  glow: string;
  url: string;
}

const fallbackProjects: ProjectItem[] = [
  {
    title: "Lumen Commerce",
    category: "E-Commerce · Headless Shopify",
    description:
      "Full headless rebuild with AI-driven product recommendations and a custom checkout flow. Delivered a 3× faster storefront and record-breaking BFCM sales.",
    metric: "+312% revenue",
    tags: ["Shopify", "Next.js", "AI Recs"],
    image: image1,
    glow: "hover:shadow-cyan-500/20",
    url: "https://clicktaketechnologies.com",
  },
  {
    title: "Northwind SaaS",
    category: "Web App · AI Dashboard",
    description:
      "Built an analytics platform with GPT-powered insight summaries, role-based access, and real-time data pipelines for a B2B SaaS startup.",
    metric: "12k MAU",
    tags: ["React", "Node.js", "OpenAI"],
    image: image2,
    glow: "hover:shadow-indigo-500/20",
    url: "https://clicktaketechnologies.com",
  },
  {
    title: "Atlas Realty",
    category: "Brand Identity · Web",
    description:
      "Complete brand overhaul with a fast property listing site, map search, and mortgage calculator.",
    metric: "9.2 PageSpeed",
    tags: ["Branding", "Webflow", "Maps API"],
    image: image3,
    glow: "hover:shadow-violet-500/20",
    url: "https://clicktaketechnologies.com",
  },
  {
    title: "Verve Studio",
    category: "Paid Growth · Marketing",
    description:
      "Meta & Google campaigns with funnel optimisation that scaled ROAS from 3× to 47×.",
    metric: "47× ROAS",
    tags: ["Meta Ads", "Google", "CRO"],
    image: image4,
    glow: "hover:shadow-fuchsia-500/20",
    url: "https://clicktaketechnologies.com",
  },
];

export function Work() {
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: true })
          .limit(4);

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((item: any, idx: number) => {
            let img = fallbackProjects[idx % fallbackProjects.length].image;
            if (item.images && item.images.length > 0) {
              const firstImage = item.images[0];
              if (firstImage.startsWith("http") || firstImage.startsWith("/")) {
                img = firstImage;
              }
            }

            let metricStr = "";
            if (item.metrics) {
              metricStr = `${item.metrics.value || ""} ${item.metrics.label || ""}`.trim();
            }

            return {
              title: item.title,
              category: `${item.service_category || "Service"} · ${item.industry || "Industry"}`,
              description: item.challenge || item.solution || "",
              metric: metricStr || "Case Study",
              tags: item.technologies || [],
              image: img,
              glow: idx % 4 === 0 ? "hover:shadow-cyan-500/20" :
                    idx % 4 === 1 ? "hover:shadow-indigo-500/20" :
                    idx % 4 === 2 ? "hover:shadow-violet-500/20" : "hover:shadow-fuchsia-500/20",
              url: `/portfolio#${item.slug || ""}`,
            };
          });
          setProjects(mapped);
        }
      } catch (err) {
      }
    }

    loadProjects();
  }, []);

  return (
    <section
      id="work"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-background/20" />

      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs backdrop-blur-xl">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Featured Work
            </div>

            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Selected{" "}
              <span className="text-gradient">
                case studies.
              </span>
            </h2>
          </div>

          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-5 py-2.5 text-sm font-medium backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg"
          >
            View all projects
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* GRID */}
        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-[30px] border border-white/10 bg-card/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${p.glow}`}
            >
              {/* IMAGE */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)]" />

                {/* animated shine */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  <div className="absolute -left-40 top-0 h-full w-32 rotate-12 bg-white/10 blur-2xl transition-all duration-1000 group-hover:left-[120%]" />
                </div>

                {/* floating orb */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

                {/* external button */}
                <a
                  href={p.url}
                  className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition-all duration-300 hover:rotate-12 hover:bg-white hover:text-black"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

                {/* metric */}
                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {p.metric}
                </div>

                {/* bottom content */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/70">
                    {p.category}
                  </div>

                  <div className="mt-2 font-display text-2xl font-bold text-white">
                    {p.title}
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  {p.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  {/* tags */}
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-secondary/50 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* button */}
                  <a
                    href={p.url}
                    className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
                  >
                    View project
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              {/* subtle border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/5" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}