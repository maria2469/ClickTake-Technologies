# ClickTake Technologies

Full-stack website and admin platform for ClickTake — an AI-powered digital agency based in **Birmingham, UK** and **Multan, Pakistan**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start + TanStack React Router (file-based routing) |
| UI | React 19, shadcn/ui (New York style), Radix primitives |
| Styling | Tailwind CSS v4, `oklch()` color system, custom theme engine |
| Backend | Supabase (PostgreSQL, Auth, Realtime, RLS) |
| Storage | Cloudinary (media uploads) |
| Email | Nodemailer (Resend / Gmail SMTP / DB-configured SMTP) |
| Deployment | Cloudflare Workers |
| 3D / Animation | React Three Fiber, Framer Motion |
| Forms | React Hook Form + Zod |
| Rich Text | TinyMCE |
| Charts | Recharts |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint & Format

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── assets/            # Static assets (images, fonts)
├── components/        # React components
│   ├── ui/            # shadcn/ui primitives (44 components)
│   ├── Hero.tsx       # Homepage hero section
│   ├── Hero3D.tsx     # Three.js 3D hero animation
│   ├── Navbar.tsx     # Main navigation (mega-menu, DB-driven)
│   ├── Footer.tsx     # Site footer
│   ├── Contact.tsx    # Contact form with Turnstile CAPTCHA
│   ├── SEOHead.tsx    # Dynamic SEO meta injection
│   ├── BackgroundRenderer.tsx  # DB-driven per-section backgrounds
│   └── ...            # Work, Process, Testimonials, Portfolio, etc.
├── hooks/             # Custom React hooks
├── lib/               # Services, utilities, Supabase client
│   ├── supabaseClient.ts
│   ├── pagesService.ts
│   ├── servicesService.ts
│   ├── leadsService.ts
│   ├── analyticsService.ts
│   ├── mediaService.ts
│   ├── Mailer.ts
│   └── utils.ts
├── routes/            # File-based routing
├── main.tsx           # Entry point
├── router.tsx         # Router configuration
├── server.ts          # SSR error wrapper
└── styles.css         # Global styles + theme system
```

## Pages

### Public

| Route | Description |
|---|---|
| `/` | Homepage — 3D hero, portfolio, process, testimonials, contact |
| `/about` | Company story, team members |
| `/contact` | Contact form with spam protection |
| `/portfolio` | Work showcase |
| `/resources` | Blog articles, guides, webinars |
| `/services` | Services overview |
| `/services/ai/*` | AI services (Chatbots, LLM, CV/NLP, Prompt Engineering) |
| `/services/web/*` | Web services (Full Stack, Auth, Python Backend, SaaS) |
| `/services/digital-marketing/*` | Marketing (CRO, Paid Ads, Content Strategy) |
| `/services/creative/*` | Creative (Graphic Design, Video Production) |
| `/legal/terms` | Terms of Service |
| `/legal/privacy` | Privacy Policy |
| `/legal/cookies` | Cookie Policy |

### Admin (auth + RBAC required)

| Route | Description |
|---|---|
| `/admin` | Dashboard overview with analytics |
| `/admin/cms` | CMS page management (CRUD, duplicate, publish) |
| `/admin/services` | Services & pricing packages |
| `/admin/team-careers` | Team members & job openings |
| `/admin/typography` | Typography engine (fonts, presets) |
| `/admin/theme` | Theme engine (colors, density, radius, shadows) |
| `/admin/crm` | Lead CRM (pipeline, search, CSV export) |
| `/admin/roles` | User roles & RBAC |
| `/admin/email` | Email center (templates, workflows, logs) |
| `/admin/seo` | SEO meta, sitemap, robots.txt config |
| `/admin/settings` | Site configuration |
| `/admin/security` | Security logs, blocked IPs, backups |
| `/admin/login` | Admin login |
| `/admin/forgot-password` | Password recovery |

## Database

Supabase PostgreSQL with 30+ tables covering:

- **CMS** — Pages, media library, blogs, backgrounds, navigation, typography, themes
- **CRM** — Leads with status pipeline and source tracking
- **Services** — Catalog, processes, pricing packages, categories
- **SEO** — Per-page meta, sitemap config, robots.txt config
- **Email** — Templates, automation workflows, SMTP logs
- **Auth** — Admin users, roles (Super Admin, Editor, Sales Support), granular permissions
- **Security** — Audit logs, security logs, blocked IPs, rate limiting
- **Analytics** — Page views, admin notifications (realtime)

RLS policies enforce `anon SELECT` for public content, `anon INSERT` for leads, and full CRUD for authenticated admins.

## Features

- **Theme Engine** — 8 accent colors, layout density, border radius, shadow styles, button/card variants
- **Typography Engine** — Per-element font configuration, Google Fonts/Adobe Fonts integration, presets
- **Background System** — Per-section solid, gradient, image, video, and pattern backgrounds
- **Realtime Updates** — Supabase Realtime for CMS content and notifications
- **Spam Protection** — Cloudflare Turnstile on contact forms
- **Dynamic SEO** — Meta tags, JSON-LD structured data, configurable sitemap.xml and robots.txt
- **GA4 & GSC Integration** — Google Analytics and Search Console support
- **RBAC** — Role-based access control with granular permissions
- **Audit Logging** — Full change tracking with old/new data snapshots
