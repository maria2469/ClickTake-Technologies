import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, ExternalLink, Filter, Search, TrendingUp,
  Users, Clock, Star, Sparkles, ChevronRight, Calculator,
  Coins, MessageSquare, Flame, CheckCircle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { SEOHead } from "@/components/SEOHead";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio & Case Studies — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Explore ClickTake's case studies — real results across e-commerce, SaaS, AI, marketing and branding projects.",
      },
    ],
  }),
  component: PortfolioPage,
});

// ─── Data Types ─────────────────────────────────────────────────────────────

type Industry = "All" | "E-Commerce" | "SaaS" | "Realty" | "Marketing" | "AI";
type Service = "All" | "Web Dev" | "AI" | "Branding" | "Paid Media" | "SEO";

const INDUSTRIES: Industry[] = ["All", "E-Commerce", "SaaS", "Realty", "Marketing", "AI"];
const SERVICES: Service[] = ["All", "Web Dev", "AI", "Branding", "Paid Media", "SEO"];

interface CaseStudy {
  title: string;
  category: string;
  industry: Industry;
  service: Service;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  metric: string;
  metricLabel: string;
  tags: string[];
  glow: string;
  gradient: string;
  image: string;
  url: string;
  featured?: boolean;
  testimonial?: string;
  clientName?: string;
  clientRole?: string;
}

const caseStudies: CaseStudy[] = [
  {
    title: "Lumen Commerce",
    category: "E-Commerce · Headless Shopify",
    industry: "E-Commerce",
    service: "Web Dev",
    description:
      "Full headless rebuild with AI-driven product recommendations and a custom checkout flow. Delivered a 3× faster storefront and record-breaking BFCM sales.",
    challenge:
      "Lumen's legacy Shopify theme was bottlenecked on mobile, converting below 1.2%, with slow load times causing significant cart abandonment during peak campaigns.",
    solution:
      "We rebuilt the entire storefront as a headless Next.js app, integrated a custom AI recommendation engine using OpenAI embeddings, and redesigned the checkout to a single-page flow with smart address completion.",
    results: [
      "+312% revenue uplift in 6 months",
      "3× faster storefront (LCP < 1.2s)",
      "Mobile conversion up from 1.2% to 4.8%",
      "Record BFCM — best single-day sales in company history",
    ],
    metric: "+312%",
    metricLabel: "Revenue",
    tags: ["Shopify", "Next.js", "AI Recs", "Headless"],
    glow: "shadow-cyan-500/20",
    gradient: "from-cyan-500 to-blue-600",
    image: "from-cyan-900 via-blue-900 to-slate-900",
    url: "https://clicktaketechnologies.com",
    featured: true,
    testimonial: "The headless rebuild by ClickTake completely changed our business. Our conversion rate tripled overnight and we survived Black Friday traffic without a single glitch.",
    clientName: "Marcus Vance",
    clientRole: "Director of E-Commerce, Lumen",
  },
  {
    title: "Northwind SaaS",
    category: "Web App · AI Dashboard",
    industry: "SaaS",
    service: "AI",
    description:
      "Built an analytics platform with GPT-powered insight summaries, role-based access, and real-time data pipelines for a B2B SaaS startup.",
    challenge:
      "A B2B startup needed to differentiate in a saturated analytics market. Users were drowning in charts without actionable takeaways, leading to high churn.",
    solution:
      "We designed and engineered a full analytics SaaS with AI-generated plain-English insight summaries per dashboard, role-based permissions, Stripe billing and a real-time event pipeline using Kafka.",
    results: [
      "12,000 monthly active users in 8 months",
      "Churn reduced by 38%",
      "3 enterprise contracts secured at launch",
      "AI summaries cited as #1 retention driver in NPS survey",
    ],
    metric: "12k",
    metricLabel: "MAU",
    tags: ["React", "Node.js", "OpenAI", "Kafka"],
    glow: "shadow-indigo-500/20",
    gradient: "from-violet-500 to-indigo-600",
    image: "from-violet-900 via-indigo-900 to-slate-900",
    url: "https://clicktaketechnologies.com",
    featured: true,
    testimonial: "Their AI insights dashboard helped us close three enterprise customers in our first month. The customer onboarding churn dropped immediately.",
    clientName: "Sarah Lansing",
    clientRole: "Founder & CEO, Northwind",
  },
  {
    title: "Atlas Realty",
    category: "Brand Identity · Web",
    industry: "Realty",
    service: "Branding",
    description:
      "Complete brand overhaul with a fast property listing site, map search, and mortgage calculator.",
    challenge:
      "Atlas was operating with an outdated brand and a slow WordPress site that wasn't converting property enquiries. Their competitors were outranking them on Google and projecting a more premium image.",
    solution:
      "Full rebrand from logo to brand guidelines, migrated to a custom Webflow site with Google Maps API property search, mortgage calculator and automated WhatsApp lead routing.",
    results: [
      "9.2/10 Google PageSpeed score",
      "Organic enquiries up 180% in 90 days",
      "New brand launched across all channels in 3 weeks",
      "30% lower cost per lead vs previous site",
    ],
    metric: "9.2",
    metricLabel: "PageSpeed",
    tags: ["Branding", "Webflow", "Maps API", "SEO"],
    glow: "shadow-violet-500/20",
    gradient: "from-fuchsia-500 to-violet-600",
    image: "from-fuchsia-900 via-purple-900 to-slate-900",
    url: "https://clicktaketechnologies.com",
    testimonial: "The property map search is fast, clean, and has already doubled our organic WhatsApp lead inquiries.",
    clientName: "Ahmed Raza",
    clientRole: "Director of Growth, Atlas Realty",
  },
  {
    title: "Verve Studio",
    category: "Paid Growth · Marketing",
    industry: "Marketing",
    service: "Paid Media",
    description:
      "Meta & Google campaigns with funnel optimisation that scaled ROAS from 3× to 47×.",
    challenge:
      "A creative studio was running ads in-house with a 3× ROAS — good, but not scalable. Budgets were being wasted on broad audiences with no clear funnel structure.",
    solution:
      "We rebuilt the entire paid media strategy: audience segmentation, creative testing framework, dedicated retargeting sequences and a conversion-optimised landing page for each campaign objective.",
    results: [
      "ROAS scaled from 3× to 47× in 4 months",
      "Cost per acquisition dropped 71%",
      "£2M+ total ad spend managed profitably",
      "Creative winning-rate (tests → winners) at 1-in-3",
    ],
    metric: "47×",
    metricLabel: "ROAS",
    tags: ["Meta Ads", "Google", "CRO", "Funnels"],
    glow: "shadow-fuchsia-500/20",
    gradient: "from-pink-500 to-rose-600",
    image: "from-rose-900 via-pink-900 to-slate-900",
    url: "https://clicktaketechnologies.com",
    testimonial: "ClickTake's paid media optimization strategy and landing page CRO scaled our ROAS to heights we didn't think were possible.",
    clientName: "Chloe Myers",
    clientRole: "CMO, Verve Studio",
  },
  {
    title: "NovaMed AI",
    category: "Healthcare · AI Automation",
    industry: "AI",
    service: "AI",
    description:
      "Built an AI triage and patient intake automation system that reduced admin overhead by 60% for a private healthcare provider.",
    challenge:
      "A private clinic was losing 4 staff hours per day to manual patient intake, appointment scheduling and post-visit follow-up — all done via phone and email.",
    solution:
      "We designed an AI-powered intake flow with a WhatsApp chatbot for initial symptom collection, automated appointment booking via Google Calendar API and GPT-4 powered post-visit care instructions.",
    results: [
      "60% reduction in admin overhead",
      "30+ hours saved per week",
      "Patient NPS improved from 62 to 88",
      "Zero missed follow-ups since launch",
    ],
    metric: "60%",
    metricLabel: "Admin saved",
    tags: ["GPT-4", "WhatsApp API", "n8n", "Automation"],
    glow: "shadow-teal-500/20",
    gradient: "from-teal-500 to-cyan-600",
    image: "from-teal-900 via-cyan-900 to-slate-900",
    url: "https://clicktaketechnologies.com",
    testimonial: "We saved 30+ hours per week of manual data entry within weeks of deploying the WhatsApp symptom chatbot. Highly recommend.",
    clientName: "Dr. Faisal Khan",
    clientRole: "Operations Lead, NovaMed",
  },
  {
    title: "Kira Fashion",
    category: "E-Commerce · SEO & Growth",
    industry: "E-Commerce",
    service: "SEO",
    description:
      "Technical SEO overhaul and content system that grew organic revenue from £12k to £87k/month in under a year.",
    challenge:
      "An independent fashion label had a beautiful site but virtually no organic traffic. 90% of revenue was dependent on paid social — a fragile and expensive strategy.",
    solution:
      "Full technical SEO audit and site architecture rebuild, a content hub targeting high-intent keywords, and a structured data + product schema strategy to capture rich results in Google Shopping.",
    results: [
      "Organic revenue: £12k → £87k/month",
      "Page-1 rankings for 340+ target keywords",
      "Organic traffic share: 8% → 54%",
      "£0 ad spend on organic-driven revenue",
    ],
    metric: "7.2×",
    metricLabel: "Organic growth",
    tags: ["Technical SEO", "Content", "Schema", "E-Commerce"],
    glow: "shadow-amber-500/20",
    gradient: "from-amber-500 to-orange-600",
    image: "from-amber-900 via-orange-900 to-slate-900",
    url: "https://clicktaketechnologies.com",
    testimonial: "Our organic search revenue went from £12k to over £80k in less than a year. Absolute game changer for our brand.",
    clientName: "Jessica Taylor",
    clientRole: "Brand Manager, Kira Fashion",
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function CaseStudyCard({ cs, featured }: { cs: CaseStudy; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-card/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${cs.glow} ${featured ? "lg:col-span-2" : ""}`}
    >
      {/* Cover Image/Gradient */}
      <div className={`relative aspect-[${featured ? "21/9" : "16/9"}] overflow-hidden bg-gradient-to-br ${cs.image}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_50%)]" />

        {/* Shine */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute -left-40 top-0 h-full w-32 rotate-12 bg-white/10 blur-2xl transition-all duration-1000 group-hover:left-[120%]" />
        </div>

        {/* External Link */}
        <a
          href={cs.url}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition-all duration-300 hover:rotate-12 hover:bg-white hover:text-black"
        >
          <ExternalLink className="h-4 w-4" />
        </a>

        {/* Metric badge */}
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {cs.metric} {cs.metricLabel}
        </div>

        {cs.featured && (
          <div className="absolute left-4 top-12 mt-1 rounded-full border border-amber-400/30 bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
            ⭐ Featured Case Study
          </div>
        )}

        {/* Overlay Labels */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/60">{cs.category}</div>
          <div className="mt-1.5 font-display text-xl font-bold text-white sm:text-2xl">{cs.title}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <p className="text-sm leading-6 text-muted-foreground">{cs.description}</p>

        {/* Expandable Case Study Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-5 border-t border-white/8 pt-5">
                
                {/* Challenge */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Challenge</div>
                  <p className="text-sm leading-6 text-muted-foreground">{cs.challenge}</p>
                </div>

                {/* Solution */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">Solution & Build</div>
                  <p className="text-sm leading-6 text-muted-foreground">{cs.solution}</p>
                </div>

                {/* Results List */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Metrics & Results</div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {cs.results.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground bg-white/5 border border-white/5 rounded-xl p-2.5">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Testimonial */}
                {cs.testimonial && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 relative overflow-hidden">
                    <MessageSquare className="absolute -right-3 -bottom-3 h-16 w-16 text-white/5 rotate-12" />
                    <p className="text-xs italic leading-5 text-muted-foreground mb-3">
                      "{cs.testimonial}"
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1 w-5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                      <div className="text-[10px] font-bold text-foreground">
                        {cs.clientName} <span className="text-muted-foreground font-normal">({cs.clientRole})</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {cs.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-secondary/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:border-white/20 hover:text-foreground transition-all"
            >
              {expanded ? "Less Details" : "Full Study"}
              <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>
            <a
              href={cs.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${cs.gradient} px-4.5 py-2 text-xs font-bold text-white shadow-md hover:scale-105 transition-transform`}
            >
              Live Site <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Styling border ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/5" />
    </motion.div>
  );
}

// ─── Interactive ROI Calculator Component ─────────────────────────────────────

function InteractiveROICalculator() {
  const [traffic, setTraffic] = useState(25000);
  const [convRate, setConvRate] = useState(1.5);
  const [aov, setAov] = useState(85);
  const [selectedFocus, setSelectedFocus] = useState<"headless" | "seo" | "ai">("headless");

  const calcResults = useMemo(() => {
    // Basic conversion logic based on focus
    let upliftMult = 1.0;
    let description = "";
    if (selectedFocus === "headless") {
      upliftMult = 3.0; // 3x mobile conversion average
      description = "Next.js storefront speeds & streamlined checkout typically triple mobile conversion rates.";
    } else if (selectedFocus === "seo") {
      upliftMult = 1.8; // +80% traffic volume focus
      description = "Technical optimization and structured content strategy target high-intent organic keywords.";
    } else {
      upliftMult = 1.4; // 40% efficiency / customer funnel retention boost
      description = "AI WhatsApp chatbots and intake automation minimize customer abandonment & scale support.";
    }

    const currentMonthlySales = Math.round((traffic * (convRate / 100)));
    const currentMonthlyRevenue = Math.round(currentMonthlySales * aov);

    const projectedConvRate = Math.min(15.0, Number((convRate * upliftMult).toFixed(2)));
    const projectedMonthlySales = Math.round((traffic * (projectedConvRate / 100)));
    const projectedMonthlyRevenue = Math.round(projectedMonthlySales * aov);

    const monthlyUplift = projectedMonthlyRevenue - currentMonthlyRevenue;
    const annualUplift = monthlyUplift * 12;
    const roiMultiplier = Number((monthlyUplift / 3500).toFixed(1)); // assuming average monthly retainer of £3,500

    return {
      currentRevenue: currentMonthlyRevenue,
      projectedRevenue: projectedMonthlyRevenue,
      monthlyUplift,
      annualUplift,
      projectedConvRate,
      roiMultiplier: roiMultiplier < 1.0 ? 1.5 : roiMultiplier,
      description,
    };
  }, [traffic, convRate, aov, selectedFocus]);

  return (
    <section className="mx-auto max-w-7xl px-4 mt-24">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-card/60 p-8 sm:p-10 backdrop-blur-xl">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Controls */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-3">
                <Calculator className="h-3 w-3" /> Growth Estimator
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight">
                Calculate Your Estimated ROI
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-md">
                Adjust the sliders below to estimate the commercial impact of a headless build, SEO campaign, or custom AI automation.
              </p>
            </div>

            {/* Selector buttons */}
            <div className="grid grid-cols-3 gap-2 border border-white/5 bg-background/50 rounded-xl p-1">
              {(["headless", "seo", "ai"] as const).map((focus) => (
                <button
                  key={focus}
                  onClick={() => setSelectedFocus(focus)}
                  className={`rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedFocus === focus
                      ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {focus === "headless" ? "Headless Web" : focus === "seo" ? "Growth SEO" : "AI Automation"}
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Monthly Website Traffic</span>
                  <span className="text-cyan-400 font-mono font-bold">{traffic.toLocaleString()} visitors</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="150000"
                  step="1000"
                  value={traffic}
                  onChange={(e) => setTraffic(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Current Conversion Rate</span>
                  <span className="text-violet-400 font-mono font-bold">{convRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="6.0"
                  step="0.1"
                  value={convRate}
                  onChange={(e) => setConvRate(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Average Order Value (AOV)</span>
                  <span className="text-fuchsia-400 font-mono font-bold">£{aov}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full accent-fuchsia-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground leading-relaxed italic bg-white/5 rounded-xl p-3 border border-white/5 flex items-start gap-2">
              <Flame className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{calcResults.description}</span>
            </div>
          </div>

          {/* Results outputs */}
          <div className="w-full lg:w-[360px] rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Coins className="h-24 w-24 text-white" />
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold mb-1">Conversion Target</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-black text-foreground">{convRate}%</div>
                  <div className="text-xs text-muted-foreground">to</div>
                  <div className="text-3xl font-black text-cyan-400">{calcResults.projectedConvRate}%</div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold mb-1">Est. Revenue Uplift</div>
                <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  +£{calcResults.monthlyUplift.toLocaleString()}
                  <span className="text-xs text-muted-foreground font-semibold inline-block ml-1">/ month</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold mb-1">Additional Annual Revenue</div>
                <div className="text-2xl font-bold text-foreground">
                  +£{calcResults.annualUplift.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold">Estimated ROI</div>
                <div className="text-lg font-black text-emerald-400">{calcResults.roiMultiplier}× multiplier</div>
              </div>
              <a
                href="/#contact"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:scale-105 transition-transform"
              >
                Discuss Plan <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────

function PortfolioPage() {
  const [industry, setIndustry] = useState<Industry>("All");
  const [service, setService] = useState<Service>("All");
  const [search, setSearch] = useState("");

  const filtered = caseStudies.filter((cs) => {
    const matchIndustry = industry === "All" || cs.industry === industry;
    const matchService = service === "All" || cs.service === service;
    const matchSearch =
      !search ||
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchIndustry && matchService && matchSearch;
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SEOHead slug="/portfolio" title="Portfolio & Case Studies — ClickTake Technologies" description="Explore ClickTake's case studies — real results across e-commerce, SaaS, AI, marketing and branding projects." />
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        
        {/* HERO */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[130px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs backdrop-blur-xl mb-6">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Portfolio & Case Studies
              </div>

              <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Real results. <span className="text-gradient">Real impact.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Every project represents a story of a commercial challenge solved and a business digitally transformed. 
                Explore client case studies across industries.
              </p>

              {/* Stats Strip */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-10">
                {[
                  { val: "120+", label: "Projects Delivered", icon: Sparkles },
                  { val: "80+", label: "Happy Partners", icon: Users },
                  { val: "£2M+", label: "Ad Spend Managed", icon: TrendingUp },
                  { val: "5.0★", label: "Client NPS Score", icon: Star },
                ].map(({ val, label, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{val}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FILTERS */}
        <div className="mx-auto max-w-7xl px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by tag or name..."
                  className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Industry filter */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      industry === ind
                        ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md"
                        : "border border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>

              {/* Service filter */}
              <div className="flex flex-wrap items-center gap-2">
                {SERVICES.map((svc) => (
                  <button
                    key={svc}
                    onClick={() => setService(svc)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      service === svc
                        ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-md"
                        : "border border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* PROJECTS GRID */}
        <div className="mx-auto max-w-7xl px-4 mt-10">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {filtered.map((cs) => (
                  <CaseStudyCard key={cs.title} cs={cs} featured={cs.featured} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
              >
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30 text-primary animate-pulse" />
                <p>No case studies match your filters. Try adjusting your search queries.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ROI CALCULATOR */}
        <InteractiveROICalculator />

        {/* CTA CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 mx-auto max-w-7xl px-4"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-card/40 p-8 backdrop-blur-xl text-center"
            style={{ boxShadow: "0 0 60px -20px rgba(99,102,241,0.15)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-fuchsia-500/5" />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Ready for compounding growth?
              </h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
                Let's discuss how we can build custom digital experiences or automate your operational workflows. Book a discovery call.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
                >
                  Book a Free Call <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold hover:border-white/20 transition-all"
                >
                  View Services <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
