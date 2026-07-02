import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read environment variables
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
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

console.log(`Configured for URL: ${supabaseUrl}`);

// 2. Default Seed Data
const DEFAULT_SERVICES = [
  {
    slug: "seo",
    category: "marketing",
    category_label: "Digital Marketing",
    title: "Get found by people ready to buy.",
    eyebrow: "Digital Marketing",
    description: "Technical, On-Page, and Local SEO that gets your business found by the right people at the right time.",
    detailed_description: "Technical, On-Page, and Local SEO that moves your business to page 1 — and keeps it there. We turn organic search into your most cost-effective acquisition channel.",
    icon_name: "Search",
    gradient: "from-cyan-400 via-emerald-400 to-teal-500",
    glow: "rgba(6,182,212,0.15)",
    results: [
      { "metric": "4.1×", "label": "Average organic traffic increase in 12 months" },
      { "metric": "73%", "label": "Clients reach page 1 within 6 months" },
      { "metric": "£0", "label": "Extra ad spend needed — pure organic growth" },
      { "metric": "200+", "label": "Businesses ranked on page 1" }
    ],
    differentiators: [
      { "title": "White-hat only", "icon_name": "ShieldCheck", "desc": "Zero shortcuts, zero penalties. Every technique we use is built to last through algorithm updates." },
      { "title": "Revenue-focused tracking", "icon_name": "BarChart3", "desc": "We track rankings, traffic, and revenue — not just impressions. You always know the business impact." },
      { "title": "Faster results", "icon_name": "Clock", "desc": "Our technical-first approach unlocks ranking potential faster than content-first agencies typically achieve." },
      { "title": "Dedicated SEO lead", "icon_name": "Award", "desc": "One experienced strategist owns your account — no account manager relay or offshore execution." }
    ],
    deliverables: [
      { "icon_name": "FileSearch", "label": "Technical SEO Audit" },
      { "icon_name": "Search", "label": "Keyword Research Deck" },
      { "icon_name": "BarChart3", "label": "Competitor Gap Analysis" },
      { "icon_name": "Code2", "label": "Schema Markup Implementation" }
    ],
    items: [
      {
        "title": "Technical SEO",
        "icon_name": "Code2",
        "desc": "The foundation everything else is built on. If search engines can't crawl and index your site properly, nothing else matters.",
        "features": [
          "Full technical site audit (200+ checkpoints)",
          "Core Web Vitals optimisation (LCP, CLS, FID)",
          "Schema markup & structured data implementation",
          "XML sitemap and robots.txt configuration",
          "Crawl budget management & log file analysis"
        ]
      },
      {
        "title": "On-Page SEO",
        "icon_name": "Search",
        "desc": "Content and structure that tells Google exactly what you are, who you serve, and why you deserve to rank.",
        "features": [
          "Comprehensive keyword research & mapping",
          "Title tags, meta descriptions & heading optimisation",
          "Content gap analysis vs top-ranking competitors",
          "Internal linking architecture & anchor text strategy"
        ]
      }
    ],
    display_order: 1,
    processes: [
      { "step_number": 1, "title": "SEO Audit", "description": "We crawl your entire site, analyse your backlink profile, review your content, and benchmark against your top competitors." },
      { "step_number": 2, "title": "Keyword Strategy", "description": "We map every high-intent keyword your audience uses to the right pages — building a targeting architecture that wins at scale." },
      { "step_number": 3, "title": "Technical Fixes", "description": "Prioritised technical issues are resolved first — the structural work that unlocks everything else." },
      { "step_number": 4, "title": "On-Page Optimisation", "description": "Every target page is optimised for its primary keyword cluster — content, structure, internal links, and schema." }
    ],
    packages: [
      { "package_level": "Basic", "price": "£999", "delivery_days": "14 days", "description": "Core technical and structural optimization to set your SEO foundations.", "features": ["Full technical site audit", "Schema markup implementation", "Sitemap & robots.txt configs", "Core Web Vitals suggestions"] },
      { "package_level": "Standard", "price": "£2,499", "delivery_days": "30 days", "description": "Ongoing ranking support with keyword mapping and content optimizations.", "features": ["Everything in Basic", "Comprehensive keyword mapping", "Title, meta description updates", "Internal link restructuring", "Monthly rank tracking reports"] },
      { "package_level": "Premium", "price": "£4,999", "delivery_days": "45 days", "description": "Enterprise-level organic SEO campaign driving maximum customer pipeline.", "features": ["Everything in Standard", "Topical authority content plan", "Backlink acquisition strategy", "Local SEO setup (NAP directories)", "Dedicated lead strategist support"] }
    ]
  },
  {
    slug: "ai/chatbots",
    category: "ai",
    category_label: "AI & Machine Learning",
    title: "AI agents that work while your team sleeps.",
    eyebrow: "AI & Machine Learning",
    description: "Autonomous AI agents that handle support, sales, and operations around the clock — without human intervention.",
    detailed_description: "We build AI chatbots and autonomous agents that resolve support tickets, qualify leads, and run operations workflows — without human intervention, at any scale.",
    icon_name: "Bot",
    gradient: "from-violet-400 via-blue-400 to-indigo-500",
    glow: "rgba(139,92,246,0.15)",
    results: [
      { "metric": "70–80%", "label": "Support ticket deflection rate" },
      { "metric": "< 2s", "label": "Average first response time" },
      { "metric": "24/7", "label": "Availability with zero marginal cost" },
      { "metric": "3×", "label": "Lead qualification throughput vs. human team" }
    ],
    differentiators: [
      { "title": "Outcome-scoped builds", "icon_name": "Award", "desc": "We scope every project against a deflection rate or conversion target — not lines of code or number of intents." },
      { "title": "Guardrails built in", "icon_name": "Shield", "desc": "Hallucination prevention, topic boundaries, and PII handling are engineered into the agent — not added as an afterthought." },
      { "title": "Full analytics suite", "icon_name": "BarChart3", "desc": "Every conversation logged, scored, and surfaced in a dashboard. You always know exactly how your agent is performing." }
    ],
    deliverables: [
      { "icon_name": "MessageSquare", "label": "Web Chat Interface" },
      { "icon_name": "Globe", "label": "WhatsApp Connection" },
      { "icon_name": "Bot", "label": "Slack / Teams Integration" }
    ],
    items: [
      {
        "title": "Customer Support Agents",
        "icon_name": "Headphones",
        "desc": "Resolve 70–80% of support tickets without a human — instantly, at any hour, in any language.",
        "features": [
          "Natural language understanding across all ticket types",
          "Deep integration with Zendesk, Intercom, Freshdesk",
          "Knowledge base grounding with citation and accuracy controls"
        ]
      },
      {
        "title": "Sales & Lead Agents",
        "icon_name": "ShoppingCart",
        "desc": "Qualify leads, book meetings, and answer product questions 24/7. Your best salesperson — available at 3am.",
        "features": [
          "Prospect qualification with custom scoring logic",
          "Product recommendation based on buyer intent signals",
          "Calendar booking with CRM sync (HubSpot, Salesforce)"
        ]
      }
    ],
    display_order: 2,
    processes: [
      { "step_number": 1, "title": "Workflow Mapping", "description": "We document every conversation type, decision point, and integration your agent needs to handle. Nothing is left to assumptions." },
      { "step_number": 2, "title": "Knowledge Architecture", "description": "We structure your product docs, FAQs, policies, and CRM data into the knowledge layer the agent reasons from." },
      { "step_number": 3, "title": "Agent Build & Tuning", "description": "Conversation flows, tool integrations, escalation logic, and persona — all built and iteratively tested." }
    ],
    packages: [
      { "package_level": "Basic", "price": "£1,999", "delivery_days": "14 days", "description": "Single-channel custom chatbot trained on your documentation.", "features": ["Custom system instructions", "Knowledge base grounding", "Web chat interface widget", "1,000 queries per month limit"] },
      { "package_level": "Standard", "price": "£3,999", "delivery_days": "30 days", "description": "Multi-channel agent with CRM integration and calendar booking.", "features": ["Everything in Basic", "Calendly or HubSpot CRM sync", "Escalation routing trigger", "WhatsApp or Slack channel setup", "5,000 queries per month"] },
      { "package_level": "Premium", "price": "£7,999", "delivery_days": "45 days", "description": "Enterprise multi-agent autonomous workflow running tools.", "features": ["Everything in Standard", "Multi-agent orchestration", "Custom API tool integrations", "Shadow mode tuning (2 weeks)", "Dedicated support & maintenance"] }
    ]
  },
  {
    slug: "starter-kit",
    category: "starter-kit",
    category_label: "Flagship Solution",
    title: "Launch from zero to revenue.",
    eyebrow: "Flagship Solution",
    description: "Our flagship end-to-end launch package: Strategy, Branding, MVP Build, and Go-to-Market — from zero to revenue in 90 days.",
    detailed_description: "Our flagship end-to-end launch package: Strategy, Branding, MVP Build, and Go-to-Market — from zero to revenue in one package.",
    icon_name: "Rocket",
    gradient: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.15)",
    results: [
      { "metric": "4", "label": "Phases from idea to revenue — nothing left out" },
      { "metric": "1", "label": "Team owns everything — no briefing gaps or misaligned vendors" },
      { "metric": "90 days", "label": "Typical time from kickoff to live and trading" },
      { "metric": "30-day", "label": "Post-launch support window included in every engagement" }
    ],
    differentiators: [
      { "title": "One team, zero briefing gaps", "icon_name": "Award", "desc": "Strategy informs design informs copy informs build. Each phase feeds the next — no misaligned deliverables from coordinating five separate agencies." },
      { "title": "Built for your audience", "icon_name": "Users", "desc": "Every deliverable is grounded in research about your specific market. We don't apply generic templates — we build for the people you're selling to." },
      { "title": "Moves at startup speed", "icon_name": "Rocket", "desc": "The entire engagement — strategy to live product — typically completes in 90 days. Faster than any multi-agency approach, without cutting corners." }
    ],
    deliverables: [
      { "icon_name": "Compass", "label": "Positioning Document" },
      { "icon_name": "Palette", "label": "Brand Guidelines" },
      { "icon_name": "Code2", "label": "Production Website" },
      { "icon_name": "Star", "label": "Logo System" }
    ],
    items: [
      {
        "title": "Phase 1 — Strategy & Positioning",
        "icon_name": "Compass",
        "desc": "Before a single design is made or line of code written, we do the strategic work that makes everything else land.",
        "features": [
          "Market research — competitive landscape, audience segments",
          "Positioning workshop — UVP definition",
          "Business model review — pricing strategy"
        ]
      },
      {
        "title": "Phase 2 — Brand & Identity",
        "icon_name": "Palette",
        "desc": "A brand that looks the part earns trust before a word is read. We build visual and verbal identities.",
        "features": [
          "Logo system — primary, secondary variants",
          "Visual identity — typography, color palette",
          "Brand guidelines document"
        ]
      }
    ],
    display_order: 3,
    processes: [
      { "step_number": 1, "title": "Kickoff & Discovery", "description": "A structured discovery session to deeply understand your business, market, audience, and competitive landscape. This session drives every decision that follows." },
      { "step_number": 2, "title": "Strategy & Brand Platform", "description": "Positioning, value proposition, and brand platform delivered first — so design and copy have a clear strategic foundation to build on." },
      { "step_number": 3, "title": "Brand & Identity Design", "description": "Visual identity developed in concept stages with clear rationale. Refined to a complete brand system with guidelines and all core assets." }
    ],
    packages: [
      { "package_level": "Standard", "price": "£12,499", "delivery_days": "90 days", "description": "Complete Strategy, Branding, MVP Website build, and Go-to-Market plan.", "features": ["Brand guidelines and logo system", "Premium responsive website", "Launch funnel & paid ad campaigns", "30-day post-launch support"] }
    ]
  },
  {
    slug: "web/full-stack",
    category: "web",
    category_label: "Web Development",
    title: "Production-grade React & Node web applications.",
    eyebrow: "Web Development",
    description: "React frontends with Node or Python backends — complete, tested, and handed over cleanly.",
    detailed_description: "We build scalable, performant, and secure full-stack web applications utilizing modern component libraries and cloud database backends.",
    icon_name: "Layers",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glow: "rgba(6,182,212,0.15)",
    results: [
      { "metric": "< 1.2s", "label": "Average initial page paint" },
      { "metric": "99.9%", "label": "Uptime guarantee on SLA hosting" },
      { "metric": "100%", "label": "Full code ownership and documentation" }
    ],
    differentiators: [
      { "title": "Scalable abstractions", "icon_name": "Layers", "desc": "Clean code architecture and component systems that don't need rewrites as your team grows." },
      { "title": "Security-first development", "icon_name": "Shield", "desc": "Penetration-ready backend engineering protecting client data and transactions." }
    ],
    deliverables: [
      { "icon_name": "Code2", "label": "React/Next.js Codebase" },
      { "icon_name": "Server", "label": "Node/FastAPI Backend API" }
    ],
    items: [
      {
        "title": "Frontend Engineering",
        "icon_name": "Globe",
        "desc": "Stunning, motion-rich user experiences built in React, Vite, or Next.js.",
        "features": [
          "Responsive viewport optimizations",
          "State management setups (Zustand, Redux)",
          "Tailwind CSS theme designs"
        ]
      }
    ],
    display_order: 4,
    processes: [
      { "step_number": 1, "title": "Scoping & Wireframes", "description": "Defining endpoints, user flows, and interface models before coding starts." }
    ],
    packages: [
      { "package_level": "Basic", "price": "£4,999", "delivery_days": "21 days", "description": "Single-page responsive React app with basic database connections.", "features": ["React/Vite single-page layout", "Supabase CRUD integration", "Custom forms and validation", "Vercel deploy setup"] },
      { "package_level": "Standard", "price": "£9,499", "delivery_days": "45 days", "description": "Multi-page dynamic web app with authentication and dashboard.", "features": ["Everything in Basic", "SSO & email login system", "Multi-tenant dashboard controls", "API endpoints gateway", "Stripe payment connection"] },
      { "package_level": "Premium", "price": "£18,999", "delivery_days": "60 days", "description": "Enterprise-ready full-scale web product built to handle massive scale.", "features": ["Everything in Standard", "Role-based access controls (RBAC)", "Third-party APIs integrations", "Automated E2E testing scripts", "Docker packaging configs"] }
    ]
  }
];

// Helper: Make fetch request
async function runQuery(endpoint, method, body = null) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request to ${endpoint} failed: ${response.status} ${response.statusText}\n${text}`);
  }

  return response.status === 204 ? null : await response.json();
}

async function seed() {
  console.log('Seeding services...');

  for (const s of DEFAULT_SERVICES) {
    const { processes, packages, ...serviceData } = s;

    try {
      // 1. Insert/Upsert service
      const res = await runQuery('services?slug=eq.' + serviceData.slug, 'GET');
      let serviceId;

      if (res && res.length > 0) {
        console.log(`Updating existing service: ${serviceData.slug}`);
        const updateRes = await runQuery(`services?id=eq.${res[0].id}`, 'PATCH', serviceData);
        serviceId = res[0].id;
      } else {
        console.log(`Inserting new service: ${serviceData.slug}`);
        const insertRes = await runQuery('services', 'POST', [serviceData]);
        // Get the inserted service ID
        const newlyCreated = await runQuery('services?slug=eq.' + serviceData.slug, 'GET');
        serviceId = newlyCreated[0].id;
      }

      // 2. Clear old processes and insert
      await runQuery(`service_processes?service_id=eq.${serviceId}`, 'DELETE');
      if (processes && processes.length > 0) {
        const processesWithId = processes.map(p => ({ ...p, service_id: serviceId }));
        await runQuery('service_processes', 'POST', processesWithId);
        console.log(`Seeded ${processes.length} process steps for ${s.slug}`);
      }

      // 3. Clear old packages and insert
      await runQuery(`pricing_packages?service_id=eq.${serviceId}`, 'DELETE');
      if (packages && packages.length > 0) {
        const packagesWithId = packages.map(p => ({ ...p, service_id: serviceId }));
        await runQuery('pricing_packages', 'POST', packagesWithId);
        console.log(`Seeded ${packages.length} pricing packages for ${s.slug}`);
      }

    } catch (e) {
      console.error(`Error seeding service ${s.slug}:`, e.message);
    }
  }

  console.log('Seed completed successfully!');
}

seed();
