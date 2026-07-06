import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";

import logo from "@/assets/clicktake-logo.png";
import { ThemeToggle } from "../components/ThemeToggle";
import { supabase } from "@/lib/supabaseClient";

/* ───────────────── SERVICES MEGA MENU DATA ───────────────── */

const servicesMenu = [
  {
    group: "AI & Machine Learning",
    accentColor: "text-brand-magenta",
    items: [
      { label: "Custom LLM Development", desc: "Fine-tuned models on your data", to: "/services/ai/llm" },
      { label: "AI Chatbots & Agents", desc: "Autonomous support & ops agents", to: "/services/ai/chatbots" },
      { label: "AI Prompt Engineering", desc: "Reliable prompt systems at scale", to: "/services/ai/prompt-engineering" },
      { label: "Computer Vision & NLP", desc: "Visual recognition & doc pipelines", to: "/services/ai/cv-nlp" },
    ],
  },
  {
    group: "Web Development",
    accentColor: "text-brand-cyan",
    items: [
      { label: "Python Backend Development", desc: "FastAPI, Django & async Python", to: "/services/web/python-backend" },
      { label: "Full-Stack Applications", desc: "React + Node/Python, end-to-end", to: "/services/web/full-stack" },
      { label: "Authentication Systems", desc: "SSO, MFA, role-based access", to: "/services/web/auth" },
      { label: "SaaS Platform Development", desc: "Multi-tenant, subscription-ready", to: "/services/web/saas" },
    ],
  },
  {
    group: "Digital Marketing",
    accentColor: "text-emerald-400",
    items: [
      { label: "SEO Services", desc: "Technical, On-Page, Local", to: "/services/seo" },
      { label: "Content Strategy & Copywriting", desc: "Content that converts", to: "/services/digital-marketing/content-strategy" },
      { label: "Paid Advertising", desc: "Google, Meta, LinkedIn", to: "/services/digital-marketing/paid-advertising" },
      { label: "Conversion Rate Optimisation", desc: "Turn traffic into revenue", to: "/services/digital-marketing/cro" },
    ],
  },
  {
    group: "Creative Services",
    accentColor: "text-brand-pink",
    items: [
      { label: "Graphic Design", desc: "Branding, UI/UX, Marketing", to: "/services/creative/graphic-design" },
      { label: "Video Production", desc: "Explainer, Social, Corporate", to: "/services/creative/video-production" },
    ],
  },
] as const;

/* ───────────────── NAV LINKS ───────────────── */

const links = [
  { label: "Home", href: "/", isPage: true },
  { label: "Services", to: "/services", isPage: true, mega: true },
  { label: "Work", to: "/portfolio", isPage: true },
  { label: "Resources", to: "/resources", isPage: true },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", to: "/about", isPage: true },
  { label: "Contact", to: "/contact", isPage: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#");
  const [megaOpen, setMegaOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(links);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchNav = async () => {
    const [{ data: pagesData }, { data: navLinksData }] = await Promise.all([
      supabase
        .from('pages')
        .select('title, slug, nav_order, is_archived')
        .eq('is_published', true)
        .eq('show_in_nav', true)
        .order('nav_order', { ascending: true }),
      supabase
        .from('cms_nav_links')
        .select('label, to_path')
    ]);

    let finalLinks: any[] = [];

    if (pagesData) {
      // Filter out archived
      const activePages = pagesData.filter(p => p.is_archived !== true);
      // Deduplicate by slug
      const uniquePages = Array.from(new Map(activePages.map(p => [p.slug, p])).values());
      finalLinks = uniquePages.map(p => {
        const path = (p.slug === 'home' || p.slug === '/') ? '/' : `/${p.slug.replace(/^\/+/, '')}`;
        // Preserve mega menu for Services
        const mega = path.toLowerCase() === '/services';
        return { label: p.title, to: path, isPage: true, mega };
      });
    }

    if (navLinksData) {
      navLinksData.forEach(d => {
        // Prevent adding if label or to_path matches an existing page
        if (!finalLinks.some(l => l.label.toLowerCase() === d.label.toLowerCase() || l.to === d.to_path)) {
          finalLinks.push({ label: d.label, to: d.to_path, isPage: true });
        }
      });
    }

    // Merge missing anchor links from hardcoded links (like #process, #testimonials)
    links.forEach(l => {
      if (l.href?.startsWith('#')) {
        if (!finalLinks.some(fl => fl.label.toLowerCase() === l.label.toLowerCase())) {
          finalLinks.push(l);
        }
      }
    });

    setNavLinks(finalLinks);
  };

  useEffect(() => {
    fetchNav();
    
    // Subscribe to realtime updates for both tables
    const channelPages = supabase
      .channel('navbar-pages-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, () => fetchNav())
      .subscribe();

    const channelNavLinks = supabase
      .channel('navbar-links-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_nav_links' }, () => fetchNav())
      .subscribe();

    return () => {
      supabase.removeChannel(channelPages);
      supabase.removeChannel(channelNavLinks);
    };
  }, []);

  const handleSectionClick = async (href: string) => {
    setOpen(false);
    setActive(href);
    if (location.pathname !== "/") {
      await navigate({ to: "/" });
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
    >
      <div className="mx-auto max-w-7xl px-4">
      <div className="flex items-center gap-4">

          {/* LOGO — outside pill, standalone */}
          <Link to="/" className="shrink-0 flex items-center">
            <img src={logo} className="h-24 w-auto object-contain drop-shadow-lg" alt="ClickTake Logo" />
          </Link>

          {/* NAV PILL — starts after logo */}
          <div
            className={`flex flex-1 items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${scrolled
                ? "bg-background/20 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                : "bg-background/10 backdrop-blur-md border border-white/10"
              }`}
          >
          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 backdrop-blur-xl whitespace-nowrap">
            {navLinks.map((l) => {
              if (l.isPage && l.to) {
                return (
                  <div
                    key={l.to}
                    className="relative"
                    onMouseEnter={() => l.mega && setMegaOpen(true)}
                    onMouseLeave={() => l.mega && setMegaOpen(false)}
                  >
                    <Link
                      to={l.to}
                      className="group relative rounded-full px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-white transition whitespace-nowrap flex items-center"
                    >
                      {l.label}
                      <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-brand-cyan to-brand-magenta transition-all group-hover:w-8" />
                      {l.mega && (
                        <ChevronDown className={`ml-1 inline h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                      )}
                    </Link>

                    {/* MEGA MENU — 4-column grid */}
                    <AnimatePresence>
                      {l.mega && megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                        >
                          <div className="w-[880px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-6">
                            <div className="grid grid-cols-4 gap-6">
                              {servicesMenu.map((group) => (
                                <div key={group.group}>
                                  <div className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${group.accentColor}`}>
                                    {group.group}
                                  </div>
                                  <div className="space-y-0.5">
                                    {group.items.map((item) => (
                                      <Link
                                        key={item.to}
                                        to={item.to}
                                        className="block rounded-lg px-3 py-2 hover:bg-secondary transition"
                                        onClick={() => setMegaOpen(false)}
                                      >
                                        <div className="text-sm font-semibold leading-snug">{item.label}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Flagship CTA */}
                            <Link
                              to="/services/starter-kit"
                              onClick={() => setMegaOpen(false)}
                              className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/15 to-brand-pink/15 border border-amber-500/30 p-4 hover:from-amber-500/25 hover:to-brand-pink/25 transition"
                            >
                              <div>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                  <Sparkles className="h-4 w-4 text-amber-400" />
                                  Business Development Starter Kit
                                  <span className="text-[10px] rounded-full bg-gradient-to-r from-amber-500 to-brand-pink px-2 py-0.5 text-white">
                                    FLAGSHIP
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  Strategy · Branding · MVP Build · Go-to-Market — live in 90 days
                                </div>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-amber-400 shrink-0" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={l.href}
                  onClick={() => handleSectionClick(l.href!)}
                  className={`px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap flex items-center ${active === l.href ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}
                >
                  {l.label}
                </button>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => handleSectionClick("#contact")}
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:scale-105 transition whitespace-nowrap"
            >
              Book a Call <ArrowUpRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/80 lg:hidden"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 rounded-2xl border border-border/40 bg-card/80 p-3 backdrop-blur-xl lg:hidden"
            >
              {/* Mobile: flat list with group labels */}
              <Link to="/" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-semibold text-sm">
                Home
              </Link>

              {servicesMenu.map((group) => (
                <div key={group.group} className="mt-2">
                  <div className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest ${group.accentColor}`}>
                    {group.group}
                  </div>
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="border-t border-border/30 mt-3 pt-3 space-y-1">
                {navLinks.filter((l) => !l.isPage).map((l) => (
                  <button
                    key={l.href}
                    onClick={() => handleSectionClick(l.href!)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm"
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleSectionClick("#contact")}
                className="mt-3 w-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta py-3 font-semibold text-white text-sm"
              >
                Book a Call
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}