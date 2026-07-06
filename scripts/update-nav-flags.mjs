import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read from env
let envContent = '';
try {
  envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
} catch (e) {
  try {
    envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  } catch (err) {
    console.error('No .env or .env.local file found');
    process.exit(1);
  }
}

const get = (k) => {
  const m = envContent.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim() : null;
};

const SUPABASE_URL = get('VITE_SUPABASE_URL');
const SERVICE_ROLE_KEY = get('SUPABASE_SERVICE_ROLE_KEY') || get('SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const PAGES_TO_SEED = [
  { slug: '/', title: 'Home Page', meta_title: 'ClickTake Technologies — AI-Powered Digital Agency' },
  { slug: '/about', title: 'About Us', meta_title: 'About Us — ClickTake Technologies' },
  { slug: '/contact', title: 'Contact', meta_title: 'Contact — ClickTake Technologies' },
  { slug: '/portfolio', title: 'Portfolio', meta_title: 'Portfolio — ClickTake Technologies' },
  { slug: '/resources', title: 'Resources', meta_title: 'Resources — ClickTake Technologies' },
  { slug: '/services/seo', title: 'SEO Services', meta_title: 'SEO Services — ClickTake Technologies' },
  { slug: '/services/starter-kit', title: 'Starter Kit', meta_title: 'Starter Kit — ClickTake Technologies' },
  { slug: '/services/ai-chatbots', title: 'AI Chatbots', meta_title: 'AI Chatbots — ClickTake Technologies' },
  { slug: '/services/ai-llm', title: 'LLM Solutions', meta_title: 'LLM Solutions — ClickTake Technologies' },
  { slug: '/services/ai-cv-nlp', title: 'CV & NLP', meta_title: 'CV & NLP — ClickTake Technologies' },
  { slug: '/services/ai-prompt-engineering', title: 'Prompt Engineering', meta_title: 'Prompt Engineering — ClickTake Technologies' },
  { slug: '/services/creative-graphic-design', title: 'Graphic Design', meta_title: 'Graphic Design — ClickTake Technologies' },
  { slug: '/services/creative-video-production', title: 'Video Production', meta_title: 'Video Production — ClickTake Technologies' },
  { slug: '/services/web-full-stack', title: 'Full Stack Web', meta_title: 'Full Stack Web — ClickTake Technologies' },
  { slug: '/services/web-auth', title: 'Auth Solutions', meta_title: 'Auth Solutions — ClickTake Technologies' },
  { slug: '/services/web-python-backend', title: 'Python Backend', meta_title: 'Python Backend — ClickTake Technologies' },
  { slug: '/services/web-saas', title: 'SaaS Development', meta_title: 'SaaS Development — ClickTake Technologies' },
  { slug: '/services/cro', title: 'CRO', meta_title: 'CRO — ClickTake Technologies' },
  { slug: '/services/paid-advertising', title: 'Paid Advertising', meta_title: 'Paid Advertising — ClickTake Technologies' },
  { slug: '/services/content-strategy', title: 'Content Strategy', meta_title: 'Content Strategy — ClickTake Technologies' },
  { slug: '/legal/terms', title: 'Terms of Service', meta_title: 'Terms of Service — ClickTake Technologies' },
  { slug: '/legal/privacy', title: 'Privacy Policy', meta_title: 'Privacy Policy — ClickTake Technologies' },
  { slug: '/legal/cookies', title: 'Cookie Policy', meta_title: 'Cookie Policy — ClickTake Technologies' }
];

async function seed() {
  console.log('Seeding pages into pages table...');

  // Fetch current pages
  const { data: existingPages, error: fetchErr } = await supabase.from('pages').select('slug');
  if (fetchErr) {
    console.error('Error fetching pages:', fetchErr);
    return;
  }

  const existingSlugs = new Set(existingPages.map(p => p.slug.toLowerCase()));

  for (const pageInfo of PAGES_TO_SEED) {
    if (existingSlugs.has(pageInfo.slug.toLowerCase())) {
      console.log(`Page with slug "${pageInfo.slug}" already exists, skipping.`);
      continue;
    }

    const newPage = {
      title: pageInfo.title,
      slug: pageInfo.slug,
      is_published: true,
      meta_title: pageInfo.meta_title,
      meta_description: `Learn more about our ${pageInfo.title} on ClickTake Technologies.`,
      blocks: [
        { id: `b-h-${Date.now()}`, type: "header", content: pageInfo.title },
        { id: `b-t-${Date.now()}`, type: "text", content: `Customize your ${pageInfo.title} content here.` }
      ]
    };

    const { data, error } = await supabase.from('pages').insert(newPage).select().single();
    if (error) {
      console.error(`Failed to insert page ${pageInfo.slug}:`, error.message);
    } else {
      console.log(`Successfully seeded page: ${pageInfo.title} (${pageInfo.slug})`);
    }
  }

  console.log('✅ Seeding completed!');
}

seed();
