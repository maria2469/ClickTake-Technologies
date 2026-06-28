import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, BookOpen, Calendar, Clock, Download, FileText,
  Filter, Search, Sparkles, User, Video, X, CheckCircle2,
  Mail, Building, AlertCircle, Loader2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Insights — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Browse our collection of SEO-optimized articles, B2B SaaS growth guides, whitepapers, and upcoming webinars on AI and development.",
      },
    ],
  }),
  component: ResourcesPage,
});

// ─── Data Types ─────────────────────────────────────────────────────────────

type ResourceType = "All" | "Blog" | "Guide" | "Webinar";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  tags: string[];
  gradient: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  pages: number;
  format: string;
  gradient: string;
  downloadCount: string;
}

interface Webinar {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  speakerRole: string;
  status: "Upcoming" | "On-Demand";
  gradient: string;
}

// ─── Fallback Data (used when DB is empty) ──────────────────────────────────

const fallbackArticles: Article[] = [
  {
    id: "headless-shopify",
    title: "Why Headless Shopify is the Future of Enterprise E-Commerce",
    excerpt: "Discover how splitting your store front-end from Shopify's back-end yields a 3× load speed improvement, higher mobile conversion rates, and total design freedom.",
    content: "Speed is no longer a luxury in e-commerce; it's a direct driver of conversion. Standard Shopify themes, while convenient, are bottlenecked by render-blocking scripts, heavy CSS files, and monolithic liquid templates. By decoupling your storefront using frameworks like Next.js and powering the back-end with Shopify API (headless architecture), you bypass these technical limitations entirely.\n\nIn this article, we break down:\n1. Core Web Vitals optimizations achieved through headless setups.\n2. The security benefits of running a static front-end.\n3. How localized content and custom multi-currency checkouts increase global average order value (AOV) by up to 28%.",
    category: "E-Commerce",
    author: "Zain Paracha",
    readTime: "6 min read",
    date: "May 24, 2026",
    tags: ["Headless Commerce", "Shopify API", "Next.js", "Web Performance"],
    gradient: "from-cyan-500/20 via-blue-600/5 to-slate-900",
  },
  {
    id: "ai-agents-ops",
    title: "Autonomous AI Agents: Transforming Customer Support and Operations",
    excerpt: "Beyond basic Q&A chatbots: learn how custom LLMs and active agents integrated into CRM systems are saving enterprise teams up to 40+ hours per week.",
    content: "The era of static, keyword-triggered FAQ widgets is over. Modern LLM-based autonomous agents are now capable of accessing APIs, updating database records, verifying user authentication, and orchestrating complex tasks on behalf of your team.\n\nKey takeaways from our implementation experiences:\n1. Structured system prompts combined with retrieval-augmented generation (RAG) yield a 99.4% accuracy rate on patient triage.\n2. n8n and LangChain backend integrations allow agents to schedule appointments directly into calendars, update HubSpot logs, and dispatch WhatsApp follow-ups autonomously.\n3. Admin overhead is cut by 60% within the first 60 days of deployment.",
    category: "AI & ML Solutions",
    author: "Adam Kitts",
    readTime: "8 min read",
    date: "May 18, 2026",
    tags: ["AI Agents", "LLMs", "RAG", "Automation", "FastAPI"],
    gradient: "from-violet-500/20 via-indigo-600/5 to-slate-900",
  },
  {
    id: "seo-multi-location",
    title: "The Multi-Location Technical SEO Framework for UK & Pakistan SMEs",
    excerpt: "A step-by-step audit guide covering schema markup, NAP consistency, and local landing page speed to dominate regional map pack rankings.",
    content: "If you operate across multiple physical office locations, generic SEO strategies won't cut it. Search engines serve results tailored to hyper-local user coordinates. Without precise signals, your branches will cannibalize each other's traffic or fail to show up in regional queries altogether.\n\nOur proven multi-location roadmap includes:\n1. JSON-LD LocalBusiness schema implementation customized for every individual office.\n2. Restructuring your site URL hierarchy with localized page content.\n3. Managing third-party directories to ensure 100% NAP consistency.",
    category: "SEO & Growth",
    author: "SEO Team Leads",
    readTime: "5 min read",
    date: "May 12, 2026",
    tags: ["Technical SEO", "Local SEO", "Schema Markup", "NAP Consistency"],
    gradient: "from-emerald-500/20 via-teal-600/5 to-slate-900",
  },
];

const fallbackGuides: Guide[] = [
  { id: "saas-playbook", title: "The 2026 B2B SaaS Growth Playbook", description: "42 pages of actionable strategies on funnel optimization, subscription models, product-led growth (PLG) setups, and scaling web infrastructure.", pages: 42, format: "PDF Booklet", gradient: "from-pink-500 to-rose-600", downloadCount: "1.2k+ downloads" },
  { id: "enterprise-ai", title: "Enterprise AI Implementation Guide: Risk, Cost, & ROI", description: "A comprehensive handbook for C-level executives detailing cost frameworks of self-hosting vs fine-tuning OpenAI models, data security compliance, and ROI timelines.", pages: 28, format: "Whitepaper", gradient: "from-amber-500 to-orange-600", downloadCount: "850+ downloads" },
];

const fallbackWebinars: Webinar[] = [
  { id: "series-a-tech", title: "Scaling from Seed to Series A: Tech Stack Decisions That Matter", date: "June 15, 2026", time: "3:00 PM BST / 7:00 PM PKT", speaker: "Zain Paracha & Adam Kitts", speakerRole: "Co-Founders & Technical Directors", status: "Upcoming", gradient: "from-violet-500 to-fuchsia-600" },
  { id: "headless-shopify-deep", title: "Under The Hood: Building a Headless Shopify Store in 90 Days", date: "Recorded", time: "On-Demand (1 hr 12 mins)", speaker: "Web Development Lead", speakerRole: "Senior Full-Stack Engineer", status: "On-Demand", gradient: "from-cyan-500 to-blue-600" },
];

// ─── Main Component ──────────────────────────────────────────────────────────

function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourceType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [gatedGuide, setGatedGuide] = useState<Guide | null>(null);
  const [registeredWebinar, setRegisteredWebinar] = useState<Webinar | null>(null);

  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setResourcesLoading(true);
    try {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (data && data.length > 0) {
        const blogData: Article[] = [];
        const guideData: Guide[] = [];
        const webinarData: Webinar[] = [];

        data.forEach((r: any) => {
          if (r.resource_type === "blog") {
            blogData.push({
              id: r.slug || r.id,
              title: r.title,
              excerpt: r.description,
              content: r.content || "",
              category: r.category || "General",
              author: r.author || "ClickTake Team",
              readTime: r.read_time || "5 min read",
              date: r.publish_date ? new Date(r.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "",
              tags: r.tags || [],
              gradient: r.gradient || "from-cyan-500/20 via-blue-600/5 to-slate-900",
            });
          } else if (r.resource_type === "guide") {
            guideData.push({
              id: r.slug || r.id,
              title: r.title,
              description: r.description,
              pages: r.pages || 0,
              format: r.format || "PDF",
              gradient: r.gradient || "from-pink-500 to-rose-600",
              downloadCount: r.download_count ? `${r.download_count}+ downloads` : "Download",
            });
          } else if (r.resource_type === "webinar") {
            webinarData.push({
              id: r.slug || r.id,
              title: r.title,
              date: r.event_date ? new Date(r.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "TBD",
              time: r.event_time || "TBD",
              speaker: r.speaker || "ClickTake Team",
              speakerRole: r.speaker_role || "",
              status: (r.webinar_status as "Upcoming" | "On-Demand") || "On-Demand",
              gradient: r.gradient || "from-violet-500 to-fuchsia-600",
            });
          }
        });

        setArticles(blogData);
        setGuides(guideData);
        setWebinars(webinarData);
      } else {
        setArticles(fallbackArticles);
        setGuides(fallbackGuides);
        setWebinars(fallbackWebinars);
      }
    } catch {
      setArticles(fallbackArticles);
      setGuides(fallbackGuides);
      setWebinars(fallbackWebinars);
    } finally {
      setResourcesLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadCompany) {
      setFormError("Please fill out all fields.");
      return;
    }
    setFormError("");
    try {
      await supabase.from("leads").insert({
        name: leadName,
        email: leadEmail,
        company: leadCompany,
        service_interest: gatedGuide ? `Resource: ${gatedGuide.title}` : `Webinar: ${registeredWebinar?.title}`,
        source: "Resource Download",
        source_page: "/resources",
        status: "New",
      });
    } catch (err) {
    }
    setFormSubmitted(true);
  };

  const resetLeadForm = () => {
    setLeadName("");
    setLeadEmail("");
    setLeadCompany("");
    setFormSubmitted(false);
    setFormError("");
    setGatedGuide(null);
    setRegisteredWebinar(null);
  };

  // Filter logic
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch && (activeTab === "All" || activeTab === "Blog");
  });

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (activeTab === "All" || activeTab === "Guide");
  });

  const filteredWebinars = webinars.filter(web => {
    const matchesSearch = web.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          web.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (activeTab === "All" || activeTab === "Webinar");
  });

  const hasAnyResources = filteredArticles.length > 0 || filteredGuides.length > 0 || filteredWebinars.length > 0;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead slug="/resources" title="Resources & Insights — ClickTake Technologies" description="Browse our collection of SEO-optimized articles, B2B SaaS growth guides, whitepapers, and upcoming webinars on AI and development." />
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/4 top-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[130px]" />
            <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs backdrop-blur-xl mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Resources & Insights
              </div>

              <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Knowledge to <span className="text-gradient">scale your business.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Stay updated with engineering insights, AI implementation patterns, search trends, 
                and free industry guides compiled by our global development teams.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEARCH AND FILTERS */}
        <section className="mx-auto max-w-7xl px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center gap-4 justify-between">
              
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
                {(["All", "Blog", "Guide", "Webinar"] as ResourceType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md"
                        : "border border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {tab === "Blog" ? "Articles" : tab === "Guide" ? "Guides & Papers" : tab === "Webinar" ? "Webinars" : "All Resources"}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-md min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources by topic..."
                  className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

            </div>
          </motion.div>
        </section>

        {/* RESOURCE DISPLAY GRID */}
        <section className="mx-auto max-w-7xl px-4">
          <AnimatePresence mode="wait">
            {hasAnyResources ? (
              <motion.div
                key="resource-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-16"
              >
                
                {/* 1. BLOG ARTICLES */}
                {filteredArticles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="h-5 w-5 text-cyan-400" />
                      <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground/80">SEO & Growth Articles</h2>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredArticles.map((art, idx) => (
                        <motion.div
                          key={art.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-cyan-400 font-semibold uppercase tracking-wider">
                                {art.category}
                              </span>
                              <div className="flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {art.readTime}
                              </div>
                            </div>
                            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-cyan-300 transition-colors leading-snug">
                              {art.title}
                            </h3>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {art.excerpt}
                            </p>
                          </div>

                          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3.5 w-3.5 text-primary" />
                              <span>{art.author}</span>
                              <span>•</span>
                              <span>{art.date}</span>
                            </div>
                            <button
                              onClick={() => setSelectedArticle(art)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-white transition-colors"
                            >
                              Read full <ArrowUpRight className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. GATED GUIDES & WHITEPAPERS */}
                {filteredGuides.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-5 w-5 text-violet-400" />
                      <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground/80">Playbooks & Whitepapers (Gated)</h2>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredGuides.map((guide, idx) => (
                        <motion.div
                          key={guide.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-7 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
                            
                            {/* Graphic Book Mockup */}
                            <div className={`h-36 w-28 shrink-0 rounded-lg bg-gradient-to-br ${guide.gradient} p-4 flex flex-col justify-between shadow-lg relative border border-white/15`}>
                              <div className="text-[9px] uppercase tracking-widest text-white/80 font-bold bg-black/20 rounded px-1.5 py-0.5 inline-block self-start">
                                {guide.format}
                              </div>
                              <div className="font-display font-extrabold text-xs text-white leading-tight">
                                {guide.title}
                              </div>
                              <div className="text-[8px] text-white/60 font-mono">
                                {guide.pages} pages
                              </div>
                              <div className="absolute bottom-0 right-0 p-1.5 opacity-40">
                                <FileText className="h-4 w-4 text-white" />
                              </div>
                            </div>

                            {/* Book Info */}
                            <div className="flex-1 flex flex-col justify-between h-full">
                              <div>
                                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-violet-300 transition-colors">
                                  {guide.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                  {guide.description}
                                </p>
                              </div>
                              <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
                                <span className="text-xs text-muted-foreground/60 font-mono bg-white/5 rounded-full px-3 py-1">
                                  {guide.downloadCount}
                                </span>
                                <button
                                  onClick={() => setGatedGuide(guide)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:scale-105 transition-transform"
                                >
                                  Download Book <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. WEBINARS & EVENTS */}
                {filteredWebinars.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Video className="h-5 w-5 text-amber-400" />
                      <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground/80">Webinars & Virtual Events</h2>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredWebinars.map((web, idx) => (
                        <motion.div
                          key={web.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-4 w-4 text-amber-400" />
                              <span>{web.date}</span>
                              <span>•</span>
                              <span className="font-mono">{web.time}</span>
                            </div>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                              web.status === "Upcoming"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                            }`}>
                              {web.status}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-amber-300 transition-colors">
                            {web.title}
                          </h3>

                          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <div className="text-xs font-semibold">{web.speaker}</div>
                              <div className="text-[10px] text-muted-foreground">{web.speakerRole}</div>
                            </div>

                            {web.status === "Upcoming" ? (
                              <button
                                onClick={() => setRegisteredWebinar(web)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/15 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
                              >
                                Reserve Seat <Calendar className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setRegisteredWebinar(web)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400 hover:text-black transition-colors"
                              >
                                Watch Replay <Video className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
              >
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-30 text-primary" />
                <p>No resources matched your search filter. Try adjusting tags or search keyword.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* NEWSLETTER CTA BANNER */}
        <section className="mt-24 mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-8 backdrop-blur-xl text-center"
            style={{ boxShadow: "0 0 60px -20px rgba(99,102,241,0.15)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-fuchsia-500/5" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Get monthly tech insights directly.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                We share system engineering templates, SEO ranking frameworks, and operational AI tool stacks in our monthly briefing. No spam, only technical content.
              </p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement)?.value;
                if (email) {
                  await supabase.from("leads").insert({
                    name: "Newsletter Subscriber",
                    email,
                    service_interest: "Newsletter",
                    source: "Newsletter",
                    source_page: "/resources",
                    status: "New",
                  });
                }
                alert("Thanks for subscribing!");
              }} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  required
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 rounded-full border border-white/10 bg-background/50 px-5 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform shrink-0"
                >
                  Join Briefing
                </button>
              </form>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ─── MODALS ─── */}

      {/* 1. BLOG ARTICLE MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-cyan-400 font-semibold uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {selectedArticle.author[0]}
                </div>
                <span>By {selectedArticle.author}</span>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {selectedArticle.content}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-secondary/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. GATED RESOURCE / WEBINAR REGISTRATION MODAL */}
      <AnimatePresence>
        {(gatedGuide || registeredWebinar) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetLeadForm}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-card p-6 backdrop-blur-xl shadow-2xl z-10"
            >
              <button
                onClick={resetLeadForm}
                className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!formSubmitted ? (
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg mb-4">
                    {gatedGuide ? <Download className="h-5 w-5 text-white" /> : <Calendar className="h-5 w-5 text-white" />}
                  </div>

                  <h3 className="font-display text-xl font-bold leading-tight">
                    {gatedGuide ? `Download: ${gatedGuide.title}` : `Register: ${registeredWebinar?.title}`}
                  </h3>
                  
                  <p className="mt-2 text-xs text-muted-foreground">
                    {gatedGuide 
                      ? "Complete this quick form to instantly unlock your whitepaper download. Gated content is used for lead routing."
                      : "Reserve your seat for the webinar. We'll send your calendar invitation and webinar link to your business email."
                    }
                  </p>

                  <form onSubmit={handleLeadSubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Zain Paracha"
                          className="w-full rounded-xl border border-white/10 bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Business Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          required
                          type="email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="zain@company.com"
                          className="w-full rounded-xl border border-white/10 bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          required
                          value={leadCompany}
                          onChange={(e) => setLeadCompany(e.target.value)}
                          placeholder="ClickTake Technologies"
                          className="w-full rounded-xl border border-white/10 bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    {formError && (
                      <div className="text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform"
                    >
                      {gatedGuide ? "Unlock PDF Book" : "Confirm Seat Registration"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 mb-4 text-green-400">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>

                  <h3 className="font-display text-xl font-bold leading-tight">
                    {gatedGuide ? "Access Granted!" : "Registration Confirmed!"}
                  </h3>
                  
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                    {gatedGuide
                      ? `Thank you, ${leadName}. Your copy of "${gatedGuide.title}" has been unlocked. Click the button below to view the simulated file.`
                      : `Check your inbox (${leadEmail}) for confirmation details. We have blocked your calendar slot.`
                    }
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    {gatedGuide ? (
                      <button
                        onClick={() => toast.success("Download link sent to your email inbox!")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
                      >
                        Download PDF File <Download className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          resetLeadForm();
                          toast.success("Calendar invite sent! Check your email.");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-sm font-semibold text-muted-foreground hover:text-white transition-colors"
                      >
                        Add to Google Calendar
                      </button>
                    )}

                    <button
                      onClick={resetLeadForm}
                      className="text-xs text-muted-foreground hover:text-white transition-colors mt-2"
                    >
                      Back to Resources
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
