import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowUpRight, CheckCircle2, KeyRound, Fingerprint, Users,
    Lock, Shield, RefreshCcw, Globe, Zap, Clock, Award,
    BarChart3, ShieldCheck, ArrowLeft, Eye, Database, Layers,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundScene } from "@/components/BackgroundScene";

export const Route = createFileRoute("/services/web/auth")({
    head: () => ({
        meta: [
            { title: "Authentication Systems — ClickTake Technologies" },
            { name: "description", content: "Secure identity infrastructure — SSO, MFA, role-based access, and compliance-ready auth flows." },
        ],
    }),
    component: AuthPage,
});

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

const services = [
    {
        icon: KeyRound,
        title: "Single Sign-On (SSO)",
        color: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.15)",
        desc: "One login, every tool. SAML 2.0 and OIDC-based SSO so users authenticate once and move freely across your entire product suite without friction.",
        items: [
            "SAML 2.0 and OpenID Connect (OIDC) protocols",
            "Identity provider integrations — Okta, Azure AD, Google Workspace",
            "Subdomain and domain-based tenant routing",
            "Session federation across microservices and apps",
            "Just-in-time (JIT) user provisioning",
            "SCIM 2.0 automated user lifecycle management",
            "SP-initiated and IdP-initiated SSO flows",
        ],
    },
    {
        icon: Fingerprint,
        title: "Multi-Factor & Passwordless Auth",
        color: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.15)",
        desc: "Security that doesn't punish your users. From TOTP to passkeys — modern MFA that blocks attacks while keeping the login experience smooth.",
        items: [
            "TOTP authenticator apps (Google Auth, Authy, 1Password)",
            "Passkeys and WebAuthn — phishing-resistant hardware auth",
            "SMS and email OTP with rate limiting and abuse detection",
            "Push notifications via mobile authenticator apps",
            "Biometric auth for mobile (Face ID, Touch ID)",
            "Magic link passwordless email flows",
            "Risk-based adaptive MFA — step up only when needed",
        ],
    },
    {
        icon: Users,
        title: "RBAC & Permissions Infrastructure",
        color: "from-violet-500 to-indigo-600",
        glow: "rgba(139,92,246,0.15)",
        desc: "Granular access control that scales with your organisation. Custom roles, resource-level permissions, and audit trails built for compliance from day one.",
        items: [
            "Custom role hierarchies with inheritance and overrides",
            "Attribute-based access control (ABAC) for fine-grained rules",
            "Resource-level and field-level permission scoping",
            "Multi-tenant permission isolation with cross-tenant controls",
            "Policy-as-code with OPA (Open Policy Agent) support",
            "Real-time permission checks via middleware and API hooks",
            "Full audit log — who accessed what, when, from where",
        ],
    },
];

const results = [
    { metric: "99.99%", label: "Auth uptime SLA across all deployments" },
    { metric: "< 100ms", label: "Token verification response time" },
    { metric: "SOC 2", label: "Compliance-ready architecture out of the box" },
    { metric: "50+", label: "Identity provider integrations supported" },
];

const process = [
    { step: "01", title: "Identity Architecture Audit", desc: "We map every user type, permission boundary, and integration point in your system before a single line of auth code is written." },
    { step: "02", title: "Provider & Protocol Selection", desc: "We recommend the right stack — Auth.js, Clerk, Keycloak, or custom — based on your compliance requirements and team constraints." },
    { step: "03", title: "Implementation & Integration", desc: "SSO flows, MFA layers, RBAC policies, and token infrastructure built and integrated into your frontend and backend services." },
    { step: "04", title: "Security Review & Pen Testing", desc: "Dedicated security review covering token leakage, session fixation, CSRF, and privilege escalation attack vectors." },
    { step: "05", title: "Compliance Documentation", desc: "Auth flow diagrams, data processing records, and access control matrices generated for SOC 2, GDPR, and HIPAA auditors." },
    { step: "06", title: "Monitoring & Incident Response", desc: "Anomaly detection, failed auth alerting, and a documented incident response plan so you're never caught off guard." },
];

const differentiators = [
    { icon: ShieldCheck, title: "Security-first design", desc: "Every auth system is designed around threat models — not just the happy path. We think like attackers so you don't have to." },
    { icon: Award, title: "Compliance built in", desc: "GDPR, SOC 2, and HIPAA considerations are architected in from day one — not retrofitted after your first audit." },
    { icon: BarChart3, title: "Full observability", desc: "Every auth event logged, queryable, and alertable. Anomaly detection and suspicious login flagging included." },
    { icon: Clock, title: "Live in 3 weeks", desc: "Most auth implementations from requirements sign-off to production deployment in under three weeks." },
    { icon: Globe, title: "Any stack, any cloud", desc: "Framework-agnostic implementations for React, Next.js, Django, FastAPI, Laravel, or any other stack your team uses." },
    { icon: Zap, title: "Zero-downtime migration", desc: "Migrating from legacy auth? We handle token migration, session bridging, and cutover without locking out a single user." },
];

const techStack = [
    { icon: Database, label: "Auth.js / NextAuth" },
    { icon: Shield, label: "Clerk" },
    { icon: Lock, label: "Supabase Auth" },
    { icon: Globe, label: "Keycloak" },
    { icon: KeyRound, label: "Auth0" },
    { icon: Layers, label: "JWT / JWK" },
    { icon: Eye, label: "OAuth 2.0" },
    { icon: Fingerprint, label: "Passkeys / WebAuthn" },
];

function AuthPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
            <BackgroundScene />
            <CustomCursor />
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative pt-36 pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className="mb-5">
                            <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                                <ArrowLeft className="h-4 w-4" /> Back to Services
                            </Link>
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                                Web Development
                            </div>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] max-w-4xl">
                            Identity infrastructure{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                built to be trusted.
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} custom={1} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            We build authentication systems that protect your users and your business — SSO, MFA, role-based access, and compliance-ready auth flows, delivered production-ready.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-lg hover:scale-105 transition-transform">
                                Secure your platform <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 font-semibold backdrop-blur hover:bg-secondary transition-colors">
                                See what's included
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                <div className="pointer-events-none absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            </section>

            {/* ── RESULTS BAR ── */}
            <section className="relative z-10 border-y border-border/50">
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {results.map((r, i) => (
                        <motion.div key={r.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{r.metric}</div>
                            <div className="mt-2 text-sm text-muted-foreground leading-snug">{r.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── PROBLEM / SOLUTION ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">The Reality</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Auth is the most critical system no one thinks about until it breaks.</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>81% of data breaches involve stolen or weak credentials. Yet most teams treat authentication as a checkbox — bolt on a library, skip the threat model, ship it.</p>
                            <p>The result: session vulnerabilities, privilege escalation bugs, and compliance failures discovered by auditors — or attackers — not by you.</p>
                            <p>We treat auth as the security boundary it actually is. Architecture first, then implementation, then a security review before anything touches production.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-8 backdrop-blur">
                        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Our Approach</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Threat model first. Implementation second.</h2>
                        <div className="space-y-3">
                            {[
                                "Architecture review before any code — threat model included",
                                "Zero-trust principles: verify every request, trust nothing implicitly",
                                "Compliance-ready from day one — GDPR, SOC 2, HIPAA aligned",
                                "Security review and pen testing before production handover",
                                "Zero-downtime migration from any legacy auth system",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SERVICE CARDS ── */}
            <section id="services" className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">What We Build</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Three pillars. One airtight identity layer.</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">SSO, MFA, and RBAC — each implemented to enterprise standards, integrated cleanly into your existing stack.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                    className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-7 hover:border-white/20 transition-all duration-300"
                                    whileHover={{ boxShadow: `0 0 60px 0 ${s.glow}` }}>
                                    <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${s.color} mb-6`} />
                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-4 shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                                    <ul className="space-y-2">
                                        {s.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />{item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TECH STACK ── */}
            <section className="relative z-10 py-20 px-4 border-y border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Every Project Includes</div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">The right tool for the job. Every time.</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {techStack.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur p-5 text-center hover:border-emerald-500/30 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-medium leading-snug">{d.label}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── PROCESS ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">How It Works</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Audit to production in three weeks.</h2>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {process.map((p, i) => (
                            <motion.div key={p.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur p-7 hover:border-white/20 transition-colors group">
                                <div className="text-5xl font-black text-transparent bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 bg-clip-text mb-4 select-none group-hover:from-emerald-500/60 group-hover:to-cyan-500/60 transition-all">{p.step}</div>
                                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DIFFERENTIATORS ── */}
            <section className="relative z-10 py-24 px-4 border-t border-border/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Why ClickTake</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">We build auth that passes audits and blocks attacks.</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {differentiators.map((d, i) => {
                            const Icon = d.icon;
                            return (
                                <motion.div key={d.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                    className="flex gap-4 rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-emerald-500/30 transition-colors group">
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-border flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                                        <Icon className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">{d.title}</div>
                                        <div className="text-sm text-muted-foreground leading-relaxed">{d.desc}</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Ready to lock it down?</div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                            Your auth layer is either a<br />
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">moat or an open door.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Book a free 30-minute auth architecture call. We'll review your current setup, identify the highest-risk gaps, and give you a clear remediation plan.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition-transform text-base">
                                Book a free architecture call <ArrowUpRight className="h-5 w-5" />
                            </a>
                            <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 font-semibold backdrop-blur hover:bg-secondary transition-colors text-base">
                                Explore all services
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}