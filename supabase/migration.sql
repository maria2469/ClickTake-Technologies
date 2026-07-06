-- ============================================================================
-- ClickTake Technologies — Full Supabase Schema Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- DROP OBSOLETE TABLES (removed from schema)
DROP TABLE IF EXISTS email_replies;
DROP TABLE IF EXISTS email_inbox;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS bookings;

-- ENUMS
DO $$ BEGIN CREATE TYPE resource_type AS ENUM ('blog', 'guide', 'webinar'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE webinar_status AS ENUM ('Upcoming', 'On-Demand'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE lead_source AS ENUM ('Contact Form', 'Careers Portal', 'Resource Download', 'Webinar Registration', 'Newsletter', 'Other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('Super Admin', 'Editor', 'Sales Support'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE user_status AS ENUM ('Active', 'Inactive'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE smtp_log_type AS ENUM ('handshake', 'dispatch', 'error', 'config'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- PAGES (CMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  blocks JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE pages ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE pages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- ============================================================================
-- LEADS (CRM)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  service_interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status lead_status DEFAULT 'New',
  source_page TEXT DEFAULT '',
  source lead_source DEFAULT 'Contact Form',
  notes TEXT DEFAULT '',
  internal_notes TEXT DEFAULT '',
  assigned_to TEXT DEFAULT '',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_interest TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Contact Form';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- ============================================================================
-- SITE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS value TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Seed default settings
INSERT INTO site_settings (key, value, category) VALUES
  ('theme_accent', 'magenta', 'appearance'),
  ('logo_url', '', 'appearance'),
  ('site_name', 'ClickTake Technologies', 'general'),
  ('site_description', 'AI-Powered Digital Agency', 'general'),
  ('contact_email', 'hello@clicktake.co', 'contact'),
  ('contact_phone', '', 'contact')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- CMS MEDIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  file_name TEXT DEFAULT '',
  file_size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT '',
  name TEXT DEFAULT '',
  type TEXT DEFAULT '',
  size TEXT DEFAULT '',
  cloudinary_public_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS alt TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS file_name TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS file_size INTEGER DEFAULT 0;
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS mime_type TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS name TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS size TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT DEFAULT '';
ALTER TABLE cms_media ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- PAGE VIEWS (Analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  referrer TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  ip_hash TEXT DEFAULT '',
  visited_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE page_views ADD COLUMN IF NOT EXISTS page TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT '';
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT '';
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS ip_hash TEXT DEFAULT '';
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS visited_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_visited ON page_views(visited_at);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS table_name TEXT DEFAULT '';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS record_id UUID;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action TEXT DEFAULT '';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS old_data JSONB;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_data JSONB;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS changed_by TEXT DEFAULT '';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  content TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  rating INTEGER DEFAULT 5,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Seed testimonials
INSERT INTO testimonials (name, role, company, content, rating, display_order) VALUES
  ('Sarah Chen', 'CTO', 'TechFlow Solutions', 'ClickTake completely rebuilt our SaaS front-end in Next.js. The team understood our architecture immediately and delivered ahead of schedule.', 5, 1),
  ('James Mitchell', 'Marketing Director', 'Beacon Retail Group', 'Our organic traffic doubled within 4 months of ClickTake executing their technical SEO framework. Highly recommend their multi-location approach.', 5, 2),
  ('Amara Khan', 'Founder', 'Lunar Startups', 'The custom AI chatbot they built for our customer support triage saved our team over 30 hours per week. Incredible ROI.', 5, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PORTFOLIO ITEMS (Portfolio / Work)
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  challenge TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  results TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  service_category TEXT DEFAULT '',
  technologies JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS challenge TEXT DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS solution TEXT DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS results TEXT DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS service_category TEXT DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS technologies JSONB DEFAULT '[]';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- TEAM MEMBERS (About Page)
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  skills JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role_title TEXT DEFAULT '';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Seed team members
INSERT INTO team_members (full_name, role_title, bio, skills, display_order) VALUES
  ('Zain Paracha', 'Co-Founder & Technical Lead', 'Full-stack solutions architect specializing in headless commerce, Next.js storefronts, and cloud database optimization. Over 8 years of engineering experience.', '["Headless E-Com", "Shopify API", "React/Node", "System Architecture"]', 1),
  ('Adam Kitts', 'Co-Founder & Director of Operations', 'Orchestrates delivery pipelines across UK and Pakistan offices. Expert in AI chatbot workflows, LLM fine-tuning, and operational process design.', '["LLM Workflows", "n8n Automation", "Client Relations", "Agile Sprints"]', 2),
  ('Maria Qasim', 'Lead UI/UX Designer', 'Crafts premium, motion-rich user experiences and cohesive brand identities. Passionate about interactive transitions and clean, accessibility-focused design.', '["UI/UX Prototyping", "Framer Motion", "Figma", "Brand Guidelines"]', 3),
  ('Hamza Farooq', 'Head of SEO & Growth Marketing', 'Specializes in multi-location technical SEO audits, advanced keyword clustering, and high-ROI conversion rate optimization (CRO).', '["Technical SEO", "Google Ads", "HubSpot CRM", "Conversion Funnels"]', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- JOB OPENINGS (Careers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT DEFAULT '',
  location TEXT DEFAULT '',
  type TEXT DEFAULT '',
  description TEXT DEFAULT '',
  requirements JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '';
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '';
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]';
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE job_openings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Seed job openings
INSERT INTO job_openings (title, department, location, type, description, requirements, display_order) VALUES
  (
    'Senior Full-Stack Engineer',
    'Engineering', 'Multan Office / Hybrid', 'Full-Time',
    'Lead headless Shopify and complex Next.js/React web app builds. Design custom API integrations and real-time database schemas.',
    '["4+ years of React, Next.js, Node.js and Tailwind CSS experience", "Deep understanding of Shopify Storefront API and serverless architectures", "Strong communication and project scoping capability"]',
    1
  ),
  (
    'SEO & Growth Strategist',
    'Marketing', 'Birmingham Office / Hybrid', 'Full-Time',
    'Conduct technical SEO audits, manage content mapping systems, and run high-budget paid social/search ad funnels for global clients.',
    '["3+ years managing organic SEO and Google Business listings", "Familiarity with Google Analytics, Semrush, and conversion rate optimization (CRO) testing", "Experience executing local SEO campaigns in UK & international markets"]',
    2
  ),
  (
    'AI Solutions Architect',
    'Automation', 'Remote (UK/PK Timezones)', 'Contract / Full-Time',
    'Build custom LLM flows, deploy WhatsApp chatbots, and engineer API integrations with n8n, Make, or LangChain.',
    '["Proven projects fine-tuning LLMs, prompt engineering, and building retrieval-augmented generation (RAG)", "Strong background in API automation, Node.js or Python backend systems", "Ability to design systems with strong data security compliance"]',
    3
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RESOURCES (Articles, Guides, Webinars)
-- ============================================================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type resource_type NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  author TEXT DEFAULT '',
  read_time TEXT DEFAULT '',
  publish_date DATE,
  tags JSONB DEFAULT '[]',
  category TEXT DEFAULT '',
  -- Guide-specific fields
  pages INTEGER DEFAULT 0,
  format TEXT DEFAULT '',
  download_count INTEGER DEFAULT 0,
  -- Webinar-specific fields
  event_date DATE,
  event_time TEXT DEFAULT '',
  speaker TEXT DEFAULT '',
  speaker_role TEXT DEFAULT '',
  webinar_status webinar_status DEFAULT 'On-Demand',
  -- Shared
  gradient TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE resources ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS publish_date DATE;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS webinar_status TEXT DEFAULT 'On-Demand';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS author TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS read_time TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS pages INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS format TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS speaker TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS speaker_role TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS event_time TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS gradient TEXT DEFAULT '';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(is_published);

-- Seed resources
INSERT INTO resources (resource_type, title, slug, description, content, author, read_time, publish_date, tags, category, pages, format, download_count, speaker, speaker_role, webinar_status, event_date, event_time, gradient, display_order) VALUES
  (
    'blog', 'Why Headless Shopify is the Future of Enterprise E-Commerce',
    'headless-shopify-future',
    'Discover how splitting your store front-end from Shopify back-end yields a 3× load speed improvement, higher mobile conversion rates, and total design freedom.',
    'Speed is no longer a luxury in e-commerce; it is a direct driver of conversion. Standard Shopify themes, while convenient, are bottlenecked by render-blocking scripts, heavy CSS files, and monolithic liquid templates. By decoupling your storefront using frameworks like Next.js and powering the back-end with Shopify API (headless architecture), you bypass these technical limitations entirely.\n\nIn this article, we break down:\n1. Core Web Vitals optimizations achieved through headless setups.\n2. The security benefits of running a static front-end.\n3. How localized content and custom multi-currency checkouts increase global average order value (AOV) by up to 28%.\n\nWhether you are scaling past £10M/year or planning a global re-platform, headless e-commerce is the technical standard for high-volume commerce in 2026.',
    'Zain Paracha', '6 min read', '2026-05-24',
    '["Headless Commerce", "Shopify API", "Next.js", "Web Performance"]',
    'E-Commerce',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'from-cyan-500/20 via-blue-600/5 to-slate-900', 1
  ),
  (
    'blog', 'Autonomous AI Agents: Transforming Customer Support and Operations',
    'ai-agents-transforming-support',
    'Beyond basic Q&A chatbots: learn how custom LLMs and active agents integrated into CRM systems are saving enterprise teams up to 40+ hours per week.',
    'The era of static, keyword-triggered FAQ widgets is over. Modern LLM-based autonomous agents are now capable of accessing APIs, updating database records, verifying user authentication, and orchestrating complex tasks on behalf of your team.\n\nKey takeaways from our implementation experiences:\n1. Structured system prompts combined with retrieval-augmented generation (RAG) yield a 99.4% accuracy rate on patient triage.\n2. n8n and LangChain backend integrations allow agents to schedule appointments directly into calendars, update HubSpot logs, and dispatch WhatsApp follow-ups autonomously.\n3. Admin overhead is cut by 60% within the first 60 days of deployment.\n\nDeploying these agents does not replace human operators; it elevates them to handle complex exceptions, while AI handles the recurring 80% of service flow.',
    'Adam Kitts', '8 min read', '2026-05-18',
    '["AI Agents", "LLMs", "RAG", "Automation", "FastAPI"]',
    'AI & ML Solutions',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'from-violet-500/20 via-indigo-600/5 to-slate-900', 2
  ),
  (
    'blog', 'The Multi-Location Technical SEO Framework for UK & Pakistan SMEs',
    'multi-location-seo-framework',
    'A step-by-step audit guide covering schema markup, NAP consistency, and local landing page speed to dominate regional map pack rankings.',
    'If you operate across multiple physical office locations (for instance, the UK and Pakistan), generic SEO strategies will not cut it. Search engines serve results tailored to hyper-local user coordinates. Without precise signals, your branches will cannibalize each other traffic or fail to show up in regional queries altogether.\n\nOur proven multi-location roadmap includes:\n1. JSON-LD LocalBusiness schema implementation customized for every individual office.\n2. Restructuring your site URL hierarchy (e.g., /locations/birmingham and /locations/multan) with localized page content.\n3. Managing third-party directories to ensure 100% NAP (Name, Address, Phone) consistency.\n\nExecuting these steps correctly guarantees high map-pack positioning and reduces regional Google Ads spend by up to 30%.',
    'SEO Team Leads', '5 min read', '2026-05-12',
    '["Technical SEO", "Local SEO", "Schema Markup", "NAP Consistency"]',
    'SEO & Growth',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'from-emerald-500/20 via-teal-600/5 to-slate-900', 3
  ),
  (
    'guide', 'The 2026 B2B SaaS Growth Playbook',
    'saas-growth-playbook',
    '42 pages of actionable strategies on funnel optimization, subscription models, product-led growth (PLG) setups, and scaling web infrastructure.',
    '', '', '', NULL, '[]', 'Growth',
    42, 'PDF Booklet', 1200, NULL, NULL, NULL, NULL, NULL,
    'from-pink-500 to-rose-600', 4
  ),
  (
    'guide', 'Enterprise AI Implementation Guide: Risk, Cost, & ROI',
    'enterprise-ai-guide',
    'A comprehensive handbook for C-level executives detailing cost frameworks of self-hosting vs fine-tuning OpenAI models, data security compliance, and ROI timelines.',
    '', '', '', NULL, '[]', 'AI & Automation',
    28, 'Whitepaper', 850, NULL, NULL, NULL, NULL, NULL,
    'from-amber-500 to-orange-600', 5
  ),
  (
    'webinar', 'Scaling from Seed to Series A: Tech Stack Decisions That Matter',
    'scaling-seed-series-a',
    'Learn about technology stack decisions that matter when scaling from seed to Series A funding.',
    '', '', '', NULL, '[]', 'Startups',
    NULL, NULL, NULL, 'Zain Paracha & Adam Kitts', 'Co-Founders & Technical Directors',
    'Upcoming', '2026-06-15', '3:00 PM BST / 7:00 PM PKT',
    'from-violet-500 to-fuchsia-600', 6
  ),
  (
    'webinar', 'Under The Hood: Building a Headless Shopify Store in 90 Days',
    'headless-shopify-90-days',
    'A technical deep-dive into building a complete headless Shopify storefront in 90 days, from architecture to deployment.',
    '', '', '', NULL, '[]', 'E-Commerce',
    NULL, NULL, NULL, 'Web Development Lead', 'Senior Full-Stack Engineer',
    'On-Demand', NULL, 'On-Demand (1 hr 12 mins)',
    'from-cyan-500 to-blue-600', 7
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- ADMIN NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE admin_notifications ADD COLUMN IF NOT EXISTS message TEXT DEFAULT '';
ALTER TABLE admin_notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'info';
ALTER TABLE admin_notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE admin_notifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- SEO PAGE META (admin.seo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_page_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS page_key TEXT;
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS meta_title TEXT DEFAULT '';
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT '';
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT '';
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS og_image TEXT DEFAULT '';
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS canonical TEXT DEFAULT '';
ALTER TABLE seo_page_meta ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO seo_page_meta (page_key, meta_title, meta_description) VALUES
  ('home', 'ClickTake Technologies — AI-Powered Digital Agency', 'ClickTake builds AI-powered websites, apps and custom automation systems.'),
  ('about', 'About Us — ClickTake Technologies', 'Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan.'),
  ('contact', 'Contact — ClickTake Technologies', 'Get in touch with ClickTake Technologies.'),
  ('portfolio', 'Portfolio — ClickTake Technologies', 'View our portfolio of projects.'),
  ('resources', 'Resources — ClickTake Technologies', 'Explore our blog and resources.'),
  ('services', 'Services — ClickTake Technologies', 'Explore our range of AI chatbots, Next.js web application buildouts, and Technical SEO.'),
  ('services_seo', 'SEO Services — ClickTake Technologies', 'Technical SEO services.'),
  ('services_starter_kit', 'Starter Kit — ClickTake Technologies', 'Quick-start your project.'),
  ('services_ai_chatbots', 'AI Chatbots — ClickTake Technologies', 'Custom AI chatbot solutions.'),
  ('services_ai_llm', 'LLM Solutions — ClickTake Technologies', 'Large language model services.'),
  ('services_ai_cv_nlp', 'CV & NLP — ClickTake Technologies', 'Computer vision and NLP services.'),
  ('services_ai_prompt_engineering', 'Prompt Engineering — ClickTake Technologies', 'Prompt engineering services.'),
  ('services_creative_graphic_design', 'Graphic Design — ClickTake Technologies', 'Creative graphic design.'),
  ('services_creative_video_production', 'Video Production — ClickTake Technologies', 'Professional video production.'),
  ('services_web_full_stack', 'Full Stack Web — ClickTake Technologies', 'Full-stack web development.'),
  ('services_web_auth', 'Auth Solutions — ClickTake Technologies', 'Authentication and security.'),
  ('services_web_python_backend', 'Python Backend — ClickTake Technologies', 'Python backend development.'),
  ('services_web_saas', 'SaaS Development — ClickTake Technologies', 'SaaS application development.'),
  ('services_dm_cro', 'CRO — ClickTake Technologies', 'Conversion rate optimization.'),
  ('services_dm_paid_advertising', 'Paid Advertising — ClickTake Technologies', 'Paid ad campaigns.'),
  ('services_dm_content_strategy', 'Content Strategy — ClickTake Technologies', 'Content marketing strategy.'),
  ('legal_terms', 'Terms of Service — ClickTake Technologies', 'Our terms and conditions.'),
  ('legal_privacy', 'Privacy Policy — ClickTake Technologies', 'Our privacy policy.'),
  ('legal_cookies', 'Cookie Policy — ClickTake Technologies', 'Our cookie policy.')
ON CONFLICT (page_key) DO NOTHING;

-- ============================================================================
-- SITEMAP CONFIG (admin.seo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_sitemap_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seo_sitemap_config ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE seo_sitemap_config ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO seo_sitemap_config (content) VALUES (
'<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://clicktake.co/</loc><priority>1.0</priority></url>
  <url><loc>https://clicktake.co/about</loc><priority>0.8</priority></url>
  <url><loc>https://clicktake.co/services</loc><priority>0.8</priority></url>
  <url><loc>https://clicktake.co/portfolio</loc><priority>0.8</priority></url>
  <url><loc>https://clicktake.co/resources</loc><priority>0.7</priority></url>
  <url><loc>https://clicktake.co/contact</loc><priority>0.7</priority></url>
  <url><loc>https://clicktake.co/process</loc><priority>0.6</priority></url>
</urlset>'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ROBOTS.TXT CONFIG (admin.seo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_robots_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seo_robots_config ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE seo_robots_config ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO seo_robots_config (content) VALUES (
'User-agent: *
Allow: /
Sitemap: https://clicktake.co/sitemap.xml'
) ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- EMAIL TEMPLATES (admin.email)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT '';
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS body TEXT DEFAULT '';
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO email_templates (name, subject, body) VALUES
  ('Welcome Reply', 'Welcome to ClickTake Technologies', 'Hi {{name}},\n\nThank you for reaching out to ClickTake Technologies. We have received your inquiry and one of our team members will get back to you within 24 hours.\n\nBest regards,\nThe ClickTake Team'),
  ('Proposal Follow-up', 'Proposal Follow-up: {{project}}', 'Dear {{name}},\n\nFollowing up on the proposal we sent for {{project}}. We would love to schedule a call to walk through the details and answer any questions.\n\nLooking forward to hearing from you.\n\nBest,\n{{sender}}')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- EMAIL WORKFLOWS (admin.email)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  trigger_event TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_workflows ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE email_workflows ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE email_workflows ADD COLUMN IF NOT EXISTS trigger_event TEXT DEFAULT '';
ALTER TABLE email_workflows ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT false;
ALTER TABLE email_workflows ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE email_workflows ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO email_workflows (title, description, trigger_event, enabled) VALUES
  ('New Lead Auto-Reply', 'Automatically send a welcome email when a new lead is captured via the contact form.', 'lead.created', true),
  ('Proposal Delivery', 'Trigger proposal document dispatch when lead status moves to Qualified.', 'lead.status_changed', false),
  ('Webinar Reminder', 'Send calendar invitation 24 hours before a registered webinar start time.', 'webinar.upcoming', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SMTP LOGS (admin.email)
-- ============================================================================
CREATE TABLE IF NOT EXISTS smtp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type smtp_log_type NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE smtp_logs ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE smtp_logs ADD COLUMN IF NOT EXISTS details TEXT DEFAULT '';
ALTER TABLE smtp_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- ADMIN ROLES (RBAC - admin.roles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS role_name TEXT;
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

INSERT INTO admin_roles (role_name, description) VALUES
  ('Super Admin', 'Owner level privilege access, full SMTP, database, and system overrides.'),
  ('Editor', 'Content operator privilege. Manage layout files, media library assets, sitemaps.'),
  ('Sales Support', 'Operational agent access. Review leads database, reply messages, write notes.')
ON CONFLICT (role_name) DO NOTHING;

-- ============================================================================
-- ADMIN USERS (RBAC - admin.roles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role_id UUID REFERENCES admin_roles(id),
  status user_status DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role_id UUID;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- ROLE PERMISSIONS (RBAC - admin.roles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL,
  is_granted BOOLEAN DEFAULT false,
  UNIQUE(role_id, permission_key)
);

ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS role_id UUID;
ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS permission_key TEXT;
ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS is_granted BOOLEAN DEFAULT false;

-- Seed default permissions
INSERT INTO role_permissions (role_id, permission_key, is_granted)
SELECT r.id, p.key, p.granted
FROM admin_roles r
CROSS JOIN (VALUES
  ('readCMS', true), ('editCMS', true), ('readLeads', true), ('editLeads', true), ('configureSMTP', true), ('manageRBAC', true)
) AS p(key, granted)
WHERE r.role_name = 'Super Admin'
ON CONFLICT (role_id, permission_key) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_key, is_granted)
SELECT r.id, p.key, p.granted
FROM admin_roles r
CROSS JOIN (VALUES
  ('readCMS', true), ('editCMS', true), ('readLeads', false), ('editLeads', false), ('configureSMTP', false), ('manageRBAC', false)
) AS p(key, granted)
WHERE r.role_name = 'Editor'
ON CONFLICT (role_id, permission_key) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_key, is_granted)
SELECT r.id, p.key, p.granted
FROM admin_roles r
CROSS JOIN (VALUES
  ('readCMS', true), ('editCMS', false), ('readLeads', true), ('editLeads', true), ('configureSMTP', false), ('manageRBAC', false)
) AS p(key, granted)
WHERE r.role_name = 'Sales Support'
ON CONFLICT (role_id, permission_key) DO NOTHING;

-- ============================================================================
-- SECURITY SETTINGS & LOGS (admin.security)
-- ============================================================================
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE security_settings ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE security_settings ADD COLUMN IF NOT EXISTS value TEXT DEFAULT '';
ALTER TABLE security_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO security_settings (key, value) VALUES
  ('rate_limit', '60'),
  ('two_factor_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT DEFAULT '',
  action TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE security_logs ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT '';
ALTER TABLE security_logs ADD COLUMN IF NOT EXISTS action TEXT DEFAULT '';
ALTER TABLE security_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- BACKUPS (admin.security)
-- ============================================================================
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_date TEXT DEFAULT '',
  size_mb TEXT DEFAULT '',
  backup_type TEXT DEFAULT 'Manual',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE backups ADD COLUMN IF NOT EXISTS backup_date TEXT DEFAULT '';
ALTER TABLE backups ADD COLUMN IF NOT EXISTS size_mb TEXT DEFAULT '';
ALTER TABLE backups ADD COLUMN IF NOT EXISTS backup_type TEXT DEFAULT 'Manual';
ALTER TABLE backups ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- BLOCKED IPS (admin.security)
-- ============================================================================
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blocked_ips ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE blocked_ips ADD COLUMN IF NOT EXISTS attempt_count INTEGER DEFAULT 1;
ALTER TABLE blocked_ips ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT '';
ALTER TABLE blocked_ips ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ============================================================================
-- CMS BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_blogs (
  id TEXT PRIMARY KEY DEFAULT 'b-' || gen_random_uuid()::text,
  title TEXT NOT NULL DEFAULT '',
  author TEXT DEFAULT 'Admin',
  date TEXT DEFAULT to_char(now(), 'YYYY-MM-DD'),
  status TEXT DEFAULT 'Draft',
  content TEXT DEFAULT '<p>Start writing your blog post...</p>',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin';
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS date TEXT DEFAULT '';
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Draft';
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE cms_blogs ALTER COLUMN id SET DEFAULT 'b-' || gen_random_uuid()::text;

-- ============================================================================
-- CMS BACKGROUNDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL DEFAULT 'global',
  bg_type TEXT NOT NULL DEFAULT 'solid',
  solid_color TEXT DEFAULT '#0a0a0f',
  gradient_direction TEXT DEFAULT 'to right',
  gradient_color_1 TEXT DEFAULT '',
  gradient_color_2 TEXT DEFAULT '',
  image_desktop TEXT DEFAULT '',
  image_tablet TEXT DEFAULT '',
  image_mobile TEXT DEFAULT '',
  video_desktop TEXT DEFAULT '',
  video_tablet TEXT DEFAULT '',
  video_mobile TEXT DEFAULT '',
  overlay_color TEXT DEFAULT '',
  overlay_opacity INTEGER DEFAULT 0,
  overlay_blend_mode TEXT DEFAULT 'normal',
  parallax BOOLEAN DEFAULT false,
  attachment TEXT DEFAULT 'scroll',
  sizing TEXT DEFAULT 'cover',
  custom_position TEXT DEFAULT 'center',
  pattern_type TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT 'global';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS bg_type TEXT NOT NULL DEFAULT 'solid';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS solid_color TEXT DEFAULT '#0a0a0f';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS gradient_direction TEXT DEFAULT 'to right';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS gradient_color_1 TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS gradient_color_2 TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS image_desktop TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS image_tablet TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS image_mobile TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS video_desktop TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS video_tablet TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS video_mobile TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS overlay_color TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS overlay_opacity INTEGER DEFAULT 0;
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS overlay_blend_mode TEXT DEFAULT 'normal';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS parallax BOOLEAN DEFAULT false;
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS attachment TEXT DEFAULT 'scroll';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS sizing TEXT DEFAULT 'cover';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS custom_position TEXT DEFAULT 'center';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS pattern_type TEXT DEFAULT '';
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE cms_backgrounds ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE cms_backgrounds ADD CONSTRAINT cms_backgrounds_section_key UNIQUE (section);

INSERT INTO cms_backgrounds (section, bg_type, solid_color) VALUES ('global', 'solid', '#0a0a0f')
ON CONFLICT (section) DO NOTHING;

-- ============================================================================
-- CMS NAVIGATION LINKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_nav_links (
  id TEXT PRIMARY KEY DEFAULT 'n-' || gen_random_uuid()::text,
  label TEXT NOT NULL DEFAULT '',
  to_path TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_nav_links ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE cms_nav_links ADD COLUMN IF NOT EXISTS to_path TEXT;
ALTER TABLE cms_nav_links ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE cms_nav_links ALTER COLUMN id SET DEFAULT 'n-' || gen_random_uuid()::text;

INSERT INTO cms_nav_links (label, to_path) VALUES
  ('Home', '/'),
  ('Services', '/services'),
  ('Work', '/portfolio'),
  ('Resources', '/resources'),
  ('About', '/about'),
  ('Contact', '/contact')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_typography ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_font_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_page_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_sitemap_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_robots_config ENABLE ROW LEVEL SECURITY;

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (you can tighten this in production)
DROP POLICY IF EXISTS "authenticated_all" ON pages; CREATE POLICY "authenticated_all" ON pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON leads; CREATE POLICY "authenticated_all" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON site_settings; CREATE POLICY "authenticated_all" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON cms_media; CREATE POLICY "authenticated_all" ON cms_media FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_read" ON page_views; CREATE POLICY "authenticated_read" ON page_views FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON audit_logs; CREATE POLICY "authenticated_all" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON admin_notifications; CREATE POLICY "authenticated_all" ON admin_notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON cms_blogs; CREATE POLICY "authenticated_all" ON cms_blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON cms_backgrounds; CREATE POLICY "authenticated_all" ON cms_backgrounds FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select" ON cms_backgrounds; CREATE POLICY "anon_select" ON cms_backgrounds FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON cms_nav_links; CREATE POLICY "authenticated_all" ON cms_nav_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON cms_typography; CREATE POLICY "authenticated_all" ON cms_typography FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select" ON cms_typography; CREATE POLICY "anon_select" ON cms_typography FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON cms_font_presets; CREATE POLICY "authenticated_all" ON cms_font_presets FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select" ON cms_font_presets; CREATE POLICY "anon_select" ON cms_font_presets FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON seo_page_meta; CREATE POLICY "authenticated_all" ON seo_page_meta FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON seo_sitemap_config; CREATE POLICY "authenticated_all" ON seo_sitemap_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON seo_robots_config; CREATE POLICY "authenticated_all" ON seo_robots_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON email_templates; CREATE POLICY "authenticated_all" ON email_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON email_workflows; CREATE POLICY "authenticated_all" ON email_workflows FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON smtp_logs; CREATE POLICY "authenticated_all" ON smtp_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON admin_roles; CREATE POLICY "authenticated_all" ON admin_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON admin_users; CREATE POLICY "authenticated_all" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON role_permissions; CREATE POLICY "authenticated_all" ON role_permissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON security_settings; CREATE POLICY "authenticated_all" ON security_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON security_logs; CREATE POLICY "authenticated_all" ON security_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON backups; CREATE POLICY "authenticated_all" ON backups FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON blocked_ips; CREATE POLICY "authenticated_all" ON blocked_ips FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON testimonials; CREATE POLICY "authenticated_all" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON portfolio_items; CREATE POLICY "authenticated_all" ON portfolio_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON team_members; CREATE POLICY "authenticated_all" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON job_openings; CREATE POLICY "authenticated_all" ON job_openings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON resources; CREATE POLICY "authenticated_all" ON resources FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- Allow anon read-only on public-facing tables
DROP POLICY IF EXISTS "anon_select" ON testimonials; CREATE POLICY "anon_select" ON testimonials FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_select" ON portfolio_items; CREATE POLICY "anon_select" ON portfolio_items FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_select" ON team_members; CREATE POLICY "anon_select" ON team_members FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_select" ON job_openings; CREATE POLICY "anon_select" ON job_openings FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_select" ON resources; CREATE POLICY "anon_select" ON resources FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_select" ON site_settings; CREATE POLICY "anon_select" ON site_settings FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_select" ON pages; CREATE POLICY "anon_select" ON pages FOR SELECT TO anon USING (true);

-- Allow anon inserts on leads (contact form submissions)
DROP POLICY IF EXISTS "anon_insert" ON leads; CREATE POLICY "anon_insert" ON leads FOR INSERT TO anon WITH CHECK (true);

-- ============================================================================
-- REALTIME PUBLICATION
-- ============================================================================
DO $$
DECLARE
  tbl TEXT;
  tables_to_add TEXT[] := ARRAY['pages', 'cms_media', 'cms_blogs', 'cms_backgrounds', 'cms_nav_links', 'cms_typography', 'cms_font_presets', 'cms_themes', 'cms_theme_presets'];
BEGIN
  FOREACH tbl IN ARRAY tables_to_add
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND tablename = tbl
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', tbl);
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_page_meta_updated_at ON seo_page_meta;
CREATE TRIGGER update_seo_page_meta_updated_at BEFORE UPDATE ON seo_page_meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_sitemap_config_updated_at ON seo_sitemap_config;
CREATE TRIGGER update_seo_sitemap_config_updated_at BEFORE UPDATE ON seo_sitemap_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_robots_config_updated_at ON seo_robots_config;
CREATE TRIGGER update_seo_robots_config_updated_at BEFORE UPDATE ON seo_robots_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_email_workflows_updated_at ON email_workflows;
CREATE TRIGGER update_email_workflows_updated_at BEFORE UPDATE ON email_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_cms_backgrounds_updated_at ON cms_backgrounds;
CREATE TRIGGER update_cms_backgrounds_updated_at BEFORE UPDATE ON cms_backgrounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_security_settings_updated_at ON security_settings;
CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON security_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_cms_typography_updated_at ON cms_typography;
CREATE TRIGGER update_cms_typography_updated_at BEFORE UPDATE ON cms_typography
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_cms_themes_updated_at ON cms_themes;
CREATE TRIGGER update_cms_themes_updated_at BEFORE UPDATE ON cms_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED ADMIN USER
-- ============================================================================
INSERT INTO admin_users (email, full_name, role_id, is_active, status)
SELECT 'clicktakehr@gmail.com', 'Admin', id, true, 'Active'
FROM admin_roles WHERE role_name = 'Super Admin'
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SEED ADMIN NOTIFICATIONS
-- ============================================================================
INSERT INTO admin_notifications (title, message, type) VALUES
  ('Welcome to ClickTake Admin', 'Your admin portal is fully operational. Configure your system settings to get started.', 'info'),
  ('New Lead Captured', 'A new contact form submission has been received from the website.', 'lead')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ADVANCED TYPOGRAPHY ENGINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_typography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element TEXT NOT NULL,
  font_family TEXT NOT NULL DEFAULT 'Inter',
  font_source TEXT DEFAULT 'google',
  font_weight TEXT DEFAULT '400',
  line_height REAL DEFAULT 1.5,
  letter_spacing TEXT DEFAULT '0',
  text_transform TEXT DEFAULT 'none',
  preload BOOLEAN DEFAULT false,
  font_file_url TEXT,
  font_file_format TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS element TEXT;
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter';
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS font_source TEXT DEFAULT 'google';
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS font_weight TEXT DEFAULT '400';
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS line_height REAL DEFAULT 1.5;
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS letter_spacing TEXT DEFAULT '0';
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS text_transform TEXT DEFAULT 'none';
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS preload BOOLEAN DEFAULT false;
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS font_file_url TEXT;
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS font_file_format TEXT;
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE cms_typography ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE cms_typography ADD CONSTRAINT cms_typography_element_key UNIQUE (element);

INSERT INTO cms_typography (element, font_family, font_source, font_weight, line_height, letter_spacing, text_transform, preload) VALUES
  ('heading_h1', 'Inter', 'google', '800', 1.1, '-0.02', 'none', true),
  ('heading_h2', 'Inter', 'google', '700', 1.2, '-0.01', 'none', true),
  ('heading_h3', 'Inter', 'google', '600', 1.3, '0', 'none', true),
  ('body', 'Inter', 'google', '400', 1.7, '0', 'none', false),
  ('nav', 'Inter', 'google', '400', 1.5, '0', 'none', false),
  ('button', 'Inter', 'google', '400', 1.5, '0', 'none', false),
  ('quote', 'Inter', 'google', '400', 1.6, '0', 'none', false),
  ('code', 'JetBrains Mono', 'google', '400', 1.5, '0', 'none', true),
  ('pricing_number', 'Inter', 'google', '800', 1, '-0.02', 'none', false)
ON CONFLICT (element) DO UPDATE SET
  font_family = EXCLUDED.font_family,
  font_source = EXCLUDED.font_source,
  font_weight = EXCLUDED.font_weight,
  line_height = EXCLUDED.line_height,
  letter_spacing = EXCLUDED.letter_spacing,
  text_transform = EXCLUDED.text_transform,
  preload = EXCLUDED.preload;

CREATE TABLE IF NOT EXISTS cms_font_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  config JSONB NOT NULL,
  is_builtin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_font_presets ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE cms_font_presets ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE cms_font_presets ADD COLUMN IF NOT EXISTS config JSONB;
ALTER TABLE cms_font_presets ADD COLUMN IF NOT EXISTS is_builtin BOOLEAN DEFAULT false;
ALTER TABLE cms_font_presets ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

INSERT INTO cms_font_presets (name, description, config, is_builtin) VALUES
  ('Modern Sans', 'Clean and professional sans-serif pairing', '{"heading_h1":{"font_family":"Inter","font_weight":"800"},"heading_h2":{"font_family":"Inter","font_weight":"700"},"body":{"font_family":"Inter","font_weight":"400"},"nav":{"font_family":"Inter","font_weight":"500","text_transform":"uppercase","letter_spacing":"0.05"},"button":{"font_family":"Inter","font_weight":"600","text_transform":"uppercase","letter_spacing":"0.05"},"quote":{"font_family":"Inter","font_weight":"400","font_style":"italic"}}', true),
  ('Elegant Serif', 'Sophisticated serif for headings, clean sans for body', '{"heading_h1":{"font_family":"Playfair Display","font_weight":"700"},"heading_h2":{"font_family":"Playfair Display","font_weight":"600"},"body":{"font_family":"Lato","font_weight":"400"},"nav":{"font_family":"Lato","font_weight":"700","text_transform":"uppercase","letter_spacing":"0.05"},"button":{"font_family":"Lato","font_weight":"700","text_transform":"uppercase","letter_spacing":"0.05"},"quote":{"font_family":"Playfair Display","font_weight":"400","font_style":"italic"}}', true),
  ('Bold Agency', 'Bold impactful headings with clean body', '{"heading_h1":{"font_family":"Montserrat","font_weight":"900"},"heading_h2":{"font_family":"Montserrat","font_weight":"800"},"body":{"font_family":"Open Sans","font_weight":"400"},"nav":{"font_family":"Montserrat","font_weight":"600","text_transform":"uppercase","letter_spacing":"0.05"},"button":{"font_family":"Montserrat","font_weight":"700","text_transform":"uppercase","letter_spacing":"0.05"},"quote":{"font_family":"Playfair Display","font_weight":"400","font_style":"italic"}}', true),
  ('Minimal Tech', 'Clean modern tech-startup aesthetic', '{"heading_h1":{"font_family":"DM Sans","font_weight":"700"},"heading_h2":{"font_family":"DM Sans","font_weight":"500"},"body":{"font_family":"DM Sans","font_weight":"400"},"nav":{"font_family":"DM Sans","font_weight":"500","text_transform":"uppercase","letter_spacing":"0.08"},"button":{"font_family":"DM Sans","font_weight":"700","text_transform":"uppercase","letter_spacing":"0.05"},"quote":{"font_family":"DM Serif Display","font_weight":"400","font_style":"italic"}}', true);

-- ============================================================================
-- GLOBAL THEME ENGINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  parent_theme_id UUID REFERENCES cms_themes(id) ON DELETE SET NULL,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '';
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS parent_theme_id UUID;
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE cms_themes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
-- Note: UNIQUE constraint on slug is already created by CREATE TABLE (slug TEXT NOT NULL UNIQUE)

-- Per-page theme override
ALTER TABLE pages ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES cms_themes(id) ON DELETE SET NULL;

-- Theme presets
CREATE TABLE IF NOT EXISTS cms_theme_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  config JSONB NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  is_builtin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cms_theme_presets ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE cms_theme_presets ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE cms_theme_presets ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';
ALTER TABLE cms_theme_presets ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '';
ALTER TABLE cms_theme_presets ADD COLUMN IF NOT EXISTS is_builtin BOOLEAN DEFAULT false;
ALTER TABLE cms_theme_presets ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Theme Inheritance: ensure only one active/default theme at a time via partial unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_themes_active ON cms_themes(is_active) WHERE is_active = true;
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_themes_default ON cms_themes(is_default) WHERE is_default = true;

-- Seed default theme (Website Existing Theme)
INSERT INTO cms_themes (name, slug, description, is_active, is_default, config) VALUES
  ('Website Existing Theme', 'default', 'The original ClickTake design — dark glassmorphism with brand magenta/blue accents.', true, true, '{
    "display_name": "ClickTake Original",
    "colors": {},
    "layout_density": "normal",
    "component_style": {
      "border_radius": "rounded",
      "shadow": "glow",
      "button_style": "glass",
      "card_style": "glass"
    },
    "spacing": {
      "section_padding": "py-24 md:py-32",
      "container_max_width": "max-w-7xl",
      "gap": "gap-8"
    }
  }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Seed Tech Noir
INSERT INTO cms_themes (name, slug, description, is_active, is_default, config) VALUES
  ('Tech Noir', 'tech-noir', 'Dark mode, neon cyan/magenta accents, glassmorphism, cyber/tech vibe.', false, false, '{
    "display_name": "Tech Noir",
    "colors": {
      "background": "oklch(0.04 0.02 280)",
      "foreground": "oklch(0.98 0.01 280)",
      "card": "oklch(0.08 0.03 280)",
      "card_foreground": "oklch(0.98 0.01 280)",
      "popover": "oklch(0.08 0.03 280)",
      "popover_foreground": "oklch(0.98 0.01 280)",
      "primary": "oklch(0.75 0.2 180)",
      "primary_foreground": "oklch(0.05 0.02 280)",
      "secondary": "oklch(0.12 0.04 280)",
      "secondary_foreground": "oklch(0.98 0.01 280)",
      "muted": "oklch(0.1 0.03 280)",
      "muted_foreground": "oklch(0.6 0.03 280)",
      "accent": "oklch(0.75 0.25 330)",
      "accent_foreground": "oklch(0.05 0.02 280)",
      "destructive": "oklch(0.7 0.2 20)",
      "destructive_foreground": "oklch(0.98 0 0)",
      "border": "oklch(0.2 0.05 280)",
      "input": "oklch(0.15 0.04 280)",
      "ring": "oklch(0.75 0.2 180)",
      "brand_pink": "oklch(0.7 0.22 0)",
      "brand_magenta": "oklch(0.75 0.28 330)",
      "brand_blue": "oklch(0.7 0.22 270)",
      "brand_cyan": "oklch(0.85 0.15 180)",
      "glow": "oklch(0.75 0.2 180 / 0.5)"
    },
    "gradients": {
      "brand": "linear-gradient(135deg, oklch(0.75 0.2 180) 0%, oklch(0.75 0.25 330) 50%, oklch(0.7 0.22 270) 100%)",
      "mesh": "radial-gradient(at 20% 0%, oklch(0.75 0.2 180 / 0.2) 0px, transparent 50%), radial-gradient(at 80% 30%, oklch(0.7 0.22 270 / 0.3) 0px, transparent 50%), radial-gradient(at 50% 100%, oklch(0.75 0.25 330 / 0.2) 0px, transparent 50%)"
    },
    "shadows": {
      "glow": "0 20px 80px -20px oklch(0.75 0.2 180 / 0.6)",
      "elegant": "0 30px 80px -30px oklch(0 0 0 / 0.8)"
    },
    "layout_density": "compact",
    "component_style": {
      "border_radius": "sharp",
      "shadow": "glow",
      "button_style": "glass",
      "card_style": "glass"
    },
    "spacing": {
      "section_padding": "py-16 md:py-24",
      "container_max_width": "max-w-7xl",
      "gap": "gap-6"
    },
    "typography": {
      "heading_font": "Space Grotesk",
      "body_font": "Inter"
    }
  }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Seed Corporate Clean
INSERT INTO cms_themes (name, slug, description, is_active, is_default, config) VALUES
  ('Corporate Clean', 'corporate-clean', 'Light mode, lots of whitespace, subtle shadows, professional SaaS vibe.', false, false, '{
    "display_name": "Corporate Clean",
    "colors": {
      "background": "oklch(0.99 0.005 240)",
      "foreground": "oklch(0.12 0.02 240)",
      "card": "oklch(1 0 0)",
      "card_foreground": "oklch(0.12 0.02 240)",
      "popover": "oklch(1 0 0)",
      "popover_foreground": "oklch(0.12 0.02 240)",
      "primary": "oklch(0.45 0.18 260)",
      "primary_foreground": "oklch(0.99 0 0)",
      "secondary": "oklch(0.95 0.01 240)",
      "secondary_foreground": "oklch(0.12 0.02 240)",
      "muted": "oklch(0.95 0.01 240)",
      "muted_foreground": "oklch(0.5 0.02 240)",
      "accent": "oklch(0.55 0.15 260)",
      "accent_foreground": "oklch(0.99 0 0)",
      "destructive": "oklch(0.577 0.245 27.325)",
      "destructive_foreground": "oklch(0.99 0 0)",
      "border": "oklch(0.9 0.01 240)",
      "input": "oklch(0.92 0.01 240)",
      "ring": "oklch(0.45 0.18 260)",
      "brand_pink": "oklch(0.3 0.12 0)",
      "brand_magenta": "oklch(0.45 0.18 260)",
      "brand_blue": "oklch(0.5 0.15 250)",
      "brand_cyan": "oklch(0.65 0.1 220)",
      "glow": "oklch(0.45 0.18 260 / 0.3)"
    },
    "gradients": {
      "brand": "linear-gradient(135deg, oklch(0.45 0.18 260) 0%, oklch(0.5 0.15 250) 100%)",
      "mesh": "radial-gradient(at 20% 0%, oklch(0.45 0.18 260 / 0.08) 0px, transparent 50%)"
    },
    "shadows": {
      "glow": "0 4px 20px oklch(0.45 0.18 260 / 0.1)",
      "elegant": "0 10px 40px -10px oklch(0.12 0.02 240 / 0.1)"
    },
    "layout_density": "airy",
    "component_style": {
      "border_radius": "rounded",
      "shadow": "soft",
      "button_style": "filled",
      "card_style": "elevated"
    },
    "spacing": {
      "section_padding": "py-32 md:py-40",
      "container_max_width": "max-w-7xl",
      "gap": "gap-10"
    },
    "typography": {
      "heading_font": "Inter",
      "body_font": "Inter"
    }
  }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Seed Bold Agency
INSERT INTO cms_themes (name, slug, description, is_active, is_default, config) VALUES
  ('Bold Agency', 'bold-agency', 'Asymmetrical layouts, massive typography, vibrant colors, creative agency vibe.', false, false, '{
    "display_name": "Bold Agency",
    "colors": {
      "background": "oklch(0.07 0.03 30)",
      "foreground": "oklch(0.98 0.01 30)",
      "card": "oklch(0.11 0.04 30)",
      "card_foreground": "oklch(0.98 0.01 30)",
      "popover": "oklch(0.11 0.04 30)",
      "popover_foreground": "oklch(0.98 0.01 30)",
      "primary": "oklch(0.7 0.25 50)",
      "primary_foreground": "oklch(0.05 0.02 30)",
      "secondary": "oklch(0.15 0.05 30)",
      "secondary_foreground": "oklch(0.98 0.01 30)",
      "muted": "oklch(0.15 0.05 30)",
      "muted_foreground": "oklch(0.65 0.03 30)",
      "accent": "oklch(0.75 0.25 350)",
      "accent_foreground": "oklch(0.05 0.02 30)",
      "destructive": "oklch(0.7 0.2 20)",
      "destructive_foreground": "oklch(0.98 0 0)",
      "border": "oklch(0.25 0.06 30)",
      "input": "oklch(0.2 0.05 30)",
      "ring": "oklch(0.7 0.25 50)",
      "brand_pink": "oklch(0.75 0.22 350)",
      "brand_magenta": "oklch(0.7 0.25 50)",
      "brand_blue": "oklch(0.65 0.2 250)",
      "brand_cyan": "oklch(0.8 0.15 220)",
      "glow": "oklch(0.7 0.25 50 / 0.5)"
    },
    "gradients": {
      "brand": "linear-gradient(135deg, oklch(0.7 0.25 50) 0%, oklch(0.75 0.25 350) 50%, oklch(0.65 0.2 250) 100%)",
      "mesh": "radial-gradient(at 80% 0%, oklch(0.75 0.25 350 / 0.25) 0px, transparent 50%), radial-gradient(at 20% 100%, oklch(0.7 0.25 50 / 0.2) 0px, transparent 50%)"
    },
    "shadows": {
      "glow": "0 20px 80px -20px oklch(0.7 0.25 50 / 0.6)",
      "elegant": "0 30px 80px -30px oklch(0 0 0 / 0.7)"
    },
    "layout_density": "airy",
    "component_style": {
      "border_radius": "sharp",
      "shadow": "hard",
      "button_style": "filled",
      "card_style": "flat"
    },
    "spacing": {
      "section_padding": "py-32 md:py-44",
      "container_max_width": "max-w-full",
      "gap": "gap-12"
    },
    "typography": {
      "heading_font": "Space Grotesk",
      "body_font": "Inter"
    }
  }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- RLS for cms_themes
ALTER TABLE cms_themes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all" ON cms_themes;
CREATE POLICY "authenticated_all" ON cms_themes FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select" ON cms_themes;
CREATE POLICY "anon_select" ON cms_themes FOR SELECT TO anon USING (true);

-- RLS for cms_theme_presets
ALTER TABLE cms_theme_presets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_all" ON cms_theme_presets;
CREATE POLICY "authenticated_all" ON cms_theme_presets FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select" ON cms_theme_presets;
CREATE POLICY "anon_select" ON cms_theme_presets FOR SELECT TO anon USING (true);

-- Added columns for CMS Redesign
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '';
ALTER TABLE cms_nav_links ADD COLUMN IF NOT EXISTS position TEXT DEFAULT 'header';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS show_in_nav BOOLEAN DEFAULT false;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS nav_order INTEGER DEFAULT 0;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
