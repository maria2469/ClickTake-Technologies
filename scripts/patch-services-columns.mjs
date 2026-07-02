/**
 * patch-services-columns.mjs
 * Adds any columns that may be missing from an older version of the
 * services / pricing_packages tables.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const get = (k) => { const m = envContent.match(new RegExp(`^${k}=(.*)$`, 'm')); return m ? m[1].trim() : null; };

const SUPABASE_URL = get('VITE_SUPABASE_URL');
const SERVICE_KEY  = get('SUPABASE_SERVICE_ROLE_KEY');

// Add columns one-by-one via PATCH / individual REST calls is not possible.
// We'll use the PostgREST RPC if available, otherwise print SQL for manual run.

const ALTER_SQL = `
ALTER TABLE services ADD COLUMN IF NOT EXISTS category_label    TEXT        NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS gradient          TEXT        NOT NULL DEFAULT 'from-cyan-400 via-blue-500 to-violet-600';
ALTER TABLE services ADD COLUMN IF NOT EXISTS glow              TEXT        NOT NULL DEFAULT 'rgba(6,182,212,0.15)';
ALTER TABLE services ADD COLUMN IF NOT EXISTS eyebrow           TEXT        NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS detailed_description TEXT     NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon_name         TEXT        NOT NULL DEFAULT 'Sparkles';
ALTER TABLE services ADD COLUMN IF NOT EXISTS items             JSONB       DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS results           JSONB       DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS differentiators   JSONB       DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS deliverables      JSONB       DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order     INTEGER     DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at        TIMESTAMPTZ DEFAULT now();

ALTER TABLE service_processes ADD COLUMN IF NOT EXISTS step_number INTEGER NOT NULL DEFAULT 1;

ALTER TABLE pricing_packages ADD COLUMN IF NOT EXISTS delivery_days TEXT DEFAULT '';
ALTER TABLE pricing_packages ADD COLUMN IF NOT EXISTS description   TEXT DEFAULT '';
ALTER TABLE pricing_packages ADD COLUMN IF NOT EXISTS features      JSONB DEFAULT '[]';

-- Reload schema cache by notifying PostgREST
NOTIFY pgrst, 'reload schema';
`;

console.log('=== Services Column Patch ===');
console.log('The existing "services" table is missing some columns.');
console.log('Please run the following SQL in your Supabase SQL Editor:');
console.log(`\n  https://supabase.com/dashboard/project/${new URL(SUPABASE_URL).hostname.split('.')[0]}/sql\n`);
console.log('─'.repeat(60));
console.log(ALTER_SQL);
console.log('─'.repeat(60));
console.log('\nAfter running the SQL, re-run: node scripts/seed-services.js\n');
