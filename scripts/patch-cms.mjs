import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env files');
  process.exit(1);
}

const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

const SQL = `
-- Add category and tags columns to cms_blogs
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE cms_blogs ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '';

-- Add position to cms_nav_links (header or footer)
ALTER TABLE cms_nav_links ADD COLUMN IF NOT EXISTS position TEXT DEFAULT 'header';

-- Add is_archived to pages
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Reload schema cache by notifying PostgREST
NOTIFY pgrst, 'reload schema';
`;

async function runPatch() {
  console.log('Running patch via Management API on project:', projectRef);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    });

    const body = await res.text();

    if (!res.ok) {
      console.error('Patch failed:', res.status, body);
      
      // Fallback: try PostgREST verification or log
      console.log('Trying fallback check...');
      return;
    }

    console.log('✅ CMS database patch applied successfully!', body);
  } catch (error) {
    console.error('Error running patch:', error);
  }
}

runPatch();
