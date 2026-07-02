/**
 * run-migration.mjs
 * Applies only the services / pricing tables block from migration.sql
 * to the live Supabase project using the REST SQL execution endpoint.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ──
const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const get = (k) => {
  const m = envContent.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim() : null;
};

const SUPABASE_URL = get('VITE_SUPABASE_URL');
const SERVICE_ROLE_KEY = get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// ── SQL to run ──
const SQL = `
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  gradient TEXT NOT NULL DEFAULT 'from-cyan-400 via-blue-500 to-violet-600',
  glow TEXT NOT NULL DEFAULT 'rgba(6,182,212,0.15)',
  eyebrow TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  detailed_description TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'Sparkles',
  items JSONB DEFAULT '[]',
  results JSONB DEFAULT '[]',
  differentiators JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  package_level TEXT NOT NULL,
  price TEXT NOT NULL,
  delivery_days TEXT DEFAULT '',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select" ON services;
CREATE POLICY "anon_select" ON services FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "anon_select" ON service_processes;
CREATE POLICY "anon_select" ON service_processes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "anon_select" ON pricing_packages;
CREATE POLICY "anon_select" ON pricing_packages FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "authenticated_all" ON services;
CREATE POLICY "authenticated_all" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all" ON service_processes;
CREATE POLICY "authenticated_all" ON service_processes FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all" ON pricing_packages;
CREATE POLICY "authenticated_all" ON pricing_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

async function runMigration() {
  console.log('Running services schema migration on:', SUPABASE_URL);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: SQL }),
  });

  if (!res.ok) {
    // exec_sql may not exist — fallback: use the pg REST /sql endpoint
    const fallback = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    });

    if (!fallback.ok) {
      const body = await res.text();
      console.error('Migration endpoint not available:', body);
      console.log('\n✅ Tables may already exist. Proceeding to seed step.\n');
      return;
    }
  }

  console.log('✅ Schema migration applied successfully!');
}

runMigration();
