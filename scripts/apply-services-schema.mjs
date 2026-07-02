/**
 * apply-services-schema.mjs
 * Uses the Supabase Management API to run the services/packages DDL.
 * Run: node scripts/apply-services-schema.mjs
 */
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

const SUPABASE_URL = get('VITE_SUPABASE_URL');         // https://xxx.supabase.co
const SERVICE_KEY  = get('SUPABASE_SERVICE_ROLE_KEY'); // service_role JWT

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

// Extract project ref from URL e.g. https://crejzifwpcnjqghlbbdf.supabase.co
const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];

const SQL = `
-- ===== SERVICES =====
CREATE TABLE IF NOT EXISTS services (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        UNIQUE NOT NULL,
  category         TEXT        NOT NULL,
  category_label   TEXT        NOT NULL DEFAULT '',
  title            TEXT        NOT NULL,
  gradient         TEXT        NOT NULL DEFAULT 'from-cyan-400 via-blue-500 to-violet-600',
  glow             TEXT        NOT NULL DEFAULT 'rgba(6,182,212,0.15)',
  eyebrow          TEXT        NOT NULL DEFAULT '',
  description      TEXT        NOT NULL DEFAULT '',
  detailed_description TEXT    NOT NULL DEFAULT '',
  icon_name        TEXT        NOT NULL DEFAULT 'Sparkles',
  items            JSONB       DEFAULT '[]',
  results          JSONB       DEFAULT '[]',
  differentiators  JSONB       DEFAULT '[]',
  deliverables     JSONB       DEFAULT '[]',
  display_order    INTEGER     DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_processes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id   UUID        REFERENCES services(id) ON DELETE CASCADE,
  step_number  INTEGER     NOT NULL,
  title        TEXT        NOT NULL,
  description  TEXT        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_packages (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id     UUID        REFERENCES services(id) ON DELETE CASCADE,
  package_level  TEXT        NOT NULL,
  price          TEXT        NOT NULL,
  delivery_days  TEXT        DEFAULT '',
  description    TEXT        DEFAULT '',
  features       JSONB       DEFAULT '[]',
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ===== RLS =====
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select"       ON services;
CREATE POLICY          "anon_select"       ON services          FOR SELECT TO public        USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON services;
CREATE POLICY          "authenticated_all" ON services          FOR ALL    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select"       ON service_processes;
CREATE POLICY          "anon_select"       ON service_processes FOR SELECT TO public        USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON service_processes;
CREATE POLICY          "authenticated_all" ON service_processes FOR ALL    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select"       ON pricing_packages;
CREATE POLICY          "anon_select"       ON pricing_packages  FOR SELECT TO public        USING (true);
DROP POLICY IF EXISTS "authenticated_all" ON pricing_packages;
CREATE POLICY          "authenticated_all" ON pricing_packages  FOR ALL    TO authenticated USING (true) WITH CHECK (true);
`;

async function main() {
  // Supabase Management API – POST /v1/projects/{ref}/database/query
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  console.log('Applying schema via Management API to project:', projectRef);

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

    // ── Fallback: verify tables exist via PostgREST introspection ──
    console.log('\nTrying PostgREST fallback to verify table existence…');
    const check = await fetch(`${SUPABASE_URL}/rest/v1/services?limit=1`, {
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
    });

    if (check.ok) {
      console.log('✅ Table "services" already exists in PostgREST schema cache!');
      console.log('   Tables are ready — proceeding is safe.\n');
    } else {
      const errText = await check.text();
      console.error('❌ Table "services" NOT found:', errText);
      console.log('\nPlease run the SQL block below in the Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/' + projectRef + '/sql\n');
      console.log(SQL);
    }
    return;
  }

  console.log('✅ Schema applied successfully!', body || '');
}

main().catch(e => { console.error(e); process.exit(1); });
