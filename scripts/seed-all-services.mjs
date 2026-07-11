import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const serviceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL or Service Role Key missing in .env!');
  process.exit(1);
}

/* ── All 15 services matching static pages ── */
const ALL_SERVICES = [
  {
    slug: "ai/llm",
    category: "ai",
    category_label: "AI & Machine Learning",
    title: "Custom LLM Development",
    eyebrow: "AI & Machine Learning",
    description: "Fine-tuned models on your data",
    detailed_description: "Production-ready LLMs that understand your industry, terminology, and workflows — fine-tuned, grounded, and deployed for real business impact.",
    icon_name: "Brain",
    gradient: "from-brand-magenta to-brand-blue",
    glow: "color-mix(in oklab, var(--brand-magenta) 15%, transparent)",
    display_order: 1,
  },
  {
    slug: "ai/chatbots",
    category: "ai",
    category_label: "AI & Machine Learning",
    title: "AI Chatbots & Agents",
    eyebrow: "AI & Machine Learning",
    description: "Autonomous support & ops agents",
    detailed_description: "We build AI chatbots and autonomous agents that resolve support tickets, qualify leads, and run operations workflows — without human intervention, at any scale.",
    icon_name: "Bot",
    gradient: "from-violet-400 via-blue-400 to-indigo-500",
    glow: "rgba(139,92,246,0.15)",
    display_order: 2,
  },
  {
    slug: "ai/prompt-engineering",
    category: "ai",
    category_label: "AI & Machine Learning",
    title: "AI Prompt Engineering",
    eyebrow: "AI & Machine Learning",
    description: "Reliable prompt systems at scale",
    detailed_description: "Engineering-grade prompt systems: system prompts, few-shot strategies, chain-of-thought, eval frameworks, and prompt ops — built for consistency at scale.",
    icon_name: "Wand2",
    gradient: "from-purple-500 to-pink-500",
    glow: "color-mix(in oklab, var(--brand-pink) 15%, transparent)",
    display_order: 3,
  },
  {
    slug: "ai/cv-nlp",
    category: "ai",
    category_label: "AI & Machine Learning",
    title: "Computer Vision & NLP",
    eyebrow: "AI & Machine Learning",
    description: "Visual recognition & doc pipelines",
    detailed_description: "Production-scale CV and NLP pipelines — OCR, object detection, document intelligence, sentiment analysis, and multilingual text processing.",
    icon_name: "Eye",
    gradient: "from-indigo-500 to-purple-600",
    glow: "color-mix(in oklab, var(--brand-magenta) 15%, transparent)",
    display_order: 4,
  },
  {
    slug: "web/python-backend",
    category: "web",
    category_label: "Web Development",
    title: "Python Backend Development",
    eyebrow: "Web Development",
    description: "FastAPI, Django & async Python",
    detailed_description: "High-performance Python backends — FastAPI, Django, async workers, and cloud-native infrastructure. Test-first, security-hardened, and built to scale.",
    icon_name: "Server",
    gradient: "from-brand-cyan to-brand-blue",
    glow: "color-mix(in oklab, var(--brand-cyan) 15%, transparent)",
    display_order: 5,
  },
  {
    slug: "web/full-stack",
    category: "web",
    category_label: "Web Development",
    title: "Full-Stack Applications",
    eyebrow: "Web Development",
    description: "React + Node/Python, end-to-end",
    detailed_description: "Production-grade full-stack applications on modern stacks — React, Node, FastAPI, PostgreSQL. Performant, secure, and designed to scale from day one.",
    icon_name: "Layers",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glow: "rgba(6,182,212,0.15)",
    display_order: 6,
  },
  {
    slug: "web/auth",
    category: "web",
    category_label: "Web Development",
    title: "Authentication Systems",
    eyebrow: "Web Development",
    description: "SSO, MFA, role-based access",
    detailed_description: "Enterprise-grade auth: SAML/OIDC SSO, passkeys/WebAuthn, RBAC/ABAC, and compliance-ready identity infrastructure. SOC 2 ready out of the box.",
    icon_name: "Shield",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.15)",
    display_order: 7,
  },
  {
    slug: "web/saas",
    category: "web",
    category_label: "Web Development",
    title: "SaaS Platform Development",
    eyebrow: "Web Development",
    description: "Multi-tenant, subscription-ready",
    detailed_description: "From idea to paying customers. We build multi-tenant SaaS platforms with billing, onboarding, analytics, and growth infrastructure baked in.",
    icon_name: "Cloud",
    gradient: "from-sky-400 to-blue-600",
    glow: "color-mix(in oklab, var(--brand-cyan) 15%, transparent)",
    display_order: 8,
  },
  {
    slug: "seo",
    category: "marketing",
    category_label: "Digital Marketing",
    title: "SEO Services",
    eyebrow: "Digital Marketing",
    description: "Technical, On-Page, Local",
    detailed_description: "Technical, On-Page, and Local SEO that moves your business to page 1 — and keeps it there. We turn organic search into your most cost-effective acquisition channel.",
    icon_name: "Search",
    gradient: "from-cyan-400 via-emerald-400 to-teal-500",
    glow: "rgba(6,182,212,0.15)",
    display_order: 9,
  },
  {
    slug: "digital-marketing/content-strategy",
    category: "marketing",
    category_label: "Digital Marketing",
    title: "Content Strategy & Copywriting",
    eyebrow: "Digital Marketing",
    description: "Content that converts",
    detailed_description: "Data-driven content that ranks, converts, and builds authority. Topic clusters, SEO copywriting, and conversion copy for every stage of the buyer journey.",
    icon_name: "PenTool",
    gradient: "from-emerald-400 to-teal-500",
    glow: "color-mix(in oklab, rgba(16,185,129,0.12), transparent)",
    display_order: 10,
  },
  {
    slug: "digital-marketing/paid-advertising",
    category: "marketing",
    category_label: "Digital Marketing",
    title: "Paid Advertising",
    eyebrow: "Digital Marketing",
    description: "Google, Meta, LinkedIn",
    detailed_description: "Full-funnel paid media across Google, Meta, and LinkedIn. Strategy, creative, execution, and optimisation — every pound of spend accountable and optimised.",
    icon_name: "Megaphone",
    gradient: "from-orange-500 to-red-500",
    glow: "color-mix(in oklab, rgba(249,115,22,0.12), transparent)",
    display_order: 11,
  },
  {
    slug: "digital-marketing/cro",
    category: "marketing",
    category_label: "Digital Marketing",
    title: "Conversion Rate Optimisation",
    eyebrow: "Digital Marketing",
    description: "Turn traffic into revenue",
    detailed_description: "Data-led CRO — heatmaps, session recordings, A/B testing, and funnel analysis. We turn your existing traffic into more leads, trials, and revenue.",
    icon_name: "TrendingUp",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.12)",
    display_order: 12,
  },
  {
    slug: "creative/graphic-design",
    category: "creative",
    category_label: "Creative Services",
    title: "Graphic Design",
    eyebrow: "Creative Services",
    description: "Branding, UI/UX, Marketing",
    detailed_description: "Visual identities, product UI, and marketing assets that make your brand impossible to ignore. Figma-native delivery with unlimited revision cycles.",
    icon_name: "Palette",
    gradient: "from-brand-pink to-orange-500",
    glow: "color-mix(in oklab, var(--brand-pink) 15%, transparent)",
    display_order: 13,
  },
  {
    slug: "creative/video-production",
    category: "creative",
    category_label: "Creative Services",
    title: "Video Production",
    eyebrow: "Creative Services",
    description: "Explainer, Social, Corporate",
    detailed_description: "Story-led video production — explainers, social content, and corporate films. From script to final cut, we produce video that drives results.",
    icon_name: "Video",
    gradient: "from-rose-500 to-pink-600",
    glow: "color-mix(in oklab, var(--brand-pink) 15%, transparent)",
    display_order: 14,
  },
  {
    slug: "starter-kit",
    category: "starter-kit",
    category_label: "Flagship Solution",
    title: "Business Development Starter Kit",
    eyebrow: "Flagship Solution",
    description: "Strategy, Branding, MVP Build, and Go-to-Market — from zero to revenue in one package.",
    detailed_description: "Our flagship end-to-end launch package: Strategy, Branding, MVP Build, and Go-to-Market — from zero to revenue in 90 days.",
    icon_name: "Rocket",
    gradient: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.15)",
    display_order: 15,
  },
];

async function runQuery(endpoint, method, body = null) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request to ${endpoint} failed: ${response.status}\n${text}`);
  }
  return response.status === 204 ? null : await response.json();
}

async function seed() {
  console.log('Seeding all 15 services...\n');

  for (const s of ALL_SERVICES) {
    try {
      const res = await runQuery(`services?slug=eq.${s.slug}`, 'GET');
      let serviceId;

      if (res && res.length > 0) {
        console.log(`  Updating: ${s.slug}`);
        await runQuery(`services?id=eq.${res[0].id}`, 'PATCH', s);
        serviceId = res[0].id;
      } else {
        console.log(`  Creating: ${s.slug}`);
        const insertRes = await runQuery('services', 'POST', [s]);
        const created = await runQuery(`services?slug=eq.${s.slug}`, 'GET');
        serviceId = created[0].id;
      }

      console.log(`    ✓ ${s.title} (${serviceId.slice(0, 8)}…)`);
    } catch (e) {
      console.error(`  ✗ ${s.slug}: ${e.message}`);
    }
  }

  console.log('\nAll services seeded successfully!');
}

seed().catch(e => { console.error(e); process.exit(1); });
