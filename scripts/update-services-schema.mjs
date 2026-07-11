import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const get = (k) => {
  const m = envContent.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim() : null;
};

const SUPABASE_URL = get('VITE_SUPABASE_URL');
const SERVICE_KEY  = get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];

const SQL = `
-- ===== ADD IMAGE_URL TO SERVICES =====
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';

-- ===== SERVICE CATEGORIES TABLE =====
CREATE TABLE IF NOT EXISTS service_categories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key           TEXT        UNIQUE NOT NULL,
  label         TEXT        NOT NULL,
  description   TEXT        DEFAULT '',
  icon_name     TEXT        DEFAULT 'Sparkles',
  gradient      TEXT        DEFAULT 'from-brand-cyan to-brand-blue',
  display_order INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select"       ON service_categories;
CREATE POLICY          "anon_select"       ON service_categories FOR SELECT TO public        USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON service_categories;
CREATE POLICY          "authenticated_all" ON service_categories FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- Seed default categories
INSERT INTO service_categories (key, label, description, icon_name, gradient, display_order)
VALUES
  ('web', 'Web Development', 'Production-grade web applications built on proven stacks.', 'Globe', 'from-brand-cyan to-brand-blue', 1),
  ('ai', 'AI & Machine Learning', 'Custom AI solutions for production, not demos.', 'Brain', 'from-brand-magenta to-brand-blue', 2),
  ('marketing', 'Digital Marketing', 'Data-led marketing that compounds.', 'TrendingUp', 'from-emerald-500 to-teal-600', 3),
  ('creative', 'Creative Services', 'Visual identities, design, and video content.', 'Palette', 'from-brand-pink to-orange-500', 4),
  ('starter-kit', 'Starter Kit', 'Flagship end-to-end launch package.', 'Rocket', 'from-pink-500 to-rose-600', 5)
ON CONFLICT (key) DO NOTHING;
`;

async function main() {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  console.log('Updating schema via Management API for project:', projectRef);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: SQL }),
  });

  const body = await res.text();

  if (!res.ok) {
    console.error('Management API error:', res.status, body);
    console.log('\nSQL to run manually in Supabase SQL Editor:\n');
    console.log(SQL);
    return;
  }

  console.log('Schema updated successfully!', body || '');
}

main().catch(e => { console.error(e); process.exit(1); });
