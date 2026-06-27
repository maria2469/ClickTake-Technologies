import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Award, Zap, Globe, Clock, Mail, ChevronRight, CheckCircle2,
  X, Briefcase, FileText, Send, Star, ArrowUpRight, ShieldCheck, Heart, User, Compass
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan, our core values, and open careers.",
      },
    ],
  }),
  component: AboutPage,
});

// ─── Data Types ─────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  gradient: string;
  avatarInitials: string;
}

interface OpenPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const team: TeamMember[] = [
  {
    name: "Zain Paracha",
    role: "Co-Founder & Technical Lead",
    bio: "Full-stack solutions architect specializing in headless commerce, Next.js storefronts, and cloud database optimization. Over 8 years of engineering experience.",
    skills: ["Headless E-Com", "Shopify API", "React/Node", "System Architecture"],
    gradient: "from-cyan-500 to-blue-600",
    avatarInitials: "ZP",
  },
  {
    name: "Adam Kitts",
    role: "Co-Founder & Director of Operations",
    bio: "Orchestrates delivery pipelines across UK and Pakistan offices. Expert in AI chatbot workflows, LLM fine-tuning, and operational process design.",
    skills: ["LLM Workflows", "n8n Automation", "Client Relations", "Agile Sprints"],
    gradient: "from-violet-500 to-indigo-600",
    avatarInitials: "AK",
  },
  {
    name: "Maria Qasim",
    role: "Lead UI/UX Designer",
    bio: "Crafts premium, motion-rich user experiences and cohesive brand identities. Passionate about interactive transitions and clean, accessibility-focused design.",
    skills: ["UI/UX Prototyping", "Framer Motion", "Figma", "Brand Guidelines"],
    gradient: "from-fuchsia-500 to-pink-600",
    avatarInitials: "MQ",
  },
  {
    name: "Hamza Farooq",
    role: "Head of SEO & Growth Marketing",
    bio: "Specializes in multi-location technical SEO audits, advanced keyword clustering, and high-ROI conversion rate optimization (CRO).",
    skills: ["Technical SEO", "Google Ads", "HubSpot CRM", "Conversion Funnels"],
    gradient: "from-emerald-500 to-teal-600",
    avatarInitials: "HF",
  },
];

const values = [
  {
    icon: Zap,
    title: "Speed & Execution",
    desc: "We focus on fast feedback loops, structured milestone-driven sprints, and rapid shipping.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Award,
    title: "KPI & ROI Alignment",
    desc: "Every line of code and marketing spend is optimized for customer acquisition and revenue growth.",
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    icon: Globe,
    title: "Global Collaboration",
    desc: "Dual-continent operations in UK and Pakistan bring together diverse regional perspectives & round-the-clock speed.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Heart,
    title: "Customer Trust",
    desc: "Direct communication with assigned technical leads, transparency, and building long-term business partnerships.",
    color: "from-amber-400 to-orange-500",
  },
];

const fallbackJobs: OpenPosition[] = [
  { id: "fullstack-eng", title: "Senior Full-Stack Engineer", department: "Engineering", location: "Multan Office / Hybrid", type: "Full-Time", description: "Lead headless Shopify and complex Next.js/React web app builds. Design custom API integrations and real-time database schemas.", requirements: ["4+ years of React, Next.js, Node.js and Tailwind CSS experience", "Deep understanding of Shopify Storefront API and serverless architectures", "Strong communication and project scoping capability"] },
  { id: "seo-strategist", title: "SEO & Growth Strategist", department: "Marketing", location: "Birmingham Office / Hybrid", type: "Full-Time", description: "Conduct technical SEO audits, manage content mapping systems, and run high-budget paid social/search ad funnels for global clients.", requirements: ["3+ years managing organic SEO and Google Business listings", "Familiarity with Google Analytics, Semrush, and conversion rate optimization (CRO) testing", "Experience executing local SEO campaigns in UK & international markets"] },
  { id: "ai-solutions-architect", title: "AI Solutions Architect", department: "Automation", location: "Remote (UK/PK Timezones)", type: "Contract / Full-Time", description: "Build custom LLM flows, deploy WhatsApp chatbots, and engineer API integrations with n8n, Make, or LangChain.", requirements: ["Proven projects fine-tuning LLMs, prompt engineering, and building retrieval-augmented generation (RAG)", "Strong background in API automation, Node.js or Python backend systems", "Ability to design systems with strong data security compliance"] },
];

// ─── Main Component ──────────────────────────────────────────────────────────

function AboutPage() {
  const [selectedJob, setSelectedJob] = useState<OpenPosition | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(team);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  
  // Job Application Form State
  const [appStep, setAppStep] = useState(1);
  const [appName, setAppName] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [appGithub, setAppGithub] = useState("");
  const [appCover, setAppCover] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appError, setAppError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const { data: teamData, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;

        if (teamData && teamData.length > 0) {
          const mapped = teamData.map((member: any, idx: number) => {
            let initials = "";
            if (member.full_name) {
              initials = member.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
            }
            const gradients = ["from-cyan-500 to-blue-600", "from-violet-500 to-indigo-600", "from-fuchsia-500 to-pink-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600"];
            return {
              name: member.full_name || "",
              role: member.role_title || "",
              bio: member.bio || "",
              skills: member.skills || ["Custom Solutions", "Consultation", "Strategy", "Client Success"],
              gradient: gradients[idx % gradients.length],
              avatarInitials: initials || "CT",
            };
          });
          setTeamMembers(mapped);
        }
      } catch (err) {
        console.error("Error loading team members:", err);
      }

      try {
        const { data: jobData } = await supabase.from("job_openings").select("*").eq("is_active", true).order("display_order", { ascending: true });
        if (jobData && jobData.length > 0) {
          setOpenPositions(jobData.map((j: any) => ({
            id: j.id,
            title: j.title,
            department: j.department,
            location: j.location,
            type: j.type,
            description: j.description,
            requirements: j.requirements || [],
          })));
        } else {
          setOpenPositions(fallbackJobs);
        }
      } catch {
        setOpenPositions(fallbackJobs);
      }
    }
    loadData();
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appStep < 2) {
      if (!appName || !appEmail) {
        setAppError("Please fill out your contact details.");
        return;
      }
      setAppError("");
      setAppStep(2);
    } else {
      setSubmittingApp(true);
      setAppError("");
      try {
        if (!selectedJob) return;
        const { error } = await supabase.from("leads").insert({
          name: appName,
          email: appEmail,
          phone: "",
          service_interest: `Job Application: ${selectedJob.title}`,
          message: `GitHub/Portfolio: ${appGithub || "None"}\n\nCover Letter:\n${appCover}`,
          status: "New",
          source_page: "/about#careers",
          source: "Careers Portal"
        });

        if (error) throw error;
        setAppSuccess(true);
      } catch (err: any) {
        console.error("Error submitting job application:", err);
        setAppError(err.message || "Failed to submit application. Please try again.");
      } finally {
        setSubmittingApp(false);
      }
    }
  };

  const closeAppModal = () => {
    setSelectedJob(null);
    setAppStep(1);
    setAppName("");
    setAppEmail("");
    setAppGithub("");
    setAppCover("");
    setAppSuccess(false);
    setAppError("");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead slug="/about" title="About Us — ClickTake Technologies" description="Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan, our core values, and open careers." />
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/4 top-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[130px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs backdrop-blur-xl mb-6">
                <Compass className="h-3.5 w-3.5 text-primary animate-spin" style={{ animationDuration: "12s" }} />
                About ClickTake Technologies
              </div>

              <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Connecting in a <span className="text-gradient">better way.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                We are a multi-national digital agency bridging premium design, enterprise development, 
                advanced SEO, and autonomous AI systems to deliver compounding growth.
              </p>
            </motion.div>
          </div>
        </section>

        {/* MISSION & STORY SPLIT */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Our Origin Story</div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight">
                Empowering businesses with custom software and SEO.
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  ClickTake Technologies was founded with a singular purpose: to remove the friction between high-end digital design and bulletproof technical execution.
                </p>
                <p>
                  With office locations in <strong className="text-foreground">Birmingham (UK)</strong> and <strong className="text-foreground">Multan (Pakistan)</strong>, our dual-continent footprint gives clients the advantage of rapid response times, diverse market insights, and around-the-clock delivery.
                </p>
                <p>
                  We don't build generic websites or run boilerplate SEO campaigns. We research your competitors, study user intent, and custom engineer systems that directly increase metrics that matter: conversion rates, traffic, and sales.
                </p>
              </div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${val.color} text-white shadow-md mb-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{val.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </motion.div>

          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1 text-xs backdrop-blur-xl mb-4">
              <Users className="h-3 w-3 text-cyan-400" />
              Meet the Leads
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Our Leadership Team</h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-lg mx-auto">
              Our technical architects and marketing specialists own your outcomes and work with you directly.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Visual Avatar Placeholder */}
                  <div className={`aspect-square w-full rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-5xl font-black text-white relative mb-5 shadow`}>
                    {member.avatarInitials}
                    <div className="absolute inset-0 bg-black/10 rounded-xl" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{member.name}</h3>
                  <div className="text-xs text-cyan-400 font-semibold mb-3">{member.role}</div>
                  <p className="text-xs leading-5 text-muted-foreground mb-5">{member.bio}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {member.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] font-mono text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CLIENTS & PARTNERS */}
        <section className="mx-auto max-w-7xl px-4 py-16 border-t border-white/5">
          <div className="text-center mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Our Operating Ecosystem</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">ClickTake works with leading cloud, commerce and automation technologies to deliver robust architectures.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {[
              "Shopify Plus", "Amazon Web Services", "OpenAI APIs",
              "HubSpot CRM", "Kafka Streams", "Next.js Framework",
              "Google Cloud", "n8n Automation", "React Native",
              "Webflow Enterprise", "Sass Analytics", "Tailwind CSS"
            ].map((partner, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-card/20 px-4 py-3.5 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/10 transition-colors">
                {partner}
              </div>
            ))}
          </div>
        </section>

        {/* CAREERS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1 text-xs backdrop-blur-xl mb-4">
              <Briefcase className="h-3 w-3 text-violet-400" />
              Careers at ClickTake
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Grow with Us</h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-lg mx-auto">
              We look for engineers, content leads, and automation designers to build the next generation of headless web solutions. Explore current openings.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {openPositions.length === 0 ? (
              <div className="lg:col-span-3 text-center py-12 text-muted-foreground text-sm">No open positions at this time. Check back later.</div>
            ) : openPositions.map((job) => (
              <div
                key={job.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    <span>{job.department}</span>
                    <span>{job.type}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold group-hover:text-violet-300 transition-colors mb-2">
                    {job.title}
                  </h3>
                  <div className="text-xs text-muted-foreground/80 mb-4">{job.location}</div>
                  <p className="text-xs leading-5 text-muted-foreground mb-6">{job.description}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {job.requirements.length} core requirements
                  </span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:scale-105 transition-transform"
                  >
                    Apply Now <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ─── CAREERS PORTAL APPLICATION MODAL ─── */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAppModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeAppModal}
                className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!appSuccess ? (
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow mb-4">
                    <Briefcase className="h-5 w-5" />
                  </div>

                  <h3 className="font-display text-xl font-bold leading-tight">
                    Apply for: {selectedJob.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedJob.location} • {selectedJob.type}
                  </p>

                  {/* Multi-step progress bar */}
                  <div className="mt-5 flex items-center gap-2 mb-6">
                    <div className={`h-1.5 flex-1 rounded-full ${appStep >= 1 ? "bg-gradient-to-r from-cyan-500 to-violet-600" : "bg-white/10"}`} />
                    <div className={`h-1.5 flex-1 rounded-full ${appStep >= 2 ? "bg-gradient-to-r from-violet-500 to-fuchsia-600" : "bg-white/10"}`} />
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    {appStep === 1 ? (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Step 1: Contact Details</div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Full Name</label>
                          <input
                            required
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            placeholder="Zain Paracha"
                            className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Email Address</label>
                          <input
                            required
                            type="email"
                            value={appEmail}
                            onChange={(e) => setAppEmail(e.target.value)}
                            placeholder="zain@company.com"
                            className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">GitHub / Portfolio Link (Optional)</label>
                          <input
                            value={appGithub}
                            onChange={(e) => setAppGithub(e.target.value)}
                            placeholder="https://github.com/username"
                            className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Step 2: Experience & Motivation</div>
                        
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2">Core Requirements:</div>
                          <ul className="space-y-1">
                            {selectedJob.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Cover Letter / Why ClickTake?</label>
                          <textarea
                            required
                            rows={4}
                            value={appCover}
                            onChange={(e) => setAppCover(e.target.value)}
                            placeholder="Tell us about a technical challenge you resolved or why you are excited to join our global engineering team..."
                            className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {appError && (
                      <div className="text-xs text-rose-400 flex items-center gap-1.5">
                        <span>{appError}</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      {appStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setAppStep(1)}
                          className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3 text-xs font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform"
                      >
                        {appStep === 1 ? "Next Step" : submittingApp ? "Sending..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 mb-4 text-green-400">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>

                  <h3 className="font-display text-xl font-bold leading-tight">
                    Application Sent!
                  </h3>
                  
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                    Thank you, {appName}. Your application for the <strong className="text-foreground">{selectedJob.title}</strong> role has been successfully received by our engineering leads.
                  </p>
                  
                  <p className="mt-3 text-xs text-muted-foreground/60 max-w-xs mx-auto">
                    We will review your portfolio links and contact you at <span className="text-foreground">{appEmail}</span> within 3-5 business days.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={closeAppModal}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
                    >
                      Browse Open Roles
                    </button>
                    <button
                      onClick={closeAppModal}
                      className="text-xs text-muted-foreground hover:text-white transition-colors mt-2"
                    >
                      Back to About Us
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
